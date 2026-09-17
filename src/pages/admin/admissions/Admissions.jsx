import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Eye,
  Filter,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { apiRequest } from "../../../api/api";

/* =========================================================
   API / OPTIONS
   ========================================================= */

const admissionTypeOptions = [
  "Emergency",
  "Planned",
  "Day Care",
  "Maternity",
  "Surgery",
  "ICU",
];

const statusOptions = [
  "All",
  "Admitted",
  "Discharged",
];

const formStatusOptions = [
  "Admitted",
  "Discharged",
];

/* =========================================================
   EMPTY FORM
   ========================================================= */

const emptyForm = {
  admission_number: "",
  patient_id: "",
  doctor_id: "",
  room_bed_id: "",
  admission_date: new Date().toISOString().slice(0, 10),
  admission_type: "Planned",
  reason: "",
  diagnosis: "",
  status: "Admitted",
};

/* =========================================================
   RESPONSE HELPERS
   ========================================================= */

const extractList = (response, keys = []) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(response[key])) {
      return response[key];
    }
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  return [];
};

const getId = (item) =>
  item?.id ??
  item?.patient_id ??
  item?.staff_id ??
  item?.doctor_id ??
  item?.room_bed_id ??
  item?.bed_id ??
  item?.user_id ??
  null;

const getName = (item) => {
  if (!item) return "";

  if (item.name) return item.name;
  if (item.full_name) return item.full_name;
  if (item.patient_name) return item.patient_name;
  if (item.staff_name) return item.staff_name;
  if (item.doctor_name) return item.doctor_name;

  const firstName = item.first_name || "";
  const lastName = item.last_name || "";

  return `${firstName} ${lastName}`.trim();
};

const getPatientNumber = (patient) =>
  patient?.registration_number ??
  patient?.patient_registration_number ??
  patient?.patient_number ??
  patient?.patient_code ??
  patient?.registrationNumber ??
  patient?.code ??
  "";

const getStaffRole = (staff) =>
  String(
    staff?.role ??
      staff?.designation ??
      staff?.position ??
      staff?.staff_type ??
      ""
  ).toLowerCase();

const isDoctor = (staff) => {
  const role = getStaffRole(staff);

  return (
    role.includes("doctor") ||
    role.includes("physician") ||
    role.includes("medical officer") ||
    role === "dr"
  );
};

/* =========================================================
   NORMALIZE PATIENT
   ========================================================= */

const normalizePatient = (patient) => ({
  id: getId(patient),
  name: getName(patient) || "Unnamed Patient",
  registrationNumber: getPatientNumber(patient),
});

/* =========================================================
   NORMALIZE STAFF
   ========================================================= */

const normalizeStaff = (staff) => ({
  id: getId(staff),
  name: getName(staff) || "Unnamed Staff",
  role:
    staff?.role ??
    staff?.designation ??
    staff?.position ??
    staff?.staff_type ??
    "",
  department:
    staff?.department ??
    staff?.department_name ??
    "",
});

/* =========================================================
   NORMALIZE ROOM / BED
   ========================================================= */

const normalizeRoomBed = (roomBed) => ({
  id: getId(roomBed),

  roomNumber:
    roomBed?.room_number ??
    roomBed?.roomNumber ??
    roomBed?.room ??
    "",

  bedNumber:
    roomBed?.bed_number ??
    roomBed?.bedNumber ??
    roomBed?.bed ??
    "",

  roomType:
    roomBed?.room_type ??
    roomBed?.roomType ??
    "",

  floor:
    roomBed?.floor ??
    "",

  department:
    roomBed?.department ??
    roomBed?.department_name ??
    "",

  ward:
    roomBed?.ward ??
    roomBed?.ward_name ??
    "",

  bedStatus:
    roomBed?.bed_status ??
    roomBed?.bedStatus ??
    roomBed?.status ??
    "",

  dailyCharge:
    roomBed?.daily_charge ??
    roomBed?.dailyCharge ??
    roomBed?.price ??
    0,
});

/* =========================================================
   NORMALIZE ADMISSION
   ========================================================= */

