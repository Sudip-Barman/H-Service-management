import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Eye,
  HeartPulse,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  UserRoundCheck,
  Users,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import NurseForm from "../../../components/admin/NurseForm";
import NurseProfile from "../../../components/admin/NurseProfile";
import SetCredentialsModal from "../../../components/admin/SetCredentialsModal";
import { apiRequest, getErrorMessage, getPhotoUrl } from "../../../api/api";
import { getTemporaryPassword, saveTemporaryPassword } from "../../../utils/temporaryPasswords";

/* -------------------------------------------------------------------------- */
/*                                Mock Data                                   */
/* -------------------------------------------------------------------------- */

const initialNurses = [
  {
    nurse_id: 1,
    staff_id: 101,
    registration_number: "REG-NUR-001",
    first_name: "Priyanka",
    middle_name: "",
    last_name: "Das",
    date_of_birth: "1996-04-15",
    gender: "Female",
    phone: "9876543210",
    email: "priyanka.das@hospital.com",
    address: "Kolkata, West Bengal",
    qualification: "B.Sc Nursing",
    department: "Emergency",
    ward: "Emergency Ward",
    experience_years: 6,
    license_number: "WB-NUR-1001",
    license_expiry: "2028-06-10",
    shift_type: "Morning",
    status: "Active",
    photo: "",
    photo_file: null,
  },

  {
    nurse_id: 2,
    staff_id: 102,
    registration_number: "REG-NUR-002",
    first_name: "Moumita",
    middle_name: "",
    last_name: "Ghosh",
    date_of_birth: "1994-08-22",
    gender: "Female",
    phone: "9830123456",
    email: "moumita.ghosh@hospital.com",
    address: "Howrah, West Bengal",
    qualification: "B.Sc Nursing",
    department: "ICU",
    ward: "ICU",
    experience_years: 8,
    license_number: "WB-NUR-1002",
    license_expiry: "2029-02-18",
    shift_type: "Night",
    status: "Active",
    photo: "",
    photo_file: null,
  },

  {
    nurse_id: 3,
    staff_id: 103,
    registration_number: "REG-NUR-003",
    first_name: "Sushmita",
    middle_name: "",
    last_name: "Roy",
    date_of_birth: "1998-01-12",
    gender: "Female",
    phone: "9123456789",
    email: "sushmita.roy@hospital.com",
    address: "Salt Lake, Kolkata",
    qualification: "GNM",
    department: "General Medicine",
    ward: "General Ward",
    experience_years: 4,
    license_number: "WB-NUR-1003",
    license_expiry: "2027-07-04",
    shift_type: "Evening",
    status: "On Leave",
    photo: "",
    photo_file: null,
  },

  {
    nurse_id: 4,
    staff_id: 104,
    registration_number: "REG-NUR-004",
    first_name: "Ananya",
    middle_name: "",
    last_name: "Sen",
    date_of_birth: "1992-11-05",
    gender: "Female",
    phone: "9007123456",
    email: "ananya.sen@hospital.com",
    address: "Dum Dum, Kolkata",
    qualification: "M.Sc Nursing",
    department: "Cardiology",
    ward: "Cardiology Ward",
    experience_years: 11,
    license_number: "WB-NUR-1004",
    license_expiry: "2030-03-20",
    shift_type: "Rotating",
    status: "Active",
    photo: "",
    photo_file: null,
  },

  {
    nurse_id: 5,
    staff_id: 105,
    registration_number: "REG-NUR-005",
    first_name: "Riya",
    middle_name: "",
    last_name: "Mukherjee",
    date_of_birth: "1999-06-28",
    gender: "Female",
    phone: "8910123456",
    email: "riya.mukherjee@hospital.com",
    address: "Behala, Kolkata",
    qualification: "GNM",
    department: "Pediatrics",
    ward: "Children Ward",
    experience_years: 2,
    license_number: "WB-NUR-1005",
    license_expiry: "2029-01-08",
    shift_type: "Morning",
    status: "Active",
    photo: "",
    photo_file: null,
  },

  {
    nurse_id: 6,
    staff_id: 106,
    registration_number: "REG-NUR-006",
    first_name: "Swati",
    middle_name: "",
    last_name: "Chakraborty",
    date_of_birth: "1995-03-17",
    gender: "Female",
    phone: "9831456789",
    email: "swati.chakraborty@hospital.com",
    address: "Barasat, West Bengal",
    qualification: "B.Sc Nursing",
    department: "Orthopedics",
    ward: "Orthopedic Ward",
    experience_years: 7,
    license_number: "WB-NUR-1006",
    license_expiry: "2028-09-14",
    shift_type: "Evening",
    status: "Inactive",
    photo: "",
    photo_file: null,
  },
];

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

