import { useMemo, useState } from "react";
import {
  Activity,
  Archive,
  CalendarDays,
  ChevronRight,
  Clock3,
  Droplets,
  Edit3,
  Eye,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import PatientForm from "../../../components/admin/PatientForm";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import { patientData } from "../../../data/patientData";

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles = {
  Active:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  "Under Treatment":
    "bg-blue-50 text-blue-700 border-blue-200",

  Registered:
    "bg-slate-50 text-slate-700 border-slate-200",

  Admitted:
    "bg-purple-50 text-purple-700 border-purple-200",

  Completed:
    "bg-green-50 text-green-700 border-green-200",

  Inactive:
    "bg-red-50 text-red-700 border-red-200",
};

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] ||
        "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* =========================================================
   PATIENT AVATAR
========================================================= */

function PatientAvatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
      {getInitials(name)}
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  value,
  onChange,
  children,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
    >
      {children}
    </select>
  );
}

/* =========================================================
   PATIENT ROW
========================================================= */

function PatientRow({
  patient,
  onView,
  onArchive,
}) {
  const services = safeArray(patient.activeServices);

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50">
      {/* Patient */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <PatientAvatar name={patient.name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {patient.name || "Unnamed Patient"}
            </p>

            <p className="text-xs text-slate-500">
              {patient.id || "No ID"}
            </p>
          </div>
        </div>
      </td>

      {/* Age / Gender */}

      <td className="px-5 py-4">
        <div className="text-sm text-slate-700">
          {patient.age || "-"} years
        </div>

        <div className="text-xs text-slate-500">
          {patient.gender || "-"}
        </div>
      </td>

      {/* Blood */}

      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <Droplets
            size={15}
            className="text-red-500"
          />

          {patient.bloodGroup || "-"}
        </span>
      </td>

      {/* Contact */}

      <td className="px-5 py-4">
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {patient.phone || "No phone"}
          </span>

          <span className="flex items-center gap-1.5">
            <Mail size={13} />
            {patient.email || "No email"}
          </span>
        </div>
      </td>

      {/* Status */}

      <td className="px-5 py-4">
        <div className="flex flex-col items-start gap-2">
          <StatusBadge status={patient.status} />

          {services.length > 0 && (
            <span className="text-xs text-slate-500">
              {services.length} service
              {services.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(patient)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
            title="View patient"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() => onArchive(patient)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Archive patient"
          >
            <Archive size={16} />
          </button>

          <button
            type="button"
            onClick={() => onView(patient)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
            title="Open details"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE PATIENT CARD
========================================================= */

function PatientMobileCard({
  patient,
  onView,
  onArchive,
}) {
  const services = safeArray(patient.activeServices);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PatientAvatar name={patient.name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {patient.name || "Unnamed Patient"}
            </p>

            <p className="text-xs text-slate-500">
              {patient.id || "No ID"}
            </p>
          </div>
        </div>

        <StatusBadge status={patient.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-slate-400">
            Age / Gender
          </p>

          <p className="mt-1 font-medium text-slate-700">
            {patient.age || "-"} /{" "}
            {patient.gender || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Blood Group
          </p>

          <p className="mt-1 font-medium text-slate-700">
            {patient.bloodGroup || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Phone
          </p>

          <p className="mt-1 truncate font-medium text-slate-700">
            {patient.phone || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Appointments
          </p>

          <p className="mt-1 font-medium text-slate-700">
            {patient.appointments || 0}
          </p>
        </div>
      </div>

      {/* Services */}

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Services
        </p>

        {services.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {services.map((service, index) => (
              <span
                key={`${service}-${index}`}
                className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
              >
                {service}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-xs text-slate-500">
            No services selected
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => onView(patient)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Eye size={15} />
          View
        </button>

        <button
          type="button"
          onClick={() => onArchive(patient)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <Archive size={15} />
          Archive
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Users size={25} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        No patients found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Try changing your search or filter criteria.
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 flex items-start gap-2">
        {Icon && (
          <Icon
            size={15}
            className="mt-0.5 shrink-0 text-slate-400"
          />
        )}

        <p className="text-sm font-medium text-slate-700">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PATIENT DETAILS
========================================================= */

function PatientDetails({
  patient,
  onClose,
  onEdit,
}) {
  if (!patient) {
    return null;
  }

  const services = safeArray(
    patient.activeServices
  );

  const assignedStaff = safeArray(
    patient.assignedStaff
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <PatientAvatar name={patient.name} />

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {patient.name || "Unnamed Patient"}
              </h2>

              <p className="text-xs text-slate-500">
                Patient ID: {patient.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}

        <div className="max-h-[calc(90vh-75px)] overflow-y-auto p-6">
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Main */}

            <div className="lg:col-span-2">

              {/* Patient Information */}

              <div className="rounded-xl border border-slate-200">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <UserPlus
                      size={17}
                      className="text-emerald-600"
                    />

                    Patient Information
                  </h3>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <DetailItem
                    label="Full Name"
                    value={patient.name}
                  />

                  <DetailItem
                    label="Age"
                    value={
                      patient.age
                        ? `${patient.age} years`
                        : ""
                    }
                  />

                  <DetailItem
                    label="Gender"
                    value={patient.gender}
                  />

                  <DetailItem
                    label="Blood Group"
                    value={patient.bloodGroup}
                  />

                  <DetailItem
                    label="Phone"
                    value={patient.phone}
                    icon={Phone}
                  />

                  <DetailItem
                    label="Email"
                    value={patient.email}
                    icon={Mail}
                  />

                  <DetailItem
                    label="Address"
                    value={patient.address}
                    icon={MapPin}
                  />

                  <DetailItem
                    label="Registration Date"
                    value={patient.registrationDate}
                    icon={CalendarDays}
                  />
                </div>
              </div>

              {/* Emergency Contact */}

              <div className="mt-5 rounded-xl border border-slate-200">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <ShieldCheck
                      size={17}
                      className="text-emerald-600"
                    />

                    Emergency Contact
                  </h3>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <DetailItem
                    label="Contact Person"
                    value={
                      patient.emergencyContact
                    }
                  />

                  <DetailItem
                    label="Emergency Phone"
                    value={
                      patient.emergencyPhone
                    }
                    icon={Phone}
                  />
                </div>
              </div>

              {/* Services */}

              <div className="mt-5 rounded-xl border border-slate-200">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <HeartPulse
                      size={17}
                      className="text-emerald-600"
                    />

                    Active Services

                    {services.length > 0 && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {services.length}
                      </span>
                    )}
                  </h3>
                </div>

                <div className="p-5">
                  {services.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {services.map(
                        (service, index) => (
                          <div
                            key={`${service}-${index}`}
                            className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5"
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                              <HeartPulse
                                size={14}
                              />
                            </span>

                            <span className="text-sm font-medium text-emerald-800">
                              {service}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-slate-50 px-4 py-3">
                      <p className="text-sm text-slate-500">
                        No active services.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}

            <div className="space-y-5">

              {/* Status */}

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Current Status
                </p>

                <div className="mt-3">
                  <StatusBadge status={patient.status} />
                </div>
              </div>

              {/* Admission */}

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Admission
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {patient.admissionStatus ||
                    "Not Admitted"}
                </p>
              </div>

              {/* Appointments */}

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Appointments
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {patient.appointments || 0}
                </p>
              </div>

              {/* Staff */}

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Assigned Staff
                </p>

                {assignedStaff.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {assignedStaff.map(
                      (staff, index) => (
                        <div
                          key={`${staff}-${index}`}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
                        >
                          {staff}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    No staff assigned.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onEdit(patient)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Edit3 size={16} />
              Edit Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PATIENTS PAGE
========================================================= */

function Patients() {
  const [patients, setPatients] = useState(
    Array.isArray(patientData)
      ? patientData
      : []
  );

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [bloodFilter, setBloodFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [showPatientForm, setShowPatientForm] =
    useState(false);

  const [editingPatient, setEditingPatient] =
    useState(null);

  const [patientToArchive, setPatientToArchive] =
    useState(null);

  /* =======================================================
     FILTERED PATIENTS
  ======================================================= */

  const filteredPatients = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return patients.filter((patient) => {
      const name =
        String(patient.name || "")
          .toLowerCase();

      const id =
        String(patient.id || "")
          .toLowerCase();

      const phone =
        String(patient.phone || "")
          .toLowerCase();

      const email =
        String(patient.email || "")
          .toLowerCase();

      const address =
        String(patient.address || "")
          .toLowerCase();

      const services = safeArray(
        patient.activeServices
      );

      const serviceText = services
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        id.includes(query) ||
        phone.includes(query) ||
        email.includes(query) ||
        address.includes(query) ||
        serviceText.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        patient.status === statusFilter;

      const matchesBlood =
        bloodFilter === "All" ||
        patient.bloodGroup === bloodFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBlood
      );
    });
  }, [
    patients,
    search,
    statusFilter,
    bloodFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: patients.length,

      active: patients.filter(
        (patient) =>
          patient.status === "Active"
      ).length,

      admitted: patients.filter(
        (patient) =>
          patient.admissionStatus ===
          "Admitted"
      ).length,

      treatment: patients.filter(
        (patient) =>
          patient.status ===
          "Under Treatment"
      ).length,

      registered: patients.filter(
        (patient) =>
          patient.status === "Registered"
      ).length,
    };
  }, [patients]);

  /* =======================================================
     ADD PATIENT
  ======================================================= */

  const handleAddPatient = () => {
    setEditingPatient(null);
    setSelectedPatient(null);
    setShowPatientForm(true);
  };

  /* =======================================================
     EDIT PATIENT
  ======================================================= */

  const handleEditPatient = (patient) => {
    setSelectedPatient(null);
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  /* =======================================================
     SAVE PATIENT
  ======================================================= */

  const handlePatientSubmit = (
    formData,
    oldPatient
  ) => {
    /* =====================================================
       EDIT EXISTING PATIENT
    ===================================================== */

    if (oldPatient) {
      setPatients((previous) =>
        previous.map((patient) => {
          if (
            patient.id !== oldPatient.id
          ) {
            return patient;
          }

          return {
            ...patient,
            ...formData,

            // ID must never change during edit
            id: patient.id,

            // IMPORTANT:
            // Use services selected in PatientForm
            activeServices: safeArray(
              formData.activeServices
            ),

            // Preserve existing staff
            assignedStaff: safeArray(
              patient.assignedStaff
            ),

            // Preserve appointments
            appointments: Number(
              patient.appointments || 0
            ),
          };
        })
      );
    }

    /* =====================================================
       ADD NEW PATIENT
    ===================================================== */

    else {
      const nextNumber =
        patients.reduce(
          (maximum, patient) => {
            const match =
              String(
                patient.id || ""
              ).match(/PAT-(\d+)/);

            if (!match) {
              return maximum;
            }

            return Math.max(
              maximum,
              Number(match[1])
            );
          },
          1000
        ) + 1;

      const newPatient = {
        id: `PAT-${nextNumber}`,

        ...formData,

        registrationDate:
          formData.registrationDate ||
          new Date()
            .toISOString()
            .split("T")[0],

        status:
          formData.status ||
          "Registered",

        admissionStatus:
          formData.admissionStatus ||
          "Not Admitted",

        // IMPORTANT:
        // Save selected services from the form
        activeServices: safeArray(
          formData.activeServices
        ),

        assignedStaff: [],

        appointments: 0,
      };

      setPatients((previous) => [
        newPatient,
        ...previous,
      ]);
    }

    /* =====================================================
       CLOSE FORM
    ===================================================== */

    setShowPatientForm(false);
    setEditingPatient(null);
  };

  /* =======================================================
     ARCHIVE
  ======================================================= */

  const handleArchive = (patient) => {
    setPatientToArchive(patient);
  };

  /* =======================================================
     CONFIRM ARCHIVE
  ======================================================= */

  const confirmArchive = () => {
    if (!patientToArchive) {
      return;
    }

    const id = patientToArchive.id;

    setPatients((previous) =>
      previous.map((patient) =>
        patient.id === id
          ? {
              ...patient,
              status: "Inactive",
            }
          : patient
      )
    );

    if (
      selectedPatient &&
      selectedPatient.id === id
    ) {
      setSelectedPatient(null);
    }

    setPatientToArchive(null);
  };

  /* =======================================================
     CANCEL ARCHIVE
  ======================================================= */

  const cancelArchive = () => {
    setPatientToArchive(null);
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setBloodFilter("All");
  };

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "All" ||
    bloodFilter !== "All";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Patients
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage patient records, admissions and services.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddPatient}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus size={17} />
          Add Patient
        </button>
      </div>

      {/* ===================================================
          STATS
      =================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.total}
        />

        <StatCard
          icon={Activity}
          label="Active"
          value={stats.active}
        />

        <StatCard
          icon={HeartPulse}
          label="Admitted"
          value={stats.admitted}
        />

        <StatCard
          icon={Clock3}
          label="Under Treatment"
          value={stats.treatment}
        />

        <StatCard
          icon={UserPlus}
          label="New / Registered"
          value={stats.registered}
        />
      </div>

      {/* ===================================================
          SEARCH + FILTER
      =================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, patient ID, phone, email or service..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Filter Button */}

          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (previous) => !previous
              )
            }
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition ${
              showFilters
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Filters
          </button>
        </div>

        {/* Filter Controls */}

        {showFilters && (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center">

            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Under Treatment">
                Under Treatment
              </option>

              <option value="Registered">
                Registered
              </option>

              <option value="Admitted">
                Admitted
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </FilterSelect>

            <FilterSelect
              value={bloodFilter}
              onChange={setBloodFilter}
            >
              <option value="All">
                All Blood Groups
              </option>

              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </FilterSelect>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===================================================
          PATIENT TABLE
      =================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Desktop */}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Patient
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Age / Gender
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Blood
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map(
                  (patient) => (
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      onView={
                        setSelectedPatient
                      }
                      onArchive={
                        handleArchive
                      }
                    />
                  )
                )
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}

        <div className="space-y-3 p-4 lg:hidden">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(
              (patient) => (
                <PatientMobileCard
                  key={patient.id}
                  patient={patient}
                  onView={
                    setSelectedPatient
                  }
                  onArchive={
                    handleArchive
                  }
                />
              )
            )
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Footer */}

        {filteredPatients.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredPatients.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {patients.length}
              </span>{" "}
              patients
            </p>
          </div>
        )}
      </div>

      {/* ===================================================
          PATIENT DETAILS
      =================================================== */}

      {selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onClose={() =>
            setSelectedPatient(null)
          }
          onEdit={handleEditPatient}
        />
      )}

      {/* ===================================================
          PATIENT FORM
      =================================================== */}

      <PatientForm
        open={showPatientForm}
        patient={editingPatient}
        onClose={() => {
          setShowPatientForm(false);
          setEditingPatient(null);
        }}
        onSubmit={handlePatientSubmit}
      />

      {/* ===================================================
          CONFIRM ARCHIVE DIALOG
      =================================================== */}

      <ConfirmDialog
        open={Boolean(patientToArchive)}
        title="Archive Patient?"
        message={
          patientToArchive
            ? `Are you sure you want to archive ${patientToArchive.name}? The patient will remain in the records with an Inactive status.`
            : ""
        }
        confirmText="Archive Patient"
        cancelText="Cancel"
        onCancel={cancelArchive}
        onConfirm={confirmArchive}
        variant="danger"
      />
    </div>
  );
}

export default Patients;
