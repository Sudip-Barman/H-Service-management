import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Plus,
  Trash2,
  UserRound,
  Stethoscope,
  Pill,
  Bed,
  CalendarDays,
  Receipt,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { apiRequest } from "../../api/api";

const formatCurrency = (amount) => {
  const value = Number(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

export default function ManualBillModal({
  open,
  onClose,
  onSuccess,
  defaultTaxRate = 5,
}) {
  // Master options fetched from backend
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [medicinesList, setMedicinesList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [duration, setDuration] = useState("1 Day");

  // Optional charge blocks
  const [medicines, setMedicines] = useState([]);
  const [includeRoom, setIncludeRoom] = useState(false);
  const [roomData, setRoomData] = useState({
    roomId: "",
    roomNumber: "",
    ward: "",
    roomType: "",
    days: 1,
    pricePerDay: 500,
  });

  const [includeAppointment, setIncludeAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: "",
    doctorName: "",
    date: new Date().toISOString().split("T")[0],
    charge: 500,
  });

  const [includeOther, setIncludeOther] = useState(false);
  const [otherData, setOtherData] = useState({
    description: "",
    amount: "",
  });

  const [discount, setDiscount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Load master records
  useEffect(() => {
    if (!open) return;
    let isMounted = true;

    const fetchAllData = async () => {
      setLoadingOptions(true);
      setErrorMsg("");
      try {
        const [pRes, sRes, mRes, rRes, dRes] = await Promise.allSettled([
          apiRequest("/api/patients"),
          apiRequest("/api/services"),
          apiRequest("/api/medicines"),
          apiRequest("/api/rooms-beds"),
          apiRequest("/api/doctors"),
        ]);

        if (isMounted) {
          if (pRes.status === "fulfilled" && Array.isArray(pRes.value)) {
            setPatients(pRes.value);
            if (pRes.value.length > 0 && !selectedPatientId) {
              setSelectedPatientId(pRes.value[0].registration_number || pRes.value[0].id);
            }
          }

          if (sRes.status === "fulfilled" && Array.isArray(sRes.value)) {
            const activeServices = sRes.value.filter((s) => s.is_active !== false);
            setServices(activeServices);
            if (activeServices.length > 0 && !selectedServiceId) {
              setSelectedServiceId(activeServices[0].id);
            }
          }

          if (mRes.status === "fulfilled" && Array.isArray(mRes.value)) {
            setMedicinesList(mRes.value);
          }

          if (rRes.status === "fulfilled") {
            const rooms = rRes.value?.rooms || (Array.isArray(rRes.value) ? rRes.value : []);
            setRoomsList(rooms);
          }

          if (dRes.status === "fulfilled" && Array.isArray(dRes.value)) {
            setDoctorsList(dRes.value);
          }
        }
      } catch (err) {
        console.error("Failed to load options for manual bill:", err);
      } finally {
        if (isMounted) setLoadingOptions(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [open]);

  // Selected Patient Details
  const selectedPatient = useMemo(() => {
    return patients.find(
      (p) =>
        String(p.registration_number) === String(selectedPatientId) ||
        String(p.id) === String(selectedPatientId)
    );
  }, [patients, selectedPatientId]);

  // Selected Service Details
  const selectedService = useMemo(() => {
    return services.find((s) => String(s.id) === String(selectedServiceId));
  }, [services, selectedServiceId]);

  // Medicine helper actions
  const addMedicineRow = () => {
    const defaultMed = medicinesList[0];
    setMedicines((prev) => [
      ...prev,
      {
        medicineId: defaultMed ? defaultMed.id : "",
        medicineName: defaultMed ? defaultMed.medicine_name : "",
        quantity: 1,
        price: defaultMed ? Number(defaultMed.selling_price || 0) : 0,
      },
    ]);
  };

  const updateMedicineRow = (index, field, value) => {
    setMedicines((prev) => {
      const copy = [...prev];
      const item = { ...copy[index] };

      if (field === "medicineId") {
        const found = medicinesList.find((m) => String(m.id) === String(value));
        if (found) {
          item.medicineId = found.id;
          item.medicineName = found.medicine_name;
          item.price = Number(found.selling_price || 0);
        }
      } else if (field === "quantity") {
        item.quantity = Math.max(1, Number(value) || 1);
      } else if (field === "price") {
        item.price = Math.max(0, Number(value) || 0);
      }
      copy[index] = item;
      return copy;
    });
  };

  const removeMedicineRow = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  // Room helper action
  const handleRoomChange = (roomId) => {
    const found = roomsList.find((r) => String(r.id) === String(roomId));
    if (found) {
      setRoomData((prev) => ({
        ...prev,
        roomId: found.id,
        roomNumber: found.room_number,
        ward: found.ward,
        roomType: found.room_type,
        pricePerDay: Number(found.daily_charge || 500),
      }));
    }
  };

  // Doctor helper action
  const handleDoctorChange = (doctorId) => {
    const found = doctorsList.find((d) => String(d.id) === String(doctorId));
    if (found) {
      const docName = `Dr. ${found.first_name} ${found.last_name || ""}`.trim();
      setAppointmentData((prev) => ({
        ...prev,
        doctorId: found.id,
        doctorName: docName,
        charge: Number(found.consultation_fee || 500),
      }));
    }
  };

  // Calculations
  const serviceCharge = Number(selectedService?.price || 0);

  const medicinesTotal = useMemo(() => {
    return medicines.reduce((sum, m) => sum + Number(m.quantity || 1) * Number(m.price || 0), 0);
  }, [medicines]);

  const roomTotal = useMemo(() => {
    if (!includeRoom) return 0;
    return Number(roomData.days || 1) * Number(roomData.pricePerDay || 0);
  }, [includeRoom, roomData]);

  const appointmentTotal = useMemo(() => {
    if (!includeAppointment) return 0;
    return Number(appointmentData.charge || 0);
  }, [includeAppointment, appointmentData]);

  const otherTotal = useMemo(() => {
    if (!includeOther) return 0;
    return Number(otherData.amount || 0);
  }, [includeOther, otherData]);

  const subtotal = useMemo(() => {
    return round2(serviceCharge + medicinesTotal + roomTotal + appointmentTotal + otherTotal);
  }, [serviceCharge, medicinesTotal, roomTotal, appointmentTotal, otherTotal]);

  const numDiscount = Number(discount || 0);
  const taxableAmount = Math.max(0, subtotal - numDiscount);
  const taxAmount = round2(taxableAmount * (defaultTaxRate / 100));
  const finalTotal = round2(taxableAmount + taxAmount);

  // Sync paidAmount when status is changed to Paid
  useEffect(() => {
    if (paymentStatus === "Paid") {
      setPaidAmount(finalTotal);
    } else if (paymentStatus === "Unpaid") {
      setPaidAmount(0);
    }
  }, [paymentStatus, finalTotal]);

  function round2(val) {
    return Math.round((Number(val) + Number.EPSILON) * 100) / 100;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setErrorMsg("Please select a registered patient.");
      return;
    }
    if (!selectedServiceId) {
      setErrorMsg("Please select a primary service.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        patient_id: selectedPatientId,
        service_id: Number(selectedServiceId),
        duration: duration || "1 Day",
        medicines: medicines.map((m) => ({
          medicine_id: m.medicineId ? Number(m.medicineId) : null,
          medicine_name: m.medicineName,
          quantity: Number(m.quantity || 1),
          price: Number(m.price || 0),
        })),
        room_charge: includeRoom
          ? {
              room_id: roomData.roomId ? Number(roomData.roomId) : null,
              room_number: roomData.roomNumber,
              ward: roomData.ward,
              room_type: roomData.roomType,
              days: Number(roomData.days || 1),
              price_per_day: Number(roomData.pricePerDay || 0),
              total: roomTotal,
            }
          : null,
        appointment: includeAppointment
          ? {
              doctor_id: appointmentData.doctorId ? Number(appointmentData.doctorId) : null,
              doctor_name: appointmentData.doctorName,
              date: appointmentData.date,
              charge: Number(appointmentData.charge || 0),
            }
          : null,
        other_charges: includeOther && otherData.amount
          ? {
              description: otherData.description || "Other hospital charges",
              amount: Number(otherData.amount || 0),
            }
          : null,
        discount: numDiscount,
        payment_status: paymentStatus,
        paid_amount: Number(paidAmount || 0),
        payment_method: paymentMethod,
        tax_rate: defaultTaxRate,
      };

      const res = await apiRequest("/api/billing/manual", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (onSuccess) {
        onSuccess(res);
      }
      onClose();
    } catch (err) {
      console.error("Manual bill creation failed:", err);
      setErrorMsg(err.message || "Failed to create manual bill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#F4FAF9] via-white to-[#F4FAF9] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#178B7E] text-white shadow-sm">
              <Receipt size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Create Manual Bill
              </h2>
              <p className="text-[11px] text-gray-500 sm:text-xs">
                Generate an itemized manual hospital invoice for registered patients.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SECTION 1: PATIENT SELECTION */}
          <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3.5 sm:p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <UserRound size={16} className="text-[#178B7E]" />
              <label className="text-xs font-bold uppercase tracking-wider text-gray-800">
                1. Select Registered Patient <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:ring-1 focus:ring-[#178B7E] focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    -- Select Patient --
                  </option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.registration_number || p.id}>
                      {p.registration_number} - {p.first_name} {p.last_name || ""} ({p.phone || "No phone"})
                    </option>
                  ))}
                </select>
              </div>

              {selectedPatient && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-1.5 text-[11px] text-gray-700">
                  <p className="font-semibold text-emerald-900">
                    {selectedPatient.first_name} {selectedPatient.last_name || ""}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Age: {selectedPatient.age || "-"} | {selectedPatient.gender || "-"} | Ph: {selectedPatient.phone || "-"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: PRIMARY SERVICE & DURATION */}
          <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3.5 sm:p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <Stethoscope size={16} className="text-[#178B7E]" />
              <label className="text-xs font-bold uppercase tracking-wider text-gray-800">
                2. Hospital Service & Duration <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-medium text-gray-600">
                  Primary Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:ring-1 focus:ring-[#178B7E] focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    -- Select Service --
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {formatCurrency(s.price || 0)} ({s.category || "General"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-600">
                  Service Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 1 Day, 2 Hours, 3 Days"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:ring-1 focus:ring-[#178B7E] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: MEDICINES (OPTIONAL & MULTIPLE) */}
          <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill size={16} className="text-[#178B7E]" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  3. Pharmacy / Medicines (Optional)
                </span>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
                  {medicines.length} added
                </span>
              </div>

              <button
                type="button"
                onClick={addMedicineRow}
                className="inline-flex items-center gap-1 rounded-lg border border-[#178B7E] bg-white px-2.5 py-1 text-xs font-semibold text-[#178B7E] transition hover:bg-[#E9F6F3]"
              >
                <Plus size={13} />
                Add Medicine
              </button>
            </div>

            {medicines.length > 0 && (
              <div className="mt-3 space-y-2">
                {medicines.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-xs sm:flex-nowrap"
                  >
                    <div className="flex-1 min-w-[180px]">
                      <select
                        value={item.medicineId}
                        onChange={(e) => updateMedicineRow(idx, "medicineId", e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#178B7E] focus:outline-none"
                      >
                        <option value="">-- Choose Medicine --</option>
                        {medicinesList.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.medicine_name} ({m.unit || "unit"}) - {formatCurrency(m.selling_price || 0)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1 w-24">
                      <span className="text-[11px] text-gray-400">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateMedicineRow(idx, "quantity", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-center font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-1 w-28">
                      <span className="text-[11px] text-gray-400">₹/ea:</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.price}
                        onChange={(e) => updateMedicineRow(idx, "price", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs font-medium"
                      />
                    </div>

                    <div className="min-w-[70px] text-right font-semibold text-gray-800">
                      {formatCurrency(Number(item.quantity || 1) * Number(item.price || 0))}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMedicineRow(idx)}
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                      title="Remove row"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: ROOM CHARGES (OPTIONAL) */}
          <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeRoom}
                  onChange={(e) => {
                    setIncludeRoom(e.target.checked);
                    if (e.target.checked && roomsList.length > 0 && !roomData.roomId) {
                      handleRoomChange(roomsList[0].id);
                    }
                  }}
                  className="size-4 rounded border-gray-300 text-[#178B7E] focus:ring-[#178B7E]"
                />
                <div className="flex items-center gap-1.5">
                  <Bed size={16} className="text-[#178B7E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    4. Room / Ward Charges (Optional)
                  </span>
                </div>
              </label>

              {includeRoom && (
                <span className="text-xs font-bold text-[#178B7E]">
                  Total: {formatCurrency(roomTotal)}
                </span>
              )}
            </div>

            {includeRoom && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Select Room / Ward
                  </label>
                  <select
                    value={roomData.roomId}
                    onChange={(e) => handleRoomChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  >
                    <option value="">-- Choose Room --</option>
                    {roomsList.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.room_number} ({r.room_type || r.ward || "General"}) - {formatCurrency(r.daily_charge || 500)}/day
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={roomData.days}
                    onChange={(e) =>
                      setRoomData((prev) => ({
                        ...prev,
                        days: Math.max(1, Number(e.target.value) || 1),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Daily Rate (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={roomData.pricePerDay}
                    onChange={(e) =>
                      setRoomData((prev) => ({
                        ...prev,
                        pricePerDay: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: APPOINTMENT / CONSULTATION (OPTIONAL) */}
          <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeAppointment}
                  onChange={(e) => {
                    setIncludeAppointment(e.target.checked);
                    if (e.target.checked && doctorsList.length > 0 && !appointmentData.doctorId) {
                      handleDoctorChange(doctorsList[0].id);
                    }
                  }}
                  className="size-4 rounded border-gray-300 text-[#178B7E] focus:ring-[#178B7E]"
                />
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={16} className="text-[#178B7E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    5. Doctor Appointment / Consultation (Optional)
                  </span>
                </div>
              </label>

              {includeAppointment && (
                <span className="text-xs font-bold text-[#178B7E]">
                  Total: {formatCurrency(appointmentTotal)}
                </span>
              )}
            </div>

            {includeAppointment && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Select Doctor
                  </label>
                  <select
                    value={appointmentData.doctorId}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctorsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.first_name} {d.last_name || ""} ({d.department || "General"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) =>
                      setAppointmentData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={appointmentData.charge}
                    onChange={(e) =>
                      setAppointmentData((prev) => ({
                        ...prev,
                        charge: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: OTHER CHARGES (OPTIONAL) */}
          <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeOther}
                  onChange={(e) => setIncludeOther(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-[#178B7E] focus:ring-[#178B7E]"
                />
                <div className="flex items-center gap-1.5">
                  <Receipt size={16} className="text-[#178B7E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    6. Other Charges (Optional)
                  </span>
                </div>
              </label>

              {includeOther && (
                <span className="text-xs font-bold text-[#178B7E]">
                  Total: {formatCurrency(otherTotal)}
                </span>
              )}
            </div>

            {includeOther && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Charge Description
                  </label>
                  <input
                    type="text"
                    value={otherData.description}
                    onChange={(e) =>
                      setOtherData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="e.g. Sanitization kit, Ambulance transfer, Special nursing"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={otherData.amount}
                    onChange={(e) =>
                      setOtherData((prev) => ({
                        ...prev,
                        amount: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 7: DISCOUNT & PAYMENT STATUS */}
          <div className="rounded-xl border border-[#E2EFED] bg-white p-3.5 sm:p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
              7. Discount & Payment Status
            </span>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-600">
                  Discount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-600">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 focus:border-[#178B7E] focus:outline-none"
                >
                  <option value="Unpaid">Unpaid (Due)</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid">Paid in Full</option>
                </select>
              </div>

              {paymentStatus === "Partially Paid" ? (
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={finalTotal}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              )}

              {paymentStatus === "Partially Paid" && (
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 focus:border-[#178B7E] focus:outline-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 8: LIVE FINANCIAL SUMMARY BREAKDOWN */}
          <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-[#F3F9F8] to-[#E9F5F3] p-4 text-xs">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-900">
              Live Bill Summary
            </h4>

            <div className="grid grid-cols-2 gap-2 text-gray-700 sm:grid-cols-4">
              <div>
                <span className="text-[10px] text-gray-500">Service:</span>
                <p className="font-semibold">{formatCurrency(serviceCharge)}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500">Medicines ({medicines.length}):</span>
                <p className="font-semibold">{formatCurrency(medicinesTotal)}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500">Room Charges:</span>
                <p className="font-semibold">{formatCurrency(roomTotal)}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500">Appointment:</span>
                <p className="font-semibold">{formatCurrency(appointmentTotal)}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500">Other Charges:</span>
                <p className="font-semibold">{formatCurrency(otherTotal)}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500">Subtotal:</span>
                <p className="font-bold text-gray-900">{formatCurrency(subtotal)}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500">Discount:</span>
                <p className="font-semibold text-red-600">-{formatCurrency(numDiscount)}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500">Tax ({defaultTaxRate}%):</span>
                <p className="font-semibold text-gray-800">+{formatCurrency(taxAmount)}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between border-t border-teal-200/80 pt-3">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-semibold text-gray-500">Grand Total:</span>
                  <p className="text-base font-bold text-[#178B7E] sm:text-lg">
                    {formatCurrency(finalTotal)}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-gray-500">Amount Paid:</span>
                  <p className="text-sm font-semibold text-emerald-700">
                    {formatCurrency(paidAmount)}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-gray-500">Balance Due:</span>
                  <p
                    className={`text-sm font-bold ${
                      finalTotal - Number(paidAmount || 0) > 0 ? "text-amber-700" : "text-emerald-700"
                    }`}
                  >
                    {formatCurrency(Math.max(0, finalTotal - Number(paidAmount || 0)))}
                  </p>
                </div>
              </div>

              <div className="mt-2 sm:mt-0">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    paymentStatus === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {paymentStatus === "Paid" ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <AlertCircle size={13} />
                  )}
                  {paymentStatus === "Paid" ? "Paid in Full" : "Due"}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#178B7E] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#126b61] disabled:opacity-50 transition"
            >
              {submitting ? (
                <>
                  <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Generating Bill...</span>
                </>
              ) : (
                <>
                  <Receipt size={14} />
                  <span>Generate Manual Bill</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
