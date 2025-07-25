const Complain = require('../models/complainSchema.js');
const Student = require('../models/studentSchema.js');

const complainCreate = async (req, res) => {
    try {
        const complain = new Complain(req.body)
        const result = await complain.save()
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
};

const complainList = async (req, res) => {
    try {
        let complains = await Complain.find({ school: req.params.id })
            .populate("user", "name branch")
            .populate("subject", "subName")
            .populate("responses.teacher", "name");
        if (complains.length > 0) {
            res.send(complains)
        } else {
            res.send({ message: "No complains found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Get complains/queries for a specific teacher's branch
 * This endpoint filters complains by the branch ID to ensure teachers
 * only see queries from students in their assigned branch
 */
const getTeacherComplains = async (req, res) => {
    try {
        const { schoolId, branchId } = req.params;
        
        if (!branchId) {
            return res.status(400).json({ message: "Branch ID is required" });
        }
        
        // First get all complains for the school
        let complains = await Complain.find({ school: schoolId })
            .populate("user", "name branch")
            .populate("subject", "subName")
            .populate("responses.teacher", "name");
            
        if (!complains || complains.length === 0) {
            return res.send({ message: "No complains found" });
        }
        
        // Get all students in the specified branch
        const branchStudents = await Student.find({ branch: branchId }, { _id: 1 });
        const branchStudentIds = branchStudents.map(student => student._id.toString());
        
        // Filter complains to only include those from students in the teacher's branch
        const branchComplains = complains.filter(complain => 
            complain.user && 
            branchStudentIds.includes(complain.user._id.toString())
        );
        
        if (branchComplains.length > 0) {
            res.send(branchComplains);
        } else {
            res.send({ message: "No complains found for this branch" });
        }
    } catch (error) {
        console.error("Error in getTeacherComplains:", error);
        res.status(500).json(error);
    }
};

const respondToComplain = async (req, res) => {
    try {
        const { complainId } = req.params;
        const { teacher, response, teacherBranchId } = req.body;
        
        // Get the complain
        const complain = await Complain.findById(complainId).populate("user", "branch");
        if (!complain) return res.status(404).json({ message: 'Complain not found' });
        
        // If teacherBranchId is provided, verify the complain belongs to a student in the teacher's branch
        if (teacherBranchId) {
            // Get the student who made the complain
            const student = await Student.findById(complain.user);
            
            // Check if student exists and belongs to the teacher's branch
            if (!student || student.branch.toString() !== teacherBranchId) {
                return res.status(403).json({ 
                    message: 'You can only respond to queries from students in your branch'
                });
            }
        }
        
        // Add the response
        complain.responses.push({ teacher, response });
        await complain.save();
        res.json({ message: 'Response added' });
    } catch (error) {
        res.status(500).json(error);
    }
};

const resolveComplain = async (req, res) => {
    try {
        const { resolved } = req.body;
        const complain = await Complain.findByIdAndUpdate(
            req.params.complainId,
            { resolved },
            { new: true }
        );
        if (!complain) return res.status(404).json({ message: 'Complain not found' });
        res.json({ message: 'Complain resolved status updated', resolved: complain.resolved });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { complainCreate, complainList, getTeacherComplains, respondToComplain, resolveComplain };
