import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Building2,
  CheckCircle2,
  CircleAlert,
  BriefcaseBusiness,
  ArrowRight,
  CalendarCheck2,
  Send,
  X,
  AlertCircle,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserSchedule,
} from "../../data/workforceData";
import { apiRequest } from "../../api/api";

export default function Schedule({ user }) {
  const navigate = useNavigate();

  const employeeId = user?.id || "EMP-1001";

  const workforceUser =
    getWorkforceUser(employeeId) ||
    getWorkforceUser("EMP-1001");

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const data = await apiRequest("/schedules");
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((s) => ({
          id: s.id,
          employeeId: s.doctor_id ? `EMP-${s.doctor_id}` : employeeId,
          date: s.date || s.start_date || "",
          title: s.type || s.doctor_name || "Scheduled Shift",
          type: s.type || "Duty",
          startTime: s.start_time || "09:00",
          endTime: s.end_time || "17:00",
          department: s.department || "General Medicine",
          location: s.location || "Hospital Main Wing",
          status: s.status || "Scheduled",
        }));
        setSchedules(mapped);
      } else {
        setSchedules(getUserSchedule(employeeId));
      }
    } catch (err) {
      console.error("Failed to load schedules from backend:", err);
      setSchedules(getUserSchedule(employeeId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [employeeId]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    type: "Shift Swap",
    date: "",
    timeSlot: "Morning (08:00 - 14:00)",
    reason: "",
  });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestData.date || !requestData.reason) {
      showToast("Please provide the requested date and reason", "error");
      return;
    }
    try {
      await apiRequest("/requests", {
        method: "POST",
        body: JSON.stringify({
          request_type: "Schedule",
          item: requestData.type,
          requested_by: workforceUser?.name || user?.name || "Staff Member",
          department: workforceUser?.department || "General",
          priority: "Normal",
          required_date: requestData.date,
          description: `Time slot: ${requestData.timeSlot}. Reason: ${requestData.reason}`,
          status: "Pending",
        }),
      });
      showToast("Schedule change request submitted successfully!");
      setRequestModalOpen(false);
      setRequestData({
        type: "Shift Swap",
        date: "",
        timeSlot: "Morning (08:00 - 14:00)",
        reason: "",
      });
    } catch (err) {
      showToast(err.message || "Failed to submit request", "error");
    }
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatLongDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
    });
  };

  const formatTime = (time) => {
    if (!time) return "--";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isToday = (date) => {
    return formatDateKey(date) === formatDateKey(new Date());
  };

  const selectedDateKey = formatDateKey(selectedDate);

  const selectedDaySchedule = useMemo(() => {
    return schedules
      .filter((item) => item.date === selectedDateKey)
      .sort((a, b) =>
        (a.startTime || "").localeCompare(b.startTime || "")
      );
  }, [schedules, selectedDateKey]);

  const upcomingSchedule = useMemo(() => {
    return schedules
      .filter((item) => item.date > selectedDateKey)
      .sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }

        return (a.startTime || "").localeCompare(
          b.startTime || ""
        );
      })
      .slice(0, 5);
  }, [schedules, selectedDateKey]);

  const selectedDateStats = useMemo(() => {
    const total = selectedDaySchedule.length;

    const completed = selectedDaySchedule.filter(
      (item) =>
        item.status?.toLowerCase() === "completed"
    ).length;

    const pending = selectedDaySchedule.filter((item) =>
      ["scheduled", "pending"].includes(
        item.status?.toLowerCase()
      )
    ).length;

    let totalMinutes = 0;

    selectedDaySchedule.forEach((item) => {
      if (!item.startTime || !item.endTime) return;

      const [startHour, startMinute] = item.startTime
        .split(":")
        .map(Number);

      const [endHour, endMinute] = item.endTime
        .split(":")
        .map(Number);

      const start =
        startHour * 60 + startMinute;

      const end =
        endHour * 60 + endMinute;

      if (end > start) {
        totalMinutes += end - start;
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const workingHours =
      totalMinutes > 0
        ? `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`
        : "Not available";

    return {
      total,
      completed,
      pending,
      workingHours,
    };
  }, [selectedDaySchedule]);

  const changeDate = (amount) => {
    const newDate = new Date(selectedDate);

    newDate.setDate(newDate.getDate() + amount);

    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700";

      case "scheduled":
        return "bg-blue-50 text-blue-700";

      case "pending":
        return "bg-amber-50 text-amber-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return CheckCircle2;

      case "cancelled":
        return CircleAlert;

      default:
        return CalendarCheck2;
    }
  };

  const getScheduleTypeClass = (type) => {
    switch (type?.toLowerCase()) {
      case "shift":
        return "bg-purple-50 text-purple-700";

      case "meeting":
        return "bg-blue-50 text-blue-700";

      case "round":
      case "ward round":
        return "bg-emerald-50 text-emerald-700";

      case "consultation":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-[#E8F8F6] text-[#087F7B]";
    }
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE INTRO
      ====================================================== */}
      <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                <CalendarDays size={18} />
              </div>

              <div>
                <h1 className="font-semibold text-[#073F42]">
                  My Schedule
                </h1>

                <p className="text-xs text-slate-500">
                  Manage your daily hospital activities
                </p>
              </div>
            </div>
          </div>

          {/* Action & Date Navigation */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeDate(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDEBEA] text-slate-500 transition hover:bg-[#F5FAFA] hover:text-[#073F42]"
                aria-label="Previous day"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={goToToday}
                className={`h-10 rounded-lg border px-4 text-sm font-medium transition ${
                  isToday(selectedDate)
                    ? "border-[#08A6A0] bg-[#E8F8F6] text-[#087F7B]"
                    : "border-[#DDEBEA] text-slate-600 hover:bg-[#F5FAFA]"
                }`}
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => changeDate(1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDEBEA] text-slate-500 transition hover:bg-[#F5FAFA] hover:text-[#073F42]"
                aria-label="Next day"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setRequestModalOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
            >
              <Send size={15} />
              Request Schedule Change
            </button>
          </div>
        </div>

        {/* Selected Date */}
        <div className="border-t border-[#E8EFEF] bg-[#F8FBFB] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#08A6A0]">
                Selected Date
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[#073F42]">
                {formatLongDate(selectedDate)}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <UserIcon />
              <span>
                {workforceUser?.name || "Workforce User"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SUMMARY
      ====================================================== */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryItem
          icon={CalendarDays}
          label="Activities"
          value={selectedDateStats.total}
        />

        <SummaryItem
          icon={Clock3}
          label="Working Hours"
          value={selectedDateStats.workingHours}
        />

        <SummaryItem
          icon={CheckCircle2}
          label="Completed"
          value={selectedDateStats.completed}
        />

        <SummaryItem
          icon={CalendarCheck2}
          label="Pending"
          value={selectedDateStats.pending}
        />
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
        {/* =================================================
            DAILY TIMELINE
        ================================================== */}
        <section className="overflow-hidden rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
          <div className="border-b border-[#E8EFEF] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-[#073F42]">
                  Daily Timeline
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Your scheduled activities for this day
                </p>
              </div>

              {isToday(selectedDate) && (
                <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#087F7B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#08A6A0]" />
                  Today
                </span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {selectedDaySchedule.length > 0 ? (
              <div className="space-y-0">
                {selectedDaySchedule.map((item, index) => {
                  const StatusIcon = getStatusIcon(
                    item.status
                  );

                  const isLast =
                    index === selectedDaySchedule.length - 1;

                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-4 sm:gap-5"
                    >
                      {/* Time */}
                      <div className="w-[68px] shrink-0 text-right sm:w-[82px]">
                        <p className="text-sm font-semibold text-[#073F42]">
                          {formatTime(item.startTime)}
                        </p>

                        {item.endTime && (
                          <p className="mt-1 text-[11px] text-slate-400">
                            {formatTime(item.endTime)}
                          </p>
                        )}
                      </div>

                      {/* Timeline */}
                      <div className="relative flex w-4 shrink-0 justify-center">
                        <div className="relative z-10 mt-1.5 h-3 w-3 rounded-full border-[3px] border-white bg-[#08A6A0] ring-2 ring-[#BDE5E2]" />

                        {!isLast && (
                          <div className="absolute top-5 h-full w-px bg-[#DDEBEA]" />
                        )}
                      </div>

                      {/* Activity */}
                      <div
                        className={`min-w-0 flex-1 ${
                          isLast ? "pb-1" : "pb-7"
                        }`}
                      >
                        <div className="rounded-xl border border-[#E1ECEB] bg-[#FBFDFD] p-4 transition hover:border-[#BFDAD8] hover:bg-white">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-[#073F42]">
                                  {item.title}
                                </h3>

                                {item.type && (
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getScheduleTypeClass(
                                      item.type
                                    )}`}
                                  >
                                    {item.type}
                                  </span>
                                )}
                              </div>

                              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {item.department && (
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Building2
                                      size={14}
                                      className="shrink-0 text-[#08A6A0]"
                                    />
                                    <span>
                                      {item.department}
                                    </span>
                                  </div>
                                )}

                                {item.location && (
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <MapPin
                                      size={14}
                                      className="shrink-0 text-[#08A6A0]"
                                    />
                                    <span>
                                      {item.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <span
                              className={`flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                                item.status
                              )}`}
                            >
                              <StatusIcon size={13} />
                              {item.status || "Scheduled"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptySchedule />
            )}
          </div>
        </section>

        {/* =================================================
            UPCOMING SCHEDULE
        ================================================== */}
        <section className="overflow-hidden rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8EFEF] px-5 py-5">
            <div>
              <h2 className="font-semibold text-[#073F42]">
                Upcoming
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Next scheduled activities
              </p>
            </div>

            <CalendarDays
              size={19}
              className="text-[#08A6A0]"
            />
          </div>

          <div className="divide-y divide-[#E8EFEF]">
            {upcomingSchedule.length > 0 ? (
              upcomingSchedule.map((item) => {
                const itemDate = new Date(
                  `${item.date}T00:00:00`
                );

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setSelectedDate(itemDate)
                    }
                    className="group flex w-full gap-3 px-5 py-4 text-left transition hover:bg-[#F8FBFB]"
                  >
                    {/* Date */}
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-[#E8F8F6]">
                      <span className="text-[10px] font-medium uppercase text-[#087F7B]">
                        {formatDay(itemDate)}
                      </span>

                      <span className="text-base font-bold text-[#073F42]">
                        {itemDate.getDate()}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#073F42]">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatShortDate(itemDate)}
                        {item.startTime
                          ? ` • ${formatTime(item.startTime)}`
                          : ""}
                      </p>

                      {item.department && (
                        <p className="mt-1 truncate text-[11px] text-slate-400">
                          {item.department}
                        </p>
                      )}
                    </div>

                    <ChevronRight
                      size={16}
                      className="mt-3 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#08A6A0]"
                    />
                  </button>
                );
              })
            ) : (
              <div className="px-5 py-12 text-center">
                <CalendarDays
                  size={25}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  No upcoming schedule
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  There are no future activities available.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =====================================================
          WORK INFORMATION
      ====================================================== */}
      <section className="rounded-2xl border border-[#CFE5E3] bg-[#E8F8F6] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#08A6A0]">
              <BriefcaseBusiness size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#073F42]">
                Need to review your attendance?
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#5E7777]">
                Check your attendance records and working
                hours from the attendance section.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/workforce/attendance")
            }
            className="flex w-fit items-center gap-1.5 text-sm font-semibold text-[#087F7B] transition hover:text-[#056966]"
          >
            View Attendance
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* SCHEDULE REQUEST MODAL */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2EFED] bg-[#E8F8F6] px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-[#073F42]">
                  Request Schedule Change
                </h2>
                <p className="mt-0.5 text-xs text-[#5D7B7D]">
                  Submit a shift swap or schedule adjustment request
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 p-5">
              <div>
                <label className="block text-xs font-semibold text-[#31585A]">
                  Request Type
                </label>
                <select
                  value={requestData.type}
                  onChange={(e) =>
                    setRequestData((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="mt-1 h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
                >
                  <option>Shift Swap</option>
                  <option>Leave / Day Off</option>
                  <option>Time Adjustment</option>
                  <option>Ward Transfer Request</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#31585A]">
                    Requested Date
                  </label>
                  <input
                    type="date"
                    required
                    value={requestData.date}
                    onChange={(e) =>
                      setRequestData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#31585A]">
                    Preferred Shift / Time
                  </label>
                  <select
                    value={requestData.timeSlot}
                    onChange={(e) =>
                      setRequestData((prev) => ({
                        ...prev,
                        timeSlot: e.target.value,
                      }))
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
                  >
                    <option>Morning (08:00 - 14:00)</option>
                    <option>Evening (14:00 - 20:00)</option>
                    <option>Night (20:00 - 08:00)</option>
                    <option>Full Day Off</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#31585A]">
                  Reason / Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the reason for this schedule request..."
                  value={requestData.reason}
                  onChange={(e) =>
                    setRequestData((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] p-3 text-xs sm:text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#EAF2F1] pt-3">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="h-10 rounded-xl border border-[#D9E9E7] px-4 text-xs sm:text-sm font-semibold text-[#31585A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
                >
                  <Send size={14} />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 z-50
            flex items-center gap-2.5
            rounded-2xl px-5 py-3.5
            text-sm font-semibold text-white shadow-2xl
            transition-all duration-300
            ${toast.type === "error" ? "bg-red-600" : "bg-[#08A6A0]"}
          `}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SUMMARY ITEM
============================================================ */

function SummaryItem({
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

          <p className="mt-2 text-xl font-bold text-[#073F42] sm:text-2xl">
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

/* ============================================================
   EMPTY SCHEDULE
============================================================ */

function EmptySchedule() {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-xl border border-dashed border-[#CFE0DF] bg-[#FBFDFD] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
        <CalendarDays size={24} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-[#073F42]">
        No activities scheduled
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        You don't have any scheduled activities for this
        date. Try another date to view your schedule.
      </p>
    </div>
  );
}

/* ============================================================
   USER ICON
============================================================ */

function UserIcon() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
      <BriefcaseBusiness size={13} />
    </div>
  );
}