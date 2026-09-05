const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#E8F8F6]"
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#B9ECE8]/50 blur-3xl sm:h-80 sm:w-80" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#D7F4F1]/70 blur-3xl sm:h-72 sm:w-72" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-8 pt-24 sm:gap-8 sm:px-6 sm:pb-10 sm:pt-26 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-10 lg:pt-24 xl:gap-12">
        {/* Left Content */}
        <div className="w-full max-w-2xl lg:max-w-xl">
          {/* Badge */}
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full bg-[#D7F4F1] px-3 py-1.5 text-xs font-semibold text-[#078F8A] sm:px-4 sm:py-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#08A6A0]" />

            <span>Professional Healthcare Services</span>
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#073F42] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
            Exceptional Care,
            <span className="block text-[#08A6A0]">
              Every Time.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#708789] sm:mt-5 sm:text-base sm:leading-7">
            Reliable healthcare and personal care services designed around you
            and your family's needs.
          </p>

          {/* Buttons */}
          <div className="mt-5 flex w-full flex-col gap-3 sm:mt-6 sm:w-auto sm:flex-row">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white shadow-lg shadow-[#08A6A0]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#078F8A]"
            >
              Book a Service
              <span className="ml-2">→</span>
            </button>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CFE2E0] bg-white px-5 text-sm font-semibold text-[#31585A] transition duration-200 hover:border-[#08A6A0] hover:text-[#08A6A0]"
            >
              Explore Services
            </button>
          </div>

          {/* Trust */}
          <div className="mt-5 flex items-center gap-3 sm:mt-6">
            <div className="flex shrink-0 -space-x-2">
              {["👨", "👩", "👨", "👩"].map((avatar, index) => (
                <div
                  key={index}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#D7F4F1] text-sm sm:h-9 sm:w-9"
                >
                  {avatar}
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-bold text-[#31585A]">
                5,000+
              </p>

              <p className="text-xs text-[#789092]">
                Families cared for
              </p>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative mx-auto flex h-72 w-full max-w-lg items-center justify-center sm:h-80 lg:h-96 xl:h-105">
          {/* Decorative Circle */}
          <div className="absolute h-60 w-60 rounded-full bg-[#A9DFDC] sm:h-72 sm:w-72 lg:h-80 lg:w-80 xl:h-88 xl:w-88" />

          {/* Main Visual */}
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <div className="flex h-52 w-52 items-center justify-center rounded-full bg-white/40 backdrop-blur-sm sm:h-60 sm:w-60 lg:h-68 lg:w-68">
              <span className="text-8xl sm:text-9xl lg:text-9xl">
                🧑‍⚕️
              </span>
            </div>
          </div>

          {/* Verification Card */}
          <div className="absolute bottom-5 left-0 z-20 rounded-xl bg-white px-3 py-2.5 shadow-lg sm:bottom-7 sm:left-2 sm:px-4 sm:py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E5F8F5] text-[#08A6A0]">
                ✓
              </div>

              <div>
                <p className="text-xs font-bold text-[#31585A]">
                  Verified Professionals
                </p>

                <p className="mt-0.5 text-[10px] text-[#789092]">
                  Trusted healthcare staff
                </p>
              </div>
            </div>
          </div>

          {/* Rating Card */}
          <div className="absolute bottom-2 right-0 z-20 rounded-xl bg-white px-3 py-2.5 shadow-lg sm:bottom-5 sm:right-2 sm:px-4 sm:py-3">
            <div className="flex items-center gap-2">
              <span className="text-base">★</span>

              <div>
                <p className="text-base font-bold leading-none text-[#31585A]">
                  4.9
                </p>

                <p className="mt-1 text-[10px] text-[#789092]">
                  Patient rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;