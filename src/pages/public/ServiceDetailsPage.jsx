import { useParams, Link } from "react-router-dom";

const services = {
  "patient-caretaker": {
    title: "Patient Caretaker",
    category: "Patient Care",
    icon: "🧑‍⚕️",
    description:
      "Professional assistance for patients who need support with daily activities, recovery, and personal care.",
    features: [
      "Personal hygiene assistance",
      "Daily activity support",
      "Medication reminders",
      "Mobility assistance",
      "Patient companionship",
      "Basic recovery support",
    ],
  },

  "baby-caretaker": {
    title: "Baby Caretaker",
    category: "Baby Care",
    icon: "👶",
    description:
      "Trusted childcare support for newborns and infants, helping families manage everyday baby care.",
    features: [
      "Newborn care",
      "Feeding assistance",
      "Baby hygiene",
      "Sleeping routine support",
      "Baby companionship",
      "Daily care assistance",
    ],
  },

  "japa-care": {
    title: "Japa Care",
    category: "Baby Care",
    icon: "🤱",
    description:
      "Specialized postnatal care support for mothers and newborn babies during the recovery period.",
    features: [
      "Mother and baby care",
      "Postnatal assistance",
      "Newborn support",
      "Daily routine assistance",
      "Personal care support",
      "Family assistance",
    ],
  },

  "baby-sitter": {
    title: "Baby Sitter",
    category: "Baby Care",
    icon: "🍼",
    description:
      "Reliable babysitting support for families who need assistance caring for their children.",
    features: [
      "Child supervision",
      "Feeding assistance",
      "Playtime supervision",
      "School routine support",
      "Child hygiene",
      "Daily activity assistance",
    ],
  },

  "male-attendant": {
    title: "Male Attendant",
    category: "Patient Care",
    icon: "👨‍⚕️",
    description:
      "Professional male attendant services for patients requiring personal assistance and daily support.",
    features: [
      "Personal assistance",
      "Mobility support",
      "Hygiene assistance",
      "Patient companionship",
      "Daily activity support",
      "Recovery assistance",
    ],
  },

  "elder-care": {
    title: "Elder Care",
    category: "Elder Care",
    icon: "🧓",
    description:
      "Compassionate assistance for elderly family members who need support with their everyday activities.",
    features: [
      "Daily activity assistance",
      "Mobility support",
      "Personal hygiene",
      "Companionship",
      "Medication reminders",
      "Routine support",
    ],
  },

  "gnm-nurse": {
    title: "GNM Nurse",
    category: "Nursing",
    icon: "👩‍⚕️",
    description:
      "Professional nursing support from qualified GNM nurses for patients requiring healthcare assistance.",
    features: [
      "Patient monitoring",
      "Medication assistance",
      "Basic nursing care",
      "Vital sign monitoring",
      "Post-operative support",
      "Patient documentation",
    ],
  },

  "anm-nurse": {
    title: "ANM Nurse",
    category: "Nursing",
    icon: "👩‍⚕️",
    description:
      "Trained ANM nursing professionals providing essential nursing and patient support services.",
    features: [
      "Basic nursing care",
      "Patient monitoring",
      "Medication assistance",
      "Personal care support",
      "Health observation",
      "Daily nursing assistance",
    ],
  },

  "bsc-nurse": {
    title: "B.Sc Nurse",
    category: "Nursing",
    icon: "🩺",
    description:
      "Qualified B.Sc nurses providing professional nursing care and healthcare support for patients.",
    features: [
      "Professional nursing care",
      "Patient monitoring",
      "Medication management",
      "Vital monitoring",
      "Recovery assistance",
      "Healthcare coordination",
    ],
  },

  "icu-nurse": {
    title: "ICU Nurse",
    category: "Nursing",
    icon: "🏥",
    description:
      "Specialized nursing support for patients requiring intensive and closely monitored care.",
    features: [
      "Continuous patient monitoring",
      "Critical care assistance",
      "Vital sign monitoring",
      "Medication support",
      "Patient observation",
      "Critical care coordination",
    ],
  },
};

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();

  const service = services[serviceId];

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7FBFA] px-4">
        <div className="text-center">
          <div className="text-5xl">🔍</div>

          <h1 className="mt-4 text-2xl font-bold text-[#173F41]">
            Service Not Found
          </h1>

          <p className="mt-2 text-sm text-[#789092]">
            The service you're looking for doesn't exist.
          </p>

          <Link
            to="/services"
            className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#078F8A]"
          >
            View All Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7FBFA] px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-[#789092]">
          <Link
            to="/services"
            className="transition-colors hover:text-[#08A6A0]"
          >
            Services
          </Link>

          <span>→</span>

          <span className="text-[#214C4E]">{service.title}</span>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-[#E2EFED] bg-white">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* Visual */}
            <div className="flex min-h-70 items-center justify-center bg-[#E8F8F6] p-8 sm:min-h-95 lg:min-h-125">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white text-8xl shadow-lg sm:h-56 sm:w-56">
                {service.icon}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                {service.category}
              </span>

              <h1 className="mt-2 text-3xl font-bold leading-tight text-[#173F41] sm:text-4xl">
                {service.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#789092] sm:text-base">
                {service.description}
              </p>

              {/* Features */}
              <div className="mt-7">
                <h2 className="text-base font-bold text-[#214C4E]">
                  What this service includes
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-xl bg-[#F7FBFA] px-4 py-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5F8F5] text-sm font-bold text-[#08A6A0]">
                        ✓
                      </span>

                      <span className="text-sm text-[#526B6D]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#173F41] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#214C4E]"
                >
                  Book This Service
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  to="/services"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[#D7E8E6] bg-white px-6 text-sm font-semibold text-[#214C4E] transition-colors hover:bg-[#F7FBFA]"
                >
                  ← All Services
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Information */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="text-xl">🛡️</div>
            <h3 className="mt-3 text-sm font-bold text-[#214C4E]">
              Trusted Care
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#819596]">
              Professional and reliable care support.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="text-xl">📅</div>
            <h3 className="mt-3 text-sm font-bold text-[#214C4E]">
              Flexible Booking
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#819596]">
              Choose care according to your requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2EFED] bg-white p-5">
            <div className="text-xl">🕐</div>
            <h3 className="mt-3 text-sm font-bold text-[#214C4E]">
              Support Available
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#819596]">
              Assistance whenever you need it.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceDetailsPage;