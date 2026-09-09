import { useMemo, useState } from "react";
import {
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  IndianRupee,
  LabCase,
  Printer,
  Receipt,
  X,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

const INITIAL_BILLS = [
  {
    id: "BILL-2026-00124",
    patientId: "PAT-1024",
    patient: "Rahul Sharma",
    phone: "9876543210",
    type: "Patient Bill",
    service: "General Consultation",
    doctor: "Dr. Ananya Sen",
    department: "General Medicine",
    date: "2026-09-09",
    dueDate: "2026-09-12",
    amount: 850,
    paid: 0,
    status: "Unpaid",
    paymentMethod: "",
    transactionId: "",
    paidAt: "",
    items: [
      { name: "Consultation Fee", amount: 600 },
      { name: "Registration", amount: 100 },
      { name: "Service Charge", amount: 150 },
    ],
  },
  {
    id: "LAB-2026-00881",
    patientId: "PAT-1041",
    patient: "Priya Das",
    phone: "9830012345",
    type: "Lab Test Bill",
    service: "Complete Blood Count (CBC)",
    doctor: "Dr. R. Chatterjee",
    department: "Pathology",
    date: "2026-09-09",
    dueDate: "2026-09-10",
    amount: 650,
    paid: 0,
    status: "Unpaid",
    paymentMethod: "",
    transactionId: "",
    paidAt: "",
    items: [
      { name: "CBC Test", amount: 500 },
      { name: "Sample Collection", amount: 100 },
      { name: "Report Processing", amount: 50 },
    ],
  },
  {
    id: "BILL-2026-00119",
    patientId: "PAT-1017",
    patient: "Amit Roy",
    phone: "9007012345",
    type: "Patient Bill",
    service: "Outpatient Follow-up",
    doctor: "Dr. S. Mukherjee",
    department: "Cardiology",
    date: "2026-09-08",
    dueDate: "2026-09-08",
    amount: 1200,
    paid: 1200,
    status: "Paid",
    paymentMethod: "UPI",
    transactionId: "TXN826481920",
    paidAt: "08 Sep 2026, 04:42 PM",
    items: [
      { name: "Follow-up Consultation", amount: 800 },
      { name: "ECG", amount: 400 },
    ],
  },
  {
    id: "LAB-2026-00872",
    patientId: "PAT-1008",
    patient: "Sneha Ghosh",
    phone: "9123456789",
    type: "Lab Test Bill",
    service: "Lipid Profile",
    doctor: "Dr. P. Dutta",
    department: "Biochemistry",
    date: "2026-09-08",
    dueDate: "2026-09-11",
    amount: 900,
    paid: 0,
    status: "Unpaid",
    paymentMethod: "",
    transactionId: "",
    paidAt: "",
    items: [
      { name: "Lipid Profile", amount: 750 },
      { name: "Sample Collection", amount: 100 },
      { name: "Report Processing", amount: 50 },
    ],
  },
  {
    id: "BILL-2026-00103",
    patientId: "PAT-0998",
    patient: "Sourav Paul",
    phone: "9831122233",
    type: "Patient Bill",
    service: "Emergency Consultation",
    doctor: "Dr. N. Bose",
    department: "Emergency",
    date: "2026-09-07",
    dueDate: "2026-09-07",
    amount: 2500,
    paid: 2500,
    status: "Paid",
    paymentMethod: "Card",
    transactionId: "TXN825710442",
    paidAt: "07 Sep 2026, 10:18 PM",
    items: [
      { name: "Emergency Consultation", amount: 1200 },
      { name: "Emergency Service", amount: 800 },
      { name: "Consumables", amount: 500 },
    ],
  },
  {
    id: "LAB-2026-00855",
    patientId: "PAT-0987",
    patient: "Moumita Sen",
    phone: "8900123456",
    type: "Lab Test Bill",
    service: "Thyroid Profile",
    doctor: "Dr. A. Ghosh",
    department: "Endocrinology",
    date: "2026-09-06",
    dueDate: "2026-09-09",
    amount: 1100,
    paid: 0,
    status: "Unpaid",
    paymentMethod: "",
    transactionId: "",
    paidAt: "",
    items: [
      { name: "T3", amount: 250 },
      { name: "T4", amount: 250 },
      { name: "TSH", amount: 450 },
      { name: "Sample Collection", amount: 150 },
    ],
  },
];

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const generateTransactionId = () =>
  `TXN${Date.now().toString().slice(-9)}`;

function StatusBadge({ status }) {
  const isPaid = status === "Paid";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPaid
          ? "bg-[#E8F8F6] text-[#078F8A]"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {isPaid ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
      {status}
    </span>
  );
}

function BillTypeBadge({ type }) {
  const isLab = type === "Lab Test Bill";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
        isLab
          ? "bg-violet-50 text-violet-700"
          : "bg-[#E8F8F6] text-[#078F8A]"
      }`}
    >
      {isLab ? <LabCase size={13} /> : <Receipt size={13} />}
      {type}
    </span>
  );
}

function Modal({ children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
      <div
        className={`max-h-[92vh] w-full overflow-hidden rounded-2xl bg-white shadow-2xl ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function IconButton({ title, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export default function Billing() {
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const [selectedBill, setSelectedBill] = useState(null);
  const [payBill, setPayBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [receiptBill, setReceiptBill] = useState(null);
  const [deleteBill, setDeleteBill] = useState(null);

  const stats = useMemo(() => {
    const total = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const collected = bills.reduce((sum, bill) => sum + bill.paid, 0);

    return {
      total,
      collected,
      outstanding: total - collected,
      unpaid: bills.filter((bill) => bill.status === "Unpaid").length,
      lab: bills.filter((bill) => bill.type === "Lab Test Bill").length,
    };
  }, [bills]);

  const availableDates = useMemo(
    () => [...new Set(bills.map((bill) => bill.date))].sort().reverse(),
    [bills]
  );

  const filteredBills = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bills.filter((bill) => {
      const searchableValues = [
        bill.id,
        bill.patient,
        bill.patientId,
        bill.phone,
        bill.service,
        bill.doctor,
        bill.department,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value).toLowerCase().includes(query)
        );

      const matchesType =
        typeFilter === "All" || bill.type === typeFilter;
      const matchesStatus =
        statusFilter === "All" || bill.status === statusFilter;
      const matchesDate =
        dateFilter === "All" || bill.date === dateFilter;

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [bills, search, typeFilter, statusFilter, dateFilter]);

  const hasFilters =
    Boolean(search) ||
    typeFilter !== "All" ||
    statusFilter !== "All" ||
    dateFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setDateFilter("All");
  };

  const openPayment = (bill) => {
    setPaymentMethod("UPI");
    setPayBill(bill);
  };

  const completePayment = () => {
    if (!payBill) return;

    const transactionId = generateTransactionId();
    const paidAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const updatedBill = {
      ...payBill,
      paid: payBill.amount,
      status: "Paid",
      paymentMethod,
      transactionId,
      paidAt,
    };

    setBills((currentBills) =>
      currentBills.map((bill) =>
        bill.id === updatedBill.id ? updatedBill : bill
      )
    );

    setPayBill(null);
    setSelectedBill(null);
    setReceiptBill(updatedBill);
  };

  const removeBill = () => {
    if (!deleteBill) return;

    setBills((currentBills) =>
      currentBills.filter((bill) => bill.id !== deleteBill.id)
    );

    if (selectedBill?.id === deleteBill.id) setSelectedBill(null);
    if (receiptBill?.id === deleteBill.id) setReceiptBill(null);
    setDeleteBill(null);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-full space-y-4 bg-[#F7FBFA] p-3 sm:p-4 lg:p-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
            <BadgeIndianRupee size={23} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#173F41] sm:text-2xl">
              Billing & Payments
            </h1>
            <p className="text-xs text-[#789092] sm:text-sm">
              Manage patient bills, lab test charges, payments and receipts.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard
          icon={IndianRupee}
          label="Total Billing"
          value={money(stats.total)}
        />
        <StatCard
          icon={CheckCircle2}
          label="Collected"
          value={money(stats.collected)}
        />
        <StatCard
          icon={Clock3}
          label="Outstanding"
          value={money(stats.outstanding)}
        />
        <StatCard
          icon={FileText}
          label="Unpaid Bills"
          value={stats.unpaid}
        />
        <StatCard
          icon={LabCase}
          label="Lab Bills"
          value={stats.lab}
        />
      </div>

      {/* Search and filters */}
      <SearchFilter
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        placeholder="Search bill ID, patient, ID or service..."
      >
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="h-10 rounded-lg border border-[#DCEBE9] bg-white px-3 text-sm text-[#456466] outline-none focus:border-[#08A6A0]"
        >
          <option value="All">All Bill Types</option>
          <option value="Patient Bill">Patient Bill</option>
          <option value="Lab Test Bill">Lab Test Bill</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 rounded-lg border border-[#DCEBE9] bg-white px-3 text-sm text-[#456466] outline-none focus:border-[#08A6A0]"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <select
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className="h-10 rounded-lg border border-[#DCEBE9] bg-white px-3 text-sm text-[#456466] outline-none focus:border-[#08A6A0]"
        >
          <option value="All">All Dates</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>
      </SearchFilter>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-medium text-[#5F7375]">
          Showing{" "}
          <span className="font-bold text-[#173F41]">
            {filteredBills.length}
          </span>{" "}
          bills
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-[#08A6A0] hover:text-[#078F8A]"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm lg:block">
        <div className="max-h-[560px] overflow-auto">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#F8FCFB]">
              <tr className="border-b border-[#E2EFED] text-xs font-bold uppercase tracking-wide text-[#789092]">
                <th className="px-4 py-3">Bill / Patient</th>
                <th className="px-4 py-3">Bill Type</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF4F2]">
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  className="text-sm hover:bg-[#F8FCFB]"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#173F41]">
                      {bill.patient}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8A9A9B]">
                      {bill.id} · {bill.patientId}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <BillTypeBadge type={bill.type} />
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-[#456466]">
                      {bill.service}
                    </p>
                    <p className="text-xs text-[#9AA9AA]">
                      {bill.department}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-[#5F7375]">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {formatDate(bill.date)}
                    </div>
                  </td>

                  <td className="px-4 py-3 font-bold text-[#173F41]">
                    {money(bill.amount)}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={bill.status} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <IconButton
                        title="View bill"
                        onClick={() => setSelectedBill(bill)}
                        className="text-[#5F7375] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                      >
                        <Eye size={16} />
                      </IconButton>

                      {bill.status === "Unpaid" ? (
                        <button
                          type="button"
                          onClick={() => openPayment(bill)}
                          className="rounded-lg bg-[#08A6A0] px-3 py-2 text-xs font-bold text-white hover:bg-[#078F8A]"
                        >
                          Pay
                        </button>
                      ) : (
                        <IconButton
                          title="View receipt"
                          onClick={() => setReceiptBill(bill)}
                          className="text-[#078F8A] hover:bg-[#E8F8F6]"
                        >
                          <Receipt size={16} />
                        </IconButton>
                      )}

                      <IconButton
                        title="Remove bill"
                        onClick={() => setDeleteBill(bill)}
                        className="text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <X size={16} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBills.length === 0 && (
            <div className="py-14 text-center text-sm text-[#789092]">
              No bills found.
            </div>
          )}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filteredBills.map((bill) => (
          <div
            key={bill.id}
            className="rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[#173F41]">{bill.patient}</p>
                <p className="text-xs text-[#8A9A9B]">
                  {bill.id} · {bill.patientId}
                </p>
              </div>
              <StatusBadge status={bill.status} />
            </div>

            <div className="mt-3">
              <BillTypeBadge type={bill.type} />
              <p className="mt-2 font-medium text-[#456466]">
                {bill.service}
              </p>
              <p className="text-xs text-[#9AA9AA]">
                {bill.department} · {formatDate(bill.date)}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#EDF4F2] pt-3">
              <p className="text-lg font-bold text-[#173F41]">
                {money(bill.amount)}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBill(bill)}
                  className="rounded-lg border border-[#DCEBE9] px-3 py-2 text-xs font-semibold text-[#456466]"
                >
                  View
                </button>

                {bill.status === "Unpaid" ? (
                  <button
                    type="button"
                    onClick={() => openPayment(bill)}
                    className="rounded-lg bg-[#08A6A0] px-3 py-2 text-xs font-bold text-white"
                  >
                    Pay Now
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReceiptBill(bill)}
                    className="rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-bold text-[#078F8A]"
                  >
                    Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredBills.length === 0 && (
          <div className="rounded-xl border border-[#E2EFED] bg-white py-14 text-center text-sm text-[#789092]">
            No bills found.
          </div>
        )}
      </div>

      {/* Bill details modal */}
      {selectedBill && (
        <Modal wide>
          <div className="flex max-h-[92vh] flex-col">
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-5 py-4">
              <div>
                <h2 className="font-bold text-[#173F41]">Bill Details</h2>
                <p className="text-xs text-[#8A9A9B]">
                  {selectedBill.id}
                </p>
              </div>

              <IconButton
                title="Close"
                onClick={() => setSelectedBill(null)}
                className="text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </IconButton>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[#F8FCFB] p-4">
                  <p className="text-xs text-[#8A9A9B]">Patient</p>
                  <p className="mt-1 font-bold text-[#173F41]">
                    {selectedBill.patient}
                  </p>
                  <p className="text-xs text-[#789092]">
                    {selectedBill.patientId} · {selectedBill.phone}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FCFB] p-4">
                  <p className="text-xs text-[#8A9A9B]">Service</p>
                  <p className="mt-1 font-bold text-[#173F41]">
                    {selectedBill.service}
                  </p>
                  <p className="text-xs text-[#789092]">
                    {selectedBill.department}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FCFB] p-4">
                  <p className="text-xs text-[#8A9A9B]">Doctor</p>
                  <p className="mt-1 font-bold text-[#173F41]">
                    {selectedBill.doctor}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FCFB] p-4">
                  <p className="text-xs text-[#8A9A9B]">Due Date</p>
                  <p className="mt-1 font-bold text-[#173F41]">
                    {formatDate(selectedBill.dueDate)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#E2EFED] p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-[#173F41]">
                    Charge Breakdown
                  </p>
                  <BillTypeBadge type={selectedBill.type} />
                </div>

                {selectedBill.items.map((item) => (
                  <div
                    key={`${selectedBill.id}-${item.name}`}
                    className="flex justify-between border-b border-[#EDF4F2] py-2.5 text-sm last:border-0"
                  >
                    <span className="text-[#5F7375]">{item.name}</span>
                    <span className="font-semibold text-[#173F41]">
                      {money(item.amount)}
                    </span>
                  </div>
                ))}

                <div className="mt-3 flex justify-between border-t border-[#DCEBE9] pt-3 text-base font-bold text-[#173F41]">
                  <span>Total</span>
                  <span>{money(selectedBill.amount)}</span>
                </div>
              </div>

              {selectedBill.status === "Paid" && (
                <div className="mt-4 grid gap-3 rounded-xl bg-[#F8FCFB] p-4 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-[#9AA9AA]">Payment Status</span>
                    <p className="mt-1 font-bold text-[#078F8A]">PAID</p>
                  </div>
                  <div>
                    <span className="text-[#9AA9AA]">Method</span>
                    <p className="mt-1 font-bold text-[#173F41]">
                      {selectedBill.paymentMethod || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9AA9AA]">Transaction ID</span>
                    <p className="mt-1 break-all font-bold text-[#173F41]">
                      {selectedBill.transactionId || "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#E2EFED] bg-white px-5 py-4 sm:flex-row sm:justify-end">
              {selectedBill.status === "Unpaid" ? (
                <button
                  type="button"
                  onClick={() => openPayment(selectedBill)}
                  className="rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#078F8A]"
                >
                  Pay {money(selectedBill.amount)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setReceiptBill(selectedBill)}
                  className="rounded-lg bg-[#E8F8F6] px-4 py-2.5 text-sm font-bold text-[#078F8A]"
                >
                  <Receipt size={16} className="mr-2 inline" />
                  View Receipt
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="rounded-lg border border-[#DCEBE9] px-4 py-2.5 text-sm font-semibold text-[#456466]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Payment modal */}
      {payBill && (
        <Modal>
          <div className="flex max-h-[92vh] flex-col">
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-5 py-4">
              <div>
                <h2 className="font-bold text-[#173F41]">Pay Bill</h2>
                <p className="text-xs text-[#8A9A9B]">
                  {payBill.patient} · {payBill.id}
                </p>
              </div>

              <IconButton
                title="Close"
                onClick={() => setPayBill(null)}
                className="text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </IconButton>
            </div>

            <div className="space-y-5 overflow-y-auto p-5">
              <div className="rounded-xl bg-[#E8F8F6] p-4">
                <p className="text-xs font-semibold text-[#078F8A]">
                  Amount Due
                </p>
                <p className="mt-1 text-3xl font-bold text-[#173F41]">
                  {money(payBill.amount - payBill.paid)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-[#173F41]">
                  Payment Method
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {["UPI", "Card", "Cash"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                        paymentMethod === method
                          ? "border-[#08A6A0] bg-[#E8F8F6] text-[#078F8A]"
                          : "border-[#DCEBE9] text-[#5F7375] hover:bg-[#F8FCFB]"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === "UPI" && (
                <div className="rounded-xl border border-[#E2EFED] bg-[#F8FCFB] p-4">
                  <p className="text-sm font-semibold text-[#173F41]">
                    UPI Payment
                  </p>
                  <p className="mt-1 text-xs text-[#789092]">
                    Select UPI as the payment method. A real UPI gateway can
                    be connected to this action later.
                  </p>
                </div>
              )}

              {paymentMethod === "Card" && (
                <div className="rounded-xl border border-[#E2EFED] bg-[#F8FCFB] p-4">
                  <p className="text-sm font-semibold text-[#173F41]">
                    Card Payment
                  </p>
                  <p className="mt-1 text-xs text-[#789092]">
                    Card gateway integration can be connected here when the
                    backend payment service is available.
                  </p>
                </div>
              )}

              {paymentMethod === "Cash" && (
                <div className="rounded-xl border border-[#E2EFED] bg-[#F8FCFB] p-4">
                  <p className="text-sm font-semibold text-[#173F41]">
                    Cash Payment
                  </p>
                  <p className="mt-1 text-xs text-[#789092]">
                    Confirm only after the cash amount has been received at the
                    hospital counter.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#E2EFED] bg-white px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPayBill(null)}
                className="rounded-lg border border-[#DCEBE9] px-4 py-2.5 text-sm font-semibold text-[#456466]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={completePayment}
                className="rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#078F8A]"
              >
                Confirm Payment · {money(payBill.amount - payBill.paid)}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Receipt modal */}
      {receiptBill && (
        <Modal wide>
          <div className="flex max-h-[92vh] flex-col">
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-5 py-4 print:hidden">
              <div>
                <h2 className="font-bold text-[#173F41]">Payment Receipt</h2>
                <p className="text-xs text-[#8A9A9B]">
                  Receipt for {receiptBill.id}
                </p>
              </div>

              <IconButton
                title="Close"
                onClick={() => setReceiptBill(null)}
                className="text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </IconButton>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <div
                id="billing-receipt"
                className="mx-auto max-w-2xl rounded-xl border border-[#DCEBE9] bg-white p-5 sm:p-7"
              >
                <div className="flex items-start justify-between border-b border-[#E2EFED] pb-5">
                  <div>
                    <p className="text-xl font-extrabold text-[#173F41]">
                      CITY CARE HOSPITAL
                    </p>
                    <p className="mt-1 text-xs text-[#789092]">
                      Official Payment Receipt
                    </p>
                  </div>
                  <Receipt className="text-[#08A6A0]" size={32} />
                </div>

                <div className="grid gap-4 py-5 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#9AA9AA]">Patient</p>
                    <p className="font-bold text-[#173F41]">
                      {receiptBill.patient}
                    </p>
                    <p className="text-xs text-[#789092]">
                      {receiptBill.patientId}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9AA9AA]">Bill / Receipt No.</p>
                    <p className="font-bold text-[#173F41]">
                      {receiptBill.id}
                    </p>
                    <p className="text-xs text-[#789092]">
                      {receiptBill.paidAt || formatDate(receiptBill.date)}
                    </p>
                  </div>
                </div>

                <div className="border-y border-[#E2EFED] py-3">
                  {receiptBill.items.map((item) => (
                    <div
                      key={`${receiptBill.id}-receipt-${item.name}`}
                      className="flex justify-between py-2 text-sm"
                    >
                      <span className="text-[#5F7375]">{item.name}</span>
                      <span className="font-medium text-[#173F41]">
                        {money(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between py-4 text-lg font-extrabold text-[#173F41]">
                  <span>Paid Amount</span>
                  <span>{money(receiptBill.paid)}</span>
                </div>

                <div className="grid gap-3 rounded-xl bg-[#F8FCFB] p-4 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-[#9AA9AA]">Status</span>
                    <p className="mt-1 font-bold text-[#078F8A]">PAID</p>
                  </div>
                  <div>
                    <span className="text-[#9AA9AA]">Payment Method</span>
                    <p className="mt-1 font-bold text-[#173F41]">
                      {receiptBill.paymentMethod || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9AA9AA]">Transaction ID</span>
                    <p className="mt-1 break-all font-bold text-[#173F41]">
                      {receiptBill.transactionId || "-"}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-center text-[11px] text-[#9AA9AA]">
                  This receipt is generated by the hospital billing system.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#E2EFED] bg-white px-5 py-4 sm:flex-row sm:justify-end print:hidden">
              <button
                type="button"
                onClick={printReceipt}
                className="rounded-lg border border-[#DCEBE9] px-4 py-2.5 text-sm font-semibold text-[#456466]"
              >
                <Printer size={16} className="mr-2 inline" />
                Print
              </button>

              <button
                type="button"
                onClick={printReceipt}
                className="rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#078F8A]"
              >
                <Download size={16} className="mr-2 inline" />
                Save as PDF
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(deleteBill)}
        title="Remove Bill?"
        message={
          deleteBill
            ? `Remove ${deleteBill.id} from the billing list? This demo action does not delete data from a backend.`
            : ""
        }
        onConfirm={removeBill}
        onCancel={() => setDeleteBill(null)}
      />

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #billing-receipt,
          #billing-receipt * {
            visibility: visible !important;
          }

          #billing-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            border: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
