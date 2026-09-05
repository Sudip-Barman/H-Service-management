import { useLocation } from "react-router-dom";

const moduleNames = {
  patients: "Patient Management",
  staff: "Staff Management",
  doctors: "Doctor Management",
  nurses: "Nursing Management",
  services: "Service Management",
  requests: "Service Requests",
  assignments: "Staff Assignments",
  schedules: "Scheduling",
  shifts: "Staff Shifts",
  attendance: "Attendance Management",
  appointments: "Appointment Management",
  admissions: "Admission Management",
  rooms: "Room Management",
  beds: "Bed Management",
  "medical-records": "Medical Records",
  laboratory: "Laboratory Management",
  pharmacy: "Pharmacy Management",
  inventory: "Inventory Management",
  blood: "Blood Management",
  billing: "Billing Management",
  payments: "Payment Management",
  insurance: "Insurance Management",
  reception: "Reception Management",
  complaints: "Complaint Management",
  feedback: "Feedback Management",
  notifications: "Notifications",
  documents: "Document Management",
  reports: "Reports & Analytics",
  users: "User Management",
  roles: "Roles & Permissions",
  settings: "System Settings",
  "audit-logs": "Audit Logs",
};

const AdminModulePage = () => {
  const location = useLocation();

  const moduleKey = location.pathname.split("/").filter(Boolean).pop();

  const moduleName =
    moduleNames[moduleKey] || "Admin Module";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
          ADMINISTRATION
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">
          {moduleName}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#789092]">
          This module will provide complete administrative control over{" "}
          {moduleName.toLowerCase()}.
        </p>
      </div>

      {/* Coming Module */}
      <div className="rounded-2xl border border-[#E2EFED] bg-white p-8 shadow-sm">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F8F6]">
            <span className="text-2xl font-bold text-[#08A6A0]">
              +
            </span>
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#073F42]">
            {moduleName}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#789092]">
            The structure is ready. We will now implement this module
            with real management features, validation, search,
            filtering, status handling and eventually FastAPI +
            PostgreSQL integration.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-[#E8F8F6] px-3 py-1.5 text-xs font-semibold text-[#087F7A]">
              Search
            </span>

            <span className="rounded-full bg-[#E8F8F6] px-3 py-1.5 text-xs font-semibold text-[#087F7A]">
              Filters
            </span>

            <span className="rounded-full bg-[#E8F8F6] px-3 py-1.5 text-xs font-semibold text-[#087F7A]">
              CRUD
            </span>

            <span className="rounded-full bg-[#E8F8F6] px-3 py-1.5 text-xs font-semibold text-[#087F7A]">
              Validation
            </span>

            <span className="rounded-full bg-[#E8F8F6] px-3 py-1.5 text-xs font-semibold text-[#087F7A]">
              Permissions
            </span>

            <span className="rounded-full bg-[#E8F8F6] px-3 py-1.5 text-xs font-semibold text-[#087F7A]">
              API Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModulePage;