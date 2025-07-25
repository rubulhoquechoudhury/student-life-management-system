import { useEffect } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { Paper, Box, Typography, ButtonGroup, Button, Popper, Grow, ClickAwayListener, MenuList, MenuItem } from '@mui/material';
import { BlackButton, BlueButton} from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from 'axios';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const TeacherBranchDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { branchStudents, loading, error, getresponse } = useSelector((state) => state.branch);

    const { currentUser } = useSelector((state) => state.user);
    const branchID = currentUser?.teachBranch?._id
    const subjectID = currentUser?.teachSubject?._id

    useEffect(() => {
        if (branchID) {
            dispatch(getClassStudents(branchID));
        }
    }, [dispatch, branchID])

    if (error) {
        console.log(error)
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = branchStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        // One-click attendance handler
        const markAttendance = async (status) => {
            try {
                await axios.put(`${REACT_APP_BASE_URL}/StudentAttendance/${row.id}`, {
                    subName: subjectID,
                    status,
                    date: new Date()
                });
                // Optionally show a success message or refresh data
            } catch (err) {
                // Optionally handle error
            }
        };
        return (
            <>
                <BlueButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Teacher/class/student/" + row.id)
                    }
                >
                    View
                </BlueButton>
                <Button
                    color="success"
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={() => markAttendance("Present")}
                >
                    Present
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={() => markAttendance("Absent")}
                >
                    Absent
                </Button>
                <BlueButton
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={() => navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)}
                >
                    Provide Marks
                </BlueButton>
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Branch/Department Details
                    </Typography>
                    {getresponse ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                No Students Found
                            </Box>
                        </>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <Typography variant="h5" gutterBottom>
                                Students List:
                            </Typography>

                            {Array.isArray(branchStudents) && branchStudents.length > 0 &&
                                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                            }
                        </Paper>
                    )}
                </>
            )}
        </>
    );
};

export default TeacherBranchDetails;