import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllBranches } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import { Paper } from '@mui/material';

const ShowBranches = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  // Get all data from Redux
  const { branchesList, loading, error, getresponse } = useSelector((state) => state.branch);
  const { subjectsList } = useSelector((state) => state.branch);
  const { teachersList } = useSelector((state) => state.teacher);
  const { studentsList } = useSelector((state) => state.student);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllBranches(adminID, "Branch"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    // console.log(deleteID);
    // console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.")
    // setShowPopup(true)
    dispatch(deleteUser(deleteID, address))
      .then(() => {
        dispatch(getAllBranches(adminID, "Branch"));
      })
  }

  const branchColumns = [
    { id: 'branch', label: 'Branch/Department', minWidth: 120 },
    { id: 'semester', label: 'Semester', minWidth: 100 },
  ]

  const branchRows = branchesList && branchesList.length > 0 && branchesList.map((branch) => {
    return {
      branch: branch.branch,
      semester: branch.semester,
      id: branch._id,
    };
  })

  // Helper to count items for a branch
  const getCount = (list, branchId, field = 'branch') => {
    if (!Array.isArray(list)) return 0;
    return list.filter(item => {
      if (!item[field]) return false;
      if (typeof item[field] === 'object') {
        return item[field]._id === branchId;
      }
      return item[field] === branchId;
    }).length;
  };

  // Branch summary cards
  const BranchSummary = ({ branch }) => {
    const numSubjects = getCount(subjectsList, branch._id, 'branch');
    const numStudents = getCount(studentsList, branch._id, 'branch');
    const numTeachers = getCount(teachersList, branch._id, 'teachBranch');
    return (
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <Box>
          <strong>Branch/Department Details</strong>
        </Box>
        <Box>Branch/Department: {branch.branch} | Semester: {branch.semester}</Box>
        <Box>Number of Subjects: {numSubjects}</Box>
        <Box>Number of Students: {numStudents}</Box>
        <Box>Number of Teachers: {numTeachers}</Box>
      </Paper>
    );
  };

  const BranchButtonHaver = ({ row }) => {
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Teacher', action: () => navigate("/Admin/teachers/chooseclass?branchId=" + row.id) },
    ];
    return (
      <ButtonContainer>
        <IconButton onClick={() => deleteHandler(row.id, "Sclass")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton variant="contained"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}>
          View
        </BlueButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Students & Subjects">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <h5>Add</h5>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action) => (
            <MenuItem onClick={action.action}>
              <ListItemIcon fontSize="small">
                {action.icon}
              </ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Branch',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Branches',
      action: () => deleteHandler(adminID, "Branches")
    },
  ];

  return (
    <>
      {loading ?
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <div>Loading...</div>
        </Box>
        :
        <>
          {getresponse ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")}>Add Class</GreenButton>
            </Box>
            :
            <>
              {/* Branch summary cards */}
              <Paper sx={{ width: '100%', overflow: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 3, minHeight: 320 }}>
                {Array.isArray(branchesList) && branchesList.length > 0 ? (
                  <TableTemplate buttonHaver={BranchButtonHaver} columns={branchColumns} rows={branchRows} />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                    No branches found.
                  </Box>
                )}
                <SpeedDialTemplate actions={actions} />
              </Paper>
            </>
          }
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

    </>
  );
};

export default ShowBranches;

const styles = {
  styledPaper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;