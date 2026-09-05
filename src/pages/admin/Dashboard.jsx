import {
  Users,
  UserRound,
  Stethoscope,
  HeartPulse,
  CalendarDays,
  ClipboardList,
  IndianRupee,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,248",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Patients",
    value: "486",
    change: "+8.2%",
    icon: UserRound,
  },
  {
    title: "Doctors",
    value: "42",
    change: "+4.1%",
    icon: Stethoscope,
  },
  {
    title: "Nurses",
    value: "86",
    change: "+6.8%",
    icon: HeartPulse,
  },
  {
    title: "Active Bookings",
    value: "124",
    change: "+10.4%",
    icon: ClipboardList,
  },
  {
    title: "Appointments",
    value: "68",
    change: "+5.7%",
    icon: CalendarDays,
  },
  {
    title: "Revenue",
    value: "₹2.48L",
    change: "+14.2%",
    icon: IndianRupee,
  },
  {
    title: "Active Services",
    value: "10",
    change: "+2",
    icon: Activity,
  },
];

const recentBookings = [
  {
    patient: "Rahul Sharma",
    service: "Patient Care",
    date: "05 Sep 2026",
    status: "Confirmed",
  },
  {
    patient: "Priya Das",
    service: "Elder Care",
    date: "05 Sep 2026",
    status: "Pending",
  },
  {
    patient: "Amit Roy",
    service: "GNM Nurse",
    date: "04 Sep 2026",
    status: "Confirmed",
  },
  {
    patient: "Sneha Paul",
    service: "Baby Care",
    date: "04 Sep 2026",
    status: "Completed",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
          OVERVIEW
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-[#789092]">
          Monitor and manage your healthcare service operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#789092]">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#073F42]">
                    {stat.value}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold text-[#08A6A0]">
                {stat.change}{" "}
                <span className="font-medium text-[#8AA0A1]">
                  from last month
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent Bookings */}
        <section className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E8F0EF] px-5 py-4">
            <div>
              <h2 className="font-bold text-[#073F42]">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-[#819596]">
                Latest service booking activity
              </p>
            </div>

            <button
              type="button"
              className="text-xs font-semibold text-[#08A6A0] hover:text-[#078F8A]"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-[#E8F0EF]">
            {recentBookings.map((booking) => (
              <div
                key={`${booking.patient}-${booking.date}`}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-sm font-bold text-[#08A6A0]">
                    {booking.patient
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#173F41]">
                      {booking.patient}
                    </p>

                    <p className="mt-1 text-xs text-[#819596]">
                      {booking.service}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-xs text-[#819596]">
                    {booking.date}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                      booking.status === "Confirmed"
                        ? "bg-[#E5F8F5] text-[#087F7A]"
                        : booking.status === "Pending"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#073F42]">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-[#819596]">
            Common administrative tasks
          </p>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl bg-[#E8F8F6] p-3 text-left transition hover:bg-[#D7F4F1]"
            >
              <Users className="h-5 w-5 text-[#08A6A0]" />

              <div>
                <p className="text-sm font-semibold text-[#173F41]">
                  Manage Users
                </p>

                <p className="text-[11px] text-[#819596]">
                  View and manage accounts
                </p>
              </div>
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-xl bg-[#E8F8F6] p-3 text-left transition hover:bg-[#D7F4F1]"
            >
              <UserRound className="h-5 w-5 text-[#08A6A0]" />

              <div>
                <p className="text-sm font-semibold text-[#173F41]">
                  Add Patient
                </p>

                <p className="text-[11px] text-[#819596]">
                  Register a new patient
                </p>
              </div>
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-xl bg-[#E8F8F6] p-3 text-left transition hover:bg-[#D7F4F1]"
            >
              <Stethoscope className="h-5 w-5 text-[#08A6A0]" />

              <div>
                <p className="text-sm font-semibold text-[#173F41]">
                  Add Doctor
                </p>

                <p className="text-[11px] text-[#819596]">
                  Register medical staff
                </p>
              </div>
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-xl bg-[#E8F8F6] p-3 text-left transition hover:bg-[#D7F4F1]"
            >
              <ClipboardList className="h-5 w-5 text-[#08A6A0]" />

              <div>
                <p className="text-sm font-semibold text-[#173F41]">
                  Manage Bookings
                </p>

                <p className="text-[11px] text-[#819596]">
                  Review service requests
                </p>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Staff Overview */}
        <section className="rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#073F42]">
                Workforce Overview
              </h2>

              <p className="mt-1 text-xs text-[#819596]">
                Current healthcare workforce
              </p>
            </div>

            <Activity className="h-5 w-5 text-[#08A6A0]" />
          </div>

          <div className="mt-5 space-y-4">
            {[
              ["Doctors", 42, "Available"],
              ["Nurses", 86, "Available"],
              ["Care Staff", 64, "On Duty"],
            ].map(([role, count, status]) => (
              <div key={role}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#31585A]">
                    {role}
                  </span>

                  <span className="text-sm font-bold text-[#073F42]">
                    {count}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8F0EF]">
                  <div
                    className="h-full rounded-full bg-[#08A6A0]"
                    style={{
                      width: `${Math.min(count, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-[10px] text-[#819596]">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* System Status */}
        <section className="rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-bold text-[#073F42]">
              System Status
            </h2>

            <p className="mt-1 text-xs text-[#819596]">
              Current platform overview
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Booking System", "Operational"],
              ["Payment System", "Operational"],
              ["Notification System", "Operational"],
              ["Blood Management", "Operational"],
            ].map(([name, status]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl bg-[#F6FBFA] px-4 py-3"
              >
                <span className="text-sm font-medium text-[#31585A]">
                  {name}
                </span>

                <span className="flex items-center gap-2 text-xs font-semibold text-[#087F7A]">
                  <span className="h-2 w-2 rounded-full bg-[#08A6A0]" />
                  {status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;