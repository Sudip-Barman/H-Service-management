import { useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  Droplets,
  Edit3,
  Eye,
  Mail,
  Phone,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import PatientForm from "../../../components/admin/PatientForm";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import { patientData } from "../../../data/patientData";

const statusStyles = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Under Treatment": "border-blue-200 bg-blue-50 text-blue-700",
  Registered: "border-slate-200 bg-slate-50 text-slate-700",
  Admitted: "border-purple-200 bg-purple-50 text-purple-700",
  Completed: "border-green-200 bg-green-50 text-green-700",
  Inactive: "border-red-200 bg-red-50 text-red-700",
};

const getInitials = (name = "") => name.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status] || "border-slate-200 bg-slate-50 text-slate-700"}`}>{status || "Unknown"}</span>;
}

function Info({ label, value, icon: Icon }) {
  return <div className="rounded-xl bg-[#F7FBFA] p-3"><p className="text-[11px] font-bold uppercase tracking-wide text-[#819596]">{label}</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#31585A]">{Icon && <Icon size={15} className="text-[#08A6A0]" />}{value || "Not provided"}</p></div>;
}

function PatientDetails({ patient, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/40 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6] font-bold text-[#078F8A]">{getInitials(patient.name)}</div><div><p className="text-xs font-semibold uppercase tracking-wide text-[#08A6A0]">{patient.id}</p><h2 className="mt-1 text-xl font-bold text-[#073F42]">{patient.name}</h2><p className="mt-1 text-sm text-[#819596]">Registered {patient.registrationDate}</p></div></div>
          <button type="button" onClick={onClose} aria-label="Close details" className="flex h-9 w-9 items-center justify-center rounded-lg text-[#819596] hover:bg-[#E8F8F6]"><X size={18} /></button>
        </div>
        <div className="mt-5 flex items-center justify-between border-y border-[#EAF2F0] py-4"><span className="text-sm font-semibold text-[#31585A]">Patient status</span><StatusBadge status={patient.status} /></div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"><Info label="Age / Gender" value={`${patient.age || "-"} years · ${patient.gender || "-"}`} /><Info label="Blood group" value={patient.bloodGroup} icon={Droplets} /><Info label="Phone" value={patient.phone} icon={Phone} /><Info label="Email" value={patient.email} icon={Mail} /><Info label="Address" value={patient.address} /><Info label="Admission" value={patient.admissionStatus} /><Info label="Emergency contact" value={`${patient.emergencyContact || "-"} · ${patient.emergencyPhone || "-"}`} /><Info label="Appointments" value={patient.appointments ?? 0} icon={CalendarDays} /></div>
        <div className="mt-5 flex justify-end gap-3 border-t border-[#EAF2F0] pt-5"><button type="button" onClick={onClose} className="rounded-lg border border-[#D9E9E7] px-4 py-2.5 text-sm font-semibold text-[#31585A] hover:bg-[#F7FBFA]">Close</button><button type="button" onClick={() => onEdit(patient)} className="inline-flex items-center gap-2 rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#078F8A]"><Edit3 size={16} />Edit Patient</button></div>
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon }) {
  return <div className="rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">{Icon ? <Icon size={18} /> : <span className="text-lg font-bold">#</span>}</span><strong className="text-2xl font-bold text-[#073F42]">{value}</strong></div><p className="mt-3 truncate text-xs font-semibold text-[#819596]">{label}</p></div>;
}

function Patients() {
  const [patients, setPatients] = useState(patientData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [archivePatient, setArchivePatient] = useState(null);

  const filteredPatients = useMemo(() => {
    const search = query.trim().toLowerCase();
    return patients.filter((patient) => {
      const matchesSearch = !search || [patient.name, patient.id, patient.phone, patient.email].join(" ").toLowerCase().includes(search);
      return matchesSearch && (statusFilter === "All" || patient.status === statusFilter);
    });
  }, [patients, query, statusFilter]);

  const openAdd = () => { setEditingPatient(null); setShowForm(true); };
  const openEdit = (patient) => { setSelectedPatient(null); setEditingPatient(patient); setShowForm(true); };
  const savePatient = (formData, existingPatient) => {
    if (existingPatient) {
      setPatients((current) => current.map((patient) => patient.id === existingPatient.id ? { ...patient, ...formData } : patient));
    } else {
      setPatients((current) => [{ ...formData, id: "PAT-" + (1001 + current.length) }, ...current]);
    }
    setShowForm(false);
    setEditingPatient(null);
  };
  const confirmArchive = () => { setPatients((current) => current.filter((patient) => patient.id !== archivePatient.id)); setArchivePatient(null); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08A6A0]">Patient Management</p><h1 className="mt-2 text-2xl font-bold text-[#073F42] sm:text-3xl">Patients</h1><p className="mt-2 text-sm text-[#789092]">Manage patient records, contact information, services, and admission status.</p></div><button type="button" onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#078F8A]"><UserPlus size={17} />Register Patient</button></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="Total Patients" value={patients.length} icon={Users} /><Metric label="Active" value={patients.filter((patient) => patient.status === "Active").length} /><Metric label="Admitted" value={patients.filter((patient) => patient.status === "Admitted").length} /><Metric label="Under Treatment" value={patients.filter((patient) => patient.status === "Under Treatment").length} /></div>
      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-[#EAF2F0] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><h2 className="text-lg font-bold text-[#073F42]">Patient Directory</h2><p className="mt-1 text-sm text-[#819596]">{filteredPatients.length} patient records found</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search size={16} className="absolute left-3 top-3 text-[#819596]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients" className="h-10 w-full rounded-lg border border-[#D9E9E7] pl-9 pr-3 text-sm outline-none focus:border-[#08A6A0] sm:w-56" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-lg border border-[#D9E9E7] px-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"><option>All</option><option>Active</option><option>Under Treatment</option><option>Registered</option><option>Admitted</option><option>Completed</option><option>Inactive</option></select></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-[#F7FBFA] text-xs uppercase tracking-wide text-[#819596]"><tr><th className="px-5 py-3 font-semibold">Patient</th><th className="px-5 py-3 font-semibold">Age / Gender</th><th className="px-5 py-3 font-semibold">Blood</th><th className="px-5 py-3 font-semibold">Contact</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-[#EAF2F0]">{filteredPatients.map((patient) => <tr key={patient.id} className="hover:bg-[#FBFEFD]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F8F6] text-sm font-bold text-[#078F8A]">{getInitials(patient.name)}</div><div><p className="font-semibold text-[#173F41]">{patient.name}</p><p className="text-xs text-[#819596]">{patient.id}</p></div></div></td><td className="px-5 py-4 text-sm text-[#31585A]">{patient.age} years<div className="text-xs text-[#819596]">{patient.gender}</div></td><td className="px-5 py-4 text-sm font-semibold text-[#31585A]"><span className="flex items-center gap-1.5"><Droplets size={15} className="text-red-500" />{patient.bloodGroup}</span></td><td className="px-5 py-4 text-xs text-[#819596]"><div className="flex items-center gap-1.5"><Phone size={13} />{patient.phone}</div><div className="mt-1 flex items-center gap-1.5"><Mail size={13} />{patient.email}</div></td><td className="px-5 py-4"><StatusBadge status={patient.status} /></td><td className="px-5 py-4"><div className="flex gap-2"><button type="button" title="View patient" onClick={() => setSelectedPatient(patient)} className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] hover:bg-[#E8F8F6]"><Eye size={16} /></button><button type="button" title="Edit patient" onClick={() => openEdit(patient)} className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] hover:bg-[#E8F8F6]"><Edit3 size={16} /></button><button type="button" title="Archive patient" onClick={() => setArchivePatient(patient)} className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] hover:bg-red-50 hover:text-red-600"><Archive size={16} /></button></div></td></tr>)}</tbody></table>{filteredPatients.length === 0 && <p className="py-12 text-center text-sm text-[#819596]">No patients match your search.</p>}</div>
      </div>
      {showForm && <PatientForm open={showForm} patient={editingPatient} onClose={() => { setShowForm(false); setEditingPatient(null); }} onSubmit={savePatient} />}
      {selectedPatient && <PatientDetails patient={selectedPatient} onClose={() => setSelectedPatient(null)} onEdit={openEdit} />}
      <ConfirmDialog open={Boolean(archivePatient)} title="Archive patient?" message={`${archivePatient?.name || "This patient"} will be removed from the active directory.`} confirmText="Archive Patient" onCancel={() => setArchivePatient(null)} onConfirm={confirmArchive} variant="danger" />
    </div>
  );
}

export default Patients;
