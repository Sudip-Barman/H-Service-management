import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../../components/landing/NavBar";
import Footer from "../../components/landing/Footer";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Temporary frontend-only login
    localStorage.setItem(
      "demoUser",
      JSON.stringify({
        email: formData.email,
      })
    );

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FCFB]">
      {/* Navbar */}
      <Navbar />

      {/* Login Section */}
      <main className="px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid overflow-hidden rounded-3xl border border-[#DDECEA] bg-white shadow-sm lg:grid-cols-2">

            {/* Left Information Panel */}
            <div className="hidden bg-[#073F42] p-8 text-white lg:flex lg:flex-col lg:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8DE3DE]">
                  Welcome Back
                </span>

                <h1 className="mt-5 text-3xl font-bold leading-tight">
                  Your care journey starts here.
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-[#C7DDDB]">
                  Sign in to manage your care services, appointments,
                  bookings, payments, and important information.
                </p>
              </div>

              <div className="mt-10 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                  <ShieldCheck className="h-5 w-5 text-[#08A6A0]" />
                  <span className="text-sm text-[#D8E9E7]">
                    Secure account access
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                  <LockKeyhole className="h-5 w-5 text-[#08A6A0]" />
                  <span className="text-sm text-[#D8E9E7]">
                    Your information stays protected
                  </span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mx-auto max-w-md">
                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F8F5] text-xl font-bold text-[#08A6A0]">
                    +
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-[#073F42]">
                    Sign in
                  </h2>

                  <p className="mt-1.5 text-sm text-[#789092]">
                    Access your CareCore account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-semibold text-[#31585A]"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-[#D9E9E7]
                          bg-[#FAFDFC]
                          pl-10
                          pr-4
                          text-sm
                          text-[#173F41]
                          outline-none
                          transition
                          placeholder:text-[#A0B0B1]
                          focus:border-[#08A6A0]
                          focus:ring-2
                          focus:ring-[#08A6A0]/10
                        "
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-semibold text-[#31585A]"
                      >
                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-[#08A6A0] hover:text-[#078F8A]"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-[#D9E9E7]
                          bg-[#FAFDFC]
                          pl-10
                          pr-11
                          text-sm
                          text-[#173F41]
                          outline-none
                          transition
                          placeholder:text-[#A0B0B1]
                          focus:border-[#08A6A0]
                          focus:ring-2
                          focus:ring-[#08A6A0]/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA0A1] hover:text-[#08A6A0]"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
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

                  {/* Error */}
                  {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Remember Me */}
                  <div className="flex items-center gap-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#C8DCDA] accent-[#08A6A0]"
                    />

                    <label
                      htmlFor="remember"
                      className="text-xs text-[#708789]"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#08A6A0]
                      text-sm
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-[#08A6A0]/15
                      transition
                      hover:-translate-y-0.5
                      hover:bg-[#078F8A]
                    "
                  >
                    Sign In
                  </button>
                </form>

                {/* Register */}
                <p className="mt-6 text-center text-sm text-[#789092]">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-[#08A6A0] hover:text-[#078F8A]"
                  >
                    Create an account
                  </Link>
                </p>

                {/* Employee Note */}
                <div className="mt-6 rounded-xl border border-[#DDECEA] bg-[#F4FBF9] p-3 text-center">
                  <p className="text-xs leading-5 text-[#708789]">
                    Employee accounts such as doctors, nurses, and staff
                    require administrator approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;