const normalizeAdmission = (
  admission,
  patients = [],
  doctors = [],
  roomBeds = []
) => {
  const patient = patients.find(
    (item) =>
      String(item.id) === String(admission?.patient_id)
  );

  const doctor = doctors.find(
    (item) =>
      String(item.id) === String(admission?.doctor_id)
  );

  const roomBed = roomBeds.find(
    (item) =>
      String(item.id) === String(admission?.room_bed_id)
  );

  const roomNumber =
    admission?.room_number ??
    admission?.room ??
    roomBed?.roomNumber ??
    "";

  const bedNumber =
    admission?.bed_number ??
    admission?.bed ??
    roomBed?.bedNumber ??
    "";

  const ward =
    admission?.ward ??
    admission?.ward_name ??
    roomBed?.ward ??
    "";

  const department =
    admission?.department ??
    admission?.department_name ??
    roomBed?.department ??
    doctor?.department ??
    "";

  const patientName =
    admission?.patient_name ??
    admission?.patient ??
    patient?.name ??
    (admission?.patient_id
      ? `Patient #${admission.patient_id}`
      : "Unknown Patient");

  const doctorName =
    admission?.doctor_name ??
    admission?.doctor ??
    doctor?.name ??
    (admission?.doctor_id
      ? `Doctor #${admission.doctor_id}`
      : "Not assigned");

  return {
    ...admission,

    admission_id:
      admission?.admission_id ??
      admission?.id ??
      null,

    admission_number:
      admission?.admission_number ??
      admission?.number ??
      "",

    patient_name: patientName,

    patient_id:
      admission?.patient_id ??
      null,

    patient_registration_number:
      admission?.patient_registration_number ??
      admission?.registration_number ??
      patient?.registrationNumber ??
      "",

    doctor_name: doctorName,

    doctor_id:
      admission?.doctor_id ??
      null,

    department,

    ward,

    room_number: roomNumber,

    bed_number: bedNumber,

    room_bed_id:
      admission?.room_bed_id ??
      null,

    admission_date:
      admission?.admission_date ??
      "",

    admission_time:
      admission?.admission_time ??
      "",

    admission_type:
      admission?.admission_type ??
      "Planned",

    reason:
      admission?.reason ??
      admission?.diagnosis ??
      "",

    diagnosis:
      admission?.diagnosis ??
      admission?.reason ??
      "",

    discharge_date:
      admission?.discharge_date ??
      null,

    discharge_time:
      admission?.discharge_time ??
      null,

    discharge_summary:
      admission?.discharge_summary ??
      "",

    discharge_status:
      admission?.discharge_status ??
      "",

    status:
      admission?.status ??
      "Admitted",

    remarks:
      admission?.remarks ??
      "",
  };
};

/* =========================================================
   ERROR MESSAGE
   ========================================================= */