const getNurseName = (nurse) => {
  if (!nurse) return "Unknown Nurse";

  if (nurse.full_name) {
    return nurse.full_name;
  }

  const parts = [
    nurse.first_name,
    nurse.middle_name,
    nurse.last_name,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return `Nurse #${nurse.nurse_id || ""}`.trim();
};

const getInitials = (name = "") => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "N";
};



/*
 * Creates a temporary browser preview for a newly selected image.
 *
 * This makes the newly added/updated photo immediately visible
 * even before the backend returns the permanent URL.
 */
const createPhotoPreview = (photoFile) => {
  if (!(photoFile instanceof File)) {
    return "";
  }

  return URL.createObjectURL(photoFile);
};

/*
 * Builds a multipart FormData payload matching the doctor upload architecture.
 */
const buildNurseFormData = (nurseData, isUpdate = false) => {
  const formData = new FormData();

  const appendField = (name, value) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(name, value);
    }
  };

  if (!isUpdate) {
    formData.append(
      "registration_number",
      nurseData.registration_number?.trim() || `REG-NUR-${Date.now().toString().slice(-4)}`
    );
  } else if (nurseData.registration_number) {
    formData.append("registration_number", nurseData.registration_number.trim());
  }

  appendField("first_name", nurseData.first_name?.trim());
  appendField("middle_name", nurseData.middle_name?.trim());
  appendField("last_name", nurseData.last_name?.trim());
  appendField("date_of_birth", nurseData.date_of_birth);
  formData.append("gender", nurseData.gender || "Female");
  appendField("phone", nurseData.phone?.trim());
  appendField("email", nurseData.email?.trim());
  appendField("address", nurseData.address?.trim());
  appendField("qualification", nurseData.qualification?.trim());
  formData.append("department", nurseData.department?.trim() || "Nursing");
  appendField("ward", nurseData.ward?.trim());
  formData.append("experience_years", String(Number(nurseData.experience_years || 0)));
  appendField("license_number", nurseData.license_number?.trim());
  appendField("license_expiry", nurseData.license_expiry);
  formData.append("shift_type", nurseData.shift_type || "Morning");
  formData.append("status", nurseData.status || "Active");

  if (nurseData.username) {
    formData.append("username", nurseData.username.trim().toLowerCase());
  }

  if (!isUpdate && nurseData.temporary_password) {
    formData.append("temporary_password", nurseData.temporary_password);
  }

  /*
   * IMPORTANT:
   * Only append the real image File.
   * Matches Doctor upload architecture.
   */
  if (nurseData.photo_file instanceof File) {
    formData.append("photo", nurseData.photo_file);
  }

  if (isUpdate && nurseData.remove_photo && !(nurseData.photo_file instanceof File)) {
    formData.append("remove_photo", "true");
  }

  return formData;
};

