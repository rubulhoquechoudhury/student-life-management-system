const Assignment = require('../models/assignmentSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const Branch = require('../models/sclassSchema');
const Subject = require('../models/subjectSchema');
const path = require('path');

// Improved error handling for multer dependency
let multer;
try {
    multer = require('multer');
} catch (error) {
    console.error('Error loading multer module. Please install it using: npm install multer');
    console.error('Original error:', error);
    // Provide a mock implementation to prevent application crash
    multer = {
        diskStorage: () => ({}),
        memoryStorage: () => ({}),
        single: () => (req, res, next) => next(),
        array: () => (req, res, next) => next(),
        fields: () => (req, res, next) => next(),
        none: () => (req, res, next) => next(),
    };
}

// Multer setup for file uploads with security measures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/assignments/');
    },
    filename: function (req, file, cb) {
        // Sanitize filename to prevent directory traversal attacks
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, Date.now() + '-' + sanitizedFilename);
    }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
    // Define allowed file types
    const allowedFileTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];
    
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, and GIF files are allowed.'), false);
    }
};

// Configure multer with storage, file filter, and size limits
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
        files: 1 // Maximum 1 file per upload
    }
});

exports.upload = upload;

// Teacher creates assignment
exports.createAssignment = async (req, res) => {
    try {
        const assignment = new Assignment({ ...req.body });
        const result = await assignment.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get assignments for a branch/subject (for students/teachers)
exports.getAssignments = async (req, res) => {
    try {
        const { branch, subject, teacher } = req.query;
        const filter = {};
        if (branch) filter.branch = branch;
        if (subject) filter.subject = subject;
        if (teacher) filter.teacher = teacher;
        const assignments = await Assignment.find(filter).populate('teacher', 'name').populate('subject', 'subName').populate('branch', 'branch semester');
        res.json(assignments);
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).json({ message: err.message });
    }
};

// Student submits assignment (fileUrl or text)
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { student, text } = req.body;
        let fileUrl = null;
        
        // Handle file upload if present
        if (req.file) {
            // Validate file exists and was accepted by multer
            if (!req.file.filename) {
                return res.status(400).json({ message: 'File upload failed. Please try again.' });
            }
            fileUrl = path.join('/uploads/assignments/', req.file.filename);
        }
        
        // Validate required fields
        if (!student) {
            return res.status(400).json({ message: 'Student ID is required' });
        }
        
        // If neither file nor text is provided, return error
        if (!fileUrl && !text) {
            return res.status(400).json({ message: 'Either file or text submission is required' });
        }
        
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        
        // Prevent duplicate submissions by same student
        const alreadySubmitted = assignment.submissions.some(sub => sub.student.toString() === student);
        if (alreadySubmitted) return res.status(400).json({ message: 'Already submitted' });
        
        // Add submission to assignment
        assignment.submissions.push({ student, fileUrl, text });
        await assignment.save();
        
        res.json({ message: 'Submission successful' });
    } catch (err) {
        console.error('Error submitting assignment:', err);
        res.status(500).json({ message: 'An error occurred while submitting the assignment' });
    }
};

// Teacher views submissions for an assignment
exports.getSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId).populate('submissions.student', 'name rollNum');
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json(assignment.submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Teacher deletes assignment
exports.deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        
        await Assignment.findByIdAndDelete(assignmentId);
        res.json({ message: 'Assignment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 