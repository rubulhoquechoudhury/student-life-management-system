import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Paper, Typography } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(120deg, #f4f6fa 60%, #e0e7ff 100%)',
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <img src={Students} alt="students" style={{ width: '100%', height: 'auto', maxWidth: 420 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, bgcolor: 'background.paper' }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, fontSize: { xs: '2rem', sm: '2.8rem' }, lineHeight: 1.2 }}>
                                Welcome to<br />College Management<br />System
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.15rem' }, mb: 3 }}>
                                Manage attendance, assignments, feedback, and communication from one place. A smart solution for students, teachers, and administrators.
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                <StyledLink to="/choose">
                                    <LightPurpleButton variant="contained" fullWidth size="large">
                                        Login
                                    </LightPurpleButton>
                                </StyledLink>
                                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                                    Don't have an account?{' '}
                                    <Link to="/Adminregister" style={{ color: '#550080', fontWeight: 600 }}>
                                        Sign up
                                    </Link>
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Homepage;

// Styled Components
const StyledContainer = styled(Container)`
  height: 100vh;
  display: flex;
  align-items: center;
`;

const StyledPaper = styled.div`
  padding: 32px 24px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  border-radius: 16px;
  background-color: #fff;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  margin-top: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 2.8rem;
  color: #252525;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.3;
`;

const StyledText = styled.p`
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
`;

const SignupText = styled.p`
  font-size: 0.95rem;
  text-align: center;
  margin-top: 16px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;