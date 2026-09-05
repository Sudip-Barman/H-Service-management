const doctors = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    specialty: "General Physician",
    experience: "8+ Years Experience",
    icon: "👩‍⚕️",
  },
  {
    id: 2,
    name: "Dr. Rahul Mehta",
    specialty: "Internal Medicine",
    experience: "10+ Years Experience",
    icon: "👨‍⚕️",
  },
  {
    id: 3,
    name: "Dr. Priya Sen",
    specialty: "Pediatrician",
    experience: "7+ Years Experience",
    icon: "👩‍⚕️",
  },
  {
    id: 4,
    name: "Dr. Arjun Das",
    specialty: "Critical Care Specialist",
    experience: "12+ Years Experience",
    icon: "👨‍⚕️",
  },
];

const Doctors = () => {
  return (
    <section
      className="
        w-full
        bg-[#F7FBFA]
        px-4
        pt-8
        pb-10
        sm:px-6
        sm:pt-10
        sm:pb-14
        lg:px-8
        lg:pt-12
        lg:pb-16
      "
    >
      <div className="mx-auto w-full max-w-7xl">

        {/* ==================== SECTION HEADER ==================== */}
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
          <span
            className="
              inline-block
              text-xs
              font-bold
              uppercase
              tracking-wide
              text-[#08A6A0]
            "
          >
            OUR DOCTORS
          </span>

          <h2
            className="
              mt-2
              text-2xl
              font-bold
              leading-tight
              tracking-tight
              text-[#173F41]
              sm:text-3xl
              lg:text-4xl
            "
          >
            Meet Our Healthcare Professionals
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-[#789092]
              sm:text-base
              sm:leading-7
            "
          >
            Connect with experienced and trusted doctors who are dedicated to
            providing professional healthcare and personalized attention.
          </p>
        </div>

        {/* ==================== DOCTOR CARDS ==================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-[#E2EFED]
                bg-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#BCE7E3]
                hover:shadow-lg
              "
            >
              {/* ==================== DOCTOR VISUAL ==================== */}
              <div
                className="
                  relative
                  flex
                  h-44
                  items-center
                  justify-center
                  overflow-hidden
                  bg-[#E8F8F6]
                  sm:h-48
                "
              >
                {/* Background Circle */}
                <div
                  className="
                    absolute
                    h-32
                    w-32
                    rounded-full
                    bg-[#D7F4F1]
                    transition-transform
                    duration-500
                    group-hover:scale-110
                    sm:h-36
                    sm:w-36
                  "
                />

                {/* Doctor */}
                <div
                  className="
                    relative
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-5xl
                    shadow-sm
                    sm:h-28
                    sm:w-28
                    sm:text-6xl
                  "
                >
                  {doctor.icon}
                </div>

                {/* Verified Badge */}
                <div
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-white
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    text-[#173F41]
                    shadow-sm
                  "
                >
                  <span className="text-[#08A6A0]">✓</span>
                  Verified
                </div>
              </div>

              {/* ==================== DOCTOR INFO ==================== */}
              <div className="p-5">
                <h3
                  className="
                    text-base
                    font-bold
                    leading-6
                    text-[#214C4E]
                  "
                >
                  {doctor.name}
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    font-medium
                    text-[#08A6A0]
                  "
                >
                  {doctor.specialty}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-[#819596]
                  "
                >
                  {doctor.experience}
                </p>

                {/* Action */}
                <button
                  type="button"
                  className="
                    mt-4
                    inline-flex
                    items-center
                    text-xs
                    font-bold
                    text-[#08A6A0]
                    transition-colors
                    hover:text-[#067F7A]
                  "
                >
                  View Profile

                  <span
                    className="
                      ml-2
                      inline-block
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ==================== BOTTOM CTA ==================== */}
        <div
          className="
            mt-6
            flex
            flex-col
            items-center
            justify-between
            gap-4
            rounded-2xl
            border
            border-[#DDEDEA]
            bg-white
            px-5
            py-4
            sm:flex-row
            sm:px-6
          "
        >
          <div>
            <h3
              className="
                text-sm
                font-bold
                text-[#173F41]
                sm:text-base
              "
            >
              Looking for a specific specialist?
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-[#819596]
                sm:text-sm
              "
            >
              Explore our complete network of healthcare professionals.
            </p>
          </div>

          <button
            type="button"
            className="
              inline-flex
              h-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#173F41]
              px-5
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-[#24595B]
              sm:h-11
              sm:text-sm
            "
          >
            View All Doctors
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Doctors;