import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Mail,
  Phone,
  Send,
} from "lucide-react";

const faqItems = [
  {
    question: "How do I update my schedule?",
    answer:
      "Go to My Schedule from the sidebar and update your availability or leave request from the schedule section.",
  },
  {
    question: "Who can help with patient issues?",
    answer:
      "Use the support contact below or speak with your department lead for any patient care or assignment concerns.",
  },
  {
    question: "I cannot login to the portal.",
    answer:
      "Check your email and password first. If the issue continues, contact the support desk using the phone or email options below.",
  },
  {
    question: "How quickly do I get a response?",
    answer:
      "Most requests are answered within 30 minutes during working hours. Urgent issues are escalated immediately.",
  },
];

export default function HelpSupport({ user }) {
  const [openFaq, setOpenFaq] = useState(0);

  const employeeName = user?.name?.split(" ")[0] || "Team member";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-[#073F42] p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A7D8D6]">
          Workforce Support
        </p>

        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Help & Support
        </h1>

        <p className="mt-2 max-w-xl text-sm text-[#C9DFDE]">
          Hi {employeeName}, we are here to help with schedules, patient care,
          attendance, and any technical issue in the system.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <Headphones size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#073F42]">
                Need help?
              </h2>
              <p className="text-sm text-gray-500">
                Contact the support team for quick assistance.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-[#F7FBFB] p-3">
              <Phone className="h-4 w-4 text-[#08A6A0]" />
              <span className="text-sm text-[#1D3D3F]">
                +91 98765 43210
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#F7FBFB] p-3">
              <Mail className="h-4 w-4 text-[#08A6A0]" />
              <span className="text-sm text-[#1D3D3F]">
                support@carecore.health
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#F8FBFB] p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#073F42]">
            Support hours
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-[#4B6667]">
            <li className="flex justify-between gap-3 border-b border-gray-200 pb-2">
              <span>Monday - Friday</span>
              <span>9:00 AM - 7:00 PM</span>
            </li>
            <li className="flex justify-between gap-3 border-b border-gray-200 pb-2">
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Sunday</span>
              <span>Emergency only</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.05fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#073F42]">
            Frequently asked questions
          </h2>

          <div className="mt-4 space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={item.question}
                  className="rounded-xl border border-[#E9F0F0] bg-[#F9FDFC]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="font-medium text-[#173F41]">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronUp size={18} className="text-[#08A6A0]" />
                    ) : (
                      <ChevronDown size={18} className="text-[#08A6A0]" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#E9F0F0] px-4 py-3">
                      <p className="text-sm leading-6 text-[#5B7677]">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

       <div className="rounded-2xl border border-[#DCE7E6] bg-white p-5 shadow-sm sm:p-6">
  {/* Form Fields */}
  <div className="grid gap-5 md:grid-cols-2">

    {/* Full Name */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#173F41]">
        Full Name
      </label>

      <input
        type="text"
        placeholder="Enter your name"
        className="h-12 w-full rounded-lg border border-[#D7E3E2] bg-[#FAFCFC] px-4 text-sm text-[#1d2d2d] outline-none transition-all placeholder:text-[#9AA9A9] focus:border-[#08A6A0] focus:bg-white focus:ring-4 focus:ring-[#08A6A0]/10"
      />
    </div>

    {/* Email */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#173F41]">
        Email Address
      </label>

      <input
        type="email"
        placeholder="you@example.com"
        className="h-12 w-full rounded-lg border border-[#D7E3E2] bg-[#FAFCFC] px-4 text-sm text-[#1d2d2d] outline-none transition-all placeholder:text-[#9AA9A9] focus:border-[#08A6A0] focus:bg-white focus:ring-4 focus:ring-[#08A6A0]/10"
      />
    </div>

    {/* Phone */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#173F41]">
        Phone Number
      </label>

      <input
        type="tel"
        placeholder="+91 XXXXX XXXXX"
        className="h-12 w-full rounded-lg border border-[#D7E3E2] bg-[#FAFCFC] px-4 text-sm text-[#1d2d2d] outline-none transition-all placeholder:text-[#9AA9A9] focus:border-[#08A6A0] focus:bg-white focus:ring-4 focus:ring-[#08A6A0]/10"
      />
    </div>

    {/* Subject */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#173F41]">
        Subject
      </label>

      <div className="relative">
        <select
          defaultValue=""
          className="h-12 w-full appearance-none rounded-lg border border-[#D7E3E2] bg-[#FAFCFC] px-4 pr-10 text-sm text-[#7A8D8D] outline-none transition-all focus:border-[#08A6A0] focus:bg-white focus:ring-4 focus:ring-[#08A6A0]/10"
        >
          <option value="" disabled hidden>
            Select a subject
          </option>
          <option>Schedule issue</option>
          <option>Patient care support</option>
          <option>Attendance problem</option>
          <option>Technical problem</option>
          <option>Other</option>
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#5E7979]">
          ▼
        </span>
      </div>
    </div>
  </div>

  {/* Message */}
  <div className="mt-5">
    <label className="mb-2 block text-sm font-semibold text-[#173F41]">
      Message
    </label>

    <textarea
      rows="6"
      placeholder="Tell us how we can help..."
      className="w-full resize-none rounded-lg border border-[#D7E3E2] bg-[#FAFCFC] px-4 py-3 text-sm leading-6 text-[#1d2d2d] outline-none transition-all placeholder:text-[#9AA9A9] focus:border-[#08A6A0] focus:bg-white focus:ring-4 focus:ring-[#08A6A0]/10"
    />
  </div>

  {/* Button */}
  <button
    type="button"
    className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(8,166,160,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#078F8A] hover:shadow-[0_7px_18px_rgba(8,166,160,0.30)]"
  >
    <Send size={16} />
    Send Message
  </button>
</div>
      </div>
    </div>
  );
}
