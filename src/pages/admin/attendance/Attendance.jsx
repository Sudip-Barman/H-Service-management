import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  Filter,
  Lock,
  Pencil,
  Search,
  UserCheck,
  Users,
  X,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| MASTER STAFF LIST
|--------------------------------------------------------------------------
| Complete list of doctors and staff who should appear every day.
|--------------------------------------------------------------------------
*/

const staffList = [
  {
    id: "EMP-1001",
    name: "Dr. Arindam Sen",
    role: "Doctor",
    department: "General Medicine",
    shift: "09:00 AM - 05:00 PM",
    phone: "+91 98765 12001",
    email: "arindam.sen@carecore.com",
  },
  {
    id: "EMP-1002",
    name: "Suman Roy",
    role: "GNM Nurse",
    department: "Nursing",
    shift: "08:00 AM - 08:00 PM",
    phone: "+91 98765 12002",
    email: "suman.roy@carecore.com",
  },
  {
    id: "EMP-1003",
    name: "Anita Roy",
    role: "Elder Caregiver",
    department: "Patient Care",
    shift: "08:00 AM - 08:00 PM",
    phone: "+91 98765 12003",
    email: "anita.roy@carecore.com",
  },
  {
    id: "EMP-1004",
    name: "Mita Das",
    role: "Baby Caretaker",
    department: "Child Care",
    shift: "10:00 AM - 06:00 PM",
    phone: "+91 98765 12004",
    email: "mita.das@carecore.com",
  },
  {
    id: "EMP-1005",
    name: "Rahul Ghosh",
    role: "ICU Nurse",
    department: "ICU",
    shift: "Night Shift",
    phone: "+91 98765 12005",
    email: "rahul.ghosh@carecore.com",
  },
  {
    id: "EMP-1006",
    name: "Priyanka Paul",
    role: "ANM Nurse",
    department: "Community Nursing",
    shift: "08:00 AM - 04:00 PM",
    phone: "+91 98765 12006",
    email: "priyanka.paul@carecore.com",
  },
  {
    id: "EMP-1007",
    name: "Vikash Kumar",
    role: "Male Attendant",
    department: "Patient Care",
    shift: "08:00 AM - 08:00 PM",
    phone: "+91 98765 12007",
    email: "vikash.kumar@carecore.com",
  },
  {
    id: "EMP-1008",
    name: "Riya Mukherjee",
    role: "Receptionist",
    department: "Reception",
    shift: "09:00 AM - 05:00 PM",
    phone: "+91 98765 12008",
    email: "riya.m@carecore.com",
  },
];

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
  },
];

const statusOptions = [
  "All",
  "Not Marked",
  "Present",
  "Half Day",
  "Late",
  "Absent",
  "On Leave",
];

const statusStyles = {
  "Not Marked":
    "bg-gray-50 text-gray-600 border-gray-200",
  Present:
    "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Half Day":
    "bg-amber-50 text-amber-700 border-amber-100",
  Late:
    "bg-orange-50 text-orange-700 border-orange-100",
  Absent:
    "bg-red-50 text-red-700 border-red-100",
  "On Leave":
    "bg-blue-50 text-blue-700 border-blue-100",
};

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "—";

const formatTime = (value) => {
  if (!value) return "--";

  const [hour, minute] = value.split(":").map(Number);

  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};

const toTimeInput = (value) => {
  if (!value || value === "--") return "";

  const match = value.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );

  if (!match) return "";

  const hour =
    (Number(match[1]) % 12) +
    (match[3].toUpperCase() === "PM" ? 12 : 0);

  return `${String(hour).padStart(2, "0")}:${match[2]}`;
};

const calculateWorkHours = (checkIn, checkOut) => {
  if (!checkIn) return "0h";
  if (!checkOut) return "In progress";

  const [startHour, startMinute] = checkIn.split(":").map(Number);
  const [endHour, endMinute] = checkOut.split(":").map(Number);

  let total =
    endHour * 60 +
    endMinute -
    startHour * 60 -
    startMinute;

  if (total < 0) {
    total += 24 * 60;
  }

  return `${Math.floor(total / 60)}h ${String(
    total % 60
  ).padStart(2, "0")}m`;
};

