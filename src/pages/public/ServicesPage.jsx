import MainLayout from "../../layouts/MainLayout";
import Navbar from "../../components/landing/NavBar";
import Footer from "../../components/landing/Footer";
import ServiceShowcase from "../../components/landing/ServiceShowcase";
import HospitalSupportServices from "../../components/landing/HospitalSupportServices";

const providerTypes = [
  {
    icon: "👩‍⚕️",
    title: "GNM Nurse",
    description:
      "Provides professional nursing care, patient monitoring, medication support, wound care, and other assigned clinical responsibilities.",
  },
  {
    icon: "🩺",
    title: "ANM Nurse",
    description:
      "Provides routine nursing and healthcare assistance, patient observation, and basic clinical support.",
  },
  {
    icon: "🏥",
    title: "B.Sc Nurse",
    description:
      "Provides professional nursing care for patients requiring structured clinical monitoring and ongoing healthcare support.",
  },
  {
    icon: "❤️‍🩹",
    title: "ICU Nurse",
    description:
      "Provides specialized nursing support for patients requiring intensive monitoring and critical-care assistance.",
  },
  {
    icon: "🧑‍⚕️",
    title: "Patient Caretaker",
    description:
      "Assists patients with daily activities, mobility, hygiene, meals, companionship, and routine support.",
  },
  {
    icon: "👶",
    title: "Baby Caretaker",
    description:
      "Supports parents with baby feeding, hygiene, sleep routines, supervision, and everyday childcare.",
  },
  {
    icon: "🧓",
    title: "Elder Care Attendant",
    description:
      "Provides elderly people with companionship, mobility assistance, personal care, and daily routine support.",
  },
  {
    icon: "🤱",
    title: "Japa Care Specialist",
    description:
      "Provides postpartum assistance to mothers and newborns during the recovery period after childbirth.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose a service",
    description:
      "Select the type of care you or your family member needs.",
  },
  {
    number: "02",
    title: "Share your requirements",
    description:
      "Tell us about the patient's condition, preferred schedule, location, and care requirements.",
  },
  {
    number: "03",
    title: "Get matched",
    description:
      "A suitable caregiver, attendant, nurse, or other professional can be assigned according to the service.",
  },
  {
    number: "04",
    title: "Receive care",
    description:
      "The assigned professional provides the agreed service according to the schedule and care plan.",
  },
];

const ServicesPage = () => {
  return (
    <MainLayout>
      <Navbar />

      <main className="w-full overflow-hidden bg-[#F8FCFB] pt-20 sm:pt-24">
        {/* Hero */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                OUR SERVICES
              </span>

              <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#073F42] sm:text-4xl lg:text-5xl">
                Care services designed around your needs.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-[#789092] sm:text-base sm:leading-7">
                From everyday personal assistance to professional nursing and
                specialized care, CareConnect helps families find the right
                support for every stage of life.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#services"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white shadow-lg shadow-[#08A6A0]/15 transition hover:-translate-y-0.5 hover:bg-[#078F8A]"
                >
                  Explore Services
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#D5E9E6] bg-white px-5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  How It Works
                </a>
              </div>
            </div>

            <div className="relative mx-auto flex h-72 w-full max-w-lg items-center justify-center rounded-3xl bg-[#E5F8F5] sm:h-80">
              <div className="absolute h-48 w-48 rounded-full bg-white/70 sm:h-56 sm:w-56" />

              <div className="relative text-8xl sm:text-9xl">
                🧑‍⚕️
              </div>

              <div className="absolute left-4 top-5 rounded-xl border border-[#D5E9E6] bg-white px-4 py-3 shadow-sm sm:left-6">
                <p className="text-xs font-semibold text-[#789092]">
                  Professional Care
                </p>

                <p className="mt-1 text-sm font-bold text-[#173F41]">
                  Trusted Support
                </p>
              </div>

              <div className="absolute bottom-5 right-4 rounded-xl border border-[#D5E9E6] bg-white px-4 py-3 shadow-sm sm:right-6">
                <p className="text-xs font-semibold text-[#789092]">
                  Availability
                </p>

                <p className="mt-1 text-sm font-bold text-[#08A6A0]">
                  24 / 7 Care
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Care & Nursing Services */}
        <section
          id="services"
          className="w-full"
        >
          <ServiceShowcase />
        </section>

        {/* Hospital Support Services */}
        <HospitalSupportServices />

        {/* Who Provides Care */}
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                CARE PROFESSIONALS
              </span>

              <h2 className="mt-2 text-2xl font-bold text-[#073F42] sm:text-3xl">
                Who provides the care?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#789092] sm:text-base">
                CareConnect separates different professional roles so families
                can request the right type of support for their situation.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {providerTypes.map((provider) => (
                <div
                  key={provider.title}
                  className="rounded-2xl border border-[#E2EFED] bg-[#F8FCFB] p-5 transition hover:-translate-y-1 hover:border-[#BCE7E3] hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F8F5] text-xl">
                    {provider.icon}
                  </div>

                  <h3 className="mt-4 text-base font-bold text-[#214C4E]">
                    {provider.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#819596]">
                    {provider.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                HOW IT WORKS
              </span>

              <h2 className="mt-2 text-2xl font-bold text-[#073F42] sm:text-3xl">
                Getting care is simple
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#789092] sm:text-base">
                A simple process helps families describe their requirements
                and receive the appropriate care service.
              </p>
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#BCE7E3]"
                >
                  <span className="text-3xl font-bold text-[#D7F4F1]">
                    {step.number}
                  </span>

                  <h3 className="mt-2 text-base font-bold text-[#214C4E]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#819596]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why CareConnect */}
        <section className="bg-[#E8F8F6] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                WHY CARECONNECT
              </span>

              <h2 className="mt-2 text-2xl font-bold text-[#073F42] sm:text-3xl">
                More than just finding a caregiver.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#708789] sm:text-base">
                CareConnect is designed as a complete care management system.
                Families can request services while administrators manage
                professionals, schedules, assignments, bookings, attendance,
                and billing from one platform.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Service-based professional matching",
                "Scheduled care and assignments",
                "Nurse and caregiver management",
                "Booking and appointment tracking",
                "Attendance and shift management",
                "Billing and invoice management",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-[#CDE8E4] bg-white p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5F8F5] text-sm text-[#08A6A0]">
                    ✓
                  </span>

                  <span className="text-sm font-medium text-[#31585A]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl bg-[#173F41] px-6 py-10 text-center sm:px-10 sm:py-12">
            <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
              NEED CARE?
            </span>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Find the right service for your family.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#B7CCCC] sm:text-base">
              Tell us what kind of care you need and choose the service that
              fits your situation.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#08A6A0] px-6 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                Find Care Now
              </a>

              <a
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#4A6B6D] px-6 text-sm font-semibold text-white transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </MainLayout>
  );
};

export default ServicesPage;