// ============================================================
// WORKFORCE USERS
// ============================================================

export const workforceUsers = [
  {
    employeeId: "EMP-1001",
    name: "Dr. Arindam Sen",
    role: "doctor",
    designation: "General Physician",
    department: "General Medicine",
    qualification: "MBBS MD",
    experience: "12 Years",
    phone: "+91 98765 43210",
    email: "arindam.sen@carecore.com",
    status: "Active",
  },

  {
    employeeId: "EMP-1002",
    name: "Suman Roy",
    role: "nurse",
    designation: "GNM Nurse",
    department: "General Ward",
    qualification: "GNM Nursing",
    experience: "7 Years",
    phone: "+91 98765 43211",
    email: "suman.roy@carecore.com",
    status: "Active",
  },

  {
    employeeId: "EMP-1003",
    name: "Anita Roy",
    role: "staff",
    designation: "Elder Caregiver",
    department: "Patient Care Services",
    qualification: "Caregiver Training",
    experience: "5 Years",
    phone: "+91 98765 43212",
    email: "anita.roy@carecore.com",
    status: "Active",
  },

  {
    employeeId: "EMP-1004",
    name: "Mita Das",
    role: "staff",
    designation: "Baby Caretaker",
    department: "Baby Care",
    qualification: "Child Care Training",
    experience: "4 Years",
    phone: "+91 98765 43213",
    email: "mita.das@carecore.com",
    status: "Active",
  },

  {
    employeeId: "EMP-1005",
    name: "Rahul Ghosh",
    role: "nurse",
    designation: "ICU Nurse",
    department: "ICU",
    qualification: "B.Sc Nursing",
    experience: "9 Years",
    phone: "+91 98765 43214",
    email: "rahul.ghosh@carecore.com",
    status: "On Leave",
  },

  {
    employeeId: "EMP-1006",
    name: "Priyanka Paul",
    role: "nurse",
    designation: "ANM Nurse",
    department: "Nursing Services",
    qualification: "ANM",
    experience: "6 Years",
    phone: "+91 98765 43215",
    email: "priyanka.paul@carecore.com",
    status: "Active",
  },

  {
    employeeId: "EMP-1007",
    name: "Vikash Kumar",
    role: "staff",
    designation: "Male Attendant",
    department: "Patient Care Services",
    qualification: "Patient Care Training",
    experience: "3 Years",
    phone: "+91 98765 43216",
    email: "vikash.kumar@carecore.com",
    status: "Active",
  },

  {
    employeeId: "EMP-1008",
    name: "Riya Mukherjee",
    role: "staff",
    designation: "Receptionist",
    department: "Reception",
    qualification: "Bachelor's Degree",
    experience: "4 Years",
    phone: "+91 98765 43217",
    email: "riya.mukherjee@carecore.com",
    status: "Active",
  },
];


// ============================================================
// WORKFORCE SCHEDULES
// ============================================================

