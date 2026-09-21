import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Stethoscope,
  Users,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  UserRound,
} from "lucide-react";
import { apiRequest, getErrorMessage } from "../../../api/api";

/* =========================================================
   HELPERS
   ========================================================= */

const today = new Date();
const toKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const dateFromKey = (key) => new Date(`${key}T00:00:00`);
const formatDate = (key, options = { day: "numeric", month: "short", year: "numeric" }) =>
  dateFromKey(key).toLocaleDateString("en-IN", options);
const emptySchedule = { schedule_id: null, date: toKey(today), start_time: "09:00", end_time: "13:00", doctor_name: "", department: "", location: "", type: "Consultation", status: "Available" };

/* =========================================================
   BOOKING → SCHEDULE CARD ADAPTER
   Convert a booking record into schedule-card-compatible shape
   ========================================================= */
const bookingToScheduleEntry = (booking) => {
  const staffName =
    booking.assigned_staff_name ||
    booking.staff_name ||
    booking.patient_name ||
    "Assigned Staff";

  const patientName =
    booking.patient_name ||
    booking.patient ||
    "—";

  const serviceName =
    booking.service_name ||
    booking.service ||
    booking.booking_category ||
    "Home Healthcare Service";

  const startDate = booking.service_start_date || booking.booking_date;
  const endDate   = booking.service_end_date   || booking.service_start_date || booking.booking_date;

  const startTime = booking.booking_time
    ? String(booking.booking_time).slice(0, 5)
    : "09:00";
  const endTime   = "—";

  return {
    _isBooking:    true,
    _bookingId:    booking.booking_id || booking.id,
    schedule_id:   `bk-${booking.booking_id || booking.id}`,
    date:          startDate,
    start_date:    startDate,
    end_date:      endDate,
    start_time:    startTime,
    end_time:      endTime,
    doctor_name:   staffName,        // reuse doctor_name slot for staff
    patient_name:  patientName,
    department:    serviceName,
    location:      booking.service_address || booking.service_area || booking.service_city || "—",
    type:          booking.booking_category || "Home Healthcare",
    status:        booking.status === "Cancelled" ? "Cancelled" : "Booked",
    booking_number: booking.booking_number || "",
    priority:      booking.priority || "Normal",
  };
};

