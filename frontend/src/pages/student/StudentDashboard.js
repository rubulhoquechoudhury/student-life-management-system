import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StudentSideBar from './StudentSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout'
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import StudentAssignments from './StudentAssignments';
import StudentTimetable from './StudentTimetable';
import StudentQueries from './StudentQueries';

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar open={open} position='absolute' sx={{
                    background: 'linear-gradient(90deg, #f4f6fa 60%, #e0e7ff 100%)',
                    boxShadow: '0 2px 12px rgba(80, 0, 128, 0.08)',
                }}>
                    <Toolbar sx={{ pr: '24px', minHeight: { xs: 56, sm: 72 } }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Logo/avatar placeholder */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <Box sx={{ width: 36, height: 36, bgcolor: 'primary.main', borderRadius: '50%', mr: 1 }} />
                        </Box>
                        <Typography
                            component="h1"
                            variant="h4"
                            color="primary.main"
                            noWrap
                            sx={{ flexGrow: 1, fontWeight: 700 }}
                        >
                            Student Dashboard
                        </Typography>
                        <AccountMenu />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <StudentSideBar />
                    </List>
                </Drawer>
                <Box component="main" sx={{ ...styles.boxStyled, p: { xs: 2, sm: 4 } }}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<StudentHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Student/dashboard" element={<StudentHomePage />} />
                        <Route path="/Student/profile" element={<StudentProfile />} />

                        <Route path="/Student/subjects" element={<StudentSubjects />} />
                        <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                        <Route path="/Student/complain" element={<StudentComplain />} />
                        <Route path="/Student/assignments" element={<StudentAssignments />} />
                        <Route path="/Student/timetable" element={<StudentTimetable />} />
                        <Route path="/Student/queries" element={<StudentQueries />} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}

export default StudentDashboard

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
}