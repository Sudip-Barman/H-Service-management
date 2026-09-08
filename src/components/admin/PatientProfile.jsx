import {
  Activity,
  BedDouble,
  CalendarDays,
  ClipboardList,
  Droplets,
  Edit3,
  ExternalLink,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const safeArray = (value) =>
  Array.isArray(value) ? value : [];

const getPatientName = (patient) => {
  if (patient?.fullName) return patient.fullName;

  if (patient?.name) return patient.name;

  const name = [
    patient?.firstName || patient?.first_name,
    patient?.middleName || patient?.middle_name,
    patient?.lastName || patient?.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "Unnamed Patient";
};

const getPatientId = (patient) =>
  patient?.patientId ||
  patient?.patient_id ||
  patient?.registrationNumber ||
  patient?.registration_number ||
  patient?.id ||
  "N/A";

const getRoomBed = (patient) => {
  if (patient?.roomBed) {
    return patient.roomBed;
  }

  if (patient?.roomNumber || patient?.bedNumber) {
    return `${patient.roomNumber || "-"} / ${
      patient.bedNumber || "-"
    }`;
  }

  if (patient?.room || patient?.bed) {
    return `${patient.room || "-"} / ${
      patient.bed || "-"
    }`;
  }

  return "Not Assigned";
};

const getAdmissionStatus = (patient) => {
  if (patient?.admissionStatus) {
    return patient.admissionStatus;
  }

  if (patient?.status === "Admitted") {
    return "Admitted";
  }

  return "Not Admitted";
};

const getInitials = (name = "") => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "P"
  );
};

const getServiceName = (service) => {
  if (typeof service === "string") {
    return service;
  }

  return (
    service?.name ||
    service?.serviceName ||
    service?.title ||
    "Service"
  );
};

const getServiceStatus = (service) => {
  if (typeof service === "string") {
    return "Active";
  }

  return service?.status || "Active";
};

const getIdentificationDocument = (patient) => {
  return (
    patient?.identificationDocument ||
    patient?.identificationDocumentUrl ||
    patient?.identificationDocumentPath ||
    patient?.documentUrl ||
    ""
  );
};

const getIdentificationDocumentName = (patient) => {
  return (
    patient?.identificationDocumentName ||
    patient?.identificationDocumentFileName ||
    patient?.documentName ||
    ""
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const styles = {
    Active:
      "bg-[#E8F8F6] text-[#087F7A] border-[#BCE8E2]",

    "Under Treatment":
      "bg-[#EFF8FD] text-[#2877A6] border-[#C9E3F5]",

    Registered:
      "bg-[#F5FAF9] text-[#527071] border-[#D9E9E7]",

    Admitted:
      "bg-[#F5F2FC] text-[#6653A3] border-[#D8D1EF]",

    Completed:
      "bg-[#E8F8F6] text-[#087F7A] border-[#BCE8E2]",

    Inactive:
      "bg-[#FEF2F2] text-[#B83A3A] border-[#F0CACA]",

    Deceased:
      "bg-[#F3F4F6] text-[#59636E] border-[#D7DBDF]",

    Pending:
      "bg-[#FFF9EA] text-[#9A701B] border-[#F0DEB2]",

    Discharged:
      "bg-[#FCF6F1] text-[#9A6037] border-[#E7D2C2]",

    Scheduled:
      "bg-[#EFF8FD] text-[#2877A6] border-[#C9E3F5]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] ||
        "border-[#D9E9E7] bg-[#F5FAF9] text-[#527071]"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

/* =========================================================
   INFORMATION ITEM
========================================================= */

const InfoItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}) => {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex items-center gap-1.5">
        <Icon
          size={14}
          className="shrink-0 text-[#08A6A0]"
        />

        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
          {label}
        </p>
      </div>

      <p className="mt-1.5 break-words text-sm font-semibold text-[#173F41]">
        {value || "-"}
      </p>
    </div>
  );
};

/* =========================================================
   SECTION
========================================================= */

