const Branch = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

const branchCreate = async (req, res) => {
    try {
        const branch = new Branch({
            branch: req.body.branch,
            semester: req.body.semester,
            school: req.body.adminID
        });

        const existingBranch = await Branch.findOne({
            branch: req.body.branch,
            semester: req.body.semester,
            school: req.body.adminID
        });

        if (existingBranch) {
            res.send({ message: 'Sorry this branch and semester already exists' });
        }
        else {
            const result = await branch.save();
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const branchList = async (req, res) => {
    try {
        let branches = await Branch.find({ school: req.params.id })
        if (branches.length > 0) {
            res.send(branches)
        } else {
            res.send({ message: "No branches found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getBranchDetail = async (req, res) => {
    try {
        let branch = await Branch.findById(req.params.id);
        if (branch) {
            branch = await branch.populate("school", "schoolName")
            res.send(branch);
        }
        else {
            res.send({ message: "No branch found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const getBranchStudents = async (req, res) => {
    try {
        let students = await Student.find({ branch: req.params.id })
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteBranch = async (req, res) => {
    try {
        const deletedBranch = await Branch.findByIdAndDelete(req.params.id);
        if (!deletedBranch) {
            return res.send({ message: "Branch not found" });
        }
        const deletedStudents = await Student.deleteMany({ branch: req.params.id });
        const deletedSubjects = await Subject.deleteMany({ branch: req.params.id });
        const deletedTeachers = await Teacher.deleteMany({ teachBranch: req.params.id });
        res.send(deletedBranch);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteBranches = async (req, res) => {
    try {
        const deletedBranches = await Branch.deleteMany({ school: req.params.id });
        if (deletedBranches.deletedCount === 0) {
            return res.send({ message: "No branches found to delete" });
        }
        const deletedStudents = await Student.deleteMany({ school: req.params.id });
        const deletedSubjects = await Subject.deleteMany({ school: req.params.id });
        const deletedTeachers = await Teacher.deleteMany({ school: req.params.id });
        res.send(deletedBranches);
    } catch (error) {
        res.status(500).json(error);
    }
}


module.exports = { branchCreate, branchList, deleteBranch, deleteBranches, getBranchDetail, getBranchStudents };