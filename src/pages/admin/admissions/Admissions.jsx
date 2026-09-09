import { cloneElement, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Eye,
  Filter,
  LogOut,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

const initialAdmissions = [
  {
    admission_id: 1,
    admission_number: "ADM-2026-001",
    patient_name: "Riya Mukherjee",
    patient_id: "PAT-1001",
    doctor_name: "Dr. Arindam Sen",
    department: "Cardiology",
    ward: "Cardiology Ward",
    bed_number: "C-12",
    admission_date: "2026-09-05",
    admission_type: "Emergency",
    diagnosis: "Chest pain observation",
    status: "Admitted",
  },
  {
    admission_id: 2,
    admission_number: "ADM-2026-002",
    patient_name: "Aniket Das",
    patient_id: "PAT-1002",
    doctor_name: "Dr. Moumita Roy",
    department: "Neurology",
    ward: "Neurology Ward",
    bed_number: "N-05",
    admission_date: "2026-09-06",
    admission_type: "Planned",
    diagnosis: "Migraine evaluation",
    status: "Admitted",
  },
  {
    admission_id: 3,
    admission_number: "ADM-2026-003",
    patient_name: "Maya Saha",
    patient_id: "PAT-1003",
    doctor_name: "Dr. Sourav Mukherjee",
    department: "Orthopedics",
    ward: "Orthopedic Ward",
    bed_number: "O-08",
    admission_date: "2026-09-07",
    admission_type: "Emergency",
    diagnosis: "Left ankle fracture",
    status: "Admitted",
  },
  {
    admission_id: 4,
    admission_number: "ADM-2026-004",
    patient_name: "Suman Ghosh",
    patient_id: "PAT-1004",
    doctor_name: "Dr. Rajesh Chatterjee",
    department: "Medicine",
    ward: "General Ward",
    bed_number: "G-19",
    admission_date: "2026-09-01",
    admission_type: "Planned",
    diagnosis: "Fever and dehydration",
    status: "Discharged",
    discharge_date: "2026-09-04",
  },
];

const emptyAdmission = {
  admission_id: null,
  admission_number: "",
  patient_name: "",
  patient_id: "",
  doctor_name: "",
  department: "",
  ward: "",
  bed_number: "",
  admission_date: new Date().toISOString().slice(0, 10),
  admission_type: "Planned",
  diagnosis: "",
  status: "Admitted",
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
      status === "Discharged"
        ? "bg-[#F1F4F4] text-[#667B7D]"
        : "bg-[#E8F8F6] text-[#078E89]"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        status === "Discharged" ? "bg-[#819596]" : "bg-[#08A6A0]"
      }`}
    />
    {status}
  </span>
);

const Admission = () => {
  const [admissions, setAdmissions] = useState(initialAdmissions);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [admissionToDelete, setAdmissionToDelete] = useState(null);

  const departments = useMemo(
    () => ["All", ...new Set(admissions.map((item) => item.department).filter(Boolean))],
    [admissions]
  );

  const stats = useMemo(
    () => ({
      total: admissions.length,
      admitted: admissions.filter((item) => item.status === "Admitted").length,
      discharged: admissions.filter((item) => item.status === "Discharged").length,
      emergency: admissions.filter((item) => item.admission_type === "Emergency").length,
    }),
    [admissions]
  );

  const filteredAdmissions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return admissions.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.admission_number,
          item.patient_name,
          item.patient_id,
          item.doctor_name,
          item.ward,
          item.bed_number,
        ].some((value) => value?.toLowerCase().includes(query));
      return (
        matchesSearch &&
        (department === "All" || item.department === department) &&
        (status === "All" || item.status === status)
      );
    });
  }, [admissions, department, search, status]);

  const openAddForm = () => {
    setEditingAdmission(null);
    setFormOpen(true);
  };

  const saveAdmission = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const now = new Date().toISOString().slice(0, 10);

    if (editingAdmission) {
      const updated = { ...editingAdmission, ...data };
      setAdmissions((current) =>
        current.map((item) =>
          item.admission_id === editingAdmission.admission_id ? updated : item
        )
      );
      setDetails((current) =>
        current?.admission_id === editingAdmission.admission_id ? updated : current
      );
    } else {
      const nextId = Math.max(0, ...admissions.map((item) => item.admission_id)) + 1;
      setAdmissions((current) => [
        {
          ...emptyAdmission,
          ...data,
          admission_id: nextId,
          admission_number: data.admission_number || `ADM-${now.slice(0, 4)}-${String(nextId).padStart(3, "0")}`,
        },
        ...current,
      ]);
    }
    setFormOpen(false);
    setEditingAdmission(null);
  };

  const dischargeAdmission = (admission) => {
    const updated = {
      ...admission,
      status: "Discharged",
      discharge_date: new Date().toISOString().slice(0, 10),
    };
    setAdmissions((current) =>
      current.map((item) => (item.admission_id === admission.admission_id ? updated : item))
    );
    setDetails((current) => (current?.admission_id === admission.admission_id ? updated : current));
  };

  const deleteAdmission = () => {
    if (!admissionToDelete) return;
    setAdmissions((current) =>
      current.filter((item) => item.admission_id !== admissionToDelete.admission_id)
    );
    setDetails(null);
    setAdmissionToDelete(null);
  };

  return (
    <div className="min-h-full bg-[#F7FBFA] p-3 sm:p-4 lg:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#173F41] sm:text-2xl">Admissions</h1>
          <p className="mt-1 text-sm text-[#819596]">Manage patient admissions, beds, and discharge records.</p>
        </div>
        <button onClick={openAddForm} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#078E89] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#067A76]">
          <Plus className="h-4 w-4" /> Add Admission
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total Admissions" value={stats.total} />
        <Stat icon={BedDouble} label="Currently Admitted" value={stats.admitted} />
        <Stat icon={CheckCircle2} label="Discharged" value={stats.discharged} />
        <Stat icon={CalendarDays} label="Emergency Cases" value={stats.emergency} />
      </div>

      <div className="rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by patient, admission number, doctor or bed..." className="w-full rounded-lg border border-[#DDE9E7] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#D7F3F0]" />
          </label>
          <button onClick={() => setShowFilters((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDE9E7] px-3 py-2.5 text-sm font-semibold text-[#31585A] hover:bg-[#F2FAF9]">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 grid gap-3 border-t border-[#EAF2F1] pt-3 sm:grid-cols-3">
            <Select label="Department" value={department} onChange={setDepartment} options={departments} />
            <Select label="Status" value={status} onChange={setStatus} options={["All", "Admitted", "Discharged"]} />
            <button onClick={() => { setSearch(""); setDepartment("All"); setStatus("All"); }} className="self-end rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm font-semibold text-[#31585A] hover:bg-[#F2FAF9]">Clear filters</button>
          </div>
        )}

        <div className="mb-2 mt-4 text-sm text-[#819596]">Showing {filteredAdmissions.length} of {admissions.length} admissions</div>
        <div className="overflow-x-auto rounded-lg border border-[#E2EFED]">
          <table className="min-w-full divide-y divide-[#EAF2F1] text-left">
            <thead className="bg-[#F7FBFA] text-xs font-semibold uppercase tracking-wide text-[#6E8081]"><tr><th className="px-4 py-3">Admission</th><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Doctor & Ward</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-[#EAF2F1] bg-white">
              {filteredAdmissions.map((item) => <tr key={item.admission_id} className="hover:bg-[#FBFDFC]"><td className="px-4 py-3"><p className="font-semibold text-[#173F41]">{item.admission_number}</p><p className="mt-0.5 text-xs text-[#819596]">{item.admission_type}</p></td><td className="px-4 py-3"><p className="font-medium text-[#31585A]">{item.patient_name}</p><p className="mt-0.5 text-xs text-[#819596]">{item.patient_id}</p></td><td className="px-4 py-3"><p className="text-sm text-[#31585A]">{item.doctor_name}</p><p className="mt-0.5 text-xs text-[#819596]">{item.ward} · Bed {item.bed_number}</p></td><td className="px-4 py-3 text-sm text-[#31585A]">{formatDate(item.admission_date)}</td><td className="px-4 py-3"><StatusBadge status={item.status} /></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><IconButton label="View" onClick={() => setDetails(item)}><Eye /></IconButton><IconButton label="Edit" onClick={() => { setEditingAdmission(item); setFormOpen(true); }}><Edit3 /></IconButton>{item.status === "Admitted" && <IconButton label="Discharge" onClick={() => dischargeAdmission(item)}><LogOut /></IconButton>}<IconButton label="Delete" danger onClick={() => setAdmissionToDelete(item)}><Trash2 /></IconButton></div></td></tr>)}
              {!filteredAdmissions.length && <tr><td colSpan="6" className="px-4 py-10 text-center text-sm text-[#819596]">No admissions match your search or filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && <AdmissionForm admission={editingAdmission} onClose={() => { setFormOpen(false); setEditingAdmission(null); }} onSubmit={saveAdmission} />}
      {details && <Details admission={details} onClose={() => setDetails(null)} />}
      {admissionToDelete && <Confirm title="Delete admission?" message={`This will permanently remove ${admissionToDelete.admission_number}.`} onCancel={() => setAdmissionToDelete(null)} onConfirm={deleteAdmission} />}
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }) => <div className="min-w-0 rounded-xl border border-[#E2EFED] bg-white px-3 py-3 shadow-sm"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6]"><Icon className="h-4 w-4 text-[#08A6A0]" /></span><span className="text-xl font-bold text-[#073F42]">{value}</span></div><p className="mt-2 truncate text-xs font-semibold text-[#819596]">{label}</p></div>;
const IconButton = ({ children, label, onClick, danger = false }) => <button aria-label={label} title={label} onClick={onClick} className={`rounded-md p-2 transition ${danger ? "text-[#C85A5A] hover:bg-[#FFF1F1]" : "text-[#507173] hover:bg-[#E8F8F6] hover:text-[#078E89]"}`}>{cloneElement(children, { className: "h-4 w-4" })}</button>;
const Select = ({ label, value, onChange, options }) => <label className="text-xs font-semibold text-[#507173]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 block w-full rounded-lg border border-[#DDE9E7] bg-white px-3 py-2 text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;

const AdmissionForm = ({ admission, onClose, onSubmit }) => {
  const data = { ...emptyAdmission, ...admission };
  return <Modal title={admission ? "Edit Admission" : "Add Admission"} subtitle={admission ? "Update the patient admission record." : "Register a patient admission and bed allocation."} onClose={onClose}><form onSubmit={onSubmit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Admission Number" name="admission_number" defaultValue={data.admission_number} placeholder="Auto-generated if empty" /><Field label="Patient Name" name="patient_name" defaultValue={data.patient_name} required /><Field label="Patient ID" name="patient_id" defaultValue={data.patient_id} required /><Field label="Admitting Doctor" name="doctor_name" defaultValue={data.doctor_name} required /><Field label="Department" name="department" defaultValue={data.department} required /><Field label="Ward" name="ward" defaultValue={data.ward} required /><Field label="Bed Number" name="bed_number" defaultValue={data.bed_number} required /><Field label="Admission Date" name="admission_date" type="date" defaultValue={data.admission_date} required /><SelectField label="Admission Type" name="admission_type" defaultValue={data.admission_type} options={["Planned", "Emergency"]} /><SelectField label="Status" name="status" defaultValue={data.status} options={["Admitted", "Discharged"]} /></div><Field label="Diagnosis / Reason for Admission" name="diagnosis" defaultValue={data.diagnosis} textarea required /><div className="flex justify-end gap-2 border-t border-[#EAF2F1] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#DDE9E7] px-4 py-2 text-sm font-semibold text-[#31585A]">Cancel</button><button className="rounded-lg bg-[#078E89] px-4 py-2 text-sm font-semibold text-white hover:bg-[#067A76]">{admission ? "Update Admission" : "Save Admission"}</button></div></form></Modal>;
};
const Field = ({ label, textarea, ...props }) => <label className={`block text-xs font-semibold text-[#507173] ${textarea ? "sm:col-span-2" : ""}`}>{label}{textarea ? <textarea {...props} className="mt-1 block min-h-20 w-full rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]" /> : <input {...props} className="mt-1 block w-full rounded-lg border border-[#DDE9E7] px-3 py-2 text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]" />}</label>;
const SelectField = ({ label, options, ...props }) => <label className="block text-xs font-semibold text-[#507173]">{label}<select {...props} className="mt-1 block w-full rounded-lg border border-[#DDE9E7] bg-white px-3 py-2 text-sm font-normal text-[#31585A] outline-none focus:border-[#08A6A0]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
const Modal = ({ title, subtitle, children, onClose }) => <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173F41]/40 p-4 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#E2EFED] px-5 py-4"><div><h2 className="text-lg font-bold text-[#173F41]">{title}</h2><p className="mt-1 text-sm text-[#819596]">{subtitle}</p></div><button onClick={onClose} className="rounded-lg p-2 text-[#819596] hover:bg-[#E8F8F6]"><X className="h-4 w-4" /></button></div><div className="p-5">{children}</div></div></div>;
const Details = ({ admission, onClose }) => <Modal title="Admission Details" subtitle={admission.admission_number} onClose={onClose}><div className="grid gap-4 sm:grid-cols-2">{[["Patient", admission.patient_name], ["Patient ID", admission.patient_id], ["Doctor", admission.doctor_name], ["Department", admission.department], ["Ward / Bed", `${admission.ward} · ${admission.bed_number}`], ["Admission Date", formatDate(admission.admission_date)], ["Admission Type", admission.admission_type], ["Status", admission.status], ["Diagnosis", admission.diagnosis], ["Discharge Date", formatDate(admission.discharge_date)]].map(([label, value]) => <div key={label} className="rounded-lg bg-[#F7FBFA] p-3"><p className="text-xs font-semibold text-[#819596]">{label}</p><p className="mt-1 text-sm font-medium text-[#31585A]">{value || "—"}</p></div>)}</div></Modal>;
const Confirm = ({ title, message, onCancel, onConfirm }) => <Modal title={title} subtitle={message} onClose={onCancel}><div className="flex justify-end gap-2"><button onClick={onCancel} className="rounded-lg border border-[#DDE9E7] px-4 py-2 text-sm font-semibold text-[#31585A]">Cancel</button><button onClick={onConfirm} className="rounded-lg bg-[#C85A5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B74747]">Delete</button></div></Modal>;

export default Admission;
