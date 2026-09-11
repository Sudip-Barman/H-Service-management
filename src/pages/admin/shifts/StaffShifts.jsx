import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

const initialShifts = [
  {
    id: "SH-1001",
    staff: "Amit Sharma",
    employeeId: "EMP-1001",
    department: "Reception",
    date: "2026-09-08",
    shift: "Morning",
    startTime: "08:00",
    endTime: "04:00",
    location: "Main Reception",
    status: "Scheduled",
    notes: "Front desk duty",
  },
  {
    id: "SH-1002",
    staff: "Priya Das",
    employeeId: "EMP-1002",
    department: "Nursing",
    date: "2026-09-08",
    shift: "Morning",
    startTime: "08:00",
    endTime: "04:00",
    location: "Ward A",
    status: "Completed",
    notes: "General ward duty",
  },
  {
    id: "SH-1003",
    staff: "Rahul Ghosh",
    employeeId: "EMP-1003",
    department: "Laboratory",
    date: "2026-09-08",
    shift: "Evening",
    startTime: "04:00",
    endTime: "12:00",
    location: "Lab 01",
    status: "Scheduled",
    notes: "Pathology laboratory",
  },
  {
    id: "SH-1004",
    staff: "Sneha Roy",
    employeeId: "EMP-1004",
    department: "Pharmacy",
    date: "2026-09-09",
    shift: "Morning",
    startTime: "08:00",
    endTime: "04:00",
    location: "Pharmacy Counter",
    status: "Scheduled",
    notes: "Medicine counter duty",
  },
  {
    id: "SH-1005",
    staff: "Sourav Paul",
    employeeId: "EMP-1005",
    department: "Emergency",
    date: "2026-09-09",
    shift: "Night",
    startTime: "12:00",
    endTime: "08:00",
    location: "Emergency Unit",
    status: "Scheduled",
    notes: "Emergency night duty",
  },
  {
    id: "SH-1006",
    staff: "Ananya Sen",
    employeeId: "EMP-1006",
    department: "Nursing",
    date: "2026-09-10",
    shift: "Evening",
    startTime: "04:00",
    endTime: "12:00",
    location: "Ward B",
    status: "Off",
    notes: "Weekly off",
  },
];

const staffMembers = [
  {
    name: "Amit Sharma",
    employeeId: "EMP-1001",
    department: "Reception",
  },
  {
    name: "Priya Das",
    employeeId: "EMP-1002",
    department: "Nursing",
  },
  {
    name: "Rahul Ghosh",
    employeeId: "EMP-1003",
    department: "Laboratory",
  },
  {
    name: "Sneha Roy",
    employeeId: "EMP-1004",
    department: "Pharmacy",
  },
  {
    name: "Sourav Paul",
    employeeId: "EMP-1005",
    department: "Emergency",
  },
  {
    name: "Ananya Sen",
    employeeId: "EMP-1006",
    department: "Nursing",
  },
];

const departments = [
  "Reception",
  "Nursing",
  "Laboratory",
  "Pharmacy",
  "Emergency",
  "Administration",
];

const emptyForm = {
  staff: "",
  department: "",
  date: "",
  shift: "Morning",
  startTime: "08:00",
  endTime: "04:00",
  location: "",
  status: "Scheduled",
  notes: "",
};

const statusStyles = {
  Scheduled:
    "border border-[#BFE7E3] bg-[#E8F8F6] text-[#078F8A]",
  Completed:
    "border border-green-200 bg-green-50 text-green-700",
  Off:
    "border border-gray-200 bg-gray-100 text-gray-600",
};

