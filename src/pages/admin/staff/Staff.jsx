import { useMemo, useState } from "react";
import {
  BriefcaseMedical,
  Clock3,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import HospitalWorkforce from "../../../components/admin/HospitalWorkforce";
import StaffDetails from "../../../components/admin/StaffDetails";
import StaffForm from "../../../components/admin/StaffForm";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

import {
  staffData,
  categoryOptions,
  availabilityOptions,
  statusOptions,
  emptyStaffForm,
} from "../../../data";

const Staff = () => {
  /* =======================================================
     STAFF STATE
  ======================================================= */

  const [staff, setStaff] = useState(staffData);

  /* =======================================================
     SEARCH STATE
  ======================================================= */

  const [search, setSearch] = useState("");

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showFilters, setShowFilters] = useState(false);

  /* =======================================================
     STAFF DETAILS STATE
  ======================================================= */

  const [selectedStaff, setSelectedStaff] = useState(null);

  /* =======================================================
     STAFF FORM STATE
  ======================================================= */

  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState(emptyStaffForm);

  const [formError, setFormError] = useState("");

  /* =======================================================
     EDIT STAFF STATE
  ======================================================= */

  const [editingStaff, setEditingStaff] = useState(null);

  /* =======================================================
     REMOVE STAFF STATE
  ======================================================= */

  const [staffToRemove, setStaffToRemove] = useState(null);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: staff.length,

      active: staff.filter(
        (member) => member.status === "Active"
      ).length,

      available: staff.filter(
        (member) =>
          member.status === "Active" &&
          member.availability === "Available"
      ).length,

      assigned: staff.filter(
        (member) =>
          member.availability === "Assigned"
      ).length,

      leave: staff.filter(
        (member) =>
          member.availability === "On Leave"
      ).length,
    };
  }, [staff]);

  /* =======================================================
     FILTERED STAFF
  ======================================================= */

  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase().trim();

    return staff.filter((member) => {
      const matchesSearch =
        !query ||
        (member.name || "")
          .toLowerCase()
          .includes(query) ||
        (member.id || "")
          .toLowerCase()
          .includes(query) ||
        (member.phone || "")
          .toLowerCase()
          .includes(query) ||
        (member.category || "")
          .toLowerCase()
          .includes(query) ||
        (member.department || "")
          .toLowerCase()
          .includes(query);

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

  /* =======================================================
     FORM CHANGE HANDLER
  ======================================================= */

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     OPEN ADD STAFF FORM
  ======================================================= */

  const openAddModal = () => {
    setEditingStaff(null);
    setForm({ ...emptyStaffForm });
    setFormError("");
    setShowAddModal(true);
  };

  /* =======================================================
     CLOSE STAFF FORM
  ======================================================= */

  const closeAddModal = () => {
    setEditingStaff(null);
    setForm({ ...emptyStaffForm });
    setFormError("");
    setShowAddModal(false);
  };

  /* =======================================================
     GENERATE NEXT STAFF ID
  ======================================================= */

  const generateStaffId = () => {
    const highestId = staff.reduce(
      (max, member) => {
        const numericId = Number(
          (member.id || "").replace("EMP-", "")
        );

        if (!Number.isFinite(numericId)) {
          return max;
        }

        return Math.max(max, numericId);
      },
      1000
    );

    return `EMP-${highestId + 1}`;
  };

  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Staff name is required.";
    }

    if (!form.category) {
      return "Staff category is required.";
    }

    if (!form.phone.trim()) {
      return "Phone number is required.";
    }

    if (!form.qualification.trim()) {
      return "Qualification is required.";
    }

    return "";
  };

  /* =======================================================
     ADD STAFF
  ======================================================= */

  const handleAddStaff = (event) => {
    event.preventDefault();

    setFormError("");

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const newStaff = {
      ...form,
      id: generateStaffId(),
      joiningDate: new Date()
        .toISOString()
        .split("T")[0],
      availability: "Available",
      status: "Active",
      assignedPatients: 0,
      currentShift: "Not Assigned",
    };

    setStaff((current) => [
      newStaff,
      ...current,
    ]);

    closeAddModal();
  };

  /* =======================================================
     EDIT STAFF
  ======================================================= */

  const handleEditStaff = (member) => {
    setSelectedStaff(null);

    setEditingStaff(member);

    setForm({
      name: member.name || "",
      category: member.category || "",
      designation: member.designation || "",
      department: member.department || "",
      qualification: member.qualification || "",
      experience: member.experience || "",
      phone: member.phone || "",
      email: member.email || "",
      address: member.address || "",
    });

    setFormError("");
    setShowAddModal(true);
  };

  /* =======================================================
     UPDATE STAFF
  ======================================================= */

  const handleUpdateStaff = (event) => {
    event.preventDefault();

    setFormError("");

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!editingStaff) {
      setFormError(
        "No staff member selected for update."
      );
      return;
    }

    setStaff((current) =>
      current.map((member) =>
        member.id === editingStaff.id
          ? {
              ...member,
              ...form,
            }
          : member
      )
    );

    closeAddModal();
  };

  /* =======================================================
     FORM SUBMIT HANDLER
  ======================================================= */

  const handleFormSubmit = editingStaff
    ? handleUpdateStaff
    : handleAddStaff;

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setAvailabilityFilter("All");
    setStatusFilter("All");
  };

  /* =======================================================
     VIEW STAFF
  ======================================================= */

  const handleViewStaff = (member) => {
    setSelectedStaff(member);
  };

  /* =======================================================
     CLOSE STAFF DETAILS
  ======================================================= */

  const closeStaffDetails = () => {
    setSelectedStaff(null);
  };

  /* =======================================================
     REMOVE STAFF
  ======================================================= */

  const handleRemoveStaff = (member) => {
    setSelectedStaff(null);
    setStaffToRemove(member);
  };

  /* =======================================================
     CONFIRM REMOVE
  ======================================================= */

  const confirmRemoveStaff = () => {
    if (!staffToRemove) return;

    setStaff((current) =>
      current.filter(
        (member) =>
          member.id !== staffToRemove.id
      )
    );

    setStaffToRemove(null);
  };

  /* =======================================================
     CANCEL REMOVE
  ======================================================= */

  const cancelRemoveStaff = () => {
    setStaffToRemove(null);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* PAGE HEADER */}

      <div
        className="
          flex flex-col gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-4
        "
      >
        <div className="min-w-0">

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-[#08A6A0]
              sm:text-xs
            "
          >
            WORKFORCE MANAGEMENT
          </p>

          <h1
            className="
              mt-1.5
              text-xl
              font-bold
              tracking-tight
              text-[#073F42]
              sm:mt-2
              sm:text-3xl
            "
          >
            Staff Management
          </h1>

          <p
            className="
              mt-1.5
              hidden
              max-w-2xl
              text-xs
              leading-5
              text-[#789092]
              sm:mt-2
              sm:block
              sm:text-sm
              sm:leading-6
            "
          >
            Manage doctors, nurses, caregivers, attendants
            and operational staff, including qualifications,
            availability, assignments and shifts.
          </p>

        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="
            inline-flex
            h-9
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-lg
            bg-[#08A6A0]
            px-4
            text-xs
            font-semibold
            text-white
            shadow-lg
            shadow-[#08A6A0]/15
            transition
            hover:bg-[#078F8A]
            sm:h-11
            sm:w-auto
            sm:gap-2
            sm:rounded-xl
            sm:px-5
            sm:text-sm
          "
        >
          <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

          Register Staff
        </button>
      </div>

      {/* STAT CARDS */}

      <div
        className="
          grid
          grid-cols-2
          gap-1.5
          sm:gap-2.5
          lg:grid-cols-5
        "
      >
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

      {/* SEARCH + FILTER */}

      <SearchFilter
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        placeholder="
          Search by name, employee ID, phone, category...
        "
      >
        <div
          className="
            grid
            gap-3
            sm:gap-4
            md:grid-cols-3
          "
        >
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
      </SearchFilter>

      {/* HOSPITAL WORKFORCE */}

      <HospitalWorkforce
        staff={staff}
        filteredStaff={filteredStaff}
        onView={handleViewStaff}
        onClearFilters={clearFilters}
      />

      {/* STAFF DETAILS */}

      {selectedStaff && (
        <StaffDetails
          member={selectedStaff}
          onClose={closeStaffDetails}
          onEdit={handleEditStaff}
          onRemove={handleRemoveStaff}
        />
      )}

      {/* ADD / EDIT STAFF */}

      {showAddModal && (
        <StaffForm
          form={form}
          error={formError}
          categoryOptions={categoryOptions}
          onChange={updateForm}
          onSubmit={handleFormSubmit}
          onClose={closeAddModal}
          isEditing={Boolean(editingStaff)}
        />
      )}

      {/* REMOVE CONFIRMATION */}

      <ConfirmDialog
        open={Boolean(staffToRemove)}
        title="Remove Staff?"
        message={
          <>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-[#31585A]">
              {staffToRemove?.name}
            </span>{" "}
            from the hospital workforce?
          </>
        }
        confirmText="Remove Staff"
        cancelText="Cancel"
        onCancel={cancelRemoveStaff}
        onConfirm={confirmRemoveStaff}
        variant="danger"
      />
    </div>
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
    <div>
      <label
        className="
          mb-1.5
          block
          text-[10px]
          font-semibold
          text-[#31585A]
          sm:mb-2
          sm:text-xs
        "
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          h-9
          w-full
          rounded-lg
          border
          border-[#D9E9E7]
          bg-[#FAFDFC]
          px-2.5
          text-xs
          text-[#31585A]
          outline-none
          transition
          focus:border-[#08A6A0]
          focus:ring-2
          focus:ring-[#08A6A0]/10
          sm:h-10
          sm:rounded-xl
          sm:px-3
          sm:text-sm
        "
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
    </div>
  );
};

export default Staff;