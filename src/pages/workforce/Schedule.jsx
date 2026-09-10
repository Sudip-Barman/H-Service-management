import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  UserRound,
  BriefcaseBusiness,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";

const Schedule = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const scheduleData = [
    {
      id: 1,
      date: "2026-09-10",
      title: "Morning Shift",
      type: "Regular Duty",
      startTime: "08:00 AM",
      endTime: "02:00 PM",
      department: "General Ward",
      location: "CareCore Hospital",
      status: "Scheduled",
    },
    {
      id: 2,
      date: "2026-09-10",
      title: "Patient Care Duty",
      type: "Assigned Duty",
      startTime: "02:00 PM",
      endTime: "05:00 PM",
      department: "Patient Care",
      location: "Ward 2",
      status: "Scheduled",
    },
    {
      id: 3,
      date: "2026-09-11",
      title: "Morning Shift",
      type: "Regular Duty",
      startTime: "08:00 AM",
      endTime: "02:00 PM",
      department: "General Ward",
      location: "CareCore Hospital",
      status: "Scheduled",
    },
    {
      id: 4,
      date: "2026-09-12",
      title: "Evening Shift",
      type: "Regular Duty",
      startTime: "02:00 PM",
      endTime: "08:00 PM",
      department: "Emergency",
      location: "Emergency Department",
      status: "Scheduled",
    },
    {
      id: 5,
      date: "2026-09-13",
      title: "Weekly Off",
      type: "Day Off",
      startTime: "-",
      endTime: "-",
      department: "-",
      location: "-",
      status: "Off",
    },
  ];

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const selectedDateKey = formatDateKey(selectedDate);

  const selectedSchedule = useMemo(() => {
    return scheduleData.filter((item) => item.date === selectedDateKey);
  }, [selectedDateKey]);

  const todayKey = formatDateKey(new Date());

  const upcomingSchedule = useMemo(() => {
    return scheduleData
      .filter((item) => item.date >= todayKey && item.status !== "Off")
      .slice(0, 4);
  }, [todayKey]);

  const getStatusClasses = (status) => {
    if (status === "Scheduled") {
      return "bg-[#E8F8F6] text-[#087F7B]";
    }

    if (status === "Off") {
      return "bg-[#F3F5F5] text-[#6B7F7B]";
    }

    return "bg-[#FFF7E6] text-[#9A6B00]";
  };

  return (
    <div className="space-y-6">
      {/* Page Intro */}
      <div>
        <h2 className="text-lg font-semibold text-[#153B37]">
          My Schedule
        </h2>

        <p className="mt-1 text-sm text-[#6B7F7B]">
          View your shifts, duties, and upcoming working schedule.
        </p>
      </div>

      {/* Schedule Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[#E2EFED] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-[#7A918E]">
                Today's Duties
              </p>
              <p className="mt-0.5 text-lg font-semibold text-[#153B37]">
                {
                  scheduleData.filter(
                    (item) => item.date === todayKey
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2EFED] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF5FF] text-[#3973B9]">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-[#7A918E]">
                Working Hours
              </p>
              <p className="mt-0.5 text-lg font-semibold text-[#153B37]">
                6h
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2EFED] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F0FF] text-[#7653B8]">
              <CalendarCheck className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-[#7A918E]">
                This Week
              </p>
              <p className="mt-0.5 text-lg font-semibold text-[#153B37]">
                4
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2EFED] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1F8EE] text-[#4D8A42]">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-[#7A918E]">
                Status
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#153B37]">
                {user?.status || "Active"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="rounded-xl border border-[#E2EFED] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeDate(-1)}
              className="
                flex h-9 w-9 items-center justify-center rounded-lg
                border border-[#E2EFED] text-[#55716E]
                transition-colors hover:bg-[#E8F8F6]
              "
              aria-label="Previous day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0 px-2 text-center sm:text-left">
              <p className="text-sm font-semibold text-[#153B37]">
                {formatDisplayDate(selectedDate)}
              </p>

              <p className="mt-0.5 text-xs text-[#7A918E]">
                {selectedDateKey === todayKey
                  ? "Today"
                  : formatShortDate(selectedDate)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => changeDate(1)}
              className="
                flex h-9 w-9 items-center justify-center rounded-lg
                border border-[#E2EFED] text-[#55716E]
                transition-colors hover:bg-[#E8F8F6]
              "
              aria-label="Next day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={goToToday}
            className="
              rounded-lg bg-[#08A6A0] px-4 py-2
              text-xs font-semibold text-white
              transition-colors hover:bg-[#078F8A]
            "
          >
            Today
          </button>
        </div>
      </div>

      {/* Selected Day Schedule */}
      <div className="rounded-xl border border-[#E2EFED] bg-white">
        <div className="border-b border-[#EAF2F1] px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[#153B37]">
                Daily Schedule
              </h3>

              <p className="mt-0.5 text-xs text-[#7A918E]">
                {selectedSchedule.length} schedule item
                {selectedSchedule.length !== 1 ? "s" : ""}
              </p>
            </div>

            <CalendarDays className="h-5 w-5 text-[#08A6A0]" />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {selectedSchedule.length > 0 ? (
            <div className="space-y-4">
              {selectedSchedule.map((item) => (
                <div
                  key={item.id}
                  className="
                    rounded-xl border border-[#E2EFED]
                    p-4 transition-colors hover:bg-[#FAFCFC]
                  "
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="
                          flex h-11 w-11 shrink-0 items-center
                          justify-center rounded-lg bg-[#E8F8F6]
                          text-[#08A6A0]
                        "
                      >
                        <BriefcaseBusiness className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#153B37]">
                            {item.title}
                          </h4>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-[#7A918E]">
                          {item.type}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[500px]">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 shrink-0 text-[#08A6A0]" />
                        <div>
                          <p className="text-[10px] text-[#829692]">
                            Time
                          </p>
                          <p className="text-xs font-medium text-[#315A57]">
                            {item.startTime} - {item.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 shrink-0 text-[#08A6A0]" />
                        <div>
                          <p className="text-[10px] text-[#829692]">
                            Department
                          </p>
                          <p className="truncate text-xs font-medium text-[#315A57]">
                            {item.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-[#08A6A0]" />
                        <div>
                          <p className="text-[10px] text-[#829692]">
                            Location
                          </p>
                          <p className="truncate text-xs font-medium text-[#315A57]">
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F6F5] text-[#7A918E]">
                <CalendarDays className="h-5 w-5" />
              </div>

              <h4 className="mt-4 text-sm font-semibold text-[#315A57]">
                No schedule available
              </h4>

              <p className="mt-1 max-w-sm text-xs text-[#829692]">
                You don't have any scheduled duties for this date.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="rounded-xl border border-[#E2EFED] bg-white">
        <div className="border-b border-[#EAF2F1] px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-[#153B37]">
            Upcoming Schedule
          </h3>

          <p className="mt-0.5 text-xs text-[#7A918E]">
            Your next scheduled duties
          </p>
        </div>

        <div className="divide-y divide-[#EAF2F1]">
          {upcomingSchedule.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                  <CalendarDays className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#315A57]">
                    {item.title}
                  </p>

                  <p className="mt-0.5 text-xs text-[#829692]">
                    {item.department} • {item.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-[52px] sm:pl-0">
                <div className="text-left sm:text-right">
                  <p className="text-xs font-semibold text-[#315A57]">
                    {item.date}
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#829692]">
                    {item.startTime} - {item.endTime}
                  </p>
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
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#DCEFED] bg-[#F3FAF9] p-4">
        <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#08A6A0]" />

        <p className="text-xs leading-relaxed text-[#55716E]">
          Your schedule is managed by the hospital administration.
          Contact your supervisor if you need to request a schedule
          change.
        </p>
      </div>
    </div>
  );
};

export default Schedule;