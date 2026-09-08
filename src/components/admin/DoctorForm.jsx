import { useEffect, useRef, useState } from "react";
import {
  Camera,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";

const emptyDoctor = {
  doctor_id: null,

  registration_number: "",

  first_name: "",
  middle_name: "",
  last_name: "",

  date_of_birth: "",
  gender: "Male",

  phone: "",
  email: "",

  address: "",

  specialization: "",
  department: "",

  qualification: "",
  experience_years: "",

  consultation_fee: "",

  license_number: "",
  license_expiry: "",

  photo: "",

  available_status: "Available",
  status: "Active",
};

const DoctorForm = ({
  open,
  doctor = null,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(emptyDoctor);
  const [photoFile, setPhotoFile] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const isEditing = Boolean(doctor);

  /* -------------------------------------------------------------------------- */
  /* Load Doctor Data                                                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!open) return;

    if (doctor) {
      setForm({
        ...emptyDoctor,
        ...doctor,
      });

      setPhotoFile(null);
    } else {
      setForm({
        ...emptyDoctor,
      });

      setPhotoFile(null);
    }
  }, [open, doctor]);

  /* -------------------------------------------------------------------------- */
  /* Stop Camera When Form Closes                                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!open) {
      stopCamera();
      setCameraOpen(false);
      setCameraError("");
    }
  }, [open]);

  /* -------------------------------------------------------------------------- */
  /* Form Handlers                                                              */
  /* -------------------------------------------------------------------------- */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* Upload Photo                                                               */
  /* -------------------------------------------------------------------------- */

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Doctor photo must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  /* -------------------------------------------------------------------------- */
  /* Open Camera                                                                */
  /* -------------------------------------------------------------------------- */

  const openCamera = async () => {
    setCameraError("");

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError(
        "Camera access is not supported by this browser."
      );

      setCameraOpen(true);
      return;
    }

    try {
      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 1280,
            },
          },
          audio: false,
        });

      streamRef.current = stream;
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current
            .play()
            .catch(() => {});
        }
      }, 50);
    } catch (error) {
      console.error("Camera error:", error);

      setCameraError(
        "Unable to access the camera. Please allow camera permission and try again."
      );

      setCameraOpen(true);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Stop Camera                                                                */
  /* -------------------------------------------------------------------------- */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Close Camera                                                               */
  /* -------------------------------------------------------------------------- */

  const closeCamera = () => {
    stopCamera();
    setCameraOpen(false);
    setCameraError("");
  };

  /* -------------------------------------------------------------------------- */
  /* Capture Camera Photo                                                       */
  /* -------------------------------------------------------------------------- */

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      alert("Camera is not ready yet. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      alert("Unable to capture the photo.");
      return;
    }

    /*
     * Mirror the image because the front camera preview
     * is mirrored for a natural selfie experience.
     */
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

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
          alert("Unable to create the captured photo.");
          return;
        }

        const file = new File(
          [blob],
          `doctor-photo-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        setPhotoFile(file);

        const imageUrl = URL.createObjectURL(blob);

        setForm((current) => ({
          ...current,
          photo: imageUrl,
        }));

        closeCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  /* -------------------------------------------------------------------------- */
  /* Remove Photo                                                               */
  /* -------------------------------------------------------------------------- */

  const removePhoto = () => {
    setPhotoFile(null);

    setForm((current) => ({
      ...current,
      photo: "",
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* Validation                                                                 */
  /* -------------------------------------------------------------------------- */

  const validateForm = () => {
    if (!form.registration_number.trim()) {
      alert("Registration number is required.");
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

    if (!form.specialization.trim()) {
      alert("Specialization is required.");
      return false;
    }

    if (
      form.experience_years !== "" &&
      Number(form.experience_years) < 0
    ) {
      alert("Experience cannot be negative.");
      return false;
    }

    if (
      form.consultation_fee !== "" &&
      Number(form.consultation_fee) < 0
    ) {
      alert("Consultation fee cannot be negative.");
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

    const doctorData = {
      ...form,

      doctor_id: doctor?.doctor_id ?? null,

      experience_years: Number(
        form.experience_years || 0
      ),

      consultation_fee: Number(
        form.consultation_fee || 0
      ),

      photo_file: photoFile,
    };

    onSubmit(doctorData);
  };

  /* -------------------------------------------------------------------------- */
  /* Close                                                                      */
  /* -------------------------------------------------------------------------- */

  const handleClose = () => {
    stopCamera();

    setCameraOpen(false);
    setCameraError("");

    setForm({
      ...emptyDoctor,
    });

    setPhotoFile(null);

    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* ====================================================================== */}
      {/* Main Doctor Form                                                       */}
      {/* ====================================================================== */}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173F41]/40 p-3 backdrop-blur-sm sm:p-5">
        <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* ------------------------------------------------------------------ */}
          {/* Header                                                             */}
          {/* ------------------------------------------------------------------ */}

          <div className="flex shrink-0 items-center justify-between border-b border-[#E2EFED] px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#173F41]">
                {isEditing
                  ? "Edit Doctor"
                  : "Add Doctor"}
              </h2>

              <p className="mt-0.5 text-xs text-[#819596]">
                {isEditing
                  ? "Update doctor information"
                  : "Register a new doctor in the hospital"}
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

          {/* ------------------------------------------------------------------ */}
          {/* Form                                                               */}
          {/* ------------------------------------------------------------------ */}

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="overflow-y-auto px-5 py-5 sm:px-6">

              {/* ============================================================ */}
              {/* Doctor Photo                                                  */}
              {/* ============================================================ */}

              <section className="mb-6">
                <div className="flex flex-col items-center">

                  {/* Photo Preview */}
                  <div className="relative">

                    {form.photo ? (
                      <>
                        <img
                          src={form.photo}
                          alt="Doctor"
                          className="h-28 w-28 rounded-2xl object-cover ring-4 ring-[#E8F8F6]"
                        />

                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#C85A5A] shadow-md ring-1 ring-[#E2EFED] transition hover:bg-[#FFF4F4]"
                          aria-label="Remove photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-[#BFDAD7] bg-[#FAFDFC] text-[#08A6A0]">
                        <Camera className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Photo Buttons */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">

                    {/* Upload Photo */}
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#D9E9E7] px-3 py-2 text-xs font-semibold text-[#08A6A0] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]">
                      <Upload className="h-3.5 w-3.5" />

                      {form.photo
                        ? "Change Photo"
                        : "Upload Photo"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>

                    {/* Take Photo */}
                    <button
                      type="button"
                      onClick={openCamera}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#D9E9E7] px-3 py-2 text-xs font-semibold text-[#08A6A0] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Take Photo
                    </button>
                  </div>

                  <p className="mt-1.5 text-center text-[10px] text-[#819596]">
                    JPG, PNG or WEBP. Maximum 5 MB.
                  </p>
                </div>
              </section>

              {/* ============================================================ */}
              {/* Registration Information                                      */}
              {/* ============================================================ */}

              <section>
                <SectionTitle>
                  Registration Information
                </SectionTitle>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Registration Number"
                    name="registration_number"
                    value={form.registration_number}
                    onChange={handleChange}
                    placeholder="REG-DOC-001"
                    required
                  />

                  <InputField
                    label="License Number"
                    name="license_number"
                    value={form.license_number}
                    onChange={handleChange}
                    placeholder="Medical license number"
                  />
                </div>
              </section>

              {/* ============================================================ */}
              {/* Personal Information                                          */}
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
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="mt-4">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="doctor@hospital.com"
                  />
                </div>

                <div className="mt-4">
                  <TextareaField
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Complete residential address"
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
                    label="Specialization"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Cardiology"
                    required
                  />

                  <InputField
                    label="Department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. Cardiology"
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <InputField
                    label="Qualification"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    placeholder="MBBS, MD, DM..."
                  />

                  <InputField
                    label="Experience (Years)"
                    name="experience_years"
                    type="number"
                    min="0"
                    value={form.experience_years}
                    onChange={handleChange}
                    placeholder="0"
                  />

                  <InputField
                    label="Consultation Fee"
                    name="consultation_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.consultation_fee}
                    onChange={handleChange}
                    placeholder="₹ 0"
                  />
                </div>
              </section>

              {/* ============================================================ */}
              {/* License & Availability                                        */}
              {/* ============================================================ */}

              <section className="mt-6">
                <SectionTitle>
                  License & Availability
                </SectionTitle>

                <div className="grid gap-4 sm:grid-cols-3">
                  <InputField
                    label="License Expiry"
                    name="license_expiry"
                    type="date"
                    value={form.license_expiry}
                    onChange={handleChange}
                  />

                  <SelectField
                    label="Availability Status"
                    name="available_status"
                    value={form.available_status}
                    onChange={handleChange}
                    options={[
                      "Available",
                      "Unavailable",
                      "On Leave",
                    ]}
                  />

                  <SelectField
                    label="Doctor Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                      "Active",
                      "Inactive",
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
                  ? "Update Doctor"
                  : "Add Doctor"}
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

            {/* Camera Header */}
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-[#173F41]">
                  Take Doctor Photo
                </h3>

                <p className="mt-0.5 text-xs text-[#819596]">
                  Position the doctor inside the frame
                </p>
              </div>

              <button
                type="button"
                onClick={closeCamera}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                aria-label="Close camera"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Camera Preview */}
            <div className="relative bg-[#173F41] p-3">
              {cameraError ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                    <Camera className="h-7 w-7" />
                  </div>

                  <p className="mt-4 max-w-sm text-sm font-semibold text-white">
                    Camera Access Failed
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-white/70">
                    {cameraError}
                  </p>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="aspect-square w-full object-cover"
                    style={{
                      transform: "scaleX(-1)",
                    }}
                  />

                  {/* Camera Guide */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-[65%] w-[55%] rounded-[35%] border-2 border-white/70" />
                  </div>
                </div>
              )}
            </div>

            {/* Camera Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-[#E2EFED] bg-[#FAFDFC] px-5 py-4">

              <button
                type="button"
                onClick={closeCamera}
                className="rounded-xl border border-[#D9E9E7] px-4 py-2.5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
              >
                Cancel
              </button>

              {cameraError ? (
                <button
                  type="button"
                  onClick={openCamera}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078E89]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </button>
              ) : (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078E89]"
                >
                  <Camera className="h-4 w-4" />
                  Capture Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
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

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
}) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold text-[#31585A]">
      {label}
    </span>

    <textarea
      name={name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      className="
        w-full
        resize-none
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
);

export default DoctorForm;