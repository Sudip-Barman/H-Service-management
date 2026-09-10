import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getUserNotifications,
  getWorkforceUser,
} from "../../data/workforceData";

const WorkforceHeader = ({
  title = "Dashboard",
  subtitle = "Welcome back to your workforce portal.",
  user,
  onMenuClick,
  onNotificationClick,
}) => {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // -----------------------------------------
  // CURRENT USER
  // -----------------------------------------

  const employeeId =
    user?.employeeId ||
    user?.id ||
    localStorage.getItem("employeeId") ||
    "EMP-1001";

  const workforceUser = user || getWorkforceUser(employeeId);

  const role = workforceUser?.role || "staff";

  // -----------------------------------------
  // CURRENT EMPLOYEE ID
  //
  // workforceData uses "id", while some
  // authenticated user objects may use
  // "employeeId".
  // -----------------------------------------

  const currentEmployeeId =
    workforceUser?.employeeId ||
    workforceUser?.id ||
    employeeId;

  // -----------------------------------------
  // USER INITIALS
  // -----------------------------------------

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .replace("Dr. ", "")
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const initials = getInitials(workforceUser?.name);

  // -----------------------------------------
  // NOTIFICATIONS
  // -----------------------------------------

  const notifications = currentEmployeeId
    ? getUserNotifications(currentEmployeeId)
    : [];

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // -----------------------------------------
  // CLOSE PROFILE MENU
  // WHEN CLICKING OUTSIDE
  // -----------------------------------------

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
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // -----------------------------------------
  // PROFILE
  // -----------------------------------------

  const handleProfile = () => {
    setShowProfileMenu(false);
    navigate("/workforce/profile");
  };

  // -----------------------------------------
  // SETTINGS
  // -----------------------------------------

  const handleSettings = () => {
    setShowProfileMenu(false);
    navigate("/workforce/settings");
  };

  // -----------------------------------------
  // NOTIFICATIONS
  // -----------------------------------------

  const handleNotifications = () => {
    setShowProfileMenu(false);

    if (onNotificationClick) {
      onNotificationClick();
    } else {
      navigate("/workforce/notifications");
    }
  };

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------

  const handleLogout = () => {
    setShowProfileMenu(false);

    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("employeeId");

    window.dispatchEvent(new Event("auth-change"));

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#E2EFED] bg-white lg:left-[260px]">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* -----------------------------------------
            LEFT SIDE
        ----------------------------------------- */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCEBE9] text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0] lg:hidden"
            aria-label="Open workforce sidebar"
            title="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop Search */}
          <div className="hidden w-full max-w-md sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

              <input
                type="search"
                placeholder="Search patients, appointments..."
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

          {/* Mobile Page Title */}
          <div className="min-w-0 sm:hidden">
            <p className="truncate text-sm font-bold text-[#073F42]">
              {title}
            </p>

            <p className="truncate text-[10px] capitalize text-[#819596]">
              {workforceUser?.designation || role}
            </p>
          </div>
        </div>

        {/* -----------------------------------------
            RIGHT SIDE
        ----------------------------------------- */}

        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#31585A] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0] sm:hidden"
            aria-label="Search"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={handleNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#31585A] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />

            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#08A6A0] px-1 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-8 w-px bg-[#E2EFED] sm:block" />

          {/* -----------------------------------------
              PROFILE
          ----------------------------------------- */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setShowProfileMenu((previous) => !previous)
              }
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#F4FAF9]"
              aria-expanded={showProfileMenu}
              aria-haspopup="menu"
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D7F4F1] text-sm font-bold text-[#087F7A]">
                {initials}
              </div>

              {/* User Info */}
              <div className="hidden text-left md:block">
                <p className="max-w-[150px] truncate text-sm font-semibold leading-4 text-[#173F41]">
                  {workforceUser?.name || "User"}
                </p>

                <p className="mt-1 max-w-[150px] truncate text-[10px] capitalize leading-3 text-[#819596]">
                  {workforceUser?.designation || role}
                </p>
              </div>

              {/* Dropdown Icon */}
              <ChevronDown
                className={`hidden h-4 w-4 text-[#819596] transition-transform md:block ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* -----------------------------------------
                PROFILE DROPDOWN
            ----------------------------------------- */}

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-[#DDECEA] bg-white p-2 shadow-xl">
                {/* Profile Header */}
                <div className="border-b border-[#E8F0EF] px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D7F4F1] text-sm font-bold text-[#087F7A]">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#173F41]">
                        {workforceUser?.name || "User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#819596]">
                        {workforceUser?.email || "Workforce Account"}
                      </p>
                    </div>
                  </div>

                  {/* Employee Information */}
                  {currentEmployeeId && (
                    <div className="mt-3 rounded-lg bg-[#F4FAF9] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-[#819596]">
                        Employee ID
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-[#31585A]">
                        {currentEmployeeId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Menu */}
                <div className="py-1">
                  {/* My Profile */}
                  <button
                    type="button"
                    onClick={handleProfile}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#31585A] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                  >
                    <User className="h-4 w-4" />

                    <span>My Profile</span>
                  </button>

                  {/* Settings */}
                  <button
                    type="button"
                    onClick={handleSettings}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#31585A] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                  >
                    <Settings className="h-4 w-4" />

                    <span>Settings</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-[#E8F0EF] pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />

                    <span>Logout</span>
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

export default WorkforceHeader;
