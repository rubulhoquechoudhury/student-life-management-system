import React from 'react'
import styled from 'styled-components';
import { Paper, Box, Typography, Avatar, Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const teachBranch = currentUser.teachBranch
  const teachSubject = currentUser.teachSubject
  const teachSchool = currentUser.school

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, mb: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
            {String(currentUser.name).charAt(0)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{currentUser.name}</Typography>
          <Typography variant="subtitle1">Email: {currentUser.email}</Typography>
          <Typography variant="subtitle1">Branch/Department: {teachBranch?.branch}</Typography>
          <Typography variant="subtitle1">Subject: {teachSubject.subName}</Typography>
          <Typography variant="subtitle1">College: {teachSchool.schoolName}</Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default TeacherProfile