import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookText,
  ChevronDown,
  ChevronUp,
  Clock3,
  Headphones,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const supportStats = [
  {
    label: "Open cases",
    value: "04",
    icon: Ticket,
    accent: "bg-[#E8F8F6] text-[#08A6A0]",
  },
  {
    label: "Avg. response",
    value: "< 30 min",
    icon: Clock3,
    accent: "bg-[#EEF5FF] text-[#2F6FED]",
  },
  {
    label: "Escalations",
    value: "02",
    icon: AlertTriangle,
    accent: "bg-[#FFF2E8] text-[#D97706]",
  },
];

const quickHelp = [
  {
    title: "Schedule support",
    description: "Update shift timings, roster changes, or leave requests.",
    icon: BookText,
  },
  {
    title: "Patient care help",
    description: "Resolve patient assignment, history, or care coordination issues.",
    icon: ShieldCheck,
  },
  {
    title: "Technical issue",
    description: "Report login problems, app bugs, or system access concerns.",
    icon: Headphones,
  },
];

const faqItems = [
  {
    question: "How do I update my availability or shift schedule?",
    answer:
      "Open My Schedule from the workforce menu, review your assigned shifts, and submit any required change request through the schedule action panel.",
  },
  {
    question: "Who do I contact for a patient-related issue?",
    answer:
      "For patient assignment or care coordination concerns, contact your department lead or use the patient care support channel from this page to request quick assistance.",
  },
  {
    question: "How fast can I expect a response?",
    answer:
      "Most attendance, schedule, and account questions are answered within 30 minutes during working hours. Urgent clinical or safety issues are escalated immediately.",
  },
  {
    question: "What should I do if I cannot access the portal?",
    answer:
      "First confirm your login details, then contact the support desk using the emergency contact options below. Our team can verify your account access and reset permissions if needed.",
  },
];

const recentTickets = [
  {
    title: "Shift time correction requested",
    status: "In progress",
    updated: "10 mins ago",
  },
  {
    title: "Patient assignment mismatch",
    status: "Resolved",
    updated: "1 hour ago",
  },
  {
    title: "Login access issue",
    status: "Pending review",
    updated: "Today",
  },
];

const statusStyles = {
  "In progress": "bg-[#E8F8F6] text-[#087F7B]",
  Resolved: "bg-[#EAF7EE] text-[#1F7A3D]",
  "Pending review": "bg-[#FFF7E6] text-[#9A6B00]",
};

export default function HelpSupport({ user }) {
  const [openFaq, setOpenFaq] = useState(0);

  const employeeName = user?.name?.split(" ")[0] || "Team member";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#08A6A0]">
            Support Center
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#073F42] sm:text-3xl">
            Help & Support
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Hi {employeeName}, we’re here to help you with schedules, patient care,
            attendance, and any workplace issues.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(8,166,160,0.2)] transition hover:bg-[#078f8a]"
        >
          <MessageSquareText size={17} />
          Request Help
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {supportStats.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#E7EFEE] bg-white p-5 shadow-[0_2px_12px_rgba(7,63,66,0.03)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                <Icon size={18} />
              </div>

              <ArrowRight size={18} className="text-[#8EA3A2]" />
            </div>

            <p className="mt-4 text-sm text-[#728786]">{label}</p>
            <p className="mt-1 text-2xl font-bold text-[#073F42]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-[#E7EFEE] bg-white p-5 shadow-[0_2px_12px_rgba(7,63,66,0.03)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <Headphones size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#073F42]">
                Quick help topics
              </h2>
              <p className="text-sm text-[#6D8585]">
                Choose the issue that matches your concern.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickHelp.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#EFF4F4] bg-[#F9FDFC] p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                  <Icon size={18} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-[#073F42]">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#617977]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-[#E7EFEE] bg-[#073F42] p-5 text-white shadow-[0_2px_12px_rgba(7,63,66,0.08)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#8DE1DC]">
              <Phone size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Urgent support</h2>
              <p className="text-sm text-[#B8CDCD]">24/7 assistance</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[#A8D8D5]">
                Hotline
              </p>
              <p className="mt-2 text-lg font-semibold">+91 98765 43210</p>
            </div>

            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[#A8D8D5]">
                Email
              </p>
              <p className="mt-2 text-base font-medium">support@carecore.health</p>
            </div>

            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[#A8D8D5]">
                Department lead
              </p>
              <p className="mt-2 text-base font-medium">Dr. Riya Sharma</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-[#E7EFEE] bg-white p-5 shadow-[0_2px_12px_rgba(7,63,66,0.03)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <BookText size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#073F42]">
                Frequently asked questions
              </h2>
              <p className="text-sm text-[#6D8585]">
                Useful guidance for common workforce issues.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={item.question}
                  className="rounded-xl border border-[#EEF4F3] bg-[#F9FDFC]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                  >
                    <span className="font-medium text-[#1A3B3D]">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronUp size={18} className="text-[#08A6A0]" />
                    ) : (
                      <ChevronDown size={18} className="text-[#08A6A0]" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#EEF4F3] px-4 py-3">
                      <p className="text-sm leading-6 text-[#5E7A79]">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E7EFEE] bg-white p-5 shadow-[0_2px_12px_rgba(7,63,66,0.03)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF5FF] text-[#2F6FED]">
              <Mail size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#073F42]">
                Contact channels
              </h2>
              <p className="text-sm text-[#6D8585]">
                Reach the right support team quickly.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-[#EDF2F2] p-3">
              <p className="text-sm font-medium text-[#073F42]">HR support</p>
              <p className="mt-1 text-sm text-[#667E7D]">hr.help@carecore.health</p>
            </div>

            <div className="rounded-xl border border-[#EDF2F2] p-3">
              <p className="text-sm font-medium text-[#073F42]">Clinical coordination</p>
              <p className="mt-1 text-sm text-[#667E7D]">clinical.support@carecore.health</p>
            </div>

            <div className="rounded-xl border border-[#EDF2F2] p-3">
              <p className="text-sm font-medium text-[#073F42]">IT support</p>
              <p className="mt-1 text-sm text-[#667E7D]">itdesk@carecore.health</p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[#E7EFEE] bg-white p-5 shadow-[0_2px_12px_rgba(7,63,66,0.03)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#073F42]">
              Recent support tickets
            </h2>
            <p className="text-sm text-[#6D8585]">
              Your latest help requests and updates.
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-[#08A6A0] hover:text-[#078f8a]"
          >
            View all
          </button>
        </div>

        <div className="space-y-3">
          {recentTickets.map(({ title, status, updated }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-xl border border-[#EDF2F2] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-[#073F42]">{title}</p>
                <p className="mt-1 text-sm text-[#6D8585]">Updated {updated}</p>
              </div>

              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
