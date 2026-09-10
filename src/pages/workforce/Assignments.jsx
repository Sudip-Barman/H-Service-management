import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Search,
  Filter,
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  Building2,
  CheckCircle2,
  CircleAlert,
  ArrowRight,
  ListTodo,
  CircleDashed,
  LoaderCircle,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserAssignments,
} from "../../data/workforceData";

export default function Assignments({ user }) {
  const navigate = useNavigate();

  const employeeId = user?.id || "EMP-1002";

  const workforceUser =
    getWorkforceUser(employeeId) ||
    getWorkforceUser("EMP-1002");

  const assignments = getUserAssignments(
    employeeId
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const filteredAssignments = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return assignments.filter((assignment) => {
      const matchesSearch =
        !searchValue ||
        assignment.title
          ?.toLowerCase()
          .includes(searchValue) ||
        assignment.description
          ?.toLowerCase()
          .includes(searchValue) ||
        assignment.patient
          ?.toLowerCase()
          .includes(searchValue) ||
        assignment.department
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        assignment.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [assignments, search, statusFilter]);

  const stats = useMemo(() => {
    const pending = assignments.filter(
      (item) =>
        item.status?.toLowerCase() === "pending"
    ).length;

    const inProgress = assignments.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "in progress"
    ).length;

    const completed = assignments.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "completed"
    ).length;

    const highPriority = assignments.filter(
      (item) =>
        item.priority?.toLowerCase() === "high" &&
        item.status?.toLowerCase() !== "completed"
    ).length;

    return {
      total: assignments.length,
      pending,
      inProgress,
      completed,
      highPriority,
    };
  }, [assignments]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700";

      case "medium":
        return "bg-amber-50 text-amber-700";

      case "low":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return CheckCircle2;

      case "in progress":
        return LoaderCircle;

      default:
        return CircleDashed;
    }
  };

  const formatDate = (date) => {
    if (!date) return "No due date";

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = (assignment) => {
    if (
      !assignment.dueDate ||
      assignment.status?.toLowerCase() === "completed"
    ) {
      return false;
    }

    return assignment.dueDate < "2026-09-10";
  };

  return (
    <div className="space-y-6">
      {/* PAGE INTRO */}
      <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <ClipboardList size={21} />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-[#073F42]">
                My Assignments
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View and manage your assigned hospital
                duties
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#F7FBFB] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Assigned To
            </p>

            <p className="mt-1 text-sm font-semibold text-[#073F42]">
              {workforceUser?.name || "Workforce User"}
            </p>

            <p className="text-xs text-slate-500">
              {workforceUser?.designation ||
                "Hospital Staff"}
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={ListTodo}
          label="Total"
          value={stats.total}
        />

        <SummaryCard
          icon={CircleDashed}
          label="Pending"
          value={stats.pending}
        />

        <SummaryCard
          icon={LoaderCircle}
          label="In Progress"
          value={stats.inProgress}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
        />
      </section>

      {/* PRIORITY NOTICE */}
      {stats.highPriority > 0 && (
        <section className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-600">
              <CircleAlert size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-red-800">
                {stats.highPriority} high-priority{" "}
                {stats.highPriority === 1
                  ? "assignment"
                  : "assignments"}{" "}
                need attention
              </h3>

              <p className="mt-1 text-xs leading-5 text-red-700/80">
                Review the priority assignments below
                and complete them according to their
                due dates.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FILTER BAR */}
      <section className="rounded-2xl border border-[#DDEBEA] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search assignments, patients, departments..."
              className="h-10 w-full rounded-lg border border-[#DDEBEA] bg-[#FBFDFD] pl-10 pr-4 text-sm text-[#073F42] outline-none transition placeholder:text-slate-400 focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex items-center gap-2">
            <Filter
              size={16}
              className="hidden text-slate-400 sm:block"
            />

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Pending",
                "In Progress",
                "Completed",
              ].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    statusFilter === status
                      ? "bg-[#073F42] text-white"
                      : "border border-[#DDEBEA] bg-white text-slate-600 hover:bg-[#F5FAFA]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ASSIGNMENTS */}
      <section className="overflow-hidden rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#E8EFEF] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold text-[#073F42]">
              Assigned Duties
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredAssignments.length}{" "}
              {filteredAssignments.length === 1
                ? "assignment"
                : "assignments"}{" "}
              found
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <UserRound size={14} />
            Personal assignment list
          </div>
        </div>

        {filteredAssignments.length > 0 ? (
          <div className="divide-y divide-[#E8EFEF]">
            {filteredAssignments.map((assignment) => {
              const StatusIcon = getStatusIcon(
                assignment.status
              );

              const overdue = isOverdue(assignment);

              return (
                <div
                  key={assignment.id}
                  className="group px-5 py-5 transition hover:bg-[#FBFDFD] sm:px-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    {/* MAIN */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-[#073F42]">
                              {assignment.title}
                            </h3>

                            {assignment.priority && (
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getPriorityStyle(
                                  assignment.priority
                                )}`}
                              >
                                {assignment.priority}
                              </span>
                            )}
                          </div>

                          {assignment.description && (
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                              {assignment.description}
                            </p>
                          )}
                        </div>

                        <span
                          className={`flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${getStatusStyle(
                            assignment.status
                          )}`}
                        >
                          <StatusIcon
                            size={13}
                            className={
                              assignment.status?.toLowerCase() ===
                              "in progress"
                                ? "animate-spin"
                                : ""
                            }
                          />
                          {assignment.status ||
                            "Pending"}
                        </span>
                      </div>

                      {/* DETAILS */}
                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {assignment.patient && (
                          <DetailItem
                            icon={UserRound}
                            label="Patient"
                            value={assignment.patient}
                          />
                        )}

                        {assignment.department && (
                          <DetailItem
                            icon={Building2}
                            label="Department"
                            value={assignment.department}
                          />
                        )}

                        {assignment.dueDate && (
                          <DetailItem
                            icon={CalendarDays}
                            label="Due Date"
                            value={formatDate(
                              assignment.dueDate
                            )}
                            valueClass={
                              overdue
                                ? "text-red-600"
                                : ""
                            }
                          />
                        )}

                        {assignment.location && (
                          <DetailItem
                            icon={MapPin}
                            label="Location"
                            value={assignment.location}
                          />
                        )}
                      </div>

                      {/* OVERDUE */}
                      {overdue && (
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-red-600">
                          <Clock3 size={14} />
                          This assignment is overdue
                        </div>
                      )}
                    </div>

                    {/* ACTION */}
                    <div className="xl:pl-5">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/workforce/assignments"
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#DDEBEA] px-4 py-2.5 text-xs font-semibold text-[#087F7B] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] xl:w-auto"
                      >
                        View Details
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            hasFilters={
              Boolean(search) ||
              statusFilter !== "All"
            }
            onClear={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          />
        )}
      </section>

      {/* FOOTER INFO */}
      <section className="rounded-2xl border border-[#CFE5E3] bg-[#E8F8F6] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#08A6A0]">
              <ClipboardList size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#073F42]">
                Keep your assignments up to date
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-[#5E7777]">
                Complete assigned duties according to
                their priority and due date. Assignment
                changes are managed by hospital
                administration.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/workforce/schedule")
            }
            className="flex w-fit items-center gap-2 text-sm font-semibold text-[#087F7B] transition hover:text-[#056966]"
          >
            View Schedule
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}

/* SUMMARY CARD */

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#DDEBEA] bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#073F42]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* DETAIL ITEM */

function DetailItem({
  icon: Icon,
  label,
  value,
  valueClass = "",
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F1F8F7] text-[#08A6A0]">
        <Icon size={14} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-xs font-medium text-[#073F42] ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* EMPTY STATE */

function EmptyState({
  hasFilters,
  onClear,
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
        <ClipboardList size={27} />
      </div>

      <h3 className="mt-5 text-base font-semibold text-[#073F42]">
        {hasFilters
          ? "No assignments found"
          : "No assignments available"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or status filter to find another assignment."
          : "You currently don't have any assignments assigned to you."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg bg-[#073F42] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0A5154]"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}