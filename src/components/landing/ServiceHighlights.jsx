const serviceHighlights = [
  {
    icon: "🧑‍⚕️",
    title: "Patient Care",
    description:
      "Professional assistance and personal care for patients during recovery.",
  },
  {
    icon: "👶",
    title: "Baby Care",
    description:
      "Trusted and attentive care for newborns, infants and young children.",
  },
  {
    icon: "👩‍⚕️",
    title: "Nursing Care",
    description:
      "Qualified nurses providing professional healthcare and medical assistance.",
  },
  {
    icon: "🧓",
    title: "Elder Care",
    description:
      "Compassionate daily assistance and support for elderly family members.",
  },
];

const ServiceHighlights = () => {
  return (
    <section className="w-full bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
          <span className="inline-block text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
            OUR SERVICES
          </span>

          <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#073F42] sm:text-3xl lg:text-4xl">
            Care That Fits Your Needs
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#789092] sm:text-base sm:leading-7">
            From everyday assistance to professional nursing, we connect you
            with reliable healthcare professionals whenever you need them.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceHighlights.map((service) => (
            <div
              key={service.title}
              className="
                group
                flex
                w-full
                flex-col
                rounded-2xl
                border
                border-[#E2EFED]
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#BCE7E3]
                hover:shadow-lg
                sm:p-6
              "
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#E5F8F5]
                  text-xl
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  sm:h-13
                  sm:w-13
                  sm:text-2xl
                "
              >
                {service.icon}
              </div>

              {/* Content */}
              <div className="mt-4">
                <h3 className="text-base font-bold leading-6 text-[#214C4E]">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#819596]">
                  {service.description}
                </p>
              </div>

              {/* Link */}
              <button
                type="button"
                className="
                  mt-4
                  inline-flex
                  w-fit
                  items-center
                  text-xs
                  font-bold
                  text-[#08A6A0]
                  transition-colors
                  hover:text-[#067F7A]
                "
              >
                Explore Service

                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;