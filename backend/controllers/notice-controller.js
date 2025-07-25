const Notice = require('../models/noticeSchema.js');

const noticeCreate = async (req, res) => {
    try {
        const notice = new Notice({
            ...req.body,
            school: req.body.adminID,
            targetRole: req.body.targetRole || 'All'
        })
        const result = await notice.save()
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        const filter = { school: req.params.id };
        if (req.query.targetRole) filter.targetRole = { $in: ['All', req.query.targetRole] };
        let notices = await Notice.find(filter)
        if (notices.length > 0) {
            res.send(notices)
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };