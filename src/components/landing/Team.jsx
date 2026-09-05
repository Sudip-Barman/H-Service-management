const teamMembers = [
  {
    id: 1,
    name: "Care Coordination Team",
    role: "Care Coordinators",
    icon: "🤝",
    description:
      "Helping families understand their requirements and coordinate the right care.",
  },
  {
    id: 2,
    name: "Support Team",
    role: "Patient Support",
    icon: "🎧",
    description:
      "Available to assist with bookings, service questions, and general support.",
  },
  {
    id: 3,
    name: "Quality Team",
    role: "Quality & Safety",
    icon: "🛡️",
    description:
      "Focused on maintaining reliable service standards and professional care.",
  },
];

const Team = () => {
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
            OUR TEAM
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
            People behind your care.
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
            From care coordination to customer support, our team works behind
            the scenes to make your care experience simpler and more reliable.
          </p>
        </div>

        {/* ==================== TEAM CARDS ==================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="
                group
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
                  h-13
                  w-13
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#E8F8F6]
                  text-2xl
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                {member.icon}
              </div>

              {/* Content */}
              <h3
                className="
                  mt-5
                  text-base
                  font-bold
                  leading-6
                  text-[#214C4E]
                "
              >
                {member.name}
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  font-semibold
                  text-[#08A6A0]
                "
              >
                {member.role}
              </p>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#819596]
                "
              >
                {member.description}
              </p>
            </div>
          ))}
        </div>

        {/* ==================== CTA ==================== */}
        <div
          className="
            mt-5
            flex
            flex-col
            items-center
            justify-between
            gap-4
            rounded-2xl
            bg-[#173F41]
            px-5
            py-5
            sm:flex-row
            sm:px-6
            sm:py-5
          "
        >
          <div className="text-center sm:text-left">
            <h3
              className="
                text-sm
                font-bold
                text-white
                sm:text-base
              "
            >
              Need help finding the right care?
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-white/60
                sm:text-sm
              "
            >
              Our support team is here to help you get started.
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
              bg-[#08A6A0]
              px-5
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-[#078F8A]
              sm:h-11
              sm:text-sm
            "
          >
            Contact Support
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Team;