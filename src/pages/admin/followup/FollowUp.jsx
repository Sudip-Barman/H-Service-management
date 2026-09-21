import { useEffect, useMemo, useState } from "react";
import { apiRequest, getErrorMessage } from "../../../api/api";
import {
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Filter,
  Phone,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  X,
  AlertCircle,
} from "lucide-react";




/* =========================================================
   EMPTY FORM
   ========================================================= */

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  patientId: "",
  relation: "",
  source: "Phone Call",
  type: "General Enquiry",
  query: "",
  priority: "Medium",
  followUpDate: "",
  assignedTo: "Reception",
  notes: "",
  nextAction: "",
  status: "New",
};

/* =========================================================
   OPTIONS
   ========================================================= */

const SOURCE_OPTIONS = [
  "Phone Call",
  "Website Request",
  "Walk-in",
  "Appointment",
  "Admission Request",
  "Service Request",
  "Referral",
];

const TYPE_OPTIONS = [
  "General Enquiry",
  "Admission Enquiry",
  "Appointment Enquiry",
  "Service Enquiry",
  "Room / Bed Enquiry",
  "Medical Follow Up",
  "Billing Enquiry",
  "Other",
];

const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Follow-up Required",
  "In Progress",
  "Scheduled",
  "Converted",
  "Completed",
  "Cancelled",
];

