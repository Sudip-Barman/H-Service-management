import { useEffect, useRef, useState } from "react";
import {
  Camera,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";

const emptyNurse = {
  nurse_id: null,

  // Staff information
  staff_id: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",

  // Nurse information
  registration_number: "",
  qualification: "",
  department: "",
  ward: "",
  experience_years: "",
  license_number: "",
  license_expiry: "",
  shift_type: "",
  status: "Active",

  // Photo
  photo: "",
  photo_file: null,
};

const buildNurseFormState = (nurse) => {
  if (!nurse) return emptyNurse;
  return {
    ...emptyNurse,
    ...nurse,
    ...(nurse.staff || {}),
    nurse_id: nurse.nurse_id ?? null,
    staff_id: nurse.staff_id ?? nurse.staff?.staff_id ?? "",
    registration_number: nurse.registration_number ?? "",
    qualification: nurse.qualification ?? "",
    department: nurse.department ?? "",
    ward: nurse.ward ?? "",
    experience_years: nurse.experience_years ?? "",
    license_number: nurse.license_number ?? "",
    license_expiry: nurse.license_expiry ?? "",
    shift_type: nurse.shift_type ?? "",
    status: nurse.status ?? "Active",
    photo: nurse.photo ?? nurse.staff?.photo ?? "",
    photo_file: null,
  };
};

const NurseForm = ({
  open,
  nurse = null,
  onClose,
  onSubmit,
}) => {
  const [prevNurse, setPrevNurse] = useState(nurse);
  const [form, setForm] = useState(() => buildNurseFormState(nurse));
  const [photoPreview, setPhotoPreview] = useState(
    () => nurse?.photo || nurse?.staff?.photo || ""
  );

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const isEditing = Boolean(nurse?.nurse_id);

  if (prevNurse !== nurse) {
    setPrevNurse(nurse);
    const updated = buildNurseFormState(nurse);
    setForm(updated);
    setPhotoPreview(updated.photo || "");
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    setCameraOpen(false);
  };

  /* -------------------------------------------------------------------------- */
  /* Camera Cleanup                                                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Generic Change                                                             */
  /* -------------------------------------------------------------------------- */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* Photo Upload                                                               */
  /* -------------------------------------------------------------------------- */

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Photo size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview(previewUrl);

    setForm((current) => ({
      ...current,
      photo: current.photo || "",
      photo_file: file,
    }));

    event.target.value = "";
  };

  /* -------------------------------------------------------------------------- */
  /* Remove Photo                                                               */
  /* -------------------------------------------------------------------------- */

  const handleRemovePhoto = () => {
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview("");

    setForm((current) => ({
      ...current,
      photo: "",
      photo_file: null,
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* Camera                                                                     */
  /* -------------------------------------------------------------------------- */

  const startCamera = async () => {
    try {
      setCameraError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (error) {
      console.error(error);

      setCameraError(
        "Unable to access camera. Please allow camera permission."
      );
    }
  };


  /* -------------------------------------------------------------------------- */
  /* Capture Photo                                                              */
  /* -------------------------------------------------------------------------- */

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (!video.videoWidth || !video.videoHeight) {
      alert("Camera is not ready yet.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert("Unable to capture photo.");
          return;
        }

        if (photoPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(photoPreview);
        }

        const file = new File(
          [blob],
          `nurse-photo-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        const previewUrl = URL.createObjectURL(blob);

        setPhotoPreview(previewUrl);

        setForm((current) => ({
          ...current,
          photo_file: file,
        }));

        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  /* -------------------------------------------------------------------------- */
  /* Validation                                                                 */
  /* -------------------------------------------------------------------------- */

  const validateForm = () => {
    if (!String(form.staff_id).trim()) {
      alert("Staff ID is required.");
      return false;
    }

    if (!form.first_name.trim()) {
      alert("First name is required.");
      return false;
    }

    if (!form.last_name.trim()) {
      alert("Last name is required.");
      return false;
    }

    if (!form.registration_number.trim()) {
      alert("Registration number is required.");
      return false;
    }

    if (
      form.experience_years !== "" &&
      Number(form.experience_years) < 0
    ) {
      alert("Experience cannot be negative.");
      return false;
    }

    return true;
  };

  /* -------------------------------------------------------------------------- */
  /* Submit                                                                     */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const nurseData = {
      ...form,

      // VERY IMPORTANT:
      // Keep the existing nurse ID during update.
      nurse_id: nurse?.nurse_id ?? form.nurse_id ?? null,

      // Keep the existing staff ID.
      staff_id: Number(
        nurse?.staff_id ??
        form.staff_id
      ),

      experience_years: Number(
        form.experience_years || 0
      ),

      // Existing photo remains untouched unless
      // the user selects/captures a new photo.
      photo:
        form.photo_file
          ? form.photo
          : nurse?.photo ?? form.photo ?? "",

      // Backend uses this for actual file upload.
      photo_file: form.photo_file || null,
    };

    onSubmit(nurseData);
  };

  /* -------------------------------------------------------------------------- */
  /* Close                                                                      */
  /* -------------------------------------------------------------------------- */

  const handleClose = () => {
    stopCamera();

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setForm({
      ...emptyNurse,
    });

    setPhotoPreview("");
    setCameraError("");

    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* ====================================================================== */}
      {/* Main Form Modal                                                        */}
      {/* ====================================================================== */}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173F41]/40 p-3 backdrop-blur-sm sm:p-5">
        <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* ---------------------------------------------------------------- */}
          {/* Header                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex shrink-0 items-center justify-between border-b border-[#E2EFED] px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#173F41]">
                {isEditing
                  ? "Edit Nurse"
                  : "Add Nurse"}
              </h2>

              <p className="mt-0.5 text-xs text-[#819596]">
                {isEditing
                  ? "Update nurse information"
                  : "Register a new nurse in the hospital"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Form                                                             */}
          {/* ---------------------------------------------------------------- */}

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="overflow-y-auto px-5 py-5 sm:px-6">

              {/* ============================================================ */}
              {/* Profile Photo                                                 */}
              {/* ============================================================ */}

              <section>
                <SectionTitle>
                  Nurse Profile Photo
                </SectionTitle>

                <div className="rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                  <div className="flex flex-col items-center gap-5 sm:flex-row">

                    <div className="relative shrink-0">
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#E8F8F6] shadow-md ring-1 ring-[#D9E9E7]">

                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Nurse"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-[#08A6A0]">
                            <Camera className="h-8 w-8" />

                            <span className="mt-1 text-[10px] font-semibold">
                              No Photo
                            </span>
                          </div>
                        )}

                      </div>

                      {photoPreview && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#819596] shadow-md ring-1 ring-[#D9E9E7] transition hover:bg-red-50 hover:text-red-500"
                          title="Remove photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="w-full flex-1">
                      <p className="text-sm font-semibold text-[#173F41]">
                        Nurse Profile Photo
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#819596]">
                        Upload a clear profile photograph or
                        capture one using the camera.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#078E89]">
                          <Upload className="h-4 w-4" />
                          Upload Photo

                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={startCamera}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#D9E9E7] bg-white px-4 py-2.5 text-xs font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
                        >
                          <Camera className="h-4 w-4" />
                          Use Camera
                        </button>

                        {photoPreview && (
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#D9E9E7] bg-white px-4 py-2.5 text-xs font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]">
                            <RotateCcw className="h-4 w-4" />
                            Change Photo

                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        )}

                      </div>

                      <p className="mt-3 text-[11px] text-[#819596]">
                        JPG, JPEG, PNG or WebP • Maximum 5 MB
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ============================================================ */}
              {/* Staff / Personal Information                                 */}
              {/* ============================================================ */}

              <section className="mt-6">
                <SectionTitle>
                  Personal Information
                </SectionTitle>

                <div className="grid gap-4 sm:grid-cols-3">

                  <InputField
                    label="First Name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                  />

                  <InputField
                    label="Middle Name"
                    name="middle_name"
                    value={form.middle_name}
                    onChange={handleChange}
                    placeholder="Middle name"
                  />

                  <InputField
                    label="Last Name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                  />

                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">

                  <InputField
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    value={form.date_of_birth}
                    onChange={handleChange}
                  />

                  <SelectField
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    options={[
                      "Male",
                      "Female",
                      "Other",
                    ]}
                  />

                  <InputField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />

                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nurse@example.com"
                  />

                  <InputField
                    label="Staff ID"
                    name="staff_id"
                    type="number"
                    value={form.staff_id}
                    onChange={handleChange}
                    placeholder="Enter staff ID"
                    required
                  />

                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                      Address
                    </span>

                    <textarea
                      name="address"
                      value={form.address ?? ""}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                      rows={3}
                      className="
                        w-full
                        rounded-xl
                        border border-[#D9E9E7]
                        bg-[#FAFDFC]
                        px-3
                        py-2.5
                        text-sm
                        text-[#173F41]
                        outline-none
                        transition
                        placeholder:text-[#A0B1B2]
                        focus:border-[#08A6A0]
                        focus:ring-2
                        focus:ring-[#08A6A0]/10
                      "
                    />
                  </label>
                </div>
              </section>

              {/* ============================================================ */}
              {/* Registration Information                                      */}
              {/* ============================================================ */}

              <section className="mt-6">
                <SectionTitle>
                  Registration Information
                </SectionTitle>

                <div className="grid gap-4 sm:grid-cols-2">

                  <InputField
                    label="Registration Number"
                    name="registration_number"
                    value={form.registration_number}
                    onChange={handleChange}
                    placeholder="REG-NUR-001"
                    required
                  />

                  <InputField
                    label="Staff ID"
                    name="staff_id"
                    type="number"
                    value={form.staff_id}
                    onChange={handleChange}
                    placeholder="Enter staff ID"
                    required
                  />

                </div>
              </section>

              {/* ============================================================ */}
              {/* Professional Information                                      */}
              {/* ============================================================ */}

              <section className="mt-6">
                <SectionTitle>
                  Professional Information
                </SectionTitle>

                <div className="grid gap-4 sm:grid-cols-2">

                  <InputField
                    label="Qualification"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    placeholder="GNM, B.Sc Nursing, M.Sc Nursing..."
                  />

                  <InputField
                    label="Department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. Emergency, ICU"
                  />

                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <InputField
                    label="Ward"
                    name="ward"
                    value={form.ward}
                    onChange={handleChange}
                    placeholder="e.g. General Ward, ICU"
                  />

                  <InputField
                    label="Experience (Years)"
                    name="experience_years"
                    type="number"
                    min="0"
                    step="1"
                    value={form.experience_years}
                    onChange={handleChange}
                    placeholder="0"
                  />

                </div>
              </section>

              {/* ============================================================ */}
              {/* License Information                                           */}
              {/* ============================================================ */}

              <section className="mt-6">
                <SectionTitle>
                  License Information
                </SectionTitle>

                <div className="grid gap-4 sm:grid-cols-2">

                  <InputField
                    label="License Number"
                    name="license_number"
                    value={form.license_number}
                    onChange={handleChange}
                    placeholder="Nursing license number"
                  />

                  <InputField
                    label="License Expiry"
                    name="license_expiry"
                    type="date"
                    value={form.license_expiry}
                    onChange={handleChange}
                  />

                </div>
              </section>

              {/* ============================================================ */}
              {/* Shift & Status                                                */}
              {/* ============================================================ */}

              <section className="mt-6">
                <SectionTitle>
                  Shift & Status
                </SectionTitle>

                <div className="grid gap-4 sm:grid-cols-2">

                  <SelectField
                    label="Shift Type"
                    name="shift_type"
                    value={form.shift_type}
                    onChange={handleChange}
                    options={[
                      "Morning",
                      "Evening",
                      "Night",
                      "Rotating",
                    ]}
                  />

                  <SelectField
                    label="Nurse Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                      "Active",
                      "Inactive",
                      "On Leave",
                    ]}
                  />

                </div>
              </section>

            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Footer                                                           */}
            {/* ---------------------------------------------------------------- */}

            <div className="flex shrink-0 justify-end gap-3 border-t border-[#E2EFED] bg-[#FAFDFC] px-5 py-4 sm:px-6">

              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-[#D9E9E7] px-5 py-2.5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078E89]"
              >
                {isEditing
                  ? "Update Nurse"
                  : "Add Nurse"}
              </button>

            </div>
          </form>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* Camera Modal                                                           */}
      {/* ====================================================================== */}

      {cameraOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#173F41]/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#E2EFED] px-5 py-4">

              <div>
                <h3 className="text-base font-bold text-[#173F41]">
                  Capture Nurse Photo
                </h3>

                <p className="mt-0.5 text-xs text-[#819596]">
                  Position the face inside the frame
                </p>
              </div>

              <button
                type="button"
                onClick={stopCamera}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            <div className="relative bg-[#173F41] p-4">

              <div className="relative mx-auto aspect-[3/4] max-h-[55vh] overflow-hidden rounded-2xl">

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-[65%] w-[55%] rounded-[50%] border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.18)]" />
                </div>

              </div>

              {cameraError && (
                <p className="mt-3 text-center text-xs text-red-300">
                  {cameraError}
                </p>
              )}

            </div>

            <div className="flex justify-center gap-3 border-t border-[#E2EFED] bg-[#FAFDFC] px-5 py-4">

              <button
                type="button"
                onClick={stopCamera}
                className="rounded-xl border border-[#D9E9E7] px-5 py-2.5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078E89]"
              >
                <Camera className="h-4 w-4" />
                Capture Photo
              </button>

            </div>

          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </>
  );
};

/* ========================================================================== */
/* Reusable Components                                                        */
/* ========================================================================== */

const SectionTitle = ({ children }) => (
  <h3 className="mb-3 text-sm font-bold text-[#173F41]">
    {children}
  </h3>
);

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
  step,
}) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold text-[#31585A]">
      {label}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </span>

    <input
      name={name}
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      step={step}
      className="
        h-10 w-full
        rounded-xl
        border border-[#D9E9E7]
        bg-[#FAFDFC]
        px-3
        text-sm
        text-[#173F41]
        outline-none
        transition
        placeholder:text-[#A0B1B2]
        focus:border-[#08A6A0]
        focus:ring-2
        focus:ring-[#08A6A0]/10
      "
    />
  </label>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold text-[#31585A]">
      {label}
    </span>

    <select
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className="
        h-10 w-full
        rounded-xl
        border border-[#D9E9E7]
        bg-[#FAFDFC]
        px-3
        text-sm
        text-[#173F41]
        outline-none
        transition
        focus:border-[#08A6A0]
        focus:ring-2
        focus:ring-[#08A6A0]/10
      "
    >
      <option value="">
        Select {label}
      </option>

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

export default NurseForm;