import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  BedDouble,
  BellRing,
  CalendarDays,
  ChevronRight,
  Droplets,
  HeartPulse,
  Package,
  Pill,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";

const hospitalFichas = [
  {
    title: "Patients",
    caption: "Active patient records",
    value: "486",
    detail: "+8.2% this month",
    icon: UserRound,
    path: "/admin/patients",
  },
  {
    title: "Admissions",
    caption: "Patients currently admitted",
    value: "124",
    detail: "82% bed occupancy",
    icon: BedDouble,
    path: "/admin/admissions",
  },
  {
    title: "Appointments",
    caption: "Scheduled for today",
    value: "68",
    detail: "14 still waiting",
    icon: CalendarDays,
    path: "/admin/appointments",
  },
  {
    title: "Care team",
    caption: "Staff members on duty",
    value: "192",
    detail: "18 available now",
    icon: UsersRound,
    path: "/admin/staff",
  },
];

const departments = [
  {
    name: "General medicine",
    staff: "24 staff",
    occupancy: 78,
  },
  {
    name: "Critical care",
    staff: "18 staff",
    occupancy: 92,
  },
  {
    name: "Maternity & child",
    staff: "31 staff",
    occupancy: 64,
  },
  {
    name: "Diagnostics",
    staff: "16 staff",
    occupancy: 48,
  },
];

const patientFlow = [
  {
    label: "Admitted",
    value: 124,
  },
  {
    label: "Under treatment",
    value: 86,
  },
  {
    label: "Awaiting discharge",
    value: 18,
  },
];

const activity = [
  {
    initials: "PS",
    name: "Priya Sharma",
    action: "was admitted to General medicine",
    time: "08:42 AM",
  },
  {
    initials: "AS",
    name: "Arjun Sen",
    action: "has a pending lab report",
    time: "08:18 AM",
  },
  {
    initials: "MR",
    name: "Maya Roy",
    action: "was assigned to Dr. Arindam Sen",
    time: "07:56 AM",
  },
  {
    initials: "SD",
    name: "Sneha Das",
    action: "completed a discharge request",
    time: "07:31 AM",
  },
];

