import { useMemo, useState } from "react";
import {
  Archive,
  Activity,
  BedDouble,
  ChevronRight,
  Droplets,
  Edit3,
  Eye,
  HeartPulse,
  Phone,
  UserPlus,
  Users,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import PatientForm from "../../../components/admin/PatientForm";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import PatientProfile from "../../../components/admin/PatientProfile";

import { patientData } from "../../../data/patientData";

/* =========================================================
   HELPERS
========================================================= */

const safeArray = (value) => (Array.isArray(value) ? value : []);

const getInitials = (name = "") => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "P"
  );
};

const getPatientName = (patient) =>
  patient?.fullName || patient?.name || "Unnamed Patient";

const getPatientId = (patient) =>
  patient?.patientId || patient?.registrationNumber || patient?.id || "N/A";

const getRoomBed = (patient) => {
  if (patient?.roomBed) return patient.roomBed;

  if (patient?.roomNumber || patient?.bedNumber) {
    return `${patient.roomNumber || "-"} / ${patient.bedNumber || "-"}`;
  }

  if (patient?.room || patient?.bed) {
    return `${patient.room || "-"} / ${patient.bed || "-"}`;
  }

  return "Not Assigned";
};

const getAppointmentCount = (patient) => {
  if (Array.isArray(patient?.appointments)) {
    return patient.appointments.length;
  }

  return (
    patient?.appointmentCount ||
    patient?.appointmentsCount ||
    0
  );
};

const getServiceCount = (patient) => {
  if (Array.isArray(patient?.activeServices)) {
    return patient.activeServices.length;
  }

  if (Array.isArray(patient?.services)) {
    return patient.services.length;
  }

  return patient?.serviceCount || 0;
};

