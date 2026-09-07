import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Filter,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const initialSchedules = [
  {
    id: "SCH-1001",
    doctor: "Dr. Amit Roy",
    department: "General Medicine",
    date: "2026-09-08",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    room: "Room 101",
    type: "Consultation",
    status: "Available",
  },
  {
    id: "SCH-1002",
    doctor: "Dr. Sneha Sen",
    department: "Dentistry",
    date: "2026-09-08",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    room: "Dental Room 2",
    type: "Consultation",
    status: "Available",
  },
  {
    id: "SCH-1003",
    doctor: "Dr. Ananya Das",
    department: "Pathology",
    date: "2026-09-09",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    room: "Lab 01",
    type: "Laboratory",
    status: "Booked",
  },
  {
    id: "SCH-1004",
    doctor: "Dr. Rajiv Kumar",
    department: "Cardiology",
    date: "2026-09-10",
    startTime: "02:00 PM",
    endTime: "06:00 PM",
    room: "Cardiology Room 1",
    type: "Consultation",
    status: "Available",
  },
  {
    id: "SCH-1005",
    doctor: "Dr. Rohan Paul",
    department: "Physiotherapy",
    date: "2026-09-11",
    startTime: "03:00 PM",
    endTime: "07:00 PM",
    room: "Physio Room 1",
    type: "Therapy",
    status: "Booked",
  },
];

const doctors = [
  "Dr. Amit Roy",
  "Dr. Sneha Sen",
  "Dr. Ananya Das",
  "Dr. Rajiv Kumar",
  "Dr. Rohan Paul",
];

const departments = [
  "General Medicine",
  "Dentistry",
  "Pathology",
  "Cardiology",
  "Physiotherapy",
];

const emptyForm = {
  doctor: "",
  department: "",
  date: "",
  startTime: "",
  endTime: "",
  room: "",
  type: "Consultation",
  status: "Available",
};

const statusStyles = {
  Available:
    "border-green-200 bg-green-50 text-green-700",
  Booked:
    "border-blue-200 bg-blue-50 text-blue-700",
};