const getErrorMessage = (error, fallback) => {
  if (!error) return fallback;

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

/* =========================================================
   DATE
   ========================================================= */

const formatDate = (date) => {
  if (!date) return "—";

  const value = String(date).slice(0, 10);

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   STATUS BADGE
   ========================================================= */

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
      status === "Discharged"
        ? "bg-[#F1F4F4] text-[#667B7D]"
        : "bg-[#E8F8F6] text-[#078E89]"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        status === "Discharged"
          ? "bg-[#819596]"
          : "bg-[#08A6A0]"
      }`}
    />

    {status || "Unknown"}
  </span>
);

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const Admission = () => {
  const [admissions, setAdmissions] = useState([]);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [roomBeds, setRoomBeds] = useState([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");

  const [showFilters, setShowFilters] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [details, setDetails] = useState(null);

  const [editingAdmission, setEditingAdmission] =
    useState(null);

  const [admissionToDelete, setAdmissionToDelete] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [apiError, setApiError] = useState("");
  const [formError, setFormError] = useState("");

  /* =======================================================
     LOAD ADMISSIONS
     ======================================================= */

  const loadAdmissions = async () => {
    try {
      const response = await apiRequest("/api/admissions");

      const list = extractList(response, [
        "admissions",
        "items",
        "results",
      ]);

      setAdmissions(
        list.map((item) =>
          normalizeAdmission(
            item,
            patients,
            doctors,
            roomBeds
          )
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to load admissions:",
        error
      );

      setAdmissions([]);

      setApiError(
        getErrorMessage(
          error,
          "Could not load admission data."
        )
      );

      return false;
    }
  };

  /* =======================================================
     LOAD PATIENTS
     ======================================================= */

  const loadPatients = async () => {
    try {
      const response = await apiRequest("/api/patients");

      const list = extractList(response, [
        "patients",
        "items",
        "results",
      ]);

      const normalized = list
        .map(normalizePatient)
        .filter((item) => item.id != null);

      setPatients(normalized);

      return normalized;
    } catch (error) {
      console.error(
        "Failed to load patients:",
        error
      );

      setPatients([]);

      return [];
    }
  };

  /* =======================================================
     LOAD STAFF
     ======================================================= */

  const loadStaff = async () => {
    try {
      const response = await apiRequest("/api/staff");

      const list = extractList(response, [
        "staff",
        "items",
        "results",
      ]);

      const normalized = list
        .map(normalizeStaff)
        .filter((item) => item.id != null);

      const doctorList = normalized.filter(isDoctor);

      setDoctors(doctorList);

      return doctorList;
    } catch (error) {
      console.error(
        "Failed to load staff:",
        error
      );

      setDoctors([]);

      return [];
    }
  };

  /* =======================================================
     LOAD ROOM / BED DATA
     ======================================================= */

  const loadRoomBeds = async () => {
    try {
      const response = await apiRequest(
        "/api/rooms-beds"
      );

      const list = extractList(response, [
        "rooms_beds",
        "room_beds",
        "roomsBeds",
        "beds",
        "items",
        "results",
      ]);

      const normalized = list
        .map(normalizeRoomBed)
        .filter((item) => item.id != null);

      setRoomBeds(normalized);

      return normalized;
    } catch (error) {
      console.error(
        "Failed to load room/bed data:",
        error
      );

      setRoomBeds([]);

      return [];
    }
  };

  /* =======================================================
     LOAD EVERYTHING
     ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setApiError("");

      /*
       * Reference data is loaded independently.
       *
       * One failed endpoint does not prevent the
       * other reference data from loading.
       */

      const [patientList, doctorList, roomBedList] =
        await Promise.all([
          loadPatients(),
          loadStaff(),
          loadRoomBeds(),
        ]);

      try {
        const response = await apiRequest(
          "/api/admissions"
        );

        const list = extractList(response, [
          "admissions",
          "items",
          "results",
        ]);

        setAdmissions(
          list.map((item) =>
            normalizeAdmission(
              item,
              patientList,
              doctorList,
              roomBedList
            )
          )
        );
      } catch (error) {
        console.error(
          "Failed to load admissions:",
          error
        );

        setAdmissions([]);

        setApiError(
          getErrorMessage(
            error,
            "Could not load admission data."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     RE-NORMALIZE WHEN REFERENCE DATA ARRIVES
     ======================================================= */

  useEffect(() => {
    if (!admissions.length) return;

    setAdmissions((current) =>
      current.map((item) =>
        normalizeAdmission(
          item,
          patients,
          doctors,
          roomBeds
        )
      )
    );
  }, [patients, doctors, roomBeds]);

  /* =======================================================
     DEPARTMENTS
     ======================================================= */

  const departments = useMemo(() => {
    const values = admissions
      .map((item) => item.department)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [admissions]);

  /* =======================================================
     STATS
     ======================================================= */

  const stats = useMemo(
    () => ({
      total: admissions.length,

      admitted: admissions.filter(
        (item) => item.status === "Admitted"
      ).length,

      discharged: admissions.filter(
        (item) => item.status === "Discharged"
      ).length,

      emergency: admissions.filter(
        (item) =>
          String(item.admission_type).toLowerCase() ===
          "emergency"
      ).length,
    }),
    [admissions]
  );

  /* =======================================================
     FILTER
     ======================================================= */

  const filteredAdmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return admissions.filter((item) => {
      const searchable = [
        item.admission_number,
        item.patient_name,
        item.patient_id,
        item.patient_registration_number,
        item.doctor_name,
        item.department,
        item.ward,
        item.room_number,
        item.bed_number,
        item.reason,
        item.diagnosis,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchable.includes(query);

      const matchesDepartment =
        department === "All" ||
        item.department === department;

      const matchesStatus =
        status === "All" ||
        item.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    admissions,
    department,
    search,
    status,
  ]);

  /* =======================================================
     FORM HELPERS
     ======================================================= */

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFormError("");
  };

  const generateAdmissionNumber = () => {
    const currentYear = new Date()
      .getFullYear()
      .toString();

    const numbers = admissions
      .map((item) => {
        const match = String(
          item.admission_number || ""
        ).match(/(\d+)$/);

        return match
          ? Number(match[1])
          : null;
      })
      .filter(
        (value) =>
          value !== null &&
          !Number.isNaN(value)
      );

    const nextNumber =
      Math.max(0, ...numbers) + 1;

    return `ADM-${currentYear}-${String(
      nextNumber
    ).padStart(3, "0")}`;
  };

  /* =======================================================
     OPEN ADD
     ======================================================= */

  const openAddForm = () => {
    setEditingAdmission(null);

    setForm({
      ...emptyForm,
      admission_number:
        generateAdmissionNumber(),
      admission_date: new Date()
        .toISOString()
        .slice(0, 10),
    });

    setFormError("");
    setFormOpen(true);
  };

  /* =======================================================
     OPEN EDIT
     ======================================================= */

  const openEditForm = (admission) => {
    setEditingAdmission(admission);

    setForm({
      admission_number:
        admission.admission_number || "",

      patient_id:
        admission.patient_id != null
          ? String(admission.patient_id)
          : "",

      doctor_id:
        admission.doctor_id != null
          ? String(admission.doctor_id)
          : "",

      room_bed_id:
        admission.room_bed_id != null
          ? String(admission.room_bed_id)
          : "",

      admission_date:
        admission.admission_date
          ? String(
              admission.admission_date
            ).slice(0, 10)
          : "",

      admission_type:
        admission.admission_type ||
        "Planned",

      reason:
        admission.reason ||
        admission.diagnosis ||
        "",

      diagnosis:
        admission.diagnosis ||
        admission.reason ||
        "",

      status:
        admission.status ||
        "Admitted",
    });

    setFormError("");
    setFormOpen(true);
  };

  /* =======================================================
     CREATE / UPDATE
     ======================================================= */

  const saveAdmission = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!form.admission_number.trim()) {
      setFormError(
        "Admission number is required."
      );
      return;
    }

    if (!form.patient_id) {
      setFormError("Patient is required.");
      return;
    }

    if (!form.doctor_id) {
      setFormError(
        "Admitting doctor is required."
      );
      return;
    }

    if (!form.room_bed_id) {
      setFormError(
        "Room / bed is required."
      );
      return;
    }

    if (!form.admission_date) {
      setFormError(
        "Admission date is required."
      );
      return;
    }

    if (!form.reason.trim()) {
      setFormError(
        "Reason for admission is required."
      );
      return;
    }

    /*
     * IMPORTANT:
     *
     * Do not send patient_name, doctor_name,
     * department, ward or bed_number to the API.
     *
     * Those are display/reference fields.
     *
     * The actual backend foreign keys are:
     * patient_id
     * doctor_id
     * room_bed_id
     */

    const payload = {
      admission_number:
        form.admission_number.trim(),

      patient_id:
        Number(form.patient_id),

      doctor_id:
        Number(form.doctor_id),

      room_bed_id:
        Number(form.room_bed_id),

      admission_type:
        form.admission_type,

      admission_date:
        form.admission_date,

      reason:
        form.reason.trim(),

      diagnosis:
        form.diagnosis.trim() || null,

      status:
        form.status,
    };

    try {
      setSubmitting(true);

      if (editingAdmission) {
        await apiRequest(
          `/api/admissions/${editingAdmission.admission_id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        await apiRequest("/api/admissions", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await loadData();

      setForm(emptyForm);
      setEditingAdmission(null);
      setFormOpen(false);
      setFormError("");
    } catch (error) {
      console.error(
        "Admission save failed:",
        error
      );

      setFormError(
        getErrorMessage(
          error,
          editingAdmission
            ? "Failed to update admission."
            : "Failed to create admission."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     DISCHARGE
     ======================================================= */

  const dischargeAdmission = async (admission) => {
    if (!admission?.admission_id) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setApiError("");

      const dischargeDate = new Date()
        .toISOString()
        .slice(0, 10);

      /*
       * Prefer the dedicated status endpoint if
       * the backend provides it.
       *
       * This follows the same pattern used by
       * the Booking page.
       */

      try {
        await apiRequest(
          `/api/admissions/${admission.admission_id}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status: "Discharged",
              discharge_date: dischargeDate,
            }),
          }
        );
      } catch (statusError) {
        /*
         * Some FastAPI implementations expose only
         * PUT /api/admissions/{id}.
         *
         * Retry using the normal update endpoint.
         */

        await apiRequest(
          `/api/admissions/${admission.admission_id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              admission_number:
                admission.admission_number,

              patient_id:
                Number(admission.patient_id),

              doctor_id:
                Number(admission.doctor_id),

              room_bed_id:
                Number(admission.room_bed_id),

              admission_type:
                admission.admission_type,

              admission_date:
                String(
                  admission.admission_date || ""
                ).slice(0, 10),

              reason:
                admission.reason ||
                admission.diagnosis ||
                null,

              diagnosis:
                admission.diagnosis ||
                null,

              status: "Discharged",

              discharge_date:
                dischargeDate,
            }),
          }
        );
      }

      await loadData();

      setDetails((current) => {
        if (
          current?.admission_id ===
          admission.admission_id
        ) {
          return {
            ...current,
            status: "Discharged",
            discharge_date: dischargeDate,
          };
        }

        return current;
      });
    } catch (error) {
      console.error(
        "Admission discharge failed:",
        error
      );

      setApiError(
        getErrorMessage(
          error,
          "Failed to discharge admission."
        )
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =======================================================
     DELETE
     ======================================================= */

  const deleteAdmission = async () => {
    if (!admissionToDelete?.admission_id) {
      return;
    }

    try {
      setDeleting(true);
      setApiError("");

      await apiRequest(
        `/api/admissions/${admissionToDelete.admission_id}`,
        {
          method: "DELETE",
        }
      );

      setAdmissions((current) =>
        current.filter(
          (item) =>
            item.admission_id !==
            admissionToDelete.admission_id
        )
      );

      if (
        details?.admission_id ===
        admissionToDelete.admission_id
      ) {
        setDetails(null);
      }

      setAdmissionToDelete(null);
    } catch (error) {
      console.error(
        "Admission delete failed:",
        error
      );

      setApiError(
        getErrorMessage(
          error,
          "Failed to delete admission."
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="min-h-full bg-[#F7FBFA] p-3 sm:p-4 lg:p-5">

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-xl font-bold text-[#173F41] sm:text-2xl">
            Admissions
          </h1>

          <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
            Manage patient admissions, beds, and discharge
            records.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DDE9E7] px-3 text-xs font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#078E89] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:px-4 sm:text-sm"
            title="Refresh admissions"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#078E89] sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Admission
          </button>

        </div>
      </div>

      {/* ===================================================
          API ERROR
          =================================================== */}

      {apiError && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>{apiError}</span>

          <button
            type="button"
            onClick={() => setApiError("")}
            className="shrink-0 font-semibold hover:text-red-900"
          >
            Dismiss
          </button>

        </div>
      )}

      {/* ===================================================
          REFERENCE DATA WARNING
          =================================================== */}

      {!loading &&
        (!patients.length ||
          !doctors.length ||
          !roomBeds.length) && (
          <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">

            <p className="font-semibold">
              Some admission reference data is unavailable.
            </p>

            <div className="mt-1 space-y-0.5">
              {!patients.length && (
                <p>• Patients could not be loaded.</p>
              )}

              {!doctors.length && (
                <p>
                  • Doctors could not be loaded from staff.
                </p>
              )}

              {!roomBeds.length && (
                <p>
                  • Room / bed data could not be loaded.
                </p>
              )}
            </div>

          </div>
        )}

      {/* ===================================================
          STATS
          =================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">

        <Stat
          icon={Users}
          label="Total Admissions"
          value={stats.total}
        />

        <Stat
          icon={BedDouble}
          label="Currently Admitted"
          value={stats.admitted}
        />

        <Stat
          icon={CheckCircle2}
          label="Discharged"
          value={stats.discharged}
        />

        <Stat
          icon={CalendarDays}
          label="Emergency Cases"
          value={stats.emergency}
        />

      </div>

      {/* ===================================================
          SEARCH / FILTER
          =================================================== */}

      <div className="rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm sm:p-4">

        <div className="flex flex-col gap-2 sm:flex-row">

          <label className="relative flex-1">

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by patient, admission number, doctor or bed..."
              className="w-full rounded-lg border border-[#DDE9E7] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#D7F3F0]"
            />

          </label>

          <button
            type="button"
            onClick={() =>
              setShowFilters((value) => !value)
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDE9E7] px-3 py-2.5 text-sm font-semibold text-[#31585A] hover:bg-[#F2FAF9]"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

        </div>

        {showFilters && (
          <div className="mt-3 grid gap-3 border-t border-[#EAF2F1] pt-3 sm:grid-cols-3">

            <Select
              label="Department"
              value={department}
              onChange={setDepartment}
              options={departments}
            />

            <Select
              label="Status"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDepartment("All");
                setStatus("All");
              }}
              className="self-end rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm font-semibold text-[#31585A] hover:bg-[#F2FAF9]"
            >
              Clear filters
            </button>

          </div>
        )}

        <div className="mb-2 mt-4 text-xs text-[#819596] sm:text-sm">
          Showing {filteredAdmissions.length} of{" "}
          {admissions.length} admissions
        </div>

        {/* =================================================
            LOADING
            ================================================= */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-3 text-sm font-semibold text-[#31585A]">

              <Loader2 className="h-5 w-5 animate-spin text-[#08A6A0]" />

              Loading admissions...

            </div>

          </div>
        ) : (
          <>
            {/* =============================================
                DESKTOP TABLE
                ============================================= */}

            <div className="hidden overflow-x-auto rounded-lg border border-[#E2EFED] md:block">

              <table className="min-w-full divide-y divide-[#EAF2F1] text-left">

                <thead className="bg-[#F7FBFA] text-xs font-semibold uppercase tracking-wide text-[#6E8081]">

                  <tr>

                    <th className="px-4 py-3">
                      Admission
                    </th>

                    <th className="px-4 py-3">
                      Patient
                    </th>

                    <th className="px-4 py-3">
                      Doctor & Ward
                    </th>

                    <th className="px-4 py-3">
                      Date
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-[#EAF2F1] bg-white">

                  {filteredAdmissions.map((item) => (
                    <tr
                      key={item.admission_id}
                      className="hover:bg-[#FBFDFC]"
                    >

                      <td className="px-4 py-3">

                        <p className="font-semibold text-[#173F41]">
                          {item.admission_number ||
                            `ADM-${item.admission_id}`}
                        </p>

                        <p className="mt-0.5 text-xs text-[#819596]">
                          {item.admission_type}
                        </p>

                      </td>

                      <td className="px-4 py-3">

                        <p className="font-medium text-[#31585A]">
                          {item.patient_name}
                        </p>

                        <p className="mt-0.5 text-xs text-[#819596]">
                          {item.patient_registration_number ||
                            item.patient_id ||
                            "—"}
                        </p>

                      </td>

                      <td className="px-4 py-3">

                        <p className="text-sm text-[#31585A]">
                          {item.doctor_name}
                        </p>

                        <p className="mt-0.5 text-xs text-[#819596]">
                          {item.ward || "Ward not provided"}

                          {item.bed_number
                            ? ` · Bed ${item.bed_number}`
                            : ""}

                          {item.room_number
                            ? ` · Room ${item.room_number}`
                            : ""}
                        </p>

                      </td>

                      <td className="px-4 py-3 text-sm text-[#31585A]">
                        {formatDate(
                          item.admission_date
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      <td className="px-4 py-3">

                        <div className="flex justify-end gap-1">

                          <IconButton
                            label="View"
                            onClick={() =>
                              setDetails(item)
                            }
                          >
                            <Eye />
                          </IconButton>

                          <IconButton
                            label="Edit"
                            onClick={() =>
                              openEditForm(item)
                            }
                          >
                            <Edit3 />
                          </IconButton>

                          {item.status === "Admitted" && (
                            <IconButton
                              label="Discharge"
                              onClick={() =>
                                dischargeAdmission(item)
                              }
                            >
                              <LogOut />
                            </IconButton>
                          )}

                          <IconButton
                            label="Delete"
                            danger
                            onClick={() =>
                              setAdmissionToDelete(
                                item
                              )
                            }
                          >
                            <Trash2 />
                          </IconButton>

                        </div>

                      </td>

                    </tr>
                  ))}

                  {!filteredAdmissions.length && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-sm text-[#819596]"
                      >
                        No admissions match your
                        search or filters.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

            {/* =============================================
                MOBILE
                ============================================= */}

            <div className="space-y-3 md:hidden">

              {filteredAdmissions.length > 0 ? (
                filteredAdmissions.map((item) => (
                  <AdmissionMobileCard
                    key={item.admission_id}
                    item={item}
                    onView={setDetails}
                    onEdit={openEditForm}
                    onDischarge={
                      dischargeAdmission
                    }
                    onDelete={
                      setAdmissionToDelete
                    }
                  />
                ))
              ) : (
                <div className="rounded-xl border border-[#E2EFED] bg-white px-5 py-10 text-center text-sm text-[#819596]">
                  No admissions match your
                  search or filters.
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* ===================================================
          FORM
          =================================================== */}

      {formOpen && (
        <AdmissionForm
          admission={editingAdmission}
          form={form}
          patients={patients}
          doctors={doctors}
          roomBeds={roomBeds}
          error={formError}
          submitting={submitting}
          onChange={updateForm}
          onSubmit={saveAdmission}
          onClose={() => {
            if (submitting) return;

            setFormOpen(false);
            setEditingAdmission(null);
            setFormError("");
          }}
        />
      )}

      {/* ===================================================
          DETAILS
          =================================================== */}

      {details && (
        <Details
          admission={details}
          onClose={() => setDetails(null)}
          onDischarge={dischargeAdmission}
          updatingStatus={updatingStatus}
        />
      )}

      {/* ===================================================
          DELETE CONFIRM
          =================================================== */}

      {admissionToDelete && (
        <Confirm
          title="Delete admission?"
          message={`This will permanently remove ${
            admissionToDelete.admission_number ||
            "this admission"
          }.`}
          onCancel={() =>
            deleting
              ? null
              : setAdmissionToDelete(null)
          }
          onConfirm={deleteAdmission}
          loading={deleting}
        />
      )}

    </div>
  );
};

/* =========================================================
   MOBILE CARD
   ========================================================= */

const AdmissionMobileCard = ({
  item,
  onView,
  onEdit,
  onDischarge,
  onDelete,
}) => (
  <div className="rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm">

    <div className="flex items-start justify-between gap-3">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
          <BedDouble size={18} />
        </div>

        <div className="min-w-0">

          <p className="truncate text-sm font-bold text-[#173F41]">
            {item.patient_name}
          </p>

          <p className="mt-0.5 text-xs text-[#819596]">
            {item.patient_registration_number ||
              item.patient_id ||
              "No patient ID"}

            {" • "}

            {item.admission_number ||
              `ADM-${item.admission_id}`}
          </p>

        </div>

      </div>

      <StatusBadge status={item.status} />

    </div>

    <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">

      <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
          Doctor / Dept
        </p>

        <p className="mt-1 truncate text-xs font-semibold text-[#31585A] sm:text-sm">
          {item.doctor_name || "Not assigned"}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-[#819596]">
          {item.department || "Department not provided"}
        </p>

      </div>

      <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
          Ward / Bed
        </p>

        <p className="mt-1 truncate text-xs font-semibold text-[#31585A] sm:text-sm">
          {item.ward || "Ward not provided"}

          {item.bed_number
            ? ` · Bed ${item.bed_number}`
            : ""}
        </p>

        {item.room_number && (
          <p className="mt-0.5 text-[10px] text-[#819596]">
            Room {item.room_number}
          </p>
        )}

      </div>

      <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
          Admission Date
        </p>

        <p className="mt-1 text-xs font-semibold text-[#31585A] sm:text-sm">
          {formatDate(
            item.admission_date
          )}
        </p>

      </div>

      <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
          Type
        </p>

        <p className="mt-1 truncate text-xs font-semibold text-[#31585A] sm:text-sm">
          {item.admission_type ||
            "Planned"}
        </p>

      </div>

    </div>

    <div className="mt-3 flex gap-2 border-t border-[#EAF2F0] pt-3">

      <button
        type="button"
        onClick={() => onView(item)}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-semibold text-[#073F42] transition hover:bg-[#DDF3F0]"
      >
        <Eye size={14} />
        View
      </button>

      <button
        type="button"
        onClick={() => onEdit(item)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        title="Edit"
      >
        <Edit3 size={15} />
      </button>

      {item.status === "Admitted" && (
        <button
          type="button"
          onClick={() =>
            onDischarge(item)
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#08A6A0] transition hover:bg-[#E8F8F6]"
          title="Discharge"
        >
          <LogOut size={15} />
        </button>
      )}

      <button
        type="button"
        onClick={() => onDelete(item)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>

    </div>

  </div>
);

/* =========================================================
   STAT
   ========================================================= */

const Stat = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="min-w-0 rounded-lg border border-[#E2EFED] bg-white px-2 py-1.5 shadow-sm sm:rounded-xl sm:px-2.5 sm:py-2.5 md:rounded-2xl md:px-4 md:py-4">

    <div className="flex items-center justify-between gap-1 sm:gap-2">

      <div className="min-w-0">

        <p className="truncate text-[9px] font-semibold text-[#819596] sm:text-[10px] md:text-xs">
          {label}
        </p>

        <p className="mt-0.5 text-base font-bold leading-none text-[#073F42] sm:mt-1 sm:text-lg md:mt-2 md:text-2xl">
          {value}
        </p>

      </div>

      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6] text-[#08A6A0] sm:h-7 sm:w-7 md:h-10 md:w-10 md:rounded-xl">

        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-5 md:w-5" />

      </span>

    </div>

  </div>
);

/* =========================================================
   ICON BUTTON
   ========================================================= */

const IconButton = ({
  children,
  label,
  onClick,
  danger = false,
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className={`rounded-md p-2 transition ${
      danger
        ? "text-[#C85A5A] hover:bg-[#FFF1F1]"
        : "text-[#507173] hover:bg-[#E8F8F6] hover:text-[#078E89]"
    }`}
  >
    {children}
  </button>
);

/* =========================================================
   SELECT
   ========================================================= */

const Select = ({
  label,
  value,
  onChange,
  options,
}) => (
  <label className="text-xs font-semibold text-[#507173]">

    {label}

    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="mt-1 block w-full rounded-lg border border-[#DDE9E7] bg-white px-3 py-2 text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]"
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>

  </label>
);

/* =========================================================
   ADMISSION FORM
   ========================================================= */

const AdmissionForm = ({
  admission,
  form,
  patients,
  doctors,
  roomBeds,
  error,
  submitting,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal
      title={
        admission
          ? "Edit Admission"
          : "Add Admission"
      }
      subtitle={
        admission
          ? "Update the patient admission record."
          : "Register a patient admission and bed allocation."
      }
      onClose={onClose}
    >

      <form
        onSubmit={onSubmit}
        className="space-y-3.5 sm:space-y-4"
      >

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

          <Field
            label="Admission Number"
            name="admission_number"
            value={form.admission_number}
            onChange={(event) =>
              onChange(
                "admission_number",
                event.target.value
              )
            }
            placeholder="Auto-generated if empty"
          />

          {/* PATIENT */}

          <SelectField
            label="Patient"
            value={form.patient_id}
            onChange={(event) =>
              onChange(
                "patient_id",
                event.target.value
              )
            }
            disabled={!patients.length}
          >
            <option value="">
              {patients.length
                ? "Select patient"
                : "No patients available"}
            </option>

            {patients.map((patient) => (
              <option
                key={patient.id}
                value={patient.id}
              >
                {patient.name}

                {patient.registrationNumber
                  ? ` (${patient.registrationNumber})`
                  : ""}
              </option>
            ))}
          </SelectField>

          {/* DOCTOR */}

          <SelectField
            label="Admitting Doctor"
            value={form.doctor_id}
            onChange={(event) =>
              onChange(
                "doctor_id",
                event.target.value
              )
            }
            disabled={!doctors.length}
          >
            <option value="">
              {doctors.length
                ? "Select doctor"
                : "No doctors available"}
            </option>

            {doctors.map((doctor) => (
              <option
                key={doctor.id}
                value={doctor.id}
              >
                {doctor.name}

                {doctor.department
                  ? ` · ${doctor.department}`
                  : ""}
              </option>
            ))}
          </SelectField>

          {/* ROOM / BED */}

          <SelectField
            label="Ward / Room / Bed"
            value={form.room_bed_id}
            onChange={(event) =>
              onChange(
                "room_bed_id",
                event.target.value
              )
            }
            disabled={!roomBeds.length}
          >
            <option value="">
              {roomBeds.length
                ? "Select available bed"
                : "No room / bed data available"}
            </option>

            {roomBeds.map((roomBed) => {
              const unavailable = [
                "occupied",
                "blocked",
                "maintenance",
                "cleaning",
              ].includes(
                String(
                  roomBed.bedStatus || ""
                ).toLowerCase()
              );

              return (
                <option
                  key={roomBed.id}
                  value={roomBed.id}
                  disabled={
                    unavailable &&
                    String(
                      form.room_bed_id
                    ) !==
                      String(roomBed.id)
                  }
                >
                  {roomBed.ward ||
                    "Ward"}

                  {" · Room "}

                  {roomBed.roomNumber ||
                    "—"}

                  {" · Bed "}

                  {roomBed.bedNumber ||
                    "—"}

                  {roomBed.bedStatus
                    ? ` (${roomBed.bedStatus})`
                    : ""}
                </option>
              );
            })}
          </SelectField>

          {/* DEPARTMENT DISPLAY */}

          <Field
            label="Department"
            name="department_display"
            value={
              doctors.find(
                (doctor) =>
                  String(doctor.id) ===
                  String(form.doctor_id)
              )?.department || ""
            }
            placeholder="Taken from selected doctor"
            readOnly
          />

          {/* ADMISSION DATE */}

          <Field
            label="Admission Date"
            name="admission_date"
            type="date"
            value={form.admission_date}
            onChange={(event) =>
              onChange(
                "admission_date",
                event.target.value
              )
            }
            required
          />

          {/* ADMISSION TYPE */}

          <SelectField
            label="Admission Type"
            value={form.admission_type}
            onChange={(event) =>
              onChange(
                "admission_type",
                event.target.value
              )
            }
          >
            {admissionTypeOptions.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </SelectField>

          {/* STATUS */}

          <SelectField
            label="Status"
            value={form.status}
            onChange={(event) =>
              onChange(
                "status",
                event.target.value
              )
            }
          >
            {formStatusOptions.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </SelectField>

        </div>

        {/* REASON */}

        <Field
          label="Reason for Admission"
          name="reason"
          value={form.reason}
          onChange={(event) =>
            onChange(
              "reason",
              event.target.value
            )
          }
          textarea
          required
          placeholder="Reason for admission..."
        />

        {/* DIAGNOSIS */}

        <Field
          label="Diagnosis"
          name="diagnosis"
          value={form.diagnosis}
          onChange={(event) =>
            onChange(
              "diagnosis",
              event.target.value
            )
          }
          textarea
          placeholder="Diagnosis / clinical notes..."
        />

        {/* ACTIONS */}

        <div className="flex justify-end gap-2 border-t border-[#EAF2F1] pt-3 sm:gap-3 sm:pt-4">

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-10 rounded-xl border border-[#DDE9E7] px-4 text-xs font-semibold text-[#31585A] disabled:opacity-50 sm:h-11 sm:px-5 sm:text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#078E89] px-4 text-xs font-semibold text-white hover:bg-[#067A76] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:px-5 sm:text-sm"
          >

            {submitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {submitting
              ? "Saving..."
              : admission
              ? "Update Admission"
              : "Save Admission"}

          </button>

        </div>

      </form>

    </Modal>
  );
};

/* =========================================================
   FIELD
   ========================================================= */

const Field = ({
  label,
  textarea,
  value,
  onChange,
  ...props
}) => (
  <label
    className={`block text-xs font-semibold text-[#507173] ${
      textarea ? "sm:col-span-2" : ""
    }`}
  >

    {label}

    {textarea ? (
      <textarea
        {...props}
        value={value}
        onChange={onChange}
        className="mt-1 block min-h-20 w-full rounded-xl border border-[#DDE9E7] px-3 py-2 text-xs font-normal text-[#31585A] outline-none focus:border-[#08A6A0] sm:px-3.5 sm:py-2.5 sm:text-sm"
      />
    ) : (
      <input
        {...props}
        value={value}
        onChange={onChange}
        className="mt-1 block h-10 w-full rounded-xl border border-[#DDE9E7] px-3 text-xs font-normal text-[#31585A] outline-none focus:border-[#08A6A0] sm:h-11 sm:px-3.5 sm:text-sm"
      />
    )}

  </label>
);

/* =========================================================
   SELECT FIELD
   ========================================================= */

const SelectField = ({
  label,
  children,
  value,
  onChange,
  disabled = false,
}) => (
  <label className="block text-xs font-semibold text-[#507173]">

    {label}

    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 block h-10 w-full rounded-xl border border-[#DDE9E7] bg-white px-3 text-xs font-normal text-[#31585A] outline-none focus:border-[#08A6A0] disabled:cursor-not-allowed disabled:bg-[#F5F8F7] disabled:text-[#819596] sm:h-11 sm:px-3.5 sm:text-sm"
    >
      {children}
    </select>

  </label>
);

/* =========================================================
   MODAL
   ========================================================= */

const Modal = ({
  title,
  subtitle,
  children,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173F41]/40 p-2.5 backdrop-blur-sm sm:p-4 md:p-6">

    <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[94vh] sm:rounded-3xl">

      <div className="flex items-start justify-between border-b border-[#E2EFED] px-4 py-3 sm:px-6 sm:py-4">

        <div>
          <h2 className="text-base font-bold text-[#173F41] sm:text-lg">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-[#819596]">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-[#819596] hover:bg-[#E8F8F6]"
        >
          <X className="h-4 w-4" />
        </button>

      </div>

      <div className="p-4 sm:p-6">
        {children}
      </div>

    </div>

  </div>
);

/* =========================================================
   DETAILS
   ========================================================= */

const Details = ({
  admission,
  onClose,
  onDischarge,
  updatingStatus,
}) => (
  <Modal
    title="Admission Details"
    subtitle={
      admission.admission_number ||
      `Admission #${admission.admission_id}`
    }
    onClose={onClose}
  >

    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

      {[
        [
          "Patient",
          admission.patient_name,
        ],

        [
          "Patient ID",
          admission.patient_registration_number ||
            admission.patient_id,
        ],

        [
          "Doctor",
          admission.doctor_name,
        ],

        [
          "Department",
          admission.department,
        ],

        [
          "Ward",
          admission.ward,
        ],

        [
          "Room",
          admission.room_number,
        ],

        [
          "Bed",
          admission.bed_number,
        ],

        [
          "Admission Date",
          formatDate(
            admission.admission_date
          ),
        ],

        [
          "Admission Type",
          admission.admission_type,
        ],

        [
          "Status",
          admission.status,
        ],

        [
          "Reason",
          admission.reason,
        ],

        [
          "Diagnosis",
          admission.diagnosis,
        ],

        [
          "Discharge Date",
          formatDate(
            admission.discharge_date
          ),
        ],

        [
          "Discharge Summary",
          admission.discharge_summary,
        ],
      ].map(([label, value]) => (
        <div
          key={label}
          className={`rounded-xl bg-[#F7FBFA] p-3 ${
            label === "Reason" ||
            label === "Diagnosis" ||
            label === "Discharge Summary"
              ? "sm:col-span-2"
              : ""
          }`}
        >

          <p className="text-[11px] font-semibold text-[#819596] sm:text-xs">
            {label}
          </p>

          <p className="mt-0.5 break-words text-xs font-medium text-[#31585A] sm:text-sm">
            {value || "—"}
          </p>

        </div>
      ))}

    </div>

    {admission.status === "Admitted" && (
      <div className="mt-4 flex justify-end border-t border-[#EAF2F1] pt-4">

        <button
          type="button"
          disabled={updatingStatus}
          onClick={() =>
            onDischarge(admission)
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#078E89] px-4 text-xs font-semibold text-white hover:bg-[#067A76] disabled:opacity-60 sm:h-11 sm:px-5 sm:text-sm"
        >

          {updatingStatus ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}

          {updatingStatus
            ? "Discharging..."
            : "Discharge Patient"}

        </button>

      </div>
    )}

  </Modal>
);

/* =========================================================
   CONFIRM
   ========================================================= */

const Confirm = ({
  title,
  message,
  onCancel,
  onConfirm,
  loading,
}) => (
  <Modal
    title={title}
    subtitle={message}
    onClose={onCancel}
  >

    <div className="flex justify-end gap-2">

      <button
        type="button"
        disabled={loading}
        onClick={onCancel}
        className="h-10 rounded-xl border border-[#DDE9E7] px-4 text-xs font-semibold text-[#31585A] disabled:opacity-50 sm:h-11 sm:px-5 sm:text-sm"
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={onConfirm}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#C85A5A] px-4 text-xs font-semibold text-white hover:bg-[#B74747] disabled:opacity-60 sm:h-11 sm:px-5 sm:text-sm"
      >

        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {loading
          ? "Deleting..."
          : "Delete"}

      </button>

    </div>

  </Modal>
);

export default Admission;