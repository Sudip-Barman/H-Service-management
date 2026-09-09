import { useMemo, useState } from "react";
import {
	CheckCircle2,
	ChevronRight,
	Filter,
	Mail,
	MessageSquare,
	Search,
	Star,
	ThumbsUp,
	X,
} from "lucide-react";

const initialFeedback = [
	{
		id: "FB-2048",
		patient: "Priya Sharma",
		email: "priya.sharma@example.com",
		service: "Outpatient consultation",
		rating: 5,
		status: "New",
		date: "09 Sep 2026",
		comment:
			"The reception team was kind and the doctor explained every step clearly. The appointment started on time.",
		initials: "PS",
	},
	{
		id: "FB-2047",
		patient: "Rahul Das",
		email: "rahul.das@example.com",
		service: "Elder care support",
		rating: 4,
		status: "Reviewed",
		date: "08 Sep 2026",
		comment:
			"Very helpful care team. The follow-up call was thoughtful, although the waiting area was a little busy.",
		initials: "RD",
	},
	{
		id: "FB-2046",
		patient: "Maya Roy",
		email: "maya.roy@example.com",
		service: "Inpatient nursing",
		rating: 5,
		status: "Reviewed",
		date: "08 Sep 2026",
		comment:
			"The nurses were attentive throughout the night and kept our family updated regularly.",
		initials: "MR",
	},
	{
		id: "FB-2045",
		patient: "Arjun Sen",
		email: "arjun.sen@example.com",
		service: "Laboratory service",
		rating: 3,
		status: "Needs response",
		date: "07 Sep 2026",
		comment:
			"The report took longer than expected. It would be useful to receive an update if there is a delay.",
		initials: "AS",
	},
	{
		id: "FB-2044",
		patient: "Sneha Mukherjee",
		email: "sneha.m@example.com",
		service: "Home care booking",
		rating: 4,
		status: "Reviewed",
		date: "06 Sep 2026",
		comment:
			"Booking was simple and the caregiver arrived prepared. Thank you for the quick coordination.",
		initials: "SM",
	},
];

const statusStyles = {
	New: "border-[#B9E5DF] bg-[#E8F8F6] text-[#087F7A]",
	Reviewed: "border-[#D6E3EF] bg-[#EFF5FA] text-[#386A91]",
	"Needs response": "border-[#F3D39B] bg-[#FFF7E8] text-[#A9680A]",
};

