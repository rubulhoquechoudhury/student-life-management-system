import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material'
import { getAllBranches } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import { PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

const ChooseBranch = ({ situation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { branchesList, loading, error, getresponse } = useSelector((state) => state.branch);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllBranches(currentUser._id, "Branch"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error)
    }

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate("/Admin/teachers/choosesubject/" + classID)
        }
        else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID)
        }
    }

    const branchColumns = [
        { id: 'branch', label: 'Branch/Department', minWidth: 170 },
        { id: 'semester', label: 'Semester', minWidth: 100 },
    ]

    const branchRows = branchesList && branchesList.length > 0 && branchesList.map((branch) => {
        return {
            branch: branch.branch,
            semester: branch.semester,
            id: branch._id,
        };
    })

    const BranchButtonHaver = ({ row }) => {
        return (
            <>
                <PurpleButton variant="contained"
                    onClick={() => navigateHandler(row.id)}>
                    Choose
                </PurpleButton>
            </>
        );
    };

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {getresponse ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <Button variant="contained" onClick={() => navigate("/Admin/addbranch")}> 
                                Add Branch/Department
                            </Button>
                        </Box>
                        :
                        <>
                            <Typography variant="h6" gutterBottom component="div">
                                Choose a branch/department
                            </Typography>
                            {Array.isArray(branchesList) && branchesList.length > 0 &&
                                <TableTemplate buttonHaver={BranchButtonHaver} columns={branchColumns} rows={branchRows} />
                            }
                        </>}
                </>
            }
        </>
    )
}

export default ChooseBranch