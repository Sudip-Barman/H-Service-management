import { useMemo, useState } from "react";
import {
	Bell,
	Check,
	CheckCheck,
	Eye,
	Filter,
	Info,
	Megaphone,
	Plus,
	Search,
	Trash2,
	TriangleAlert,
	X,
} from "lucide-react";

const initialNotifications = [
	{
		id: 1,
		title: "Blood Bank Stock Alert",
		message: "O negative blood stock is below the emergency reserve level.",
		type: "Blood Bank",
		priority: "Urgent",
		department: "Blood Bank",
		recipient: "All Clinical Staff",
		date: "2026-09-09",
		time: "09:15",
		read: false,
	},
	{
		id: 2,
		title: "Medicine Expiry Reminder",
		message: "12 medicine batches are approaching their expiry date.",
		type: "Pharmacy",
		priority: "High",
		department: "Pharmacy",
		recipient: "Pharmacy Team",
		date: "2026-09-09",
		time: "08:40",
		read: false,
	},
	{
		id: 3,
		title: "Laboratory Equipment Maintenance",
		message: "The ECG machine in Diagnostic Room 2 is due for maintenance.",
		type: "Laboratory",
		priority: "Normal",
		department: "Laboratory",
		recipient: "Lab Technicians",
		date: "2026-09-08",
		time: "16:30",
		read: true,
	},
	{
		id: 4,
		title: "Emergency Department Roster Updated",
		message: "The emergency department staff schedule has been updated.",
		type: "Staff",
		priority: "Normal",
		department: "Emergency",
		recipient: "Emergency Staff",
		date: "2026-09-08",
		time: "14:05",
		read: true,
	},
];

const emptyForm = {
	title: "",
	message: "",
	type: "General",
	priority: "Normal",
	department: "All Departments",
	recipient: "All Hospital Staff",
};

const typeStyles = {
	"Blood Bank": "bg-red-50 text-red-700",
	Pharmacy: "bg-blue-50 text-blue-700",
	Laboratory: "bg-purple-50 text-purple-700",
	Staff: "bg-amber-50 text-amber-700",
	General: "bg-slate-100 text-slate-700",
};

const priorityStyles = {
	Urgent: "bg-red-50 text-red-700",
	High: "bg-orange-50 text-orange-700",
	Normal: "bg-emerald-50 text-emerald-700",
};

