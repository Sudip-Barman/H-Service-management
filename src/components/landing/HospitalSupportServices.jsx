import { ArrowRight, Droplets, Pill, Utensils, Siren } from "lucide-react";
import { Link } from "react-router-dom";

const supportServices = [
  {
    id: "blood",
    icon: Droplets,
    title: "Blood Services",
    description:
      "Blood group availability, blood requests, donor coordination, and inventory support.",
    link: "/admin/blood",
  },
  {
    id: "medicine",
    icon: Pill,
    title: "Medicine Services",
    description:
      "Medicine availability, inventory tracking, requests, and dispensing support.",
    link: "/admin/medicine",
  },
  {
    id: "food-diet",
    icon: Utensils,
    title: "Food & Diet",
    description:
      "Patient meal planning, dietary requirements, meal requests, and food management.",
    link: "/admin/food",
  },
  {
    id: "emergency",
    icon: Siren,
    title: "Emergency Services",
    description:
      "Emergency requests, case coordination, resources, and urgent care support.",
    link: "/admin/emergency",
  },
];

const HospitalSupportServices = () => {
  return (
    <section className="w-full bg-[#F8FCFB] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
            HOSPITAL SUPPORT
          </span>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl lg:text-4xl">
            More than care. Complete hospital support.
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#789092] sm:text-base sm:leading-7">
            Along with personal care and nursing services, our system supports
            essential hospital operations such as blood, medicines, nutrition,
            and emergency assistance.
          </p>
        </div>

        {/* Services */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supportServices.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="group rounded-2xl border border-[#E2EFED] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0] transition group-hover:bg-[#08A6A0] group-hover:text-white">
                  <Icon size={23} strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-bold text-[#173F41]">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#789092]">
                  {service.description}
                </p>

                {/* Link */}
                <Link
                  to={service.link}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#08A6A0] transition hover:text-[#078F8A]"
                >
                  Learn More
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HospitalSupportServices;