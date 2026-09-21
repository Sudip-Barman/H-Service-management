import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Activity,
  User,
  Shield,
  Clock,
  BedDouble,
  Droplets,
  AlertCircle,
  FileText,
  Stethoscope,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { apiRequest } from "../../api/api";

export default function PatientRecord({ portal = "workforce" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backPath = portal === "admin" ? "/admin/patients" : "/workforce/patients";

  const loadPatientData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest(`/api/patients/${id}`);
      setPatient(data);
    } catch (err) {
      console.error("Failed to load patient:", err);
      setError(err.message || "Failed to load patient record.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(backPath);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#08A6A0] border-t-transparent"></div>
        <p className="mt-4 text-sm font-semibold text-[#073F42]">Loading Patient Clinical Record...</p>
        <p className="text-xs text-gray-500">Retrieving demographics, history and appointments</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle size={28} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-red-900">Patient Record Not Found</h2>
          <p className="mt-2 text-sm text-red-700">
            {error || `Unable to find patient records matching ID or Registration Number "${id}".`}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft size={16} /> Back to Patients
            </button>
            <button
              onClick={loadPatientData}
              className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#078F8A]"
            >
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = [patient.first_name, patient.middle_name, patient.last_name]
    .filter(Boolean)
    .join(" ") || patient.name || "Patient Record";

  const roomBed = patient.room_bed || patient.roomBed || (
    patient.room_number || patient.bed_number 
      ? `Room ${patient.room_number || "-"} / Bed ${patient.bed_number || "-"}`
      : "Not Assigned"
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={handleBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Patients List</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            {patient.status || "Active"}
          </span>
          <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 border border-teal-200">
            {patient.admission_status || (patient.status === "Admitted" ? "Admitted" : "Outpatient")}
          </span>
          <button
            onClick={loadPatientData}
            title="Refresh patient details"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:text-[#08A6A0]"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-[#DCEBE9] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#073F42] to-[#08A6A0] text-2xl font-bold text-white shadow-md">
              {fullName.charAt(0) || "P"}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#073F42]">{fullName}</h1>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                  {patient.registration_number || `REG-${patient.id}`}
                </span>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>{patient.gender || "Gender not set"}</span>
                <span>•</span>
                <span>{patient.age ? `${patient.age} yrs` : "Age not set"}</span>
                <span>•</span>
                <span>Blood: <strong className="text-red-600">{patient.blood_group || "Unknown"}</strong></span>
                <span>•</span>
                <span>Registered: {patient.registration_date || String(patient.created_at || "").slice(0, 10) || "N/A"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl border border-gray-100 bg-[#FAFDFC] p-3 text-right sm:min-w-[140px]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Room & Bed</p>
              <p className="mt-0.5 text-sm font-bold text-[#073F42]">{roomBed}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[#FAFDFC] p-3 text-right sm:min-w-[140px]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Doctor</p>
              <p className="mt-0.5 text-sm font-bold text-[#073F42]">{patient.doctor_name || patient.assigned_doctor || "General Outpatient"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Demographics, Contact, Medical */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact & Demographics */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold uppercase tracking-wider text-[#073F42]">
              <User size={16} className="text-[#08A6A0]" />
              Demographics & Contact
            </h3>
            <div className="mt-4 space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-800">{patient.date_of_birth || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="font-medium text-gray-800">{patient.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-medium text-gray-800">{patient.email || "No email on record"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="font-medium text-gray-800">
                    {[patient.address, patient.city, patient.state, patient.postal_code].filter(Boolean).join(", ") || "No address on record"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold uppercase tracking-wider text-[#073F42]">
              <Shield size={16} className="text-[#08A6A0]" />
              Emergency Contact
            </h3>
            <div className="mt-4 space-y-2.5 text-sm">
              <p className="font-semibold text-gray-900">{patient.emergency_contact_name || "Not provided"}</p>
              <p className="text-xs text-gray-500">Relation: {patient.emergency_contact_relation || "Not recorded"}</p>
              <div className="flex items-center gap-2 pt-1 text-sm font-medium text-[#08A6A0]">
                <Phone size={14} />
                <span>{patient.emergency_contact_phone || "No phone listed"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Overview & History */}
        <div className="space-y-6 lg:col-span-2">
          {/* Medical Notes & Allergies */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold uppercase tracking-wider text-[#073F42]">
              <HeartPulse size={16} className="text-red-500" />
              Clinical Notes & Medical Alerts
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-red-700">Known Allergies</p>
                <p className="mt-1.5 text-sm text-red-900">
                  {patient.allergies || "No known allergies documented."}
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Primary Condition / Diagnosis</p>
                <p className="mt-1.5 text-sm text-amber-900">
                  {patient.condition || patient.diagnosis || "General medical examination."}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Past Medical History</p>
              <p className="mt-1 rounded-xl bg-gray-50 p-3.5 text-sm text-gray-700 leading-relaxed">
                {patient.medical_history || patient.history || "No previous chronic conditions or surgical history reported."}
              </p>
            </div>
          </div>

          {/* Appointments & Recent Care */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold uppercase tracking-wider text-[#073F42]">
              <Clock size={16} className="text-[#08A6A0]" />
              Appointment Records
            </h3>
            {Array.isArray(patient.appointments) && patient.appointments.length > 0 ? (
              <div className="mt-4 divide-y divide-gray-100">
                {patient.appointments.map((apt, idx) => (
                  <div key={apt.booking_id || apt.id || idx} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {apt.booking_number || `Appointment #${idx + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        Date: {apt.booking_date || apt.date || "TBD"} at {apt.booking_time || apt.time || "TBD"} • Doctor: {apt.doctor_name || "General"}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                      {apt.status || "Scheduled"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No scheduled appointments for this patient.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
