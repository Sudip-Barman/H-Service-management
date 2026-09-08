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
  Plus,
  Search,
  Stethoscope,
  UserCheck,
  X,
  XCircle,
  AlertTriangle,
  FileText,
  UserRound,
} from "lucide-react";

/* =========================================================
   APPOINTMENT DATA
   Database mapping:

   appointment_id
   appointment_number
   patient_id
   doctor_id
   service_id
   appointment_date
   appointment_time
   appointment_type
   reason
   priority
   status
   consultation_fee
   notes
   created_by
   created_at
   updated_at
   ========================================================= */

const initialAppointments = [
  {
    appointment_id: 1,
    appointment_number: "APT-1001",

    patient_id: 1,
    patient: "Rahul Sharma",
    patient_registration_number: "PAT-1001",

    doctor_id: 1,
    doctor: "Dr. Arindam Sen",

    service_id: 1,
    service: "General Consultation",

    appointment_date: "2026-09-08",
    appointment_time: "10:00",

    appointment_type: "In-Person",

    reason: "Regular consultation",

    priority: "Normal",

    status: "Confirmed",

    consultation_fee: 500,

    notes: "Patient requested regular consultation.",

    created_by: 1,

    created_at: "2026-09-07 10:30:00",
    updated_at: "2026-09-07 10:30:00",
  },

  {
    appointment_id: 2,
    appointment_number: "APT-1002",

    patient_id: 2,
    patient: "Priya Das",
    patient_registration_number: "PAT-1002",

    doctor_id: 2,
    doctor: "Dr. Sneha Sen",

    service_id: 2,
    service: "Dental Checkup",

    appointment_date: "2026-09-08",
    appointment_time: "11:30",

    appointment_type: "In-Person",

    reason: "Dental examination",

    priority: "Normal",

    status: "Scheduled",

    consultation_fee: 800,

    notes: "Dental examination required.",

    created_by: 1,

    created_at: "2026-09-07 11:00:00",
    updated_at: "2026-09-07 11:00:00",
  },

  {
    appointment_id: 3,
    appointment_number: "APT-1003",

    patient_id: 3,
    patient: "Arjun Ghosh",
    patient_registration_number: "PAT-1003",

    doctor_id: 3,
    doctor: "Dr. Ananya Das",

    service_id: 3,
    service: "Blood Test",

    appointment_date: "2026-09-09",
    appointment_time: "09:00",

    appointment_type: "In-Person",

    reason: "CBC and blood sugar test",

    priority: "High",

    status: "Completed",

    consultation_fee: 350,

    notes: "Laboratory test completed.",

    created_by: 1,

    created_at: "2026-09-07 12:00:00",
    updated_at: "2026-09-09 10:00:00",
  },

  {
    appointment_id: 4,
    appointment_number: "APT-1004",

    patient_id: 4,
    patient: "Sneha Mukherjee",
    patient_registration_number: "PAT-1004",

    doctor_id: 4,
    doctor: "Dr. Rajiv Kumar",

    service_id: 4,
    service: "Cardiology Consultation",

    appointment_date: "2026-09-10",
    appointment_time: "14:00",

    appointment_type: "In-Person",

    reason: "Heart checkup",

    priority: "High",

    status: "Confirmed",

    consultation_fee: 1200,

    notes: "Cardiology consultation.",

    created_by: 1,

    created_at: "2026-09-07 13:00:00",
    updated_at: "2026-09-07 13:00:00",
  },

  {
    appointment_id: 5,
    appointment_number: "APT-1005",

    patient_id: 5,
    patient: "Sourav Dey",
    patient_registration_number: "PAT-1005",

    doctor_id: 5,
    doctor: "Dr. Rohan Paul",

    service_id: 5,
    service: "Physiotherapy",

    appointment_date: "2026-09-11",
    appointment_time: "16:30",

    appointment_type: "In-Person",

    reason: "Physiotherapy session",

    priority: "Normal",

    status: "Cancelled",

    consultation_fee: 700,

    notes: "Appointment cancelled by patient.",

    created_by: 1,

    created_at: "2026-09-07 14:00:00",
    updated_at: "2026-09-10 09:00:00",
  },

  {
    appointment_id: 6,
    appointment_number: "APT-1006",

    patient_id: 6,
    patient: "Moumita Roy",
    patient_registration_number: "PAT-1006",

    doctor_id: 1,
    doctor: "Dr. Arindam Sen",

    service_id: 6,
    service: "Follow-up Consultation",

    appointment_date: "2026-09-12",
    appointment_time: "11:00",

    appointment_type: "In-Person",

    reason: "Follow-up visit",

    priority: "Normal",

    status: "Scheduled",

    consultation_fee: 400,

    notes: "Follow-up consultation.",

    created_by: 1,

    created_at: "2026-09-07 15:00:00",
    updated_at: "2026-09-07 15:00:00",
  },
];

