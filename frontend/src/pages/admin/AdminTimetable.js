import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimetables, createTimetable, updateTimetable, deleteTimetable } from '../../redux/timetableRelated/timetableHandle';
import { getAllBranches, getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Popup from '../../components/Popup';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AdminTimetable = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { timetables, loading, error, status } = useSelector(state => state.timetable || {});
    const { branchesList } = useSelector(state => state.branch);
    const { subjectsList } = useSelector(state => state.branch);
    const { teachersList } = useSelector(state => state.teacher);
    
    const [form, setForm] = useState({
        branch: '',
        subject: '',
        teacher: '',
        day: '',
        startTime: '',
        endTime: '',
        type: 'class',
        date: '',
        description: '',
    });
    const [editId, setEditId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const schoolId = currentUser.school?._id || currentUser._id;
        if (schoolId) {
            dispatch(fetchTimetables({ school: schoolId }));
            dispatch(getAllBranches(schoolId, "Branch"));
            dispatch(getAllTeachers(schoolId));
        }
    }, [dispatch, currentUser, status]);

    // Fetch subjects when a branch is selected
    useEffect(() => {
        if (form.branch) {
            dispatch(getSubjectList(form.branch, "BranchSubjects"));
        }
    }, [dispatch, form.branch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.branch || !form.subject || !form.teacher || !form.day || !form.startTime || !form.endTime) {
            setMessage('All fields except description are required');
            setShowPopup(true);
            return;
        }

        // Validate date for exams
        if (form.type === 'exam' && !form.date) {
            setMessage('Date is required for exam entries');
            setShowPopup(true);
            return;
        }

        // Validate time range
        if (form.startTime >= form.endTime) {
            setMessage('End time must be after start time');
            setShowPopup(true);
            return;
        }

        // Check for time conflicts (optional - basic check)
        const existingEntries = timetables?.filter(entry => 
            entry.branch?._id === form.branch && 
            entry.day === form.day && 
            entry._id !== editId
        ) || [];

        const hasConflict = existingEntries.some(entry => {
            return (form.startTime < entry.endTime && form.endTime > entry.startTime);
        });

        if (hasConflict) {
            setMessage('Time conflict detected with existing schedule');
            setShowPopup(true);
            return;
        }

        const fields = {
            ...form,
            school: currentUser.school?._id || currentUser._id,
        };
        
        if (editId) {
            dispatch(updateTimetable(editId, fields));
            setMessage('Timetable updated successfully!');
        } else {
            dispatch(createTimetable(fields));
            setMessage('Timetable created successfully!');
        }
        setShowPopup(true);
        setForm({ branch: '', subject: '', teacher: '', day: '', startTime: '', endTime: '', type: 'class', date: '', description: '' });
        setEditId(null);
    };

    const handleEdit = (entry) => {
        setForm({
            branch: entry.branch?._id || '',
            subject: entry.subject?._id || '',
            teacher: entry.teacher?._id || '',
            day: entry.day || '',
            startTime: entry.startTime || '',
            endTime: entry.endTime || '',
            type: entry.type || 'class',
            date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : '',
            description: entry.description || '',
        });
        setEditId(entry._id);
    };

    const handleDelete = (id) => {
        dispatch(deleteTimetable(id));
        setMessage('Timetable deleted!');
        setShowPopup(true);
    };

    // Group timetables by branch and day
    const grouped = {};
    (timetables || []).forEach(entry => {
        const branchName = entry.branch?.branch ? `${entry.branch.branch} - ${entry.branch.semester || ''}` : 'Unknown';
        if (!grouped[branchName]) grouped[branchName] = {};
        if (!grouped[branchName][entry.day]) grouped[branchName][entry.day] = [];
        grouped[branchName][entry.day].push(entry);
    });

    return (
        <Box p={3}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>Manage Timetables</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField select label="Branch/Class" name="branch" value={form.branch} onChange={handleChange} fullWidth required>
                            {Array.isArray(branchesList) ? branchesList.map(branch => (
                                <MenuItem key={branch._id} value={branch._id}>
                                    {branch.branch} - {branch.semester}
                                </MenuItem>
                            )) : []}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select label="Subject" name="subject" value={form.subject} onChange={handleChange} fullWidth required>
                            {Array.isArray(subjectsList) ? subjectsList.map(subject => (
                                <MenuItem key={subject._id} value={subject._id}>{subject.subName}</MenuItem>
                            )) : []}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select label="Teacher" name="teacher" value={form.teacher} onChange={handleChange} fullWidth required>
                            {Array.isArray(teachersList) ? teachersList.map(teacher => (
                                <MenuItem key={teacher._id} value={teacher._id}>{teacher.name}</MenuItem>
                            )) : []}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField select label="Day" name="day" value={form.day} onChange={handleChange} fullWidth required>
                            {daysOfWeek.map(day => (
                                <MenuItem key={day} value={day}>{day}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <TextField label="Start Time" name="startTime" type="time" value={form.startTime} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <TextField label="End Time" name="endTime" type="time" value={form.endTime} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField select label="Type" name="type" value={form.type} onChange={handleChange} fullWidth required>
                            <MenuItem value="class">Class</MenuItem>
                            <MenuItem value="exam">Exam</MenuItem>
                        </TextField>
                    </Grid>
                    {form.type === 'exam' && (
                        <Grid item xs={12} sm={2}>
                            <TextField 
                                label="Exam Date" 
                                name="date" 
                                type="date" 
                                value={form.date} 
                                onChange={handleChange} 
                                fullWidth 
                                required={form.type === 'exam'}
                                InputLabelProps={{ shrink: true }} 
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={form.type === 'exam' ? 2 : 3}>
                        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={6} sm={1}>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 600 }}>{editId ? 'Update' : 'Add'}</Button>
                    </Grid>
                    {editId && (
                        <Grid item xs={6} sm={1}>
                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                fullWidth 
                                onClick={() => {
                                    setForm({ branch: '', subject: '', teacher: '', day: '', startTime: '', endTime: '', type: 'class', date: '', description: '' });
                                    setEditId(null);
                                }}
                                sx={{ fontWeight: 600 }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </form>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            <Box mt={5}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>All Timetables</Typography>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}><CircularProgress /></Box> : error ? <Typography color="error">{error}</Typography> : (
                    Object.keys(grouped).length === 0 ? <Typography>No timetables found.</Typography> :
                        Object.entries(grouped).map(([className, days]) => (
                            <Box key={className} mb={3}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}><b>Class: {className}</b></Typography>
                                <Grid container spacing={1}>
                                    {daysOfWeek.map(day => (
                                        <Grid item xs={12} sm={6} md={4} key={day}>
                                            <Paper sx={{ p: 2, mb: 1, borderRadius: 2, boxShadow: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{day}</Typography>
                                                {(days[day] || []).length === 0 ? <Typography variant="body2">No entries</Typography> :
                                                    days[day].map(entry => (
                                                        <Box key={entry._id} display="flex" alignItems="center" justifyContent="space-between">
                                                            <Box>
                                                                <Typography variant="body2">{entry.subject?.subName} ({entry.type})</Typography>
                                                                <Typography variant="body2">{entry.startTime} - {entry.endTime}</Typography>
                                                                {entry.type === 'exam' && entry.date && (
                                                                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                                                        Date: {new Date(entry.date).toLocaleDateString()}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="body2">Teacher: {entry.teacher?.name}</Typography>
                                                                {entry.description && <Typography variant="caption">{entry.description}</Typography>}
                                                            </Box>
                                                            <Box>
                                                                <IconButton onClick={() => handleEdit(entry)} size="small"><EditIcon fontSize="small" /></IconButton>
                                                                <IconButton onClick={() => handleDelete(entry._id)} size="small"><DeleteIcon fontSize="small" /></IconButton>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ))
                )}
            </Box>
        </Box>
    );
};

export default AdminTimetable; 