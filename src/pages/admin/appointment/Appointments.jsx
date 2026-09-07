import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Edit3,
  Eye,
  Filter,
  MapPin,
  Plus,
  Search,
  Stethoscope,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

/* =========================================================
   APPOINTMENT DATA
========================================================= */

const initialAppointments = [
  {
    id: "APT-1001",
    patient: "Rahul Sharma",
    patientId: "PAT-1001",
    phone: "+91 98765 45001",
    doctor: "Dr. Arindam Sen",
    doctorId: "EMP-1001",
    department: "General Medicine",
    service: "General Consultation",
    date: "2026-09-08",
    time: "10:00 AM",
    duration: "30 Minutes",
    type: "In-Person",
    status: "Confirmed",
    paymentStatus: "Paid",
    amount: 500,
    location: "Consultation Room 101",
    notes: "Regular consultation",
  },
  {
    id: "APT-1002",
    patient: "Priya Das",
    patientId: "PAT-1002",
    phone: "+91 98765 45002",
    doctor: "Dr. Sneha Sen",
    doctorId: "EMP-1009",
    department: "Dental",
    service: "Dental Checkup",
    date: "2026-09-08",
    time: "11:30 AM",
    duration: "45 Minutes",
    type: "In-Person",
    status: "Pending",
    paymentStatus: "Pending",
    amount: 800,
    location: "Dental Room 202",
    notes: "Dental examination",
  },
  {
    id: "APT-1003",
    patient: "Arjun Ghosh",
    patientId: "PAT-1003",
    phone: "+91 98765 45003",
    doctor: "Dr. Ananya Das",
    doctorId: "EMP-1010",
    department: "Pathology",
    service: "Blood Test",
    date: "2026-09-09",
    time: "09:00 AM",
    duration: "20 Minutes",
    type: "In-Person",
    status: "Completed",
    paymentStatus: "Paid",
    amount: 350,
    location: "Laboratory",
    notes: "CBC and blood sugar test",
  },
  {
    id: "APT-1004",
    patient: "Sneha Mukherjee",
    patientId: "PAT-1004",
    phone: "+91 98765 45004",
    doctor: "Dr. Rajiv Kumar",
    doctorId: "EMP-1011",
    department: "Cardiology",
    service: "Cardiology Consultation",
    date: "2026-09-10",
    time: "02:00 PM",
    duration: "45 Minutes",
    type: "In-Person",
    status: "Confirmed",
    paymentStatus: "Pending",
    amount: 1200,
    location: "Cardiology Room 305",
    notes: "Heart checkup",
  },
  {
    id: "APT-1005",
    patient: "Sourav Dey",
    patientId: "PAT-1005",
    phone: "+91 98765 45005",
    doctor: "Dr. Rohan Paul",
    doctorId: "EMP-1012",
    department: "Physiotherapy",
    service: "Physiotherapy",
    date: "2026-09-11",
    time: "04:30 PM",
    duration: "60 Minutes",
    type: "In-Person",
    status: "Cancelled",
    paymentStatus: "Refunded",
    amount: 700,
    location: "Physiotherapy Room 401",
    notes: "Physiotherapy session",
  },
  {
    id: "APT-1006",
    patient: "Moumita Roy",
    patientId: "PAT-1006",
    phone: "+91 98765 45006",
    doctor: "Dr. Arindam Sen",
    doctorId: "EMP-1001",
    department: "General Medicine",
    service: "Follow-up Consultation",
    date: "2026-09-12",
    time: "11:00 AM",
    duration: "30 Minutes",
    type: "In-Person",
    status: "Confirmed",
    paymentStatus: "Paid",
    amount: 400,
    location: "Consultation Room 101",
    notes: "Follow-up visit",
  },
];

/* =========================================================
   OPTIONS
========================================================= */

const doctorOptions = [
  "Dr. Arindam Sen",
  "Dr. Sneha Sen",
  "Dr. Ananya Das",
  "Dr. Rajiv Kumar",
  "Dr. Rohan Paul",
];

const patientOptions = [
  "Rahul Sharma",
  "Priya Das",
  "Arjun Ghosh",
  "Sneha Mukherjee",
  "Sourav Dey",
  "Moumita Roy",
];

