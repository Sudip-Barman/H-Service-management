import { useMemo, useState } from "react";
import {
	Activity,
	AlertCircle,
	BedDouble,
	Clock3,
	Droplets,
	Eye,
	HeartPulse,
	MapPin,
	Phone,
	Plus,
	Search,
	ShieldAlert,
	Stethoscope,
	UserRound,
	Users,
	X,
} from "lucide-react";

const initialPatients = [
	{
		id: "ER-24081",
		name: "Arjun Mehta",
		age: "46",
		gender: "Male",
		bloodGroup: "B+",
		phone: "+91 98765 22011",
		emergencyContact: "Neha Mehta",
		emergencyPhone: "+91 98765 22012",
		arrivalTime: "08 Sep, 09:42 AM",
		triage: "Critical",
		status: "Under Treatment",
		condition: "Chest pain and breathing difficulty",
		symptoms: "Severe chest pain, shortness of breath, sweating",
		assignedDoctor: "Dr. Ananya Sen",
		department: "Emergency Medicine",
		room: "Resus Bay 01",
		allergies: "Penicillin",
		notes: "ECG completed. Cardiology review requested.",
	},
	{
		id: "ER-24080",
		name: "Maya Roy",
		age: "29",
		gender: "Female",
		bloodGroup: "O+",
		phone: "+91 91234 66890",
		emergencyContact: "Sourav Roy",
		emergencyPhone: "+91 91234 66891",
		arrivalTime: "08 Sep, 10:05 AM",
		triage: "Urgent",
		status: "Awaiting Doctor",
		condition: "Abdominal pain and vomiting",
		symptoms: "Right-sided abdominal pain, nausea, fever",
		assignedDoctor: "Dr. Rohan Das",
		department: "Emergency Medicine",
		room: "Exam Room 04",
		allergies: "No known allergies",
		notes: "Blood tests pending.",
	},
	{
		id: "ER-24079",
		name: "Kabir Sharma",
		age: "8",
		gender: "Male",
		bloodGroup: "A+",
		phone: "+91 90011 44321",
		emergencyContact: "Ritu Sharma",
		emergencyPhone: "+91 90011 44322",
		arrivalTime: "08 Sep, 10:18 AM",
		triage: "Urgent",
		status: "Under Treatment",
		condition: "High fever and dehydration",
		symptoms: "Fever, weakness, reduced appetite",
		assignedDoctor: "Dr. Priya Nair",
		department: "Pediatrics",
		room: "Pediatric Bay 02",
		allergies: "No known allergies",
		notes: "IV fluids started. Monitor temperature every hour.",
	},
	{
		id: "ER-24078",
		name: "Sanjay Kumar",
		age: "61",
		gender: "Male",
		bloodGroup: "AB+",
		phone: "+91 93333 11223",
		emergencyContact: "Pooja Kumar",
		emergencyPhone: "+91 93333 11224",
		arrivalTime: "08 Sep, 10:31 AM",
		triage: "Stable",
		status: "Admitted",
		condition: "Fall injury with wrist fracture",
		symptoms: "Pain and swelling in left wrist",
		assignedDoctor: "Dr. Vikram Singh",
		department: "Orthopedics",
		room: "Observation 03",
		allergies: "No known allergies",
		notes: "X-ray confirms distal radius fracture.",
	},
];

