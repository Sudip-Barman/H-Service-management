import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/public/LandingPage";
import ServicesPage from "../pages/public/ServicesPage";
import ServiceDetailsPage from "../pages/public/ServiceDetailsPage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import Login from "../pages/auth/Login";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminModulePage from "../pages/admin/AdminModulePage";
import Patients from "../pages/admin/patients/Patients";
import Doctors from "../pages/admin/doctors/Doctors";
import Nurses from "../pages/admin/nurses/Nurses";
import Staff from "../pages/admin/staff/Staff";
import Services from "../pages/admin/services/Services";
// import ServiceRequests from "../pages/admin/requests/ServiceRequests";
import Attendance from "../pages/admin/attendance/Attendance";
import Bookings from "../pages/admin/bookings/Booking";
import Appointments from "../pages/admin/appointment/Appointments";
import Schedules from "../pages/admin/schedules/Schedules";
import StaffShifts from "../pages/admin/shifts/StaffShifts";
import Assignments from "../pages/admin/Assignments/Assignments";
import BloodBank from "../pages/admin/bloods/BloodBank";
import Medicine from "../pages/admin/medicine/Medicine";
import Food from "../pages/admin/food/Food"; 
import Emergency from "../pages/admin/emergency/Emergency";
import Medicines from "../pages/admin/medicine/Medicine";
import Admission from "../pages/admin/admissions/Admissions";
import User from "../pages/admin/User/User";
import RoomBed from "../pages/admin/roombed/RoomBed";
import LabTests from "../pages/admin/labtests/LabTests";
import Request from "../pages/admin/requests/Requests";
const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/services" element={<ServicesPage />} />

      <Route path="/services/:serviceId" element={<ServiceDetailsPage />} />

      <Route path="/about" element={<AboutPage />} />

      <Route path="/contact" element={<ContactPage />} />

      <Route path="/login" element={<Login />} />


      {/* ================= ADMIN ROUTES ================= */}

      <Route path="/admin" element={<AdminLayout />}>
        
        {/* Dashboard */}
        <Route index element={<AdminDashboard />} />


        {/* People */}
        <Route path="users" element={<User />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="nurses" element={<Nurses />} />
        <Route path="staff" element={<Staff />} />

        {/* Care Management */}
        <Route path="services" element={<Services />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="schedules" element={<Schedules />} />

        {/* Workforce */}
        <Route path="shifts" element={<StaffShifts />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="attendance" element={<Attendance/>} />

        {/* Hospital Services */}
        {/* Blood Management */}
        <Route path="blood" element={<BloodBank />} />
        <Route path="medicine" element={<Medicines />} />
        <Route path="food" element={<Food/>} />
        <Route path="emergency" element={<Emergency />} />

        {/* Hospital Operations */}
        <Route path="lab-tests" element={<LabTests />} />
        <Route path="billing" element={<AdminModulePage />} />
        <Route path="notifications" element={<AdminModulePage />} />

        {/* Clinical / Hospital Management */}
        <Route path="admissions" element={<Admission />} />
        <Route path="rooms" element={<RoomBed />} />
        <Route path="beds" element={<AdminModulePage />} />
        <Route path="medical-records" element={<AdminModulePage />} />
        <Route path="laboratory" element={<AdminModulePage />} />
        <Route path="pharmacy" element={<Medicine />} />
        <Route path="inventory" element={<AdminModulePage />} />

        {/* Finance */}
        <Route path="payments" element={<AdminModulePage />} />
        <Route path="insurance" element={<AdminModulePage />} />

        {/* Patient Experience */}
        <Route path="complaints" element={<AdminModulePage />} />
        <Route path="feedback" element={<AdminModulePage />} />
        <Route path="documents" element={<AdminModulePage />} />
        <Route path="requests" element={<Request />} />

        {/* Reports */}
        {/* <Route path="reports" element={<ServiceRequests />} /> */}

        {/* System */}
        <Route path="roles" element={<AdminModulePage />} />
        <Route path="settings" element={<AdminModulePage />} />
        <Route path="audit-logs" element={<AdminModulePage />} />
      </Route>


      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;