export const workforceSchedules = [
  {
    id: "SCH-001",
    employeeId: "EMP-1001",
    date: "2026-09-10",
    title: "Morning OPD",
    type: "OPD",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    department: "General Medicine",
    location: "OPD Room 101",
    status: "Scheduled",
  },

  {
    id: "SCH-002",
    employeeId: "EMP-1001",
    date: "2026-09-10",
    title: "Patient Consultation",
    type: "Consultation",
    startTime: "02:00 PM",
    endTime: "05:00 PM",
    department: "General Medicine",
    location: "Consultation Room 2",
    status: "Scheduled",
  },

  {
    id: "SCH-003",
    employeeId: "EMP-1002",
    date: "2026-09-10",
    title: "General Ward Duty",
    type: "Ward Duty",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    department: "General Ward",
    location: "Ward A",
    status: "Scheduled",
  },

  {
    id: "SCH-004",
    employeeId: "EMP-1005",
    date: "2026-09-10",
    title: "ICU Duty",
    type: "ICU",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    department: "ICU",
    location: "ICU Unit",
    status: "On Leave",
  },

  {
    id: "SCH-005",
    employeeId: "EMP-1006",
    date: "2026-09-10",
    title: "Nursing Duty",
    type: "Nursing",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    department: "Nursing Services",
    location: "Nursing Station",
    status: "Scheduled",
  },

  {
    id: "SCH-006",
    employeeId: "EMP-1003",
    date: "2026-09-10",
    title: "Elder Care Assignment",
    type: "Patient Care",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    department: "Patient Care Services",
    location: "Room 204",
    status: "Scheduled",
  },

  {
    id: "SCH-007",
    employeeId: "EMP-1004",
    date: "2026-09-10",
    title: "Baby Care Duty",
    type: "Baby Care",
    startTime: "08:30 AM",
    endTime: "04:30 PM",
    department: "Baby Care",
    location: "Baby Care Unit",
    status: "Scheduled",
  },

  {
    id: "SCH-008",
    employeeId: "EMP-1007",
    date: "2026-09-10",
    title: "Patient Assistance",
    type: "Patient Care",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    department: "Patient Care Services",
    location: "Ward B",
    status: "Scheduled",
  },

  {
    id: "SCH-009",
    employeeId: "EMP-1008",
    date: "2026-09-10",
    title: "Reception Duty",
    type: "Reception",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    department: "Reception",
    location: "Main Reception",
    status: "Scheduled",
  },

  {
    id: "SCH-010",
    employeeId: "EMP-1001",
    date: "2026-09-11",
    title: "Morning OPD",
    type: "OPD",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    department: "General Medicine",
    location: "OPD Room 101",
    status: "Scheduled",
  },
];


// ============================================================
// APPOINTMENTS
// ============================================================

export const workforceAppointments = [
  {
    id: "APT-001",
    employeeId: "EMP-1001",
    patientId: "PAT-001",
    patientName: "Rahul Sharma",
    date: "2026-09-10",
    time: "10:30 AM",
    type: "Consultation",
    department: "General Medicine",
    status: "Confirmed",
  },

  {
    id: "APT-002",
    employeeId: "EMP-1001",
    patientId: "PAT-002",
    patientName: "Priya Das",
    date: "2026-09-10",
    time: "11:30 AM",
    type: "Follow-up",
    department: "General Medicine",
    status: "Confirmed",
  },

  {
    id: "APT-003",
    employeeId: "EMP-1002",
    patientId: "PAT-003",
    patientName: "Amit Roy",
    date: "2026-09-10",
    time: "01:00 PM",
    type: "Nursing Review",
    department: "General Ward",
    status: "Pending",
  },

  {
    id: "APT-004",
    employeeId: "EMP-1005",
    patientId: "PAT-004",
    patientName: "Sanjay Kumar",
    date: "2026-09-10",
    time: "03:00 PM",
    type: "ICU Review",
    department: "ICU",
    status: "Cancelled",
  },
];


// ============================================================
// PATIENTS
// ============================================================

export const workforcePatients = [
  {
    id: "PAT-001",
    name: "Rahul Sharma",
    age: 45,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 98765 10001",
    doctorId: "EMP-1001",
    nurseId: "EMP-1002",
    staffId: null,
    department: "General Medicine",
    room: "101",
    status: "Under Treatment",
  },

  {
    id: "PAT-002",
    name: "Priya Das",
    age: 32,
    gender: "Female",
    bloodGroup: "O+",
    phone: "+91 98765 10002",
    doctorId: "EMP-1001",
    nurseId: "EMP-1006",
    staffId: null,
    department: "General Medicine",
    room: "103",
    status: "Under Treatment",
  },

  {
    id: "PAT-003",
    name: "Amit Roy",
    age: 61,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+91 98765 10003",
    doctorId: "EMP-1001",
    nurseId: "EMP-1002",
    staffId: "EMP-1003",
    department: "General Ward",
    room: "204",
    status: "Under Observation",
  },

  {
    id: "PAT-004",
    name: "Sanjay Kumar",
    age: 58,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+91 98765 10004",
    doctorId: "EMP-1001",
    nurseId: "EMP-1005",
    staffId: "EMP-1007",
    department: "ICU",
    room: "ICU-04",
    status: "Critical",
  },
];


// ============================================================
// ASSIGNMENTS
// ============================================================

