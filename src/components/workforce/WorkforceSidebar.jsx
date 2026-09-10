import {
  Activity,
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  Clock3,
  X,
} from "lucide-react";

const WorkforceSidebar = ({
  activePage,
  onNavigate,
  user,
  mobileMenuOpen,
  onClose,
}) => {
  const role = user?.role?.toLowerCase() || "staff";

  const navigate = (path) => {
    onNavigate(path);
    onClose?.();
  };

  const isActive = (path) => {
    if (path === "/workforce") {
      return activePage === "/workforce";
    }

    return activePage === path;
  };

  // -----------------------------
  // Overview
  // -----------------------------

  const overviewItems = [
    {
      label: "Dashboard",
      path: "/workforce",
      icon: LayoutDashboard,
    },
  ];

  // -----------------------------
  // My Work
  // -----------------------------

  const workItems = [
    {
      label: "My Profile",
      path: "/workforce/profile",
      icon: User,
    },
    {
      label: "My Schedule",
      path: "/workforce/schedule",
      icon: CalendarDays,
    },
  ];

  if (role === "doctor" || role === "nurse") {
    workItems.push({
      label: "Appointments",
      path: "/workforce/appointments",
      icon: Clock3,
    });
  }

  if (role === "nurse" || role === "staff") {
    workItems.push({
      label: "My Assignments",
      path: "/workforce/assignments",
      icon: ClipboardList,
    });
  }

  // -----------------------------
  // Patient Care
  // -----------------------------

  const patientCareItems = [
    {
      label: "Patient Care",
      path: "/workforce/patients",
      icon: Users,
    },
  ];

  if (role === "doctor" || role === "nurse") {
    patientCareItems.push({
      label: "Patient History",
      path: "/workforce/patients",
      icon: FileText,
    });
  }

  // -----------------------------
  // Attendance & Leave
  // -----------------------------

  const attendanceItems = [
    {
      label: "Attendance",
      path: "/workforce/attendance",
      icon: Activity,
    },
    {
      label: "Leave Requests",
      path: "/workforce/leave",
      icon: CalendarDays,
    },
  ];

  // -----------------------------
  // Communication
  // -----------------------------

  const communicationItems = [
    {
      label: "Notifications",
      path: "/workforce/notifications",
      icon: Bell,
    },
  ];

  // -----------------------------
  // Support
  // -----------------------------

  const supportItems = [
    {
      label: "Help & Support",
      path: "/workforce/help",
      icon: HelpCircle,
    },
  ];

  // -----------------------------
  // Account
  // -----------------------------

  const accountItems = [
    {
      label: "Settings",
      path: "/workforce/settings",
      icon: Settings,
    },
  ];

  // -----------------------------
  // Render Navigation Section
  // -----------------------------

  const renderSection = (title, items) => {
    return (
      <div className="mb-6">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7F9C9D]">
          {title}
        </p>

        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={`${title}-${item.label}`}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#08A6A0] text-white shadow-sm"
                    : "text-[#B8CDCD] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    active ? "text-white" : "text-[#9DB7B7]"
                  }`}
                />

                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-[#073F42] shadow-xl transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* =========================================
          SIDEBAR HEADER
      ========================================== */}
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold tracking-tight text-white">
            CareCore
          </h2>

          <p className="mt-0.5 truncate text-[11px] text-[#9DB7B7]">
            Healthcare Services
          </p>
        </div>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#B8CDCD] transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* =========================================
          NAVIGATION
      ========================================== */}
      <div className="workforce-sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
        {renderSection("Overview", overviewItems)}

        {renderSection("My Work", workItems)}

        {renderSection("Patient Care", patientCareItems)}

        {renderSection("Attendance & Leave", attendanceItems)}

        {renderSection("Communication", communicationItems)}

        {renderSection("Support", supportItems)}

        {renderSection("Account", accountItems)}
      </div>

      {/* =========================================
          USER PROFILE + LOGOUT
      ========================================== */}
      <div className="shrink-0 border-t border-white/10 p-3">


        {/* Logout */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#B8CDCD] transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default WorkforceSidebar;