import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseMedical,
  Clock3,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import HospitalWorkforce from "../../../components/admin/HospitalWorkforce";
import StaffDetails from "../../../components/admin/StaffDetails";
import StaffForm from "../../../components/admin/StaffForm";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import SetCredentialsModal from "../../../components/admin/SetCredentialsModal";

import {
  categoryOptions as defaultCategoryOptions,
  availabilityOptions,
  statusOptions,
  emptyStaffForm,
} from "../../../data";
import { apiRequest } from "../../../api/api";
import {
  getTemporaryPassword,
  saveTemporaryPassword,
  generateTemporaryPassword,
} from "../../../utils/temporaryPasswords";

const Staff = () => {
  /* =======================================================
     STAFF STATE
  ======================================================= */

  const [staff, setStaff] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState(defaultCategoryOptions);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStaffAndServices = async () => {
    try {
      const [staffRes, doctorsRes, nursesRes, servicesRes] = await Promise.allSettled([
        apiRequest("/api/staff"),
        apiRequest("/api/doctors"),
        apiRequest("/api/nurses"),
        apiRequest("/api/services"),
      ]);

      const normName = (n) =>
        (n || "")
          .toLowerCase()
          .replace(/^dr\.?\s*/i, "")
          .replace(/\s+/g, " ")
          .trim();

      // 1. Format Doctors from /api/doctors
      const doctorsList =
        doctorsRes.status === "fulfilled" && Array.isArray(doctorsRes.value)
          ? doctorsRes.value.map((doc) => {
              const fullName = [doc.first_name, doc.middle_name, doc.last_name]
                .filter(Boolean)
                .join(" ");
              const displayName = fullName.startsWith("Dr.") ? fullName : `Dr. ${fullName}`;
              return {
                id: doc.registration_number || (doc.id ? `DOC-${1000 + doc.id}` : `DOC-${Math.random()}`),
                backend_id: doc.id,
                registration_number: doc.registration_number,
                source: "doctor",
                temporary_password: doc.temporary_password || getTemporaryPassword(doc, "doctor"),
                username: doc.username || "",
                name: displayName,
                category: "Doctor",
                designation: doc.specialization ? `${doc.specialization} Specialist` : "Doctor",
                department: doc.department || doc.specialization || "Medical",
                gender: doc.gender || "Male",
                phone: doc.phone || "",
                email: doc.email || "",
                address: doc.address || "",
                qualification: doc.qualification || "MBBS, MD",
                experience: doc.experience_years ? `${doc.experience_years} Years` : "Experienced",
                joiningDate: doc.created_at ? doc.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                availability: doc.available_status || "Available",
                status: doc.status || "Active",
                assignedPatients: 0,
                currentShift: "General",
              };
            })
          : [];

      // 2. Format Nurses from /api/nurses
      const nursesList =
        nursesRes.status === "fulfilled" && Array.isArray(nursesRes.value)
          ? nursesRes.value.map((nurse) => {
              const fullName = [nurse.first_name, nurse.middle_name, nurse.last_name]
                .filter(Boolean)
                .join(" ");
              const nurseCat =
                nurse.qualification &&
                (nurse.qualification.includes("GNM")
                  ? "GNM Nurse"
                  : nurse.qualification.includes("ANM")
                  ? "ANM Nurse"
                  : nurse.qualification.includes("B.Sc")
                  ? "B.Sc Nurse"
                  : nurse.qualification.includes("ICU")
                  ? "ICU Nurse"
                  : "Nurse") || "Nurse";

              return {
                id: nurse.registration_number || (nurse.id ? `NUR-${1000 + nurse.id}` : `NUR-${Math.random()}`),
                backend_id: nurse.id,
                registration_number: nurse.registration_number,
                staff_id: nurse.staff_id,
                source: "nurse",
                temporary_password: nurse.temporary_password || getTemporaryPassword(nurse, "nurse"),
                username: nurse.username || "",
                name: fullName || "Nurse",
                category: nurseCat,
                designation: nurse.qualification || "Registered Nurse",
                department: nurse.department || nurse.ward || "Nursing",
                gender: nurse.gender || "Female",
                phone: nurse.phone || "",
                email: nurse.email || "",
                address: nurse.address || "",
                qualification: nurse.qualification || "B.Sc Nursing",
                experience: nurse.experience_years ? `${nurse.experience_years} Years` : "Experienced",
                joiningDate: nurse.created_at ? nurse.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                availability: "Available",
                status: nurse.status || "Active",
                assignedPatients: 0,
                currentShift: nurse.shift_type || "Morning",
              };
            })
          : [];

      // Sets for deduplication
      const existingDocNames = new Set(doctorsList.map((d) => normName(d.name)));
      const existingNurseNames = new Set(nursesList.map((n) => normName(n.name)));
      const existingNurseStaffIds = new Set(nursesList.map((n) => n.staff_id).filter(Boolean));

      // 3. Format Staff from /api/staff, excluding duplicates of doctors and nurses
      const rawStaff =
        staffRes.status === "fulfilled" && Array.isArray(staffRes.value)
          ? staffRes.value
          : [];

      const generalStaffList = rawStaff
        .filter((member) => {
          const sName = normName(member.name);
          const sRole = (member.role || "").toLowerCase();
          if ((sRole.includes("doctor") || sRole === "dr") && existingDocNames.has(sName)) {
            return false;
          }
          if (sRole.includes("nurse") && (existingNurseStaffIds.has(member.id) || existingNurseNames.has(sName))) {
            return false;
          }
          return true;
        })
        .map((member) => ({
          id: member.id ? `EMP-${1000 + member.id}` : member.id,
          backend_id: member.id,
          registration_number: member.id ? `EMP-${1000 + member.id}` : "",
          source: "staff",
          temporary_password: member.temporary_password || getTemporaryPassword(member, "staff"),
          username: member.username || "",
          name: member.name,
          category: member.role || "Staff",
          designation: member.role || "Staff",
          department: member.department || member.role || "General",
          gender: member.gender || "Male",
          phone: member.phone || "",
          email: member.email || "",
          address: member.address || "",
          qualification: member.qualification || "",
          experience: member.experience || "1 Year",
          joiningDate: member.joining_date || new Date().toISOString().split("T")[0],
          availability: "Available",
          status: member.status || "Active",
          assignedPatients: 0,
          currentShift: "Morning",
        }));

      const unifiedStaff = [...doctorsList, ...nursesList, ...generalStaffList];
      setStaff(unifiedStaff);

      // Build categories list
      const combinedCats = new Set(["All", "Doctor", "Nurse", "GNM Nurse", "ANM Nurse", "B.Sc Nurse", "ICU Nurse"]);
      unifiedStaff.forEach((m) => {
        if (m.category) combinedCats.add(m.category);
      });
      if (servicesRes.status === "fulfilled" && Array.isArray(servicesRes.value)) {
        servicesRes.value.forEach((s) => {
          if (s.name) combinedCats.add(s.name);
        });
      }
      setCategoryOptions(Array.from(combinedCats));
    } catch (err) {
      console.error("Failed to load staff from backend:", err);
    }
  };

  useEffect(() => {
    fetchStaffAndServices();
  }, []);


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
  const [credentialsStaff, setCredentialsStaff] = useState(null);

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
    setForm({
      ...emptyStaffForm,
    });
    setFormError("");
    setShowAddModal(true);
  };

  /* =======================================================
     CLOSE STAFF FORM
  ======================================================= */

  const closeAddModal = () => {
    setEditingStaff(null);
    setForm({
      ...emptyStaffForm,
    });
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

  const handleAddStaff = async (event) => {
    event.preventDefault();
    setFormError("");

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const created = await apiRequest("/api/staff", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          role: form.category || form.designation || "Staff",
          gender: "Male",
          phone: form.phone,
          email: form.email || null,
          address: form.address || null,
          qualification: form.qualification || null,
          experience: form.experience || null,
          status: "Active",
        }),
      });

      const backendId = created?.id;
      const finalTempPassword = created?.temporary_password || "";
      const finalUsername = created?.username || "";

      if (finalTempPassword) {
        saveTemporaryPassword({
          role: "staff",
          id: backendId,
          registration_number: backendId ? `EMP-${1000 + backendId}` : "",
          username: finalUsername,
          email: form.email || "",
          password: finalTempPassword,
        });
      }

      const newStaff = {
        ...form,
        id: backendId ? `EMP-${1000 + backendId}` : generateStaffId(),
        backend_id: backendId,
        username: finalUsername,
        source: "staff",
        temporary_password: finalTempPassword,
        joiningDate: new Date().toISOString().split("T")[0],
        availability: "Available",
        status: "Active",
        assignedPatients: 0,
        currentShift: "Not Assigned",
      };

      setStaff((current) => [newStaff, ...current]);
      showToast("Staff registered successfully!");
      closeAddModal();
    } catch (err) {
      console.error("Failed to register staff:", err);
      showToast(err.message || "Failed to register staff member", "error");
    }
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

  const handleUpdateStaff = async (event) => {
    event.preventDefault();
    setFormError("");

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!editingStaff) {
      setFormError("No staff member selected for update.");
      return;
    }

    try {
      if (editingStaff.backend_id) {
        if (editingStaff.source === "doctor") {
          const formData = new FormData();
          const cleanName = form.name.replace(/^dr\.?\s*/i, "").trim();
          const nameParts = cleanName.split(" ");
          formData.append("first_name", nameParts[0] || "Doctor");
          formData.append("last_name", nameParts.slice(1).join(" ") || "");
          formData.append("specialization", form.designation || form.category || "General Medicine");
          formData.append("department", form.department || "Medical");
          formData.append("phone", form.phone);
          if (form.email) formData.append("email", form.email);
          if (form.address) formData.append("address", form.address);
          if (form.qualification) formData.append("qualification", form.qualification);

          await apiRequest(`/api/doctors/${editingStaff.backend_id}`, {
            method: "PUT",
            body: formData,
          });
        } else if (editingStaff.source === "nurse") {
          const nameParts = form.name.trim().split(" ");
          await apiRequest(`/api/nurses/${editingStaff.backend_id}`, {
            method: "PUT",
            body: JSON.stringify({
              first_name: nameParts[0] || "Nurse",
              last_name: nameParts.slice(1).join(" ") || "",
              phone: form.phone,
              email: form.email || null,
              address: form.address || null,
              qualification: form.qualification || null,
              department: form.department || "Nursing",
            }),
          });
        } else {
          await apiRequest(`/api/staff/${editingStaff.backend_id}`, {
            method: "PUT",
            body: JSON.stringify({
              name: form.name,
              role: form.category || form.designation || "Staff",
              gender: editingStaff.gender || "Male",
              phone: form.phone,
              email: form.email || null,
              address: form.address || null,
              qualification: form.qualification || null,
              experience: form.experience || null,
              status: editingStaff.status || "Active",
            }),
          });
        }
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
      showToast("Staff updated successfully!");
      closeAddModal();
    } catch (err) {
      console.error("Failed to update staff:", err);
      showToast(err.message || "Failed to update staff member", "error");
    }
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

  const confirmRemoveStaff = async () => {
    if (!staffToRemove) return;

    try {
      if (staffToRemove.backend_id) {
        if (staffToRemove.source === "doctor") {
          await apiRequest(`/api/doctors/${staffToRemove.backend_id}`, { method: "DELETE" });
        } else if (staffToRemove.source === "nurse") {
          await apiRequest(`/api/nurses/${staffToRemove.backend_id}`, { method: "DELETE" });
          if (staffToRemove.staff_id) {
            try {
              await apiRequest(`/api/staff/${staffToRemove.staff_id}`, { method: "DELETE" });
            } catch (e) {
              // Ignore if not in staff table
            }
          }
        } else {
          await apiRequest(`/api/staff/${staffToRemove.backend_id}`, { method: "DELETE" });
        }
      }
      setStaff((current) =>
        current.filter((member) => member.id !== staffToRemove.id)
      );
      showToast(`${staffToRemove.name} removed successfully!`);
    } catch (err) {
      console.error("Failed to delete staff on backend:", err);
      showToast(err.message || "Failed to delete staff member", "error");
    } finally {
      setStaffToRemove(null);
    }
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
        onRemove={handleRemoveStaff}
        onCredentials={setCredentialsStaff}
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

      {/* SET CREDENTIALS MODAL */}
      <SetCredentialsModal
        open={Boolean(credentialsStaff)}
        employee={credentialsStaff}
        employeeType={
          (credentialsStaff?.source || credentialsStaff?.category || "staff").toLowerCase().includes("doctor")
            ? "doctor"
            : (credentialsStaff?.source || credentialsStaff?.category || "staff").toLowerCase().includes("nurse")
            ? "nurse"
            : "staff"
        }
        onClose={() => setCredentialsStaff(null)}
        onSuccess={(updated) => {
          if (credentialsStaff) {
            setStaff((current) =>
              current.map((member) =>
                member.id === credentialsStaff.id || (member.backend_id && member.backend_id === credentialsStaff.backend_id)
                  ? {
                      ...member,
                      username: updated?.username || member.username,
                      ...(updated?.temporary_password ? { temporary_password: updated.temporary_password } : {}),
                    }
                  : member
              )
            );
          }
          showToast("Workforce login credentials updated successfully!");
        }}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 z-50
            flex items-center gap-2.5
            rounded-2xl px-5 py-3.5
            text-sm font-semibold text-white shadow-2xl
            transition-all duration-300
            ${toast.type === "error" ? "bg-red-600" : "bg-[#08A6A0]"}
          `}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
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