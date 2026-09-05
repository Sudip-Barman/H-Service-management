import { useState } from "react";

const services = [
  {
    id: 1,
    category: "Patient Care",
    title: "Patient Caretaker",
    shortTitle: "Patient Care",
    description:
      "Reliable and compassionate caregivers to assist patients with their daily activities, personal care, mobility, medication reminders, and general wellbeing.",
    features: [
      "Personal hygiene assistance",
      "Mobility support",
      "Medication reminders",
      "Daily activity assistance",
    ],
    icon: "🧑‍⚕️",
  },
  {
    id: 2,
    category: "Baby Care",
    title: "Baby Caretaker",
    shortTitle: "Baby Care",
    description:
      "Professional baby care support for families who need trusted assistance with feeding, bathing, sleeping routines, and everyday childcare.",
    features: [
      "Feeding assistance",
      "Baby hygiene",
      "Sleeping routine support",
      "Basic baby supervision",
    ],
    icon: "👶",
  },
  {
    id: 3,
    category: "Baby Care",
    title: "Japa Care",
    shortTitle: "Japa Care",
    description:
      "Dedicated postnatal care support for mothers and newborns, helping families manage the important recovery period after childbirth.",
    features: [
      "Mother care",
      "Newborn assistance",
      "Postnatal support",
      "Daily household assistance",
    ],
    icon: "🤱",
  },
  {
    id: 4,
    category: "Baby Care",
    title: "Baby Sitter",
    shortTitle: "Baby Sitter",
    description:
      "Trusted babysitting support designed to provide attentive supervision and care for children while parents manage their daily responsibilities.",
    features: [
      "Child supervision",
      "Playtime assistance",
      "Meal assistance",
      "Safety-focused care",
    ],
    icon: "🧸",
  },
  {
    id: 5,
    category: "Patient Care",
    title: "Male Attendant",
    shortTitle: "Male Attendant",
    description:
      "Professional male attendants who assist patients with mobility, personal needs, hospital visits, and everyday support.",
    features: [
      "Patient mobility",
      "Personal assistance",
      "Hospital support",
      "Daily activity assistance",
    ],
    icon: "👨‍⚕️",
  },
  {
    id: 6,
    category: "Elder Care",
    title: "Elder Care",
    shortTitle: "Elder Care",
    description:
      "Compassionate elderly care services focused on comfort, companionship, daily assistance, and maintaining a safe environment.",
    features: [
      "Daily living assistance",
      "Mobility support",
      "Companionship",
      "Routine assistance",
    ],
    icon: "🧓",
  },
  {
    id: 7,
    category: "Nursing",
    title: "GNM Nurse",
    shortTitle: "GNM Nurse",
    description:
      "Qualified GNM nursing professionals providing dependable nursing support according to patient care requirements.",
    features: [
      "Basic nursing care",
      "Vital monitoring",
      "Medication assistance",
      "Patient observation",
    ],
    icon: "👩‍⚕️",
  },
  {
    id: 8,
    category: "Nursing",
    title: "ANM Nurse",
    shortTitle: "ANM Nurse",
    description:
      "ANM nursing support for patients who require professional assistance with routine healthcare and nursing activities.",
    features: [
      "Basic patient care",
      "Health monitoring",
      "Medication assistance",
      "Care documentation",
    ],
    icon: "🩺",
  },
  {
    id: 9,
    category: "Nursing",
    title: "B.Sc Nurse",
    shortTitle: "B.Sc Nurse",
    description:
      "Professionally trained B.Sc nurses providing structured nursing care and support for patients with different healthcare needs.",
    features: [
      "Clinical nursing support",
      "Patient monitoring",
      "Medication management",
      "Care coordination",
    ],
    icon: "👩‍⚕️",
  },
  {
    id: 10,
    category: "Nursing",
    title: "ICU Nurse",
    shortTitle: "ICU Nurse",
    description:
      "Specialized ICU nursing support for patients requiring close observation, critical care assistance, and continuous monitoring.",
    features: [
      "Continuous monitoring",
      "Critical care support",
      "Vital sign observation",
      "Care coordination",
    ],
    icon: "🏥",
  },
];

