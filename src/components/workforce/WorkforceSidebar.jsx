import {
  LayoutDashboard,
  UserRound,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  History,
  Clock3,
  CalendarOff,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function WorkforceSidebar({
  activePage,
  onNavigate,
  user,
}) {
  const role = user?.role?.toLowerCase() || "staff";

  const navigationSections = [
    {
      title: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          path: "/workforce",
          icon: LayoutDashboard,
        },
      ],
    },

    {
      title: "MY WORK",
      items: [
        {
          label: "My Profile",
          path: "/workforce/profile",
          icon: UserRound,
        },
        {
          label: "My Schedule",
          path: "/workforce/schedule",
          icon: CalendarDays,
        },

        ...(role === "doctor" || role === "nurse"
          ? [
              {
                label: "Appointments",
                path: "/workforce/appointments",
                icon: ClipboardList,
              },
            ]
          : []),

        ...(role === "nurse" || role === "staff"
          ? [
              {
                label: "My Assignments",
                path: "/workforce/assignments",
                icon: ClipboardList,
              },
            ]
          : []),
      ],
    },

    {
      title: "PATIENT CARE",
      items: [
        {
          label: "Patient Care",
          path: "/workforce/patients",
          icon: HeartPulse,
        },

        ...(role === "doctor" || role === "nurse"
          ? [
              {
                label: "Patient History",
                path: "/workforce/patients",
                icon: History,
              },
            ]
          : []),
      ],
    },

    {
      title: "ATTENDANCE & LEAVE",
      items: [
        {
          label: "Attendance",
          path: "/workforce/attendance",
          icon: Clock3,
        },
        {
          label: "Leave Requests",
          path: "/workforce/leave",
          icon: CalendarOff,
        },
      ],
    },

    {
      title: "COMMUNICATION",
      items: [
        {
          label: "Notifications",
          path: "/workforce/notifications",
          icon: Bell,
        },
      ],
    },

    {
      title: "SUPPORT",
      items: [
        {
          label: "Help & Support",
          path: "/workforce/help",
          icon: HelpCircle,
        },
      ],
    },

    {
      title: "ACCOUNT",
      items: [
        {
          label: "Settings",
          path: "/workforce/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("auth-change"));

    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col bg-[#073F42]">
            {/* Hospital Heading */}
    <div className="border-b border-white/10 px-5 py-5">
      <h1 className="text-lg font-bold tracking-wide text-white">
        CareCore
      </h1>

      <p className="mt-1 text-xs text-[#B8CDCD]">
        Healthcare Services
      </p>
    </div>
      {/* Navigation */}
      <div className="workforce-sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
        {navigationSections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-[#7F9C9D]">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  activePage === item.path ||
                  window.location.pathname === item.path;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? "bg-[#08A6A0] text-white"
                        : "text-[#B8CDCD] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.9} />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#B8CDCD] transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} strokeWidth={1.9} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}