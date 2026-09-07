import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Edit3,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const bookings = [
  {
    id: "BK-1001",
    patient: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@gmail.com",
    address: "Salt Lake, Kolkata",
    service: "General Consultation",
    doctor: "Dr. Amit Roy",
    doctorSpecialization: "General Physician",
    doctorPhone: "+91 98765 12001",
    date: "2026-09-08",
    time: "10:00 AM",
    amount: 500,
    payment: "Paid",
    paymentMethod: "Online Payment",
    status: "Confirmed",
    notes: "Regular consultation",
    bookingDate: "2026-09-06",
  },

  {
    id: "BK-1002",
    patient: "Priya Das",
    phone: "9830123456",
    email: "priya.das@gmail.com",
    address: "Howrah, West Bengal",
    service: "Dental Checkup",
    doctor: "Dr. Sneha Sen",
    doctorSpecialization: "Dentist",
    doctorPhone: "+91 98765 12002",
    date: "2026-09-08",
    time: "11:30 AM",
    amount: 800,
    payment: "Pending",
    paymentMethod: "Cash",
    status: "Pending",
    notes: "Dental examination",
    bookingDate: "2026-09-06",
  },

  {
    id: "BK-1003",
    patient: "Arjun Ghosh",
    phone: "9007123456",
    email: "arjun.ghosh@gmail.com",
    address: "Dum Dum, Kolkata",
    service: "Blood Test",
    doctor: "Dr. Ananya Das",
    doctorSpecialization: "Pathology",
    doctorPhone: "+91 98765 12003",
    date: "2026-09-09",
    time: "09:00 AM",
    amount: 350,
    payment: "Paid",
    paymentMethod: "Online Payment",
    status: "Completed",
    notes: "CBC and blood sugar test",
    bookingDate: "2026-09-05",
  },

  {
    id: "BK-1004",
    patient: "Sneha Mukherjee",
    phone: "9123456789",
    email: "sneha.mukherjee@gmail.com",
    address: "New Town, Kolkata",
    service: "Cardiology Consultation",
    doctor: "Dr. Rajiv Kumar",
    doctorSpecialization: "Cardiologist",
    doctorPhone: "+91 98765 12004",
    date: "2026-09-10",
    time: "02:00 PM",
    amount: 1200,
    payment: "Pending",
    paymentMethod: "Cash",
    status: "Confirmed",
    notes: "Heart checkup",
    bookingDate: "2026-09-06",
  },

  {
    id: "BK-1005",
    patient: "Sourav Dey",
    phone: "9876012345",
    email: "sourav.dey@gmail.com",
    address: "Ballygunge, Kolkata",
    service: "Physiotherapy",
    doctor: "Dr. Rohan Paul",
    doctorSpecialization: "Physiotherapist",
    doctorPhone: "+91 98765 12005",
    date: "2026-09-11",
    time: "04:30 PM",
    amount: 700,
    payment: "Paid",
    paymentMethod: "Online Payment",
    status: "Cancelled",
    notes: "Physiotherapy session",
    bookingDate: "2026-09-04",
  },
];

const statusStyles = {
  Confirmed:
    "bg-emerald-50 text-emerald-700 border-emerald-100",

  Pending:
    "bg-amber-50 text-amber-700 border-amber-100",

  Completed:
    "bg-blue-50 text-blue-700 border-blue-100",

  Cancelled:
    "bg-red-50 text-red-700 border-red-100",
};

const paymentStyles = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-100",

  Pending:
    "bg-amber-50 text-amber-700 border-amber-100",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

