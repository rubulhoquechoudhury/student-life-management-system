import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';

const SideBar = () => {
    const location = useLocation();
    return (
        <>
            <React.Fragment>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon>
                        <Tooltip title="Home"><HomeIcon color={location.pathname === ("/" || "/Admin/dashboard") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/classes">
                    <ListItemIcon>
                        <Tooltip title="Classes"><ClassOutlinedIcon color={location.pathname.startsWith('/Admin/classes') ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Classes" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/subjects">
                    <ListItemIcon>
                        <Tooltip title="Subjects"><AssignmentIcon color={location.pathname.startsWith("/Admin/subjects") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Subjects" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/timetable">
                    <ListItemIcon>
                        <Tooltip title="Timetable"><AssignmentIcon color={location.pathname.startsWith("/Admin/timetable") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Timetable" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/teachers">
                    <ListItemIcon>
                        <Tooltip title="Teachers"><SupervisorAccountOutlinedIcon color={location.pathname.startsWith("/Admin/teachers") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Teachers" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/students">
                    <ListItemIcon>
                        <Tooltip title="Students"><PersonOutlineIcon color={location.pathname.startsWith("/Admin/students") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Students" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/notices">
                    <ListItemIcon>
                        <Tooltip title="Notices"><AnnouncementOutlinedIcon color={location.pathname.startsWith("/Admin/notices") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Notices" />
                </ListItemButton>
                <ListItemButton component={Link} to="/Admin/complains">
                    <ListItemIcon>
                        <Tooltip title="Complains"><ReportIcon color={location.pathname.startsWith("/Admin/complains") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Complains" />
                </ListItemButton>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
                <ListSubheader component="div" inset>
                    User
                </ListSubheader>
                <ListItemButton component={Link} to="/Admin/profile">
                    <ListItemIcon>
                        <Tooltip title="Profile"><AccountCircleOutlinedIcon color={location.pathname.startsWith("/Admin/profile") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton component={Link} to="/logout">
                    <ListItemIcon>
                        <Tooltip title="Logout"><ExitToAppIcon color={location.pathname.startsWith("/logout") ? 'primary' : 'inherit'} /></Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </React.Fragment>
        </>
    )
}

export default SideBar
