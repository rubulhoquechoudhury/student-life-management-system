import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, Paper, Box } from '@mui/material';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <div>Loading...</div>
                </Box>
            ) : (
                <Paper sx={{ width: '100%', p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 3, mt: 2, mb: 2 }}>
                    <Container>
                        <Typography variant="h4" align="center" gutterBottom>
                            Teacher Details
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Teacher Name: {teacherDetails?.name}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Branch/Department: {teacherDetails?.teachBranch?.branch} | Semester: {teacherDetails?.teachBranch?.semester || 'Unknown'}
                        </Typography>
                        {isSubjectNamePresent ? (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Subject Name: {teacherDetails?.teachSubject?.subName}
                                </Typography>
                            </>
                        ) : (
                            <Button variant="contained" onClick={handleAddSubject}>
                                Add Subject
                            </Button>
                        )}
                    </Container>
                </Paper>
            )}
        </>
    );
};

export default TeacherDetails;