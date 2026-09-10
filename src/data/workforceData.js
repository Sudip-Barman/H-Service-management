// src/data/workforceData.js

// --------------------------------------------------
// Workforce Users
// --------------------------------------------------

export const workforceUsers = [
  {
    id: "EMP-1001",
    name: "Dr. Arindam Sen",
    role: "doctor",
    designation: "General Physician",
    department: "General Medicine",
    qualification: "MBBS, MD",
    experience: "12 Years",
    phone: "+91 98765 43210",
    email: "arindam.sen@carecore.com",
    location: "CareCore Hospital",
    status: "Active",
    avatar: null,
    joiningDate: "12 March 2018",
  },

  {
    id: "EMP-1002",
    name: "Suman Roy",
    role: "nurse",
    designation: "GNM Nurse",
    department: "General Ward",
    qualification: "GNM Nursing",
    experience: "7 Years",
    phone: "+91 98765 43211",
    email: "suman.roy@carecore.com",
    location: "CareCore Hospital",
    status: "Active",
    avatar: null,
    joiningDate: "18 July 2020",
  },

  {
    id: "EMP-1003",
    name: "Anita Roy",
    role: "staff",
    designation: "Elder Caregiver",
    department: "Patient Care Services",
    qualification: "Caregiver Training",
    experience: "5 Years",
    phone: "+91 98765 43212",
    email: "anita.roy@carecore.com",
    location: "CareCore Hospital",
    status: "Active",
    avatar: null,
    joiningDate: "08 January 2021",
  },

  {
    id: "EMP-1004",
    name: "Mita Das",
    role: "staff",
    designation: "Baby Caretaker",
    department: "Baby Care",
    qualification: "Child Care Training",
    experience: "4 Years",
    phone: "+91 98765 43213",
    email: "mita.das@carecore.com",
    location: "CareCore Hospital",
    status: "Active",
    avatar: null,
    joiningDate: "21 August 2022",
  },

  {
    id: "EMP-1005",
    name: "Rahul Ghosh",
    role: "nurse",
    designation: "ICU Nurse",
    department: "ICU",
    qualification: "B.Sc Nursing",
    experience: "9 Years",
    phone: "+91 98765 43214",
    email: "rahul.ghosh@carecore.com",
    location: "CareCore Hospital",
    status: "On Leave",
    avatar: null,
    joiningDate: "14 February 2019",
  },

  {
    id: "EMP-1006",
    name: "Priyanka Paul",
    role: "nurse",
    designation: "ANM Nurse",
    department: "Nursing Services",
    qualification: "ANM",
    experience: "6 Years",
    phone: "+91 98765 43215",
    email: "priyanka.paul@carecore.com",
    location: "CareCore Hospital",
    status: "Active",
    avatar: null,
    joiningDate: "03 June 2021",
  },

  {
    id: "EMP-1007",
    name: "Vikash Kumar",
    role: "staff",
    designation: "Male Attendant",
    department: "Patient Care Services",
    qualification: "Patient Care Training",
    experience: "3 Years",
    phone: "+91 98765 43216",
    email: "vikash.kumar@carecore.com",
    location: "CareCore Hospital",
    status: "Active",
    avatar: null,
    joiningDate: "17 September 2023",
  },

  {
    id: "EMP-1008",
    name: "Riya Mukherjee",
    role: "staff",
    designation: "Receptionist",
    department: "Reception",
    qualification: "Bachelor's Degree",
    experience: "4 Years",
    phone: "+91 98765 43217",
    email: "riya.mukherjee@carecore.com",
    location: "CareCore Hospital",
    status: "Active",
    avatar: null,
    joiningDate: "11 November 2022",
  },
];

// --------------------------------------------------
// Schedule Data
// --------------------------------------------------

