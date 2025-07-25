import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimetables } from '../../redux/timetableRelated/timetableHandle';
import {
    Box, CircularProgress, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, styled, ToggleButtonGroup,
    ToggleButton, Chip, Divider
} from '@mui/material';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledTimeCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    width: '100px',
}));

const ClassCell = styled(TableCell)(({ theme, type }) => ({
    backgroundColor: type === 'exam' ? theme.palette.error.light : theme.palette.success.light,
    padding: '8px',
    verticalAlign: 'top',
    height: '80px',
    border: `1px solid ${theme.palette.divider}`,
}));

const ExamCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.error.light,
    padding: '12px',
    verticalAlign: 'top',
    height: '100px',
    border: `2px solid ${theme.palette.error.main}`,
    borderRadius: '4px',
    position: 'relative',
}));

const ExamTimeCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.common.white,
    width: '120px',
    padding: '12px',
}));

const StudentTimetable = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { timetables, loading, error } = useSelector(state => state.timetable || {});
    const [timetableData, setTimetableData] = useState({});
    const [timeSlots, setTimeSlots] = useState([
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ]);
    const [viewType, setViewType] = useState('class'); // 'class' or 'exam'
    const [examData, setExamData] = useState([]);

    useEffect(() => {
        if (currentUser?.branch?._id) {
            dispatch(fetchTimetables({ branch: currentUser.branch._id }));
            console.log('Fetching timetables for branch:', currentUser.branch._id);
        } else {
            console.log('Student branch not found:', currentUser);
        }
    }, [dispatch, currentUser?.branch?._id]);

    // Helper function to format time from 24-hour to 12-hour format
    const formatTime = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Helper function to convert any time format to minutes since midnight
    const timeToMinutes = (timeStr) => {
        let hours, minutes, isPM = false;

        // Handle 12-hour format (e.g., "9:30 AM" or "2:15 PM")
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
            const [timePart, ampm] = timeStr.split(' ');
            [hours, minutes] = timePart.split(':').map(num => parseInt(num, 10));
            isPM = ampm === 'PM';

            // Convert 12-hour to 24-hour
            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
        }
        // Handle 24-hour format (e.g., "14:30")
        else {
            [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
        }

        return hours * 60 + (minutes || 0);
    };

    // Generate dynamic time slots based on actual class times
    useEffect(() => {
        if (timetables && timetables.length > 0) {
            console.log('Timetable data received:', timetables);

            // Create a map of actual class time ranges
            const timeRanges = [];

            timetables.forEach(entry => {
                if (entry.startTime && entry.endTime) {
                    const startTime = formatTime(entry.startTime);
                    const endTime = formatTime(entry.endTime);

                    // Create a time range string (e.g., "9:30 AM - 10:30 AM")
                    const timeRange = `${startTime} - ${endTime}`;

                    // Add the time range with its reference hour for sorting
                    const startMinutes = timeToMinutes(startTime);
                    timeRanges.push({
                        range: timeRange,
                        minutes: startMinutes
                    });
                }
            });

            // Sort time ranges by start time
            timeRanges.sort((a, b) => a.minutes - b.minutes);

            // Remove duplicates
            const uniqueRanges = [];
            const seenRanges = new Set();

            timeRanges.forEach(item => {
                if (!seenRanges.has(item.range)) {
                    seenRanges.add(item.range);
                    uniqueRanges.push(item.range);
                }
            });

            // If no time ranges were found, keep the default time slots
            if (uniqueRanges.length === 0) {
                return;
            }

            console.log('Generated dynamic time ranges:', uniqueRanges);
            setTimeSlots(uniqueRanges);
        }
    }, [timetables]);

    // Process timetable data into a structured format for the table
    useEffect(() => {
        if (timetables && timetables.length > 0) {
            const processedData = {};
            const exams = [];

            // Initialize the data structure
            daysOfWeek.forEach(day => {
                processedData[day] = {};
                timeSlots.forEach(timeSlot => {
                    processedData[day][timeSlot] = [];
                });
            });

            // Fill in the timetable data and separate exams
            timetables.forEach(entry => {
                // Separate exams from regular classes
                if (entry.type === 'exam') {
                    exams.push(entry);
                    return; // Skip adding exams to the regular timetable
                }

                const day = entry.day;

                // Make sure we have a valid day
                if (!daysOfWeek.includes(day)) {
                    console.warn(`Invalid day in timetable entry: ${day}`, entry);
                    return;
                }

                try {
                    const startTime = formatTime(entry.startTime);

                    // Find the closest time slot
                    const closestSlot = findClosestTimeSlot(startTime);

                    if (processedData[day] && processedData[day][closestSlot]) {
                        processedData[day][closestSlot].push(entry);
                    } else {
                        console.warn(`Could not find matching slot for ${day} at ${startTime}`, {
                            closestSlot,
                            availableSlots: Object.keys(processedData[day] || {})
                        });
                    }
                } catch (error) {
                    console.error(`Error processing timetable entry:`, entry, error);
                }
            });

            // Sort exams by date and time
            exams.sort((a, b) => {
                // First compare by day
                const dayA = daysOfWeek.indexOf(a.day);
                const dayB = daysOfWeek.indexOf(b.day);
                if (dayA !== dayB) return dayA - dayB;

                // Then compare by start time
                return timeToMinutes(formatTime(a.startTime)) - timeToMinutes(formatTime(b.startTime));
            });

            setTimetableData(processedData);
            setExamData(exams);
        }
    }, [timetables]);

    // Helper function to find the matching time slot for a class
    const findClosestTimeSlot = (startTime) => {
        try {
            // For each time slot (which is now a range like "9:30 AM - 10:30 AM")
            for (const timeRange of timeSlots) {
                // Extract the start time from the range
                const rangeStartTime = timeRange.split(' - ')[0];

                // If this range starts with our target time, it's a match
                if (rangeStartTime === startTime) {
                    return timeRange;
                }
            }

            // If no exact match was found, return the first time slot as a fallback
            console.warn(`No exact time range match found for ${startTime}`);
            return timeSlots[0];
        } catch (error) {
            console.error(`Error finding time slot for ${startTime}:`, error);
            return timeSlots[0]; // Default to first slot on error
        }
    };

    // Handle toggle between class and exam views
    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setViewType(newView);
        }
    };

    // Render the exam timetable
    const renderExamTimetable = () => {
        if (examData.length === 0) {
            return (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No exams scheduled
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        There are currently no exams scheduled for your branch.
                    </Typography>
                </Box>
            );
        }

        return (
            <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 3 }}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ backgroundColor: 'error.dark' }}>Day</StyledTableCell>
                            <StyledTableCell sx={{ backgroundColor: 'error.dark' }}>Date</StyledTableCell>
                            <StyledTableCell sx={{ backgroundColor: 'error.dark' }}>Time</StyledTableCell>
                            <StyledTableCell sx={{ backgroundColor: 'error.dark' }}>Subject</StyledTableCell>
                            <StyledTableCell sx={{ backgroundColor: 'error.dark' }}>Teacher</StyledTableCell>
                            <StyledTableCell sx={{ backgroundColor: 'error.dark' }}>Details</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {examData.map((exam, index) => (
                            <TableRow key={exam._id || index} sx={{
                                '&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 0, 0, 0.05)' },
                                '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' }
                            }}>
                                <TableCell><strong>{exam.day}</strong></TableCell>
                                <TableCell>{exam.date ? new Date(exam.date).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${formatTime(exam.startTime)} - ${formatTime(exam.endTime)}`}
                                        color="error"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        {exam.subject?.subName || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>{exam.teacher?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    {exam.description ? (
                                        <Typography variant="body2">{exam.description}</Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            No additional details
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    // Render the class timetable
    const renderClassTimetable = () => {
        return (
            <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 3 }}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Time / Day</StyledTableCell>
                            {daysOfWeek.map(day => (
                                <StyledTableCell key={day} align="center">{day}</StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timeSlots.map(timeSlot => (
                            <TableRow key={timeSlot}>
                                <StyledTimeCell>{timeSlot}</StyledTimeCell>
                                {daysOfWeek.map(day => {
                                    const classes = timetableData[day]?.[timeSlot] || [];
                                    return (
                                        <ClassCell key={`${day}-${timeSlot}`} type="class">
                                            {classes.length > 0 ? (
                                                classes.map((entry, index) => (
                                                    <Box key={index} sx={{ mb: 1 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                            {entry.subject?.subName}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Teacher: {entry.teacher?.name}
                                                        </Typography>
                                                        {entry.description && (
                                                            <Typography variant="caption" display="block">
                                                                {entry.description}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    No class
                                                </Typography>
                                            )}
                                        </ClassCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box p={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {viewType === 'exam' ? 'Exam Schedule' : 'Class Timetable'}
                </Typography>

                <ToggleButtonGroup
                    value={viewType}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="timetable view"
                    size="small"
                >
                    <ToggleButton value="class" aria-label="class view" color="primary">
                        Class Schedule
                    </ToggleButton>
                    <ToggleButton value="exam" aria-label="exam view" color="error">
                        Exam Schedule
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                    {viewType === 'exam' ? renderExamTimetable() : renderClassTimetable()}
                </>
            )}
        </Box>
    );
};

export default StudentTimetable; 