import { useMemo, useState } from "react";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Filter,
  IndianRupee,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Stethoscope,
  ToggleLeft,
  ToggleRight,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   INITIAL SERVICES
========================================================= */

const initialServices = [
  {
    id: "SRV-001",
    code: "PC-001",
    name: "Patient Caretaker",
    category: "Personal Care",
    description:
      "General assistance with daily activities, patient support and basic personal care.",
    qualification: "Patient Care Training",
    duration: "Flexible",
    pricingMethod: "Per Day",
    price: 800,
    availability: "Available",
    active: true,
    assignedStaff: 18,
    activeRequests: 12,
  },
  {
    id: "SRV-002",
    code: "BC-001",
    name: "Baby Caretaker",
    category: "Child Care",
    description:
      "Dedicated support for infant care, feeding assistance and daily baby supervision.",
    qualification: "Child Care Training",
    duration: "Flexible",
    pricingMethod: "Per Day",
    price: 900,
    availability: "Available",
    active: true,
    assignedStaff: 11,
    activeRequests: 7,
  },
  {
    id: "SRV-003",
    code: "JS-001",
    name: "Japa Service",
    category: "Mother & Baby Care",
    description:
      "Post-delivery support for mother and newborn including daily assistance and care.",
    qualification: "Japa / Postnatal Care Training",
    duration: "7-30 Days",
    pricingMethod: "Per Day",
    price: 1200,
    availability: "Available",
    active: true,
    assignedStaff: 9,
    activeRequests: 5,
  },
  {
    id: "SRV-004",
    code: "BS-001",
    name: "Baby Sitter",
    category: "Child Care",
    description:
      "Child supervision and basic childcare support for families.",
    qualification: "Child Care Experience",
    duration: "Flexible",
    pricingMethod: "Per Hour",
    price: 150,
    availability: "Available",
    active: true,
    assignedStaff: 14,
    activeRequests: 9,
  },
  {
    id: "SRV-005",
    code: "MA-001",
    name: "Male Attendant",
    category: "Personal Care",
    description:
      "Assistance for male patients with mobility, daily activities and personal support.",
    qualification: "Patient Care Training",
    duration: "Flexible",
    pricingMethod: "Per Day",
    price: 850,
    availability: "Limited",
    active: true,
    assignedStaff: 6,
    activeRequests: 8,
  },
  {
    id: "SRV-006",
    code: "EC-001",
    name: "Elder Care",
    category: "Elder Care",
    description:
      "Daily assistance, companionship, mobility support and elderly care.",
    qualification: "Elder Care Experience",
    duration: "Flexible",
    pricingMethod: "Per Day",
    price: 800,
    availability: "Available",
    active: true,
    assignedStaff: 13,
    activeRequests: 15,
  },
  {
    id: "SRV-007",
    code: "GNM-001",
    name: "GNM Nurse",
    category: "Nursing",
    description:
      "Professional nursing support including monitoring, medication assistance and nursing care.",
    qualification: "GNM",
    duration: "Shift Based",
    pricingMethod: "Per Shift",
    price: 600,
    availability: "Available",
    active: true,
    assignedStaff: 22,
    activeRequests: 11,
  },
  {
    id: "SRV-008",
    code: "ANM-001",
    name: "ANM Nurse",
    category: "Nursing",
    description:
      "Qualified auxiliary nursing support for basic clinical and patient care requirements.",
    qualification: "ANM",
    duration: "Shift Based",
    pricingMethod: "Per Shift",
    price: 550,
    availability: "Available",
    active: true,
    assignedStaff: 12,
    activeRequests: 6,
  },
  {
    id: "SRV-009",
    code: "BSC-001",
    name: "B.Sc Nurse",
    category: "Nursing",
    description:
      "Professional nursing services delivered by B.Sc qualified nurses.",
    qualification: "B.Sc Nursing",
    duration: "Shift Based",
    pricingMethod: "Per Shift",
    price: 700,
    availability: "Available",
    active: true,
    assignedStaff: 16,
    activeRequests: 8,
  },
  {
    id: "SRV-010",
    code: "ICU-001",
    name: "ICU Nurse",
    category: "Specialized Nursing",
    description:
      "Specialized nursing support for ICU and critically ill patients.",
    qualification: "B.Sc/GNM + ICU Experience",
    duration: "Shift Based",
    pricingMethod: "Per Shift",
    price: 1200,
    availability: "Limited",
    active: true,
    assignedStaff: 7,
    activeRequests: 4,
  },
];