const ProfileSection = ({
  icon: Icon,
  title,
  children,
}) => {
  return (
    <section className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white">
      <div className="flex items-center gap-2 border-b border-[#EAF2F0] bg-[#FAFDFC] px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
          <Icon size={15} />
        </div>

        <h3 className="text-sm font-bold text-[#173F41]">
          {title}
        </h3>
      </div>

      <div className="p-4">
        {children}
      </div>
    </section>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  text,
}) {
  return (
    <div className="rounded-lg border border-dashed border-[#D9E9E7] bg-[#FAFDFC] px-4 py-7 text-center">
      <Icon
        size={20}
        className="mx-auto text-[#9DB5B4]"
      />

      <p className="mt-2 text-xs font-semibold text-[#527071]">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   PATIENT PROBLEM CARD
========================================================= */

function PatientProblemCard({ problem }) {
  if (!problem) {
    return (
      <EmptyState
        icon={FileText}
        text="No patient problem or disease recorded"
      />
    );
  }

  return (
    <div className="rounded-xl border border-[#BCE8E2] bg-[#E8F8F6] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#08A6A0]">
          <Activity size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#087F7A]">
            Registered Problem / Disease
          </p>

          <p className="mt-1.5 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-[#173F41]">
            {problem}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   IDENTIFICATION DOCUMENT
========================================================= */

function IdentificationDocument({ patient }) {
  const documentUrl =
    getIdentificationDocument(patient);

  const documentName =
    getIdentificationDocumentName(patient);

  const identificationType =
    patient?.identificationType ||
    patient?.identification_type;

  if (!documentUrl && !documentName) {
    return (
      <div className="rounded-lg border border-dashed border-[#D9E9E7] bg-[#FAFDFC] px-4 py-5 text-center">
        <FileText
          size={20}
          className="mx-auto text-[#9DB5B4]"
        />

        <p className="mt-2 text-xs font-semibold text-[#527071]">
          No identification document uploaded
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#E2EFED] bg-[#FAFDFC] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
          <FileText size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            {identificationType ||
              "Identification Document"}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[#31585A]">
            {documentName ||
              "Identification Document"}
          </p>
        </div>
      </div>

      {documentUrl && (
        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E2EFED] bg-white px-3 py-2 text-xs font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#078E89]"
        >
          <ExternalLink size={14} />
          View Document
        </a>
      )}
    </div>
  );
}

/* =========================================================
   PATIENT PROFILE
========================================================= */

function PatientProfile({
  patient,
  open,
  onClose,
  onEdit,
}) {
  if (!open || !patient) {
    return null;
  }

  const name = getPatientName(patient);
  const patientId = getPatientId(patient);

  const activeServices = safeArray(
    patient?.activeServices
  );

  const services =
    activeServices.length > 0
      ? activeServices
      : safeArray(patient?.services);

  const appointments = safeArray(
    patient?.appointments
  );

  const labTests = safeArray(patient?.labTests);

  const requests = safeArray(
    patient?.requests || patient?.patientRequests
  );

  const assignedStaff = safeArray(
    patient?.assignedStaff
  );

  const fullAddress = [
    patient?.address,
    patient?.city,
    patient?.state,
    patient?.postalCode ||
      patient?.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  const patientProblem =
    patient?.patientProblem ||
    patient?.problem ||
    patient?.disease ||
    patient?.reasonForRegistration ||
    patient?.reason_for_registration ||
    "";

  const firstName =
    patient?.firstName ||
    patient?.first_name;

  const middleName =
    patient?.middleName ||
    patient?.middle_name;

  const lastName =
    patient?.lastName ||
    patient?.last_name;

  const dateOfBirth =
    patient?.dateOfBirth ||
    patient?.date_of_birth ||
    patient?.dob;

  const bloodGroup =
    patient?.bloodGroup ||
    patient?.blood_group;

  const maritalStatus =
    patient?.maritalStatus ||
    patient?.marital_status;

  const registrationNumber =
    patient?.registrationNumber ||
    patient?.registration_number;

  const registrationDate =
    patient?.registrationDate ||
    patient?.registration_date;

  const emergencyContactName =
    patient?.emergencyContactName ||
    patient?.emergency_contact_name;

  const emergencyContactPhone =
    patient?.emergencyContactPhone ||
    patient?.emergency_contact_phone;

  const emergencyContactRelation =
    patient?.emergencyContactRelation ||
    patient?.emergency_contact_relation;

  const identificationType =
    patient?.identificationType ||
    patient?.identification_type;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[#173F41]/30
        p-3 backdrop-blur-[2px]
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

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="shrink-0 border-b border-[#E2EFED] bg-white">

          <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">

            <div className="flex min-w-0 items-center gap-3">

              {/* Header Avatar */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E8F8F6] text-base font-bold text-[#08A6A0] ring-4 ring-[#F3FBFA]">

                {patient?.photo ? (
                  <img
                    src={patient.photo}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(name)
                )}

              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="truncate text-lg font-bold text-[#173F41]">
                    {name}
                  </h2>

                  <StatusBadge
                    status={patient.status}
                  />

                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">

                  <p className="text-xs text-[#819596]">
                    Patient ID:{" "}
                    <span className="font-semibold text-[#527071]">
                      {patientId}
                    </span>
                  </p>

                  {registrationNumber && (
                    <p className="text-xs text-[#819596]">
                      Registration No:{" "}
                      <span className="font-semibold text-[#527071]">
                        {registrationNumber}
                      </span>
                    </p>
                  )}

                  {registrationDate && (
                    <p className="text-xs text-[#819596]">
                      Registered:{" "}
                      <span className="font-semibold text-[#527071]">
                        {registrationDate}
                      </span>
                    </p>
                  )}

                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                text-[#819596]
                transition
                hover:bg-[#FEF2F2]
                hover:text-[#B83A3A]
              "
              title="Close"
            >
              <X size={19} />
            </button>

          </div>

          {/* Quick status strip */}

          <div className="grid grid-cols-2 border-t border-[#EAF2F0] sm:grid-cols-4">

            <div className="border-b border-[#EAF2F0] px-5 py-3 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
                Admission
              </p>

              <p className="mt-1 text-xs font-bold text-[#173F41]">
                {getAdmissionStatus(patient)}
              </p>
            </div>

            <div className="border-b border-[#EAF2F0] px-5 py-3 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
                Room / Bed
              </p>

              <p className="mt-1 text-xs font-bold text-[#173F41]">
                {getRoomBed(patient)}
              </p>
            </div>

            <div className="border-r border-[#EAF2F0] px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
                Services
              </p>

              <p className="mt-1 text-xs font-bold text-[#173F41]">
                {services.length}
              </p>
            </div>

            <div className="px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
                Appointments
              </p>

              <p className="mt-1 text-xs font-bold text-[#173F41]">
                {appointments.length}
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            SCROLLABLE PROFILE CONTENT
        ====================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          <div className="space-y-4 p-4 sm:p-5">

            {/* =================================================
                1. PATIENT PHOTO + COMPLETE DETAILS
            ================================================== */}

            <ProfileSection
              icon={User}
              title="Patient Information"
            >

              <div className="flex flex-col gap-5 lg:flex-row">

                {/* Large Patient Photo */}

                <div className="flex shrink-0 justify-center lg:justify-start">

                  <div className="relative">

                    {patient?.photo ? (
                      <img
                        src={patient.photo}
                        alt={name}
                        className="
                          h-32 w-32
                          rounded-xl
                          border-4
                          border-[#E8F8F6]
                          object-cover
                          shadow-sm
                          sm:h-36 sm:w-36
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex h-32 w-32
                          items-center justify-center
                          rounded-xl
                          border-4
                          border-[#E8F8F6]
                          bg-[#FAFDFC]
                          text-2xl font-bold
                          text-[#08A6A0]
                          sm:h-36 sm:w-36
                        "
                      >
                        {getInitials(name)}
                      </div>
                    )}

                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#08A6A0] text-white">
                      <ShieldCheck size={14} />
                    </div>

                  </div>
                </div>

                {/* Patient Details */}

                <div className="min-w-0 flex-1">

                  <div className="mb-5">

                    <h3 className="text-xl font-bold text-[#173F41]">
                      {name}
                    </h3>

                    <p className="mt-1 text-xs text-[#819596]">
                      Patient ID:{" "}
                      <span className="font-semibold text-[#527071]">
                        {patientId}
                      </span>
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">

                    <InfoItem
                      icon={User}
                      label="First Name"
                      value={firstName}
                    />

                    <InfoItem
                      icon={User}
                      label="Middle Name"
                      value={middleName}
                    />

                    <InfoItem
                      icon={User}
                      label="Last Name"
                      value={lastName}
                    />

                    <InfoItem
                      icon={CalendarDays}
                      label="Date of Birth"
                      value={dateOfBirth}
                    />

                    <InfoItem
                      icon={User}
                      label="Age"
                      value={
                        patient.age !== undefined &&
                        patient.age !== null &&
                        patient.age !== ""
                          ? `${patient.age} years`
                          : "-"
                      }
                    />

                    <InfoItem
                      icon={User}
                      label="Gender"
                      value={patient.gender}
                    />

                    <InfoItem
                      icon={Droplets}
                      label="Blood Group"
                      value={bloodGroup}
                    />

                    <InfoItem
                      icon={User}
                      label="Marital Status"
                      value={maritalStatus}
                    />

                    <InfoItem
                      icon={User}
                      label="Occupation"
                      value={patient.occupation}
                    />

                    <InfoItem
                      icon={MapPin}
                      label="Nationality"
                      value={patient.nationality}
                    />

                  </div>
                </div>

              </div>

            </ProfileSection>

            {/* =================================================
                2. CONTACT INFORMATION
            ================================================== */}

            <ProfileSection
              icon={Phone}
              title="Contact Information"
            >

              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">

                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={patient.phone}
                />

                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={patient.email}
                />

                <InfoItem
                  icon={MapPin}
                  label="City"
                  value={patient.city}
                />

                <InfoItem
                  icon={MapPin}
                  label="State"
                  value={patient.state}
                />

                <InfoItem
                  icon={MapPin}
                  label="Postal Code"
                  value={
                    patient.postalCode ||
                    patient.postal_code
                  }
                />

                <div className="sm:col-span-2 lg:col-span-3">

                  <InfoItem
                    icon={MapPin}
                    label="Complete Address"
                    value={fullAddress}
                  />

                </div>

              </div>

            </ProfileSection>

            {/* =================================================
                3. EMERGENCY CONTACT
            ================================================== */}

            <ProfileSection
              icon={ShieldCheck}
              title="Emergency Contact"
            >

              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-3">

                <InfoItem
                  icon={User}
                  label="Contact Name"
                  value={emergencyContactName}
                />

                <InfoItem
                  icon={Phone}
                  label="Contact Phone"
                  value={emergencyContactPhone}
                />

                <InfoItem
                  icon={Users}
                  label="Relation"
                  value={emergencyContactRelation}
                />

              </div>

            </ProfileSection>

            {/* =================================================
                4. IDENTIFICATION
            ================================================== */}

            <ProfileSection
              icon={FileText}
              title="Identification"
            >

              <div className="space-y-4">

                <InfoItem
                  icon={ShieldCheck}
                  label="Identification Type"
                  value={identificationType}
                />

                <IdentificationDocument
                  patient={patient}
                />

              </div>

            </ProfileSection>

            {/* =================================================
                5. PATIENT PROBLEM / DISEASE
            ================================================== */}

            <ProfileSection
              icon={Activity}
              title="Patient Problem / Disease"
            >

              <PatientProblemCard
                problem={patientProblem}
              />

            </ProfileSection>

            {/* =================================================
                6. ADMISSION INFORMATION
            ================================================== */}

            <ProfileSection
              icon={BedDouble}
              title="Admission & Bed"
            >

              <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3">

                <InfoItem
                  icon={Activity}
                  label="Admission Status"
                  value={getAdmissionStatus(patient)}
                />

                <InfoItem
                  icon={BedDouble}
                  label="Room / Bed"
                  value={getRoomBed(patient)}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Admission Date"
                  value={
                    patient.admissionDate ||
                    patient.admittedDate
                  }
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Discharge Date"
                  value={patient.dischargeDate}
                />

                <InfoItem
                  icon={Stethoscope}
                  label="Doctor"
                  value={
                    patient.doctorName ||
                    patient.assignedDoctor
                  }
                />

                <InfoItem
                  icon={Users}
                  label="Patient Type"
                  value={
                    patient.patientType ||
                    "General"
                  }
                />

              </div>

            </ProfileSection>

            {/* =================================================
                7. ACTIVE SERVICES
            ================================================== */}

            <ProfileSection
              icon={HeartPulse}
              title="Active Services"
            >

              {services.length > 0 ? (

                <div className="grid gap-2.5 sm:grid-cols-2">

                  {services.map((service, index) => {

                    const serviceName =
                      getServiceName(service);

                    return (
                      <div
                        key={
                          service?.id ||
                          service?.serviceId ||
                          `${serviceName}-${index}`
                        }
                        className="
                          flex items-center
                          justify-between gap-3
                          rounded-lg
                          border border-[#E2EFED]
                          bg-[#FAFDFC]
                          px-3.5 py-3
                        "
                      >

                        <div className="flex min-w-0 items-center gap-3">

                          <div
                            className="
                              flex h-8 w-8 shrink-0
                              items-center justify-center
                              rounded-lg
                              bg-[#E8F8F6]
                              text-[#08A6A0]
                            "
                          >
                            <HeartPulse size={15} />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-[#31585A]">
                              {serviceName}
                            </p>

                            {service?.serviceId && (
                              <p className="mt-0.5 text-[10px] text-[#819596]">
                                {service.serviceId}
                              </p>
                            )}

                          </div>

                        </div>

                        <StatusBadge
                          status={getServiceStatus(
                            service
                          )}
                        />

                      </div>
                    );
                  })}

                </div>

              ) : (

                <EmptyState
                  icon={HeartPulse}
                  text="No active services"
                />

              )}

            </ProfileSection>

            {/* =================================================
                8. APPOINTMENTS
            ================================================== */}

            <ProfileSection
              icon={CalendarDays}
              title="Appointments"
            >

              {appointments.length > 0 ? (

                <div className="space-y-2.5">

                  {appointments.map(
                    (appointment, index) => (
                      <div
                        key={
                          appointment?.id ||
                          appointment?.appointmentId ||
                          index
                        }
                        className="
                          flex flex-col gap-2
                          rounded-lg
                          border border-[#E2EFED]
                          bg-[#FAFDFC]
                          p-3
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >

                        <div>

                          <p className="text-sm font-semibold text-[#31585A]">
                            {appointment?.doctorName ||
                              appointment?.doctor ||
                              "Doctor Appointment"}
                          </p>

                          <p className="mt-1 text-xs text-[#819596]">
                            {appointment?.date ||
                              appointment?.appointmentDate ||
                              "-"}
                            {appointment?.time
                              ? ` • ${appointment.time}`
                              : ""}
                          </p>

                        </div>

                        <StatusBadge
                          status={
                            appointment?.status ||
                            "Scheduled"
                          }
                        />

                      </div>
                    )
                  )}

                </div>

              ) : (

                <EmptyState
                  icon={CalendarDays}
                  text="No appointments recorded"
                />

              )}

            </ProfileSection>

            {/* =================================================
                9. LAB TESTS
            ================================================== */}

            <ProfileSection
              icon={ClipboardList}
              title="Lab Tests"
            >

              {labTests.length > 0 ? (

                <div className="space-y-2.5">

                  {labTests.map((test, index) => (

                    <div
                      key={
                        test?.id ||
                        test?.testId ||
                        index
                      }
                      className="
                        flex items-center
                        justify-between gap-3
                        rounded-lg
                        border border-[#E2EFED]
                        bg-[#FAFDFC]
                        p-3
                      "
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className="
                            flex h-8 w-8 shrink-0
                            items-center justify-center
                            rounded-lg
                            bg-[#EFF8FD]
                            text-[#2877A6]
                          "
                        >
                          <ClipboardList size={15} />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-[#31585A]">
                            {test?.name ||
                              test?.testName ||
                              "Lab Test"}
                          </p>

                          <p className="mt-0.5 text-xs text-[#819596]">
                            {test?.date ||
                              test?.testDate ||
                              "-"}
                          </p>

                        </div>

                      </div>

                      <StatusBadge
                        status={
                          test?.status ||
                          "Pending"
                        }
                      />

                    </div>

                  ))}

                </div>

              ) : (

                <EmptyState
                  icon={ClipboardList}
                  text="No lab tests recorded"
                />

              )}

            </ProfileSection>

            {/* =================================================
                10. PATIENT REQUESTS
            ================================================== */}

            <ProfileSection
              icon={FileText}
              title="Patient Requests"
            >

              {requests.length > 0 ? (

                <div className="space-y-2.5">

                  {requests.map(
                    (request, index) => (
                      <div
                        key={
                          request?.id ||
                          request?.requestId ||
                          index
                        }
                        className="
                          flex items-center
                          justify-between gap-3
                          rounded-lg
                          border border-[#E2EFED]
                          bg-[#FAFDFC]
                          p-3
                        "
                      >

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-[#31585A]">
                            {request?.title ||
                              request?.name ||
                              request?.requestType ||
                              "Patient Request"}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[#819596]">
                            {request?.description ||
                              request?.date ||
                              "-"}
                          </p>

                        </div>

                        <StatusBadge
                          status={
                            request?.status ||
                            "Pending"
                          }
                        />

                      </div>
                    )
                  )}

                </div>

              ) : (

                <EmptyState
                  icon={FileText}
                  text="No requests recorded"
                />

              )}

            </ProfileSection>

            {/* =================================================
                11. ASSIGNED STAFF
            ================================================== */}

            <ProfileSection
              icon={Users}
              title="Assigned Staff"
            >

              {assignedStaff.length > 0 ? (

                <div className="grid gap-2.5 sm:grid-cols-2">

                  {assignedStaff.map(
                    (staff, index) => (
                      <div
                        key={
                          staff?.id ||
                          staff?.staffId ||
                          index
                        }
                        className="
                          flex items-center gap-3
                          rounded-lg
                          border border-[#E2EFED]
                          bg-[#FAFDFC]
                          p-3
                        "
                      >

                        <div
                          className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-full
                            bg-[#E8F8F6]
                            text-[#08A6A0]
                          "
                        >
                          <User size={16} />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-[#31585A]">
                            {staff?.name ||
                              staff?.fullName ||
                              "Staff Member"}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[#819596]">
                            {staff?.role ||
                              staff?.designation ||
                              "Hospital Staff"}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <EmptyState
                  icon={Users}
                  text="No assigned staff"
                />

              )}

            </ProfileSection>

          </div>
        </div>

        {/* =====================================================
            FIXED FOOTER
        ====================================================== */}

        <div
          className="
            shrink-0
            border-t border-[#E2EFED]
            bg-white
            px-4 py-3
            sm:px-5
          "
        >

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">

            <p className="hidden text-xs text-[#819596] sm:block">
              Patient ID:{" "}
              <span className="font-semibold text-[#527071]">
                {patientId}
              </span>
            </p>

            <div className="flex w-full gap-2 sm:w-auto">

              <button
                type="button"
                onClick={onClose}
                className="
                  flex-1 rounded-lg
                  border border-[#D9E9E7]
                  bg-white px-4 py-2.5
                  text-sm font-semibold
                  text-[#527071]
                  transition
                  hover:bg-[#FAFDFC]
                  hover:text-[#31585A]
                  sm:flex-none
                "
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => onEdit(patient)}
                className="
                  flex flex-1
                  items-center justify-center gap-2
                  rounded-lg
                  bg-[#08A6A0]
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#078F8A]
                  sm:flex-none
                "
              >
                <Edit3 size={15} />
                Edit Patient
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default PatientProfile;