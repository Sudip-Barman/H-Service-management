import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Stethoscope,
  HeartPulse,
  BriefcaseBusiness,
  HandHeart,
  CalendarDays,
  ClipboardList,
  Clock3,
  UserCheck,
  Droplets,
  Pill,
  Utensils,
  Siren,
  Building2,
  ReceiptText,
  Bell,
  BarChart3,
  Settings,
  ChevronDown,
} from "lucide-react";

const menuSections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "People",
    items: [
      {
        label: "Users",
        path: "/admin/users",
        icon: Users,
      },
      {
        label: "Patients",
        path: "/admin/patients",
        icon: UserRound,
      },
      {
        label: "Doctors",
        path: "/admin/doctors",
        icon: Stethoscope,
      },
      {
        label: "Nurses",
        path: "/admin/nurses",
        icon: HeartPulse,
      },
      {
        label: "Staff",
        path: "/admin/staff",
        icon: BriefcaseBusiness,
      },
    ],
  },

  {
    title: "Care Management",
    items: [
      {
        label: "Services",
        path: "/admin/services",
        icon: HandHeart,
      },
      {
        label: "Bookings",
        path: "/admin/bookings",
        icon: ClipboardList,
      },
      {
        label: "Appointments",
        path: "/admin/appointments",
        icon: CalendarDays,
      },
      {
        label: "Schedules",
        path: "/admin/schedules",
        icon: Clock3,
      },
    ],
  },

  {
    title: "Workforce",
    items: [
      {
        label: "Shifts",
        path: "/admin/shifts",
        icon: Clock3,
      },
      {
        label: "Assignments",
        path: "/admin/assignments",
        icon: UserCheck,
      },
      {
        label: "Attendance",
        path: "/admin/attendance",
        icon: UserCheck,
      },
    ],
  },

  {
    title: "Hospital Services",
    items: [
      {
        label: "Blood Management",
        path: "/admin/blood",
        icon: Droplets,
      },
      {
        label: "Medicine",
        path: "/admin/medicine",
        icon: Pill,
      },
      {
        label: "Food & Diet",
        path: "/admin/food",
        icon: Utensils,
      },
      {
        label: "Emergency",
        path: "/admin/emergency",
        icon: Siren,
      },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        label: "Reception",
        path: "/admin/reception",
        icon: Building2,
      },
      {
        label: "Billing",
        path: "/admin/billing",
        icon: ReceiptText,
      },
      {
        label: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
      },
    ],
  },

  {
    title: "Analytics",
    items: [
      {
        label: "Reports",
        path: "/admin/reports",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

const AdminSidebar = ({ onClose }) => {
  return (
    <aside className="flex h-full w-72 flex-col bg-[#073F42] text-white">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Care<span className="text-[#08A6A0]">Core</span>
          </h1>

          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#A8C0C0]">
            Admin Portal
          </p>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-[#A8C0C0] transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <ChevronDown className="h-5 w-5 rotate-90" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7F9C9D]">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      end={item.path === "/admin"}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#08A6A0] text-white shadow-lg shadow-black/10"
                            : "text-[#B8CDCD] hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />

                      <span className="truncate">
                        {item.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Info */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs font-semibold text-white">
            CareCore Admin
          </p>

          <p className="mt-1 text-[11px] leading-4 text-[#91AEAE]">
            Manage healthcare services, staff and operations from one place.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;