const Policy = require("../models/Policy");
const Answer = require("../models/Answer"); // Make sure this model exists
const Section = require("../models/Section");
const Blank = require("../models/Blank");

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
        console.log(exist);
        await exist.save();
      } else {
        await Answer.create({ policy_id, user_id, blank_id, answer: ans });
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
