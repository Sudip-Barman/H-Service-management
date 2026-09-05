const CareBanner = () => {
  return (
    <section
  className="
    w-full
    bg-white
    px-4
    pt-3
    pb-10
    sm:px-6
    sm:pt-4
    sm:pb-14
    lg:px-8
    lg:pt-5
    lg:pb-16
  "
>
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          overflow-hidden
          rounded-3xl
          bg-[#173F41]
        "
      >
        <div
          className="
            relative
            grid
            items-center
            gap-8
            px-6
            py-8
            sm:px-8
            sm:py-10
            lg:grid-cols-[1fr_0.8fr]
            lg:gap-6
            lg:px-12
            lg:py-12
            xl:px-16
          "
        >
          {/* Decorative Background Shapes */}
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-16
              h-48
              w-48
              rounded-full
              bg-[#08A6A0]/15
              blur-2xl
              sm:h-64
              sm:w-64
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -left-20
              h-48
              w-48
              rounded-full
              bg-[#08A6A0]/10
              blur-2xl
            "
          />

          {/* ==================== CONTENT ==================== */}
          <div className="relative z-10 max-w-2xl">
            <span
              className="
                inline-block
                rounded-full
                bg-white/10
                px-3
                py-1.5
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-[#8DE0DA]
              "
            >
              CARE YOU CAN TRUST
            </span>

            <h2
              className="
                mt-3
                text-2xl
                font-bold
                leading-tight
                text-white
                sm:text-3xl
                lg:text-4xl
              "
            >
              Because every moment of care matters.
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-white/70
                sm:text-base
                sm:leading-7
              "
            >
              Whether you need support for a patient, newborn, elderly family
              member, or professional nursing care, we help you find the right
              care for your needs.
            </p>

            {/* Buttons */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#08A6A0]
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#078F8A]
                  sm:h-12
                "
              >
                Find Care Now
                <span className="ml-2 text-base">→</span>
              </button>

              <button
                type="button"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/20
                  bg-white/5
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-white/10
                  sm:h-12
                "
              >
                View All Services
              </button>
            </div>
          </div>

          {/* ==================== VISUAL ==================== */}
          <div
            className="
              relative
              z-10
              flex
              min-h-48
              items-center
              justify-center
              sm:min-h-56
              lg:min-h-64
            "
          >
            {/* Main Circle */}
            <div
              className="
                flex
                h-36
                w-36
                items-center
                justify-center
                rounded-full
                bg-white/10
                ring-1
                ring-white/10
                sm:h-44
                sm:w-44
                lg:h-52
                lg:w-52
              "
            >
              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E8F8F6]
                  shadow-lg
                  sm:h-30
                  sm:w-30
                  lg:h-36
                  lg:w-36
                "
              >
                <span className="text-5xl sm:text-6xl lg:text-7xl">
                  ❤️
                </span>
              </div>
            </div>

            {/* Floating Care Badge */}
            <div
              className="
                absolute
                right-2
                top-4
                flex
                items-center
                gap-2
                rounded-xl
                bg-white
                px-3
                py-2
                shadow-lg
                sm:right-6
                sm:top-2
                sm:px-4
                sm:py-2.5
                lg:right-4
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#E8F8F6]
                  text-sm
                "
              >
                ✓
              </span>

              <div>
                <p className="text-xs font-bold text-[#173F41]">
                  Verified
                </p>
                <p className="text-[10px] text-gray-500">
                  Care Professionals
                </p>
              </div>
            </div>

            {/* Floating Support Badge */}
            <div
              className="
                absolute
                bottom-3
                left-2
                flex
                items-center
                gap-2
                rounded-xl
                bg-white
                px-3
                py-2
                shadow-lg
                sm:bottom-2
                sm:left-6
                sm:px-4
                sm:py-2.5
                lg:left-4
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#E8F8F6]
                  text-sm
                "
              >
                🕐
              </span>

              <div>
                <p className="text-xs font-bold text-[#173F41]">
                  24/7
                </p>
                <p className="text-[10px] text-gray-500">
                  Support Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareBanner;