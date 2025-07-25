import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Paper, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import styled from "styled-components";

const AddBranch = () => {
    const [branch, setBranch] = useState("");
    const [semester, setSemester] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error, tempDetails } = userState;

    const adminID = currentUser._id
    const address = "Sclass"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        branch,
        semester,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes")
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
    }, [status, navigate, error, response, dispatch, tempDetails]);
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: 'background.default' }}>
                <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, minWidth: { xs: 320, sm: 400 }, width: '100%', maxWidth: 480 }}>
                    <Stack sx={{ alignItems: 'center', mb: 3 }}>
                        <img
                            src={Classroom}
                            alt="classroom"
                            style={{ width: '80%' }}
                        />
                    </Stack>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
                        Add Branch/Department
                    </Typography>
                    <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Branch/Department"
                            value={branch}
                            onChange={(event) => setBranch(event.target.value)}
                            required
                        />
                        <TextField
                            label="Semester"
                            value={semester}
                            onChange={(event) => setSemester(event.target.value)}
                            required
                        />
                        <Button
                            fullWidth
                            size="large"
                            sx={{ mt: 3, fontWeight: 600 }}
                            variant="contained"
                            type="submit"
                            disabled={loader}
                        >
                            {loader ? <CircularProgress size={24} color="inherit" /> : "Create"}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Go Back
                        </Button>
                    </Box>
                </Paper>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddBranch

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 550px;
  padding: 50px 3rem 50px;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  border-radius: 4px;
`;