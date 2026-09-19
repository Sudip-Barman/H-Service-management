import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  Filter,
  Home,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { apiRequest } from "../../../api/api";

/* =========================================================
   OPTIONS
   ========================================================= */

const patientTypeOptions = [
  "Registered Patient",
  "Unregistered Patient",
];

const bookingCategoryOptions = [
  "Checkup / Consultation",
  "Home Healthcare Service",
];

const priorityOptions = [
  "Low",
  "Normal",
  "High",
  "Emergency",
];

const statusOptions = [
  "All",
  "Scheduled",
  "Confirmed",
  "Completed",
  "Cancelled",
  "No Show",
];

const paymentStatusOptions = [
  "Pending",
  "Partial",
  "Paid",
  "Refunded",
];

const addressTypeOptions = [
  "Patient's Registered Address",
  "Different Address",
];

const emptyForm = {
  booking_number: "",

  /* Patient */
  patient_type: "Registered Patient",
  patient_id: "",

  /* Unregistered patient */
  patient_name: "",
  patient_phone: "",
  patient_email: "",
  patient_address: "",

  /* Booking */
  booking_category: "Checkup / Consultation",

  /* Consultation */
  doctor_id: "",
  consultation_date: "",
  consultation_time: "",
  consultation_fee: "",
  reason: "",
  priority: "Normal",

  /* Home service */
  service_id: "",
  assigned_staff_id: "",
  service_duration: "",
  service_duration_unit: "Days",
  service_start_date: "",
  service_end_date: "",
  service_rate: "",
  service_pricing_type: "Per Day",

  /* Address */
  service_location_type:
    "Patient's Registered Address",
  service_address: "",
  service_area: "",
  service_city: "",
  service_pincode: "",
  service_landmark: "",

  /* Common */
  status: "Scheduled",
  payment_status: "Pending",
  notes: "",
  created_by: "",
};

/* =========================================================
   NORMALIZERS
   ========================================================= */

const getId = (item) =>
  item?.id ??
  item?.patient_id ??
  item?.staff_id ??
  item?.service_id ??
  item?.user_id ??
  item?.booking_id;

const getName = (item) => {
  if (!item) return "";

  if (item.name) return item.name;
  if (item.full_name) return item.full_name;
  if (item.patient_name) return item.patient_name;
  if (item.staff_name) return item.staff_name;
  if (item.service_name) return item.service_name;

  const first = item.first_name || "";
  const last = item.last_name || "";

  return `${first} ${last}`.trim();
};

const getRegistrationNumber = (patient) =>
  patient?.registration_number ??
  patient?.patient_registration_number ??
  patient?.registrationNumber ??
  patient?.patient_code ??
  patient?.patient_number ??
  patient?.code ??
  "";

const getPhone = (patient) =>
  patient?.phone ??
  patient?.phone_number ??
  patient?.mobile ??
  patient?.mobile_number ??
  "";

const getEmail = (patient) =>
  patient?.email ??
  patient?.email_address ??
  "";

const getAddress = (patient) =>
  patient?.address ??
  patient?.full_address ??
  patient?.street_address ??
  "";

const getArea = (patient) =>
  patient?.area ??
  patient?.locality ??
  patient?.district ??
  "";

const getCity = (patient) =>
  patient?.city ??
  patient?.town ??
  "";

const getPincode = (patient) =>
  patient?.pincode ??
  patient?.pin_code ??
  patient?.postal_code ??
  "";

const getRole = (staff) =>
  String(
    staff?.role ??
      staff?.designation ??
      staff?.position ??
      ""
  ).toLowerCase();

const isDoctor = (staff) => {
  const role = getRole(staff);

  return (
    role.includes("doctor") ||
    role.includes("physician") ||
    role.includes("medical officer") ||
    role === "dr"
  );
};

const isServiceStaff = (staff) => {
  const role = getRole(staff);

  return (
    !isDoctor(staff) &&
    (
      staff?.type === "nurse" ||
      role.includes("nurse") ||
      role.includes("nursing") ||
      role.includes("caretaker") ||
      role.includes("caregiver") ||
      role.includes("attendant") ||
      role.includes("japa") ||
      role.includes("sitter") ||
      role.includes("home care") ||
      role.includes("healthcare") ||
      role.includes("elder") ||
      role.includes("staff")
    )
  );
};

const normalizePatient = (patient) => ({
  id: getId(patient),
  name: getName(patient) || "Unnamed Patient",
  registrationNumber:
    getRegistrationNumber(patient),
  phone: getPhone(patient),
  email: getEmail(patient),
  address: getAddress(patient),
  area: getArea(patient),
  city: getCity(patient),
  pincode: getPincode(patient),
});

const normalizeStaff = (staff) => ({
  id: getId(staff),
  name: getName(staff) || "Unnamed Staff",
  role:
    staff?.role ??
    staff?.designation ??
    staff?.qualification ??
    "Staff",
  department: staff?.department ?? "",
  status: staff?.status ?? "Active",
});

const normalizeNurse = (nurse) => {
  const name = getName(nurse);
  const qual = nurse?.qualification ? ` (${nurse.qualification})` : "";
  return {
    id: getId(nurse),
    staffId: nurse?.staff_id,
    name: name || "Unnamed Nurse",
    role: `Nurse${qual}`,
    type: "nurse",
    department: nurse?.department ?? "Nursing",
    status: nurse?.status ?? "Active",
  };
};

const normalizeService = (service) => ({
  id: getId(service),

  name:
    service?.name ??
    service?.service_name ??
    "Unnamed Service",

  fee: Number(
    service?.price ??
      service?.fee ??
      service?.service_fee ??
      service?.consultation_fee ??
      0
  ),

  duration:
    service?.duration ??
    service?.default_duration ??
    "",

  durationUnit:
    service?.duration_unit ??
    service?.duration_type ??
    "Days",

  pricingType:
    service?.pricing_type ??
    service?.billing_type ??
    "Per Day",
});

const normalizeBooking = (
  booking,
  patients,
  doctors,
  services,
  staff
) => {
  const patient = patients.find(
    (item) =>
      String(item.id) ===
      String(booking.patient_id)
  );

  const doctor = doctors.find(
    (item) =>
      String(item.id) ===
      String(booking.doctor_id)
  );

  const service = services.find(
    (item) =>
      String(item.id) ===
      String(booking.service_id)
  );

  const assignedStaff = staff.find(
    (item) =>
      String(item.id) ===
      String(
        booking.assigned_staff_id ??
          booking.staff_id
      ) ||
      (item.staffId != null &&
        String(item.staffId) ===
          String(
            booking.assigned_staff_id ??
              booking.staff_id
          ))
  );

  const creator = staff.find(
    (item) =>
      String(item.id) ===
      String(booking.created_by)
  );

  const isHomeService =
    booking.booking_category ===
      "Home Healthcare Service" ||
    booking.booking_type ===
      "Home Visit";

  return {
    ...booking,

    booking_id:
      booking.booking_id ??
      booking.id,

    booking_category:
      booking.booking_category ??
      (isHomeService
        ? "Home Healthcare Service"
        : "Checkup / Consultation"),

    patient_type:
      booking.patient_type ??
      (booking.patient_id
        ? "Registered Patient"
        : "Unregistered Patient"),

    patient:
      booking.patient ??
      booking.patient_name ??
      patient?.name ??
      booking.unregistered_patient_name ??
      (booking.patient_id
        ? `Patient #${booking.patient_id}`
        : "Unregistered Patient"),

    patient_registration_number:
      booking.patient_registration_number ??
      booking.registration_number ??
      patient?.registrationNumber ??
      "",

    patient_phone:
      booking.patient_phone ??
      patient?.phone ??
      "",

    patient_email:
      booking.patient_email ??
      patient?.email ??
      "",

    patient_address:
      booking.patient_address ??
      patient?.address ??
      "",

    doctor:
      booking.doctor ??
      booking.doctor_name ??
      doctor?.name ??
      (booking.doctor_id
        ? `Doctor #${booking.doctor_id}`
        : "Not assigned"),

    service:
      booking.service ??
      booking.service_name ??
      service?.name ??
      (isHomeService
        ? "No service assigned"
        : "No service"),

    assigned_staff_name:
      booking.assigned_staff_name ??
      booking.staff_name ??
      assignedStaff?.name ??
      (booking.assigned_staff_id
        ? `Staff #${booking.assigned_staff_id}`
        : "Not assigned"),

    consultation_fee:
      booking.consultation_fee ??
      (isHomeService
        ? 0
        : booking.fee ?? 0),

    service_rate:
      booking.service_rate ??
      booking.rate ??
      (isHomeService
        ? service?.fee ?? 0
        : 0),

    total_fee:
      booking.total_fee ??
      booking.consultation_fee ??
      booking.fee ??
      0,

    created_by_name:
      booking.created_by_name ??
      creator?.name ??
      "",
  };
};