export const workforceAssignments = [
  {
    id: "ASN-001",
    employeeId: "EMP-1002",
    title: "Monitor Patient Vital Signs",
    description:
      "Monitor assigned patients and update vital signs regularly.",
    patientId: "PAT-001",
    patientName: "Rahul Sharma",
    department: "General Ward",
    dueDate: "2026-09-10",
    priority: "High",
    status: "In Progress",
  },

  {
    id: "ASN-002",
    employeeId: "EMP-1003",
    title: "Elder Patient Assistance",
    description:
      "Assist assigned elderly patient with daily care activities.",
    patientId: "PAT-003",
    patientName: "Amit Roy",
    department: "Patient Care Services",
    dueDate: "2026-09-10",
    priority: "Medium",
    status: "Pending",
  },

  {
    id: "ASN-003",
    employeeId: "EMP-1004",
    title: "Baby Care Support",
    description:
      "Provide routine baby care and assist the patient's family.",
    patientId: "PAT-002",
    patientName: "Priya Das",
    department: "Baby Care",
    dueDate: "2026-09-11",
    priority: "Medium",
    status: "Pending",
  },

  {
    id: "ASN-004",
    employeeId: "EMP-1007",
    title: "Patient Room Assistance",
    description:
      "Assist patient with movement and room-related requirements.",
    patientId: "PAT-004",
    patientName: "Sanjay Kumar",
    department: "Patient Care Services",
    dueDate: "2026-09-09",
    priority: "High",
    status: "Completed",
  },
];


// ============================================================
// ATTENDANCE
// ============================================================

export const workforceAttendance = [
  // Doctor
  {
    id: "ATT-001",
    employeeId: "EMP-1001",
    date: "2026-09-09",
    checkIn: "09:08 AM",
    checkOut: "05:31 PM",
    status: "Completed",
  },

  {
    id: "ATT-002",
    employeeId: "EMP-1001",
    date: "2026-09-08",
    checkIn: "09:15 AM",
    checkOut: "05:20 PM",
    status: "Completed",
  },

  {
    id: "ATT-003",
    employeeId: "EMP-1001",
    date: "2026-09-07",
    checkIn: "09:04 AM",
    checkOut: "05:12 PM",
    status: "Completed",
  },

  {
    id: "ATT-004",
    employeeId: "EMP-1001",
    date: "2026-09-06",
    checkIn: "09:10 AM",
    checkOut: "05:25 PM",
    status: "Completed",
  },

  // Nurse
  {
    id: "ATT-005",
    employeeId: "EMP-1002",
    date: "2026-09-09",
    checkIn: "08:02 AM",
    checkOut: "04:10 PM",
    status: "Completed",
  },

  {
    id: "ATT-006",
    employeeId: "EMP-1002",
    date: "2026-09-08",
    checkIn: "08:07 AM",
    checkOut: "04:05 PM",
    status: "Completed",
  },

  // Nurse
  {
    id: "ATT-007",
    employeeId: "EMP-1006",
    date: "2026-09-09",
    checkIn: "09:03 AM",
    checkOut: "05:05 PM",
    status: "Completed",
  },

  // Staff
  {
    id: "ATT-008",
    employeeId: "EMP-1003",
    date: "2026-09-09",
    checkIn: "09:01 AM",
    checkOut: "05:02 PM",
    status: "Completed",
  },

  {
    id: "ATT-009",
    employeeId: "EMP-1004",
    date: "2026-09-09",
    checkIn: "08:32 AM",
    checkOut: "04:35 PM",
    status: "Completed",
  },

  {
    id: "ATT-010",
    employeeId: "EMP-1007",
    date: "2026-09-09",
    checkIn: "09:55 AM",
    checkOut: "06:04 PM",
    status: "Completed",
  },

  {
    id: "ATT-011",
    employeeId: "EMP-1008",
    date: "2026-09-09",
    checkIn: "08:58 AM",
    checkOut: "05:01 PM",
    status: "Completed",
  },
];


// ============================================================
// LEAVE REQUESTS
// ============================================================

export const workforceLeaves = [
  {
    id: "LV-001",
    employeeId: "EMP-1005",
    leaveType: "Sick Leave",
    startDate: "2026-09-10",
    endDate: "2026-09-11",
    reason: "Medical rest",
    status: "Approved",
  },

  {
    id: "LV-002",
    employeeId: "EMP-1001",
    leaveType: "Casual Leave",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    reason: "Personal work",
    status: "Pending",
  },

  {
    id: "LV-003",
    employeeId: "EMP-1003",
    leaveType: "Casual Leave",
    startDate: "2026-09-22",
    endDate: "2026-09-23",
    reason: "Family function",
    status: "Approved",
  },
];


