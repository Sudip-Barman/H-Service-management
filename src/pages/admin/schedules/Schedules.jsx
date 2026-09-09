import { useMemo, useRef, useState } from "react";
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
} from "lucide-react";

const initialSchedules = [
  { schedule_id: 1, date: "2026-09-08", start_time: "09:00", end_time: "13:00", doctor_name: "Dr. Arindam Sen", department: "Cardiology", location: "OPD Room 201", type: "Consultation", status: "Available" },
  { schedule_id: 2, date: "2026-09-08", start_time: "10:00", end_time: "14:00", doctor_name: "Dr. Moumita Roy", department: "Neurology", location: "OPD Room 205", type: "Consultation", status: "Available" },
  { schedule_id: 3, date: "2026-09-09", start_time: "08:00", end_time: "12:00", doctor_name: "Dr. Sourav Mukherjee", department: "Orthopedics", location: "OT 2", type: "Surgery", status: "Booked" },
  { schedule_id: 4, date: "2026-09-09", start_time: "14:00", end_time: "18:00", doctor_name: "Dr. Ananya Das", department: "Dermatology", location: "OPD Room 108", type: "Consultation", status: "Available" },
  { schedule_id: 5, date: "2026-09-11", start_time: "09:00", end_time: "13:00", doctor_name: "Dr. Rajesh Chatterjee", department: "Medicine", location: "General Ward", type: "Ward Round", status: "Available" },
  { schedule_id: 6, date: "2026-09-14", start_time: "10:00", end_time: "15:00", doctor_name: "Dr. Arindam Sen", department: "Cardiology", location: "Cath Lab", type: "Procedure", status: "Booked" },
  { schedule_id: 7, date: "2026-09-18", start_time: "09:00", end_time: "13:00", doctor_name: "Dr. Moumita Roy", department: "Neurology", location: "OPD Room 205", type: "Consultation", status: "Available" },
  { schedule_id: 8, date: "2026-09-22", start_time: "08:00", end_time: "12:00", doctor_name: "Dr. Sourav Mukherjee", department: "Orthopedics", location: "OT 1", type: "Surgery", status: "Booked" },
];

const today = new Date("2026-09-09T00:00:00");
const toKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const dateFromKey = (key) => new Date(`${key}T00:00:00`);
const monthForKey = (key) => {
  const date = dateFromKey(key);
  return new Date(date.getFullYear(), date.getMonth(), 1);
};
const formatDate = (key, options = { day: "numeric", month: "short", year: "numeric" }) =>
  dateFromKey(key).toLocaleDateString("en-IN", options);
const emptySchedule = { schedule_id: null, date: toKey(today), start_time: "09:00", end_time: "13:00", doctor_name: "", department: "", location: "", type: "Consultation", status: "Available" };

