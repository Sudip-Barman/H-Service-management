import { Routes, Route, Navigate } from "react-router-dom";

// ================= AUTH =================
import Login from "../pages/auth/Login";
import FirstTimePassword from "../pages/auth/FirstTimePassword";

// ================= ADMIN =================
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
// import AdminModulePage from "../pages/admin/AdminModulePage";

import Patients from "../pages/admin/patients/Patients";
import PatientRecord from "../pages/common/PatientRecord";
import Doctors from "../pages/admin/doctors/Doctors";
import Nurses from "../pages/admin/nurses/Nurses";
import Staff from "../pages/admin/staff/Staff";
import User from "../pages/admin/User/User";
import FollowUp from "../pages/admin/followup/FollowUp";
import Services from "../pages/admin/services/Services";
import Booking from "../pages/admin/booking/Booking";
import Schedules from "../pages/admin/schedules/Schedules";

import Attendance from "../pages/admin/attendance/Attendance";
import StaffShifts from "../pages/admin/shifts/StaffShifts";

import BloodBank from "../pages/admin/bloods/BloodBank";
import Medicine from "../pages/admin/medicine/Medicine";
// import Food from "../pages/admin/food/Food";
import Emergency from "../pages/admin/emergency/Emergency";
import Inventory from "../pages/admin/inventory/Inventory";

import Notification from "../pages/admin/notification/Notification";
import Feedback from "../pages/admin/feedback/Feedback";
import Settings from "../pages/admin/setting/Settings";
import AdminProfile from "../pages/admin/profile/AdminProfile";

import Admission from "../pages/admin/admissions/Admissions";
import RoomBed from "../pages/admin/roombed/RoomBed";
// import LabTests from "../pages/admin/labtests/LabTests";
import Request from "../pages/admin/requests/Requests";
import Billings from "../pages/admin/billings/Billings";

// ================= WORKFORCE =================
import WorkforceLayout from "../layouts/WorkforceLayout";
import WorkforceDashboard from "../pages/workforce/Dashboard";
import WorkforceProfile from "../pages/workforce/Profile";
import WorkforceSchedule from "../pages/workforce/Schedule";
import WorkforceAttendance from "../pages/workforce/Attendance";
import WorkforceAppointments from "../pages/workforce/Appointments";
import WorkforcePatients from "../pages/workforce/Patients";
import WorkforceNotifications from "../pages/workforce/Notifications";
import WorkforceSettings from "../pages/workforce/Settings";
import WorkforceLeave from "../pages/workforce/Leave";
import WorkforceAssignments from "../pages/workforce/Assignments";
import HelpSupport from "../pages/workforce/HelpSupport";

// ================= LOGOUT =================
import Logout from "../pages/auth/Logout";


// ============================================================
// AUTH HELPERS
// ============================================================

const getToken = () => {
  return localStorage.getItem("access_token");
};

