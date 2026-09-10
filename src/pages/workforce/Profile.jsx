import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  CalendarDays,
  ShieldCheck,
  Building2,
  Clock3,
  Pencil,
  CheckCircle2,
  ArrowRight,
  IdCard,
  Bell,
  CalendarClock,
  FileText,
  Award,
  Activity,
} from "lucide-react";

import {
  getWorkforceUser,
  getRolePermissions,
} from "../../data/workforceData";

export default function Profile({ user }) {
  const navigate = useNavigate();

  const employeeId = user?.id || "EMP-1001";

  const workforceUser = useMemo(() => {
    return (
      getWorkforceUser(employeeId) ||
      getWorkforceUser("EMP-1001")
    );
  }, [employeeId]);

  const role = workforceUser?.role?.toLowerCase() || "staff";
  const permissions = getRolePermissions(role);

  const getRoleLabel = () => {
    if (role === "doctor") return "Doctor";
    if (role === "nurse") return "Nurse";
    return "Staff";
  };

  const getInitials = (name = "") => {
    return name
      .replace("Dr. ", "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getProfessionalSummary = () => {
    if (role === "doctor") {
      return `Dedicated ${workforceUser?.designation || "medical professional"} working in ${
        workforceUser?.department || "hospital services"
      }. Responsible for delivering quality patient care and supporting clinical operations at CareCore.`;
    }

    if (role === "nurse") {
      return `Experienced ${
        workforceUser?.designation || "nursing professional"
      } working in ${
        workforceUser?.department || "nursing services"
      }. Focused on patient care, clinical support and maintaining high standards of hospital service.`;
    }

    return `Experienced ${
      workforceUser?.designation || "hospital staff member"
    } working with ${
      workforceUser?.department || "hospital services"
    }. Responsible for supporting daily hospital operations and delivering dependable patient services.`;
  };

  const initials = getInitials(workforceUser?.name);

  const accessItems = [
    {
      label: "Appointments",
      enabled: permissions.appointments,
    },
    {
      label: "Patient Records",
      enabled: permissions.patients,
    },
    {
      label: "Assignments",
      enabled: permissions.assignments,
    },
    {
      label: "Attendance",
      enabled: permissions.attendance,
    },
    {
      label: "Leave Requests",
      enabled: permissions.leave,
    },
    {
      label: "Schedule",
      enabled: permissions.schedule,
    },
    {
      label: "Medical Notes",
      enabled: permissions.medicalNotes,
    },
    {
      label: "Prescriptions",
      enabled: permissions.prescriptions,
    },
  ];

  const quickActions = [
    {
      label: "My Schedule",
      description: "View your work schedule",
      icon: CalendarClock,
      path: "/workforce/schedule",
    },
    {
      label: "Attendance",
      description: "Check attendance records",
      icon: Clock3,
      path: "/workforce/attendance",
    },
    {
      label: "Notifications",
      description: "View recent updates",
      icon: Bell,
      path: "/workforce/notifications",
    },
    {
      label: "Settings",
      description: "Manage account settings",
      icon: ShieldCheck,
      path: "/workforce/settings",
    },
  ];

  return (
    <div className="space-y-6">
      {/* =====================================================
          PROFILE HERO
      ====================================================== */}
      <section className="relative overflow-hidden rounded-2xl bg-[#073F42] shadow-sm">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[45px] border-[#08A6A0]/20" />

        <div className="pointer-events-none absolute -bottom-32 right-32 h-64 w-64 rounded-full border-[35px] border-white/5" />

        <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          {/* Top label */}
          <div className="mb-7 flex items-center gap-2 text-xs font-medium text-[#B8CDCD]">
            <span className="h-2 w-2 rounded-full bg-[#4ED3C9]" />
            WORKFORCE PROFILE
          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            {/* Identity */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-white/20 bg-[#08A6A0] text-3xl font-bold text-white shadow-xl sm:h-32 sm:w-32 sm:text-4xl">
                {initials}
              </div>

              {/* Information */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    {workforceUser?.name || "Workforce User"}
                  </h1>

                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 size={13} />
                    {workforceUser?.status || "Active"}
                  </span>
                </div>

                <p className="mt-2 text-base font-medium text-[#63D8D1]">
                  {workforceUser?.designation || getRoleLabel()}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#B8CDCD]">
                  <span className="flex items-center gap-2">
                    <Building2 size={15} />
                    {workforceUser?.department || "Hospital Services"}
                  </span>

                  <span className="flex items-center gap-2">
                    <IdCard size={15} />
                    {workforceUser?.employeeId || employeeId}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#073F42] shadow-sm transition hover:bg-[#E8F8F6] sm:w-fit"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROFESSIONAL SNAPSHOT
      ====================================================== */}
      <section className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#DDEBEA] bg-white shadow-sm sm:grid-cols-4">
        <SnapshotItem
          icon={GraduationCap}
          label="Qualification"
          value={workforceUser?.qualification || "Not available"}
        />

        <SnapshotItem
          icon={Award}
          label="Experience"
          value={workforceUser?.experience || "Not available"}
        />

        <SnapshotItem
          icon={Building2}
          label="Department"
          value={workforceUser?.department || "Hospital Services"}
        />

        <SnapshotItem
          icon={Activity}
          label="Status"
          value={workforceUser?.status || "Active"}
          status
        />
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">
        {/* =================================================
            LEFT COLUMN
        ================================================== */}
        <div className="space-y-6">
          {/* Professional Profile */}
          <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
            <SectionHeader
              icon={UserRound}
              title="Professional Profile"
              subtitle="Your professional identity at CareCore"
            />

            <div className="px-5 py-6 sm:px-7">
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                {getProfessionalSummary()}
              </p>

              {/* Qualification */}
              <div className="mt-7 border-t border-[#E8EFEF] pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <GraduationCap
                    size={17}
                    className="text-[#08A6A0]"
                  />

                  <h3 className="text-sm font-semibold text-[#073F42]">
                    Qualification & Experience
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProfessionalItem
                    label="Qualification"
                    value={workforceUser?.qualification}
                  />

                  <ProfessionalItem
                    label="Experience"
                    value={workforceUser?.experience}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
            <SectionHeader
              icon={Phone}
              title="Contact Information"
              subtitle="Your registered contact details"
            />

            <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
              <ContactItem
                icon={Phone}
                label="Phone Number"
                value={workforceUser?.phone}
              />

              <ContactItem
                icon={Mail}
                label="Email Address"
                value={workforceUser?.email}
              />

              <ContactItem
                icon={MapPin}
                label="Location"
                value={workforceUser?.location || "CareCore Hospital"}
              />

              <ContactItem
                icon={IdCard}
                label="Employee ID"
                value={workforceUser?.employeeId || employeeId}
              />
            </div>
          </section>

          {/* Employment Details */}
          <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
            <SectionHeader
              icon={BriefcaseBusiness}
              title="Employment Details"
              subtitle="Your current position and work information"
            />

            <div className="px-5 py-6 sm:px-7">
              <div className="relative ml-2 border-l-2 border-[#DDEBEA] pl-7">
                <div className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#08A6A0] ring-4 ring-[#E8F8F6]" />

                <p className="text-xs font-medium uppercase tracking-wide text-[#08A6A0]">
                  Current Position
                </p>

                <h3 className="mt-1 text-lg font-semibold text-[#073F42]">
                  {workforceUser?.designation || getRoleLabel()}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {workforceUser?.department || "Hospital Services"}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProfessionalItem
                    icon={CalendarDays}
                    label="Joining Date"
                    value={
                      workforceUser?.joiningDate || "Not available"
                    }
                  />

                  <ProfessionalItem
                    icon={Building2}
                    label="Work Location"
                    value={
                      workforceUser?.location || "CareCore Hospital"
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================== */}
        <div className="space-y-6">
          {/* Account Status */}
          <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
            <SectionHeader
              icon={ShieldCheck}
              title="Account Status"
              subtitle="Your CareCore workforce account"
            />

            <div className="p-5">
              <div className="rounded-xl bg-[#E8F8F6] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#08A6A0]">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#073F42]">
                      Account Active
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Your workforce access is currently enabled
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <DetailRow
                  label="Employee ID"
                  value={workforceUser?.employeeId || employeeId}
                />

                <DetailRow
                  label="Account Role"
                  value={getRoleLabel()}
                />

                <DetailRow
                  label="Department"
                  value={
                    workforceUser?.department || "Hospital Services"
                  }
                />

                <DetailRow
                  label="Status"
                  value={workforceUser?.status || "Active"}
                  status
                />
              </div>
            </div>
          </section>

          {/* Role Access */}
          <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
            <SectionHeader
              icon={ShieldCheck}
              title="Role Access"
              subtitle={`${getRoleLabel()} permissions`}
            />

            <div className="divide-y divide-[#E8EFEF] px-5">
              {accessItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 py-3.5"
                >
                  <span className="text-sm text-slate-600">
                    {item.label}
                  </span>

                  {item.enabled ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 size={15} />
                      Enabled
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                      Restricted
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Account Security */}
          <section className="rounded-2xl border border-[#DDEBEA] bg-white p-5 shadow-sm">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#073F42]">
                  Account Security
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Keep your account information and password secure.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/workforce/settings")}
                  className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[#087F7B] transition hover:text-[#056966]"
                >
                  Security Settings
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================
          QUICK ACCESS
      ====================================================== */}
      <section className="rounded-2xl border border-[#DDEBEA] bg-white shadow-sm">
        <div className="border-b border-[#E8EFEF] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <ArrowRight size={18} />
            </div>

            <div>
              <h2 className="font-semibold text-[#073F42]">
                Quick Access
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Frequently used workforce modules
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[#E8EFEF] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate(action.path)}
                className="group flex items-center gap-3 px-5 py-5 text-left transition hover:bg-[#F8FBFB]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0] transition group-hover:bg-[#08A6A0] group-hover:text-white">
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#073F42]">
                    {action.label}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {action.description}
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#08A6A0]"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer Note */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#DDEBEA] bg-[#F8FBFB] px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Profile information is maintained by CareCore administration.
        </span>

        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} />
          Secure Workforce Account
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E8EFEF] px-5 py-4 sm:px-7">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
        <Icon size={18} />
      </div>

      <div>
        <h2 className="font-semibold text-[#073F42]">{title}</h2>

        <p className="mt-0.5 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   SNAPSHOT ITEM
============================================================ */

function SnapshotItem({
  icon: Icon,
  label,
  value,
  status = false,
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E8EFEF] px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 truncate text-sm font-semibold ${
            status ? "text-emerald-600" : "text-[#073F42]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   CONTACT ITEM
============================================================ */

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#E8EFEF] p-4 transition hover:border-[#CFE5E3] hover:bg-[#FAFEFE]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-[#073F42]">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   PROFESSIONAL ITEM
============================================================ */

function ProfessionalItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F8F8] text-[#08A6A0]">
          <Icon size={15} />
        </div>
      )}

      <div>
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-1 text-sm font-medium text-[#073F42]">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL ROW
============================================================ */

function DetailRow({
  label,
  value,
  status = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className={`text-right text-sm font-medium ${
          status ? "text-emerald-600" : "text-[#073F42]"
        }`}
      >
        {value || "Not available"}
      </span>
    </div>
  );
}