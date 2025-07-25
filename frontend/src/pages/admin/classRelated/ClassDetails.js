import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList, getBranchDetails, getBranchStudents } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton, Paper
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';

const BranchDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, branchStudents, branchDetails, loading, error, response, getresponse } = useSelector((state) => state.branch);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    const branchID = params.id

    useEffect(() => {
        dispatch(getClassDetails(branchID));
        dispatch(getSubjectList(branchID, "BranchSubjects"))
        dispatch(getClassStudents(branchID));
        dispatch(getAllTeachers(currentUser._id));
    }, [dispatch, branchID, currentUser._id])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getClassStudents(classID));
        //         dispatch(resetSubjects())
        //         dispatch(getSubjectList(classID, "ClassSubjects"))
        //     })
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = Array.isArray(subjectsList) ? subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    }) : [];

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${branchID}/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
            </>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + branchID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(branchID, "SubjectsClass")
        }
    ];

    const BranchSubjectsSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + branchID)}
                        >
                            Add Subjects
                        </GreenButton>
                    </Box>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>
                            Subjects List:
                        </Typography>

                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                }
            </>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = Array.isArray(branchStudents) ? branchStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    }) : [];

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
                {/* Attendance button removed for admin */}
            </>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + branchID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(branchID, "StudentsClass")
        },
    ];

    const BranchStudentsSection = () => {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Students List ({studentRows.length})
                    </Typography>
                    <GreenButton
                        variant="contained"
                        startIcon={<PersonAddAlt1Icon />}
                        onClick={() => navigate("/Admin/class/addstudents/" + branchID)}
                        sx={{ minWidth: 150 }}
                    >
                        Add Student
                    </GreenButton>
                </Box>

                {getresponse ? (
                    <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                            No students enrolled in this class yet.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Click "Add Student" to enroll students in this class.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </>
        )
    }

    const BranchTeachersSection = () => {
        // Filter teachers for this branch
        const branchTeachers = Array.isArray(teachersList)
            ? teachersList.filter(teacher => teacher.teachBranch && teacher.teachBranch._id === branchID)
            : [];
        return (
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Teachers ({branchTeachers.length})
                    </Typography>
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate(`/Admin/teachers/chooseclass?branchId=${branchID}`)}
                    >
                        Add Teacher
                    </GreenButton>
                </Box>
                
                {branchTeachers.length > 0 ? (
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
                        {branchTeachers.map((teacher) => (
                            <Box key={teacher._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {teacher.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Subject: {teacher.teachSubject?.subName || 'No subject assigned'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Email: {teacher.email || 'Not provided'}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                            No teachers assigned to this class/branch yet.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Click "Add Teacher" to assign teachers to this class.
                        </Typography>
                    </Box>
                )}
            </Box>
        )
    }

    const BranchDetailsSection = () => {
        // Show loading if subjectsList or branchStudents are not loaded yet
        if (loading || !Array.isArray(subjectsList) || !Array.isArray(branchStudents)) {
            return <Typography>Loading...</Typography>;
        }
        
        // Only treat as error if getresponse is not "No students found"
        if (getresponse && typeof getresponse === 'string' && getresponse !== 'No students found') {
            return (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom color="error">
                        Branch/Department Details
                    </Typography>
                    <Typography variant="h6" gutterBottom color="error">
                        Error: {getresponse}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                        Please check if the branch ID is correct or contact your administrator.
                    </Typography>
                </Box>
            );
        }
        
        const numberOfSubjects = Array.isArray(subjectsList) ? subjectsList.length : 0;
        const numberOfStudents = Array.isArray(branchStudents) ? branchStudents.length : 0;
        // For teachers:
        const branchTeachers = Array.isArray(teachersList)
            ? teachersList.filter(teacher => teacher.teachBranch && teacher.teachBranch._id === branchID)
            : [];
        const numberOfTeachers = branchTeachers.length;
        // Handle both array and object cases for branchDetails
        const branch = Array.isArray(branchDetails) ? branchDetails[0] : branchDetails;
        const branchName = branch && branch.branch ? branch.branch : 'Not set';
        const semester = branch && branch.semester ? branch.semester : 'Not set';
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Branch/Department Details
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Branch/Department: {branchName} | Semester: {semester}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Subjects: {numberOfSubjects}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Students: {numberOfStudents}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Teachers: {numberOfTeachers}
                </Typography>
                {getresponse &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/branch/addstudents/" + branchID)}
                    >
                        Add Students
                    </GreenButton>
                }
                {response &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/addsubject/" + branchID)}
                    >
                        Add Subjects
                    </GreenButton>
                }
            </>
        );
    }

    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <div>Loading...</div>
                </Box>
            ) : (
                <Paper sx={{ width: '100%', p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 3, mt: 2, mb: 2 }}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 1 }}>
                                <TabList onChange={handleChange}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Subjects" value="2" />
                                    <Tab label="Students" value="3" />
                                    <Tab label="Teachers" value="4" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
                                <TabPanel value="1">
                                    <BranchDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <BranchSubjectsSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <BranchStudentsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <BranchTeachersSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </Paper>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default BranchDetails;