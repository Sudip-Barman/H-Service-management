import { useMemo, useState } from "react";
import {
  Bed,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  ClipboardList,
  Clock3,
  DoorOpen,
  Hospital,
  Info,
  LayoutGrid,
  Search,
  Settings2,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const initialRooms = [
  {
    id: "R-101",
    roomNumber: "101",
    ward: "General Ward",
    roomType: "General",
    floor: "1st Floor",
    beds: [
      {
        id: "B-101-1",
        number: "Bed 1",
        status: "Occupied",
        patient: "Rahul Das",
        patientId: "P-1001",
        admissionDate: "08 Sep 2026",
      },
      {
        id: "B-101-2",
        number: "Bed 2",
        status: "Available",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
      {
        id: "B-101-3",
        number: "Bed 3",
        status: "Occupied",
        patient: "Ananya Roy",
        patientId: "P-1002",
        admissionDate: "07 Sep 2026",
      },
      {
        id: "B-101-4",
        number: "Bed 4",
        status: "Maintenance",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
    ],
  },
  {
    id: "R-102",
    roomNumber: "102",
    ward: "General Ward",
    roomType: "General",
    floor: "1st Floor",
    beds: [
      {
        id: "B-102-1",
        number: "Bed 1",
        status: "Available",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
      {
        id: "B-102-2",
        number: "Bed 2",
        status: "Occupied",
        patient: "Suman Ghosh",
        patientId: "P-1003",
        admissionDate: "06 Sep 2026",
      },
      {
        id: "B-102-3",
        number: "Bed 3",
        status: "Reserved",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
      {
        id: "B-102-4",
        number: "Bed 4",
        status: "Available",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
    ],
  },
  {
    id: "R-201",
    roomNumber: "201",
    ward: "Private Ward",
    roomType: "Private",
    floor: "2nd Floor",
    beds: [
      {
        id: "B-201-1",
        number: "Bed 1",
        status: "Occupied",
        patient: "Priya Sharma",
        patientId: "P-1004",
        admissionDate: "05 Sep 2026",
      },
      {
        id: "B-201-2",
        number: "Bed 2",
        status: "Available",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
    ],
  },
  {
    id: "R-202",
    roomNumber: "202",
    ward: "Private Ward",
    roomType: "Private",
    floor: "2nd Floor",
    beds: [
      {
        id: "B-202-1",
        number: "Bed 1",
        status: "Reserved",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
      {
        id: "B-202-2",
        number: "Bed 2",
        status: "Available",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
    ],
  },
  {
    id: "R-301",
    roomNumber: "301",
    ward: "ICU",
    roomType: "ICU",
    floor: "3rd Floor",
    beds: [
      {
        id: "B-301-1",
        number: "Bed 1",
        status: "Occupied",
        patient: "Arindam Sen",
        patientId: "P-1005",
        admissionDate: "08 Sep 2026",
      },
      {
        id: "B-301-2",
        number: "Bed 2",
        status: "Occupied",
        patient: "Moumita Paul",
        patientId: "P-1006",
        admissionDate: "07 Sep 2026",
      },
    ],
  },
  {
    id: "R-302",
    roomNumber: "302",
    ward: "ICU",
    roomType: "ICU",
    floor: "3rd Floor",
    beds: [
      {
        id: "B-302-1",
        number: "Bed 1",
        status: "Available",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
      {
        id: "B-302-2",
        number: "Bed 2",
        status: "Maintenance",
        patient: null,
        patientId: null,
        admissionDate: null,
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                              STATUS CONFIG                                 */
/* -------------------------------------------------------------------------- */

const statusConfig = {
  Available: {
    label: "Available",
    icon: CheckCircle2,
    classes:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
    dot: "bg-emerald-500",
  },
  Occupied: {
    label: "Occupied",
    icon: UserRound,
    classes:
      "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300",
    dot: "bg-blue-500",
  },
  Reserved: {
    label: "Reserved",
    icon: Clock3,
    classes:
      "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300",
    dot: "bg-amber-500",
  },
  Maintenance: {
    label: "Maintenance",
    icon: Wrench,
    classes:
      "border-red-200 bg-red-50 text-red-700 hover:border-red-300",
    dot: "bg-red-500",
  },
};

const roomTypeStyles = {
  General: "bg-slate-100 text-slate-700",
  Private: "bg-purple-100 text-purple-700",
  ICU: "bg-red-100 text-red-700",
};

/* -------------------------------------------------------------------------- */
/*                              STAT CARD                                     */
/* -------------------------------------------------------------------------- */

function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              BED CARD                                      */
/* -------------------------------------------------------------------------- */

function BedCard({ bed, onClick }) {
  const config = statusConfig[bed.status];
  const StatusIcon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(bed)}
      className={`group w-full rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm ${config.classes}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-white/80 p-2">
            <Bed size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold">{bed.number}</p>
            <p className="text-[10px] opacity-75">{bed.id}</p>
          </div>
        </div>

        <StatusIcon size={17} />
      </div>

      <div className="mt-3 border-t border-current/10 pt-2">
        {bed.status === "Occupied" ? (
          <>
            <p className="truncate text-xs font-medium">{bed.patient}</p>
            <p className="mt-0.5 text-[10px] opacity-70">{bed.patientId}</p>
          </>
        ) : (
          <p className="text-xs font-medium">{bed.status}</p>
        )}
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ROOM CARD                                     */
/* -------------------------------------------------------------------------- */

function RoomCard({ room, onBedClick }) {
  const occupied = room.beds.filter(
    (bed) => bed.status === "Occupied"
  ).length;

  const available = room.beds.filter(
    (bed) => bed.status === "Available"
  ).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Room Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
            <DoorOpen size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Room {room.roomNumber}
              </h3>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  roomTypeStyles[room.roomType] ||
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {room.roomType}
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-slate-500">
              {room.ward} • {room.floor}
            </p>
          </div>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-xs font-semibold text-slate-700">
            {occupied}/{room.beds.length} occupied
          </p>
          <p className="text-[10px] text-emerald-600">
            {available} available
          </p>
        </div>
      </div>

      {/* Beds */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {room.beds.map((bed) => (
          <BedCard
            key={bed.id}
            bed={bed}
            onClick={onBedClick}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            MAIN COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function RoomBed() {
  const [rooms, setRooms] = useState(initialRooms);

  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [roomTypeFilter, setRoomTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBed, setSelectedBed] = useState(null);

  /* ------------------------------- STATS -------------------------------- */

  const stats = useMemo(() => {
    const beds = rooms.flatMap((room) => room.beds);

    return {
      rooms: rooms.length,
      beds: beds.length,
      available: beds.filter((bed) => bed.status === "Available").length,
      occupied: beds.filter((bed) => bed.status === "Occupied").length,
      reserved: beds.filter((bed) => bed.status === "Reserved").length,
      maintenance: beds.filter((bed) => bed.status === "Maintenance").length,
    };
  }, [rooms]);

  /* ------------------------------- FILTER -------------------------------- */

  const filteredRooms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rooms
      .map((room) => {
        const roomMatches =
          !query ||
          room.roomNumber.toLowerCase().includes(query) ||
          room.id.toLowerCase().includes(query) ||
          room.ward.toLowerCase().includes(query) ||
          room.roomType.toLowerCase().includes(query) ||
          room.beds.some(
            (bed) =>
              bed.id.toLowerCase().includes(query) ||
              bed.number.toLowerCase().includes(query) ||
              bed.patient?.toLowerCase().includes(query) ||
              bed.patientId?.toLowerCase().includes(query)
          );

        const wardMatches =
          wardFilter === "All" || room.ward === wardFilter;

        const roomTypeMatches =
          roomTypeFilter === "All" ||
          room.roomType === roomTypeFilter;

        if (!roomMatches || !wardMatches || !roomTypeMatches) {
          return null;
        }

        const filteredBeds =
          statusFilter === "All"
            ? room.beds
            : room.beds.filter(
                (bed) => bed.status === statusFilter
              );

        if (statusFilter !== "All" && filteredBeds.length === 0) {
          return null;
        }

        return {
          ...room,
          beds: filteredBeds,
        };
      })
      .filter(Boolean);
  }, [
    rooms,
    search,
    wardFilter,
    roomTypeFilter,
    statusFilter,
  ]);

  /* -------------------------- UPDATE BED STATUS -------------------------- */

  const updateBedStatus = (bedId, newStatus) => {
    setRooms((currentRooms) =>
      currentRooms.map((room) => ({
        ...room,
        beds: room.beds.map((bed) =>
          bed.id === bedId
            ? {
                ...bed,
                status: newStatus,
                patient:
                  newStatus === "Occupied"
                    ? bed.patient || "Patient not assigned"
                    : newStatus === "Available"
                    ? null
                    : bed.patient,
                patientId:
                  newStatus === "Occupied"
                    ? bed.patientId || "Pending"
                    : newStatus === "Available"
                    ? null
                    : bed.patientId,
              }
            : bed
        ),
      }))
    );

    setSelectedBed((current) =>
      current
        ? {
            ...current,
            status: newStatus,
            patient:
              newStatus === "Occupied"
                ? current.patient || "Patient not assigned"
                : newStatus === "Available"
                ? null
                : current.patient,
            patientId:
              newStatus === "Occupied"
                ? current.patientId || "Pending"
                : newStatus === "Available"
                ? null
                : current.patientId,
          }
        : null
    );
  };

  /* ------------------------------ OPTIONS -------------------------------- */

  const wards = ["All", ...new Set(rooms.map((room) => room.ward))];

  const roomTypes = [
    "All",
    ...new Set(rooms.map((room) => room.roomType)),
  ];

  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 lg:p-5">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <Hospital size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Room & Bed Management
              </h1>

              <p className="text-xs text-slate-500 sm:text-sm">
                Monitor room occupancy and manage bed availability
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
            <span className="font-semibold text-slate-800">
              {stats.occupied}
            </span>{" "}
            occupied of{" "}
            <span className="font-semibold text-slate-800">
              {stats.beds}
            </span>{" "}
            beds
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STAT CARDS                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Rooms"
          value={stats.rooms}
          icon={Building2}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Total Beds"
          value={stats.beds}
          icon={Bed}
          iconClass="bg-sky-50 text-sky-700"
        />

        <StatCard
          title="Available"
          value={stats.available}
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Occupied"
          value={stats.occupied}
          icon={CircleUserRound}
          iconClass="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Reserved"
          value={stats.reserved}
          icon={Clock3}
          iconClass="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Maintenance"
          value={stats.maintenance}
          icon={Wrench}
          iconClass="bg-red-50 text-red-700"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FILTER BAR                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room, bed, patient or ID..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Ward */}
          <div className="relative w-full xl:w-44">
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {wards.map((ward) => (
                <option key={ward} value={ward}>
                  {ward === "All" ? "All Wards" : ward}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Room Type */}
          <div className="relative w-full xl:w-40">
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Room Types" : type}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Status */}
          <div className="relative w-full xl:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="All">All Bed Status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setWardFilter("All");
              setRoomTypeFilter("All");
              setStatusFilter("All");
            }}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Settings2 size={15} />
            Reset
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* LEGEND                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Available
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Occupied
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Reserved
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Maintenance
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <LayoutGrid size={14} />
          {filteredRooms.length} room
          {filteredRooms.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ROOM / BED AREA                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="h-[620px] overflow-y-auto pr-1">
        <div className="space-y-4">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBedClick={setSelectedBed}
              />
            ))
          ) : (
            <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
              <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                <Search size={25} />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-slate-700">
                No rooms or beds found
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BED DETAILS MODAL                                                  */}
      {/* ------------------------------------------------------------------ */}

      {selectedBed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
          onClick={() => setSelectedBed(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                    <Bed size={18} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-800">
                      {selectedBed.number}
                    </h2>

                    <p className="text-[11px] text-slate-500">
                      {selectedBed.id}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBed(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <div className="mb-4 rounded-xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Current Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      statusConfig[selectedBed.status].classes
                    }`}
                  >
                    {selectedBed.status}
                  </span>
                </div>

                {selectedBed.status === "Occupied" && (
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Patient
                      </span>

                      <span className="text-xs font-semibold text-slate-700">
                        {selectedBed.patient}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Patient ID
                      </span>

                      <span className="text-xs font-semibold text-slate-700">
                        {selectedBed.patientId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Admission
                      </span>

                      <span className="text-xs font-semibold text-slate-700">
                        {selectedBed.admissionDate}
                      </span>
                    </div>
                  </div>
                )}

                {selectedBed.status !== "Occupied" && (
                  <div className="flex items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
                    <Info size={14} />
                    No patient is currently assigned to this bed.
                  </div>
                )}
              </div>

              {/* Status Buttons */}
              <p className="mb-2 text-xs font-semibold text-slate-700">
                Change Bed Status
              </p>

              <div className="grid grid-cols-2 gap-2">
                {Object.keys(statusConfig).map((status) => {
                  const config = statusConfig[status];
                  const Icon = config.icon;

                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={selectedBed.status === status}
                      onClick={() =>
                        updateBedStatus(selectedBed.id, status)
                      }
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${config.classes}`}
                    >
                      <Icon size={14} />
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
              <button
                type="button"
                onClick={() => setSelectedBed(null)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}