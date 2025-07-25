import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton, Tooltip
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowSubjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.branch);
    const { currentUser } = useSelector(state => state.user)

    // Debug: Log the subjectsList received from the backend
    console.log("subjectsList from backend:", subjectsList);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            dispatch(getSubjectList(currentUser._id, "AllSubjects"));
        }
    }, [currentUser, dispatch]);

    if (error) {
        console.log(error);
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
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            })
    }

    const subjectColumns = [
        { id: 'subName', label: 'Sub Name', minWidth: 170 },
        { id: 'subCode', label: 'Subject Code', minWidth: 120 },
        { id: 'branch', label: 'Branch/Department', minWidth: 170 },
        { id: 'semester', label: 'Semester', minWidth: 100 },
    ]

    const subjectRows = Array.isArray(subjectsList) ? subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            subCode: subject.subCode,
            branch: subject.branch?.branch || subject.branch, // Show branch name if populated, else fallback
            semester: subject.semester, // Get semester from subject, not branch
            id: subject._id,
        };
    }) : [];

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <Tooltip title="Delete Subject">
                    <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="View Subject">
                    <BlueButton variant="contained"
                        onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                        View
                    </BlueButton>
                </Tooltip>
            </>
        );
    };

    const actions = [
        {
            icon: <Tooltip title="Add New Subject"><PostAddIcon color="primary" /></Tooltip>, name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        },
        {
            icon: <Tooltip title="Delete All Subjects"><DeleteIcon color="error" /></Tooltip>, name: 'Delete All Subjects',
            action: () => deleteHandler(currentUser._id, "Subjects")
        }
    ];

    return (
        <>
            {loading ?
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <div>Loading...</div>
                </Box>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained"
                                onClick={() => navigate("/Admin/subjects/chooseclass")}>Add Subjects</GreenButton>
                        </Box>
                        :
                        <Paper sx={{ width: '100%', overflow: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 3, minHeight: 320 }}>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
                                <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                                    No subjects found.
                                </Box>
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

        </>
    );
};

export default ShowSubjects;