const triageStyles = {
	Critical: "border-red-200 bg-red-50 text-red-700",
	Urgent: "border-amber-200 bg-amber-50 text-amber-700",
	Stable: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const statusStyles = {
	"Awaiting Doctor": "border-amber-200 bg-amber-50 text-amber-700",
	"Under Treatment": "border-blue-200 bg-blue-50 text-blue-700",
	Admitted: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Discharged: "border-slate-200 bg-slate-50 text-slate-600",
};

const emptyForm = {
	name: "",
	age: "",
	gender: "Male",
	bloodGroup: "O+",
	phone: "",
	emergencyContact: "",
	emergencyPhone: "",
	triage: "Urgent",
	condition: "",
	symptoms: "",
	assignedDoctor: "Dr. Ananya Sen",
	department: "Emergency Medicine",
	room: "Triage Bay 01",
	allergies: "No known allergies",
	notes: "",
};

const Badge = ({ value, styles }) => (
	<span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[value] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
		{value}
	</span>
);

const Field = ({ label, name, value, onChange, required = false, ...props }) => (
	<label className="block">
		<span className="mb-1.5 block text-xs font-semibold text-[#31585A]">
			{label}{required ? " *" : ""}
		</span>
		<input
			name={name}
			value={value}
			onChange={onChange}
			required={required}
			{...props}
			className="h-10 w-full rounded-lg border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
		/>
	</label>
);

const SelectField = ({ label, name, value, onChange, children }) => (
	<label className="block">
		<span className="mb-1.5 block text-xs font-semibold text-[#31585A]">{label}</span>
		<select
			name={name}
			value={value}
			onChange={onChange}
			className="h-10 w-full rounded-lg border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
		>
			{children}
		</select>
	</label>
);

const DetailItem = ({ label, value, icon: Icon }) => (
	<div className="rounded-lg bg-[#F7FBFA] p-3">
		<p className="text-[11px] font-semibold uppercase tracking-wide text-[#819596]">{label}</p>
		<p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#173F41]">
			{Icon && <Icon size={15} className="text-[#08A6A0]" />}
			{value || "Not provided"}
		</p>
	</div>
);

function Emergency() {
	const [patients, setPatients] = useState(initialPatients);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [showAdd, setShowAdd] = useState(false);
	const [query, setQuery] = useState("");
	const [triageFilter, setTriageFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState("All");
	const [form, setForm] = useState(emptyForm);

	const filteredPatients = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return patients.filter((patient) => {
			const matchesQuery = !normalizedQuery || [patient.name, patient.id, patient.condition, patient.assignedDoctor]
				.join(" ")
				.toLowerCase()
				.includes(normalizedQuery);
			const matchesTriage = triageFilter === "All" || patient.triage === triageFilter;
			const matchesStatus = statusFilter === "All" || patient.status === statusFilter;
			return matchesQuery && matchesTriage && matchesStatus;
		});
	}, [patients, query, triageFilter, statusFilter]);

	const updateForm = (event) => {
		setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
	};

	const updateStatus = (patientId, status) => {
		setPatients((current) => current.map((patient) => patient.id === patientId ? { ...patient, status } : patient));
		setSelectedPatient((current) => current && current.id === patientId ? { ...current, status } : current);
	};

	const addPatient = (event) => {
		event.preventDefault();
		const newPatient = {
			...form,
			id: `ER-${String(24081 + patients.length).padStart(5, "0")}`,
			status: "Awaiting Doctor",
			arrivalTime: "08 Sep, just now",
		};
		setPatients((current) => [newPatient, ...current]);
		setForm(emptyForm);
		setShowAdd(false);
	};

	const criticalCount = patients.filter((patient) => patient.triage === "Critical").length;
	const treatmentCount = patients.filter((patient) => patient.status === "Under Treatment").length;

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08A6A0]">Emergency Department</p>
					<h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">Emergency Patient Care</h1>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-[#789092]">Coordinate triage, treatment, and patient information from one live emergency desk.</p>
				</div>
				<button type="button" onClick={() => setShowAdd(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]">
					<Plus size={18} /> Add Emergency Patient
				</button>
			</div>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<SummaryCard icon={Users} label="Patients in ER" value={patients.length} tone="teal" />
				<SummaryCard icon={ShieldAlert} label="Critical Cases" value={criticalCount} tone="red" />
				<SummaryCard icon={Activity} label="Under Treatment" value={treatmentCount} tone="blue" />
				<SummaryCard icon={BedDouble} label="Available Bays" value="07" tone="amber" />
			</div>

			<div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm sm:p-5">
				<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
					<div>
						<h2 className="text-lg font-bold text-[#073F42]">Emergency Patient Queue</h2>
						<p className="mt-1 text-sm text-[#819596]">Review patient condition, triage priority, and current care status.</p>
					</div>
					<div className="flex flex-col gap-2 sm:flex-row">
						<label className="relative block sm:min-w-64">
							<Search size={16} className="absolute left-3 top-3 text-[#819596]" />
							<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patient or condition" className="h-10 w-full rounded-lg border border-[#D9E9E7] pl-9 pr-3 text-sm outline-none focus:border-[#08A6A0]" />
						</label>
						<select value={triageFilter} onChange={(event) => setTriageFilter(event.target.value)} className="h-10 rounded-lg border border-[#D9E9E7] px-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]">
							<option>All</option><option>Critical</option><option>Urgent</option><option>Stable</option>
						</select>
						<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-lg border border-[#D9E9E7] px-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]">
							<option>All</option><option>Awaiting Doctor</option><option>Under Treatment</option><option>Admitted</option><option>Discharged</option>
						</select>
					</div>
				</div>

				<div className="mt-5 overflow-x-auto">
					<table className="w-full min-w-[940px] text-left">
						<thead className="border-y border-[#EAF2F0] bg-[#F7FBFA] text-xs uppercase tracking-wide text-[#819596]"><tr><th className="px-4 py-3 font-semibold">Patient</th><th className="px-4 py-3 font-semibold">Condition</th><th className="px-4 py-3 font-semibold">Triage</th><th className="px-4 py-3 font-semibold">Arrival</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Action</th></tr></thead>
						<tbody className="divide-y divide-[#EAF2F0]">
							{filteredPatients.map((patient) => (
								<tr key={patient.id} className="transition hover:bg-[#FBFEFD]">
									<td className="px-4 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8F6] text-sm font-bold text-[#078F8A]">{patient.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><p className="font-semibold text-[#173F41]">{patient.name}</p><p className="mt-0.5 text-xs text-[#819596]">{patient.id} · {patient.age} yrs · {patient.gender}</p></div></div></td>
									<td className="max-w-[240px] px-4 py-4"><p className="font-semibold text-[#31585A]">{patient.condition}</p><p className="mt-1 truncate text-xs text-[#819596]">{patient.symptoms}</p></td>
									<td className="px-4 py-4"><Badge value={patient.triage} styles={triageStyles} /></td>
									<td className="px-4 py-4 text-sm text-[#31585A]"><span className="flex items-center gap-1.5"><Clock3 size={14} className="text-[#08A6A0]" />{patient.arrivalTime}</span></td>
									<td className="px-4 py-4"><select value={patient.status} onChange={(event) => updateStatus(patient.id, event.target.value)} className={`rounded-full border px-2.5 py-1 text-xs font-semibold outline-none ${statusStyles[patient.status]}`}><option>Awaiting Doctor</option><option>Under Treatment</option><option>Admitted</option><option>Discharged</option></select></td>
									<td className="px-4 py-4"><button type="button" onClick={() => setSelectedPatient(patient)} title="View patient details" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#078F8A]"><Eye size={16} /></button></td>
								</tr>
							))}
						</tbody>
					</table>
					{filteredPatients.length === 0 && <div className="py-12 text-center text-sm text-[#819596]">No emergency patients match the selected filters.</div>}
				</div>
			</div>

			{selectedPatient && <PatientDetails patient={selectedPatient} onClose={() => setSelectedPatient(null)} onStatusChange={updateStatus} />}
			{showAdd && <AddPatientModal form={form} onChange={updateForm} onSubmit={addPatient} onClose={() => setShowAdd(false)} />}
		</div>
	);
}

function SummaryCard({ icon: Icon, label, value, tone }) {
	const tones = { teal: "bg-[#E8F8F6] text-[#08A6A0]", red: "bg-red-50 text-red-600", blue: "bg-blue-50 text-blue-600", amber: "bg-amber-50 text-amber-600" };
	return <div className="rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4"><div className="flex items-center justify-between gap-2"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}><Icon size={18} /></span><strong className="text-2xl font-bold text-[#073F42]">{value}</strong></div><p className="mt-3 truncate text-xs font-semibold text-[#819596]">{label}</p></div>;
}

function PatientDetails({ patient, onClose, onStatusChange }) {
	return <div className="fixed inset-0 z-50 flex justify-end bg-[#073F42]/35 backdrop-blur-sm" onMouseDown={onClose}>
		<aside className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
			<div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#EAF2F0] bg-white px-5 py-5"><div><p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">{patient.id}</p><h2 className="mt-1 text-xl font-bold text-[#073F42]">{patient.name}</h2><p className="mt-1 text-sm text-[#819596]">Emergency patient information</p></div><button type="button" onClick={onClose} aria-label="Close patient details" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] hover:bg-[#E8F8F6]"><X size={18} /></button></div>
			<div className="space-y-5 p-5"><div className="flex flex-wrap items-center gap-2"><Badge value={patient.triage} styles={triageStyles} /><select value={patient.status} onChange={(event) => onStatusChange(patient.id, event.target.value)} className={`rounded-full border px-2.5 py-1 text-xs font-semibold outline-none ${statusStyles[patient.status]}`}><option>Awaiting Doctor</option><option>Under Treatment</option><option>Admitted</option><option>Discharged</option></select></div>
				<section><h3 className="mb-3 text-sm font-bold text-[#073F42]">Patient information</h3><div className="grid grid-cols-2 gap-3"><DetailItem label="Age / Gender" value={`${patient.age} years · ${patient.gender}`} icon={UserRound} /><DetailItem label="Blood group" value={patient.bloodGroup} icon={Droplets} /><DetailItem label="Phone" value={patient.phone} icon={Phone} /><DetailItem label="Arrival" value={patient.arrivalTime} icon={Clock3} /></div></section>
				<section><h3 className="mb-3 text-sm font-bold text-[#073F42]">Emergency condition</h3><div className="rounded-xl border border-red-100 bg-red-50/60 p-4"><p className="font-bold text-red-800">{patient.condition}</p><p className="mt-2 text-sm leading-6 text-red-700">{patient.symptoms}</p></div></section>
				<section><h3 className="mb-3 text-sm font-bold text-[#073F42]">Care assignment</h3><div className="grid grid-cols-2 gap-3"><DetailItem label="Doctor" value={patient.assignedDoctor} icon={Stethoscope} /><DetailItem label="Department" value={patient.department} icon={HeartPulse} /><DetailItem label="Location" value={patient.room} icon={MapPin} /><DetailItem label="Allergies" value={patient.allergies} icon={AlertCircle} /></div></section>
				<section className="rounded-xl border border-[#E2EFED] bg-[#F7FBFA] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#819596]">Emergency contact</p><p className="mt-2 font-semibold text-[#173F41]">{patient.emergencyContact}</p><p className="mt-1 text-sm text-[#31585A]">{patient.emergencyPhone}</p></section>
				<section><h3 className="mb-2 text-sm font-bold text-[#073F42]">Clinical notes</h3><p className="rounded-xl border border-[#E2EFED] p-4 text-sm leading-6 text-[#31585A]">{patient.notes || "No notes recorded."}</p></section>
			</div>
		</aside>
	</div>;
}

function AddPatientModal({ form, onChange, onSubmit, onClose }) {
	return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/35 p-4 backdrop-blur-sm" onMouseDown={onClose}><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between border-b border-[#EAF2F0] px-5 py-5"><div><p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">Emergency intake</p><h2 className="mt-1 text-xl font-bold text-[#073F42]">Add emergency patient</h2></div><button type="button" onClick={onClose} aria-label="Close add patient form" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] hover:bg-[#E8F8F6]"><X size={18} /></button></div><form onSubmit={onSubmit} className="space-y-5 p-5"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label="Patient name" name="name" value={form.name} onChange={onChange} required placeholder="Full name" /><Field label="Age" name="age" type="number" min="0" value={form.age} onChange={onChange} required placeholder="Age" /><SelectField label="Gender" name="gender" value={form.gender} onChange={onChange}><option>Male</option><option>Female</option><option>Other</option></SelectField><SelectField label="Blood group" name="bloodGroup" value={form.bloodGroup} onChange={onChange}><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></SelectField><Field label="Patient phone" name="phone" value={form.phone} onChange={onChange} required placeholder="Contact number" /><Field label="Emergency contact" name="emergencyContact" value={form.emergencyContact} onChange={onChange} required placeholder="Contact person" /><Field label="Emergency contact phone" name="emergencyPhone" value={form.emergencyPhone} onChange={onChange} required placeholder="Contact number" /><SelectField label="Triage priority" name="triage" value={form.triage} onChange={onChange}><option>Critical</option><option>Urgent</option><option>Stable</option></SelectField><Field label="Condition" name="condition" value={form.condition} onChange={onChange} required placeholder="Primary emergency condition" /><Field label="Symptoms" name="symptoms" value={form.symptoms} onChange={onChange} required placeholder="Main symptoms" /><Field label="Assigned doctor" name="assignedDoctor" value={form.assignedDoctor} onChange={onChange} /><Field label="Department" name="department" value={form.department} onChange={onChange} /><Field label="Room / bay" name="room" value={form.room} onChange={onChange} /><Field label="Allergies" name="allergies" value={form.allergies} onChange={onChange} /></div><label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#31585A]">Clinical notes</span><textarea name="notes" value={form.notes} onChange={onChange} rows="3" placeholder="Add relevant clinical notes" className="w-full rounded-lg border border-[#D9E9E7] px-3 py-2 text-sm text-[#173F41] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]" /></label><div className="flex justify-end gap-3 border-t border-[#EAF2F0] pt-4"><button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] hover:bg-[#F7FBFA]">Cancel</button><button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#08A6A0] px-4 text-sm font-semibold text-white hover:bg-[#078F8A]"><Plus size={16} /> Register Patient</button></div></form></div></div>;
}

export default Emergency;