const Notification = () => {
	const [notifications, setNotifications] = useState(initialNotifications);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState("All");
	const [showForm, setShowForm] = useState(false);
	const [selectedNotification, setSelectedNotification] = useState(null);
	const [form, setForm] = useState(emptyForm);

	const filteredNotifications = useMemo(() => {
		const value = search.trim().toLowerCase();

		return notifications.filter((notification) => {
			const matchesSearch =
				!value ||
				notification.title.toLowerCase().includes(value) ||
				notification.message.toLowerCase().includes(value) ||
				notification.department.toLowerCase().includes(value);
			const matchesType = typeFilter === "All" || notification.type === typeFilter;
			const matchesStatus =
				statusFilter === "All" ||
				(statusFilter === "Unread" ? !notification.read : notification.read);

			return matchesSearch && matchesType && matchesStatus;
		});
	}, [notifications, search, typeFilter, statusFilter]);

	const unreadCount = notifications.filter((notification) => !notification.read).length;

	const updateForm = (field, value) => {
		setForm((current) => ({ ...current, [field]: value }));
	};

	const openCreateForm = () => {
		setForm(emptyForm);
		setShowForm(true);
	};

	const saveNotification = (event) => {
		event.preventDefault();

		if (!form.title.trim() || !form.message.trim()) return;

			setNotifications((current) => [
				{
					id: Date.now(),
					...form,
					date: new Date().toISOString().slice(0, 10),
					time: new Date().toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
					read: false,
				},
				...current,
			]);

		setShowForm(false);
	};

	const markAsRead = (id) => {
		setNotifications((current) =>
			current.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification
			)
		);
	};

	const openNotificationDetails = (notification) => {
		setSelectedNotification(notification);
		markAsRead(notification.id);
	};

	const markAllAsRead = () => {
		setNotifications((current) =>
			current.map((notification) => ({ ...notification, read: true }))
		);
	};

	const deleteNotification = (id) => {
		setNotifications((current) =>
			current.filter((notification) => notification.id !== id)
		);
	};

	return (
		<div className="min-h-screen bg-[#F7FBFA]">
			<header className="border-b border-[#E2EFED] bg-white">
				<div className="flex flex-col gap-3 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
					<div className="flex items-center gap-2.5 sm:gap-3">
						<div className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-[#E8F8F6] text-[#08A6A0]">
							<Bell className="h-5 w-5 md:h-6 md:w-6" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-[#073F42] sm:text-2xl lg:text-3xl">Notifications</h1>
							<p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
								Hospital-wide alerts, updates and operational information
							</p>
						</div>
					</div>

					<div className="flex flex-wrap gap-2 sm:gap-3">
						<button
							type="button"
							onClick={markAllAsRead}
							disabled={unreadCount === 0}
							className="inline-flex h-10 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-xl border border-[#D9E9E7] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] disabled:cursor-not-allowed disabled:opacity-50"
						>
							<CheckCheck size={16} />
							Mark all read
						</button>
						<button
							type="button"
							onClick={openCreateForm}
							className="inline-flex h-10 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-xl bg-[#08A6A0] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#078F8A]"
						>
							<Plus size={17} />
							New Notification
						</button>
					</div>
				</div>
			</header>

			<main className="space-y-4 sm:space-y-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
				<div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
					<SummaryCard label="Total Notifications" value={notifications.length} icon={Bell} />
					<SummaryCard label="Unread Notifications" value={unreadCount} icon={Info} type="warning" />
					<SummaryCard label="Urgent Notifications" value={notifications.filter((item) => item.priority === "Urgent").length} icon={TriangleAlert} type="danger" />
				</div>

				<section className="rounded-2xl border border-[#E2EFED] bg-white p-3 sm:p-4 shadow-sm">
					<div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row">
						<div className="relative flex-1">
							<Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AAEAF]" />
							<input
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Search notifications..."
								className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FBFDFD] pl-10 pr-3.5 text-xs sm:text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
							/>
						</div>
						<div className="relative min-w-[170px]">
							<Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#819596]" />
							<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="h-10 sm:h-11 w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white pl-10 pr-3.5 text-xs sm:text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]">
								<option value="All">All Types</option>
								<option value="Blood Bank">Blood Bank</option>
								<option value="Pharmacy">Pharmacy</option>
								<option value="Laboratory">Laboratory</option>
								<option value="Staff">Staff</option>
								<option value="General">General</option>
							</select>
						</div>
						<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 sm:h-11 min-w-[140px] rounded-xl border border-[#D9E9E7] bg-white px-3.5 text-xs sm:text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]">
							<option value="All">All Status</option>
							<option value="Unread">Unread</option>
							<option value="Read">Read</option>
						</select>
					</div>
				</section>

				<section className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
					<div className="border-b border-[#EAF2F0] px-4 py-3.5 sm:px-5 sm:py-4">
						<h2 className="text-sm sm:text-base font-bold text-[#073F42]">Hospital Notifications</h2>
						<p className="mt-0.5 text-[10px] sm:text-xs text-[#819596]">Showing {filteredNotifications.length} of {notifications.length} notifications</p>
					</div>

					{/* Desktop table */}
					<div className="hidden overflow-x-auto md:block">
						<table className="w-full min-w-[1050px]">
							<thead className="bg-[#FBFDFD]">
								<tr className="border-b border-[#EAF2F0] text-left">
									{['Notification', 'Type', 'Priority', 'Department', 'Recipient', 'Date', 'Status', 'Actions'].map((heading) => (
										<th key={heading} className="px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-[#819596]">{heading}</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-[#EAF2F0]">
								{filteredNotifications.map((notification) => (
									<tr key={notification.id} className={`transition hover:bg-[#FBFDFD] ${!notification.read ? "bg-[#F7FBFA]" : ""}`}>
										<td className="max-w-[320px] px-5 py-3.5">
											<div className="flex items-start gap-3">
												<div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]"><Megaphone size={16} /></div>
												<div>
													<p className="text-sm font-semibold text-[#173F41]">{notification.title}</p>
													<p className="mt-0.5 text-xs leading-5 text-[#819596]">{notification.message}</p>
												</div>
											</div>
										</td>
										<td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[notification.type] || typeStyles.General}`}>{notification.type}</span></td>
										<td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[notification.priority]}`}>{notification.priority}</span></td>
										<td className="px-5 py-3.5 text-sm text-[#31585A]">{notification.department}</td>
										<td className="px-5 py-3.5 text-sm text-[#31585A]">{notification.recipient}</td>
										<td className="px-5 py-3.5 text-sm text-[#31585A]"><p>{notification.date}</p><p className="mt-0.5 text-xs text-[#9AAEAF]">{notification.time}</p></td>
										<td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${notification.read ? "text-[#819596]" : "text-[#08A6A0]"}`}>{notification.read ? <Check size={14} /> : <Bell size={14} />}{notification.read ? "Read" : "Unread"}</span></td>
										<td className="px-5 py-3.5"><div className="flex items-center gap-1">
											<button type="button" title="View full notification" onClick={() => openNotificationDetails(notification)} className="rounded-lg p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"><Eye size={16} /></button>
											{!notification.read && <button type="button" title="Mark as read" onClick={() => markAsRead(notification.id)} className="rounded-lg p-2 text-[#08A6A0] hover:bg-[#E8F8F6]"><Check size={16} /></button>}
											<button type="button" title="Delete notification" onClick={() => deleteNotification(notification.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
										</div></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Mobile Notification Cards */}
					<div className="space-y-3 p-3 md:hidden">
						{filteredNotifications.map((notification) => (
							<div
								key={notification.id}
								className={`rounded-xl border border-[#E2EFED] bg-white p-3.5 shadow-sm transition ${!notification.read ? "bg-[#F7FBFA]" : ""}`}
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-start gap-2.5 min-w-0">
										<div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
											<Megaphone size={14} />
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate text-xs sm:text-sm font-bold text-[#073F42]">{notification.title}</p>
											<p className="mt-0.5 text-[10px] sm:text-xs text-[#819596]">{notification.date} · {notification.time}</p>
										</div>
									</div>
									<span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${priorityStyles[notification.priority]}`}>
										{notification.priority}
									</span>
								</div>

								<p className="mt-2 text-xs leading-relaxed text-[#31585A]">{notification.message}</p>

								<div className="mt-3 grid grid-cols-2 gap-2">
									<div className="rounded-lg bg-[#FAFDFC] p-2">
										<p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Department</p>
										<p className="mt-0.5 truncate text-xs font-semibold text-[#073F42]">{notification.department}</p>
									</div>
									<div className="rounded-lg bg-[#FAFDFC] p-2">
										<p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Recipient</p>
										<p className="mt-0.5 truncate text-xs font-semibold text-[#073F42]">{notification.recipient}</p>
									</div>
								</div>

								<div className="mt-3 flex items-center justify-between border-t border-[#EAF2F0] pt-2.5">
									<span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold ${notification.read ? "text-[#819596]" : "text-[#08A6A0]"}`}>
										{notification.read ? <Check size={13} /> : <Bell size={13} />}
										{notification.read ? "Read" : "Unread"}
									</span>
									<div className="flex items-center gap-1">
										<button
											type="button"
											title="View notification"
											onClick={() => openNotificationDetails(notification)}
											className="rounded-lg p-1.5 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
										>
											<Eye size={15} />
										</button>
										{!notification.read && (
											<button
												type="button"
												title="Mark as read"
												onClick={() => markAsRead(notification.id)}
												className="rounded-lg p-1.5 text-[#08A6A0] hover:bg-[#E8F8F6]"
											>
												<Check size={15} />
											</button>
										)}
										<button
											type="button"
											title="Delete notification"
											onClick={() => deleteNotification(notification.id)}
											className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
										>
											<Trash2 size={15} />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{filteredNotifications.length === 0 && <div className="px-5 py-12 text-center text-xs sm:text-sm text-[#819596]">No notifications match the current filters.</div>}
				</section>
			</main>

			{showForm && <NotificationForm form={form} onChange={updateForm} onSubmit={saveNotification} onClose={() => setShowForm(false)} />}
			{selectedNotification && <NotificationDetails notification={selectedNotification} onClose={() => setSelectedNotification(null)} />}
		</div>
	);
};

const SummaryCard = ({ label, value, icon: Icon, type = "primary" }) => {
	const colors = { primary: "bg-[#E8F8F6] text-[#08A6A0]", warning: "bg-amber-50 text-amber-600", danger: "bg-red-50 text-red-600" };
	return (
		<div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
			<div className="flex items-center justify-between gap-1.5 sm:gap-2">
				<div className="min-w-0 flex-1">
					<p className="truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">{label}</p>
					<p className="mt-0.5 sm:mt-1 text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">{value}</p>
				</div>
				<div className={`flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl ${colors[type]} [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5`}>
					<Icon />
				</div>
			</div>
		</div>
	);
};

const NotificationDetails = ({ notification, onClose }) => (
	<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">
		<div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
			<div className="flex items-start justify-between border-b border-[#EAF2F0] px-6 py-5">
				<div className="flex items-start gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]"><Bell size={19} /></div>
					<div>
						<h2 className="text-xl font-bold text-[#073F42]">{notification.title}</h2>
						<p className="mt-1 text-sm text-[#819596]">{notification.date} at {notification.time}</p>
					</div>
				</div>
				<button type="button" onClick={onClose} className="rounded-xl p-2 text-[#819596] hover:bg-[#E8F8F6]"><X size={21} /></button>
			</div>
			<div className="space-y-5 p-6">
				<p className="rounded-xl bg-[#FBFDFD] p-4 text-sm leading-6 text-[#31585A]">{notification.message}</p>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<DetailValue label="Type" value={notification.type} />
					<DetailValue label="Priority" value={notification.priority} />
					<DetailValue label="Department" value={notification.department} />
					<DetailValue label="Recipient" value={notification.recipient} />
					<DetailValue label="Status" value={notification.read ? "Read" : "Unread"} />
				</div>
				<div className="flex justify-end border-t border-[#EAF2F0] pt-5"><button type="button" onClick={onClose} className="rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#078F8A]">Close</button></div>
			</div>
		</div>
	</div>
);

const DetailValue = ({ label, value }) => <div className="rounded-xl border border-[#EAF2F0] p-4"><p className="text-xs text-[#819596]">{label}</p><p className="mt-1 text-sm font-semibold text-[#31585A]">{value}</p></div>;

const NotificationForm = ({ form, onChange, onSubmit, onClose }) => (
	<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-2.5 sm:p-4 md:p-6 backdrop-blur-sm">
		<div className="max-h-[92vh] sm:max-h-[94vh] w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
			<div className="flex items-start justify-between border-b border-[#EAF2F0] px-4 py-3 sm:px-6 sm:py-4"><div><h2 className="text-base sm:text-xl font-bold text-[#073F42]">New Notification</h2><p className="mt-0.5 text-xs text-[#819596]">Share important information with hospital teams</p></div><button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl p-1 text-[#819596] hover:bg-[#E8F8F6]"><X size={18} /></button></div>
			<form onSubmit={onSubmit} className="max-h-[calc(92vh-80px)] space-y-4 overflow-y-auto p-4 sm:p-6">
				<Field label="Title" value={form.title} onChange={(value) => onChange("title", value)} placeholder="Notification title" />
				<div><label className="mb-1.5 block text-xs font-semibold text-[#31585A]">Message</label><textarea required rows="4" value={form.message} onChange={(event) => onChange("message", event.target.value)} placeholder="Write the hospital update..." className="w-full rounded-xl border border-[#D9E9E7] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]" /></div>
				<div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
					<SelectField label="Type" value={form.type} onChange={(value) => onChange("type", value)} options={["General", "Blood Bank", "Pharmacy", "Laboratory", "Staff"]} />
					<SelectField label="Priority" value={form.priority} onChange={(value) => onChange("priority", value)} options={["Normal", "High", "Urgent"]} />
					<Field label="Department" value={form.department} onChange={(value) => onChange("department", value)} placeholder="All Departments" />
					<Field label="Recipient" value={form.recipient} onChange={(value) => onChange("recipient", value)} placeholder="All Hospital Staff" />
				</div>
				<div className="flex justify-end gap-2 sm:gap-3 border-t border-[#EAF2F0] pt-4"><button type="button" onClick={onClose} className="h-10 sm:h-11 rounded-xl border border-[#D9E9E7] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-[#31585A]">Cancel</button><button type="submit" className="h-10 sm:h-11 rounded-xl bg-[#08A6A0] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[#078F8A]">Send Notification</button></div>
			</form>
		</div>
	</div>
);

const Field = ({ label, value, onChange, placeholder }) => <div><label className="mb-1.5 block text-xs font-semibold text-[#31585A]">{label}</label><input required value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] px-3 sm:px-4 text-xs sm:text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]" /></div>;

const SelectField = ({ label, value, onChange, options }) => <div><label className="mb-1.5 block text-xs font-semibold text-[#31585A]">{label}</label><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 sm:px-4 text-xs sm:text-sm outline-none focus:border-[#08A6A0]">{options.map((option) => <option key={option}>{option}</option>)}</select></div>;

export default Notification;
