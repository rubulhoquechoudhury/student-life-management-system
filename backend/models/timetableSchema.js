const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branch',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    day: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['class', 'exam'],
        default: 'class',
        required: true
    },
    date: {
        type: Date,
        required: function() {
            return this.type === 'exam';
        }
    },
    description: {
        type: String
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('timetable', timetableSchema); 