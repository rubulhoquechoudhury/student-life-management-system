const Timetable = require('../models/timetableSchema');

// Create a timetable entry
exports.createTimetable = async (req, res) => {
    try {
        const timetable = new Timetable({ ...req.body });
        const result = await timetable.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get timetables (optionally filter by branch, teacher, school, type, day)
exports.getTimetables = async (req, res) => {
    try {
        const { branch, teacher, school, type, day } = req.query;
        const filter = {};
        if (branch) filter.branch = branch;
        if (teacher) filter.teacher = teacher;
        if (school) filter.school = school;
        if (type) filter.type = type;
        if (day) filter.day = day;
        const timetables = await Timetable.find(filter)
            .populate('branch', 'branch')
            .populate('subject', 'subName')
            .populate('teacher', 'name')
            .sort({ day: 1, startTime: 1 });
        res.json(timetables);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a timetable entry
exports.updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Timetable.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Timetable not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a timetable entry
exports.deleteTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Timetable.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Timetable not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 