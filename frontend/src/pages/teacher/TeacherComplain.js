import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const TeacherComplain = () => {
  const navigate = useNavigate();

  // Redirect teachers away from complaints page - they should only see queries
  useEffect(() => {
    // Redirect to queries page
    navigate('/Teacher/queries');
  }, [navigate]);

  // This component will redirect, but showing a message just in case
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h6" color="text.secondary">
        Redirecting to Queries...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Teachers can only access student queries, not complaints.
      </Typography>
    </Box>
  );
}

export default TeacherComplain