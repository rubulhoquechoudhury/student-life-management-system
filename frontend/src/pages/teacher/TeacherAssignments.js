import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments, createAssignment, deleteAssignment, fetchSubmissions } from '../../redux/assignmentRelated/assignmentHandle';
import { 
    Box, Button, CircularProgress, Grid, Paper, TextField, Typography, 
    MenuItem, IconButton, Alert, List, ListItem, ListItemText, 
    Divider, Chip, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { Delete as DeleteIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import Popup from '../../components/Popup';

const TeacherAssignments = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { assignmentsList, loading, error } = useSelector(state => state.assignment || {});
    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        subject: '',
        branch: '',
    });
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [profileChecked, setProfileChecked] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false);

    // Check if teacher has required data for assignment creation
    const subjects = currentUser?.teachSubject ? [{ _id: currentUser?.teachSubject._id, subName: currentUser?.teachSubject.subName }] : [];
    const classes = currentUser?.teachBranch ? [{ _id: currentUser.teachBranch._id, sclassName: currentUser.teachBranch.branch }] : [];
    
    // Check if teacher profile is incomplete
    const isTeacherProfileIncomplete = !currentUser?.teachSubject || !currentUser?.teachBranch;

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(fetchAssignments({ teacher: currentUser._id }));
            
            // Log teacher profile data for debugging
            console.log('Teacher profile data:', {
                teacherId: currentUser._id,
                teachSubject: currentUser.teachSubject,
                teachBranch: currentUser.teachBranch
            });
            
            setProfileChecked(true);
        }
    }, [dispatch, currentUser?._id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.dueDate || !form.subject || !form.branch) {
            setMessage('All fields are required');
            setShowPopup(true);
            return;
        }
        
        // Additional validation for subject and branch
        if (!currentUser?.teachSubject || !currentUser?.teachBranch) {
            setMessage('Your teacher profile is missing required subject or class information. Please contact your administrator.');
            setShowPopup(true);
            return;
        }
        
        const fields = {
            ...form,
            teacher: currentUser?._id,
            school: currentUser?.school?._id,
        };
        
        try {
            const result = await dispatch(createAssignment(fields));
            console.log('Assignment creation result:', result);
            if (!result?.error) {
                setMessage('Assignment created successfully!');
                setForm({ title: '', description: '', dueDate: '', subject: '', branch: '' });
                // Refresh the assignments list
                dispatch(fetchAssignments({ teacher: currentUser._id }));
            } else {
                const errorMessage = typeof result.error === 'string' ? result.error : 
                                   result.error?.message || 'Failed to create assignment. Please try again.';
                setMessage(errorMessage);
            }
        } catch (error) {
            setMessage(`Error creating assignment: ${error.message}`);
        }
        setShowPopup(true);
    };

    const handleDelete = async (assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            const result = await dispatch(deleteAssignment(assignmentId));
            if (result?.success) {
                setMessage('Assignment deleted successfully!');
                // Refresh the assignments list
                dispatch(fetchAssignments({ teacher: currentUser._id }));
            } else {
                setMessage('Failed to delete assignment. Please try again.');
            }
            setShowPopup(true);
        }
    };
    
    const handleViewSubmissions = async (assignmentId) => {
        try {
            setSubmissionsLoading(true);
            setSelectedAssignment(assignmentId);
            
            // Find the assignment in the list to display its title
            const assignment = assignmentsList.find(a => a._id === assignmentId);
            
            // Fetch submissions for this assignment
            const result = await dispatch(fetchSubmissions(assignmentId));
            
            if (result && !result.error) {
                setSubmissions(result);
                setShowSubmissionsDialog(true);
            } else {
                setMessage('Failed to load submissions. Please try again.');
                setShowPopup(true);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setMessage('Failed to load submissions: ' + (error.message || 'Unknown error'));
            setShowPopup(true);
        } finally {
            setSubmissionsLoading(false);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>Create Assignment</Typography>
            
            {/* Display warning if teacher profile is incomplete */}
            {isTeacherProfileIncomplete && (
                <Alert 
                    severity="warning" 
                    sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'warning.main' }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Profile Incomplete
                    </Typography>
                    <Typography variant="body2">
                        Your teacher profile is missing required information. Please contact your administrator to assign you a subject and class before creating assignments.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Missing: {!currentUser?.teachSubject && 'Subject'} {!currentUser?.teachSubject && !currentUser?.teachBranch && ', '} {!currentUser?.teachBranch && 'Class/Branch'}
                    </Typography>
                </Alert>
            )}
            
            {/* Display warning if profile was checked but no data was found */}
            {profileChecked && subjects.length === 0 && classes.length === 0 && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 3 }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Assignment Creation Not Available
                    </Typography>
                    <Typography variant="body2">
                        You cannot create assignments because your teacher profile is missing required subject and class information.
                        Please contact your administrator to update your profile.
                    </Typography>
                </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required multiline rows={3} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            select 
                            label="Subject" 
                            name="subject" 
                            value={form.subject} 
                            onChange={handleChange} 
                            fullWidth 
                            required
                            disabled={isTeacherProfileIncomplete}
                            error={subjects.length === 0}
                            helperText={subjects.length === 0 ? "No subject assigned to you" : ""}
                        >
                            {subjects.map(sub => (
                                <MenuItem key={sub._id} value={sub._id}>{sub.subName}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            select 
                            label="Class" 
                            name="branch" 
                            value={form.branch} 
                            onChange={handleChange} 
                            fullWidth 
                            required
                            disabled={isTeacherProfileIncomplete}
                            error={classes.length === 0}
                            helperText={classes.length === 0 ? "No class assigned to you" : ""}
                        >
                            {classes.map(cls => (
                                <MenuItem key={cls._id} value={cls._id}>{cls.sclassName}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            sx={{ fontWeight: 600 }}
                            disabled={isTeacherProfileIncomplete}
                        >
                            Create Assignment
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Popup open={showPopup} setOpen={setShowPopup} message={message} />
            <Box mt={5}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>My Assignments</Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {typeof error === 'string' ? error : error?.message || 'An error occurred loading assignments'}
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {assignmentsList && assignmentsList.length > 0 ? assignmentsList.map(ass => (
                            <Grid item xs={12} md={6} key={ass._id}>
                                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, position: 'relative' }}>
                                    <IconButton
                                        onClick={() => handleDelete(ass._id)}
                                        sx={{ position: 'absolute', top: 8, right: 8, color: 'error.main' }}
                                        size="small"
                                        title="Delete assignment"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 5 }}>{ass.title}</Typography>
                                    <Typography variant="body2">Due: {ass.dueDate && ass.dueDate.substring(0, 10)}</Typography>
                                    <Typography variant="body2">Subject: {ass.subject?.subName || 'Not specified'}</Typography>
                                    {ass.branch && <Typography variant="body2">Class: {ass.branch?.sclassName || ass.branch?.branch || 'Not specified'}</Typography>}
                                    <Typography variant="body2" sx={{ mb: 2 }}>{ass.description}</Typography>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<AssignmentIcon />}
                                        size="small"
                                        onClick={() => handleViewSubmissions(ass._id)}
                                        sx={{ mt: 1 }}
                                    >
                                        View Submissions {ass.submissions?.length > 0 && `(${ass.submissions.length})`}
                                    </Button>
                                </Paper>
                            </Grid>
                        )) : (
                            <Grid item xs={12}>
                                <Typography>No assignments found.</Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>
            
            {/* Dialog to display submissions */}
            <Dialog 
                open={showSubmissionsDialog} 
                onClose={() => setShowSubmissionsDialog(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Assignment Submissions
                    {selectedAssignment && (
                        <Typography variant="subtitle2" color="text.secondary">
                            {assignmentsList.find(a => a._id === selectedAssignment)?.title}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent dividers>
                    {submissionsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : submissions.length === 0 ? (
                        <Typography variant="body1" sx={{ p: 2 }}>No submissions yet.</Typography>
                    ) : (
                        <List>
                            {submissions.map((submission, index) => (
                                <React.Fragment key={submission._id || index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle1">
                                                        {submission.student?.name || 'Unknown Student'}
                                                        {submission.student?.rollNum && ` (Roll: ${submission.student.rollNum})`}
                                                    </Typography>
                                                    <Chip 
                                                        size="small" 
                                                        label={new Date(submission.submittedAt).toLocaleDateString()} 
                                                        color="primary" 
                                                        variant="outlined" 
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    {submission.text && (
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                            sx={{ display: 'block', mt: 1, mb: 1 }}
                                                        >
                                                            {submission.text}
                                                        </Typography>
                                                    )}
                                                    {submission.fileUrl && (
                                                        <Button 
                                                            variant="outlined" 
                                                            size="small" 
                                                            component="a" 
                                                            href={`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}${submission.fileUrl}`}
                                                            target="_blank"
                                                            sx={{ mt: 1 }}
                                                        >
                                                            View Attachment
                                                        </Button>
                                                    )}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < submissions.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSubmissionsDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeacherAssignments; 