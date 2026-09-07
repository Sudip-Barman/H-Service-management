import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

/* =========================
   INITIAL ATTENDANCE DATA
========================= */

const initialAttendance = [
  {
    id: "EMP-1001",
    name: "Dr. Arindam Sen",
    role: "Doctor",
    department: "General Medicine",
    date: "2026-09-07",
    checkIn: "08:52 AM",
    checkOut: "05:04 PM",
    shift: "09:00 AM - 05:00 PM",
    status: "Present",
    workHours: "8h 12m",
    phone: "+91 98765 12001",
    email: "arindam.sen@carecore.com",
    address: "Salt Lake, Kolkata",
  },
  {
    id: "EMP-1002",
    name: "Suman Roy",
    role: "GNM Nurse",
    department: "Nursing",
    date: "2026-09-07",
    checkIn: "07:55 AM",
    checkOut: "08:03 PM",
    shift: "08:00 AM - 08:00 PM",
    status: "Present",
    workHours: "12h 08m",
    phone: "+91 98765 12002",
    email: "suman.roy@carecore.com",
    address: "Howrah, West Bengal",
  },
  {
    id: "EMP-1003",
    name: "Anita Roy",
    role: "Elder Caregiver",
    department: "Patient Care",
    date: "2026-09-07",
    checkIn: "08:10 AM",
    checkOut: "08:15 PM",
    shift: "08:00 AM - 08:00 PM",
    status: "Late",
    workHours: "12h 05m",
    phone: "+91 98765 12003",
    email: "anita.roy@carecore.com",
    address: "Dum Dum, Kolkata",
  },
  {
    id: "EMP-1004",
    name: "Mita Das",
    role: "Baby Caretaker",
    department: "Child Care",
    date: "2026-09-07",
    checkIn: "09:58 AM",
    checkOut: "06:02 PM",
    shift: "10:00 AM - 06:00 PM",
    status: "Present",
    workHours: "8h 04m",
    phone: "+91 98765 12004",
    email: "mita.das@carecore.com",
    address: "New Town, Kolkata",
  },
  {
    id: "EMP-1005",
    name: "Rahul Ghosh",
    role: "ICU Nurse",
    department: "ICU",
    date: "2026-09-07",
    checkIn: "--",
    checkOut: "--",
    shift: "Night Shift",
    status: "On Leave",
    workHours: "0h",
    phone: "+91 98765 12005",
    email: "rahul.ghosh@carecore.com",
    address: "Ballygunge, Kolkata",
  },
  {
    id: "EMP-1006",
    name: "Priyanka Paul",
    role: "ANM Nurse",
    department: "Community Nursing",
    date: "2026-09-07",
    checkIn: "07:58 AM",
    checkOut: "04:02 PM",
    shift: "08:00 AM - 04:00 PM",
    status: "Present",
    workHours: "8h 04m",
    phone: "+91 98765 12006",
    email: "priyanka.paul@carecore.com",
    address: "Barasat, West Bengal",
  },
  {
    id: "EMP-1007",
    name: "Vikash Kumar",
    role: "Male Attendant",
    department: "Patient Care",
    date: "2026-09-07",
    checkIn: "--",
    checkOut: "--",
    shift: "08:00 AM - 08:00 PM",
    status: "Absent",
    workHours: "0h",
    phone: "+91 98765 12007",
    email: "vikash.kumar@carecore.com",
    address: "Behala, Kolkata",
  },
  {
    id: "EMP-1008",
    name: "Riya Mukherjee",
    role: "Receptionist",
    department: "Reception",
    date: "2026-09-07",
    checkIn: "09:02 AM",
    checkOut: "05:01 PM",
    shift: "09:00 AM - 05:00 PM",
    status: "Present",
    workHours: "7h 59m",
    phone: "+91 98765 12008",
    email: "riya.m@carecore.com",
    address: "Kestopur, Kolkata",
  },
];

/* =========================
   OPTIONS
========================= */

const statusOptions = [
  "All",
  "Present",
  "Late",
  "Absent",
  "On Leave",
];

const departmentOptions = [
  "All",
  "General Medicine",
  "Nursing",
  "Patient Care",
  "Child Care",
  "ICU",
  "Community Nursing",
  "Reception",
];

/* =========================
   STATUS STYLES
========================= */

const statusStyles = {
  Present:
    "bg-emerald-50 text-emerald-700 border-emerald-100",

  Late:
    "bg-amber-50 text-amber-700 border-amber-100",

  Absent:
    "bg-red-50 text-red-700 border-red-100",

  "On Leave":
    "bg-blue-50 text-blue-700 border-blue-100",
};

/* =========================
   MAIN COMPONENT
========================= */

