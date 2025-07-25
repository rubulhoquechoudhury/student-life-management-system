import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography, Alert } from '@mui/material';
import Popup from '../../components/Popup';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const TeacherQueries = () => {
    const { currentUser } = useSelector(state => state.user);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseForm, setResponseForm] = useState({}); // { [queryId]: responseText }
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [noBranchAssigned, setNoBranchAssigned] = useState(false);

    const fetchQueries = async () => {
        setLoading(true);
        setError(null);
        setNoBranchAssigned(false);
        
        // Check if teacher has a branch assigned
        if (!currentUser?.teachBranch?._id) {
            setNoBranchAssigned(true);
            setLoading(false);
            return;
        }
        
        try {
            // Use the new endpoint that filters queries by branch
            const res = await axios.get(
                `${REACT_APP_BASE_URL}/TeacherComplainList/${currentUser?.school?._id}/${currentUser?.teachBranch?._id}`
            );
            
            // Check if we got an actual array or an error message
            if (Array.isArray(res.data)) {
                setQueries(res.data.filter(q => q.type === 'query'));
            } else {
                setQueries([]);
            }
        } catch (err) {
            console.error("Error fetching queries:", err);
            setError('Failed to fetch queries');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (currentUser?.school?._id) fetchQueries();
    }, [currentUser?.school?._id, currentUser?.teachBranch?._id]);

    const handleResponseChange = (id, value) => {
        setResponseForm({ ...responseForm, [id]: value });
    };

    const handleResponseSubmit = async (id) => {
        if (!responseForm[id]) {
            setMessage('Response cannot be empty');
            setShowPopup(true);
            return;
        }
        try {
            // Include the teacher's branch ID for verification
            await axios.post(`${REACT_APP_BASE_URL}/ComplainRespond/${id}`, {
                teacher: currentUser?._id,
                response: responseForm[id],
                teacherBranchId: currentUser?.teachBranch?._id
            });
            setMessage('Response submitted!');
            setShowPopup(true);
            setResponseForm({ ...responseForm, [id]: '' });
            fetchQueries();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to submit response';
            setMessage(errorMsg);
            setShowPopup(true);
        }
    };

    return (
        <Box p={3}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
                    Student Queries & Doubts
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Respond to student questions and academic inquiries here. All student communications are handled through this interface.
                </Typography>
            </Box>
            <Popup open={showPopup} setOpen={setShowPopup} message={message} />
            
            {noBranchAssigned && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    You don't have a branch assigned to your profile. Please contact an administrator to assign you to a branch before you can view and respond to student queries.
                </Alert>
            )}
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Grid container spacing={3}>
                    {queries.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography>
                                {noBranchAssigned 
                                    ? "You need to be assigned to a branch to view student queries." 
                                    : "No queries found from students in your branch."}
                            </Typography>
                        </Grid>
                    ) : (
                        queries.map(q => (
                            <Grid item xs={12} md={6} key={q._id}>
                                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                    <Typography variant="subtitle1"><b>Student:</b> {q.user?.name || 'N/A'}</Typography>
                                    <Typography variant="subtitle2"><b>Subject:</b> {q.subject?.subName || 'N/A'}</Typography>
                                    <Typography variant="body2"><b>Query:</b> {q.complaint}</Typography>
                                    <Typography variant="caption">Asked on: {q.date && new Date(q.date).toLocaleDateString()}</Typography>
                                    <Box mt={1}>
                                        <Typography variant="subtitle2">Responses:</Typography>
                                        {(q.responses || []).length === 0 ? <Typography variant="body2">No response yet.</Typography> :
                                            q.responses.map((r, idx) => (
                                                <Box key={idx} mb={1}>
                                                    <Typography variant="body2"><b>{r.teacher?.name || 'You'}:</b> {r.response}</Typography>
                                                    <Typography variant="caption">{r.date && new Date(r.date).toLocaleDateString()}</Typography>
                                                </Box>
                                            ))}
                                    </Box>
                                    <Box mt={2}>
                                        <TextField
                                            label="Your Response"
                                            value={responseForm[q._id] || ''}
                                            onChange={e => handleResponseChange(q._id, e.target.value)}
                                            fullWidth
                                            multiline
                                            rows={2}
                                            sx={{ mb: 1 }}
                                        />
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            sx={{ fontWeight: 600 }} 
                                            onClick={() => handleResponseSubmit(q._id)}
                                            disabled={!currentUser?.teachBranch?._id}
                                        >
                                            Submit Response
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}
        </Box>
    );
};

export default TeacherQueries; 