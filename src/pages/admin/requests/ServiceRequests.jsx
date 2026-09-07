import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  UserRound,
  Users,
  ClipboardList,
  Activity,
  CalendarDays,
  MapPin,
  AlertCircle,
  UserCheck,
  Hospital,
  UserRoundCheck,
  Eye,
  ChevronDown,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ServiceRequestDetails from "../../../components/admin/ServiceRequestDetails";

/* =========================================================
   SERVICE TYPE
========================================================= */

const HOME_CARE = "home-care";
const HOSPITAL_CARE = "hospital";

/* =========================================================
   SERVICE CONFIGURATION
========================================================= */

const serviceEligibility = {
  "Patient Caretaker": {
    type: HOME_CARE,
    label: "Patient Caretaker",
    roles: ["Patient Caretaker"],
  },

  "Baby Caretaker": {
    type: HOME_CARE,
    label: "Baby Caretaker",
    roles: ["Baby Caretaker"],
  },

  "Japa Service": {
    type: HOME_CARE,
    label: "Japa Service",
    roles: ["Japa Caretaker"],
  },

  "Baby Sitter": {
    type: HOME_CARE,
    label: "Baby Sitter",
    roles: ["Baby Sitter"],
  },

  "Male Attendant": {
    type: HOME_CARE,
    label: "Male Attendant",
    roles: ["Male Attendant"],
  },

  "Elder Care": {
    type: HOME_CARE,
    label: "Elder Care",
    roles: ["Elder Caregiver"],
  },

  "GNM Nurse": {
    type: HOSPITAL_CARE,
    label: "Hospital Nursing Team",
    roles: [],
  },

  "ANM Nurse": {
    type: HOSPITAL_CARE,
    label: "Hospital Nursing Team",
    roles: [],
  },

  "B.Sc Nurse": {
    type: HOSPITAL_CARE,
    label: "Hospital Nursing Team",
    roles: [],
  },

  "ICU Nurse": {
    type: HOSPITAL_CARE,
    label: "Hospital Nursing Team",
    roles: [],
  },
};

/* =========================================================
   DUMMY STAFF
========================================================= */

const availableStaff = [
  {
    id: "CG001",
    name: "Anita Roy",
    role: "Elder Caregiver",
    phone: "9876543210",
    location: "Kolkata",
    experience: "5 years",
    available: true,
  },
  {
    id: "CG002",
    name: "Priya Das",
    role: "Patient Caretaker",
    phone: "9876543211",
    location: "Kolkata",
    experience: "3 years",
    available: true,
  },
  {
    id: "CG003",
    name: "Mousumi Sen",
    role: "Baby Sitter",
    phone: "9876543212",
    location: "Howrah",
    experience: "4 years",
    available: true,
  },
  {
    id: "CG004",
    name: "Rakesh Mondal",
    role: "Male Attendant",
    phone: "9876543213",
    location: "Kolkata",
    experience: "6 years",
    available: true,
  },
  {
    id: "CG005",
    name: "Soma Ghosh",
    role: "Baby Caretaker",
    phone: "9876543214",
    location: "Salt Lake",
    experience: "4 years",
    available: true,
  },
  {
    id: "CG006",
    name: "Puja Saha",
    role: "Japa Caretaker",
    phone: "9876543215",
    location: "Kolkata",
    experience: "3 years",
    available: true,
  },
];

/* =========================================================
   DUMMY REQUESTS
========================================================= */

