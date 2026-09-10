import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import WorkforceSidebar from "../components/workforce/WorkforceSidebar";
import WorkforceHeader from "../components/workforce/WorkforceHeader";

export default function WorkforceLayout({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    navigate("/workforce/notifications");
  };

  return (
    <div className="min-h-screen bg-[#F6F9F9]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <WorkforceSidebar
          activePage={location.pathname}
          onNavigate={handleNavigation}
          user={user}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <WorkforceSidebar
          activePage={location.pathname}
          onNavigate={handleNavigation}
          user={user}
        />
      </div>

      {/* Main Content */}
      <div className="lg:pl-[260px]">
        <WorkforceHeader
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          user={user}
          onMenuClick={() => setMobileMenuOpen(true)}
          onNotificationClick={handleNotificationClick}
        />

        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-7">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}