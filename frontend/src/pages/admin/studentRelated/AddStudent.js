import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllBranches } from '../../../redux/sclassRelated/sclassHandle';
import { Paper, Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { branchesList } = useSelector((state) => state.branch);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('')
    const [branchId, setBranchId] = useState('')
    const [semester, setSemester] = useState('')

    const adminID = currentUser._id
    const role = "Student"
    const attendance = []

    useEffect(() => {
        if (situation === "Branch") {
            setBranchId(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        dispatch(getAllBranches(adminID, "Branch"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        const selectedBranch = branchesList.find(
            (branchItem) => branchItem.branch === event.target.value
        );
        setBranchId(selectedBranch._id);
        setSemester(selectedBranch.semester);
    }

    const fields = { name, rollNum, password, branch: branchId, semester, adminID, role, attendance }

    const submitHandler = (event) => {
        event.preventDefault()
        if (branchId === "") {
            setMessage("Please select a branch/department")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
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
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: 'background.default' }}>
                <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, minWidth: { xs: 320, sm: 400 }, width: '100%', maxWidth: 480 }}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
                        Add Student
                    </Typography>
                    <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            required
                        />
                        {situation === "Student" && (
                            <FormControl required>
                                <InputLabel>Branch/Department</InputLabel>
                                <Select
                                    value={branchId}
                                    label="Branch/Department"
                                    onChange={changeHandler}
                                >
                                    {branchesList.map((branchItem, index) => (
                                        <MenuItem key={index} value={branchItem.branch}>
                                            {branchItem.branch} (Semester: {branchItem.semester})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <TextField
                            label="Roll Number"
                            type="number"
                            value={rollNum}
                            onChange={(event) => setRollNum(event.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loader}
                            sx={{ mt: 2, fontWeight: 600 }}
                        >
                            {loader ? <CircularProgress size={24} color="inherit" /> : 'Add'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddStudent