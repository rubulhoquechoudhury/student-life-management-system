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
import TeacherSideBar from './TeacherSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Logout from '../Logout'
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';

import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import TeacherAssignments from './TeacherAssignments';
import TeacherQueries from './TeacherQueries';

const TeacherDashboard = () => {
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
                            Teacher Dashboard
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
                        <TeacherSideBar />
                    </List>
                </Drawer>
                <Box component="main" sx={{ ...styles.boxStyled, p: { xs: 2, sm: 4 } }}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<TeacherHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                        <Route path="/Teacher/profile" element={<TeacherProfile />} />

                        <Route path="/Teacher/complain" element={<TeacherComplain />} />
                        <Route path="/Teacher/assignments" element={<TeacherAssignments />} />
                        <Route path="/Teacher/queries" element={<TeacherQueries />} />

                        <Route path="/Teacher/class" element={<TeacherClassDetails />} />
                        <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />

                        <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                        <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}

export default TeacherDashboard

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