function Schedules() {
  const [schedules, setSchedules] =
    useState(initialSchedules);

  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [dateFilter, setDateFilter] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingSchedule, setEditingSchedule] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [formError, setFormError] =
    useState("");

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        schedule.id
          .toLowerCase()
          .includes(searchText) ||
        schedule.doctor
          .toLowerCase()
          .includes(searchText) ||
        schedule.department
          .toLowerCase()
          .includes(searchText) ||
        schedule.room
          .toLowerCase()
          .includes(searchText);

      const matchesDoctor =
        doctorFilter === "All" ||
        schedule.doctor === doctorFilter;

      const matchesStatus =
        statusFilter === "All" ||
        schedule.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        schedule.date === dateFilter;

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    schedules,
    search,
    doctorFilter,
    statusFilter,
    dateFilter,
  ]);

  const totalSchedules = schedules.length;

  const availableSchedules =
    schedules.filter(
      (schedule) =>
        schedule.status === "Available"
    ).length;

  const bookedSchedules =
    schedules.filter(
      (schedule) =>
        schedule.status === "Booked"
    ).length;

  const todaySchedules =
    schedules.filter(
      (schedule) =>
        schedule.date === "2026-09-08"
    ).length;

  const openCreateModal = () => {
    setEditingSchedule(null);
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);

    setFormData({
      doctor: schedule.doctor,
      department: schedule.department,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      room: schedule.room,
      type: schedule.type,
      status: schedule.status,
    });

    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.doctor ||
      !formData.department ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.room
    ) {
      setFormError(
        "Please fill all required fields."
      );
      return;
    }

    if (
      formData.startTime >= formData.endTime
    ) {
      setFormError(
        "End time must be after start time."
      );
      return;
    }

    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id ===
          editingSchedule.id
            ? {
                ...schedule,
                ...formData,
              }
            : schedule
        )
      );
    } else {
      const newSchedule = {
        id: `SCH-${1001 + schedules.length}`,
        ...formData,
      };

      setSchedules((prev) => [
        newSchedule,
        ...prev,
      ]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this schedule?"
      );

    if (!confirmDelete) return;

    setSchedules((prev) =>
      prev.filter(
        (schedule) =>
          schedule.id !== id
      )
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={16} />
            <span>
              Admin / Scheduling Management
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Scheduling Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage doctor schedules,
            working hours and room
            availability
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
        >
          <Plus size={18} />
          Create Schedule
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Schedules"
          value={totalSchedules}
          icon={
            <CalendarDays size={22} />
          }
          iconClass="bg-[#E8F8F6] text-[#08A6A0]"
        />

        <StatCard
          title="Available"
          value={availableSchedules}
          icon={
            <CheckCircle2 size={22} />
          }
          iconClass="bg-green-50 text-green-600"
        />

        <StatCard
          title="Booked"
          value={bookedSchedules}
          icon={
            <UserRound size={22} />
          }
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Today's Schedule"
          value={todaySchedules}
          icon={
            <Clock3 size={22} />
          }
          iconClass="bg-[#E8F8F6] text-[#08A6A0]"
        />

      </div>

      {/* FILTER SECTION */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="mb-4 flex items-center gap-2">
          <Filter
            size={17}
            className="text-[#08A6A0]"
          />

          <h2 className="text-sm font-semibold text-gray-800">
            Schedule Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

          {/* SEARCH */}
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search doctor, department, room..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
            />
          </div>

          {/* DOCTOR */}
          <select
            value={doctorFilter}
            onChange={(e) =>
              setDoctorFilter(
                e.target.value
              )
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
          >
            <option value="All">
              All Doctors
            </option>

            {doctors.map((doctor) => (
              <option
                key={doctor}
                value={doctor}
              >
                {doctor}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
          >
            <option value="All">
              All Status
            </option>
            <option value="Available">
              Available
            </option>
            <option value="Booked">
              Booked
            </option>
          </select>

        </div>

        {/* DATE FILTER */}
        <div className="mt-3 md:w-1/4">
          <div className="relative">
            <CalendarDays
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
            />
          </div>
        </div>

      </div>

      {/* SCHEDULE TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Doctor Schedules
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredSchedules.length} schedule(s)
            found
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Schedule
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Doctor
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Working Hours
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Room
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredSchedules.length > 0 ? (
                filteredSchedules.map(
                  (schedule) => (
                    <tr
                      key={schedule.id}
                      className="transition hover:bg-[#F7FBFA]"
                    >

                      {/* ID */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#08A6A0]">
                          {schedule.id}
                        </span>
                      </td>

                      {/* DOCTOR */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                            <Stethoscope
                              size={17}
                            />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {schedule.doctor}
                            </p>

                            <p className="text-xs text-gray-500">
                              {schedule.department}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {formatDate(
                            schedule.date
                          )}
                        </p>
                      </td>

                      {/* TIME */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock3
                            size={16}
                            className="text-[#08A6A0]"
                          />

                          {schedule.startTime}
                          {" - "}
                          {schedule.endTime}
                        </div>
                      </td>

                      {/* ROOM */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700">
                          {schedule.room}
                        </span>
                      </td>

                      {/* TYPE */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700">
                          {schedule.type}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            statusStyles[
                              schedule.status
                            ]
                          }`}
                        >
                          {schedule.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                schedule
                              )
                            }
                            title="Edit Schedule"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          >
                            <Edit3
                              size={17}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                schedule.id
                              )
                            }
                            title="Delete Schedule"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >
                    <CalendarDays
                      size={42}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <h3 className="font-semibold text-gray-800">
                      No schedules found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your filters
                      or create a new schedule.
                    </p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingSchedule
                    ? "Edit Schedule"
                    : "Create New Schedule"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure doctor working
                  schedule
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
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
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* DOCTOR */}
                <FormField
                  label="Doctor"
                  required
                >
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={
                      handleInputChange
                    }
                    className="input-style"
                  >
                    <option value="">
                      Select doctor
                    </option>

                    {doctors.map(
                      (doctor) => (
                        <option
                          key={doctor}
                          value={doctor}
                        >
                          {doctor}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                {/* DEPARTMENT */}
                <FormField
                  label="Department"
                  required
                >
                  <select
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={
                      handleInputChange
                    }
                    className="input-style"
                  >
                    <option value="">
                      Select department
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          key={department}
                          value={
                            department
                          }
                        >
                          {department}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                {/* DATE */}
                <FormField
                  label="Schedule Date"
                  required
                >
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={
                      handleInputChange
                    }
                    className="input-style"
                  />
                </FormField>

                {/* TYPE */}
                <FormField label="Schedule Type">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={
                      handleInputChange
                    }
                    className="input-style"
                  >
                    <option value="Consultation">
                      Consultation
                    </option>
                    <option value="Follow-up">
                      Follow-up
                    </option>
                    <option value="Laboratory">
                      Laboratory
                    </option>
                    <option value="Therapy">
                      Therapy
                    </option>
                    <option value="Emergency">
                      Emergency
                    </option>
                  </select>
                </FormField>

                {/* START */}
                <FormField
                  label="Start Time"
                  required
                >
                  <input
                    type="time"
                    name="startTime"
                    value={
                      formData.startTime
                    }
                    onChange={
                      handleInputChange
                    }
                    className="input-style"
                  />
                </FormField>

                {/* END */}
                <FormField
                  label="End Time"
                  required
                >
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={
                      handleInputChange
                    }
                    className="input-style"
                  />
                </FormField>

                {/* ROOM */}
                <FormField
                  label="Room / Cabin"
                  required
                >
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={
                      handleInputChange
                    }
                    placeholder="e.g. Room 101"
                    className="input-style"
                  />
                </FormField>

                {/* STATUS */}
                <FormField label="Status">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={
                      handleInputChange
                    }
                    className="input-style"
                  >
                    <option value="Available">
                      Available
                    </option>

                    <option value="Booked">
                      Booked
                    </option>
                  </select>
                </FormField>

              </div>

              {/* FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                >
                  {editingSchedule ? (
                    <Edit3 size={17} />
                  ) : (
                    <Plus size={18} />
                  )}

                  {editingSchedule
                    ? "Update Schedule"
                    : "Create Schedule"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* INPUT STYLE */}
      <style>{`
        .input-style {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          background-color: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
        }

        .input-style:focus {
          border-color: #08A6A0;
          box-shadow: 0 0 0 2px #E8F8F6;
        }
      `}</style>
    </div>
  );
}

/* STAT CARD */

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h2>
        </div>

        <div
          className={`rounded-lg p-3 ${iconClass}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

/* FORM FIELD */

function FormField({
  label,
  required,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

export default Schedules;