export const workforceSchedules = [
  {
    id: "SCH-001",
    employeeId: "EMP-1001",
    date: "2026-09-10",
    title: "Morning Shift",
    type: "Regular Duty",
    startTime: "08:00 AM",
    endTime: "02:00 PM",
    department: "General Medicine",
    location: "OPD",
    status: "Scheduled",
  },

  {
    id: "SCH-002",
    employeeId: "EMP-1001",
    date: "2026-09-11",
    title: "OPD Duty",
    type: "Regular Duty",
    startTime: "09:00 AM",
    endTime: "03:00 PM",
    department: "General Medicine",
    location: "OPD",
    status: "Scheduled",
  },

  {
    id: "SCH-003",
    employeeId: "EMP-1002",
    date: "2026-09-10",
    title: "Morning Shift",
    type: "Nursing Duty",
    startTime: "08:00 AM",
    endTime: "02:00 PM",
    department: "General Ward",
    location: "Ward 2",
    status: "Scheduled",
  },

  {
    id: "SCH-004",
    employeeId: "EMP-1002",
    date: "2026-09-11",
    title: "Evening Shift",
    type: "Nursing Duty",
    startTime: "02:00 PM",
    endTime: "08:00 PM",
    department: "General Ward",
    location: "Ward 2",
    status: "Scheduled",
  },

  {
    id: "SCH-005",
    employeeId: "EMP-1003",
    date: "2026-09-10",
    title: "Patient Care Duty",
    type: "Assigned Duty",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    department: "Patient Care Services",
    location: "Ward 1",
    status: "Scheduled",
  },

  {
    id: "SCH-006",
    employeeId: "EMP-1004",
    date: "2026-09-10",
    title: "Baby Care Duty",
    type: "Assigned Duty",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    department: "Baby Care",
    location: "Baby Care Unit",
    status: "Scheduled",
  },

  {
    id: "SCH-007",
    employeeId: "EMP-1005",
    date: "2026-09-10",
    title: "ICU Shift",
    type: "Nursing Duty",
    startTime: "08:00 AM",
    endTime: "02:00 PM",
    department: "ICU",
    location: "ICU",
    status: "On Leave",
  },

  {
    id: "SCH-008",
    employeeId: "EMP-1006",
    date: "2026-09-10",
    title: "Nursing Shift",
    type: "Regular Duty",
    startTime: "02:00 PM",
    endTime: "08:00 PM",
    department: "Nursing Services",
    location: "Ward 3",
    status: "Scheduled",
  },

  {
    id: "SCH-009",
    employeeId: "EMP-1007",
    date: "2026-09-10",
    title: "Patient Assistance",
    type: "Assigned Duty",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    department: "Patient Care Services",
    location: "Ward 1",
    status: "Scheduled",
  },

  {
    id: "SCH-010",
    employeeId: "EMP-1008",
    date: "2026-09-10",
    title: "Reception Duty",
    type: "Regular Duty",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    department: "Reception",
    location: "Main Reception",
    status: "Scheduled",
  },
];

// --------------------------------------------------
// Appointments
// --------------------------------------------------

export const workforceAppointments = [
  {
    id: "APT-1001",
    employeeId: "EMP-1001",
    patientId: "PAT-001",
    patientName: "Rahul Sharma",
    date: "2026-09-10",
    time: "10:00 AM",
    type: "Consultation",
    department: "General Medicine",
    status: "Confirmed",
  },

  {
    id: "APT-1002",
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
    id: "APT-1003",
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
    id: "APT-1004",
    employeeId: "EMP-1006",
    patientId: "PAT-004",
    patientName: "Sneha Paul",
    date: "2026-09-11",
    time: "03:00 PM",
    type: "Nursing Review",
    department: "Nursing Services",
    status: "Confirmed",
  },
];

// --------------------------------------------------
// Patient Data
// --------------------------------------------------

export const workforcePatients = [
  {
    id: "PAT-001",
    name: "Rahul Sharma",
    age: 42,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 91234 56780",
    room: "201",
    ward: "General Ward",
    doctorId: "EMP-1001",
    nurseId: "EMP-1002",
    status: "Admitted",
  },

  {
    id: "PAT-002",
    name: "Priya Das",
    age: 35,
    gender: "Female",
    bloodGroup: "O+",
    phone: "+91 91234 56781",
    room: "203",
    ward: "General Ward",
    doctorId: "EMP-1001",
    nurseId: "EMP-1002",
    status: "Admitted",
  },

  {
    id: "PAT-003",
    name: "Amit Roy",
    age: 58,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+91 91234 56782",
    room: "105",
    ward: "General Ward",
    doctorId: "EMP-1001",
    nurseId: "EMP-1002",
    staffId: "EMP-1003",
    status: "Under Care",
  },

  {
    id: "PAT-004",
    name: "Sneha Paul",
    age: 29,
    gender: "Female",
    bloodGroup: "AB+",
    phone: "+91 91234 56783",
    room: "302",
    ward: "Nursing Ward",
    doctorId: "EMP-1001",
    nurseId: "EMP-1006",
    status: "Admitted",
  },
];

// --------------------------------------------------
// Assignments
// --------------------------------------------------

export const workforceAssignments = [
  {
    id: "ASN-001",
    employeeId: "EMP-1002",
    title: "Patient Monitoring",
    description: "Monitor assigned patients and update vital signs.",
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
    title: "Patient Assistance",
    description: "Assist patient with daily activities and mobility.",
    patientId: "PAT-003",
    patientName: "Amit Roy",
    department: "General Ward",
    dueDate: "2026-09-10",
    priority: "Medium",
    status: "Pending",
  },

  {
    id: "ASN-003",
    employeeId: "EMP-1004",
    title: "Baby Care",
    description: "Provide routine baby care and support to the family.",
    patientId: "PAT-004",
    patientName: "Sneha Paul",
    department: "Baby Care",
    dueDate: "2026-09-10",
    priority: "High",
    status: "In Progress",
  },

  {
    id: "ASN-004",
    employeeId: "EMP-1007",
    title: "Patient Mobility Assistance",
    description: "Assist assigned patient with safe movement.",
    patientId: "PAT-003",
    patientName: "Amit Roy",
    department: "Patient Care Services",
    dueDate: "2026-09-10",
    priority: "Medium",
    status: "Pending",
  },
];

