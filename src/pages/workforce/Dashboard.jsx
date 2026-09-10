import { useMemo } from "react";
import {
  CalendarDays,
  Clock3,
  Users,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getUserSchedule,
  getUserAppointments,
  getUserPatients,
  getUserAssignments,
  getUserAttendance,
  getUserNotifications,
  getRolePermissions,
} from "../../data/workforceData";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const employeeId = user?.id || "EMP-1001";
  const role = user?.role?.toLowerCase() || "staff";

  const permissions = getRolePermissions(role);

  const schedules = useMemo(
    () => getUserSchedule(employeeId),
    [employeeId]
  );

  const appointments = useMemo(
    () => getUserAppointments(employeeId),
    [employeeId]
  );

  const patients = useMemo(
    () => getUserPatients(employeeId),
    [employeeId]
  );

  const assignments = useMemo(
    () => getUserAssignments(employeeId),
    [employeeId]
  );

  const attendance = useMemo(
    () => getUserAttendance(employeeId),
    [employeeId]
  );

  const notifications = useMemo(
    () => getUserNotifications(employeeId),
    [employeeId]
  );

  const today = new Date();

  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const todaySchedule = schedules.filter(
    (item) => item.date === todayKey
  );

  const todayAppointments = appointments.filter(
    (item) => item.date === todayKey
  );

  const activeAssignments = assignments.filter(
    (item) => item.status !== "Completed"
  );

  const unreadNotifications = notifications.filter(
    (item) => !item.read
  );

  const todayAttendance = attendance.find(
    (item) => item.date === todayKey
  );

  const roleLabel = {
    doctor: "Doctor",
    nurse: "Nurse",
    staff: "Staff",
  };

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "there";

  const stats = [
    {
      label: "Today's Schedule",
      value: todaySchedule.length,
      icon: CalendarDays,
      path: "/workforce/schedule",
      visible: true,
    },
    {
      label: "Appointments",
      value: todayAppointments.length,
      icon: ClipboardList,
      path: "/workforce/appointments",
      visible: permissions.appointments,
    },
    {
      label: "My Patients",
      value: patients.length,
      icon: Users,
      path: "/workforce/patients",
      visible: permissions.patients,
    },
    {
      label: "Assignments",
      value: activeAssignments.length,
      icon: BriefcaseBusiness,
      path: "/workforce/assignments",
      visible: permissions.assignments,
    },
  ].filter((stat) => stat.visible);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Confirmed":
      case "Present":
      case "Completed":
        return "bg-[#E8F8F6] text-[#087F7B]";

      case "Pending":
      case "In Progress":
        return "bg-[#FFF7E6] text-[#9A6B00]";

      case "Late":
        return "bg-[#FFF0EC] text-[#B4533C]";

      case "Cancelled":
        return "bg-[#FDECEC] text-[#B42318]";

      default:
        return "bg-[#F3F5F5] text-[#6B7F7B]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-xl bg-[#073F42] px-5 py-6 text-white sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[#A9D0CE]">
              {roleLabel[role] || "Workforce"} Portal
            </p>

            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
              Welcome back, {firstName}
            </h2>

            <p className="mt-2 max-w-xl text-sm text-[#B8CDCD]">
              Here's an overview of your schedule, work, and
              activities for today.
            </p>
          </div>

          <div className="hidden h-14 w-14 items-center justify-center rounded-xl bg-white/10 sm:flex">
            <BriefcaseBusiness className="h-6 w-6 text-[#8DE1DC]" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className={`
          grid gap-3
          ${
            stats.length === 4
              ? "grid-cols-2 lg:grid-cols-4"
              : "grid-cols-2 lg:grid-cols-3"
          }
        `}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              key={stat.label}
              type="button"
              onClick={() => navigate(stat.path)}
              className="
                group rounded-xl border border-[#E2EFED]
                bg-white p-4 text-left
                shadow-[0_2px_10px_rgba(15,118,110,0.04)]
                transition-all hover:border-[#B9E2DE]
                hover:shadow-[0_4px_14px_rgba(15,118,110,0.08)]
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                  <Icon className="h-4 w-4" />
                </div>

                <ArrowRight className="h-4 w-4 text-[#A0B4B1] transition-transform group-hover:translate-x-0.5" />
              </div>

              <p className="mt-4 text-xs text-[#7A918E]">
                {stat.label}
              </p>

              <p className="mt-1 text-xl font-semibold text-[#153B37]">
                {stat.value}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Today's Schedule */}
        <div className="xl:col-span-2 rounded-xl border border-[#E2EFED] bg-white">
          <div className="flex items-center justify-between border-b border-[#EAF2F1] px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-base font-semibold text-[#153B37]">
                Today's Schedule
              </h3>

              <p className="mt-0.5 text-xs text-[#7A918E]">
                Your scheduled duties for today
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/workforce/schedule")}
              className="text-xs font-semibold text-[#08A6A0] hover:text-[#087F7B]"
            >
              View All
            </button>
          </div>

          <div className="p-5 sm:p-6">
            {todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border border-[#EAF2F1] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                        <CalendarDays className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#315A57]">
                          {item.title}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-[#829692]">
                          {item.department} • {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-[52px] sm:pl-0">
                      <div className="flex items-center gap-1.5 text-xs text-[#55716E]">
                        <Clock3 className="h-3.5 w-3.5 text-[#08A6A0]" />
                        {item.startTime} - {item.endTime}
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CalendarDays className="h-7 w-7 text-[#A5B7B4]" />

                <p className="mt-3 text-sm font-semibold text-[#315A57]">
                  No schedule for today
                </p>

                <p className="mt-1 text-xs text-[#829692]">
                  You don't have any scheduled duties today.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance */}
        <div className="rounded-xl border border-[#E2EFED] bg-white">
          <div className="border-b border-[#EAF2F1] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#153B37]">
                  Today's Attendance
                </h3>

                <p className="mt-0.5 text-xs text-[#7A918E]">
                  Your current attendance status
                </p>
              </div>

              <Clock3 className="h-5 w-5 text-[#08A6A0]" />
            </div>
          </div>

          <div className="p-5">
            {todayAttendance ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-[#F4FAF9] p-4">
                  <div>
                    <p className="text-xs text-[#829692]">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                        todayAttendance.status
                      )}`}
                    >
                      {todayAttendance.status}
                    </span>
                  </div>

                  <CheckCircle2 className="h-5 w-5 text-[#08A6A0]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#EAF2F1] p-3">
                    <p className="text-[11px] text-[#829692]">
                      Check In
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#315A57]">
                      {todayAttendance.checkIn || "--"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#EAF2F1] p-3">
                    <p className="text-[11px] text-[#829692]">
                      Check Out
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#315A57]">
                      {todayAttendance.checkOut || "--"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/workforce/attendance")}
                  className="w-full rounded-lg bg-[#E8F8F6] px-4 py-2.5 text-xs font-semibold text-[#087F7B] transition-colors hover:bg-[#DDF3F0]"
                >
                  View Attendance
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertCircle className="mx-auto h-6 w-6 text-[#A5B7B4]" />

                <p className="mt-3 text-sm font-semibold text-[#315A57]">
                  No attendance record
                </p>

                <p className="mt-1 text-xs text-[#829692]">
                  Attendance has not been recorded for today.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointments + Assignments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appointments */}
        {permissions.appointments && (
          <div className="rounded-xl border border-[#E2EFED] bg-white">
            <div className="flex items-center justify-between border-b border-[#EAF2F1] px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-[#153B37]">
                  Today's Appointments
                </h3>

                <p className="mt-0.5 text-xs text-[#7A918E]">
                  Upcoming appointments assigned to you
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/workforce/appointments")
                }
                className="text-xs font-semibold text-[#08A6A0]"
              >
                View All
              </button>
            </div>

            <div className="p-5">
              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-[#EAF2F1] p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                        <Users className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#315A57]">
                          {item.patientName}
                        </p>

                        <p className="mt-0.5 text-xs text-[#829692]">
                          {item.type} • {item.department}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-semibold text-[#315A57]">
                          {item.time}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStatusClasses(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-[#829692]">
                  No appointments scheduled for today.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Assignments */}
        {permissions.assignments && (
          <div className="rounded-xl border border-[#E2EFED] bg-white">
            <div className="flex items-center justify-between border-b border-[#EAF2F1] px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-[#153B37]">
                  My Assignments
                </h3>

                <p className="mt-0.5 text-xs text-[#7A918E]">
                  Your active assigned duties
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/workforce/assignments")
                }
                className="text-xs font-semibold text-[#08A6A0]"
              >
                View All
              </button>
            </div>

            <div className="p-5">
              {activeAssignments.length > 0 ? (
                <div className="space-y-3">
                  {activeAssignments.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-[#EAF2F1] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#315A57]">
                            {item.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-[#829692]">
                            {item.patientName}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold ${getStatusClasses(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-[#829692]">
                        <span>
                          Priority:{" "}
                          <span className="font-medium text-[#55716E]">
                            {item.priority}
                          </span>
                        </span>

                        <span>Due: {item.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-[#829692]">
                  No active assignments.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-[#E2EFED] bg-white">
        <div className="flex items-center justify-between border-b border-[#EAF2F1] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <Bell className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#153B37]">
                Recent Notifications
              </h3>

              <p className="mt-0.5 text-xs text-[#7A918E]">
                {unreadNotifications.length} unread notification
                {unreadNotifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/workforce/notifications")}
            className="text-xs font-semibold text-[#08A6A0]"
          >
            View All
          </button>
        </div>

        <div className="divide-y divide-[#EAF2F1]">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 px-5 py-4 sm:px-6 ${
                !notification.read ? "bg-[#FBFEFD]" : ""
              }`}
            >
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#08A6A0]" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-[#315A57]">
                    {notification.title}
                  </p>

                  <span className="text-[10px] text-[#9AAEAB]">
                    {notification.time}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-[#829692]">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-8 text-center text-xs text-[#829692]">
              No notifications available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;