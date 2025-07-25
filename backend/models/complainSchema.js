const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    response: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const complainSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['complaint', 'query'],
        default: 'complaint'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    responses: [responseSchema],
    resolved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("complain", complainSchema);