// --------------------------------------------------
// Attendance
// --------------------------------------------------

export const workforceAttendance = [
  {
    id: "ATT-001",
    employeeId: "EMP-1001",
    date: "2026-09-10",
    checkIn: "07:55 AM",
    checkOut: null,
    workingHours: "In Progress",
    status: "Present",
  },

  {
    id: "ATT-002",
    employeeId: "EMP-1002",
    date: "2026-09-10",
    checkIn: "07:52 AM",
    checkOut: null,
    workingHours: "In Progress",
    status: "Present",
  },

  {
    id: "ATT-003",
    employeeId: "EMP-1003",
    date: "2026-09-10",
    checkIn: "07:58 AM",
    checkOut: null,
    workingHours: "In Progress",
    status: "Present",
  },

  {
    id: "ATT-004",
    employeeId: "EMP-1004",
    date: "2026-09-10",
    checkIn: "08:42 AM",
    checkOut: null,
    workingHours: "In Progress",
    status: "Late",
  },
];

// --------------------------------------------------
// Leave Requests
// --------------------------------------------------

export const workforceLeaves = [
  {
    id: "LEV-001",
    employeeId: "EMP-1001",
    type: "Casual Leave",
    fromDate: "2026-09-20",
    toDate: "2026-09-21",
    days: 2,
    reason: "Personal work",
    status: "Pending",
  },

  {
    id: "LEV-002",
    employeeId: "EMP-1002",
    type: "Sick Leave",
    fromDate: "2026-08-15",
    toDate: "2026-08-16",
    days: 2,
    reason: "Health reasons",
    status: "Approved",
  },

  {
    id: "LEV-003",
    employeeId: "EMP-1003",
    type: "Casual Leave",
    fromDate: "2026-09-25",
    toDate: "2026-09-26",
    days: 2,
    reason: "Personal work",
    status: "Pending",
  },
];

// --------------------------------------------------
// Notifications
// --------------------------------------------------

export const workforceNotifications = [
  {
    id: "NOT-001",
    employeeId: "EMP-1001",
    title: "Schedule Updated",
    message: "Your OPD schedule for tomorrow has been updated.",
    type: "schedule",
    date: "2026-09-10",
    time: "09:15 AM",
    read: false,
  },

  {
    id: "NOT-002",
    employeeId: "EMP-1001",
    title: "New Appointment",
    message: "A new patient appointment has been assigned to you.",
    type: "appointment",
    date: "2026-09-10",
    time: "08:30 AM",
    read: true,
  },

  {
    id: "NOT-003",
    employeeId: "EMP-1002",
    title: "Duty Reminder",
    message: "Your evening nursing duty starts at 02:00 PM.",
    type: "schedule",
    date: "2026-09-10",
    time: "10:00 AM",
    read: false,
  },

  {
    id: "NOT-004",
    employeeId: "EMP-1003",
    title: "Assignment Added",
    message: "A new patient care assignment has been added.",
    type: "assignment",
    date: "2026-09-10",
    time: "08:45 AM",
    read: false,
  },
];

// --------------------------------------------------
// Role Permissions
// --------------------------------------------------

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

// --------------------------------------------------
// Helper Functions
// --------------------------------------------------

export const getWorkforceUser = (employeeId) => {
  return workforceUsers.find((user) => user.id === employeeId);
};

export const getUserSchedule = (employeeId) => {
  return workforceSchedules.filter(
    (schedule) => schedule.employeeId === employeeId
  );
};

export const getUserAppointments = (employeeId) => {
  return workforceAppointments.filter(
    (appointment) => appointment.employeeId === employeeId
  );
};

export const getUserPatients = (employeeId) => {
  return workforcePatients.filter(
    (patient) =>
      patient.doctorId === employeeId ||
      patient.nurseId === employeeId ||
      patient.staffId === employeeId
  );
};

export const getUserAssignments = (employeeId) => {
  return workforceAssignments.filter(
    (assignment) => assignment.employeeId === employeeId
  );
};

export const getUserAttendance = (employeeId) => {
  return workforceAttendance.filter(
    (attendance) => attendance.employeeId === employeeId
  );
};

export const getUserLeaves = (employeeId) => {
  return workforceLeaves.filter(
    (leave) => leave.employeeId === employeeId
  );
};

export const getUserNotifications = (employeeId) => {
  return workforceNotifications.filter(
    (notification) => notification.employeeId === employeeId
  );
};

export const getRolePermissions = (role) => {
  return (
    rolePermissions[role?.toLowerCase()] ||
    rolePermissions.staff
  );
};