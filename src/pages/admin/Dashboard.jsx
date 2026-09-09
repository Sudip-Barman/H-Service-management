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
    color: "teal",
    path: "/admin/patients",
  },
  {
    title: "Admissions",
    caption: "Patients currently admitted",
    value: "124",
    detail: "82% bed occupancy",
    icon: BedDouble,
    color: "blue",
    path: "/admin/admissions",
  },
  {
    title: "Appointments",
    caption: "Scheduled for today",
    value: "68",
    detail: "14 still waiting",
    icon: CalendarDays,
    color: "amber",
    path: "/admin/appointments",
  },
  {
    title: "Care team",
    caption: "Staff members on duty",
    value: "192",
    detail: "18 available now",
    icon: UsersRound,
    color: "rose",
    path: "/admin/staff",
  },
];

const departments = [
  { name: "General medicine", staff: "24 staff", occupancy: 78, color: "bg-[#0F9F98]" },
  { name: "Critical care", staff: "18 staff", occupancy: 92, color: "bg-[#E16F58]" },
  { name: "Maternity & child", staff: "31 staff", occupancy: 64, color: "bg-[#E6AA43]" },
  { name: "Diagnostics", staff: "16 staff", occupancy: 48, color: "bg-[#4777A9]" },
];

const patientFlow = [
  { label: "Admitted", value: 124, color: "bg-[#0F9F98]" },
  { label: "Under treatment", value: 86, color: "bg-[#4777A9]" },
  { label: "Awaiting discharge", value: 18, color: "bg-[#E6AA43]" },
];

const activity = [
  { initials: "PS", name: "Priya Sharma", action: "was admitted to General medicine", time: "08:42 AM", tone: "teal" },
  { initials: "AS", name: "Arjun Sen", action: "has a pending lab report", time: "08:18 AM", tone: "blue" },
  { initials: "MR", name: "Maya Roy", action: "was assigned to Dr. Arindam Sen", time: "07:56 AM", tone: "amber" },
  { initials: "SD", name: "Sneha Das", action: "completed a discharge request", time: "07:31 AM", tone: "rose" },
];

const quickLinks = [
  { label: "Register patient", icon: UserRound, path: "/admin/patients", accent: "bg-[#E5F7F4] text-[#087F7A]" },
  { label: "Create appointment", icon: CalendarDays, path: "/admin/appointments", accent: "bg-[#EAF1FA] text-[#4777A9]" },
  { label: "Check inventory", icon: Package, path: "/admin/inventory", accent: "bg-[#FFF5DF] text-[#B47714]" },
  { label: "View emergency", icon: HeartPulse, path: "/admin/emergency", accent: "bg-[#FDEBE7] text-[#C45742]" },
];