const serviceOptions = [
  "General Consultation",
  "Follow-up Consultation",
  "Dental Checkup",
  "Blood Test",
  "Cardiology Consultation",
  "Physiotherapy",
];

const appointmentTypeOptions = [
  "In-Person",
  "Online",
  "Home Visit",
];

const statusOptions = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const paymentOptions = [
  "All",
  "Paid",
  "Pending",
  "Refunded",
];

/* =========================================================
   STYLES
========================================================= */

const statusStyles = {
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Completed: "bg-blue-50 text-blue-700 border-blue-100",
  Cancelled: "bg-red-50 text-red-700 border-red-100",
};

const paymentStyles = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Refunded: "bg-slate-50 text-slate-700 border-slate-200",
};

const emptyForm = {
  patient: "",
  doctor: "",
  service: "General Consultation",
  date: "",
  time: "",
  duration: "30 Minutes",
  type: "In-Person",
  amount: "",
  location: "",
  paymentStatus: "Pending",
  notes: "",
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Appointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: appointments.length,

      today: appointments.filter(
        (appointment) =>
          appointment.date === "2026-09-08" &&
          appointment.status !== "Cancelled"
      ).length,

      confirmed: appointments.filter(
        (appointment) => appointment.status === "Confirmed"
      ).length,

      pending: appointments.filter(
        (appointment) => appointment.status === "Pending"
      ).length,

      completed: appointments.filter(
        (appointment) => appointment.status === "Completed"
      ).length,
    };
  }, [appointments]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredAppointments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !query ||
        appointment.id.toLowerCase().includes(query) ||
        appointment.patient.toLowerCase().includes(query) ||
        appointment.doctor.toLowerCase().includes(query) ||
        appointment.service.toLowerCase().includes(query) ||
        appointment.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        appointment.paymentStatus === paymentFilter;

      const matchesDate =
        !dateFilter ||
        appointment.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesDate
      );
    });
  }, [
    appointments,
    search,
    statusFilter,
    paymentFilter,
    dateFilter,
  ]);

  /* =======================================================
     FORM
  ======================================================= */

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAddAppointment = (event) => {
    event.preventDefault();

    if (!form.patient) {
      setFormError("Patient is required.");
      return;
    }

    if (!form.doctor) {
      setFormError("Doctor is required.");
      return;
    }

    if (!form.service) {
      setFormError("Service is required.");
      return;
    }

    if (!form.date) {
      setFormError("Appointment date is required.");
      return;
    }

    if (!form.time) {
      setFormError("Appointment time is required.");
      return;
    }

    const newAppointment = {
      ...form,
      id: `APT-${1001 + appointments.length}`,
      patientId: `PAT-${1001 + appointments.length}`,
      doctorId: `EMP-${1001 + appointments.length}`,
      phone: "+91 XXXXX XXXXX",
      department: "General Medicine",
      duration: form.duration || "30 Minutes",
      amount: Number(form.amount) || 0,
      status: "Pending",
      notes: form.notes || "No additional notes",
    };

    setAppointments((current) => [
      newAppointment,
      ...current,
    ]);

    setForm(emptyForm);
    setFormError("");
    setShowAddModal(false);
  };

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  const updateAppointmentStatus = (id, status) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status,
            }
          : appointment
      )
    );

    setSelectedAppointment((current) =>
      current
        ? {
            ...current,
            status,
          }
        : current
    );
  };

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
            APPOINTMENT MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">
            Appointments
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#789092]">
            Schedule and manage patient appointments, doctor
            availability, consultation timings and appointment
            status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setFormError("");
            setShowAddModal(true);
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white shadow-lg shadow-[#08A6A0]/15 transition hover:bg-[#078F8A]"
        >
          <Plus className="h-4 w-4" />
          New Appointment
        </button>
      </div>

      {/* ===================================================
          STATS
      =================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          icon={CalendarDays}
          label="Total Appointments"
          value={stats.total}
        />

        <StatCard
          icon={Clock3}
          label="Today's Appointments"
          value={stats.today}
        />

        <StatCard
          icon={CheckCircle2}
          label="Confirmed"
          value={stats.confirmed}
        />

        <StatCard
          icon={Activity}
          label="Pending"
          value={stats.pending}
        />

        <StatCard
          icon={UserCheck}
          label="Completed"
          value={stats.completed}
        />
      </div>

      {/* ===================================================
          SEARCH / FILTER
      =================================================== */}

      <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search appointment ID, patient, doctor, service..."
              className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-10 pr-4 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setShowFilters((value) => !value)
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-[#EAF2F0] pt-4 md:grid-cols-3">
            <FilterSelect
              label="Appointment Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />

            <FilterSelect
              label="Payment Status"
              value={paymentFilter}
              onChange={setPaymentFilter}
              options={paymentOptions}
            />

            <label>
              <span className="mb-1.5 block text-xs font-bold text-[#708789]">
                Appointment Date
              </span>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
                className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
              />
            </label>
          </div>
        )}
      </div>

      {/* ===================================================
          APPOINTMENT LIST
      =================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAF2F0] px-5 py-4">
          <div>
            <h2 className="font-bold text-[#073F42]">
              Appointment Schedule
            </h2>

            <p className="mt-1 text-xs text-[#819596]">
              {filteredAppointments.length} appointment
              {filteredAppointments.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <EmptyState
            onClear={() => {
              setSearch("");
              setStatusFilter("All");
              setPaymentFilter("All");
              setDateFilter("");
            }}
          />
        ) : (
          <>
            {/* DESKTOP */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-[#EAF2F0] bg-[#FAFDFC] text-left">
                    <TableHeader>
                      Appointment
                    </TableHeader>

                    <TableHeader>
                      Patient
                    </TableHeader>

                    <TableHeader>
                      Doctor
                    </TableHeader>

                    <TableHeader>
                      Service
                    </TableHeader>

                    <TableHeader>
                      Date & Time
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader>
                      Payment
                    </TableHeader>

                    <TableHeader align="right">
                      Action
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map(
                    (appointment) => (
                      <AppointmentRow
                        key={appointment.id}
                        appointment={appointment}
                        onView={() =>
                          setSelectedAppointment(
                            appointment
                          )
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}

            <div className="divide-y divide-[#EAF2F0] lg:hidden">
              {filteredAppointments.map(
                (appointment) => (
                  <AppointmentMobileCard
                    key={appointment.id}
                    appointment={appointment}
                    onView={() =>
                      setSelectedAppointment(
                        appointment
                      )
                    }
                  />
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* ===================================================
          DETAILS MODAL
      =================================================== */}

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() =>
            setSelectedAppointment(null)
          }
          onStatusChange={updateAppointmentStatus}
        />
      )}

      {/* ===================================================
          ADD APPOINTMENT MODAL
      =================================================== */}

      {showAddModal && (
        <AddAppointmentModal
          form={form}
          error={formError}
          onChange={updateForm}
          onSubmit={handleAddAppointment}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6]">
          <Icon className="h-5 w-5 text-[#08A6A0]" />
        </div>

        <span className="text-2xl font-bold text-[#073F42]">
          {value}
        </span>
      </div>

      <p className="mt-3 text-xs font-semibold text-[#819596]">
        {label}
      </p>
    </div>
  );
};

/* =========================================================
   TABLE HEADER
========================================================= */

const TableHeader = ({ children, align = "left" }) => {
  return (
    <th
      className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
};

/* =========================================================
   DESKTOP ROW
========================================================= */

const AppointmentRow = ({ appointment, onView }) => {
  return (
    <tr className="border-b border-[#EAF2F0] last:border-0 hover:bg-[#FAFDFC]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6]">
            <CalendarDays className="h-5 w-5 text-[#08A6A0]" />
          </div>

          <div>
            <p className="text-sm font-bold text-[#173F41]">
              {appointment.id}
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              {appointment.type}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-bold text-[#173F41]">
          {appointment.patient}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {appointment.patientId}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-[#31585A]">
          {appointment.doctor}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {appointment.department}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {appointment.service}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          ₹{appointment.amount}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-[#31585A]">
          {formatDate(appointment.date)}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {appointment.time} · {appointment.duration}
        </p>
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={appointment.status} />
      </td>

      <td className="px-5 py-4">
        <PaymentBadge
          status={appointment.paymentStatus}
        />
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onView}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
            title="View appointment"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   MOBILE CARD
========================================================= */

const AppointmentMobileCard = ({
  appointment,
  onView,
}) => {
  return (
    <button
      type="button"
      onClick={onView}
      className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-[#FAFDFC]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6]">
        <CalendarDays className="h-5 w-5 text-[#08A6A0]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#173F41]">
              {appointment.patient}
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              {appointment.id}
            </p>
          </div>

          <StatusBadge status={appointment.status} />
        </div>

        <div className="mt-3">
          <p className="text-sm font-semibold text-[#31585A]">
            {appointment.service}
          </p>

          <p className="mt-1 text-xs text-[#819596]">
            {appointment.doctor}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#819596]">
          <span>
            {formatDate(appointment.date)}
          </span>

          <span>{appointment.time}</span>

          <span>₹{appointment.amount}</span>
        </div>
      </div>

      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#9AAEAF]" />
    </button>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const style =
    statusStyles[status] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
};

/* =========================================================
   PAYMENT BADGE
========================================================= */

const PaymentBadge = ({ status }) => {
  const style =
    paymentStyles[status] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
};

/* =========================================================
   APPOINTMENT DETAILS
========================================================= */

const AppointmentDetails = ({
  appointment,
  onClose,
  onStatusChange,
}) => {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#073F42]/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* HEADER */}

          <div className="bg-[#073F42] p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <CalendarDays className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Appointment Details
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {appointment.id}
                  </h2>

                  <p className="mt-1 text-xs text-white/60">
                    {appointment.date} ·{" "}
                    {appointment.time}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            {/* BADGES */}

            <div className="flex flex-wrap gap-2">
              <StatusBadge status={appointment.status} />

              <PaymentBadge
                status={appointment.paymentStatus}
              />

              <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#087F7A]">
                {appointment.type}
              </span>
            </div>

            {/* APPOINTMENT OVERVIEW */}

            <section>
              <SectionTitle title="Appointment Overview" />

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  icon={CalendarDays}
                  label="Date"
                  value={formatDate(appointment.date)}
                />

                <DetailItem
                  icon={Clock3}
                  label="Time"
                  value={appointment.time}
                />

                <DetailItem
                  icon={Activity}
                  label="Duration"
                  value={appointment.duration}
                />

                <DetailItem
                  icon={CreditCard}
                  label="Amount"
                  value={`₹${appointment.amount}`}
                />
              </div>
            </section>

            {/* PATIENT + DOCTOR */}

            <div className="grid gap-6 lg:grid-cols-2">
              <section>
                <SectionTitle title="Patient Information" />

                <div className="mt-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] text-sm font-bold text-[#087F7A]">
                      {getInitials(
                        appointment.patient
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#173F41]">
                        {appointment.patient}
                      </p>

                      <p className="mt-1 text-xs text-[#819596]">
                        {appointment.patientId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#EAF2F0] pt-4">
                    <p className="text-xs text-[#819596]">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#31585A]">
                      {appointment.phone}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <SectionTitle title="Doctor Information" />

                <div className="mt-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6]">
                      <Stethoscope className="h-5 w-5 text-[#08A6A0]" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#173F41]">
                        {appointment.doctor}
                      </p>

                      <p className="mt-1 text-xs text-[#819596]">
                        {appointment.department}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#EAF2F0] pt-4">
                    <p className="text-xs text-[#819596]">
                      Service
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#31585A]">
                      {appointment.service}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* LOCATION */}

            <section>
              <SectionTitle title="Appointment Location" />

              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6]">
                  <MapPin className="h-5 w-5 text-[#08A6A0]" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#173F41]">
                    {appointment.location}
                  </p>

                  <p className="mt-1 text-xs text-[#819596]">
                    {appointment.type} appointment
                  </p>
                </div>
              </div>
            </section>

            {/* NOTES */}

            <section>
              <SectionTitle title="Appointment Notes" />

              <div className="mt-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <p className="text-sm leading-6 text-[#31585A]">
                  {appointment.notes ||
                    "No additional notes available."}
                </p>
              </div>
            </section>

            {/* ACTIONS */}

            <section>
              <SectionTitle title="Appointment Actions" />

              <div className="mt-3 flex flex-wrap gap-3">
                {appointment.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        appointment.id,
                        "Confirmed"
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Appointment
                  </button>
                )}

                {appointment.status === "Confirmed" && (
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        appointment.id,
                        "Completed"
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Completed
                  </button>
                )}

                {appointment.status !== "Cancelled" &&
                  appointment.status !== "Completed" && (
                    <button
                      type="button"
                      onClick={() =>
                        onStatusChange(
                          appointment.id,
                          "Cancelled"
                        )
                      }
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Appointment
                    </button>
                  )}

                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Appointment
                </button>
              </div>
            </section>

            <div className="flex justify-end border-t border-[#EAF2F0] pt-5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ADD APPOINTMENT MODAL
========================================================= */

const AddAppointmentModal = ({
  form,
  error,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#073F42]/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-[#EAF2F0] p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                APPOINTMENT MANAGEMENT
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#073F42]">
                Create New Appointment
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#F5FAF9] hover:text-[#073F42]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* FORM */}

          <form
            onSubmit={onSubmit}
            className="p-5 sm:p-6"
          >
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormSelect
                label="Patient"
                required
                value={form.patient}
                onChange={(value) =>
                  onChange("patient", value)
                }
                options={patientOptions}
                placeholder="Select patient"
              />

              <FormSelect
                label="Doctor"
                required
                value={form.doctor}
                onChange={(value) =>
                  onChange("doctor", value)
                }
                options={doctorOptions}
                placeholder="Select doctor"
              />

              <FormSelect
                label="Service"
                required
                value={form.service}
                onChange={(value) =>
                  onChange("service", value)
                }
                options={serviceOptions}
              />

              <FormSelect
                label="Appointment Type"
                value={form.type}
                onChange={(value) =>
                  onChange("type", value)
                }
                options={appointmentTypeOptions}
              />

              <FormField
                label="Appointment Date"
                required
                type="date"
                value={form.date}
                onChange={(value) =>
                  onChange("date", value)
                }
              />

              <FormField
                label="Appointment Time"
                required
                type="time"
                value={form.time}
                onChange={(value) =>
                  onChange("time", value)
                }
              />

              <FormSelect
                label="Duration"
                value={form.duration}
                onChange={(value) =>
                  onChange("duration", value)
                }
                options={[
                  "20 Minutes",
                  "30 Minutes",
                  "45 Minutes",
                  "60 Minutes",
                  "90 Minutes",
                ]}
              />

              <FormField
                label="Amount"
                type="number"
                value={form.amount}
                onChange={(value) =>
                  onChange("amount", value)
                }
                placeholder="Enter amount"
              />

              <div className="sm:col-span-2">
                <FormField
                  label="Location"
                  value={form.location}
                  onChange={(value) =>
                    onChange("location", value)
                  }
                  placeholder="e.g. Consultation Room 101"
                />
              </div>

              <div className="sm:col-span-2">
                <label>
                  <span className="mb-1.5 block text-xs font-bold text-[#708789]">
                    Notes
                  </span>

                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      onChange(
                        "notes",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Add appointment notes..."
                    className="w-full resize-none rounded-xl border border-[#D9E9E7] bg-white px-3 py-3 text-sm text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </label>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl border border-[#D9E9E7] px-5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                <CalendarDays className="h-4 w-4" />
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      />
    </label>
  );
};

/* =========================================================
   FORM SELECT
========================================================= */

const FormSelect = ({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

/* =========================================================
   FILTER SELECT
========================================================= */

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({ title }) => {
  return (
    <h3 className="text-sm font-bold text-[#073F42]">
      {title}
    </h3>
  );
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-3">
      <Icon className="h-4 w-4 text-[#08A6A0]" />

      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#9AAEAF]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ onClear }) => {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6]">
        <CalendarDays className="h-6 w-6 text-[#08A6A0]" />
      </div>

      <h3 className="mt-4 font-bold text-[#073F42]">
        No appointments found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#819596]">
        No appointments match the current search or
        filters. Try changing your search criteria.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 text-sm font-semibold text-[#08A6A0] hover:text-[#078F8A]"
      >
        Clear filters
      </button>
    </div>
  );
};

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export default Appointments;