import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Archive,
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
import Toast from "../../../components/common/Toast";

import { apiRequest } from "../../../api/api";

/* =========================================================
   HELPERS
========================================================= */

const safeArray = (value) =>
  Array.isArray(value) ? value : [];

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

const getPatientName = (patient) => {
  if (patient?.fullName) return patient.fullName;
  if (patient?.name) return patient.name;

  const fullName = [
    patient?.firstName || patient?.first_name,
    patient?.middleName || patient?.middle_name,
    patient?.lastName || patient?.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Unnamed Patient";
};

const getPatientId = (patient) =>
  patient?.patientId ||
  patient?.patient_id ||
  patient?.registrationNumber ||
  patient?.registration_number ||
  patient?.id ||
  "N/A";

const getRoomBed = (patient) => {
  if (patient?.roomBed && patient.roomBed !== "Not Assigned") return patient.roomBed;
  if (patient?.room_bed) return patient.room_bed;

  if (patient?.roomNumber || patient?.bedNumber) {
    return `${patient.roomNumber || "-"} / ${
      patient.bedNumber || "-"
    }`;
  }

  if (patient?.room || patient?.bed) {
    return `${patient.room || "-"} / ${
      patient.bed || "-"
    }`;
  }

  return patient?.roomBed || "Not Assigned";
};

const getAppointmentCount = (patient) => {
  if (Array.isArray(patient?.appointments) && patient.appointments.length > 0) {
    return patient.appointments.length;
  }

  return (
    patient?.appointmentCount ??
    patient?.appointment_count ??
    patient?.appointmentsCount ??
    (Array.isArray(patient?.appointments) ? patient.appointments.length : 0)
  );
};

const getServiceCount = (patient) => {
  if (Array.isArray(patient?.activeServices) && patient.activeServices.length > 0) {
    return patient.activeServices.length;
  }

  if (patient?.serviceCount !== undefined && patient?.serviceCount !== null) {
    return patient.serviceCount;
  }

  if (patient?.service_count !== undefined && patient?.service_count !== null) {
    return patient.service_count;
  }

  if (Array.isArray(patient?.services)) {
    return patient.services.length;
  }

  return 0;
};

const getAdmissionStatus = (patient) => {
  if (patient?.admissionStatus) {
    return patient.admissionStatus;
  }

  if (patient?.admission_status) {
    return patient.admission_status;
  }

  if (patient?.status === "Admitted") {
    return "Admitted";
  }

  return "Not Admitted";
};

/* =========================================================
   NORMALIZE BACKEND PATIENT
========================================================= */

const normalizePatient = (patient) => {
  const firstName =
    patient?.first_name ||
    patient?.firstName ||
    "";

  const middleName =
    patient?.middle_name ||
    patient?.middleName ||
    "";

  const lastName =
    patient?.last_name ||
    patient?.lastName ||
    "";

  const fullName = [
    firstName,
    middleName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    ...patient,

    id: patient.id,

    registrationNumber:
      patient.registration_number ||
      patient.registrationNumber ||
      "",

    registrationDate:
      patient.registration_date ||
      patient.registrationDate ||
      "",

    firstName,
    middleName,
    lastName,

    fullName:
      patient.fullName ||
      patient.name ||
      fullName ||
      "Unnamed Patient",

    dateOfBirth:
      patient.date_of_birth ||
      patient.dateOfBirth ||
      "",

    bloodGroup:
      patient.blood_group ||
      patient.bloodGroup ||
      "",

    postalCode:
      patient.postal_code ||
      patient.postalCode ||
      "",

    emergencyContactName:
      patient.emergency_contact_name ||
      patient.emergencyContactName ||
      "",

    emergencyContactPhone:
      patient.emergency_contact_phone ||
      patient.emergencyContactPhone ||
      "",

    emergencyContactRelation:
      patient.emergency_contact_relation ||
      patient.emergencyContactRelation ||
      "",

    maritalStatus:
      patient.marital_status ||
      patient.maritalStatus ||
      "",

    patientProblem:
      patient.patient_problem ||
      patient.patientProblem ||
      "",

    digitalSignature:
      patient.digital_signature ||
      patient.digitalSignature ||
      "",

    activeServices:
      patient.activeServices ||
      [],

    services:
      patient.services ||
      [],

    serviceCount:
      patient.serviceCount ??
      patient.service_count ??
      (Array.isArray(patient.services) ? patient.services.length : 0),

    appointments:
      patient.appointments ||
      [],

    appointmentCount:
      patient.appointmentCount ??
      patient.appointment_count ??
      (Array.isArray(patient.appointments) ? patient.appointments.length : 0),

    assignedStaff:
      patient.assignedStaff ||
      [],

    admissionStatus:
      patient.admissionStatus ||
      patient.admission_status ||
      (patient.status === "Admitted"
        ? "Admitted"
        : "Not Admitted"),

    roomBed:
      patient.roomBed ||
      patient.room_bed ||
      "Not Assigned",
  };
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
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] ||
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
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          h-10
          w-full
          rounded-lg
          border
          border-[#D9E9E7]
          bg-[#FAFDFC]
          px-3
          text-sm
          text-[#173F41]
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
          {patient.age ?? "-"} yrs
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
          {/* View */}
          <button
            type="button"
            onClick={() => onView(patient)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#527071] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
            title="View patient"
          >
            <Eye size={16} />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(patient)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#527071] transition hover:bg-blue-50 hover:text-blue-600"
            title="Edit patient"
          >
            <Edit3 size={16} />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onArchive(patient)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#527071] transition hover:bg-red-50 hover:text-red-600"
            title="Delete patient"
          >
            <Archive size={16} />
          </button>

          {/* Details */}
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

      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Age */}
        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Age / Gender
          </p>

          <p className="mt-1 text-sm font-semibold text-[#31585A]">
            {patient.age ?? "-"} /{" "}
            {patient.gender || "-"}
          </p>
        </div>

        {/* Blood */}
        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Blood Group
          </p>

          <p className="mt-1 text-sm font-semibold text-[#31585A]">
            {patient.bloodGroup || "-"}
          </p>
        </div>

        {/* Admission */}
        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Admission
          </p>

          <p className="mt-1 text-sm font-semibold text-[#31585A]">
            {getAdmissionStatus(patient)}
          </p>
        </div>

        {/* Room */}
        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Room / Bed
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[#31585A]">
            {getRoomBed(patient)}
          </p>
        </div>
      </div>

      {/* Phone */}
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
        {/* View */}
        <button
          type="button"
          onClick={() => onView(patient)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-semibold text-[#073F42] transition hover:bg-[#DDF3F0]"
        >
          <Eye size={14} />
          View
        </button>

        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(patient)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          title="Edit patient"
        >
          <Edit3 size={15} />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onArchive(patient)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          title="Delete patient"
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
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [bloodFilter, setBloodFilter] =
    useState("All");

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

  const [deleting, setDeleting] =
    useState(false);

  const [toast, setToast] = useState({
    type: "success",
    title: "",
    message: "",
  });

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = ({
    type = "success",
    title = "",
    message = "",
  }) => {
    setToast({
      type,
      title,
      message,
    });
  };

  const closeToast = () => {
    setToast({
      type: "success",
      title: "",
      message: "",
    });
  };

  /* =======================================================
     AUTO HIDE TOAST
  ======================================================= */

  useEffect(() => {
    if (!toast.message) return;

    const timer = setTimeout(() => {
      setToast({
        type: "success",
        title: "",
        message: "",
      });
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.message]);

  /* =======================================================
     LOAD PATIENTS
  ======================================================= */

  const loadPatients = async () => {
    try {
      setLoading(true);

      const [patientsRes, admissionsRes, bookingsRes] = await Promise.allSettled([
        apiRequest("/api/patients"),
        apiRequest("/api/admissions"),
        apiRequest("/api/bookings"),
      ]);

      const rawPatients =
        patientsRes.status === "fulfilled" && Array.isArray(patientsRes.value)
          ? patientsRes.value
          : [];

      const rawAdmissions =
        admissionsRes.status === "fulfilled"
          ? (Array.isArray(admissionsRes.value)
              ? admissionsRes.value
              : admissionsRes.value?.admissions || admissionsRes.value?.items || [])
          : [];

      const rawBookings =
        bookingsRes.status === "fulfilled" && Array.isArray(bookingsRes.value)
          ? bookingsRes.value
          : [];

      // Correlate patient records with real admissions and bookings
      const enrichedPatients = rawPatients.map((patient) => {
        // Find latest admission record for this patient
        const patientAdmissions = rawAdmissions.filter(
          (a) =>
            a.patient_id === patient.id ||
            (a.patient_registration_number &&
              a.patient_registration_number === patient.registration_number)
        );
        const latestAdmission = patientAdmissions[0] || null;

        // Find bookings for this patient
        const patientBookings = rawBookings.filter(
          (b) =>
            b.patient_id === patient.id ||
            (b.patient_phone && patient.phone && b.patient_phone === patient.phone)
        );

        const serviceBookings = patientBookings.filter(
          (b) =>
            (b.service_id !== null && b.service_id !== undefined) ||
            (b.booking_category &&
              b.booking_category.toLowerCase().includes("service"))
        );

        const appointmentBookings = patientBookings.filter(
          (b) =>
            (b.doctor_id !== null && b.doctor_id !== undefined) ||
            (b.booking_category &&
              (b.booking_category.toLowerCase().includes("consultation") ||
                b.booking_category.toLowerCase().includes("checkup")))
        );

        let admissionStatus =
          patient.admission_status || patient.admissionStatus || "Not Admitted";
        let roomBed = patient.room_bed || patient.roomBed || "Not Assigned";

        if (latestAdmission) {
          admissionStatus = latestAdmission.status || "Admitted";
          if (
            admissionStatus === "Admitted" &&
            (latestAdmission.room_number || latestAdmission.bed_number)
          ) {
            const wardPrefix = latestAdmission.ward
              ? `${latestAdmission.ward} - `
              : "";
            const roomPart = latestAdmission.room_number
              ? `Room ${latestAdmission.room_number}`
              : "";
            const bedPart = latestAdmission.bed_number
              ? latestAdmission.bed_number
              : "";
            roomBed = `${wardPrefix}${roomPart} / ${bedPart}`.trim();
          } else if (admissionStatus !== "Admitted") {
            roomBed = "Not Assigned";
          }
        }

        const effectiveStatus =
          admissionStatus === "Admitted"
            ? "Admitted"
            : (patient.status || "Active");

        const patientServices = Array.isArray(patient.services)
          ? patient.services
          : [];

        const serviceCount = Math.max(
          patient.service_count || 0,
          patientServices.length + serviceBookings.length
        );

        const appointmentCount = Math.max(
          patient.appointment_count || 0,
          appointmentBookings.length
        );

        return normalizePatient({
          ...patient,
          status: effectiveStatus,
          admissionStatus,
          roomBed,
          serviceCount,
          appointmentCount,
          appointments: appointmentBookings,
          activeServices: serviceBookings,
        });
      });

      setPatients(enrichedPatients);
    } catch (error) {
      console.error(
        "Failed to load patients:",
        error
      );

      showToast({
        type: "error",
        title: "Failed to Load Patients",
        message:
          error.message ||
          "Unable to fetch patient records from the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadPatients();
  }, []);

  /* =======================================================
     STATUS OPTIONS
  ======================================================= */

  const statusOptions = useMemo(() => {
    const statuses = new Set(
      patients
        .map(
          (patient) => patient?.status
        )
        .filter(Boolean)
    );

    return [
      {
        value: "All",
        label: "All Status",
      },

      ...Array.from(statuses).map(
        (status) => ({
          value: status,
          label: status,
        })
      ),
    ];
  }, [patients]);

  /* =======================================================
     BLOOD OPTIONS
  ======================================================= */

  const bloodOptions = useMemo(() => {
    const bloodGroups = new Set(
      patients
        .map(
          (patient) =>
            patient?.bloodGroup
        )
        .filter(Boolean)
    );

    return [
      {
        value: "All",
        label: "All Blood Groups",
      },

      ...Array.from(bloodGroups).map(
        (blood) => ({
          value: blood,
          label: blood,
        })
      ),
    ];
  }, [patients]);

  /* =======================================================
     ADMISSION OPTIONS
  ======================================================= */

  const admissionOptions = [
    {
      value: "All",
      label: "All Admission",
    },
    {
      value: "Admitted",
      label: "Admitted",
    },
    {
      value: "Not Admitted",
      label: "Not Admitted",
    },
  ];

  /* =======================================================
     FILTER PATIENTS
  ======================================================= */

  const filteredPatients = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return patients.filter((patient) => {
      const services = safeArray(
        patient?.activeServices?.length
          ? patient.activeServices
          : patient?.services
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

      const roomBed =
        getRoomBed(patient);

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
        patient?.patientProblem,
        patient?.patient_problem,
        roomBed,
        serviceText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        patient?.status ===
          statusFilter;

      const matchesBlood =
        bloodFilter === "All" ||
        patient?.bloodGroup ===
          bloodFilter;

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

    const registered =
      patients.filter(
        (patient) =>
          patient?.status ===
          "Registered"
      ).length;

    const admitted =
      patients.filter(
        (patient) =>
          patient?.status ===
            "Admitted" ||
          getAdmissionStatus(
            patient
          ) === "Admitted"
      ).length;

    const treatment =
      patients.filter(
        (patient) =>
          patient?.status ===
          "Under Treatment"
      ).length;

    const active =
      patients.filter(
        (patient) =>
          patient?.status ===
          "Active"
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

  const handleEditPatient = (
    patient
  ) => {
    setSelectedPatient(null);
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  /* =======================================================
     PATIENT SUBMIT
  ======================================================= */

  const handlePatientSubmit =
    async (patientData) => {
      await loadPatients();

      setShowPatientForm(false);
      setEditingPatient(null);

      showToast({
        type: "success",
        title: editingPatient
          ? "Patient Updated"
          : "Registration Successful",

        message: editingPatient
          ? "Patient information has been updated successfully."
          : "Patient has been registered successfully.",
      });
    };

  /* =======================================================
     DELETE PATIENT
  ======================================================= */

  const handleArchivePatient =
    async () => {
      if (
        !patientToArchive ||
        deleting
      ) {
        return;
      }

      const deletedPatientId =
        patientToArchive.id;

      const deletedPatientName =
        getPatientName(
          patientToArchive
        );

      try {
        setDeleting(true);

        /* ---------------------------------------------------
           IMPORTANT

           We use fetch directly here instead of apiRequest
           because DELETE may return 204 No Content.

           A 204 response has no JSON body, so calling
           response.json() causes:

           "Unexpected end of JSON input"
        --------------------------------------------------- */

        const token =
          localStorage.getItem(
            "access_token"
          );

        const response = await fetch(
          `http://127.0.0.1:8000/api/patients/${deletedPatientId}`,
          {
            method: "DELETE",
            headers: {
              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
          }
        );

        /* ---------------------------------------------------
           READ RESPONSE SAFELY

           DELETE can return:
           - 204 No Content
           - JSON response
           - text response
        --------------------------------------------------- */

        const responseText =
          await response.text();

        let responseData = null;

        if (responseText) {
          try {
            responseData =
              JSON.parse(responseText);
          } catch {
            responseData =
              responseText;
          }
        }

        /* ---------------------------------------------------
           HANDLE SERVER ERROR
        --------------------------------------------------- */

        if (!response.ok) {
          throw new Error(
            responseData?.detail ||
              responseData?.message ||
              responseData ||
              `Failed to delete patient (${response.status})`
          );
        }

        /* ---------------------------------------------------
           IMMEDIATELY REMOVE FROM REACT STATE

           No reload is necessary.

           This makes the patient disappear immediately
           after successful deletion.
        --------------------------------------------------- */

        setPatients(
          (currentPatients) =>
            currentPatients.filter(
              (patient) =>
                patient.id !==
                deletedPatientId
            )
        );

        /* ---------------------------------------------------
           CLOSE DELETE DIALOG
        --------------------------------------------------- */

        setPatientToArchive(null);

        /* ---------------------------------------------------
           CLOSE PROFILE IF OPEN
        --------------------------------------------------- */

        if (
          selectedPatient?.id ===
          deletedPatientId
        ) {
          setSelectedPatient(null);
        }

        /* ---------------------------------------------------
           SUCCESS TOAST
        --------------------------------------------------- */

        showToast({
          type: "success",
          title: "Patient Deleted",
          message: `${deletedPatientName} has been deleted successfully.`,
        });
      } catch (error) {
        console.error(
          "Failed to delete patient:",
          error
        );

        showToast({
          type: "error",
          title: "Delete Failed",
          message:
            error.message ||
            "Unable to delete the patient.",
        });
      } finally {
        setDeleting(false);
      }
    };

  /* =======================================================
     ACTIVE FILTER CHECK
  ======================================================= */

  const hasActiveFilters =
    statusFilter !== "All" ||
    bloodFilter !== "All" ||
    admissionFilter !== "All";

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setStatusFilter("All");
    setBloodFilter("All");
    setAdmissionFilter("All");
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-5">

      {/* ===================================================
          TOAST
      =================================================== */}

      <Toast
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={closeToast}
      />

      {/* ===================================================
          HEADER
      =================================================== */}

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
            Register patients and manage
            their hospital records,
            admissions and reception
            services.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleAddPatient
          }
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
          <span>
            Register Patient
          </span>
        </button>
      </div>

      {/* ===================================================
          STATS
      =================================================== */}

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

      {/* ===================================================
          SEARCH + FILTER
      =================================================== */}

      <SearchFilter
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={
          setShowFilters
        }
        placeholder="Search name, patient ID, phone, email or room..."
      >
        <div className="flex flex-col gap-3 sm:flex-row">

          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={
              setStatusFilter
            }
            options={
              statusOptions
            }
          />

          <FilterSelect
            label="Blood Group"
            value={bloodFilter}
            onChange={
              setBloodFilter
            }
            options={
              bloodOptions
            }
          />

          <FilterSelect
            label="Admission"
            value={
              admissionFilter
            }
            onChange={
              setAdmissionFilter
            }
            options={
              admissionOptions
            }
          />

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={
                  clearFilters
                }
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

      {/* ===================================================
          RECORD COUNT
      =================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#173F41]">
            Patient Records
          </p>

          <p className="mt-0.5 text-xs text-[#819596]">
            Showing{" "}
            {filteredPatients.length}{" "}
            of {patients.length}{" "}
            patients
          </p>
        </div>
      </div>

      {/* ===================================================
          LOADING
      =================================================== */}

      {loading ? (
        <div className="rounded-2xl border border-[#E2EFED] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#D9E9E7] border-t-[#08A6A0]" />

          <p className="mt-4 text-sm font-semibold text-[#31585A]">
            Loading patient records...
          </p>

          <p className="mt-1 text-xs text-[#819596]">
            Fetching data from the
            hospital database.
          </p>
        </div>
      ) : (
        <>
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
                  {filteredPatients.length >
                  0 ? (
                    filteredPatients.map(
                      (patient) => (
                        <PatientRow
                          key={
                            patient.id
                          }
                          patient={
                            patient
                          }
                          onView={
                            setSelectedPatient
                          }
                          onEdit={
                            handleEditPatient
                          }
                          onArchive={
                            setPatientToArchive
                          }
                        />
                      )
                    )
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
                          No patients
                          found
                        </p>

                        <p className="mt-1 text-xs text-[#819596]">
                          {patients.length ===
                          0
                            ? "No patient records have been registered yet."
                            : "Try changing your search or filters."}
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
            {filteredPatients.length >
            0 ? (
              filteredPatients.map(
                (patient) => (
                  <PatientMobileCard
                    key={
                      patient.id
                    }
                    patient={
                      patient
                    }
                    onView={
                      setSelectedPatient
                    }
                    onEdit={
                      handleEditPatient
                    }
                    onArchive={
                      setPatientToArchive
                    }
                  />
                )
              )
            ) : (
              <div className="rounded-xl border border-[#E2EFED] bg-white px-5 py-12 text-center shadow-sm">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                  <Users size={22} />
                </div>

                <p className="mt-3 text-sm font-bold text-[#31585A]">
                  No patients
                  found
                </p>

                <p className="mt-1 text-xs text-[#819596]">
                  {patients.length ===
                  0
                    ? "No patient records have been registered yet."
                    : "Try changing your search or filters."}
                </p>

              </div>
            )}
          </div>
        </>
      )}

      {/* ===================================================
          PATIENT PROFILE
      =================================================== */}

      <PatientProfile
        patient={
          selectedPatient
        }
        open={
          !!selectedPatient
        }
        onClose={() =>
          setSelectedPatient(
            null
          )
        }
        onEdit={
          handleEditPatient
        }
      />

      {/* ===================================================
          PATIENT FORM
      =================================================== */}

      {showPatientForm && (
        <PatientForm
          patient={
            editingPatient
          }
          onClose={() => {
            setShowPatientForm(
              false
            );

            setEditingPatient(
              null
            );
          }}
          onSubmit={
            handlePatientSubmit
          }
        />
      )}

      {/* ===================================================
          DELETE CONFIRMATION
      =================================================== */}

      <ConfirmDialog
        open={
          !!patientToArchive
        }

        title="Delete Patient Record?"

        message={
          patientToArchive
            ? `This will permanently delete ${getPatientName(
                patientToArchive
              )}'s patient record from the database. This action cannot be undone.`
            : ""
        }

        confirmText={
          deleting
            ? "Deleting..."
            : "Delete Patient"
        }

        cancelText="Cancel"

        variant="danger"

        onCancel={() => {
          if (!deleting) {
            setPatientToArchive(
              null
            );
          }
        }}

        onConfirm={
          handleArchivePatient
        }
      />
    </div>
  );
};

export default Patients;