const Schedules = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toKey(today));
  const [weekStart, setWeekStart] = useState(() => {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay());
    return start;
  });
  const [formOpen, setFormOpen] = useState(false);

  const schedulesByDate = useMemo(() => schedules.reduce((grouped, schedule) => {
    (grouped[schedule.date] ||= []).push(schedule);
    return grouped;
  }, {}), [schedules]);

  const selectedSchedules = schedulesByDate[selectedDate] || [];
  const visibleSchedules = schedules;

  const selectDate = (date) => { setSelectedDate(toKey(date)); };
  const saveSchedule = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const nextId = Math.max(0, ...schedules.map((schedule) => schedule.schedule_id)) + 1;
    setSchedules((current) => [...current, { ...data, schedule_id: nextId }]);
    setSelectedDate(data.date);
    const scheduleDate = dateFromKey(data.date);
    setWeekStart(new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate() - scheduleDate.getDay()));
    setFormOpen(false);
  };

  return (
    <div className="min-h-full bg-[#F7FBFA] p-3 sm:p-4 lg:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-xl font-bold text-[#173F41] sm:text-2xl">Schedules</h1><p className="mt-1 text-sm text-[#819596]">Browse every date and view doctor, ward, and procedure schedules.</p></div>
        <button onClick={() => setFormOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#078E89] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#067A76]"><Plus className="h-4 w-4" /> Add Schedule</button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat icon={CalendarDays} label="Total Schedules" value={schedules.length} />
        <Stat icon={Users} label="Today's Schedules" value={(schedulesByDate[toKey(today)] || []).length} />
        <Stat icon={Stethoscope} label="Consultations" value={schedules.filter((item) => item.type === "Consultation").length} />
        <Stat icon={Clock3} label="Booked Slots" value={schedules.filter((item) => item.status === "Booked").length} />
      </div>

      <DateNavigation
        weekStart={weekStart}
        selectedDate={selectedDate}
        schedulesByDate={schedulesByDate}
        onPrevious={() => setWeekStart((date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7))}
        onNext={() => setWeekStart((date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7))}
        onSelect={selectDate}
      />

      <div>
        <section className="rounded-xl border border-[#E2EFED] bg-white shadow-sm">
          <div className="border-b border-[#EAF2F1] px-4 py-4"><h2 className="font-bold text-[#173F41]">{formatDate(selectedDate, { weekday: "long", day: "numeric", month: "long" })}</h2><p className="mt-1 text-xs text-[#819596]">{selectedSchedules.length} schedule{selectedSchedules.length === 1 ? "" : "s"} for this date</p></div>
          <div className="max-h-[480px] space-y-3 overflow-y-auto p-4">{selectedSchedules.map((schedule) => <ScheduleCard key={schedule.schedule_id} schedule={schedule} />)}{!selectedSchedules.length && <div className="py-12 text-center"><CalendarDays className="mx-auto h-8 w-8 text-[#B6C8C7]" /><p className="mt-3 text-sm text-[#819596]">No schedules for this date.</p></div>}</div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold text-[#173F41]">All Schedules</h2><p className="mt-0.5 text-xs text-[#819596]">{visibleSchedules.length} schedule{visibleSchedules.length === 1 ? "" : "s"} shown</p></div></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-[#EAF2F1] text-left"><thead className="bg-[#F7FBFA] text-xs font-semibold uppercase tracking-wide text-[#6E8081]"><tr><th className="px-3 py-3">Date & Time</th><th className="px-3 py-3">Doctor</th><th className="px-3 py-3">Department</th><th className="px-3 py-3">Location</th><th className="px-3 py-3">Status</th></tr></thead><tbody className="divide-y divide-[#EAF2F1]">{visibleSchedules.sort((a, b) => `${a.date}${a.start_time}`.localeCompare(`${b.date}${b.start_time}`)).map((schedule) => <tr key={schedule.schedule_id} onClick={() => { setSelectedDate(schedule.date); setCurrentMonth(monthForKey(schedule.date)); }} className="cursor-pointer hover:bg-[#FBFDFC]"><td className="px-3 py-3"><p className="text-sm font-medium text-[#31585A]">{formatDate(schedule.date)}</p><p className="mt-0.5 text-xs text-[#819596]">{schedule.start_time} – {schedule.end_time}</p></td><td className="px-3 py-3 text-sm text-[#31585A]">{schedule.doctor_name}</td><td className="px-3 py-3 text-sm text-[#31585A]">{schedule.department}</td><td className="px-3 py-3 text-sm text-[#31585A]">{schedule.location}</td><td className="px-3 py-3"><Badge status={schedule.status} /></td></tr>)}</tbody></table></div></section>
      {formOpen && <ScheduleForm selectedDate={selectedDate} onClose={() => setFormOpen(false)} onSubmit={saveSchedule} />}
    </div>
  );
};

const DateNavigation = ({ weekStart, selectedDate, schedulesByDate, onPrevious, onNext, onSelect }) => {
  const scrollerRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const dates = Array.from({ length: 14 }, (_, index) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + index));
  const beginDrag = (event) => { dragRef.current = { active: true, startX: event.pageX, startScroll: scrollerRef.current?.scrollLeft || 0 }; };
  const drag = (event) => { if (!dragRef.current.active || !scrollerRef.current) return; scrollerRef.current.scrollLeft = dragRef.current.startScroll - (event.pageX - dragRef.current.startX); };
  const stopDrag = () => { dragRef.current.active = false; };
  return <nav aria-label="Schedule date navigation" className="mb-4 rounded-xl border border-[#E2EFED] bg-white p-2 shadow-sm"><div className="flex items-center gap-1"><button onClick={onPrevious} className="shrink-0 rounded-lg p-2 text-[#507173] hover:bg-[#E8F8F6] hover:text-[#078E89]" aria-label="Previous week"><ChevronLeft className="h-5 w-5" /></button><div ref={scrollerRef} onMouseDown={beginDrag} onMouseMove={drag} onMouseUp={stopDrag} onMouseLeave={stopDrag} className="flex flex-1 gap-1 overflow-x-auto scroll-smooth select-none cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing">{dates.map((date) => { const key = toKey(date); const selected = key === selectedDate; const isToday = key === toKey(today); const count = (schedulesByDate[key] || []).length; return <button key={key} onClick={() => onSelect(date)} className={`min-w-[86px] shrink-0 rounded-lg px-3 py-2 text-center transition ${selected ? "bg-[#078E89] text-white shadow-sm" : "text-[#31585A] hover:bg-[#E8F8F6]"}`}><p className={`text-[10px] font-bold uppercase tracking-wide ${selected ? "text-white/80" : "text-[#819596]"}`}>{date.toLocaleDateString("en-IN", { weekday: "short" })}</p><p className={`mt-0.5 text-lg font-bold ${isToday && !selected ? "text-[#078E89]" : ""}`}>{date.getDate()}</p><p className={`mt-0.5 text-[10px] font-semibold ${selected ? "text-white/80" : "text-[#819596]"}`}>{count ? `${count} schedule${count > 1 ? "s" : ""}` : "No schedules"}</p></button>; })}</div><button onClick={onNext} className="shrink-0 rounded-lg p-2 text-[#507173] hover:bg-[#E8F8F6] hover:text-[#078E89]" aria-label="Next week"><ChevronRight className="h-5 w-5" /></button></div></nav>;
};
const Stat = ({ icon: Icon, label, value }) => <div className="min-w-0 rounded-xl border border-[#E2EFED] bg-white px-3 py-3 shadow-sm"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6]"><Icon className="h-4 w-4 text-[#08A6A0]" /></span><span className="text-xl font-bold text-[#073F42]">{value}</span></div><p className="mt-2 truncate text-xs font-semibold text-[#819596]">{label}</p></div>;
const Badge = ({ status }) => <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status === "Booked" ? "bg-[#FFF4E8] text-[#B56A14]" : "bg-[#E8F8F6] text-[#078E89]"}`}>{status}</span>;
const ScheduleCard = ({ schedule }) => <article className="rounded-lg border border-[#E2EFED] p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#173F41]">{schedule.doctor_name}</p><p className="mt-0.5 text-xs text-[#819596]">{schedule.department} · {schedule.type}</p></div><Badge status={schedule.status} /></div><div className="mt-3 space-y-1.5 text-xs text-[#507173]"><p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-[#08A6A0]" />{schedule.start_time} – {schedule.end_time}</p><p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#08A6A0]" />{schedule.location}</p></div></article>;
const Modal = ({ children, onClose }) => <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173F41]/40 p-4 backdrop-blur-sm"><div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#E2EFED] px-5 py-4"><div><h2 className="text-lg font-bold text-[#173F41]">Add Schedule</h2><p className="mt-1 text-sm text-[#819596]">Create a doctor, ward, or procedure schedule.</p></div><button onClick={onClose} className="rounded-lg p-2 text-[#819596] hover:bg-[#E8F8F6]"><X className="h-4 w-4" /></button></div><div className="p-5">{children}</div></div></div>;
const Input = ({ label, ...props }) => <label className="block text-xs font-semibold text-[#507173]">{label}<input {...props} className="mt-1 block w-full rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]" /></label>;
const Select = ({ label, options, ...props }) => <label className="block text-xs font-semibold text-[#507173]">{label}<select {...props} className="mt-1 block w-full rounded-lg border border-[#DDE9E7] bg-white px-3 py-2 text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
const ScheduleForm = ({ selectedDate, onClose, onSubmit }) => <Modal onClose={onClose}><form onSubmit={onSubmit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Input label="Schedule Date" name="date" type="date" defaultValue={selectedDate} required /><Input label="Doctor Name" name="doctor_name" placeholder="Dr. Name" required /><Input label="Department" name="department" placeholder="e.g. Cardiology" required /><Input label="Location" name="location" placeholder="OPD Room / Ward / OT" required /><Input label="Start Time" name="start_time" type="time" defaultValue="09:00" required /><Input label="End Time" name="end_time" type="time" defaultValue="13:00" required /><Select label="Schedule Type" name="type" defaultValue="Consultation" options={["Consultation", "Ward Round", "Surgery", "Procedure"]} /><Select label="Status" name="status" defaultValue="Available" options={["Available", "Booked"]} /></div><div className="flex justify-end gap-2 border-t border-[#EAF2F1] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#DDE9E7] px-4 py-2 text-sm font-semibold text-[#31585A]">Cancel</button><button className="rounded-lg bg-[#078E89] px-4 py-2 text-sm font-semibold text-white hover:bg-[#067A76]">Save Schedule</button></div></form></Modal>;

export default Schedules;