// ============================================================
// NOTIFICATIONS
// ============================================================

export const workforceNotifications = [
  {
    id: "NOT-001",
    employeeId: "EMP-1001",
    title: "New Appointment",
    message:
      "A new patient consultation has been assigned to you.",
    time: "10 minutes ago",
    type: "appointment",
    read: false,
  },

  {
    id: "NOT-002",
    employeeId: "EMP-1001",
    title: "Schedule Updated",
    message:
      "Your schedule for September 11 has been updated.",
    time: "1 hour ago",
    type: "schedule",
    read: false,
  },

  {
    id: "NOT-003",
    employeeId: "EMP-1001",
    title: "Leave Request",
    message:
      "Your casual leave request is awaiting approval.",
    time: "3 hours ago",
    type: "leave",
    read: true,
  },

  {
    id: "NOT-004",
    employeeId: "EMP-1001",
    title: "System Notification",
    message:
      "Please complete your daily attendance before leaving.",
    time: "Yesterday",
    type: "system",
    read: true,
  },
];


// ============================================================
// ROLE PERMISSIONS
// ============================================================

export const rolePermissions = {
  doctor: {
    appointments: true,
    patients: true,
    assignments: false,
    attendance: true,
    leave: true,
    schedule: true,
    medicalNotes: true,
    prescriptions: true,
  },

  nurse: {
    appointments: true,
    patients: true,
    assignments: true,
    attendance: true,
    leave: true,
    schedule: true,
    medicalNotes: false,
    prescriptions: false,
  },

  staff: {
    appointments: false,
    patients: true,
    assignments: true,
    attendance: true,
    leave: true,
    schedule: true,
    medicalNotes: false,
    prescriptions: false,
  },
};


// ============================================================
// USER HELPERS
// ============================================================

export const getWorkforceUser = (employeeId) => {
  return workforceUsers.find(
    (user) => user.employeeId === employeeId
  );
};


// ============================================================
// SCHEDULE HELPERS
// ============================================================

export const getUserSchedule = (employeeId) => {
  return workforceSchedules.filter(
    (schedule) => schedule.employeeId === employeeId
  );
};


// ============================================================
// APPOINTMENT HELPERS
// ============================================================

export const getUserAppointments = (employeeId) => {
  return workforceAppointments.filter(
    (appointment) =>
      appointment.employeeId === employeeId
  );
};


// ============================================================
// PATIENT HELPERS
// ============================================================

export const getUserPatients = (employeeId) => {
  return workforcePatients.filter(
    (patient) =>
      patient.doctorId === employeeId ||
      patient.nurseId === employeeId ||
      patient.staffId === employeeId
  );
};


// ============================================================
// ASSIGNMENT HELPERS
// ============================================================

export const getUserAssignments = (employeeId) => {
  return workforceAssignments.filter(
    (assignment) =>
      assignment.employeeId === employeeId
  );
};


// ============================================================
// ATTENDANCE HELPERS
// ============================================================

export const getWorkforceAttendance = (employeeId) => {
  return workforceAttendance.filter(
    (record) => record.employeeId === employeeId
  );
};


// Alias for compatibility with other pages
export const getUserAttendance = (employeeId) => {
  return getWorkforceAttendance(employeeId);
};


// ============================================================
// LEAVE HELPERS
// ============================================================

export const getUserLeaves = (employeeId) => {
  return workforceLeaves.filter(
    (leave) => leave.employeeId === employeeId
  );
};


// ============================================================
// NOTIFICATION HELPERS
// ============================================================

export const getUserNotifications = (employeeId) => {
  return workforceNotifications.filter(
    (notification) =>
      notification.employeeId === employeeId
  );
};


// ============================================================
// ROLE PERMISSION HELPER
// ============================================================

export const getRolePermissions = (role) => {
  return (
    rolePermissions[role?.toLowerCase()] ||
    rolePermissions.staff
  );
};