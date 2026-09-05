import { useMemo, useState } from "react";
import {
  Activity,
  Archive,
  CalendarDays,
  ChevronRight,
  Clock3,
  Droplets,
  Edit3,
  Eye,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const initialPatients = [
  {
    id: "PAT-1001",
    name: "Rahul Das",
    age: 68,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    email: "rahul.das@example.com",
    address: "Kolkata, West Bengal",
    emergencyContact: "Anita Das",
    emergencyPhone: "+91 98765 11111",
    registrationDate: "2026-09-01",
    status: "Active",
    activeServices: ["Elder Care"],
    assignedStaff: ["Anita Roy"],
    appointments: 2,
    admissionStatus: "Not Admitted",
  },
  {
    id: "PAT-1002",
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    bloodGroup: "A+",
    phone: "+91 91234 56789",
    email: "priya.sharma@example.com",
    address: "Howrah, West Bengal",
    emergencyContact: "Amit Sharma",
    emergencyPhone: "+91 91234 11111",
    registrationDate: "2026-09-02",
    status: "Under Treatment",
    activeServices: ["GNM Nurse", "Japa Service"],
    assignedStaff: ["Suman Roy", "Mita Das"],
    appointments: 3,
    admissionStatus: "Admitted",
  },
  {
    id: "PAT-1003",
    name: "Arjun Sen",
    age: 45,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 90011 22334",
    email: "arjun.sen@example.com",
    address: "Salt Lake, Kolkata",
    emergencyContact: "Rina Sen",
    emergencyPhone: "+91 90011 44556",
    registrationDate: "2026-08-28",
    status: "Registered",
    activeServices: [],
    assignedStaff: [],
    appointments: 1,
    admissionStatus: "Not Admitted",
  },
  {
    id: "PAT-1004",
    name: "Maya Roy",
    age: 74,
    gender: "Female",
    bloodGroup: "AB+",
    phone: "+91 93333 77889",
    email: "maya.roy@example.com",
    address: "Dum Dum, Kolkata",
    emergencyContact: "Rakesh Roy",
    emergencyPhone: "+91 93333 11223",
    registrationDate: "2026-08-25",
    status: "Admitted",
    activeServices: ["Elder Care", "GNM Nurse"],
    assignedStaff: ["Anita Roy", "Suman Roy"],
    appointments: 4,
    admissionStatus: "Admitted",
  },
  {
    id: "PAT-1005",
    name: "Sneha Mukherjee",
    age: 29,
    gender: "Female",
    bloodGroup: "O-",
    phone: "+91 95555 66778",
    email: "sneha.m@example.com",
    address: "New Town, Kolkata",
    emergencyContact: "Rahul Mukherjee",
    emergencyPhone: "+91 95555 11223",
    registrationDate: "2026-08-20",
    status: "Completed",
    activeServices: [],
    assignedStaff: [],
    appointments: 2,
    admissionStatus: "Discharged",
  },
  {
    id: "PAT-1006",
    name: "Mohammed Imran",
    age: 56,
    gender: "Male",
    bloodGroup: "A-",
    phone: "+91 98888 22110",
    email: "imran@example.com",
    address: "Park Circus, Kolkata",
    emergencyContact: "Sadia Imran",
    emergencyPhone: "+91 98888 33221",
    registrationDate: "2026-08-18",
    status: "Inactive",
    activeServices: [],
    assignedStaff: [],
    appointments: 0,
    admissionStatus: "Not Admitted",
  },
];

const statusStyles = {
  Registered: "bg-blue-50 text-blue-700 border-blue-100",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Admitted: "bg-purple-50 text-purple-700 border-purple-100",
  "Under Treatment": "bg-amber-50 text-amber-700 border-amber-100",
  Completed: "bg-teal-50 text-teal-700 border-teal-100",
  Inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

const emptyForm = {
  name: "",
  age: "",
  gender: "Male",
  bloodGroup: "",
  phone: "",
  email: "",
  address: "",
  emergencyContact: "",
  emergencyPhone: "",
};

const Patients = () => {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bloodFilter, setBloodFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const stats = useMemo(() => {
    return {
      total: patients.length,
      active: patients.filter((p) => p.status === "Active").length,
      admitted: patients.filter((p) => p.status === "Admitted").length,
      treatment: patients.filter((p) => p.status === "Under Treatment").length,
      registered: patients.filter((p) => p.status === "Registered").length,
    };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase().trim();

    return patients.filter((patient) => {
      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.phone.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || patient.status === statusFilter;

      const matchesBlood =
        bloodFilter === "All" || patient.bloodGroup === bloodFilter;

      return matchesSearch && matchesStatus && matchesBlood;
    });
  }, [patients, search, statusFilter, bloodFilter]);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAddPatient = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError("Patient name is required.");
      return;
    }

    if (!form.age || Number(form.age) <= 0) {
      setFormError("Please enter a valid age.");
      return;
    }

    if (!form.phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    if (!form.bloodGroup) {
      setFormError("Please select a blood group.");
      return;
    }

    const newPatient = {
      ...form,
      id: `PAT-${1001 + patients.length}`,
      age: Number(form.age),
      registrationDate: new Date().toISOString().split("T")[0],
      status: "Registered",
      activeServices: [],
      assignedStaff: [],
      appointments: 0,
      admissionStatus: "Not Admitted",
    };

    setPatients((current) => [newPatient, ...current]);
    setForm(emptyForm);
    setFormError("");
    setShowAddModal(false);
  };

  const handleArchive = (patientId) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this patient?"
    );

    if (!confirmed) return;

    setPatients((current) =>
      current.map((patient) =>
        patient.id === patientId
          ? { ...patient, status: "Inactive" }
          : patient
      )
    );

    setSelectedPatient(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
            PATIENT OPERATIONS
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">
            Patient Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#789092]">
            Register, manage and monitor patient information, services,
            appointments, admissions and care assignments.
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
          <UserPlus className="h-4 w-4" />
          Register Patient
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.total}
        />

        <StatCard
          icon={Activity}
          label="Active"
          value={stats.active}
        />

        <StatCard
          icon={HeartPulse}
          label="Admitted"
          value={stats.admitted}
        />

        <StatCard
          icon={Clock3}
          label="Under Treatment"
          value={stats.treatment}
        />

        <StatCard
          icon={UserPlus}
          label="New / Registered"
          value={stats.registered}
        />
      </div>

      {/* Search + Filters */}
      <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by patient name, ID or phone..."
              className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-10 pr-4 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] hover:border-[#08A6A0] hover:text-[#08A6A0]"
          >
            <Activity className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-[#EAF2F0] pt-4 sm:grid-cols-2">
            <FilterSelect
              label="Patient Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "All",
                "Registered",
                "Active",
                "Admitted",
                "Under Treatment",
                "Completed",
                "Inactive",
              ]}
            />

            <FilterSelect
              label="Blood Group"
              value={bloodFilter}
              onChange={setBloodFilter}
              options={[
                "All",
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
              ]}
            />
          </div>
        )}
      </div>

      {/* Patient Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAF2F0] px-5 py-4">
          <div>
            <h2 className="font-bold text-[#073F42]">Registered Patients</h2>
            <p className="mt-1 text-xs text-[#819596]">
              {filteredPatients.length} patient
              {filteredPatients.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <EmptyState
            search={search}
            onClear={() => {
              setSearch("");
              setStatusFilter("All");
              setBloodFilter("All");
            }}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[#EAF2F0] bg-[#FAFDFC] text-left">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Patient
                    </th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Contact
                    </th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Blood Group
                    </th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Services
                    </th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient) => (
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      onView={() => setSelectedPatient(patient)}
                      onArchive={() => handleArchive(patient.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-[#EAF2F0] lg:hidden">
              {filteredPatients.map((patient) => (
                <PatientMobileCard
                  key={patient.id}
                  patient={patient}
                  onView={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Patient Details */}
      {selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onArchive={() => handleArchive(selectedPatient.id)}
        />
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <AddPatientModal
          form={form}
          error={formError}
          onChange={updateForm}
          onSubmit={handleAddPatient}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

/* =========================
   STAT CARD
========================= */

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

/* =========================
   FILTER SELECT
========================= */

const FilterSelect = ({ label, value, onChange, options }) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#708789]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
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

/* =========================
   DESKTOP ROW
========================= */

const PatientRow = ({ patient, onView, onArchive }) => {
  return (
    <tr className="border-b border-[#EAF2F0] last:border-0 hover:bg-[#FAFDFC]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <PatientAvatar name={patient.name} />

          <div>
            <p className="text-sm font-bold text-[#173F41]">
              {patient.name}
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              {patient.id} · {patient.age} yrs · {patient.gender}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {patient.phone}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {patient.email}
        </p>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700">
          <Droplets className="h-3.5 w-3.5" />
          {patient.bloodGroup}
        </span>
      </td>

      <td className="px-5 py-4">
        {patient.activeServices.length > 0 ? (
          <div className="flex max-w-[200px] flex-wrap gap-1.5">
            {patient.activeServices.map((service) => (
              <span
                key={service}
                className="rounded-full bg-[#E8F8F6] px-2.5 py-1 text-xs font-semibold text-[#087F7A]"
              >
                {service}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-[#9AAEAF]">
            No active services
          </span>
        )}
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={patient.status} />
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onView}
            title="View patient"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] hover:border-[#08A6A0] hover:text-[#08A6A0]"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Archive patient"
            onClick={onArchive}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#819596] hover:border-red-200 hover:text-red-600"
          >
            <Archive className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* =========================
   MOBILE CARD
========================= */

const PatientMobileCard = ({ patient, onView }) => {
  return (
    <button
      type="button"
      onClick={onView}
      className="block w-full p-4 text-left transition hover:bg-[#FAFDFC]"
    >
      <div className="flex items-start gap-3">
        <PatientAvatar name={patient.name} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="truncate text-sm font-bold text-[#173F41]">
                {patient.name}
              </p>

              <p className="mt-1 text-xs text-[#819596]">
                {patient.id} · {patient.age} yrs
              </p>
            </div>

            <StatusBadge status={patient.status} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
              <Droplets className="h-3 w-3" />
              {patient.bloodGroup}
            </span>

            {patient.activeServices.map((service) => (
              <span
                key={service}
                className="rounded-lg bg-[#E8F8F6] px-2 py-1 text-xs font-semibold text-[#087F7A]"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#9AAEAF]" />
      </div>
    </button>
  );
};

/* =========================
   PATIENT AVATAR
========================= */

const PatientAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-sm font-bold text-[#087F7A]">
      {initials}
    </div>
  );
};

/* =========================
   STATUS BADGE
========================= */

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] ||
        "border-gray-200 bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

/* =========================
   EMPTY STATE
========================= */

const EmptyState = ({ search, onClear }) => {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6]">
        <Search className="h-6 w-6 text-[#08A6A0]" />
      </div>

      <h3 className="mt-4 font-bold text-[#073F42]">
        No patients found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#819596]">
        {search
          ? "No patient matches your search. Try another name, patient ID or phone number."
          : "There are no patients matching the selected filters."}
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

/* =========================
   PATIENT DETAILS
========================= */

const PatientDetails = ({ patient, onClose, onArchive }) => {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#073F42]/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex items-start justify-between bg-[#073F42] p-5 text-white sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">
                {patient.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-lg font-bold">{patient.name}</p>

                <p className="mt-1 text-xs text-white/60">
                  {patient.id} · Registered{" "}
                  {patient.registrationDate}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={patient.status} />

              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                Blood Group: {patient.bloodGroup}
              </span>

              <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#087F7A]">
                {patient.admissionStatus}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem
                icon={Users}
                label="Age / Gender"
                value={`${patient.age} years / ${patient.gender}`}
              />

              <DetailItem
                icon={Phone}
                label="Phone"
                value={patient.phone}
              />

              <DetailItem
                icon={Mail}
                label="Email"
                value={patient.email}
              />

              <DetailItem
                icon={MapPin}
                label="Address"
                value={patient.address}
              />
            </div>

            <section>
              <SectionTitle title="Emergency Contact" />

              <div className="mt-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#173F41]">
                      {patient.emergencyContact}
                    </p>

                    <p className="mt-1 text-xs text-[#819596]">
                      Emergency contact
                    </p>
                  </div>

                  <a
                    href={`tel:${patient.emergencyPhone}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#08A6A0]"
                  >
                    <Phone className="h-4 w-4" />
                    {patient.emergencyPhone}
                  </a>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle title="Care & Services" />

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <InfoBox
                  title="Active Services"
                  value={
                    patient.activeServices.length
                      ? patient.activeServices.join(", ")
                      : "No active services"
                  }
                />

                <InfoBox
                  title="Assigned Staff"
                  value={
                    patient.assignedStaff.length
                      ? patient.assignedStaff.join(", ")
                      : "No staff assigned"
                  }
                />
              </div>
            </section>

            <section>
              <SectionTitle title="Patient Activity" />

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <ActivityBox
                  icon={CalendarDays}
                  label="Appointments"
                  value={patient.appointments}
                />

                <ActivityBox
                  icon={HeartPulse}
                  label="Medical Records"
                  value="View"
                />

                <ActivityBox
                  icon={ShieldCheck}
                  label="Documents"
                  value="View"
                />
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-[#EAF2F0] pt-5 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={onArchive}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-100 px-4 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Archive className="h-4 w-4" />
                Archive Patient
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] hover:border-[#08A6A0]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Patient
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white hover:bg-[#078F8A]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   ADD PATIENT MODAL
========================= */

const AddPatientModal = ({
  form,
  error,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#073F42]/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#EAF2F0] p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                PATIENT REGISTRATION
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#073F42]">
                Register New Patient
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#819596] hover:bg-[#F5FAF9] hover:text-[#073F42]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-5 sm:p-6">
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Full Name"
                required
                value={form.name}
                onChange={(value) => onChange("name", value)}
                placeholder="Enter patient name"
              />

              <FormField
                label="Age"
                required
                type="number"
                value={form.age}
                onChange={(value) => onChange("age", value)}
                placeholder="Enter age"
              />

              <FormSelect
                label="Gender"
                value={form.gender}
                onChange={(value) => onChange("gender", value)}
                options={["Male", "Female", "Other"]}
              />

              <FormSelect
                label="Blood Group"
                required
                value={form.bloodGroup}
                onChange={(value) => onChange("bloodGroup", value)}
                options={[
                  "",
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ]}
              />

              <FormField
                label="Phone"
                required
                value={form.phone}
                onChange={(value) => onChange("phone", value)}
                placeholder="+91 XXXXX XXXXX"
              />

              <FormField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => onChange("email", value)}
                placeholder="patient@example.com"
              />

              <FormField
                label="Emergency Contact"
                value={form.emergencyContact}
                onChange={(value) =>
                  onChange("emergencyContact", value)
                }
                placeholder="Contact person name"
              />

              <FormField
                label="Emergency Phone"
                value={form.emergencyPhone}
                onChange={(value) =>
                  onChange("emergencyPhone", value)
                }
                placeholder="+91 XXXXX XXXXX"
              />

              <div className="sm:col-span-2">
                <FormField
                  label="Address"
                  value={form.address}
                  onChange={(value) => onChange("address", value)}
                  placeholder="Enter complete address"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl border border-[#D9E9E7] px-5 text-sm font-semibold text-[#31585A] hover:border-[#08A6A0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white hover:bg-[#078F8A]"
              >
                <Plus className="h-4 w-4" />
                Register Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* =========================
   FORM FIELD
========================= */

const FormField = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none transition placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      />
    </label>
  );
};

/* =========================
   FORM SELECT
========================= */

const FormSelect = ({
  label,
  required,
  value,
  onChange,
  options,
}) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select blood group"}
          </option>
        ))}
      </select>
    </label>
  );
};

/* =========================
   DETAILS HELPERS
========================= */

const DetailItem = ({ icon: Icon, label, value }) => {
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

const SectionTitle = ({ title }) => {
  return (
    <h3 className="text-sm font-bold text-[#073F42]">
      {title}
    </h3>
  );
};

const InfoBox = ({ title, value }) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
      <p className="text-xs font-semibold text-[#819596]">{title}</p>
      <p className="mt-1 text-sm font-bold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

const ActivityBox = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-white p-4">
      <Icon className="h-4 w-4 text-[#08A6A0]" />

      <p className="mt-2 text-xs font-semibold text-[#819596]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

export default Patients;