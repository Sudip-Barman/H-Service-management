import {
  Activity,
  CalendarDays,
  ClipboardList,
  Edit3,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

/* =========================================================
   HELPERS
// ========================================================= */

const getDoctorName = (doctor) => {
  return [
    doctor?.first_name,
    doctor?.middle_name,
    doctor?.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "Unnamed Doctor";
};

const getInitials = (name) => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "DR"
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

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({
  value,
  availability = false,
}) => {
  const styles = {
    Active:
      "bg-[#E8F8F6] text-[#078E89] border-[#BDE9E5]",

    Inactive:
      "bg-[#F1F5F5] text-[#607879] border-[#D8E3E2]",

    Available:
      "bg-[#E8F8F6] text-[#078E89] border-[#BDE9E5]",

    Unavailable:
      "bg-[#FFF5E8] text-[#A66A13] border-[#F4D8AD]",

    "On Leave":
      "bg-[#F4EEFF] text-[#7651A8] border-[#DDCFF2]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[value] ||
        "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {availability && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            value === "Available"
              ? "bg-[#08A6A0]"
              : value === "On Leave"
              ? "bg-[#7651A8]"
              : "bg-[#A66A13]"
          }`}
        />
      )}

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
   DOCTOR PROFILE
========================================================= */

const DoctorProfile = ({
  doctor,
  onClose,
  onEdit,
}) => {
  if (!doctor) return null;

  const name = getDoctorName(doctor);

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
            {/* Doctor Photo */}

            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#E8F8F6] bg-[#DDF4F1] text-base font-bold text-[#078E89]">
              {doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(name)
              )}
            </div>

            {/* Doctor Basic Info */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-bold text-[#173F41]">
                  {name}
                </h2>

                <StatusBadge value={doctor.status} />
              </div>

              <p className="mt-1 text-sm text-[#819596]">
                {doctor.specialization ||
                  "Specialization not provided"}
              </p>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#819596]">
                <span>
                  Doctor ID:{" "}
                  <strong className="text-[#31585A]">
                    {doctor.doctor_id}
                  </strong>
                </span>

                <span>
                  Registration:{" "}
                  <strong className="text-[#31585A]">
                    {doctor.registration_number}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close doctor profile"
            className="rounded-lg p-2 text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#078E89]"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            QUICK INFORMATION
        ================================================= */}

        <div className="grid grid-cols-2 border-b border-[#E2EFED] bg-white sm:grid-cols-4">
          {/* Availability */}

          <div className="border-r border-[#E2EFED] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#819596]">
              Availability
            </p>

            <div className="mt-1">
              <StatusBadge
                value={doctor.available_status}
                availability
              />
            </div>
          </div>

          {/* Experience */}

          <div className="border-r border-[#E2EFED] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#819596]">
              Experience
            </p>

            <p className="mt-1 text-sm font-bold text-[#173F41]">
              {doctor.experience_years || 0} years
            </p>
          </div>

          {/* Consultation */}

          <div className="border-r border-[#E2EFED] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#819596]">
              Consultation
            </p>

            <p className="mt-1 text-sm font-bold text-[#173F41]">
              {formatCurrency(
                doctor.consultation_fee
              )}
            </p>
          </div>

          {/* Department */}

          <div className="px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#819596]">
              Department
            </p>

            <p className="mt-1 truncate text-sm font-bold text-[#173F41]">
              {doctor.department || "Not provided"}
            </p>
          </div>
        </div>

        {/* =================================================
            PROFILE CONTENT
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section className="mb-5 rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <UserRound
                size={18}
                className="text-[#08A6A0]"
              />

              <h3 className="font-bold text-[#173F41]">
                Personal Information
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Full Name"
                value={name}
              />

              <InfoItem
                label="Doctor ID"
                value={doctor.doctor_id}
              />

              <InfoItem
                label="Registration Number"
                value={doctor.registration_number}
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(
                  doctor.date_of_birth
                )}
              />

              <InfoItem
                label="Gender"
                value={doctor.gender}
              />

              <InfoItem
                label="Phone"
                value={doctor.phone}
                icon={Phone}
              />

              <InfoItem
                label="Email"
                value={doctor.email}
                icon={Mail}
              />

              <div className="sm:col-span-2">
                <InfoItem
                  label="Address"
                  value={doctor.address}
                  icon={MapPin}
                />
              </div>
            </div>
          </section>

          {/* =================================================
              PROFESSIONAL INFORMATION
          ================================================= */}

          <section className="mb-5 rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <Stethoscope
                size={18}
                className="text-[#08A6A0]"
              />

              <h3 className="font-bold text-[#173F41]">
                Professional Information
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Specialization"
                value={doctor.specialization}
              />

              <InfoItem
                label="Department"
                value={doctor.department}
              />

              <InfoItem
                label="Qualification"
                value={doctor.qualification}
              />

              <InfoItem
                label="Experience"
                value={`${doctor.experience_years || 0} years`}
              />

              <InfoItem
                label="Consultation Fee"
                value={formatCurrency(
                  doctor.consultation_fee
                )}
              />

              <InfoItem
                label="Available Status"
                value={
                  <StatusBadge
                    value={doctor.available_status}
                    availability
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
                value={doctor.license_number}
              />

              <InfoItem
                label="License Expiry"
                value={formatDate(
                  doctor.license_expiry
                )}
              />

              <InfoItem
                label="Doctor Status"
                value={
                  <StatusBadge
                    value={doctor.status}
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
                label="Appointments"
                value={
                  doctor.appointments_count || 0
                }
              />

              <RelatedRecord
                icon={Activity}
                label="Admissions"
                value={
                  doctor.admissions_count || 0
                }
              />

              <RelatedRecord
                icon={FileText}
                label="Lab Tests"
                value={
                  doctor.lab_tests_count || 0
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
            onClick={() => onEdit(doctor)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078E89]"
          >
            <Edit3 size={16} />
            Edit Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
