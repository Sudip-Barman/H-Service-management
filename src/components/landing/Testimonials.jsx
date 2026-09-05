const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Patient Family",
    rating: 5,
    review:
      "The booking process was simple, and the caregiver assigned to our family was professional and caring. It made a difficult period much easier for us.",
    initials: "PS",
  },
  {
    id: 2,
    name: "Rahul Banerjee",
    role: "Family Member",
    rating: 5,
    review:
      "We needed reliable care for an elderly family member. The support team understood our requirements and helped us find the right care arrangement.",
    initials: "RB",
  },
  {
    id: 3,
    name: "Sneha Das",
    role: "Parent",
    rating: 5,
    review:
      "Having everything in one place made managing care much easier. The service was well organized and the communication was excellent.",
    initials: "SD",
  },
];

const Testimonials = () => {
  return (
    <section
      className="
        w-full
        bg-white
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
            TESTIMONIALS
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
            Trusted by families.
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
            See how families use our platform to find and manage dependable
            healthcare and care services.
          </p>
        </div>

        {/* ==================== TESTIMONIAL CARDS ==================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="
                group
                flex
                flex-col
                rounded-2xl
                border
                border-[#E2EFED]
                bg-[#F8FCFB]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#BCE7E3]
                hover:bg-white
                hover:shadow-lg
                sm:p-6
              "
            >
              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map(
                  (_, index) => (
                    <span
                      key={index}
                      className="text-sm text-[#F5B942]"
                    >
                      ★
                    </span>
                  ),
                )}
              </div>

              {/* Quote */}
              <div className="mt-4">
                <span
                  className="
                    text-3xl
                    font-serif
                    leading-none
                    text-[#BCE7E3]
                  "
                >
                  “
                </span>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-[#607879]
                  "
                >
                  {testimonial.review}
                </p>
              </div>

              {/* User */}
              <div className="mt-5 flex items-center gap-3 border-t border-[#E2EFED] pt-4">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#DDF3F0]
                    text-xs
                    font-bold
                    text-[#173F41]
                  "
                >
                  {testimonial.initials}
                </div>

                <div className="min-w-0">
                  <h3
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-[#173F41]
                    "
                  >
                    {testimonial.name}
                  </h3>

                  <p className="mt-0.5 text-xs text-[#819596]">
                    {testimonial.role}
                  </p>
                </div>

                <span
                  className="
                    ml-auto
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E8F8F6]
                    text-xs
                    text-[#08A6A0]
                  "
                >
                  ✓
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* ==================== TRUST MESSAGE ==================== */}
        <div
          className="
            mt-5
            flex
            flex-col
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-[#DDEDEA]
            bg-[#F7FBFA]
            px-5
            py-4
            text-center
            sm:flex-row
            sm:gap-3
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[#E8F8F6]
              text-sm
              text-[#08A6A0]
            "
          >
            ♥
          </span>

          <p className="text-xs text-[#708789] sm:text-sm">
            Your family's comfort, safety, and wellbeing come first.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;