/* =========================================================
   STYLES
   ========================================================= */

const statusStyles = {
  Scheduled:
    "bg-slate-50 text-slate-700 border-slate-200",

  Confirmed:
    "bg-emerald-50 text-emerald-700 border-emerald-100",

  Completed:
    "bg-blue-50 text-blue-700 border-blue-100",

  Cancelled:
    "bg-red-50 text-red-700 border-red-100",

  "No Show":
    "bg-orange-50 text-orange-700 border-orange-100",
};

const priorityStyles = {
  Low:
    "bg-slate-50 text-slate-700 border-slate-200",

  Normal:
    "bg-[#E8F8F6] text-[#087F7A] border-[#D5F0ED]",

  High:
    "bg-amber-50 text-amber-700 border-amber-100",

  Emergency:
    "bg-red-50 text-red-700 border-red-100",
};

const paymentStyles = {
  Pending:
    "bg-amber-50 text-amber-700 border-amber-100",

  Partial:
    "bg-blue-50 text-blue-700 border-blue-100",

  Paid:
    "bg-emerald-50 text-emerald-700 border-emerald-100",

  Refunded:
    "bg-slate-50 text-slate-700 border-slate-200",
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [priorityFilter, setPriorityFilter] =
    useState("All");
  const [paymentFilter, setPaymentFilter] =
    useState("All");
  const [dateFilter, setDateFilter] =
    useState("");
  const [showFilters, setShowFilters] =
    useState(false);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [editingBooking, setEditingBooking] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  const [formError, setFormError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [apiError, setApiError] =
    useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  /* =======================================================
     LOAD DATA
     ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setApiError("");

      const [
        bookingData,
        patientData,
        staffData,
        nurseData,
        serviceData,
        doctorData,
      ] = await Promise.all([
        apiRequest("/api/bookings"),
        apiRequest("/api/patients"),
        apiRequest("/api/staff"),
        apiRequest("/api/nurses").catch(() => []),
        apiRequest("/api/services"),
        apiRequest("/api/doctors").catch(() => []),
      ]);

      const patientList = Array.isArray(
        patientData
      )
        ? patientData
        : patientData?.items ??
          patientData?.patients ??
          patientData?.data ??
          [];

      const staffList = Array.isArray(
        staffData
      )
        ? staffData
        : staffData?.items ??
          staffData?.staff ??
          staffData?.data ??
          [];

      const nurseList = Array.isArray(
        nurseData
      )
        ? nurseData
        : nurseData?.items ??
          nurseData?.nurses ??
          nurseData?.data ??
          [];

      const serviceList = Array.isArray(
        serviceData
      )
        ? serviceData
        : serviceData?.items ??
          serviceData?.services ??
          serviceData?.data ??
          [];

      const rawDoctorList = Array.isArray(
        doctorData
      )
        ? doctorData
        : doctorData?.items ??
          doctorData?.doctors ??
          doctorData?.data ??
          [];

      const bookingList = Array.isArray(
        bookingData
      )
        ? bookingData
        : bookingData?.items ??
          bookingData?.bookings ??
          bookingData?.data ??
          [];

      const normalizedPatients =
        patientList
          .map(normalizePatient)
          .filter(
            (item) => item.id != null
          );

      const normalizedStaffList =
        staffList
          .map(normalizeStaff)
          .filter(
            (item) => item.id != null
          );

      const normalizedNursesList =
        nurseList
          .map(normalizeNurse)
          .filter(
            (item) => item.id != null
          );

      // Merge staff and nurses without duplicate names
      const allStaffAndNurses = [...normalizedStaffList];
      normalizedNursesList.forEach((nurse) => {
        const existing = allStaffAndNurses.find(
          (s) =>
            (nurse.staffId != null && String(s.id) === String(nurse.staffId)) ||
            (s.name && nurse.name && s.name.trim().toLowerCase() === nurse.name.trim().toLowerCase())
        );

        if (!existing) {
          allStaffAndNurses.push(nurse);
        } else {
          if (!existing.role || existing.role.toLowerCase() === "staff") {
            existing.role = nurse.role;
          }
          if (nurse.staffId != null) {
            existing.staffId = nurse.staffId;
          }
        }
      });

      const normalizedDoctorsFromApi = rawDoctorList.map((doc) => ({
        id: doc.id,
        name: doc.name || `Dr. ${doc.first_name || ""} ${doc.last_name || ""}`.trim(),
        role: "Doctor",
        department: doc.department || doc.specialization || "General",
        phone: doc.phone || "",
        email: doc.email || "",
      })).filter((item) => item.id != null);

      const normalizedDoctors = [
        ...normalizedDoctorsFromApi,
        ...allStaffAndNurses.filter(isDoctor).filter(
          (s) => !normalizedDoctorsFromApi.some((d) => String(d.id) === String(s.id))
        ),
      ];

      const normalizedServices =
        serviceList
          .map(normalizeService)
          .filter(
            (item) => item.id != null
          );

      setPatients(normalizedPatients);
      setStaffOptions(allStaffAndNurses);
      setDoctors(normalizedDoctors);
      setServices(normalizedServices);

      setBookings(
        bookingList.map((booking) =>
          normalizeBooking(
            booking,
            normalizedPatients,
            normalizedDoctors,
            normalizedServices,
            allStaffAndNurses
          )
        )
      );
    } catch (error) {
      console.error(
        "Failed to load booking data:",
        error
      );

      setApiError(
        error.message ||
          "Failed to load booking data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     STATS
     ======================================================= */

  const stats = useMemo(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    return {
      total: bookings.length,

      today: bookings.filter(
        (booking) =>
          booking.booking_date === today &&
          booking.status !== "Cancelled"
      ).length,

      scheduled: bookings.filter(
        (booking) =>
          booking.status === "Scheduled"
      ).length,

      confirmed: bookings.filter(
        (booking) =>
          booking.status === "Confirmed"
      ).length,

      completed: bookings.filter(
        (booking) =>
          booking.status === "Completed"
      ).length,
    };
  }, [bookings]);

  /* =======================================================
     FILTER
     ======================================================= */

  const filteredBookings = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return bookings.filter((booking) => {
      const searchable = [
        booking.booking_number,
        booking.patient,
        booking.doctor,
        booking.service,
        booking.assigned_staff_name,
        booking.reason,
        booking.notes,
        booking.booking_category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchable.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        booking.priority === priorityFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        booking.payment_status ===
          paymentFilter;

      const matchesDate =
        !dateFilter ||
        booking.booking_date ===
          dateFilter ||
        booking.consultation_date ===
          dateFilter ||
        booking.service_start_date ===
          dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesPayment &&
        matchesDate
      );
    });
  }, [
    bookings,
    search,
    statusFilter,
    priorityFilter,
    paymentFilter,
    dateFilter,
  ]);

  /* =======================================================
     FORM HELPERS
     ======================================================= */

  const updateForm = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFormError("");

    /* -------------------------------------------------------
       Registered patient selected
       ------------------------------------------------------- */

    if (
      field === "patient_id" &&
      value
    ) {
      const patient = patients.find(
        (item) =>
          String(item.id) ===
          String(value)
      );

      if (patient) {
        setForm((current) => ({
          ...current,
          patient_id: value,
          patient_name: patient.name,
          patient_phone: patient.phone,
          patient_email: patient.email,
          patient_address: patient.address,
          service_address:
            current.service_location_type ===
            "Patient's Registered Address"
              ? patient.address
              : current.service_address,
        }));
      }
    }

    /* -------------------------------------------------------
       Service selected
       ------------------------------------------------------- */

    if (
      field === "service_id" &&
      value
    ) {
      const service = services.find(
        (item) =>
          String(item.id) ===
          String(value)
      );

      if (service) {
        setForm((current) => ({
          ...current,
          service_id: value,
          service_rate: service.fee,
          service_duration:
            service.duration ||
            current.service_duration,
          service_duration_unit:
            service.durationUnit ||
            current.service_duration_unit,
          service_pricing_type:
            service.pricingType ||
            current.service_pricing_type,
        }));
      }
    }

    /* -------------------------------------------------------
       Booking category changed
       ------------------------------------------------------- */

    if (
      field === "booking_category"
    ) {
      if (
        value ===
        "Checkup / Consultation"
      ) {
        setForm((current) => ({
          ...current,
          booking_category: value,
          service_id: "",
          assigned_staff_id: "",
          service_duration: "",
          service_start_date: "",
          service_end_date: "",
          service_rate: "",
          service_address: "",
          service_area: "",
          service_city: "",
          service_pincode: "",
          service_landmark: "",
        }));
      } else {
        setForm((current) => ({
          ...current,
          booking_category: value,
          doctor_id: "",
          consultation_date: "",
          consultation_time: "",
          consultation_fee: "",
        }));
      }
    }

    /* -------------------------------------------------------
       Address mode
       ------------------------------------------------------- */

    if (
      field ===
        "service_location_type" &&
      value ===
        "Patient's Registered Address"
    ) {
      const patient = patients.find(
        (item) =>
          String(item.id) ===
          String(form.patient_id)
      );

      if (patient) {
        setForm((current) => ({
          ...current,
          service_location_type:
            value,
          service_address:
            patient.address || "",
          service_area:
            patient.area || "",
          service_city:
            patient.city || "",
          service_pincode:
            patient.pincode || "",
        }));
      }
    }

    if (
      field ===
        "service_start_date"
    ) {
      setForm((current) => ({
        ...current,
        service_start_date: value,

        service_end_date:
          current.service_end_date &&
          current.service_end_date >=
            value
            ? current.service_end_date
            : value,
      }));
    }
  };

  /* =======================================================
     BOOKING NUMBER
     Frontend version for now.
     Backend will later generate the final unique number.
     ======================================================= */

  const generateBookingNumber = () => {
    const year =
      new Date().getFullYear();

    const numbers = bookings
      .map((booking) => {
        const value =
          booking.booking_number ||
          "";

        const match = String(
          value
        ).match(/(\d+)$/);

        return match
          ? Number(match[1])
          : NaN;
      })
      .filter(
        (number) =>
          !Number.isNaN(number)
      );

    const maxNumber = Math.max(
      0,
      ...numbers
    );

    return `BK-${year}-${String(
      maxNumber + 1
    ).padStart(5, "0")}`;
  };

  /* =======================================================
     OPEN ADD
     ======================================================= */

  const handleOpenAdd = () => {
    setEditingBooking(null);

    setForm({
      ...emptyForm,

      booking_number:
        generateBookingNumber(),

      consultation_date:
        new Date()
          .toISOString()
          .split("T")[0],

      service_start_date:
        new Date()
          .toISOString()
          .split("T")[0],

      created_by:
        localStorage.getItem(
          "user_id"
        ) ||
        localStorage.getItem(
          "staff_id"
        ) ||
        "",
    });

    setFormError("");
    setSelectedBooking(null);
    setShowAddModal(true);
  };

  /* =======================================================
     OPEN EDIT
     ======================================================= */

  const handleOpenEdit = (
    booking
  ) => {
    const isHomeService =
      booking.booking_category ===
        "Home Healthcare Service" ||
      booking.booking_type ===
        "Home Visit";

    setEditingBooking(booking);

    setForm({
      ...emptyForm,

      booking_number:
        booking.booking_number || "",

      patient_type:
        booking.patient_type ||
        (booking.patient_id
          ? "Registered Patient"
          : "Unregistered Patient"),

      patient_id:
        booking.patient_id != null
          ? String(
              booking.patient_id
            )
          : "",

      patient_name:
        booking.patient_name ||
        booking.patient ||
        "",

      patient_phone:
        booking.patient_phone || "",

      patient_email:
        booking.patient_email || "",

      patient_address:
        booking.patient_address || "",

      booking_category:
        isHomeService
          ? "Home Healthcare Service"
          : "Checkup / Consultation",

      doctor_id:
        booking.doctor_id != null
          ? String(
              booking.doctor_id
            )
          : "",

      consultation_date:
        booking.consultation_date ||
        booking.booking_date ||
        "",

      consultation_time:
        String(
          booking.consultation_time ||
            booking.booking_time ||
            ""
        ).slice(0, 5),

      consultation_fee:
        booking.consultation_fee ??
        "",

      service_id:
        booking.service_id != null
          ? String(
              booking.service_id
            )
          : "",

      assigned_staff_id:
        booking.assigned_staff_id != null
          ? String(
              booking.assigned_staff_id
            )
          : "",

      service_duration:
        booking.service_duration ??
        "",

      service_duration_unit:
        booking.service_duration_unit ||
        "Days",

      service_start_date:
        booking.service_start_date ||
        "",

      service_end_date:
        booking.service_end_date ||
        "",

      service_rate:
        booking.service_rate ??
        "",

      service_pricing_type:
        booking.service_pricing_type ||
        "Per Day",

      service_location_type:
        booking.service_location_type ||
        "Patient's Registered Address",

      service_address:
        booking.service_address ||
        booking.patient_address ||
        "",

      service_area:
        booking.service_area || "",

      service_city:
        booking.service_city || "",

      service_pincode:
        booking.service_pincode ||
        "",

      service_landmark:
        booking.service_landmark ||
        "",

      priority:
        booking.priority ||
        "Normal",

      status:
        booking.status ||
        "Scheduled",

      payment_status:
        booking.payment_status ||
        "Pending",

      reason:
        booking.reason || "",

      notes:
        booking.notes || "",

      created_by:
        booking.created_by ?? "",
    });

    setFormError("");
    setSelectedBooking(null);
    setShowAddModal(true);
  };

  /* =======================================================
     TOTAL FEE
     ======================================================= */

  const calculateTotalFee = () => {
    if (
      form.booking_category !==
      "Home Healthcare Service"
    ) {
      return Number(
        form.consultation_fee || 0
      );
    }

    const rate = Number(
      form.service_rate || 0
    );

    const duration = Number(
      form.service_duration || 0
    );

    if (!rate) return 0;

    switch (
      form.service_pricing_type
    ) {
      case "Per Hour":
        return rate * duration;

      case "Per Day":
        return rate * duration;

      case "Per Visit":
        return rate;

      case "Per Week":
        return rate * Math.ceil(
          duration / 7
        );

      case "Monthly":
        return rate;

      case "Fixed Package":
        return rate;

      default:
        return rate * duration;
    }
  };

  /* =======================================================
     VALIDATION
     ======================================================= */

  const validateForm = () => {
    if (
      !form.booking_number.trim()
    ) {
      return "Booking number is required.";
    }

    if (
      form.patient_type ===
      "Registered Patient"
    ) {
      if (!form.patient_id) {
        return "Please select a registered patient.";
      }
    } else {
      if (
        !form.patient_name.trim()
      ) {
        return "Patient name is required for an unregistered patient.";
      }

      if (
        !form.patient_phone.trim()
      ) {
        return "Patient phone number is required.";
      }
    }

    if (
      form.booking_category ===
      "Checkup / Consultation"
    ) {
      if (!form.doctor_id) {
        return "Doctor is required for a consultation.";
      }

      if (
        !form.consultation_date
      ) {
        return "Consultation date is required.";
      }

      if (
        !form.consultation_time
      ) {
        return "Consultation time is required.";
      }

      if (
        Number(
          form.consultation_fee || 0
        ) < 0
      ) {
        return "Consultation fee cannot be negative.";
      }
    }

    if (
      form.booking_category ===
      "Home Healthcare Service"
    ) {
      if (!form.service_id) {
        return "Please select a home healthcare service.";
      }

      if (
        !form.assigned_staff_id
      ) {
        return "Please assign a staff member for the home service.";
      }

      if (
        !form.service_duration ||
        Number(
          form.service_duration
        ) <= 0
      ) {
        return "Service duration must be greater than 0.";
      }

      if (
        !form.service_start_date
      ) {
        return "Service start date is required.";
      }

      if (
        !form.service_end_date
      ) {
        return "Service end date is required.";
      }

      if (
        form.service_end_date <
        form.service_start_date
      ) {
        return "Service end date cannot be before the start date.";
      }

      if (
        Number(
          form.service_rate || 0
        ) < 0
      ) {
        return "Service rate cannot be negative.";
      }

      if (
        !form.service_address.trim()
      ) {
        return "Service address is required.";
      }
    }

    return "";
  };

  /* =======================================================
     CREATE / UPDATE
     ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setFormError("");

    const validationError =
      validateForm();

    if (validationError) {
      setFormError(
        validationError
      );
      return;
    }

    const isHomeService =
      form.booking_category ===
      "Home Healthcare Service";

    const totalFee =
      calculateTotalFee();

    /*
     * This payload is intentionally prepared for the
     * new backend structure. We will update the FastAPI
     * model/schema/router after the frontend is complete.
     */

    const payload = {
      booking_number:
        form.booking_number.trim(),

      patient_type:
        form.patient_type,

      patient_id:
        form.patient_type ===
        "Registered Patient"
          ? Number(form.patient_id)
          : null,

      patient_name:
        form.patient_name.trim() ||
        null,

      patient_phone:
        form.patient_phone.trim() ||
        null,

      patient_email:
        form.patient_email.trim() ||
        null,

      patient_address:
        form.patient_address.trim() ||
        null,

      booking_category:
        form.booking_category,

      /* Consultation */
      doctor_id:
        !isHomeService &&
        form.doctor_id
          ? Number(form.doctor_id)
          : null,

      consultation_date:
        !isHomeService
          ? form.consultation_date
          : null,

      consultation_time:
        !isHomeService
          ? form.consultation_time
          : null,

      consultation_fee:
        !isHomeService
          ? Number(
              form.consultation_fee ||
                0
            )
          : 0,

      /* Home service */
      service_id:
        isHomeService &&
        form.service_id
          ? Number(form.service_id)
          : null,

      assigned_staff_id:
        isHomeService &&
        form.assigned_staff_id
          ? Number(
              form.assigned_staff_id
            )
          : null,

      service_duration:
        isHomeService
          ? Number(
              form.service_duration ||
                0
            )
          : null,

      service_duration_unit:
        isHomeService
          ? form.service_duration_unit
          : null,

      service_start_date:
        isHomeService
          ? form.service_start_date
          : null,

      service_end_date:
        isHomeService
          ? form.service_end_date
          : null,

      service_rate:
        isHomeService
          ? Number(
              form.service_rate || 0
            )
          : null,

      service_pricing_type:
        isHomeService
          ? form.service_pricing_type
          : null,

      total_fee: Number(
        totalFee || 0
      ),

      /* Address */
      service_location_type:
        isHomeService
          ? form.service_location_type
          : null,

      service_address:
        isHomeService
          ? form.service_address.trim()
          : null,

      service_area:
        isHomeService
          ? form.service_area.trim() ||
            null
          : null,

      service_city:
        isHomeService
          ? form.service_city.trim() ||
            null
          : null,

      service_pincode:
        isHomeService
          ? form.service_pincode.trim() ||
            null
          : null,

      service_landmark:
        isHomeService
          ? form.service_landmark.trim() ||
            null
          : null,

      /* Common */
      booking_date:
        isHomeService
          ? form.service_start_date
          : form.consultation_date,

      booking_time:
        isHomeService
          ? null
          : form.consultation_time,

      /*
       * Kept for compatibility with the existing backend.
       * The backend will later use booking_category as the
       * primary booking classification.
       */
      booking_type:
        isHomeService
          ? "Home Visit"
          : "In-Person",

      reason:
        form.reason.trim() ||
        null,

      priority:
        form.priority,

      status:
        form.status,

      payment_status:
        form.payment_status,

      notes:
        form.notes.trim() ||
        null,

      created_by:
        form.created_by
          ? Number(
              form.created_by
            )
          : null,
    };

    try {
      setSubmitting(true);

      if (editingBooking) {
        await apiRequest(
          `/api/bookings/${editingBooking.booking_id}`,
          {
            method: "PUT",
            body: JSON.stringify(
              payload
            ),
          }
        );
      } else {
        await apiRequest(
          "/api/bookings",
          {
            method: "POST",
            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      await loadData();

      setForm(emptyForm);
      setFormError("");
      setEditingBooking(null);
      setShowAddModal(false);
      showToast(
        editingBooking
          ? "Booking updated successfully!"
          : "New booking created successfully!",
        "success"
      );
    } catch (error) {
      console.error(
        "Booking save failed:",
        error
      );

      setFormError(
        error.message ||
          "Failed to save booking."
      );
      showToast(
        error.message || "Failed to save booking.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     UPDATE STATUS
     ======================================================= */

  const updateBookingStatus = async (
    bookingId,
    status
  ) => {
    try {
      setUpdatingStatus(true);
      setApiError("");

      const updatedBooking =
        await apiRequest(
          `/api/bookings/${bookingId}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status,
            }),
          }
        );

      const normalized =
        normalizeBooking(
          updatedBooking,
          patients,
          doctors,
          services,
          staffOptions
        );

      setBookings((current) =>
        current.map((booking) =>
          booking.booking_id ===
          bookingId
            ? normalized
            : booking
        )
      );

      setSelectedBooking(
        (current) =>
          current?.booking_id ===
          bookingId
            ? normalized
            : current
      );
      showToast(`Booking status changed to ${status}`, "success");
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );

      setApiError(
        error.message ||
          "Failed to update booking status."
      );
      showToast(
        error.message || "Failed to update booking status.",
        "error"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <CalendarDays className="h-5 w-5" />
            </div>

            <h1 className="text-xl font-bold text-[#073F42] sm:text-2xl">
              Booking Management
            </h1>
          </div>

          <p className="mt-1 text-xs text-[#819596] sm:text-sm">
            Create, schedule, track, and manage patient bookings.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-3 text-xs font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:px-4 sm:text-sm"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

          <button
            type="button"
            onClick={
              handleOpenAdd
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#078F8A] sm:h-11 sm:px-5 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            New Booking
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all duration-300 ${
            toast.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700 shadow-red-500/10"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-500/10"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle className="h-5 w-5 shrink-0 text-red-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        <StatCard
          icon={CalendarDays}
          label="Total Bookings"
          value={stats.total}
        />

        <StatCard
          icon={Clock3}
          label="Today's Bookings"
          value={stats.today}
        />

        <StatCard
          icon={Activity}
          label="Scheduled"
          value={stats.scheduled}
        />

        <StatCard
          icon={CheckCircle2}
          label="Confirmed"
          value={stats.confirmed}
        />

        <StatCard
          icon={UserCheck}
          label="Completed"
          value={stats.completed}
        />
      </div>

      {/* SEARCH */}

      <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8AA0A1]" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search booking, patient, doctor, service..."
              className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] pl-10 pr-4 text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (value) => !value
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-[#EAF2F0] pt-4 md:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Booking Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={
                statusOptions
              }
            />

            <FilterSelect
              label="Priority"
              value={priorityFilter}
              onChange={
                setPriorityFilter
              }
              options={[
                "All",
                ...priorityOptions,
              ]}
            />

            <FilterSelect
              label="Payment Status"
              value={paymentFilter}
              onChange={
                setPaymentFilter
              }
              options={[
                "All",
                ...paymentStatusOptions,
              ]}
            />

            <label>
              <span className="mb-1.5 block text-xs font-bold text-[#708789]">
                Booking Date
              </span>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(
                    event.target.value
                  )
                }
                className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
              />
            </label>
          </div>
        )}
      </div>

      {/* BOOKING LIST */}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#31585A]">
            <Loader2 className="h-5 w-5 animate-spin text-[#08A6A0]" />
            Loading bookings...
          </div>
        </div>
      ) : filteredBookings.length ===
        0 ? (
        <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
          <EmptyState
            onClear={() => {
              setSearch("");
              setStatusFilter("All");
              setPriorityFilter("All");
              setPaymentFilter("All");
              setDateFilter("");
            }}
          />
        </div>
      ) : (
        <>
          {/* DESKTOP */}

          <div className="hidden overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm md:block">
            <div className="flex items-center justify-between border-b border-[#EAF2F0] px-5 py-4">
              <div>
                <h2 className="font-bold text-[#073F42]">
                  Booking Schedule
                </h2>

                <p className="mt-1 text-xs text-[#819596]">
                  {
                    filteredBookings.length
                  }{" "}
                  booking
                  {filteredBookings.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead>
                  <tr className="border-b border-[#EAF2F0] bg-[#FAFDFC] text-left">
                    <TableHeader>
                      Patient
                    </TableHeader>

                    <TableHeader>
                      Type
                    </TableHeader>

                    <TableHeader>
                      Doctor / Staff
                    </TableHeader>

                    <TableHeader>
                      Service
                    </TableHeader>

                    <TableHeader>
                      Date & Time
                    </TableHeader>

                    <TableHeader>
                      Priority
                    </TableHeader>

                    <TableHeader>
                      Payment
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader align="right">
                      Action
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map(
                    (booking) => (
                      <BookingRow
                        key={
                          booking.booking_id
                        }
                        booking={booking}
                        onView={() =>
                          setSelectedBooking(
                            booking
                          )
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE */}

          <div className="space-y-3 md:hidden">
            {filteredBookings.map(
              (booking) => (
                <BookingMobileCard
                  key={
                    booking.booking_id
                  }
                  booking={booking}
                  onView={() =>
                    setSelectedBooking(
                      booking
                    )
                  }
                />
              )
            )}
          </div>
        </>
      )}

      {/* DETAILS */}

      {selectedBooking && (
        <BookingDetails
          booking={
            selectedBooking
          }
          onClose={() =>
            setSelectedBooking(null)
          }
          onStatusChange={
            updateBookingStatus
          }
          onEdit={
            handleOpenEdit
          }
          updatingStatus={
            updatingStatus
          }
        />
      )}

      {/* ADD / EDIT */}

      {showAddModal && (
        <AddBookingModal
          form={form}
          error={formError}
          editing={Boolean(
            editingBooking
          )}
          onChange={updateForm}
          onSubmit={handleSubmit}
          onClose={() => {
            if (submitting) return;

            setShowAddModal(false);
            setEditingBooking(null);
            setFormError("");
          }}
          patients={patients}
          doctors={doctors}
          services={services}
          staffOptions={staffOptions}
          submitting={submitting}
          totalFee={calculateTotalFee()}
        />
      )}
    </div>
  );
};

/* =========================================================
   STAT CARD
   ========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="min-w-0 rounded-lg border border-[#E2EFED] bg-white px-2 py-1.5 shadow-sm sm:rounded-xl sm:px-2.5 sm:py-2.5 md:rounded-2xl md:px-4 md:py-4">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        <div className="min-w-0">
          <p className="truncate text-[9px] font-semibold text-[#819596] sm:text-[10px] md:text-xs">
            {label}
          </p>

          <p className="mt-0.5 text-base font-bold leading-none text-[#073F42] sm:mt-1 sm:text-lg md:mt-2 md:text-2xl">
            {value}
          </p>
        </div>

        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E8F8F6] text-[#08A6A0] sm:h-7 sm:w-7 md:h-10 md:w-10 md:rounded-xl">
          <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-5 md:w-5" />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   TABLE HEADER
   ========================================================= */

const TableHeader = ({
  children,
  align = "left",
}) => {
  return (
    <th
      className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
};

/* =========================================================
   BOOKING ROW
   ========================================================= */

const BookingRow = ({
  booking,
  onView,
}) => {
  const isHomeService =
    booking.booking_category ===
      "Home Healthcare Service" ||
    booking.booking_type ===
      "Home Visit";

  const displayDate =
    isHomeService
      ? booking.service_start_date ||
        booking.booking_date
      : booking.consultation_date ||
        booking.booking_date;

  const displayTime =
    isHomeService
      ? "-"
      : formatTime(
          booking.consultation_time ||
            booking.booking_time
        );

  return (
    <tr className="border-b border-[#EAF2F0] last:border-0 hover:bg-[#FAFDFC]">
      <td className="px-5 py-4">
        <p className="text-sm font-bold text-[#173F41]">
          {booking.patient}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {booking.patient_registration_number ||
            booking.patient_phone ||
            "Unregistered Patient"}
        </p>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8F6] px-2.5 py-1 text-xs font-semibold text-[#087F7A]">
          {isHomeService ? (
            <Home className="h-3 w-3" />
          ) : (
            <Stethoscope className="h-3 w-3" />
          )}

          {isHomeService
            ? "Home Service"
            : "Consultation"}
        </span>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-[#31585A]">
          {isHomeService
            ? booking.assigned_staff_name
            : booking.doctor}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {isHomeService
            ? "Assigned Staff"
            : "Doctor"}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#31585A]">
          {booking.service ||
            "Consultation"}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          ₹
          {Number(
            booking.total_fee ??
              booking.consultation_fee ??
              0
          ).toFixed(2)}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-[#31585A]">
          {formatDate(
            displayDate
          )}
        </p>

        <p className="mt-1 text-xs text-[#819596]">
          {displayTime}
        </p>
      </td>

      <td className="px-5 py-4">
        <PriorityBadge
          priority={
            booking.priority
          }
        />
      </td>

      <td className="px-5 py-4">
        <PaymentBadge
          status={
            booking.payment_status
          }
        />
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          status={booking.status}
        />
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onView}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9E9E7] text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
            title="View booking"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   MOBILE CARD
   ========================================================= */

const BookingMobileCard = ({
  booking,
  onView,
}) => {
  const isHomeService =
    booking.booking_category ===
      "Home Healthcare Service" ||
    booking.booking_type ===
      "Home Visit";

  const displayDate =
    isHomeService
      ? booking.service_start_date ||
        booking.booking_date
      : booking.consultation_date ||
        booking.booking_date;

  const displayTime =
    isHomeService
      ? "-"
      : formatTime(
          booking.consultation_time ||
            booking.booking_time
        );

  return (
    <div className="rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6]">
            {isHomeService ? (
              <Home
                size={18}
                className="text-[#08A6A0]"
              />
            ) : (
              <CalendarDays
                size={18}
                className="text-[#08A6A0]"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#173F41]">
              {booking.patient}
            </p>

            <p className="mt-0.5 text-xs text-[#819596]">
              {booking.booking_number}
            </p>
          </div>
        </div>

        <StatusBadge
          status={booking.status}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <InfoBox
          label={
            isHomeService
              ? "Assigned Staff"
              : "Doctor"
          }
          value={
            isHomeService
              ? booking.assigned_staff_name
              : booking.doctor
          }
        />

        <InfoBox
          label="Service"
          value={
            booking.service ||
            "Consultation"
          }
        />

        <InfoBox
          label="Date"
          value={formatDate(
            displayDate
          )}
        />

        <InfoBox
          label="Time"
          value={displayTime}
        />

        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Priority
          </p>

          <div className="mt-1">
            <PriorityBadge
              priority={
                booking.priority
              }
            />
          </div>
        </div>

        <div className="rounded-lg bg-[#FAFDFC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
            Total Fee
          </p>

          <p className="mt-1 text-sm font-bold text-[#31585A]">
            ₹
            {Number(
              booking.total_fee ??
                booking.consultation_fee ??
                0
            ).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-[#EAF2F0] pt-3">
        <button
          type="button"
          onClick={onView}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8F8F6] px-3 py-2 text-xs font-semibold text-[#073F42] transition hover:bg-[#DDF3F0]"
        >
          <Eye size={14} />
          View Booking
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   INFO BOX
   ========================================================= */

const InfoBox = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-lg bg-[#FAFDFC] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#819596]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-[#31585A] sm:text-sm">
        {value || "-"}
      </p>
    </div>
  );
};

/* =========================================================
   STATUS BADGE
   ========================================================= */

const StatusBadge = ({
  status,
}) => {
  const style =
    statusStyles[status] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
};

/* =========================================================
   PRIORITY BADGE
   ========================================================= */

const PriorityBadge = ({
  priority,
}) => {
  const style =
    priorityStyles[priority] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {priority ===
        "Emergency" && (
        <AlertTriangle className="h-3 w-3" />
      )}

      {priority}
    </span>
  );
};

/* =========================================================
   PAYMENT BADGE
   ========================================================= */

const PaymentBadge = ({
  status,
}) => {
  const style =
    paymentStyles[status] ||
    "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
};

/* =========================================================
   BOOKING DETAILS
   ========================================================= */

const BookingDetails = ({
  booking,
  onClose,
  onStatusChange,
  onEdit,
  updatingStatus = false,
}) => {
  const isHomeService =
    booking.booking_category ===
      "Home Healthcare Service" ||
    booking.booking_type ===
      "Home Visit";

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#073F42]/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* HEADER */}

          <div className="bg-[#073F42] p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  {isHomeService ? (
                    <Home className="h-7 w-7" />
                  ) : (
                    <CalendarDays className="h-7 w-7" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Booking Details
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {booking.booking_number}
                  </h2>

                  <p className="mt-1 text-xs text-white/60">
                    {isHomeService
                      ? "Home Healthcare Service"
                      : "Checkup / Consultation"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* BODY */}

          <div className="max-h-[80vh] space-y-6 overflow-y-auto p-5 sm:p-6">
            {/* BADGES */}

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={booking.status}
              />

              <PriorityBadge
                priority={booking.priority}
              />

              <PaymentBadge
                status={
                  booking.payment_status
                }
              />

              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#087F7A]">
                {isHomeService ? (
                  <Home className="h-3 w-3" />
                ) : (
                  <Stethoscope className="h-3 w-3" />
                )}

                {isHomeService
                  ? "Home Service"
                  : "Consultation"}
              </span>
            </div>

            {/* OVERVIEW */}

            <section>
              <SectionTitle title="Booking Overview" />

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  icon={CalendarDays}
                  label="Booking Number"
                  value={
                    booking.booking_number
                  }
                />

                <DetailItem
                  icon={CalendarDays}
                  label={
                    isHomeService
                      ? "Start Date"
                      : "Date"
                  }
                  value={formatDate(
                    isHomeService
                      ? booking.service_start_date
                      : booking.consultation_date ||
                          booking.booking_date
                  )}
                />

                <DetailItem
                  icon={Clock3}
                  label={
                    isHomeService
                      ? "Duration"
                      : "Time"
                  }
                  value={
                    isHomeService
                      ? `${booking.service_duration || "-"} ${booking.service_duration_unit || ""}`
                      : formatTime(
                          booking.consultation_time ||
                            booking.booking_time
                        )
                  }
                />

                <DetailItem
                  icon={CreditCard}
                  label="Total Fee"
                  value={`₹${Number(
                    booking.total_fee ??
                      booking.consultation_fee ??
                      0
                  ).toFixed(2)}`}
                />
              </div>
            </section>

            {/* PATIENT */}

            <section>
              <SectionTitle title="Patient Information" />

              <div className="mt-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] text-sm font-bold text-[#087F7A]">
                    {getInitials(
                      booking.patient
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#173F41]">
                      {booking.patient}
                    </p>

                    <p className="mt-1 text-xs text-[#819596]">
                      {booking.patient_registration_number ||
                        "Unregistered Patient"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 border-t border-[#EAF2F0] pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SmallDetail
                    label="Patient ID"
                    value={
                      booking.patient_id ||
                      "-"
                    }
                  />

                  <SmallDetail
                    label="Phone"
                    value={
                      booking.patient_phone ||
                      "-"
                    }
                  />

                  <SmallDetail
                    label="Email"
                    value={
                      booking.patient_email ||
                      "-"
                    }
                  />

                  <SmallDetail
                    label="Registration No."
                    value={
                      booking.patient_registration_number ||
                      "Not registered"
                    }
                  />
                </div>
              </div>
            </section>

            {/* CONSULTATION */}

            {!isHomeService && (
              <section>
                <SectionTitle title="Consultation Information" />

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem
                    icon={Stethoscope}
                    label="Doctor"
                    value={
                      booking.doctor
                    }
                  />

                  <DetailItem
                    icon={CalendarDays}
                    label="Consultation Date"
                    value={formatDate(
                      booking.consultation_date ||
                        booking.booking_date
                    )}
                  />

                  <DetailItem
                    icon={Clock3}
                    label="Consultation Time"
                    value={formatTime(
                      booking.consultation_time ||
                        booking.booking_time
                    )}
                  />

                  <DetailItem
                    icon={CreditCard}
                    label="Consultation Fee"
                    value={`₹${Number(
                      booking.consultation_fee ||
                        0
                    ).toFixed(2)}`}
                  />
                </div>
              </section>
            )}

            {/* HOME SERVICE */}

            {isHomeService && (
              <>
                <section>
                  <SectionTitle title="Home Healthcare Service" />

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem
                      icon={Home}
                      label="Service"
                      value={
                        booking.service
                      }
                    />

                    <DetailItem
                      icon={Users}
                      label="Assigned Staff"
                      value={
                        booking.assigned_staff_name
                      }
                    />

                    <DetailItem
                      icon={Clock3}
                      label="Duration"
                      value={`${booking.service_duration || "-"} ${booking.service_duration_unit || ""}`}
                    />

                    <DetailItem
                      icon={CalendarDays}
                      label="Start Date"
                      value={formatDate(
                        booking.service_start_date
                      )}
                    />

                    <DetailItem
                      icon={CalendarDays}
                      label="End Date"
                      value={formatDate(
                        booking.service_end_date
                      )}
                    />

                    <DetailItem
                      icon={CreditCard}
                      label="Service Rate"
                      value={`₹${Number(
                        booking.service_rate ||
                          0
                      ).toFixed(2)}`}
                    />
                  </div>
                </section>

                <section>
                  <SectionTitle title="Service Location" />

                  <div className="mt-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6]">
                        <MapPin className="h-5 w-5 text-[#08A6A0]" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#173F41]">
                          {booking.service_location_type ||
                            "Patient's Address"}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#31585A]">
                          {booking.service_address ||
                            "No address provided"}
                        </p>

                        {(booking.service_area ||
                          booking.service_city ||
                          booking.service_pincode) && (
                          <p className="mt-1 text-xs text-[#819596]">
                            {[
                              booking.service_area,
                              booking.service_city,
                              booking.service_pincode,
                            ]
                              .filter(
                                Boolean
                              )
                              .join(
                                ", "
                              )}
                          </p>
                        )}

                        {booking.service_landmark && (
                          <p className="mt-1 text-xs text-[#819596]">
                            Landmark:{" "}
                            {
                              booking.service_landmark
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* PAYMENT */}

            <section>
              <SectionTitle title="Payment Information" />

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <DetailItem
                  icon={CreditCard}
                  label="Total Fee"
                  value={`₹${Number(
                    booking.total_fee ??
                      booking.consultation_fee ??
                      0
                  ).toFixed(2)}`}
                />

                <DetailItem
                  icon={CheckCircle2}
                  label="Payment Status"
                  value={
                    booking.payment_status
                  }
                />

                <DetailItem
                  icon={FileText}
                  label="Booking Type"
                  value={
                    isHomeService
                      ? "Home Healthcare Service"
                      : "Checkup / Consultation"
                  }
                />
              </div>
            </section>

            {/* REASON */}

            <section>
              <SectionTitle title="Booking Reason" />

              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6]">
                  <FileText className="h-5 w-5 text-[#08A6A0]" />
                </div>

                <p className="text-sm leading-6 text-[#31585A]">
                  {booking.reason ||
                    "No reason provided."}
                </p>
              </div>
            </section>

            {/* NOTES */}

            <section>
              <SectionTitle title="Booking Notes" />

              <div className="mt-3 rounded-2xl border border-[#E2EFED] bg-[#FAFDFC] p-4">
                <p className="text-sm leading-6 text-[#31585A]">
                  {booking.notes ||
                    "No additional notes available."}
                </p>
              </div>
            </section>

            {/* RECORD */}

            <section>
              <SectionTitle title="Record Information" />

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  icon={UserRound}
                  label="Created By"
                  value={
                    booking.created_by_name ||
                    booking.created_by ||
                    "-"
                  }
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Created At"
                  value={
                    booking.created_at ||
                    "-"
                  }
                />

                <DetailItem
                  icon={Edit3}
                  label="Updated At"
                  value={
                    booking.updated_at ||
                    "-"
                  }
                />

                <DetailItem
                  icon={UserCheck}
                  label="Booking ID"
                  value={
                    booking.booking_id
                  }
                />
              </div>
            </section>

            {/* ACTIONS */}

            <section>
              <SectionTitle title="Booking Actions" />

              <div className="mt-3 flex flex-wrap gap-3">
                {booking.status ===
                  "Scheduled" && (
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        booking.booking_id,
                        "Confirmed"
                      )
                    }
                    disabled={
                      updatingStatus
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white transition hover:bg-[#078F8A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Booking
                  </button>
                )}

                {booking.status ===
                  "Confirmed" && (
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        booking.booking_id,
                        "Completed"
                      )
                    }
                    disabled={
                      updatingStatus
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white transition hover:bg-[#078F8A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Completed
                  </button>
                )}

                {booking.status !==
                  "Cancelled" &&
                  booking.status !==
                    "Completed" &&
                  booking.status !==
                    "No Show" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            booking.booking_id,
                            "No Show"
                          )
                        }
                        disabled={
                          updatingStatus
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-orange-200 px-4 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Mark No Show
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            booking.booking_id,
                            "Cancelled"
                          )
                        }
                        disabled={
                          updatingStatus
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel Booking
                      </button>
                    </>
                  )}

                <button
                  type="button"
                  onClick={() =>
                    onEdit(booking)
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D9E9E7] px-4 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#08A6A0]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Booking
                </button>
              </div>
            </section>

            <div className="flex justify-end border-t border-[#EAF2F0] pt-5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ADD / EDIT BOOKING MODAL
   ========================================================= */

const AddBookingModal = ({
  form,
  error,
  editing,
  onChange,
  onSubmit,
  onClose,
  patients = [],
  doctors = [],
  services = [],
  staffOptions = [],
  submitting = false,
  totalFee = 0,
}) => {
  const serviceStaff =
    staffOptions.filter(
      isServiceStaff
    );

  const availableStaff =
    serviceStaff.length > 0
      ? serviceStaff
      : staffOptions.filter(
          (staff) =>
            !isDoctor(staff)
        );

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#073F42]/40 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-[#EAF2F0] p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#08A6A0]">
                BOOKING MANAGEMENT
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#073F42]">
                {editing
                  ? "Edit Booking"
                  : "Create New Booking"}
              </h2>

              <p className="mt-1 text-xs text-[#819596]">
                Select the patient and choose the type of healthcare required.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#819596] transition hover:bg-[#F5FAF9] hover:text-[#073F42]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* FORM */}

          <form
            onSubmit={onSubmit}
            className="max-h-[82vh] overflow-y-auto p-4 sm:p-6"
          >
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* =================================================
                SECTION 1: BOOKING IDENTIFICATION
                ================================================= */}

            <FormSection
              icon={CalendarDays}
              title="Booking Identification"
              description="The booking number is generated automatically."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Booking Number"
                  required
                  value={
                    form.booking_number
                  }
                  onChange={() => {}}
                  placeholder="Automatically generated"
                  readOnly
                />

                <FormSelect
                  label="Priority"
                  value={
                    form.priority
                  }
                  onChange={(value) =>
                    onChange(
                      "priority",
                      value
                    )
                  }
                  options={
                    priorityOptions
                  }
                />
              </div>
            </FormSection>

            {/* =================================================
                SECTION 2: PATIENT
                ================================================= */}

            <FormSection
              icon={UserRound}
              title="Patient Information"
              description="Choose whether this is an existing registered patient or a new unregistered patient."
            >
              <div className="space-y-4">
                <div>
                  <span className="mb-2 block text-xs font-bold text-[#708789]">
                    Patient Type
                  </span>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {patientTypeOptions.map(
                      (option) => {
                        const active =
                          form.patient_type ===
                          option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              onChange(
                                "patient_type",
                                option
                              )
                            }
                            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                              active
                                ? "border-[#08A6A0] bg-[#E8F8F6]"
                                : "border-[#D9E9E7] bg-white hover:border-[#08A6A0]"
                            }`}
                          >
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                active
                                  ? "bg-white text-[#08A6A0]"
                                  : "bg-[#F5FAF9] text-[#819596]"
                              }`}
                            >
                              {option ===
                              "Registered Patient" ? (
                                <UserCheck className="h-4 w-4" />
                              ) : (
                                <UserPlus className="h-4 w-4" />
                              )}
                            </div>

                            <div>
                              <p
                                className={`text-sm font-bold ${
                                  active
                                    ? "text-[#073F42]"
                                    : "text-[#31585A]"
                                }`}
                              >
                                {option}
                              </p>

                              <p className="mt-0.5 text-[11px] text-[#819596]">
                                {option ===
                                "Registered Patient"
                                  ? "Use an existing patient record"
                                  : "Create booking without an existing patient record"}
                              </p>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {form.patient_type ===
                "Registered Patient" ? (
                  <FormSelect
                    label="Registered Patient"
                    required
                    value={
                      form.patient_id
                    }
                    onChange={(value) =>
                      onChange(
                        "patient_id",
                        value
                      )
                    }
                    options={
                      patients
                    }
                    placeholder={
                      patients.length
                        ? "Select registered patient"
                        : "No registered patients available"
                    }
                    optionValue="id"
                    optionLabel="name"
                  />
                ) : (
                  <div className="rounded-2xl border border-[#D9E9E7] bg-[#FAFDFC] p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-[#08A6A0]" />

                      <div>
                        <p className="text-sm font-bold text-[#073F42]">
                          New Patient Details
                        </p>

                        <p className="text-xs text-[#819596]">
                          These details will be associated with this booking.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="Patient Name"
                        required
                        value={
                          form.patient_name
                        }
                        onChange={(value) =>
                          onChange(
                            "patient_name",
                            value
                          )
                        }
                        placeholder="Enter patient name"
                      />

                      <FormField
                        label="Phone Number"
                        required
                        type="tel"
                        value={
                          form.patient_phone
                        }
                        onChange={(value) =>
                          onChange(
                            "patient_phone",
                            value
                          )
                        }
                        placeholder="Enter phone number"
                      />

                      <FormField
                        label="Email"
                        type="email"
                        value={
                          form.patient_email
                        }
                        onChange={(value) =>
                          onChange(
                            "patient_email",
                            value
                          )
                        }
                        placeholder="Optional email"
                      />

                      <FormField
                        label="Address"
                        value={
                          form.patient_address
                        }
                        onChange={(value) =>
                          onChange(
                            "patient_address",
                            value
                          )
                        }
                        placeholder="Enter patient address"
                      />
                    </div>
                  </div>
                )}
              </div>
            </FormSection>

            {/* =================================================
                SECTION 3: PURPOSE
                ================================================= */}

            <FormSection
              icon={Activity}
              title="Healthcare Requirement"
              description="Choose what the patient wants from the hospital."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {bookingCategoryOptions.map(
                  (option) => {
                    const active =
                      form.booking_category ===
                      option;

                    const home =
                      option ===
                      "Home Healthcare Service";

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          onChange(
                            "booking_category",
                            option
                          )
                        }
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                          active
                            ? "border-[#08A6A0] bg-[#E8F8F6]"
                            : "border-[#D9E9E7] bg-white hover:border-[#08A6A0]"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            active
                              ? "bg-white text-[#08A6A0]"
                              : "bg-[#F5FAF9] text-[#819596]"
                          }`}
                        >
                          {home ? (
                            <Home className="h-5 w-5" />
                          ) : (
                            <Stethoscope className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <p
                            className={`text-sm font-bold ${
                              active
                                ? "text-[#073F42]"
                                : "text-[#31585A]"
                            }`}
                          >
                            {option}
                          </p>

                          <p className="mt-0.5 text-xs text-[#819596]">
                            {home
                              ? "Staff visits the patient at home"
                              : "Patient visits the hospital for a doctor consultation"}
                          </p>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </FormSection>

            {/* =================================================
                CONSULTATION FORM
                ================================================= */}

            {form.booking_category ===
              "Checkup / Consultation" && (
              <FormSection
                icon={Stethoscope}
                title="Consultation Details"
                description="Schedule the patient's checkup or doctor consultation."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormSelect
                    label="Doctor"
                    required
                    value={
                      form.doctor_id
                    }
                    onChange={(value) =>
                      onChange(
                        "doctor_id",
                        value
                      )
                    }
                    options={doctors}
                    placeholder={
                      doctors.length
                        ? "Select doctor"
                        : "No doctors available"
                    }
                    optionValue="id"
                    optionLabel="name"
                  />

                  <FormField
                    label="Consultation Fee"
                    type="number"
                    min="0"
                    value={
                      form.consultation_fee
                    }
                    onChange={(value) =>
                      onChange(
                        "consultation_fee",
                        value
                      )
                    }
                    placeholder="Enter consultation fee"
                  />

                  <FormField
                    label="Consultation Date"
                    required
                    type="date"
                    value={
                      form.consultation_date
                    }
                    onChange={(value) =>
                      onChange(
                        "consultation_date",
                        value
                      )
                    }
                  />

                  <FormField
                    label="Consultation Time"
                    required
                    type="time"
                    value={
                      form.consultation_time
                    }
                    onChange={(value) =>
                      onChange(
                        "consultation_time",
                        value
                      )
                    }
                  />
                </div>
              </FormSection>
            )}

            {/* =================================================
                HOME SERVICE FORM
                ================================================= */}

            {form.booking_category ===
              "Home Healthcare Service" && (
              <>
                <FormSection
                  icon={Home}
                  title="Home Healthcare Service"
                  description="Select the service and assign the staff member who will visit the patient."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormSelect
                      label="Service"
                      required
                      value={
                        form.service_id
                      }
                      onChange={(value) =>
                        onChange(
                          "service_id",
                          value
                        )
                      }
                      options={
                        services
                      }
                      placeholder={
                        services.length
                          ? "Select home service"
                          : "No services available"
                      }
                      optionValue="id"
                      optionLabel="name"
                    />

                    <FormSelect
                      label="Assigned Staff"
                      required
                      value={
                        form.assigned_staff_id
                      }
                      onChange={(value) =>
                        onChange(
                          "assigned_staff_id",
                          value
                        )
                      }
                      options={
                        availableStaff
                      }
                      placeholder={
                        availableStaff.length
                          ? "Select nurse / caretaker / attendant"
                          : "No service staff available"
                      }
                      optionValue="id"
                      optionLabel="name"
                    />

                    <FormField
                      label="Duration"
                      required
                      type="number"
                      min="1"
                      value={
                        form.service_duration
                      }
                      onChange={(value) =>
                        onChange(
                          "service_duration",
                          value
                        )
                      }
                      placeholder="e.g. 5"
                    />

                    <FormSelect
                      label="Duration Unit"
                      value={
                        form.service_duration_unit
                      }
                      onChange={(value) =>
                        onChange(
                          "service_duration_unit",
                          value
                        )
                      }
                      options={[
                        "Hours",
                        "Days",
                        "Weeks",
                        "Months",
                      ]}
                    />

                    <FormSelect
                      label="Pricing Type"
                      value={
                        form.service_pricing_type
                      }
                      onChange={(value) =>
                        onChange(
                          "service_pricing_type",
                          value
                        )
                      }
                      options={[
                        "Per Hour",
                        "Per Day",
                        "Per Visit",
                        "Per Week",
                        "Monthly",
                        "Fixed Package",
                      ]}
                    />

                    <FormField
                      label="Rate / Fee"
                      required
                      type="number"
                      min="0"
                      value={
                        form.service_rate
                      }
                      onChange={(value) =>
                        onChange(
                          "service_rate",
                          value
                        )
                      }
                      placeholder="Enter service rate"
                    />

                    <FormField
                      label="Service Start Date"
                      required
                      type="date"
                      value={
                        form.service_start_date
                      }
                      onChange={(value) =>
                        onChange(
                          "service_start_date",
                          value
                        )
                      }
                    />

                    <FormField
                      label="Service End Date"
                      required
                      type="date"
                      value={
                        form.service_end_date
                      }
                      onChange={(value) =>
                        onChange(
                          "service_end_date",
                          value
                        )
                      }
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-[#D5F0ED] bg-[#E8F8F6] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#087F7A]">
                          Estimated Total
                        </p>

                        <p className="mt-1 text-xs text-[#4D7778]">
                          Based on the selected rate, pricing type, and duration.
                        </p>
                      </div>

                      <p className="shrink-0 text-xl font-bold text-[#073F42]">
                        ₹
                        {Number(
                          totalFee || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </FormSection>

                {/* ADDRESS */}

                <FormSection
                  icon={MapPin}
                  title="Service Location"
                  description="The assigned staff member will provide the service at this address."
                >
                  <div className="space-y-4">
                    <FormSelect
                      label="Service Address"
                      required
                      value={
                        form.service_location_type
                      }
                      onChange={(value) =>
                        onChange(
                          "service_location_type",
                          value
                        )
                      }
                      options={
                        addressTypeOptions
                      }
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="Address"
                        required
                        value={
                          form.service_address
                        }
                        onChange={(value) =>
                          onChange(
                            "service_address",
                            value
                          )
                        }
                        placeholder="House / road / locality"
                      />

                      <FormField
                        label="Area"
                        value={
                          form.service_area
                        }
                        onChange={(value) =>
                          onChange(
                            "service_area",
                            value
                          )
                        }
                        placeholder="Area / locality"
                      />

                      <FormField
                        label="City"
                        value={
                          form.service_city
                        }
                        onChange={(value) =>
                          onChange(
                            "service_city",
                            value
                          )
                        }
                        placeholder="City"
                      />

                      <FormField
                        label="Pincode"
                        type="text"
                        value={
                          form.service_pincode
                        }
                        onChange={(value) =>
                          onChange(
                            "service_pincode",
                            value
                          )
                        }
                        placeholder="Pincode"
                      />

                      <div className="sm:col-span-2">
                        <FormField
                          label="Landmark"
                          value={
                            form.service_landmark
                          }
                          onChange={(value) =>
                            onChange(
                              "service_landmark",
                              value
                            )
                          }
                          placeholder="Nearby landmark, optional"
                        />
                      </div>
                    </div>
                  </div>
                </FormSection>
              </>
            )}

            {/* =================================================
                COMMON INFORMATION
                ================================================= */}

            <FormSection
              icon={FileText}
              title="Additional Information"
              description="Add the reason, status, payment information, and internal notes."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormSelect
                  label="Booking Status"
                  value={form.status}
                  onChange={(value) =>
                    onChange(
                      "status",
                      value
                    )
                  }
                  options={[
                    "Scheduled",
                    "Confirmed",
                    "Completed",
                    "Cancelled",
                    "No Show",
                  ]}
                />

                <FormSelect
                  label="Payment Status"
                  value={
                    form.payment_status
                  }
                  onChange={(value) =>
                    onChange(
                      "payment_status",
                      value
                    )
                  }
                  options={
                    paymentStatusOptions
                  }
                />

                <div className="sm:col-span-2">
                  <label>
                    <span className="mb-1.5 block text-xs font-bold text-[#708789]">
                      Reason for Booking
                    </span>

                    <textarea
                      value={
                        form.reason
                      }
                      onChange={(
                        event
                      ) =>
                        onChange(
                          "reason",
                          event.target
                            .value
                        )
                      }
                      rows={3}
                      placeholder="Enter the reason for the booking..."
                      className="w-full resize-none rounded-xl border border-[#D9E9E7] bg-white px-3 py-3 text-sm text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                    />
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label>
                    <span className="mb-1.5 block text-xs font-bold text-[#708789]">
                      Booking Notes
                    </span>

                    <textarea
                      value={
                        form.notes
                      }
                      onChange={(
                        event
                      ) =>
                        onChange(
                          "notes",
                          event.target
                            .value
                        )
                      }
                      rows={3}
                      placeholder="Add booking notes..."
                      className="w-full resize-none rounded-xl border border-[#D9E9E7] bg-white px-3 py-3 text-sm text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                    />
                  </label>
                </div>

                <FormSelect
                  label="Created By"
                  value={
                    form.created_by
                  }
                  onChange={(value) =>
                    onChange(
                      "created_by",
                      value
                    )
                  }
                  options={
                    staffOptions
                  }
                  placeholder="Select staff"
                  optionValue="id"
                  optionLabel="name"
                />
              </div>
            </FormSection>

            {/* =================================================
                BUTTONS
                ================================================= */}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#EAF2F0] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="h-11 rounded-xl border border-[#D9E9E7] px-5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 text-sm font-semibold text-white transition hover:bg-[#078F8A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CalendarDays className="h-4 w-4" />
                )}

                {submitting
                  ? "Saving..."
                  : editing
                  ? "Update Booking"
                  : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FORM SECTION
   ========================================================= */

const FormSection = ({
  icon: Icon,
  title,
  description,
  children,
}) => {
  return (
    <section className="mb-5 rounded-2xl border border-[#E2EFED] bg-white">
      <div className="border-b border-[#EAF2F0] bg-[#FAFDFC] px-4 py-3.5 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
            <Icon className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#073F42]">
              {title}
            </h3>

            {description && (
              <p className="mt-0.5 text-xs leading-5 text-[#819596]">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {children}
      </div>
    </section>
  );
};

/* =========================================================
   FORM FIELD
   ========================================================= */

const FormField = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly = false,
  min,
}) => {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        min={min}
        value={value ?? ""}
        readOnly={readOnly}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border border-[#D9E9E7] px-3 text-sm text-[#173F41] outline-none placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10 ${
          readOnly
            ? "cursor-not-allowed bg-[#F5FAF9] font-semibold text-[#31585A]"
            : "bg-white"
        }`}
      />
    </label>
  );
};

/* =========================================================
   FORM SELECT
   ========================================================= */

const FormSelect = ({
  label,
  required,
  value,
  onChange,
  options = [],
  placeholder,
  optionValue = null,
  optionLabel = null,
}) => {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <select
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-11 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => {
          const valueToUse =
            optionValue
              ? option[
                  optionValue
                ]
              : option;

          const labelToUse =
            optionLabel
              ? option[
                  optionLabel
                ]
              : option;

          return (
            <option
              key={valueToUse}
              value={valueToUse}
            >
              {labelToUse}
              {option?.role
                ? ` • ${option.role}`
                : ""}
            </option>
          );
        })}
      </select>
    </label>
  );
};

/* =========================================================
   FILTER SELECT
   ========================================================= */

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold text-[#708789]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-10 w-full rounded-xl border border-[#D9E9E7] bg-white px-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>
    </label>
  );
};

/* =========================================================
   SECTION TITLE
   ========================================================= */

const SectionTitle = ({
  title,
}) => {
  return (
    <h3 className="text-sm font-bold text-[#073F42]">
      {title}
    </h3>
  );
};

/* =========================================================
   DETAIL ITEM
   ========================================================= */

const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-[#FAFDFC] p-3">
      <Icon className="h-4 w-4 text-[#08A6A0]" />

      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#9AAEAF]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#31585A]">
        {value || "-"}
      </p>
    </div>
  );
};

/* =========================================================
   SMALL DETAIL
   ========================================================= */

const SmallDetail = ({
  label,
  value,
}) => {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9AAEAF]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#31585A]">
        {value || "-"}
      </p>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
   ========================================================= */

const EmptyState = ({
  onClear,
}) => {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6]">
        <CalendarDays className="h-6 w-6 text-[#08A6A0]" />
      </div>

      <h3 className="mt-4 font-bold text-[#073F42]">
        No bookings found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#819596]">
        No bookings match the current search or filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 text-sm font-semibold text-[#08A6A0] hover:text-[#078F8A]"
      >
        Clear filters
      </button>
    </div>
  );
};

/* =========================================================
   HELPERS
   ========================================================= */

const getInitials = (
  name = ""
) => {
  return name
    .split(" ")
    .filter(Boolean)
    .map(
      (part) => part[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (
  date
) => {
  if (!date) return "-";

  const parsed = new Date(
    `${date}T00:00:00`
  );

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatTime = (
  time
) => {
  if (!time) return "-";

  const [
    hours,
    minutes,
  ] = String(time).split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
};

export default Booking;