const escapeCsvValue = (value) => {
  const stringValue = String(value ?? "");

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const exportAttendanceCsv = (records, selectedDate) => {
  if (!records.length) return;

  const headers = [
    "Date",
    "Employee ID",
    "Name",
    "Role",
    "Department",
    "Shift",
    "Check In",
    "Check Out",
    "Work Hours",
    "Status",
  ];

  const rows = records.map((member) => [
    formatDate(member.date),
    member.id,
    member.name,
    member.role,
    member.department,
    member.shift,
    member.checkIn,
    member.checkOut,
    member.workHours,
    member.status,
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      row.map(escapeCsvValue).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `attendance-${selectedDate}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const Attendance = () => {
  const today = getToday();

  const [attendance, setAttendance] =
    useState(initialAttendance);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [timeEditorMember, setTimeEditorMember] =
    useState(null);

  const isCurrentDate = selectedDate === today;
  const isPastDate = selectedDate < today;
  const isDateEditable = isCurrentDate;

  const dateAttendance = useMemo(() => {
    if (isCurrentDate) {
      return staffList.map((staff) => {
        const existingRecord = attendance.find(
          (record) =>
            record.id === staff.id &&
            record.date === today
        );

        if (existingRecord) {
          return existingRecord;
        }

        return {
          ...staff,
          date: today,
          checkIn: "--",
          checkOut: "--",
          status: "Not Marked",
          workHours: "0h",
        };
      });
    }

    return attendance.filter(
      (member) => member.date === selectedDate
    );
  }, [
    attendance,
    isCurrentDate,
    selectedDate,
    today,
  ]);

  const departments = useMemo(() => {
    const values = isCurrentDate
      ? staffList.map((member) => member.department)
      : attendance.map((member) => member.department);

    return ["All", ...new Set(values)];
  }, [attendance, isCurrentDate]);

  const stats = useMemo(
    () => ({
      total: dateAttendance.length,

      present: dateAttendance.filter(
        (member) => member.status === "Present"
      ).length,

      halfDay: dateAttendance.filter(
        (member) => member.status === "Half Day"
      ).length,

      leave: dateAttendance.filter(
        (member) => member.status === "On Leave"
      ).length,

      notMarked: dateAttendance.filter(
        (member) => member.status === "Not Marked"
      ).length,
    }),
    [dateAttendance]
  );

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return dateAttendance.filter((member) => {
      const matchesSearch =
        !query ||
        [
          member.name,
          member.id,
          member.role,
          member.department,
        ].some((value) =>
          value.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" ||
        member.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        member.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [
    dateAttendance,
    departmentFilter,
    search,
    statusFilter,
  ]);

  const changeDate = (days) => {
    const currentDate = new Date(
      `${selectedDate}T00:00:00`
    );

    currentDate.setDate(
      currentDate.getDate() + days
    );

    const newDate = getDateString(currentDate);

    if (newDate > today) return;

    setSelectedDate(newDate);
    setSelectedEmployee(null);
    setTimeEditorMember(null);
  };

  const goToToday = () => {
    setSelectedDate(today);
    setSelectedEmployee(null);
    setTimeEditorMember(null);
  };

  const setAttendanceStatus = (member, status) => {
    if (member.date !== today) return;

    const values =
      status === "Present"
        ? {
            checkIn: "09:00 AM",
            checkOut: "--",
            workHours: "In progress",
          }
        : status === "Half Day"
        ? {
            checkIn: "09:00 AM",
            checkOut: "01:00 PM",
            workHours: "4h 00m",
          }
        : status === "On Leave"
        ? {
            checkIn: "--",
            checkOut: "--",
            workHours: "0h",
          }
        : {
            checkIn: "--",
            checkOut: "--",
            workHours: "0h",
          };

    const updated = {
      ...member,
      status,
      ...values,
      date: today,
    };

    setAttendance((current) => {
      const existingIndex = current.findIndex(
        (item) =>
          item.id === member.id &&
          item.date === today
      );

      if (existingIndex === -1) {
        return [...current, updated];
      }

      return current.map((item, index) =>
        index === existingIndex ? updated : item
      );
    });

    setSelectedEmployee((current) =>
      current?.id === member.id &&
      current?.date === today
        ? updated
        : current
    );

    setTimeEditorMember((current) =>
      current?.id === member.id &&
      current?.date === today
        ? updated
        : current
    );
  };

  const saveTimes = (event) => {
    event.preventDefault();

    if (!timeEditorMember) return;

    if (timeEditorMember.date !== today) {
      setTimeEditorMember(null);
      return;
    }

    const data = Object.fromEntries(
      new FormData(event.currentTarget)
    );

    const checkIn = data.checkIn;
    const checkOut = data.checkOut;

    const updated = {
      ...timeEditorMember,
      checkIn: formatTime(checkIn),
      checkOut: checkOut
        ? formatTime(checkOut)
        : "--",

      workHours: calculateWorkHours(
        checkIn,
        checkOut
      ),

      status: [
        "On Leave",
        "Absent",
        "Not Marked",
      ].includes(timeEditorMember.status)
        ? "Present"
        : timeEditorMember.status,
    };

    setAttendance((current) => {
      const existingIndex = current.findIndex(
        (item) =>
          item.id === updated.id &&
          item.date === today
      );

      if (existingIndex === -1) {
        return [...current, updated];
      }

      return current.map((item, index) =>
        index === existingIndex ? updated : item
      );
    });

    setSelectedEmployee((current) =>
      current?.id === updated.id &&
      current?.date === updated.date
        ? updated
        : current
    );

    setTimeEditorMember(null);
  };

  const handleExport = () => {
    exportAttendanceCsv(
      dateAttendance,
      selectedDate
    );
  };

  return (
    <div className="min-h-full bg-[#F7FBFA] p-3 sm:p-4 lg:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
            Workforce Management
          </p>

          <h1 className="mt-1 text-xl font-bold text-[#173F41] sm:text-2xl">
            Attendance Management
          </h1>

          <p className="mt-1 text-sm text-[#819596]">
            Mark daily attendance directly from the staff list.
          </p>
        </div>

        <div className="rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-semibold text-[#078E89]">
          One-click attendance marking
        </div>
      </div>

      {/* Date Navigation */}
      <div className="mb-4 rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
              Attendance Date
            </p>

            <div className="mt-1 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#078E89]" />

              <h2 className="text-base font-bold text-[#173F41]">
                {formatDate(selectedDate)}
              </h2>
            </div>

            <p className="mt-1 text-xs text-[#819596]">
              {isCurrentDate
                ? "Today's attendance can be modified."
                : "This attendance date is frozen and read-only."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => changeDate(-1)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm font-semibold text-[#31585A] transition hover:bg-[#F2FAF9]"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={goToToday}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isCurrentDate
                  ? "bg-[#078E89] text-white"
                  : "border border-[#DDE9E7] bg-white text-[#31585A] hover:bg-[#F2FAF9]"
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => changeDate(1)}
              disabled={isCurrentDate}
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isCurrentDate
                  ? "cursor-not-allowed border-[#EAF2F1] bg-[#F7FBFA] text-[#B6C8C7]"
                  : "border-[#DDE9E7] text-[#31585A] hover:bg-[#F2FAF9]"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>

            {!isCurrentDate && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F3F6F6] px-3 py-2 text-xs font-semibold text-[#819596]">
                <Lock className="h-3.5 w-3.5" />
                Read Only
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <Stat
          icon={Users}
          label="Total Staff"
          value={stats.total}
        />

        <Stat
          icon={UserCheck}
          label="Present"
          value={stats.present}
        />

        <Stat
          icon={Clock3}
          label="Half Day"
          value={stats.halfDay}
        />

        <Stat
          icon={CalendarDays}
          label="On Leave"
          value={stats.leave}
        />

        <Stat
          icon={Clock3}
          label="Not Marked"
          value={stats.notMarked}
        />
      </div>

      {/* Search / Filters / Export */}
      <div className="mb-4 rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2 lg:flex-row">
          <label className="relative lg:w-48">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

            <input
              type="date"
              value={selectedDate}
              max={today}
              onChange={(event) => {
                const value = event.target.value;

                if (value > today) return;

                setSelectedDate(value);
                setSelectedEmployee(null);
                setTimeEditorMember(null);
              }}
              className="w-full rounded-lg border border-[#DDE9E7] py-2.5 pl-9 pr-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
            />
          </label>

          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search staff by name, ID, role or department..."
              className="w-full rounded-lg border border-[#DDE9E7] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#08A6A0]"
            />
          </label>

          <button
            type="button"
            onClick={() =>
              setShowFilters((open) => !open)
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDE9E7] px-4 py-2.5 text-sm font-semibold text-[#31585A] hover:bg-[#F2FAF9]"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={!dateAttendance.length}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#078E89] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#067A76] disabled:cursor-not-allowed disabled:bg-[#AFC9C7]"
          >
            <Download className="h-4 w-4" />
            Export Attendance
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 grid gap-3 border-t border-[#EAF2F1] pt-3 sm:grid-cols-2">
            <Select
              label="Status"
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
            />

            <Select
              label="Department"
              value={departmentFilter}
              options={departments}
              onChange={setDepartmentFilter}
            />
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <section className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#EAF2F1] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[#173F41]">
                Daily Attendance
              </h2>

              {isPastDate && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F6F6] px-2 py-1 text-[10px] font-bold text-[#819596]">
                  <Lock className="h-3 w-3" />
                  FROZEN
                </span>
              )}

              {isCurrentDate && (
                <span className="rounded-full bg-[#E8F8F6] px-2 py-1 text-[10px] font-bold text-[#078E89]">
                  TODAY
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-[#819596]">
              Showing {filteredAttendance.length} of{" "}
              {dateAttendance.length} staff members for{" "}
              {formatDate(selectedDate)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="hidden text-xs font-semibold text-[#819596] sm:block">
              {isCurrentDate
                ? "Click a status to mark attendance"
                : "Historical attendance is read-only"}
            </p>

            {isPastDate && (
              <Lock className="h-4 w-4 text-[#819596]" />
            )}
          </div>
        </div>

        {filteredAttendance.length ? (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full table-fixed text-left">
                <thead className="bg-[#F7FBFA] text-[11px] font-semibold uppercase tracking-wide text-[#6E8081]">
                  <tr>
                    <th className="w-[22%] px-3 py-2.5">
                      Employee
                    </th>

                    <th className="w-[13%] px-3 py-2.5">
                      Department
                    </th>

                    <th className="w-[14%] px-3 py-2.5">
                      Shift
                    </th>

                    <th className="w-[11%] px-3 py-2.5">
                      Check In / Out
                    </th>

                    <th className="w-[8%] px-3 py-2.5">
                      Hours
                    </th>

                    <th className="w-[10%] px-3 py-2.5">
                      Status
                    </th>

                    <th className="w-[22%] px-3 py-2.5 text-right">
                      Mark Attendance
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EAF2F1]">
                  {filteredAttendance.map((member) => (
                    <AttendanceRow
                      key={`${member.id}-${member.date}`}
                      member={member}
                      isEditable={isDateEditable}
                      onView={() =>
                        setSelectedEmployee(member)
                      }
                      onMark={setAttendanceStatus}
                      onEditTime={() =>
                        setTimeEditorMember(member)
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-[#EAF2F1] lg:hidden">
              {filteredAttendance.map((member) => (
                <MobileCard
                  key={`${member.id}-${member.date}`}
                  member={member}
                  isEditable={isDateEditable}
                  onView={() =>
                    setSelectedEmployee(member)
                  }
                  onMark={setAttendanceStatus}
                  onEditTime={() =>
                    setTimeEditorMember(member)
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Details Modal */}
      {selectedEmployee && (
        <Details
          member={selectedEmployee}
          isEditable={
            selectedEmployee.date === today
          }
          onClose={() =>
            setSelectedEmployee(null)
          }
          onMark={setAttendanceStatus}
          onEditTime={() =>
            setTimeEditorMember(selectedEmployee)
          }
        />
      )}

      {/* Time Editor */}
      {timeEditorMember && (
        <TimeEditor
          member={timeEditorMember}
          onClose={() =>
            setTimeEditorMember(null)
          }
          onSave={saveTimes}
        />
      )}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

const Stat = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="rounded-xl border border-[#E2EFED] bg-white px-3 py-3 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6]">
        <Icon className="h-4 w-4 text-[#08A6A0]" />
      </span>

      <strong className="text-xl text-[#073F42]">
        {value}
      </strong>
    </div>

    <p className="mt-2 text-xs font-semibold text-[#819596]">
      {label}
    </p>
  </div>
);

/*
|--------------------------------------------------------------------------
| SELECT
|--------------------------------------------------------------------------
*/

const Select = ({
  label,
  value,
  options,
  onChange,
}) => (
  <label className="text-xs font-semibold text-[#507173]">
    {label}

    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="mt-1 block w-full rounded-lg border border-[#DDE9E7] bg-white px-3 py-2 text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </label>
);

/*
|--------------------------------------------------------------------------
| ATTENDANCE STATUS
|--------------------------------------------------------------------------
*/

const AttendanceStatus = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${
      statusStyles[status] ||
      "border-gray-100 bg-gray-50 text-gray-700"
    }`}
  >
    {status === "Present" && (
      <CheckCircle2 className="h-3 w-3" />
    )}

    {status === "Half Day" && (
      <Clock3 className="h-3 w-3" />
    )}

    {status === "On Leave" && (
      <CalendarDays className="h-3 w-3" />
    )}

    {status === "Not Marked" && (
      <Clock3 className="h-3 w-3" />
    )}

    {status}
  </span>
);

/*
|--------------------------------------------------------------------------
| AVATAR
|--------------------------------------------------------------------------
*/

const Avatar = ({ name }) => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[11px] font-bold text-[#078E89]">
    {name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")}
  </span>
);

/*
|--------------------------------------------------------------------------
| MARK BUTTONS
|--------------------------------------------------------------------------
*/

const MarkButtons = ({
  member,
  onMark,
  disabled = false,
}) => (
  <div
    className={`inline-flex overflow-hidden rounded-md border border-[#DDE9E7] bg-white text-[10px] font-semibold ${
      disabled ? "opacity-60" : ""
    }`}
  >
    <MarkButton
      active={member.status === "Present"}
      label="Present"
      tone="present"
      disabled={disabled}
      onClick={() =>
        onMark(member, "Present")
      }
    />

    <MarkButton
      active={member.status === "Half Day"}
      label="Half Day"
      tone="half"
      disabled={disabled}
      onClick={() =>
        onMark(member, "Half Day")
      }
    />

    <MarkButton
      active={member.status === "On Leave"}
      label="Leave"
      tone="leave"
      disabled={disabled}
      onClick={() =>
        onMark(member, "On Leave")
      }
    />
  </div>
);

/*
|--------------------------------------------------------------------------
| MARK BUTTON
|--------------------------------------------------------------------------
*/

const MarkButton = ({
  active,
  label,
  tone,
  onClick,
  disabled,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`border-r border-[#DDE9E7] px-2 py-1.5 last:border-r-0 transition ${
      disabled
        ? "cursor-not-allowed text-[#A8B9B8]"
        : active
        ? tone === "present"
          ? "bg-[#078E89] text-white"
          : tone === "half"
          ? "bg-[#D99A00] text-white"
          : "bg-[#3778C2] text-white"
        : "text-[#507173] hover:bg-[#F2FAF9]"
    }`}
  >
    {active && (
      <Check className="mr-0.5 inline h-2.5 w-2.5" />
    )}

    {label}
  </button>
);

/*
|--------------------------------------------------------------------------
| DESKTOP ATTENDANCE ROW
|--------------------------------------------------------------------------
*/

const AttendanceRow = ({
  member,
  onView,
  onMark,
  onEditTime,
  isEditable,
}) => (
  <tr className="hover:bg-[#FBFDFC]">
    <td className="px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <Avatar name={member.name} />

        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-[#173F41]">
            {member.name}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-[#819596]">
            {member.id} · {member.role}
          </p>
        </div>
      </div>
    </td>

    <td className="px-3 py-2.5 text-[11px] text-[#31585A]">
      <span className="block truncate">
        {member.department}
      </span>
    </td>

    <td className="px-3 py-2.5 text-[11px] text-[#31585A]">
      <span className="block truncate">
        {member.shift}
      </span>
    </td>

    <td className="px-3 py-2.5 text-[11px] text-[#31585A]">
      <p>{member.checkIn}</p>

      <p className="mt-0.5 text-[10px] text-[#819596]">
        {member.checkOut}
      </p>
    </td>

    <td className="px-3 py-2.5 text-[11px] font-semibold text-[#31585A]">
      {member.workHours}
    </td>

    <td className="px-3 py-2.5">
      <AttendanceStatus
        status={member.status}
      />
    </td>

    <td className="px-3 py-2.5">
      <div className="flex items-center justify-end gap-1.5">
        <MarkButtons
          member={member}
          onMark={onMark}
          disabled={!isEditable}
        />

        <button
          type="button"
          onClick={
            isEditable
              ? onEditTime
              : undefined
          }
          disabled={!isEditable}
          title={
            isEditable
              ? "Add check-in and check-out times"
              : "Historical attendance is locked"
          }
          className={`rounded-md border border-[#DDE9E7] p-1.5 transition ${
            isEditable
              ? "text-[#507173] hover:bg-[#E8F8F6] hover:text-[#078E89]"
              : "cursor-not-allowed text-[#B6C8C7]"
          }`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onView}
          aria-label="View details"
          className="rounded-md border border-[#DDE9E7] p-1.5 text-[#507173] hover:bg-[#E8F8F6] hover:text-[#078E89]"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      </div>
    </td>
  </tr>
);

/*
|--------------------------------------------------------------------------
| MOBILE CARD
|--------------------------------------------------------------------------
*/

const MobileCard = ({
  member,
  onView,
  onMark,
  onEditTime,
  isEditable,
}) => (
  <article className="p-4">
    <div className="flex items-start gap-3">
      <Avatar name={member.name} />

      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <div>
            <p className="font-semibold text-[#173F41]">
              {member.name}
            </p>

            <p className="mt-0.5 text-xs text-[#819596]">
              {member.id} · {member.role}
            </p>
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={
                isEditable
                  ? onEditTime
                  : undefined
              }
              disabled={!isEditable}
              title={
                isEditable
                  ? "Add times"
                  : "Historical attendance is locked"
              }
              className={`rounded-lg border border-[#DDE9E7] p-2 ${
                isEditable
                  ? "text-[#507173]"
                  : "cursor-not-allowed text-[#B6C8C7]"
              }`}
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onView}
              className="rounded-lg border border-[#DDE9E7] p-2 text-[#507173]"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <AttendanceStatus
            status={member.status}
          />

          <span className="text-xs text-[#819596]">
            {member.department}
          </span>
        </div>

        <div className="mt-3 rounded-lg bg-[#F7FBFA] p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#819596]">
                Check In
              </p>

              <p className="mt-1 text-sm font-semibold text-[#31585A]">
                {member.checkIn}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase text-[#819596]">
                Check Out
              </p>

              <p className="mt-1 text-sm font-semibold text-[#31585A]">
                {member.checkOut}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <MarkButtons
            member={member}
            onMark={onMark}
            disabled={!isEditable}
          />
        </div>
      </div>
    </div>
  </article>
);

/*
|--------------------------------------------------------------------------
| DETAILS MODAL
|--------------------------------------------------------------------------
*/

const Details = ({
  member,
  onClose,
  onMark,
  onEditTime,
  isEditable,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173F41]/40 p-4 backdrop-blur-sm">
    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-start justify-between bg-[#173F41] p-5 text-white">
        <div>
          <h2 className="text-lg font-bold">
            {member.name}
          </h2>

          <p className="mt-1 text-xs text-white/65">
            {member.id} · {member.role}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <AttendanceStatus
            status={member.status}
          />

          <span className="text-sm font-semibold text-[#507173]">
            {formatDate(member.date)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info
            label="Department"
            value={member.department}
          />

          <Info
            label="Shift"
            value={member.shift}
          />

          <Info
            label="Check In"
            value={member.checkIn}
          />

          <Info
            label="Check Out"
            value={member.checkOut}
          />

          <Info
            label="Work Hours"
            value={member.workHours}
          />

          <Info
            label="Email"
            value={member.email}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-[#173F41]">
            Mark attendance
          </p>

          <MarkButtons
            member={member}
            onMark={onMark}
            disabled={!isEditable}
          />
        </div>

        {isEditable ? (
          <button
            type="button"
            onClick={onEditTime}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm font-semibold text-[#31585A] hover:bg-[#E8F8F6] hover:text-[#078E89]"
          >
            <Pencil className="h-4 w-4" />
            Add check-in / check-out
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#F3F6F6] px-3 py-2 text-sm font-semibold text-[#819596]">
            <Lock className="h-4 w-4" />
            Historical attendance is locked
          </div>
        )}
      </div>
    </div>
  </div>
);

/*
|--------------------------------------------------------------------------
| INFO
|--------------------------------------------------------------------------
*/

const Info = ({
  label,
  value,
}) => (
  <div className="rounded-lg bg-[#F7FBFA] p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#819596]">
      {label}
    </p>

    <p className="mt-1 break-words text-sm font-medium text-[#31585A]">
      {value}
    </p>
  </div>
);

/*
|--------------------------------------------------------------------------
| TIME EDITOR
|--------------------------------------------------------------------------
*/

const TimeEditor = ({
  member,
  onClose,
  onSave,
}) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#173F41]/40 p-4 backdrop-blur-sm">
    <form
      onSubmit={onSave}
      className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
    >
      <div className="flex items-start justify-between border-b border-[#E2EFED] p-5">
        <div>
          <h2 className="text-lg font-bold text-[#173F41]">
            Add attendance times
          </h2>

          <p className="mt-1 text-sm text-[#819596]">
            {member.name} ·{" "}
            {formatDate(member.date)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-[#819596] hover:bg-[#E8F8F6]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-[#31585A]">
          Check In

          <input
            required
            name="checkIn"
            type="time"
            defaultValue={toTimeInput(
              member.checkIn
            )}
            className="mt-1 block w-full rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm outline-none focus:border-[#08A6A0]"
          />
        </label>

        <label className="text-sm font-semibold text-[#31585A]">
          Check Out

          <input
            name="checkOut"
            type="time"
            defaultValue={toTimeInput(
              member.checkOut
            )}
            className="mt-1 block w-full rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm outline-none focus:border-[#08A6A0]"
          />
        </label>
      </div>

      <div className="flex justify-end gap-2 border-t border-[#EAF2F1] p-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[#DDE9E7] px-4 py-2 text-sm font-semibold text-[#31585A]"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#078E89] px-4 py-2 text-sm font-semibold text-white hover:bg-[#067A76]"
        >
          Save times
        </button>
      </div>
    </form>
  </div>
);

/*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
*/

const EmptyState = () => (
  <div className="px-6 py-16 text-center">
    <CalendarDays className="mx-auto h-8 w-8 text-[#B6C8C7]" />

    <h3 className="mt-3 font-semibold text-[#173F41]">
      No attendance records found
    </h3>

    <p className="mt-1 text-sm text-[#819596]">
      Try another date or change the filters.
    </p>
  </div>
);

export default Attendance;