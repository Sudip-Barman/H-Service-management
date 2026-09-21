import { useEffect, useState } from "react";
import {
	AlertCircle,
	Bell,
	Building2,
	Check,
	CheckCircle2,
	Clock3,
	FileText,
	Globe2,
	Image as ImageIcon,
	LockKeyhole,
	Mail,
	MapPin,
	Save,
	ShieldCheck,
	SlidersHorizontal,
	Trash2,
	Upload,
	UserRound,
} from "lucide-react";
import { useHospitalSettings, DEFAULT_HOSPITAL_SETTINGS } from "../../../context/HospitalSettingsContext";
import { getErrorMessage } from "../../../api/api";

const tabs = [
	{ id: "hospital", label: "Hospital profile", icon: Building2 },
	{ id: "operations", label: "Operations", icon: SlidersHorizontal },
	{ id: "notifications", label: "Notifications", icon: Bell },
	{ id: "security", label: "Security", icon: ShieldCheck },
];

const Settings = () => {
	const { settings: globalSettings, updateSettings: saveGlobalSettings } = useHospitalSettings();
	const [activeTab, setActiveTab] = useState("hospital");
	const [settings, setSettings] = useState(globalSettings || DEFAULT_HOSPITAL_SETTINGS);
	const [saved, setSaved] = useState(false);
	const [toast, setToast] = useState(null);

	const showToast = (message, type = "success") => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3000);
	};

	useEffect(() => {
		if (globalSettings) {
			setSettings(globalSettings);
		}
	}, [globalSettings]);

	const updateSetting = (field, value) => {
		setSettings((current) => ({ ...current, [field]: value }));
		setSaved(false);
	};

	const handleSave = async () => {
		try {
			await saveGlobalSettings(settings);
			setSaved(true);
			showToast("Settings saved successfully!");
			window.setTimeout(() => setSaved(false), 2800);
		} catch (err) {
			console.error("Failed to save settings:", err);
			showToast(getErrorMessage(err, "Failed to save settings. Please try again."), "error");
		}
	};

	const resetSettings = () => {
		setSettings(globalSettings || DEFAULT_HOSPITAL_SETTINGS);
		setSaved(false);
	};

	return (
		<div className="dashboard-shell space-y-6 pb-8">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08A6A0]">
						Administration
					</p>
					<h1 className="mt-0.5 text-xl font-bold text-[#073F42] sm:text-2xl lg:text-3xl">
						Settings
					</h1>
					<p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
						Manage hospital details, workflows, notifications, and account security.
					</p>
				</div>
				<div className="flex items-center gap-2.5 sm:gap-3">
					<button
						type="button"
						onClick={resetSettings}
						className="h-10 sm:h-11 rounded-xl border border-[#D9E9E7] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#527071] transition hover:border-[#9FCAC6] hover:bg-white"
					>
						Reset changes
					</button>
					<button
						type="button"
						onClick={handleSave}
						className="inline-flex h-10 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-xl bg-[#08A6A0] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white transition hover:bg-[#078F8A]"
					>
						{saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
						{saved ? "Saved" : "Save changes"}
					</button>
				</div>
			</header>

			<div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
				<aside className="h-fit rounded-2xl border border-[#E2EFED] bg-white p-2 sm:p-3 shadow-sm">
					<div className="mb-2 rounded-xl bg-[#F1F8F7] px-3 py-2.5">
						<div className="flex items-center gap-2.5">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#DDF4F0] text-[#087F7A] overflow-hidden">
								{settings.logo ? (
									<img src={settings.logo} alt="Logo" className="h-full w-full object-contain p-1" />
								) : (
									<Building2 className="h-4 w-4" />
								)}
							</div>
							<div className="min-w-0">
								<p className="truncate text-xs sm:text-sm font-bold text-[#173F41]">
									{settings.hospitalName || "CareCore Hospital"}
								</p>
								<p className="mt-0.5 text-[10px] text-[#819596]">Administrator settings</p>
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
									className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs sm:text-sm font-semibold transition ${
										isActive
											? "bg-[#E5F7F4] text-[#087F7A]"
											: "text-[#527071] hover:bg-[#F4FAF9] hover:text-[#173F41]"
									}`}
								>
									<Icon className="h-4 w-4" />
									{tab.label}
								</button>
							);
						})}
					</nav>
					<div className="mt-3 border-t border-[#E8F0EF] px-3 pt-3">
						<p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.13em] text-[#9AAEB4]">Current plan</p>
						<p className="mt-1 text-xs sm:text-sm font-bold text-[#173F41]">Hospital Pro</p>
						<p className="mt-0.5 text-[10px] sm:text-xs leading-4 text-[#819596]">All clinical and administrative modules are enabled.</p>
					</div>
				</aside>

				<main className="min-w-0 rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm sm:p-6 lg:p-7">
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

			{toast && (
				<div
					className={`
						fixed bottom-6 right-6 z-50
						flex items-center gap-2.5
						rounded-2xl px-5 py-3.5
						text-sm font-semibold text-white shadow-2xl
						transition-all duration-300
						${toast.type === "error" ? "bg-red-600" : "bg-[#08A6A0]"}
					`}
				>
					{toast.type === "error" ? (
						<AlertCircle className="h-5 w-5 shrink-0" />
					) : (
						<CheckCircle2 className="h-5 w-5 shrink-0" />
					)}
					<span>{toast.message}</span>
				</div>
			)}
		</div>
	);
};

const SectionHeading = ({ eyebrow, title, description }) => (
	<div className="border-b border-[#E8F0EF] pb-4 sm:pb-5">
		<p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#08A6A0]">{eyebrow}</p>
		<h2 className="mt-1 text-base sm:text-lg md:text-xl font-extrabold text-[#073F42]">{title}</h2>
		<p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm leading-5 sm:leading-6 text-[#819596]">{description}</p>
	</div>
);

const HospitalProfile = ({ settings, updateSetting }) => {
	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) {
			alert("Logo image file size must be less than 2MB.");
			return;
		}
		const reader = new FileReader();
		reader.onload = (event) => {
			if (event.target?.result) {
				updateSetting("logo", event.target.result);
			}
		};
		reader.readAsDataURL(file);
	};

	return (
		<div>
			<SectionHeading
				eyebrow="Hospital identity"
				title="Hospital profile"
				description="Keep the information used across patient records, receipts, reports, and communications up to date."
			/>
			<div className="mt-5 grid gap-4 sm:grid-cols-2">
				<Field label="Hospital name" value={settings.hospitalName || ""} onChange={(value) => updateSetting("hospitalName", value)} />
				<Field label="Registration number" value={settings.registrationNumber || ""} onChange={(value) => updateSetting("registrationNumber", value)} />
				<Field label="Admin email" type="email" icon={Mail} value={settings.email || ""} onChange={(value) => updateSetting("email", value)} />
				<Field label="Contact phone" type="tel" value={settings.phone || ""} onChange={(value) => updateSetting("phone", value)} />
				<Field label="Website" icon={Globe2} value={settings.website || ""} onChange={(value) => updateSetting("website", value)} />
				<Field label="GSTIN / Tax ID" icon={FileText} value={settings.gstin || ""} onChange={(value) => updateSetting("gstin", value)} />
				<div className="sm:col-span-2">
					<Field label="Primary address" icon={MapPin} value={settings.address || ""} onChange={(value) => updateSetting("address", value)} />
				</div>
			</div>

			{/* Hospital Logo */}
			<div className="mt-5 rounded-xl border border-[#E2EFED] bg-white p-4">
				<span className="mb-1.5 block text-xs font-bold text-[#527071]">Hospital Logo & Favicon</span>
				<p className="mb-3 text-[11px] text-[#819596]">
					Used for the website header, login branding, invoices, reports, and automatically synced as the browser tab favicon.
				</p>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#D9E9E7] bg-[#F7FBFA] overflow-hidden">
						{settings.logo ? (
							<img src={settings.logo} alt="Hospital Logo" className="h-full w-full object-contain p-1" />
						) : (
							<Building2 className="h-7 w-7 text-[#087F7A]" />
						)}
					</div>
					<div className="flex-1 w-full space-y-2">
						<div className="flex gap-2">
							<div className="relative flex-1">
								<ImageIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />
								<input
									type="text"
									placeholder="Paste image URL (or upload below)"
									value={settings.logo || ""}
									onChange={(e) => updateSetting("logo", e.target.value)}
									className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-[#FBFDFC] pl-10 pr-3 text-xs sm:text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white"
								/>
							</div>
							{settings.logo && (
								<button
									type="button"
									onClick={() => updateSetting("logo", "")}
									className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
								>
									<Trash2 className="h-3.5 w-3.5" />
									Remove
								</button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#D9E9E7] bg-white px-3 py-1.5 text-xs font-semibold text-[#527071] transition hover:border-[#08A6A0] hover:text-[#087F7A]">
								<Upload className="h-3.5 w-3.5 text-[#08A6A0]" />
								<span>Upload image file</span>
								<input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
							</label>
							<span className="text-[10px] text-[#819596]">PNG, JPG, SVG, WebP up to 2MB</span>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 rounded-xl border border-[#E2EFED] bg-[#F7FBFA] p-3.5 sm:p-4">
				<div className="flex items-start gap-2.5 sm:gap-3">
					<div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-[#DDF4F0] text-[#087F7A]"><UserRound className="h-4 w-4" /></div>
					<div>
						<p className="text-xs sm:text-sm font-bold text-[#173F41]">Profile visibility</p>
						<p className="mt-0.5 text-[10px] sm:text-xs leading-4 sm:leading-5 text-[#819596]">These details are visible to patients on invoices, appointment confirmations, and service communications.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const Operations = ({ settings, updateSetting }) => (
	<div>
		<SectionHeading
			eyebrow="Care delivery"
			title="Operations"
			description="Set the default hours and timing rules used by reception, appointments, and service teams."
		/>
		<div className="mt-5 grid gap-4 sm:grid-cols-2">
			<SelectField label="Timezone" icon={Globe2} value={settings.timezone} onChange={(value) => updateSetting("timezone", value)} options={["Asia/Kolkata", "Asia/Dhaka", "UTC"]} />
			<SelectField label="Currency" value={settings.currency} onChange={(value) => updateSetting("currency", value)} options={["INR", "USD", "EUR"]} />
			<Field label="Opening time" type="time" icon={Clock3} value={settings.openingTime} onChange={(value) => updateSetting("openingTime", value)} />
			<Field label="Closing time" type="time" icon={Clock3} value={settings.closingTime} onChange={(value) => updateSetting("closingTime", value)} />
			<SelectField label="Default appointment duration" value={settings.appointmentDuration} onChange={(value) => updateSetting("appointmentDuration", value)} options={["15", "30", "45", "60"]} suffix="minutes" />
		</div>
		<div className="mt-6 border-t border-[#E8F0EF] pt-5">
			<h3 className="text-xs sm:text-sm font-bold text-[#173F41]">Operational defaults</h3>
			<div className="mt-3 space-y-2.5 sm:space-y-3">
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
		<div className="mt-5 space-y-2.5 sm:space-y-3">
			<Toggle label="Email notifications" description="Receive daily activity and workflow updates by email." checked={settings.emailNotifications} onChange={(value) => updateSetting("emailNotifications", value)} />
			<Toggle label="SMS notifications" description="Send important appointment and patient updates to registered contacts." checked={settings.smsNotifications} onChange={(value) => updateSetting("smsNotifications", value)} />
			<Toggle label="Emergency alerts" description="Always notify administrators about emergency requests and critical stock levels." checked={settings.emergencyAlerts} onChange={(value) => updateSetting("emergencyAlerts", value)} />
			<Toggle label="Weekly performance report" description="Receive a Monday summary covering patient flow, bookings, feedback, and revenue." checked={settings.weeklyReports} onChange={(value) => updateSetting("weeklyReports", value)} />
		</div>
		<div className="mt-6 rounded-xl border border-[#F3D39B] bg-[#FFF8EA] p-3 sm:p-4 text-xs sm:text-sm text-[#8A641F]">
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
		<div className="mt-5 space-y-2.5 sm:space-y-3">
			<Toggle label="Two-factor authentication" description="Require a verification code when administrators sign in from a new device." checked={settings.twoFactor} onChange={(value) => updateSetting("twoFactor", value)} />
		</div>
		<div className="mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2">
			<SecurityCard icon={LockKeyhole} title="Password policy" detail="Strong passwords required" action="Manage policy" />
			<SecurityCard icon={ShieldCheck} title="Active sessions" detail="2 administrator sessions" action="Review sessions" />
		</div>
		<div className="mt-6 border-t border-[#E8F0EF] pt-5">
			<h3 className="text-xs sm:text-sm font-bold text-[#173F41]">Account recovery</h3>
			<p className="mt-0.5 text-[10px] sm:text-xs leading-4 sm:leading-5 text-[#819596]">Recovery messages will be sent to the admin email configured in Hospital profile.</p>
			<button type="button" className="mt-3 rounded-xl border border-[#D8E3E6] px-3.5 py-2 text-xs font-bold text-[#31585A] hover:border-[#08A6A0] hover:text-[#087F7A]">Send recovery test</button>
		</div>
	</div>
);

const Field = ({ label, value, onChange, type = "text", icon: Icon }) => (
	<label className="block">
		<span className="mb-1.5 block text-xs font-bold text-[#527071]">{label}</span>
		<span className="relative block">
			{Icon && <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />}
			<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FBFDFC] pr-3 text-xs sm:text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10 ${Icon ? "pl-10" : "px-3"}`} />
		</span>
	</label>
);

