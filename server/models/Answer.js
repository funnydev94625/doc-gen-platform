const mongoose = require('mongoose')

const AnswerSchema = mongoose.Schema({
    blank_id: {
        type: mongoose.Types.ObjectId,
        ref: "Blank",
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
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Answer', AnswerSchema)