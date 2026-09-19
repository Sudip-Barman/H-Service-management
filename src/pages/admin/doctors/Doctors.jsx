import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Edit3,
  Eye,
  Plus,
  Stethoscope,
  Trash2,
  UserRound,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import DoctorForm from "../../../components/admin/DoctorForm";
import DoctorProfile from "../../../components/admin/DoctorProfile";
import { apiRequest } from "../../../api/api";

/* =========================================================
   CONFIG
========================================================= */

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/api\/?$/, "");

/* =========================================================
   HELPERS
========================================================= */

const getDoctorId = (doctor) => {
  if (!doctor) return null;

  return doctor.id ?? doctor.doctor_id ?? null;
};

const getDoctorName = (doctor) =>
  [doctor?.first_name, doctor?.middle_name, doctor?.last_name]
    .filter(Boolean)
    .join(" ") || "Unnamed Doctor";

const getInitials = (doctor) => {
  const name = getDoctorName(doctor);

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getPhotoUrl = (photo) => {
  if (!photo) return "";

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://") ||
    photo.startsWith("blob:") ||
    photo.startsWith("data:")
  ) {
    return photo;
  }

  return `${API_ORIGIN}${photo.startsWith("/") ? photo : `/${photo}`}`;
};

const formatDoctor = (doctor) => {
  if (!doctor) return null;

  return {
    ...doctor,

    // Backend uses `id`.
    // UI uses `doctor_id` for compatibility.
    doctor_id: doctor.id ?? doctor.doctor_id,

    consultation_fee: Number(doctor.consultation_fee || 0),

    experience_years: Number(doctor.experience_years || 0),

    photo: doctor.photo || "",
  };
};

const appendFormField = (formData, key, value) => {
  formData.append(key, value == null ? "" : String(value));
};

const buildDoctorFormData = (doctorData) => {
  const formData = new FormData();

  appendFormField(
    formData,
    "registration_number",
    doctorData.registration_number?.trim()
  );

  appendFormField(
    formData,
    "first_name",
    doctorData.first_name?.trim()
  );

  appendFormField(
    formData,
    "middle_name",
    doctorData.middle_name?.trim()
  );

  appendFormField(
    formData,
    "last_name",
    doctorData.last_name?.trim()
  );

  appendFormField(
    formData,
    "date_of_birth",
    doctorData.date_of_birth
  );

  appendFormField(
    formData,
    "gender",
    doctorData.gender || "Male"
  );

  appendFormField(
    formData,
    "phone",
    doctorData.phone?.trim()
  );

  appendFormField(
    formData,
    "email",
    doctorData.email?.trim()
  );

  appendFormField(
    formData,
    "address",
    doctorData.address?.trim()
  );

  appendFormField(
    formData,
    "specialization",
    doctorData.specialization?.trim()
  );

  appendFormField(
    formData,
    "department",
    doctorData.department?.trim()
  );

  appendFormField(
    formData,
    "qualification",
    doctorData.qualification?.trim()
  );

  appendFormField(
    formData,
    "experience_years",
    Number(doctorData.experience_years || 0)
  );

  appendFormField(
    formData,
    "consultation_fee",
    Number(doctorData.consultation_fee || 0)
  );

  appendFormField(
    formData,
    "license_number",
    doctorData.license_number?.trim()
  );

  appendFormField(
    formData,
    "license_expiry",
    doctorData.license_expiry
  );

  appendFormField(
    formData,
    "available_status",
    doctorData.available_status || "Available"
  );

  appendFormField(
    formData,
    "status",
    doctorData.status || "Active"
  );

  /*
    IMPORTANT:
    Only append the real image File.

    Do NOT send:
    - Base64
    - blob URL
    - preview URL
    - form.photo
  */
  if (doctorData.photo_file instanceof File) {
    formData.append("photo", doctorData.photo_file);
  }

  return formData;
};

/* =========================================================
   AVAILABILITY / STATUS
========================================================= */

const getAvailabilityType = (availability) => {
  switch (availability) {
    case "Available":
      return "available";

    case "Unavailable":
      return "unavailable";

    case "On Leave":
      return "leave";

    default:
      return "default";
  }
};

