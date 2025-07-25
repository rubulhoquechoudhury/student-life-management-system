const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    fileUrl: {
        type: String,
    },
    text: {
        type: String,
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branch',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    submissions: [submissionSchema]
}, { timestamps: true });

module.exports = mongoose.model('assignment', assignmentSchema); 