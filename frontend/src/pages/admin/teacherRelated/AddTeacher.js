import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material';
import { Paper, Box, Typography, TextField, Button } from '@mui/material';

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id
  console.log('subjectID:', subjectID);

  const { status, response, error } = useSelector(state => state.user);
  // Fix: get subjectDetails and subloading from the correct slice (branch)
  const { subjectDetails, subloading, error: sclassError } = useSelector((state) => state.branch || {});
  console.log('subjectDetails:', subjectDetails);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  const role = "Teacher"
  const school = subjectDetails && subjectDetails.school
  const teachSubject = subjectDetails && subjectDetails._id
  const teachBranch = subjectDetails && subjectDetails.branch && subjectDetails.branch._id;
  const fields = { name, email, password, role, school, teachSubject, teachBranch };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    console.log('TEACHER REGISTER FIELDS:', fields); // Add this log to verify teachBranch
    console.log('SUBMIT HANDLER CALLED'); // Add this line
    dispatch(registerUser(fields, role));
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      navigate("/Admin/teachers")
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

  // Fix: Only allow form submission if subjectDetails is loaded
  const canSubmit = subjectDetails && subjectDetails._id && !subloading;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: 'background.default' }}>
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, minWidth: { xs: 320, sm: 400 }, width: '100%', maxWidth: 480 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
          Add Teacher
        </Typography>
        {/* Show loading spinner while subjectDetails is loading */}
        {subloading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : sclassError ? (
          <Typography color="error" sx={{ textAlign: 'center', my: 2 }}>
            Failed to load subject details. Please try again later.
          </Typography>
        ) : !subjectDetails || !subjectDetails._id ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', my: 2 }}>
            No subject details found.
          </Typography>
        ) : (
          <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Subject: {subjectDetails && subjectDetails.subName ? subjectDetails.subName : "N/A"}
              {" "}
              {(() => {
                const semester = subjectDetails && (subjectDetails.semester || (subjectDetails.sclassName && subjectDetails.sclassName.semester));
                return semester ? `(Semester: ${semester})` : '';
              })()}
            </Typography>
            {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                Class: {subjectDetails.sclassName.sclassName}
              </Typography>
            )}
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
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
              disabled={loader || !canSubmit}
              sx={{ mt: 2, fontWeight: 600 }}
            >
              {loader ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </Box>
        )}
      </Paper>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  )
}

export default AddTeacher