const quickLinks = [
  {
    label: "Register patient",
    icon: UserRound,
    path: "/admin/patients",
  },
  {
    label: "Create appointment",
    icon: CalendarDays,
    path: "/admin/appointments",
  },
  {
    label: "Check inventory",
    icon: Package,
    path: "/admin/inventory",
  },
  {
    label: "View emergency",
    icon: HeartPulse,
    path: "/admin/emergency",
  },
];

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [showAllActivity, setShowAllActivity] = useState(false);

  const visibleFichas = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return hospitalFichas;
    }

    return hospitalFichas.filter((ficha) =>
      `${ficha.title} ${ficha.caption}`
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const visibleActivity = showAllActivity
    ? activity
    : activity.slice(0, 3);

  return (
    <div className="w-full space-y-4 pb-6 sm:space-y-5 sm:pb-8">

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {visibleFichas.map((ficha) => {
          const Icon = ficha.icon;

          return (
            <Link
              key={ficha.title}
              to={ficha.path}
              className="group min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md hover:border-[#08A6A0]"
            >
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-[#E8F8F6] text-[#08A6A0] [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
                  <Icon />
                </div>

                <ArrowUpRight className="h-3 w-3 text-[#819596] transition group-hover:text-[#08A6A0] sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              </div>

              <div className="mt-1 sm:mt-1.5 md:mt-3 flex items-baseline justify-between gap-1">
                <p className="text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">
                  {ficha.value}
                </p>

                <span className="hidden text-right text-[10px] md:text-xs font-semibold text-[#08A6A0] sm:inline">
                  {ficha.detail}
                </span>
              </div>

              <p className="mt-0.5 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">
                {ficha.title}
              </p>

              <p className="truncate text-[8px] font-medium text-[#08A6A0] sm:hidden">
                {ficha.detail}
              </p>
            </Link>
          );
        })}
      </section>

      {/* =========================================================
          HOSPITAL OVERVIEW + PATIENT FLOW
      ========================================================= */}
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] xl:gap-5">

        {/* Hospital Overview */}
        <section className="rounded-xl border border-[#DCEBE9] bg-white shadow-[0_2px_10px_rgba(7,63,66,0.025)] sm:rounded-2xl">
          <div className="border-b border-[#E8F0EF] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#08A6A0] sm:text-[10px]">
                  Today at a glance
                </p>

                <h2 className="mt-1 text-base font-semibold text-[#073F42] sm:text-lg">
                  Hospital overview
                </h2>

                <p className="mt-1 text-[11px] text-[#819596] sm:text-xs">
                  The areas that need your attention first.
                </p>
              </div>

              <div className="relative w-full sm:w-52">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8AA0A1]" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Find an overview"
                  aria-label="Find a hospital overview"
                  className="h-9 w-full rounded-lg border border-[#DCEBE9] bg-[#F8FCFB] pl-8 pr-3 text-[11px] text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10 sm:h-10 sm:rounded-xl sm:text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-5">
            {[
              {
                label: "Bed capacity",
                value: "82%",
                detail: "124 of 150 occupied",
                icon: BedDouble,
              },
              {
                label: "Staff coverage",
                value: "94%",
                detail: "192 team members",
                icon: UsersRound,
              },
              {
                label: "Medicine stock",
                value: "76%",
                detail: "12 items need restocking",
                icon: Pill,
              },
              {
                label: "Blood bank",
                value: "Good",
                detail: "Critical groups available",
                icon: Droplets,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="min-w-0 rounded-lg sm:rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-2.5 sm:p-3.5"
                >
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6] text-[#08A6A0] sm:rounded-lg">
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>

                    <span className="text-sm sm:text-base md:text-lg font-bold text-[#073F42]">
                      {item.value}
                    </span>
                  </div>

                  <p className="mt-1.5 truncate text-[10px] sm:text-xs md:text-sm font-semibold text-[#31585A]">
                    {item.label}
                  </p>

                  <p className="mt-0.5 truncate text-[9px] sm:text-[10px] md:text-xs text-[#819596]">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Patient Flow */}
        <section className="rounded-xl border border-[#DCEBE9] bg-[#F3FAF8] p-4 shadow-[0_2px_10px_rgba(7,63,66,0.025)] sm:rounded-2xl sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#08A6A0] sm:text-[10px]">
                Patient flow
              </p>

              <h2 className="mt-1 text-base font-semibold text-[#073F42] sm:text-lg">
                Care status
              </h2>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0] sm:h-9 sm:w-9">
              <Activity className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            {patientFlow.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-2 text-[11px] sm:text-sm">
                  <span className="font-semibold text-[#31585A]">
                    {item.label}
                  </span>

                  <span className="font-bold text-[#073F42]">
                    {item.value}
                  </span>
                </div>

                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#DCEBE9] sm:mt-2 sm:h-2">
                  <div
                    className="h-full rounded-full bg-[#08A6A0]"
                    style={{
                      width: `${Math.min(
                        (item.value / 150) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/patients"
            className="mt-5 flex items-center justify-between rounded-lg bg-white px-3 py-2.5 text-[10px] font-semibold text-[#087F7A] transition hover:bg-[#E8F8F6] sm:mt-7 sm:rounded-xl sm:px-4 sm:py-3 sm:text-xs"
          >
            View patient register

            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </section>
      </div>

      {/* =========================================================
          DEPARTMENT OCCUPANCY + OPEN ALERTS
      ========================================================= */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] xl:gap-5">

        {/* Department Occupancy */}
        <section className="rounded-xl border border-[#DCEBE9] bg-white p-4 shadow-[0_2px_10px_rgba(7,63,66,0.025)] sm:rounded-2xl sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#08A6A0] sm:text-[10px]">
                Capacity watch
              </p>

              <h2 className="mt-1 text-base font-semibold text-[#073F42] sm:text-lg">
                Department occupancy
              </h2>
            </div>

            <Link
              to="/admin/rooms"
              className="shrink-0 text-[10px] font-semibold text-[#087F7A] hover:text-[#073F42] sm:text-xs"
            >
              Manage beds
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {departments.map((department) => (
              <div key={department.name}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-[#31585A] sm:text-sm">
                      {department.name}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#819596] sm:mt-1 sm:text-[11px]">
                      {department.staff}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] font-bold text-[#073F42] sm:text-sm">
                    {department.occupancy}%
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8F0EF] sm:mt-3 sm:h-2">
                  <div
                    className="h-full rounded-full bg-[#08A6A0]"
                    style={{
                      width: `${department.occupancy}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Alerts */}
        <section className="rounded-xl border border-[#DCEBE9] bg-white p-4 shadow-[0_2px_10px_rgba(7,63,66,0.025)] sm:rounded-2xl sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#819596] sm:text-[10px]">
                Needs attention
              </p>

              <h2 className="mt-1 text-base font-semibold text-[#073F42] sm:text-lg">
                Open alerts
              </h2>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0] sm:h-9 sm:w-9">
              <BellRing className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
            <Link
              to="/admin/emergency"
              className="flex items-center gap-2.5 rounded-lg border border-[#E7F0EE] p-2.5 transition hover:border-[#A9D8D3] hover:bg-[#FBFDFC] sm:gap-3 sm:rounded-xl sm:p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FDEFEA] text-[11px] font-bold text-[#C45742] sm:h-9 sm:w-9 sm:rounded-lg sm:text-sm">
                3
              </span>

              <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#31585A] sm:text-sm">
                Emergency requests
              </span>

              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#A6BABA] sm:h-4 sm:w-4" />
            </Link>

            <Link
              to="/admin/inventory"
              className="flex items-center gap-2.5 rounded-lg border border-[#E7F0EE] p-2.5 transition hover:border-[#A9D8D3] hover:bg-[#FBFDFC] sm:gap-3 sm:rounded-xl sm:p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6] text-[11px] font-bold text-[#087F7A] sm:h-9 sm:w-9 sm:rounded-lg sm:text-sm">
                12
              </span>

              <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#31585A] sm:text-sm">
                Medicine items to restock
              </span>

              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#A6BABA] sm:h-4 sm:w-4" />
            </Link>

            <Link
              to="/admin/requests"
              className="flex items-center gap-2.5 rounded-lg border border-[#E7F0EE] p-2.5 transition hover:border-[#A9D8D3] hover:bg-[#FBFDFC] sm:gap-3 sm:rounded-xl sm:p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6] text-[11px] font-bold text-[#087F7A] sm:h-9 sm:w-9 sm:rounded-lg sm:text-sm">
                5
              </span>

              <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#31585A] sm:text-sm">
                Pending service requests
              </span>

              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#A6BABA] sm:h-4 sm:w-4" />
            </Link>
          </div>
        </section>
      </div>

      {/* =========================================================
          RECENT ACTIVITY + QUICK ACTIONS
      ========================================================= */}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] xl:gap-5">

        {/* Recent Activity */}
        <section className="rounded-xl border border-[#DCEBE9] bg-white p-4 shadow-[0_2px_10px_rgba(7,63,66,0.025)] sm:rounded-2xl sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#08A6A0] sm:text-[10px]">
                Live register
              </p>

              <h2 className="mt-1 text-base font-semibold text-[#073F42] sm:text-lg">
                Recent activity
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAllActivity((current) => !current)
              }
              className="shrink-0 text-[10px] font-semibold text-[#087F7A] hover:text-[#073F42] sm:text-xs"
            >
              {showAllActivity ? "Show less" : "View all"}
            </button>
          </div>

          <div className="mt-4 divide-y divide-[#EAF2F0] sm:mt-5">
            {visibleActivity.map((item) => (
              <div
                key={`${item.name}-${item.time}`}
                className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0 sm:gap-3 sm:py-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-[9px] font-bold text-[#087F7A] sm:h-9 sm:w-9 sm:text-xs">
                  {item.initials}
                </div>

                <p className="min-w-0 flex-1 text-[10px] leading-4 text-[#819596] sm:text-xs sm:leading-5">
                  <span className="font-semibold text-[#31585A]">
                    {item.name}
                  </span>{" "}
                  {item.action}
                </p>

                <span className="shrink-0 text-[8px] font-semibold text-[#A6BABA] sm:text-[10px]">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-xl border border-[#DCEBE9] bg-white p-4 shadow-[0_2px_10px_rgba(7,63,66,0.025)] sm:rounded-2xl sm:p-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#08A6A0] sm:text-[10px]">
              Shortcuts
            </p>

            <h2 className="mt-1 text-base font-semibold text-[#073F42] sm:text-lg">
              Common actions
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="group min-w-0 rounded-lg border border-[#E7F0EE] p-2.5 transition hover:-translate-y-0.5 hover:border-[#A9D8D3] hover:bg-[#FBFDFC] sm:rounded-xl sm:p-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#E8F8F6] text-[#08A6A0] sm:h-9 sm:w-9 sm:rounded-lg">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>

                  <p className="mt-2 truncate text-[10px] font-semibold leading-4 text-[#31585A] sm:mt-3 sm:text-xs">
                    {item.label}
                  </p>

                  <ArrowUpRight className="mt-1.5 h-3 w-3 text-[#A6BABA] transition group-hover:text-[#08A6A0] sm:mt-2 sm:h-3.5 sm:w-3.5" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