/* =========================================================
   OPTIONS
========================================================= */

const categoryOptions = [
  "All",
  "Personal Care",
  "Child Care",
  "Mother & Baby Care",
  "Elder Care",
  "Nursing",
  "Specialized Nursing",
];

const availabilityOptions = [
  "All",
  "Available",
  "Limited",
  "Unavailable",
];

const statusOptions = [
  "All",
  "Active",
  "Inactive",
];

const pricingOptions = [
  "Per Hour",
  "Per Shift",
  "Per Day",
  "Per Week",
  "Per Month",
  "Per Visit",
  "Custom",
];

const emptyForm = {
  name: "",
  code: "",
  category: "Personal Care",
  description: "",
  qualification: "",
  duration: "",
  pricingMethod: "Per Day",
  price: "",
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Services = () => {
  const [services, setServices] = useState(initialServices);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  /* Collapsible filter state */
  const [showFilters, setShowFilters] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] =
    useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  /* =======================================================
     STATISTICS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: services.length,

      active: services.filter(
        (service) => service.active
      ).length,

      inactive: services.filter(
        (service) => !service.active
      ).length,

      requests: services.reduce(
        (sum, service) =>
          sum + service.activeRequests,
        0
      ),

      staff: services.reduce(
        (sum, service) =>
          sum + service.assignedStaff,
        0
      ),
    };
  }, [services]);

  /* =======================================================
     FILTERED SERVICES
  ======================================================= */

  const filteredServices = useMemo(() => {
    const query = search.toLowerCase().trim();

    return services.filter((service) => {
      const matchesSearch =
        !query ||
        service.name
          .toLowerCase()
          .includes(query) ||
        service.code
          .toLowerCase()
          .includes(query) ||
        service.category
          .toLowerCase()
          .includes(query) ||
        service.qualification
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        service.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        service.availability ===
          availabilityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" &&
          service.active) ||
        (statusFilter === "Inactive" &&
          !service.active);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesStatus
      );
    });
  }, [
    services,
    search,
    categoryFilter,
    availabilityFilter,
    statusFilter,
  ]);

  /* =======================================================
     FILTER HELPERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setAvailabilityFilter("All");
    setStatusFilter("All");
  };

  const hasFilters =
    search.trim() ||
    categoryFilter !== "All" ||
    availabilityFilter !== "All" ||
    statusFilter !== "All";

  /* =======================================================
     FORM
  ======================================================= */

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     TOGGLE SERVICE
  ======================================================= */

  const toggleService = (serviceId) => {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              active: !service.active,
              availability: service.active
                ? "Unavailable"
                : "Available",
            }
          : service
      )
    );

    setSelectedService((current) => {
      if (
        !current ||
        current.id !== serviceId
      ) {
        return current;
      }

      return {
        ...current,
        active: !current.active,
        availability: current.active
          ? "Unavailable"
          : "Available",
      };
    });
  };

  /* =======================================================
     ADD SERVICE
  ======================================================= */

  const handleAddService = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError(
        "Service name is required."
      );
      return;
    }

    if (!form.code.trim()) {
      setFormError(
        "Service code is required."
      );
      return;
    }

    if (!form.qualification.trim()) {
      setFormError(
        "Required qualification is required."
      );
      return;
    }

    if (
      !form.price ||
      Number(form.price) <= 0
    ) {
      setFormError(
        "Please enter a valid service price."
      );
      return;
    }

    const newService = {
      id: `SRV-${String(
        services.length + 1
      ).padStart(3, "0")}`,
      ...form,
      price: Number(form.price),
      availability: "Available",
      active: true,
      assignedStaff: 0,
      activeRequests: 0,
    };

    setServices((current) => [
      newService,
      ...current,
    ]);

    setForm(emptyForm);
    setFormError("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6]">
              <Settings2 className="h-5 w-5 text-[#08A6A0]" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#08A6A0] sm:text-[10px]">
                CARE CONFIGURATION
              </p>

              <h1 className="text-lg font-bold leading-tight text-[#173F41] sm:text-xl lg:text-2xl">
                Service Management
              </h1>

              <p className="text-[10px] text-[#789092] sm:text-xs">
                Configure hospital care services,
                pricing and availability
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setFormError("");
            setShowAddModal(true);
          }}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#08A6A0] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#078F8A] sm:h-10 sm:px-4"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Service
        </button>
      </div>

      {/* ===================================================
          COMPACT STAT GRID
      =================================================== */}

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Services"
          shortLabel="Total"
          value={stats.total}
          icon={Settings2}
        />

        <StatCard
          label="Active Services"
          shortLabel="Active"
          value={stats.active}
          icon={CheckCircle2}
          iconClass="text-emerald-600"
        />

        <StatCard
          label="Inactive Services"
          shortLabel="Inactive"
          value={stats.inactive}
          icon={Activity}
          iconClass="text-gray-500"
        />

        <StatCard
          label="Active Requests"
          shortLabel="Requests"
          value={stats.requests}
          icon={Users}
          iconClass="text-blue-600"
        />

        <StatCard
          label="Assigned Staff"
          shortLabel="Staff"
          value={stats.staff}
          icon={Stethoscope}
          iconClass="text-violet-600"
        />
      </div>

      {/* ===================================================
          COLLAPSIBLE SEARCH & FILTERS
          EXACT SERVICE REQUEST STYLE
      =================================================== */}

      <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
        {/* Filter Header */}

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-[#08A6A0]" />

              <p className="text-xs font-semibold text-[#173F41] sm:text-sm">
                Filters
              </p>

              {hasFilters && (
                <span className="rounded-full bg-[#E8F8F6] px-2 py-0.5 text-[9px] font-semibold text-[#078F8A]">
                  Active
                </span>
              )}
            </div>

            {!showFilters && hasFilters && (
              <p className="mt-0.5 text-[9px] text-[#789092]">
                Showing{" "}
                {filteredServices.length} of{" "}
                {services.length} services
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] font-semibold text-[#08A6A0] transition hover:text-[#078F8A]"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) => !current
                )
              }
              className="flex h-8 items-center gap-1.5 rounded-lg border border-[#DCEBE9] bg-[#FBFEFD] px-3 text-[10px] font-semibold text-[#173F41] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]"
            >
              <Filter className="h-3.5 w-3.5 text-[#08A6A0]" />

              {showFilters
                ? "Hide Filters"
                : "Show Filters"}

              <ChevronDown
                className={`h-3.5 w-3.5 text-[#819596] transition-transform ${
                  showFilters
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Filter Controls */}

        {showFilters && (
          <div className="mt-3 border-t border-[#EDF4F2] pt-3">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search */}

              <div className="relative sm:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search service, code or qualification..."
                  className="h-9 w-full rounded-lg border border-[#DCEBE9] bg-[#FBFEFD] pl-9 pr-3 text-xs text-[#173F41] outline-none transition placeholder:text-[#9AA9AA] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                />
              </div>

              {/* Category */}

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value
                    )
                  }
                  className="h-9 w-full appearance-none rounded-lg border border-[#DCEBE9] bg-[#FBFEFD] px-3 pr-8 text-xs text-[#173F41] outline-none focus:border-[#08A6A0]"
                >
                  {categoryOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option === "All"
                          ? "All Categories"
                          : option}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#819596]" />
              </div>

              {/* Availability */}

              <div className="relative">
                <select
                  value={availabilityFilter}
                  onChange={(event) =>
                    setAvailabilityFilter(
                      event.target.value
                    )
                  }
                  className="h-9 w-full appearance-none rounded-lg border border-[#DCEBE9] bg-[#FBFEFD] px-3 pr-8 text-xs text-[#173F41] outline-none focus:border-[#08A6A0]"
                >
                  {availabilityOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option === "All"
                          ? "All Availability"
                          : option}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#819596]" />
              </div>

              {/* Status */}

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="h-9 w-full appearance-none rounded-lg border border-[#DCEBE9] bg-[#FBFEFD] px-3 pr-8 text-xs text-[#173F41] outline-none focus:border-[#08A6A0]"
                >
                  {statusOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option === "All"
                          ? "All Status"
                          : option}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#819596]" />
              </div>
            </div>

            {/* Results */}

            <div className="mt-2.5 flex items-center justify-between">
              <p className="text-[10px] text-[#789092]">
                Showing{" "}
                <span className="font-semibold text-[#173F41]">
                  {filteredServices.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#173F41]">
                  {services.length}
                </span>{" "}
                services
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[10px] font-semibold text-[#08A6A0] hover:text-[#078F8A]"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===================================================
          SERVICES TABLE
      =================================================== */}

      <div className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm">
        {/* Table Header */}

        <div className="flex items-center justify-between border-b border-[#EAF2F0] px-3 py-3 sm:px-4">
          <div>
            <h2 className="text-sm font-bold text-[#073F42]">
              Hospital Care Services
            </h2>

            <p className="mt-0.5 text-[10px] text-[#819596]">
              {filteredServices.length} service
              {filteredServices.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="hidden items-center gap-1.5 rounded-lg bg-[#E8F8F6] px-2 py-1 text-[10px] font-semibold text-[#087F7A] sm:flex">
            <Filter className="h-3 w-3" />
            {hasFilters
              ? "Filtered"
              : "All Services"}
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <EmptyState
            onClear={clearFilters}
          />
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-[#EAF2F0] bg-[#F8FCFB] text-left">
                    <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                      Service
                    </th>

                    <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                      Category
                    </th>

                    <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                      Qualification
                    </th>

                    <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                      Pricing
                    </th>

                    <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                      Requests
                    </th>

                    <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                      Availability
                    </th>

                    <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredServices.map(
                    (service) => (
                      <ServiceRow
                        key={service.id}
                        service={service}
                        onView={() =>
                          setSelectedService(
                            service
                          )
                        }
                        onToggle={() =>
                          toggleService(
                            service.id
                          )
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================= */}

            <div className="divide-y divide-[#EAF2F0] lg:hidden">
              {filteredServices.map(
                (service) => (
                  <ServiceMobileCard
                    key={service.id}
                    service={service}
                    onView={() =>
                      setSelectedService(
                        service
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
          SERVICE DETAILS
      =================================================== */}

      {selectedService && (
        <ServiceDetails
          service={selectedService}
          onClose={() =>
            setSelectedService(null)
          }
          onToggle={() =>
            toggleService(
              selectedService.id
            )
          }
        />
      )}

      {/* ===================================================
          ADD SERVICE
      =================================================== */}

      {showAddModal && (
        <AddServiceModal
          form={form}
          error={formError}
          onChange={updateForm}
          onSubmit={handleAddService}
          onClose={() =>
            setShowAddModal(false)
          }
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
  shortLabel,
  value,
  iconClass = "text-[#08A6A0]",
}) => {
  return (
    <div className="h-[50px] rounded-xl border border-[#E2EFED] bg-white px-2.5 py-2 shadow-sm">
      <div className="flex h-full items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[9px] font-medium text-[#789092]">
            <span className="sm:hidden">
              {shortLabel}
            </span>

            <span className="hidden sm:inline">
              {label}
            </span>
          </p>

          <p className="mt-0.5 text-sm font-bold leading-none text-[#173F41]">
            {value}
          </p>
        </div>

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6]">
          <Icon
            className={`h-3.5 w-3.5 ${iconClass}`}
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DESKTOP ROW
========================================================= */

const ServiceRow = ({
  service,
  onView,
  onToggle,
}) => {
  return (
    <tr className="border-b border-[#EAF2F0] last:border-0 hover:bg-[#FAFDFC]">
      {/* Service */}

      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6]">
            <Stethoscope className="h-4 w-4 text-[#08A6A0]" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-[#173F41] lg:text-sm">
              {service.name}
            </p>

            <p className="mt-0.5 text-[9px] text-[#819596] lg:text-[10px]">
              {service.id} · {service.code}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}

      <td className="px-3 py-3">
        <CategoryBadge
          category={service.category}
        />
      </td>

      {/* Qualification */}

      <td className="max-w-[210px] px-3 py-3">
        <p className="truncate text-[11px] font-medium text-[#31585A] lg:text-xs">
          {service.qualification}
        </p>

        <p className="mt-0.5 flex items-center gap-1 text-[9px] text-[#819596] lg:text-[10px]">
          <CalendarClock className="h-3 w-3" />
          {service.duration}
        </p>
      </td>

      {/* Pricing */}

      <td className="px-3 py-3">
        <p className="flex items-center gap-0.5 text-[11px] font-bold text-[#173F41] lg:text-xs">
          <IndianRupee className="h-3 w-3" />

          {service.price.toLocaleString(
            "en-IN"
          )}
        </p>

        <p className="mt-0.5 text-[9px] text-[#819596] lg:text-[10px]">
          {service.pricingMethod}
        </p>
      </td>

      {/* Requests */}

      <td className="px-3 py-3">
        <p className="text-[11px] font-bold text-[#31585A] lg:text-xs">
          {service.activeRequests}
        </p>

        <p className="mt-0.5 text-[9px] text-[#819596] lg:text-[10px]">
          {service.assignedStaff} staff
        </p>
      </td>

      {/* Availability */}

      <td className="px-3 py-3">
        <AvailabilityBadge
          availability={
            service.availability
          }
        />
      </td>

      {/* Actions */}

      <td className="px-3 py-3">
        <div className="flex justify-end gap-1.5">
          <button
            type="button"
            onClick={onView}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCEBE9] text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
            title="View service"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggle}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              service.active
                ? "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
            title={
              service.active
                ? "Deactivate"
                : "Activate"
            }
          >
            {service.active ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   MOBILE SERVICE CARD
========================================================= */

const ServiceMobileCard = ({
  service,
  onView,
}) => {
  return (
    <button
      type="button"
      onClick={onView}
      className="w-full p-3 text-left transition hover:bg-[#FAFDFC]"
    >
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6]">
          <Stethoscope className="h-4 w-4 text-[#08A6A0]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#173F41]">
                {service.name}
              </p>

              <p className="mt-0.5 text-[9px] text-[#819596]">
                {service.code}
              </p>
            </div>

            <AvailabilityBadge
              availability={
                service.availability
              }
            />
          </div>

          <div className="mt-1.5">
            <CategoryBadge
              category={service.category}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#819596]">
            <span>
              ₹
              {service.price.toLocaleString(
                "en-IN"
              )}{" "}
              /{" "}
              {service.pricingMethod.replace(
                "Per ",
                ""
              )}
            </span>

            <span>
              {service.activeRequests}{" "}
              requests
            </span>

            <span>
              {service.assignedStaff} staff
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

/* =========================================================
   CATEGORY BADGE
========================================================= */

const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex max-w-full rounded-full border border-[#D7F4F1] bg-[#E8F8F6] px-2 py-0.5 text-[9px] font-semibold text-[#087F7A] sm:text-[10px]">
      <span className="truncate">
        {category}
      </span>
    </span>
  );
};

/* =========================================================
   AVAILABILITY BADGE
========================================================= */

const AvailabilityBadge = ({
  availability,
}) => {
  const styles = {
    Available:
      "border-emerald-100 bg-emerald-50 text-emerald-700",

    Limited:
      "border-amber-100 bg-amber-50 text-amber-700",

    Unavailable:
      "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-semibold sm:text-[10px] ${
        styles[availability] ||
        "border-gray-100 bg-gray-50 text-gray-600"
      }`}
    >
      {availability}
    </span>
  );
};