const getUser = () => {
  try {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch {
    return null;
  }
};


// ============================================================
// PROTECTED ROUTE
// ============================================================

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = getToken();
  const user = getUser();

  // No authentication
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Force password change on first login
  if (user.must_change_password) {
    return <Navigate to="/first-time-password" replace />;
  }

  // Role restriction
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    // Send the user to their correct portal
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (
      user.role === "doctor" ||
      user.role === "nurse" ||
      user.role === "staff"
    ) {
      return <Navigate to="/workforce" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};


// ============================================================
// PUBLIC LOGIN ROUTE
// ============================================================

const LoginRoute = () => {
  const token = getToken();
  const user = getUser();

  // Already logged in
  if (token && user) {
    if (user.must_change_password) {
      return <Navigate to="/first-time-password" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (
      user.role === "doctor" ||
      user.role === "nurse" ||
      user.role === "staff"
    ) {
      return <Navigate to="/workforce" replace />;
    }
  }

  return <Login />;
};


// ============================================================
// FIRST TIME PASSWORD ROUTE
// ============================================================

const FirstTimePasswordRoute = () => {
  const token = getToken();
  const user = getUser();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Password change not needed -> send to portal
  if (!user.must_change_password) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/workforce" replace />;
  }

  return <FirstTimePassword />;
};


// ============================================================
// APP ROUTES
// ============================================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* ======================================================
          PUBLIC ROUTES
      ====================================================== */}

      <Route
        path="/login"
        element={<LoginRoute />}
      />

      <Route
        path="/first-time-password"
        element={<FirstTimePasswordRoute />}
      />

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/logout"
        element={<Logout />}
      />


      {/* ======================================================
          ADMIN ROUTES
      ====================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        {/* Dashboard */}
        <Route
          index
          element={<AdminDashboard />}
        />

        {/* People */}
        <Route
          path="users"
          element={<User />}
        />

        <Route
          path="patients"
          element={<Patients />}
        />

        <Route
          path="patients/:id"
          element={<PatientRecord portal="admin" />}
        />

        <Route
          path="follow-up"
          element={<FollowUp />}
        />

        <Route
          path="doctors"
          element={<Doctors />}
        />

        <Route
          path="nurses"
          element={<Nurses />}
        />

        <Route
          path="staff"
          element={<Staff />}
        />


        {/* Care Management */}
        <Route
          path="services"
          element={<Services />}
        />

        <Route
          path="booking"
          element={<Booking />}
        />


        <Route
          path="schedules"
          element={<Schedules />}
        />


        {/* Workforce */}
        <Route
          path="shifts"
          element={<StaffShifts />}
        />

        <Route
          path="attendance"
          element={<Attendance />}
        />


        {/* Hospital Services */}
        <Route
          path="blood"
          element={<BloodBank />}
        />

        <Route
          path="medicine"
          element={<Medicine />}
        />


        <Route
          path="emergency"
          element={<Emergency />}
        />


        {/* Hospital Operations */}
        <Route
          path="notifications"
          element={<Notification />}
        />


        <Route
          path="billing"
          element={<Billings />}
        />


        {/* Clinical / Hospital Management */}
        <Route
          path="admissions"
          element={<Admission />}
        />

        <Route
          path="rooms"
          element={<RoomBed />}
        />

        <Route
          path="pharmacy"
          element={<Medicine />}
        />

        <Route
          path="inventory"
          element={<Inventory />}
        />



        {/* Patient Experience */}

        <Route
          path="feedback"
          element={<Feedback />}
        />

        <Route
          path="requests"
          element={<Request />}
        />


        {/* System */}

        <Route
          path="settings"
          element={<Settings />}
        />

        <Route
          path="profile"
          element={<AdminProfile />}
        />

      </Route>


      {/* ======================================================
          WORKFORCE PORTAL
      ====================================================== */}

      <Route
        path="/workforce"
        element={
          <ProtectedRoute
            allowedRoles={[
              "doctor",
              "nurse",
              "staff",
            ]}
          >
            <WorkforceLayout />
          </ProtectedRoute>
        }
      >

        {/* Default /workforce shows Dashboard */}
        <Route
          index
          element={<WorkforceDashboard />}
        />

        {/* 1. Profile */}
        <Route
          path="profile"
          element={<WorkforceProfile />}
        />

        {/* 2. Attendance */}
        <Route
          path="attendance"
          element={<WorkforceAttendance />}
        />

        {/* 3. Schedule */}
        <Route
          path="schedule"
          element={<WorkforceSchedule />}
        />

        {/* 4. Appointments */}
        <Route
          path="appointments"
          element={<WorkforceAppointments />}
        />

        {/* 5. Patients */}
        <Route
          path="patients"
          element={<WorkforcePatients />}
        />

        <Route
          path="patients/:id"
          element={<PatientRecord portal="workforce" />}
        />

        {/* 6. Notifications */}
        <Route
          path="notifications"
          element={<WorkforceNotifications />}
        />

        {/* 7. Settings */}
        <Route
          path="settings"
          element={<WorkforceSettings />}
        />

        {/* 8. Leave Requests */}
        <Route
          path="leave"
          element={<WorkforceLeave />}
        />

        {/* 9. Assignments */}
        <Route
          path="assignments"
          element={<WorkforceAssignments />}
        />

        {/* 10. Help & Support */}
        <Route
          path="help"
          element={<HelpSupport />}
        />

      </Route>


      {/* ======================================================
          FALLBACK
      ====================================================== */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;