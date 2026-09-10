import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";

import {
  getWorkforceUser,
  getUserLeaves,
} from "../../data/workforceData";

const Leave = ({ user }) => {
  const employeeId = user?.id || "EMP-1001";

  const profile =
    getWorkforceUser(employeeId) || getWorkforceUser("EMP-1001");

  const existingLeaves = getUserLeaves(employeeId);

  const [leaves, setLeaves] = useState(existingLeaves);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const filteredLeaves = useMemo(() => {
    if (statusFilter === "All") {
      return leaves;
    }

    return leaves.filter(
      (leave) =>
        leave.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [leaves, statusFilter]);

  const approvedCount = leaves.filter(
    (leave) => leave.status?.toLowerCase() === "approved"
  ).length;

  const pendingCount = leaves.filter(
    (leave) => leave.status?.toLowerCase() === "pending"
  ).length;

  const rejectedCount = leaves.filter(
    (leave) => leave.status?.toLowerCase() === "rejected"
  ).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fromDate ||
      !formData.toDate ||
      !formData.reason.trim()
    ) {
      return;
    }

    const newLeave = {
      id: `LV-${String(leaves.length + 1).padStart(3, "0")}`,
      employeeId,
      leaveType: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason,
      status: "Pending",
    };

    setLeaves((previous) => [newLeave, ...previous]);

    setFormData({
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      reason: "",
    });

    setShowModal(false);
  };

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle size={15} />;

      case "pending":
        return <Clock size={15} />;

      case "rejected":
        return <XCircle size={15} />;

      default:
        return <AlertCircle size={15} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#073F42]">
            Leave Requests
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Apply for leave and track your leave requests.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex w-fit items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078f8a]"
        >
          <Plus size={18} />
          Apply for Leave
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Total Requests"
          value={leaves.length}
          icon={<CalendarDays size={20} />}
        />

        <SummaryCard
          title="Approved"
          value={approvedCount}
          icon={<CheckCircle size={20} />}
        />

        <SummaryCard
          title="Pending"
          value={pendingCount}
          icon={<Clock size={20} />}
        />

        <SummaryCard
          title="Rejected"
          value={rejectedCount}
          icon={<XCircle size={20} />}
        />
      </div>

      {/* Leave History */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#073F42]">
              Leave History
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Your submitted leave requests
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Approved", "Pending", "Rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    statusFilter === status
                      ? "bg-[#08A6A0] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-[#E8F8F6] hover:text-[#087d79]"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredLeaves.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <CalendarDays size={26} />
            </div>

            <h3 className="text-lg font-semibold text-[#073F42]">
              No Leave Requests
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              No leave requests match the selected filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Request
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Leave Type
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      From
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      To
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Reason
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#073F42]">
                          {leave.id}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {leave.leaveType || leave.type || "Leave"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <DateValue value={leave.fromDate} />
                      </td>

                      <td className="px-6 py-4">
                        <DateValue value={leave.toDate} />
                      </td>

                      <td className="max-w-[250px] px-6 py-4">
                        <p className="truncate text-sm text-gray-600">
                          {leave.reason || "No reason provided"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          status={leave.status}
                          getStatusClasses={getStatusClasses}
                          getStatusIcon={getStatusIcon}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-4 lg:hidden">
              {filteredLeaves.map((leave) => (
                <LeaveCard
                  key={leave.id}
                  leave={leave}
                  getStatusClasses={getStatusClasses}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-[#073F42]">
                  Apply for Leave
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Submit a new leave request.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#073F42]">
                  Leave Type
                </label>

                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#08A6A0]"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Emergency Leave</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#073F42]">
                    From Date
                  </label>

                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#073F42]">
                    To Date
                  </label>

                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    min={
                      formData.fromDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#08A6A0]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#073F42]">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Enter the reason for your leave..."
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#08A6A0]"
                />
              </div>

              {/* Employee */}
              <div className="rounded-xl bg-[#E8F8F6] p-4">
                <p className="text-xs font-medium text-gray-500">
                  Applying Employee
                </p>

                <p className="mt-1 text-sm font-semibold text-[#073F42]">
                  {profile?.name}
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  {profile?.id} • {profile?.designation}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078f8a]"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* Date Value */
const DateValue = ({ value }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <CalendarDays size={15} className="text-[#08A6A0]" />
      {value || "Not available"}
    </div>
  );
};

/* Status Badge */
const StatusBadge = ({
  status,
  getStatusClasses,
  getStatusIcon,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClasses(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status || "Pending"}
    </span>
  );
};

/* Mobile Leave Card */
const LeaveCard = ({
  leave,
  getStatusClasses,
  getStatusIcon,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-400">
            {leave.id}
          </p>

          <h3 className="mt-1 font-semibold text-[#073F42]">
            {leave.leaveType || leave.type || "Leave"}
          </h3>
        </div>

        <StatusBadge
          status={leave.status}
          getStatusClasses={getStatusClasses}
          getStatusIcon={getStatusIcon}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <InfoBox
          label="From"
          value={leave.fromDate}
        />

        <InfoBox
          label="To"
          value={leave.toDate}
        />
      </div>

      <div className="mt-3 rounded-lg bg-gray-50 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          Reason
        </p>

        <p className="mt-1 text-sm text-gray-600">
          {leave.reason || "No reason provided"}
        </p>
      </div>
    </div>
  );
};

/* Info Box */
const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#073F42]">
        {value || "N/A"}
      </p>
    </div>
  );
};

/* Summary Card */
const SummaryCard = ({ title, value, icon }) => {
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

export default Leave;