const initialRequests = [
  {
    id: "REQ-1001",
    patientId: "PAT-001",
    patientName: "Rahul Das",
    service: "Elder Care",
    category: "Home Care",
    priority: "High",
    status: "Approved",
    requestedDate: "05 Sep 2026",
    startDate: "05 Sep 2026",
    endDate: "12 Sep 2026",
    duration: "7 Days",
    time: "08:00 AM - 08:00 PM",
    location: "Kolkata",
    contact: "9876543201",
    assignedTo: null,
    notes:
      "Patient requires assistance with daily activities, medication reminders and mobility support.",
    createdAt: "04 Sep 2026, 09:30 AM",
  },

  {
    id: "REQ-1002",
    patientId: "PAT-002",
    patientName: "Sneha Sharma",
    service: "Baby Caretaker",
    category: "Home Care",
    priority: "Medium",
    status: "Under Review",
    requestedDate: "05 Sep 2026",
    startDate: "07 Sep 2026",
    endDate: "14 Sep 2026",
    duration: "7 Days",
    time: "09:00 AM - 05:00 PM",
    location: "Salt Lake",
    contact: "9876543202",
    assignedTo: null,
    notes:
      "Family requires support for newborn care during working hours.",
    createdAt: "04 Sep 2026, 10:15 AM",
  },

  {
    id: "REQ-1003",
    patientId: "PAT-003",
    patientName: "Arindam Roy",
    service: "Patient Caretaker",
    category: "Home Care",
    priority: "High",
    status: "Assigned",
    requestedDate: "05 Sep 2026",
    startDate: "06 Sep 2026",
    endDate: "10 Sep 2026",
    duration: "5 Days",
    time: "08:00 AM - 08:00 PM",
    location: "Howrah",
    contact: "9876543203",
    assignedTo: "Priya Das",
    notes:
      "Patient recently discharged and requires temporary home assistance.",
    createdAt: "03 Sep 2026, 04:20 PM",
  },

  {
    id: "REQ-1004",
    patientId: "PAT-004",
    patientName: "Riya Banerjee",
    service: "GNM Nurse",
    category: "Hospital Nursing",
    priority: "High",
    status: "Approved",
    requestedDate: "05 Sep 2026",
    startDate: "05 Sep 2026",
    endDate: "08 Sep 2026",
    duration: "3 Days",
    time: "08:00 AM - 08:00 PM",
    location: "CareCore Hospital",
    contact: "9876543204",
    assignedTo: null,
    notes:
      "Patient is admitted to the hospital and requires nursing care. Hospital nursing team will handle the assignment.",
    createdAt: "05 Sep 2026, 08:40 AM",
  },

  {
    id: "REQ-1005",
    patientId: "PAT-005",
    patientName: "Amit Ghosh",
    service: "ICU Nurse",
    category: "Hospital Nursing",
    priority: "Critical",
    status: "Under Review",
    requestedDate: "05 Sep 2026",
    startDate: "05 Sep 2026",
    endDate: "06 Sep 2026",
    duration: "1 Day",
    time: "24 Hours",
    location: "CareCore Hospital - ICU",
    contact: "9876543205",
    assignedTo: null,
    notes:
      "Patient is admitted in ICU. Nursing allocation must be handled through the hospital ICU/ward workflow.",
    createdAt: "05 Sep 2026, 09:10 AM",
  },

  {
    id: "REQ-1006",
    patientId: "PAT-006",
    patientName: "Madhuri Sen",
    service: "Japa Service",
    category: "Home Care",
    priority: "Medium",
    status: "Completed",
    requestedDate: "04 Sep 2026",
    startDate: "04 Sep 2026",
    endDate: "05 Sep 2026",
    duration: "2 Days",
    time: "07:00 AM - 07:00 PM",
    location: "Kolkata",
    contact: "9876543206",
    assignedTo: "Puja Saha",
    notes:
      "Postpartum support including mother and newborn assistance.",
    createdAt: "03 Sep 2026, 11:30 AM",
  },

  {
    id: "REQ-1007",
    patientId: "PAT-007",
    patientName: "Sourav Mukherjee",
    service: "Male Attendant",
    category: "Home Care",
    priority: "Low",
    status: "Requested",
    requestedDate: "05 Sep 2026",
    startDate: "10 Sep 2026",
    endDate: "20 Sep 2026",
    duration: "10 Days",
    time: "10:00 AM - 06:00 PM",
    location: "Kolkata",
    contact: "9876543207",
    assignedTo: null,
    notes:
      "Patient needs assistance with mobility and routine household support.",
    createdAt: "05 Sep 2026, 10:05 AM",
  },

  {
    id: "REQ-1008",
    patientId: "PAT-008",
    patientName: "Kaberi Dutta",
    service: "B.Sc Nurse",
    category: "Hospital Nursing",
    priority: "Medium",
    status: "Completed",
    requestedDate: "03 Sep 2026",
    startDate: "03 Sep 2026",
    endDate: "05 Sep 2026",
    duration: "3 Days",
    time: "08:00 AM - 04:00 PM",
    location: "CareCore Hospital",
    contact: "9876543208",
    assignedTo: null,
    notes:
      "Hospital nursing care completed through the hospital nursing workflow.",
    createdAt: "02 Sep 2026, 03:15 PM",
  },
];

