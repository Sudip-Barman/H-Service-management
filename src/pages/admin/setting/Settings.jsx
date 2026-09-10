import { useState } from "react";
import {
	Bell,
	Building2,
	Check,
	Clock3,
	Globe2,
	LockKeyhole,
	Mail,
	MapPin,
	Save,
	ShieldCheck,
	SlidersHorizontal,
	UserRound,
} from "lucide-react";

const tabs = [
	{ id: "hospital", label: "Hospital profile", icon: Building2 },
	{ id: "operations", label: "Operations", icon: SlidersHorizontal },
	{ id: "notifications", label: "Notifications", icon: Bell },
	{ id: "security", label: "Security", icon: ShieldCheck },
];

const initialSettings = {
	hospitalName: "CareCore Hospital",
	registrationNumber: "HSP-KOL-2026-0048",
	email: "admin@carecore.com",
	phone: "+91 98765 00000",
	address: "12 Lake View Road, Salt Lake, Kolkata",
	website: "www.carecore.com",
	timezone: "Asia/Kolkata",
	openingTime: "06:00",
	closingTime: "22:00",
	appointmentDuration: "30",
	currency: "INR",
	emailNotifications: true,
	smsNotifications: true,
	emergencyAlerts: true,
	weeklyReports: false,
	twoFactor: true,
};

