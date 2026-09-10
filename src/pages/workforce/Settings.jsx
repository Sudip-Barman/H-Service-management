import { useState } from "react";
import {
  Bell,
  Lock,
  ShieldCheck,
  UserRound,
  Mail,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import { getWorkforceUser } from "../../data/workforceData";

export default function Settings({ user }) {
  const employeeId = user?.id || "EMP-1001";
  const profile = getWorkforceUser(employeeId);

  const [notifications, setNotifications] = useState({
    appointments: true,
    attendance: true,
    assignments: true,
    system: true,
  });

  const [privacy, setPrivacy] = useState({
    showPhone: true,
    showEmail: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const toggleNotification = (key) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const togglePrivacy = (key) => {
    setPrivacy((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#073F42]">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account, notifications, privacy, and security settings.
        </p>
      </div>

      {/* Save Message */}
      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={18} />
          <span>Your settings have been saved successfully.</span>
        </div>
      )}

      {/* Account Information */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#073F42]">
                Account Information
              </h2>

              <p className="text-sm text-gray-500">
                Basic information connected to your workforce account.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
              <UserRound size={17} className="text-gray-400" />

              <span className="text-sm text-gray-700">
                {profile?.name || "Workforce User"}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Employee ID
            </label>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
              {profile?.id || employeeId}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
              <Mail size={17} className="text-gray-400" />

              <span className="truncate text-sm text-gray-700">
                {profile?.email || "Not available"}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
              <Smartphone size={17} className="text-gray-400" />

              <span className="text-sm text-gray-700">
                {profile?.phone || "Not available"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <Bell size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#073F42]">
                Notification Settings
              </h2>

              <p className="text-sm text-gray-500">
                Choose which updates you want to receive.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {[
            {
              key: "appointments",
              title: "Appointments",
              description:
                "Receive notifications about new and updated appointments.",
            },
            {
              key: "attendance",
              title: "Attendance",
              description:
                "Receive reminders and updates related to attendance.",
            },
            {
              key: "assignments",
              title: "Assignments",
              description:
                "Receive notifications when work assignments are created or changed.",
            },
            {
              key: "system",
              title: "System Notifications",
              description:
                "Receive important CareCore system announcements.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleNotification(item.key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications[item.key]
                    ? "bg-[#08A6A0]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    notifications[item.key]
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Settings */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#073F42]">
                Privacy Settings
              </h2>

              <p className="text-sm text-gray-500">
                Control what contact information is visible to authorized
                workforce users.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {[
            {
              key: "showPhone",
              title: "Show Phone Number",
              description:
                "Allow authorized hospital staff to view your phone number.",
            },
            {
              key: "showEmail",
              title: "Show Email Address",
              description:
                "Allow authorized hospital staff to view your email address.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => togglePrivacy(item.key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  privacy[item.key]
                    ? "bg-[#08A6A0]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    privacy[item.key] ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Change Password */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <Lock size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#073F42]">
                Change Password
              </h2>

              <p className="text-sm text-gray-500">
                Update your workforce account password.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
          {/* Current Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => ({
                    ...current,
                    current: !current.current,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.current ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => ({
                    ...current,
                    new: !current.new,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => ({
                    ...current,
                    confirm: !current.confirm,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-500">
            Use a strong password containing a combination of letters,
            numbers, and special characters.
          </p>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#078f8a]"
        >
          <Save size={17} />
          Save Changes
        </button>
      </div>
    </div>
  );
}