import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  KeyRound,
  LogOut,
  Mail,
  Moon,
  Monitor,
  Palette,
  ShieldCheck,
  Smartphone,
  Sun,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getWorkforceUser } from "../../data/workforceData";
import { apiRequest } from "../../api/api";

const Settings = ({ user }) => {
  const navigate = useNavigate();

  const employeeId =
    user?.employeeId ||
    user?.id ||
    localStorage.getItem("employeeId") ||
    "EMP-1001";

  const profile =
    getWorkforceUser(employeeId) ||
    getWorkforceUser("EMP-1001");

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!currentPassword || !newPassword) {
      setPasswordError("Please enter both current and new password.");
      return;
    }
    setPasswordLoading(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          email: profile?.email || user?.email,
        }),
      });
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 1800);
    } catch (err) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const [preferences, setPreferences] = useState({
    email:
      localStorage.getItem(
        "workforce_email_notifications"
      ) !== "false",

    push:
      localStorage.getItem(
        "workforce_push_notifications"
      ) !== "false",

    appointment:
      localStorage.getItem(
        "workforce_appointment_notifications"
      ) !== "false",

    sound:
      localStorage.getItem(
        "workforce_notification_sound"
      ) !== "false",

    theme:
      localStorage.getItem(
        "workforce_theme"
      ) || "light",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "workforce_email_notifications",
      String(preferences.email)
    );

    localStorage.setItem(
      "workforce_push_notifications",
      String(preferences.push)
    );

    localStorage.setItem(
      "workforce_appointment_notifications",
      String(preferences.appointment)
    );

    localStorage.setItem(
      "workforce_notification_sound",
      String(preferences.sound)
    );

    localStorage.setItem(
      "workforce_theme",
      preferences.theme
    );

    setSaved(true);

    const timer = setTimeout(() => {
      setSaved(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("employeeId");

    window.dispatchEvent(
      new Event("auth-change")
    );

    navigate("/login");
  };

  const fullName =
    profile?.name ||
    user?.name ||
    "Workforce User";

  const role =
    profile?.role ||
    user?.role ||
    "Staff";

  const department =
    profile?.department ||
    "Hospital Services";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "WU";

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* ================================================================ */}
      {/* Header                                                           */}
      {/* ================================================================ */}

      <div className="flex flex-col gap-3 border-b border-[#DCEBE9] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#08A6A0]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#08A6A0]">
              Account Settings
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[#073F42] sm:text-3xl">
            Settings
          </h1>

          <p className="mt-1.5 text-sm text-[#6B7F7B]">
            Manage your account, notifications and
            preferences.
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 text-xs font-medium transition-opacity ${
            saved
              ? "opacity-100 text-[#16834A]"
              : "opacity-0"
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          Saved
        </div>
      </div>

      {/* ================================================================ */}
      {/* Account                                                          */}
      {/* ================================================================ */}

      <SettingsGroup
        title="Account"
        description="Your CareCore workforce account."
      >
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-base font-semibold text-[#087F7A]">
              {initials}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-[#073F42]">
                {fullName}
              </h2>

              <p className="mt-1 text-xs capitalize text-[#819596]">
                {role} · {department}
              </p>

              <p className="mt-1 text-[11px] text-[#9AAEAF]">
                Employee ID:{" "}
                <span className="font-medium text-[#55716E]">
                  {profile?.id || employeeId}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/workforce/profile")
            }
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#DCEBE9] px-4 text-xs font-semibold text-[#31585A] transition hover:border-[#B9DAD6] hover:bg-[#F5FAF9] hover:text-[#087F7A]"
          >
            <UserRound className="h-3.5 w-3.5" />
            View profile
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </SettingsGroup>

      {/* ================================================================ */}
      {/* Notifications                                                     */}
      {/* ================================================================ */}

      <SettingsGroup
        icon={<Bell className="h-4 w-4" />}
        title="Notifications"
        description="Control how CareCore keeps you informed."
      >
        <PreferenceRow
          icon={<Mail className="h-4 w-4" />}
          title="Email notifications"
          description="Receive important workforce updates by email."
          value={preferences.email}
          onChange={(value) =>
            updatePreference("email", value)
          }
        />

        <PreferenceRow
          icon={<Smartphone className="h-4 w-4" />}
          title="Push notifications"
          description="Receive notifications while using the workforce portal."
          value={preferences.push}
          onChange={(value) =>
            updatePreference("push", value)
          }
        />

        <PreferenceRow
          icon={<Bell className="h-4 w-4" />}
          title="Appointment notifications"
          description="Get notified about upcoming or changed appointments."
          value={preferences.appointment}
          onChange={(value) =>
            updatePreference(
              "appointment",
              value
            )
          }
        />

        <PreferenceRow
          icon={<Volume2 className="h-4 w-4" />}
          title="Notification sounds"
          description="Play a sound when a new notification is received."
          value={preferences.sound}
          onChange={(value) =>
            updatePreference("sound", value)
          }
          last
        />
      </SettingsGroup>

      {/* ================================================================ */}
      {/* Appearance                                                        */}
      {/* ================================================================ */}

      <SettingsGroup
        icon={<Palette className="h-4 w-4" />}
        title="Appearance"
        description="Choose how the workforce portal appears."
      >
        <div className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#073F42]">
                Theme
              </p>

              <p className="mt-1 text-xs text-[#819596]">
                Select the interface appearance you prefer.
              </p>
            </div>

            <div className="flex rounded-lg border border-[#DCEBE9] bg-[#F8FCFB] p-1">
              <ThemeOption
                icon={
                  <Sun className="h-3.5 w-3.5" />
                }
                label="Light"
                active={
                  preferences.theme === "light"
                }
                onClick={() =>
                  updatePreference(
                    "theme",
                    "light"
                  )
                }
              />

              <ThemeOption
                icon={
                  <Moon className="h-3.5 w-3.5" />
                }
                label="Dark"
                active={
                  preferences.theme === "dark"
                }
                onClick={() =>
                  updatePreference(
                    "theme",
                    "dark"
                  )
                }
              />

              <ThemeOption
                icon={
                  <Monitor className="h-3.5 w-3.5" />
                }
                label="System"
                active={
                  preferences.theme === "system"
                }
                onClick={() =>
                  updatePreference(
                    "theme",
                    "system"
                  )
                }
              />
            </div>
          </div>
        </div>
      </SettingsGroup>

      {/* ================================================================ */}
      {/* Security                                                         */}
      {/* ================================================================ */}

      <SettingsGroup
        icon={<ShieldCheck className="h-4 w-4" />}
        title="Security"
        description="Manage your account security."
      >
        <SettingsAction
          icon={<KeyRound className="h-4 w-4" />}
          title="Password"
          description="Change your CareCore account password."
          action="Change password"
          onClick={() => {
            setPasswordError("");
            setPasswordSuccess("");
            setPasswordModalOpen(true);
          }}
        />

        <SettingsAction
          icon={<ShieldCheck className="h-4 w-4" />}
          title="Account security"
          description="Your account is protected by your hospital login credentials."
          action="View details"
          onClick={() => {}}
          last
        />
      </SettingsGroup>

      {/* ================================================================ */}
      {/* Session                                                          */}
      {/* ================================================================ */}

      <SettingsGroup
        title="Session"
        description="Manage your current login session."
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF5F5] text-[#A34A4A]">
              <LogOut className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#073F42]">
                Sign out
              </p>

              <p className="mt-1 text-xs text-[#819596]">
                Sign out from this device and return to the
                login page.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="h-9 rounded-lg border border-[#E5CCCC] px-4 text-xs font-semibold text-[#A34A4A] transition hover:bg-[#FFF7F7]"
          >
            Sign out
          </button>
        </div>
      </SettingsGroup>

      {/* ================================================================ */}
      {/* Footer Note                                                      */}
      {/* ================================================================ */}

      <div className="flex items-start gap-3 rounded-xl border border-[#DCEBE9] bg-[#F8FCFB] p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#08A6A0]" />

        <p className="text-[11px] leading-5 text-[#819596]">
          Your workforce settings are stored for this
          device. Hospital-level configuration and staff
          administration are managed from the Admin Portal.
        </p>
      </div>

      {/* Password Change Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#073F42]">Change Password</h3>
                  <p className="text-xs text-gray-500">Update your account credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
              {passwordError && (
                <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="rounded-xl bg-green-50 p-3 text-xs font-medium text-green-700">
                  {passwordSuccess}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/15"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/15"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-xl bg-[#08A6A0] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#078f8a] disabled:opacity-50"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

/* ========================================================================== */
/* Settings Group                                                             */
/* ========================================================================== */

const SettingsGroup = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-[#DCEBE9] bg-white">
      <div className="flex items-start gap-3 border-b border-[#E8F0EF] px-5 py-4">
        {icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#087F7A]">
            {icon}
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-[#073F42]">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-[#819596]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
};

/* ========================================================================== */
/* Preference Row                                                             */
/* ========================================================================== */

const PreferenceRow = ({
  icon,
  title,
  description,
  value,
  onChange,
  last = false,
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-4 ${
        !last
          ? "border-b border-[#E8F0EF]"
          : ""
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F5F9F8] text-[#55716E]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[#073F42]">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#819596]">
            {description}
          </p>
        </div>
      </div>

      <Toggle
        checked={value}
        onChange={onChange}
      />
    </div>
  );
};

/* ========================================================================== */
/* Settings Action                                                            */
/* ========================================================================== */

const SettingsAction = ({
  icon,
  title,
  description,
  action,
  onClick,
  last = false,
}) => {
  return (
    <div
      className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
        !last
          ? "border-b border-[#E8F0EF]"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F5F9F8] text-[#55716E]">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-[#073F42]">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#819596]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#DCEBE9] px-3 text-xs font-medium text-[#55716E] transition hover:border-[#B9DAD6] hover:bg-[#F5FAF9] hover:text-[#087F7A]"
      >
        {action}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

/* ========================================================================== */
/* Toggle                                                                     */
/* ========================================================================== */

const Toggle = ({
  checked,
  onChange,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition ${
        checked
          ? "bg-[#08A6A0]"
          : "bg-[#C7D6D4]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked
            ? "translate-x-5"
            : "translate-x-1"
        }`}
      />
    </button>
  );
};

/* ========================================================================== */
/* Theme Option                                                               */
/* ========================================================================== */

const ThemeOption = ({
  icon,
  label,
  active,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition ${
        active
          ? "bg-white text-[#073F42] shadow-sm"
          : "text-[#819596] hover:text-[#31585A]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};
