import { useMemo, useState } from "react";
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
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import DoctorForm from "../../../components/admin/DoctorForm";
import DoctorProfile from "../../../components/admin/DoctorProfile";

const initialDoctors = [
  {
    doctor_id: 1,
    registration_number: "REG-DOC-001",
    first_name: "Arindam",
    middle_name: "",
    last_name: "Sen",
    date_of_birth: "1982-05-14",
    gender: "Male",
    phone: "+91 9876543210",
    email: "arindam.sen@hospital.com",
    address: "Kolkata, West Bengal",
    specialization: "Cardiology",
    department: "Cardiology",
    qualification: "MBBS, MD, DM",
    experience_years: 15,
    consultation_fee: 1200,
    license_number: "WB-MC-10001",
    license_expiry: "2028-12-31",
    photo: "",
    available_status: "Available",
    status: "Active",
    created_at: "2026-01-10",
    updated_at: "2026-09-01",
  },
  {
    doctor_id: 2,
    registration_number: "REG-DOC-002",
    first_name: "Moumita",
    middle_name: "",
    last_name: "Roy",
    date_of_birth: "1987-09-22",
    gender: "Female",
    phone: "+91 9876543211",
    email: "moumita.roy@hospital.com",
    address: "Salt Lake, Kolkata",
    specialization: "Neurology",
    department: "Neurology",
    qualification: "MBBS, MD, DM",
    experience_years: 11,
    consultation_fee: 1500,
    license_number: "WB-MC-10002",
    license_expiry: "2029-06-30",
    photo: "",
    available_status: "Available",
    status: "Active",
    created_at: "2026-01-15",
    updated_at: "2026-09-02",
  },
  {
    doctor_id: 3,
    registration_number: "REG-DOC-003",
    first_name: "Sourav",
    middle_name: "",
    last_name: "Mukherjee",
    date_of_birth: "1979-02-08",
    gender: "Male",
    phone: "+91 9876543212",
    email: "sourav.mukherjee@hospital.com",
    address: "Howrah, West Bengal",
    specialization: "Orthopedics",
    department: "Orthopedics",
    qualification: "MBBS, MS",
    experience_years: 18,
    consultation_fee: 1000,
    license_number: "WB-MC-10003",
    license_expiry: "2027-11-30",
    photo: "",
    available_status: "On Leave",
    status: "Active",
    created_at: "2026-02-01",
    updated_at: "2026-09-03",
  },
  {
    doctor_id: 4,
    registration_number: "REG-DOC-004",
    first_name: "Ananya",
    middle_name: "",
    last_name: "Das",
    date_of_birth: "1990-11-18",
    gender: "Female",
    phone: "+91 9876543213",
    email: "ananya.das@hospital.com",
    address: "New Town, Kolkata",
    specialization: "Dermatology",
    department: "Dermatology",
    qualification: "MBBS, MD",
    experience_years: 8,
    consultation_fee: 900,
    license_number: "WB-MC-10004",
    license_expiry: "2030-03-31",
    photo: "",
    available_status: "Available",
    status: "Active",
    created_at: "2026-02-10",
    updated_at: "2026-09-04",
  },
  {
    doctor_id: 5,
    registration_number: "REG-DOC-005",
    first_name: "Rajesh",
    middle_name: "",
    last_name: "Chatterjee",
    date_of_birth: "1975-07-03",
    gender: "Male",
    phone: "+91 9876543214",
    email: "rajesh.chatterjee@hospital.com",
    address: "Ballygunge, Kolkata",
    specialization: "General Medicine",
    department: "Medicine",
    qualification: "MBBS, MD",
    experience_years: 23,
    consultation_fee: 800,
    license_number: "WB-MC-10005",
    license_expiry: "2027-08-31",
    photo: "",
    available_status: "Unavailable",
    status: "Active",
    created_at: "2026-02-18",
    updated_at: "2026-09-05",
  },
];

const getDoctorName = (doctor) =>
  [doctor.first_name, doctor.middle_name, doctor.last_name]
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

