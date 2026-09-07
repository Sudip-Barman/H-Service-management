import { useMemo, useState } from "react";
import {
  Activity,
  Baby,
  ClipboardPlus,
  HeartHandshake,
  HeartPulse,
  HouseHeart,
  Plus,
  Search,
  Stethoscope,
  UserRound,
  UserRoundCheck,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ServiceDetails from "../../../components/admin/ServiceDetails";
import ServiceForm from "../../../components/admin/ServiceForm";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

import {
  serviceData,
  serviceCategoryOptions,
  serviceAvailabilityOptions,
  serviceStatusOptions,
} from "../../../data";

/* =========================
   Empty Service Form
========================= */

const emptyServiceForm = {
  name: "",
  category: "Patient Care",
  description: "",
  icon: "Stethoscope",
  price: "",
  priceUnit: "per day",
  duration: "12 Hours",
  staffRequired: 1,
  availableStaff: 0,
  status: "Active",
  availability: "Available",
  bookings: 0,
  rating: 0,
};

const Services = () => {
  const [services, setServices] = useState(serviceData);

  /* =========================
     Search & Filters
  ========================= */

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);

  /* =========================
     Service Details
  ========================= */

  const [selectedService, setSelectedService] =
    useState(null);

  /* =========================
     Service Form
  ========================= */

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyServiceForm);
  const [formError, setFormError] = useState("");
  const [editingService, setEditingService] =
    useState(null);

  /* =========================
     Remove Confirmation
  ========================= */

  const [serviceToRemove, setServiceToRemove] =
    useState(null);

  /* =========================
     Statistics
  ========================= */

  const stats = useMemo(() => {
    return {
      total: services.length,

      active: services.filter(
        (service) => service.status === "Active"
      ).length,

      available: services.filter(
        (service) => service.availability === "Available"
      ).length,

      limited: services.filter(
        (service) => service.availability === "Limited"
      ).length,

      bookings: services.reduce(
        (total, service) =>
          total + Number(service.bookings || 0),
        0
      ),
    };
  }, [services]);

  /* =========================
     Filtering
  ========================= */

  const filteredServices = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !searchValue ||
        service.name.toLowerCase().includes(searchValue) ||
        service.id.toLowerCase().includes(searchValue) ||
        service.category.toLowerCase().includes(searchValue) ||
        service.description.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        service.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        service.availability === availabilityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        service.status === statusFilter;

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

  /* =========================
     Clear Filters
  ========================= */

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setAvailabilityFilter("All");
    setStatusFilter("All");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "All" ||
    availabilityFilter !== "All" ||
    statusFilter !== "All";

  /* =========================
     Generate Service ID
  ========================= */

  const generateServiceId = () => {
    const highestNumber = services.reduce(
      (maxNumber, service) => {
        const match = service.id?.match(/^SRV-(\d+)$/);

        if (!match) return maxNumber;

        return Math.max(
          maxNumber,
          Number(match[1])
        );
      },
      1000
    );

    return `SRV-${String(highestNumber + 1).padStart(
      4,
      "0"
    )}`;
  };

  /* =========================
     Form Helpers
  ========================= */

  const updateForm = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  /* =========================
     Open Add Form
  ========================= */

  const handleAddService = () => {
    setEditingService(null);
    setForm({ ...emptyServiceForm });
    setFormError("");

    setSelectedService(null);
    setShowForm(true);
  };

  /* =========================
     Open Edit Form
  ========================= */

  const handleEditService = (service) => {
    setEditingService(service);

    setForm({
      ...emptyServiceForm,
      ...service,
    });

    setFormError("");

    setSelectedService(null);
    setShowForm(true);
  };

  /* =========================
     Close Form
  ========================= */

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
    setForm({ ...emptyServiceForm });
    setFormError("");
  };

  /* =========================
     Validate Form
  ========================= */

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Please enter a service name.";
    }

    if (!form.category) {
      return "Please select a service category.";
    }

    if (!form.description.trim()) {
      return "Please enter a service description.";
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      return "Please enter a valid service price.";
    }

    if (!form.priceUnit) {
      return "Please select a price unit.";
    }

    if (!form.duration.trim()) {
      return "Please enter the service duration.";
    }

    if (
      form.staffRequired === "" ||
      Number(form.staffRequired) < 1
    ) {
      return "Staff required must be at least 1.";
    }

    if (
      form.availableStaff === "" ||
      Number(form.availableStaff) < 0
    ) {
      return "Available staff cannot be negative.";
    }

    if (!form.availability) {
      return "Please select service availability.";
    }

    if (!form.status) {
      return "Please select service status.";
    }

    if (
      form.rating !== "" &&
      (Number(form.rating) < 0 ||
        Number(form.rating) > 5)
    ) {
      return "Patient rating must be between 0 and 5.";
    }

    return "";
  };

  /* =========================
     Add / Update Service
  ========================= */

  const handleSubmitService = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const serviceDataToSave = {
      ...form,

      name: form.name.trim(),
      description: form.description.trim(),
      duration: form.duration.trim(),

      price: Number(form.price),
      staffRequired: Number(form.staffRequired),
      availableStaff: Number(form.availableStaff),
      bookings: Number(form.bookings || 0),
      rating: Number(form.rating || 0),
    };

    /* =========================
       UPDATE EXISTING SERVICE
    ========================= */

    if (editingService) {
      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                ...serviceDataToSave,
                id: editingService.id,
              }
            : service
        )
      );

      handleCloseForm();
      return;
    }

    /* =========================
       ADD NEW SERVICE
    ========================= */

    const newService = {
      ...serviceDataToSave,
      id: generateServiceId(),
    };

    setServices((currentServices) => [
      ...currentServices,
      newService,
    ]);

    handleCloseForm();
  };

  /* =========================
     View Details
  ========================= */

  const handleViewDetails = (service) => {
    setSelectedService(service);
  };

  const handleCloseDetails = () => {
    setSelectedService(null);
  };

  /* =========================
     Remove Service
  ========================= */

  const handleRemoveService = (service) => {
    setServiceToRemove(service);
  };

  /* =========================
     Confirm Remove
  ========================= */

  const handleConfirmRemove = () => {
    if (!serviceToRemove) return;

    const removedServiceId = serviceToRemove.id;

    setServices((currentServices) =>
      currentServices.filter(
        (service) => service.id !== removedServiceId
      )
    );

    if (
      selectedService?.id === removedServiceId
    ) {
      setSelectedService(null);
    }

    setServiceToRemove(null);
  };

  /* =========================
     Cancel Remove
  ========================= */

  const handleCancelRemove = () => {
    setServiceToRemove(null);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* =========================
          Page Header
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#073F42] sm:text-2xl">
            Services
          </h1>

          <p className="mt-1 text-xs text-[#819596] sm:text-sm">
            Manage hospital care services, pricing, availability
            and service status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddService}
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#08A6A0]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#078F8A]

            sm:w-auto
          "
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* =========================
          Statistics
      ========================= */}

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-5">
        <StatCard
          icon={Stethoscope}
          label="Total Services"
          value={stats.total}
        />

        <StatCard
          icon={Activity}
          label="Active Services"
          value={stats.active}
        />

        <StatCard
          icon={UserRoundCheck}
          label="Available"
          value={stats.available}
        />

        <StatCard
          icon={Search}
          label="Limited"
          value={stats.limited}
        />

        <StatCard
          icon={ClipboardPlus}
          label="Total Bookings"
          value={stats.bookings}
        />
      </div>

      {/* =========================
          Search & Filters

          Existing SearchFilter
          is reused unchanged.
      ========================= */}

      <SearchFilter
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        placeholder="Search service by name, ID or category..."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Service Category */}
          <div>
            <label
              htmlFor="service-category"
              className="
                mb-2
                block
                text-xs
                font-medium
                text-[#31585A]
                sm:text-sm
              "
            >
              Service Category
            </label>

            <select
              id="service-category"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="
                h-9
                w-full
                rounded-lg
                border
                border-[#D9E9E7]
                bg-[#FAFDFC]
                px-3
                text-xs
                text-[#073F42]
                outline-none
                transition
                focus:border-[#08A6A0]
                focus:ring-2
                focus:ring-[#08A6A0]/10
                sm:h-11
                sm:rounded-xl
                sm:text-sm
              "
            >
              {serviceCategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label
              htmlFor="service-availability"
              className="
                mb-2
                block
                text-xs
                font-medium
                text-[#31585A]
                sm:text-sm
              "
            >
              Availability
            </label>

            <select
              id="service-availability"
              value={availabilityFilter}
              onChange={(event) =>
                setAvailabilityFilter(event.target.value)
              }
              className="
                h-9
                w-full
                rounded-lg
                border
                border-[#D9E9E7]
                bg-[#FAFDFC]
                px-3
                text-xs
                text-[#073F42]
                outline-none
                transition
                focus:border-[#08A6A0]
                focus:ring-2
                focus:ring-[#08A6A0]/10
                sm:h-11
                sm:rounded-xl
                sm:text-sm
              "
            >
              {serviceAvailabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="service-status"
              className="
                mb-2
                block
                text-xs
                font-medium
                text-[#31585A]
                sm:text-sm
              "
            >
              Status
            </label>

            <select
              id="service-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="
                h-9
                w-full
                rounded-lg
                border
                border-[#D9E9E7]
                bg-[#FAFDFC]
                px-3
                text-xs
                text-[#073F42]
                outline-none
                transition
                focus:border-[#08A6A0]
                focus:ring-2
                focus:ring-[#08A6A0]/10
                sm:h-11
                sm:rounded-xl
                sm:text-sm
              "
            >
              {serviceStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    text-xs
                    font-medium
                    text-[#08A6A0]
                    transition
                    hover:text-[#078F8A]
                    sm:text-sm
                  "
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </SearchFilter>

      {/* =========================
          Result Summary
      ========================= */}

      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#073F42] sm:text-lg">
            Hospital Services
          </h2>

          <p className="text-xs text-[#819596] sm:text-sm">
            Showing {filteredServices.length} of{" "}
            {services.length} services
          </p>
        </div>
      </div>

      {/* =========================
          Services
      ========================= */}

      {filteredServices.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewDetails={handleViewDetails}
              onEdit={handleEditService}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#D9E9E7] bg-white px-6 py-12 text-center sm:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
            <Search size={24} />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-[#073F42]">
            No services found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#819596]">
            No services match your current search or filter
            criteria. Try changing the filters or search term.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="
                mt-5
                rounded-xl
                bg-[#08A6A0]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#078F8A]
              "
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* =========================
          Service Details
      ========================= */}

      {selectedService && (
        <ServiceDetails
          service={selectedService}
          onClose={handleCloseDetails}
          onEdit={handleEditService}
          onRemove={handleRemoveService}
        />
      )}

      {/* =========================
          Add / Edit Service Form
      ========================= */}

      {showForm && (
        <ServiceForm
          form={form}
          onChange={updateForm}
          onSubmit={handleSubmitService}
          onClose={handleCloseForm}
          formError={formError}
          isEditing={Boolean(editingService)}
        />
      )}

      {/* =========================
          Remove Confirmation
      ========================= */}

      <ConfirmDialog
        open={Boolean(serviceToRemove)}
        title="Remove Service"
        message={
          serviceToRemove
            ? `Are you sure you want to remove "${serviceToRemove.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Remove Service"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
};

/* =========================
   Service Icon Map
========================= */

const iconMap = {
  Activity,
  Baby,
  ClipboardPlus,
  HeartHandshake,
  HeartPulse,
  HouseHeart,
  Stethoscope,
  UserRound,
  UserRoundCheck,
};

/* =========================
   Service Card
========================= */

const ServiceCard = ({
  service,
  onViewDetails,
  onEdit,
}) => {
  const ServiceIcon =
    iconMap[service.icon] || Stethoscope;

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-[#E2EFED]
        bg-white
        p-4
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
        sm:p-5
      "
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#E8F8F6]
              text-[#08A6A0]
              sm:h-12
              sm:w-12
            "
          >
            <ServiceIcon size={22} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[#073F42] sm:text-base">
              {service.name}
            </h3>

            <p className="text-[11px] text-[#819596] sm:text-xs">
              {service.id}
            </p>
          </div>
        </div>

        <span
          className={`
            shrink-0
            rounded-full
            px-2
            py-1
            text-[10px]
            font-medium
            sm:px-2.5
            sm:text-xs
            ${
              service.status === "Active"
                ? "bg-[#E8F8F6] text-[#078F8A]"
                : "bg-gray-100 text-gray-500"
            }
          `}
        >
          {service.status}
        </span>
      </div>

      {/* Category */}
      <div className="mt-4">
        <span className="inline-flex rounded-lg bg-[#FAFDFC] px-2.5 py-1 text-xs font-medium text-[#31585A] ring-1 ring-[#E2EFED]">
          {service.category}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 min-h-[66px] text-xs leading-5 text-[#31585A] sm:text-sm sm:leading-6">
        {service.description}
      </p>

      {/* Service Information */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Price */}
        <div className="rounded-xl bg-[#FAFDFC] p-3">
          <p className="text-[11px] text-[#819596] sm:text-xs">
            Service Charge
          </p>

          <p className="mt-1 text-sm font-semibold text-[#073F42] sm:text-base">
            ₹{Number(service.price || 0).toLocaleString("en-IN")}
          </p>

          <p className="text-[11px] text-[#819596] sm:text-xs">
            {service.priceUnit}
          </p>
        </div>

        {/* Duration */}
        <div className="rounded-xl bg-[#FAFDFC] p-3">
          <p className="text-[11px] text-[#819596] sm:text-xs">
            Duration
          </p>

          <p className="mt-1 text-sm font-semibold text-[#073F42] sm:text-base">
            {service.duration}
          </p>
        </div>

        {/* Available Staff */}
        <div className="rounded-xl bg-[#FAFDFC] p-3">
          <p className="text-[11px] text-[#819596] sm:text-xs">
            Available Staff
          </p>

          <p className="mt-1 text-sm font-semibold text-[#073F42] sm:text-base">
            {service.availableStaff}
          </p>
        </div>

        {/* Bookings */}
        <div className="rounded-xl bg-[#FAFDFC] p-3">
          <p className="text-[11px] text-[#819596] sm:text-xs">
            Bookings
          </p>

          <p className="mt-1 text-sm font-semibold text-[#073F42] sm:text-base">
            {service.bookings}
          </p>
        </div>
      </div>

      {/* Availability */}
      <div className="mt-4 flex items-center justify-between border-t border-[#E2EFED] pt-4">
        <span className="text-xs text-[#819596] sm:text-sm">
          Availability
        </span>

        <span
          className={`
            rounded-full
            px-2.5
            py-1
            text-[10px]
            font-medium
            sm:text-xs
            ${
              service.availability === "Available"
                ? "bg-[#E8F8F6] text-[#078F8A]"
                : service.availability === "Limited"
                ? "bg-amber-50 text-amber-600"
                : "bg-red-50 text-red-500"
            }
          `}
        >
          {service.availability}
        </span>
      </div>

      {/* Rating */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[#819596] sm:text-sm">
          Patient Rating
        </span>

        <span className="text-xs font-semibold text-[#073F42] sm:text-sm">
          ★ {service.rating}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onViewDetails?.(service)}
          className="
            flex-1
            rounded-xl
            border
            border-[#D9E9E7]
            px-3
            py-2.5
            text-xs
            font-medium
            text-[#31585A]
            transition
            hover:border-[#08A6A0]
            hover:text-[#08A6A0]
            sm:text-sm
          "
        >
          View Details
        </button>

        <button
          type="button"
          onClick={() => onEdit?.(service)}
          className="
            flex-1
            rounded-xl
            bg-[#08A6A0]
            px-3
            py-2.5
            text-xs
            font-medium
            text-white
            transition
            hover:bg-[#078F8A]
            sm:text-sm
          "
        >
          Edit Service
        </button>
      </div>
    </div>
  );
};

export default Services;
