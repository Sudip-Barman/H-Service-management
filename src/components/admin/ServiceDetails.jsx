import {
  Activity,
  Baby,
  CalendarDays,
  ClipboardPlus,
  Clock3,
  DollarSign,
  HeartHandshake,
  HeartPulse,
  HouseHeart,
  Pencil,
  ShieldCheck,
  Star,
  Stethoscope,
  Trash2,
  UserRound,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";

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

const ServiceDetails = ({
  service,
  onClose,
  onEdit,
  onRemove,
}) => {
  if (!service) return null;

  const ServiceIcon = iconMap[service.icon] || Stethoscope;

  const getAvailabilityStyle = (availability) => {
    switch (availability) {
      case "Available":
        return "bg-[#E8F8F6] text-[#078F8A]";

      case "Limited":
        return "bg-amber-50 text-amber-700";

      case "Unavailable":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#E8F8F6] text-[#078F8A]";

      case "Inactive":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5">
      {/* Card */}
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2EFED] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Service Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <ServiceIcon className="h-5 w-5" />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-[#073F42] sm:text-lg">
                {service.name}
              </h2>

              <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
                Service ID: {service.id}
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
            aria-label="Close service details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Service Overview */}
          <div className="border-b border-[#EAF2F0] px-4 py-5 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category */}
              <span className="rounded-full bg-[#F0F8F7] px-3 py-1 text-xs font-semibold text-[#31585A]">
                {service.category}
              </span>

              {/* Availability */}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getAvailabilityStyle(
                  service.availability
                )}`}
              >
                {service.availability}
              </span>

              {/* Status */}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                  service.status
                )}`}
              >
                {service.status}
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-6 text-[#31585A]">
              {service.description || "No description available for this service."}
            </p>
          </div>

          {/* Pricing */}
          <div className="border-b border-[#EAF2F0] px-4 py-5 sm:px-6">
            <h3 className="text-sm font-bold text-[#073F42]">
              Pricing & Duration
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Price */}
              <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                    <DollarSign className="h-4 w-4" />
                  </div>

                  <span className="text-xs font-medium text-[#819596]">
                    Service Price
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-xl font-bold text-[#073F42]">
                    ₹{Number(service.price || 0).toLocaleString("en-IN")}
                  </span>

                  <span className="ml-1 text-xs text-[#819596]">
                    {service.priceUnit}
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                    <Clock3 className="h-4 w-4" />
                  </div>

                  <span className="text-xs font-medium text-[#819596]">
                    Duration
                  </span>
                </div>

                <p className="mt-3 text-base font-bold text-[#073F42]">
                  {service.duration || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Workforce */}
          <div className="border-b border-[#EAF2F0] px-4 py-5 sm:px-6">
            <h3 className="text-sm font-bold text-[#073F42]">
              Workforce Information
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* Staff Required */}
              <div className="rounded-xl border border-[#E2EFED] bg-white p-4">
                <Users className="h-4 w-4 text-[#08A6A0]" />

                <p className="mt-3 text-lg font-bold text-[#073F42]">
                  {service.staffRequired ?? 0}
                </p>

                <p className="text-xs text-[#819596]">
                  Staff Required
                </p>
              </div>

              {/* Available Staff */}
              <div className="rounded-xl border border-[#E2EFED] bg-white p-4">
                <UserRoundCheck className="h-4 w-4 text-[#08A6A0]" />

                <p className="mt-3 text-lg font-bold text-[#073F42]">
                  {service.availableStaff ?? 0}
                </p>

                <p className="text-xs text-[#819596]">
                  Available Staff
                </p>
              </div>

              {/* Bookings */}
              <div className="rounded-xl border border-[#E2EFED] bg-white p-4">
                <CalendarDays className="h-4 w-4 text-[#08A6A0]" />

                <p className="mt-3 text-lg font-bold text-[#073F42]">
                  {service.bookings ?? 0}
                </p>

                <p className="text-xs text-[#819596]">
                  Total Bookings
                </p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-sm font-bold text-[#073F42]">
              Service Performance
            </h3>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                </div>

                <div>
                  <p className="text-xs text-[#819596]">
                    Customer Rating
                  </p>

                  <p className="mt-0.5 text-lg font-bold text-[#073F42]">
                    {service.rating ?? "N/A"}
                    {service.rating && (
                      <span className="ml-1 text-xs font-medium text-[#819596]">
                        / 5.0
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-xs text-[#819596]">
                  Booking Activity
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#31585A]">
                  {service.bookings ?? 0} bookings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E2EFED] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Delete */}
          <button
            type="button"
            onClick={() => onRemove?.(service)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
            >
              Close
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() => onEdit?.(service)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
            >
              <Pencil className="h-4 w-4" />
              Edit Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