/* =========================================================
   SERVICE DETAILS MODAL
========================================================= */

const ServiceDetails = ({
  service,
  onClose,
  onToggle,
}) => {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#073F42]/40 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}

          <div className="bg-[#073F42] px-4 py-4 text-white sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Stethoscope className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold sm:text-base">
                    {service.name}
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/60">
                    {service.id} ·{" "}
                    {service.code}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}

          <div className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-wrap gap-1.5">
              <CategoryBadge
                category={service.category}
              />

              <AvailabilityBadge
                availability={
                  service.availability
                }
              />

              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  service.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {service.active
                  ? "Active Service"
                  : "Inactive"}
              </span>
            </div>

            {/* Description */}

            <div>
              <h3 className="text-xs font-bold text-[#073F42]">
                Service Description
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-[#789092]">
                {service.description}
              </p>
            </div>

            {/* Details */}

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem
                icon={ShieldIcon}
                label="Required Qualification"
                value={
                  service.qualification
                }
              />

              <DetailItem
                icon={Clock3}
                label="Duration"
                value={service.duration}
              />

              <DetailItem
                icon={IndianRupee}
                label="Pricing"
                value={`₹${service.price.toLocaleString(
                  "en-IN"
                )} ${service.pricingMethod}`}
              />

              <DetailItem
                icon={Users}
                label="Assigned Staff"
                value={service.assignedStaff}
              />

              <DetailItem
                icon={Activity}
                label="Active Requests"
                value={service.activeRequests}
              />

              <DetailItem
                icon={CheckCircle2}
                label="Status"
                value={
                  service.active
                    ? "Active"
                    : "Inactive"
                }
              />
            </div>

            {/* Assignment Note */}

            <div className="rounded-xl border border-[#D7F4F1] bg-[#E8F8F6] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#087F7A]">
                Assignment Requirement
              </p>

              <p className="mt-1 text-[10px] leading-5 text-[#31585A] sm:text-xs">
                Only active staff members
                with the required
                qualification and valid
                availability should be
                assigned to this service.
                The backend will later
                perform availability and
                schedule conflict checks.
              </p>
            </div>

            {/* Actions */}

            <div className="flex flex-col-reverse gap-2 border-t border-[#EAF2F0] pt-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={onToggle}
                className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold ${
                  service.active
                    ? "border-red-100 text-red-600 hover:bg-red-50"
                    : "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {service.active ? (
                  <>
                    <ToggleLeft className="h-3.5 w-3.5" />
                    Deactivate Service
                  </>
                ) : (
                  <>
                    <ToggleRight className="h-3.5 w-3.5" />
                    Activate Service
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#DCEBE9] px-3 text-xs font-semibold text-[#31585A] hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Service
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 rounded-lg bg-[#08A6A0] px-4 text-xs font-semibold text-white hover:bg-[#078F8A]"
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

/* =========================================================
   ADD SERVICE MODAL
========================================================= */

const AddServiceModal = ({
  form,
  error,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#073F42]/40 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-[#EAF2F0] px-4 py-4 sm:px-5">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#08A6A0]">
                SERVICE CONFIGURATION
              </p>

              <h2 className="mt-0.5 text-base font-bold text-[#073F42] sm:text-lg">
                Add New Service
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] hover:bg-[#F5FAF9] hover:text-[#073F42]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}

          <form
            onSubmit={onSubmit}
            className="p-4 sm:p-5"
          >
            {error && (
              <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                label="Service Name"
                required
                value={form.name}
                onChange={(value) =>
                  onChange(
                    "name",
                    value
                  )
                }
                placeholder="e.g. Patient Caretaker"
              />

              <FormField
                label="Service Code"
                required
                value={form.code}
                onChange={(value) =>
                  onChange(
                    "code",
                    value
                  )
                }
                placeholder="e.g. PC-001"
              />

              <FormSelect
                label="Category"
                value={form.category}
                onChange={(value) =>
                  onChange(
                    "category",
                    value
                  )
                }
                options={categoryOptions.filter(
                  (option) =>
                    option !== "All"
                )}
              />

              <FormField
                label="Required Qualification"
                required
                value={
                  form.qualification
                }
                onChange={(value) =>
                  onChange(
                    "qualification",
                    value
                  )
                }
                placeholder="e.g. GNM, ANM, Caregiver Training"
              />

              <FormField
                label="Duration"
                value={form.duration}
                onChange={(value) =>
                  onChange(
                    "duration",
                    value
                  )
                }
                placeholder="e.g. Flexible, Shift Based"
              />

              <FormSelect
                label="Pricing Method"
                value={
                  form.pricingMethod
                }
                onChange={(value) =>
                  onChange(
                    "pricingMethod",
                    value
                  )
                }
                options={pricingOptions}
              />

              <FormField
                label="Price"
                required
                type="number"
                value={form.price}
                onChange={(value) =>
                  onChange(
                    "price",
                    value
                  )
                }
                placeholder="Enter service price"
              />

              {/* Description */}

              <div className="sm:col-span-2">
                <label>
                  <span className="mb-1 block text-[10px] font-bold text-[#708789]">
                    Service Description
                  </span>

                  <textarea
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      onChange(
                        "description",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Describe what this service provides..."
                    className="w-full resize-none rounded-lg border border-[#DCEBE9] bg-white px-3 py-2 text-xs text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </label>
              </div>
            </div>

            {/* Configuration Note */}

            <div className="mt-4 rounded-lg border border-[#D7F4F1] bg-[#E8F8F6] p-3">
              <p className="text-[10px] font-bold text-[#087F7A]">
                Configuration Note
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#31585A]">
                Service pricing will
                later be used
                automatically when
                generating patient
                invoices after service
                completion.
              </p>
            </div>

            {/* Buttons */}

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-lg border border-[#DCEBE9] px-4 text-xs font-semibold text-[#31585A] hover:border-[#08A6A0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#08A6A0] px-4 text-xs font-semibold text-white hover:bg-[#078F8A]"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Service
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
      <span className="mb-1 block text-[10px] font-bold text-[#708789]">
        {label}

        {required && (
          <span className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-[#DCEBE9] bg-white px-3 text-xs text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      />
    </label>
  );
};

/* =========================================================
   FORM SELECT
========================================================= */

const FormSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <label>
      <span className="mb-1 block text-[10px] font-bold text-[#708789]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-9 w-full rounded-lg border border-[#DCEBE9] bg-white px-3 text-xs text-[#173F41] outline-none focus:border-[#08A6A0]"
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
   DETAIL ITEM
========================================================= */

const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-lg border border-[#E2EFED] bg-[#FAFDFC] p-3">
      <Icon className="h-3.5 w-3.5 text-[#08A6A0]" />

      <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wide text-[#9AAEAF]">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-semibold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   SHIELD ICON
========================================================= */

const ShieldIcon = ({ className }) => {
  return (
    <ShieldCheck
      className={
        className || "h-4 w-4"
      }
    />
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  onClear,
}) => {
  return (
    <div className="px-4 py-12 text-center sm:py-14">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6]">
        <Search className="h-5 w-5 text-[#08A6A0]" />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-[#173F41]">
        No services found
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-xs text-[#789092]">
        Try changing your search or
        filter options.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-3 rounded-lg bg-[#08A6A0] px-3 py-2 text-xs font-semibold text-white hover:bg-[#078F8A]"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Services;