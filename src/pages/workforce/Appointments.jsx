import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  User,
  MapPin,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { apiRequest, getErrorMessage } from "../../api/api";

const Appointments = ({ user }) => {
  const navigate = useNavigate();

  const storedUser = (() => {
    try {
      const value = localStorage.getItem("user");
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  })();

  const currentUser = user || storedUser;

  const employeeId =
    currentUser?.id != null
      ? String(currentUser.id)
      : "";

  const role =
    currentUser?.role?.toLowerCase() || "";

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  useEffect(() => {
    let cancelled = false;

    const fetchAppointments = async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          await apiRequest("/bookings");

        if (cancelled) return;

        if (!Array.isArray(data)) {
          setAppointments([]);
          return;
        }

        /*
         * Only show appointments belonging to
         * the currently logged-in workforce user.
         *
         * Doctors:
         *   booking.doctor_id === current user id
         *
         * Other workforce members:
         *   booking.assigned_staff_id === current user id
         */
        const assignedBookings =
          data.filter((booking) => {
            const doctorId =
              booking?.doctor_id != null
                ? String(booking.doctor_id)
                : "";

            const assignedStaffId =
              booking?.assigned_staff_id != null
                ? String(
                    booking.assigned_staff_id
                  )
                : "";

            if (role === "doctor") {
              return doctorId === employeeId;
            }

            return (
              assignedStaffId === employeeId
            );
          });

        const mapped =
          assignedBookings.map((booking) => ({
            id:
              booking.booking_number ||
              `BK-${booking.id}`,

            patientId:
              booking.patient_id != null
                ? `PAT-${booking.patient_id}`
                : "",

            patientName:
              booking.patient_name ||
              "Patient",

            date:
              booking.booking_date
                ? String(
                    booking.booking_date
                  )
                : "",

            time:
              booking.booking_time
                ? String(
                    booking.booking_time
                  )
                : "",

            department:
              booking.department ||
              booking.service_name ||
              "Not specified",

            type:
              booking.booking_type ||
              "In-Person",

            status:
              booking.status ||
              "Scheduled",

            priority:
              booking.priority ||
              "Normal",

            serviceLocation:
              booking.service_location_type ||
              "",

            address:
              booking.service_address ||
              "",
          }));

        setAppointments(mapped);
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Failed to load appointments:",
          err
        );

        setAppointments([]);

        setError(
          getErrorMessage(
            err,
            "Unable to load appointments. Please try again."
          )
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    /*
     * Without a logged-in user we cannot safely
     * determine which appointments belong to them.
     */
    if (!employeeId) {
      setAppointments([]);
      setError(
        "Unable to identify the logged-in workforce member."
      );
      setLoading(false);
      return;
    }

    fetchAppointments();

    return () => {
      cancelled = true;
    };
  }, [employeeId, role]);

  const filteredAppointments = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return appointments.filter(
      (appointment) => {
        const matchesSearch =
          !search ||
          appointment.id
            ?.toLowerCase()
            .includes(search) ||
          appointment.patientName
            ?.toLowerCase()
            .includes(search) ||
          appointment.patientId
            ?.toLowerCase()
            .includes(search) ||
          appointment.department
            ?.toLowerCase()
            .includes(search) ||
          appointment.type
            ?.toLowerCase()
            .includes(search) ||
          appointment.priority
            ?.toLowerCase()
            .includes(search);

        const matchesStatus =
          statusFilter === "All" ||
          appointment.status?.toLowerCase() ===
            statusFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    appointments,
    searchTerm,
    statusFilter,
  ]);

  const totalAppointments =
    appointments.length;

  const confirmedAppointments =
    appointments.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "confirmed"
    ).length;

  const completedAppointments =
    appointments.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "completed"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "pending"
    ).length;

  /*
   * Staff roles do not have appointment
   * management access.
   */
  const appointmentRoles = [
    "doctor",
    "nurse",
    "caregiver",
    "reception",
    "admin",
  ];

  if (
    role &&
    !appointmentRoles.includes(role)
  ) {
    return (
      <div className="space-y-6">

        <button
          type="button"
          onClick={() =>
            navigate("/workforce")
          }
          className="flex items-center gap-2 text-sm font-medium text-[#08A6A0] transition hover:text-[#073F42]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="flex min-h-[450px] items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">

          <div className="max-w-md text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F8F6] text-[#08A6A0]">
              <CalendarDays size={30} />
            </div>

            <h2 className="text-xl font-bold text-[#073F42]">
              Appointments Not Available
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Appointment management is not
              available for your current role.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/workforce")
              }
              className="mt-6 rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078f8a]"
            >
              Go to Dashboard
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ============================================================
          PAGE HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#073F42]">
            My Appointments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View appointments assigned to you.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#E8F8F6] px-4 py-2.5 text-sm font-medium text-[#087d79]">
          <CalendarDays size={18} />
          {totalAppointments} Total
        </div>

      </div>

      {/* ============================================================
          ERROR
      ============================================================ */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ============================================================
          SUMMARY CARDS
      ============================================================ */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <SummaryCard
          title="Total"
          value={totalAppointments}
          icon={
            <CalendarDays size={20} />
          }
        />

        <SummaryCard
          title="Confirmed"
          value={confirmedAppointments}
          icon={
            <CheckCircle size={20} />
          }
        />

        <SummaryCard
          title="Completed"
          value={completedAppointments}
          icon={
            <CheckCircle size={20} />
          }
        />

        <SummaryCard
          title="Pending"
          value={pendingAppointments}
          icon={
            <AlertCircle size={20} />
          }
        />

      </div>

      {/* ============================================================
          SEARCH AND FILTER
      ============================================================ */}

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patient, department..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              "Confirmed",
              "Pending",
              "Completed",
              "Cancelled",
            ].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setStatusFilter(status)
                }
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  statusFilter === status
                    ? "bg-[#08A6A0] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-[#E8F8F6] hover:text-[#087d79]"
                }`}
              >
                {status}
              </button>
            ))}

          </div>

        </div>

      </div>

      {/* ============================================================
          LOADING
      ============================================================ */}

      {loading ? (
        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#08A6A0]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your appointments...
          </p>

        </div>
      ) : filteredAppointments.length === 0 ? (

        /* ============================================================
           EMPTY
        ============================================================ */

        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <CalendarDays size={26} />
          </div>

          <h3 className="text-lg font-semibold text-[#073F42]">
            No appointments found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ||
            statusFilter !== "All"
              ? "Try changing your search or status filter."
              : "There are currently no appointments assigned to you."}
          </p>

        </div>

      ) : (

        /* ============================================================
           APPOINTMENTS
        ============================================================ */

        <div className="space-y-4">

          {filteredAppointments.map(
            (appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                  {/* PATIENT */}

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                      <User size={22} />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-[#073F42]">
                          {appointment.patientName}
                        </h3>

                        {appointment.patientId && (
                          <span className="text-xs text-gray-400">
                            {appointment.patientId}
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.type}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {appointment.department}
                      </p>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[500px]">

                    <DetailItem
                      icon={
                        <CalendarDays size={16} />
                      }
                      label="Date"
                      value={formatDate(
                        appointment.date
                      )}
                    />

                    <DetailItem
                      icon={
                        <Clock size={16} />
                      }
                      label="Time"
                      value={formatTime(
                        appointment.time
                      )}
                    />

                    <DetailItem
                      icon={
                        <MapPin size={16} />
                      }
                      label="Location"
                      value={
                        appointment.serviceLocation ||
                        appointment.department
                      }
                    />

                  </div>

                  {/* STATUS */}

                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        appointment.status
                      )}`}
                    >
                      {getStatusIcon(
                        appointment.status
                      )}

                      {appointment.status}
                    </span>
                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
};

