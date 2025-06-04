const Answer = require('../models/Answer');
const Element = require('../models/Element');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
// Get all answers for a policy
exports.getAnswers = async (req, res) => {
    try {
        const { policy_id } = req.params;
        const policyId = new ObjectId(policy_id)
        const answers = await Answer.aggregate([
            // Match answers for the given policy
            { $match: { policy_id: policyId } },
            // Lookup to join with elements collection
            {
                $lookup: {
                    from: 'elements',
                    localField: 'element_id',
                    foreignField: '_id',
                    as: 'element'
                }
            },
            // Unwind the element array (since lookup returns an array)
            { $unwind: '$element' },
            // Project to shape the output
            {
                $project: {
                    _id: 1,
                    policy_id: 1,
                    element_id: 1,
                    answer: 1,
                    user: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    element: {
                        _id: 1,
                        template_id: 1,
                        type: 1,
                        question: 1,
                        placeholder: 1,
                        isDel: 1,
                        section_id: 1,
                        answer_result: 1
                    }
                }
            }
        ]);
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single answer
exports.getAnswer = async (req, res) => {
    try {
        const { policy_id, element_id } = req.params;
        const answer = await Answer.findOne({ policy_id, element_id });
        
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        
        res.status(200).json(answer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or Update answers
exports.createOrUpdateAnswers = async (req, res) => {
    try {
        const { policy_id } = req.params;
        const answers = req.body;

        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers must be an array' });
        }

        const results = await Promise.all(
            answers.map(async ({ element_id, answer }) => {
                // Find existing answer
                const existingAnswer = await Answer.findOne({ policy_id, element_id });

                if (existingAnswer) {
                    // Update existing answer
                    existingAnswer.answer = answer;
                    return existingAnswer.save();
                } else {
                    // Create new answer
                    const newAnswer = new Answer({
                        policy_id,
                        element_id,
                        answer,
                        user: req.user.id
                    });
                    return newAnswer.save();
                }
            })
        );

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an answer
exports.deleteAnswer = async (req, res) => {
    try {
        const { policy_id, element_id } = req.params;
        const answer = await Answer.findOneAndDelete({ policy_id, element_id });
        
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        
        res.status(200).json({ message: 'Answer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete all answers for a policy
exports.deleteAllAnswers = async (req, res) => {
    try {
        const { policy_id } = req.params;
        await Answer.deleteMany({ policy_id });
        res.status(200).json({ message: 'All answers deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
