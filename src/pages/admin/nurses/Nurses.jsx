import { useMemo, useState } from "react";
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
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import NurseForm from "../../../components/admin/NurseForm";
import NurseProfile from "../../../components/admin/NurseProfile";

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
 * Converts the photo value returned by your backend into
 * a usable browser URL.
 *
 * Supported:
 *
 * https://server.com/uploads/nurse.jpg
 * http://localhost:8000/uploads/nurse.jpg
 * /uploads/nurse.jpg
 * uploads/nurse.jpg
 * blob:http://localhost:5173/...
 */
const getPhotoUrl = (photo) => {
  if (!photo || typeof photo !== "string") {
    return "";
  }

  const cleanPhoto = photo.trim();

  if (!cleanPhoto) {
    return "";
  }

  if (
    cleanPhoto.startsWith("http://") ||
    cleanPhoto.startsWith("https://") ||
    cleanPhoto.startsWith("blob:") ||
    cleanPhoto.startsWith("data:")
  ) {
    return cleanPhoto;
  }

  /*
   * Change this only if your backend runs on another port.
   */
  const API_BASE_URL = "http://localhost:8000";

  return `${API_BASE_URL}/${cleanPhoto.replace(/^\/+/, "")}`;
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
  const [nurses, setNurses] = useState(initialNurses);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");

  const [selectedNurse, setSelectedNurse] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);

  const [deleteNurse, setDeleteNurse] = useState(null);

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

  const handleNurseSubmit = (formData) => {
    if (!formData) return;

    /*
     * The form returns:
     *
     * photo      -> existing URL or temporary preview
     * photo_file -> actual File object
     */

    let photo = formData.photo || "";

    /*
     * If a NEW image was selected, create a temporary preview.
     *
     * This is important because photo_file itself cannot be used
     * directly inside <img src={...}>.
     */
    if (formData.photo_file instanceof File) {
      photo = createPhotoPreview(
        formData.photo_file
      );
    }

    /* ---------------------------------------------------------------------- */
    /*                                UPDATE                                  */
    /* ---------------------------------------------------------------------- */

    if (editingNurse?.nurse_id != null) {
      const updatedNurse = {
        ...editingNurse,
        ...formData,

        /*
         * NEVER change the original nurse_id while editing.
         */
        nurse_id: editingNurse.nurse_id,

        /*
         * staff_id belongs to the staff table.
         */
        staff_id: Number(
          formData.staff_id ||
            editingNurse.staff_id
        ),

        experience_years: Number(
          formData.experience_years || 0
        ),

        status:
          formData.status ||
          editingNurse.status ||
          "Active",

        /*
         * Photo logic:
         *
         * 1. New file selected
         *    -> temporary preview
         *
         * 2. Existing photo preserved
         *    -> existing server URL/path
         *
         * 3. No photo at all
         *    -> empty
         */
        photo:
          formData.photo_file instanceof File
            ? photo
            : formData.photo !== undefined
            ? formData.photo
            : editingNurse.photo || "",

        /*
         * Keep the actual File so your API/backend
         * can upload it.
         */
        photo_file:
          formData.photo_file || null,
      };

      setNurses((currentNurses) =>
        currentNurses.map((nurse) =>
          Number(nurse.nurse_id) ===
          Number(editingNurse.nurse_id)
            ? updatedNurse
            : nurse
        )
      );

      /*
       * If the profile is open, update the profile too.
       */
      if (
        selectedNurse &&
        Number(selectedNurse.nurse_id) ===
          Number(editingNurse.nurse_id)
      ) {
        setSelectedNurse(updatedNurse);
      }

      setFormOpen(false);
      setEditingNurse(null);

      return;
    }

    /* ---------------------------------------------------------------------- */
    /*                                  ADD                                   */
    /* ---------------------------------------------------------------------- */

    const nextId =
      nurses.length > 0
        ? Math.max(
            ...nurses.map(
              (nurse) =>
                Number(nurse.nurse_id) || 0
            )
          ) + 1
        : 1;

    const newNurse = {
      ...formData,

      nurse_id: nextId,

      staff_id: Number(formData.staff_id),

      experience_years: Number(
        formData.experience_years || 0
      ),

      status: formData.status || "Active",

      /*
       * New image gets its temporary preview.
       */
      photo:
        formData.photo_file instanceof File
          ? photo
          : formData.photo || "",

      photo_file:
        formData.photo_file || null,
    };

    setNurses((currentNurses) => [
      newNurse,
      ...currentNurses,
    ]);

    setFormOpen(false);
    setEditingNurse(null);
  };

  /* ------------------------------------------------------------------------ */
  /*                              Delete Handler                              */
  /* ------------------------------------------------------------------------ */

  const handleDeleteNurse = () => {
    if (!deleteNurse) return;

    const deletedId = deleteNurse.nurse_id;

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
    <div className="space-y-5 pb-8">
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
<div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
  <StatCard
    icon={Users}
    label="Total Nurses"
    value={nurses.length}
  />

  <StatCard
    icon={UserRoundCheck}
    label="Active Nurses"
    value={nurses.filter((nurse) => nurse.status === "Active").length}
  />

  <StatCard
    icon={Activity}
    label="On Leave"
    value={nurses.filter((nurse) => nurse.status === "On Leave").length}
  />

  <StatCard
    icon={UserRound}
    label="Inactive Nurses"
    value={nurses.filter((nurse) => nurse.status === "Inactive").length}
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

      {/* Nurse Table */}

      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#EAF2F0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-bold text-[#173F41] sm:text-base">
              Nursing Staff
            </h2>

            <p className="mt-0.5 text-xs text-[#819596]">
              Showing {filteredNurses.length} of{" "}
              {nurses.length} nurses
            </p>
          </div>
        </div>

        {/* Desktop */}

        <div className="hidden overflow-x-auto md:block">
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
                const nurseName =
                  getNurseName(nurse);

                const photoUrl = getPhotoUrl(
                  nurse.photo
                );

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
                            Nurse ID:{" "}
                            {nurse.nurse_id}
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
                        {nurse.registration_number ||
                          "—"}
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
                        {Number(
                          nurse.experience_years
                        ) === 1
                          ? "year"
                          : "years"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-[#31585A]">
                        {nurse.shift_type || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge
                        status={nurse.status}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedNurse(
                              nurse
                            )
                          }
                          className="
                            flex h-8 w-8 items-center justify-center
                            rounded-lg text-[#819596]
                            transition
                            hover:bg-[#E8F8F6]
                            hover:text-[#08A6A0]
                          "
                          title="View Nurse"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEditNurse(
                              nurse
                            )
                          }
                          className="
                            flex h-8 w-8 items-center justify-center
                            rounded-lg text-[#819596]
                            transition
                            hover:bg-[#E8F8F6]
                            hover:text-[#08A6A0]
                          "
                          title="Edit Nurse"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteNurse(
                              nurse
                            )
                          }
                          className="
                            flex h-8 w-8 items-center justify-center
                            rounded-lg text-[#819596]
                            transition
                            hover:bg-[#FDECEC]
                            hover:text-[#C53D3D]
                          "
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

          {filteredNurses.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Mobile */}

        <div className="divide-y divide-[#EEF4F2] md:hidden">
          {filteredNurses.map((nurse) => {
            const nurseName =
              getNurseName(nurse);

            const photoUrl = getPhotoUrl(
              nurse.photo
            );

            return (
              <div
                key={nurse.nurse_id}
                className="p-4"
              >
                <div className="flex items-start gap-3">
                  <PhotoAvatar
                    photo={photoUrl}
                    name={nurseName}
                    size="h-11 w-11"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#173F41]">
                          {nurseName}
                        </h3>

                        <p className="mt-0.5 text-xs text-[#819596]">
                          Staff ID:{" "}
                          {nurse.staff_id || "—"}
                        </p>
                      </div>

                      <StatusBadge
                        status={nurse.status}
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                      <MobileInfo
                        label="Registration"
                        value={
                          nurse.registration_number
                        }
                      />

                      <MobileInfo
                        label="Department"
                        value={nurse.department}
                      />

                      <MobileInfo
                        label="Qualification"
                        value={nurse.qualification}
                      />

                      <MobileInfo
                        label="Experience"
                        value={`${nurse.experience_years || 0} years`}
                      />

                      <MobileInfo
                        label="Ward"
                        value={nurse.ward}
                      />

                      <MobileInfo
                        label="Shift"
                        value={nurse.shift_type}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-1 border-t border-[#EEF4F2] pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedNurse(
                            nurse
                          )
                        }
                        className="
                          inline-flex h-8 items-center gap-1.5
                          rounded-lg px-2.5
                          text-xs font-semibold text-[#31585A]
                          hover:bg-[#E8F8F6]
                          hover:text-[#08A6A0]
                        "
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditNurse(
                            nurse
                          )
                        }
                        className="
                          inline-flex h-8 items-center gap-1.5
                          rounded-lg px-2.5
                          text-xs font-semibold text-[#31585A]
                          hover:bg-[#E8F8F6]
                          hover:text-[#08A6A0]
                        "
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteNurse(
                            nurse
                          )
                        }
                        className="
                          inline-flex h-8 items-center gap-1.5
                          rounded-lg px-2.5
                          text-xs font-semibold text-[#C53D3D]
                          hover:bg-[#FDECEC]
                        "
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNurses.length === 0 && (
            <EmptyState />
          )}
        </div>
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