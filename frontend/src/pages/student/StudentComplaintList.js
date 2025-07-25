import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, Typography, Chip, Card, CardContent, Grid, Divider
} from '@mui/material';
import { getStudentComplains } from '../../redux/complainRelated/complainHandle';

const StudentComplaintList = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    if (currentUser && currentUser._id && currentUser.school?._id) {
      dispatch(getStudentComplains(currentUser.school._id, currentUser._id));
    }
  }, [currentUser, dispatch]);
  
  // Filter out any items that are not complaints (e.g., queries)
  const complaints = complainsList?.filter(item => item.type !== 'query') || [];

  if (error) {
    console.log(error);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toString() !== "Invalid Date" ? date.toLocaleDateString() : "Invalid Date";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
        My Complaints
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <>
          {!complaints || complaints.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No complaints found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You haven't submitted any complaints yet.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {complaints.map((complaint) => (
                <Grid item xs={12} md={6} lg={4} key={complaint._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: complaint.resolved ? '2px solid #4caf50' : '2px solid #ff9800',
                      borderRadius: 2,
                      boxShadow: 3
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                          Complaint #{complaint._id.slice(-6)}
                        </Typography>
                        <Chip 
                          label={complaint.resolved ? "Resolved" : "Pending"} 
                          color={complaint.resolved ? "success" : "warning"}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Date:</strong> {formatDate(complaint.date)}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>Subject:</strong> {complaint.subject?.subName || 'General'}
                      </Typography>
                      
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <strong>Complaint:</strong>
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          backgroundColor: '#f5f5f5', 
                          p: 2, 
                          borderRadius: 1,
                          fontStyle: 'italic'
                        }}
                      >
                        {complaint.complaint}
                      </Typography>
                      
                      {complaint.responses && complaint.responses.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                            Responses:
                          </Typography>
                          {complaint.responses.map((response, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                backgroundColor: '#e3f2fd', 
                                p: 2, 
                                borderRadius: 1, 
                                mb: 1 
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {response.teacher?.name || 'Teacher'}:
                              </Typography>
                              <Typography variant="body2">
                                {response.response}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(response.date)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default StudentComplaintList;