function BookingDetails() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const booking = bookings.find(
    (item) => item.id === bookingId
  );

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F7FBFA] p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/admin/bookings")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#31585A] transition hover:text-[#08A6A0]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bookings
          </button>

          <div className="rounded-2xl border border-[#E2EFED] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#073F42]">
              Booking Not Found
            </h2>

            <p className="mt-2 text-sm text-[#819596]">
              The booking you are looking for does not exist.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/bookings")}
              className="mt-6 rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCancelled = booking.status === "Cancelled";
  const isCompleted = booking.status === "Completed";

  return (
    <div className="min-h-screen bg-[#F7FBFA] p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/bookings")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#31585A] transition hover:text-[#08A6A0]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Bookings
            </button>

            <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
              BOOKING MANAGEMENT
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073F42] sm:text-3xl">
              Booking Details
            </h1>

            <p className="mt-1 text-sm text-[#819596]">
              Complete information about booking {booking.id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isCancelled && !isCompleted && (
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] bg-white px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
              >
                <Edit3 className="h-4 w-4" />
                Edit Booking
              </button>
            )}

            <span
              className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold ${
                statusStyles[booking.status]
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        {/* ================= BOOKING SUMMARY ================= */}

        <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
          <div className="bg-[#073F42] p-5 text-white sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <CalendarDays className="h-7 w-7 text-white" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Booking ID
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {booking.id}
                  </h2>

                  <p className="mt-1 text-sm text-white/60">
                    Created on {formatDate(booking.bookingDate)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-xs text-white/60">
                    Appointment
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {formatDate(booking.date)}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-xs text-white/60">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {booking.time}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-xs text-white/60">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    ₹{booking.amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ================= LEFT CONTENT ================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* PATIENT INFORMATION */}

            <section className="rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
              <div className="border-b border-[#EAF2F0] px-5 py-4">
                <h2 className="font-bold text-[#073F42]">
                  Patient Information
                </h2>

                <p className="mt-1 text-xs text-[#819596]">
                  Patient details associated with this booking
                </p>
              </div>

              <div className="p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8F6]">
                    <UserRound className="h-7 w-7 text-[#08A6A0]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#173F41]">
                      {booking.patient}
                    </h3>

                    <p className="mt-1 text-sm text-[#819596]">
                      Patient
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ContactItem
                    icon={Phone}
                    label="Phone Number"
                    value={booking.phone}
                  />

                  <ContactItem
                    icon={Mail}
                    label="Email Address"
                    value={booking.email}
                  />

                  <ContactItem
                    icon={MapPin}
                    label="Address"
                    value={booking.address}
                  />

                  <ContactItem
                    icon={FileText}
                    label="Patient Type"
                    value="Registered Patient"
                  />
                </div>
              </div>
            </section>

            {/* APPOINTMENT INFORMATION */}

            <section className="rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
              <div className="border-b border-[#EAF2F0] px-5 py-4">
                <h2 className="font-bold text-[#073F42]">
                  Appointment Information
                </h2>

                <p className="mt-1 text-xs text-[#819596]">
                  Service and appointment schedule
                </p>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <DetailCard
                  icon={FileText}
                  label="Service"
                  value={booking.service}
                />

                <DetailCard
                  icon={CalendarDays}
                  label="Appointment Date"
                  value={formatDate(booking.date)}
                />

                <DetailCard
                  icon={Clock3}
                  label="Appointment Time"
                  value={booking.time}
                />

                <DetailCard
                  icon={UserRound}
                  label="Assigned Doctor"
                  value={booking.doctor}
                />
              </div>
            </section>

            {/* DOCTOR INFORMATION */}

            <section className="rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
              <div className="border-b border-[#EAF2F0] px-5 py-4">
                <h2 className="font-bold text-[#073F42]">
                  Doctor Information
                </h2>

                <p className="mt-1 text-xs text-[#819596]">
                  Doctor assigned to this appointment
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6] text-lg font-bold text-[#087F7A]">
                    {booking.doctor
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-bold text-[#173F41]">
                      {booking.doctor}
                    </h3>

                    <p className="mt-1 text-sm text-[#819596]">
                      {booking.doctorSpecialization}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <ContactItem
                    icon={Phone}
                    label="Doctor Contact"
                    value={booking.doctorPhone}
                  />
                </div>
              </div>
            </section>

            {/* NOTES */}

            <section className="rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
              <div className="border-b border-[#EAF2F0] px-5 py-4">
                <h2 className="font-bold text-[#073F42]">
                  Booking Notes
                </h2>
              </div>

              <div className="p-5">
                <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                  <div className="flex gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#08A6A0]" />

                    <p className="text-sm leading-6 text-[#31585A]">
                      {booking.notes || "No notes added."}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}

          <div className="space-y-6">

            {/* PAYMENT */}

            <section className="rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
              <div className="border-b border-[#EAF2F0] px-5 py-4">
                <h2 className="font-bold text-[#073F42]">
                  Payment Information
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <div className="rounded-2xl bg-[#E8F8F6] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#819596]">
                    Total Amount
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#073F42]">
                    ₹{booking.amount}
                  </p>
                </div>

                <PaymentRow
                  icon={CreditCard}
                  label="Payment Status"
                  value={booking.payment}
                  badge
                />

                <PaymentRow
                  icon={CreditCard}
                  label="Payment Method"
                  value={booking.paymentMethod}
                />
              </div>
            </section>

            {/* APPOINTMENT STATUS */}

            <section className="rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
              <div className="border-b border-[#EAF2F0] px-5 py-4">
                <h2 className="font-bold text-[#073F42]">
                  Appointment Status
                </h2>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      booking.status === "Confirmed"
                        ? "bg-emerald-50"
                        : booking.status === "Pending"
                        ? "bg-amber-50"
                        : booking.status === "Completed"
                        ? "bg-blue-50"
                        : "bg-red-50"
                    }`}
                  >
                    {booking.status === "Cancelled" ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-[#08A6A0]" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#9AAEAF]">
                      Current Status
                    </p>

                    <p className="mt-1 font-bold text-[#173F41]">
                      {booking.status}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#819596]">
                      {booking.status === "Confirmed" &&
                        "The appointment is confirmed and scheduled."}

                      {booking.status === "Pending" &&
                        "This booking is waiting for confirmation."}

                      {booking.status === "Completed" &&
                        "The appointment has been completed."}

                      {booking.status === "Cancelled" &&
                        "This appointment has been cancelled."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK ACTIONS */}

            <section className="rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
              <div className="border-b border-[#EAF2F0] px-5 py-4">
                <h2 className="font-bold text-[#073F42]">
                  Quick Actions
                </h2>
              </div>

              <div className="space-y-3 p-5">
                {!isCancelled && !isCompleted && (
                  <>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Booking
                    </button>

                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Booking
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/admin/bookings")}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Bookings
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   CONTACT ITEM
===================================================== */

const ContactItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6]">
          <Icon className="h-4 w-4 text-[#08A6A0]" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#819596]">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-[#31585A]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   DETAIL CARD
===================================================== */

const DetailCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
      <Icon className="h-5 w-5 text-[#08A6A0]" />

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#9AAEAF]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#31585A]">
        {value}
      </p>
    </div>
  );
};

/* =====================================================
   PAYMENT ROW
===================================================== */

const PaymentRow = ({
  icon: Icon,
  label,
  value,
  badge = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#EAF2F0] pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#08A6A0]" />

        <span className="text-xs font-semibold text-[#819596]">
          {label}
        </span>
      </div>

      {badge ? (
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
            paymentStyles[value]
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="text-right text-xs font-bold text-[#31585A]">
          {value}
        </span>
      )}
    </div>
  );
};

export default BookingDetails;