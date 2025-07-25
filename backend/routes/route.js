const router = require('express').Router();

const { getHealthStatus, getDatabaseStatus } = require('../controllers/health-controller.js');
const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin-controller.js');

const { branchCreate, branchList, deleteBranch, deleteBranches, getBranchDetail, getBranchStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList, getTeacherComplains, respondToComplain, resolveComplain } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance } = require('../controllers/student_controller.js');
const { subjectCreate, classSubjects, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects } = require('../controllers/subject-controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeachersByClass, deleteTeacher, updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.js');
const { 
    createAssignment, 
    getAssignments, 
    submitAssignment, 
    getSubmissions, 
    deleteAssignment,
    upload 
} = require('../controllers/assignment-controller');
const { 
    createTimetable, 
    getTimetables, 
    updateTimetable, 
    deleteTimetable 
} = require('../controllers/timetable-controller');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get("/Admin/:id", getAdminDetail)

// Student

router.post('/StudentReg', studentRegister);
router.post('/StudentLogin', studentLogIn)

router.get("/Students/:id", getStudents)
router.get("/Student/:id", getStudentDetail)

router.delete("/Students/:id", deleteStudents)
router.delete("/Student/:id", deleteStudent)

router.put("/Student/:id", updateStudent)

router.put('/UpdateExamResult/:id', updateExamResult)

router.put('/StudentAttendance/:id', studentAttendance)

router.put('/RemoveAllStudentsSubAtten/:id', clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);

router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance)

// Teacher

router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn)

router.get("/Teachers/:id", getTeachers)
router.get("/Teacher/:id", getTeacherDetail)

router.delete("/Teachers/:id", deleteTeachers)
router.delete("/TeachersClass/:id", deleteTeachersByClass)
router.delete("/Teacher/:id", deleteTeacher)

router.put("/TeacherSubject", updateTeacherSubject)

router.post('/TeacherAttendance/:id', teacherAttendance)

// Notice

router.post('/NoticeCreate', noticeCreate);

router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices)
router.delete("/Notice/:id", deleteNotice)

router.put("/Notice/:id", updateNotice)

// Complain

router.post('/ComplainCreate', complainCreate);

router.get('/ComplainList/:id', complainList);
router.get('/TeacherComplainList/:schoolId/:branchId', getTeacherComplains);
router.post('/ComplainRespond/:complainId', respondToComplain);
router.patch('/ComplainResolve/:complainId', resolveComplain);

// Sclass

router.post('/SclassCreate', branchCreate);

router.get('/SclassList/:id', branchList);
router.get('/BranchList/:id', branchList);
router.get("/Sclass/:id", getBranchDetail)
router.get("/Branch/:id", getBranchDetail)

router.get("/Sclass/Students/:id", getBranchStudents)

router.delete("/Sclasses/:id", deleteBranches)
router.delete("/Sclass/:id", deleteBranch)

// Subject

router.post('/SubjectCreate', subjectCreate);

router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/BranchSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get("/Subject/:id", getSubjectDetail)

router.delete("/Subject/:id", deleteSubject)
router.delete("/Subjects/:id", deleteSubjects)

// Assignment
router.post('/AssignmentCreate', createAssignment);
router.get('/Assignments', getAssignments);
router.post('/AssignmentSubmit/:assignmentId', upload.single('file'), submitAssignment);
router.get('/AssignmentSubmissions/:assignmentId', getSubmissions);
router.delete('/Assignment/:assignmentId', deleteAssignment);

// Timetable
router.post('/TimetableCreate', createTimetable);
router.get('/Timetables', getTimetables);
router.put('/Timetable/:id', updateTimetable);
router.delete('/Timetable/:id', deleteTimetable);

// Health Check
router.get('/health', getHealthStatus);
router.get('/health/database', getDatabaseStatus);

module.exports = router;