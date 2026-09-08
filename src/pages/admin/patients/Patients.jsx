import { useMemo, useState } from "react";
import {
  Activity,
  Archive,
  BedDouble,
  CalendarDays,
  ChevronRight,
  Droplets,
  Edit3,
  Eye,
  HeartPulse,
  Phone,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import PatientForm from "../../../components/admin/PatientForm";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import { patientData } from "../../../data/patientData";

/* =========================================================
   STATUS STYLES

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] ||
        "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* =========================================================
   PATIENT AVATAR
========================================================= */

function PatientAvatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
      {getInitials(name)}
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  value,
  onChange,
  children,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
    >
      {children}
    </select>
  );
}

/* =========================================================
   PATIENT ROW
========================================================= */

function PatientRow({
  patient,
  onView,
  onArchive,
}) {
  const services = safeArray(patient.activeServices);

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50">
      {/* Patient */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <PatientAvatar patient={patient} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {patient.name || "Unnamed Patient"}
            </p>

            <p className="text-xs text-slate-500">
              {patient.id || "No ID"}
            </p>
          </div>
        </div>
      </td>

      {/* Age / Gender */}

      <td className="px-5 py-4">
        <div className="text-sm text-slate-700">
          {patient.age || "-"} years
        </div>

        <div className="text-xs text-slate-500">
          {patient.gender || "-"}
        </div>
      </td>

      {/* Blood */}

      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <Droplets
            size={15}
            className="text-red-500"
          />

          {patient.bloodGroup || "-"}
        </span>
      </td>

      {/* Contact */}

      <td className="px-5 py-4">
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {patient.phone || "No phone"}
          </span>

          <span className="flex items-center gap-1.5">
            <Mail size={13} />
            {patient.email || "No email"}
          </span>
        </div>
      </td>

      {/* Status */}

      <td className="px-5 py-4">
        <div className="flex flex-col items-start gap-2">
          <StatusBadge status={patient.status} />

          {services.length > 0 && (
            <span className="text-xs text-slate-500">
              {services.length} service
              {services.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(patient)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
            title="View patient"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() => onArchive(patient)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Archive patient"
          >
            <Archive size={16} />
          </button>

          <button
            type="button"
            onClick={() => onView(patient)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
            title="Open details"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE PATIENT CARD
            </div>

            <h1 className="text-xl font-bold text-[#073F42] sm:text-2xl">
              Patients
            </h1>
          </div>

          {/* Footer */}

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onEdit(patient)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Edit3 size={16} />
              Edit Patient
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddPatient}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#08A6A0]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#078F8A]
          "
        >
          <UserPlus size={17} />

          <span>Register Patient</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PATIENTS PAGE
            : ""
        }
        confirmText="Archive Patient"
        cancelText="Cancel"
        onCancel={cancelArchive}
        onConfirm={confirmArchive}
        variant="danger"
      />
    </div>
  );
}

export default Patients;
