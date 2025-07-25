import React, { useEffect, useState } from "react";
import { Paper, Box, Typography, TextField, Button, CircularProgress, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", semester: "" }]);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id
    const adminID = currentUser._id
    const address = "Subject"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };



    const handleSemesterChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].semester = event.target.value;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", semester: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        branch: sclassName, // <-- move branch to top level
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            semester: subject.semester,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: 'background.default' }}>
            <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, minWidth: { xs: 320, sm: 400 }, width: '100%', maxWidth: 600 }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
                    Add Subjects
                </Typography>
                <Box component="form" onSubmit={submitHandler}>
                    <Grid container spacing={2}>
                        {subjects.map((subject, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Subject Name"
                                        variant="outlined"
                                        value={subject.subName}
                                        onChange={handleSubjectNameChange(index)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Subject Code"
                                        variant="outlined"
                                        value={subject.subCode}
                                        onChange={handleSubjectCodeChange(index)}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Semester"
                                        variant="outlined"
                                        value={subject.semester || ""}
                                        onChange={handleSemesterChange(index)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="flex-end" gap={2}>
                                        {index === 0 ? (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={handleAddSubject}
                                            >
                                                Add Subject
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={handleRemoveSubject(index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </React.Fragment>
                        ))}
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end">
                                <Button variant="contained" color="primary" type="submit" disabled={loader}>
                                    {loader ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
}

export default SubjectForm;