const getStatusType = (status) => {
  return status === "Active" ? "active" : "inactive";
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ children, type = "default" }) => {
  const styles = {
    active: "bg-[#E8F8F6] text-[#078E89]",
    inactive: "bg-[#F1F4F4] text-[#6E8081]",
    available: "bg-[#E8F8F6] text-[#078E89]",
    unavailable: "bg-[#FFF4E8] text-[#B56A14]",
    leave: "bg-[#FFF1F1] text-[#C85A5A]",
    default: "bg-[#F1F4F4] text-[#31585A]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[type] || styles.default
      }`}
    >
      {children}
    </span>
  );
};

/* =========================================================
   MOBILE DOCTOR CARD
========================================================= */

const DoctorMobileCard = ({
  doctor,
  onView,
  onEdit,
  onDelete,
}) => {
  const name = getDoctorName(doctor);
  const photoUrl = getPhotoUrl(doctor.photo);

  return (
    <div className="rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-[#E8F8F6]"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-xs font-bold text-[#08A6A0]">
              {getInitials(doctor)}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#173F41]">
              {name}
            </p>

            <p className="mt-0.5 text-xs text-[#819596]">
              {doctor.registration_number || "No registration"}
            </p>
          </div>
        </div>

        <StatusBadge
          type={getAvailabilityType(doctor.available_status)}
        >
          {doctor.available_status || "Unavailable"}
        </StatusBadge>
      </div>

      {/* Information Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Specialization
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-[#31585A] sm:text-sm">
            {doctor.specialization || "Not specified"}
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Department
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-[#31585A] sm:text-sm">
            {doctor.department || "Not specified"}
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Experience
          </p>

          <p className="mt-1 text-xs font-semibold text-[#31585A] sm:text-sm">
            {Number(doctor.experience_years || 0)} yrs exp
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Fee / Status
          </p>

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#08A6A0] sm:text-sm">
              ₹{doctor.consultation_fee || 0}
            </span>

            <StatusBadge type={getStatusType(doctor.status)}>
              {doctor.status || "Inactive"}
            </StatusBadge>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2 border-t border-[#EAF2F0] pt-3">
        <button
          type="button"
          onClick={() => onView(doctor)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-semibold text-[#073F42] transition hover:bg-[#DDF3F0]"
        >
          <Eye size={14} />
          View Profile
        </button>

        <button
          type="button"
          onClick={() => onEdit(doctor)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          title="Edit Doctor"
        >
          <Edit3 size={15} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(doctor)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          title="Delete Doctor"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   DOCTORS PAGE
========================================================= */

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  /* =======================================================
     TOAST
  ======================================================= */

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  /* =======================================================
     FETCH DOCTORS
  ======================================================= */

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/api/doctors");

      if (!Array.isArray(data)) {
        throw new Error("Invalid doctors response from server");
      }

      const formatted = data.map(formatDoctor);

      setDoctors(formatted.filter(Boolean));
    } catch (err) {
      console.error(
        "Failed to load doctors from backend:",
        err
      );

      showToast(
        err?.message || "Failed to load doctors",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const departments = useMemo(() => {
    const uniqueDepartments = [
      ...new Set(
        doctors
          .map((doctor) => doctor.department)
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));

    return ["All", ...uniqueDepartments];
  }, [doctors]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total = doctors.length;

    const active = doctors.filter(
      (doctor) => doctor.status === "Active"
    ).length;

    const available = doctors.filter(
      (doctor) =>
        doctor.status === "Active" &&
        doctor.available_status === "Available"
    ).length;

    const onLeave = doctors.filter(
      (doctor) => doctor.available_status === "On Leave"
    ).length;

    return {
      total,
      active,
      available,
      onLeave,
    };
  }, [doctors]);

  /* =======================================================
     SEARCH + FILTER
  ======================================================= */

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const name = getDoctorName(doctor).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        doctor.registration_number
          ?.toLowerCase()
          .includes(query) ||
        doctor.specialization
          ?.toLowerCase()
          .includes(query) ||
        doctor.department
          ?.toLowerCase()
          .includes(query) ||
        doctor.phone?.toLowerCase().includes(query) ||
        doctor.email?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        doctor.status === statusFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        doctor.available_status === availabilityFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        doctor.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAvailability &&
        matchesDepartment
      );
    });
  }, [
    doctors,
    search,
    statusFilter,
    availabilityFilter,
    departmentFilter,
  ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setAvailabilityFilter("All");
    setDepartmentFilter("All");
  };

  /* =======================================================
     ADD DOCTOR
  ======================================================= */

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setSelectedDoctor(null);
    setShowDoctorForm(true);
  };

  /* =======================================================
     EDIT DOCTOR
  ======================================================= */

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setSelectedDoctor(null);
    setShowDoctorForm(true);
  };

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  const handleCloseDoctorForm = () => {
    setShowDoctorForm(false);
    setEditingDoctor(null);
  };

  /* =======================================================
     CREATE / UPDATE DOCTOR
  ======================================================= */

  const handleDoctorSubmit = async (doctorData) => {
    if (saving) return;

    const doctorId =
      doctorData?.doctor_id ?? doctorData?.id ?? null;

    try {
      setSaving(true);

      const formData = buildDoctorFormData(doctorData);

      let response;

      /* -----------------------------------------------------
         UPDATE
      ----------------------------------------------------- */

      if (doctorId) {
        response = await apiRequest(
          `/api/doctors/${doctorId}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        const formattedDoctor = formatDoctor(response);

        setDoctors((currentDoctors) =>
          currentDoctors.map((doctor) =>
            getDoctorId(doctor) === Number(doctorId)
              ? formattedDoctor
              : doctor
          )
        );

        /*
          If the profile modal was open for this doctor,
          update it with the new backend response.
        */
        setSelectedDoctor((current) => {
          if (
            current &&
            getDoctorId(current) === Number(doctorId)
          ) {
            return formattedDoctor;
          }

          return current;
        });

        showToast(
          "Doctor details updated successfully!",
          "success"
        );
      }

      /* -----------------------------------------------------
         CREATE
      ----------------------------------------------------- */

      else {
        /*
          Registration number is required by the backend.

          DoctorForm normally provides it, but this fallback
          keeps the request safe if the form leaves it empty.
        */
        if (!doctorData.registration_number?.trim()) {
          formData.set(
            "registration_number",
            `REG-DOC-${Date.now().toString().slice(-6)}`
          );
        }

        response = await apiRequest("/api/doctors", {
          method: "POST",
          body: formData,
        });

        const formattedDoctor = formatDoctor(response);

        setDoctors((currentDoctors) => [
          formattedDoctor,
          ...currentDoctors,
        ]);

        showToast(
          "Doctor registered successfully!",
          "success"
        );
      }

      setShowDoctorForm(false);
      setEditingDoctor(null);
    } catch (err) {
      console.error(
        doctorId
          ? "Failed to update doctor:"
          : "Failed to create doctor:",
        err
      );

      let message =
        err?.message ||
        (doctorId
          ? "Failed to update doctor"
          : "Failed to register doctor");

      /*
        apiRequest may return FastAPI validation errors
        in different formats. Keep the UI message readable.
      */
      if (typeof message !== "string") {
        message = "Something went wrong";
      }

      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE DOCTOR
  ======================================================= */

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete || deleting) return;

    const doctorId = getDoctorId(doctorToDelete);

    if (!doctorId) {
      showToast(
        "Doctor ID is missing. Cannot delete this doctor.",
        "error"
      );

      setDoctorToDelete(null);
      return;
    }

    try {
      setDeleting(true);

      await apiRequest(`/api/doctors/${doctorId}`, {
        method: "DELETE",
      });

      setDoctors((currentDoctors) =>
        currentDoctors.filter(
          (doctor) =>
            getDoctorId(doctor) !== Number(doctorId)
        )
      );

      setSelectedDoctor((current) =>
        current &&
        getDoctorId(current) === Number(doctorId)
          ? null
          : current
      );

      showToast(
        "Doctor removed successfully!",
        "success"
      );

      setDoctorToDelete(null);
    } catch (err) {
      console.error(
        "Failed to delete doctor:",
        err
      );

      showToast(
        err?.message || "Failed to remove doctor",
        "error"
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
          TOAST ALERT
      =================================================== */}

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all duration-300 ${
            toast.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700 shadow-red-500/10"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-500/10"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          )}

          <span>{toast.message}</span>
        </div>
      )}

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#173F41] sm:text-2xl">
                Doctors
              </h1>

              <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
                Manage hospital doctors and their professional
                information
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddDoctor}
          className="
            inline-flex
            h-10
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#08A6A0]
            px-4
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#078E89]
            sm:h-11
          "
        >
          <Plus className="h-4 w-4" />
          Add Doctor
        </button>
      </div>

      {/* ===================================================
          STATS
      =================================================== */}

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Doctors"
          value={stats.total}
        />

        <StatCard
          icon={UserRound}
          label="Active Doctors"
          value={stats.active}
        />

        <StatCard
          icon={Activity}
          label="Available Now"
          value={stats.available}
        />

        <StatCard
          icon={CalendarDays}
          label="On Leave"
          value={stats.onLeave}
        />
      </div>

      {/* ===================================================
          SEARCH & FILTERS
      =================================================== */}

      <div className="mb-5">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          placeholder="Search doctor, registration, specialization..."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Department */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                Department
              </label>

              <select
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(event.target.value)
                }
                className="
                  h-10
                  w-full
                  rounded-xl
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
                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                Availability
              </label>

              <select
                value={availabilityFilter}
                onChange={(event) =>
                  setAvailabilityFilter(event.target.value)
                }
                className="
                  h-10
                  w-full
                  rounded-xl
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
                <option value="All">
                  All Availability
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Unavailable">
                  Unavailable
                </option>

                <option value="On Leave">
                  On Leave
                </option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="
                  h-10
                  w-full
                  rounded-xl
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
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          {(statusFilter !== "All" ||
            availabilityFilter !== "All" ||
            departmentFilter !== "All" ||
            search.trim()) && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#08A6A0] hover:text-[#078E89]"
              >
                Clear Filters
              </button>
            </div>
          )}
        </SearchFilter>
      </div>

      {/* ===================================================
          RESULTS
      =================================================== */}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-[#819596] sm:text-sm">
          Showing{" "}
          <span className="font-semibold text-[#31585A]">
            {filteredDoctors.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#31585A]">
            {doctors.length}
          </span>{" "}
          doctors
        </p>
      </div>

      {/* ===================================================
          LOADING
      =================================================== */}

      {loading ? (
        <div className="rounded-2xl border border-[#E2EFED] bg-white px-5 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F8F6] text-[#08A6A0]">
            <Stethoscope className="h-6 w-6 animate-pulse" />
          </div>

          <p className="mt-4 text-sm font-bold text-[#31585A]">
            Loading doctors...
          </p>

          <p className="mt-1 text-xs text-[#819596]">
            Fetching doctor information from the server.
          </p>
        </div>
      ) : (
        <>
          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[#E2EFED] bg-[#FAFDFC]">
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                      Doctor
                    </th>

                    <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                      Registration
                    </th>

                    <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                      Specialization
                    </th>

                    <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                      Department
                    </th>

                    <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                      Experience
                    </th>

                    <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                      Availability
                    </th>

                    <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EAF2F0]">
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => {
                      const doctorId = getDoctorId(doctor);
                      const photoUrl = getPhotoUrl(
                        doctor.photo
                      );

                      return (
                        <tr
                          key={doctorId}
                          className="transition hover:bg-[#FAFDFC]"
                        >
                          {/* Doctor */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt={getDoctorName(doctor)}
                                  className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-[#E8F8F6]"
                                  onError={(event) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-xs font-bold text-[#08A6A0]">
                                  {getInitials(doctor)}
                                </div>
                              )}

                              <div className="min-w-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedDoctor(
                                      doctor
                                    )
                                  }
                                  className="block max-w-[210px] truncate text-left text-sm font-bold text-[#173F41] transition hover:text-[#08A6A0]"
                                >
                                  {getDoctorName(doctor)}
                                </button>

                                <p className="mt-0.5 truncate text-xs text-[#819596]">
                                  {doctor.qualification ||
                                    "Qualification not provided"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Registration */}
                          <td className="px-4 py-4">
                            <span className="text-xs font-semibold text-[#31585A]">
                              {doctor.registration_number ||
                                "Not provided"}
                            </span>
                          </td>

                          {/* Specialization */}
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#31585A]">
                              {doctor.specialization ||
                                "Not specified"}
                            </span>
                          </td>

                          {/* Department */}
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#31585A]">
                              {doctor.department ||
                                "Not specified"}
                            </span>
                          </td>

                          {/* Experience */}
                          <td className="px-4 py-4">
                            <span className="text-sm font-semibold text-[#31585A]">
                              {Number(
                                doctor.experience_years || 0
                              )}{" "}
                              yrs
                            </span>
                          </td>

                          {/* Availability */}
                          <td className="px-4 py-4">
                            <StatusBadge
                              type={getAvailabilityType(
                                doctor.available_status
                              )}
                            >
                              {doctor.available_status ||
                                "Unavailable"}
                            </StatusBadge>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <StatusBadge
                              type={getStatusType(
                                doctor.status
                              )}
                            >
                              {doctor.status || "Inactive"}
                            </StatusBadge>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedDoctor(
                                    doctor
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                                title="View Doctor"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditDoctor(
                                    doctor
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                                title="Edit Doctor"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDoctorToDelete(
                                    doctor
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#FFF1F1] hover:text-[#C85A5A]"
                                title="Remove Doctor"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-16 text-center"
                      >
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6] text-[#08A6A0]">
                            <Stethoscope className="h-7 w-7" />
                          </div>

                          <h3 className="mt-4 text-sm font-bold text-[#173F41]">
                            No doctors found
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-[#819596]">
                            No doctor matches your current
                            search or filter criteria.
                          </p>

                          <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 text-xs font-semibold text-[#08A6A0] hover:text-[#078E89]"
                          >
                            Clear Search & Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* =================================================
              MOBILE DOCTOR CARDS
          ================================================= */}

          <div className="space-y-3 md:hidden">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorMobileCard
                  key={getDoctorId(doctor)}
                  doctor={doctor}
                  onView={setSelectedDoctor}
                  onEdit={handleEditDoctor}
                  onDelete={setDoctorToDelete}
                />
              ))
            ) : (
              <div className="rounded-xl border border-[#E2EFED] bg-white px-5 py-12 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F8F6] text-[#08A6A0]">
                  <Stethoscope size={22} />
                </div>

                <p className="mt-3 text-sm font-bold text-[#31585A]">
                  No doctors found
                </p>

                <p className="mt-1 text-xs text-[#819596]">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-xs font-semibold text-[#08A6A0] hover:text-[#078E89]"
                >
                  Clear Search & Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ===================================================
          DOCTOR FORM
      =================================================== */}

      <DoctorForm
        open={showDoctorForm}
        doctor={editingDoctor}
        onClose={handleCloseDoctorForm}
        onSubmit={handleDoctorSubmit}
      />

      {/* ===================================================
          DOCTOR PROFILE
      =================================================== */}

      {selectedDoctor && (
        <DoctorProfile
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onEdit={handleEditDoctor}
        />
      )}

      {/* ===================================================
          DELETE CONFIRMATION
      =================================================== */}

      {doctorToDelete && (
        <ConfirmDialog
          open={Boolean(doctorToDelete)}
          title="Remove Doctor"
          message={`Are you sure you want to remove ${getDoctorName(
            doctorToDelete
          )}? This action cannot be undone.`}
          confirmText={
            deleting ? "Removing..." : "Remove Doctor"
          }
          cancelText="Cancel"
          onConfirm={handleDeleteDoctor}
          onCancel={() => {
            if (!deleting) {
              setDoctorToDelete(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default Doctors;