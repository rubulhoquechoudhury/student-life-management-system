import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments, submitAssignment } from '../../redux/assignmentRelated/assignmentHandle';
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import Popup from '../../components/Popup';

const StudentAssignments = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { assignmentsList, loading, error, submissionStatus } = useSelector(state => state.assignment || {});
    const [form, setForm] = useState({}); // { [assignmentId]: { text: '', file: null } }
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (currentUser?.branch?._id) {
            dispatch(fetchAssignments({ branch: currentUser.branch._id }));
            console.log('Fetching assignments for branch:', currentUser.branch._id);
        } else {
            console.log('Student branch not found:', currentUser);
        }
    }, [dispatch, currentUser?.branch?._id]);

    const handleChange = (assignmentId, e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [assignmentId]: {
                ...form[assignmentId],
                [name]: files ? files[0] : value,
            },
        });
    };

    const handleSubmit = async (assignmentId, e) => {
        e.preventDefault();
        
        // Validate that at least text or file is provided
        if (!form[assignmentId]?.text && !form[assignmentId]?.file) {
            setMessage('Please provide either text or a file for your submission');
            setShowPopup(true);
            return;
        }
        
        // Check if student ID is available
        if (!currentUser?._id) {
            setMessage('User information is missing. Please try logging in again.');
            setShowPopup(true);
            return;
        }
        
        try {
            // Create submission data
            const fields = {
                student: currentUser._id,
                text: form[assignmentId]?.text || '',
                file: form[assignmentId]?.file || null,
            };
            
            console.log('Preparing to submit assignment:', {
                assignmentId,
                studentId: fields.student,
                hasText: !!fields.text,
                hasFile: !!fields.file
            });
            
            // Check if this student has already submitted this assignment
            const existingSubmission = assignmentsList.find(a => 
                a._id === assignmentId && 
                a.submissions?.some(s => s.student === currentUser._id)
            );
            
            if (existingSubmission) {
                setMessage('You have already submitted this assignment.');
                setShowPopup(true);
                return;
            }
            
            // Submit the assignment
            try {
                const result = await dispatch(submitAssignment(assignmentId, fields));
                console.log('Submission result:', result);
                setMessage('Assignment submitted successfully!');
                setForm({ ...form, [assignmentId]: { text: '', file: null } });
                
                // Refresh the assignments list to show updated status
                if (currentUser?.branch?._id) {
                    dispatch(fetchAssignments({ branch: currentUser.branch._id }));
                }
            } catch (submitError) {
                console.error('Submission error:', submitError);
                if (submitError.response?.data?.message === 'Already submitted') {
                    setMessage('You have already submitted this assignment.');
                } else {
                    setMessage(`Submission failed: ${submitError.response?.data?.message || submitError.message || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Error in submission process:', error);
            setMessage(`Submission process failed: ${error.message || 'Unknown error'}`);
        }
        
        setShowPopup(true);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>Assignments</Typography>
            <Popup open={showPopup} setOpen={setShowPopup} message={message} />
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}><CircularProgress /></Box> : error ? <Typography color="error">{error}</Typography> : (
                <Grid container spacing={3}>
                    {assignmentsList && assignmentsList.length > 0 ? assignmentsList.map(ass => (
                        <Grid item xs={12} md={6} key={ass._id}>
                            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{ass.title}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>Due: {ass.dueDate && ass.dueDate.substring(0, 10)}</Typography>
                                <Typography variant="body2">Subject: {ass.subject?.subName}</Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>{ass.description}</Typography>
                                
                                {/* Check if student has already submitted this assignment */}
                                {ass.submissions?.some(sub => sub.student === currentUser._id) ? (
                                    <Box sx={{ 
                                        p: 2, 
                                        bgcolor: 'success.light', 
                                        borderRadius: 1, 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        mt: 2
                                    }}>
                                        <Typography variant="subtitle1" color="success.dark" sx={{ fontWeight: 600 }}>
                                            ✓ Assignment Submitted
                                        </Typography>
                                        <Typography variant="body2" color="success.dark">
                                            You have already submitted this assignment.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <form onSubmit={e => handleSubmit(ass._id, e)} style={{ marginTop: 16 }}>
                                        <TextField
                                            label="Your Answer (optional)"
                                            name="text"
                                            value={form[ass._id]?.text || ''}
                                            onChange={e => handleChange(ass._id, e)}
                                            fullWidth
                                            multiline
                                            rows={2}
                                            sx={{ mb: 1 }}
                                        />
                                        <input
                                            type="file"
                                            name="file"
                                            accept=".pdf,.doc,.docx,.jpg,.png,.jpeg,.txt,.zip,.rar"
                                            onChange={e => handleChange(ass._id, e)}
                                            style={{ marginBottom: 8 }}
                                        />
                                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 600 }}>
                                            Submit Assignment
                                        </Button>
                                        {submissionStatus === 'success' && <Typography color="success.main">Submitted!</Typography>}
                                        {submissionStatus === 'failed' && <Typography color="error">Submission failed. Try again.</Typography>}
                                    </form>
                                )}
                            </Paper>
                        </Grid>
                    )) : <Grid item xs={12}><Typography>No assignments found.</Typography></Grid>}
                </Grid>
            )}
        </Box>
    );
};

export default StudentAssignments; 