const fichaColors = {
  teal: "bg-[#DDF4F0] text-[#087F7A]",
  blue: "bg-[#E5EEF6] text-[#386A91]",
  amber: "bg-[#FFF0D2] text-[#A9680A]",
  rose: "bg-[#FBE4DE] text-[#B6503B]",
};

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [showAllActivity, setShowAllActivity] = useState(false);

  const visibleFichas = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return hospitalFichas;
    return hospitalFichas.filter((ficha) =>
      `${ficha.title} ${ficha.caption}`.toLowerCase().includes(query),
    );
  }, [search]);

  const visibleActivity = showAllActivity ? activity : activity.slice(0, 3);

  return (
    <div className="dashboard-shell space-y-6 pb-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleFichas.map((ficha) => {
          const Icon = ficha.icon;
          return (
            <Link
              key={ficha.title}
              to={ficha.path}
              className="group rounded-2xl border border-[#D8E3E6] bg-white p-5 shadow-[0_4px_16px_rgba(16,47,61,0.04)] transition hover:-translate-y-0.5 hover:border-[#79C9C1] hover:shadow-[0_10px_24px_rgba(16,47,61,0.09)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${fichaColors[ficha.color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#9AAEB4] transition group-hover:text-[#087F7A]" />
              </div>
              <p className="mt-5 text-sm font-bold text-[#173F41]">{ficha.title}</p>
              <p className="mt-1 text-xs text-[#819596]">{ficha.caption}</p>
              <div className="mt-4 flex items-end justify-between gap-2">
                <p className="text-3xl font-bold tracking-tight text-[#073F42]">{ficha.value}</p>
                <span className="mb-1 text-right text-[10px] font-semibold text-[#087F7A]">{ficha.detail}</span>
              </div>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-[#DCEBE8] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08A6A0]">Today at a glance</p>
              <h2 className="mt-1 text-lg font-bold text-[#073F42]">Hospital fichas</h2>
              <p className="mt-1 text-xs text-[#819596]">The areas that need your attention first.</p>
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a ficha"
                aria-label="Find a hospital ficha"
                className="h-10 w-full rounded-xl border border-[#DCEBE8] bg-[#F8FCFB] pl-9 pr-3 text-xs text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Bed capacity", value: "82%", detail: "124 of 150 occupied", icon: BedDouble, tone: "teal" },
              { label: "Staff coverage", value: "94%", detail: "192 team members on shift", icon: UsersRound, tone: "blue" },
              { label: "Medicine stock", value: "76%", detail: "12 items need restocking", icon: Pill, tone: "amber" },
              { label: "Blood bank", value: "Good", detail: "All critical groups available", icon: Droplets, tone: "rose" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-[#E7F0EE] bg-[#FBFDFC] p-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${fichaColors[item.tone]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold text-[#073F42]">{item.value}</span>
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#31585A]">{item.label}</p>
                  <p className="mt-1 text-xs text-[#819596]">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#DCEBE8] bg-[#F3FAF8] p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08A6A0]">Patient flow</p>
              <h2 className="mt-1 text-lg font-bold text-[#073F42]">Care status</h2>
            </div>
            <Activity className="h-5 w-5 text-[#08A6A0]" />
          </div>
          <div className="mt-6 space-y-5">
            {patientFlow.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#31585A]">{item.label}</span>
                  <span className="font-bold text-[#073F42]">{item.value}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min((item.value / 150) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/patients" className="mt-7 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#087F7A] transition hover:bg-[#E5F7F4]">
            View patient register
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-[#DCEBE8] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08A6A0]">Capacity watch</p>
              <h2 className="mt-1 text-lg font-bold text-[#073F42]">Department occupancy</h2>
            </div>
            <Link to="/admin/rooms" className="text-xs font-bold text-[#087F7A] hover:text-[#073F42]">Manage beds</Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {departments.map((department) => (
              <div key={department.name}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#31585A]">{department.name}</p>
                    <p className="mt-1 text-[11px] text-[#819596]">{department.staff}</p>
                  </div>
                  <span className="text-sm font-bold text-[#073F42]">{department.occupancy}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8F0EF]">
                  <div className={`h-full rounded-full ${department.color}`} style={{ width: `${department.occupancy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#DCEBE8] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E16F58]">Needs attention</p>
              <h2 className="mt-1 text-lg font-bold text-[#073F42]">Open alerts</h2>
            </div>
            <BellRing className="h-5 w-5 text-[#E16F58]" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["3", "Emergency requests", "/admin/emergency", "bg-[#FDEBE7] text-[#C45742]"],
              ["12", "Medicine items to restock", "/admin/inventory", "bg-[#FFF5DF] text-[#B47714]"],
              ["5", "Pending service requests", "/admin/requests", "bg-[#EAF1FA] text-[#4777A9]"],
            ].map(([count, label, path, tone]) => (
              <Link key={label} to={path} className="flex items-center gap-3 rounded-xl border border-[#E7F0EE] p-3 transition hover:border-[#9AD8D2] hover:bg-[#FBFDFC]">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${tone}`}>{count}</span>
                <span className="flex-1 text-sm font-semibold text-[#31585A]">{label}</span>
                <ChevronRight className="h-4 w-4 text-[#A6BABA]" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[#DCEBE8] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08A6A0]">Live register</p>
              <h2 className="mt-1 text-lg font-bold text-[#073F42]">Recent activity</h2>
            </div>
            <button type="button" onClick={() => setShowAllActivity((current) => !current)} className="text-xs font-bold text-[#087F7A] hover:text-[#073F42]">
              {showAllActivity ? "Show less" : "View all"}
            </button>
          </div>
          <div className="mt-5 divide-y divide-[#EAF2F0]">
            {visibleActivity.map((item) => (
              <div key={`${item.name}-${item.time}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${fichaColors[item.tone]}`}>{item.initials}</div>
                <p className="min-w-0 flex-1 text-xs leading-5 text-[#819596]"><span className="font-bold text-[#31585A]">{item.name}</span> {item.action}</p>
                <span className="shrink-0 text-[10px] font-semibold text-[#A6BABA]">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#DCEBE8] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08A6A0]">Shortcuts</p>
            <h2 className="mt-1 text-lg font-bold text-[#073F42]">Common actions</h2>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.path} className="group rounded-xl border border-[#E7F0EE] p-3 transition hover:-translate-y-0.5 hover:border-[#9AD8D2]">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.accent}`}><Icon className="h-4 w-4" /></div>
                  <p className="mt-3 text-xs font-bold leading-4 text-[#31585A]">{item.label}</p>
                  <ArrowUpRight className="mt-2 h-3.5 w-3.5 text-[#A6BABA] transition group-hover:text-[#08A6A0]" />
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