/* ========================================================================
   SUMMARY CARD
======================================================================== */

const SummaryCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
        {icon}
      </div>

      <p className="text-xs font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#073F42]">
        {value}
      </p>

    </div>
  );
};

/* ========================================================================
   DETAIL ITEM
======================================================================== */

const DetailItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-2">

      <div className="mt-0.5 text-[#08A6A0]">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-[#073F42]">
          {value || "Not available"}
        </p>

      </div>

    </div>
  );
};

/* ========================================================================
   STATUS
======================================================================== */

const getStatusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-700";

    case "completed":
      return "bg-blue-100 text-blue-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "scheduled":
      return "bg-[#E8F8F6] text-[#087d79]";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

/* ========================================================================
   STATUS ICON
======================================================================== */

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "completed":
      return <CheckCircle size={15} />;

    case "cancelled":
      return <XCircle size={15} />;

    case "pending":
    case "scheduled":
    default:
      return <AlertCircle size={15} />;
  }
};

/* ========================================================================
   DATE
======================================================================== */

const formatDate = (date) => {
  if (!date) {
    return "Not scheduled";
  }

  const parsed = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

/* ========================================================================
   TIME
======================================================================== */

const formatTime = (time) => {
  if (!time) {
    return "Not specified";
  }

  const [hours, minutes] =
    time.split(":");

  const parsed = new Date();

  parsed.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  if (Number.isNaN(parsed.getTime())) {
    return time;
  }

  return parsed.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
};

export default Appointments;