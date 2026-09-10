import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  Phone,
  CalendarDays,
  Activity,
  UserRound,
  Stethoscope,
  Clock3,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserPatients,
} from "../../data/workforceData";

const Patients = ({ user }) => {
  const navigate = useNavigate();

  const employeeId =
    user?.employeeId ||
    user?.id ||
    localStorage.getItem("employeeId") ||
    "EMP-1001";

  const profile =
    getWorkforceUser(employeeId) ||
    getWorkforceUser("EMP-1001");

  /*
   * getUserPatients() should return only patients connected
   * to this workforce member through appointments, treatment,
   * or direct patient assignment.
   */
  const patients = getUserPatients(profile?.id || employeeId);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const counts = useMemo(() => {
    return {
      all: patients.length,

      active: patients.filter(
        (patient) =>
          patient.status?.toLowerCase() === "active"
      ).length,

      admitted: patients.filter(
        (patient) =>
          patient.status?.toLowerCase() === "admitted"
      ).length,

      discharged: patients.filter(
        (patient) =>
          patient.status?.toLowerCase() === "discharged"
      ).length,
    };
  }, [patients]);

  const hasFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "All";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const openPatient = (patient) => {
    if (!patient?.patientId) return;

    navigate(
      `/workforce/patients/${patient.patientId}`
    );
  };

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-b border-[#DCEBE9] pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-[#08A6A0]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#08A6A0]">
                Patient Care
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[#073F42] sm:text-3xl">
              My Patients
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm text-[#6B7F7B]">
              Patients connected to your appointments,
              treatment responsibilities, and assigned care.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-lg border border-[#DCEBE9] bg-white px-4 py-3 sm:self-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#087F7A]">
              <UserRound className="h-4 w-4" />
            </div>

            <div>
              <p className="text-lg font-semibold leading-none text-[#073F42]">
                {patients.length}
              </p>

              <p className="mt-1 text-[10px] text-[#819596]">
                Patients under care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Summary                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-xl border border-[#DCEBE9] bg-white">
        <div className="grid grid-cols-2 divide-x divide-y divide-[#E8F0EF] lg:grid-cols-4 lg:divide-y-0">
          <SummaryItem
            label="All Patients"
            value={counts.all}
            active={statusFilter === "All"}
            onClick={() => setStatusFilter("All")}
          />

          <SummaryItem
            label="Active Care"
            value={counts.active}
            active={statusFilter === "Active"}
            onClick={() => setStatusFilter("Active")}
          />

          <SummaryItem
            label="Admitted"
            value={counts.admitted}
            active={statusFilter === "Admitted"}
            onClick={() => setStatusFilter("Admitted")}
          />

          <SummaryItem
            label="Discharged"
            value={counts.discharged}
            active={statusFilter === "Discharged"}
            onClick={() => setStatusFilter("Discharged")}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Search                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search patient, ID, condition..."
            className="h-10 w-full rounded-lg border border-[#DCEBE9] bg-white pl-10 pr-10 text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#819596] hover:bg-[#E8F8F6] hover:text-[#087F7A]"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#819596]" />

          <div className="flex flex-wrap gap-1.5">
            {[
              "All",
              "Active",
              "Admitted",
              "Discharged",
            ].map((status) => {
              const selected =
                statusFilter === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    selected
                      ? "bg-[#073F42] text-white"
                      : "bg-white text-[#55716E] hover:bg-[#E8F8F6] hover:text-[#087F7A]"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 text-xs font-medium text-[#08A6A0] hover:text-[#073F42]"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Patient List                                                       */}
      {/* ------------------------------------------------------------------ */}

      {filteredPatients.length > 0 ? (
        <section className="overflow-hidden rounded-xl border border-[#DCEBE9] bg-white">
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-[#E2EFED] bg-[#F8FCFB]">
                  <TableHeader>Patient</TableHeader>
                  <TableHeader>Care / Condition</TableHeader>
                  <TableHeader>Department</TableHeader>
                  <TableHeader>Appointment / Admission</TableHeader>
                  <TableHeader>Contact</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <PatientRow
                    key={
                      patient.id ||
                      patient.patientId
                    }
                    patient={patient}
                    onClick={() =>
                      openPatient(patient)
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-[#E8F0EF] md:hidden">
            {filteredPatients.map((patient) => (
              <MobilePatient
                key={
                  patient.id ||
                  patient.patientId
                }
                patient={patient}
                onClick={() =>
                  openPatient(patient)
                }
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#E8F0EF] bg-[#FCFEFD] px-4 py-3 sm:px-5">
            <p className="text-xs text-[#819596]">
              Showing{" "}
              <span className="font-semibold text-[#31585A]">
                {filteredPatients.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#31585A]">
                {patients.length}
              </span>
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-[#08A6A0] hover:text-[#073F42]"
              >
                Reset
              </button>
            )}
          </div>
        </section>
      ) : (
        <EmptyState
          hasFilters={hasFilters}
          onClear={clearFilters}
        />
      )}
    </div>
  );
};

export default Patients;

/* ========================================================================== */
/* Summary Item                                                               */
/* ========================================================================== */

const SummaryItem = ({
  label,
  value,
  active,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between px-5 py-4 text-left transition ${
        active
          ? "bg-[#F2FAF9]"
          : "bg-white hover:bg-[#FAFCFC]"
      }`}
    >
      <div>
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${
            active
              ? "text-[#087F7A]"
              : "text-[#819596]"
          }`}
        >
          {label}
        </p>

        <p className="mt-1 text-xl font-semibold leading-none text-[#073F42]">
          {value}
        </p>
      </div>

      {active && (
        <span className="h-1.5 w-1.5 rounded-full bg-[#08A6A0]" />
      )}
    </button>
  );
};

/* ========================================================================== */
/* Table Header                                                               */
/* ========================================================================== */

const TableHeader = ({ children }) => {
  return (
    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#819596] first:pl-5">
      {children}
    </th>
  );
};

/* ========================================================================== */
/* Desktop Patient Row                                                        */
/* ========================================================================== */

const PatientRow = ({
  patient,
  onClick,
}) => {
  return (
    <tr
      onClick={onClick}
      className="group cursor-pointer border-b border-[#E8F0EF] transition hover:bg-[#FBFDFD]"
    >
      {/* Patient */}
      <td className="px-4 py-4 pl-5">
        <div className="flex items-center gap-3">
          <PatientAvatar name={patient.name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#073F42]">
              {patient.name || "Unknown Patient"}
            </p>

            <p className="mt-0.5 text-[11px] text-[#819596]">
              {patient.patientId || "No patient ID"}
            </p>
          </div>
        </div>
      </td>

      {/* Condition */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6] text-[#08A6A0]">
            <Activity className="h-3.5 w-3.5" />
          </span>

          <span className="max-w-[180px] truncate text-sm font-medium text-[#31585A]">
            {patient.condition || "General Care"}
          </span>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-4">
        <span className="text-sm text-[#55716E]">
          {patient.department || "Not assigned"}
        </span>
      </td>

      {/* Admission */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-[#819596]" />

          <span className="text-xs text-[#55716E]">
            {patient.admissionDate ||
              "No admission date"}
          </span>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-[#819596]" />

          <span className="text-xs text-[#55716E]">
            {patient.phone || "Not available"}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge status={patient.status} />
      </td>

      {/* Arrow */}
      <td className="px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9AAEAF] transition group-hover:bg-[#E8F8F6] group-hover:text-[#087F7A]">
          <ChevronRight className="h-4 w-4" />
        </div>
      </td>
    </tr>
  );
};

/* ========================================================================== */
/* Mobile Patient                                                             */
/* ========================================================================== */

const MobilePatient = ({
  patient,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full p-4 text-left transition active:bg-[#F8FCFB]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PatientAvatar name={patient.name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#073F42]">
              {patient.name || "Unknown Patient"}
            </p>

            <p className="mt-0.5 text-[11px] text-[#819596]">
              {patient.patientId || "No patient ID"}
            </p>
          </div>
        </div>

        <StatusBadge status={patient.status} />
      </div>

      <div className="mt-4 rounded-lg border border-[#E8F0EF] bg-[#FAFCFC] p-3">
        <div className="flex items-start gap-2.5">
          <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[#08A6A0]" />

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9AAEAF]">
              Current Care
            </p>

            <p className="mt-1 text-xs font-medium text-[#31585A]">
              {patient.condition || "General Care"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
        <MobileDetail
          icon={
            <Stethoscope className="h-3.5 w-3.5" />
          }
          label="Department"
          value={
            patient.department ||
            "Not assigned"
          }
        />

        <MobileDetail
          icon={
            <CalendarDays className="h-3.5 w-3.5" />
          }
          label="Admission"
          value={
            patient.admissionDate ||
            "Not available"
          }
        />

        <MobileDetail
          icon={
            <Phone className="h-3.5 w-3.5" />
          }
          label="Contact"
          value={
            patient.phone ||
            "Not available"
          }
        />

        <MobileDetail
          icon={
            <Clock3 className="h-3.5 w-3.5" />
          }
          label="Status"
          value={patient.status || "Unknown"}
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#E8F0EF] pt-3">
        <span className="text-xs font-medium text-[#087F7A]">
          Open patient record
        </span>

        <ChevronRight className="h-4 w-4 text-[#819596]" />
      </div>
    </button>
  );
};

/* ========================================================================== */
/* Mobile Detail                                                              */
/* ========================================================================== */

const MobileDetail = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[#08A6A0]">
        {icon}

        <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-[#9AAEAF]">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-xs font-medium text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* ========================================================================== */
/* Avatar                                                                     */
/* ========================================================================== */

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
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-xs font-semibold text-[#087F7A]">
      {initials}
    </div>
  );
};

/* ========================================================================== */
/* Status                                                                     */
/* ========================================================================== */

const StatusBadge = ({ status }) => {
  const normalized =
    status?.toLowerCase() || "unknown";

  const statusMap = {
    active: {
      label: "Active",
      background: "bg-[#EAF7EF]",
      text: "text-[#16834A]",
      dot: "bg-[#20A35A]",
    },

    admitted: {
      label: "Admitted",
      background: "bg-[#EDF5FF]",
      text: "text-[#2773C7]",
      dot: "bg-[#3B82D0]",
    },

    discharged: {
      label: "Discharged",
      background: "bg-[#F1F4F4]",
      text: "text-[#667877]",
      dot: "bg-[#8A9A98]",
    },

    pending: {
      label: "Pending",
      background: "bg-[#FFF6DE]",
      text: "text-[#A66A00]",
      dot: "bg-[#D89A16]",
    },

    unknown: {
      label: "Unknown",
      background: "bg-[#F1F4F4]",
      text: "text-[#667877]",
      dot: "bg-[#8A9A98]",
    },
  };

  const current =
    statusMap[normalized] ||
    statusMap.unknown;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${current.background} ${current.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
      />

      {current.label}
    </span>
  );
};

/* ========================================================================== */
/* Empty State                                                                */
/* ========================================================================== */

const EmptyState = ({
  hasFilters,
  onClear,
}) => {
  return (
    <section className="rounded-xl border border-dashed border-[#CFE1DE] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
        <UserRound className="h-5 w-5" />
      </div>

      <h2 className="mt-4 text-base font-semibold text-[#073F42]">
        No patients found
      </h2>

      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#819596]">
        {hasFilters
          ? "No patients match your current search or status filter."
          : "No patients are currently connected to your care."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-lg bg-[#073F42] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#087F7A]"
        >
          Clear filters
        </button>
      )}
    </section>
  );
};