/* =========================================================
   OPTIONS

   In the real backend these should come from:
   patients
   doctors
   services
   staff
   ========================================================= */

const patientOptions = [
  { id: 1, name: "Rahul Sharma", registrationNumber: "PAT-1001" },
  { id: 2, name: "Priya Das", registrationNumber: "PAT-1002" },
  { id: 3, name: "Arjun Ghosh", registrationNumber: "PAT-1003" },
  { id: 4, name: "Sneha Mukherjee", registrationNumber: "PAT-1004" },
  { id: 5, name: "Sourav Dey", registrationNumber: "PAT-1005" },
  { id: 6, name: "Moumita Roy", registrationNumber: "PAT-1006" },
];

const doctorOptions = [
  { id: 1, name: "Dr. Arindam Sen" },
  { id: 2, name: "Dr. Sneha Sen" },
  { id: 3, name: "Dr. Ananya Das" },
  { id: 4, name: "Dr. Rajiv Kumar" },
  { id: 5, name: "Dr. Rohan Paul" },
];

const serviceOptions = [
  { id: 1, name: "General Consultation" },
  { id: 2, name: "Dental Checkup" },
  { id: 3, name: "Blood Test" },
  { id: 4, name: "Cardiology Consultation" },
  { id: 5, name: "Physiotherapy" },
  { id: 6, name: "Follow-up Consultation" },
];

const staffOptions = [
  { id: 1, name: "Reception Staff" },
];

const appointmentTypeOptions = [
  "In-Person",
  "Online",
  "Home Visit",
];

const priorityOptions = [
  "Low",
  "Normal",
  "High",
  "Emergency",
];

const statusOptions = [
  "All",
  "Scheduled",
  "Confirmed",
  "Completed",
  "Cancelled",
  "No Show",
];

/* =========================================================
   STYLES
   ========================================================= */

const statusStyles = {
  Scheduled:
    "bg-slate-50 text-slate-700 border-slate-200",

  Confirmed:
    "bg-emerald-50 text-emerald-700 border-emerald-100",

  Completed:
    "bg-blue-50 text-blue-700 border-blue-100",

  Cancelled:
    "bg-red-50 text-red-700 border-red-100",

  "No Show":
    "bg-orange-50 text-orange-700 border-orange-100",
};

const priorityStyles = {
  Low:
    "bg-slate-50 text-slate-700 border-slate-200",

  Normal:
    "bg-[#E8F8F6] text-[#087F7A] border-[#D5F0ED]",

  High:
    "bg-amber-50 text-amber-700 border-amber-100",

  Emergency:
    "bg-red-50 text-red-700 border-red-100",
};

