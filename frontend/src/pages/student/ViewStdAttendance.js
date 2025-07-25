import React, { useEffect, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button, Collapse, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)

    // Calculate overall attendance percentage directly from attendance data
    const totalPresent = subjectAttendance.filter(att => att.status === "Present").length;
    const totalAbsent = subjectAttendance.filter(att => att.status === "Absent").length;
    const totalAttendance = totalPresent + totalAbsent;
    const overallAttendancePercentage = totalAttendance > 0 ? (totalPresent / totalAttendance) * 100 : 0;

    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Attendance
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Present</StyledTableCell>
                            <StyledTableCell>Absent</StyledTableCell>
                            <StyledTableCell>Attendance Percentage</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    {Object.entries(attendanceBySubject).map(([subName, { present, absent, allData, subId, sessions }], index) => {
                        // Calculate attendance percentage based on actual present and absent counts
                        const totalClasses = present + absent;
                        const subjectAttendancePercentage = totalClasses > 0 ? ((present / totalClasses) * 100).toFixed(2) : 0;

                        return (
                            <TableBody key={index}>
                                <StyledTableRow>
                                    <StyledTableCell>{subName}</StyledTableCell>
                                    <StyledTableCell>{present}</StyledTableCell>
                                    <StyledTableCell>{absent}</StyledTableCell>
                                    <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button variant="contained"
                                            onClick={() => handleOpen(subId)}>
                                            {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Attendance Details
                                                </Typography>
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <StyledTableRow>
                                                            <StyledTableCell>Date</StyledTableCell>
                                                            <StyledTableCell align="right">Status</StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {allData.map((data, index) => {
                                                            const date = new Date(data.date);
                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                            return (
                                                                <StyledTableRow key={index}>
                                                                    <StyledTableCell component="th" scope="row">
                                                                        {dateString}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                </StyledTableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        )
                    }
                    )}
                </Table>
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" gutterBottom>Overall Attendance Summary</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 1 }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Present</Typography>
                            <Typography variant="h6" color="success.main">{totalPresent}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Absent</Typography>
                            <Typography variant="h6" color="error.main">{totalAbsent}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Total Classes</Typography>
                            <Typography variant="h6">{totalAttendance}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Attendance Percentage</Typography>
                            <Typography variant="h6" color={overallAttendancePercentage >= 75 ? "success.main" : "warning.main"}>
                                {overallAttendancePercentage.toFixed(2)}%
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </>
        )
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                        renderTableSection()
                    ) : (
                        <Typography variant="h6" gutterBottom component="div">
                            Currently You Have No Attendance Details
                        </Typography>
                    )}
                </div>
            )}
        </>
    )
}

export default ViewStdAttendance