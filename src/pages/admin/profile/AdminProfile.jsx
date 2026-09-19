import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Phone,
  Building2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
} from "lucide-react";
import { apiRequest } from "../../../api/api";

const AdminProfile = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    name: user?.name || "System Administrator",
    email: user?.email || "admin@carecore.com",
    username: user?.username || "admin",
    phone: "+1 (555) 234-5678",
    department: "Executive & Hospital Operations",
    hospitalName: "CareCore General Hospital",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [toast, setToast] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      // Update local storage user
      const updatedUser = { ...user, name: formData.name, email: formData.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      showToast("Profile details updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      showToast("Please enter both current and new passwords.", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    setChangingPassword(true);
    try {
      // Call auth change password or user update
      await apiRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword,
        }),
      });
      showToast("Password changed successfully!", "success");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showToast(err.message || "Failed to update password. Verify current password.", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12 pt-2">
      {/* TOAST ALERT */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all duration-300 ${
            toast.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700 shadow-red-500/10"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-500/10"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#DCEBE9] bg-gradient-to-r from-[#073F42] to-[#087F7A] p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold backdrop-blur-sm border border-white/20">
              {formData.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold sm:text-2xl">{formData.name}</h1>
                <span className="rounded-full bg-[#08A6A0]/40 px-2.5 py-0.5 text-xs font-semibold tracking-wide border border-[#08A6A0]/60">
                  Super Admin
                </span>
              </div>
              <p className="mt-1 text-sm text-[#C8E9E6]">{formData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#E1F3F1]">
            <Building2 className="h-4 w-4" />
            <span>CareCore General Hospital • System ID: #ADM-001</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info Form (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#DCEBE9] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#E8F0EF] pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#073F42]">Administrator Profile</h2>
              <p className="text-xs text-[#819596]">Manage your administrative personal and contact details</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#31585A]">Full Name</label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    className="h-10 w-full rounded-xl border border-[#DCEBE9] bg-[#F8FCFB] pl-10 pr-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#31585A]">Username</label>
                <div className="relative mt-1.5">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled
                    className="h-10 w-full rounded-xl border border-[#DCEBE9] bg-[#F1F6F5] pl-10 pr-3 text-sm text-[#718889] outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#31585A]">Email Address</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className="h-10 w-full rounded-xl border border-[#DCEBE9] bg-[#F8FCFB] pl-10 pr-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#31585A]">Phone Number</label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className="h-10 w-full rounded-xl border border-[#DCEBE9] bg-[#F8FCFB] pl-10 pr-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#31585A]">Department / Role Responsibility</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleProfileChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[#DCEBE9] bg-[#F8FCFB] px-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {savingProfile ? "Saving..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card (1 Col) */}
        <div className="rounded-2xl border border-[#DCEBE9] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#E8F0EF] pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#073F42]">Security & Password</h2>
              <p className="text-xs text-[#819596]">Keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#31585A]">Current Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-xl border border-[#DCEBE9] bg-[#F8FCFB] pl-10 pr-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#31585A]">New Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Min. 6 characters"
                  className="h-10 w-full rounded-xl border border-[#DCEBE9] bg-[#F8FCFB] pl-10 pr-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#31585A]">Confirm New Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repeat new password"
                  className="h-10 w-full rounded-xl border border-[#DCEBE9] bg-[#F8FCFB] pl-10 pr-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#08A6A0] bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A] disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
