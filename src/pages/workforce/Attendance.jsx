import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  X,
  AlertCircle,
} from "lucide-react";

import {
  getWorkforceAttendance,
  getWorkforceUser,
} from "../../data/workforceData";

const CURRENT_DATE = "2026-09-10";

const Attendance = () => {
  // --------------------------------------------------
  // Current workforce user
  // --------------------------------------------------

  const user = getWorkforceUser("EMP-1001");

  const employeeId = user?.employeeId || "EMP-1001";

  // --------------------------------------------------
  // Attendance data
  // --------------------------------------------------

  const initialAttendance = getWorkforceAttendance(employeeId) || [];

  const [attendanceRecords, setAttendanceRecords] =
    useState(initialAttendance);

  // --------------------------------------------------
  // Today's attendance
  // --------------------------------------------------

  const [todayAttendance, setTodayAttendance] = useState(() => {
    return (
      initialAttendance.find(
        (record) => record.date === CURRENT_DATE
      ) || {
        date: CURRENT_DATE,
        employeeId,
        checkIn: null,
        checkOut: null,
        status: "Not Marked",
      }
    );
  });

  // --------------------------------------------------
  // Camera states
  // --------------------------------------------------

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // --------------------------------------------------
  // Filter
  // --------------------------------------------------

  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  // --------------------------------------------------
  // Notification
  // --------------------------------------------------

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // --------------------------------------------------
  // Format time
  // --------------------------------------------------

  const formatTime = (time) => {
    if (!time) {
      return "--";
    }

    return time;
  };

  // --------------------------------------------------
  // Calculate working hours
  // --------------------------------------------------

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) {
      return "--";
    }

    const [inHour, inMinute] = convertTo24Hour(checkIn);
    const [outHour, outMinute] = convertTo24Hour(checkOut);

    const startMinutes = inHour * 60 + inMinute;
    const endMinutes = outHour * 60 + outMinute;

    let difference = endMinutes - startMinutes;

    if (difference < 0) {
      difference += 24 * 60;
    }

    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;

    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  };

  // --------------------------------------------------
  // Convert 12 hour time to 24 hour
  // --------------------------------------------------

  const convertTo24Hour = (time) => {
    const [value, modifier] = time.split(" ");

    let [hours, minutes] = value.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return [hours, minutes];
  };

  // --------------------------------------------------
  // Current date
  // --------------------------------------------------

  const formattedDate = new Date(
    `${CURRENT_DATE}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // --------------------------------------------------
  // Open camera
  // --------------------------------------------------

  const openCamera = async (mode) => {
    setCameraMode(mode);
    setCameraError("");
    setCameraReady(false);
    setCameraOpen(true);

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (error) {
      console.error("Camera error:", error);

      setCameraError(
        "Unable to access your camera. Please allow camera permission and try again."
      );
    }
  };

  // --------------------------------------------------
  // Close camera
  // --------------------------------------------------

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
    setCameraMode(null);
    setCameraError("");
    setCameraReady(false);
    setProcessing(false);
  };

  // --------------------------------------------------
  // Cleanup camera
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // --------------------------------------------------
  // Capture face
  // --------------------------------------------------

  const captureFace = async () => {
    if (!videoRef.current || !cameraReady) {
      return;
    }

    setProcessing(true);
    setMessage("");

    /*
      Frontend demo:

      The camera frame would normally be captured here
      and sent to your FastAPI backend.

      Example future flow:

      video frame
          ↓
      canvas
          ↓
      image/blob
          ↓
      FastAPI
          ↓
      face verification
          ↓
      attendance saved
    */

    await new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });

    const currentTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (cameraMode === "check-in") {
      handleCheckIn(currentTime);
    }

    if (cameraMode === "check-out") {
      handleCheckOut(currentTime);
    }

    closeCamera();
  };

  // --------------------------------------------------
  // Check In
  // --------------------------------------------------

  const handleCheckIn = (time) => {
    if (todayAttendance.checkIn) {
      showMessage(
        "You have already checked in today.",
        "error"
      );

      return;
    }

    const updatedRecord = {
      ...todayAttendance,
      date: CURRENT_DATE,
      employeeId,
      checkIn: time,
      checkOut: null,
      status: "Present",
    };

    setTodayAttendance(updatedRecord);

    setAttendanceRecords((previous) => {
      const existing = previous.find(
        (record) => record.date === CURRENT_DATE
      );

      if (existing) {
        return previous.map((record) =>
          record.date === CURRENT_DATE
            ? updatedRecord
            : record
        );
      }

      return [updatedRecord, ...previous];
    });

    showMessage(
      `Face verified successfully. Check-in recorded at ${time}.`,
      "success"
    );
  };

  // --------------------------------------------------
  // Check Out
  // --------------------------------------------------

  const handleCheckOut = (time) => {
    if (!todayAttendance.checkIn) {
      showMessage(
        "Please complete your check-in first.",
        "error"
      );

      return;
    }

    if (todayAttendance.checkOut) {
      showMessage(
        "You have already checked out today.",
        "error"
      );

      return;
    }

    const updatedRecord = {
      ...todayAttendance,
      checkOut: time,
      status: "Completed",
    };

    setTodayAttendance(updatedRecord);

    setAttendanceRecords((previous) => {
      return previous.map((record) =>
        record.date === CURRENT_DATE
          ? updatedRecord
          : record
      );
    });

    showMessage(
      `Face verified successfully. Check-out recorded at ${time}.`,
      "success"
    );
  };

  // --------------------------------------------------
  // Message
  // --------------------------------------------------

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // --------------------------------------------------
  // Filter attendance
  // --------------------------------------------------

  const filteredAttendance = useMemo(() => {
    return attendanceRecords.filter((record) => {
      return record.date?.startsWith(selectedMonth);
    });
  }, [attendanceRecords, selectedMonth]);

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const presentDays = filteredAttendance.filter(
    (record) =>
      record.status === "Present" ||
      record.status === "Completed"
  ).length;

  const completedDays = filteredAttendance.filter(
    (record) => record.checkIn && record.checkOut
  ).length;

  const totalWorkingMinutes = filteredAttendance.reduce(
    (total, record) => {
      if (!record.checkIn || !record.checkOut) {
        return total;
      }

      const [inHour, inMinute] = convertTo24Hour(
        record.checkIn
      );

      const [outHour, outMinute] = convertTo24Hour(
        record.checkOut
      );

      let minutes =
        outHour * 60 +
        outMinute -
        (inHour * 60 + inMinute);

      if (minutes < 0) {
        minutes += 24 * 60;
      }

      return total + minutes;
    },
    0
  );

  const totalWorkingHours = `${Math.floor(
    totalWorkingMinutes / 60
  )}h ${String(totalWorkingMinutes % 60).padStart(2, "0")}m`;

  // --------------------------------------------------
  // Status
  // --------------------------------------------------

  const getStatus = () => {
    if (todayAttendance.checkOut) {
      return {
        label: "Completed",
        className:
          "bg-[#E8F8F6] text-[#087F7B]",
      };
    }

    if (todayAttendance.checkIn) {
      return {
        label: "Working",
        className:
          "bg-[#FFF7E6] text-[#A66B00]",
      };
    }

    return {
      label: "Not Marked",
      className:
        "bg-[#F1F4F4] text-[#687A78]",
    };
  };

  const todayStatus = getStatus();

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#153B37] sm:text-2xl">
            Attendance
          </h2>

          <p className="mt-1 text-sm text-[#6B7F7B]">
            Mark your attendance using secure face verification.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#DDEBE8] bg-white px-3 py-2 text-sm text-[#55716E] shadow-sm">
          <CalendarDays className="h-4 w-4 text-[#08A6A0]" />

          <span>{formattedDate}</span>
        </div>
      </div>

      {/* =========================================
          MESSAGE
      ========================================== */}

      {message && (
        <div
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            messageType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-[#BFE5E1] bg-[#E8F8F6] text-[#087F7B]"
          }`}
        >
          {messageType === "error" ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          <span>{message}</span>
        </div>
      )}

      {/* =========================================
          TODAY ATTENDANCE
      ========================================== */}

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Face Attendance Card */}

        <div className="overflow-hidden rounded-2xl border border-[#DDEBE8] bg-white shadow-sm">
          <div className="border-b border-[#E8EFEE] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                <Camera className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-[#153B37]">
                  Face Attendance
                </h3>

                <p className="text-xs text-[#71837F]">
                  Verify your identity using the camera
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-2xl bg-[#F4F9F8] p-5 text-center sm:p-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                <UserCheck className="h-9 w-9" />
              </div>

              <h4 className="mt-5 text-lg font-semibold text-[#153B37]">
                Mark your attendance
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71837F]">
                Look directly at the camera and make sure
                your face is clearly visible before verifying
                your attendance.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={
                    Boolean(todayAttendance.checkIn)
                  }
                  onClick={() => openCamera("check-in")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#078F8A] disabled:cursor-not-allowed disabled:bg-[#B8CDCD]"
                >
                  <LogIn className="h-4 w-4" />
                  Face Check-In
                </button>

                <button
                  type="button"
                  disabled={
                    !todayAttendance.checkIn ||
                    Boolean(todayAttendance.checkOut)
                  }
                  onClick={() => openCamera("check-out")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#BFE5E1] bg-white px-5 py-3 text-sm font-semibold text-[#087F7B] transition hover:bg-[#E8F8F6] disabled:cursor-not-allowed disabled:border-[#DDEBE8] disabled:text-[#A7B7B4]"
                >
                  <LogOut className="h-4 w-4" />
                  Face Check-Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Status */}

        <div className="rounded-2xl border border-[#DDEBE8] bg-white shadow-sm">
          <div className="border-b border-[#E8EFEE] px-5 py-4 sm:px-6">
            <h3 className="font-semibold text-[#153B37]">
              Today's Attendance
            </h3>

            <p className="mt-1 text-xs text-[#71837F]">
              {formattedDate}
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {/* Status */}

            <div className="flex items-center justify-between rounded-xl bg-[#F7FAFA] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#08A6A0] shadow-sm">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-[#71837F]">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${todayStatus.className}`}
                  >
                    {todayStatus.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Check In */}

            <div className="flex items-center justify-between border-b border-[#EDF2F1] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
                  <LogIn className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs text-[#71837F]">
                    Check-In
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[#153B37]">
                    {formatTime(todayAttendance.checkIn)}
                  </p>
                </div>
              </div>

              {todayAttendance.checkIn && (
                <CheckCircle2 className="h-5 w-5 text-[#08A6A0]" />
              )}
            </div>

            {/* Check Out */}

            <div className="flex items-center justify-between border-b border-[#EDF2F1] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2F5F5] text-[#55716E]">
                  <LogOut className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs text-[#71837F]">
                    Check-Out
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[#153B37]">
                    {formatTime(todayAttendance.checkOut)}
                  </p>
                </div>
              </div>

              {todayAttendance.checkOut && (
                <CheckCircle2 className="h-5 w-5 text-[#08A6A0]" />
              )}
            </div>

            {/* Working Hours */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#71837F]">
                  Working Hours
                </p>

                <p className="mt-1 text-lg font-semibold text-[#153B37]">
                  {calculateWorkingHours(
                    todayAttendance.checkIn,
                    todayAttendance.checkOut
                  )}
                </p>
              </div>

              <ShieldCheck className="h-6 w-6 text-[#08A6A0]" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          MONTHLY SUMMARY
      ========================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#DDEBE8] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#71837F]">
            Present Days
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#153B37]">
            {presentDays}
          </p>
        </div>

        <div className="rounded-xl border border-[#DDEBE8] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#71837F]">
            Completed Days
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#153B37]">
            {completedDays}
          </p>
        </div>

        <div className="rounded-xl border border-[#DDEBE8] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#71837F]">
            Working Hours
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#153B37]">
            {totalWorkingHours}
          </p>
        </div>

        <div className="rounded-xl border border-[#DDEBE8] bg-white p-4 shadow-sm">
          <p className="text-xs text-[#71837F]">
            Attendance Rate
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#087F7B]">
            {filteredAttendance.length
              ? Math.round(
                  (presentDays /
                    filteredAttendance.length) *
                    100
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* =========================================
          ATTENDANCE HISTORY
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#DDEBE8] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#E8EFEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="font-semibold text-[#153B37]">
              Attendance History
            </h3>

            <p className="mt-1 text-xs text-[#71837F]">
              Review your previous attendance records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#08A6A0]" />

            <input
              type="month"
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(event.target.value)
              }
              className="rounded-lg border border-[#DDEBE8] bg-white px-3 py-2 text-sm text-[#315A57] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
            />
          </div>
        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-[#E8EFEE] bg-[#F8FAFA]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71837F]">
                  Date
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71837F]">
                  Check-In
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71837F]">
                  Check-Out
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71837F]">
                  Working Hours
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71837F]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <tr
                    key={`${record.employeeId}-${record.date}`}
                    className="border-b border-[#EDF2F1] last:border-0 hover:bg-[#FAFCFC]"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#153B37]">
                      {new Date(
                        `${record.date}T00:00:00`
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#55716E]">
                      {formatTime(record.checkIn)}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#55716E]">
                      {formatTime(record.checkOut)}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-[#315A57]">
                      {calculateWorkingHours(
                        record.checkIn,
                        record.checkOut
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          record.status === "Present"
                            ? "bg-[#E8F8F6] text-[#087F7B]"
                            : record.status === "Completed"
                            ? "bg-[#E8F8F6] text-[#087F7B]"
                            : record.status === "Absent"
                            ? "bg-red-50 text-red-600"
                            : "bg-[#F1F4F4] text-[#687A78]"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F6F5] text-[#7A918E]">
                      <CalendarDays className="h-5 w-5" />
                    </div>

                    <p className="mt-3 text-sm font-medium text-[#315A57]">
                      No attendance records
                    </p>

                    <p className="mt-1 text-xs text-[#71837F]">
                      There are no attendance records for
                      this month.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}

        <div className="space-y-3 p-4 md:hidden">
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((record) => (
              <div
                key={`${record.employeeId}-${record.date}`}
                className="rounded-xl border border-[#E3EEEC] bg-[#FAFCFC] p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#153B37]">
                      {new Date(
                        `${record.date}T00:00:00`
                      ).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      record.status === "Present" ||
                      record.status === "Completed"
                        ? "bg-[#E8F8F6] text-[#087F7B]"
                        : record.status === "Absent"
                        ? "bg-red-50 text-red-600"
                        : "bg-[#F1F4F4] text-[#687A78]"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-[11px] text-[#71837F]">
                      Check-In
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#315A57]">
                      {formatTime(record.checkIn)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3">
                    <p className="text-[11px] text-[#71837F]">
                      Check-Out
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#315A57]">
                      {formatTime(record.checkOut)}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-lg bg-white p-3">
                    <p className="text-[11px] text-[#71837F]">
                      Working Hours
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#315A57]">
                      {calculateWorkingHours(
                        record.checkIn,
                        record.checkOut
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F6F5] text-[#7A918E]">
                <CalendarDays className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-medium text-[#315A57]">
                No attendance records
              </p>

              <p className="mt-1 text-xs text-[#71837F]">
                There are no attendance records for this
                month.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          FACE CAMERA MODAL
      ========================================== */}

      {cameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-[#E8EFEE] px-5 py-4">
              <div>
                <h3 className="font-semibold text-[#153B37]">
                  Face{" "}
                  {cameraMode === "check-in"
                    ? "Check-In"
                    : "Check-Out"}
                </h3>

                <p className="mt-1 text-xs text-[#71837F]">
                  Position your face inside the frame
                </p>
              </div>

              <button
                type="button"
                onClick={closeCamera}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#55716E] transition hover:bg-[#E8F8F6] hover:text-[#153B37]"
                aria-label="Close camera"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Camera */}

            <div className="p-5">
              {cameraError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                  <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

                  <p className="mt-4 text-sm font-medium text-red-700">
                    Camera access required
                  </p>

                  <p className="mt-2 text-xs leading-5 text-red-600">
                    {cameraError}
                  </p>

                  <button
                    type="button"
                    onClick={() => openCamera(cameraMode)}
                    className="mt-5 flex mx-auto items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#102F31]">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />

                    {/* Face Frame */}

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="relative h-[65%] w-[48%] rounded-[45%] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.2)]">
                        <div className="absolute left-1/2 top-2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-[#08A6A0]" />
                      </div>
                    </div>

                    {!cameraReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#102F31]/80">
                        <div className="text-center text-white">
                          <Camera className="mx-auto h-8 w-8 animate-pulse" />

                          <p className="mt-3 text-sm">
                            Starting camera...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl bg-[#E8F8F6] px-4 py-3">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#08A6A0]" />

                      <div>
                        <p className="text-sm font-medium text-[#087F7B]">
                          Face verification
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#4D716D]">
                          Keep your face clearly visible and
                          look directly at the camera.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!cameraReady || processing}
                    onClick={captureFace}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#078F8A] disabled:cursor-not-allowed disabled:bg-[#AFC8C5]"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Verifying Face...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        Verify &{" "}
                        {cameraMode === "check-in"
                          ? "Check In"
                          : "Check Out"}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;