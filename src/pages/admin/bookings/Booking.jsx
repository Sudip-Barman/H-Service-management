import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Plus,
  Search,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

const initialBookings = [
  {
    id: "BK-1001",
    patient: "Rahul Sharma",
    phone: "9876543210",
    service: "General Consultation",
    doctor: "Dr. Amit Roy",
    date: "2026-09-08",
    time: "10:00 AM",
    amount: 500,
    payment: "Paid",
    status: "Confirmed",
    notes: "Regular consultation",
  },
  {
    id: "BK-1002",
    patient: "Priya Das",
    phone: "9830123456",
    service: "Dental Checkup",
    doctor: "Dr. Sneha Sen",
    date: "2026-09-08",
    time: "11:30 AM",
    amount: 800,
    payment: "Pending",
    status: "Pending",
    notes: "Dental examination",
  },
  {
    id: "BK-1003",
    patient: "Arjun Ghosh",
    phone: "9007123456",
    service: "Blood Test",
    doctor: "Dr. Ananya Das",
    date: "2026-09-09",
    time: "09:00 AM",
    amount: 350,
    payment: "Paid",
    status: "Completed",
    notes: "CBC and blood sugar test",
  },
  {
    id: "BK-1004",
    patient: "Sneha Mukherjee",
    phone: "9123456789",
    service: "Cardiology Consultation",
    doctor: "Dr. Rajiv Kumar",
    date: "2026-09-10",
    time: "02:00 PM",
    amount: 1200,
    payment: "Pending",
    status: "Confirmed",
    notes: "Heart checkup",
  },
  {
    id: "BK-1005",
    patient: "Sourav Dey",
    phone: "9876012345",
    service: "Physiotherapy",
    doctor: "Dr. Rohan Paul",
    date: "2026-09-11",
    time: "04:30 PM",
    amount: 700,
    payment: "Paid",
    status: "Cancelled",
    notes: "Physiotherapy session",
  },
];

const services = [
  {
    name: "General Consultation",
    doctor: "Dr. Amit Roy",
    amount: 500,
  },
  {
    name: "Dental Checkup",
    doctor: "Dr. Sneha Sen",
    amount: 800,
  },
  {
    name: "Blood Test",
    doctor: "Dr. Ananya Das",
    amount: 350,
  },
  {
    name: "Cardiology Consultation",
    doctor: "Dr. Rajiv Kumar",
    amount: 1200,
  },
  {
    name: "Physiotherapy",
    doctor: "Dr. Rohan Paul",
    amount: 700,
  },
];

const patients = [
  "Rahul Sharma",
  "Priya Das",
  "Arjun Ghosh",
  "Sneha Mukherjee",
  "Sourav Dey",
];

const doctors = [
  "Dr. Amit Roy",
  "Dr. Sneha Sen",
  "Dr. Ananya Das",
  "Dr. Rajiv Kumar",
  "Dr. Rohan Paul",
];

const emptyForm = {
  patient: "",
  service: "",
  doctor: "",
  date: "",
  time: "",
  payment: "Pending",
  notes: "",
};

