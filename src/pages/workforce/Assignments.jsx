import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Search,
  CalendarDays,
  UserRound,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  CircleDot,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserAssignments,
  getRolePermissions,
} from "../../data/workforceData";

const Assignments = ({ user }) => {
  const navigate = useNavigate();

  const employeeId = user?.id || "EMP-1002";

  const profile =
    getWorkforceUser(employeeId) || getWorkforceUser("EMP-1002");

  const role = profile?.role?.toLowerCase() || "staff";
  const permissions = getRolePermissions(role);

  const assignments = getUserAssignments(employeeId);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        assignment.title?.toLowerCase().includes(search) ||
        assignment.description?.toLowerCase().includes(search) ||
        assignment.patient?.toLowerCase().includes(search) ||
        assignment.department?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        assignment.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesPriority =
        priorityFilter === "All" ||
        assignment.priority?.toLowerCase() ===
          priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [assignments, searchTerm, statusFilter, priorityFilter]);

  const pendingCount = assignments.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  const inProgressCount = assignments.filter(
    (item) => item.status?.toLowerCase() === "in progress"
  ).length;

  const completedCount = assignments.filter(
    (item) => item.status?.toLowerCase() === "completed"
  ).length;

  const highPriorityCount = assignments.filter(
    (item) => item.priority?.toLowerCase() === "high"
  ).length;

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "in progress":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-orange-100 text-orange-700";

      case "low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Role-based access
  if (!permissions.assignments) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/workforce")}
          className="flex items-center gap-2 text-sm font-medium text-[#08A6A0] transition hover:text-[#073F42]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="flex min-h-[450px] items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F8F6] text-[#08A6A0]">
              <ClipboardList size={30} />
            </div>

            <h2 className="text-xl font-bold text-[#073F42]">
              Assignments Not Available
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Assignment management is not available for your current
              workforce role.
            </p>

            <button
              onClick={() => navigate("/workforce")}
              className="mt-6 rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078f8a]"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate("/workforce")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#08A6A0] transition hover:text-[#073F42]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold text-[#073F42]">
            My Assignments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your assigned duties and service responsibilities.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#E8F8F6] px-4 py-2.5 text-sm font-semibold text-[#087d79]">
          <ClipboardList size={18} />
          {assignments.length} Assignments
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Pending"
          value={pendingCount}
          icon={<Clock size={20} />}
        />

        <SummaryCard
          title="In Progress"
          value={inProgressCount}
          icon={<CircleDot size={20} />}
        />

        <SummaryCard
          title="Completed"
          value={completedCount}
          icon={<CheckCircle size={20} />}
        />

        <SummaryCard
          title="High Priority"
          value={highPriorityCount}
          icon={<AlertCircle size={20} />}
        />
      </div>

      {/* Search + Filters */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search assignment, patient, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#08A6A0]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#08A6A0]"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <ClipboardList size={26} />
          </div>

          <h3 className="text-lg font-semibold text-[#073F42]">
            No Assignments Found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              getStatusClasses={getStatusClasses}
              getPriorityClasses={getPriorityClasses}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* Assignment Card */
const AssignmentCard = ({
  assignment,
  getStatusClasses,
  getPriorityClasses,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md sm:p-6">
      {/* Top Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
            <ClipboardList size={22} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[#073F42]">
                {assignment.title}
              </h3>

              {assignment.priority && (
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getPriorityClasses(
                    assignment.priority
                  )}`}
                >
                  {assignment.priority} Priority
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {assignment.description || "No description available."}
            </p>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClasses(
            assignment.status
          )}`}
        >
          {assignment.status || "Pending"}
        </span>
      </div>

      {/* Details */}
      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem
          icon={<UserRound size={17} />}
          label="Patient"
          value={assignment.patient || "Not assigned"}
        />

        <DetailItem
          icon={<ClipboardList size={17} />}
          label="Department"
          value={assignment.department || "Not assigned"}
        />

        <DetailItem
          icon={<CalendarDays size={17} />}
          label="Due Date"
          value={assignment.dueDate || "Not specified"}
        />

        <DetailItem
          icon={<Clock size={17} />}
          label="Priority"
          value={assignment.priority || "Normal"}
        />
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-400">
          Assignment ID: {assignment.id || "Not available"}
        </p>

        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
            View Details
          </button>

          {assignment.status?.toLowerCase() !== "completed" && (
            <button className="rounded-lg bg-[#08A6A0] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#078f8a]">
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* Detail Item */
const DetailItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-[#08A6A0]">{icon}</div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-[#073F42]">
          {value}
        </p>
      </div>
    </div>
  );
};

/* Summary Card */
const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
        {icon}
      </div>

      <p className="text-xs font-medium text-gray-500">{title}</p>

      <p className="mt-1 text-2xl font-bold text-[#073F42]">
        {value}
      </p>
    </div>
  );
};

export default Assignments;