import { Container, Grid, Paper } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import styled from 'styled-components';
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";
import Time from "../../assets/time.svg";
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const TeacherHomePage = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, branchStudents } = useSelector((state) => state.branch || {});

    const classID = currentUser?.teachBranch?._id
    const subjectID = currentUser?.teachSubject?._id

    useEffect(() => {
        console.log('TeacherHomePage - Current User:', currentUser);
        console.log('TeacherHomePage - Class ID:', classID);
        console.log('TeacherHomePage - Subject ID:', subjectID);
        
        if (subjectID && classID) {
            dispatch(getSubjectDetails(subjectID, "Subject"));
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, subjectID, classID]);
    
    useEffect(() => {
        console.log('TeacherHomePage - Branch Students:', branchStudents);
    }, [branchStudents]);

    const numberOfStudents = branchStudents && branchStudents.length;
    const numberOfSessions = subjectDetails && subjectDetails.sessions

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Students} alt="Students" />
                            <Title>
                                Class Students
                            </Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

export default TeacherHomePage