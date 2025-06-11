const Policy = require("../models/Policy");
const Answer = require("../models/Answer"); // Make sure this model exists
const Section = require("../models/Section");
const Blank = require("../models/Blank");
const Template = require("../models/Template");
const previewDoc = require("../utils/preview");

exports.create_policy = async (req, res) => {
  try {
    const { template_id } = req.body;
    const policy = new Policy({
      template_id,
      user_id: req.user.id,
    });
    await policy.save();
    res.json(policy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.get_all_policies = async (req, res) => {
  try {
    // Populate template_id to get title and description
    const policies = await Policy.find({ user_id: req.user.id }).populate(
      "template_id",
      "title description"
    );
    // Map to include template title and description in result
    const result = policies.map((policy) => ({
      ...policy.toObject(),
      template_id: policy.template_id?._id || "",
      template_title: policy.template_id?.title || "",
      template_description: policy.template_id?.description || "",
    }));
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.get_one_policy = async (req, res) => {
  try {
    const policy_id = req.params.policy_id;
    const policy = await Policy.findById(policy_id).populate("template_id");
    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    // Aggregate sections with blanks and answers (use "answers" collection, not "policyanswers")
    const sections = await Section.aggregate([
      { $match: { template_id: policy.template_id._id } },
      {
        $lookup: {
          from: "blanks",
          let: { sectionId: "$_id", templateId: "$template_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$template_id", "$$templateId"] },
                    { $eq: ["$section_id", "$$sectionId"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "answers", // <-- use "answers" collection
                let: { blankId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$policy_id", policy._id] },
                          { $eq: ["$blank_id", "$$blankId"] },
                        ],
                      },
                    },
                  },
                  { $project: { answer: 1, _id: 0 } },
                ],
                as: "answer",
              },
            },
            {
              $addFields: {
                answer: { $arrayElemAt: ["$answer.answer", 0] },
              },
            },
          ],
          as: "blanks",
        },
      },
    ]);

    res.json({
      ...policy.toObject(),
      sections,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.update_policy = async (req, res) => {
  try {
    console.log(req.user.id)
    const { answers } = req.body;
    const policy_id = req.body.policy_id || req.params.policy_id;
    const user_id = req.user.id;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "answers must be an array" });
    }

    for (const ans of answers) {
      const { blank_id, answer } = ans;
      if (!blank_id) continue;

      const exist = await Answer.findOne({
        policy_id,
        user_id,
        blank_id,
      });
      if (exist) {
        exist.answer = answer;
        await exist.save();
      } else {
        await Answer.create({ policy_id, user_id, blank_id, answer }); // <-- FIXED HERE
      }
    }

    res.json({ message: "Answers updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.delete_policy = async (req, res) => {
  try {
    const policy_id = req.params.policy_id;
    const policy = await Policy.findByIdAndDelete(policy_id);
    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    res.json({ message: "Policy deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.preview_policy = async (req, res) => {
  try {
    const { policy_id } = req.params;

    // 1. Find the policy and get template_id
    const policy = await Policy.findById(policy_id);
    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    // 2. Find the template and get docx
    const template = await Template.findById(policy.template_id);
    if (!template || !template.docx) {
      return res.status(404).json({ error: "Template or template file not found" });
    }

    // 3. Get all blanks for this template
    // 4. Get all answers for this policy
    // Run both queries in parallel for speed
    const [blanks, answers] = await Promise.all([
      Blank.find({ template_id: template._id }),
      Answer.find({ policy_id }),
    ]);

    // 5. Build a Map for answers for O(1) lookup
    const answerMap = new Map();
    for (const ans of answers) {
      answerMap.set(String(ans.blank_id), ans.answer);
    }

    // 6. Build replaces object: { [blank.question]: answer or "______" }
    const replaces = {};
    for (const blank of blanks) {
      replaces[blank.placeholder] = answerMap.get(String(blank._id)) || "______";
    }

    // 7. Generate the preview PDF
    const { pdfPath } = await previewDoc('uploads/policies/' + template.docx, replaces, policy.user_id);

    // 8. Serve the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=policy_preview.pdf');

    const fs = require('fs');
    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);

    // Optionally delete the PDF after streaming
    stream.on('close', () => {
      fs.unlink(pdfPath, () => {});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

