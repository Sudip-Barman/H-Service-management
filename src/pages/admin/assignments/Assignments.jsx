import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Plus,
  Search,
  Stethoscope,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

const initialAssignments = [
  {
    id: "AS-1001",
    patient: "Rahul Sharma",
    service: "General Consultation",
    doctor: "Dr. Amit Roy",
    nurse: "Nurse Priya",
    date: "2026-09-08",
    time: "10:00 AM",
    priority: "Normal",
    status: "Assigned",
    notes: "Regular patient consultation",
  },
  {
    id: "AS-1002",
    patient: "Priya Das",
    service: "Dental Checkup",
    doctor: "Dr. Sneha Sen",
    nurse: "Nurse Ananya",
    date: "2026-09-08",
    time: "11:30 AM",
    priority: "High",
    status: "Pending",
    notes: "Dental examination required",
  },
  {
    id: "AS-1003",
    patient: "Arjun Ghosh",
    service: "Blood Test",
    doctor: "Dr. Ananya Das",
    nurse: "Nurse Riya",
    date: "2026-09-09",
    time: "09:00 AM",
    priority: "Normal",
    status: "Completed",
    notes: "CBC and blood sugar test",
  },
  {
    id: "AS-1004",
    patient: "Sneha Mukherjee",
    service: "Cardiology Consultation",
    doctor: "Dr. Rajiv Kumar",
    nurse: "Nurse Priya",
    date: "2026-09-10",
    time: "02:00 PM",
    priority: "Urgent",
    status: "Assigned",
    notes: "Heart checkup and monitoring",
  },
  {
    id: "AS-1005",
    patient: "Sourav Dey",
    service: "Physiotherapy",
    doctor: "Dr. Rohan Paul",
    nurse: "Not Assigned",
    date: "2026-09-11",
    time: "04:30 PM",
    priority: "Normal",
    status: "Pending",
    notes: "Physiotherapy session",
  },
];

const services = [
  "General Consultation",
  "Dental Checkup",
  "Blood Test",
  "Cardiology Consultation",
  "Physiotherapy",
  "Emergency Care",
];

const patients = [
  "Rahul Sharma",
  "Priya Das",
  "Arjun Ghosh",
  "Sneha Mukherjee",
  "Sourav Dey",
];

const doctors = [
  "Dr. Amit Roy",
  "Dr. Sneha Sen",
  "Dr. Ananya Das",
  "Dr. Rajiv Kumar",
  "Dr. Rohan Paul",
];

const nurses = [
  "Nurse Priya",
  "Nurse Ananya",
  "Nurse Riya",
  "Nurse Sneha",
  "Nurse Pooja",
];

const emptyForm = {
  patient: "",
  service: "",
  doctor: "",
  nurse: "",
  date: "",
  time: "",
  priority: "Normal",
  notes: "",
};

const statusStyles = {
  Assigned: "border-teal-200 bg-teal-50 text-teal-700",
  Pending: "border-yellow-200 bg-yellow-50 text-yellow-700",
  Completed: "border-blue-200 bg-blue-50 text-blue-700",
  Cancelled: "border-red-200 bg-red-50 text-red-700",
};

const priorityStyles = {
  Normal: "bg-gray-100 text-gray-700",
  High: "bg-orange-50 text-orange-700",
  Urgent: "bg-red-50 text-red-700",
};

