import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  KeyRound,
  Eye,
  EyeOff,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { apiRequest } from "../../api/api";
import { useHospitalSettings } from "../../context/HospitalSettingsContext";
import { clearTemporaryPassword } from "../../utils/temporaryPasswords";

const FirstTimePassword = () => {
  const navigate = useNavigate();
  const { settings } = useHospitalSettings();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get current logged-in user from localStorage
  const storedUserStr = localStorage.getItem("user");
  const currentUser = storedUserStr ? JSON.parse(storedUserStr) : null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("demoUser");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.currentPassword) {
      setError("Please enter your current temporary password.");
      return;
    }

    if (!formData.newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setError("New password cannot be the same as your temporary password.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword,
        }),
      });

      // Update user in local storage to set must_change_password = false
      const updatedUser = {
        ...(currentUser || {}),
        ...(response?.user || {}),
        must_change_password: false,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("demoUser", JSON.stringify(updatedUser));
      clearTemporaryPassword(updatedUser);
      window.dispatchEvent(new CustomEvent("user-updated", { detail: updatedUser }));

      setSuccess(true);

      // Redirect to workforce portal after short delay
      setTimeout(() => {
        if (updatedUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/workforce");
        }
      }, 1200);
    } catch (err) {
      console.error("Change password error:", err);
      setError(
        err.message ||
          "Failed to update password. Please verify your temporary password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F9F8] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* BRANDING HEADER */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#08A6A0] text-2xl font-bold text-white shadow-lg shadow-[#08A6A0]/25">
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt="Logo"
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              "+"
            )}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-[#073F42]">
            {settings?.hospitalName || "CareCore Hospital"}
          </h1>
          <p className="mt-1 text-xs text-[#789092]">
            Workforce Portal Onboarding
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="rounded-3xl border border-[#D9E9E7] bg-white p-6 shadow-xl shadow-[#08A6A0]/5 sm:p-8">
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-amber-900">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-amber-950">
                Password Change Required
              </p>
              <p className="mt-0.5 text-amber-800">
                You logged in using a temporary password. You must set a permanent, secure password before continuing.
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="mb-5 flex items-center justify-between rounded-xl bg-[#F0F7F6] px-3.5 py-2.5 text-xs text-[#31585A]">
              <div>
                <span className="text-[#789092]">Account: </span>
                <span className="font-bold text-[#073F42]">
                  {currentUser.name || currentUser.username || currentUser.email}
                </span>
              </div>
              <span className="rounded-full bg-[#08A6A0]/10 px-2.5 py-0.5 font-semibold capitalize text-[#08A6A0]">
                {currentUser.role || "Workforce"}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Password updated successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CURRENT / TEMPORARY PASSWORD */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-1 block text-xs font-semibold text-[#31585A]"
              >
                Temporary / Current Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter temporary password"
                  disabled={loading || success}
                  autoComplete="current-password"
                  className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-9 pr-10 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA0A1] hover:text-[#08A6A0]"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-1 block text-xs font-semibold text-[#31585A]"
              >
                New Permanent Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  disabled={loading || success}
                  autoComplete="new-password"
                  className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-9 pr-10 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA0A1] hover:text-[#08A6A0]"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-xs font-semibold text-[#31585A]"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  disabled={loading || success}
                  autoComplete="new-password"
                  className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-9 pr-10 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA0A1] hover:text-[#08A6A0]"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || success}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#08A6A0] text-sm font-semibold text-white shadow-lg shadow-[#08A6A0]/25 transition hover:bg-[#078F8A] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Save Password & Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* LOGOUT BUTTON */}
          <div className="mt-5 border-t border-[#EDF4F3] pt-4 text-center">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#789092] transition hover:text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out & return to sign in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimePassword;
