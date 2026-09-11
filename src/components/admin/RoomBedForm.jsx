import { useState, useEffect } from "react";
import {
  Bed,
  Building2,
  DoorOpen,
  Layers,
  Plus,
  UserRound,
  X,
} from "lucide-react";

const wardsList = [
  "General Ward",
  "Private Ward",
  "ICU",
  "CCU",
  "Emergency",
  "Maternity Ward",
  "Pediatric Ward",
  "Post-Op Ward",
];

const roomTypesList = [
  "General",
  "Private",
  "Semi-Private",
  "ICU",
  "Deluxe",
];

const floorsList = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
  "5th Floor",
];

const bedStatuses = [
  "Available",
  "Occupied",
  "Reserved",
  "Maintenance",
];

export default function RoomBedForm({
  open,
  rooms = [],
  onClose,
  onAddRoom,
  onAddBed,
  initialMode = "room",
}) {
  const [mode, setMode] = useState(initialMode); // "room" | "bed"

  // Room state
  const [roomNumber, setRoomNumber] = useState("");
  const [ward, setWard] = useState(wardsList[0]);
  const [roomType, setRoomType] = useState(roomTypesList[0]);
  const [floor, setFloor] = useState(floorsList[1]);
  const [initialBedCount, setInitialBedCount] = useState(2);

  // Bed state
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || "");
  const [bedNumber, setBedNumber] = useState("");
  const [bedStatus, setBedStatus] = useState("Available");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError("");
      // Reset defaults
      setRoomNumber("");
      setWard(wardsList[0]);
      setRoomType(roomTypesList[0]);
      setFloor(floorsList[1]);
      setInitialBedCount(2);

      if (rooms.length > 0) {
        setSelectedRoomId(rooms[0].id);
        const nextBedNum = (rooms[0].beds?.length || 0) + 1;
        setBedNumber(`Bed ${nextBedNum}`);
      } else {
        setBedNumber("Bed 1");
      }
      setBedStatus("Available");
      setPatientName("");
      setPatientId("");
      setAdmissionDate(new Date().toISOString().slice(0, 10));
    }
  }, [open, initialMode, rooms]);

  // When selected room changes in "bed" mode, auto suggest bed number
  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId);
    const targetRoom = rooms.find((r) => r.id === roomId);
    if (targetRoom) {
      const nextBedNum = (targetRoom.beds?.length || 0) + 1;
      setBedNumber(`Bed ${nextBedNum}`);
    }
  };

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "room") {
      if (!roomNumber.trim()) {
        setError("Please enter a room number (e.g. 103, ICU-2).");
        return;
      }

      // Check for duplicate room number
      const duplicate = rooms.some(
        (r) => r.roomNumber.toLowerCase() === roomNumber.trim().toLowerCase()
      );
      if (duplicate) {
        setError(`Room "${roomNumber.trim()}" already exists. Please choose a different number.`);
        return;
      }

      const bedCount = Math.max(1, Math.min(16, Number(initialBedCount) || 1));
      const newRoomId = `R-${roomNumber.trim().replace(/\s+/g, "-")}`;

      const generatedBeds = Array.from({ length: bedCount }, (_, i) => ({
        id: `B-${roomNumber.trim().replace(/\s+/g, "-")}-${i + 1}`,
        number: `Bed ${i + 1}`,
        status: "Available",
        patient: null,
        patientId: null,
        admissionDate: null,
      }));

      const newRoom = {
        id: newRoomId,
        roomNumber: roomNumber.trim(),
        ward,
        roomType,
        floor,
        beds: generatedBeds,
      };

      onAddRoom(newRoom);
      onClose();
    } else {
      // Add Bed
      if (!selectedRoomId) {
        setError("Please select a room to add the bed into.");
        return;
      }
      if (!bedNumber.trim()) {
        setError("Please enter a bed number / name (e.g. Bed 3).");
        return;
      }

      const targetRoom = rooms.find((r) => r.id === selectedRoomId);
      if (!targetRoom) {
        setError("Selected room not found.");
        return;
      }

      // Check duplicate bed in the same room
      const duplicateBed = targetRoom.beds.some(
        (b) => b.number.toLowerCase() === bedNumber.trim().toLowerCase()
      );
      if (duplicateBed) {
        setError(`"${bedNumber.trim()}" already exists in Room ${targetRoom.roomNumber}.`);
        return;
      }

      const nextBedIndex = (targetRoom.beds?.length || 0) + 1;
      const newBedId = `B-${targetRoom.roomNumber}-${nextBedIndex}-${Date.now().toString().slice(-4)}`;

      const newBed = {
        id: newBedId,
        number: bedNumber.trim(),
        status: bedStatus,
        patient: bedStatus === "Occupied" ? patientName.trim() || "Assigned Patient" : null,
        patientId: bedStatus === "Occupied" ? patientId.trim() || `P-${Date.now().toString().slice(-4)}` : null,
        admissionDate: bedStatus === "Occupied" ? admissionDate : null,
      };

      onAddBed(selectedRoomId, newBed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/40 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl transition">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2EFED] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              {mode === "room" ? <DoorOpen size={20} /> : <Bed size={20} />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#073F42]">
                {mode === "room" ? "Add New Room" : "Add Bed to Room"}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#819596]">
                Configure hospital room layout and beds
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 sm:p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0] transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#E2EFED] bg-[#F7FBFA] p-1.5 sm:p-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setMode("room");
              setError("");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs sm:text-sm font-bold transition ${
              mode === "room"
                ? "bg-white text-[#08A6A0] shadow-sm"
                : "text-[#819596] hover:text-[#073F42]"
            }`}
          >
            <DoorOpen size={15} />
            Add Room
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("bed");
              setError("");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs sm:text-sm font-bold transition ${
              mode === "bed"
                ? "bg-white text-[#08A6A0] shadow-sm"
                : "text-[#819596] hover:text-[#073F42]"
            }`}
          >
            <Bed size={15} />
            Add Bed
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
                {error}
              </div>
            )}

            {mode === "room" ? (
              /* ================= ADD ROOM FIELDS ================= */
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#31585A]">
                    Room Number / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 103, 204, ICU-2"
                    className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3.5 text-xs sm:text-sm text-[#073F42] outline-none transition placeholder:text-[#A0B1B2] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#31585A]">
                      Ward
                    </label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#073F42] outline-none focus:border-[#08A6A0]"
                    >
                      {wardsList.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#31585A]">
                      Room Type
                    </label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#073F42] outline-none focus:border-[#08A6A0]"
                    >
                      {roomTypesList.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#31585A]">
                      Floor
                    </label>
                    <select
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#073F42] outline-none focus:border-[#08A6A0]"
                    >
                      {floorsList.map((fl) => (
                        <option key={fl} value={fl}>
                          {fl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#31585A]">
                      Initial Beds Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      value={initialBedCount}
                      onChange={(e) => setInitialBedCount(e.target.value)}
                      className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3.5 text-xs sm:text-sm text-[#073F42] outline-none focus:border-[#08A6A0]"
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-[#F7FBFA] p-3 border border-[#E2EFED] text-[11px] text-[#819596]">
                  Creating this room will automatically initialize{" "}
                  <strong className="text-[#073F42]">{initialBedCount}</strong> available bed(s) numbered Bed 1 through Bed {initialBedCount}.
                </div>
              </>
            ) : (
              /* ================= ADD BED FIELDS ================= */
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#31585A]">
                    Target Room <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => handleSelectRoom(e.target.value)}
                    className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#073F42] outline-none focus:border-[#08A6A0]"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} ({r.ward} - {r.beds.length} beds)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#31585A]">
                      Bed Number / Label <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bedNumber}
                      onChange={(e) => setBedNumber(e.target.value)}
                      placeholder="e.g. Bed 5"
                      className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3.5 text-xs sm:text-sm text-[#073F42] outline-none focus:border-[#08A6A0]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#31585A]">
                      Initial Status
                    </label>
                    <select
                      value={bedStatus}
                      onChange={(e) => setBedStatus(e.target.value)}
                      className="h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 text-xs sm:text-sm text-[#073F42] outline-none focus:border-[#08A6A0]"
                    >
                      {bedStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {bedStatus === "Occupied" && (
                  <div className="space-y-3 rounded-xl bg-[#F7FBFA] p-3.5 border border-[#E2EFED]">
                    <p className="text-xs font-bold text-[#073F42]">Patient Details (Optional)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold text-[#819596]">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="h-9 w-full rounded-lg border border-[#D9E9E7] bg-white px-3 text-xs text-[#073F42] outline-none focus:border-[#08A6A0]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold text-[#819596]">
                          Patient ID
                        </label>
                        <input
                          type="text"
                          value={patientId}
                          onChange={(e) => setPatientId(e.target.value)}
                          placeholder="e.g. P-1025"
                          className="h-9 w-full rounded-lg border border-[#D9E9E7] bg-white px-3 text-xs text-[#073F42] outline-none focus:border-[#08A6A0]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[#E2EFED] px-4 py-3 sm:px-6 sm:py-4 bg-[#FBFDFD]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 sm:h-11 rounded-xl border border-[#D9E9E7] px-4 text-xs sm:text-sm font-semibold text-[#527071] transition hover:bg-white hover:border-[#9FCAC6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 sm:h-11 items-center justify-center gap-1.5 rounded-xl bg-[#08A6A0] px-5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#078F8A]"
            >
              <Plus size={16} />
              {mode === "room" ? "Add Room" : "Add Bed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
