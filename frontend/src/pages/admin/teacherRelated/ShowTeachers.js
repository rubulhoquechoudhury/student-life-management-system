import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, Box, IconButton,
    Tooltip,
} from '@mui/material';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/teachers/chooseclass")}>
                    Add Teacher
                </GreenButton>
            </Box>
        );
    } else if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        // console.log(deleteID);
        // console.log(address);
        // setMessage("Sorry the delete function has been disabled for now.")
        // setShowPopup(true)
        dispatch(deleteUser(deleteID, address)).then(() => {
            dispatch(getAllTeachers(currentUser._id));
        });
    };

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const rows = teachersList.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass?.sclassName || teacher.teachBranch?.branch || 'N/A',
            teachSclassID: teacher.teachSclass?._id || teacher.teachBranch?._id || '',
            id: teacher._id,
        };
    });

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

    return (
        <Paper sx={{ width: '100%', overflow: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 3, minHeight: 320 }}>
            {rows.length > 0 ? (
                <>
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <StyledTableRow>
                                    {columns.map((column) => (
                                        <StyledTableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                            sx={{ fontWeight: 700, fontSize: '1.1rem', bgcolor: 'background.default' }}
                                        >
                                            {column.label}
                                        </StyledTableCell>
                                    ))}
                                    <StyledTableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', bgcolor: 'background.default' }}>
                                        Actions
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id === 'teachSubject') {
                                                    return (
                                                        <StyledTableCell key={column.id} align={column.align}>
                                                            {value ? (
                                                                value
                                                            ) : (
                                                                <Button variant="contained"
                                                                    onClick={() => {
                                                                        navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)
                                                                    }}>
                                                                    Add Subject
                                                                </Button>
                                                            )}
                                                        </StyledTableCell>
                                                    );
                                                }
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell align="center">
                                                <Tooltip title="Delete Teacher">
                                                    <IconButton onClick={() => deleteHandler(row.id, "Teacher")}> <PersonRemoveIcon color="error" /> </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View Teacher">
                                                    <BlueButton variant="contained"
                                                        onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}>
                                                        View
                                                    </BlueButton>
                                                </Tooltip>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 5));
                            setPage(0);
                        }}
                    />
                </>
            ) : (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                    No teachers found.
                </Box>
            )}
            <SpeedDialTemplate actions={actions} />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Paper >
    );
};

export default ShowTeachers