const mongoose = require('mongoose')

const AnswerSchema = mongoose.Schema({
    element_id: {
        type: mongoose.Types.ObjectId,
        ref: "Element",
        required: true
    }, 
    policy_id: {
        type: mongoose.Types.ObjectId,
        ref: "Policy",
        required: true
    },
    answer: {
        type: String,
        default: "",
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Answer', AnswerSchema)