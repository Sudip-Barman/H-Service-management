import { Calendar, FileText, Plus, Stethoscope } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function CareManagementSection({ onNewBooking }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "services",
      label: "Services",
      icon: Stethoscope,
      path: "/admin/services",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: Calendar,
      path: "/admin/bookings",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: FileText,
      path: "/admin/appointments",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-teal-800 to-teal-900 p-6 text-white shadow-lg">
      {/* HEADER */}
      <h2 className="mb-6 text-sm font-semibold tracking-widest text-teal-200">
        CARE MANAGEMENT
      </h2>

      {/* MENU ITEMS */}
      <div className="mb-8 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200 ${
                active
                  ? "bg-teal-500 shadow-lg"
                  : "text-teal-100 hover:bg-teal-700/50"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* NEW BOOKING BUTTON */}
      <button
        onClick={onNewBooking}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-600 shadow-md hover:shadow-lg active:scale-95"
      >
        <Plus size={18} />
        <span>New Booking</span>
      </button>
    </div>
  );
}

export default CareManagementSection;
