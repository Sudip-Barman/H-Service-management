import MainLayout from "../../layouts/MainLayout";
import Navbar from "../../components/landing/NavBar";
import Footer from "../../components/landing/Footer";


const AboutPage = () => {
  return (
    <MainLayout>
      <Navbar />

      <main className="min-h-screen bg-white">
        {/* Page Header */}
        <section className="bg-[#E8F8F6] px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                ABOUT CARECORE
              </span>

              <h1 className="mt-3 text-3xl font-bold leading-tight text-[#173F41] sm:text-4xl lg:text-5xl">
                Making healthcare and personal care easier to manage.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#708789] sm:text-base">
                CareCore is a healthcare service management platform designed
                to connect families with dependable care services and
                healthcare professionals through one simple system.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
            {/* Content */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                OUR STORY
              </span>

              <h2 className="mt-2 text-2xl font-bold leading-tight text-[#173F41] sm:text-3xl lg:text-4xl">
                Care should not be complicated.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#789092] sm:text-base">
                When someone needs care, families often have to deal with
                multiple phone calls, service providers, schedules, payments,
                and follow-ups.
              </p>

              <p className="mt-3 text-sm leading-7 text-[#789092] sm:text-base">
                CareCore is designed to bring these activities together.
                Families can discover services, submit their requirements,
                manage bookings, communicate with professionals, and keep
                track of their care journey from one platform.
              </p>

              <p className="mt-3 text-sm leading-7 text-[#789092] sm:text-base">
                Behind the scenes, the platform also helps doctors, nurses,
                attendants, and administrators manage schedules, assignments,
                appointments, attendance, and service operations.
              </p>
            </div>

            {/* Visual */}
            <div className="relative flex min-h-70 items-center justify-center overflow-hidden rounded-3xl bg-[#F5FAF9] p-8 sm:min-h-95">
              <div className="absolute h-56 w-56 rounded-full bg-[#D7F4F1] sm:h-72 sm:w-72" />

              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white text-7xl shadow-lg sm:h-52 sm:w-52 sm:text-8xl">
                🏥
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-[#F7FBFA] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                OUR MISSION
              </span>

              <h2 className="mt-2 text-2xl font-bold text-[#173F41] sm:text-3xl lg:text-4xl">
                Building a better way to coordinate care
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#789092] sm:text-base">
                Our mission is to simplify the process of finding, booking,
                coordinating, and managing healthcare and personal care
                services while keeping the experience clear for both families
                and professionals.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#E2EFED] bg-white p-6">
                <div className="text-3xl">👨‍👩‍👧</div>

                <h3 className="mt-4 text-base font-bold text-[#214C4E]">
                  For Families
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#819596]">
                  A simple place to find suitable care, manage bookings,
                  appointments, payments, and important information.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2EFED] bg-white p-6">
                <div className="text-3xl">🧑‍⚕️</div>

                <h3 className="mt-4 text-base font-bold text-[#214C4E]">
                  For Professionals
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#819596]">
                  Tools for managing schedules, shifts, appointments,
                  assignments, patients, attendance, and leave requests.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2EFED] bg-white p-6 sm:col-span-2 lg:col-span-1">
                <div className="text-3xl">⚙️</div>

                <h3 className="mt-4 text-base font-bold text-[#214C4E]">
                  For Administrators
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#819596]">
                  Centralized management for users, services, bookings,
                  staff, schedules, billing, attendance, and reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How CareCore Works */}
        <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                HOW IT WORKS
              </span>

              <h2 className="mt-2 text-2xl font-bold text-[#173F41] sm:text-3xl">
                One platform, connected care
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#789092] sm:text-base">
                CareCore brings the major parts of the care process together.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-4">
              <div className="relative rounded-2xl border border-[#E2EFED] p-5">
                <span className="text-xs font-bold text-[#08A6A0]">
                  01
                </span>

                <h3 className="mt-3 text-base font-bold text-[#214C4E]">
                  Choose a Service
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#819596]">
                  Select the type of care that matches your requirement.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2EFED] p-5">
                <span className="text-xs font-bold text-[#08A6A0]">
                  02
                </span>

                <h3 className="mt-3 text-base font-bold text-[#214C4E]">
                  Share Requirements
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#819596]">
                  Provide the information needed to arrange appropriate care.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2EFED] p-5">
                <span className="text-xs font-bold text-[#08A6A0]">
                  03
                </span>

                <h3 className="mt-3 text-base font-bold text-[#214C4E]">
                  Coordinate Care
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#819596]">
                  The service and professional assignment can be coordinated
                  according to availability.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2EFED] p-5">
                <span className="text-xs font-bold text-[#08A6A0]">
                  04
                </span>

                <h3 className="mt-3 text-base font-bold text-[#214C4E]">
                  Manage Everything
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#819596]">
                  Keep track of bookings, appointments, payments, and care
                  information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Statement */}
        <section className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
          <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-[#173F41]">
            <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Care is more than a service.
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#B7CCCC] sm:text-base">
                It is about helping people feel supported, families feel
                confident, and healthcare professionals have the tools they
                need to do their work effectively.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </MainLayout>
  );
};

export default AboutPage;