const emptyForm = {
  appointment_number: "",
  patient_id: "",
  doctor_id: "",
  service_id: "",
  appointment_date: "",
  appointment_time: "",
  appointment_type: "In-Person",
  reason: "",
  priority: "Normal",
  status: "Scheduled",
  consultation_fee: "",
  notes: "",
  created_by: 1,
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const Appointments = () => {
  const [appointments, setAppointments] =
    useState(initialAppointments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] =
    useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [editingAppointment, setEditingAppointment] =
    useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  /* =======================================================
     STATS
     ======================================================= */

  const stats = useMemo(() => {
    const today = "2026-09-08";

    return {
      total: appointments.length,

      today: appointments.filter(
        (appointment) =>
          appointment.appointment_date === today &&
          appointment.status !== "Cancelled"
      ).length,

      scheduled: appointments.filter(
        (appointment) =>
          appointment.status === "Scheduled"
      ).length,

      confirmed: appointments.filter(
        (appointment) =>
          appointment.status === "Confirmed"
      ).length,

      completed: appointments.filter(
        (appointment) =>
          appointment.status === "Completed"
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
        appointment.appointment_number
          .toLowerCase()
          .includes(query) ||
        appointment.patient
          .toLowerCase()
          .includes(query) ||
        appointment.doctor
          .toLowerCase()
          .includes(query) ||
        appointment.service
          .toLowerCase()
          .includes(query) ||
        appointment.reason
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        appointment.priority === priorityFilter;

      const matchesDate =
        !dateFilter ||
        appointment.appointment_date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDate
      );
    });
  }, [
    appointments,
    search,
    statusFilter,
    priorityFilter,
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

  const generateAppointmentNumber = () => {
    const maxNumber = appointments.reduce(
      (max, appointment) => {
        const number = Number(
          appointment.appointment_number.replace(
            "APT-",
            ""
          )
        );

        return Number.isNaN(number)
          ? max
          : Math.max(max, number);
      },
      1000
    );

    return `APT-${maxNumber + 1}`;
  };

  const handleOpenAdd = () => {
    setEditingAppointment(null);

    setForm({
      ...emptyForm,
      appointment_number:
        generateAppointmentNumber(),
    });

    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (appointment) => {
    setEditingAppointment(appointment);

    setForm({
      appointment_number:
        appointment.appointment_number,

      patient_id: String(
        appointment.patient_id
      ),

      doctor_id: String(
        appointment.doctor_id
      ),

      service_id: String(
        appointment.service_id || ""
      ),

      appointment_date:
        appointment.appointment_date,

      appointment_time:
        appointment.appointment_time,

      appointment_type:
        appointment.appointment_type ||
        "In-Person",

      reason:
        appointment.reason || "",

      priority:
        appointment.priority || "Normal",

      status:
        appointment.status || "Scheduled",

      consultation_fee:
        appointment.consultation_fee ?? "",

      notes:
        appointment.notes || "",

      created_by:
        appointment.created_by || 1,
    });

    setFormError("");
    setSelectedAppointment(null);
    setShowAddModal(true);
  };

  /* =======================================================
     CREATE / UPDATE
     ======================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.appointment_number.trim()) {
      setFormError("Appointment number is required.");
      return;
    }

    if (!form.patient_id) {
      setFormError("Patient is required.");
      return;
    }

    if (!form.doctor_id) {
      setFormError("Doctor is required.");
      return;
    }

    if (!form.appointment_date) {
      setFormError("Appointment date is required.");
      return;
    }

    if (!form.appointment_time) {
      setFormError("Appointment time is required.");
      return;
    }

    if (
      form.consultation_fee !== "" &&
      Number(form.consultation_fee) < 0
    ) {
      setFormError(
        "Consultation fee cannot be negative."
      );
      return;
    }

    const patient = patientOptions.find(
      (item) =>
        String(item.id) === String(form.patient_id)
    );

    const doctor = doctorOptions.find(
      (item) =>
        String(item.id) === String(form.doctor_id)
    );

    const service = serviceOptions.find(
      (item) =>
        String(item.id) === String(form.service_id)
    );

    if (editingAppointment) {
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.appointment_id ===
          editingAppointment.appointment_id
            ? {
                ...appointment,

                appointment_number:
                  form.appointment_number,

                patient_id: Number(
                  form.patient_id
                ),

                patient:
                  patient?.name || "",

                patient_registration_number:
                  patient?.registrationNumber || "",

                doctor_id: Number(
                  form.doctor_id
                ),

                doctor:
                  doctor?.name || "",

                service_id:
                  form.service_id
                    ? Number(form.service_id)
                    : null,

                service:
                  service?.name || "",

                appointment_date:
                  form.appointment_date,

                appointment_time:
                  form.appointment_time,

                appointment_type:
                  form.appointment_type,

                reason:
                  form.reason,

                priority:
                  form.priority,

                status:
                  form.status,

                consultation_fee:
                  Number(
                    form.consultation_fee
                  ) || 0,

                notes:
                  form.notes,

                created_by:
                  Number(form.created_by) || null,

                updated_at:
                  new Date().toISOString(),
              }
            : appointment
        )
      );
    } else {
      const newAppointment = {
        appointment_id:
          Math.max(
            0,
            ...appointments.map(
              (appointment) =>
                appointment.appointment_id
            )
          ) + 1,

        appointment_number:
          form.appointment_number,

        patient_id:
          Number(form.patient_id),

        patient:
          patient?.name || "",

        patient_registration_number:
          patient?.registrationNumber || "",

        doctor_id:
          Number(form.doctor_id),

        doctor:
          doctor?.name || "",

        service_id:
          form.service_id
            ? Number(form.service_id)
            : null,

        service:
          service?.name || "",

        appointment_date:
          form.appointment_date,

        appointment_time:
          form.appointment_time,

        appointment_type:
          form.appointment_type,

        reason:
          form.reason,

        priority:
          form.priority,

        status:
          form.status,

        consultation_fee:
          Number(form.consultation_fee) || 0,

        notes:
          form.notes,

        created_by:
          Number(form.created_by) || null,

        created_at:
          new Date().toISOString(),

        updated_at:
          new Date().toISOString(),
      };

      setAppointments((current) => [
        newAppointment,
        ...current,
      ]);
    }

    setForm(emptyForm);
    setFormError("");
    setEditingAppointment(null);
    setShowAddModal(false);
  };

  /* =======================================================
     UPDATE STATUS
     ======================================================= */

  const updateAppointmentStatus = (
    appointmentId,
    status
  ) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.appointment_id ===
        appointmentId
          ? {
              ...appointment,
              status,
              updated_at:
                new Date().toISOString(),
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
            Schedule and manage patient appointments,
            doctors, services, priorities and appointment
            status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
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
          icon={Activity}
          label="Scheduled"
          value={stats.scheduled}
        />

        <StatCard
          icon={CheckCircle2}
          label="Confirmed"
          value={stats.confirmed}
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
              placeholder="Search appointment, patient, doctor, service, reason..."
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
              label="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                "All",
                ...priorityOptions,
              ]}
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
              {filteredAppointments.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <EmptyState
            onClear={() => {
              setSearch("");
              setStatusFilter("All");
              setPriorityFilter("All");
              setDateFilter("");
            }}
          />
        ) : (
          <>
            {/* DESKTOP */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1250px]">
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
                      Priority
                    </TableHeader>

                    <TableHeader>
                      Status
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
                        key={
                          appointment.appointment_id
                        }
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
                    key={
                      appointment.appointment_id
                    }
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
          onStatusChange={
            updateAppointmentStatus
          }
          onEdit={handleOpenEdit}
        />
      )}

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {showAddModal && (
        <AddAppointmentModal
          form={form}
          error={formError}
          editing={Boolean(editingAppointment)}
          onChange={updateForm}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowAddModal(false);
            setEditingAppointment(null);
          }}
        />
      )}
    </div>
  );
};