const Attendance = () => {
  const [attendance, setAttendance] =
    useState(initialAttendance);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [selectedDate, setSelectedDate] =
    useState("2026-09-07");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const stats = useMemo(() => {
    const total = attendance.length;

    const present = attendance.filter(
      (member) => member.status === "Present"
    ).length;

    const late = attendance.filter(
      (member) => member.status === "Late"
    ).length;

    const absent = attendance.filter(
      (member) => member.status === "Absent"
    ).length;

    const leave = attendance.filter(
      (member) => member.status === "On Leave"
    ).length;

    return {
      total,
      present,
      late,
      absent,
      leave,
    };
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    const query = search.toLowerCase().trim();

    return attendance.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.id.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        member.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        member.department === departmentFilter;

      const matchesDate =
        member.date === selectedDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment &&
        matchesDate
      );
    });
  }, [
    attendance,
    search,
    statusFilter,
    departmentFilter,
    selectedDate,
  ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
            WORKFORCE MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">
            Attendance Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#789092]">
            Monitor daily staff attendance, working hours,
            late arrivals, absences and leave records.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white shadow-lg shadow-[#08A6A0]/15 transition hover:bg-[#078F8A]"
        >
          <Download className="h-4 w-4" />
          Export Attendance
        </button>
      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          icon={Users}
          label="Total Staff"
          value={stats.total}
        />

        <StatCard
          icon={UserCheck}
          label="Present"
          value={stats.present}
        />

        <StatCard
          icon={Clock3}
          label="Late"
          value={stats.late}
        />

        <StatCard
          icon={UserX}
          label="Absent"
          value={stats.absent}
        />

        <StatCard
          icon={CalendarDays}
          label="On Leave"
          value={stats.leave}
        />
      </div>

      {/* =========================
          DATE / SEARCH / FILTER
      ========================= */}

      <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row">
          {/* Date */}

          <div className="relative w-full xl:w-52">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

            <input
              type="date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-10 pr-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          {/* Search */}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, employee ID, role..."
              className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-10 pr-4 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          {/* Filter Button */}

          <button
            type="button"
            onClick={() =>
              setShowFilters((value) => !value)
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-[#EAF2F0] pt-4 md:grid-cols-2">
            <FilterSelect
              label="Attendance Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />

            <FilterSelect
              label="Department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              options={departmentOptions}
            />
          </div>
        )}
      </div>

      {/* =========================
          ATTENDANCE TABLE
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#EAF2F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-[#073F42]">
              Daily Attendance
            </h2>

            <p className="mt-1 text-xs text-[#819596]">
              {filteredAttendance.length} staff member
              {filteredAttendance.length !== 1
                ? "s"
                : ""}{" "}
              found for {formatDisplayDate(selectedDate)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#819596]">
            <span className="h-2 w-2 rounded-full bg-[#08A6A0]" />
            Attendance records
          </div>
        </div>

        {filteredAttendance.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <>
            {/* Desktop */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1150px]">
                <thead>
                  <tr className="border-b border-[#EAF2F0] bg-[#FAFDFC] text-left">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Employee
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Department
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Shift
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Check In
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Check Out
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Work Hours
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendance.map((member) => (
                    <AttendanceRow
                      key={member.id}
                      member={member}
                      onView={() =>
                        setSelectedEmployee(member)
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="divide-y divide-[#EAF2F0] lg:hidden">
              {filteredAttendance.map((member) => (
                <AttendanceMobileCard
                  key={member.id}
                  member={member}
                  onView={() =>
                    setSelectedEmployee(member)
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* =========================
          DETAILS MODAL
      ========================= */}

      {selectedEmployee && (
        <AttendanceDetails
          member={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

/* =========================
   STAT CARD
========================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6]">
          <Icon className="h-5 w-5 text-[#08A6A0]" />
        </div>

        <span className="text-2xl font-bold text-[#073F42]">
          {value}
        </span>
      </div>

      <p className="mt-3 text-xs font-semibold text-[#819596]">
        {label}
      </p>
    </div>
  );
};

/* =========================
   FILTER SELECT
========================= */

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

/* =========================
   DESKTOP ROW
========================= */

const AttendanceRow = ({
  member,
  onView,
}) => {
  return (
    <tr className="border-b border-[#EAF2F0] last:border-0 hover:bg-[#FAFDFC]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <StaffAvatar name={member.name} />

          <div>
            <p className="text-sm font-bold text-[#173F41]">
              {member.name}
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              {member.id} · {member.role}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {member.department}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {member.shift}
        </p>
      </td>

      <td className="px-5 py-4">
        <TimeValue value={member.checkIn} />
      </td>

      <td className="px-5 py-4">
        <TimeValue value={member.checkOut} />
      </td>

      <td className="px-5 py-4">
        <span className="text-sm font-bold text-[#31585A]">
          {member.workHours}
        </span>
      </td>

      <td className="px-5 py-4">
        <AttendanceStatus status={member.status} />
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onView}
            title="View attendance"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* =========================
   MOBILE CARD
========================= */

const AttendanceMobileCard = ({
  member,
  onView,
}) => {
  return (
    <button
      type="button"
      onClick={onView}
      className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-[#FAFDFC]"
    >
      <StaffAvatar name={member.name} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="truncate text-sm font-bold text-[#173F41]">
              {member.name}
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              {member.id} · {member.role}
            </p>
          </div>

          <AttendanceStatus
            status={member.status}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <SmallInfo
            label="Check In"
            value={member.checkIn}
          />

          <SmallInfo
            label="Check Out"
            value={member.checkOut}
          />

          <SmallInfo
            label="Work Hours"
            value={member.workHours}
          />

          <SmallInfo
            label="Department"
            value={member.department}
          />
        </div>
      </div>
    </button>
  );
};

/* =========================
   AVATAR
========================= */

const StaffAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-sm font-bold text-[#087F7A]">
      {initials}
    </div>
  );
};

/* =========================
   STATUS
========================= */

const AttendanceStatus = ({ status }) => {
  const style =
    statusStyles[status] ||
    "border-gray-100 bg-gray-50 text-gray-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status === "Present" && (
        <CheckCircle2 className="h-3.5 w-3.5" />
      )}

      {status === "Absent" && (
        <UserX className="h-3.5 w-3.5" />
      )}

      {status === "Late" && (
        <Clock3 className="h-3.5 w-3.5" />
      )}

      {status === "On Leave" && (
        <CalendarDays className="h-3.5 w-3.5" />
      )}

      {status}
    </span>
  );
};

/* =========================
   TIME VALUE
========================= */

const TimeValue = ({ value }) => {
  if (value === "--") {
    return (
      <span className="text-sm font-medium text-[#A2B2B3]">
        Not recorded
      </span>
    );
  }

  return (
    <span className="text-sm font-semibold text-[#31585A]">
      {value}
    </span>
  );
};

/* =========================
   SMALL INFO
========================= */

const SmallInfo = ({
  label,
  value,
}) => {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#9AAEAF]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* =========================
   ATTENDANCE DETAILS
========================= */

const AttendanceDetails = ({
  member,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#073F42]/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}

          <div className="bg-[#073F42] p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-lg font-bold">
                    {member.name}
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    {member.id} · {member.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}

          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <AttendanceStatus
                status={member.status}
              />

              <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#087F7A]">
                {formatDisplayDate(member.date)}
              </span>
            </div>

            {/* Attendance Summary */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem
                icon={CalendarDays}
                label="Attendance Date"
                value={formatDisplayDate(
                  member.date
                )}
              />

              <DetailItem
                icon={Clock3}
                label="Shift"
                value={member.shift}
              />

              <DetailItem
                icon={UserCheck}
                label="Check In"
                value={member.checkIn}
              />

              <DetailItem
                icon={Clock3}
                label="Work Hours"
                value={member.workHours}
              />
            </div>

            {/* Work Information */}

            <section>
              <SectionTitle title="Work Information" />

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <InfoBox
                  label="Department"
                  value={member.department}
                />

                <InfoBox
                  label="Check Out"
                  value={member.checkOut}
                />
              </div>
            </section>

            {/* Contact */}

            <section>
              <SectionTitle title="Employee Information" />

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <ContactBox
                  icon={Phone}
                  label="Phone"
                  value={member.phone}
                />

                <ContactBox
                  icon={Mail}
                  label="Email"
                  value={member.email}
                />

                <ContactBox
                  icon={MapPin}
                  label="Address"
                  value={member.address}
                />
              </div>
            </section>

            {/* Actions */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EAF2F0] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl border border-[#D9E9E7] px-5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
              >
                Close
              </button>

              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                <CalendarDays className="h-4 w-4" />
                View Monthly Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   DETAIL ITEM
========================= */

const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-3">
      <Icon className="h-4 w-4 text-[#08A6A0]" />

      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#9AAEAF]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* =========================
   CONTACT BOX
========================= */

const ContactBox = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
      <Icon className="h-4 w-4 text-[#08A6A0]" />

      <p className="mt-2 text-xs font-semibold text-[#819596]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* =========================
   INFO BOX
========================= */

const InfoBox = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
      <p className="text-xs font-semibold text-[#819596]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* =========================
   SECTION TITLE
========================= */

const SectionTitle = ({ title }) => {
  return (
    <h3 className="text-sm font-bold text-[#073F42]">
      {title}
    </h3>
  );
};

/* =========================
   EMPTY STATE
========================= */

const EmptyState = ({ onClear }) => {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6]">
        <CalendarDays className="h-6 w-6 text-[#08A6A0]" />
      </div>

      <h3 className="mt-4 font-bold text-[#073F42]">
        No attendance records found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#819596]">
        No attendance records match the selected
        date, search or filters. Try changing your
        criteria.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 text-sm font-semibold text-[#08A6A0] hover:text-[#078F8A]"
      >
        Clear filters
      </button>
    </div>
  );
};

/* =========================
   DATE FORMAT
========================= */

const formatDisplayDate = (date) => {
  if (!date) return "--";

  const parsedDate = new Date(
    `${date}T00:00:00`
  );

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default Attendance;
