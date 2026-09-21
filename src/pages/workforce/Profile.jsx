import { useEffect, useMemo, useState } from "react";
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
  CheckCircle2,
  ArrowRight,
  IdCard,
  CalendarClock,
  Award,
  Activity,
  LockKeyhole,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

import {
  getRolePermissions,
} from "../../data/workforceData";
import { apiRequest } from "../../api/api";

export default function Profile({ user }) {
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }, []);

  const [currentUser, setCurrentUser] = useState(storedUser);

  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const fresh = await apiRequest("/api/auth/me");
        if (fresh) {
          setCurrentUser(fresh);
          localStorage.setItem("user", JSON.stringify(fresh));
        }
      } catch (err) {
        console.warn("Could not fetch fresh me profile:", err);
      }
    };
    fetchFreshProfile();
  }, []);

  const workforceUser = useMemo(() => {
    const prof = currentUser?.profile || {};
    return {
      name: currentUser?.name || prof.name || "Workforce User",
      email: currentUser?.email || prof.email || "",
      phone: currentUser?.phone || prof.phone || "",
      role: currentUser?.role || "staff",
      designation: prof.specialization || prof.qualification || currentUser?.role || "Hospital Staff",
      department: prof.department || "General",
      employeeId: prof.registration_number || (currentUser?.id ? `EMP-${1000 + currentUser.id}` : ""),
      qualification: prof.qualification || "",
      experience: prof.experience_years ? `${prof.experience_years} Years` : (prof.experience || ""),
      status: prof.status || "Active",
    };
  }, [currentUser]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showToast("Please fill in all password fields", "error");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      await apiRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          email: workforceUser?.email || null,
        }),
      });
      showToast("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Change password error:", err);
      showToast(err.message || "Failed to update password", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

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
      description: "View and request work schedules",
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
      label: "Help & Support",
      description: "Get assistance from hospital support",
      icon: HelpCircle,
      path: "/workforce/help",
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

            {/* Read-only Badge */}
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm sm:w-fit">
              <ShieldCheck size={18} className="text-[#63D8D1]" />
              Verified Staff Account
            </div>
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

          {/* Change Password */}
          <section className="rounded-2xl border border-[#DDEBEA] bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#E8EFEF] pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                <LockKeyhole size={20} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#073F42]">
                  Change Password
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Update your workforce account password
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#31585A]">
                  Current Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                    required
                    className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 pr-10 text-xs sm:text-sm text-[#31585A] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#31585A]">
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNew ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password (min. 6 characters)"
                    required
                    className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 pr-10 text-xs sm:text-sm text-[#31585A] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#31585A]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                  required
                  className="mt-1 h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#31585A] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A] disabled:opacity-60"
              >
                <LockKeyhole size={15} />
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
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

      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 z-50
            flex items-center gap-2.5
            rounded-2xl px-5 py-3.5
            text-sm font-semibold text-white shadow-2xl
            transition-all duration-300
            ${toast.type === "error" ? "bg-red-600" : "bg-[#08A6A0]"}
          `}
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