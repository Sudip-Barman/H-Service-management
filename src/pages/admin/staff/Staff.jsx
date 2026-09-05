import { useMemo, useState } from "react";
import {
  Activity,
  BriefcaseMedical,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const initialStaff = [
  {
    id: "EMP-1001",
    name: "Dr. Arindam Sen",
    category: "Doctor",
    designation: "Senior Physician",
    department: "General Medicine",
    qualification: "MBBS, MD",
    experience: "12 Years",
    phone: "+91 98765 12001",
    email: "arindam.sen@carecore.com",
    address: "Salt Lake, Kolkata",
    joiningDate: "2023-04-12",
    availability: "Available",
    status: "Active",
    assignedPatients: 8,
    currentShift: "09:00 - 17:00",
  },
  {
    id: "EMP-1002",
    name: "Suman Roy",
    category: "GNM Nurse",
    designation: "Staff Nurse",
    department: "Nursing",
    qualification: "GNM",
    experience: "7 Years",
    phone: "+91 98765 12002",
    email: "suman.roy@carecore.com",
    address: "Howrah, West Bengal",
    joiningDate: "2024-01-18",
    availability: "Assigned",
    status: "Active",
    assignedPatients: 5,
    currentShift: "08:00 - 20:00",
  },
  {
    id: "EMP-1003",
    name: "Anita Roy",
    category: "Elder Caregiver",
    designation: "Senior Caregiver",
    department: "Patient Care",
    qualification: "Caregiver Certification",
    experience: "5 Years",
    phone: "+91 98765 12003",
    email: "anita.roy@carecore.com",
    address: "Dum Dum, Kolkata",
    joiningDate: "2024-06-10",
    availability: "Assigned",
    status: "Active",
    assignedPatients: 2,
    currentShift: "08:00 - 20:00",
  },
  {
    id: "EMP-1004",
    name: "Mita Das",
    category: "Baby Caretaker",
    designation: "Baby Care Specialist",
    department: "Child Care",
    qualification: "Child Care Training",
    experience: "4 Years",
    phone: "+91 98765 12004",
    email: "mita.das@carecore.com",
    address: "New Town, Kolkata",
    joiningDate: "2025-02-03",
    availability: "Available",
    status: "Active",
    assignedPatients: 0,
    currentShift: "10:00 - 18:00",
  },
  {
    id: "EMP-1005",
    name: "Rahul Ghosh",
    category: "ICU Nurse",
    designation: "ICU Staff Nurse",
    department: "ICU",
    qualification: "B.Sc Nursing",
    experience: "9 Years",
    phone: "+91 98765 12005",
    email: "rahul.ghosh@carecore.com",
    address: "Ballygunge, Kolkata",
    joiningDate: "2022-09-21",
    availability: "On Leave",
    status: "Active",
    assignedPatients: 0,
    currentShift: "Night Shift",
  },
  {
    id: "EMP-1006",
    name: "Priyanka Paul",
    category: "ANM Nurse",
    designation: "ANM Nurse",
    department: "Community Nursing",
    qualification: "ANM",
    experience: "6 Years",
    phone: "+91 98765 12006",
    email: "priyanka.paul@carecore.com",
    address: "Barasat, West Bengal",
    joiningDate: "2024-03-15",
    availability: "Available",
    status: "Active",
    assignedPatients: 3,
    currentShift: "08:00 - 16:00",
  },
  {
    id: "EMP-1007",
    name: "Vikash Kumar",
    category: "Male Attendant",
    designation: "Patient Attendant",
    department: "Patient Care",
    qualification: "Patient Care Training",
    experience: "3 Years",
    phone: "+91 98765 12007",
    email: "vikash.kumar@carecore.com",
    address: "Behala, Kolkata",
    joiningDate: "2025-05-11",
    availability: "Available",
    status: "Active",
    assignedPatients: 1,
    currentShift: "08:00 - 20:00",
  },
  {
    id: "EMP-1008",
    name: "Riya Mukherjee",
    category: "Receptionist",
    designation: "Front Desk Executive",
    department: "Reception",
    qualification: "BBA",
    experience: "4 Years",
    phone: "+91 98765 12008",
    email: "riya.m@carecore.com",
    address: "Kestopur, Kolkata",
    joiningDate: "2024-08-01",
    availability: "Available",
    status: "Active",
    assignedPatients: 0,
    currentShift: "09:00 - 17:00",
  },
];

const categoryOptions = [
  "All",
  "Doctor",
  "Nurse",
  "GNM Nurse",
  "ANM Nurse",
  "B.Sc Nurse",
  "ICU Nurse",
  "Patient Caretaker",
  "Baby Caretaker",
  "Baby Sitter",
  "Male Attendant",
  "Elder Caregiver",
  "Receptionist",
  "Accountant",
  "Lab Technician",
  "Pharmacist",
];

const availabilityOptions = [
  "All",
  "Available",
  "Assigned",
  "On Leave",
];

const statusOptions = ["All", "Active", "Inactive"];

const categoryStyles = {
  Doctor: "bg-purple-50 text-purple-700 border-purple-100",
  "GNM Nurse": "bg-blue-50 text-blue-700 border-blue-100",
  "ANM Nurse": "bg-cyan-50 text-cyan-700 border-cyan-100",
  "B.Sc Nurse": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "ICU Nurse": "bg-red-50 text-red-700 border-red-100",
  "Elder Caregiver": "bg-amber-50 text-amber-700 border-amber-100",
  "Baby Caretaker": "bg-pink-50 text-pink-700 border-pink-100",
  "Male Attendant": "bg-slate-50 text-slate-700 border-slate-200",
  Receptionist: "bg-teal-50 text-teal-700 border-teal-100",
};

const availabilityStyles = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Assigned: "bg-blue-50 text-blue-700 border-blue-100",
  "On Leave": "bg-amber-50 text-amber-700 border-amber-100",
};