/* =========================================================
   STATUS & PRIORITY BADGES
========================================================= */

const statusConfig = {
  Requested: {
    className: "bg-slate-100 text-slate-700",
    icon: Clock3,
  },

  "Under Review": {
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  },

  Approved: {
    className: "bg-blue-50 text-blue-700",
    icon: CheckCircle2,
  },

  Assigned: {
    className: "bg-violet-50 text-violet-700",
    icon: UserCheck,
  },

  Active: {
    className: "bg-emerald-50 text-emerald-700",
    icon: Activity,
  },

  Completed: {
    className: "bg-green-50 text-green-700",
    icon: CheckCircle2,
  },

  Cancelled: {
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },

  Rejected: {
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
};

const priorityConfig = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Requested;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[10px] lg:text-[11px] ${config.className}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{status}</span>
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[10px] lg:text-[11px] ${
        priorityConfig[priority] || "bg-slate-100 text-slate-700"
      }`}
    >
      {priority}
    </span>
  );
};

const ServiceTypeBadge = ({ service }) => {
  const config = serviceEligibility[service];

  if (!config) return null;

  if (config.type === HOSPITAL_CARE) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-700 sm:text-[10px] lg:text-[11px]">
        <Hospital className="h-3 w-3" />
        Hospital
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8F6] px-2 py-1 text-[9px] font-semibold text-[#078F8A] sm:text-[10px] lg:text-[11px]">
      <MapPin className="h-3 w-3" />
      Home Care
    </span>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ServiceRequests = () => {
  const [requests, setRequests] = useState(initialRequests);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignmentRequest, setAssignmentRequest] = useState(null);

  /* =========================================================
     SERVICES FILTER OPTIONS
  ========================================================= */

  const services = useMemo(() => {
    return [
      "All",
      ...new Set(requests.map((request) => request.service)),
    ];
  }, [requests]);

  /* =========================================================
     FILTER REQUESTS
  ========================================================= */

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        request.id.toLowerCase().includes(search) ||
        request.patientName.toLowerCase().includes(search) ||
        request.patientId.toLowerCase().includes(search) ||
        request.service.toLowerCase().includes(search) ||
        request.location.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        request.status === statusFilter;

      const matchesService =
        serviceFilter === "All" ||
        request.service === serviceFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        request.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService &&
        matchesPriority
      );
    });
  }, [
    requests,
    searchTerm,
    statusFilter,
    serviceFilter,
    priorityFilter,
  ]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalRequests = requests.length;

  const pendingReview = requests.filter(
    (request) =>
      request.status === "Requested" ||
      request.status === "Under Review"
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === "Approved"
  ).length;

  const activeRequests = requests.filter(
    (request) =>
      request.status === "Assigned" ||
      request.status === "Active"
  ).length;

  const completedRequests = requests.filter(
    (request) => request.status === "Completed"
  ).length;

  /* =========================================================
     GET ELIGIBLE STAFF
  ========================================================= */

  const getEligibleStaff = (request) => {
    if (!request) return [];

    const config = serviceEligibility[request.service];

    if (!config || config.type !== HOME_CARE) {
      return [];
    }

    return availableStaff.filter(
      (staff) =>
        config.roles.includes(staff.role) &&
        staff.available
    );
  };

  /* =========================================================
     UPDATE REQUEST STATUS
  ========================================================= */

  const updateRequestStatus = (requestId, newStatus) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
            }
          : request
      )
    );

    setSelectedRequest((current) =>
      current && current.id === requestId
        ? {
            ...current,
            status: newStatus,
          }
        : current
    );
  };

  /* =========================================================
     ASSIGN STAFF
  ========================================================= */

  const assignStaff = (request, staff) => {
    if (!request || !staff) return;

    const config = serviceEligibility[request.service];

    if (!config || config.type !== HOME_CARE) {
      return;
    }

    setRequests((current) =>
      current.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "Assigned",
              assignedTo: staff.name,
            }
          : item
      )
    );

    setAssignmentRequest(null);

    setSelectedRequest({
      ...request,
      status: "Assigned",
      assignedTo: staff.name,
    });
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setServiceFilter("All");
    setPriorityFilter("All");
  };

  const hasFilters =
    searchTerm ||
    statusFilter !== "All" ||
    serviceFilter !== "All" ||
    priorityFilter !== "All";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6]">
            <ClipboardList className="h-5 w-5 text-[#08A6A0]" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#173F41] sm:text-xl lg:text-2xl">
              Service Requests
            </h1>

            <p className="text-[10px] text-[#789092] sm:text-xs">
              Manage patient service requests and care workflows
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Requests"
          value={totalRequests}
          icon={ClipboardList}
        />

        <StatCard
          label="Pending Review"
          value={pendingReview}
          icon={Clock3}
        />

        <StatCard
          label="Approved"
          value={approvedRequests}
          icon={CheckCircle2}
        />

        <StatCard
          label="Active / Assigned"
          value={activeRequests}
          icon={Activity}
        />

        <StatCard
          label="Completed"
          value={completedRequests}
          icon={UserRoundCheck}
        />
      </div>

      {/* =====================================================
          SEARCH & FILTERS
      ===================================================== */}

      <SearchFilter
        search={searchTerm}
        setSearch={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        placeholder="Search request, patient, or service..."
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-9 w-full appearance-none rounded-lg border border-[#DCEBE9] bg-[#FBFEFD] px-3 pr-8 text-xs text-[#173F41] outline-none transition focus:border-[#08A6A0] sm:h-10 sm:text-sm"
            >
              <option value="All">All Status</option>
              <option value="Requested">Requested</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Assigned">Assigned</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#819596]" />
          </div>

          {/* Service */}
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(event) =>
                setServiceFilter(event.target.value)
              }
              className="h-9 w-full appearance-none rounded-lg border border-[#DCEBE9] bg-[#FBFEFD] px-3 pr-8 text-xs text-[#173F41] outline-none transition focus:border-[#08A6A0] sm:h-10 sm:text-sm"
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service === "All"
                    ? "All Services"
                    : service}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#819596]" />
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              className="h-9 w-full appearance-none rounded-lg border border-[#DCEBE9] bg-[#FBFEFD] px-3 pr-8 text-xs text-[#173F41] outline-none transition focus:border-[#08A6A0] sm:h-10 sm:text-sm"
            >
              <option value="All">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#819596]" />
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-3 flex items-center justify-between border-t border-[#EDF4F2] pt-2.5">
          <p className="text-[10px] text-[#789092] sm:text-xs">
            Showing{" "}
            <span className="font-semibold text-[#173F41]">
              {filteredRequests.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#173F41]">
              {requests.length}
            </span>{" "}
            requests
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[10px] font-semibold text-[#08A6A0] transition hover:text-[#078F8A] sm:text-xs"
            >
              Clear all filters
            </button>
          )}
        </div>
      </SearchFilter>

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm lg:block">

        {/* Table Header */}
        <div className="grid min-w-0 grid-cols-[9%_14%_15%_17%_9%_12%_15%_9%] border-b border-[#E2EFED] bg-[#F8FCFB]">

          <div className="min-w-0 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092] lg:px-2.5 lg:text-xs">
            Request
          </div>

          <div className="min-w-0 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092] lg:px-2.5 lg:text-xs">
            Patient
          </div>

          <div className="min-w-0 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092] lg:px-2.5 lg:text-xs">
            Service
          </div>

          <div className="min-w-0 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092] lg:px-2.5 lg:text-xs">
            Schedule
          </div>

          <div className="min-w-0 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092] lg:px-2.5 lg:text-xs">
            Priority
          </div>

          <div className="min-w-0 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092] lg:px-2.5 lg:text-xs">
            Status
          </div>

          <div className="min-w-0 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092] lg:px-2.5 lg:text-xs">
            Assignment
          </div>

          <div className="min-w-0 px-2 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-[#789092] lg:px-2.5 lg:text-xs">
            Action
          </div>
        </div>

        {/* Table Body */}
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const serviceConfig =
              serviceEligibility[request.service];

            return (
              <div
                key={request.id}
                className="grid min-w-0 grid-cols-[9%_14%_15%_17%_9%_12%_15%_9%] border-b border-[#EDF4F2] transition last:border-b-0 hover:bg-[#FBFEFD]"
              >
                {/* Request */}
                <div className="min-w-0 px-2 py-3 lg:px-2.5">
                  <p className="truncate text-[10px] font-semibold text-[#173F41] sm:text-[11px] lg:text-sm">
                    {request.id}
                  </p>

                  <p className="mt-1 truncate text-[9px] text-[#789092] lg:text-[11px]">
                    {request.createdAt}
                  </p>
                </div>

                {/* Patient */}
                <div className="min-w-0 px-2 py-3 lg:px-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6]">
                      <UserRound className="h-3.5 w-3.5 text-[#08A6A0]" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-semibold text-[#173F41] sm:text-[11px] lg:text-sm">
                        {request.patientName}
                      </p>

                      <p className="mt-0.5 truncate text-[9px] text-[#789092] lg:text-[11px]">
                        {request.patientId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service */}
                <div className="min-w-0 px-2 py-3 lg:px-2.5">
                  <p className="truncate text-[10px] font-semibold text-[#173F41] sm:text-[11px] lg:text-sm">
                    {request.service}
                  </p>

                  <div className="mt-1">
                    <ServiceTypeBadge
                      service={request.service}
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="min-w-0 px-2 py-3 lg:px-2.5">
                  <div className="flex min-w-0 items-start gap-1.5">
                    <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#08A6A0]" />

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-medium text-[#173F41] sm:text-[11px] lg:text-sm">
                        {request.startDate}
                      </p>

                      <p className="mt-0.5 truncate text-[9px] text-[#789092] lg:text-[11px]">
                        {request.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="min-w-0 px-2 py-3 lg:px-2.5">
                  <PriorityBadge
                    priority={request.priority}
                  />
                </div>

                {/* Status */}
                <div className="min-w-0 px-2 py-3 lg:px-2.5">
                  <StatusBadge status={request.status} />
                </div>

                {/* Assignment */}
                <div className="min-w-0 px-2 py-3 lg:px-2.5">
                  {serviceConfig?.type === HOSPITAL_CARE ? (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50">
                        <Hospital className="h-3.5 w-3.5 text-blue-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-semibold text-blue-700 sm:text-[11px] lg:text-sm">
                          Hospital Team
                        </p>

                        <p className="truncate text-[9px] text-[#789092] lg:text-[11px]">
                          Ward / Nursing
                        </p>
                      </div>
                    </div>
                  ) : request.assignedTo ? (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6]">
                        <UserCheck className="h-3.5 w-3.5 text-[#08A6A0]" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-semibold text-[#173F41] sm:text-[11px] lg:text-sm">
                          {request.assignedTo}
                        </p>

                        <p className="truncate text-[9px] text-[#789092] lg:text-[11px]">
                          Home-care staff
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#9AA9AA] lg:text-xs">
                      Not assigned
                    </span>
                  )}
                </div>

                {/* Action */}
                <div className="flex min-w-0 items-center justify-end px-2 py-3 lg:px-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedRequest(request)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCEBE9] text-[#08A6A0] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6]">
              <ClipboardList className="h-6 w-6 text-[#08A6A0]" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#173F41]">
              No requests found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-[#789092]">
              Try changing your search or filter options.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 rounded-lg bg-[#08A6A0] px-3 py-2 text-xs font-semibold text-white hover:bg-[#078F8A]"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          MOBILE CARD VIEW
      ===================================================== */}

      <div className="space-y-2.5 lg:hidden">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const serviceConfig =
              serviceEligibility[request.service];

            return (
              <div
                key={request.id}
                className="rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm"
              >
                {/* Request Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[#173F41]">
                      {request.id}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-[#789092]">
                      {request.createdAt}
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                {/* Patient */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6]">
                    <UserRound className="h-4 w-4 text-[#08A6A0]" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#173F41]">
                      {request.patientName}
                    </p>

                    <p className="text-[10px] text-[#789092]">
                      {request.patientId}
                    </p>
                  </div>
                </div>

                {/* Service */}
                <div className="mt-3 rounded-lg bg-[#F8FCFB] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#173F41]">
                        {request.service}
                      </p>

                      <div className="mt-1">
                        <ServiceTypeBadge
                          service={request.service}
                        />
                      </div>
                    </div>

                    <PriorityBadge
                      priority={request.priority}
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="mt-3 grid grid-cols-2 gap-2">

                  <div className="flex min-w-0 items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-[#08A6A0]" />

                    <div className="min-w-0">
                      <p className="text-[9px] text-[#789092]">
                        Start Date
                      </p>

                      <p className="truncate text-[10px] font-medium text-[#173F41]">
                        {request.startDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <Clock3 className="h-4 w-4 shrink-0 text-[#08A6A0]" />

                    <div className="min-w-0">
                      <p className="text-[9px] text-[#789092]">
                        Time
                      </p>

                      <p className="truncate text-[10px] font-medium text-[#173F41]">
                        {request.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[#08A6A0]" />

                  <p className="truncate text-[10px] text-[#173F41]">
                    {request.location}
                  </p>
                </div>

                {/* Assignment */}
                <div className="mt-3 border-t border-[#EDF4F2] pt-3">
                  {serviceConfig?.type === HOSPITAL_CARE ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                        <Hospital className="h-4 w-4 text-blue-600" />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold text-blue-700">
                          Hospital Nursing Team
                        </p>

                        <p className="text-[9px] text-[#789092]">
                          Managed through hospital workflow
                        </p>
                      </div>
                    </div>
                  ) : request.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F8F6]">
                        <UserCheck className="h-4 w-4 text-[#08A6A0]" />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold text-[#173F41]">
                          {request.assignedTo}
                        </p>

                        <p className="text-[9px] text-[#789092]">
                          Home-care staff
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#9AA9AA]">
                      Home-care staff not assigned
                    </p>
                  )}
                </div>

                {/* View Button */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRequest(request)
                  }
                  className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#DCEBE9] text-xs font-semibold text-[#08A6A0] transition hover:bg-[#E8F8F6]"
                >
                  <Eye className="h-4 w-4" />
                  View Request
                </button>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-[#E2EFED] bg-white px-4 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6]">
              <ClipboardList className="h-6 w-6 text-[#08A6A0]" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#173F41]">
              No requests found
            </h3>

            <p className="mt-1 text-xs text-[#789092]">
              Try changing your filters or search term.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 rounded-lg bg-[#08A6A0] px-3 py-2 text-xs font-semibold text-white"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          EXISTING SERVICE REQUEST DETAILS COMPONENT
      ===================================================== */}

      <ServiceRequestDetails
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onUpdateStatus={updateRequestStatus}
        onOpenAssign={setAssignmentRequest}
        serviceEligibility={serviceEligibility}
        StatusBadge={StatusBadge}
        PriorityBadge={PriorityBadge}
        ServiceTypeBadge={ServiceTypeBadge}
      />

      {/* =====================================================
          STAFF ASSIGNMENT MODAL
      ===================================================== */}

      {assignmentRequest && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#073F42]/50 p-3 backdrop-blur-sm sm:p-5">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-4 py-4">
              <div>
                <h2 className="text-sm font-bold text-[#173F41]">
                  Assign Home-Care Staff
                </h2>

                <p className="mt-0.5 text-[10px] text-[#789092]">
                  {assignmentRequest.service} •{" "}
                  {assignmentRequest.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAssignmentRequest(null)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#789092] hover:bg-[#F1F7F6]"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Warning */}
            <div className="mx-4 mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <p className="text-[10px] leading-4 text-amber-700">
                  Only home-care caregivers and attendants
                  are shown here. Hospital doctors and nurses
                  are managed through hospital clinical
                  workflows and cannot be assigned as
                  home-care staff.
                </p>
              </div>
            </div>

            {/* Staff List */}
            <div className="max-h-[55vh] space-y-2 overflow-y-auto p-4">
              {getEligibleStaff(assignmentRequest).length > 0 ? (
                getEligibleStaff(assignmentRequest).map(
                  (staff) => (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() =>
                        assignStaff(
                          assignmentRequest,
                          staff
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl border border-[#E2EFED] p-3 text-left transition hover:border-[#08A6A0] hover:bg-[#F8FCFB]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6]">
                        <UserRound className="h-5 w-5 text-[#08A6A0]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[#173F41]">
                          {staff.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#08A6A0]">
                          {staff.role}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-[#789092]">
                          <span>{staff.experience}</span>
                          <span>{staff.location}</span>
                        </div>
                      </div>

                      <UserCheck className="h-4 w-4 shrink-0 text-[#08A6A0]" />
                    </button>
                  )
                )
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F7F6]">
                    <Users className="h-5 w-5 text-[#789092]" />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-[#173F41]">
                    No eligible home-care staff available
                  </p>

                  <p className="mt-1 text-[10px] text-[#789092]">
                    Check staff availability or
                    qualification requirements.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E2EFED] bg-[#FBFEFD] px-4 py-3">
              <button
                type="button"
                onClick={() =>
                  setAssignmentRequest(null)
                }
                className="w-full rounded-lg border border-[#DCEBE9] py-2 text-xs font-semibold text-[#173F41] hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;