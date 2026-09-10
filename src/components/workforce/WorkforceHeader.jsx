import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

const WorkforceHeader = ({
  title = "Dashboard",
  subtitle = "Welcome back to your workforce portal.",
  user,
  onMenuClick,
  onNotificationClick,
}) => {
  const role = user?.role || "Staff";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "WC";

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2EFED] bg-white">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-lg text-[#315A57]
              transition-colors hover:bg-[#E8F8F6]
              lg:hidden
            "
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-[#153B37] sm:text-xl">
              {title}
            </h1>

            <p className="mt-0.5 hidden truncate text-xs text-[#6B7F7B] sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Search */}
          <button
            type="button"
            className="
              hidden h-9 w-9 items-center justify-center
              rounded-lg text-[#55716E]
              transition-colors hover:bg-[#E8F8F6]
              md:flex
            "
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={onNotificationClick}
            className="
              relative flex h-9 w-9 items-center justify-center
              rounded-lg text-[#55716E]
              transition-colors hover:bg-[#E8F8F6]
            "
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />

            <span
              className="
                absolute right-1.5 top-1.5
                h-2 w-2 rounded-full
                bg-[#08A6A0]
                ring-2 ring-white
              "
            />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#E2EFED] sm:block" />

          {/* User */}
          <button
            type="button"
            className="
              flex items-center gap-2 rounded-lg
              px-1.5 py-1.5
              transition-colors hover:bg-[#F5FAF9]
              sm:px-2
            "
          >
            {/* Avatar */}
            <div
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-full bg-[#E8F8F6]
                text-xs font-semibold text-[#087F7B]
              "
            >
              {initials}
            </div>

            {/* User Details */}
            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-[130px] truncate text-sm font-semibold text-[#153B37]">
                {user?.name || "Workforce User"}
              </p>

              <p className="text-[11px] capitalize text-[#6B7F7B]">
                {user?.designation || role}
              </p>
            </div>

            <ChevronDown className="hidden h-4 w-4 text-[#7A918E] sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default WorkforceHeader;