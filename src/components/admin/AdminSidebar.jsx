import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  Stethoscope,
  HeartPulse,
  BriefcaseBusiness,
  HandHeart,
  CalendarDays,
  ClipboardList,
  Clock3,
  Droplets,
  Pill,
  Utensils,
  Bed,
  ReceiptText,
  FileText,
  FlaskConical,
  Package,
  MessageSquare,
  Bell,
  ShieldCheck,
  Settings,
  UserCog,
  LogIn,
  ChevronDown,
} from "lucide-react";

const menuSections = [
  /* =====================================================
     OVERVIEW
     ===================================================== */

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

  /* =====================================================
     PATIENT MANAGEMENT
     ===================================================== */

  {
    title: "Patient Management",
    items: [
      {
        label: "Patients",
        path: "/admin/patients",
        icon: UserRound,
      },
      {
        label: "Appointments",
        path: "/admin/appointments",
        icon: CalendarDays,
      },
      {
        label: "Admissions",
        path: "/admin/admissions",
        icon: LogIn,
      },
      {
        label: "Rooms & Beds",
        path: "/admin/rooms",
        icon: Bed,
      },
    ],
  },

  /* =====================================================
     MEDICAL & CARE
     ===================================================== */

  {
    title: "Medical & Care",
    items: [
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
        label: "Services",
        path: "/admin/services",
        icon: HandHeart,
      },
      {
        label: "Lab Tests",
        path: "/admin/lab-tests",
        icon: FlaskConical,
      },
      {
        label: "Requests",
        path: "/admin/requests",
        icon: ClipboardList,
      },
    ],
  },

  /* =====================================================
     STAFF MANAGEMENT
     ===================================================== */

  {
    title: "Staff Management",
    items: [
      {
        label: "Staff",
        path: "/admin/staff",
        icon: BriefcaseBusiness,
      },
      {
        label: "Schedules",
        path: "/admin/schedules",
        icon: Clock3,
      },
      {
        label: "Attendance",
        path: "/admin/attendance",
        icon: UserCog,
      },
    ],
  },

  /* =====================================================
     HOSPITAL OPERATIONS
     ===================================================== */

  {
    title: "Hospital Operations",
    items: [
      {
        label: "Blood Bank",
        path: "/admin/blood",
        icon: Droplets,
      },
      {
        label: "Pharmacy",
        path: "/admin/pharmacy",
        icon: Pill,
      },
      {
        label: "Food & Diet",
        path: "/admin/food",
        icon: Utensils,
      },
      {
        label: "Inventory",
        path: "/admin/inventory",
        icon: Package,
      },
    ],
  },

  /* =====================================================
     FINANCE
     ===================================================== */

  {
    title: "Finance",
    items: [
      {
        label: "Billing",
        path: "/admin/billing",
        icon: ReceiptText,
      },
    ],
  },

  /* =====================================================
     COMMUNICATION
     ===================================================== */

  {
    title: "Communication",
    items: [
      {
        label: "Feedback",
        path: "/admin/feedback",
        icon: MessageSquare,
      },
      {
        label: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
      },
    ],
  },

  /* =====================================================
     ADMINISTRATION
     ===================================================== */

  {
    title: "Administration",
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
      {/* =====================================================
          LOGO
          ===================================================== */}

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Care<span className="text-[#08A6A0]">Core</span>
          </h1>

          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#A8C0C0]">
            Reception Portal
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
      <div className="workforce-sidebar-scroll flex-1 overflow-y-auto sidebar-hide px-3 py-5">
        <nav className="space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              {/* Section title */}
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7F9C9D]">
                {section.title}
              </p>

              {/* Section items */}
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

      {/* =====================================================
          BOTTOM INFO
          ===================================================== */}

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs font-semibold text-white">
            CareCore Reception
          </p>

          <p className="mt-1 text-[11px] leading-4 text-[#91AEAE]">
            Manage patients, medical services, staff, hospital operations
            and finances from one place.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;