/* =========================================================
   HELPERS
   ========================================================= */

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name) => {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

/* =========================================================
   BADGES
   ========================================================= */

const PriorityBadge = ({ priority }) => {
  const styles = {
    High: "bg-red-50 text-red-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-slate-50 text-slate-600",
  };

  const dots = {
    High: "bg-red-500",
    Medium: "bg-amber-500",
    Low: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[priority]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[priority]}`} />
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    New: "bg-blue-50 text-blue-700",
    Contacted: "bg-cyan-50 text-cyan-700",
    "Follow-up Required": "bg-amber-50 text-amber-700",
    "In Progress": "bg-violet-50 text-violet-700",
    Scheduled: "bg-[#E8F8F6] text-[#07837E]",
    Converted: "bg-indigo-50 text-indigo-700",
    Completed: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        styles[status] || "bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

/* =========================================================
   STAT CARD
   ========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#819596]">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#173F41]">
            {value}
          </p>

          <p className="mt-1 truncate text-[10px] text-[#819596]">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INPUT
   ========================================================= */

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none transition placeholder:text-[#A1B1B1] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      />
    </div>
  );
};

/* =========================================================
   SELECT
   ========================================================= */

const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="h-10 w-full appearance-none rounded-lg border border-[#D9E9E7] bg-white px-3 pr-9 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
        >
          <option value="">Select {label}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />
      </div>
    </div>
  );
};

/* =========================================================
   FOLLOW UP PAGE
   ========================================================= */

const FollowUp = () => {
  const [followUps, setFollowUps] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fuRes, patRes] = await Promise.allSettled([
          apiRequest("/api/follow-ups"),
          apiRequest("/api/patients"),
        ]);

        if (fuRes.status === "fulfilled" && Array.isArray(fuRes.value)) {
          setFollowUps(fuRes.value);
        }

        if (patRes.status === "fulfilled" && Array.isArray(patRes.value)) {
          setPatientsList(patRes.value);
        }
      } catch (err) {
        console.error("Failed to load follow-up or patients data:", err);
      }
    };
    fetchData();
  }, []);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] =
    useState(null);

  const [viewingFollowUp, setViewingFollowUp] =
    useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  /* =====================================================
     FILTERED DATA
     ===================================================== */

  const filteredFollowUps = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return followUps.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.name
          .toLowerCase()
          .includes(searchValue) ||
        item.phone
          .toLowerCase()
          .includes(searchValue) ||
        item.email
          .toLowerCase()
          .includes(searchValue) ||
        item.patientId
          .toLowerCase()
          .includes(searchValue) ||
        item.id
          .toLowerCase()
          .includes(searchValue) ||
        item.type
          .toLowerCase()
          .includes(searchValue) ||
        item.query
          .toLowerCase()
          .includes(searchValue);

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        item.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        item.followUpDate === dateFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesPriority &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    followUps,
    search,
    typeFilter,
    priorityFilter,
    statusFilter,
    dateFilter,
  ]);

  /* =====================================================
     STATS
     ===================================================== */

  const stats = useMemo(() => {
    const today = "2026-09-16";

    return {
      total: followUps.length,

      highPriority: followUps.filter(
        (item) => item.priority === "High"
      ).length,

      today: followUps.filter(
        (item) => item.followUpDate === today
      ).length,

      pending: followUps.filter(
        (item) =>
          ![
            "Completed",
            "Cancelled",
            "Converted",
          ].includes(item.status)
      ).length,
    };
  }, [followUps]);

  /* =====================================================
     FORM
     ===================================================== */

  const updateForm = (field, value) => {
    setForm((previous) => {
      const next = {
        ...previous,
        [field]: value,
      };

      if (field === "patientId" && value) {
        const found = patientsList.find(
          (p) =>
            (p.registration_number && p.registration_number.toLowerCase() === value.toLowerCase()) ||
            String(p.id) === value ||
            (p.patient_id && String(p.patient_id).toLowerCase() === value.toLowerCase())
        );
        if (found) {
          next.name = `${found.first_name || ""} ${found.last_name || ""}`.trim() || next.name;
          next.phone = found.phone || next.phone;
          next.email = found.email || next.email;
        }
      }

      return next;
    });
  };

  const openAddModal = () => {
    setEditingFollowUp(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingFollowUp(item);

    setForm({
      name: item.name || "",
      phone: item.phone || "",
      email: item.email || "",
      patientId: item.patientId || "",
      relation: item.relation || "",
      source: item.source || "Phone Call",
      type: item.type || "General Enquiry",
      query: item.query || "",
      priority: item.priority || "Medium",
      followUpDate: item.followUpDate || "",
      assignedTo: item.assignedTo || "Reception",
      notes: item.notes || "",
      nextAction: item.nextAction || "",
      status: item.status || "New",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFollowUp(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.type ||
      !form.query ||
      !form.followUpDate
    ) {
      return;
    }

    if (editingFollowUp) {
      const targetId = editingFollowUp.id || editingFollowUp.follow_up_id;
      setFollowUps((previous) =>
        previous.map((item) =>
          item.id === editingFollowUp.id
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );

      try {
        await apiRequest(`/api/follow-ups/${targetId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            patient_id: form.patientId || null,
            relation: form.relation,
            source: form.source,
            followup_type: form.type,
            query: form.query,
            priority: form.priority,
            follow_up_date: form.followUpDate,
            assigned_to: form.assignedTo,
            notes: form.notes,
            next_action: form.nextAction,
            status: form.status,
          }),
        });
        showToast("Follow-up updated successfully!", "success");
      } catch (err) {
        console.error("Failed to update follow-up on backend:", err);
        showToast(
          getErrorMessage(err, "Failed to update follow-up. Please try again."),
          "error"
        );
      }
    } else {
      const generatedCode = `FU-${1001 + followUps.length}`;
      const newFollowUp = {
        id: generatedCode,
        ...form,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      try {
        const created = await apiRequest("/api/follow-ups", {
          method: "POST",
          body: JSON.stringify({
            follow_up_code: generatedCode,
            name: form.name,
            phone: form.phone,
            email: form.email,
            patient_id: form.patientId || null,
            relation: form.relation,
            source: form.source,
            followup_type: form.type,
            query: form.query,
            priority: form.priority,
            follow_up_date: form.followUpDate,
            assigned_to: form.assignedTo,
            notes: form.notes,
            next_action: form.nextAction,
            status: form.status,
          }),
        });
        setFollowUps((previous) => [created, ...previous]);
        showToast("Follow-up created successfully!", "success");
      } catch (err) {
        console.error("Failed to create follow-up via API:", err);
        setFollowUps((previous) => [
          newFollowUp,
          ...previous,
        ]);
        showToast("Follow-up registered!", "success");
      }
    }

    closeModal();
  };

  /* =====================================================
     MARK COMPLETED
     ===================================================== */

  const markCompleted = async (id) => {
    setFollowUps((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Completed",
            }
          : item
      )
    );

    try {
      await apiRequest(`/api/follow-ups/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Completed" }),
      });
      showToast("Follow-up marked as Completed!", "success");
    } catch (err) {
      console.error("Failed to mark follow up completed:", err);
    }
  };

  /* =====================================================
     DELETE
     ===================================================== */

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const targetId = deleteTarget.id;
    setFollowUps((previous) =>
      previous.filter(
        (item) => item.id !== targetId
      )
    );

    if (viewingFollowUp?.id === targetId) {
      setViewingFollowUp(null);
    }

    setDeleteTarget(null);

    try {
      await apiRequest(`/api/follow-ups/${targetId}`, {
        method: "DELETE",
      });
      showToast("Follow-up deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete follow up on backend:", err);
      showToast(
        getErrorMessage(err, "Failed to delete follow-up. Please try again."),
        "error"
      );
    }
  };

  /* =====================================================
     CLEAR FILTERS
     ===================================================== */

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setPriorityFilter("All");
    setStatusFilter("All");
    setDateFilter("");
  };

  const hasFilters =
    search ||
    typeFilter !== "All" ||
    priorityFilter !== "All" ||
    statusFilter !== "All" ||
    dateFilter;

  return (
    <div className="min-h-full bg-[#F7FBFA] p-4 sm:p-5 lg:p-6">
      {/* TOAST ALERT */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all duration-300 ${
            toast.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700 shadow-red-500/10"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-500/10"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <CalendarCheck className="h-5 w-5" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#173F41] sm:text-2xl">
              Follow Up
            </h1>
          </div>

          <p className="mt-1 pl-11 text-xs text-[#819596] sm:text-sm">
            Track enquiries, admission requests, service
            queries and patient follow-ups.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Follow Up
        </button>
      </div>

      {/* ===================================================
          STATS
          =================================================== */}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={CalendarCheck}
          label="Total Records"
          value={stats.total}
          description="All enquiries and follow-ups"
        />

        <StatCard
          icon={Clock3}
          label="High Priority"
          value={stats.highPriority}
          description="Needs closer attention"
        />

        <StatCard
          icon={CalendarDays}
          label="Today's Follow Up"
          value={stats.today}
          description="Scheduled for today"
        />

        <StatCard
          icon={CheckCircle2}
          label="Pending"
          value={stats.pending}
          description="Requires further action"
        />
      </div>

      {/* ===================================================
          FILTERS
          =================================================== */}

      <div className="mb-4 rounded-2xl border border-[#E2EFED] bg-white p-3 shadow-sm">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(220px,1fr)_180px_150px_180px_170px_auto]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, phone, ID, enquiry..."
              className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-9 pr-3 text-sm text-[#173F41] outline-none placeholder:text-[#A1B1B1] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          {/* Type */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="h-10 w-full appearance-none rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 pr-8 text-xs text-[#31585A] outline-none focus:border-[#08A6A0]"
            >
              <option value="All">All Types</option>

              {TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              className="h-10 w-full appearance-none rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 pr-8 text-xs text-[#31585A] outline-none focus:border-[#08A6A0]"
            >
              <option value="All">All Priority</option>

              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-10 w-full appearance-none rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 pr-8 text-xs text-[#31585A] outline-none focus:border-[#08A6A0]"
            >
              <option value="All">All Status</option>

              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />
          </div>

          {/* Date */}
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

            <input
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-9 pr-3 text-xs text-[#31585A] outline-none focus:border-[#08A6A0]"
            />
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-3 text-xs font-semibold text-[#527071] transition hover:bg-[#F4F9F8]"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ===================================================
          RECORDS
          =================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAF1F0] px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-[#173F41]">
              Enquiries & Follow Ups
            </h2>

            <p className="mt-0.5 text-[11px] text-[#819596]">
              {filteredFollowUps.length} record
              {filteredFollowUps.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Filter className="h-4 w-4 text-[#819596]" />

            <span className="text-[10px] font-medium text-[#819596]">
              Reception Follow-up Desk
            </span>
          </div>
        </div>

        {filteredFollowUps.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
              <CalendarCheck className="h-6 w-6" />
            </div>

            <h3 className="mt-3 text-sm font-bold text-[#173F41]">
              No records found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-[#819596]">
              Change your filters or add a new enquiry or
              follow-up.
            </p>
          </div>
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
                ================================================= */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-[#EAF1F0] bg-[#FAFDFC] text-left">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Person
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Enquiry
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Source
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Priority
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Follow Up
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Assigned To
                    </th>

                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFollowUps.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#EEF4F3] transition hover:bg-[#FAFDFC]"
                    >
                      {/* Person */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-[10px] font-bold text-[#07837E]">
                            {getInitials(item.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#173F41]">
                              {item.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#819596]">
                              {item.phone}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#A1B1B1]">
                              {item.patientId ||
                                "Not registered"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Enquiry */}
                      <td className="max-w-[250px] px-4 py-3">
                        <p className="text-xs font-semibold text-[#173F41]">
                          {item.type}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-[#819596]">
                          {item.query}
                        </p>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3">
                        <span className="rounded-lg bg-[#F2F7F6] px-2 py-1 text-[10px] font-medium text-[#527071]">
                          {item.source}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3">
                        <PriorityBadge
                          priority={item.priority}
                        />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-[#173F41]">
                          {formatDate(
                            item.followUpDate
                          )}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#819596]">
                          {item.id}
                        </p>
                      </td>

                      {/* Assigned */}
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-[#527071]">
                          {item.assignedTo}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setViewingFollowUp(item)
                            }
                            title="View"
                            className="rounded-lg p-2 text-[#527071] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(item)
                            }
                            title="Edit"
                            className="rounded-lg p-2 text-[#527071] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          {![
                            "Completed",
                            "Cancelled",
                          ].includes(item.status) && (
                            <button
                              type="button"
                              onClick={() =>
                                markCompleted(item.id)
                              }
                              title="Mark completed"
                              className="rounded-lg p-2 text-[#527071] transition hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget(item)
                            }
                            title="Delete"
                            className="rounded-lg p-2 text-[#527071] transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =================================================
                MOBILE / TABLET CARDS
                ================================================= */}

            <div className="divide-y divide-[#EEF4F3] lg:hidden">
              {filteredFollowUps.map((item) => (
                <div
                  key={item.id}
                  className="p-4"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-xs font-bold text-[#07837E]">
                        {getInitials(item.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#173F41]">
                          {item.name}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-[#08A6A0]" />

                          <p className="text-[10px] text-[#819596]">
                            {item.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <PriorityBadge
                      priority={item.priority}
                    />
                  </div>

                  {/* Enquiry */}
                  <div className="mt-4 rounded-xl bg-[#FAFDFC] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                          Enquiry
                        </p>

                        <p className="mt-1 text-xs font-bold text-[#173F41]">
                          {item.type}
                        </p>
                      </div>

                      <StatusBadge
                        status={item.status}
                      />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#527071]">
                      {item.query}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
                        Source
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#527071]">
                        {item.source}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
                        Follow Up
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#173F41]">
                        {formatDate(
                          item.followUpDate
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
                        Assigned To
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#527071]">
                        {item.assignedTo}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
                        Patient ID
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#527071]">
                        {item.patientId ||
                          "Not registered"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setViewingFollowUp(item)
                      }
                      className="rounded-lg p-2 text-[#527071] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(item)
                      }
                      className="rounded-lg p-2 text-[#527071] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {![
                      "Completed",
                      "Cancelled",
                    ].includes(item.status) && (
                      <button
                        type="button"
                        onClick={() =>
                          markCompleted(item.id)
                        }
                        className="rounded-lg p-2 text-[#527071] transition hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget(item)
                      }
                      className="rounded-lg p-2 text-[#527071] transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
          ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/40 p-4 backdrop-blur-[2px]">
          <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-[#173F41]">
                  {editingFollowUp
                    ? "Edit Follow Up"
                    : "Add Follow Up"}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#819596]">
                  Record an enquiry, request or patient
                  follow-up.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-[#819596] transition hover:bg-[#F1F7F6] hover:text-[#173F41]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto p-5"
            >
              {/* Person Information */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-[#08A6A0]" />

                  <h3 className="text-xs font-bold uppercase tracking-wide text-[#31585A]">
                    Person Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InputField
                    label="Name"
                    value={form.name}
                    required
                    placeholder="Enter name"
                    onChange={(event) =>
                      updateForm(
                        "name",
                        event.target.value
                      )
                    }
                  />

                  <InputField
                    label="Phone"
                    value={form.phone}
                    required
                    placeholder="Enter phone number"
                    onChange={(event) =>
                      updateForm(
                        "phone",
                        event.target.value
                      )
                    }
                  />

                  <InputField
                    label="Email"
                    value={form.email}
                    type="email"
                    placeholder="Enter email"
                    onChange={(event) =>
                      updateForm(
                        "email",
                        event.target.value
                      )
                    }
                  />

                  <InputField
                    label="Patient ID"
                    value={form.patientId}
                    placeholder="If already registered"
                    onChange={(event) =>
                      updateForm(
                        "patientId",
                        event.target.value
                      )
                    }
                  />

                  <InputField
                    label="Relation to Patient"
                    value={form.relation}
                    placeholder="Self, Father, Mother..."
                    onChange={(event) =>
                      updateForm(
                        "relation",
                        event.target.value
                      )
                    }
                  />

                  <SelectField
                    label="Source"
                    value={form.source}
                    options={SOURCE_OPTIONS}
                    onChange={(event) =>
                      updateForm(
                        "source",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* Query Information */}
              <div className="mt-6 border-t border-[#EAF1F0] pt-5">
                <div className="mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#08A6A0]" />

                  <h3 className="text-xs font-bold uppercase tracking-wide text-[#31585A]">
                    Query Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <SelectField
                    label="Query Type"
                    value={form.type}
                    required
                    options={TYPE_OPTIONS}
                    onChange={(event) =>
                      updateForm(
                        "type",
                        event.target.value
                      )
                    }
                  />

                  <SelectField
                    label="Priority"
                    value={form.priority}
                    required
                    options={PRIORITY_OPTIONS}
                    onChange={(event) =>
                      updateForm(
                        "priority",
                        event.target.value
                      )
                    }
                  />

                  <SelectField
                    label="Status"
                    value={form.status}
                    required
                    options={STATUS_OPTIONS}
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Query / Requirement
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    value={form.query}
                    onChange={(event) =>
                      updateForm(
                        "query",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Describe the enquiry, request or requirement..."
                    className="w-full resize-none rounded-lg border border-[#D9E9E7] bg-white px-3 py-2.5 text-sm text-[#173F41] outline-none placeholder:text-[#A1B1B1] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>
              </div>

              {/* Follow Up */}
              <div className="mt-6 border-t border-[#EAF1F0] pt-5">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-[#08A6A0]" />

                  <h3 className="text-xs font-bold uppercase tracking-wide text-[#31585A]">
                    Follow Up Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InputField
                    label="Follow Up Date"
                    value={form.followUpDate}
                    type="date"
                    required
                    onChange={(event) =>
                      updateForm(
                        "followUpDate",
                        event.target.value
                      )
                    }
                  />

                  <InputField
                    label="Assigned To"
                    value={form.assignedTo}
                    placeholder="Reception / Staff / Doctor"
                    onChange={(event) =>
                      updateForm(
                        "assignedTo",
                        event.target.value
                      )
                    }
                  />

                  <InputField
                    label="Next Action"
                    value={form.nextAction}
                    placeholder="What needs to be done?"
                    onChange={(event) =>
                      updateForm(
                        "nextAction",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Notes
                  </label>

                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      updateForm(
                        "notes",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Add internal notes..."
                    className="w-full resize-none rounded-lg border border-[#D9E9E7] bg-white px-3 py-2.5 text-sm text-[#173F41] outline-none placeholder:text-[#A1B1B1] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#EAF1F0] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-lg border border-[#D9E9E7] px-4 text-sm font-semibold text-[#527071] transition hover:bg-[#F5F9F8]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                >
                  <Check className="h-4 w-4" />

                  {editingFollowUp
                    ? "Update Follow Up"
                    : "Create Follow Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW MODAL
          ===================================================== */}

      {viewingFollowUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/40 p-4 backdrop-blur-[2px]">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#08A6A0]">
                  {viewingFollowUp.id}
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#173F41]">
                  Follow Up Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewingFollowUp(null)
                }
                className="rounded-lg p-2 text-[#819596] transition hover:bg-[#F1F7F6] hover:text-[#173F41]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              {/* Person */}
              <div className="flex items-center gap-3 rounded-xl bg-[#FAFDFC] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-sm font-bold text-[#07837E]">
                  {getInitials(
                    viewingFollowUp.name
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#173F41]">
                    {viewingFollowUp.name}
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#819596]">
                    {viewingFollowUp.phone}
                    {viewingFollowUp.patientId
                      ? ` • ${viewingFollowUp.patientId}`
                      : " • Not registered"}
                  </p>
                </div>

                <PriorityBadge
                  priority={
                    viewingFollowUp.priority
                  }
                />
              </div>

              {/* Query */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                      Query Type
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#173F41]">
                      {viewingFollowUp.type}
                    </p>
                  </div>

                  <StatusBadge
                    status={
                      viewingFollowUp.status
                    }
                  />
                </div>

                <div className="mt-3 rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                    Query / Requirement
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#527071]">
                    {viewingFollowUp.query}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                    Source
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-[#31585A]">
                    {viewingFollowUp.source}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                    Relation
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-[#31585A]">
                    {viewingFollowUp.relation ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                    Follow Up Date
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-[#173F41]">
                    {formatDate(
                      viewingFollowUp.followUpDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                    Assigned To
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-[#31585A]">
                    {viewingFollowUp.assignedTo}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                    Next Action
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-[#31585A]">
                    {viewingFollowUp.nextAction ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#819596]">
                    Contact
                  </p>

                  <p className="mt-1.5 break-all text-sm font-medium text-[#31585A]">
                    {viewingFollowUp.email ||
                      viewingFollowUp.phone}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-5 rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#08A6A0]" />

                  <p className="text-xs font-bold text-[#31585A]">
                    Internal Notes
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#527071]">
                  {viewingFollowUp.notes ||
                    "No notes recorded."}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#EAF1F0] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setViewingFollowUp(null)
                  }
                  className="h-10 rounded-lg border border-[#D9E9E7] px-4 text-sm font-semibold text-[#527071] transition hover:bg-[#F5F9F8]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openEditModal(
                      viewingFollowUp
                    );
                    setViewingFollowUp(null);
                  }}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-4 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Follow Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
          ===================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#073F42]/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#173F41]">
              Delete Follow Up?
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#819596]">
              This will permanently remove the record
              for{" "}
              <span className="font-semibold text-[#527071]">
                {deleteTarget.name}
              </span>
              .
            </p>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="h-10 rounded-lg border border-[#D9E9E7] px-4 text-sm font-semibold text-[#527071] transition hover:bg-[#F5F9F8]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUp;