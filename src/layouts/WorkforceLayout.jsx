import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import WorkforceSidebar from "../components/workforce/WorkforceSidebar";
import WorkforceHeader from "../components/workforce/WorkforceHeader";

export default function WorkforceLayout({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // -----------------------------------------
  // Page Information
  // -----------------------------------------

  const pageInfo = {
    "/workforce": {
      title: "Dashboard",
      subtitle: "Overview of your work and activities",
    },

    "/workforce/profile": {
      title: "My Profile",
      subtitle: "View and manage your professional profile",
    },

    "/workforce/schedule": {
      title: "My Schedule",
      subtitle: "View your daily and upcoming work schedule",
    },

    "/workforce/appointments": {
      title: "Appointments",
      subtitle: "Manage your assigned appointments",
    },

    "/workforce/patients": {
      title: "Patient Care",
      subtitle: "View patients assigned to you",
    },

    "/workforce/assignments": {
      title: "My Assignments",
      subtitle: "View and manage your assigned duties",
    },

    "/workforce/attendance": {
      title: "Attendance",
      subtitle: "Track your attendance and working hours",
    },

    "/workforce/leave": {
      title: "Leave Requests",
      subtitle: "Apply for and track your leave requests",
    },

    "/workforce/notifications": {
      title: "Notifications",
      subtitle: "View your latest notifications and updates",
    },

    "/workforce/settings": {
      title: "Settings",
      subtitle: "Manage your account and preferences",
    },

    "/workforce/help": {
      title: "Help & Support",
      subtitle: "Get help with your CareCore account",
    },
  };

  const currentPage = pageInfo[location.pathname] || {
    title: "Workforce Portal",
    subtitle: "Manage your hospital activities",
  };

  // -----------------------------------------
  // Navigation
  // -----------------------------------------

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // -----------------------------------------
  // Mobile Sidebar
  // -----------------------------------------

  const handleOpenSidebar = () => {
    setMobileMenuOpen(true);
  };

  const handleCloseSidebar = () => {
    setMobileMenuOpen(false);
  };

  // -----------------------------------------
  // Notifications
  // -----------------------------------------

  const handleNotificationClick = () => {
    navigate("/workforce/notifications");
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F9F9]">
      {/* -----------------------------------------
          Mobile Sidebar Overlay
      ----------------------------------------- */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      {/* -----------------------------------------
          Workforce Sidebar
      ----------------------------------------- */}

      <WorkforceSidebar
        activePage={location.pathname}
        onNavigate={handleNavigation}
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        onClose={handleCloseSidebar}
      />

      {/* -----------------------------------------
          Main Application Area

          Desktop:
          260px left space for sidebar

          Mobile:
          Full width
      ----------------------------------------- */}

      <div className="min-h-screen w-full lg:pl-[260px]">
        {/* -----------------------------------------
            Fixed Workforce Header

            The header itself is fixed.
            Do NOT wrap it inside sticky.
        ----------------------------------------- */}

        <WorkforceHeader
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          user={user}
          onMenuClick={handleOpenSidebar}
          onNotificationClick={handleNotificationClick}
        />

        {/* -----------------------------------------
            Page Content

            Header height = 64px

            pt-16 keeps content below the fixed
            header instead of underneath it.
        ----------------------------------------- */}

        <main className="w-full pt-16">
          <div className="min-h-[calc(100vh-64px)] w-full p-3 sm:p-5 md:p-6 lg:p-7">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}