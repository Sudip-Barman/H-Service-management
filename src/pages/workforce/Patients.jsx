import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserRound,
  HeartPulse,
  Activity,
  CalendarDays,
  Phone,
  MapPin,
  Clock3,
  ChevronRight,
  SlidersHorizontal,
  X,
  ArrowUpRight,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserPatients,
} from "../../data/workforceData";

const Patients = ({ user }) => {
  const navigate = useNavigate();

  // -----------------------------------------
  // CURRENT USER
  // -----------------------------------------

  const employeeId =
    user?.employeeId ||
    user?.id ||
    localStorage.getItem("employeeId") ||
    "EMP-1001";

  const profile =
    getWorkforceUser(employeeId) ||
    getWorkforceUser("EMP-1001");

  const patients = getUserPatients(
    profile?.id || employeeId
  );

  // -----------------------------------------
  // STATE
  // -----------------------------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // -----------------------------------------
  // FILTER PATIENTS
  // -----------------------------------------

  const filteredPatients = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        !search ||
        patient.name?.toLowerCase().includes(search) ||
        patient.patientId?.toLowerCase().includes(search) ||
        patient.phone?.toLowerCase().includes(search) ||
        patient.condition?.toLowerCase().includes(search) ||
        patient.department?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        patient.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, statusFilter]);

  // -----------------------------------------
  // STATISTICS
  // -----------------------------------------

  const activePatients = patients.filter(
    (patient) =>
      patient.status?.toLowerCase() === "active"
  ).length;

  const admittedPatients = patients.filter(
    (patient) =>
      patient.status?.toLowerCase() === "admitted"
  ).length;

  const dischargedPatients = patients.filter(
    (patient) =>
      patient.status?.toLowerCase() === "discharged"
  ).length;

  // -----------------------------------------
  // CLEAR FILTERS
  // -----------------------------------------

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const hasFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "All";

  return (
    <div className="space-y-6">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="rounded-3xl border border-[#DCEBE9] bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Title */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                <UserRound className="h-5 w-5" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-[#08A6A0]">
                Patient Care
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">
              My Patients
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#6B7F7B]">
              View and monitor patients connected to your
              assigned responsibilities.
            </p>
          </div>

          {/* Patient Count */}
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#DCEBE9] bg-[#F8FCFB] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D7F4F1] text-[#087F7A]">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-bold leading-5 text-[#073F42]">
                {patients.length}
              </p>

              <p className="mt-1 text-[11px] font-medium text-[#819596]">
                Assigned Patients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          OVERVIEW STATISTICS
      ================================================== */}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <PatientStat
          title="Total Patients"
          value={patients.length}
          icon={<UserRound className="h-5 w-5" />}
          description="Currently assigned"
        />

        <PatientStat
          title="Active"
          value={activePatients}
          icon={<Activity className="h-5 w-5" />}
          description="Under active care"
        />

        <PatientStat
          title="Admitted"
          value={admittedPatients}
          icon={<HeartPulse className="h-5 w-5" />}
          description="Currently admitted"
        />

        <PatientStat
          title="Discharged"
          value={dischargedPatients}
          icon={<CalendarDays className="h-5 w-5" />}
          description="Completed care"
        />
      </section>

      {/* ==================================================
          SEARCH + FILTER
      ================================================== */}

      <section className="rounded-2xl border border-[#DCEBE9] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#8AA0A1]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by patient name, ID, condition..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-[#DCEBE9]
                bg-[#F8FCFB]
                pl-10
                pr-10
                text-sm
                text-[#173F41]
                outline-none
                transition
                placeholder:text-[#9AAEAF]
                focus:border-[#08A6A0]
                focus:bg-white
                focus:ring-2
                focus:ring-[#08A6A0]/10
              "
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Area */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#55716E]">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Status</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "Active", "Admitted", "Discharged"].map(
                (status) => {
                  const isActive =
                    statusFilter === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setStatusFilter(status)
                      }
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                        isActive
                          ? "bg-[#08A6A0] text-white shadow-sm"
                          : "bg-[#F3F7F6] text-[#55716E] hover:bg-[#E8F8F6] hover:text-[#087F7A]"
                      }`}
                    >
                      {status}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8F0EF] pt-3">
            <p className="text-xs text-[#819596]">
              Showing{" "}
              <span className="font-semibold text-[#31585A]">
                {filteredPatients.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#31585A]">
                {patients.length}
              </span>{" "}
              patients
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-[#08A6A0] transition hover:text-[#073F42]"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ==================================================
          PATIENT CONTENT
      ================================================== */}

      {filteredPatients.length === 0 ? (
        <EmptyState
          hasFilters={hasFilters}
          onClear={clearFilters}
        />
      ) : (
        <section>
          {/* Result Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#073F42]">
                Patient List
              </h2>

              <p className="mt-0.5 text-xs text-[#819596]">
                {filteredPatients.length} patient
                {filteredPatients.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>
          </div>

          {/* Desktop Cards */}
          <div className="hidden grid-cols-1 gap-4 md:grid lg:grid-cols-2">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id || patient.patientId}
                patient={patient}
                onView={() =>
                  navigate(
                    `/workforce/patients/${patient.patientId}`
                  )
                }
              />
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id || patient.patientId}
                patient={patient}
                compact
                onView={() =>
                  navigate(
                    `/workforce/patients/${patient.patientId}`
                  )
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Patients;

/* ======================================================
   PATIENT STAT
====================================================== */

const PatientStat = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <div className="group rounded-2xl border border-[#DCEBE9] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
          {icon}
        </div>

        <ArrowUpRight className="h-4 w-4 text-[#C2D5D3] transition group-hover:text-[#08A6A0]" />
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-[#819596]">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-[#073F42]">
          {value}
        </p>

        <p className="mt-1 text-[11px] text-[#9AAEAF]">
          {description}
        </p>
      </div>
    </div>
  );
};

/* ======================================================
   PATIENT CARD
====================================================== */

const PatientCard = ({
  patient,
  compact = false,
  onView,
}) => {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-[#DCEBE9] bg-white shadow-sm transition hover:border-[#BBDDD9] hover:shadow-md ${
        compact ? "p-4" : "p-5"
      }`}
    >
      {/* -----------------------------------------
          Card Header
      ----------------------------------------- */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PatientAvatar name={patient.name} />

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#073F42] sm:text-base">
              {patient.name || "Unknown Patient"}
            </h3>

            <p className="mt-0.5 text-xs text-[#819596]">
              {patient.patientId || "No patient ID"}
            </p>
          </div>
        </div>

        <StatusBadge status={patient.status} />
      </div>

      {/* -----------------------------------------
          Condition
      ----------------------------------------- */}

      <div className="mt-5 rounded-xl border border-[#E2EFED] bg-[#F8FCFB] p-3.5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
            <HeartPulse className="h-4.5 w-4.5" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#819596]">
              Current Condition
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#31585A]">
              {patient.condition || "General Care"}
            </p>
          </div>
        </div>
      </div>

      {/* -----------------------------------------
          Patient Details
      ----------------------------------------- */}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <PatientDetail
          icon={<Phone className="h-4 w-4" />}
          label="Phone"
          value={patient.phone}
        />

        <PatientDetail
          icon={<MapPin className="h-4 w-4" />}
          label="Department"
          value={patient.department}
        />

        <PatientDetail
          icon={<CalendarDays className="h-4 w-4" />}
          label="Admission"
          value={patient.admissionDate}
        />

        <PatientDetail
          icon={<Clock3 className="h-4 w-4" />}
          label="Status"
          value={patient.status || "Unknown"}
        />
      </div>

      {/* -----------------------------------------
          Action
      ----------------------------------------- */}

      <button
        type="button"
        onClick={onView}
        className="mt-5 flex w-full items-center justify-between rounded-xl border border-[#DCEBE9] bg-white px-4 py-3 text-sm font-semibold text-[#087F7A] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]"
      >
        <span>View Patient Details</span>

        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </article>
  );
};

/* ======================================================
   PATIENT AVATAR
====================================================== */

const PatientAvatar = ({ name }) => {
  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PT";

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D7F4F1] text-sm font-bold text-[#087F7A]">
      {initials}
    </div>
  );
};

/* ======================================================
   STATUS BADGE
====================================================== */

const StatusBadge = ({ status }) => {
  const normalizedStatus =
    status?.toLowerCase() || "unknown";

  const statusConfig = {
    active: {
      label: "Active",
      className: "bg-[#E7F7EE] text-[#16834A]",
      dot: "bg-[#20A35A]",
    },

    admitted: {
      label: "Admitted",
      className: "bg-[#EAF3FF] text-[#2773C7]",
      dot: "bg-[#3B82D0]",
    },

    discharged: {
      label: "Discharged",
      className: "bg-[#F1F4F4] text-[#667877]",
      dot: "bg-[#8A9A98]",
    },

    pending: {
      label: "Pending",
      className: "bg-[#FFF6DE] text-[#A66A00]",
      dot: "bg-[#D89A16]",
    },

    unknown: {
      label: "Unknown",
      className: "bg-[#F1F4F4] text-[#667877]",
      dot: "bg-[#8A9A98]",
    },
  };

  const config =
    statusConfig[normalizedStatus] ||
    statusConfig.unknown;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
      />

      {config.label}
    </span>
  );
};

/* ======================================================
   PATIENT DETAIL
====================================================== */

const PatientDetail = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[#08A6A0]">
        {icon}

        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-xs font-semibold text-[#31585A]">
        {value || "Not available"}
      </p>
    </div>
  );
};

/* ======================================================
   EMPTY STATE
====================================================== */

const EmptyState = ({
  hasFilters,
  onClear,
}) => {
  return (
    <section className="rounded-3xl border border-[#DCEBE9] bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F8F6] text-[#08A6A0]">
        <UserRound className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#073F42]">
        No Patients Found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#819596]">
        {hasFilters
          ? "No patients match your current search or status filter."
          : "There are currently no patients assigned to your account."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#087F7A]"
        >
          Clear Filters
        </button>
      )}
    </section>
  );
};