const Settings = () => {
	const [activeTab, setActiveTab] = useState("hospital");
	const [settings, setSettings] = useState(initialSettings);
	const [saved, setSaved] = useState(false);

	const updateSetting = (field, value) => {
		setSettings((current) => ({ ...current, [field]: value }));
		setSaved(false);
	};

	const handleSave = () => {
		setSaved(true);
		window.setTimeout(() => setSaved(false), 2800);
	};

	const resetSettings = () => {
		setSettings(initialSettings);
		setSaved(false);
	};

	return (
		<div className="dashboard-shell space-y-6 pb-8">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08A6A0]">
						Administration
					</p>
					<h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#073F42] sm:text-3xl">
						Settings
					</h1>
					<p className="mt-2 text-sm text-[#819596]">
						Manage hospital details, workflows, notifications, and account security.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={resetSettings}
						className="rounded-xl border border-[#D8E3E6] px-4 py-2.5 text-sm font-semibold text-[#527071] transition hover:border-[#9FCAC6] hover:bg-white"
					>
						Reset changes
					</button>
					<button
						type="button"
						onClick={handleSave}
						className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#078F8A]"
					>
						{saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
						{saved ? "Saved" : "Save changes"}
					</button>
				</div>
			</header>

			<div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
				<aside className="h-fit rounded-2xl border border-[#D8E3E6] bg-white p-2 shadow-sm">
					<div className="mb-2 rounded-xl bg-[#F1F8F7] px-3 py-3">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF4F0] text-[#087F7A]">
								<Building2 className="h-5 w-5" />
							</div>
							<div className="min-w-0">
								<p className="truncate text-sm font-bold text-[#173F41]">CareCore Hospital</p>
								<p className="mt-1 text-[10px] text-[#819596]">Administrator settings</p>
							</div>
						</div>
					</div>
					<nav className="space-y-1" aria-label="Settings sections">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.id;

							return (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
										isActive
											? "bg-[#E5F7F4] text-[#087F7A]"
											: "text-[#527071] hover:bg-[#F4FAF9] hover:text-[#173F41]"
									}`}
								>
									<Icon className="h-[18px] w-[18px]" />
									{tab.label}
								</button>
							);
						})}
					</nav>
					<div className="mt-4 border-t border-[#E8F0EF] px-3 pt-4">
						<p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9AAEB4]">Current plan</p>
						<p className="mt-2 text-sm font-bold text-[#173F41]">Hospital Pro</p>
						<p className="mt-1 text-xs leading-5 text-[#819596]">All clinical and administrative modules are enabled.</p>
					</div>
				</aside>

				<main className="min-w-0 rounded-2xl border border-[#D8E3E6] bg-white p-5 shadow-sm sm:p-7">
					{activeTab === "hospital" && (
						<HospitalProfile settings={settings} updateSetting={updateSetting} />
					)}
					{activeTab === "operations" && (
						<Operations settings={settings} updateSetting={updateSetting} />
					)}
					{activeTab === "notifications" && (
						<NotificationSettings settings={settings} updateSetting={updateSetting} />
					)}
					{activeTab === "security" && (
						<SecuritySettings settings={settings} updateSetting={updateSetting} />
					)}
				</main>
			</div>
		</div>
	);
};

const SectionHeading = ({ eyebrow, title, description }) => (
	<div className="border-b border-[#E8F0EF] pb-5">
		<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#08A6A0]">{eyebrow}</p>
		<h2 className="mt-1 text-xl font-extrabold text-[#073F42]">{title}</h2>
		<p className="mt-2 max-w-2xl text-sm leading-6 text-[#819596]">{description}</p>
	</div>
);

const HospitalProfile = ({ settings, updateSetting }) => (
	<div>
		<SectionHeading
			eyebrow="Hospital identity"
			title="Hospital profile"
			description="Keep the information used across patient records, receipts, reports, and communications up to date."
		/>
		<div className="mt-6 grid gap-5 sm:grid-cols-2">
			<Field label="Hospital name" value={settings.hospitalName} onChange={(value) => updateSetting("hospitalName", value)} />
			<Field label="Registration number" value={settings.registrationNumber} onChange={(value) => updateSetting("registrationNumber", value)} />
			<Field label="Admin email" type="email" icon={Mail} value={settings.email} onChange={(value) => updateSetting("email", value)} />
			<Field label="Contact phone" type="tel" value={settings.phone} onChange={(value) => updateSetting("phone", value)} />
			<Field label="Website" icon={Globe2} value={settings.website} onChange={(value) => updateSetting("website", value)} />
			<Field label="Primary address" icon={MapPin} value={settings.address} onChange={(value) => updateSetting("address", value)} />
		</div>
		<div className="mt-8 rounded-xl border border-[#D8E3E6] bg-[#F7FBFA] p-4">
			<div className="flex items-start gap-3">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DDF4F0] text-[#087F7A]"><UserRound className="h-4 w-4" /></div>
				<div>
					<p className="text-sm font-bold text-[#173F41]">Profile visibility</p>
					<p className="mt-1 text-xs leading-5 text-[#819596]">These details are visible to patients on appointment confirmations and service communications.</p>
				</div>
			</div>
		</div>
	</div>
);

const Operations = ({ settings, updateSetting }) => (
	<div>
		<SectionHeading
			eyebrow="Care delivery"
			title="Operations"
			description="Set the default hours and timing rules used by reception, appointments, and service teams."
		/>
		<div className="mt-6 grid gap-5 sm:grid-cols-2">
			<SelectField label="Timezone" icon={Globe2} value={settings.timezone} onChange={(value) => updateSetting("timezone", value)} options={["Asia/Kolkata", "Asia/Dhaka", "UTC"]} />
			<SelectField label="Currency" value={settings.currency} onChange={(value) => updateSetting("currency", value)} options={["INR", "USD", "EUR"]} />
			<Field label="Opening time" type="time" icon={Clock3} value={settings.openingTime} onChange={(value) => updateSetting("openingTime", value)} />
			<Field label="Closing time" type="time" icon={Clock3} value={settings.closingTime} onChange={(value) => updateSetting("closingTime", value)} />
			<SelectField label="Default appointment duration" value={settings.appointmentDuration} onChange={(value) => updateSetting("appointmentDuration", value)} options={["15", "30", "45", "60"]} suffix="minutes" />
		</div>
		<div className="mt-8 border-t border-[#E8F0EF] pt-6">
			<h3 className="text-sm font-bold text-[#173F41]">Operational defaults</h3>
			<div className="mt-4 space-y-3">
				<Toggle label="Allow online appointment requests" description="Patients can request available appointment slots from the public website." checked={true} onChange={() => {}} />
				<Toggle label="Require patient confirmation" description="Ask patients to confirm appointments before they are added to the schedule." checked={true} onChange={() => {}} />
			</div>
		</div>
	</div>
);

const NotificationSettings = ({ settings, updateSetting }) => (
	<div>
		<SectionHeading
			eyebrow="Communication centre"
			title="Notifications"
			description="Choose which updates reach your administration team and how urgent hospital events are surfaced."
		/>
		<div className="mt-6 space-y-3">
			<Toggle label="Email notifications" description="Receive daily activity and workflow updates by email." checked={settings.emailNotifications} onChange={(value) => updateSetting("emailNotifications", value)} />
			<Toggle label="SMS notifications" description="Send important appointment and patient updates to registered contacts." checked={settings.smsNotifications} onChange={(value) => updateSetting("smsNotifications", value)} />
			<Toggle label="Emergency alerts" description="Always notify administrators about emergency requests and critical stock levels." checked={settings.emergencyAlerts} onChange={(value) => updateSetting("emergencyAlerts", value)} />
			<Toggle label="Weekly performance report" description="Receive a Monday summary covering patient flow, bookings, feedback, and revenue." checked={settings.weeklyReports} onChange={(value) => updateSetting("weeklyReports", value)} />
		</div>
		<div className="mt-8 rounded-xl border border-[#F3D39B] bg-[#FFF8EA] p-4 text-sm text-[#8A641F]">
			Emergency alerts cannot be muted for the administrator account.
		</div>
	</div>
);

const SecuritySettings = ({ settings, updateSetting }) => (
	<div>
		<SectionHeading
			eyebrow="Access control"
			title="Security"
			description="Protect patient information with stronger sign-in controls and session policies."
		/>
		<div className="mt-6 space-y-3">
			<Toggle label="Two-factor authentication" description="Require a verification code when administrators sign in from a new device." checked={settings.twoFactor} onChange={(value) => updateSetting("twoFactor", value)} />
		</div>
		<div className="mt-8 grid gap-4 sm:grid-cols-2">
			<SecurityCard icon={LockKeyhole} title="Password policy" detail="Strong passwords required" action="Manage policy" />
			<SecurityCard icon={ShieldCheck} title="Active sessions" detail="2 administrator sessions" action="Review sessions" />
		</div>
		<div className="mt-8 border-t border-[#E8F0EF] pt-6">
			<h3 className="text-sm font-bold text-[#173F41]">Account recovery</h3>
			<p className="mt-1 text-xs leading-5 text-[#819596]">Recovery messages will be sent to the admin email configured in Hospital profile.</p>
			<button type="button" className="mt-4 rounded-xl border border-[#D8E3E6] px-4 py-2.5 text-xs font-bold text-[#31585A] hover:border-[#08A6A0] hover:text-[#087F7A]">Send recovery test</button>
		</div>
	</div>
);

const Field = ({ label, value, onChange, type = "text", icon: Icon }) => (
	<label className="block">
		<span className="mb-2 block text-xs font-bold text-[#527071]">{label}</span>
		<span className="relative block">
			{Icon && <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />}
			<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`h-11 w-full rounded-xl border border-[#D8E3E6] bg-[#FBFDFC] pr-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10 ${Icon ? "pl-10" : "px-3"}`} />
		</span>
	</label>
);

const SelectField = ({ label, value, onChange, options, icon: Icon, suffix }) => (
	<label className="block">
		<span className="mb-2 block text-xs font-bold text-[#527071]">{label}</span>
		<span className="relative block">
			{Icon && <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />}
			<select value={value} onChange={(event) => onChange(event.target.value)} className={`h-11 w-full rounded-xl border border-[#D8E3E6] bg-[#FBFDFC] pr-3 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white ${Icon ? "pl-10" : "px-3"}`}>
				{options.map((option) => <option key={option} value={option}>{suffix ? `${option} ${suffix}` : option}</option>)}
			</select>
		</span>
	</label>
);

const Toggle = ({ label, description, checked, onChange }) => (
	<div className="flex items-center justify-between gap-4 rounded-xl border border-[#E2ECEB] p-4">
		<div>
			<p className="text-sm font-bold text-[#31585A]">{label}</p>
			<p className="mt-1 max-w-xl text-xs leading-5 text-[#819596]">{description}</p>
		</div>
		<button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#08A6A0]" : "bg-[#C9D8D8]"}`}>
			<span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} />
		</button>
	</div>
);

const SecurityCard = ({ icon: Icon, title, detail, action }) => (
	<div className="rounded-xl border border-[#E2ECEB] p-4">
		<Icon className="h-5 w-5 text-[#087F7A]" />
		<p className="mt-4 text-sm font-bold text-[#31585A]">{title}</p>
		<p className="mt-1 text-xs text-[#819596]">{detail}</p>
		<button type="button" className="mt-4 text-xs font-bold text-[#087F7A] hover:text-[#073F42]">{action}</button>
	</div>
);

export default Settings;
