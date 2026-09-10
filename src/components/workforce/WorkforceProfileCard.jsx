import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

const WorkforceProfileCard = ({ user }) => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "WC";

  const profileItems = [
    {
      label: "Department",
      value: user?.department || "Not assigned",
      icon: Building2,
    },
    {
      label: "Designation",
      value: user?.designation || user?.role || "Workforce Staff",
      icon: BriefcaseBusiness,
    },
    {
      label: "Phone",
      value: user?.phone || "Not available",
      icon: Phone,
    },
    {
      label: "Email",
      value: user?.email || "Not available",
      icon: Mail,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-[0_2px_10px_rgba(15,118,110,0.05)]">
      {/* Profile Header */}
      <div className="bg-[#073F42] px-5 py-6 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="
                flex h-16 w-16 shrink-0 items-center justify-center
                rounded-full border-4 border-white/20
                bg-[#08A6A0]
                text-lg font-bold text-white
              "
            >
              {initials}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-white sm:text-xl">
                {user?.name || "Workforce User"}
              </h2>

              <p className="mt-1 text-sm text-[#B8CDCD]">
                {user?.designation || user?.role || "Workforce Staff"}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#B8CDCD]">
                <MapPin className="h-3.5 w-3.5" />
                <span>{user?.location || "CareCore Hospital"}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div
            className="
              flex w-fit items-center gap-2 rounded-full
              border border-[#8BE0D8]/20
              bg-[#08A6A0]/20
              px-3 py-1.5
              text-xs font-medium text-[#A9EAE5]
            "
          >
            <span className="h-2 w-2 rounded-full bg-[#5DE1D8]" />
            {user?.status || "Active"}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 divide-y divide-[#EAF2F1] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {profileItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="
                flex items-center gap-3 px-5 py-4
                sm:px-6
              "
            >
              <div
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-lg bg-[#E8F8F6] text-[#08A6A0]
                "
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#829692]">
                  {item.label}
                </p>

                <p className="mt-0.5 truncate text-sm font-medium text-[#153B37]">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional Information */}
      <div className="border-t border-[#EAF2F1] px-5 py-5 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Qualification */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F2F7F6] text-[#315A57]">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] text-[#829692]">
                Qualification
              </p>
              <p className="truncate text-sm font-medium text-[#153B37]">
                {user?.qualification || "Not specified"}
              </p>
            </div>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F2F7F6] text-[#315A57]">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] text-[#829692]">
                Experience
              </p>
              <p className="truncate text-sm font-medium text-[#153B37]">
                {user?.experience || "Not specified"}
              </p>
            </div>
          </div>

          {/* Joining Date */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F2F7F6] text-[#315A57]">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] text-[#829692]">
                Joining Date
              </p>
              <p className="truncate text-sm font-medium text-[#153B37]">
                {user?.joiningDate || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkforceProfileCard;