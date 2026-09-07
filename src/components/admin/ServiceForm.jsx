import {
  Activity,
  Baby,
  ClipboardPlus,
  Clock3,
  DollarSign,
  HeartHandshake,
  HeartPulse,
  HouseHeart,
  Save,
  Stethoscope,
  Trash2,
  UserRound,
  UserRoundCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const ServiceForm = ({
  form,
  onChange,
  onSubmit,
  onClose,
  formError = "",
  isEditing = false,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange(name, value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* =========================
            Header
        ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#E2EFED] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              {isEditing ? (
                <Save className="h-5 w-5" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-[#073F42] sm:text-lg">
                {isEditing
                  ? "Edit Service"
                  : "Add New Service"}
              </h2>

              <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
                {isEditing
                  ? "Update service information, pricing and availability."
                  : "Create a new hospital care service."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
            aria-label="Close service form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =========================
            Form
        ========================= */}

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            {/* Error */}
            {formError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* =========================
                Basic Information
            ========================= */}

            <div>
              <h3 className="text-sm font-bold text-[#073F42]">
                Basic Information
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Service Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="service-name"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Service Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="service-name"
                    name="name"
                    type="text"
                    value={form.name || ""}
                    onChange={handleChange}
                    placeholder="e.g. Patient Caretaker"
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      placeholder:text-[#A0B1B2]
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="service-category"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Service Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service-category"
                    name="category"
                    value={form.category || ""}
                    onChange={handleChange}
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Patient Care">
                      Patient Care
                    </option>

                    <option value="Baby Care">
                      Baby Care
                    </option>

                    <option value="Mother & Baby Care">
                      Mother & Baby Care
                    </option>

                    <option value="Nursing">
                      Nursing
                    </option>

                    <option value="Critical Care">
                      Critical Care
                    </option>

                    <option value="Elder Care">
                      Elder Care
                    </option>
                  </select>
                </div>

                {/* Icon */}
                <div>
                  <label
                    htmlFor="service-icon"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Service Icon
                  </label>

                  <select
                    id="service-icon"
                    name="icon"
                    value={form.icon || "Stethoscope"}
                    onChange={handleChange}
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  >
                    <option value="Stethoscope">
                      Stethoscope
                    </option>

                    <option value="Activity">
                      Activity
                    </option>

                    <option value="Baby">
                      Baby
                    </option>

                    <option value="HeartHandshake">
                      Heart Handshake
                    </option>

                    <option value="HeartPulse">
                      Heart Pulse
                    </option>

                    <option value="HouseHeart">
                      House Heart
                    </option>

                    <option value="UserRound">
                      User
                    </option>

                    <option value="UserRoundCheck">
                      User Check
                    </option>

                    <option value="ClipboardPlus">
                      Clipboard Plus
                    </option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="service-description"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="service-description"
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the service and the type of care provided..."
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      py-2.5
                      text-sm
                      leading-6
                      text-[#073F42]
                      outline-none
                      transition
                      placeholder:text-[#A0B1B2]
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  />
                </div>
              </div>
            </div>

            {/* =========================
                Pricing & Duration
            ========================= */}

            <div className="mt-7 border-t border-[#EAF2F0] pt-6">
              <h3 className="text-sm font-bold text-[#073F42]">
                Pricing & Duration
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Price */}
                <div>
                  <label
                    htmlFor="service-price"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Price <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

                    <input
                      id="service-price"
                      name="price"
                      type="number"
                      min="0"
                      value={form.price ?? ""}
                      onChange={handleChange}
                      placeholder="900"
                      className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-[#D9E9E7]
                        bg-[#FAFDFC]
                        pl-9
                        pr-3
                        text-sm
                        text-[#073F42]
                        outline-none
                        transition
                        focus:border-[#08A6A0]
                        focus:ring-2
                        focus:ring-[#08A6A0]/10
                      "
                    />
                  </div>
                </div>

                {/* Price Unit */}
                <div>
                  <label
                    htmlFor="service-price-unit"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Price Unit <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service-price-unit"
                    name="priceUnit"
                    value={form.priceUnit || ""}
                    onChange={handleChange}
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  >
                    <option value="">
                      Select unit
                    </option>

                    <option value="per hour">
                      Per Hour
                    </option>

                    <option value="per day">
                      Per Day
                    </option>

                    <option value="per week">
                      Per Week
                    </option>

                    <option value="per month">
                      Per Month
                    </option>

                    <option value="per visit">
                      Per Visit
                    </option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label
                    htmlFor="service-duration"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Duration <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

                    <input
                      id="service-duration"
                      name="duration"
                      type="text"
                      value={form.duration || ""}
                      onChange={handleChange}
                      placeholder="12 Hours"
                      className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-[#D9E9E7]
                        bg-[#FAFDFC]
                        pl-9
                        pr-3
                        text-sm
                        text-[#073F42]
                        outline-none
                        transition
                        placeholder:text-[#A0B1B2]
                        focus:border-[#08A6A0]
                        focus:ring-2
                        focus:ring-[#08A6A0]/10
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* =========================
                Workforce
            ========================= */}

            <div className="mt-7 border-t border-[#EAF2F0] pt-6">
              <h3 className="text-sm font-bold text-[#073F42]">
                Workforce
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Staff Required */}
                <div>
                  <label
                    htmlFor="service-staff-required"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Staff Required <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

                    <input
                      id="service-staff-required"
                      name="staffRequired"
                      type="number"
                      min="1"
                      value={form.staffRequired ?? ""}
                      onChange={handleChange}
                      placeholder="1"
                      className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-[#D9E9E7]
                        bg-[#FAFDFC]
                        pl-9
                        pr-3
                        text-sm
                        text-[#073F42]
                        outline-none
                        transition
                        focus:border-[#08A6A0]
                        focus:ring-2
                        focus:ring-[#08A6A0]/10
                      "
                    />
                  </div>
                </div>

                {/* Available Staff */}
                <div>
                  <label
                    htmlFor="service-available-staff"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Available Staff <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <UserRoundCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />

                    <input
                      id="service-available-staff"
                      name="availableStaff"
                      type="number"
                      min="0"
                      value={form.availableStaff ?? ""}
                      onChange={handleChange}
                      placeholder="5"
                      className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-[#D9E9E7]
                        bg-[#FAFDFC]
                        pl-9
                        pr-3
                        text-sm
                        text-[#073F42]
                        outline-none
                        transition
                        focus:border-[#08A6A0]
                        focus:ring-2
                        focus:ring-[#08A6A0]/10
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* =========================
                Availability & Status
            ========================= */}

            <div className="mt-7 border-t border-[#EAF2F0] pt-6">
              <h3 className="text-sm font-bold text-[#073F42]">
                Availability & Status
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Availability */}
                <div>
                  <label
                    htmlFor="service-availability-form"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Availability <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service-availability-form"
                    name="availability"
                    value={form.availability || ""}
                    onChange={handleChange}
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  >
                    <option value="">
                      Select availability
                    </option>

                    <option value="Available">
                      Available
                    </option>

                    <option value="Limited">
                      Limited
                    </option>

                    <option value="Unavailable">
                      Unavailable
                    </option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="service-status-form"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service-status-form"
                    name="status"
                    value={form.status || ""}
                    onChange={handleChange}
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  >
                    <option value="">
                      Select status
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* =========================
                Performance
            ========================= */}

            <div className="mt-7 border-t border-[#EAF2F0] pt-6">
              <h3 className="text-sm font-bold text-[#073F42]">
                Service Performance
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Bookings */}
                <div>
                  <label
                    htmlFor="service-bookings"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Total Bookings
                  </label>

                  <input
                    id="service-bookings"
                    name="bookings"
                    type="number"
                    min="0"
                    value={form.bookings ?? 0}
                    onChange={handleChange}
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  />
                </div>

                {/* Rating */}
                <div>
                  <label
                    htmlFor="service-rating"
                    className="mb-2 block text-xs font-medium text-[#31585A] sm:text-sm"
                  >
                    Patient Rating
                  </label>

                  <input
                    id="service-rating"
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating ?? 0}
                    onChange={handleChange}
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3
                      text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  />

                  <p className="mt-1.5 text-[11px] text-[#819596]">
                    Rating must be between 0 and 5.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              Footer
          ========================= */}

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E2EFED] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#D9E9E7]
                px-5
                text-sm
                font-semibold
                text-[#31585A]
                transition
                hover:border-[#08A6A0]
                hover:text-[#08A6A0]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#08A6A0]
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#078F8A]
              "
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  Update Service
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