const emptyForm = {
  name: "",
  category: "Patient Caretaker",
  designation: "",
  department: "",
  qualification: "",
  experience: "",
  phone: "",
  email: "",
  address: "",
};

const Staff = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const stats = useMemo(() => {
    return {
      total: staff.length,
      active: staff.filter((member) => member.status === "Active").length,
      available: staff.filter(
        (member) =>
          member.status === "Active" &&
          member.availability === "Available"
      ).length,
      assigned: staff.filter(
        (member) => member.availability === "Assigned"
      ).length,
      leave: staff.filter(
        (member) => member.availability === "On Leave"
      ).length,
    };
  }, [staff]);

  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase().trim();

    return staff.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.id.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        member.category.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        member.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        member.availability === availabilityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        member.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesStatus
      );
    });
  }, [
    staff,
    search,
    categoryFilter,
    availabilityFilter,
    statusFilter,
  ]);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAddStaff = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError("Staff name is required.");
      return;
    }

    if (!form.category) {
      setFormError("Staff category is required.");
      return;
    }

    if (!form.phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    if (!form.qualification.trim()) {
      setFormError("Qualification is required.");
      return;
    }

    const newStaff = {
      ...form,
      id: `EMP-${1001 + staff.length}`,
      joiningDate: new Date().toISOString().split("T")[0],
      availability: "Available",
      status: "Active",
      assignedPatients: 0,
      currentShift: "Not Assigned",
    };

    setStaff((current) => [newStaff, ...current]);
    setForm(emptyForm);
    setFormError("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
            WORKFORCE MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">
            Staff Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#789092]">
            Manage doctors, nurses, caregivers, attendants and
            operational staff, including qualifications, availability,
            assignments and shifts.
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
          Register Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          icon={Users}
          label="Total Staff"
          value={stats.total}
        />

        <StatCard
          icon={ShieldCheck}
          label="Active Staff"
          value={stats.active}
        />

        <StatCard
          icon={UserCheck}
          label="Available"
          value={stats.available}
        />

        <StatCard
          icon={BriefcaseMedical}
          label="Currently Assigned"
          value={stats.assigned}
        />

        <StatCard
          icon={Clock3}
          label="On Leave"
          value={stats.leave}
        />
      </div>

      {/* Search / Filters */}
      <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, employee ID, phone, category..."
              className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-10 pr-4 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-[#EAF2F0] pt-4 md:grid-cols-3">
            <FilterSelect
              label="Staff Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
            />

            <FilterSelect
              label="Availability"
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
              options={availabilityOptions}
            />

            <FilterSelect
              label="Employment Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
          </div>
        )}
      </div>

      {/* Staff List */}
      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAF2F0] px-5 py-4">
          <div>
            <h2 className="font-bold text-[#073F42]">
              Hospital Workforce
            </h2>

            <p className="mt-1 text-xs text-[#819596]">
              {filteredStaff.length} staff member
              {filteredStaff.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredStaff.length === 0 ? (
          <EmptyState
            onClear={() => {
              setSearch("");
              setCategoryFilter("All");
              setAvailabilityFilter("All");
              setStatusFilter("All");
            }}
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-[#EAF2F0] bg-[#FAFDFC] text-left">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Staff
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Category
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Qualification
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Department
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Availability
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Patients
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStaff.map((member) => (
                    <StaffRow
                      key={member.id}
                      member={member}
                      onView={() => setSelectedStaff(member)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#EAF2F0] lg:hidden">
              {filteredStaff.map((member) => (
                <StaffMobileCard
                  key={member.id}
                  member={member}
                  onView={() => setSelectedStaff(member)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Details */}
      {selectedStaff && (
        <StaffDetails
          member={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddStaffModal
          form={form}
          error={formError}
          onChange={updateForm}
          onSubmit={handleAddStaff}
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

const StaffRow = ({ member, onView }) => {
  return (
    <tr className="border-b border-[#EAF2F0] last:border-0 hover:bg-[#FAFDFC]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <StaffAvatar name={member.name} />

          <div>
            <p className="text-sm font-bold text-[#173F41]">
              {member.name}
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              {member.id} · {member.designation}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <CategoryBadge category={member.category} />
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {member.qualification}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {member.experience}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {member.department}
        </p>
      </td>

      <td className="px-5 py-4">
        <AvailabilityBadge availability={member.availability} />
      </td>

      <td className="px-5 py-4">
        <span className="text-sm font-bold text-[#31585A]">
          {member.assignedPatients}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onView}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] hover:border-[#08A6A0] hover:text-[#08A6A0]"
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
      className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-[#FAFDFC]"
    >
      <StaffAvatar name={member.name} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="truncate text-sm font-bold text-[#173F41]">
              {member.name}
            </p>

            <p className="mt-1 text-xs text-[#819596]">
              {member.id}
            </p>
          </div>

          <AvailabilityBadge
            availability={member.availability}
          />
        </div>

        <div className="mt-2">
          <CategoryBadge category={member.category} />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#819596]">
          <span>{member.department}</span>
          <span>{member.assignedPatients} patients</span>
        </div>
      </div>

      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#9AAEAF]" />
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
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-sm font-bold text-[#087F7A]">
      {initials}
    </div>
  );
};

/* =========================
   BADGES
========================= */

const CategoryBadge = ({ category }) => {
  const style =
    categoryStyles[category] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {category}
    </span>
  );
};

const AvailabilityBadge = ({ availability }) => {
  const style =
    availabilityStyles[availability] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {availability}
    </span>
  );
};

/* =========================
   DETAILS
========================= */

const StaffDetails = ({ member, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#073F42]/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="bg-[#073F42] p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-lg font-bold">
                    {member.name}
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    {member.id} · {member.designation}
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
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <CategoryBadge category={member.category} />
              <AvailabilityBadge
                availability={member.availability}
              />

              <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#087F7A]">
                {member.status}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem
                icon={BriefcaseMedical}
                label="Department"
                value={member.department}
              />

              <DetailItem
                icon={ShieldCheck}
                label="Qualification"
                value={member.qualification}
              />

              <DetailItem
                icon={Activity}
                label="Experience"
                value={member.experience}
              />

              <DetailItem
                icon={Users}
                label="Assigned Patients"
                value={member.assignedPatients}
              />
            </div>

            <section>
              <SectionTitle title="Contact Information" />

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <ContactBox
                  icon={Phone}
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
                />
              </div>
            </section>

            <section>
              <SectionTitle title="Work Information" />

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <InfoBox
                  icon={CalendarDays}
                  label="Joining Date"
                  value={member.joiningDate}
                />

                <InfoBox
                  icon={Clock3}
                  label="Current Shift"
                  value={member.currentShift}
                />
              </div>
            </section>

            <section>
              <SectionTitle title="Administrative Actions" />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Staff
                </button>

                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  <CalendarDays className="h-4 w-4" />
                  View Schedule
                </button>

                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  <Activity className="h-4 w-4" />
                  View Assignments
                </button>
              </div>
            </section>

            <div className="flex justify-end border-t border-[#EAF2F0] pt-5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white hover:bg-[#078F8A]"
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

/* =========================
   ADD STAFF MODAL
========================= */

const AddStaffModal = ({
  form,
  error,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#073F42]/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#EAF2F0] p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                STAFF REGISTRATION
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#073F42]">
                Register New Staff
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
                placeholder="Enter staff name"
              />

              <FormSelect
                label="Staff Category"
                value={form.category}
                onChange={(value) =>
                  onChange("category", value)
                }
                options={categoryOptions.filter(
                  (option) => option !== "All"
                )}
              />

              <FormField
                label="Designation"
                value={form.designation}
                onChange={(value) =>
                  onChange("designation", value)
                }
                placeholder="e.g. Staff Nurse"
              />

              <FormField
                label="Department"
                value={form.department}
                onChange={(value) =>
                  onChange("department", value)
                }
                placeholder="e.g. Nursing"
              />

              <FormField
                label="Qualification"
                required
                value={form.qualification}
                onChange={(value) =>
                  onChange("qualification", value)
                }
                placeholder="e.g. GNM, B.Sc Nursing"
              />

              <FormField
                label="Experience"
                value={form.experience}
                onChange={(value) =>
                  onChange("experience", value)
                }
                placeholder="e.g. 5 Years"
              />

              <FormField
                label="Phone"
                required
                value={form.phone}
                onChange={(value) =>
                  onChange("phone", value)
                }
                placeholder="+91 XXXXX XXXXX"
              />

              <FormField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                  onChange("email", value)
                }
                placeholder="staff@carecore.com"
              />

              <div className="sm:col-span-2">
                <FormField
                  label="Address"
                  value={form.address}
                  onChange={(value) =>
                    onChange("address", value)
                  }
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
                Register Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* =========================
   FORM COMPONENTS
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
    <label>
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      />
    </label>
  );
};

const FormSelect = ({
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
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
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
   DETAILS HELPERS
========================= */

const SectionTitle = ({ title }) => {
  return (
    <h3 className="text-sm font-bold text-[#073F42]">
      {title}
    </h3>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => {
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

const ContactBox = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
      <Icon className="h-4 w-4 text-[#08A6A0]" />

      <p className="mt-2 text-xs font-semibold text-[#819596]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

const InfoBox = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
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

/* =========================
   EMPTY STATE
========================= */

const EmptyState = ({ onClear }) => {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6]">
        <Users className="h-6 w-6 text-[#08A6A0]" />
      </div>

      <h3 className="mt-4 font-bold text-[#073F42]">
        No staff found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#819596]">
        No staff members match the current search or filters.
        Try changing your search criteria.
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

export default Staff;