const DoctorMobileCard = ({
  doctor,
  onView,
  onEdit,
  onDelete,
}) => {
  const name = getDoctorName(doctor);

  return (
    <div className="rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {doctor.photo ? (
            <img
              src={doctor.photo}
              alt={name}
              className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-[#E8F8F6]"
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
              {doctor.registration_number}
            </p>
          </div>
        </div>

        <StatusBadge type={getAvailabilityType(doctor.available_status)}>
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
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-bold text-[#08A6A0] sm:text-sm">
              ₹{doctor.consultation_fee || 0}
            </span>
            <StatusBadge type={getStatusType(doctor.status)}>
              {doctor.status}
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

const Doctors = () => {
  const [doctors, setDoctors] = useState(initialDoctors);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const departments = useMemo(() => {
    return [
      "All",
      ...new Set(
        doctors
          .map((doctor) => doctor.department)
          .filter(Boolean)
      ),
    ];
  }, [doctors]);

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
        doctor.department?.toLowerCase().includes(query) ||
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

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setShowDoctorForm(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setSelectedDoctor(null);
    setShowDoctorForm(true);
  };

  const handleDoctorSubmit = (doctorData) => {
    const now = new Date().toISOString().split("T")[0];

    if (doctorData.doctor_id) {
      setDoctors((currentDoctors) =>
        currentDoctors.map((doctor) =>
          doctor.doctor_id === doctorData.doctor_id
            ? {
                ...doctor,
                ...doctorData,
                updated_at: now,
              }
            : doctor
        )
      );
    } else {
      const nextId =
        doctors.length > 0
          ? Math.max(
              ...doctors.map((doctor) =>
                Number(doctor.doctor_id) || 0
              )
            ) + 1
          : 1;

      const newDoctor = {
        ...doctorData,
        doctor_id: nextId,
        created_at: now,
        updated_at: now,
      };

      setDoctors((currentDoctors) => [
        newDoctor,
        ...currentDoctors,
      ]);
    }

    setShowDoctorForm(false);
    setEditingDoctor(null);
  };

  const handleDeleteDoctor = () => {
    if (!doctorToDelete) return;

    setDoctors((currentDoctors) =>
      currentDoctors.filter(
        (doctor) =>
          doctor.doctor_id !== doctorToDelete.doctor_id
      )
    );

    if (
      selectedDoctor?.doctor_id === doctorToDelete.doctor_id
    ) {
      setSelectedDoctor(null);
    }

    setDoctorToDelete(null);
  };

  const clearFilters = () => {
    setStatusFilter("All");
    setAvailabilityFilter("All");
    setDepartmentFilter("All");
    setSearch("");
  };

  return (
    <div className="min-h-full bg-[#F7FBFA] p-3 sm:p-4 lg:p-5">
      {/* Header */}
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

      {/* Stats */}
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
      {/* Search & Filters */}
      <div className="mb-5">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          placeholder="Search doctor, registration, specialization..."
        >
          <div className="grid gap-3 sm:grid-cols-3">
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
                <option value="All">All Availability</option>
                <option value="Available">Available</option>
                <option value="Unavailable">
                  Unavailable
                </option>
                <option value="On Leave">On Leave</option>
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
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {(statusFilter !== "All" ||
            availabilityFilter !== "All" ||
            departmentFilter !== "All") && (
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

      {/* Results */}
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

      {/* Doctor Table */}
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
                filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.doctor_id}
                    className="transition hover:bg-[#FAFDFC]"
                  >
                    {/* Doctor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {doctor.photo ? (
                          <img
                            src={doctor.photo}
                            alt={getDoctorName(doctor)}
                            className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-[#E8F8F6]"
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
                              setSelectedDoctor(doctor)
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
                        {doctor.registration_number}
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
                        {doctor.department || "Not specified"}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-[#31585A]">
                        {Number(doctor.experience_years || 0)}{" "}
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
                        type={getStatusType(doctor.status)}
                      >
                        {doctor.status}
                      </StatusBadge>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDoctor(doctor)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          title="View Doctor"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEditDoctor(doctor)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          title="Edit Doctor"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDoctorToDelete(doctor)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#FFF1F1] hover:text-[#C85A5A]"
                          title="Remove Doctor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
                        No doctor matches your current search
                        or filter criteria.
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

      {/* Mobile Doctor Cards */}
      <div className="space-y-3 md:hidden">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorMobileCard
              key={doctor.doctor_id}
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
          </div>
        )}
      </div>

      {/* Doctor Form */}
      <DoctorForm
        open={showDoctorForm}
        doctor={editingDoctor}
        onClose={() => {
          setShowDoctorForm(false);
          setEditingDoctor(null);
        }}
        onSubmit={handleDoctorSubmit}
      />

      {/* Doctor Profile */}
      {selectedDoctor && (
        <DoctorProfile
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onEdit={handleEditDoctor}
        />
      )}

      {/* Delete Confirmation */}
      {doctorToDelete && (
        <ConfirmDialog
          open={Boolean(doctorToDelete)}
          title="Remove Doctor"
          message={`Are you sure you want to remove ${getDoctorName(
            doctorToDelete
          )}? This action cannot be undone.`}
          confirmText="Remove Doctor"
          cancelText="Cancel"
          onConfirm={handleDeleteDoctor}
          onCancel={() => setDoctorToDelete(null)}
        />
      )}
    </div>
  );
};

export default Doctors;