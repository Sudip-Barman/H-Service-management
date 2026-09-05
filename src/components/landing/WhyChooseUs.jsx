const reasons = [
  {
    id: 1,
    icon: "✓",
    title: "Verified Professionals",
    description:
      "Connect with trained and verified healthcare professionals selected for reliable and responsible care.",
  },
  {
    id: 2,
    icon: "🛡️",
    title: "Safe & Reliable Care",
    description:
      "Your family's safety comes first with professional service standards and dependable care support.",
  },
  {
    id: 3,
    icon: "📅",
    title: "Easy Booking",
    description:
      "Find the right service, choose your requirements, and manage your care bookings from one place.",
  },
  {
    id: 4,
    icon: "🕐",
    title: "24/7 Support",
    description:
      "Our support team is available whenever you need help with services, bookings, or general assistance.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full bg-[#F7FBFA] px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-14 lg:px-8 lg:pt-12 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
          <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
            WHY CHOOSE US
          </span>

          <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#073F42] sm:text-3xl lg:text-4xl">
            Care You Can Feel Confident About
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#789092] sm:text-base sm:leading-7">
            We make finding and managing professional care simple, transparent,
            and convenient for families.
          </p>
        </div>

        {/* Reasons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.id}
              className="
                group rounded-2xl border border-[#E2EFED]
                bg-white p-5 transition-all duration-300
                hover:-translate-y-1 hover:border-[#BCE7E3]
                hover:shadow-lg sm:p-6
              "
            >
              {/* Icon */}
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-xl bg-[#E5F8F5] text-lg
                  text-[#08A6A0] transition-transform duration-300
                  group-hover:scale-110
                "
              >
                {reason.icon}
              </div>

              {/* Content */}
              <h3 className="mt-4 text-base font-bold leading-6 text-[#214C4E]">
                {reason.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#819596]">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Trust Message */}
        <div
          className="
            mt-6 flex flex-col gap-4 rounded-2xl
            border border-[#D7F0ED] bg-[#E8F8F6]
            px-5 py-5 sm:flex-row sm:items-center
            sm:justify-between sm:px-6
          "
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#08A6A0]">
              ❤️
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#214C4E] sm:text-base">
                Your family's wellbeing comes first.
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#789092] sm:text-sm">
                Professional care, clear communication, and dependable support
                at every step.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
              inline-flex h-10 shrink-0 items-center justify-center
              rounded-xl bg-[#173F41] px-5 text-sm font-semibold
              text-white transition-colors
              hover:bg-[#214C4E]
            "
          >
            Learn More
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;