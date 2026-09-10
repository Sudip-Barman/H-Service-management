import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Search,
  Phone,
  CalendarDays,
  MapPin,
  HeartPulse,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserPatients,
} from "../../data/workforceData";

const Patients = ({ user }) => {
  const navigate = useNavigate();

  const employeeId = user?.id || "EMP-1001";

  const profile =
    getWorkforceUser(employeeId) || getWorkforceUser("EMP-1001");

  const patients = getUserPatients(employeeId);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        patient.name?.toLowerCase().includes(search) ||
        patient.patientId?.toLowerCase().includes(search) ||
        patient.phone?.toLowerCase().includes(search) ||
        patient.condition?.toLowerCase().includes(search) ||
        patient.department?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        patient.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, statusFilter]);

  const activePatients = patients.filter(
    (patient) => patient.status?.toLowerCase() === "active"
  ).length;

  const admittedPatients = patients.filter(
    (patient) => patient.status?.toLowerCase() === "admitted"
  ).length;

  const dischargedPatients = patients.filter(
    (patient) => patient.status?.toLowerCase() === "discharged"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate("/workforce")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#08A6A0] transition hover:text-[#073F42]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold text-[#073F42]">
            My Patients
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage patients connected to your role.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#E8F8F6] px-4 py-2.5 text-sm font-semibold text-[#087d79]">
          <UserRound size={18} />
          {patients.length} Patients
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Total Patients"
          value={patients.length}
          icon={<UserRound size={20} />}
        />

        <SummaryCard
          title="Active"
          value={activePatients}
          icon={<HeartPulse size={20} />}
        />

        <SummaryCard
          title="Admitted"
          value={admittedPatients}
          icon={<MapPin size={20} />}
        />

        <SummaryCard
          title="Discharged"
          value={dischargedPatients}
          icon={<CalendarDays size={20} />}
        />
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patient, ID, condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Admitted", "Discharged"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  statusFilter === status
                    ? "bg-[#08A6A0] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-[#E8F8F6] hover:text-[#087d79]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <UserRound size={26} />
          </div>

          <h3 className="text-lg font-semibold text-[#073F42]">
            No Patients Found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Condition
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient) => (
                    <PatientTableRow
                      key={patient.id || patient.patientId}
                      patient={patient}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id || patient.patientId}
                patient={patient}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* Desktop Patient Row */
const PatientTableRow = ({ patient }) => {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <PatientAvatar name={patient.name} />

          <div>
            <p className="font-semibold text-[#073F42]">
              {patient.name}
            </p>

            <p className="mt-0.5 text-xs text-gray-400">
              {patient.patientId}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={15} className="text-[#08A6A0]" />
          {patient.phone || "Not available"}
        </div>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm font-medium text-[#073F42]">
          {patient.condition || "General Care"}
        </p>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm text-gray-600">
          {patient.department || "Not assigned"}
        </p>
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={patient.status} />
      </td>

      <td className="px-6 py-4 text-right">
        <button className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-[#08A6A0] transition hover:bg-[#E8F8F6]">
          View
          <ChevronRight size={15} />
        </button>
      </td>
    </tr>
  );
};

/* Mobile Patient Card */
const PatientCard = ({ patient }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PatientAvatar name={patient.name} />

          <div>
            <h3 className="font-semibold text-[#073F42]">
              {patient.name}
            </h3>

            <p className="mt-0.5 text-xs text-gray-400">
              {patient.patientId}
            </p>
          </div>
        </div>

        <StatusBadge status={patient.status} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailItem
          icon={<Phone size={16} />}
          label="Phone"
          value={patient.phone}
        />

        <DetailItem
          icon={<HeartPulse size={16} />}
          label="Condition"
          value={patient.condition || "General Care"}
        />

        <DetailItem
          icon={<MapPin size={16} />}
          label="Department"
          value={patient.department || "Not assigned"}
        />

        <DetailItem
          icon={<CalendarDays size={16} />}
          label="Admission"
          value={patient.admissionDate || "Not available"}
        />
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-1 rounded-xl bg-[#E8F8F6] py-2.5 text-sm font-semibold text-[#087d79] transition hover:bg-[#d7f3f0]">
        View Patient
        <ChevronRight size={17} />
      </button>
    </div>
  );
};

/* Avatar */
const PatientAvatar = ({ name }) => {
  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PT";

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-sm font-bold text-[#08A6A0]">
      {initials}
    </div>
  );
};

/* Status Badge */
const StatusBadge = ({ status }) => {
  const statusClasses = {
    active: "bg-green-100 text-green-700",
    admitted: "bg-blue-100 text-blue-700",
    discharged: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
  };

  const className =
    statusClasses[status?.toLowerCase()] || "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {status || "Unknown"}
    </span>
  );
};

/* Detail Item */
const DetailItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-[#08A6A0]">{icon}</div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-[#073F42]">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

/* Summary Card */
const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
        {icon}
      </div>

      <p className="text-xs font-medium text-gray-500">{title}</p>

      <p className="mt-1 text-2xl font-bold text-[#073F42]">
        {value}
      </p>
    </div>
  );
};

export default Patients;