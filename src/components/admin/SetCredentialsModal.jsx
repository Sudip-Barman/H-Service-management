import { useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, X, ShieldCheck, Copy, Check } from "lucide-react";
import { getTemporaryPassword, getSavedUsername } from "../../utils/temporaryPasswords";

export default function SetCredentialsModal({
  open,
  employee,
  employeeType = "staff",
  onClose,
}) {
  const [username, setUsername] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (open && employee) {
      // Retrieve actual registered username (object or cached from registration)
      const actualUsername =
        employee.username ||
        getSavedUsername(employee, employeeType) ||
        "";
      setUsername(actualUsername);

      // Retrieve actual temporary password (object or cached from registration)
      const actualPassword =
        employee.temporary_password ||
        getTemporaryPassword(employee, employeeType) ||
        "";
      setTemporaryPassword(actualPassword);
      setShowPassword(false);
      setCopiedField(null);
    }
  }, [open, employee, employeeType]);

  if (!open || !employee) return null;

  const empName =
    employee.name ||
    `${employee.first_name || ""} ${employee.last_name || ""}`.trim() ||
    "Employee";
  const empEmail = employee.email || "";
  const empPhone = employee.phone || "";
  const empRole = employee.role || employeeType || "Staff";

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
                Workforce Credentials
              </h3>
              <p className="text-xs text-[#5D7B7D]">
                Generated access credentials for {empName}
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
        <div className="p-5 space-y-4">
          {/* Employee Summary Card */}
          <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-3 text-xs text-[#486B6D] space-y-1">
            <p className="font-semibold text-[#173F41]">Employee Details:</p>
            <p>
              <span className="text-[#819596]">Role:</span>{" "}
              <span className="capitalize font-medium text-[#173F41]">{empRole}</span>
            </p>
            {empEmail ? (
              <p>
                <span className="text-[#819596]">Email:</span> {empEmail}
              </p>
            ) : null}
            {empPhone ? (
              <p>
                <span className="text-[#819596]">Phone:</span> {empPhone}
              </p>
            ) : null}
          </div>

          {/* Username (Read Only & Frozen) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#173F41]">
                Username
              </label>
              {username && (
                <button
                  type="button"
                  onClick={() => handleCopy(username, "username")}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#08A6A0] hover:text-[#078F8A]"
                >
                  {copiedField === "username" ? (
                    <>
                      <Check className="h-3 w-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              )}
            </div>
            <input
              type="text"
              value={username || "Not set / unavailable"}
              readOnly
              className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#F4F9F8] px-3 text-sm font-mono font-medium text-[#173F41] outline-none select-all cursor-default"
            />
            <p className="mt-1 text-[11px] text-[#819596]">
              Auto-generated unique workforce sign-in identifier.
            </p>
          </div>

          {/* Temporary Password (Read Only & Frozen with Toggle) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#173F41]">
                Temporary Password
              </label>
              {temporaryPassword && (
                <button
                  type="button"
                  onClick={() => handleCopy(temporaryPassword, "password")}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#08A6A0] hover:text-[#078F8A]"
                >
                  {copiedField === "password" ? (
                    <>
                      <Check className="h-3 w-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={
                  showPassword
                    ? (temporaryPassword || "Permanent password set (hidden)")
                    : (temporaryPassword || "••••••••")
                }
                readOnly
                className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#F4F9F8] pl-3 pr-10 text-sm font-mono font-medium text-[#173F41] outline-none select-all cursor-default"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA0A1] hover:text-[#173F41] transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-[#819596]">
              Provided only for initial sign in. Once changed, permanent password is kept secure.
            </p>
          </div>

          {/* Security & Frozen Notice */}
          <div className="flex items-start gap-2.5 rounded-xl bg-[#E8F8F6]/80 p-3 text-xs text-[#1D585A]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#08A6A0] mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Credentials are locked:</strong> Credentials are automatically generated and frozen. Temporary passwords are only used during first login, after which the staff member sets their permanent password.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#08A6A0] px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