/* =========================================================
   STAT CARD
   ========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
}) => {
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

const TableHeader = ({
  children,
  align = "left",
}) => {
  return (
    <th
      className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
};

/* =========================================================
   DESKTOP ROW
   ========================================================= */

const AppointmentRow = ({
  appointment,
  onView,
}) => {
  return (
    <tr className="border-b border-[#EAF2F0] last:border-0 hover:bg-[#FAFDFC]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6]">
            <CalendarDays className="h-5 w-5 text-[#08A6A0]" />
          </div>

          <div>
            <p className="text-sm font-bold text-[#173F41]">
              {appointment.appointment_number}
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              {appointment.appointment_type}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-bold text-[#173F41]">
          {appointment.patient}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {appointment.patient_registration_number}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-[#31585A]">
          {appointment.doctor}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          Doctor ID: {appointment.doctor_id}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {appointment.service || "No service"}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          ₹
          {Number(
            appointment.consultation_fee || 0
          ).toFixed(2)}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-[#31585A]">
          {formatDate(
            appointment.appointment_date
          )}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {formatTime(
            appointment.appointment_time
          )}
        </p>
      </td>

      <td className="px-5 py-4">
        <PriorityBadge
          priority={appointment.priority}
        />
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          status={appointment.status}
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
              {appointment.appointment_number}
            </p>
          </div>

          <StatusBadge
            status={appointment.status}
          />
        </div>

        <div className="mt-3">
          <p className="text-sm font-semibold text-[#31585A]">
            {appointment.service ||
              "No service"}
          </p>

          <p className="mt-1 text-xs text-[#819596]">
            {appointment.doctor}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <PriorityBadge
            priority={appointment.priority}
          />

          <span className="text-xs text-[#819596]">
            {formatDate(
              appointment.appointment_date
            )}
          </span>

          <span className="text-xs text-[#819596]">
            {formatTime(
              appointment.appointment_time
            )}
          </span>
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
   PRIORITY BADGE
   ========================================================= */

const PriorityBadge = ({ priority }) => {
  const style =
    priorityStyles[priority] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {priority === "Emergency" && (
        <AlertTriangle className="h-3 w-3" />
      )}

      {priority}
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
  onEdit,
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
                    {appointment.appointment_number}
                  </h2>

                  <p className="mt-1 text-xs text-white/60">
                    {formatDate(
                      appointment.appointment_date
                    )}{" "}
                    ·{" "}
                    {formatTime(
                      appointment.appointment_time
                    )}
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

          <div className="max-h-[80vh] space-y-6 overflow-y-auto p-5 sm:p-6">
            {/* BADGES */}

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={appointment.status}
              />

              <PriorityBadge
                priority={appointment.priority}
              />

              <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#087F7A]">
                {appointment.appointment_type}
              </span>
            </div>

            {/* OVERVIEW */}

            <section>
              <SectionTitle title="Appointment Overview" />

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  icon={CalendarDays}
                  label="Appointment Number"
                  value={
                    appointment.appointment_number
                  }
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Date"
                  value={formatDate(
                    appointment.appointment_date
                  )}
                />

                <DetailItem
                  icon={Clock3}
                  label="Time"
                  value={formatTime(
                    appointment.appointment_time
                  )}
                />

                <DetailItem
                  icon={CreditCard}
                  label="Consultation Fee"
                  value={`₹${Number(
                    appointment.consultation_fee ||
                      0
                  ).toFixed(2)}`}
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
                        {
                          appointment.patient_registration_number
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EAF2F0] pt-4">
                    <SmallDetail
                      label="Patient ID"
                      value={
                        appointment.patient_id
                      }
                    />

                    <SmallDetail
                      label="Registration No."
                      value={
                        appointment.patient_registration_number
                      }
                    />
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
                        Doctor ID:{" "}
                        {appointment.doctor_id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#EAF2F0] pt-4">
                    <p className="text-xs text-[#819596]">
                      Service
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#31585A]">
                      {appointment.service ||
                        "No service assigned"}
                    </p>

                    {appointment.service_id && (
                      <p className="mt-1 text-xs text-[#819596]">
                        Service ID:{" "}
                        {appointment.service_id}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* REASON */}

            <section>
              <SectionTitle title="Reason for Appointment" />

              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6]">
                  <FileText className="h-5 w-5 text-[#08A6A0]" />
                </div>

                <p className="text-sm leading-6 text-[#31585A]">
                  {appointment.reason ||
                    "No reason provided."}
                </p>
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

            {/* SYSTEM INFORMATION */}

            <section>
              <SectionTitle title="Record Information" />

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  icon={UserRound}
                  label="Created By"
                  value={
                    appointment.created_by ??
                    "-"
                  }
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Created At"
                  value={
                    appointment.created_at ||
                    "-"
                  }
                />

                <DetailItem
                  icon={Edit3}
                  label="Updated At"
                  value={
                    appointment.updated_at ||
                    "-"
                  }
                />

                <DetailItem
                  icon={UserCheck}
                  label="Appointment ID"
                  value={
                    appointment.appointment_id
                  }
                />
              </div>
            </section>

            {/* ACTIONS */}

            <section>
              <SectionTitle title="Appointment Actions" />

              <div className="mt-3 flex flex-wrap gap-3">
                {appointment.status ===
                  "Scheduled" && (
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        appointment.appointment_id,
                        "Confirmed"
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Appointment
                  </button>
                )}

                {appointment.status ===
                  "Confirmed" && (
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        appointment.appointment_id,
                        "Completed"
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Completed
                  </button>
                )}

                {appointment.status !==
                  "Cancelled" &&
                  appointment.status !==
                    "Completed" &&
                  appointment.status !==
                    "No Show" && (
                    <button
                      type="button"
                      onClick={() =>
                        onStatusChange(
                          appointment.appointment_id,
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
                  onClick={() => onEdit(appointment)}
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
   ADD / EDIT APPOINTMENT MODAL
   ========================================================= */

const AddAppointmentModal = ({
  form,
  error,
  editing,
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
                {editing
                  ? "Edit Appointment"
                  : "Create New Appointment"}
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
            className="max-h-[80vh] overflow-y-auto p-5 sm:p-6"
          >
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Appointment Number */}

              <FormField
                label="Appointment Number"
                required
                value={form.appointment_number}
                onChange={(value) =>
                  onChange(
                    "appointment_number",
                    value
                  )
                }
                placeholder="APT-1007"
              />

              {/* Patient */}

              <FormSelect
                label="Patient"
                required
                value={form.patient_id}
                onChange={(value) =>
                  onChange(
                    "patient_id",
                    value
                  )
                }
                options={patientOptions}
                placeholder="Select patient"
                optionValue="id"
                optionLabel="name"
              />

              {/* Doctor */}

              <FormSelect
                label="Doctor"
                required
                value={form.doctor_id}
                onChange={(value) =>
                  onChange(
                    "doctor_id",
                    value
                  )
                }
                options={doctorOptions}
                placeholder="Select doctor"
                optionValue="id"
                optionLabel="name"
              />

              {/* Service */}

              <FormSelect
                label="Service"
                value={form.service_id}
                onChange={(value) =>
                  onChange(
                    "service_id",
                    value
                  )
                }
                options={serviceOptions}
                placeholder="No service"
                optionValue="id"
                optionLabel="name"
              />

              {/* Date */}

              <FormField
                label="Appointment Date"
                required
                type="date"
                value={form.appointment_date}
                onChange={(value) =>
                  onChange(
                    "appointment_date",
                    value
                  )
                }
              />

              {/* Time */}

              <FormField
                label="Appointment Time"
                required
                type="time"
                value={form.appointment_time}
                onChange={(value) =>
                  onChange(
                    "appointment_time",
                    value
                  )
                }
              />

              {/* Type */}

              <FormSelect
                label="Appointment Type"
                value={form.appointment_type}
                onChange={(value) =>
                  onChange(
                    "appointment_type",
                    value
                  )
                }
                options={
                  appointmentTypeOptions
                }
              />

              {/* Priority */}

              <FormSelect
                label="Priority"
                value={form.priority}
                onChange={(value) =>
                  onChange(
                    "priority",
                    value
                  )
                }
                options={priorityOptions}
              />

              {/* Status */}

              <FormSelect
                label="Status"
                value={form.status}
                onChange={(value) =>
                  onChange("status", value)
                }
                options={[
                  "Scheduled",
                  "Confirmed",
                  "Completed",
                  "Cancelled",
                  "No Show",
                ]}
              />

              {/* Fee */}

              <FormField
                label="Consultation Fee"
                type="number"
                value={form.consultation_fee}
                onChange={(value) =>
                  onChange(
                    "consultation_fee",
                    value
                  )
                }
                placeholder="Enter consultation fee"
              />

              {/* Created By */}

              <FormSelect
                label="Created By"
                value={form.created_by}
                onChange={(value) =>
                  onChange(
                    "created_by",
                    value
                  )
                }
                options={staffOptions}
                optionValue="id"
                optionLabel="name"
              />

              {/* Reason */}

              <div className="sm:col-span-2">
                <label>
                  <span className="mb-1.5 block text-xs font-bold text-[#708789]">
                    Reason for Appointment
                  </span>

                  <textarea
                    value={form.reason}
                    onChange={(event) =>
                      onChange(
                        "reason",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Enter the reason for the appointment..."
                    className="w-full resize-none rounded-xl border border-[#D9E9E7] bg-white px-3 py-3 text-sm text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </label>
              </div>

              {/* Notes */}

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

                {editing
                  ? "Update Appointment"
                  : "Create Appointment"}
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
  optionValue = null,
  optionLabel = null,
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

        {options.map((option) => {
          const valueToUse =
            optionValue
              ? option[optionValue]
              : option;

          const labelToUse =
            optionLabel
              ? option[optionLabel]
              : option;

          return (
            <option
              key={valueToUse}
              value={valueToUse}
            >
              {labelToUse}
            </option>
          );
        })}
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
          <option
            key={option}
            value={option}
          >
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

      <p className="mt-1 break-words text-sm font-semibold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   SMALL DETAIL
   ========================================================= */

const SmallDetail = ({
  label,
  value,
}) => {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9AAEAF]">
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

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "-";

  const [hours, minutes] =
    time.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
};

export default Appointments;