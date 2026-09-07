import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/public/LandingPage";
import ServicesPage from "../pages/public/ServicesPage";
import ServiceDetailsPage from "../pages/public/ServiceDetailsPage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import Login from "../pages/auth/Login";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
// import BloodBank from "../pages/admin/blood/BloodBank";
import AdminModulePage from "../pages/admin/AdminModulePage";
import Patients from "../pages/admin/patients/Patients";
import Staff from "../pages/admin/staff/Staff";
import Services from "../pages/admin/services/Services";
import ServiceRequests from "../pages/admin/requests/ServiceRequests";
import User from "../pages/admin/User/User";

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

        {/* Blood Management */}
        {/* <Route path="blood" element={<BloodBank />} /> */}

        {/* People */}
        <Route path="users" element={<User />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<AdminModulePage />} />
        <Route path="nurses" element={<AdminModulePage />} />
        <Route path="staff" element={<Staff />} />

        {/* Care Management */}
        <Route path="services" element={<Services />} />
        <Route path="bookings" element={<AdminModulePage />} />
        <Route path="appointments" element={<AdminModulePage />} />
        <Route path="schedules" element={<AdminModulePage />} />

        {/* Workforce */}
        <Route path="shifts" element={<AdminModulePage />} />
        <Route path="assignments" element={<AdminModulePage />} />
        <Route path="attendance" element={<AdminModulePage />} />

        {/* Hospital Services */}
        <Route path="medicine" element={<AdminModulePage />} />
        <Route path="food" element={<AdminModulePage />} />
        <Route path="emergency" element={<AdminModulePage />} />

        {/* Hospital Operations */}
        <Route path="reception" element={<AdminModulePage />} />
        <Route path="billing" element={<AdminModulePage />} />
        <Route path="notifications" element={<AdminModulePage />} />

        {/* Clinical / Hospital Management */}
        <Route path="admissions" element={<AdminModulePage />} />
        <Route path="rooms" element={<AdminModulePage />} />
        <Route path="beds" element={<AdminModulePage />} />
        <Route path="medical-records" element={<AdminModulePage />} />
        <Route path="laboratory" element={<AdminModulePage />} />
        <Route path="pharmacy" element={<AdminModulePage />} />
        <Route path="inventory" element={<AdminModulePage />} />

        {/* Finance */}
        <Route path="payments" element={<AdminModulePage />} />
        <Route path="insurance" element={<AdminModulePage />} />

        {/* Patient Experience */}
        <Route path="complaints" element={<AdminModulePage />} />
        <Route path="feedback" element={<AdminModulePage />} />
        <Route path="documents" element={<AdminModulePage />} />

        {/* Reports */}
        <Route path="reports" element={<ServiceRequests />} />

        {/* System */}
        <Route path="roles" element={<AdminModulePage />} />
        <Route path="settings" element={<AdminModulePage />} />
        <Route path="audit-logs" element={<AdminModulePage />} />
      </Route>


      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;