const shiftStyles = {
  Morning: "bg-amber-50 text-amber-700",
  Evening: "bg-indigo-50 text-indigo-700",
  Night: "bg-slate-100 text-slate-700",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatTime = (time) => {
  if (!time) return "-";

  const [hour, minute] = time.split(":");
  const date = new Date();

  date.setHours(Number(hour));
  date.setMinutes(Number(minute));

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function StaffShifts() {
  const [shifts, setShifts] = useState(initialShifts);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [editingShift, setEditingShift] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  /* =========================
     FILTER SHIFTS
  ========================= */

  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        shift.id.toLowerCase().includes(searchText) ||
        shift.staff.toLowerCase().includes(searchText) ||
        shift.employeeId.toLowerCase().includes(searchText) ||
        shift.department.toLowerCase().includes(searchText) ||
        shift.location.toLowerCase().includes(searchText);

      const matchesDepartment =
        departmentFilter === "All" ||
        shift.department === departmentFilter;

      const matchesShift =
        shiftFilter === "All" ||
        shift.shift === shiftFilter;

      const matchesDate =
        !dateFilter || shift.date === dateFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesShift &&
        matchesDate
      );
    });
  }, [
    shifts,
    search,
    departmentFilter,
    shiftFilter,
    dateFilter,
  ]);

  /* =========================
     STATISTICS
  ========================= */

  const totalShifts = shifts.length;

  const scheduledShifts = shifts.filter(
    (shift) => shift.status === "Scheduled"
  ).length;

  const completedShifts = shifts.filter(
    (shift) => shift.status === "Completed"
  ).length;

  const offShifts = shifts.filter(
    (shift) => shift.status === "Off"
  ).length;

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "staff") {
      const selectedStaff = staffMembers.find(
        (member) => member.name === value
      );

      setFormData((prev) => ({
        ...prev,
        staff: value,
        department:
          selectedStaff?.department || "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     OPEN CREATE MODAL
  ========================= */

  const openCreateModal = () => {
    setEditingShift(null);
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  /* =========================
     OPEN EDIT MODAL
  ========================= */

  const openEditModal = (shift) => {
    setEditingShift(shift);
    setFormData({
      staff: shift.staff,
      department: shift.department,
      date: shift.date,
      shift: shift.shift,
      startTime: shift.startTime,
      endTime: shift.endTime,
      location: shift.location,
      status: shift.status,
      notes: shift.notes,
    });

    setFormError("");
    setShowModal(true);
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    setShowModal(false);
    setEditingShift(null);
    setFormData(emptyForm);
    setFormError("");
  };

  /* =========================
     SAVE SHIFT
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.staff ||
      !formData.department ||
      !formData.date ||
      !formData.shift ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.location
    ) {
      setFormError(
        "Please fill all required fields."
      );
      return;
    }

    if (
      formData.startTime === formData.endTime
    ) {
      setFormError(
        "Start time and end time cannot be the same."
      );
      return;
    }

    if (editingShift) {
      setShifts((prev) =>
        prev.map((shift) =>
          shift.id === editingShift.id
            ? {
                ...shift,
                ...formData,
              }
            : shift
        )
      );
    } else {
      const newShift = {
        id: `SH-${1001 + shifts.length}`,
        employeeId:
          staffMembers.find(
            (member) =>
              member.name === formData.staff
          )?.employeeId || "EMP-0000",
        ...formData,
      };

      setShifts((prev) => [
        newShift,
        ...prev,
      ]);
    }

    closeModal();
  };

  /* =========================
     DELETE SHIFT
  ========================= */

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff shift?"
    );

    if (!confirmDelete) return;

    setShifts((prev) =>
      prev.filter((shift) => shift.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#F6FBFA] p-3 sm:p-4 md:p-6">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="mb-1 flex items-center gap-1.5 sm:gap-2">
            <div className="rounded-lg bg-[#E8F8F6] p-1.5 sm:p-2 text-[#08A6A0]">
              <Users size={16} className="sm:size-5" />
            </div>

            <span className="text-xs sm:text-sm font-semibold text-[#08A6A0]">
              ADMINISTRATION
            </span>
          </div>

          <h1 className="text-xl font-bold text-[#173F41] sm:text-2xl lg:text-3xl">
            Staff Shifts
          </h1>

          <p className="mt-0.5 text-xs text-[#789092] sm:text-sm">
            Manage staff duty schedules, working hours
            and shift assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-10 sm:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#08A6A0] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
        >
          <Plus size={16} className="sm:size-[18px]" />
          Add Staff Shift
        </button>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-[#E8F8F6] text-[#08A6A0] [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <CalendarDays />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#173F41]">
              {totalShifts}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">
            Total Shifts
          </p>
        </div>

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-[#E8F8F6] text-[#08A6A0] [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <Clock3 />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#173F41]">
              {scheduledShifts}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">
            Scheduled
          </p>
        </div>

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-green-50 text-green-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <CheckCircle2 />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#173F41]">
              {completedShifts}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">
            Completed
          </p>
        </div>

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-gray-100 text-gray-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <UserRound />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#173F41]">
              {offShifts}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">
            Off / Leave
          </p>
        </div>

      </div>

      {/* =========================
          FILTER CARD
      ========================= */}

      <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-[#E2EFED] bg-white p-3.5 sm:p-4 shadow-sm">

        <div className="mb-3 flex items-center gap-2">
          <div className="rounded-lg bg-[#E8F8F6] p-1.5 sm:p-2 text-[#08A6A0]">
            <Filter size={16} />
          </div>

          <h3 className="text-xs sm:text-sm font-semibold text-[#173F41]">
            Filter Staff Shifts
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 xl:grid-cols-4">

          {/* SEARCH */}

          <div className="relative xl:col-span-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AAEAF]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search staff, ID, location..."
              className="h-9 sm:h-10 w-full rounded-xl border border-[#D9E9E7] bg-white pl-9 pr-3 text-xs sm:text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0]"
            />
          </div>

          {/* DEPARTMENT */}

          <select
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(e.target.value)
            }
            className="h-9 sm:h-10 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-xs sm:text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
          >
            <option value="All">
              All Departments
            </option>

            {departments.map((department) => (
              <option
                key={department}
                value={department}
              >
                {department}
              </option>
            ))}
          </select>

          {/* SHIFT */}

          <select
            value={shiftFilter}
            onChange={(e) =>
              setShiftFilter(e.target.value)
            }
            className="h-9 sm:h-10 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-xs sm:text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
          >
            <option value="All">
              All Shifts
            </option>

            <option value="Morning">
              Morning
            </option>

            <option value="Evening">
              Evening
            </option>

            <option value="Night">
              Night
            </option>
          </select>

          {/* DATE */}

          <input
            type="date"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
            className="h-9 sm:h-10 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-xs sm:text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
          />

        </div>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#E2EFED] bg-white shadow-sm">

        <div className="flex flex-col gap-2 border-b border-[#EAF2F0] px-4 py-3 sm:px-5 sm:py-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#173F41]">
              Staff Shift Schedule
            </h2>

            <p className="mt-0.5 text-xs text-[#819596]">
              {filteredShifts.length} shift
              {filteredShifts.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="rounded-lg bg-[#E8F8F6] px-2.5 py-1 text-xs font-medium text-[#078F8A]">
            Shift Management
          </div>

        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto md:block">

          <table className="min-w-[1250px] w-full">

            <thead className="border-b border-[#EAF2F0] bg-[#F8FCFB]">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Shift ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Staff
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Department
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Shift
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Working Hours
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Location
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#708789]">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#EAF2F0]">

              {filteredShifts.length > 0 ? (
                filteredShifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="transition hover:bg-[#F8FCFB]"
                  >

                    {/* SHIFT ID */}

                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#08A6A0]">
                        {shift.id}
                      </span>
                    </td>

                    {/* STAFF */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                          <UserRound size={17} />
                        </div>

                        <div>
                          <p className="font-medium text-[#173F41]">
                            {shift.staff}
                          </p>

                          <p className="text-xs text-[#819596]">
                            {shift.employeeId}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* DEPARTMENT */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-[#31585A]">
                        {shift.department}
                      </span>
                    </td>

                    {/* DATE */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">

                        <CalendarDays
                          size={16}
                          className="text-[#08A6A0]"
                        />

                        <span className="text-sm font-medium text-[#31585A]">
                          {formatDate(shift.date)}
                        </span>

                      </div>
                    </td>

                    {/* SHIFT */}

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          shiftStyles[shift.shift]
                        }`}
                      >
                        {shift.shift}
                      </span>

                    </td>

                    {/* WORKING HOURS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Clock3
                          size={16}
                          className="text-[#789092]"
                        />

                        <div>
                          <p className="text-sm font-medium text-[#31585A]">
                            {formatTime(
                              shift.startTime
                            )}
                          </p>

                          <p className="text-xs text-[#9AAEAF]">
                            to{" "}
                            {formatTime(
                              shift.endTime
                            )}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* LOCATION */}

                    <td className="px-5 py-4">
                      <span className="text-sm text-[#31585A]">
                        {shift.location}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[shift.status]
                        }`}
                      >
                        {shift.status}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedShift(
                              shift
                            )
                          }
                          title="View Shift"
                          className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                        >
                          <Eye size={17} />
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(shift)
                          }
                          title="Edit Shift"
                          className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                        >
                          <Edit3 size={17} />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(shift.id)
                          }
                          title="Delete Shift"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>

                  <td
                    colSpan="9"
                    className="px-5 py-14 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <CalendarDays
                        size={42}
                        className="mb-3 text-[#C6DAD7]"
                      />

                      <h3 className="font-semibold text-[#31585A]">
                        No shifts found
                      </h3>

                      <p className="mt-1 text-sm text-[#819596]">
                        Try changing your search
                        or filters.
                      </p>

                    </div>

                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* MOBILE CARDS */}
        <div className="space-y-3 p-3 md:hidden">
          {filteredShifts.length > 0 ? (
            filteredShifts.map((shift) => (
              <div key={shift.id} className="rounded-xl border border-[#E2EFED] bg-white p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                      <UserRound size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#173F41]">{shift.staff}</h3>
                      <p className="text-xs text-[#819596]">{shift.id} · {shift.department}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[shift.status]}`}>
                    {shift.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Shift</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{shift.shift}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Date</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{formatDate(shift.date)}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Hours</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Location</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{shift.location}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 border-t border-[#EAF2F0] pt-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedShift(shift)}
                    className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(shift)}
                    className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(shift.id)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-[#E2EFED] bg-white p-6 text-center text-xs text-[#819596]">
              No shifts found. Try changing your search or filters.
            </div>
          )}
        </div>
      </div>

      {/* =========================
          CREATE / EDIT MODAL
      ========================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EAF2F0] bg-white px-6 py-4">

              <div>

                <div className="flex items-center gap-2">

                  <div className="rounded-lg bg-[#E8F8F6] p-2 text-[#08A6A0]">
                    <Clock3 size={18} />
                  </div>

                  <h2 className="text-lg font-bold text-[#173F41]">
                    {editingShift
                      ? "Edit Staff Shift"
                      : "Add Staff Shift"}
                  </h2>

                </div>

                <p className="mt-1 text-sm text-[#819596]">
                  {editingShift
                    ? "Update staff shift information."
                    : "Assign a new duty shift to a staff member."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-2 text-[#789092] transition hover:bg-[#E8F8F6] hover:text-[#078F8A]"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* STAFF */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    Staff Member{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="staff"
                    value={formData.staff}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-white px-3 py-2.5 text-sm text-[#31585A] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  >
                    <option value="">
                      Select staff member
                    </option>

                    {staffMembers.map(
                      (member) => (
                        <option
                          key={member.employeeId}
                          value={member.name}
                        >
                          {member.name} —{" "}
                          {member.employeeId}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* DEPARTMENT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    Department{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-white px-3 py-2.5 text-sm text-[#31585A] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  >
                    <option value="">
                      Select department
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          key={department}
                          value={department}
                        >
                          {department}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* DATE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    Shift Date{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#D9E9E7] px-3 py-2.5 text-sm text-[#31585A] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>

                {/* SHIFT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    Shift Type{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-white px-3 py-2.5 text-sm text-[#31585A] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  >
                    <option value="Morning">
                      Morning
                    </option>

                    <option value="Evening">
                      Evening
                    </option>

                    <option value="Night">
                      Night
                    </option>
                  </select>
                </div>

                {/* START TIME */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    Start Time{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#D9E9E7] px-3 py-2.5 text-sm text-[#31585A] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>

                {/* END TIME */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    End Time{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#D9E9E7] px-3 py-2.5 text-sm text-[#31585A] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>

                {/* LOCATION */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    Duty Location{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Ward A, Reception"
                    className="w-full rounded-xl border border-[#D9E9E7] px-3 py-2.5 text-sm text-[#31585A] outline-none placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>

                {/* STATUS */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    Shift Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-white px-3 py-2.5 text-sm text-[#31585A] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  >
                    <option value="Scheduled">
                      Scheduled
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Off">
                      Off
                    </option>
                  </select>
                </div>

                {/* NOTES */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-[#31585A]">
                    Shift Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter shift notes..."
                    className="w-full resize-none rounded-xl border border-[#D9E9E7] px-3 py-2.5 text-sm text-[#31585A] outline-none placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-[#EAF2F0] pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#D9E9E7] px-5 py-2.5 text-sm font-semibold text-[#31585A] transition hover:bg-[#F6FBFA]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                >
                  <Plus size={18} />

                  {editingShift
                    ? "Update Shift"
                    : "Create Shift"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================
          VIEW SHIFT MODAL
      ========================= */}

      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#EAF2F0] px-6 py-4">

              <div>

                <div className="flex items-center gap-2">

                  <div className="rounded-lg bg-[#E8F8F6] p-2 text-[#08A6A0]">
                    <Clock3 size={18} />
                  </div>

                  <h2 className="text-lg font-bold text-[#173F41]">
                    Shift Details
                  </h2>

                </div>

                <p className="mt-1 text-sm font-semibold text-[#08A6A0]">
                  {selectedShift.id}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedShift(null)
                }
                className="rounded-xl p-2 text-[#789092] transition hover:bg-[#E8F8F6] hover:text-[#078F8A]"
              >
                <X size={20} />
              </button>

            </div>

            {/* DETAILS */}

            <div className="space-y-4 p-6">

              <div className="rounded-2xl bg-[#E8F8F6] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#08A6A0]">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <p className="font-semibold text-[#173F41]">
                      {selectedShift.staff}
                    </p>

                    <p className="text-xs text-[#708789]">
                      {selectedShift.employeeId}
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <p className="text-xs text-[#819596]">
                    Department
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#31585A]">
                    {selectedShift.department}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#819596]">
                    Shift
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      shiftStyles[
                        selectedShift.shift
                      ]
                    }`}
                  >
                    {selectedShift.shift}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-[#819596]">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#31585A]">
                    {formatDate(
                      selectedShift.date
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#819596]">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[
                        selectedShift.status
                      ]
                    }`}
                  >
                    {selectedShift.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-[#819596]">
                    Working Hours
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#31585A]">
                    {formatTime(
                      selectedShift.startTime
                    )}{" "}
                    -{" "}
                    {formatTime(
                      selectedShift.endTime
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#819596]">
                    Duty Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#31585A]">
                    {selectedShift.location}
                  </p>
                </div>

              </div>

              <div className="rounded-xl border border-[#E2EFED] p-4">

                <p className="text-xs font-medium text-[#819596]">
                  Notes
                </p>

                <p className="mt-1 text-sm text-[#31585A]">
                  {selectedShift.notes ||
                    "No notes added."}
                </p>

              </div>

            </div>

            {/* FOOTER */}

            <div className="border-t border-[#EAF2F0] px-6 py-4 text-right">

              <button
                type="button"
                onClick={() =>
                  setSelectedShift(null)
                }
                className="rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default StaffShifts;