const SelectField = ({ label, value, onChange, options, icon: Icon, suffix }) => (
	<label className="block">
		<span className="mb-1.5 block text-xs font-bold text-[#527071]">{label}</span>
		<span className="relative block">
			{Icon && <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />}
			<select value={value} onChange={(event) => onChange(event.target.value)} className={`h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FBFDFC] pr-3 text-xs sm:text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white ${Icon ? "pl-10" : "px-3"}`}>
				{options.map((option) => <option key={option} value={option}>{suffix ? `${option} ${suffix}` : option}</option>)}
			</select>
		</span>
	</label>
);

const Toggle = ({ label, description, checked, onChange }) => (
	<div className="flex items-center justify-between gap-3 sm:gap-4 rounded-xl border border-[#E2EFED] p-3 sm:p-4">
		<div>
			<p className="text-xs sm:text-sm font-bold text-[#31585A]">{label}</p>
			<p className="mt-0.5 max-w-xl text-[10px] sm:text-xs leading-4 sm:leading-5 text-[#819596]">{description}</p>
		</div>
		<button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-5 sm:h-6 w-9 sm:w-11 shrink-0 rounded-full transition ${checked ? "bg-[#08A6A0]" : "bg-[#C9D8D8]"}`}>
			<span className={`absolute top-0.5 sm:top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "left-4 sm:left-6" : "left-0.5 sm:left-1"}`} />
		</button>
	</div>
);

const SecurityCard = ({ icon: Icon, title, detail, action }) => (
	<div className="rounded-xl border border-[#E2EFED] p-3 sm:p-4">
		<Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#087F7A]" />
		<p className="mt-2.5 sm:mt-4 text-xs sm:text-sm font-bold text-[#31585A]">{title}</p>
		<p className="mt-0.5 text-[10px] sm:text-xs text-[#819596]">{detail}</p>
		<button type="button" className="mt-2.5 sm:mt-4 text-xs font-bold text-[#087F7A] hover:text-[#073F42]">{action}</button>
	</div>
);

export default Settings;
