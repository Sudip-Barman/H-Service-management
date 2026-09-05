import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openHowItWorks = () => {
    setShowHowItWorks(true);
    closeMenu();
  };

  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      {/* =========================
          MAIN NAVBAR
      ========================== */}
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          justify-between
          px-4
          py-4
          sm:px-6
          sm:py-5
          lg:px-8
        "
      >
        {/* =========================
            LOGO
        ========================== */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5 sm:gap-3"
        >
          {/* Logo Icon */}
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-[#08A6A0]
              text-lg
              font-bold
              text-white
              shadow-lg
              shadow-[#08A6A0]/20
              sm:h-10
              sm:w-10
              sm:text-xl
            "
          >
            +
          </div>

          {/* Logo Text */}
          <div>
            <h1 className="text-base font-bold leading-none text-[#073F42] sm:text-lg">
              Care<span className="text-[#08A6A0]">Core</span>
            </h1>

            <p className="mt-1 text-[8px] font-medium uppercase tracking-wide text-[#789092]">
              Healthcare Services
            </p>
          </div>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {/* Home */}
          <Link
            to="/"
            className="
              text-sm
              font-medium
              text-[#31585A]
              transition-colors
              duration-200
              hover:text-[#08A6A0]
            "
          >
            Home
          </Link>

          {/* Services */}
          <Link
            to="/services"
            className="
              text-sm
              font-medium
              text-[#31585A]
              transition-colors
              duration-200
              hover:text-[#08A6A0]
            "
          >
            Services
          </Link>

          {/* How It Works */}
          <button
            type="button"
            onClick={openHowItWorks}
            className="
              text-sm
              font-medium
              text-[#31585A]
              transition-colors
              duration-200
              hover:text-[#08A6A0]
            "
          >
            How It Works
          </button>

          {/* About */}
          <Link
            to="/about"
            className="
              text-sm
              font-medium
              text-[#31585A]
              transition-colors
              duration-200
              hover:text-[#08A6A0]
            "
          >
            About Us
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            className="
              text-sm
              font-medium
              text-[#31585A]
              transition-colors
              duration-200
              hover:text-[#08A6A0]
            "
          >
            Contact
          </Link>
        </nav>

        {/* =========================
            DESKTOP ACTIONS
        ========================== */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Login */}
          <Link
            to="/login"
            className="
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[#31585A]
              transition
              hover:text-[#08A6A0]
            "
          >
            Login
          </Link>

          {/* Get Started */}
          <Link
            to="/register"
            className="
              rounded-lg
              bg-[#08A6A0]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-[#08A6A0]/20
              transition
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#078F8A]
            "
          >
            Get Started
          </Link>
        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-[#D9E9E7]
            bg-white/90
            text-[#073F42]
            shadow-sm
            backdrop-blur
            transition
            hover:border-[#08A6A0]
            hover:text-[#08A6A0]
            lg:hidden
          "
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      {isMenuOpen && (
        <div className="px-4 pb-4 sm:px-6 lg:hidden">
          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              overflow-hidden
              rounded-2xl
              border
              border-[#DDECEA]
              bg-white
              p-3
              shadow-xl
            "
          >
            {/* Mobile Links */}
            <nav className="flex flex-col">
              {/* Home */}
              <Link
                to="/"
                onClick={closeMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-[#31585A]
                  transition
                  hover:bg-[#E8F8F6]
                  hover:text-[#08A6A0]
                "
              >
                Home
              </Link>

              {/* Services */}
              <Link
                to="/services"
                onClick={closeMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-[#31585A]
                  transition
                  hover:bg-[#E8F8F6]
                  hover:text-[#08A6A0]
                "
              >
                Services
              </Link>

              {/* How It Works */}
              <button
                type="button"
                onClick={openHowItWorks}
                className="
                  w-full
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  text-[#31585A]
                  transition
                  hover:bg-[#E8F8F6]
                  hover:text-[#08A6A0]
                "
              >
                How It Works
              </button>

              {/* About */}
              <Link
                to="/about"
                onClick={closeMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-[#31585A]
                  transition
                  hover:bg-[#E8F8F6]
                  hover:text-[#08A6A0]
                "
              >
                About Us
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                onClick={closeMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-[#31585A]
                  transition
                  hover:bg-[#E8F8F6]
                  hover:text-[#08A6A0]
                "
              >
                Contact
              </Link>
            </nav>

            {/* =========================
                MOBILE ACTIONS
            ========================== */}
            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-2
                border-t
                border-[#E8F0EF]
                pt-3
              "
            >
              {/* Login */}
              <Link
                to="/login"
                onClick={closeMenu}
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#D5E9E6]
                  text-sm
                  font-semibold
                  text-[#31585A]
                  transition
                  hover:border-[#08A6A0]
                  hover:text-[#08A6A0]
                "
              >
                Login
              </Link>

              {/* Get Started */}
              <Link
                to="/register"
                onClick={closeMenu}
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#08A6A0]
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-[#08A6A0]/15
                  transition
                  hover:bg-[#078F8A]
                "
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          HOW IT WORKS MODAL
      ========================== */}
      {showHowItWorks && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#073F42]/40
            px-4
            backdrop-blur-sm
          "
          onClick={() => setShowHowItWorks(false)}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-[#DDECEA]
              bg-white
              p-6
              shadow-2xl
              sm:p-7
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-[#08A6A0]
                  "
                >
                  HOW IT WORKS
                </span>

                <h2
                  className="
                    mt-2
                    text-xl
                    font-bold
                    text-[#073F42]
                  "
                >
                  Getting care is simple.
                </h2>
              </div>

              {/* Close Modal */}
              <button
                type="button"
                onClick={() => setShowHowItWorks(false)}
                aria-label="Close How It Works"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#E8F8F6]
                  text-[#31585A]
                  transition
                  hover:bg-[#D7F4F1]
                  hover:text-[#08A6A0]
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-5 space-y-3">
              {/* Step 01 */}
              <div className="rounded-xl bg-[#F4FBF9] p-4">
                <p className="text-sm font-semibold text-[#073F42]">
                  01. Choose a service
                </p>

                <p className="mt-1 text-xs leading-5 text-[#789092]">
                  Select the care service that matches your needs.
                </p>
              </div>

              {/* Step 02 */}
              <div className="rounded-xl bg-[#F4FBF9] p-4">
                <p className="text-sm font-semibold text-[#073F42]">
                  02. Book your care
                </p>

                <p className="mt-1 text-xs leading-5 text-[#789092]">
                  Submit your booking request with your preferred
                  schedule.
                </p>
              </div>

              {/* Step 03 */}
              <div className="rounded-xl bg-[#F4FBF9] p-4">
                <p className="text-sm font-semibold text-[#073F42]">
                  03. Get the right support
                </p>

                <p className="mt-1 text-xs leading-5 text-[#789092]">
                  Our team helps arrange the appropriate caregiver
                  or service.
                </p>
              </div>
            </div>

            {/* Modal Button */}
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="
                mt-5
                h-10
                w-full
                rounded-xl
                bg-[#08A6A0]
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#078F8A]
              "
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;