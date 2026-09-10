import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  FileText,
  FlaskConical,
  IndianRupee,
  Pencil,
  Printer,
  Receipt,
  Search,
  Settings2,
  Stethoscope,
  Utensils,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

/* =========================================================
   HOSPITAL CONFIGURATION
========================================================= */

const HOSPITAL = {
  name: "ABC MULTISPECIALITY HOSPITAL",
  address:
    "123 Hospital Road, Kolkata, West Bengal - 700001",
  phone: "+91 98765 43210",
  email: "info@abchospital.com",
  website: "www.abchospital.com",
  gstin: "19ABCDE1234F1Z5",
};

const DEFAULT_BILLING_SETTINGS = {
  taxRate: 5,
};

/* =========================================================
   BILL TYPES
========================================================= */

const BILL_TYPES = [
  {
    key: "All",
    label: "All Bills",
    icon: Receipt,
  },
  {
    key: "Patient",
    label: "Patient",
    icon: Stethoscope,
  },
  {
    key: "Lab",
    label: "Laboratory",
    icon: FlaskConical,
  },
  {
    key: "Food",
    label: "Food",
    icon: Utensils,
  },
  {
    key: "Blood",
    label: "Blood",
    icon: Banknote,
  },
];

/* =========================================================
   INITIAL BILL DATA
========================================================= */

