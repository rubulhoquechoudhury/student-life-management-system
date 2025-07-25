const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
}, { timestamps: true });

module.exports = mongoose.model("branch", sclassSchema);