const Feedback = () => {
	const [feedback, setFeedback] = useState(initialFeedback);
	const [search, setSearch] = useState("");
	const [ratingFilter, setRatingFilter] = useState("All ratings");
	const [statusFilter, setStatusFilter] = useState("All status");
	const [selectedFeedback, setSelectedFeedback] = useState(null);

	const filteredFeedback = useMemo(() => {
		const query = search.trim().toLowerCase();

		return feedback.filter((item) => {
			const matchesSearch =
				!query ||
				item.patient.toLowerCase().includes(query) ||
				item.email.toLowerCase().includes(query) ||
				item.service.toLowerCase().includes(query) ||
				item.comment.toLowerCase().includes(query) ||
				item.id.toLowerCase().includes(query);
			const matchesRating =
				ratingFilter === "All ratings" || item.rating === Number(ratingFilter);
			const matchesStatus =
				statusFilter === "All status" || item.status === statusFilter;

			return matchesSearch && matchesRating && matchesStatus;
		});
	}, [feedback, ratingFilter, search, statusFilter]);

	const averageRating = (
		feedback.reduce((total, item) => total + item.rating, 0) / feedback.length
	).toFixed(1);
	const responseCount = feedback.filter(
		(item) => item.status === "Needs response",
	).length;

	const markReviewed = (id) => {
		setFeedback((current) =>
			current.map((item) =>
				item.id === id ? { ...item, status: "Reviewed" } : item,
			),
		);
		setSelectedFeedback((current) =>
			current?.id === id ? { ...current, status: "Reviewed" } : current,
		);
	};

	return (
		<div className="dashboard-shell space-y-6 pb-8">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08A6A0]">
						Patient experience
					</p>
					<h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#073F42] sm:text-3xl">
						Feedback
					</h1>
					<p className="mt-2 text-sm text-[#819596]">
						Review what patients are saying about their care experience.
					</p>
				</div>
				<div className="flex items-center gap-2 text-xs font-semibold text-[#087F7A]">
					<span className="h-2 w-2 rounded-full bg-[#08A6A0]" />
					Feedback inbox is up to date
				</div>
			</header>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<SummaryCard label="Total responses" value={feedback.length} icon={MessageSquare} />
				<SummaryCard label="Average rating" value={`${averageRating}/5`} icon={Star} />
				<SummaryCard label="Positive responses" value="80%" icon={ThumbsUp} />
				<SummaryCard label="Needs response" value={responseCount} icon={CheckCircle2} tone="amber" />
			</section>

			<section className="rounded-2xl border border-[#D8E3E6] bg-white p-4 shadow-sm sm:p-5">
				<div className="flex flex-col gap-3 lg:flex-row">
					<div className="relative flex-1">
						<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AAEB4]" />
						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search patient, service, or feedback..."
							aria-label="Search feedback"
							className="h-11 w-full rounded-xl border border-[#D8E3E6] bg-[#FAFCFC] pl-10 pr-4 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:bg-white focus:ring-2 focus:ring-[#08A6A0]/10"
						/>
					</div>
					<div className="relative min-w-[170px]">
						<Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819596]" />
						<select
							value={ratingFilter}
							onChange={(event) => setRatingFilter(event.target.value)}
							className="h-11 w-full appearance-none rounded-xl border border-[#D8E3E6] bg-white pl-10 pr-3 text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
						>
							<option>All ratings</option>
							<option value="5">5 stars</option>
							<option value="4">4 stars</option>
							<option value="3">3 stars</option>
							<option value="2">2 stars</option>
							<option value="1">1 star</option>
						</select>
					</div>
					<select
						value={statusFilter}
						onChange={(event) => setStatusFilter(event.target.value)}
						className="h-11 min-w-[170px] rounded-xl border border-[#D8E3E6] bg-white px-3 text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
					>
						<option>All status</option>
						<option>New</option>
						<option>Reviewed</option>
						<option>Needs response</option>
					</select>
				</div>
			</section>

			<section className="overflow-hidden rounded-2xl border border-[#D8E3E6] bg-white shadow-sm">
				<div className="flex items-center justify-between border-b border-[#E8F0EF] px-5 py-4 sm:px-6">
					<div>
						<h2 className="font-bold text-[#073F42]">Recent patient feedback</h2>
						<p className="mt-1 text-xs text-[#819596]">
							Showing {filteredFeedback.length} of {feedback.length} responses
						</p>
					</div>
					<MessageSquare className="h-5 w-5 text-[#08A6A0]" />
				</div>

				<div className="divide-y divide-[#E8F0EF]">
					{filteredFeedback.map((item) => (
						<article key={item.id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FBFDFC] sm:flex-row sm:items-center sm:px-6">
							<div className="flex min-w-0 flex-1 items-start gap-3">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F7F4] text-xs font-bold text-[#087F7A]">
									{item.initials}
								</div>
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<h3 className="text-sm font-bold text-[#173F41]">{item.patient}</h3>
										<span className="text-[10px] font-semibold text-[#A6BABA]">{item.id}</span>
									</div>
									<a href={`mailto:${item.email}`} className="mt-1 inline-flex items-center gap-1 text-xs text-[#819596] hover:text-[#087F7A]">
										<Mail className="h-3 w-3" />
										{item.email}
									</a>
									<p className="mt-1 text-xs font-semibold text-[#4777A9]">{item.service}</p>
									<p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-5 text-[#6E8587]">{item.comment}</p>
								</div>
							</div>

							<div className="flex items-center justify-between gap-4 sm:justify-end">
								<div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
									{[1, 2, 3, 4, 5].map((star) => (
										<Star key={star} className={`h-4 w-4 ${star <= item.rating ? "fill-[#E6AA43] text-[#E6AA43]" : "text-[#D7E1E1]"}`} />
									))}
								</div>
								<span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles[item.status]}`}>
									{item.status}
								</span>
								<button
									type="button"
									onClick={() => setSelectedFeedback(item)}
									className="inline-flex items-center gap-1 text-xs font-bold text-[#087F7A] hover:text-[#073F42]"
								>
									View
									<ChevronRight className="h-4 w-4" />
								</button>
							</div>
						</article>
					))}
					{filteredFeedback.length === 0 && (
						<div className="px-6 py-12 text-center">
							<MessageSquare className="mx-auto h-8 w-8 text-[#B7C8C8]" />
							<p className="mt-3 text-sm font-bold text-[#31585A]">No feedback found</p>
							<p className="mt-1 text-xs text-[#819596]">Try changing your search or filters.</p>
						</div>
					)}
				</div>
			</section>

			{selectedFeedback && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/40 p-4 backdrop-blur-sm">
					<div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F7F4] text-sm font-bold text-[#087F7A]">
									{selectedFeedback.initials}
								</div>
								<div>
									<h2 className="font-bold text-[#073F42]">{selectedFeedback.patient}</h2>
									<p className="mt-1 text-xs text-[#819596]">{selectedFeedback.service} · {selectedFeedback.date}</p>
									<a href={`mailto:${selectedFeedback.email}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#087F7A] hover:text-[#073F42]">
										<Mail className="h-3.5 w-3.5" />
										{selectedFeedback.email}
									</a>
								</div>
							</div>
							<button type="button" onClick={() => setSelectedFeedback(null)} aria-label="Close feedback details" className="rounded-lg p-2 text-[#819596] hover:bg-[#F2F8F7] hover:text-[#173F41]">
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="mt-6 flex items-center gap-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star key={star} className={`h-5 w-5 ${star <= selectedFeedback.rating ? "fill-[#E6AA43] text-[#E6AA43]" : "text-[#D7E1E1]"}`} />
							))}
							<span className="ml-2 text-xs font-semibold text-[#819596]">{selectedFeedback.rating}/5 rating</span>
						</div>
						<blockquote className="mt-5 rounded-xl bg-[#F4FAF9] p-4 text-sm leading-6 text-[#31585A]">
							“{selectedFeedback.comment}”
						</blockquote>
						<div className="mt-6 flex items-center justify-between">
							<span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles[selectedFeedback.status]}`}>
								{selectedFeedback.status}
							</span>
							{selectedFeedback.status !== "Reviewed" && (
								<button type="button" onClick={() => markReviewed(selectedFeedback.id)} className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#078F8A]">
									<CheckCircle2 className="h-4 w-4" />
									Mark as reviewed
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const SummaryCard = ({ icon: Icon, label, value, tone = "teal" }) => {
	const iconStyles = tone === "amber" ? "bg-[#FFF0D2] text-[#A9680A]" : "bg-[#E5F7F4] text-[#087F7A]";

	return (
		<div className="rounded-2xl border border-[#D8E3E6] bg-white p-5 shadow-sm">
			<div className="flex items-center justify-between">
				<div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyles}`}>
					<Icon className="h-5 w-5" />
				</div>
				<span className="text-2xl font-extrabold tracking-tight text-[#073F42]">{value}</span>
			</div>
			<p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-[#819596]">{label}</p>
		</div>
	);
};

export default Feedback;
