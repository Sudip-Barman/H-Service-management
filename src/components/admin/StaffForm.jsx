import { Save, UserPlus, X } from "lucide-react";

const StaffForm = ({
  form,
  error,
  categoryOptions,
  onChange,
  onSubmit,
  onClose,
  isEditing = false,
}) => {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[#073F42]/45
        p-3 backdrop-blur-sm
        sm:p-5
      "
      onClick={onClose}
    >
      {/* =====================================================
          MODAL CONTAINER
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
                tracking-[0.14em] text-[#08A6A0]
                sm:text-[10px]
              "
            >
              {isEditing
                ? "STAFF INFORMATION"
                : "STAFF REGISTRATION"}
            </p>

            <h2
              className="
                mt-1 text-base font-bold
                tracking-tight text-[#073F42]
                sm:text-xl
              "
            >
              {isEditing ? "Edit Staff" : "Register New Staff"}
            </h2>

            <p
              className="
                mt-0.5 text-[10px]
                text-[#5D7B7D]
                sm:text-xs
              "
            >
              {isEditing
                ? "Update staff member information"
                : "Add a new member to the hospital workforce"}
            </p>
          </div>

          {/* CLOSE BUTTON */}
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
            SCROLLABLE FORM BODY
        =================================================== */}
        <form
          onSubmit={onSubmit}
          className="
            scrollbar-hide
            min-h-0 flex-1
            overflow-y-auto
            space-y-4
            px-4 py-4
            sm:space-y-5
            sm:px-6 sm:py-5
          "
        >
          {/* ERROR MESSAGE */}
          {error && (
            <div
              className="
                rounded-xl
                border border-red-100
                bg-red-50
                px-3 py-2.5
                text-xs font-medium
                leading-5 text-red-600
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}
          <SectionTitle title="Personal Information" />

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <FormField
              label="Full Name"
              value={form.name}
              onChange={(value) => onChange("name", value)}
              placeholder="Enter staff name"
              required
            />

            <FormSelect
              label="Staff Category"
              value={form.category}
              onChange={(value) => onChange("category", value)}
              options={categoryOptions.filter(
                (option) => option !== "All"
              )}
              required
            />

            <FormField
              label="Designation"
              value={form.designation}
              onChange={(value) => onChange("designation", value)}
              placeholder="Enter designation"
            />

            <FormField
              label="Department"
              value={form.department}
              onChange={(value) => onChange("department", value)}
              placeholder="Enter department"
            />
          </div>

          {/* =================================================
              PROFESSIONAL INFORMATION
          ================================================= */}
          <SectionTitle title="Professional Information" />

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <FormField
              label="Qualification"
              value={form.qualification}
              onChange={(value) =>
                onChange("qualification", value)
              }
              placeholder="e.g. GNM, B.Sc Nursing"
              required
            />

            <FormField
              label="Experience"
              value={form.experience}
              onChange={(value) =>
                onChange("experience", value)
              }
              placeholder="e.g. 5 Years"
            />
          </div>

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}
          <SectionTitle title="Contact Information" />

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <FormField
              label="Phone Number"
              value={form.phone}
              onChange={(value) => onChange("phone", value)}
              placeholder="+91 XXXXX XXXXX"
              required
            />

            <FormField
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => onChange("email", value)}
              placeholder="staff@example.com"
            />

            <div className="sm:col-span-2">
              <FormField
                label="Address"
                value={form.address}
                onChange={(value) => onChange("address", value)}
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}
          <div
            className="
              flex flex-col-reverse
              gap-2
              border-t border-[#EAF2F0]
              pt-4
              sm:flex-row
              sm:justify-end
            "
          >
            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              className="
                h-9 rounded-lg
                border border-[#D9E9E7]
                bg-white
                px-4
                text-xs font-semibold
                text-[#31585A]
                transition
                hover:border-[#08A6A0]
                hover:bg-[#E8F8F6]
                hover:text-[#08A6A0]
                sm:h-10
                sm:rounded-xl
                sm:px-5
                sm:text-sm
              "
            >
              Cancel
            </button>

            {/* SUBMIT */}
            <button
              type="submit"
              className="
                inline-flex h-9
                items-center justify-center
                gap-1.5
                rounded-lg
                bg-[#08A6A0]
                px-4
                text-xs font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#078F8A]
                hover:shadow-md
                sm:h-10
                sm:rounded-xl
                sm:px-5
                sm:text-sm
              "
            >
              {isEditing ? (
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}

              {isEditing ? "Update Staff" : "Register Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({ title }) => {
  return (
    <div className="border-b border-[#EAF2F0] pb-2">
      <h3
        className="
          text-xs font-bold
          text-[#073F42]
          sm:text-sm
        "
      >
        {title}
      </h3>
    </div>
  );
};

/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label
        className="
          mb-1.5 block
          text-[10px] font-semibold
          text-[#31585A]
          sm:mb-2
          sm:text-xs
        "
      >
        {label}

        {required && (
          <span className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          h-9 w-full
          rounded-lg
          border border-[#D9E9E7]
          bg-[#FAFDFC]
          px-3
          text-xs
          text-[#31585A]
          outline-none
          transition
          placeholder:text-[#A0B1B2]
          hover:border-[#B8DCD9]
          focus:border-[#08A6A0]
          focus:bg-white
          focus:ring-2
          focus:ring-[#08A6A0]/10
          sm:h-10
          sm:rounded-xl
          sm:text-sm
        "
      />
    </div>
  );
};

/* =========================================================
   FORM SELECT
========================================================= */

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  required = false,
}) => {
  return (
    <div>
      <label
        className="
          mb-1.5 block
          text-[10px] font-semibold
          text-[#31585A]
          sm:mb-2
          sm:text-xs
        "
      >
        {label}

        {required && (
          <span className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-9 w-full
          rounded-lg
          border border-[#D9E9E7]
          bg-[#FAFDFC]
          px-3
          text-xs
          text-[#31585A]
          outline-none
          transition
          hover:border-[#B8DCD9]
          focus:border-[#08A6A0]
          focus:bg-white
          focus:ring-2
          focus:ring-[#08A6A0]/10
          sm:h-10
          sm:rounded-xl
          sm:text-sm
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StaffForm;