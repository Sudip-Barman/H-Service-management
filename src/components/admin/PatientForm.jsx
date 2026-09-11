import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  FileText,
  ImagePlus,
  Upload,
  UserRound,
  X,
  Trash2,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Patient Services
// -----------------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { id: "patient-caretaker", name: "Patient Caretaker" },
  { id: "baby-caretaker", name: "Baby Caretaker" },
  { id: "japa-service", name: "Japa Service" },
  { id: "nurse", name: "Nurse" },
  { id: "baby-sitter", name: "Baby Sitter" },
  { id: "male-attendant", name: "Male Attendant" },
  { id: "elder-care", name: "Elder Care" },
  { id: "gnm-nurse", name: "GNM Nurse" },
  { id: "anm-nurse", name: "ANM Nurse" },
  { id: "bsc-nurse", name: "B.Sc Nurse" },
  { id: "icu-nurse", name: "ICU Nurse" },
];

// -----------------------------------------------------------------------------
// Empty Form
// -----------------------------------------------------------------------------

const EMPTY_FORM = {
  registrationNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",

  dateOfBirth: "",
  age: "",

  gender: "",
  bloodGroup: "",

  phone: "",
  email: "",

  address: "",
  city: "",
  state: "",
  postalCode: "",

  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",

  identificationType: "",
  identificationDocument: null,
  identificationDocumentName: "",

  occupation: "",
  maritalStatus: "",
  nationality: "",

  photo: "",

  registrationDate: "",
  status: "Active",

  // Patient problem / disease / reason for registration
  patientProblem: "",
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function PatientForm({
  patient = null,
  onSubmit,
  onClose,
  open = true,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [selectedServices, setSelectedServices] = useState([]);

  // Patient photo
  const [photoPreview, setPhotoPreview] = useState("");

  // Camera
  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Photo file input
  const photoInputRef = useRef(null);

  // Identification document
  const documentInputRef = useRef(null);

  const isEdit = Boolean(patient);

  // ---------------------------------------------------------------------------
  // Load Patient
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!patient) {
      setForm({
        ...EMPTY_FORM,
        registrationDate: new Date().toISOString().split("T")[0],
      });

      setSelectedServices([]);
      setPhotoPreview("");

      return;
    }

    const patientServices =
      patient.services ||
      patient.serviceIds ||
      patient.patientServices ||
      [];

    const serviceIds = Array.isArray(patientServices)
      ? patientServices.map((service) =>
          typeof service === "string" ? service : service.id
        )
      : [];

    const existingPhoto = patient.photo || patient.photoUrl || "";

    setForm({
      registrationNumber: patient.registrationNumber || "",

      firstName: patient.firstName || "",
      middleName: patient.middleName || "",
      lastName: patient.lastName || "",

      dateOfBirth: patient.dateOfBirth || "",
      age: patient.age ?? "",

      gender: patient.gender || "",
      bloodGroup: patient.bloodGroup || "",

      phone: patient.phone || "",
      email: patient.email || "",

      address: patient.address || "",
      city: patient.city || "",
      state: patient.state || "",
      postalCode: patient.postalCode || "",

      emergencyContactName: patient.emergencyContactName || "",
      emergencyContactPhone: patient.emergencyContactPhone || "",
      emergencyContactRelation: patient.emergencyContactRelation || "",

      identificationType: patient.identificationType || "",

      identificationDocument: null,
      identificationDocumentName:
        patient.identificationDocumentName ||
        patient.identificationDocument ||
        "",

      occupation: patient.occupation || "",
      maritalStatus: patient.maritalStatus || "",
      nationality: patient.nationality || "",

      photo: existingPhoto,

      registrationDate:
        patient.registrationDate ||
        new Date().toISOString().split("T")[0],

      status: patient.status || "Active",

      patientProblem:
        patient.patientProblem ||
        patient.problem ||
        patient.disease ||
        patient.reasonForRegistration ||
        "",
    });

    setSelectedServices(serviceIds);
    setPhotoPreview(existingPhoto);
  }, [patient]);

  // ---------------------------------------------------------------------------
  // Cleanup Camera
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Form Change
  // ---------------------------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------------------------
  // Patient Photo Upload
  // ---------------------------------------------------------------------------

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Photo size must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      setPhotoPreview(result);

      setForm((prev) => ({
        ...prev,
        photo: result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ---------------------------------------------------------------------------
  // Remove Patient Photo
  // ---------------------------------------------------------------------------

  const handleRemovePhoto = () => {
    setPhotoPreview("");

    setForm((prev) => ({
      ...prev,
      photo: "",
    }));

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  // ---------------------------------------------------------------------------
  // Camera
  // ---------------------------------------------------------------------------

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera access is not supported by this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
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
      console.error("Camera error:", error);

      alert(
        "Unable to access the camera. Please allow camera permission and try again."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Capture Photo
  // ---------------------------------------------------------------------------

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.drawImage(video, 0, 0, width, height);

    const imageData = canvas.toDataURL("image/jpeg", 0.85);

    setPhotoPreview(imageData);

    setForm((prev) => ({
      ...prev,
      photo: imageData,
    }));

    stopCamera();
  };

  // ---------------------------------------------------------------------------
  // Identification Document Upload
  // ---------------------------------------------------------------------------

  const handleDocumentSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, JPG, JPEG, or PNG file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Identification document must be less than 10 MB.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      identificationDocument: file,
      identificationDocumentName: file.name,
    }));
  };

  // ---------------------------------------------------------------------------
  // Remove Identification Document
  // ---------------------------------------------------------------------------

  const handleRemoveDocument = () => {
    setForm((prev) => ({
      ...prev,
      identificationDocument: null,
      identificationDocumentName: "",
    }));

    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  // ---------------------------------------------------------------------------
  // Service Selection
  // ---------------------------------------------------------------------------

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedProblem = form.patientProblem.trim();

    if (!trimmedProblem) {
      alert(
        "Please enter the patient's problem, disease, symptoms, or reason for registration."
      );
      return;
    }

    const selectedServiceObjects = SERVICE_OPTIONS.filter((service) =>
      selectedServices.includes(service.id)
    );

    const fullName = [
      form.firstName,
      form.middleName,
      form.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const patientData = {
      ...form,

      age: form.age === "" ? null : Number(form.age),

      fullName,
      name: fullName,

      patientProblem: trimmedProblem,

      // Useful alias for backend compatibility
      reasonForRegistration: trimmedProblem,

      services: selectedServiceObjects,

      serviceIds: selectedServices,

      // File object can be sent through FormData by the backend layer
      identificationDocument: form.identificationDocument,

      identificationDocumentName:
        form.identificationDocumentName || "",

      onSubmit: undefined,
    };

    delete patientData.onSubmit;

    onSubmit?.(patientData);
  };

  // ---------------------------------------------------------------------------
  // If Closed
  // ---------------------------------------------------------------------------

  if (!open) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2.5 sm:p-4 md:p-6 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
        {/* ---------------------------------------------------------------- */}
        {/* Header */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#E2EFED] px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#173F41]">
              {isEdit ? "Edit Patient" : "Register New Patient"}
            </h2>

            <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
              {isEdit
                ? "Update patient information and services"
                : "Enter patient information for registration"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#078E89]"
          >
            <X size={18} />
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Form */}
        {/* ---------------------------------------------------------------- */}

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-6 p-6">
            {/* ============================================================ */}
            {/* Patient Photo */}
            {/* ============================================================ */}

            <section>
              <SectionTitle
                icon={<UserRound size={18} />}
                title="Patient Photo"
              />

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E2EFED] bg-[#FAFDFC]">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Patient preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound
                      size={48}
                      strokeWidth={1.4}
                      className="text-[#B0C2C2]"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E2EFED] bg-white px-4 py-2 text-sm font-medium text-[#31585A] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#078E89]"
                    >
                      <ImagePlus size={17} />
                      Choose Photo
                    </button>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#08A6A0] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#078E89]"
                    >
                      <Camera size={17} />
                      Take Photo
                    </button>

                    {photoPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#819596]">
                    Upload an image or take a photo using the device camera.
                    Maximum size: 5 MB.
                  </p>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* Patient Information */}
            {/* ============================================================ */}

            <section>
              <SectionTitle
                icon={<UserRound size={18} />}
                title="Patient Information"
              />

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <InputField
                  label="Registration Number"
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number"
                  required
                />

                <InputField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />

                <InputField
                  label="Middle Name"
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                  placeholder="Enter middle name"
                />

                <InputField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />

                <InputField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />

                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  min="0"
                  max="150"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                />

                <SelectField
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />

                <SelectField
                  label="Blood Group"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  options={[
                    { value: "A+", label: "A+" },
                    { value: "A-", label: "A-" },
                    { value: "B+", label: "B+" },
                    { value: "B-", label: "B-" },
                    { value: "AB+", label: "AB+" },
                    { value: "AB-", label: "AB-" },
                    { value: "O+", label: "O+" },
                    { value: "O-", label: "O-" },
                  ]}
                />

                <SelectField
                  label="Marital Status"
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                  options={[
                    { value: "Single", label: "Single" },
                    { value: "Married", label: "Married" },
                    { value: "Divorced", label: "Divorced" },
                    { value: "Widowed", label: "Widowed" },
                    { value: "Separated", label: "Separated" },
                  ]}
                />

                <InputField
                  label="Occupation"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  placeholder="Enter occupation"
                />

                <InputField
                  label="Nationality"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  placeholder="Enter nationality"
                />
              </div>
            </section>

            {/* ============================================================ */}
            {/* Patient Problem / Disease */}
            {/* ============================================================ */}

            <section>
              <SectionTitle
                icon={<FileText size={18} />}
                title="Patient Problem / Disease"
              />

              <div className="mt-4">
                <TextAreaField
                  label="Problem / Disease / Reason for Registration"
                  name="patientProblem"
                  value={form.patientProblem}
                  onChange={handleChange}
                  placeholder="Enter the patient's disease, symptoms, injury, treatment requirement, health problem, or reason for registration..."
                  required
                  rows={4}
                />

                <p className="mt-2 text-xs text-[#819596]">
                  Record why the patient is being registered. This can include
                  a known disease, symptoms, injury, treatment requirement, or
                  other health-related reason.
                </p>
              </div>
            </section>

            {/* ============================================================ */}
            {/* Contact Information */}
            {/* ============================================================ */}

            <section>
              <SectionTitle
                icon={<UserRound size={18} />}
                title="Contact Information"
              />

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />

                <div className="md:col-span-2">
                  <TextAreaField
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </div>

                <InputField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />

                <InputField
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />

                <InputField
                  label="Postal Code"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                />
              </div>
            </section>

            {/* ============================================================ */}
            {/* Emergency Contact */}
            {/* ============================================================ */}

            <section>
              <SectionTitle
                icon={<UserRound size={18} />}
                title="Emergency Contact"
              />

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <InputField
                  label="Contact Name"
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Enter contact name"
                />

                <InputField
                  label="Contact Phone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="Enter contact phone"
                />

                <InputField
                  label="Relation"
                  name="emergencyContactRelation"
                  value={form.emergencyContactRelation}
                  onChange={handleChange}
                  placeholder="e.g. Father, Mother, Spouse"
                />
              </div>
            </section>

            {/* ============================================================ */}
            {/* Identification */}
            {/* ============================================================ */}

            <section>
              <SectionTitle
                icon={<FileText size={18} />}
                title="Identification"
              />

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField
                  label="Identification Type"
                  name="identificationType"
                  value={form.identificationType}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Aadhaar Card",
                      label: "Aadhaar Card",
                    },
                    {
                      value: "PAN Card",
                      label: "PAN Card",
                    },
                    {
                      value: "Voter ID",
                      label: "Voter ID",
                    },
                    {
                      value: "Passport",
                      label: "Passport",
                    },
                    {
                      value: "Driving License",
                      label: "Driving License",
                    },
                    {
                      value: "Other",
                      label: "Other",
                    },
                  ]}
                />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#31585A]">
                    Identification Document
                  </label>

                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={handleDocumentSelect}
                    className="hidden"
                  />

                  <div className="flex min-h-[42px] items-center gap-2 rounded-lg border border-[#E2EFED] bg-[#FAFDFC] p-1">
                    <button
                      type="button"
                      onClick={() =>
                        documentInputRef.current?.click()
                      }
                      className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#08A6A0] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#078E89]"
                    >
                      <Upload size={16} />
                      Upload
                    </button>

                    <div className="min-w-0 flex-1 px-2">
                      {form.identificationDocumentName ? (
                        <div className="flex items-center gap-2">
                          <FileText
                            size={16}
                            className="shrink-0 text-[#08A6A0]"
                          />

                          <span
                            className="truncate text-sm text-[#31585A]"
                            title={form.identificationDocumentName}
                          >
                            {form.identificationDocumentName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#819596]">
                          No document selected
                        </span>
                      )}
                    </div>

                    {form.identificationDocumentName && (
                      <button
                        type="button"
                        onClick={handleRemoveDocument}
                        className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
                        title="Remove document"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <p className="mt-1.5 text-xs text-[#819596]">
                    Accepted: PDF, JPG, JPEG, PNG. Maximum size: 10 MB.
                  </p>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* Registration */}
            {/* ============================================================ */}

            <section>
              <SectionTitle
                icon={<Check size={18} />}
                title="Registration"
              />

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Registration Date"
                  name="registrationDate"
                  type="date"
                  value={form.registrationDate}
                  onChange={handleChange}
                />

                <SelectField
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Active",
                      label: "Active",
                    },
                    {
                      value: "Inactive",
                      label: "Inactive",
                    },
                    {
                      value: "Deceased",
                      label: "Deceased",
                    },
                  ]}
                />
              </div>
            </section>

            {/* ============================================================ */}
            {/* Patient Services */}
            {/* ============================================================ */}

            <section>
              <SectionTitle
                icon={<Check size={18} />}
                title="Patient Services"
              />

              <p className="mt-1 text-sm text-[#819596]">
                Select the services required by this patient.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICE_OPTIONS.map((service) => {
                  const selected = selectedServices.includes(service.id);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-[#08A6A0] bg-[#E8F8F6]"
                          : "border-[#E2EFED] bg-white hover:border-[#08A6A0] hover:bg-[#FAFDFC]"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? "border-[#08A6A0] bg-[#08A6A0] text-white"
                            : "border-[#B7C8C8] bg-white"
                        }`}
                      >
                        {selected && <Check size={13} />}
                      </span>

                      <span
                        className={`text-sm font-medium ${
                          selected
                            ? "text-[#078E89]"
                            : "text-[#31585A]"
                        }`}
                      >
                        {service.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedServices.length > 0 && (
                <div className="mt-4 rounded-lg bg-[#E8F8F6] px-4 py-3 text-sm text-[#31585A]">
                  <span className="font-semibold text-[#078E89]">
                    {selectedServices.length}
                  </span>{" "}
                  service
                  {selectedServices.length !== 1 ? "s" : ""} selected
                </div>
              )}
            </section>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Footer */}
          {/* ---------------------------------------------------------------- */}

          {/* ---------------------------------------------------------------- */}
          {/* Footer */}
          {/* ---------------------------------------------------------------- */}

          <div className="sticky bottom-0 flex shrink-0 items-center justify-end gap-2.5 sm:gap-3 border-t border-[#E2EFED] bg-white px-4 py-3 sm:px-6 sm:py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 sm:h-11 rounded-xl border border-[#E2EFED] bg-white px-4 sm:px-5 text-xs sm:text-sm font-semibold text-[#31585A] transition hover:bg-[#E8F8F6]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex h-10 sm:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#08A6A0] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#078E89]"
            >
              <Check size={16} />

              {isEdit ? "Update Patient" : "Register Patient"}
            </button>
          </div>
        </form>
      </div>

      {/* ================================================================== */}
      {/* Camera Modal */}
      {/* ================================================================== */}

      {cameraOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-4 py-3 sm:px-5 sm:py-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#173F41]">
                  Take Patient Photo
                </h3>

                <p className="mt-0.5 text-[10px] sm:text-xs text-[#819596]">
                  Position the patient inside the camera frame.
                </p>
              </div>

              <button
                type="button"
                onClick={stopCamera}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#819596] hover:bg-[#E8F8F6] hover:text-[#078E89]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-black p-3 sm:p-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="aspect-video w-full rounded-xl object-cover"
              />
            </div>

            <div className="flex justify-end gap-2.5 sm:gap-3 border-t border-[#E2EFED] px-4 py-3 sm:px-5 sm:py-4">
              <button
                type="button"
                onClick={stopCamera}
                className="h-9 sm:h-10 rounded-xl border border-[#E2EFED] px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-[#31585A] hover:bg-[#E8F8F6]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="inline-flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-xl bg-[#08A6A0] px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#078E89]"
              >
                <Camera size={16} />
                Capture Photo
              </button>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Section Title
// ============================================================================

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#E2EFED] pb-2.5 sm:pb-3">
      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
        {icon}
      </div>

      <h3 className="text-sm sm:text-base font-bold text-[#173F41]">
        {title}
      </h3>
    </div>
  );
}

// ============================================================================
// Input Field
// ============================================================================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
  max,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs sm:text-sm font-semibold text-[#31585A]"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="h-10 sm:h-11 w-full rounded-xl border border-[#E2EFED] bg-[#FAFDFC] px-3 sm:px-3.5 text-xs sm:text-sm text-[#173F41] outline-none transition placeholder:text-[#A0B1B1] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      />
    </div>
  );
}

// ============================================================================
// Select Field
// ============================================================================

function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs sm:text-sm font-semibold text-[#31585A]"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="h-10 sm:h-11 w-full rounded-xl border border-[#E2EFED] bg-[#FAFDFC] px-3 sm:px-3.5 text-xs sm:text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      >
        <option value="">Select {label.toLowerCase()}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================================================
// Text Area Field
// ============================================================================

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs sm:text-sm font-semibold text-[#31585A]"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full resize-none rounded-xl border border-[#E2EFED] bg-[#FAFDFC] px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-[#173F41] outline-none transition placeholder:text-[#A0B1B1] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      />
    </div>
  );
}