const statusStyles = {
  Confirmed: "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Completed: "bg-blue-50 text-blue-700 border-blue-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const paymentStyles = {
  Paid: "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
};

function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        booking.id.toLowerCase().includes(searchText) ||
        booking.patient.toLowerCase().includes(searchText) ||
        booking.doctor.toLowerCase().includes(searchText) ||
        booking.service.toLowerCase().includes(searchText) ||
        booking.phone.includes(searchText);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      const matchesDate =
        !dateFilter || booking.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, search, statusFilter, dateFilter]);

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "service") {
      const selectedService = services.find(
        (service) => service.name === value
      );

      setFormData((prev) => ({
        ...prev,
        service: value,
        doctor: selectedService?.doctor || "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openNewBookingModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError("");
    setFormData(emptyForm);
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();

    if (
      !formData.patient ||
      !formData.service ||
      !formData.doctor ||
      !formData.date ||
      !formData.time
    ) {
      setFormError("Please fill all required fields.");
      return;
    }

    const selectedService = services.find(
      (service) => service.name === formData.service
    );

    const newBooking = {
      id: `BK-${1001 + bookings.length}`,
      patient: formData.patient,
      phone: "Not Available",
      service: formData.service,
      doctor: formData.doctor,
      date: formData.date,
      time: formData.time,
      amount: selectedService?.amount || 0,
      payment: formData.payment,
      status: "Pending",
      notes: formData.notes || "No notes added",
    };

    setBookings((prev) => [newBooking, ...prev]);

    closeModal();
  };

  const handleCancelBooking = (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "Cancelled",
            }
          : booking
      )
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* PAGE HEADER */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            Bookings
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            Manage patient appointments and bookings
          </p>
        </div>

        <button
          onClick={openNewBookingModal}
          className="flex h-10 sm:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#08A6A0] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
        >
          <Plus size={16} className="sm:size-[18px]" />
          New Booking
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-blue-50 text-blue-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <CalendarDays />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-gray-900">
              {totalBookings}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
            Total Bookings
          </p>
        </div>

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-green-50 text-green-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <CheckCircle2 />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-gray-900">
              {confirmedBookings}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
            Confirmed
          </p>
        </div>

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-yellow-50 text-yellow-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <Clock3 />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-gray-900">
              {pendingBookings}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
            Pending
          </p>
        </div>

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-indigo-50 text-indigo-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <CheckCircle2 />
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold leading-none text-gray-900">
              {completedBookings}
            </h2>
          </div>
          <p className="mt-1 sm:mt-1.5 md:mt-2 truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500">
            Completed
          </p>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="mb-4 sm:mb-6 rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* SEARCH */}
          <div className="relative md:col-span-2">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booking, patient, doctor..."
              className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-xs sm:text-sm outline-none transition focus:border-[#08A6A0]"
            />
          </div>

          {/* STATUS */}
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 sm:h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-[#08A6A0]"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* DATE */}
          <div className="relative">
            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-[#08A6A0]"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[1100px] w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Booking
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Patient
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Doctor
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Appointment
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Payment
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* BOOKING ID */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-blue-600">
                        {booking.id}
                      </span>
                    </td>

                    {/* PATIENT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <UserRound size={17} />
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.patient}
                          </p>

                          <p className="text-xs text-gray-500">
                            {booking.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SERVICE */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {booking.service}
                      </p>
                    </td>

                    {/* DOCTOR */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">
                        {booking.doctor}
                      </p>
                    </td>

                    {/* APPOINTMENT */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(booking.date)}
                      </p>

                      <p className="text-xs text-gray-500">
                        {booking.time}
                      </p>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        ₹{booking.amount}
                      </p>
                    </td>

                    {/* PAYMENT */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          paymentStyles[booking.payment]
                        }`}
                      >
                        {booking.payment}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          statusStyles[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            setSelectedBooking(booking)
                          }
                          title="View Booking"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>

                        {booking.status !== "Cancelled" &&
                          booking.status !== "Completed" && (
                            <button
                              onClick={() =>
                                handleCancelBooking(booking.id)
                              }
                              title="Cancel Booking"
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <XCircle size={17} />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <CalendarDays
                        size={42}
                        className="mb-3 text-gray-300"
                      />

                      <h3 className="font-semibold text-gray-800">
                        No bookings found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="space-y-3 p-3 md:hidden">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <UserRound size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-gray-900">{booking.patient}</h3>
                      <p className="text-xs text-gray-500">{booking.id} · {booking.phone}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Service</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{booking.service}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Doctor</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{booking.doctor}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Appointment</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#31585A]">{formatDate(booking.date)} · {booking.time}</p>
                  </div>
                  <div className="rounded-lg bg-[#FAFDFC] p-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">Amount / Payment</span>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[#173F41]">₹{booking.amount} ({booking.payment})</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 border-t border-[#EAF2F0] pt-2.5">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                  >
                    <Eye size={15} />
                  </button>
                  {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-xs text-gray-500">
              No bookings found. Try changing your search or filters.
            </div>
          )}
        </div>
      </div>

      {/* NEW BOOKING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Create New Booking
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new patient appointment
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleCreateBooking}
              className="space-y-5 p-6"
            >
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* PATIENT */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Patient <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select patient</option>

                    {patients.map((patient) => (
                      <option key={patient} value={patient}>
                        {patient}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SERVICE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Service <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select service</option>

                    {services.map((service) => (
                      <option
                        key={service.name}
                        value={service.name}
                      >
                        {service.name} - ₹{service.amount}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DOCTOR */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Doctor <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select doctor</option>

                    {doctors.map((doctor) => (
                      <option key={doctor} value={doctor}>
                        {doctor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DATE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Appointment Date{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min="2026-09-07"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* TIME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Appointment Time{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* PAYMENT */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>

                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                {/* NOTES */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter appointment notes..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* FORM FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                >
                  <Plus size={18} />
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW BOOKING MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Booking Details
                </h2>

                <p className="text-sm text-blue-600">
                  {selectedBooking.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Patient
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedBooking.patient}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedBooking.phone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">
                    Service
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedBooking.service}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Doctor
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedBooking.doctor}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(selectedBooking.date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedBooking.time}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    ₹{selectedBooking.amount}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Payment
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      paymentStyles[selectedBooking.payment]
                    }`}
                  >
                    {selectedBooking.payment}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Status
                </p>

                <span
                  className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                    statusStyles[selectedBooking.status]
                  }`}
                >
                  {selectedBooking.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Notes
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {selectedBooking.notes}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 text-right">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;