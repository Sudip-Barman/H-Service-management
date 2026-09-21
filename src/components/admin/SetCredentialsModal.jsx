import { useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, X, ShieldCheck, CheckCircle2 } from "lucide-react";
import { apiRequest } from "../../api/api";

export default function SetCredentialsModal({
  open,
  employee,
  employeeType = "staff",
  onClose,
  onSuccess,
}) {
  const [username, setUsername] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (open && employee) {
      // Suggest a clean default username if none exists
      const cleanName = (employee.name || `${employee.first_name || ""} ${employee.last_name || ""}`.trim())
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 12);
      
      const suggestedPrefix = employeeType === "doctor" ? "dr_" : employeeType === "nurse" ? "nurse_" : "staff_";
      setUsername(employee.username || `${suggestedPrefix}${cleanName}`);
      setTemporaryPassword("TempPass@123");
      setError("");
      setSuccessMsg("");
    }
  }, [open, employee, employeeType]);

  if (!open || !employee) return null;

  const empName = employee.name || `${employee.first_name || ""} ${employee.last_name || ""}`.trim() || "Employee";
  const empEmail = employee.email || "";
  const empPhone = employee.phone || "";
  const empId = employee.id || employee.doctor_id || employee.nurse_id || 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setError("Username is required.");
      return;
    }
    if (cleanUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!temporaryPassword || temporaryPassword.length < 6) {
      setError("Temporary password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("/api/auth/set-employee-credentials", {
        method: "POST",
        body: JSON.stringify({
          employee_type: employeeType,
          employee_id: empId,
          username: cleanUsername,
          temporary_password: temporaryPassword,
          name: empName,
          email: empEmail,
          phone: empPhone,
        }),
      });

      setSuccessMsg(`Credentials set for @${cleanUsername}! First login password change is enforced.`);
      if (onSuccess) {
        onSuccess(res);
      }
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      console.error("Failed to set credentials:", err);
      setError(err?.message || "Failed to set credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#073F42]/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#D9E9E7] bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#CFE7E4] bg-[#E8F8F6] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08A6A0] text-white shadow-sm">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#073F42]">
                Workforce Login Account
              </h3>
              <p className="text-xs text-[#5D7B7D]">
                Configure access for {empName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#CFE7E4] bg-white/80 text-[#6F898A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-3 text-xs text-[#486B6D] space-y-1">
            <p className="font-semibold text-[#173F41]">Employee Details:</p>
            <p><span className="text-[#819596]">Role:</span> <span className="capitalize font-medium">{employeeType}</span></p>
            {empEmail ? <p><span className="text-[#819596]">Email:</span> {empEmail}</p> : null}
            {empPhone ? <p><span className="text-[#819596]">Phone:</span> {empPhone}</p> : null}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-[#173F41] mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
              placeholder="e.g. dr_smith"
              required
              className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/15"
            />
            <p className="mt-1 text-[11px] text-[#819596]">
              Used by the employee to log in to the Workforce portal.
            </p>
          </div>

          {/* Temporary Password */}
          <div>
            <label className="block text-xs font-bold text-[#173F41] mb-1">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={temporaryPassword}
                onChange={(e) => setTemporaryPassword(e.target.value)}
                placeholder="Enter temporary password"
                required
                className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-3 pr-10 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA0A1] hover:text-[#173F41]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2.5 rounded-xl bg-[#E8F8F6]/80 p-3 text-xs text-[#1D585A]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#08A6A0] mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Mandatory First-Time Password Change:</strong> When this employee logs in with this temporary password, they will be required to create their own new password before accessing the Workforce dashboard.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-[#D9E9E7] bg-white px-4 text-xs font-semibold text-[#31585A] transition hover:bg-[#F6F9F9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#08A6A0] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#078F8A] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