const INITIAL_BILLS = [
  {
    id: "INV-2026-001",
    patientId: "PAT-1001",
    patientName: "Rahul Sharma",
    patientAge: 42,
    patientGender: "Male",
    patientPhone: "+91 98765 12345",
    patientEmail: "rahul@example.com",
    address: "Kolkata, West Bengal",

    type: "Patient",
    description: "General Consultation",
    doctor: "Dr. Amit Sen",
    department: "General Medicine",

    visitDate: "2026-09-08",
    date: "2026-09-08",

    items: [
      {
        description: "Doctor Consultation",
        category: "Consultation",
        quantity: 1,
        rate: 700,
        discount: 0,
      },
      {
        description: "Registration Fee",
        category: "Hospital",
        quantity: 1,
        rate: 100,
        discount: 0,
      },
    ],

    discount: 0,
    taxRate: 5,
    amountPaid: 0,
    status: "Unpaid",
  },

  {
    id: "INV-2026-002",
    patientId: "PAT-1002",
    patientName: "Priya Das",
    patientAge: 31,
    patientGender: "Female",
    patientPhone: "+91 98765 22222",
    patientEmail: "priya@example.com",
    address: "Howrah, West Bengal",

    type: "Lab",
    description: "Complete Blood Count",
    doctor: "Dr. Neha Roy",
    department: "Pathology",

    visitDate: "2026-09-07",
    date: "2026-09-07",

    items: [
      {
        description: "Complete Blood Count",
        category: "Laboratory",
        quantity: 1,
        rate: 500,
        discount: 0,
      },
      {
        description: "Blood Group Test",
        category: "Laboratory",
        quantity: 1,
        rate: 250,
        discount: 0,
      },
    ],

    discount: 0,
    taxRate: 5,
    amountPaid: 0,
    status: "Pending",
  },

  {
    id: "INV-2026-003",
    patientId: "PAT-1003",
    patientName: "Arjun Gupta",
    patientAge: 56,
    patientGender: "Male",
    patientPhone: "+91 98765 33333",
    patientEmail: "arjun@example.com",
    address: "Salt Lake, Kolkata",

    type: "Patient",
    description: "Cardiology Consultation",
    doctor: "Dr. S. Mukherjee",
    department: "Cardiology",

    visitDate: "2026-09-06",
    date: "2026-09-06",

    items: [
      {
        description: "Cardiology Consultation",
        category: "Consultation",
        quantity: 1,
        rate: 1200,
        discount: 100,
      },
      {
        description: "ECG",
        category: "Diagnostic",
        quantity: 1,
        rate: 500,
        discount: 0,
      },
    ],

    discount: 0,
    taxRate: 5,
    amountPaid: 1680,
    status: "Paid",
    paymentMethod: "Card",
    paymentId: "PAY-847291",
    paidAt: "2026-09-06T15:32:00",
  },

  {
    id: "INV-2026-004",
    patientId: "PAT-1004",
    patientName: "Sneha Roy",
    patientAge: 28,
    patientGender: "Female",
    patientPhone: "+91 98765 44444",
    patientEmail: "sneha@example.com",
    address: "Dum Dum, Kolkata",

    type: "Lab",
    description: "Liver Function Test",
    doctor: "Dr. P. Ghosh",
    department: "Pathology",

    visitDate: "2026-09-05",
    date: "2026-09-05",

    items: [
      {
        description: "Liver Function Test",
        category: "Laboratory",
        quantity: 1,
        rate: 800,
        discount: 50,
      },
      {
        description: "Kidney Function Test",
        category: "Laboratory",
        quantity: 1,
        rate: 750,
        discount: 0,
      },
    ],

    discount: 0,
    taxRate: 5,
    amountPaid: 500,
    status: "Pending",
    paymentMethod: "Cash",
    paymentId: "PAY-381920",
  },

  {
    id: "INV-2026-005",
    patientId: "PAT-1005",
    patientName: "Ankit Das",
    patientAge: 39,
    patientGender: "Male",
    patientPhone: "+91 98765 55555",
    patientEmail: "ankit@example.com",
    address: "Ballygunge, Kolkata",

    type: "Patient",
    description: "Orthopedic Consultation",
    doctor: "Dr. R. Chatterjee",
    department: "Orthopedics",

    visitDate: "2026-09-04",
    date: "2026-09-04",

    items: [
      {
        description: "Orthopedic Consultation",
        category: "Consultation",
        quantity: 1,
        rate: 900,
        discount: 100,
      },
      {
        description: "X-Ray",
        category: "Radiology",
        quantity: 1,
        rate: 700,
        discount: 0,
      },
    ],

    discount: 0,
    taxRate: 5,
    amountPaid: 1575,
    status: "Paid",
    paymentMethod: "UPI",
    paymentId: "PAY-912736",
    paidAt: "2026-09-04T12:20:00",
  },

  {
    id: "INV-2026-006",
    patientId: "PAT-1006",
    patientName: "Riya Sen",
    patientAge: 35,
    patientGender: "Female",
    patientPhone: "+91 98765 66666",
    patientEmail: "riya@example.com",
    address: "New Town, Kolkata",

    type: "Food",
    description: "Patient Food Services",
    doctor: "Dr. A. Das",
    department: "Dietary Services",

    visitDate: "2026-09-08",
    date: "2026-09-08",

    items: [
      {
        description: "Breakfast",
        category: "Food",
        quantity: 1,
        rate: 120,
        discount: 0,
      },
      {
        description: "Lunch",
        category: "Food",
        quantity: 1,
        rate: 180,
        discount: 0,
      },
      {
        description: "Dinner",
        category: "Food",
        quantity: 1,
        rate: 180,
        discount: 0,
      },
    ],

    discount: 0,
    taxRate: 5,
    amountPaid: 0,
    status: "Unpaid",
  },

  {
    id: "INV-2026-007",
    patientId: "PAT-1007",
    patientName: "Sourav Ghosh",
    patientAge: 48,
    patientGender: "Male",
    patientPhone: "+91 98765 77777",
    patientEmail: "sourav@example.com",
    address: "Behala, Kolkata",

    type: "Blood",
    description: "Blood Bank Services",
    doctor: "Dr. R. Sen",
    department: "Blood Bank",

    visitDate: "2026-09-08",
    date: "2026-09-08",

    items: [
      {
        description: "Packed Red Blood Cells",
        category: "Blood Component",
        quantity: 1,
        rate: 1800,
        discount: 0,
      },
      {
        description: "Blood Processing Fee",
        category: "Blood Bank",
        quantity: 1,
        rate: 250,
        discount: 0,
      },
    ],

    discount: 0,
    taxRate: 5,
    amountPaid: 0,
    status: "Pending",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

const formatPdfCurrency = (value) => {
  return `INR ${Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const generatePaymentId = () => {
  return `PAY-${Math.floor(
    100000 + Math.random() * 900000
  )}`;
};

const calculateBill = (
  bill,
  defaultTaxRate = 0
) => {
  const items = Array.isArray(bill.items)
    ? bill.items
    : [];

  const subtotal = items.reduce(
    (sum, item) => {
      return (
        sum +
        Number(item.quantity || 0) *
          Number(item.rate || 0)
      );
    },
    0
  );

  const itemDiscount = items.reduce(
    (sum, item) =>
      sum + Number(item.discount || 0),
    0
  );

  const billDiscount = Number(
    bill.discount || 0
  );

  const totalDiscount =
    itemDiscount + billDiscount;

  const taxableAmount = Math.max(
    0,
    subtotal - totalDiscount
  );

  const taxRate =
    bill.taxRate === undefined ||
    bill.taxRate === null
      ? Number(defaultTaxRate || 0)
      : Number(bill.taxRate || 0);

  const tax =
    taxableAmount * (taxRate / 100);

  const total = taxableAmount + tax;

  const amountPaid = Math.min(
    Number(bill.amountPaid || 0),
    total
  );

  const balance = Math.max(
    0,
    total - amountPaid
  );

  return {
    subtotal,
    itemDiscount,
    billDiscount,
    totalDiscount,
    taxableAmount,
    taxRate,
    tax,
    total,
    amountPaid,
    balance,
  };
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const styles = {
    Paid:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Unpaid:
      "bg-red-50 text-red-700 border-red-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
  };

  const icons = {
    Paid: CheckCircle2,
    Unpaid: AlertCircle,
    Pending: AlertCircle,
  };

  const Icon =
    icons[status] || AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || "border-gray-200 bg-gray-50 text-gray-700"}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
};

/* =========================================================
   TYPE BADGE
========================================================= */

const TypeBadge = ({ type }) => {
  const config = {
    Patient: {
      icon: Stethoscope,
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },

    Lab: {
      icon: FlaskConical,
      className:
        "border-purple-200 bg-purple-50 text-purple-700",
    },

    Food: {
      icon: Utensils,
      className:
        "border-orange-200 bg-orange-50 text-orange-700",
    },

    Blood: {
      icon: Banknote,
      className:
        "border-red-200 bg-red-50 text-red-700",
    },
  };

  const item = config[type] || {
    icon: Receipt,
    className:
      "border-gray-200 bg-gray-50 text-gray-700",
  };

  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${item.className}`}
    >
      <Icon size={13} />
      {type === "Lab"
        ? "Laboratory"
        : type}
    </span>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
}) => {
  return (
    <div className="min-w-0 rounded-xl border border-[#E2EFED] bg-white px-4 py-4 shadow-sm sm:px-3 sm:py-3 lg:px-4 lg:py-4">
      <div className="flex items-start justify-between gap-2 sm:gap-2.5 lg:gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-gray-500 sm:text-xs">
            {label}
          </p>

          <p className="mt-0.5 truncate text-base font-bold text-gray-900 sm:mt-1 sm:text-lg lg:text-xl">
            {value}
          </p>

          {description && (
            <p className="mt-0.5 hidden truncate text-[10px] text-gray-400 sm:block lg:mt-1 lg:text-[11px]">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E9F6F3] text-[#178B7E] sm:h-8 sm:w-8 lg:h-9 lg:w-9">
          <Icon
            size={16}
            className="sm:size-[17px] lg:size-[18px]"
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MODAL
========================================================= */

const Modal = ({
  title,
  children,
  onClose,
  size = "max-w-xl",
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div
        className={`flex max-h-[94vh] w-full ${size} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="text-sm font-bold text-gray-900 sm:text-base">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INVOICE PREVIEW
========================================================= */

const InvoicePreview = ({
  bill,
  defaultTaxRate,
  isAdmin,
  onEditTax,
  printMode = false,
}) => {
  if (!bill) return null;

  const calculated = calculateBill(
    bill,
    defaultTaxRate
  );

  return (
    <div
      className={`invoice-paper mx-auto w-full bg-white text-gray-900 ${
        printMode
          ? "invoice-print-paper"
          : "rounded-xl p-3 shadow-xl sm:p-5 md:p-6"
      }`}
    >
      {/* HEADER */}

      <div className="border-b-2 border-gray-900 pb-4 sm:pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#178B7E] text-white sm:h-16 sm:w-16 sm:rounded-xl">
              <Receipt
                size={24}
                className="sm:size-8"
              />
            </div>

            <div className="min-w-0">
              <h1 className="break-words text-base font-bold tracking-wide text-gray-900 sm:text-xl">
                {HOSPITAL.name}
              </h1>

              <p className="mt-1 text-[10px] text-gray-600 sm:text-xs">
                {HOSPITAL.address}
              </p>

              <p className="mt-1 break-words text-[10px] text-gray-600 sm:text-xs">
                Phone: {HOSPITAL.phone} | Email:{" "}
                {HOSPITAL.email}
              </p>

              <p className="mt-1 text-[10px] text-gray-600 sm:text-xs">
                {HOSPITAL.website} | GSTIN:{" "}
                {HOSPITAL.gstin}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 sm:text-xs">
              Hospital Invoice
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#178B7E] sm:text-2xl">
              {bill.id}
            </h2>

            <p className="mt-1 text-[10px] text-gray-500 sm:mt-2 sm:text-xs">
              Invoice Date
            </p>

            <p className="text-xs font-semibold text-gray-800 sm:text-sm">
              {formatDate(bill.date)}
            </p>
          </div>
        </div>
      </div>

      {/* PATIENT INFORMATION */}

      <div className="mt-4 grid grid-cols-1 overflow-hidden rounded-lg border border-gray-200 sm:mt-5 sm:grid-cols-2">
        <div className="border-b border-gray-200 sm:border-b-0 sm:border-r">
          <div className="bg-gray-50 px-3 py-2 sm:px-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-700 sm:text-xs">
              Patient Information
            </p>
          </div>

          <div className="space-y-2 p-3 text-[10px] sm:p-4 sm:text-xs">
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Patient Name
              </span>

              <span className="text-right font-semibold">
                {bill.patientName}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Patient ID
              </span>

              <span className="text-right font-semibold">
                {bill.patientId}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Age / Gender
              </span>

              <span className="text-right font-semibold">
                {bill.patientAge} /{" "}
                {bill.patientGender}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Phone
              </span>

              <span className="break-all text-right font-semibold">
                {bill.patientPhone}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Email
              </span>

              <span className="break-all text-right font-semibold">
                {bill.patientEmail || "-"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Address
              </span>

              <span className="text-right font-semibold">
                {bill.address || "-"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 px-3 py-2 sm:px-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-700 sm:text-xs">
              Bill Information
            </p>
          </div>

          <div className="space-y-2 p-3 text-[10px] sm:p-4 sm:text-xs">
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Bill Type
              </span>

              <span className="text-right font-semibold">
                {bill.type === "Lab"
                  ? "Laboratory"
                  : bill.type}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Department
              </span>

              <span className="text-right font-semibold">
                {bill.department || "-"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Doctor
              </span>

              <span className="text-right font-semibold">
                {bill.doctor || "-"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Visit Date
              </span>

              <span className="text-right font-semibold">
                {formatDate(
                  bill.visitDate ||
                    bill.date
                )}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Description
              </span>

              <span className="text-right font-semibold">
                {bill.description}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="shrink-0 text-gray-500">
                Payment Status
              </span>

              <StatusBadge
                status={bill.status}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS */}

      <div className="mt-5 sm:mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 sm:text-sm">
            Services / Tests
          </h3>

          {isAdmin &&
            bill.status !== "Paid" && (
              <button
                type="button"
                onClick={onEditTax}
                className="no-print inline-flex items-center gap-1 rounded-lg border border-[#178B7E] px-2.5 py-1.5 text-[10px] font-semibold text-[#178B7E] transition hover:bg-[#E9F6F3] sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
              >
                <Pencil size={12} />
                Edit Tax
              </button>
            )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[650px] border-collapse text-[10px] sm:text-xs">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="px-2 py-2.5 text-left sm:px-3 sm:py-3">
                  #
                </th>

                <th className="px-2 py-2.5 text-left sm:px-3 sm:py-3">
                  Service / Test
                </th>

                <th className="px-2 py-2.5 text-left sm:px-3 sm:py-3">
                  Category
                </th>

                <th className="px-2 py-2.5 text-center sm:px-3 sm:py-3">
                  Qty
                </th>

                <th className="px-2 py-2.5 text-right sm:px-3 sm:py-3">
                  Rate
                </th>

                <th className="px-2 py-2.5 text-right sm:px-3 sm:py-3">
                  Discount
                </th>

                <th className="px-2 py-2.5 text-right sm:px-3 sm:py-3">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {bill.items.map(
                (item, index) => {
                  const amount =
                    Number(
                      item.quantity || 0
                    ) *
                    Number(item.rate || 0);

                  return (
                    <tr
                      key={`${bill.id}-${index}`}
                      className="border-t border-gray-200"
                    >
                      <td className="px-2 py-2.5 sm:px-3 sm:py-3">
                        {index + 1}
                      </td>

                      <td className="px-2 py-2.5 font-medium sm:px-3 sm:py-3">
                        {item.description}
                      </td>

                      <td className="px-2 py-2.5 text-gray-500 sm:px-3 sm:py-3">
                        {item.category ||
                          "-"}
                      </td>

                      <td className="px-2 py-2.5 text-center sm:px-3 sm:py-3">
                        {item.quantity}
                      </td>

                      <td className="px-2 py-2.5 text-right sm:px-3 sm:py-3">
                        {formatCurrency(
                          item.rate
                        )}
                      </td>

                      <td className="px-2 py-2.5 text-right sm:px-3 sm:py-3">
                        {formatCurrency(
                          item.discount
                        )}
                      </td>

                      <td className="px-2 py-2.5 text-right font-semibold sm:px-3 sm:py-3">
                        {formatCurrency(
                          amount
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOTALS */}

      <div className="mt-4 flex justify-end sm:mt-5">
        <div className="w-full max-w-[340px] overflow-hidden rounded-lg border border-gray-200">
          <div className="flex justify-between border-b border-gray-200 px-3 py-2 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-semibold">
              {formatCurrency(
                calculated.subtotal
              )}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 px-3 py-2 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs">
            <span className="text-gray-500">
              Discount
            </span>

            <span className="font-semibold text-red-600">
              -{" "}
              {formatCurrency(
                calculated.totalDiscount
              )}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 px-3 py-2 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs">
            <span className="text-gray-500">
              Taxable Amount
            </span>

            <span className="font-semibold">
              {formatCurrency(
                calculated.taxableAmount
              )}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 px-3 py-2 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs">
            <span className="text-gray-500">
              Tax ({calculated.taxRate}%)
            </span>

            <span className="font-semibold">
              {formatCurrency(
                calculated.tax
              )}
            </span>
          </div>

          <div className="flex justify-between bg-[#E9F6F3] px-3 py-2.5 sm:px-4 sm:py-3">
            <span className="text-xs font-bold sm:text-sm">
              Grand Total
            </span>

            <span className="text-sm font-bold text-[#178B7E] sm:text-base">
              {formatCurrency(
                calculated.total
              )}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-200 px-3 py-2 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs">
            <span className="text-gray-500">
              Amount Paid
            </span>

            <span className="font-semibold text-emerald-600">
              {formatCurrency(
                calculated.amountPaid
              )}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3">
            <span className="text-xs font-bold sm:text-sm">
              Balance Due
            </span>

            <span
              className={`text-sm font-bold sm:text-base ${
                calculated.balance > 0
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              {formatCurrency(
                calculated.balance
              )}
            </span>
          </div>
        </div>
      </div>

      {/* PAYMENT */}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-5">
        <div className="rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 sm:px-4">
            <p className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">
              Payment Information
            </p>
          </div>

          <div className="space-y-2 p-3 text-[10px] sm:p-4 sm:text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">
                Payment Method
              </span>

              <span className="text-right font-semibold">
                {bill.paymentMethod ||
                  "Not Paid"}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">
                Transaction ID
              </span>

              <span className="break-all text-right font-semibold">
                {bill.paymentId || "-"}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">
                Payment Date
              </span>

              <span className="text-right font-semibold">
                {bill.paidAt
                  ? formatDateTime(
                      bill.paidAt
                    )
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">
            Invoice Note
          </p>

          <p className="mt-2 text-[10px] leading-4 text-gray-600 sm:mt-3 sm:text-xs sm:leading-5">
            Total invoice value:
          </p>

          <p className="mt-1 text-xs font-semibold text-gray-900 sm:text-sm">
            {formatCurrency(
              calculated.total
            )}
          </p>

          <p className="mt-2 text-[9px] leading-4 text-gray-500 sm:mt-3 sm:text-[10px]">
            This is a computer-generated
            invoice and does not require a
            physical signature.
          </p>
        </div>
      </div>

      {/* SIGNATURES */}

      <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-10 sm:gap-10">
        <div className="border-t border-gray-400 pt-2 text-center">
          <p className="text-[10px] font-semibold sm:text-xs">
            Authorized Signature
          </p>
        </div>

        <div className="border-t border-gray-400 pt-2 text-center">
          <p className="text-[10px] font-semibold sm:text-xs">
            Patient / Customer Signature
          </p>
        </div>
      </div>

      {/* FOOTER */}

      <div className="mt-6 border-t border-gray-200 pt-3 text-center sm:mt-8 sm:pt-4">
        <p className="text-[9px] text-gray-500 sm:text-[10px]">
          Thank you for choosing{" "}
          {HOSPITAL.name}.
        </p>

        <p className="mt-1 text-[9px] text-gray-400 sm:text-[10px]">
          Please retain this invoice for your
          records.
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   PAYMENT MODAL
========================================================= */

const PaymentModal = ({
  bill,
  defaultTaxRate,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] =
    useState("");

  const [method, setMethod] =
    useState("UPI");

  const [processing, setProcessing] =
    useState(false);

  const calculated = useMemo(() => {
    if (!bill) return null;

    return calculateBill(
      bill,
      defaultTaxRate
    );
  }, [bill, defaultTaxRate]);

  useEffect(() => {
    if (calculated) {
      setAmount(
        calculated.balance > 0
          ? String(calculated.balance)
          : ""
      );
    }
  }, [calculated]);

  if (!bill || !calculated) {
    return null;
  }

  const paymentAmount = Number(
    amount || 0
  );

  const handlePayment = () => {
    if (
      !paymentAmount ||
      paymentAmount <= 0 ||
      paymentAmount >
        calculated.balance
    ) {
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const newPaidAmount =
        calculated.amountPaid +
        paymentAmount;

      const newBalance =
        calculated.total -
        newPaidAmount;

      const newStatus =
        newBalance <= 0
          ? "Paid"
          : "Pending";

      onSuccess({
        ...bill,
        amountPaid: newPaidAmount,
        status: newStatus,
        paymentMethod: method,
        paymentId: generatePaymentId(),
        paidAt: new Date().toISOString(),
      });

      setProcessing(false);
    }, 800);
  };

  return (
    <Modal
      title={`Make Payment • ${bill.id}`}
      onClose={onClose}
      size="max-w-lg"
    >
      <div className="space-y-5 p-5">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Patient
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {bill.patientName}
              </p>
            </div>

            <WalletCards
              className="text-[#178B7E]"
              size={22}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">
                Invoice Total
              </p>

              <p className="mt-1 font-bold">
                {formatCurrency(
                  calculated.total
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Balance Due
              </p>

              <p className="mt-1 font-bold text-red-600">
                {formatCurrency(
                  calculated.balance
                )}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
            Payment Amount
          </label>

          <div className="relative">
            <IndianRupee
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="number"
              min="1"
              max={calculated.balance}
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#178B7E] focus:ring-2 focus:ring-[#178B7E]/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
            Payment Method
          </label>

          <div className="grid grid-cols-3 gap-2">
            {["UPI", "Card", "Cash"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setMethod(item)
                  }
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                    method === item
                      ? "border-[#178B7E] bg-[#E9F6F3] text-[#178B7E]"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
          <CreditCard
            size={15}
            className="mt-0.5 shrink-0"
          />

          <p>
            After successful payment, a payment
            transaction ID will be generated
            automatically.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              processing ||
              !paymentAmount ||
              paymentAmount <= 0 ||
              paymentAmount >
                calculated.balance
            }
            onClick={handlePayment}
            className="inline-flex items-center gap-2 rounded-lg bg-[#178B7E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#11766B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Banknote size={16} />

            {processing
              ? "Processing..."
              : `Pay ${formatCurrency(
                  paymentAmount
                )}`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* =========================================================
   BILLING SETTINGS
========================================================= */

const BillingSettingsModal = ({
  settings,
  onClose,
  onSave,
}) => {
  const [taxRate, setTaxRate] =
    useState(String(settings.taxRate));

  const [
    applyToOpenBills,
    setApplyToOpenBills,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const handleSave = () => {
    const value = Number(taxRate);

    if (
      Number.isNaN(value) ||
      value < 0 ||
      value > 100
    ) {
      setError(
        "Tax rate must be between 0% and 100%."
      );
      return;
    }

    onSave(
      value,
      applyToOpenBills
    );
  };

  return (
    <Modal
      title="Billing Settings"
      onClose={onClose}
      size="max-w-md"
    >
      <div className="space-y-5 p-5">
        <div className="rounded-xl border border-[#CDE7E2] bg-[#F3FBF9] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DDF2EE] text-[#178B7E]">
              <Settings2 size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                Default Tax Rate
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                This rate will be used for bills
                that do not have an individual
                tax rate.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
            Tax Rate (%)
          </label>

          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate}
              onChange={(e) => {
                setTaxRate(
                  e.target.value
                );
                setError("");
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#178B7E] focus:ring-2 focus:ring-[#178B7E]/10"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
              %
            </span>
          </div>

          {error && (
            <p className="mt-1.5 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3">
          <input
            type="checkbox"
            checked={applyToOpenBills}
            onChange={(e) =>
              setApplyToOpenBills(
                e.target.checked
              )
            }
            className="mt-0.5 h-4 w-4 accent-[#178B7E]"
          />

          <span>
            <span className="block text-sm font-semibold text-gray-800">
              Apply to unpaid / pending bills
            </span>

            <span className="mt-1 block text-xs leading-5 text-gray-500">
              Paid invoices will remain unchanged.
            </span>
          </span>
        </label>

        <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-700">
          <strong>Admin rule:</strong> paid invoices
          are finalized and cannot be changed
          through the bulk tax setting.
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#178B7E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#11766B]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* =========================================================
   EDIT TAX MODAL
========================================================= */

const EditTaxModal = ({
  bill,
  defaultTaxRate,
  onClose,
  onSave,
}) => {
  const currentTax =
    calculateBill(
      bill,
      defaultTaxRate
    ).taxRate;

  const [taxRate, setTaxRate] =
    useState(String(currentTax));

  const [error, setError] =
    useState("");

  const preview = calculateBill(
    {
      ...bill,
      taxRate:
        taxRate === ""
          ? 0
          : Number(taxRate),
    },
    defaultTaxRate
  );

  const handleSave = () => {
    const value = Number(taxRate);

    if (
      Number.isNaN(value) ||
      value < 0 ||
      value > 100
    ) {
      setError(
        "Tax rate must be between 0% and 100%."
      );
      return;
    }

    onSave(bill.id, value);
  };

  return (
    <Modal
      title={`Edit Tax • ${bill.id}`}
      onClose={onClose}
      size="max-w-md"
    >
      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs text-gray-500">
            Patient
          </p>

          <p className="mt-1 text-sm font-bold text-gray-900">
            {bill.patientName}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
            Invoice Tax Rate
          </label>

          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate}
              onChange={(e) => {
                setTaxRate(
                  e.target.value
                );
                setError("");
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#178B7E] focus:ring-2 focus:ring-[#178B7E]/10"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
              %
            </span>
          </div>

          {error && (
            <p className="mt-1.5 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-600">
            Updated Calculation
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Taxable Amount
              </span>

              <span className="font-semibold">
                {formatCurrency(
                  preview.taxableAmount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Tax ({preview.taxRate}%)
              </span>

              <span className="font-semibold">
                {formatCurrency(
                  preview.tax
                )}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="font-bold">
                Grand Total
              </span>

              <span className="font-bold text-[#178B7E]">
                {formatCurrency(
                  preview.total
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#178B7E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#11766B]"
          >
            Update Tax
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* =========================================================
   PDF GENERATOR
========================================================= */

const generateInvoicePDF = (
  bill,
  defaultTaxRate
) => {
  const calculated = calculateBill(
    bill,
    defaultTaxRate
  );

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;

  const drawFooter = () => {
    const pageNumber =
      doc.getCurrentPageInfo()
        .pageNumber;

    const totalPages =
      doc.getNumberOfPages();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(130);

    doc.text(
      `${HOSPITAL.name} | ${HOSPITAL.phone}`,
      margin,
      pageHeight - 8
    );

    doc.text(
      `Page ${pageNumber} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 8,
      {
        align: "right",
      }
    );
  };

  doc.setFillColor(23, 139, 126);

  doc.roundedRect(
    margin,
    margin,
    18,
    18,
    3,
    3,
    "F"
  );

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);

  doc.text(
    "H",
    margin + 9,
    margin + 12,
    {
      align: "center",
    }
  );

  doc.setTextColor(25, 25, 25);
  doc.setFontSize(14);

  doc.text(
    HOSPITAL.name,
    margin + 23,
    margin + 7
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);

  doc.text(
    HOSPITAL.address,
    margin + 23,
    margin + 12
  );

  doc.text(
    `Phone: ${HOSPITAL.phone} | Email: ${HOSPITAL.email}`,
    margin + 23,
    margin + 16
  );

  doc.text(
    `GSTIN: ${HOSPITAL.gstin}`,
    margin + 23,
    margin + 20
  );

  doc.setTextColor(23, 139, 126);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text(
    "TAX INVOICE",
    pageWidth - margin,
    margin + 7,
    {
      align: "right",
    }
  );

  doc.setTextColor(50);
  doc.setFontSize(9);

  doc.text(
    bill.id,
    pageWidth - margin,
    margin + 13,
    {
      align: "right",
    }
  );

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);

  doc.text(
    `Invoice Date: ${formatDate(
      bill.date
    )}`,
    pageWidth - margin,
    margin + 18,
    {
      align: "right",
    }
  );

  let y = 42;

  autoTable(doc, {
    startY: y,
    margin: {
      left: margin,
      right: margin,
    },

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      textColor: [45, 45, 45],
    },

    columnStyles: {
      0: {
        cellWidth: 31,
        fontStyle: "bold",
      },

      1: {
        cellWidth: 63,
      },

      2: {
        cellWidth: 31,
        fontStyle: "bold",
      },

      3: {
        cellWidth: 57,
      },
    },

    body: [
      [
        {
          content:
            "PATIENT INFORMATION",
          colSpan: 2,
          styles: {
            fillColor: [
              247,
              250,
              250,
            ],
            fontStyle: "bold",
          },
        },

        {
          content: "BILL INFORMATION",
          colSpan: 2,
          styles: {
            fillColor: [
              247,
              250,
              250,
            ],
            fontStyle: "bold",
          },
        },
      ],

      [
        "Patient Name",
        bill.patientName,
        "Bill Type",
        bill.type === "Lab"
          ? "Laboratory"
          : bill.type,
      ],

      [
        "Patient ID",
        bill.patientId,
        "Department",
        bill.department || "-",
      ],

      [
        "Age / Gender",
        `${bill.patientAge} / ${bill.patientGender}`,
        "Doctor",
        bill.doctor || "-",
      ],

      [
        "Phone",
        bill.patientPhone || "-",
        "Visit Date",
        formatDate(
          bill.visitDate ||
            bill.date
        ),
      ],

      [
        "Email",
        bill.patientEmail || "-",
        "Description",
        bill.description || "-",
      ],
    ],
  });

  y = doc.lastAutoTable.finalY + 7;

  autoTable(doc, {
    startY: y,

    margin: {
      left: margin,
      right: margin,
      bottom: 18,
    },

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      textColor: [45, 45, 45],
      valign: "middle",
    },

    headStyles: {
      fillColor: [35, 40, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    columnStyles: {
      0: {
        cellWidth: 9,
        halign: "center",
      },

      1: {
        cellWidth: 60,
      },

      2: {
        cellWidth: 31,
      },

      3: {
        cellWidth: 14,
        halign: "center",
      },

      4: {
        cellWidth: 24,
        halign: "right",
      },

      5: {
        cellWidth: 25,
        halign: "right",
      },

      6: {
        cellWidth: 31,
        halign: "right",
      },
    },

    head: [
      [
        "#",
        "Service / Test",
        "Category",
        "Qty",
        "Rate",
        "Discount",
        "Amount",
      ],
    ],

    body: bill.items.map(
      (item, index) => {
        const amount =
          Number(
            item.quantity || 0
          ) *
          Number(item.rate || 0);

        return [
          index + 1,
          item.description,
          item.category || "-",
          item.quantity,
          formatPdfCurrency(
            item.rate
          ),
          formatPdfCurrency(
            item.discount
          ),
          formatPdfCurrency(amount),
        ];
      }
    ),
  });

  y = doc.lastAutoTable.finalY + 7;

  autoTable(doc, {
    startY: y,

    margin: {
      left: 115,
      right: margin,
    },

    theme: "plain",

    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: [50, 50, 50],
    },

    columnStyles: {
      0: {
        cellWidth: 40,
      },

      1: {
        cellWidth: 41,
        halign: "right",
      },
    },

    body: [
      [
        "Subtotal",
        formatPdfCurrency(
          calculated.subtotal
        ),
      ],

      [
        "Discount",
        `- ${formatPdfCurrency(
          calculated.totalDiscount
        )}`,
      ],

      [
        "Taxable Amount",
        formatPdfCurrency(
          calculated.taxableAmount
        ),
      ],

      [
        `Tax (${calculated.taxRate}%)`,
        formatPdfCurrency(
          calculated.tax
        ),
      ],

      [
        {
          content: "GRAND TOTAL",
          styles: {
            fontStyle: "bold",
            fillColor: [
              233,
              246,
              243,
            ],
          },
        },

        {
          content: formatPdfCurrency(
            calculated.total
          ),
          styles: {
            fontStyle: "bold",
            textColor: [
              23,
              139,
              126,
            ],
            fillColor: [
              233,
              246,
              243,
            ],
          },
        },
      ],

      [
        "Amount Paid",
        formatPdfCurrency(
          calculated.amountPaid
        ),
      ],

      [
        {
          content: "BALANCE DUE",
          styles: {
            fontStyle: "bold",
          },
        },

        {
          content: formatPdfCurrency(
            calculated.balance
          ),
          styles: {
            fontStyle: "bold",
            textColor:
              calculated.balance >
              0
                ? [190, 40, 40]
                : [20, 130, 80],
          },
        },
      ],
    ],
  });

  y = doc.lastAutoTable.finalY + 7;

  autoTable(doc, {
    startY: y,

    margin: {
      left: margin,
      right: margin,
    },

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      textColor: [50, 50, 50],
    },

    body: [
      [
        {
          content:
            "PAYMENT INFORMATION",
          colSpan: 4,
          styles: {
            fillColor: [
              247,
              250,
              250,
            ],
            fontStyle: "bold",
          },
        },
      ],

      [
        "Payment Method",
        bill.paymentMethod ||
          "Not Paid",
        "Payment Status",
        bill.status,
      ],

      [
        "Transaction ID",
        bill.paymentId || "-",
        "Payment Date",
        bill.paidAt
          ? formatDateTime(
              bill.paidAt
            )
          : "-",
      ],
    ],

    columnStyles: {
      0: {
        cellWidth: 35,
        fontStyle: "bold",
      },

      1: {
        cellWidth: 58,
      },

      2: {
        cellWidth: 35,
        fontStyle: "bold",
      },

      3: {
        cellWidth: 58,
      },
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  if (y > pageHeight - 45) {
    doc.addPage();
    y = 25;
  }

  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);

  doc.line(
    margin,
    y + 10,
    margin + 65,
    y + 10
  );

  doc.line(
    pageWidth - margin - 65,
    y + 10,
    pageWidth - margin,
    y + 10
  );

  doc.setFontSize(8);
  doc.setTextColor(60);

  doc.text(
    "Authorized Signature",
    margin + 32.5,
    y + 15,
    {
      align: "center",
    }
  );

  doc.text(
    "Patient / Customer Signature",
    pageWidth -
      margin -
      32.5,
    y + 15,
    {
      align: "center",
    }
  );

  doc.setFontSize(7);
  doc.setTextColor(120);

  doc.text(
    "This is a computer-generated invoice.",
    pageWidth / 2,
    y + 25,
    {
      align: "center",
    }
  );

  for (
    let page = 1;
    page <= doc.getNumberOfPages();
    page++
  ) {
    doc.setPage(page);
    drawFooter();
  }

  doc.setProperties({
    title: `Hospital Invoice ${bill.id}`,
    subject:
      "Hospital Billing Invoice",
    author: HOSPITAL.name,
    creator:
      "Hospital Management System",
  });

  const safePatientName =
    bill.patientName
      .replace(/\s+/g, "-")
      .toLowerCase();

  doc.save(
    `${bill.id}-${safePatientName}.pdf`
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Billings = () => {
  const [bills, setBills] =
    useState(INITIAL_BILLS);

  const [
    billingSettings,
    setBillingSettings,
  ] = useState(
    DEFAULT_BILLING_SETTINGS
  );

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [paymentBill, setPaymentBill] =
    useState(null);

  const [invoiceBill, setInvoiceBill] =
    useState(null);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [editTaxBill, setEditTaxBill] =
    useState(null);

  /* =======================================================
     LOAD LOCAL DATA
  ======================================================= */

  useEffect(() => {
    try {
      const savedBills =
        localStorage.getItem(
          "hospital-bills"
        );

      const savedSettings =
        localStorage.getItem(
          "hospital-billing-settings"
        );

      if (savedBills) {
        setBills(
          JSON.parse(savedBills)
        );
      }

      if (savedSettings) {
        setBillingSettings(
          JSON.parse(savedSettings)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load billing data:",
        error
      );
    }
  }, []);

  /* =======================================================
     SAVE BILLS
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "hospital-bills",
        JSON.stringify(bills)
      );
    } catch (error) {
      console.error(
        "Failed to save bills:",
        error
      );
    }
  }, [bills]);

  /* =======================================================
     SAVE SETTINGS
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "hospital-billing-settings",
        JSON.stringify(
          billingSettings
        )
      );
    } catch (error) {
      console.error(
        "Failed to save billing settings:",
        error
      );
    }
  }, [billingSettings]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredBills = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return bills.filter((bill) => {
      const matchesSearch =
        !query ||
        bill.id
          .toLowerCase()
          .includes(query) ||
        bill.patientName
          .toLowerCase()
          .includes(query) ||
        bill.patientId
          .toLowerCase()
          .includes(query) ||
        bill.description
          .toLowerCase()
          .includes(query);

      const matchesType =
        typeFilter === "All" ||
        bill.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        bill.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    bills,
    search,
    typeFilter,
    statusFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    let totalOutstanding = 0;
    let paidThisMonth = 0;
    let pendingBills = 0;

    bills.forEach((bill) => {
      const calculated =
        calculateBill(
          bill,
          billingSettings.taxRate
        );

      totalOutstanding +=
        calculated.balance;

      if (bill.status === "Pending") {
        pendingBills += 1;
      }

      if (bill.status === "Paid") {
        paidThisMonth +=
          calculated.amountPaid;
      }
    });

    return {
      totalOutstanding,
      paidThisMonth,
      pendingBills,
      totalBills: bills.length,
    };
  }, [
    bills,
    billingSettings.taxRate,
  ]);

  /* =======================================================
     PAYMENT SUCCESS
  ======================================================= */

  const handlePaymentSuccess = (
    updatedBill
  ) => {
    setBills((previousBills) =>
      previousBills.map((bill) =>
        bill.id === updatedBill.id
          ? updatedBill
          : bill
      )
    );

    setPaymentBill(null);
    setInvoiceBill(updatedBill);
  };

  /* =======================================================
     SAVE SETTINGS
  ======================================================= */

  const handleSaveBillingSettings = (
    newTaxRate,
    applyToOpenBills
  ) => {
    setBillingSettings({
      taxRate: newTaxRate,
    });

    if (applyToOpenBills) {
      setBills((previousBills) =>
        previousBills.map((bill) => {
          if (bill.status === "Paid") {
            return bill;
          }

          return {
            ...bill,
            taxRate: newTaxRate,
          };
        })
      );
    }

    setSettingsOpen(false);
  };

  /* =======================================================
     UPDATE TAX
  ======================================================= */

  const handleUpdateBillTax = (
    billId,
    newTaxRate
  ) => {
    setBills((previousBills) =>
      previousBills.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              taxRate: newTaxRate,
            }
          : bill
      )
    );

    if (
      invoiceBill &&
      invoiceBill.id === billId
    ) {
      setInvoiceBill({
        ...invoiceBill,
        taxRate: newTaxRate,
      });
    }

    setEditTaxBill(null);
  };

  /* =======================================================
     PRINT
     
     IMPORTANT:
     We no longer hide body > *.
     The React root remains visible to the
     browser, but only invoice-print-root
     is made visible during printing.
  ======================================================= */

  const handlePrintInvoice = () => {
    if (!invoiceBill) return;

    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <>
      {/* ===================================================
          PRINT STYLES
      =================================================== */}

      <style>
        {`
          /* Screen-only print container */
          #invoice-print-root {
            display: none;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }

          @media print {

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              min-width: 210mm !important;
              background: #ffffff !important;
            }

            /*
              Hide the complete application.
              Do NOT use body > * { display:none }
              because invoice-print-root lives inside
              the React application root.
            */

            body * {
              visibility: hidden !important;
            }

            #invoice-print-root,
            #invoice-print-root * {
              visibility: visible !important;
            }

            #invoice-print-root {
              display: block !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 210mm !important;
              min-width: 210mm !important;
              max-width: 210mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }

            #invoice-print-root .invoice-print-paper {
              display: block !important;
              width: 210mm !important;
              min-width: 210mm !important;
              max-width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 14mm !important;
              box-sizing: border-box !important;
              background: #ffffff !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              overflow: visible !important;
            }

            #invoice-print-root .no-print {
              display: none !important;
            }

            #invoice-print-root table {
              width: 100% !important;
            }

            #invoice-print-root tr {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            #invoice-print-root,
            #invoice-print-root * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>

      {/* ===================================================
          MAIN PAGE
      =================================================== */}

      <div className="min-h-screen bg-[#F5F8F8] p-3 sm:p-4 md:p-6">
        <div className="mx-auto max-w-[1500px]">
          {/* HEADER */}

          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Receipt
                  size={21}
                  className="text-[#178B7E]"
                />

                <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Billing Management
                </h1>
              </div>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Manage patient, laboratory,
                food and blood bills, payments
                and invoices.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden rounded-lg border border-[#D8EBE7] bg-white px-3 py-2 text-xs text-gray-600 sm:block">
                Default Tax:{" "}
                <span className="font-bold text-[#178B7E]">
                  {billingSettings.taxRate}%
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(true)
                }
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 sm:px-3 sm:py-2.5 sm:text-sm"
              >
                <Settings2 size={15} />
                Billing Settings
              </button>
            </div>
          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="mb-4 grid grid-cols-2 gap-2.5 text-xs sm:text-sm lg:text-xl sm:gap-3 xl:grid-cols-4">
            <StatCard
              icon={WalletCards}
              label="Total Outstanding"
              value={formatCurrency(
                stats.totalOutstanding
              )}
              description="Amount still to be collected"
            />

            <StatCard
              icon={CheckCircle2}
              label="Paid This Month"
              value={formatCurrency(
                stats.paidThisMonth
              )}
              description="Successfully collected"
            />

            <StatCard
              icon={AlertCircle}
              label="Pending Bills"
              value={stats.pendingBills}
              description="Bills awaiting completion"
            />

            <StatCard
              icon={FileText}
              label="Total Bills"
              value={stats.totalBills}
              description="All billing categories"
            />
          </div>

          {/* =================================================
              BILL TYPE NAVIGATION
          ================================================= */}

          <div className="mb-3 overflow-x-auto sm:mb-4">
            <div className="flex min-w-max gap-1.5 rounded-xl border border-[#E2EFED] bg-white p-1.5 shadow-sm sm:gap-2 sm:p-2">
              {BILL_TYPES.map(
                (item) => {
                  const Icon = item.icon;

                  const isActive =
                    typeFilter === item.key;

                  const count =
                    item.key === "All"
                      ? bills.length
                      : bills.filter(
                          (bill) =>
                            bill.type ===
                            item.key
                        ).length;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setTypeFilter(
                          item.key
                        )
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold transition sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                        isActive
                          ? "bg-[#178B7E] text-white shadow-sm"
                          : "text-gray-600 hover:bg-[#E9F6F3] hover:text-[#178B7E]"
                      }`}
                    >
                      <Icon
                        size={14}
                        className="sm:size-4"
                      />

                      <span>
                        {item.label}
                      </span>

                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] sm:px-2 sm:text-[10px] ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* =================================================
              SEARCH + STATUS
          ================================================= */}

          <div className="mb-4 rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm sm:mb-5 sm:p-4">
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search invoice, patient or patient ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#178B7E] focus:ring-2 focus:ring-[#178B7E]/10 sm:text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  "All",
                  "Paid",
                  "Pending",
                  "Unpaid",
                ].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        status
                      )
                    }
                    className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition sm:px-3 sm:py-2 sm:text-xs ${
                      statusFilter ===
                      status
                        ? "border-[#178B7E] bg-[#E9F6F3] text-[#178B7E]"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Bill ID
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Patient
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Type
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Description
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBills.map(
                    (bill) => {
                      const calculated =
                        calculateBill(
                          bill,
                          billingSettings.taxRate
                        );

                      return (
                        <tr
                          key={bill.id}
                          className="border-b border-gray-100 transition hover:bg-gray-50"
                        >
                          <td className="px-4 py-4">
                            <p className="text-sm font-bold text-[#178B7E]">
                              {bill.id}
                            </p>

                            <p className="mt-0.5 text-[11px] text-gray-400">
                              {bill.patientId}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-sm font-semibold text-gray-900">
                              {bill.patientName}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {bill.patientAge}{" "}
                              yrs •{" "}
                              {bill.patientGender}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <TypeBadge
                              type={
                                bill.type
                              }
                            />
                          </td>

                          <td className="max-w-[230px] px-4 py-4">
                            <p className="truncate text-sm font-medium text-gray-800">
                              {
                                bill.description
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {
                                bill.department
                              }
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <CalendarDays
                                size={14}
                              />

                              {formatDate(
                                bill.date
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {formatCurrency(
                                calculated.total
                              )}
                            </p>

                            {calculated.balance >
                              0 && (
                              <p className="mt-0.5 text-[11px] text-red-500">
                                Due{" "}
                                {formatCurrency(
                                  calculated.balance
                                )}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge
                              status={
                                bill.status
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setInvoiceBill(
                                    bill
                                  )
                                }
                                title="View Invoice"
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#178B7E] hover:bg-[#E9F6F3] hover:text-[#178B7E]"
                              >
                                <Eye
                                  size={16}
                                />
                              </button>

                              {bill.status !==
                                "Paid" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPaymentBill(
                                      bill
                                    )
                                  }
                                  className="rounded-lg bg-[#178B7E] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#11766B]"
                                >
                                  Pay
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {filteredBills.length ===
              0 && (
              <div className="px-6 py-12 text-center">
                <FileText
                  size={34}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm font-semibold text-gray-600">
                  No bills found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Try another bill type,
                  search or status.
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              MOBILE BILL CARDS
          ================================================= */}

          <div className="space-y-3 lg:hidden">
            {filteredBills.map(
              (bill) => {
                const calculated =
                  calculateBill(
                    bill,
                    billingSettings.taxRate
                  );

                return (
                  <div
                    key={bill.id}
                    className="rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm sm:p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#178B7E] sm:text-sm">
                          {bill.id}
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                          {
                            bill.patientName
                          }
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {bill.patientId}
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          bill.status
                        }
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 border-y border-gray-100 py-3">
                      <div>
                        <p className="text-[10px] text-gray-400">
                          Bill Type
                        </p>

                        <div className="mt-1">
                          <TypeBadge
                            type={
                              bill.type
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-400">
                          Date
                        </p>

                        <p className="mt-1 text-xs font-semibold text-gray-700">
                          {formatDate(
                            bill.date
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          {formatCurrency(
                            calculated.total
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-400">
                          Balance
                        </p>

                        <p
                          className={`mt-1 text-sm font-bold ${
                            calculated.balance >
                            0
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {formatCurrency(
                            calculated.balance
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setInvoiceBill(
                            bill
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <Eye
                          size={15}
                        />
                        Invoice
                      </button>

                      {bill.status !==
                        "Paid" && (
                        <button
                          type="button"
                          onClick={() =>
                            setPaymentBill(
                              bill
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#178B7E] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#11766B]"
                        >
                          <Banknote
                            size={15}
                          />
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
            )}

            {filteredBills.length ===
              0 && (
              <div className="rounded-xl border border-[#E2EFED] bg-white px-6 py-12 text-center">
                <FileText
                  size={34}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm font-semibold text-gray-600">
                  No bills found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          PAYMENT MODAL
      =================================================== */}

      {paymentBill && (
        <PaymentModal
          bill={paymentBill}
          defaultTaxRate={
            billingSettings.taxRate
          }
          onClose={() =>
            setPaymentBill(null)
          }
          onSuccess={
            handlePaymentSuccess
          }
        />
      )}

      {/* ===================================================
          SETTINGS
      =================================================== */}

      {settingsOpen && (
        <BillingSettingsModal
          settings={billingSettings}
          onClose={() =>
            setSettingsOpen(false)
          }
          onSave={
            handleSaveBillingSettings
          }
        />
      )}

      {/* ===================================================
          EDIT TAX
      =================================================== */}

      {editTaxBill && (
        <EditTaxModal
          bill={editTaxBill}
          defaultTaxRate={
            billingSettings.taxRate
          }
          onClose={() =>
            setEditTaxBill(null)
          }
          onSave={
            handleUpdateBillTax
          }
        />
      )}

      {/* ===================================================
          SCREEN INVOICE MODAL
      =================================================== */}

      {invoiceBill && (
        <div className="no-print fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-2 sm:p-3 md:p-6">
          <div className="flex h-full w-full max-w-[1100px] flex-col overflow-hidden rounded-xl bg-[#EEF2F2] sm:rounded-2xl">
            {/* ACTION BAR */}

            <div className="no-print flex shrink-0 flex-col gap-2 border-b border-gray-200 bg-white px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 sm:text-sm">
                  Invoice Preview
                </p>

                <p className="truncate text-[10px] text-gray-500 sm:text-xs">
                  {invoiceBill.id} •{" "}
                  {
                    invoiceBill.patientName
                  }
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {invoiceBill.status !==
                  "Paid" && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditTaxBill(
                        invoiceBill
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#178B7E] px-2.5 py-1.5 text-[10px] font-semibold text-[#178B7E] hover:bg-[#E9F6F3] sm:px-3 sm:py-2 sm:text-xs"
                  >
                    <Pencil
                      size={13}
                    />
                    Edit Tax
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    generateInvoicePDF(
                      invoiceBill,
                      billingSettings.taxRate
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-2.5 py-1.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 sm:gap-2 sm:px-3 sm:py-2 sm:text-xs"
                >
                  <Download
                    size={13}
                  />
                  PDF
                </button>

                <button
                  type="button"
                  onClick={
                    handlePrintInvoice
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-2.5 py-1.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 sm:gap-2 sm:px-3 sm:py-2 sm:text-xs"
                >
                  <Printer
                    size={13}
                  />
                  Print
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInvoiceBill(null)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-gray-800 sm:gap-2 sm:px-3 sm:py-2 sm:text-xs"
                >
                  <X size={13} />
                  Close
                </button>
              </div>
            </div>

            {/* RESPONSIVE SCREEN INVOICE */}

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-8">
              <InvoicePreview
                bill={invoiceBill}
                defaultTaxRate={
                  billingSettings.taxRate
                }
                isAdmin
                onEditTax={() =>
                  setEditTaxBill(
                    invoiceBill
                  )
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          DEDICATED PRINT-ONLY INVOICE
      =================================================== */}

      {invoiceBill && (
        <div id="invoice-print-root">
          <InvoicePreview
            bill={invoiceBill}
            defaultTaxRate={
              billingSettings.taxRate
            }
            isAdmin={false}
            printMode
          />
        </div>
      )}
    </>
  );
};

export default Billings;