function Assignments() {
  const [assignments, setAssignments] =
    useState(initialAssignments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        assignment.id.toLowerCase().includes(searchText) ||
        assignment.patient.toLowerCase().includes(searchText) ||
        assignment.doctor.toLowerCase().includes(searchText) ||
        assignment.nurse.toLowerCase().includes(searchText) ||
        assignment.service.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        assignment.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        assignment.priority === priorityFilter;

      const matchesDate =
        !dateFilter || assignment.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDate
      );
    });
  }, [
    assignments,
    search,
    statusFilter,
    priorityFilter,
    dateFilter,
  ]);

  const totalAssignments = assignments.length;

  const assignedAssignments = assignments.filter(
    (assignment) => assignment.status === "Assigned"
  ).length;

  const pendingAssignments = assignments.filter(
    (assignment) => assignment.status === "Pending"
  ).length;

  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === "Completed"
  ).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openNewAssignmentModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError("");
    setFormData(emptyForm);
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();

    if (
      !formData.patient ||
      !formData.service ||
      !formData.doctor ||
      !formData.date ||
      !formData.time
    ) {
      setFormError("Please fill all required fields.");
      return;
    }

    const newAssignment = {
      id: `AS-${1001 + assignments.length}`,
      patient: formData.patient,
      service: formData.service,
      doctor: formData.doctor,
      nurse: formData.nurse || "Not Assigned",
      date: formData.date,
      time: formData.time,
      priority: formData.priority,
      status: formData.nurse ? "Assigned" : "Pending",
      notes: formData.notes || "No notes added",
    };

    setAssignments((prev) => [
      newAssignment,
      ...prev,
    ]);

    closeModal();
  };

  const handleCancelAssignment = (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this assignment?"
    );

    if (!confirmCancel) return;

    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id
          ? {
              ...assignment,
              status: "Cancelled",
            }
          : assignment
      )
    );
  };

  const handleCompleteAssignment = (id) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id
          ? {
              ...assignment,
              status: "Completed",
            }
          : assignment
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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">

      {/* PAGE HEADER */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-xl font-bold text-[#073F42] sm:text-2xl lg:text-3xl">
            Assignments
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            Manage doctor, nurse and patient assignments
          </p>
        </div>

        <button
          onClick={openNewAssignmentModal}
          className="flex h-10 sm:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#08A6A0] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
        >
          <Plus size={16} className="sm:size-[18px]" />
          New Assignment
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">

        {/* TOTAL */}
        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-[#E8F8F6] text-[#08A6A0] [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <Users />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">
              {totalAssignments}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
            Total Assignments
          </p>
        </div>

        {/* ASSIGNED */}
        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-green-50 text-green-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <CheckCircle2 />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">
              {assignedAssignments}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
            Assigned
          </p>
        </div>

        {/* PENDING */}
        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-yellow-50 text-yellow-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <Clock3 />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">
              {pendingAssignments}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
            Pending
          </p>
        </div>

        {/* COMPLETED */}
        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-blue-50 text-blue-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <CheckCircle2 />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">
              {completedAssignments}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
            Completed
          </p>
        </div>

      </div>

      {/* FILTER CARD */}
      <div className="mb-4 sm:mb-6 rounded-xl border border-[#E2EFED] bg-white p-3.5 sm:p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-5">

          {/* SEARCH */}
          <div className="relative md:col-span-2">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search assignment, patient, doctor..."
              className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-xs sm:text-sm outline-none transition focus:border-[#08A6A0]"
            />

          </div>

          {/* STATUS */}
          <div className="relative">

            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="h-9 sm:h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-[#08A6A0]"
            >
              <option value="All">
                All Status
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

          </div>

          {/* PRIORITY */}
          <div>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs sm:text-sm outline-none focus:border-[#08A6A0]"
            >
              <option value="All">
                All Priority
              </option>

              <option value="Normal">
                Normal
              </option>

              <option value="High">
                High
              </option>

              <option value="Urgent">
                Urgent
              </option>
            </select>

          </div>

          {/* DATE */}
          <div className="relative">

            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
              className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-[#08A6A0]"
            />

          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm">

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto md:block">

          <table className="min-w-[1200px] w-full">

            <thead className="border-b border-[#E2EFED] bg-[#F5FAF9]">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Assignment
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Patient
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Doctor
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nurse
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Appointment
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Priority
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredAssignments.length > 0 ? (

                filteredAssignments.map((assignment) => (

                  <tr
                    key={assignment.id}
                    className="transition hover:bg-[#F5FAF9]"
                  >

                    {/* ASSIGNMENT */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#08A6A0]">
                        {assignment.id}
                      </span>
                    </td>

                    {/* PATIENT */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                          <UserRound size={17} />
                        </div>

                        <p className="font-medium text-gray-900">
                          {assignment.patient}
                        </p>

                      </div>

                    </td>

                    {/* SERVICE */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {assignment.service}
                      </p>
                    </td>

                    {/* DOCTOR */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Stethoscope
                          size={16}
                          className="text-[#08A6A0]"
                        />

                        <p className="text-sm text-gray-700">
                          {assignment.doctor}
                        </p>

                      </div>

                    </td>

                    {/* NURSE */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Users
                          size={16}
                          className="text-[#08A6A0]"
                        />

                        <p className="text-sm text-gray-700">
                          {assignment.nurse}
                        </p>

                      </div>

                    </td>

                    {/* APPOINTMENT */}
                    <td className="px-5 py-4">

                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(assignment.date)}
                      </p>

                      <p className="text-xs text-gray-500">
                        {assignment.time}
                      </p>

                    </td>

                    {/* PRIORITY */}
                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          priorityStyles[
                            assignment.priority
                          ]
                        }`}
                      >
                        {assignment.priority}
                      </span>

                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          statusStyles[
                            assignment.status
                          ]
                        }`}
                      >
                        {assignment.status}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* VIEW */}
                        <button
                          onClick={() =>
                            setSelectedAssignment(
                              assignment
                            )
                          }
                          title="View Assignment"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                        >
                          <Eye size={17} />
                        </button>

                        {/* COMPLETE */}
                        {assignment.status !==
                          "Completed" &&
                          assignment.status !==
                            "Cancelled" && (
                            <button
                              onClick={() =>
                                handleCompleteAssignment(
                                  assignment.id
                                )
                              }
                              title="Mark Completed"
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                            >
                              <CheckCircle2
                                size={17}
                              />
                            </button>
                          )}

                        {/* CANCEL */}
                        {assignment.status !==
                          "Cancelled" &&
                          assignment.status !==
                            "Completed" && (
                            <button
                              onClick={() =>
                                handleCancelAssignment(
                                  assignment.id
                                )
                              }
                              title="Cancel Assignment"
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <XCircle size={17} />
                            </button>
                          )}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="px-5 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <AlertCircle
                        size={42}
                        className="mb-3 text-gray-300"
                      />

                      <h3 className="font-semibold text-gray-800">
                        No assignments found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* MOBILE CARD LIST */}
        <div className="space-y-3 p-3 md:hidden">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded-xl border border-[#E2EFED] bg-white p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                      <UserRound size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-gray-900">{assignment.patient}</h3>
                      <p className="text-xs text-gray-500">{assignment.id} · {assignment.service}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[assignment.status]}`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Doctor</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{assignment.doctor}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Nurse</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{assignment.nurse}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Date & Time</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{formatDate(assignment.date)} · {assignment.time}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Priority</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{assignment.priority}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 border-t border-[#EAF2F0] pt-2.5">
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                  >
                    <Eye size={15} />
                  </button>
                  {assignment.status !== "Completed" && assignment.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCompleteAssignment(assignment.id)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                    >
                      <CheckCircle2 size={15} />
                    </button>
                  )}
                  {assignment.status !== "Cancelled" && assignment.status !== "Completed" && (
                    <button
                      onClick={() => handleCancelAssignment(assignment.id)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-[#E2EFED] bg-white p-6 text-center text-xs text-gray-500">
              No assignments found. Try changing your search or filters.
            </div>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* CREATE ASSIGNMENT MODAL */}
      {/* ========================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">

              <div>

                <h2 className="text-lg font-bold text-[#073F42]">
                  Create New Assignment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Assign doctor and nurse to a patient
                </p>

              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleCreateAssignment}
              className="space-y-5 p-6"
            >

              {formError && (

                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>

              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* PATIENT */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Patient{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  >

                    <option value="">
                      Select patient
                    </option>

                    {patients.map((patient) => (
                      <option
                        key={patient}
                        value={patient}
                      >
                        {patient}
                      </option>
                    ))}

                  </select>

                </div>

                {/* SERVICE */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Service{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  >

                    <option value="">
                      Select service
                    </option>

                    {services.map((service) => (
                      <option
                        key={service}
                        value={service}
                      >
                        {service}
                      </option>
                    ))}

                  </select>

                </div>

                {/* DOCTOR */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Doctor{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  >

                    <option value="">
                      Select doctor
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

                </div>

                {/* NURSE */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assign Nurse
                  </label>

                  <select
                    name="nurse"
                    value={formData.nurse}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  >

                    <option value="">
                      Select nurse
                    </option>

                    {nurses.map((nurse) => (
                      <option
                        key={nurse}
                        value={nurse}
                      >
                        {nurse}
                      </option>
                    ))}

                  </select>

                </div>

                {/* DATE */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assignment Date{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min="2026-09-07"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />

                </div>

                {/* TIME */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assignment Time{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />

                </div>

                {/* PRIORITY */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  >

                    <option value="Normal">
                      Normal
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Urgent">
                      Urgent
                    </option>

                  </select>

                </div>

                {/* NOTES */}
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assignment Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter assignment notes..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />

                </div>

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
                  <Plus size={18} />
                  Create Assignment
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ========================= */}
      {/* VIEW ASSIGNMENT MODAL */}
      {/* ========================= */}

      {selectedAssignment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">

              <div>

                <h2 className="text-lg font-bold text-[#073F42]">
                  Assignment Details
                </h2>

                <p className="text-sm font-medium text-[#08A6A0]">
                  {selectedAssignment.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedAssignment(null)
                }
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* CONTENT */}
            <div className="space-y-5 p-6">

              {/* PATIENT */}
              <div className="rounded-xl bg-[#E8F8F6] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#08A6A0]">
                    <UserRound size={18} />
                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Patient
                    </p>

                    <p className="font-semibold text-[#073F42]">
                      {selectedAssignment.patient}
                    </p>

                  </div>

                </div>

              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-5">

                <div>
                  <p className="text-xs text-gray-500">
                    Service
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedAssignment.service}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Doctor
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedAssignment.doctor}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Nurse
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedAssignment.nurse}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(
                      selectedAssignment.date
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedAssignment.time}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Priority
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      priorityStyles[
                        selectedAssignment.priority
                      ]
                    }`}
                  >
                    {selectedAssignment.priority}
                  </span>
                </div>

              </div>

              {/* STATUS */}
              <div>

                <p className="text-xs text-gray-500">
                  Status
                </p>

                <span
                  className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                    statusStyles[
                      selectedAssignment.status
                    ]
                  }`}
                >
                  {selectedAssignment.status}
                </span>

              </div>

              {/* NOTES */}
              <div>

                <p className="text-xs text-gray-500">
                  Assignment Notes
                </p>

                <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                  {selectedAssignment.notes}
                </p>

              </div>

            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-gray-200 px-6 py-4">

              <button
                onClick={() =>
                  setSelectedAssignment(null)
                }
                className="rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
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

export default Assignments;