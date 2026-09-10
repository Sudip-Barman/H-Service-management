import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Users,
  ClipboardList,
  CheckCircle2,
  CircleAlert,
  Bell,
  ArrowRight,
  CalendarPlus,
  FileText,
  UserRound,
  Stethoscope,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserSchedule,
  getUserAppointments,
  getUserPatients,
  getUserAssignments,
  getUserAttendance,
  getUserNotifications,
  getRolePermissions,
} from "../../data/workforceData";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const employeeId = user?.id || "EMP-1001";
  const workforceUser = getWorkforceUser(employeeId) || getWorkforceUser("EMP-1001");

  const role = workforceUser?.role?.toLowerCase() || "staff";
  const permissions = getRolePermissions(role);

  const schedules = getUserSchedule(employeeId);
  const appointments = getUserAppointments(employeeId);
  const patients = getUserPatients(employeeId);
  const assignments = getUserAssignments(employeeId);
  const attendance = getUserAttendance(employeeId);
  const notifications = getUserNotifications(employeeId);

  const today = new Date();

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "--";

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const todayString = today.toISOString().split("T")[0];

  const todaySchedule = useMemo(() => {
    return schedules
      .filter((item) => item.date === todayString)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, todayString]);

  const todayAppointments = useMemo(() => {
    return appointments
      .filter((item) => item.date === todayString)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, todayString]);

  const todayAttendance = useMemo(() => {
    return attendance.find((item) => item.date === todayString);
  }, [attendance, todayString]);

  const unreadNotifications = notifications.filter(
    (item) => !item.read
  );

  const pendingAssignments = assignments.filter(
    (item) => item.status !== "Completed"
  );

  const firstName =
    workforceUser?.name?.replace("Dr. ", "").split(" ")[0] || "User";

  const getGreeting = () => {
    const hour = today.getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getRoleLabel = () => {
    if (role === "doctor") return "Doctor";
    if (role === "nurse") return "Nurse";
    return "Staff";
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
      case "available":
      case "present":
      case "approved":
        return "bg-emerald-50 text-emerald-700";

      case "pending":
      case "scheduled":
        return "bg-amber-50 text-amber-700";

      case "cancelled":
      case "rejected":
      case "absent":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const stats = [
    {
      label: "Today's Schedule",
      value: todaySchedule.length,
      icon: CalendarDays,
      description: "scheduled activities",
    },
    ...(permissions.appointments
      ? [
          {
            label: "Appointments",
            value: todayAppointments.length,
            icon: ClipboardList,
            description: "today",
          },
        ]
      : []),
    {
      label: "My Patients",
      value: patients.length,
      icon: Users,
      description: "assigned patients",
    },
    ...(permissions.assignments
      ? [
          {
            label: "Pending Tasks",
            value: pendingAssignments.length,
            icon: FileText,
            description: "need attention",
          },
        ]
      : []),
  ];

  const quickActions = [
    {
      label: "View Schedule",
      icon: CalendarDays,
      path: "/workforce/schedule",
    },
    ...(permissions.appointments
      ? [
          {
            label: "Appointments",
            icon: ClipboardList,
            path: "/workforce/appointments",
          },
        ]
      : []),
    {
      label: "Attendance",
      icon: Clock3,
      path: "/workforce/attendance",
    },
    ...(permissions.assignments
      ? [
          {
            label: "My Assignments",
            icon: FileText,
            path: "/workforce/assignments",
          },
        ]
      : []),
    {
      label: "Leave Request",
      icon: CalendarPlus,
      path: "/workforce/leave",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#DDEBEA] bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium text-[#08A6A0]">
              {getRoleLabel()} Portal
            </span>
            <span className="h-1 w-1 rounded-full bg-[#A6BDBD]" />
            <span className="text-sm text-slate-500">
              {workforceUser?.employeeId || employeeId}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#073F42] sm:text-3xl">
            {getGreeting()}, {firstName}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Here's your work overview for today.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#E8F8F6] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#08A6A0] shadow-sm">
            <CalendarDays size={20} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#5E7777]">
              Today
            </p>
            <p className="text-sm font-semibold text-[#073F42]">
              {formatDate(today)}
            </p>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#DDEBEA] bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-[#073F42]">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                  <Icon size={19} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Work Area */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)]">
        {/* Today's Schedule */}
        <div className="overflow-hidden rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8EFEF] px-5 py-4 sm:px-6">
            <div>
              <h3 className="font-semibold text-[#073F42]">
                Today's Schedule
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Your activities and scheduled work
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/workforce/schedule")}
              className="flex items-center gap-1.5 text-sm font-medium text-[#08A6A0] transition hover:text-[#067F7B]"
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="divide-y divide-[#E8EFEF]">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 px-5 py-4 transition hover:bg-[#F8FBFB] sm:px-6"
                >
                  <div className="w-16 shrink-0 pt-0.5">
                    <p className="text-sm font-semibold text-[#073F42]">
                      {formatTime(item.startTime)}
                    </p>

                    {item.endTime && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {formatTime(item.endTime)}
                      </p>
                    )}
                  </div>

                  <div className="relative flex min-w-0 flex-1 gap-3">
                    <div className="relative flex flex-col items-center">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#08A6A0]" />
                      <div className="absolute top-4 h-full w-px bg-[#DDEBEA]" />
                    </div>

                    <div className="min-w-0 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium text-[#073F42]">
                          {item.title}
                        </h4>

                        {item.status && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.department}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        {item.location && <span>{item.location}</span>}
                        {item.type && <span>{item.type}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                  <CalendarDays size={21} />
                </div>

                <h4 className="mt-4 font-semibold text-[#073F42]">
                  No schedule for today
                </h4>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  You currently have no scheduled activities for today.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance */}
        <div className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
          <div className="border-b border-[#E8EFEF] px-5 py-4">
            <h3 className="font-semibold text-[#073F42]">Attendance</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Today's attendance status
            </p>
          </div>

          <div className="p-5">
            {todayAttendance ? (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-[#E8F8F6] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#08A6A0]">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#073F42]">
                      {todayAttendance.status || "Present"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Attendance recorded for today
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#E8EFEF] p-3">
                    <p className="text-xs text-slate-400">Check In</p>
                    <p className="mt-1 text-sm font-semibold text-[#073F42]">
                      {formatTime(todayAttendance.checkIn)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E8EFEF] p-3">
                    <p className="text-xs text-slate-400">Check Out</p>
                    <p className="mt-1 text-sm font-semibold text-[#073F42]">
                      {todayAttendance.checkOut
                        ? formatTime(todayAttendance.checkOut)
                        : "Not yet"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-400">Working Hours</p>
                  <p className="mt-1 text-lg font-bold text-[#073F42]">
                    {todayAttendance.workingHours || "In progress"}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Clock3 size={21} />
                </div>

                <h4 className="mt-4 font-semibold text-[#073F42]">
                  Attendance not recorded
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Your attendance for today has not been recorded yet.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate("/workforce/attendance")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#BFDAD8] px-4 py-2.5 text-sm font-medium text-[#087F7B] transition hover:bg-[#E8F8F6]"
            >
              Open Attendance
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Appointments + Notifications */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Appointments */}
        {permissions.appointments && (
          <div className="overflow-hidden rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E8EFEF] px-5 py-4 sm:px-6">
              <div>
                <h3 className="font-semibold text-[#073F42]">
                  Today's Appointments
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Patient appointments assigned to you
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/workforce/appointments")}
                className="text-[#08A6A0] transition hover:text-[#067F7B]"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="divide-y divide-[#E8EFEF]">
              {todayAppointments.length > 0 ? (
                todayAppointments.slice(0, 4).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-3 px-5 py-4 sm:px-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                      <UserRound size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#073F42]">
                          {appointment.patientName}
                        </p>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {appointment.type}
                        {appointment.department
                          ? ` • ${appointment.department}`
                          : ""}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-[#073F42]">
                        {formatTime(appointment.time)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <ClipboardList
                    size={24}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    No appointments today
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="overflow-hidden rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8EFEF] px-5 py-4 sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#073F42]">
                  Notifications
                </h3>

                {unreadNotifications.length > 0 && (
                  <span className="rounded-full bg-[#08A6A0] px-2 py-0.5 text-[10px] font-semibold text-white">
                    {unreadNotifications.length} new
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-slate-500">
                Recent updates and alerts
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/workforce/notifications")}
              className="flex items-center gap-1.5 text-sm font-medium text-[#08A6A0] transition hover:text-[#067F7B]"
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="divide-y divide-[#E8EFEF]">
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 px-5 py-4 sm:px-6 ${
                    !notification.read ? "bg-[#FAFEFE]" : ""
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      notification.type === "warning"
                        ? "bg-amber-50 text-amber-600"
                        : notification.type === "success"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-[#E8F8F6] text-[#08A6A0]"
                    }`}
                  >
                    {notification.type === "warning" ? (
                      <CircleAlert size={17} />
                    ) : (
                      <Bell size={17} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={`text-sm ${
                          notification.read
                            ? "font-medium text-slate-600"
                            : "font-semibold text-[#073F42]"
                        }`}
                      >
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#08A6A0]" />
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {notification.message}
                    </p>

                    {notification.time && (
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        {notification.time}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Bell size={24} className="mx-auto text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  No notifications
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
        <div className="border-b border-[#E8EFEF] px-5 py-4 sm:px-6">
          <h3 className="font-semibold text-[#073F42]">Quick Actions</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Quickly access the tools you use most
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden bg-[#E8EFEF] sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate(action.path)}
                className="group flex items-center gap-3 bg-white px-4 py-4 text-left transition hover:bg-[#F7FCFC]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0] transition group-hover:bg-[#08A6A0] group-hover:text-white">
                  <Icon size={17} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#073F42]">
                    {action.label}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Open module
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Role Information */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#CFE5E3] bg-[#E8F8F6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#08A6A0]">
            {role === "doctor" ? (
              <Stethoscope size={19} />
            ) : role === "nurse" ? (
              <HeartPulse size={19} />
            ) : (
              <Users size={19} />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-[#073F42]">
              {workforceUser?.designation || getRoleLabel()}
            </p>

            <p className="mt-0.5 text-xs text-[#5E7777]">
              {workforceUser?.department || "Hospital Services"} •{" "}
              {workforceUser?.qualification || "Professional Staff"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/workforce/profile")}
          className="flex items-center gap-2 text-sm font-semibold text-[#087F7B] transition hover:text-[#056966]"
        >
          View Profile
          <ArrowRight size={15} />
        </button>
      </section>
    </div>
  );
}