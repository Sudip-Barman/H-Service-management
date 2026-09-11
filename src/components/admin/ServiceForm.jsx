import {
  Clock3,
  DollarSign,
  Save,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173F41]/40 p-2.5 sm:p-4 md:p-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] sm:max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
        {/* =========================
            Header
        ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#E2EFED] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              {isEditing ? (
                <Save className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-[#073F42] sm:text-lg">
                {isEditing
                  ? "Edit Service"
                  : "Add New Service"}
              </h2>

              <p className="mt-0.5 text-[11px] text-[#819596] sm:text-xs">
                {isEditing
                  ? "Update service information, pricing and availability."
                  : "Create a new hospital care service."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-2 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
            aria-label="Close service form"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* =========================
            Form
        ========================= */}

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            {/* Error */}
            {formError && (
              <div className="mb-4 sm:mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* =========================
                Basic Information
            ========================= */}

            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#073F42]">
                Basic Information
              </h3>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
                {/* Service Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="service-name"
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
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
                      h-10 sm:h-11
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3 sm:px-3.5
                      text-xs sm:text-sm
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
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
                  >
                    Service Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service-category"
                    name="category"
                    value={form.category || ""}
                    onChange={handleChange}
                    className="
                      h-10 sm:h-11
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3 sm:px-3.5
                      text-xs sm:text-sm
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
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
                  >
                    Service Icon
                  </label>

                  <select
                    id="service-icon"
                    name="icon"
                    value={form.icon || "Stethoscope"}
                    onChange={handleChange}
                    className="
                      h-10 sm:h-11
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3 sm:px-3.5
                      text-xs sm:text-sm
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
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
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
                      px-3 sm:px-3.5
                      py-2 sm:py-2.5
                      text-xs sm:text-sm
                      leading-5 sm:leading-6
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

            <div className="mt-5 sm:mt-7 border-t border-[#EAF2F0] pt-4 sm:pt-6">
              <h3 className="text-xs sm:text-sm font-bold text-[#073F42]">
                Pricing & Duration
              </h3>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-3">
                {/* Price */}
                <div>
                  <label
                    htmlFor="service-price"
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
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
                        h-10 sm:h-11
                        w-full
                        rounded-xl
                        border
                        border-[#D9E9E7]
                        bg-[#FAFDFC]
                        pl-9
                        pr-3 sm:pr-3.5
                        text-xs sm:text-sm
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
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
                  >
                    Price Unit <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service-price-unit"
                    name="priceUnit"
                    value={form.priceUnit || ""}
                    onChange={handleChange}
                    className="
                      h-10 sm:h-11
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3 sm:px-3.5
                      text-xs sm:text-sm
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
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
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
                        h-10 sm:h-11
                        w-full
                        rounded-xl
                        border
                        border-[#D9E9E7]
                        bg-[#FAFDFC]
                        pl-9
                        pr-3 sm:pr-3.5
                        text-xs sm:text-sm
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

            <div className="mt-5 sm:mt-7 border-t border-[#EAF2F0] pt-4 sm:pt-6">
              <h3 className="text-xs sm:text-sm font-bold text-[#073F42]">
                Workforce
              </h3>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
                {/* Staff Required */}
                <div>
                  <label
                    htmlFor="service-staff-required"
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
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
                        h-10 sm:h-11
                        w-full
                        rounded-xl
                        border
                        border-[#D9E9E7]
                        bg-[#FAFDFC]
                        pl-9
                        pr-3 sm:pr-3.5
                        text-xs sm:text-sm
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
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
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
                        h-10 sm:h-11
                        w-full
                        rounded-xl
                        border
                        border-[#D9E9E7]
                        bg-[#FAFDFC]
                        pl-9
                        pr-3 sm:pr-3.5
                        text-xs sm:text-sm
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

            <div className="mt-5 sm:mt-7 border-t border-[#EAF2F0] pt-4 sm:pt-6">
              <h3 className="text-xs sm:text-sm font-bold text-[#073F42]">
                Availability & Status
              </h3>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
                {/* Availability */}
                <div>
                  <label
                    htmlFor="service-availability-form"
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
                  >
                    Availability <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service-availability-form"
                    name="availability"
                    value={form.availability || ""}
                    onChange={handleChange}
                    className="
                      h-10 sm:h-11
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3 sm:px-3.5
                      text-xs sm:text-sm
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
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service-status-form"
                    name="status"
                    value={form.status || ""}
                    onChange={handleChange}
                    className="
                      h-10 sm:h-11
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3 sm:px-3.5
                      text-xs sm:text-sm
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

            <div className="mt-5 sm:mt-7 border-t border-[#EAF2F0] pt-4 sm:pt-6">
              <h3 className="text-xs sm:text-sm font-bold text-[#073F42]">
                Service Performance
              </h3>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
                {/* Bookings */}
                <div>
                  <label
                    htmlFor="service-bookings"
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
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
                      h-10 sm:h-11
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3 sm:px-3.5
                      text-xs sm:text-sm
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
                    className="mb-1.5 block text-xs font-semibold text-[#31585A]"
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
                      h-10 sm:h-11
                      w-full
                      rounded-xl
                      border
                      border-[#D9E9E7]
                      bg-[#FAFDFC]
                      px-3 sm:px-3.5
                      text-xs sm:text-sm
                      text-[#073F42]
                      outline-none
                      transition
                      focus:border-[#08A6A0]
                      focus:ring-2
                      focus:ring-[#08A6A0]/10
                    "
                  />

                  <p className="mt-1 text-[11px] text-[#819596]">
                    Rating must be between 0 and 5.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              Footer
          ========================= */}

          <div className="flex shrink-0 justify-end gap-2 sm:gap-3 border-t border-[#E2EFED] bg-[#FAFDFC] px-4 py-3 sm:px-6 sm:py-4">
            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex
                h-10 sm:h-11
                items-center
                justify-center
                rounded-xl
                border
                border-[#D9E9E7]
                px-4 sm:px-5
                text-xs sm:text-sm
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
                h-10 sm:h-11
                items-center
                justify-center
                gap-1.5 sm:gap-2
                rounded-xl
                bg-[#08A6A0]
                px-4 sm:px-5
                text-xs sm:text-sm
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
