import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/api";
import {
  Activity,
  ArrowUpRight,
  BedDouble,
  BellRing,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  Package,
  Pill,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";

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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/api/dashboard/stats");

        if (data) {
          setStats(data);
        } else {
          setStats(null);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setStats(null);
        setError(err?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  /*
   * =========================================================
   * SUMMARY CARDS
   * Backend data only
   * =========================================================
   */
  const currentFichas = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Patients",
        caption: "Active patient records",
        value:
          stats.patients !== undefined && stats.patients !== null
            ? String(stats.patients)
            : "0",
        detail: "Backend data",
        icon: UserRound,
        path: "/admin/patients",
      },
      {
        title: "Admissions",
        caption: "Patients currently admitted",
        value:
          stats.admissions !== undefined && stats.admissions !== null
            ? String(stats.admissions)
            : "0",
        detail:
          stats.occupancy_rate !== undefined &&
          stats.occupancy_rate !== null
            ? `${stats.occupancy_rate}% bed occupancy`
            : "Backend data",
        icon: BedDouble,
        path: "/admin/admissions",
      },
      {
        title: "Appointments",
        caption: "Scheduled for today",
        value:
          stats.appointments !== undefined && stats.appointments !== null
            ? String(stats.appointments)
            : "0",
        detail: "Backend data",
        icon: CalendarDays,
        path: "/admin/appointments",
      },
      {
        title: "Care team",
        caption: "Staff members on duty",
        value:
          stats.staff !== undefined && stats.staff !== null
            ? String(stats.staff)
            : "0",
        detail: "Backend data",
        icon: UsersRound,
        path: "/admin/staff",
      },
    ];
  }, [stats]);

  const visibleFichas = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return currentFichas;
    }

    return currentFichas.filter((ficha) =>
      `${ficha.title} ${ficha.caption}`.toLowerCase().includes(query),
    );
  }, [currentFichas, search]);

  /*
   * =========================================================
   * BACKEND ARRAYS
   * No dummy fallback data
   * =========================================================
   */
  const departmentsData = useMemo(() => {
    if (!Array.isArray(stats?.departments)) {
      return [];
    }

    return stats.departments;
  }, [stats]);

  const patientFlowData = useMemo(() => {
    if (!Array.isArray(stats?.patient_flow)) {
      return [];
    }

    return stats.patient_flow;
  }, [stats]);

  const activityData = useMemo(() => {
    if (!Array.isArray(stats?.activity)) {
      return [];
    }

    return stats.activity;
  }, [stats]);

  const visibleActivity = showAllActivity
    ? activityData
    : activityData.slice(0, 3);

  /*
   * =========================================================
   * DASHBOARD OVERVIEW
   * Only values available from backend are displayed.
   * =========================================================
   */
  const overviewItems = useMemo(() => {
    if (!stats) {
      return [];
    }

    const items = [];

    if (
      stats.occupancy_rate !== undefined &&
      stats.occupancy_rate !== null
    ) {
      items.push({
        label: "Bed capacity",
        value: `${stats.occupancy_rate}%`,
        detail:
          stats.admissions !== undefined &&
          stats.admissions !== null &&
          stats.total_beds !== undefined &&
          stats.total_beds !== null
            ? `${stats.admissions} of ${stats.total_beds} occupied`
            : "Backend data",
        icon: BedDouble,
      });
    }

    if (stats.staff !== undefined && stats.staff !== null) {
      items.push({
        label: "Staff coverage",
        value: String(stats.staff),
        detail: "Staff members",
        icon: UsersRound,
      });
    }

    /*
     * Medicine stock
     * Only show it when the backend actually provides
     * a medicine/inventory percentage.
     */
    if (
      stats.medicine_stock_percentage !== undefined &&
      stats.medicine_stock_percentage !== null
    ) {
      items.push({
        label: "Medicine stock",
        value: `${stats.medicine_stock_percentage}%`,
        detail:
          stats?.alerts?.inventory_restock !== undefined
            ? `${stats.alerts.inventory_restock} items need restocking`
            : "Backend data",
        icon: Pill,
      });
    }


    return items;
  }, [stats]);

  return (
    <div className="w-full space-y-4 pb-6 sm:space-y-5 sm:pb-8">
      {/* =========================================================
          ERROR
      ========================================================= */}
      {error && (
        <div className="rounded-xl border border-[#F0D8D3] bg-[#FFF8F6] px-4 py-3 text-xs font-medium text-[#B94A38]">
          {error}
        </div>
      )}

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`dashboard-loading-${index}`}
                className="min-w-0 animate-pulse rounded-lg border border-[#E2EFED] bg-white px-2 py-3 shadow-sm sm:rounded-xl md:rounded-2xl md:px-4 md:py-4"
              >
                <div className="h-6 w-6 rounded-md bg-[#E8F8F6] sm:h-7 sm:w-7 md:h-10 md:w-10" />
                <div className="mt-3 h-5 w-16 rounded bg-[#E8F0EF]" />
                <div className="mt-2 h-3 w-20 rounded bg-[#E8F0EF]" />
              </div>
            ))
          : visibleFichas.map((ficha) => {
              const Icon = ficha.icon;

              return (
                <Link
                  key={ficha.title}
                  to={ficha.path}
                  className="group min-w-0 rounded-lg border border-[#E2EFED] bg-white px-2 py-1.5 shadow-sm transition hover:border-[#08A6A0] hover:shadow-md sm:rounded-xl sm:px-2.5 sm:py-2.5 md:rounded-2xl md:px-4 md:py-4"
                >
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6] text-[#08A6A0] [&>svg]:h-3 [&>svg]:w-3 sm:h-7 sm:w-7 sm:rounded-lg sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:h-10 md:w-10 md:rounded-xl md:[&>svg]:h-5 md:[&>svg]:w-5">
                      <Icon />
                    </div>

                    <ArrowUpRight className="h-3 w-3 text-[#819596] transition group-hover:text-[#08A6A0] sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  </div>

                  <div className="mt-1 flex items-baseline justify-between gap-1 sm:mt-1.5 md:mt-3">
                    <p className="text-base font-bold leading-none text-[#073F42] sm:text-lg md:text-2xl">
                      {ficha.value}
                    </p>

                    <span className="hidden text-right text-[10px] font-semibold text-[#08A6A0] sm:inline md:text-xs">
                      {ficha.detail}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-[9px] font-semibold text-[#819596] sm:text-[10px] md:text-xs">
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
            {overviewItems.length > 0 ? (
              overviewItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-lg border border-[#E2EFED] bg-[#FAFDFC] p-2.5 sm:rounded-xl sm:p-3.5"
                  >
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6] text-[#08A6A0] sm:h-8 sm:w-8 sm:rounded-lg">
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>

                      <span className="text-sm font-bold text-[#073F42] sm:text-base md:text-lg">
                        {item.value}
                      </span>
                    </div>

                    <p className="mt-1.5 truncate text-[10px] font-semibold text-[#31585A] sm:text-xs md:text-sm">
                      {item.label}
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-[#819596] sm:text-[10px] md:text-xs">
                      {item.detail}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 rounded-lg border border-dashed border-[#DCEBE9] bg-[#FAFDFC] px-4 py-8 text-center">
                <p className="text-xs font-semibold text-[#31585A]">
                  No overview data available
                </p>
                <p className="mt-1 text-[10px] text-[#819596]">
                  Dashboard overview data will appear here when provided by the
                  backend.
                </p>
              </div>
            )}
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

          {patientFlowData.length > 0 ? (
            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
              {patientFlowData.map((item) => (
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
                          Number(item.percentage ?? item.value ?? 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-[#CFE4E1] bg-white/60 px-3 py-8 text-center sm:mt-6 sm:rounded-xl">
              <p className="text-xs font-semibold text-[#31585A]">
                No patient flow data available
              </p>
              <p className="mt-1 text-[10px] text-[#819596]">
                Patient flow data will appear when provided by the backend.
              </p>
            </div>
          )}

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

          {departmentsData.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {departmentsData.map((department) => (
                <div key={department.name}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-[#31585A] sm:text-sm">
                        {department.name}
                      </p>

                      {department.staff !== undefined &&
                        department.staff !== null && (
                          <p className="mt-0.5 text-[9px] text-[#819596] sm:mt-1 sm:text-[11px]">
                            {department.staff}
                          </p>
                        )}
                    </div>

                    <span className="shrink-0 text-[11px] font-bold text-[#073F42] sm:text-sm">
                      {department.occupancy ?? 0}%
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8F0EF] sm:mt-3 sm:h-2">
                    <div
                      className="h-full rounded-full bg-[#08A6A0]"
                      style={{
                        width: `${Math.min(
                          Number(department.occupancy ?? 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-[#DCEBE9] bg-[#FAFDFC] px-4 py-8 text-center">
              <p className="text-xs font-semibold text-[#31585A]">
                No department data available
              </p>
              <p className="mt-1 text-[10px] text-[#819596]">
                Department occupancy will appear when returned by the backend.
              </p>
            </div>
          )}
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
                {stats?.alerts?.emergency_requests ?? 0}
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
                {stats?.alerts?.inventory_restock ?? 0}
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
                {stats?.alerts?.pending_requests ?? 0}
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

            {activityData.length > 3 && (
              <button
                type="button"
                onClick={() =>
                  setShowAllActivity((current) => !current)
                }
                className="shrink-0 text-[10px] font-semibold text-[#087F7A] hover:text-[#073F42] sm:text-xs"
              >
                {showAllActivity ? "Show less" : "View all"}
              </button>
            )}
          </div>

          {visibleActivity.length > 0 ? (
            <div className="mt-4 divide-y divide-[#EAF2F0] sm:mt-5">
              {visibleActivity.map((item, index) => (
                <div
                  key={`${item.name || "activity"}-${item.time || index}`}
                  className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0 sm:gap-3 sm:py-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-[9px] font-bold text-[#087F7A] sm:h-9 sm:w-9 sm:text-xs">
                    {item.initials ||
                      String(item.name || "A")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                  </div>

                  <p className="min-w-0 flex-1 text-[10px] leading-4 text-[#819596] sm:text-xs sm:leading-5">
                    {item.name && (
                      <span className="font-semibold text-[#31585A]">
                        {item.name}
                      </span>
                    )}{" "}
                    {item.action}
                  </p>

                  {item.time && (
                    <span className="shrink-0 text-[8px] font-semibold text-[#A6BABA] sm:text-[10px]">
                      {item.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-[#DCEBE9] bg-[#FAFDFC] px-4 py-8 text-center sm:mt-5">
              <p className="text-xs font-semibold text-[#31585A]">
                No recent activity
              </p>
              <p className="mt-1 text-[10px] text-[#819596]">
                Recent activity will appear when returned by the backend.
              </p>
            </div>
          )}
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