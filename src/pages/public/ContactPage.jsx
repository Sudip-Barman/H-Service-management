import {
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/landing/NavBar";
import Footer from "../../components/landing/Footer";
import MainLayout from "../../layouts/MainLayout";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <MainLayout>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                CONTACT US
              </span>

              <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#073F42] sm:text-4xl lg:text-5xl">
                We're here to help you find the right care.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-[#789092] sm:text-base sm:leading-7">
                Have a question about our services, bookings, or hospital
                support? Send us a message and our support team will help you
                with the next step.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#contact-form"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white shadow-lg shadow-[#08A6A0]/15 transition hover:-translate-y-0.5 hover:bg-[#078F8A]"
                >
                  Send a Message
                </a>

                <a
                  href="tel:+919876543210"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D5E9E6] bg-white px-5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  <Phone size={16} />
                  Call Us
                </a>
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative mx-auto flex min-h-70 w-full max-w-lg items-center justify-center overflow-hidden rounded-3xl bg-[#E5F8F5] p-8">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/60" />

              <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#D7F4F1]" />

              <div className="relative w-full max-w-sm rounded-2xl border border-white/70 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                  <Mail size={24} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#173F41]">
                  Need assistance?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#789092]">
                  Our support team is available to answer questions about
                  services, appointments, bookings, and care coordination.
                </p>

                <div className="mt-5 rounded-xl bg-[#F8FCFB] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#819596]">
                    Support Email
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#08A6A0]">
                    support@careconnect.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-[#F8FCFB] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                GET IN TOUCH
              </span>

              <h2 className="mt-3 text-2xl font-bold text-[#073F42] sm:text-3xl">
                Choose the way that's easiest for you.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#789092] sm:text-base">
                Reach our team through phone, email, or visit our support
                office.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Phone */}
              <a
                href="tel:+919876543210"
                className="group rounded-2xl border border-[#E2EFED] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0] transition group-hover:bg-[#08A6A0] group-hover:text-white">
                  <Phone size={22} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#173F41]">
                  Call Us
                </h3>

                <p className="mt-2 text-sm text-[#789092]">
                  Speak directly with our support team.
                </p>

                <p className="mt-4 text-sm font-semibold text-[#08A6A0]">
                  +91 98765 43210
                </p>
              </a>

              {/* Email */}
              <a
                href="mailto:support@careconnect.com"
                className="group rounded-2xl border border-[#E2EFED] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0] transition group-hover:bg-[#08A6A0] group-hover:text-white">
                  <Mail size={22} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#173F41]">
                  Email Us
                </h3>

                <p className="mt-2 text-sm text-[#789092]">
                  Send your questions or service enquiries.
                </p>

                <p className="mt-4 break-all text-sm font-semibold text-[#08A6A0]">
                  support@careconnect.com
                </p>
              </a>

              {/* Office */}
              <div className="group rounded-2xl border border-[#E2EFED] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0] transition group-hover:bg-[#08A6A0] group-hover:text-white">
                  <MapPin size={22} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#173F41]">
                  Visit Us
                </h3>

                <p className="mt-2 text-sm text-[#789092]">
                  Visit our support office for in-person assistance.
                </p>

                <p className="mt-4 text-sm font-semibold leading-6 text-[#08A6A0]">
                  CareCore Healthcare Services
                  <br />
                  Kolkata, West Bengal
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section
          id="contact-form"
          className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            {/* Information */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                SEND A MESSAGE
              </span>

              <h2 className="mt-3 text-2xl font-bold leading-tight text-[#073F42] sm:text-3xl">
                Tell us what you need help with.
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#789092] sm:text-base sm:leading-7">
                Whether you need information about a service, want to ask
                about a booking, or need help navigating the platform, send
                us your details.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                    <Clock size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#173F41]">
                      Support Hours
                    </p>

                    <p className="mt-1 text-sm text-[#789092]">
                      Monday - Saturday, 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                    <Phone size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#173F41]">
                      Emergency?
                    </p>

                    <p className="mt-1 text-sm text-[#789092]">
                      For medical emergencies, contact your local emergency
                      service immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-[#E2EFED] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
              {submitted && (
                <div className="mb-6 rounded-xl border border-[#BDEAE5] bg-[#E8F8F6] px-4 py-3">
                  <p className="text-sm font-semibold text-[#078F8A]">
                    Thank you! Your message has been received.
                  </p>

                  <p className="mt-1 text-xs text-[#31585A]">
                    Our support team will get back to you shortly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-[#31585A]"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="mt-2 h-11 w-full rounded-xl border border-[#D5E9E6] bg-white px-3 text-sm text-[#31585A] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-[#31585A]"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="mt-2 h-11 w-full rounded-xl border border-[#D5E9E6] bg-white px-3 text-sm text-[#31585A] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-[#31585A]"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-2 h-11 w-full rounded-xl border border-[#D5E9E6] bg-white px-3 text-sm text-[#31585A] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="text-sm font-semibold text-[#31585A]"
                    >
                      Subject
                    </label>

                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-2 h-11 w-full rounded-xl border border-[#D5E9E6] bg-white px-3 text-sm text-[#31585A] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                    >
                      <option value="">Select a subject</option>
                      <option value="service">
                        Service Enquiry
                      </option>
                      <option value="booking">
                        Booking Help
                      </option>
                      <option value="appointment">
                        Appointment Help
                      </option>
                      <option value="billing">
                        Billing & Payment
                      </option>
                      <option value="technical">
                        Technical Support
                      </option>
                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-[#31585A]"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    required
                    rows="6"
                    className="mt-2 w-full resize-none rounded-xl border border-[#D5E9E6] bg-white px-3 py-3 text-sm leading-6 text-[#31585A] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A] sm:w-auto"
                >
                  <Send size={17} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-[#173F41] px-6 py-10 sm:px-10 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6BD9D3]">
                  NEED CARE?
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Find the right service for your needs.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#B9CECF]">
                  Explore our care and nursing services and discover the
                  support options available through CareCore.
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </MainLayout>
  );
};

export default ContactPage;