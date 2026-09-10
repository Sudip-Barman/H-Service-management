import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogIn,
  LogOut,
  UserCheck,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserAttendance,
} from "../../data/workforceData";

const Attendance = ({ user }) => {
  const employeeId = user?.id || "EMP-1001";

  const profile =
    getWorkforceUser(employeeId) || getWorkforceUser("EMP-1001");

  const attendance = getUserAttendance(employeeId);

  const [monthFilter, setMonthFilter] = useState("All");

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendance.find(
    (item) => item.date === today
  );

  const filteredAttendance = useMemo(() => {
    if (monthFilter === "All") {
      return attendance;
    }

    return attendance.filter((item) =>
      item.date?.startsWith(monthFilter)
    );
  }, [attendance, monthFilter]);

  const presentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "absent"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "late"
  ).length;

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-700";

      case "late":
        return "bg-yellow-100 text-yellow-700";

      case "absent":
        return "bg-red-100 text-red-700";

      case "leave":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return <CheckCircle size={15} />;

      case "late":
        return <AlertCircle size={15} />;

      case "absent":
        return <XCircle size={15} />;

      case "leave":
        return <CalendarDays size={15} />;

      default:
        return <AlertCircle size={15} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#073F42]">
          Attendance
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track your attendance, working hours, and attendance history.
        </p>
      </div>

      {/* Today's Attendance */}
      <section className="rounded-2xl bg-[#073F42] p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck size={20} />

              <p className="text-sm font-medium text-[#B8CDCD]">
                Today's Attendance
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-bold">
              {profile?.name}
            </h2>

            <p className="mt-1 text-sm text-[#B8CDCD]">
              {profile?.designation}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <AttendanceAction
              icon={<LogIn size={18} />}
              label="Check In"
              value={todayAttendance?.checkIn || "Not checked in"}
            />

            <AttendanceAction
              icon={<LogOut size={18} />}
              label="Check Out"
              value={todayAttendance?.checkOut || "Not checked out"}
            />
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Total Records"
          value={attendance.length}
          icon={<CalendarDays size={20} />}
        />

        <SummaryCard
          title="Present"
          value={presentCount}
          icon={<CheckCircle size={20} />}
        />

        <SummaryCard
          title="Late"
          value={lateCount}
          icon={<Clock size={20} />}
        />

        <SummaryCard
          title="Absent"
          value={absentCount}
          icon={<XCircle size={20} />}
        />
      </div>

      {/* Attendance History */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#073F42]">
              Attendance History
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Your recent attendance records
            </p>
          </div>

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#08A6A0]"
          >
            <option value="All">All Records</option>

            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
            <option value="2026-07">July 2026</option>
          </select>
        </div>

        {/* Empty State */}
        {filteredAttendance.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <CalendarDays size={26} />
            </div>

            <h3 className="text-lg font-semibold text-[#073F42]">
              No Attendance Records
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              There are no attendance records for the selected period.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Check In
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Check Out
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Working Hours
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendance.map((record) => (
                    <AttendanceRow
                      key={record.id || record.date}
                      record={record}
                      getStatusClasses={getStatusClasses}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-4 lg:hidden">
              {filteredAttendance.map((record) => (
                <AttendanceCard
                  key={record.id || record.date}
                  record={record}
                  getStatusClasses={getStatusClasses}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

/* Attendance Action */
const AttendanceAction = ({ icon, label, value }) => {
  return (
    <div className="min-w-[180px] rounded-xl bg-white/10 p-4">
      <div className="flex items-center gap-2 text-[#B8CDCD]">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
};

/* Desktop Row */
const AttendanceRow = ({
  record,
  getStatusClasses,
  getStatusIcon,
}) => {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#08A6A0]" />

          <span className="text-sm font-medium text-[#073F42]">
            {record.date}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <TimeValue value={record.checkIn} />
      </td>

      <td className="px-6 py-4">
        <TimeValue value={record.checkOut} />
      </td>

      <td className="px-6 py-4">
        <span className="text-sm font-medium text-gray-600">
          {record.workingHours || record.hours || "N/A"}
        </span>
      </td>

      <td className="px-6 py-4">
        <StatusBadge
          status={record.status}
          getStatusClasses={getStatusClasses}
          getStatusIcon={getStatusIcon}
        />
      </td>
    </tr>
  );
};

/* Mobile Card */
const AttendanceCard = ({
  record,
  getStatusClasses,
  getStatusIcon,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
            <CalendarDays size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#073F42]">
              {record.date}
            </p>

            <p className="text-xs text-gray-400">
              {record.workingHours || record.hours || "Working hours unavailable"}
            </p>
          </div>
        </div>

        <StatusBadge
          status={record.status}
          getStatusClasses={getStatusClasses}
          getStatusIcon={getStatusIcon}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <TimeBox
          icon={<LogIn size={16} />}
          label="Check In"
          value={record.checkIn}
        />

        <TimeBox
          icon={<LogOut size={16} />}
          label="Check Out"
          value={record.checkOut}
        />
      </div>
    </div>
  );
};

/* Time Value */
const TimeValue = ({ value }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Clock size={15} className="text-[#08A6A0]" />
      {value || "N/A"}
    </div>
  );
};

/* Time Box */
const TimeBox = ({ icon, label, value }) => {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}

        <span className="text-[11px] font-medium uppercase">
          {label}
        </span>
      </div>

      <p className="mt-1 text-sm font-semibold text-[#073F42]">
        {value || "N/A"}
      </p>
    </div>
  );
};

/* Status Badge */
const StatusBadge = ({
  status,
  getStatusClasses,
  getStatusIcon,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClasses(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status || "Unknown"}
    </span>
  );
};

/* Summary Card */
const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
        {icon}
      </div>

      <p className="text-xs font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#073F42]">
        {value}
      </p>
    </div>
  );
};

export default Attendance;