const getAdmissionStatus = (patient) => {
  if (patient?.admissionStatus) {
    return patient.admissionStatus;
  }

  if (patient?.status === "Admitted") {
    return "Admitted";
  }

  return "Not Admitted";
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const styles = {
    Active:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    "Under Treatment":
      "border-blue-200 bg-blue-50 text-blue-700",

    Registered:
      "border-slate-200 bg-slate-50 text-slate-700",

    Admitted:
      "border-purple-200 bg-purple-50 text-purple-700",

    Completed:
      "border-teal-200 bg-teal-50 text-teal-700",

    Inactive:
      "border-red-200 bg-red-50 text-red-700",

    Pending:
      "border-amber-200 bg-amber-50 text-amber-700",

    Discharged:
      "border-orange-200 bg-orange-50 text-orange-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[status] ||
        "border-slate-200 bg-slate-50 text-slate-600"
        }`}
    >
      {status || "Unknown"}
    </span>
  );
};

/* =========================================================
   PATIENT AVATAR
========================================================= */

const PatientAvatar = ({ patient }) => {
  const name = getPatientName(patient);

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-sm font-bold text-[#073F42]">
      {getInitials(name)}
    </div>
  );
};

/* =========================================================
   FILTER SELECT
========================================================= */

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1.5 block text-xs font-semibold text-[#527071]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-10 w-full rounded-lg
          border border-[#D9E9E7]
          bg-[#FAFDFC]
          px-3
          text-sm text-[#173F41]
          outline-none
          transition
          focus:border-[#08A6A0]
          focus:ring-2
          focus:ring-[#08A6A0]/10
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/* =========================================================
   DESKTOP PATIENT ROW
========================================================= */

const PatientRow = ({
  patient,
  onView,
  onEdit,
  onArchive,
}) => {
  const name = getPatientName(patient);
  const patientId = getPatientId(patient);
  const services = getServiceCount(patient);
  const appointments = getAppointmentCount(patient);

  return (
    <tr className="border-b border-[#EAF2F0] transition hover:bg-[#FAFDFC]">
      {/* Patient */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <PatientAvatar patient={patient} />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#173F41]">
              {name}
            </p>

            <p className="mt-0.5 text-xs text-[#819596]">
              {patientId}
            </p>
          </div>
        </div>
      </td>

      {/* Age / Gender */}
      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-[#31585A]">
          {patient.age || "-"} yrs
        </p>

        <p className="mt-0.5 text-xs text-[#819596]">
          {patient.gender || "-"}
        </p>
      </td>

      {/* Blood */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Droplets
            size={15}
            className="text-red-500"
          />

          <span className="text-sm font-semibold text-[#31585A]">
            {patient.bloodGroup || "-"}
          </span>
        </div>
      </td>

      {/* Contact */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Phone
            size={14}
            className="text-[#08A6A0]"
          />

          <span className="text-sm text-[#31585A]">
            {patient.phone || "No phone"}
          </span>
        </div>
      </td>

      {/* Admission */}
      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-[#31585A]">
          {getAdmissionStatus(patient)}
        </p>

        <p className="mt-0.5 text-xs text-[#819596]">
          {getRoomBed(patient)}
        </p>
      </td>

      {/* Activity */}
      <td className="px-4 py-4">
        <div className="space-y-1">
          <p className="text-xs text-[#527071]">
            <span className="font-semibold">
              {services}
            </span>{" "}
            services
          </p>

          <p className="text-xs text-[#527071]">
            <span className="font-semibold">
              {appointments}
            </span>{" "}
            appointments
          </p>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge status={patient.status} />
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onView(patient)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#527071] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
            title="View patient"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(patient)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#527071] transition hover:bg-blue-50 hover:text-blue-600"
            title="Edit patient"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            onClick={() => onArchive(patient)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#527071] transition hover:bg-red-50 hover:text-red-600"
            title="Archive patient"
          >
            <Archive size={16} />
          </button>

          <button
            type="button"
            onClick={() => onView(patient)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#527071] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
            title="Open details"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   MOBILE PATIENT CARD
========================================================= */

const PatientMobileCard = ({
  patient,
  onView,
  onEdit,
  onArchive,
}) => {
  const name = getPatientName(patient);

  return (
    <div className="rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PatientAvatar patient={patient} />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#173F41]">
              {name}
            </p>

            <p className="mt-0.5 text-xs text-[#819596]">
              {getPatientId(patient)}
            </p>
          </div>
        </div>

        <StatusBadge status={patient.status} />
      </div>

      {/* Information */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Age / Gender
          </p>

          <p className="mt-1 text-sm font-semibold text-[#31585A]">
            {patient.age || "-"} / {patient.gender || "-"}
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Blood Group
          </p>

          <p className="mt-1 text-sm font-semibold text-[#31585A]">
            {patient.bloodGroup || "-"}
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Admission
          </p>

          <p className="mt-1 text-sm font-semibold text-[#31585A]">
            {getAdmissionStatus(patient)}
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Room / Bed
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[#31585A]">
            {getRoomBed(patient)}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-3 flex items-center gap-2 text-xs text-[#527071]">
        <Phone
          size={14}
          className="text-[#08A6A0]"
        />

        {patient.phone || "No phone"}
      </div>

      {/* Activity */}
      <div className="mt-3 flex gap-4 text-xs text-[#819596]">
        <span>
          <strong className="text-[#31585A]">
            {getAppointmentCount(patient)}
          </strong>{" "}
          appointments
        </span>

        <span>
          <strong className="text-[#31585A]">
            {getServiceCount(patient)}
          </strong>{" "}
          services
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-[#EAF2F0] pt-3">
        <button
          type="button"
          onClick={() => onView(patient)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-semibold text-[#073F42] transition hover:bg-[#DDF3F0]"
        >
          <Eye size={14} />
          View
        </button>

        <button
          type="button"
          onClick={() => onEdit(patient)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          title="Edit patient"
        >
          <Edit3 size={15} />
        </button>

        <button
          type="button"
          onClick={() => onArchive(patient)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          title="Archive patient"
        >
          <Archive size={15} />
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   PATIENTS PAGE
========================================================= */

const Patients = () => {
  const [patients, setPatients] = useState(
    safeArray(patientData)
  );

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");

  const [bloodFilter, setBloodFilter] = useState("All");

  const [admissionFilter, setAdmissionFilter] =
    useState("All");

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [showPatientForm, setShowPatientForm] =
    useState(false);

  const [editingPatient, setEditingPatient] =
    useState(null);

  const [patientToArchive, setPatientToArchive] =
    useState(null);

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const statusOptions = useMemo(() => {
    const statuses = new Set(
      patients
        .map((patient) => patient?.status)
        .filter(Boolean)
    );

    return [
      { value: "All", label: "All Status" },
      ...Array.from(statuses).map((status) => ({
        value: status,
        label: status,
      })),
    ];
  }, [patients]);

  const bloodOptions = useMemo(() => {
    const bloodGroups = new Set(
      patients
        .map((patient) => patient?.bloodGroup)
        .filter(Boolean)
    );

    return [
      { value: "All", label: "All Blood Groups" },
      ...Array.from(bloodGroups).map((blood) => ({
        value: blood,
        label: blood,
      })),
    ];
  }, [patients]);

  const admissionOptions = [
    { value: "All", label: "All Admission" },
    { value: "Admitted", label: "Admitted" },
    {
      value: "Not Admitted",
      label: "Not Admitted",
    },
  ];

  /* =======================================================
     FILTER PATIENTS
  ======================================================= */

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const services = safeArray(
        patient?.activeServices
      );

      const serviceText = services
        .map((service) =>
          typeof service === "string"
            ? service
            : service?.name ||
            service?.serviceName ||
            ""
        )
        .join(" ");

      const roomBed = getRoomBed(patient);

      const searchableText = [
        getPatientName(patient),
        getPatientId(patient),
        patient?.phone,
        patient?.email,
        patient?.address,
        patient?.bloodGroup,
        patient?.gender,
        patient?.status,
        patient?.doctorName,
        patient?.assignedDoctor,
        roomBed,
        serviceText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        patient?.status === statusFilter;

      const matchesBlood =
        bloodFilter === "All" ||
        patient?.bloodGroup === bloodFilter;

      const matchesAdmission =
        admissionFilter === "All" ||
        getAdmissionStatus(patient) ===
        admissionFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBlood &&
        matchesAdmission
      );
    });
  }, [
    patients,
    search,
    statusFilter,
    bloodFilter,
    admissionFilter,
  ]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const stats = useMemo(() => {
    const total = patients.length;

    const registered = patients.filter(
      (patient) =>
        patient?.status === "Registered"
    ).length;

    const admitted = patients.filter(
      (patient) =>
        patient?.status === "Admitted" ||
        getAdmissionStatus(patient) === "Admitted"
    ).length;

    const treatment = patients.filter(
      (patient) =>
        patient?.status === "Under Treatment"
    ).length;

    const active = patients.filter(
      (patient) =>
        patient?.status === "Active"
    ).length;

    return {
      total,
      registered,
      admitted,
      treatment,
      active,
    };
  }, [patients]);

  /* =======================================================
     ADD PATIENT
  ======================================================= */

  const handleAddPatient = () => {
    setEditingPatient(null);
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

  const handlePatientSubmit = (formData) => {
    if (editingPatient) {
      setPatients((currentPatients) =>
        currentPatients.map((patient) =>
          patient.id === editingPatient.id
            ? {
              ...patient,
              ...formData,

              id: editingPatient.id,

              activeServices:
                formData.activeServices ??
                editingPatient.activeServices ??
                [],

              services:
                formData.services ??
                editingPatient.services ??
                [],

              appointments:
                formData.appointments ??
                editingPatient.appointments ??
                [],

              assignedStaff:
                formData.assignedStaff ??
                editingPatient.assignedStaff ??
                [],

              admissionStatus:
                formData.admissionStatus ??
                editingPatient.admissionStatus ??
                "Not Admitted",

              roomBed:
                formData.roomBed ??
                editingPatient.roomBed ??
                "Not Assigned",
            }
            : patient
        )
      );
    } else {
      const newPatient = {
        ...formData,

        id: `PAT-${String(
          patients.length + 1
        ).padStart(4, "0")}`,

        patientId:
          formData.patientId ||
          `PAT-${String(
            patients.length + 1
          ).padStart(4, "0")}`,

        registrationDate:
          formData.registrationDate ||
          new Date().toISOString().split("T")[0],

        status:
          formData.status || "Registered",

        admissionStatus:
          formData.admissionStatus ||
          "Not Admitted",

        roomBed:
          formData.roomBed ||
          "Not Assigned",

        activeServices:
          formData.activeServices || [],

        services:
          formData.services || [],

        appointments:
          formData.appointments || [],

        labTests:
          formData.labTests || [],

        requests:
          formData.requests || [],

        assignedStaff:
          formData.assignedStaff || [],
      };

      setPatients((currentPatients) => [
        ...currentPatients,
        newPatient,
      ]);
    }

    setShowPatientForm(false);
    setEditingPatient(null);
  };

  /* =======================================================
     ARCHIVE PATIENT
  ======================================================= */

  const handleArchivePatient = () => {
    if (!patientToArchive) return;

    setPatients((currentPatients) =>
      currentPatients.map((patient) =>
        patient.id === patientToArchive.id
          ? {
            ...patient,
            status: "Inactive",
          }
          : patient
      )
    );

    setPatientToArchive(null);

    if (
      selectedPatient?.id ===
      patientToArchive.id
    ) {
      setSelectedPatient(null);
    }
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const hasActiveFilters =
    statusFilter !== "All" ||
    bloodFilter !== "All" ||
    admissionFilter !== "All";

  const clearFilters = () => {
    setStatusFilter("All");
    setBloodFilter("All");
    setAdmissionFilter("All");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-5">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <Users size={19} />
            </div>

            <h1 className="text-xl font-bold text-[#073F42] sm:text-2xl">
              Patients
            </h1>
          </div>

          <p className="mt-1 text-xs text-[#819596] sm:text-sm">
            Register patients and manage their hospital records,
            admissions and reception services.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddPatient}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#08A6A0]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#078F8A]
          "
        >
          <UserPlus size={17} />

          <span>Register Patient</span>
        </button>
      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.total}
        />

        <StatCard
          icon={UserPlus}
          label="Registered"
          value={stats.registered}
        />

        <StatCard
          icon={BedDouble}
          label="Admitted"
          value={stats.admitted}
        />

        <StatCard
          icon={HeartPulse}
          label="Under Treatment"
          value={stats.treatment}
        />

        <StatCard
          icon={Activity}
          label="Active"
          value={stats.active}
        />
      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <SearchFilter
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        placeholder="Search name, patient ID, phone, email or room..."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />

          <FilterSelect
            label="Blood Group"
            value={bloodFilter}
            onChange={setBloodFilter}
            options={bloodOptions}
          />

          <FilterSelect
            label="Admission"
            value={admissionFilter}
            onChange={setAdmissionFilter}
            options={admissionOptions}
          />

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-[#D9E9E7]
                  px-3
                  text-xs
                  font-semibold
                  text-[#527071]
                  transition
                  hover:border-[#08A6A0]
                  hover:bg-[#E8F8F6]
                  hover:text-[#08A6A0]
                "
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </SearchFilter>

      {/* =================================================
          RESULT COUNT
      ================================================= */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#173F41]">
            Patient Records
          </p>

          <p className="mt-0.5 text-xs text-[#819596]">
            Showing {filteredPatients.length} of{" "}
            {patients.length} patients
          </p>
        </div>
      </div>

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      <div className="hidden overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-[#E2EFED] bg-[#FAFDFC]">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Patient
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Age / Gender
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Blood
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Contact
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Admission
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Activity
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Status
                </th>

                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <PatientRow
                    key={patient.id || getPatientId(patient)}
                    patient={patient}
                    onView={setSelectedPatient}
                    onEdit={handleEditPatient}
                    onArchive={setPatientToArchive}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-14 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                      <Users size={22} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-[#31585A]">
                      No patients found
                    </p>

                    <p className="mt-1 text-xs text-[#819596]">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          MOBILE CARDS
      ================================================= */}

      <div className="space-y-3 md:hidden">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <PatientMobileCard
              key={patient.id || getPatientId(patient)}
              patient={patient}
              onView={setSelectedPatient}
              onEdit={handleEditPatient}
              onArchive={setPatientToArchive}
            />
          ))
        ) : (
          <div className="rounded-xl border border-[#E2EFED] bg-white px-5 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
              <Users size={22} />
            </div>

            <p className="mt-3 text-sm font-bold text-[#31585A]">
              No patients found
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* =================================================
          PATIENT PROFILE
      ================================================= */}

      <PatientProfile
        patient={selectedPatient}
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onEdit={handleEditPatient}
      />

      {/* =================================================
          ADD / EDIT PATIENT FORM
      ================================================= */}

      {showPatientForm && (
        <PatientForm
          patient={editingPatient}
          onClose={() => {
            setShowPatientForm(false);
            setEditingPatient(null);
          }}
          onSubmit={handlePatientSubmit}
        />
      )}

      {/* =================================================
          ARCHIVE CONFIRMATION
      ================================================= */}

      <ConfirmDialog
        open={!!patientToArchive}
        title="Archive Patient Record?"
        message={
          patientToArchive
            ? `This will mark ${getPatientName(
              patientToArchive
            )} as inactive. The patient's hospital history will not be deleted.`
            : ""
        }
        confirmText="Archive Patient"
        cancelText="Cancel"
        variant="danger"
        onCancel={() => setPatientToArchive(null)}
        onConfirm={handleArchivePatient}
      />
    </div>
  );
};

export default Patients;