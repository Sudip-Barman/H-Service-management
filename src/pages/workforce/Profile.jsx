import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  GraduationCap,
  Clock,
  ShieldCheck,
  Edit,
  ArrowLeft,
} from "lucide-react";

import WorkforceProfileCard from "../../components/workforce/WorkforceProfileCard";
import {
  getWorkforceUser,
  getRolePermissions,
} from "../../data/workforceData";

const Profile = ({ user }) => {
  const navigate = useNavigate();

  const employeeId = user?.id || "EMP-1001";
  const profile = getWorkforceUser(employeeId) || getWorkforceUser("EMP-1001");

  const role = profile?.role?.toLowerCase() || "staff";
  const permissions = getRolePermissions(role);

  if (!profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <User size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-[#073F42]">
            Profile Not Found
          </h2>
          <p className="mt-2 text-gray-500">
            We could not find your workforce profile.
          </p>
        </div>
      </div>
    );
  }

  const initials = profile.name
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleName =
    profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/workforce")}
        className="flex items-center gap-2 text-sm font-medium text-[#08A6A0] transition hover:text-[#073F42]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Profile Header */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="h-32 bg-[#073F42]" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#08A6A0] text-2xl font-bold text-white shadow-md">
                {initials}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#073F42]">
                    {profile.name}
                  </h1>

                  <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold capitalize text-[#08A6A0]">
                    {roleName}
                  </span>
                </div>

                <p className="mt-1 text-gray-500">
                  {profile.designation}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Employee ID: {profile.id}
                </p>
              </div>
            </div>

            <button
              className="flex w-fit items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078f8a]"
            >
              <Edit size={17} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile Card */}
        <div className="xl:col-span-1">
          <WorkforceProfileCard user={profile} />
        </div>

        {/* Details */}
        <div className="space-y-6 xl:col-span-2">
          {/* Personal & Contact Information */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                <User size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[#073F42]">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500">
                  Your basic contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoItem
                icon={<Phone size={18} />}
                label="Phone"
                value={profile.phone || "Not provided"}
              />

              <InfoItem
                icon={<Mail size={18} />}
                label="Email"
                value={profile.email || "Not provided"}
              />

              <InfoItem
                icon={<MapPin size={18} />}
                label="Department"
                value={profile.department || "Not provided"}
              />

              <InfoItem
                icon={<CalendarDays size={18} />}
                label="Joining Date"
                value={profile.joiningDate || "Not provided"}
              />
            </div>
          </section>

          {/* Professional Information */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                <Briefcase size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[#073F42]">
                  Professional Information
                </h2>
                <p className="text-sm text-gray-500">
                  Your role and professional details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoItem
                icon={<Briefcase size={18} />}
                label="Designation"
                value={profile.designation || "Not provided"}
              />

              <InfoItem
                icon={<GraduationCap size={18} />}
                label="Qualification"
                value={profile.qualification || "Not provided"}
              />

              <InfoItem
                icon={<Clock size={18} />}
                label="Experience"
                value={profile.experience || "Not provided"}
              />

              <InfoItem
                icon={<MapPin size={18} />}
                label="Department"
                value={profile.department || "Not provided"}
              />
            </div>
          </section>

          {/* Account Status */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[#073F42]">
                  Account & Access
                </h2>
                <p className="text-sm text-gray-500">
                  Your current access and permissions
                </p>
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Account Status
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Workforce account
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  profile.status?.toLowerCase() === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {profile.status || "Active"}
              </span>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#073F42]">
                Available Access
              </p>

              <div className="flex flex-wrap gap-2">
                {permissions.schedule && (
                  <PermissionBadge text="Schedule" />
                )}

                {permissions.appointments && (
                  <PermissionBadge text="Appointments" />
                )}

                {permissions.patients && (
                  <PermissionBadge text="Patients" />
                )}

                {permissions.assignments && (
                  <PermissionBadge text="Assignments" />
                )}

                {permissions.attendance && (
                  <PermissionBadge text="Attendance" />
                )}

                {permissions.leave && (
                  <PermissionBadge text="Leave Requests" />
                )}

                {permissions.medicalNotes && (
                  <PermissionBadge text="Medical Notes" />
                )}

                {permissions.prescriptions && (
                  <PermissionBadge text="Prescriptions" />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* Reusable information item */
const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#08A6A0]">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-[#073F42]">
          {value}
        </p>
      </div>
    </div>
  );
};

/* Permission badge */
const PermissionBadge = ({ text }) => {
  return (
    <span className="rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-medium text-[#087d79]">
      {text}
    </span>
  );
};

export default Profile;