const categories = [
  "All",
  "Patient Care",
  "Baby Care",
  "Nursing",
  "Elder Care",
];

const ServiceShowcase = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeService, setActiveService] = useState(services[0]);

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) => service.category === activeCategory);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    const categoryServices =
      category === "All"
        ? services
        : services.filter((service) => service.category === category);

    if (categoryServices.length > 0) {
      setActiveService(categoryServices[0]);
    }
  };

  return (
    <section
      id="service-showcase"
      className="
        w-full
        bg-white
        px-4
        pt-5
        pb-10
        sm:px-6
        sm:pt-7
        sm:pb-14
        lg:px-8
        lg:pt-8
        lg:pb-16
      "
    >
      <div className="mx-auto w-full max-w-7xl">

        {/* ==================== SECTION HEADER ==================== */}
        <div className="mx-auto mb-5 max-w-2xl text-center sm:mb-6">
          <span
            className="
              mb-2
              inline-block
              rounded-full
              bg-[#E8F8F6]
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[#2A8C85]
              sm:px-4
              sm:py-2
              sm:text-sm
            "
          >
            OUR SERVICES
          </span>

          <h2
            className="
              text-2xl
              font-bold
              leading-tight
              tracking-tight
              text-[#173F41]
              sm:text-3xl
              lg:text-4xl
            "
          >
            Care that fits your needs.
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-gray-600
              sm:text-base
              sm:leading-7
            "
          >
            From everyday assistance to professional nursing care, we connect
            families with trusted healthcare professionals.
          </p>
        </div>

        {/* ==================== CATEGORY FILTER ==================== */}
        <div
          className="
            mb-6
            flex
            gap-2
            overflow-x-auto
            pb-1
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            lg:mb-7
            lg:justify-center
          "
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`
                shrink-0
                whitespace-nowrap
                rounded-full
                px-4
                py-2
                text-xs
                font-medium
                transition
                sm:px-5
                sm:py-2.5
                sm:text-sm
                ${
                  activeCategory === category
                    ? "bg-[#173F41] text-white"
                    : "bg-[#F1F7F6] text-[#173F41] hover:bg-[#E8F8F6]"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ==================== MAIN SHOWCASE ==================== */}
        <div
          className="
            grid
            gap-4
            lg:grid-cols-[17.5rem_1fr]
            lg:items-stretch
          "
        >

          {/* ==================== SERVICE LIST ==================== */}
          <div
            className="
              min-w-0
              rounded-2xl
              bg-[#F5FAF9]
              p-2.5
              lg:h-125
            "
          >
            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                lg:h-full
                lg:flex-col
                lg:overflow-x-hidden
                lg:overflow-y-auto
                lg:pb-0
                lg:pr-1
                lg:[scrollbar-width:thin]
              "
            >
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveService(service)}
                  className={`
                    flex
                    min-w-52
                    shrink-0
                    items-center
                    gap-3
                    rounded-xl
                    p-2.5
                    text-left
                    transition
                    lg:w-full
                    lg:min-w-0
                    ${
                      activeService.id === service.id
                        ? "bg-white shadow-sm ring-1 ring-[#D9EEEB]"
                        : "hover:bg-white/70"
                    }
                  `}
                >
                  {/* Service Icon */}
                  <span
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-lg
                      ${
                        activeService.id === service.id
                          ? "bg-[#E8F8F6]"
                          : "bg-white"
                      }
                    `}
                  >
                    {service.icon}
                  </span>

                  {/* Service Information */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#173F41]">
                      {service.title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {service.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ==================== SERVICE DETAILS ==================== */}
          <div
            className="
              min-w-0
              overflow-hidden
              rounded-2xl
              bg-[#E8F8F6]
            "
          >
            <div className="grid h-full lg:grid-cols-2">

              {/* ==================== VISUAL ==================== */}
              <div
                className="
                  relative
                  flex
                  min-h-60
                  items-center
                  justify-center
                  overflow-hidden
                  bg-[#DDF3F0]
                  p-5
                  sm:min-h-72
                  sm:p-6
                  lg:min-h-125
                "
              >
                {/* Decorative Circle */}
                <div
                  className="
                    absolute
                    -left-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    bg-white/40
                    sm:h-36
                    sm:w-36
                  "
                />

                {/* Decorative Circle */}
                <div
                  className="
                    absolute
                    -bottom-14
                    -right-14
                    h-40
                    w-40
                    rounded-full
                    bg-white/40
                    sm:h-48
                    sm:w-48
                  "
                />

                {/* Main Service Icon */}
                <div
                  className="
                    relative
                    flex
                    h-36
                    w-36
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-lg
                    sm:h-44
                    sm:w-44
                    md:h-48
                    md:w-48
                  "
                >
                  <span className="text-7xl sm:text-8xl md:text-9xl">
                    {activeService.icon}
                  </span>
                </div>

                {/* Floating Badge */}
                <div
                  className="
                    absolute
                    bottom-4
                    left-4
                    rounded-xl
                    bg-white
                    px-3
                    py-2
                    shadow-md
                    sm:bottom-5
                    sm:left-5
                    sm:px-4
                    sm:py-2.5
                  "
                >
                  <p className="text-[10px] font-medium text-gray-500 sm:text-xs">
                    Professional Care
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-[#173F41] sm:text-sm">
                    Trusted & Verified
                  </p>
                </div>
              </div>

              {/* ==================== SERVICE DETAILS ==================== */}
              <div
                className="
                  flex
                  flex-col
                  justify-center
                  p-5
                  sm:p-7
                  lg:p-8
                  xl:p-10
                "
              >
                {/* Category */}
                <span
                  className="
                    mb-3
                    w-fit
                    rounded-full
                    bg-white
                    px-3
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#2A8C85]
                    sm:text-xs
                  "
                >
                  {activeService.category}
                </span>

                {/* Title */}
                <h3
                  className="
                    text-2xl
                    font-bold
                    leading-tight
                    text-[#173F41]
                    sm:text-3xl
                  "
                >
                  {activeService.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-gray-600
                    sm:text-base
                    sm:leading-7
                  "
                >
                  {activeService.description}
                </p>

                {/* Features */}
                <div
                  className="
                    mt-5
                    grid
                    gap-2.5
                    sm:grid-cols-2
                    lg:grid-cols-1
                  "
                >
                  {activeService.features.map((feature) => (
                    <div
                      key={feature}
                      className="
                        flex
                        items-center
                        gap-2.5
                        text-sm
                        text-[#173F41]
                      "
                    >
                      <span
                        className="
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#173F41]
                          text-[10px]
                          text-white
                        "
                      >
                        ✓
                      </span>

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Book Button */}
                <button
                  type="button"
                  className="
                    mt-6
                    w-full
                    rounded-xl
                    bg-[#173F41]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#24595B]
                    sm:w-fit
                  "
                >
                  Book This Service
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== BOTTOM INFORMATION ==================== */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">

          {/* Care Services */}
          <div
            className="
              rounded-xl
              border
              border-gray-100
              bg-white
              p-4
              text-center
              shadow-sm
            "
          >
            <p className="text-xl font-bold text-[#173F41]">
              10+
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Care Services
            </p>
          </div>

          {/* Support */}
          <div
            className="
              rounded-xl
              border
              border-gray-100
              bg-white
              p-4
              text-center
              shadow-sm
            "
          >
            <p className="text-xl font-bold text-[#173F41]">
              24/7
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Support Available
            </p>
          </div>

          {/* Professionals */}
          <div
            className="
              rounded-xl
              border
              border-gray-100
              bg-white
              p-4
              text-center
              shadow-sm
            "
          >
            <p className="text-xl font-bold text-[#173F41]">
              Verified
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Healthcare Professionals
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceShowcase;