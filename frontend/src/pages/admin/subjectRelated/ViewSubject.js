import React, { useEffect, useState } from 'react'
import { getSubjectDetails, getClassStudents } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, branchStudents, getresponse, error } = useSelector((state) => state.branch);

  const { branchID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    // Only fetch students if branchID is available
    if (branchID && branchID !== 'undefined') {
      dispatch(getClassStudents(branchID));
    }
  }, [dispatch, subjectID, branchID]);

  // Fetch students when subject details are loaded (if branchID was undefined)
  useEffect(() => {
    if (subjectDetails && subjectDetails.branch && subjectDetails.branch._id && (!branchID || branchID === 'undefined')) {
      dispatch(getClassStudents(subjectDetails.branch._id));
    }
  }, [dispatch, subjectDetails, branchID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = Array.isArray(branchStudents) ? branchStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  }) : [];

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        {/* Take Attendance button removed for admin */}
      </>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton variant="contained"
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
          Provide Marks
        </PurpleButton>
      </>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + branchID)}
              >
                Add Students
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Students List:
            </Typography>

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>

          </>
        )}
      </>
    )
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = Array.isArray(branchStudents) ? branchStudents.length : 0;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Subject Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subject Name : {subjectDetails && subjectDetails.subName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subject Code : {subjectDetails && subjectDetails.subCode}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Number of Students: {numberOfStudents}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Branch : {subjectDetails && subjectDetails.branch && subjectDetails.branch.branch}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Semester : {subjectDetails && subjectDetails.semester}
        </Typography>
        {subjectDetails && subjectDetails.teacher ?
          <Typography variant="h6" gutterBottom>
            Teacher Name : {subjectDetails.teacher.name}
          </Typography>
          :
          <GreenButton variant="contained"
            onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
            Add Subject Teacher
          </GreenButton>
        }
      </>
    );
  }

  return (
    <>
      {subloading ?
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <div>Loading...</div>
        </Box>
        :
        <Paper sx={{ width: '100%', p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 3, mt: 2, mb: 2 }}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 1 }}>
                <TabList onChange={handleChange}>
                  <Tab label="Details" value="1" />
                  <Tab label="Students" value="2" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <TabPanel value="1">
                  <SubjectDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <SubjectStudentsSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </Paper>
      }
    </>
  )
}

export default ViewSubject