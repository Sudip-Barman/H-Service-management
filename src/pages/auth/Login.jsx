import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserCog,
  Stethoscope,
  HeartPulse,
  UsersRound,
} from "lucide-react";

import { login } from "../../api/auth";
import { useHospitalSettings } from "../../context/HospitalSettingsContext";

const Login = () => {
  const navigate = useNavigate();
  const { settings } = useHospitalSettings();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      value: "admin",
      label: "Admin",
      subtitle: "Admin Portal",
      icon: UserCog,
    },
    {
      value: "staff",
      label: "Staff",
      subtitle: "Workforce",
      icon: UsersRound,
    },
  ];

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ============================================================
  // ROLE CHANGE
  // ============================================================

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // ========================================================
      // CALL CENTRALIZED LOGIN API
      // ========================================================

      const data = await login({
        email: formData.email,
        password: formData.password,
        role: role,
      });

      // ========================================================
      // STORE AUTHENTICATION DATA
      // ========================================================

      // JWT token
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // Logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Existing frontend compatibility
      localStorage.setItem(
        "demoUser",
        JSON.stringify(data.user)
      );

      // User role
      localStorage.setItem(
        "userRole",
        data.user.role
      );

      // ========================================================
      // FIRST-TIME PASSWORD CHANGE CHECK
      // ========================================================

      if (data.user.must_change_password) {
        navigate("/first-time-password");
        return;
      }

      // ========================================================
      // ROLE-BASED REDIRECT
      // ========================================================

      switch (data.user.role) {
        case "admin":
          navigate("/admin");
          break;

        case "doctor":
        case "nurse":
        case "staff":
          navigate("/workforce");
          break;

        default:
          // Unknown role
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          localStorage.removeItem("demoUser");
          localStorage.removeItem("userRole");

          setError(
            "Your account has an unsupported role."
          );
          break;
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Unable to connect to the server. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8FCFB]">

      {/* ======================================================
          LOGIN SECTION
      ====================================================== */}

      <main className="flex min-h-screen items-center justify-center px-3 py-4 sm:px-5 sm:py-6 lg:px-6">

        <div className="mx-auto w-full max-w-4xl">

          <div className="grid overflow-hidden rounded-2xl border border-[#DDECEA] bg-white shadow-sm lg:grid-cols-2">

            {/* ==================================================
                LEFT INFORMATION PANEL
            ================================================== */}

            <div className="hidden bg-[#073F42] p-6 text-white lg:flex lg:flex-col lg:justify-between xl:p-7">

              <div>

                <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8DE3DE]">
                  Welcome Back
                </span>

                <h1 className="mt-4 text-2xl font-bold leading-tight xl:text-3xl">
                  Your care journey starts here.
                </h1>

                <p className="mt-3 max-w-sm text-sm leading-5 text-[#C7DDDB]">
                  Sign in to manage your care services,
                  appointments, bookings, payments, and
                  important information.
                </p>

              </div>

              <div className="mt-7 space-y-2.5">

                {/* Secure Access */}

                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-2.5">

                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#08A6A0]" />

                  <span className="text-xs text-[#D8E9E7]">
                    Secure account access
                  </span>

                </div>

                {/* Protected Information */}

                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-2.5">

                  <LockKeyhole className="h-4 w-4 shrink-0 text-[#08A6A0]" />

                  <span className="text-xs text-[#D8E9E7]">
                    Your information stays protected
                  </span>

                </div>

              </div>

            </div>


            {/* ==================================================
                LOGIN FORM
            ================================================== */}

            <div className="p-5 sm:p-6 lg:p-7">

              <div className="mx-auto max-w-sm">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="text-center">

                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F8F5] text-lg font-bold text-[#08A6A0] overflow-hidden">
                    {settings?.logo ? (
                      <img src={settings.logo} alt="Logo" className="h-full w-full object-contain p-1" />
                    ) : (
                      "+"
                    )}
                  </div>

                  <h2 className="mt-2.5 text-xl font-bold text-[#073F42]">
                    Sign in
                  </h2>

                  <p className="mt-1 text-xs text-[#789092]">
                    Access your {settings?.hospitalName || "CareCore"} account
                  </p>

                </div>


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-5 space-y-3"
                >

                  {/* ==================================================
                      LOGIN ROLE
                  ================================================== */}

                  <div>

                    <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                      Login as
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">

                      {roles.map((item) => {

                        const Icon = item.icon;

                        const isSelected =
                          role === item.value;

                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() =>
                              handleRoleChange(
                                item.value
                              )
                            }
                            disabled={loading}
                            className={`
                              flex
                              h-16
                              flex-col
                              items-center
                              justify-center
                              gap-1
                              rounded-xl
                              border
                              px-3
                              transition-all
                              disabled:cursor-not-allowed
                              disabled:opacity-60
                              ${
                                isSelected
                                  ? "border-[#08A6A0] bg-[#E5F8F5] text-[#08A6A0] shadow-sm ring-1 ring-[#08A6A0]"
                                  : "border-[#D9E9E7] bg-[#FAFDFC] text-[#708789] hover:border-[#08A6A0] hover:text-[#08A6A0]"
                              }
                            `}
                          >

                            <div className="flex items-center gap-1.5">
                              <Icon className="h-4 w-4" />
                              <span className="text-xs font-bold">
                                {item.label}
                              </span>
                            </div>

                            <span className="text-[10px] font-medium opacity-80">
                              {item.subtitle}
                            </span>

                          </button>
                        );
                      })}

                    </div>

                  </div>


                  {/* ==================================================
                      USERNAME / EMAIL
                  ================================================== */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-1 block text-xs font-semibold text-[#31585A]"
                    >
                      {role === "admin" ? "Admin Email or Username" : "Staff Username or Email"}
                    </label>

                    <div className="relative">

                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

                      <input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={
                          role === "admin"
                            ? "Enter admin email or username"
                            : "Enter doctor, nurse, or staff username/email"
                        }
                        disabled={loading}
                        autoComplete="username"
                        className="
                          h-10
                          w-full
                          rounded-lg
                          border
                          border-[#D9E9E7]
                          bg-[#FAFDFC]
                          pl-9
                          pr-3
                          text-sm
                          text-[#173F41]
                          outline-none
                          transition
                          placeholder:text-[#A0B0B1]
                          focus:border-[#08A6A0]
                          focus:ring-2
                          focus:ring-[#08A6A0]/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      />

                    </div>

                  </div>


                  {/* ==================================================
                      PASSWORD
                  ================================================== */}

                  <div>

                    <div className="mb-1 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="text-xs font-semibold text-[#31585A]"
                      >
                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-[11px] font-semibold text-[#08A6A0] hover:text-[#078F8A]"
                      >
                        Forgot Password?
                      </Link>

                    </div>

                    <div className="relative">

                      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

                      <input
                        id="password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        disabled={loading}
                        autoComplete="current-password"
                        className="
                          h-10
                          w-full
                          rounded-lg
                          border
                          border-[#D9E9E7]
                          bg-[#FAFDFC]
                          pl-9
                          pr-10
                          text-sm
                          text-[#173F41]
                          outline-none
                          transition
                          placeholder:text-[#A0B0B1]
                          focus:border-[#08A6A0]
                          focus:ring-2
                          focus:ring-[#08A6A0]/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      />

                      {/* Show / Hide Password */}

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        disabled={loading}
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-[#8AA0A1]
                          hover:text-[#08A6A0]
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* ==================================================
                      ERROR
                  ================================================== */}

                  {error && (
                    <div
                      role="alert"
                      className="
                        rounded-lg
                        border
                        border-red-100
                        bg-red-50
                        px-3
                        py-2
                        text-xs
                        leading-4
                        text-red-600
                      "
                    >
                      {error}
                    </div>
                  )}


                  {/* ==================================================
                      REMEMBER ME
                  ================================================== */}

                  <div className="flex items-center gap-2">

                    <input
                      id="remember"
                      type="checkbox"
                      disabled={loading}
                      className="
                        h-3.5
                        w-3.5
                        rounded
                        border-[#C8DCDA]
                        accent-[#08A6A0]
                      "
                    />

                    <label
                      htmlFor="remember"
                      className="text-xs text-[#708789]"
                    >
                      Remember me
                    </label>

                  </div>


                  {/* ==================================================
                      SUBMIT
                  ================================================== */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#08A6A0]
                      text-sm
                      font-semibold
                      text-white
                      shadow-md
                      shadow-[#08A6A0]/15
                      transition
                      hover:-translate-y-0.5
                      hover:bg-[#078F8A]
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                      disabled:hover:translate-y-0
                    "
                  >
                    {loading
                      ? "Signing In..."
                      : "Sign In"}
                  </button>

                </form>


                {/* ==================================================
                    EMPLOYEE NOTE
                ================================================== */}

                <div className="mt-4 rounded-lg border border-[#DDECEA] bg-[#F4FBF9] px-3 py-2">

                  <p className="text-center text-[11px] leading-4 text-[#708789]">
                    Workforce portal access for Doctors, Nurses, and Staff is managed by Hospital Administration.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Login;