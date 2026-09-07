import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Droplets,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

const initialBloodUnits = [
  {
    id: "BL-1001",
    donor: "Rahul Sharma",
    phone: "9876543210",
    bloodGroup: "O+",
    component: "Whole Blood",
    units: 2,
    collectionDate: "2026-09-01",
    expiryDate: "2026-10-13",
    status: "Available",
    notes: "Healthy donor. All screening tests completed.",
  },
  {
    id: "BL-1002",
    donor: "Priya Das",
    phone: "9830123456",
    bloodGroup: "A+",
    component: "Packed RBC",
    units: 1,
    collectionDate: "2026-08-28",
    expiryDate: "2026-10-09",
    status: "Available",
    notes: "Blood unit stored in refrigerator.",
  },
  {
    id: "BL-1003",
    donor: "Arjun Ghosh",
    phone: "9007123456",
    bloodGroup: "B+",
    component: "Platelets",
    units: 3,
    collectionDate: "2026-09-03",
    expiryDate: "2026-09-10",
    status: "Reserved",
    notes: "Reserved for emergency patient.",
  },
  {
    id: "BL-1004",
    donor: "Sneha Mukherjee",
    phone: "9123456789",
    bloodGroup: "AB+",
    component: "Plasma",
    units: 2,
    collectionDate: "2026-08-20",
    expiryDate: "2027-08-20",
    status: "Available",
    notes: "Fresh frozen plasma.",
  },
  {
    id: "BL-1005",
    donor: "Sourav Dey",
    phone: "9876012345",
    bloodGroup: "O-",
    component: "Packed RBC",
    units: 1,
    collectionDate: "2026-08-15",
    expiryDate: "2026-09-14",
    status: "Used",
    notes: "Used for emergency transfusion.",
  },
  {
    id: "BL-1006",
    donor: "Ananya Roy",
    phone: "9830456789",
    bloodGroup: "A-",
    component: "Whole Blood",
    units: 2,
    collectionDate: "2026-08-30",
    expiryDate: "2026-10-11",
    status: "Available",
    notes: "Screening completed successfully.",
  },
];

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const components = [
  "Whole Blood",
  "Packed RBC",
  "Platelets",
  "Plasma",
];

const emptyForm = {
  donor: "",
  phone: "",
  bloodGroup: "",
  component: "",
  units: "",
  collectionDate: "",
  expiryDate: "",
  status: "Available",
  notes: "",
};

const statusStyles = {
  Available:
    "border-green-200 bg-green-50 text-green-700",
  Reserved:
    "border-yellow-200 bg-yellow-50 text-yellow-700",
  Used:
    "border-blue-200 bg-blue-50 text-blue-700",
  Expired:
    "border-red-200 bg-red-50 text-red-700",
};