/* -------------------------------------------------------------------------- */
/*                                  Badges                                    */
/* -------------------------------------------------------------------------- */

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-[#E8F8F6] text-[#078E89]",
    Inactive: "bg-[#F3F5F5] text-[#819596]",
    "On Leave": "bg-[#FFF7E8] text-[#B7791F]",
  };

  const dots = {
    Active: "bg-[#08A6A0]",
    Inactive: "bg-[#819596]",
    "On Leave": "bg-[#B7791F]",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-2.5 py-1
        text-[11px] font-semibold
        ${styles[status] || "bg-[#F3F5F5] text-[#819596]"}
      `}
    >
      <span
        className={`
          h-1.5 w-1.5 rounded-full
          ${dots[status] || "bg-[#819596]"}
        `}
      />

      {status || "Unknown"}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Page Component                               */
/* -------------------------------------------------------------------------- */

const Nurses = () => {
  const [nurses, setNurses] = useState([]);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");

  const [selectedNurse, setSelectedNurse] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);

  const [deleteNurse, setDeleteNurse] = useState(null);
  const [credentialsNurse, setCredentialsNurse] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const data = await apiRequest("/api/nurses");
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((n) => {
            const storedPwd = getTemporaryPassword(n, "nurse");
            return {
              ...n,
              username: n.username || "",
              nurse_id: n.id,
              staff_id: n.staff_id || (100 + n.id),
              experience_years: Number(n.experience_years || 0),
              temporary_password: n.temporary_password || storedPwd || "",
            };
          });
          setNurses(formatted);
        }
      } catch (err) {
        console.error("Failed to load nurses from backend:", err);
      }
    };
    fetchNurses();
  }, []);


  /* ------------------------------------------------------------------------ */
  /*                                   Stats                                  */
  /* ------------------------------------------------------------------------ */

  const stats = useMemo(() => {
    const total = nurses.length;

    const active = nurses.filter(
      (nurse) => nurse.status === "Active"
    ).length;

    const onLeave = nurses.filter(
      (nurse) => nurse.status === "On Leave"
    ).length;

    const inactive = nurses.filter(
      (nurse) => nurse.status === "Inactive"
    ).length;

    return {
      total,
      active,
      onLeave,
      inactive,
    };
  }, [nurses]);

  /* ------------------------------------------------------------------------ */
  /*                                  Filters                                 */
  /* ------------------------------------------------------------------------ */

  const departments = useMemo(() => {
    return [
      "All",
      ...new Set(
        nurses
          .map((nurse) => nurse.department)
          .filter(Boolean)
      ),
    ];
  }, [nurses]);

  const shiftTypes = useMemo(() => {
    return [
      "All",
      ...new Set(
        nurses
          .map((nurse) => nurse.shift_type)
          .filter(Boolean)
      ),
    ];
  }, [nurses]);

  /* ------------------------------------------------------------------------ */
  /*                              Filtered Nurses                              */
  /* ------------------------------------------------------------------------ */

  const filteredNurses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return nurses.filter((nurse) => {
      const searchableText = [
        getNurseName(nurse),
        nurse.nurse_id,
        nurse.staff_id,
        nurse.registration_number,
        nurse.qualification,
        nurse.department,
        nurse.ward,
        nurse.experience_years,
        nurse.license_number,
        nurse.shift_type,
        nurse.status,
        nurse.phone,
        nurse.email,
      ]
        .filter(
          (value) =>
            value !== undefined &&
            value !== null
        )
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesDepartment =
        departmentFilter === "All" ||
        nurse.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        nurse.status === statusFilter;

      const matchesShift =
        shiftFilter === "All" ||
        nurse.shift_type === shiftFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesShift
      );
    });
  }, [
    nurses,
    search,
    departmentFilter,
    statusFilter,
    shiftFilter,
  ]);

  /* ------------------------------------------------------------------------ */
  /*                              Form Handlers                               */
  /* ------------------------------------------------------------------------ */

  const handleAddNurse = () => {
    setSelectedNurse(null);
    setEditingNurse(null);
    setFormOpen(true);
  };

  const handleEditNurse = (nurse) => {
    if (!nurse) return;

    setSelectedNurse(null);

    /*
     * Always clone the object.
     * This prevents NurseForm from modifying the table object directly.
     */
    setEditingNurse({
      ...nurse,
    });

    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingNurse(null);
  };

  /* ------------------------------------------------------------------------ */
  /*                              Add / Update                                */
  /* ------------------------------------------------------------------------ */

  const handleNurseSubmit = async (formData) => {
    if (!formData) return;

    /* ---------------------------------------------------------------------- */
    /*                                UPDATE                                  */
    /* ---------------------------------------------------------------------- */

    if (editingNurse?.nurse_id != null) {
      try {
        const formDataObj = buildNurseFormData(formData, true);
        const response = await apiRequest(`/api/nurses/${editingNurse.nurse_id}`, {
          method: "PUT",
          body: formDataObj,
        });

        const updatedNurse = {
          ...editingNurse,
          ...(response || {}),
          nurse_id: editingNurse.nurse_id,
          staff_id: Number(response?.staff_id || editingNurse.staff_id),
          experience_years: Number(response?.experience_years ?? editingNurse.experience_years ?? 0),
          status: response?.status || editingNurse.status || "Active",
          // Always use the stable backend URL (/uploads/nurses/...).
          // Never store blob: URLs — they are revoked when the form closes.
          photo: response ? (response.photo ?? "") : (editingNurse.photo ?? ""),
        };

        setNurses((currentNurses) =>
          currentNurses.map((nurse) =>
            Number(nurse.nurse_id) === Number(editingNurse.nurse_id)
              ? updatedNurse
              : nurse
          )
        );

        if (
          selectedNurse &&
          Number(selectedNurse.nurse_id) === Number(editingNurse.nurse_id)
        ) {
          setSelectedNurse(updatedNurse);
        }

        showToast("Nurse details updated successfully!", "success");
      } catch (err) {
        showToast(
          getErrorMessage(err, "Unable to update nurse details. Please try again."),
          "error"
        );
      }

      setFormOpen(false);
      setEditingNurse(null);
      return;
    }

    /* ---------------------------------------------------------------------- */
    /*                                CREATE                                  */
    /* ---------------------------------------------------------------------- */

    let createdNurse = null;
    try {
      const formDataObj = buildNurseFormData(formData, false);
      createdNurse = await apiRequest("/api/nurses", {
        method: "POST",
        body: formDataObj,
      });

      const nextId =
        createdNurse?.id ||
        (nurses.length > 0
          ? Math.max(
              ...nurses.map(
                (nurse) =>
                  Number(nurse.nurse_id) || 0
              )
            ) + 1
          : 1);

      const finalTempPassword =
        createdNurse?.temporary_password || formData.temporary_password || "";

      saveTemporaryPassword({
        role: "nurse",
        id: nextId,
        registration_number: createdNurse?.registration_number || formData.registration_number,
        username: createdNurse?.username || formData.username,
        email: createdNurse?.email || formData.email,
        password: finalTempPassword,
      });

      const newNurse = {
        ...(createdNurse || {}),
        nurse_id: nextId,
        id: nextId,
        staff_id: Number(createdNurse?.staff_id || (100 + nextId)),
        experience_years: Number(createdNurse?.experience_years ?? formData.experience_years ?? 0),
        status: createdNurse?.status || "Active",
        username: createdNurse?.username || "",
        temporary_password: finalTempPassword,
        // Use the stable backend URL (/uploads/nurses/...) so the photo
        // remains visible after the form closes and blob URLs are revoked.
        photo: createdNurse?.photo ?? "",
        // Never store File objects or blob: URLs in state.
        photo_file: undefined,
      };

      setNurses((currentNurses) => [
        newNurse,
        ...currentNurses,
      ]);

      showToast("Nurse registered successfully with photo!", "success");
    } catch (err) {
      showToast(
        getErrorMessage(err, "Nurse registration failed. Please try again."),
        "error"
      );
    }

    setFormOpen(false);
    setEditingNurse(null);
  };

  /* ------------------------------------------------------------------------ */
  /*                              Delete Handler                              */
  /* ------------------------------------------------------------------------ */

  const handleDeleteNurse = async () => {
    if (!deleteNurse) return;

    const deletedId = deleteNurse.id || deleteNurse.nurse_id;
    try {
      await apiRequest(`/api/nurses/${deletedId}`, { method: "DELETE" });
      showToast("Nurse removed successfully!", "success");
    } catch (err) {
        showToast(
          getErrorMessage(err, "Failed to remove nurse. Please try again."),
          "error"
        );
    }

    setNurses((currentNurses) =>
      currentNurses.filter(
        (nurse) =>
          Number(nurse.nurse_id) !==
          Number(deletedId)
      )
    );

    if (
      selectedNurse &&
      Number(selectedNurse.nurse_id) ===
        Number(deletedId)
    ) {
      setSelectedNurse(null);
    }

    setDeleteNurse(null);
  };

  /* ------------------------------------------------------------------------ */
  /*                                  Render                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-4 pb-8 sm:space-y-5 sm:pb-10">
      {/* TOAST ALERT */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all duration-300 ${
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
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F6]">
              <HeartPulse className="h-5 w-5 text-[#08A6A0]" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#173F41] sm:text-2xl">
                Nurses
              </h1>

              <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
                Manage hospital nursing staff and
                their professional information.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddNurse}
          className="
            inline-flex h-10 items-center justify-center gap-2
            rounded-xl bg-[#08A6A0]
            px-4 text-sm font-semibold text-white
            shadow-sm transition
            hover:bg-[#078E89]
            focus:outline-none
            focus:ring-2
            focus:ring-[#08A6A0]/20
          "
        >
          <Plus className="h-4 w-4" />
          Add Nurse
        </button>
      </div>


{/* Statistics */}
<div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
  <StatCard
    icon={Users}
    label="Total Nurses"
    value={stats.total}
  />

  <StatCard
    icon={UserRoundCheck}
    label="Active Nurses"
    value={stats.active}
  />

  <StatCard
    icon={Activity}
    label="On Leave"
    value={stats.onLeave}
  />

  <StatCard
    icon={UserRound}
    label="Inactive Nurses"
    value={stats.inactive}
  />
</div>
      {/* Search & Filters */}

      <SearchFilter
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        placeholder="Search by nurse ID, staff ID, registration, department..."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
              Department
            </label>

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(
                  event.target.value
                )
              }
              className="
                h-10 w-full rounded-xl
                border border-[#D9E9E7]
                bg-[#FAFDFC]
                px-3
                text-sm text-[#173F41]
                outline-none
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
                  {department === "All"
                    ? "All Departments"
                    : department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
              Shift Type
            </label>

            <select
              value={shiftFilter}
              onChange={(event) =>
                setShiftFilter(event.target.value)
              }
              className="
                h-10 w-full rounded-xl
                border border-[#D9E9E7]
                bg-[#FAFDFC]
                px-3
                text-sm text-[#173F41]
                outline-none
                focus:border-[#08A6A0]
                focus:ring-2
                focus:ring-[#08A6A0]/10
              "
            >
              {shiftTypes.map((shift) => (
                <option
                  key={shift}
                  value={shift}
                >
                  {shift === "All"
                    ? "All Shifts"
                    : shift}
                </option>
              ))}
            </select>
          </div>

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
                h-10 w-full rounded-xl
                border border-[#D9E9E7]
                bg-[#FAFDFC]
                px-3
                text-sm text-[#173F41]
                outline-none
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

              <option value="On Leave">
                On Leave
              </option>
            </select>
          </div>
        </div>
      </SearchFilter>

      {/* Desktop Nurse Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm md:block">
        <div className="flex flex-col gap-1 border-b border-[#EAF2F0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-bold text-[#173F41] sm:text-base">
              Nursing Staff
            </h2>

            <p className="mt-0.5 text-xs text-[#819596]">
              Showing {filteredNurses.length} of {nurses.length} nurses
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#EAF2F0] bg-[#FAFDFC]">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Nurse
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Staff ID
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Registration
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Qualification
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Experience
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Shift
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-[#819596]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredNurses.map((nurse) => {
                const nurseName = getNurseName(nurse);
                const photoUrl = getPhotoUrl(nurse.photo);

                return (
                  <tr
                    key={nurse.nurse_id}
                    className="border-b border-[#EEF4F2] last:border-b-0 hover:bg-[#FAFDFC]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <PhotoAvatar
                          photo={photoUrl}
                          name={nurseName}
                          size="h-10 w-10"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#173F41]">
                            {nurseName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-[#819596]">
                            Nurse ID: {nurse.nurse_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-[#31585A]">
                        {nurse.staff_id || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-[#31585A]">
                        {nurse.registration_number || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm text-[#31585A]">
                          {nurse.department || "—"}
                        </p>
                        <p className="mt-0.5 text-xs text-[#819596]">
                          {nurse.ward || "—"}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-[#31585A]">
                        {nurse.qualification || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-[#31585A]">
                        {nurse.experience_years || 0}{" "}
                        {Number(nurse.experience_years) === 1 ? "year" : "years"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-[#31585A]">
                        {nurse.shift_type || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={nurse.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedNurse(nurse)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          title="View Nurse"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCredentialsNurse(nurse)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          title="Login Account Credentials"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditNurse(nurse)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          title="Edit Nurse"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteNurse(nurse)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#FDECEC] hover:text-[#C53D3D]"
                          title="Delete Nurse"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredNurses.length === 0 && <EmptyState />}
        </div>
      </div>

      {/* Mobile Nurse Cards */}
      <div className="space-y-3 md:hidden">
        {filteredNurses.length > 0 ? (
          filteredNurses.map((nurse) => (
            <NurseMobileCard
              key={nurse.nurse_id}
              nurse={nurse}
              onView={setSelectedNurse}
              onEdit={handleEditNurse}
              onCredentials={setCredentialsNurse}
              onDelete={setDeleteNurse}
            />
          ))
        ) : (
          <div className="rounded-xl border border-[#E2EFED] bg-white px-5 py-12 text-center shadow-sm">
            <EmptyState />
          </div>
        )}
      </div>

      {/* Nurse Form */}

      <NurseForm
        open={formOpen}
        nurse={editingNurse}
        onClose={handleCloseForm}
        onSubmit={handleNurseSubmit}
      />

      {/* Nurse Profile */}

      {selectedNurse && (
        <NurseProfile
          nurse={selectedNurse}
          onClose={() =>
            setSelectedNurse(null)
          }
          onEdit={handleEditNurse}
        />
      )}

      {/* Delete Confirmation */}

      {deleteNurse && (
        <ConfirmDialog
          open={Boolean(deleteNurse)}
          title="Remove Nurse"
          message={`Are you sure you want to remove ${getNurseName(
            deleteNurse
          )} from the nursing staff? This action cannot be undone.`}
          confirmText="Remove Nurse"
          cancelText="Cancel"
          onConfirm={handleDeleteNurse}
          onCancel={() =>
            setDeleteNurse(null)
          }
        />
      )}

      <SetCredentialsModal
        open={Boolean(credentialsNurse)}
        employee={credentialsNurse}
        employeeType="nurse"
        onClose={() => setCredentialsNurse(null)}
        onSuccess={(updated) => {
          setNurses((current) =>
            current.map((n) =>
              (n.id === credentialsNurse?.id || n.nurse_id === credentialsNurse?.nurse_id)
                ? {
                    ...n,
                    username: updated?.username || n.username,
                    ...(updated?.temporary_password ? { temporary_password: updated.temporary_password } : {}),
                  }
                : n
            )
          );
          showToast("Nurse login credentials configured successfully!", "success");
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Nurse Mobile Card                             */
/* -------------------------------------------------------------------------- */

const NurseMobileCard = ({
  nurse,
  onView,
  onEdit,
  onCredentials,
  onDelete,
}) => {
  const nurseName = getNurseName(nurse);
  const photoUrl = getPhotoUrl(nurse.photo);

  return (
    <div className="rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PhotoAvatar
            photo={photoUrl}
            name={nurseName}
            size="h-10 w-10"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#173F41]">
              {nurseName}
            </p>
            <p className="mt-0.5 text-xs text-[#819596]">
              Staff ID: {nurse.staff_id || "—"} • {nurse.registration_number || "—"}
            </p>
          </div>
        </div>
        <StatusBadge status={nurse.status} />
      </div>

      {/* Information Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Department / Ward
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-[#31585A] sm:text-sm">
            {nurse.department || "—"} • {nurse.ward || "—"}
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Qualification
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-[#31585A] sm:text-sm">
            {nurse.qualification || "—"}
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Experience
          </p>
          <p className="mt-1 text-xs font-semibold text-[#31585A] sm:text-sm">
            {nurse.experience_years || 0} {Number(nurse.experience_years) === 1 ? "year" : "years"} exp
          </p>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Shift
          </p>
          <p className="mt-1 text-xs font-semibold text-[#31585A] sm:text-sm">
            {nurse.shift_type || "—"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2 border-t border-[#EAF2F0] pt-3">
        <button
          type="button"
          onClick={() => onView(nurse)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-semibold text-[#073F42] transition hover:bg-[#DDF3F0]"
        >
          <Eye size={14} />
          View Profile
        </button>

        <button
          type="button"
          onClick={() => onCredentials(nurse)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
          title="Login Account Credentials"
        >
          <KeyRound size={15} />
        </button>

        <button
          type="button"
          onClick={() => onEdit(nurse)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          title="Edit Nurse"
        >
          <Pencil size={15} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(nurse)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#527071] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          title="Delete Nurse"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Photo Component                               */
/* -------------------------------------------------------------------------- */

const PhotoAvatar = ({
  photo,
  name,
  size = "h-10 w-10",
}) => {
  const [imageError, setImageError] =
    useState(false);

  if (photo && !imageError) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${size} shrink-0 rounded-xl object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`
        ${size}
        flex shrink-0 items-center justify-center
        rounded-xl
        bg-[#E8F8F6]
        text-xs font-bold text-[#08A6A0]
      `}
    >
      {getInitials(name)}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Mobile Info                                  */
/* -------------------------------------------------------------------------- */

const MobileInfo = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A0B1B2]">
      {label}
    </p>

    <p className="mt-0.5 truncate text-xs font-medium text-[#31585A]">
      {value || "—"}
    </p>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               Empty State                                 */
/* -------------------------------------------------------------------------- */

const EmptyState = () => (
  <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6]">
      <Search className="h-5 w-5 text-[#08A6A0]" />
    </div>

    <h3 className="text-sm font-semibold text-[#173F41]">
      No nurses found
    </h3>

    <p className="mt-1 max-w-sm text-xs text-[#819596]">
      Try changing your search or filter criteria.
    </p>
  </div>
);

export default Nurses;