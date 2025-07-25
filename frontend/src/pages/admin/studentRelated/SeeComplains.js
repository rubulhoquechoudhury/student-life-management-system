import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, Checkbox, Chip
} from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';
import Popup from '../../../components/Popup';
import axios from 'axios';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const SeeComplains = () => {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user);
  
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch only actual complaints (not queries)
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 200 },
    { id: 'date', label: 'Date', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  // Filter out queries and only show actual complaints
  const filteredComplaints = complainsList && complainsList.length > 0 ? 
    complainsList.filter(complain => complain.type !== 'query') : [];
    
  const complainRows = filteredComplaints.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      user: complain.user?.name || "Unknown",
      complaint: complain.complaint,
      date: dateString,
      status: complain.resolved ? (
        <Chip label="Resolved" color="success" size="small" />
      ) : (
        <Chip label="Pending" color="warning" size="small" />
      ),
      id: complain._id,
      resolved: complain.resolved || false,
    };
  });

  const ComplainButtonHaver = ({ row }) => {
    // Use the resolved status from the row data directly
    const [resolved, setResolved] = React.useState(row.resolved || false);
    
    // Update local state when row data changes
    React.useEffect(() => {
      setResolved(row.resolved || false);
    }, [row.resolved]);
    
    const handleResolve = async (event) => {
      const checked = event.target.checked;
      setResolved(checked);
      try {
        await axios.patch(`${REACT_APP_BASE_URL}/ComplainResolve/${row.id}`, { resolved: checked });
        // Show success message and refresh the list
        setMessage(checked ? 'Complaint marked as resolved!' : 'Complaint marked as pending!');
        setShowPopup(true);
        // Refresh the complaints list to get updated data
        dispatch(getAllComplains(currentUser._id, "Complain"));
      } catch (err) {
        setResolved(!checked); // revert if error
        setMessage('Failed to update complaint status');
        setShowPopup(true);
      }
    };
    return (
      <>
        <Checkbox {...label} checked={resolved} onChange={handleResolve} />
      </>
    );
  };

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {response ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              No Complains Right Now
            </Box>
            :
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {Array.isArray(complainsList) && complainsList.length > 0 &&
                <TableTemplate buttonHaver={ComplainButtonHaver} columns={complainColumns} rows={complainRows} />
              }
            </Paper>
          }
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default SeeComplains;