function Bloodbank() {
  const [bloodUnits, setBloodUnits] =
    useState(initialBloodUnits);

  const [search, setSearch] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] =
    useState("All");
  const [componentFilter, setComponentFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedBlood, setSelectedBlood] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [formError, setFormError] =
    useState("");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  /* =========================
     EXPIRY CHECK
  ========================= */

  const isExpired = (expiryDate) => {
    return expiryDate < today;
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(
      `${expiryDate}T00:00:00`
    );

    const current = new Date(
      `${today}T00:00:00`
    );

    const difference =
      (expiry - current) /
      (1000 * 60 * 60 * 24);

    return difference >= 0 && difference <= 7;
  };

  /* =========================
     FILTER DATA
  ========================= */

  const filteredBloodUnits = useMemo(() => {
    return bloodUnits.filter((blood) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        blood.id
          .toLowerCase()
          .includes(searchText) ||
        blood.donor
          .toLowerCase()
          .includes(searchText) ||
        blood.phone.includes(searchText) ||
        blood.bloodGroup
          .toLowerCase()
          .includes(searchText) ||
        blood.component
          .toLowerCase()
          .includes(searchText);

      const matchesBloodGroup =
        bloodGroupFilter === "All" ||
        blood.bloodGroup === bloodGroupFilter;

      const matchesComponent =
        componentFilter === "All" ||
        blood.component === componentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        blood.status === statusFilter;

      return (
        matchesSearch &&
        matchesBloodGroup &&
        matchesComponent &&
        matchesStatus
      );
    });
  }, [
    bloodUnits,
    search,
    bloodGroupFilter,
    componentFilter,
    statusFilter,
  ]);

  /* =========================
     STATISTICS
  ========================= */

  const totalUnits = bloodUnits.reduce(
    (total, blood) =>
      total + Number(blood.units),
    0
  );

  const availableUnits = bloodUnits
    .filter((blood) => {
      return (
        blood.status === "Available" &&
        !isExpired(blood.expiryDate)
      );
    })
    .reduce(
      (total, blood) =>
        total + Number(blood.units),
      0
    );

  const reservedUnits = bloodUnits
    .filter(
      (blood) => blood.status === "Reserved"
    )
    .reduce(
      (total, blood) =>
        total + Number(blood.units),
      0
    );

  const expiringSoonUnits = bloodUnits
    .filter(
      (blood) =>
        blood.status === "Available" &&
        isExpiringSoon(blood.expiryDate)
    )
    .reduce(
      (total, blood) =>
        total + Number(blood.units),
      0
    );

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     OPEN MODAL
  ========================= */

  const openBloodModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    setShowModal(false);
    setFormError("");
    setFormData(emptyForm);
  };

  /* =========================
     ADD BLOOD UNIT
  ========================= */

  const handleAddBlood = (e) => {
    e.preventDefault();

    if (
      !formData.donor ||
      !formData.phone ||
      !formData.bloodGroup ||
      !formData.component ||
      !formData.units ||
      !formData.collectionDate ||
      !formData.expiryDate
    ) {
      setFormError(
        "Please fill all required fields."
      );
      return;
    }

    if (
      formData.expiryDate <=
      formData.collectionDate
    ) {
      setFormError(
        "Expiry date must be after collection date."
      );
      return;
    }

    const newBlood = {
      id: `BL-${1001 + bloodUnits.length}`,
      donor: formData.donor,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      component: formData.component,
      units: Number(formData.units),
      collectionDate:
        formData.collectionDate,
      expiryDate: formData.expiryDate,
      status: formData.status,
      notes:
        formData.notes ||
        "No notes added.",
    };

    setBloodUnits((prev) => [
      newBlood,
      ...prev,
    ]);

    closeModal();
  };

  /* =========================
     RESERVE BLOOD
  ========================= */

  const handleReserveBlood = (id) => {
    setBloodUnits((prev) =>
      prev.map((blood) =>
        blood.id === id
          ? {
              ...blood,
              status: "Reserved",
            }
          : blood
      )
    );

    setSelectedBlood((prev) =>
      prev?.id === id
        ? {
            ...prev,
            status: "Reserved",
          }
        : prev
    );
  };

  /* =========================
     MARK AS USED
  ========================= */

  const handleMarkUsed = (id) => {
    const confirmUsed = window.confirm(
      "Are you sure you want to mark this blood unit as used?"
    );

    if (!confirmUsed) return;

    setBloodUnits((prev) =>
      prev.map((blood) =>
        blood.id === id
          ? {
              ...blood,
              status: "Used",
            }
          : blood
      )
    );

    setSelectedBlood((prev) =>
      prev?.id === id
        ? {
            ...prev,
            status: "Used",
          }
        : prev
    );
  };

  /* =========================
     DELETE BLOOD UNIT
  ========================= */

  const handleDeleteBlood = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blood unit?"
    );

    if (!confirmDelete) return;

    setBloodUnits((prev) =>
      prev.filter(
        (blood) => blood.id !== id
      )
    );

    if (selectedBlood?.id === id) {
      setSelectedBlood(null);
    }
  };

  /* =========================
     FORMAT DATE
  ========================= */

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Blood Bank
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage blood inventory, donors and
            blood availability
          </p>
        </div>

        <button
          onClick={openBloodModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
        >
          <Plus size={18} />
          Add Blood Unit
        </button>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Blood Units
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {totalUnits}
              </h2>
            </div>

            <div className="rounded-lg bg-[#E8F8F6] p-3 text-[#08A6A0]">
              <Droplets size={22} />
            </div>
          </div>
        </div>

        {/* AVAILABLE */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Available Units
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {availableUnits}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* RESERVED */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Reserved Units
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {reservedUnits}
              </h2>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
              <ShieldCheck size={22} />
            </div>
          </div>
        </div>

        {/* EXPIRING */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Expiring Soon
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {expiringSoonUnits}
              </h2>
            </div>

            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <AlertCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          FILTER CARD
      ========================= */}

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">

          {/* SEARCH */}

          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search blood ID, donor, group..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
            />
          </div>

          {/* BLOOD GROUP */}

          <div className="relative">
            <Droplets
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={bloodGroupFilter}
              onChange={(e) =>
                setBloodGroupFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
            >
              <option value="All">
                All Blood Groups
              </option>

              {bloodGroups.map((group) => (
                <option
                  key={group}
                  value={group}
                >
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* COMPONENT */}

          <div className="relative">
            <Package
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={componentFilter}
              onChange={(e) =>
                setComponentFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
            >
              <option value="All">
                All Components
              </option>

              {components.map(
                (component) => (
                  <option
                    key={component}
                    value={component}
                  >
                    {component}
                  </option>
                )
              )}
            </select>
          </div>

          {/* STATUS */}

          <div className="relative">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
            >
              <option value="All">
                All Status
              </option>

              <option value="Available">
                Available
              </option>

              <option value="Reserved">
                Reserved
              </option>

              <option value="Used">
                Used
              </option>

              <option value="Expired">
                Expired
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================
          BLOOD TABLE
      ========================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-[1200px] w-full">

            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Blood ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Donor
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Blood Group
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Component
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Units
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Collection
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Expiry
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredBloodUnits.length > 0 ? (

                filteredBloodUnits.map((blood) => {

                  const expired =
                    isExpired(
                      blood.expiryDate
                    );

                  const expiring =
                    isExpiringSoon(
                      blood.expiryDate
                    );

                  return (
                    <tr
                      key={blood.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* ID */}

                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#08A6A0]">
                          {blood.id}
                        </span>
                      </td>

                      {/* DONOR */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
                            <UserRound size={17} />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {blood.donor}
                            </p>

                            <p className="text-xs text-gray-500">
                              {blood.phone}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* BLOOD GROUP */}

                      <td className="px-5 py-4">

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                          <Droplets size={14} />
                          {blood.bloodGroup}
                        </span>

                      </td>

                      {/* COMPONENT */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {blood.component}
                        </p>
                      </td>

                      {/* UNITS */}

                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-900">
                          {blood.units} Unit
                          {blood.units > 1
                            ? "s"
                            : ""}
                        </span>
                      </td>

                      {/* COLLECTION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CalendarDays
                            size={15}
                            className="text-gray-400"
                          />

                          {formatDate(
                            blood.collectionDate
                          )}
                        </div>

                      </td>

                      {/* EXPIRY */}

                      <td className="px-5 py-4">

                        <div
                          className={`flex items-center gap-2 text-sm font-medium ${
                            expired
                              ? "text-red-600"
                              : expiring
                              ? "text-orange-600"
                              : "text-gray-700"
                          }`}
                        >
                          <CalendarDays
                            size={15}
                          />

                          {formatDate(
                            blood.expiryDate
                          )}
                        </div>

                        {expired && (
                          <p className="mt-1 text-xs text-red-500">
                            Expired
                          </p>
                        )}

                        {!expired &&
                          expiring && (
                            <p className="mt-1 text-xs text-orange-500">
                              Expiring soon
                            </p>
                          )}

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            statusStyles[
                              expired
                                ? "Expired"
                                : blood.status
                            ]
                          }`}
                        >
                          {expired
                            ? "Expired"
                            : blood.status}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          {/* VIEW */}

                          <button
                            onClick={() =>
                              setSelectedBlood(
                                {
                                  ...blood,
                                  status: expired
                                    ? "Expired"
                                    : blood.status,
                                }
                              )
                            }
                            title="View Blood Details"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                          >
                            <Eye size={17} />
                          </button>

                          {/* RESERVE */}

                          {blood.status ===
                            "Available" &&
                            !expired && (
                              <button
                                onClick={() =>
                                  handleReserveBlood(
                                    blood.id
                                  )
                                }
                                title="Reserve Blood"
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600"
                              >
                                <ShieldCheck
                                  size={17}
                                />
                              </button>
                            )}

                          {/* USED */}

                          {(blood.status ===
                            "Reserved" ||
                            blood.status ===
                              "Available") &&
                            !expired && (
                              <button
                                onClick={() =>
                                  handleMarkUsed(
                                    blood.id
                                  )
                                }
                                title="Mark as Used"
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <CheckCircle2
                                  size={17}
                                />
                              </button>
                            )}

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDeleteBlood(
                                blood.id
                              )
                            }
                            title="Delete Blood Unit"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <XCircle size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <Droplets
                        size={42}
                        className="mb-3 text-gray-300"
                      />

                      <h3 className="font-semibold text-gray-800">
                        No blood units found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search
                        or filters.
                      </p>

                    </div>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* =========================
          ADD BLOOD MODAL
      ========================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Add Blood Unit
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new blood unit to the
                  blood bank inventory
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleAddBlood}
              className="space-y-5 p-6"
            >

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* DONOR */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Donor Name{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="donor"
                    value={formData.donor}
                    onChange={handleInputChange}
                    placeholder="Enter donor name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />
                </div>

                {/* BLOOD GROUP */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Blood Group{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  >
                    <option value="">
                      Select blood group
                    </option>

                    {bloodGroups.map(
                      (group) => (
                        <option
                          key={group}
                          value={group}
                        >
                          {group}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* COMPONENT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Blood Component{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="component"
                    value={formData.component}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  >
                    <option value="">
                      Select component
                    </option>

                    {components.map(
                      (component) => (
                        <option
                          key={component}
                          value={component}
                        >
                          {component}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* UNITS */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Number of Units{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    name="units"
                    min="1"
                    value={formData.units}
                    onChange={handleInputChange}
                    placeholder="Enter units"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />
                </div>

                {/* STATUS */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  >
                    <option value="Available">
                      Available
                    </option>

                    <option value="Reserved">
                      Reserved
                    </option>

                    <option value="Used">
                      Used
                    </option>
                  </select>
                </div>

                {/* COLLECTION DATE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Collection Date{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="date"
                    name="collectionDate"
                    value={
                      formData.collectionDate
                    }
                    onChange={handleInputChange}
                    max={today}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />
                </div>

                {/* EXPIRY DATE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expiry Date{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    min={
                      formData.collectionDate ||
                      today
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />
                </div>

                {/* NOTES */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter blood unit notes..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                >
                  <Plus size={18} />
                  Add Blood Unit
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================
          VIEW BLOOD MODAL
      ========================= */}

      {selectedBlood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Blood Unit Details
                </h2>

                <p className="text-sm font-medium text-[#08A6A0]">
                  {selectedBlood.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedBlood(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* DETAILS */}

            <div className="space-y-4 p-6">

              {/* DONOR */}

              <div className="rounded-lg bg-[#E8F8F6] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#08A6A0]">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Donor
                    </p>

                    <p className="font-semibold text-gray-900">
                      {selectedBlood.donor}
                    </p>

                    <p className="text-sm text-gray-500">
                      {selectedBlood.phone}
                    </p>
                  </div>

                </div>

              </div>

              {/* DETAILS GRID */}

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Blood Group
                  </p>

                  <p className="mt-1 text-sm font-bold text-red-600">
                    {selectedBlood.bloodGroup}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Component
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedBlood.component}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Units
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {selectedBlood.units}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Collection Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(
                      selectedBlood.collectionDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Expiry Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(
                      selectedBlood.expiryDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                      statusStyles[
                        selectedBlood.status
                      ]
                    }`}
                  >
                    {selectedBlood.status}
                  </span>
                </div>

              </div>

              {/* NOTES */}

              <div>
                <p className="text-xs text-gray-500">
                  Notes
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {selectedBlood.notes}
                </p>
              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">

              {selectedBlood.status ===
                "Available" && (
                <button
                  onClick={() =>
                    handleReserveBlood(
                      selectedBlood.id
                    )
                  }
                  className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2.5 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100"
                >
                  Reserve
                </button>
              )}

              {(selectedBlood.status ===
                "Available" ||
                selectedBlood.status ===
                  "Reserved") && (
                <button
                  onClick={() =>
                    handleMarkUsed(
                      selectedBlood.id
                    )
                  }
                  className="rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                >
                  Mark as Used
                </button>
              )}

              <button
                onClick={() =>
                  setSelectedBlood(null)
                }
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
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

export default Bloodbank;