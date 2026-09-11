import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const AdminHeader = ({ onMenuClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Reference for the complete profile area
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2EFED] bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCEBE9] text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0] lg:hidden"
            aria-label="Open admin sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="hidden w-full max-w-md sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

              <input
                type="search"
                placeholder="Search patients, staff, bookings..."
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-[#DCEBE9]
                  bg-[#F8FCFB]
                  pl-10
                  pr-4
                  text-sm
                  text-[#173F41]
                  outline-none
                  placeholder:text-[#9AAEAF]
                  transition
                  focus:border-[#08A6A0]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#08A6A0]/10
                "
              />
            </div>
          </div>

          {/* Mobile Title */}
          <div className="sm:hidden">
            <p className="text-sm font-bold text-[#073F42]">
              Admin Portal
            </p>

            <p className="text-[10px] text-[#819596]">
              CareCore
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#31585A] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0] sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#31585A] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            {/* Notification Count */}
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#08A6A0] px-1 text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-8 w-px bg-[#E2EFED] sm:block" />

          {/* Profile */}
          <div
            ref={profileRef}
            className="relative"
          >
            {/* Profile Button */}
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#F4FAF9]"
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D7F4F1] text-sm font-bold text-[#087F7A]">
                AD
              </div>

              {/* User Info */}
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold leading-4 text-[#173F41]">
                  Admin
                </p>

                <p className="mt-1 text-[10px] leading-3 text-[#819596]">
                  Administrator
                </p>
              </div>

              {/* Arrow */}
              <ChevronDown
                className={`hidden h-4 w-4 text-[#819596] transition-transform md:block ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-[#DDECEA] bg-white p-2 shadow-xl">
                {/* Profile Header */}
                <div className="border-b border-[#E8F0EF] px-3 py-3">
                  <p className="text-sm font-semibold text-[#173F41]">
                    Admin
                  </p>

                  <p className="mt-1 truncate text-xs text-[#819596]">
                    admin@carecore.com
                  </p>
                </div>

                {/* Menu */}
                <div className="py-1">
                  {/* My Profile */}
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#31585A] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </button>

                  {/* Settings */}
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#31585A] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-[#E8F0EF] pt-1">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;