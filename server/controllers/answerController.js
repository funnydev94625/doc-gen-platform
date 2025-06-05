const Answer = require('../models/Answer');
const Element = require('../models/Element');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

exports.create_answer = async (req, res) => {
    try {
        const { policy_id, answers } = req.body;
        const answerPromises = answers.map(async answer => {
            const element = await Element.findById(answer.element_id);
            if (!element) {
                throw new Error(`Element not found for id ${answer.element_id}`);
            }
            const newAnswer = new Answer({
                element_id: answer.element_id,
                policy_id,
                answer: answer.answer,
                user_id: req.user.id
            });
            return newAnswer.save();
        });
        const answersCreated = await Promise.all(answerPromises);
        res.json(answersCreated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.get_answers = async (req, res) => {
    try {
        const { policy_id } = req.params;
        const answers = await Answer.find({ policy_id, user_id: req.user.id });
        res.json(answers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.update_answers = async (req, res) => {
    try {
        const { policy_id, answers } = req.body;
        const answerPromises = answers.map(async answer => {
            const element = await Element.findById(answer.element_id);
            if (!element) {
                throw new Error(`Element not found for id ${answer.element_id}`);
            }
            const updatedAnswer = await Answer.findOneAndUpdate(
                { policy_id, element_id: answer.element_id, user_id: req.user.id },
                { answer: answer.answer },
                { new: true, upsert: true }
            );
            return updatedAnswer;
        });
        const answersUpdated = await Promise.all(answerPromises);
        res.json(answersUpdated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
