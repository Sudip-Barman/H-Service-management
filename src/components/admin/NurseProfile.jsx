import {
  Activity,
  CalendarDays,
  ClipboardList,
  Edit3,
  FileText,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const getNurseName = (nurse) => {
  return (
    nurse?.full_name ||
    nurse?.name ||
    [
      nurse?.first_name,
      nurse?.middle_name,
      nurse?.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Unnamed Nurse"
  );
};

const getInitials = (name) => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "NR"
  );
};

const formatDate = (date) => {
  if (!date) return "Not provided";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ value }) => {
  const styles = {
    Active:
      "bg-[#E8F8F6] text-[#078E89] border-[#BDE9E5]",

    Inactive:
      "bg-[#F1F5F5] text-[#607879] border-[#D8E3E2]",

    "On Leave":
      "bg-[#F4EEFF] text-[#7651A8] border-[#DDCFF2]",

    Suspended:
      "bg-[#FFF5E8] text-[#A66A13] border-[#F4D8AD]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[value] ||
        "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          value === "Active"
            ? "bg-[#08A6A0]"
            : value === "On Leave"
            ? "bg-[#7651A8]"
            : value === "Suspended"
            ? "bg-[#A66A13]"
            : "bg-[#819596]"
        }`}
      />

      {value || "Not provided"}
    </span>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#819596]">
        {label}
      </p>

      <div className="flex items-center gap-2 text-sm font-medium text-[#31585A]">
        {Icon && (
          <Icon
            size={15}
            className="shrink-0 text-[#08A6A0]"
          />
        )}

        <span>{value || "Not provided"}</span>
      </div>
    </div>
  );
};

/* =========================================================
   RELATED RECORD
========================================================= */

const RelatedRecord = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E2EFED] bg-[#FAFDFC] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
          <Icon size={17} />
        </div>

        <span className="text-sm font-medium text-[#31585A]">
          {label}
        </span>
      </div>

      <span className="text-base font-bold text-[#173F41]">
        {value}
      </span>
    </div>
  );
};

/* =========================================================
   NURSE PROFILE
========================================================= */

const NurseProfile = ({
  nurse,
  onClose,
  onEdit,
}) => {
  if (!nurse) return null;

  const name = getNurseName(nurse);

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[#173F41]/30
        p-3
        backdrop-blur-[2px]
        sm:p-5
      "
    >
      <div
        className="
          flex h-full max-h-[92vh]
          w-full max-w-5xl
          flex-col overflow-hidden
          rounded-2xl
          border border-[#DDEBE8]
          bg-[#F7FBFA]
          shadow-2xl
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-[#E2EFED] bg-white px-5 py-4">
          <div className="flex min-w-0 items-center gap-4">

            {/* Nurse Avatar */}

            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#E8F8F6] bg-[#DDF4F1] text-base font-bold text-[#078E89]">
              {nurse.photo ? (
                <img
                  src={nurse.photo}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(name)
              )}
            </div>

            {/* Nurse Basic Information */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-bold text-[#173F41]">
                  {name}
                </h2>

                <StatusBadge value={nurse.status} />
              </div>

              <p className="mt-1 text-sm text-[#819596]">
                {nurse.qualification ||
                  "Nursing qualification not provided"}
              </p>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#819596]">
                <span>
                  Nurse ID:{" "}
                  <strong className="text-[#31585A]">
                    {nurse.nurse_id}
                  </strong>
                </span>

                <span>
                  Registration:{" "}
                  <strong className="text-[#31585A]">
                    {nurse.registration_number}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close nurse profile"
            className="rounded-lg p-2 text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#078E89]"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            QUICK INFORMATION
        ================================================= */}

        <div className="grid grid-cols-2 border-b border-[#E2EFED] bg-white sm:grid-cols-4">

          {/* Staff ID */}

          <div className="border-r border-[#E2EFED] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#819596]">
              Staff ID
            </p>

            <p className="mt-1 truncate text-sm font-bold text-[#173F41]">
              {nurse.staff_id || "Not provided"}
            </p>
          </div>

          {/* Experience */}

          <div className="border-r border-[#E2EFED] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#819596]">
              Experience
            </p>

            <p className="mt-1 text-sm font-bold text-[#173F41]">
              {nurse.experience_years || 0} years
            </p>
          </div>

          {/* Department */}

          <div className="border-r border-[#E2EFED] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#819596]">
              Department
            </p>

            <p className="mt-1 truncate text-sm font-bold text-[#173F41]">
              {nurse.department || "Not provided"}
            </p>
          </div>

          {/* Shift */}

          <div className="px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#819596]">
              Shift
            </p>

            <p className="mt-1 truncate text-sm font-bold text-[#173F41]">
              {nurse.shift_type || "Not provided"}
            </p>
          </div>
        </div>

        {/* =================================================
            PROFILE CONTENT
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto p-5">

          {/* =================================================
              PERSONAL / IDENTIFICATION INFORMATION
          ================================================= */}

          <section className="mb-5 rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <UserRound
                size={18}
                className="text-[#08A6A0]"
              />

              <h3 className="font-bold text-[#173F41]">
                Nurse Information
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <InfoItem
                label="Nurse ID"
                value={nurse.nurse_id}
              />

              <InfoItem
                label="Staff ID"
                value={nurse.staff_id}
              />

              <InfoItem
                label="Registration Number"
                value={nurse.registration_number}
              />

              <InfoItem
                label="Full Name"
                value={name}
              />

              <InfoItem
                label="Gender"
                value={nurse.gender}
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(
                  nurse.date_of_birth
                )}
              />

              <InfoItem
                label="Phone"
                value={nurse.phone}
              />

              <InfoItem
                label="Email"
                value={nurse.email}
              />

              <div className="sm:col-span-2 lg:col-span-3">
                <InfoItem
                  label="Address"
                  value={nurse.address}
                />
              </div>

            </div>
          </section>

          {/* =================================================
              PROFESSIONAL INFORMATION
          ================================================= */}

          <section className="mb-5 rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <Activity
                size={18}
                className="text-[#08A6A0]"
              />

              <h3 className="font-bold text-[#173F41]">
                Professional Information
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <InfoItem
                label="Qualification"
                value={nurse.qualification}
              />

              <InfoItem
                label="Department"
                value={nurse.department}
              />

              <InfoItem
                label="Ward"
                value={nurse.ward}
              />

              <InfoItem
                label="Experience"
                value={`${nurse.experience_years || 0} years`}
              />

              <InfoItem
                label="Shift Type"
                value={nurse.shift_type}
              />

              <InfoItem
                label="Status"
                value={
                  <StatusBadge
                    value={nurse.status}
                  />
                }
              />

            </div>
          </section>

          {/* =================================================
              LICENSE INFORMATION
          ================================================= */}

          <section className="mb-5 rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck
                size={18}
                className="text-[#08A6A0]"
              />

              <h3 className="font-bold text-[#173F41]">
                License Information
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">

              <InfoItem
                label="License Number"
                value={nurse.license_number}
              />

              <InfoItem
                label="License Expiry"
                value={formatDate(
                  nurse.license_expiry
                )}
              />

              <InfoItem
                label="Nurse Status"
                value={
                  <StatusBadge
                    value={nurse.status}
                  />
                }
              />

            </div>
          </section>

          {/* =================================================
              RELATED RECORDS
          ================================================= */}

          <section className="rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <ClipboardList
                size={18}
                className="text-[#08A6A0]"
              />

              <h3 className="font-bold text-[#173F41]">
                Related Records
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">

              <RelatedRecord
                icon={CalendarDays}
                label="Service Assignments"
                value={
                  nurse.service_assignments_count || 0
                }
              />

              <RelatedRecord
                icon={Activity}
                label="Patient Services"
                value={
                  nurse.patient_services_count || 0
                }
              />

              <RelatedRecord
                icon={FileText}
                label="Requests"
                value={
                  nurse.requests_count || 0
                }
              />

            </div>
          </section>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-end gap-3 border-t border-[#E2EFED] bg-white px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#DCE9E7] px-4 py-2.5 text-sm font-semibold text-[#31585A] transition hover:bg-[#F3F8F7]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onEdit(nurse)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078E89]"
          >
            <Edit3 size={16} />
            Edit Nurse
          </button>

        </div>
      </div>
    </div>
  );
};

export default NurseProfile;