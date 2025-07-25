export const calculateSubjectAttendancePercentage = (presentCount, totalSessions) => {
    // Instead of using totalSessions from subject schema, we'll use the total attendance records
    // which is the sum of present and absent counts
    const totalRecords = presentCount + (totalSessions - presentCount);
    
    // Handle edge cases: if totalRecords is 0
    if (totalRecords <= 0) {
        return 0;
    }
    
    // Ensure presentCount is a valid number
    const validPresentCount = presentCount || 0;
    
    const percentage = (validPresentCount / totalRecords) * 100;
    return isNaN(percentage) ? 0 : parseFloat(percentage.toFixed(2)); // Limit to two decimal places and ensure it's a number
};


export const groupAttendanceBySubject = (subjectAttendance) => {
    const attendanceBySubject = {};

    subjectAttendance.forEach((attendance) => {
        const subName = attendance.subName.subName;
        const sessions = attendance.subName.sessions;
        const subId = attendance.subName._id;

        if (!attendanceBySubject[subName]) {
            attendanceBySubject[subName] = {
                present: 0,
                absent: 0,
                sessions: sessions,
                allData: [],
                subId: subId
            };
        }
        if (attendance.status === "Present") {
            attendanceBySubject[subName].present++;
        } else if (attendance.status === "Absent") {
            attendanceBySubject[subName].absent++;
        }
        attendanceBySubject[subName].allData.push({
            date: attendance.date,
            status: attendance.status,
        });
    });
    return attendanceBySubject;
}

export const calculateOverallAttendancePercentage = (subjectAttendance) => {
    // If there's no attendance data, return 0
    if (!subjectAttendance || !Array.isArray(subjectAttendance) || subjectAttendance.length === 0) {
        return 0;
    }
    
    let totalAttendanceRecords = subjectAttendance.length;
    let presentCountSum = 0;

    // Count present attendances
    subjectAttendance.forEach((attendance) => {
        if (attendance && attendance.status === "Present") {
            presentCountSum++;
        }
    });

    // Calculate percentage
    const percentage = (presentCountSum / totalAttendanceRecords) * 100;
    
    // Return 0 if NaN, otherwise return the percentage with 2 decimal places
    return isNaN(percentage) ? 0 : parseFloat(percentage.toFixed(2));
};