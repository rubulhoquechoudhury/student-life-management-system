import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography, MenuItem } from '@mui/material';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const StudentQueries = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ subject: '', complaint: '' });

    // Get subjects from the branch state
    const { subjectsList: subjects = [] } = useSelector(state => state.branch) || {};

    const fetchQueries = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${REACT_APP_BASE_URL}/ComplainList/${currentUser?.school?._id}`);
            // Only show queries (not complaints) by this student
            setQueries((res.data || []).filter(q => 
                q.user?._id === currentUser?._id && 
                q.type === 'query'
            ));
        } catch (err) {
            setError('Failed to fetch queries');
        }
        setLoading(false);
    };

    // Fetch subjects for the student's branch
    useEffect(() => {
        if (currentUser?.branch?._id) {
            dispatch(getSubjectList(currentUser.branch._id, "ClassSubjects"));
            console.log('Fetching subjects for branch ID:', currentUser.branch._id);
        }
    }, [dispatch, currentUser?.branch?._id]);

    useEffect(() => {
        if (currentUser?.school?._id) fetchQueries();
    }, [currentUser?.school?._id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.subject || !form.complaint) {
            return;
        }
        try {
            await axios.post(`${REACT_APP_BASE_URL}/ComplainCreate`, {
                user: currentUser?._id,
                date: new Date(),
                complaint: form.complaint,
                subject: form.subject,
                school: currentUser?.school?._id,
                type: 'query',
            });
            setForm({ subject: '', complaint: '' });
            fetchQueries();
        } catch (err) {
            // Optionally handle error
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>Ask a Query / Doubt</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField select label="Subject" name="subject" value={form.subject} onChange={handleChange} fullWidth required>
                            {subjects.map(sub => (
                                <MenuItem key={sub._id} value={sub._id}>{sub.subName}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Your Query/Doubt" name="complaint" value={form.complaint} onChange={handleChange} fullWidth required multiline rows={2} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 600 }}>Submit</Button>
                    </Grid>
                </Grid>
            </form>
            <Box mt={5}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>My Queries & Responses</Typography>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}><CircularProgress /></Box> : error ? <Typography color="error">{error}</Typography> : (
                    <Grid container spacing={3}>
                        {queries.length === 0 ? <Grid item xs={12}><Typography>No queries found.</Typography></Grid> :
                            queries.map(q => (
                                <Grid item xs={12} md={6} key={q._id}>
                                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                        <Typography variant="subtitle1"><b>Subject:</b> {q.subject?.subName || 'N/A'}</Typography>
                                        <Typography variant="body2"><b>Query:</b> {q.complaint}</Typography>
                                        <Typography variant="caption">Asked on: {q.date && new Date(q.date).toLocaleDateString()}</Typography>
                                        <Box mt={1}>
                                            <Typography variant="subtitle2">Responses:</Typography>
                                            {(q.responses || []).length === 0 ? <Typography variant="body2">No response yet.</Typography> :
                                                q.responses.map((r, idx) => (
                                                    <Box key={idx} mb={1}>
                                                        <Typography variant="body2"><b>{r.teacher?.name || 'Teacher'}:</b> {r.response}</Typography>
                                                        <Typography variant="caption">{r.date && new Date(r.date).toLocaleDateString()}</Typography>
                                                    </Box>
                                                ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default StudentQueries; 