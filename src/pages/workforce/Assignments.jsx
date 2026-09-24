import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  CalendarDays,
  Clock3,
  UserRound,
  MapPin,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  XCircle,
  ChevronRight,
} from "lucide-react";

import { apiRequest, getErrorMessage } from "../../api/api";

const Assignments = ({ user }) => {
  const storedUser = (() => {
    try {
      const value = localStorage.getItem("user");
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  })();

  const currentUser = user || storedUser;

  const employeeId = currentUser?.id
    ? String(currentUser.id)
    : "";

  const role = currentUser?.role?.toLowerCase() || "";

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const loadAssignments = async () => {
    setLoading(true);
    setError("");

    try {
      const [bookingData, serviceData] =
        await Promise.all([
          apiRequest("/bookings"),
          apiRequest("/services"),
        ]);

      setBookings(
        Array.isArray(bookingData)
          ? bookingData
          : []
      );

      setServices(
        Array.isArray(serviceData)
          ? serviceData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load workforce assignments:",
        err
      );

      setBookings([]);
      setServices([]);

      setError(
        getErrorMessage(
          err,
          "Unable to load assignments. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [employeeId]);

  const serviceMap = useMemo(() => {
    const map = {};

    services.forEach((service) => {
      if (service?.id != null) {
        map[String(service.id)] =
          service.name || "Service";
      }
    });

    return map;
  }, [services]);

  /*
   * A workforce assignment can come from:
   *
   * 1. doctor_id for doctors
   * 2. assigned_staff_id for assigned workforce staff
   *
   * Do not use fake employee IDs or workforceData.js here.
   */
  const assignments = useMemo(() => {
    if (!employeeId) {
      return [];
    }

    return bookings
      .filter((booking) => {
        const doctorId = booking?.doctor_id != null
          ? String(booking.doctor_id)
          : "";

        const assignedStaffId =
          booking?.assigned_staff_id != null
            ? String(booking.assigned_staff_id)
            : "";

        if (role === "doctor") {
          return doctorId === employeeId;
        }

        return assignedStaffId === employeeId;
      })
      .map((booking) => ({
        id:
          booking.booking_number ||
          `BK-${booking.booking_id}`,

        bookingId: booking.booking_id,

        patientName:
          booking.patient_name || "Patient",

        patientId:
          booking.patient_id != null
            ? String(booking.patient_id)
            : "",

        service:
          serviceMap[String(booking.service_id)] ||
          booking.booking_category ||
          "General Care",

        date:
          booking.booking_date
            ? String(booking.booking_date)
            : "",

        time:
          booking.booking_time
            ? String(booking.booking_time)
            : "",

        bookingType:
          booking.booking_type ||
          "In-Person",

        priority:
          booking.priority ||
          "Normal",

        status:
          booking.status ||
          "Scheduled",

        locationType:
          booking.service_location_type ||
          "",

        address:
          booking.service_address ||
          "",

        area:
          booking.service_area ||
          "",

        city:
          booking.service_city ||
          "",

        pincode:
          booking.service_pincode ||
          "",

        startDate:
          booking.service_start_date
            ? String(booking.service_start_date)
            : "",

        endDate:
          booking.service_end_date
            ? String(booking.service_end_date)
            : "",

        notes:
          booking.notes ||
          booking.reason ||
          "",
      }));
  }, [
    bookings,
    employeeId,
    role,
    serviceMap,
  ]);

  const filteredAssignments = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const matchesSearch =
        !search ||
        assignment.id
          ?.toLowerCase()
          .includes(search) ||
        assignment.patientName
          ?.toLowerCase()
          .includes(search) ||
        assignment.patientId
          ?.toLowerCase()
          .includes(search) ||
        assignment.service
          ?.toLowerCase()
          .includes(search) ||
        assignment.bookingType
          ?.toLowerCase()
          .includes(search) ||
        assignment.priority
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        assignment.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    assignments,
    searchTerm,
    statusFilter,
  ]);

  const counts = useMemo(() => {
    return {
      total: assignments.length,

      scheduled: assignments.filter(
        (item) =>
          item.status?.toLowerCase() ===
          "scheduled"
      ).length,

      confirmed: assignments.filter(
        (item) =>
          item.status?.toLowerCase() ===
          "confirmed"
      ).length,

      completed: assignments.filter(
        (item) =>
          item.status?.toLowerCase() ===
          "completed"
      ).length,
    };
  }, [assignments]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const hasFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "All";

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

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

  const formatTime = (time) => {
    if (!time) return "Not specified";

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

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-[#EAF7EF] text-[#16834A]";

      case "completed":
        return "bg-[#EDF5FF] text-[#2773C7]";

      case "cancelled":
        return "bg-[#FDECEC] text-[#C74444]";

      case "no show":
        return "bg-[#FFF6DE] text-[#A66A00]";

      case "scheduled":
      default:
        return "bg-[#E8F8F6] text-[#087F7A]";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "emergency":
        return "bg-[#FDECEC] text-[#C74444]";

      case "high":
        return "bg-[#FFF6DE] text-[#A66A00]";

      case "low":
        return "bg-[#F1F4F4] text-[#667877]";

      case "normal":
      default:
        return "bg-[#E8F8F6] text-[#087F7A]";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return CheckCircle2;

      case "cancelled":
      case "no show":
        return XCircle;

      default:
        return CircleAlert;
    }
  };

  return (
    <div className="space-y-5">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <section className="border-b border-[#DCEBE9] pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <BriefcaseBusiness
                className="h-4 w-4 text-[#08A6A0]"
              />

              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#08A6A0]">
                Workforce
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[#073F42] sm:text-3xl">
              My Assignments
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm text-[#6B7F7B]">
              View the patients, services, and duties
              assigned to you.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-lg border border-[#DCEBE9] bg-white px-4 py-3 sm:self-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#087F7A]">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>

            <div>
              <p className="text-lg font-semibold leading-none text-[#073F42]">
                {counts.total}
              </p>

              <p className="mt-1 text-[10px] text-[#819596]">
                Total assignments
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          SUMMARY
      ============================================================ */}

      <section className="overflow-hidden rounded-xl border border-[#DCEBE9] bg-white">
        <div className="grid grid-cols-2 divide-x divide-y divide-[#E8F0EF] lg:grid-cols-4 lg:divide-y-0">

          <SummaryItem
            label="All"
            value={counts.total}
            active={statusFilter === "All"}
            onClick={() =>
              setStatusFilter("All")
            }
          />

          <SummaryItem
            label="Scheduled"
            value={counts.scheduled}
            active={
              statusFilter === "Scheduled"
            }
            onClick={() =>
              setStatusFilter("Scheduled")
            }
          />

          <SummaryItem
            label="Confirmed"
            value={counts.confirmed}
            active={
              statusFilter === "Confirmed"
            }
            onClick={() =>
              setStatusFilter("Confirmed")
            }
          />

          <SummaryItem
            label="Completed"
            value={counts.completed}
            active={
              statusFilter === "Completed"
            }
            onClick={() =>
              setStatusFilter("Completed")
            }
          />

        </div>
      </section>

      {/* ============================================================
          SEARCH / FILTER
      ============================================================ */}

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search assignment, patient, service..."
            className="h-10 w-full rounded-lg border border-[#DCEBE9] bg-white pl-10 pr-10 text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() =>
                setSearchTerm("")
              }
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#819596] hover:bg-[#E8F8F6] hover:text-[#087F7A]"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#819596]" />

          <div className="flex flex-wrap gap-1.5">
            {[
              "All",
              "Scheduled",
              "Confirmed",
              "Completed",
              "Cancelled",
            ].map((status) => {
              const selected =
                statusFilter === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    selected
                      ? "bg-[#073F42] text-white"
                      : "bg-white text-[#55716E] hover:bg-[#E8F8F6] hover:text-[#087F7A]"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 text-xs font-medium text-[#08A6A0] hover:text-[#073F42]"
            >
              Clear
            </button>
          )}
        </div>

      </section>

      {/* ============================================================
          ERROR
      ============================================================ */}

      {error && (
        <section className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </section>
      )}

      {/* ============================================================
          LOADING
      ============================================================ */}

      {loading ? (
        <section className="rounded-xl border border-[#DCEBE9] bg-white px-6 py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#DCEBE9] border-t-[#08A6A0]" />

          <p className="mt-4 text-sm text-[#819596]">
            Loading your assignments...
          </p>
        </section>
      ) : filteredAssignments.length === 0 ? (
        <EmptyState
          hasFilters={hasFilters}
          onClear={clearFilters}
        />
      ) : (
        <section className="overflow-hidden rounded-xl border border-[#DCEBE9] bg-white">

          {/* ========================================================
              DESKTOP TABLE
          ======================================================== */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1000px] border-collapse">

              <thead>
                <tr className="border-b border-[#E2EFED] bg-[#F8FCFB]">
                  <TableHeader>
                    Assignment
                  </TableHeader>

                  <TableHeader>
                    Patient
                  </TableHeader>

                  <TableHeader>
                    Service
                  </TableHeader>

                  <TableHeader>
                    Date / Time
                  </TableHeader>

                  <TableHeader>
                    Type
                  </TableHeader>

                  <TableHeader>
                    Priority
                  </TableHeader>

                  <TableHeader>
                    Status
                  </TableHeader>

                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>

              <tbody>
                {filteredAssignments.map(
                  (assignment) => (
                    <AssignmentRow
                      key={assignment.id}
                      assignment={assignment}
                      onClick={() =>
                        setSelectedAssignment(
                          assignment
                        )
                      }
                      getStatusClass={
                        getStatusClass
                      }
                      getPriorityClass={
                        getPriorityClass
                      }
                    />
                  )
                )}
              </tbody>

            </table>
          </div>

          {/* ========================================================
              MOBILE
          ======================================================== */}

          <div className="divide-y divide-[#E8F0EF] md:hidden">
            {filteredAssignments.map(
              (assignment) => (
                <MobileAssignment
                  key={assignment.id}
                  assignment={assignment}
                  onClick={() =>
                    setSelectedAssignment(
                      assignment
                    )
                  }
                  getStatusClass={
                    getStatusClass
                  }
                  getPriorityClass={
                    getPriorityClass
                  }
                />
              )
            )}
          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-between border-t border-[#E8F0EF] bg-[#FCFEFD] px-4 py-3 sm:px-5">
            <p className="text-xs text-[#819596]">
              Showing{" "}
              <span className="font-semibold text-[#31585A]">
                {filteredAssignments.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#31585A]">
                {assignments.length}
              </span>
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-[#08A6A0] hover:text-[#073F42]"
              >
                Reset
              </button>
            )}
          </div>

        </section>
      )}

      {/* ============================================================
          DETAILS MODAL
      ============================================================ */}

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-[#073F42]">
                  Assignment Details
                </h2>

                <p className="mt-1 text-sm font-medium text-[#08A6A0]">
                  {selectedAssignment.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAssignment(
                    null
                  )
                }
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close assignment details"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="rounded-xl bg-[#E8F8F6] p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#08A6A0]">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Patient
                    </p>

                    <p className="font-semibold text-[#073F42]">
                      {selectedAssignment.patientName}
                    </p>

                    {selectedAssignment.patientId && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        Patient ID:{" "}
                        {selectedAssignment.patientId}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">

                <DetailItem
                  label="Service"
                  value={
                    selectedAssignment.service
                  }
                />

                <DetailItem
                  label="Assignment Type"
                  value={
                    selectedAssignment.bookingType
                  }
                />

                <DetailItem
                  label="Date"
                  value={formatDate(
                    selectedAssignment.date
                  )}
                />

                <DetailItem
                  label="Time"
                  value={formatTime(
                    selectedAssignment.time
                  )}
                />

                <DetailItem
                  label="Priority"
                  value={
                    selectedAssignment.priority
                  }
                />

                <DetailItem
                  label="Status"
                  value={
                    selectedAssignment.status
                  }
                />

              </div>

              {(selectedAssignment.address ||
                selectedAssignment.city) && (
                <div>
                  <p className="text-xs text-gray-500">
                    Service Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {[
                      selectedAssignment.address,
                      selectedAssignment.area,
                      selectedAssignment.city,
                      selectedAssignment.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}

              {(selectedAssignment.startDate ||
                selectedAssignment.endDate) && (
                <div>
                  <p className="text-xs text-gray-500">
                    Service Period
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedAssignment.startDate
                      ? formatDate(
                          selectedAssignment.startDate
                        )
                      : "Not specified"}{" "}
                    →{" "}
                    {selectedAssignment.endDate
                      ? formatDate(
                          selectedAssignment.endDate
                        )
                      : "Not specified"}
                  </p>
                </div>
              )}

              {selectedAssignment.notes && (
                <div>
                  <p className="text-xs text-gray-500">
                    Notes
                  </p>

                  <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                    {selectedAssignment.notes}
                  </p>
                </div>
              )}

            </div>

            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedAssignment(
                    null
                  )
                }
                className="rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Assignments;

/* ========================================================================
   SUMMARY ITEM
======================================================================== */

const SummaryItem = ({
  label,
  value,
  active,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-between px-5 py-4 text-left transition ${
      active
        ? "bg-[#F2FAF9]"
        : "bg-white hover:bg-[#FAFCFC]"
    }`}
  >
    <div>
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${
          active
            ? "text-[#087F7A]"
            : "text-[#819596]"
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold leading-none text-[#073F42]">
        {value}
      </p>
    </div>

    {active && (
      <span className="h-1.5 w-1.5 rounded-full bg-[#08A6A0]" />
    )}
  </button>
);

/* ========================================================================
   TABLE HEADER
======================================================================== */

const TableHeader = ({ children }) => (
  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#819596] first:pl-5">
    {children}
  </th>
);

/* ========================================================================
   DESKTOP ROW
======================================================================== */

const AssignmentRow = ({
  assignment,
  onClick,
  getStatusClass,
  getPriorityClass,
}) => (
  <tr
    onClick={onClick}
    className="group cursor-pointer border-b border-[#E8F0EF] transition hover:bg-[#FBFDFD]"
  >
    <td className="px-4 py-4 pl-5">
      <p className="text-sm font-semibold text-[#073F42]">
        {assignment.id}
      </p>

      <p className="mt-0.5 text-[11px] text-[#819596]">
        Booking assignment
      </p>
    </td>

    <td className="px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#087F7A]">
          <UserRound className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#073F42]">
            {assignment.patientName}
          </p>

          {assignment.patientId && (
            <p className="mt-0.5 text-[11px] text-[#819596]">
              Patient #{assignment.patientId}
            </p>
          )}
        </div>
      </div>
    </td>

    <td className="px-4 py-4">
      <p className="max-w-[180px] truncate text-sm font-medium text-[#31585A]">
        {assignment.service}
      </p>
    </td>

    <td className="px-4 py-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-3.5 w-3.5 text-[#819596]" />

        <div>
          <p className="text-xs text-[#55716E]">
            {formatDisplayDate(
              assignment.date
            )}
          </p>

          <p className="mt-0.5 text-[11px] text-[#819596]">
            {formatDisplayTime(
              assignment.time
            )}
          </p>
        </div>
      </div>
    </td>

    <td className="px-4 py-4">
      <span className="text-xs text-[#55716E]">
        {assignment.bookingType}
      </span>
    </td>

    <td className="px-4 py-4">
      <span
        className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold ${getPriorityClass(
          assignment.priority
        )}`}
      >
        {assignment.priority}
      </span>
    </td>

    <td className="px-4 py-4">
      <span
        className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold ${getStatusClass(
          assignment.status
        )}`}
      >
        {assignment.status}
      </span>
    </td>

    <td className="px-4 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9AAEAF] transition group-hover:bg-[#E8F8F6] group-hover:text-[#087F7A]">
        <ChevronRight className="h-4 w-4" />
      </div>
    </td>
  </tr>
);

/* ========================================================================
   MOBILE
======================================================================== */

const MobileAssignment = ({
  assignment,
  onClick,
  getStatusClass,
  getPriorityClass,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="block w-full p-4 text-left transition active:bg-[#F8FCFB]"
  >
    <div className="flex items-start justify-between gap-3">

      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#087F7A]">
          <BriefcaseBusiness size={17} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#073F42]">
            {assignment.patientName}
          </p>

          <p className="mt-0.5 text-[11px] text-[#819596]">
            {assignment.id}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold ${getStatusClass(
          assignment.status
        )}`}
      >
        {assignment.status}
      </span>

    </div>

    <div className="mt-4 grid grid-cols-2 gap-2">

      <MobileDetail
        icon={
          <BriefcaseBusiness className="h-3.5 w-3.5" />
        }
        label="Service"
        value={assignment.service}
      />

      <MobileDetail
        icon={
          <CalendarDays className="h-3.5 w-3.5" />
        }
        label="Date"
        value={formatDisplayDate(
          assignment.date
        )}
      />

      <MobileDetail
        icon={
          <Clock3 className="h-3.5 w-3.5" />
        }
        label="Time"
        value={formatDisplayTime(
          assignment.time
        )}
      />

      <MobileDetail
        icon={
          <MapPin className="h-3.5 w-3.5" />
        }
        label="Type"
        value={assignment.bookingType}
      />

    </div>

    <div className="mt-4 flex items-center justify-between border-t border-[#E8F0EF] pt-3">

      <span
        className={`rounded-md px-2 py-1 text-[10px] font-semibold ${getPriorityClass(
          assignment.priority
        )}`}
      >
        {assignment.priority} priority
      </span>

      <span className="flex items-center gap-1 text-xs font-medium text-[#087F7A]">
        View details
        <ChevronRight className="h-3.5 w-3.5" />
      </span>

    </div>
  </button>
);

/* ========================================================================
   MOBILE DETAIL
======================================================================== */

const MobileDetail = ({
  icon,
  label,
  value,
}) => (
  <div className="min-w-0 rounded-lg bg-[#FAFCFC] p-2">
    <div className="flex items-center gap-1.5 text-[#08A6A0]">
      {icon}

      <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-[#9AAEAF]">
        {label}
      </span>
    </div>

    <p className="mt-1 truncate text-xs font-medium text-[#31585A]">
      {value || "Not available"}
    </p>
  </div>
);

/* ========================================================================
   DETAIL ITEM
======================================================================== */

const DetailItem = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs text-gray-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-medium text-gray-900">
      {value || "Not available"}
    </p>
  </div>
);

/* ========================================================================
   EMPTY STATE
======================================================================== */

const EmptyState = ({
  hasFilters,
  onClear,
}) => (
  <section className="rounded-xl border border-dashed border-[#CFE1DE] bg-white px-6 py-14 text-center">

    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
      <BriefcaseBusiness className="h-5 w-5" />
    </div>

    <h2 className="mt-4 text-base font-semibold text-[#073F42]">
      No assignments found
    </h2>

    <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#819596]">
      {hasFilters
        ? "No assignments match your current search or status filter."
        : "There are no assignments currently linked to your account."}
    </p>

    {hasFilters && (
      <button
        type="button"
        onClick={onClear}
        className="mt-4 rounded-lg bg-[#073F42] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#087F7A]"
      >
        Clear filters
      </button>
    )}

  </section>
);

/* ========================================================================
   DISPLAY HELPERS
======================================================================== */

const formatDisplayDate = (date) => {
  if (!date) return "Not scheduled";

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

const formatDisplayTime = (time) => {
  if (!time) return "Not specified";

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