const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subName: {
        type: String,
        required: true,
    },
    subCode: {
        type: String,
        required: true,
    },

    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branch',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
    },
    semester: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("subject", subjectSchema);