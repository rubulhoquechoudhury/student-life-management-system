import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList, getClassDetails, getClassStudents } from '../../redux/sclassRelated/sclassHandle';
import { BottomNavigation, BottomNavigationAction, Box, Container, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const StudentSubjects = () => {

    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user) || {};
    const { userDetails, currentUser, loading, response, error } = userState;

    useEffect(() => {
        console.log('currentUser object:', currentUser);
        if (currentUser?._id) {
            dispatch(getUserDetails(currentUser._id, "Student"));
        }
    }, [dispatch, currentUser?._id]);

    // Fetch branch details and subjects when currentUser is available
    useEffect(() => {
        if (currentUser?.branch?._id) {
            console.log('Fetching branch details for ID:', currentUser.branch._id);
            dispatch(getClassDetails(currentUser.branch._id, "Branch"));
            
            console.log('Fetching subjects for branch ID:', currentUser.branch._id);
            // Try with BranchSubjects instead of ClassSubjects
            dispatch(getSubjectList(currentUser.branch._id, "BranchSubjects"));
            
            // Also fetch students for the branch
            dispatch(getClassStudents(currentUser.branch._id));
        }
    }, [dispatch, currentUser?.branch?._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails && Array.isArray(userDetails) && userDetails.length > 0) {
            setSubjectMarks(userDetails[0]?.examResult || []);
        }
    }, [userDetails])
    
    // Get subjects from the branch state
    const { subjectsList } = useSelector((state) => state.branch) || {};
    
    // Log subjects list for debugging
    useEffect(() => {
        console.log('subjectsList after fetch:', subjectsList);
    }, [subjectsList]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Subject Marks
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Marks</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.map((result, index) => {
                            if (!result || !result.subName || !result.marksObtained) {
                                return null;
                            }
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{result.subName?.subName || 'N/A'}</StyledTableCell>
                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </>
        );
    };

    const renderChartSection = () => {
        return <CustomBarChart chartData={subjectMarks || []} dataKey="marksObtained" />;
    };

    // Get branch details and students from Redux store
    const { branchDetails, branchStudents } = useSelector((state) => state.branch) || {};
    
    // branchDetails may be an array or object, normalize it
    let branch = Array.isArray(branchDetails) ? branchDetails[0] : branchDetails;
    
    // Fallback to currentUser.branch if branch is missing or incomplete
    if (!branch || !branch.branch || !branch.semester) {
        branch = currentUser?.branch || {};
    }
    
    const numberOfSubjects = Array.isArray(subjectsList) ? subjectsList.length : 0;
    const numberOfStudents = Array.isArray(branchStudents) ? branchStudents.length : 0;
    const renderBranchDetailsSection = () => {
        return (
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Branch/Department Details
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Branch/Department: {branch?.branch || 'N/A'} | Semester: {branch?.semester || 'N/A'}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Subjects: {numberOfSubjects}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Students: {numberOfStudents}
                </Typography>
                
                {numberOfSubjects > 0 ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Subjects in this Branch/Department:
                        </Typography>
                        <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                            {Array.isArray(subjectsList) && subjectsList.map((subject, index) => (
                                <Box key={index} sx={{ mb: 1, p: 1, borderBottom: index < subjectsList.length - 1 ? '1px solid #eee' : 'none' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {subject.subName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Subject Code: {subject.subCode || 'N/A'}
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                    </>
                ) : (
                    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: '#fff9e6' }}>
                        <Typography variant="body1" color="warning.main">
                            No subjects have been assigned to this branch yet. Please contact your administrator.
                        </Typography>
                    </Paper>
                )}
            </Container>
        );
    };

    return (
        <>
            {loading || !currentUser ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                        ?
                        (<>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>)
                        :
                        (<>
                            {renderBranchDetailsSection()}
                        </>)
                    }
                </div>
            )}
        </>
    );
};

export default StudentSubjects;