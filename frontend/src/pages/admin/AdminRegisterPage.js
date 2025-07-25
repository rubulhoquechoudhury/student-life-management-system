import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../../assets/designlogin.jpg"
import { LightPurpleButton } from '../../components/buttonStyles';
import { registerUser } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import Popup from '../../components/Popup';

const AdminRegisterPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [adminNameError, setAdminNameError] = useState(false);
    const [collegeNameError, setCollegeNameError] = useState(false);
    const role = "Admin"

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = event.target.adminName.value;
        const schoolName = event.target.collegeName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!name || !schoolName || !email || !password) {
            if (!name) setAdminNameError(true);
            if (!schoolName) setCollegeNameError(true);
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        const fields = { name, email, password, role, schoolName }
        setLoader(true)
        dispatch(registerUser(fields, role))
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'adminName') setAdminNameError(false);
        if (name === 'collegeName') setCollegeNameError(false);
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            console.log(error)
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={8} square sx={{ borderRadius: 4, display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        my: { xs: 4, sm: 8 },
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 2, color: 'primary.main', fontWeight: 700, textAlign: 'center' }}>
                        Register as Admin
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, textAlign: 'center' }}>
                        Register your own College and manage students, faculty, and administration from a single dashboard.
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1, width: '100%', px: { xs: 0, sm: 2 } }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            name="adminName"
                            error={adminNameError}
                            helperText={adminNameError && 'Name is required'}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="College Name"
                            name="collegeName"
                            error={collegeNameError}
                            helperText={collegeNameError && 'College name is required'}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            error={emailError}
                            helperText={emailError && 'Email is required'}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={toggle ? 'text' : 'password'}
                            error={passwordError}
                            helperText={passwordError && 'Password is required'}
                            onChange={handleInputChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setToggle(!toggle)}>
                                            {toggle ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <LightPurpleButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
                        >
                            {loader ? <CircularProgress size={24} color="inherit" /> : "Register"}
                        </LightPurpleButton>

                        <Grid container justifyContent="center" alignItems="center">
                            <Typography variant="body2" sx={{ mr: 1 }}>
                                Already have an account?
                            </Typography>
                            <StyledLink to="/Adminlogin">Log in</StyledLink>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${bgpic})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Grid>
    );
}

export default AdminRegisterPage

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #7f56da;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;