/* Given a selected date key, return all booking entries that are active */
const getActiveBookingEntries = (bookings, selectedDateKey) => {
  const sel = dateFromKey(selectedDateKey);
  return bookings
    .filter((b) => {
      const start = b.service_start_date || b.booking_date;
      const end   = b.service_end_date   || b.service_start_date || b.booking_date;
      if (!start) return false;
      const startD = dateFromKey(start);
      const endD   = dateFromKey(end);
      return sel >= startD && sel <= endD && b.status !== "Cancelled";
    })
    .map(bookingToScheduleEntry);
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const Schedules = () => {
  const [schedules, setSchedules]   = useState([]);
  const [bookings,  setBookings]    = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(toKey(today));
  const [weekStart, setWeekStart] = useState(() => {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay());
    return start;
  });
  const [formOpen, setFormOpen] = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* -------------------------------------------------------
     FETCH
     ------------------------------------------------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [schedulesData, doctorsData, bookingsData] = await Promise.all([
          apiRequest("/api/schedules").catch(() => []),
          apiRequest("/api/doctors").catch(() => []),
          apiRequest("/api/bookings").catch(() => []),
        ]);
        if (Array.isArray(schedulesData)) setSchedules(schedulesData);
        if (Array.isArray(doctorsData))  setDoctorsList(doctorsData);
        if (Array.isArray(bookingsData)) setBookings(bookingsData);
      } catch (err) {
        console.error("Failed to load schedules:", err);
      }
    };
    fetchAll();
  }, []);

  /* -------------------------------------------------------
     DERIVED DATA
     ------------------------------------------------------- */
  const schedulesByDate = useMemo(() =>
    schedules.reduce((grouped, schedule) => {
      (grouped[schedule.date] ||= []).push(schedule);
      return grouped;
    }, {}),
  [schedules]);

  /* Booking entries that are active on the selected date */
  const activeBookingEntries = useMemo(
    () => getActiveBookingEntries(bookings, selectedDate),
    [bookings, selectedDate]
  );

  /* Manual schedule entries for the selected date */
  const selectedManualSchedules = schedulesByDate[selectedDate] || [];

  /* Combined list shown in the "Selected date" panel */
  const selectedSchedules = [...activeBookingEntries, ...selectedManualSchedules];

  /* Build a set of date-keys that have active bookings (for calendar dots) */
  const bookingActiveDates = useMemo(() => {
    const set = new Set();
    bookings.forEach((b) => {
      if (b.status === "Cancelled") return;
      const start = b.service_start_date || b.booking_date;
      const end   = b.service_end_date   || b.service_start_date || b.booking_date;
      if (!start) return;
      const startD = dateFromKey(start);
      const endD   = dateFromKey(end);
      let cur = new Date(startD);
      // Limit expansion to 90 days to avoid performance issues
      const limit = Math.min(90, Math.round((endD - startD) / 86400000) + 1);
      for (let i = 0; i < limit; i++) {
        set.add(toKey(cur));
        cur.setDate(cur.getDate() + 1);
      }
    });
    return set;
  }, [bookings]);

  /* Stats */
  const totalBookingsToday = useMemo(
    () => getActiveBookingEntries(bookings, toKey(today)).length,
    [bookings]
  );

  const selectDate = (dateKey) => {
    setSelectedDate(dateKey);
    // Sync week strip to keep selected date visible
    const d = dateFromKey(dateKey);
    setWeekStart(new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay()));
  };

  /* -------------------------------------------------------
     SCHEDULE CRUD
     ------------------------------------------------------- */
  const saveSchedule = async (formData) => {
    try {
      const payload = {
        ...formData,
        date:       formData.start_date || formData.date,
        start_date: formData.start_date || formData.date,
        end_date:   formData.end_date || formData.start_date || formData.date,
      };
      const created = await apiRequest("/api/schedules", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const nextId = created?.id || Math.max(0, ...schedules.map((s) => s.schedule_id || s.id || 0)) + 1;
      const newSchedule = { ...payload, ...created, schedule_id: nextId, id: nextId };
      setSchedules((current) => [...current, newSchedule]);
      selectDate(payload.date);
      setFormOpen(false);
      showToast("Schedule created successfully!");
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to save schedule. Please try again."), "error");
    }
  };

  const deleteSchedule = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await apiRequest(`/api/schedules/${id}`, { method: "DELETE" });
      setSchedules((current) => current.filter((s) => (s.id || s.schedule_id) !== id));
      showToast("Schedule deleted successfully!");
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to delete schedule. Please try again."), "error");
    }
  };

  /* -------------------------------------------------------
     RENDER
     ------------------------------------------------------- */
  return (
    <div className="min-h-full bg-[#F7FBFA] p-3 sm:p-4 lg:p-5">
      {/* PAGE HEADER */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#173F41] sm:text-2xl lg:text-3xl">Schedules</h1>
          <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">Browse every date and view staff, ward, and procedure schedules.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex h-10 sm:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#078E89] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#067A76]"
        >
          <Plus className="h-4 w-4" /> Add Schedule
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
        <Stat icon={CalendarDays} label="Total Schedules"   value={schedules.length} />
        <Stat icon={Users}        label="Active Today"      value={totalBookingsToday + (schedulesByDate[toKey(today)] || []).length} />
        <Stat icon={Stethoscope}  label="Active Bookings"   value={bookings.filter((b) => b.status !== "Cancelled").length} />
        <Stat icon={Clock3}       label="Booked Slots"      value={schedules.filter((s) => s.status === "Booked").length} />
      </div>

      {/* ── WEEK STRIP NAV ── */}
      <DateNavigation
        weekStart={weekStart}
        selectedDate={selectedDate}
        schedulesByDate={schedulesByDate}
        bookingActiveDates={bookingActiveDates}
        onPrevious={() => setWeekStart((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))}
        onNext={() => setWeekStart((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))}
        onSelect={(date) => selectDate(toKey(date))}
      />

      {/* ── CALENDAR ── */}
      <MonthCalendar
        month={calendarMonth}
        selectedDate={selectedDate}
        schedulesByDate={schedulesByDate}
        bookingActiveDates={bookingActiveDates}
        onPrevMonth={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
        onNextMonth={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
        onSelect={selectDate}
      />

      {/* ── SELECTED DATE SCHEDULE ── */}
      <section className="mb-4 rounded-xl sm:rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="border-b border-[#EAF2F1] px-4 py-3.5 sm:py-4">
          <h2 className="text-sm sm:text-base font-bold text-[#173F41]">
            {formatDate(selectedDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </h2>
          <p className="mt-0.5 text-xs text-[#819596]">
            {activeBookingEntries.length > 0
              ? `${activeBookingEntries.length} booking assignment${activeBookingEntries.length === 1 ? "" : "s"}`
              : "No active bookings"}
            {selectedManualSchedules.length > 0
              ? ` · ${selectedManualSchedules.length} manual schedule${selectedManualSchedules.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
        <div className="max-h-[520px] space-y-3 overflow-y-auto p-3.5 sm:p-4">
          {selectedSchedules.map((schedule) => (
            <ScheduleCard key={schedule.schedule_id} schedule={schedule} />
          ))}
          {!selectedSchedules.length && (
            <div className="py-12 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-[#B6C8C7]" />
              <p className="mt-3 text-sm text-[#819596]">No schedules or active bookings for this date.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-4 rounded-xl sm:rounded-2xl border border-[#E2EFED] bg-white p-3.5 sm:p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#173F41]">All Manual Schedules</h2>
            <p className="mt-0.5 text-xs text-[#819596]">{schedules.length} schedule{schedules.length === 1 ? "" : "s"} shown</p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-[#EAF2F1] text-left">
            <thead className="bg-[#F7FBFA] text-xs font-semibold uppercase tracking-wide text-[#6E8081]">
              <tr>
                <th className="px-3 py-3">Date &amp; Time</th>
                <th className="px-3 py-3">Doctor</th>
                <th className="px-3 py-3">Department</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAF2F1]">
              {schedules
                .sort((a, b) => `${a.date}${a.start_time}`.localeCompare(`${b.date}${b.start_time}`))
                .map((schedule) => {
                  const schedId = schedule.id || schedule.schedule_id;
                  return (
                    <tr
                      key={schedId}
                      onClick={() => selectDate(schedule.date)}
                      className="cursor-pointer hover:bg-[#FBFDFC]"
                    >
                      <td className="px-3 py-3">
                        <p className="text-sm font-medium text-[#31585A]">{formatDate(schedule.date)}</p>
                        <p className="mt-0.5 text-xs text-[#819596]">{schedule.start_time} – {schedule.end_time}</p>
                      </td>
                      <td className="px-3 py-3 text-sm text-[#31585A]">{schedule.doctor_name}</td>
                      <td className="px-3 py-3 text-sm text-[#31585A]">{schedule.department}</td>
                      <td className="px-3 py-3 text-sm text-[#31585A]">{schedule.location}</td>
                      <td className="px-3 py-3"><Badge status={schedule.status} /></td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => deleteSchedule(schedId, e)}
                          className="rounded-lg p-1.5 text-[#819596] transition hover:bg-red-50 hover:text-red-600"
                          title="Delete Schedule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!schedules.length && (
            <p className="py-8 text-center text-sm text-[#819596]">No manual schedules added yet.</p>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {schedules
            .sort((a, b) => `${a.date}${a.start_time}`.localeCompare(`${b.date}${b.start_time}`))
            .map((schedule) => {
              const schedId = schedule.id || schedule.schedule_id;
              return (
                <div
                  key={schedId}
                  onClick={() => selectDate(schedule.date)}
                  className="cursor-pointer rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm hover:border-[#08A6A0]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#173F41]">{schedule.doctor_name}</h3>
                      <p className="text-xs text-[#819596]">{schedule.department} · {schedule.type}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge status={schedule.status} />
                      <button
                        type="button"
                        onClick={(e) => deleteSchedule(schedId, e)}
                        className="rounded-lg p-1 text-[#819596] hover:bg-red-50 hover:text-red-600"
                        title="Delete Schedule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-[#507173]">
                    <div className="rounded-lg bg-[#FAFDFC] p-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Time</span>
                      <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{schedule.start_time} – {schedule.end_time}</p>
                    </div>
                    <div className="rounded-lg bg-[#FAFDFC] p-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Date</span>
                      <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{formatDate(schedule.date)}</p>
                    </div>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#507173]">
                    <MapPin className="h-3.5 w-3.5 text-[#08A6A0]" />
                    {schedule.location}
                  </p>
                </div>
              );
            })}
          {!schedules.length && (
            <p className="py-6 text-center text-sm text-[#819596]">No manual schedules added yet.</p>
          )}
        </div>
      </section>

      {formOpen && (
        <ScheduleForm
          selectedDate={selectedDate}
          doctorsList={doctorsList}
          onClose={() => setFormOpen(false)}
          onSubmit={saveSchedule}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-2xl transition-all duration-300 ${
            toast.type === "error" ? "bg-red-600" : "bg-[#08A6A0]"
          }`}
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
};

/* =========================================================
   MONTH CALENDAR
   ========================================================= */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthCalendar = ({
  month,
  selectedDate,
  schedulesByDate,
  bookingActiveDates,
  onPrevMonth,
  onNextMonth,
  onSelect,
}) => {
  const todayKey = toKey(today);

  const firstDay  = month.getDay();           // 0 = Sunday
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  // Fill leading empty cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  }

  const monthLabel = month.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="mb-4 rounded-xl sm:rounded-2xl border border-[#E2EFED] bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAF2F1] px-4 py-3">
        <h2 className="text-sm font-bold text-[#173F41]">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#507173] transition hover:bg-[#E8F8F6] hover:text-[#078E89]"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#507173] transition hover:bg-[#E8F8F6] hover:text-[#078E89]"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        {/* Weekday headers */}
        <div className="mb-1 grid grid-cols-7 text-center">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-[10px] font-bold uppercase tracking-wide text-[#819596]">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} />;

            const key        = toKey(date);
            const isSelected = key === selectedDate;
            const isToday    = key === todayKey;
            const hasManual  = (schedulesByDate[key] || []).length > 0;
            const hasBooking = bookingActiveDates.has(key);

            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className={`
                  relative flex flex-col items-center justify-center rounded-lg
                  py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition
                  ${isSelected
                    ? "bg-[#078E89] text-white shadow-sm"
                    : isToday
                    ? "border border-[#078E89] text-[#078E89]"
                    : "text-[#31585A] hover:bg-[#E8F8F6]"
                  }
                `}
              >
                {date.getDate()}
                {/* indicator dots */}
                {(hasManual || hasBooking) && (
                  <span className="mt-0.5 flex gap-0.5">
                    {hasBooking && (
                      <span
                        className={`h-1 w-1 rounded-full ${
                          isSelected ? "bg-white/80" : "bg-[#08A6A0]"
                        }`}
                      />
                    )}
                    {hasManual && (
                      <span
                        className={`h-1 w-1 rounded-full ${
                          isSelected ? "bg-white/60" : "bg-amber-400"
                        }`}
                      />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 border-t border-[#EAF2F1] pt-2.5 text-[10px] text-[#819596]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#08A6A0]" /> Booking active
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Manual schedule
          </span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DATE NAVIGATION (WEEK STRIP) — unchanged
   ========================================================= */
const DateNavigation = ({ weekStart, selectedDate, schedulesByDate, bookingActiveDates, onPrevious, onNext, onSelect }) => {
  const scrollerRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const dates = Array.from({ length: 14 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i));
  const beginDrag = (e) => { dragRef.current = { active: true, startX: e.pageX, startScroll: scrollerRef.current?.scrollLeft || 0 }; };
  const drag      = (e) => { if (!dragRef.current.active || !scrollerRef.current) return; scrollerRef.current.scrollLeft = dragRef.current.startScroll - (e.pageX - dragRef.current.startX); };
  const stopDrag  = ()  => { dragRef.current.active = false; };

  return (
    <nav aria-label="Schedule date navigation" className="mb-4 rounded-xl border border-[#E2EFED] bg-white p-2 shadow-sm">
      <div className="flex items-center gap-1">
        <button onClick={onPrevious} className="shrink-0 rounded-lg p-2 text-[#507173] hover:bg-[#E8F8F6] hover:text-[#078E89]" aria-label="Previous week">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={scrollerRef}
          onMouseDown={beginDrag} onMouseMove={drag} onMouseUp={stopDrag} onMouseLeave={stopDrag}
          className="flex flex-1 gap-1 overflow-x-auto scroll-smooth select-none cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
        >
          {dates.map((date) => {
            const key      = toKey(date);
            const selected = key === selectedDate;
            const isToday  = key === toKey(today);
            const manualCount  = (schedulesByDate[key] || []).length;
            const hasBookingDot = bookingActiveDates?.has(key);
            const totalCount = manualCount + (hasBookingDot ? 1 : 0);
            return (
              <button
                key={key}
                onClick={() => onSelect(date)}
                className={`min-w-[80px] sm:min-w-[86px] shrink-0 rounded-lg px-2.5 sm:px-3 py-2 text-center transition ${
                  selected ? "bg-[#078E89] text-white shadow-sm" : "text-[#31585A] hover:bg-[#E8F8F6]"
                }`}
              >
                <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wide ${selected ? "text-white/80" : "text-[#819596]"}`}>
                  {date.toLocaleDateString("en-IN", { weekday: "short" })}
                </p>
                <p className={`mt-0.5 text-base sm:text-lg font-bold ${isToday && !selected ? "text-[#078E89]" : ""}`}>
                  {date.getDate()}
                </p>
                <p className={`mt-0.5 text-[9px] sm:text-[10px] font-semibold ${selected ? "text-white/80" : "text-[#819596]"}`}>
                  {totalCount ? `${totalCount} slot${totalCount > 1 ? "s" : ""}` : "No slots"}
                </p>
              </button>
            );
          })}
        </div>
        <button onClick={onNext} className="shrink-0 rounded-lg p-2 text-[#507173] hover:bg-[#E8F8F6] hover:text-[#078E89]" aria-label="Next week">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

/* =========================================================
   SCHEDULE CARD — extended to show patient info for bookings
   ========================================================= */
const ScheduleCard = ({ schedule }) => (
  <article className="rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {schedule._isBooking && (
            <span className="shrink-0 rounded-md bg-[#E8F8F6] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#078E89]">
              Booking
            </span>
          )}
          <p className="truncate font-semibold text-sm text-[#173F41]">{schedule.doctor_name}</p>
        </div>
        {schedule._isBooking && schedule.patient_name && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#507173]">
            <UserRound className="h-3 w-3 shrink-0 text-[#08A6A0]" />
            Patient: <span className="font-semibold text-[#31585A] ml-0.5">{schedule.patient_name}</span>
          </p>
        )}
        <p className="mt-0.5 text-xs text-[#819596]">{schedule.department} · {schedule.type}</p>
        {schedule._isBooking && schedule.booking_number && (
          <p className="mt-0.5 text-[11px] text-[#a4b8b9]">#{schedule.booking_number}</p>
        )}
      </div>
      <Badge status={schedule.status} />
    </div>
    <div className="mt-2.5 space-y-1 text-xs text-[#507173]">
      <p className="flex items-center gap-2">
        <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#08A6A0]" />
        {schedule._isBooking
          ? `Service: ${formatDate(schedule.start_date)} → ${formatDate(schedule.end_date)}`
          : `${schedule.start_time} – ${schedule.end_time}`
        }
      </p>
      {schedule.location && schedule.location !== "—" && (
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#08A6A0]" />
          {schedule.location}
        </p>
      )}
    </div>
  </article>
);

/* =========================================================
   UTILITY COMPONENTS — unchanged
   ========================================================= */
const Stat  = ({ icon: Icon, label, value }) => (
  <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
    <div className="flex items-center justify-between gap-1.5">
      <span className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-[#E8F8F6] [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
        <Icon className="text-[#08A6A0]" />
      </span>
      <span className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">{value}</span>
    </div>
    <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">{label}</p>
  </div>
);

const Badge = ({ status }) => (
  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
    status === "Booked"    ? "bg-[#FFF4E8] text-[#B56A14]" :
    status === "Cancelled" ? "bg-red-50 text-red-600"       :
                             "bg-[#E8F8F6] text-[#078E89]"
  }`}>
    {status}
  </span>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173F41]/40 p-2.5 sm:p-4 md:p-6 backdrop-blur-sm">
    <div className="max-h-[92vh] sm:max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-[#E2EFED] px-4 py-3 sm:px-5 sm:py-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#173F41]">Add Schedule</h2>
          <p className="mt-0.5 text-xs text-[#819596]">Create a doctor, ward, or procedure schedule.</p>
        </div>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-[#819596] hover:bg-[#E8F8F6]">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  </div>
);

const Input  = ({ label, ...props }) => (
  <label className="block text-xs font-semibold text-[#507173]">
    {label}
    <input {...props} className="mt-1 block h-10 sm:h-11 w-full rounded-xl border border-[#DDE9E7] px-3 sm:px-3.5 text-xs sm:text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]" />
  </label>
);

const Select = ({ label, options, ...props }) => (
  <label className="block text-xs font-semibold text-[#507173]">
    {label}
    <select {...props} className="mt-1 block h-10 sm:h-11 w-full rounded-xl border border-[#DDE9E7] bg-white px-3 sm:px-3.5 text-xs sm:text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]">
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  </label>
);

/* =========================================================
   SCHEDULE FORM — unchanged
   ========================================================= */
const ScheduleForm = ({ selectedDate, doctorsList, onClose, onSubmit }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorName,  setDoctorName]  = useState("");
  const [department,  setDepartment]  = useState("");
  const [startDate,   setStartDate]   = useState(selectedDate);
  const [endDate,     setEndDate]     = useState(selectedDate);

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    setSelectedDoctorId(docId);
    const found = doctorsList.find((d) => String(d.id) === docId);
    if (found) {
      setDoctorName(`Dr. ${found.first_name} ${found.last_name || ""}`.trim());
      setDepartment(found.department || "");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    onSubmit({
      ...data,
      doctor_id:  selectedDoctorId ? Number(selectedDoctorId) : null,
      doctor_name: doctorName || data.doctor_name,
      department:  department || data.department,
      start_date:  startDate,
      end_date:    endDate,
      date:        startDate,
    });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleFormSubmit} className="space-y-3.5 sm:space-y-4">
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <Input label="Starting Date" name="start_date" type="date" value={startDate}
            onChange={(e) => { setStartDate(e.target.value); if (!endDate || endDate < e.target.value) setEndDate(e.target.value); }}
            required
          />
          <Input label="Ending Date" name="end_date" type="date" value={endDate} min={startDate}
            onChange={(e) => setEndDate(e.target.value)} required
          />

          {doctorsList && doctorsList.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-[#507173]">
                Select Doctor
                <select value={selectedDoctorId} onChange={handleDoctorChange}
                  className="mt-1 block h-10 sm:h-11 w-full rounded-xl border border-[#DDE9E7] bg-white px-3 sm:px-3.5 text-xs sm:text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]"
                >
                  <option value="">-- Choose registered doctor --</option>
                  {doctorsList.map((doc) => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.first_name} {doc.last_name || ""} ({doc.department || "General"})</option>
                  ))}
                </select>
              </label>
              <input type="hidden" name="doctor_name" value={doctorName} />
            </div>
          ) : (
            <Input label="Doctor Name" name="doctor_name" value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. Name" required
            />
          )}

          <Input label="Department" name="department" value={department}
            onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Cardiology" required
          />
          <Input label="Location" name="location" placeholder="OPD Room / Ward / OT" required />
          <Input label="Start Time" name="start_time" type="time" defaultValue="09:00" required />
          <Input label="End Time"   name="end_time"   type="time" defaultValue="13:00" required />
          <Select label="Schedule Type" name="type"   defaultValue="Consultation" options={["Consultation", "Ward Round", "Surgery", "Procedure"]} />
          <Select label="Status"        name="status" defaultValue="Available"    options={["Available", "Booked"]} />
        </div>
        <div className="flex justify-end gap-2 sm:gap-3 border-t border-[#EAF2F1] pt-3 sm:pt-4">
          <button type="button" onClick={onClose}
            className="h-10 sm:h-11 rounded-xl border border-[#DDE9E7] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-[#31585A]"
          >
            Cancel
          </button>
          <button type="submit"
            className="h-10 sm:h-11 rounded-xl bg-[#078E89] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[#067A76]"
          >
            Save Schedule
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Schedules;
