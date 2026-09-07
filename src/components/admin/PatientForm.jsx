import { useEffect, useState } from "react";
import {
  Activity,
  Baby,
  CalendarDays,
  HeartHandshake,
  HeartPulse,
  HouseHeart,
  Stethoscope,
  UserPlus,
  X,
} from "lucide-react";

const serviceOptions = [
  {
    id: "patient-caretaker",
    name: "Patient Caretaker",
    description: "Personal assistance and patient support",
    icon: UserPlus,
  },
  {
    id: "baby-caretaker",
    name: "Baby Caretaker",
    description: "Dedicated baby care assistance",
    icon: Baby,
  },
  {
    id: "japa-service",
    name: "Japa Service",
    description: "Post-delivery mother and newborn care",
    icon: HeartHandshake,
  },
  {
    id: "nurse",
    name: "Nurse",
    description: "General nursing and patient care",
    icon: HeartPulse,
  },
  {
    id: "baby-sitter",
    name: "Baby Sitter",
    description: "Child supervision and daily assistance",
    icon: Baby,
  },
  {
    id: "male-attendant",
    name: "Male Attendant",
    description: "Patient assistance and daily activities",
    icon: UserPlus,
  },
  {
    id: "elder-care",
    name: "Elder Care",
    description: "Specialized elderly patient support",
    icon: HouseHeart,
  },
  {
    id: "gnm-nurse",
    name: "GNM Nurse",
    description: "General nursing and medical support",
    icon: Stethoscope,
  },
  {
    id: "anm-nurse",
    name: "ANM Nurse",
    description: "Basic nursing and healthcare assistance",
    icon: Activity,
  },
  {
    id: "bsc-nurse",
    name: "BSc Nurse",
    description: "Professional nursing care",
    icon: Stethoscope,
  },
  {
    id: "icu-nurse",
    name: "ICU Nurse",
    description: "Specialized intensive care nursing",
    icon: HeartPulse,
  },
];

function PatientForm({
  open,
  patient,
  onClose,
  onSubmit,
}) {
  const isEdit = Boolean(patient);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    bloodGroup: "O+",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    registrationDate: "",
    status: "Registered",
    admissionStatus: "Not Admitted",
  });

  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    if (!open) return;

    if (patient) {
      setForm({
        name: patient.name || "",
        age: patient.age || "",
        gender: patient.gender || "Male",
        bloodGroup: patient.bloodGroup || "O+",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        emergencyContact: patient.emergencyContact || "",
        emergencyPhone: patient.emergencyPhone || "",
        registrationDate: patient.registrationDate || "",
        status: patient.status || "Registered",
        admissionStatus: patient.admissionStatus || "Not Admitted",
      });

      setSelectedServices(
        Array.isArray(patient.activeServices)
          ? patient.activeServices
          : []
      );
    } else {
      setForm({
        name: "",
        age: "",
        gender: "Male",
        bloodGroup: "O+",
        phone: "",
        email: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
        registrationDate: new Date()
          .toISOString()
          .split("T")[0],
        status: "Registered",
        admissionStatus: "Not Admitted",
      });

      setSelectedServices([]);
    }
  }, [open, patient]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleService = (serviceName) => {
    setSelectedServices((previous) => {
      if (previous.includes(serviceName)) {
        return previous.filter(
          (service) => service !== serviceName
        );
      }

      return [...previous, serviceName];
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter patient name.");
      return;
    }

    if (!form.age || Number(form.age) <= 0) {
      alert("Please enter a valid patient age.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Please enter patient phone number.");
      return;
    }

    const patientData = {
      ...form,

      name: form.name.trim(),
      age: Number(form.age),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      emergencyContact: form.emergencyContact.trim(),
      emergencyPhone: form.emergencyPhone.trim(),

      registrationDate:
        form.registrationDate ||
        new Date().toISOString().split("T")[0],

      status: form.status || "Registered",

      admissionStatus:
        form.admissionStatus || "Not Admitted",

      activeServices: selectedServices,
    };

    onSubmit(patientData, patient);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEdit ? "Edit Patient" : "Add New Patient"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEdit
                ? "Update patient information and required services."
                : "Enter patient information and select required services."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-5"
        >
          {/* Patient Information */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
              Patient Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Patient Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Age *
                </label>

                <input
                  type="number"
                  name="age"
                  min="0"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Blood Group
                </label>

                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="patient@example.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Enter patient address"
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
              Emergency Contact
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Contact Name
                </label>

                <input
                  type="text"
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  placeholder="Emergency contact name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Contact Phone
                </label>

                <input
                  type="tel"
                  name="emergencyPhone"
                  value={form.emergencyPhone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Services Required
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Select all services required by this patient.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {selectedServices.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceOptions.map((service) => {
                const Icon = service.icon;

                const selected = selectedServices.includes(
                  service.name
                );

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.name)}
                    className={`group flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                      }`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            selected
                              ? "text-emerald-800"
                              : "text-slate-700"
                          }`}
                        >
                          {service.name}
                        </p>

                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                            selected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected ? "✓" : ""}
                        </span>
                      </div>

                      <p className="mt-1 text-xs leading-4 text-slate-500">
                        {service.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Registration */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
              Registration & Status
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Registration Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    name="registrationDate"
                    value={form.registrationDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Patient Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="Registered">Registered</option>
                  <option value="Active">Active</option>
                  <option value="Under Treatment">
                    Under Treatment
                  </option>
                  <option value="Admitted">Admitted</option>
                  <option value="Completed">Completed</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Admission Status
                </label>

                <select
                  name="admissionStatus"
                  value={form.admissionStatus}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="Not Admitted">
                    Not Admitted
                  </option>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
            </div>
          </div>

          {/* Selected services summary */}
          {selectedServices.length > 0 && (
            <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="mb-2 text-sm font-semibold text-emerald-800">
                Selected Services
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {isEdit ? "Update Patient" : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;