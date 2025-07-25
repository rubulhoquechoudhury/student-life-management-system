import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { Paper, Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Popup from '../../../components/Popup';

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const [targetRole, setTargetRole] = useState('All');
  const adminID = currentUser._id

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID, targetRole };
  const address = "Notice"

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/notices');
      dispatch(underControl())
    } else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: 'background.default' }}>
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, minWidth: { xs: 320, sm: 400 }, width: '100%', maxWidth: 480 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
          Add Notice
        </Typography>
        <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <TextField
            label="Details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            required
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth>
            <InputLabel id="targetRole-label">Target Audience</InputLabel>
            <Select
              labelId="targetRole-label"
              value={targetRole}
              label="Target Audience"
              onChange={e => setTargetRole(e.target.value)}
              required
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Student">Students</MenuItem>
              <MenuItem value="Teacher">Teachers</MenuItem>
            </Select>
          </FormControl>
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
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default AddNotice;