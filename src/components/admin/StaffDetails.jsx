import {
  Activity,
  Clock3,
  Edit3,
  Mail,
  MapPin,
  Trash2,
  User,
  X,
} from "lucide-react";

const StaffDetails = ({
  member,
  onClose,
  onEdit,
  onRemove,
}) => {
  if (!member) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[#073F42]/40
        p-3 backdrop-blur-sm
        sm:p-5
      "
      onClick={onClose}
    >
      {/* =====================================================
          MODAL
      ===================================================== */}
      <div
        className="
          flex max-h-[92vh]
          w-full max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border border-[#D9E9E7]
          bg-white
          shadow-2xl
          sm:rounded-3xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* ===================================================
            HEADER
            Always visible
        =================================================== */}
        <div
          className="
            flex shrink-0 items-center justify-between
            border-b border-[#CFE7E4]
            bg-[#E8F8F6]
            px-4 py-3
            sm:px-6 sm:py-4
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[9px] font-bold uppercase
                tracking-[0.14em]
                text-[#08A6A0]
                sm:text-[10px]
              "
            >
              STAFF INFORMATION
            </p>

            <h2
              className="
                mt-1 truncate
                text-base font-bold
                tracking-tight
                text-[#073F42]
                sm:text-xl
              "
            >
              Staff Details
            </h2>
          </div>

          {/* CLOSE HEADER BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              border border-[#CFE7E4]
              bg-white/70
              text-[#6F898A]
              transition
              hover:border-[#08A6A0]
              hover:bg-white
              hover:text-[#08A6A0]
              sm:h-9 sm:w-9
            "
            aria-label="Close"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* ===================================================
            SCROLLABLE CONTENT
            Only this section scrolls.
            Scrollbar remains hidden.
        =================================================== */}
        <div
          className="
            scrollbar-hide
            min-h-0
            flex-1
            overflow-y-auto
          "
        >
          {/* =================================================
              STAFF PROFILE
          ================================================= */}
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* PROFILE INITIALS */}
              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-[#E8F8F6]
                  text-sm font-bold
                  text-[#08A6A0]
                  sm:h-16 sm:w-16
                  sm:rounded-2xl
                  sm:text-lg
                "
              >
                {getInitials(member.name)}
              </div>

              {/* PROFILE INFORMATION */}
              <div className="min-w-0 flex-1">
                <h3
                  className="
                    truncate
                    text-base font-bold
                    text-[#073F42]
                    sm:text-xl
                  "
                >
                  {member.name}
                </h3>

                <p
                  className="
                    mt-0.5 truncate
                    text-xs text-[#819596]
                    sm:text-sm
                  "
                >
                  {member.designation || "Designation not provided"}
                </p>

                <div
                  className="
                    mt-1.5 flex flex-wrap
                    items-center gap-1.5
                    sm:gap-2
                  "
                >
                  <CategoryBadge
                    category={member.category}
                  />

                  <AvailabilityBadge
                    availability={member.availability}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}
          <div
            className="
              border-t border-[#EAF2F0]
              px-4 py-4
              sm:px-6 sm:py-5
            "
          >
            <SectionTitle title="Basic Information" />

            <div
              className="
                mt-3 grid grid-cols-2 gap-3
                sm:mt-4 sm:grid-cols-3 sm:gap-4
              "
            >
              <DetailItem
                label="Employee ID"
                value={member.id}
              />

              <DetailItem
                label="Department"
                value={member.department}
              />

              <DetailItem
                label="Qualification"
                value={member.qualification}
              />

              <DetailItem
                label="Experience"
                value={member.experience}
              />

              <DetailItem
                label="Joining Date"
                value={member.joiningDate}
              />

              <DetailItem
                label="Status"
                value={member.status}
              />
            </div>
          </div>

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}
          <div
            className="
              border-t border-[#EAF2F0]
              px-4 py-4
              sm:px-6 sm:py-5
            "
          >
            <SectionTitle title="Contact Information" />

            <div
              className="
                mt-3 grid gap-3
                sm:mt-4 sm:grid-cols-2
              "
            >
              <ContactBox
                icon={User}
                label="Phone"
                value={member.phone}
              />

              <ContactBox
                icon={Mail}
                label="Email"
                value={member.email}
              />

              <ContactBox
                icon={MapPin}
                label="Address"
                value={member.address}
                fullWidth
              />
            </div>
          </div>

          {/* =================================================
              WORK INFORMATION
          ================================================= */}
          <div
            className="
              border-t border-[#EAF2F0]
              px-4 py-4
              sm:px-6 sm:py-5
            "
          >
            <SectionTitle title="Work Information" />

            <div
              className="
                mt-3 grid grid-cols-2 gap-3
                sm:mt-4 sm:grid-cols-3
              "
            >
              <InfoBox
                icon={Activity}
                label="Availability"
                value={member.availability}
              />

              <InfoBox
                icon={User}
                label="Assigned Patients"
                value={member.assignedPatients}
              />

              <InfoBox
                icon={Clock3}
                label="Current Shift"
                value={member.currentShift}
              />
            </div>
          </div>

          {/* BOTTOM SPACE */}
          <div className="h-3 sm:h-4" />
        </div>

        {/* ===================================================
            FOOTER / ACTION BAR
            Always visible because it is outside the
            scrollable content.
        =================================================== */}
        <div
          className="
            relative z-20
            flex shrink-0
            flex-col gap-2
            border-t border-[#EAF2F0]
            bg-[#FAFDFC]
            px-4 py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6 sm:py-4
          "
        >
          {/* =================================================
              REMOVE STAFF
          ================================================= */}
          <button
            type="button"
            onClick={() => onRemove?.(member)}
            className="
              inline-flex h-9
              items-center justify-center
              gap-1.5
              rounded-lg
              border border-red-200
              bg-red-50
              px-3.5
              text-xs font-semibold
              text-red-600
              transition
              hover:border-red-300
              hover:bg-red-100
              hover:text-red-700
              active:scale-[0.98]
              sm:h-10
              sm:rounded-xl
              sm:px-4
              sm:text-sm
            "
          >
            <Trash2
              className="
                h-3.5 w-3.5
                sm:h-4 sm:w-4
              "
            />

            Remove Staff
          </button>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}
          <div className="flex gap-2">
            {/* EDIT STAFF */}
            <button
              type="button"
              onClick={() => onEdit?.(member)}
              className="
                inline-flex h-9
                items-center justify-center
                gap-1.5
                rounded-lg
                border border-[#BFE2DF]
                bg-[#E8F8F6]
                px-3.5
                text-xs font-semibold
                text-[#087F7A]
                transition
                hover:border-[#08A6A0]
                hover:bg-[#D9F3F0]
                hover:text-[#056C68]
                active:scale-[0.98]
                sm:h-10
                sm:rounded-xl
                sm:px-4
                sm:text-sm
              "
            >
              <Edit3
                className="
                  h-3.5 w-3.5
                  sm:h-4 sm:w-4
                "
              />

              Edit Staff
            </button>

            {/* CLOSE */}
            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex h-9
                items-center justify-center
                rounded-lg
                border border-[#D9E9E7]
                bg-white
                px-4
                text-xs font-semibold
                text-[#31585A]
                transition
                hover:border-[#08A6A0]
                hover:bg-[#E8F8F6]
                hover:text-[#08A6A0]
                active:scale-[0.98]
                sm:h-10
                sm:rounded-xl
                sm:px-5
                sm:text-sm
              "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({ title }) => {
  return (
    <h4
      className="
        text-xs font-bold
        text-[#073F42]
        sm:text-sm
      "
    >
      {title}
    </h4>
  );
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({ label, value }) => {
  return (
    <div className="min-w-0">
      <p
        className="
          text-[9px] font-medium
          text-[#819596]
          sm:text-[10px]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1 truncate
          text-[11px] font-semibold
          text-[#31585A]
          sm:text-xs
        "
        title={value}
      >
        {value || "Not provided"}
      </p>
    </div>
  );
};

/* =========================================================
   CONTACT BOX
========================================================= */

const ContactBox = ({
  icon: Icon,
  label,
  value,
  fullWidth = false,
}) => {
  return (
    <div
      className={`
        flex min-w-0 items-center gap-2.5
        rounded-xl
        border border-[#E2EFED]
        bg-[#FAFDFC]
        p-2.5
        sm:gap-3 sm:p-3
        ${fullWidth ? "sm:col-span-2" : ""}
      `}
    >
      {/* ICON */}
      <div
        className="
          flex h-8 w-8 shrink-0
          items-center justify-center
          rounded-lg
          bg-[#E8F8F6]
          sm:h-9 sm:w-9
        "
      >
        <Icon
          className="
            h-3.5 w-3.5
            text-[#08A6A0]
            sm:h-4 sm:w-4
          "
        />
      </div>

      {/* CONTENT */}
      <div className="min-w-0">
        <p
          className="
            text-[9px] font-medium
            text-[#819596]
            sm:text-[10px]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5 truncate
            text-[10px] font-semibold
            text-[#31585A]
            sm:text-xs
          "
          title={value}
        >
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   INFO BOX
========================================================= */

const InfoBox = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div
      className="
        rounded-xl
        border border-[#E2EFED]
        bg-[#FAFDFC]
        p-2.5
        sm:p-3
      "
    >
      <div className="flex items-center gap-2">
        <Icon
          className="
            h-3.5 w-3.5
            text-[#08A6A0]
            sm:h-4 sm:w-4
          "
        />

        <p
          className="
            truncate
            text-[9px] font-medium
            text-[#819596]
            sm:text-[10px]
          "
        >
          {label}
        </p>
      </div>

      <p
        className="
          mt-1.5 truncate
          text-xs font-bold
          text-[#073F42]
          sm:text-sm
        "
      >
        {value ?? "Not available"}
      </p>
    </div>
  );
};

/* =========================================================
   CATEGORY BADGE
========================================================= */

const CategoryBadge = ({ category }) => {
  return (
    <span
      className="
        inline-flex max-w-full
        items-center truncate
        rounded-full
        bg-[#E8F8F6]
        px-2 py-1
        text-[9px] font-semibold
        text-[#087F7A]
        sm:px-2.5
        sm:text-[10px]
      "
    >
      {category || "Category not provided"}
    </span>
  );
};

/* =========================================================
   AVAILABILITY BADGE
========================================================= */

const AvailabilityBadge = ({ availability }) => {
  const styles = {
    Available: "bg-emerald-50 text-emerald-700",
    Assigned: "bg-blue-50 text-blue-700",
    "On Leave": "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`
        inline-flex rounded-full
        px-2 py-1
        text-[9px] font-semibold
        sm:px-2.5 sm:text-[10px]
        ${
          styles[availability] ||
          "bg-gray-100 text-gray-600"
        }
      `}
    >
      {availability || "Unknown"}
    </span>
  );
};

/* =========================================================
   GET INITIALS
========================================================= */

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default StaffDetails;
