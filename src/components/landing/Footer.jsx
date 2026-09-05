import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "FAQs", path: "/faq" },
  ];

  const serviceLinks = [
    { label: "Patient Care", path: "/services/patient-caretaker" },
    { label: "Baby Care", path: "/services/baby-caretaker" },
    { label: "Elder Care", path: "/services/elder-care" },
    { label: "Japa Care", path: "/services/japa-care" },
    { label: "Nursing Care", path: "/services/gnm-nurse" },
  ];

  return (
    <footer className="w-full bg-[#173F41] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Main Footer */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-10">

          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08A6A0] text-lg">
                ❤️
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  CareConnect
                </h2>

                <p className="text-xs text-[#A9C1C1]">
                  Healthcare & Care Services
                </p>
              </div>
            </Link>

            <p className="mt-4 text-sm leading-6 text-[#B7CCCC]">
              Reliable healthcare and professional care services for patients,
              families, children, and elderly loved ones. Quality care,
              whenever you need it.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#376466] text-sm text-[#C5D8D8] transition-colors hover:border-[#08A6A0] hover:bg-[#08A6A0] hover:text-white"
              >
                f
              </button>

              <button
                type="button"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#376466] text-sm text-[#C5D8D8] transition-colors hover:border-[#08A6A0] hover:bg-[#08A6A0] hover:text-white"
              >
                ◎
              </button>

              <button
                type="button"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#376466] text-sm text-[#C5D8D8] transition-colors hover:border-[#08A6A0] hover:bg-[#08A6A0] hover:text-white"
              >
                in
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#B7CCCC] transition-colors hover:text-[#08A6A0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Our Services
            </h3>

            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service.label}>
                  <Link
                    to={service.path}
                    className="text-sm text-[#B7CCCC] transition-colors hover:text-[#08A6A0]"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Contact Us
            </h3>

            <div className="mt-4 space-y-3.5">

              <div className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-[#08A6A0]">
                  📍
                </span>

                <p className="text-sm leading-5 text-[#B7CCCC]">
                  123 Healthcare Avenue,
                  <br />
                  Kolkata, West Bengal
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#08A6A0]">
                  📞
                </span>

                <a
                  href="tel:+919876543210"
                  className="text-sm text-[#B7CCCC] transition-colors hover:text-white"
                >
                  +91 98765 43210
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#08A6A0]">
                  ✉️
                </span>

                <a
                  href="mailto:support@careconnect.com"
                  className="break-all text-sm text-[#B7CCCC] transition-colors hover:text-white"
                >
                  support@careconnect.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#08A6A0]">
                  🕐
                </span>

                <p className="text-sm text-[#B7CCCC]">
                  Available 24/7
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-[#31585A] sm:my-9" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p className="text-xs text-[#91AEAF] sm:text-sm">
            © 2026 CareConnect. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">

            <Link
              to="/privacy-policy"
              className="text-xs text-[#91AEAF] transition-colors hover:text-white sm:text-sm"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-[#91AEAF] transition-colors hover:text-white sm:text-sm"
            >
              Terms & Conditions
            </Link>

            <Link
              to="/support"
              className="text-xs text-[#91AEAF] transition-colors hover:text-white sm:text-sm"
            >
              Support
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;