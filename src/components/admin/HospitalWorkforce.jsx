import {
  ChevronRight,
  Eye,
  Users,
} from "lucide-react";

/* =========================
   HOSPITAL WORKFORCE
========================= */

const HospitalWorkforce = ({
  staff = [],
  filteredStaff = [],
  onView,
  onClearFilters,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm sm:rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAF2F0] px-3 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-[#073F42] sm:text-base">
            Hospital Workforce
          </h2>

          <p className="mt-0.5 text-[10px] text-[#819596] sm:mt-1 sm:text-xs">
            {filteredStaff.length} staff member
            {filteredStaff.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Total */}
        <div className="hidden items-center gap-2 rounded-lg bg-[#E8F8F6] px-3 py-1.5 sm:flex">
          <Users className="h-3.5 w-3.5 text-[#08A6A0]" />

          <span className="text-xs font-semibold text-[#087F7A]">
            {staff.length} Total
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredStaff.length === 0 ? (
        <EmptyState onClear={onClearFilters} />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-[#EAF2F0] bg-[#FAFDFC] text-left">
                  <TableHeader>Staff</TableHeader>

                  <TableHeader>Category</TableHeader>

                  <TableHeader>Qualification</TableHeader>

                  <TableHeader>Department</TableHeader>

                  <TableHeader>Availability</TableHeader>

                  <TableHeader>Patients</TableHeader>

                  <TableHeader align="right">
                    Action
                  </TableHeader>
                </tr>
              </thead>

              <tbody>
                {filteredStaff.map((member) => (
                  <StaffRow
                    key={member.id}
                    member={member}
                    onView={() => onView(member)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="divide-y divide-[#EAF2F0] lg:hidden">
            {filteredStaff.map((member) => (
              <StaffMobileCard
                key={member.id}
                member={member}
                onView={() => onView(member)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* =========================
   TABLE HEADER
========================= */

const TableHeader = ({ children, align = "left" }) => {
  return (
    <th
      className={`px-5 py-3 text-${align} text-xs font-bold uppercase tracking-wide text-[#819596]`}
    >
      {children}
    </th>
  );
};

/* =========================
   DESKTOP ROW
========================= */

const StaffRow = ({ member, onView }) => {
  return (
    <tr className="border-b border-[#EAF2F0] last:border-0 hover:bg-[#FAFDFC]">
      {/* Staff */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <StaffAvatar name={member.name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#173F41]">
              {member.name}
            </p>

            <p className="mt-1 truncate text-xs text-[#819596]">
              {member.id} · {member.designation}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-5 py-4">
        <CategoryBadge category={member.category} />
      </td>

      {/* Qualification */}
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {member.qualification}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {member.experience}
        </p>
      </td>

      {/* Department */}
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {member.department}
        </p>
      </td>

      {/* Availability */}
      <td className="px-5 py-4">
        <AvailabilityBadge
          availability={member.availability}
        />
      </td>

      {/* Patients */}
      <td className="px-5 py-4">
        <span className="text-sm font-bold text-[#31585A]">
          {member.assignedPatients}
        </span>
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onView}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
            title="View staff"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* =========================
   MOBILE CARD
========================= */

const StaffMobileCard = ({ member, onView }) => {
  return (
    <button
      type="button"
      onClick={onView}
      className="flex w-full items-start gap-2.5 p-3 text-left transition hover:bg-[#FAFDFC] sm:gap-3 sm:p-4"
    >
      {/* Avatar */}
      <StaffAvatar name={member.name} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#173F41] sm:text-sm">
              {member.name}
            </p>

            <p className="mt-0.5 text-[10px] text-[#819596] sm:mt-1 sm:text-xs">
              {member.id}
            </p>
          </div>

          <AvailabilityBadge
            availability={member.availability}
          />
        </div>

        <div className="mt-1.5 sm:mt-2">
          <CategoryBadge category={member.category} />
        </div>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#819596] sm:mt-3 sm:gap-x-4 sm:text-xs">
          <span>{member.department}</span>

          <span>
            {member.assignedPatients} patients
          </span>
        </div>
      </div>

      <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#9AAEAF] sm:h-4 sm:w-4" />
    </button>
  );
};

/* =========================
   AVATAR
========================= */

const StaffAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-xs font-bold text-[#087F7A] sm:h-11 sm:w-11 sm:rounded-xl sm:text-sm">
      {initials}
    </div>
  );
};

/* =========================
   CATEGORY BADGE
========================= */

const categoryStyles = {
  Doctor:
    "bg-purple-50 text-purple-700 border-purple-100",

  "GNM Nurse":
    "bg-blue-50 text-blue-700 border-blue-100",

  "ANM Nurse":
    "bg-cyan-50 text-cyan-700 border-cyan-100",

  "B.Sc Nurse":
    "bg-indigo-50 text-indigo-700 border-indigo-100",

  "ICU Nurse":
    "bg-red-50 text-red-700 border-red-100",

  "Elder Caregiver":
    "bg-amber-50 text-amber-700 border-amber-100",

  "Baby Caretaker":
    "bg-pink-50 text-pink-700 border-pink-100",

  "Male Attendant":
    "bg-slate-50 text-slate-700 border-slate-200",

  Receptionist:
    "bg-teal-50 text-teal-700 border-teal-100",
};

const CategoryBadge = ({ category }) => {
  const style =
    categoryStyles[category] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex max-w-full rounded-full border px-2 py-0.5 text-[9px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs ${style}`}
    >
      {category}
    </span>
  );
};

/* =========================
   AVAILABILITY BADGE
========================= */

const availabilityStyles = {
  Available:
    "bg-emerald-50 text-emerald-700 border-emerald-100",

  Assigned:
    "bg-blue-50 text-blue-700 border-blue-100",

  "On Leave":
    "bg-amber-50 text-amber-700 border-amber-100",
};

const AvailabilityBadge = ({ availability }) => {
  const style =
    availabilityStyles[availability] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs ${style}`}
    >
      {availability}
    </span>
  );
};

/* =========================
   EMPTY STATE
========================= */

const EmptyState = ({ onClear }) => {
  return (
    <div className="px-4 py-12 text-center sm:px-6 sm:py-16">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] sm:h-14 sm:w-14 sm:rounded-2xl">
        <Users className="h-5 w-5 text-[#08A6A0] sm:h-6 sm:w-6" />
      </div>

      <h3 className="mt-3 text-sm font-bold text-[#073F42] sm:mt-4">
        No staff found
      </h3>

      <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#819596] sm:mt-2 sm:text-sm sm:leading-6">
        No staff members match the current search or
        filters. Try changing your search criteria.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-xs font-semibold text-[#08A6A0] hover:text-[#078F8A] sm:mt-5 sm:text-sm"
      >
        Clear filters
      </button>
    </div>
  );
};

export default HospitalWorkforce;