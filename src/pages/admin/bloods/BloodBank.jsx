import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock3,
  Droplets,
  Eye,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Users,
  UserPlus,
  X,
} from "lucide-react";

const initialBloodStocks = [
  {
    id: "BL-1001",
    bloodGroup: "A+",
    component: "Whole Blood",
    units: 24,
    minStock: 10,
    expiryDate: "2026-10-15",
    donorCount: 12,
    status: "Available",
    location: "Blood Bank - A",
    notes: "Regular stock",
  },
  {
    id: "BL-1002",
    bloodGroup: "A-",
    component: "Whole Blood",
    units: 6,
    minStock: 8,
    expiryDate: "2026-09-28",
    donorCount: 4,
    status: "Low Stock",
    location: "Blood Bank - A",
    notes: "Urgent replenishment required",
  },
  {
    id: "BL-1003",
    bloodGroup: "B+",
    component: "Whole Blood",
    units: 32,
    minStock: 12,
    expiryDate: "2026-11-05",
    donorCount: 18,
    status: "Available",
    location: "Blood Bank - B",
    notes: "Good stock level",
  },
  {
    id: "BL-1004",
    bloodGroup: "B-",
    component: "Platelets",
    units: 5,
    minStock: 6,
    expiryDate: "2026-09-15",
    donorCount: 3,
    status: "Low Stock",
    location: "Blood Bank - B",
    notes: "Platelet stock is low",
  },
  {
    id: "BL-1005",
    bloodGroup: "AB+",
    component: "Plasma",
    units: 18,
    minStock: 8,
    expiryDate: "2026-10-22",
    donorCount: 9,
    status: "Available",
    location: "Blood Bank - C",
    notes: "Regular plasma stock",
  },
  {
    id: "BL-1006",
    bloodGroup: "AB-",
    component: "Whole Blood",
    units: 3,
    minStock: 5,
    expiryDate: "2026-09-18",
    donorCount: 2,
    status: "Low Stock",
    location: "Blood Bank - C",
    notes: "Rare blood group",
  },
  {
    id: "BL-1007",
    bloodGroup: "O+",
    component: "Whole Blood",
    units: 45,
    minStock: 15,
    expiryDate: "2026-11-20",
    donorCount: 25,
    status: "Available",
    location: "Blood Bank - A",
    notes: "High demand blood group",
  },
  {
    id: "BL-1008",
    bloodGroup: "O-",
    component: "Whole Blood",
    units: 7,
    minStock: 10,
    expiryDate: "2026-09-25",
    donorCount: 5,
    status: "Low Stock",
    location: "Blood Bank - B",
    notes: "Universal donor group",
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
  "Platelets",
  "Plasma",
  "Red Blood Cells",
];

const locations = [
  "Blood Bank - A",
  "Blood Bank - B",
  "Blood Bank - C",
];

const initialDonors = [
  {
    id: "D-001",
    name: "Rahul Das",
    bloodGroup: "O+",
    age: 28,
    gender: "Male",
    phone: "98XXXXXX21",
    lastDonation: "2026-08-05",
    status: "Active",
  },
  {
    id: "D-002",
    name: "Priya Roy",
    bloodGroup: "A+",
    age: 25,
    gender: "Female",
    phone: "97XXXXXX43",
    lastDonation: "2026-07-20",
    status: "Active",
  },
  {
    id: "D-003",
    name: "Amit Paul",
    bloodGroup: "B+",
    age: 31,
    gender: "Male",
    phone: "96XXXXXX52",
    lastDonation: "2026-06-10",
    status: "Eligible",
  },
  {
    id: "D-004",
    name: "Sneha Sen",
    bloodGroup: "AB+",
    age: 27,
    gender: "Female",
    phone: "95XXXXXX76",
    lastDonation: "2026-05-15",
    status: "Active",
  },
];

const initialRequests = [
  {
    id: "BR-001",
    patient: "Arjun Roy",
    patientId: "P-1025",
    bloodGroup: "O+",
    units: 2,
    priority: "Emergency",
    date: "2026-09-08",
    status: "Approved",
    doctor: "Dr. S. Roy",
  },
  {
    id: "BR-002",
    patient: "Riya Das",
    patientId: "P-1031",
    bloodGroup: "A+",
    units: 1,
    priority: "Normal",
    date: "2026-09-08",
    status: "Pending",
    doctor: "Dr. A. Sen",
  },
  {
    id: "BR-003",
    patient: "Amit Sen",
    patientId: "P-1040",
    bloodGroup: "B-",
    units: 2,
    priority: "Urgent",
    date: "2026-09-07",
    status: "Reserved",
    doctor: "Dr. R. Das",
  },
];

const emptyForm = {
  bloodGroup: "",
  component: "Whole Blood",
  units: "",
  minStock: "",
  expiryDate: "",
  donorCount: "",
  location: "Blood Bank - A",
  notes: "",
};

const statusStyles = {
  Available: "border-green-200 bg-green-50 text-green-700",
  "Low Stock": "border-yellow-200 bg-yellow-50 text-yellow-700",
  "Out of Stock": "border-red-200 bg-red-50 text-red-700",
};

const requestStatusStyles = {
  Pending: "border-yellow-200 bg-yellow-50 text-yellow-700",
  Approved: "border-blue-200 bg-blue-50 text-blue-700",
  Reserved: "border-purple-200 bg-purple-50 text-purple-700",
  Issued: "border-green-200 bg-green-50 text-green-700",
  Rejected: "border-red-200 bg-red-50 text-red-700",
};

function BloodBank() {
  const [bloodStocks, setBloodStocks] =
    useState(initialBloodStocks);

  const [donors, setDonors] = useState(initialDonors);
  const emptyDonorForm = { name: "", bloodGroup: "", age: "", gender: "", phone: "", lastDonation: "", status: "Eligible" };
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [donorForm, setDonorForm] = useState(emptyDonorForm);
  const [donorError, setDonorError] = useState("");
  const [requests, setRequests] =
    useState(initialRequests);

  const [activeTab, setActiveTab] =
    useState("Inventory");

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [requestFilter, setRequestFilter] = useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedBlood, setSelectedBlood] =
    useState(null);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [formError, setFormError] =
    useState("");

  const totalUnits = bloodStocks.reduce(
    (total, blood) => total + blood.units,
    0
  );

  const availableUnits = bloodStocks
    .filter((blood) => blood.status === "Available")
    .reduce((total, blood) => total + blood.units, 0);

  const lowStockBlood = bloodStocks.filter(
    (blood) => blood.status === "Low Stock"
  ).length;

  const totalBloodGroups = new Set(
    bloodStocks.map((blood) => blood.bloodGroup)
  ).size;

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const emergencyRequests = requests.filter(
    (request) => request.priority === "Emergency"
  ).length;

  const expiringSoon = bloodStocks.filter(
    (blood) => getExpiryStatus(blood.expiryDate) === "Expiring Soon"
  ).length;

  const filteredBloodStocks = useMemo(() => {
    return bloodStocks.filter((blood) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        blood.id.toLowerCase().includes(searchText) ||
        blood.bloodGroup.toLowerCase().includes(searchText) ||
        blood.component.toLowerCase().includes(searchText) ||
        blood.location.toLowerCase().includes(searchText);

      const matchesGroup =
        groupFilter === "All" ||
        blood.bloodGroup === groupFilter;

      const matchesStatus =
        statusFilter === "All" ||
        blood.status === statusFilter;

      return (
        matchesSearch &&
        matchesGroup &&
        matchesStatus
      );
    });
  }, [
    bloodStocks,
    search,
    groupFilter,
    statusFilter,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openNewBloodModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError("");
    setFormData(emptyForm);
  };

  const handleAddBlood = (e) => {
    e.preventDefault();

    if (
      !formData.bloodGroup ||
      !formData.component ||
      !formData.units ||
      !formData.minStock ||
      !formData.expiryDate ||
      !formData.location
    ) {
      setFormError(
        "Please fill all required fields."
      );
      return;
    }

    const units = Number(formData.units);
    const minStock = Number(formData.minStock);

    let status = "Available";

    if (units === 0) {
      status = "Out of Stock";
    } else if (units <= minStock) {
      status = "Low Stock";
    }

    const newBlood = {
      id: `BL-${1001 + bloodStocks.length}`,
      bloodGroup: formData.bloodGroup,
      component: formData.component,
      units,
      minStock,
      expiryDate: formData.expiryDate,
      donorCount:
        Number(formData.donorCount) || 0,
      status,
      location: formData.location,
      notes:
        formData.notes || "No notes added",
    };

    setBloodStocks((prev) => [
      newBlood,
      ...prev,
    ]);

    closeModal();
  };

  const handleStockUpdate = (id, type) => {
    setBloodStocks((prev) =>
      prev.map((blood) => {
        if (blood.id !== id) return blood;

        const updatedUnits =
          type === "add"
            ? blood.units + 1
            : Math.max(0, blood.units - 1);

        let updatedStatus = "Available";

        if (updatedUnits === 0) {
          updatedStatus = "Out of Stock";
        } else if (
          updatedUnits <= blood.minStock
        ) {
          updatedStatus = "Low Stock";
        }

        return {
          ...blood,
          units: updatedUnits,
          status: updatedStatus,
        };
      })
    );

    setSelectedBlood((prev) => {
      if (!prev || prev.id !== id) return prev;

      const updatedUnits =
        type === "add"
          ? prev.units + 1
          : Math.max(0, prev.units - 1);

      let updatedStatus = "Available";

      if (updatedUnits === 0) {
        updatedStatus = "Out of Stock";
      } else if (
        updatedUnits <= prev.minStock
      ) {
        updatedStatus = "Low Stock";
      }

      return {
        ...prev,
        units: updatedUnits,
        status: updatedStatus,
      };
    });
  };

  const approveRequest = (id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status: "Approved" }
          : request
      )
    );

    setSelectedRequest((prev) =>
      prev?.id === id
        ? { ...prev, status: "Approved" }
        : prev
    );
  };

  const reserveRequest = (id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status: "Reserved" }
          : request
      )
    );

    setSelectedRequest((prev) =>
      prev?.id === id
        ? { ...prev, status: "Reserved" }
        : prev
    );
  };

  const getGroupUnits = (group) =>
    bloodStocks
      .filter((blood) => blood.bloodGroup === group)
      .reduce((total, blood) => total + blood.units, 0);

  const issueRequest = (id) => {
    const request = requests.find((item) => item.id === id);
    if (!request) return;

    const available = getGroupUnits(request.bloodGroup);
    if (available < request.units) {
      window.alert(`Cannot issue ${request.units} unit(s) of ${request.bloodGroup}. Only ${available} unit(s) are available.`);
      return;
    }

    let remaining = request.units;
    setBloodStocks((prev) =>
      prev.map((blood) => {
        if (blood.bloodGroup !== request.bloodGroup || remaining <= 0) return blood;
        const deduction = Math.min(blood.units, remaining);
        remaining -= deduction;
        const updatedUnits = blood.units - deduction;
        return {
          ...blood,
          units: updatedUnits,
          status: updatedUnits === 0 ? "Out of Stock" : updatedUnits <= blood.minStock ? "Low Stock" : "Available",
        };
      })
    );

    setRequests((prev) => prev.map((item) => item.id === id ? { ...item, status: "Issued" } : item));
    setSelectedRequest((prev) => prev?.id === id ? { ...prev, status: "Issued" } : prev);
  };

  const handleDonorInputChange = (e) => {
    const { name, value } = e.target;
    setDonorForm((prev) => ({ ...prev, [name]: value }));
    setDonorError("");
  };

  const openDonorModal = () => {
    setDonorForm(emptyDonorForm);
    setDonorError("");
    setShowDonorModal(true);
  };

  const closeDonorModal = () => {
    setShowDonorModal(false);
    setDonorForm(emptyDonorForm);
    setDonorError("");
  };

  const handleAddDonor = (e) => {
    e.preventDefault();
    if (!donorForm.name || !donorForm.bloodGroup || !donorForm.age || !donorForm.gender || !donorForm.phone) {
      setDonorError("Please fill all required donor fields.");
      return;
    }
    const age = Number(donorForm.age);
    if (age < 18 || age > 65) {
      setDonorError("Donor age must be between 18 and 65 years.");
      return;
    }
    setDonors((prev) => [{
      id: `D-${String(prev.length + 1).padStart(3, "0")}`,
      name: donorForm.name.trim(), bloodGroup: donorForm.bloodGroup, age, gender: donorForm.gender,
      phone: donorForm.phone.trim(), lastDonation: donorForm.lastDonation || "", status: donorForm.status || "Eligible",
    }, ...prev]);
    closeDonorModal();
  };

  const handleAlertClick = (type) => {
    setSearch(""); setGroupFilter("All"); setStatusFilter("All");
    if (type === "low") { setStatusFilter("Low Stock"); setActiveTab("Inventory"); }
    if (type === "expiring") {
      setActiveTab("Inventory");
      window.alert(`${expiringSoon} blood stock item(s) are expiring within 7 days. Check the expiry status column.`);
    }
    if (type === "emergency") { setRequestFilter("Emergency"); setActiveTab("Requests"); }
  };

  const filteredRequests = useMemo(() => {
    if (requestFilter === "All") return requests;
    return requests.filter((request) => request.priority === requestFilter);
  }, [requests, requestFilter]);

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

  function getExpiryStatus(expiryDate) {
    const today = new Date();

    const expiry = new Date(
      `${expiryDate}T00:00:00`
    );

    const difference =
      expiry.getTime() - today.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    if (days < 0) return "Expired";

    if (days <= 7) return "Expiring Soon";

    return "Valid";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-[#E8F8F6] p-3 text-[#08A6A0]">
              <Droplets size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#073F42]">
                Blood Bank Management
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage blood inventory, donors, requests and blood issues
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={openNewBloodModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
        >
          <Plus size={18} />
          Add Blood Stock
        </button>

      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Blood Units"
          value={totalUnits}
          icon={<Droplets size={22} />}
          iconClass="bg-[#E8F8F6] text-[#08A6A0]"
        />

        <StatCard
          title="Available Units"
          value={availableUnits}
          icon={<CheckCircle2 size={22} />}
          iconClass="bg-green-50 text-green-600"
        />

        <StatCard
          title="Total Donors"
          value={donors.length}
          icon={<Users size={22} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<Clock3 size={22} />}
          iconClass="bg-yellow-50 text-yellow-600"
        />

      </div>

      {/* BLOOD GROUP CARDS */}
      <div className="mb-6 rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#073F42]">
              Blood Group Availability
            </h2>

            <p className="text-sm text-gray-500">
              Current available stock by blood group
            </p>
          </div>

          <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-semibold text-[#08A6A0]">
            {totalBloodGroups}/8 Groups
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">

          {bloodGroups.map((group) => {
            const units = bloodStocks
              .filter(
                (blood) =>
                  blood.bloodGroup === group
              )
              .reduce(
                (total, blood) =>
                  total + blood.units,
                0
              );

            const groupStatus =
              units === 0
                ? "Out"
                : units <= 10
                ? "Low"
                : "Available";

            return (
              <button
                key={group}
                onClick={() => {
                  setGroupFilter(group);
                  setStatusFilter("All");
                  setActiveTab("Inventory");
                }}
                className="rounded-xl border border-[#E2EFED] p-4 text-left transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]"
              >

                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F8F6] font-bold text-[#08A6A0]">
                  {group}
                </div>

                <p className="text-xl font-bold text-[#073F42]">
                  {units}
                </p>

                <p className="text-xs text-gray-500">
                  units available
                </p>

                <p
                  className={`mt-2 text-xs font-semibold ${
                    groupStatus === "Available"
                      ? "text-green-600"
                      : groupStatus === "Low"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {groupStatus}
                </p>

              </button>
            );
          })}

        </div>
      </div>

      {/* ALERTS */}
      {(lowStockBlood > 0 ||
        expiringSoon > 0 ||
        emergencyRequests > 0) && (
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">

          {lowStockBlood > 0 && (
            <AlertBox
              icon={<AlertCircle size={20} />}
              title={`${lowStockBlood} Low Stock Items`}
              description="Some blood groups need replenishment."
              onClick={() => handleAlertClick("low")}
            />
          )}

          {expiringSoon > 0 && (
            <AlertBox
              icon={<Clock3 size={20} />}
              title={`${expiringSoon} Expiring Soon`}
              description="Check blood units nearing expiry."
              onClick={() => handleAlertClick("expiring")}
            />
          )}

          {emergencyRequests > 0 && (
            <AlertBox
              icon={<AlertCircle size={20} />}
              title={`${emergencyRequests} Emergency Request`}
              description="Emergency blood requests need attention."
              onClick={() => handleAlertClick("emergency")}
            />
          )}

        </div>
      )}

      {/* TABS */}
      <div className="mb-5 overflow-x-auto rounded-xl border border-[#E2EFED] bg-white p-2 shadow-sm">

        <div className="flex min-w-max gap-1">

          {[
            "Inventory",
            "Donors",
            "Requests",
            "Blood Issue",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-[#08A6A0] text-white"
                  : "text-gray-600 hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
              }`}
            >
              {tab}
            </button>
          ))}

        </div>

      </div>

      {/* INVENTORY */}
      {activeTab === "Inventory" && (
        <>
          {/* FILTER */}
          <div className="mb-5 rounded-xl border border-[#E2EFED] bg-white p-4 shadow-sm">

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

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
                  placeholder="Search blood group, ID, component..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                />

              </div>

              <div className="relative">

                <Filter
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={groupFilter}
                  onChange={(e) =>
                    setGroupFilter(e.target.value)
                  }
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                >
                  <option value="All">
                    All Blood Groups
                  </option>

                  {bloodGroups.map((group) => (
                    <option key={group}>
                      {group}
                    </option>
                  ))}
                </select>

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
              >
                <option value="All">
                  All Stock Status
                </option>
                <option value="Available">
                  Available
                </option>
                <option value="Low Stock">
                  Low Stock
                </option>
                <option value="Out of Stock">
                  Out of Stock
                </option>
              </select>

            </div>

          </div>

          {/* INVENTORY TABLE */}
          <div className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="min-w-[1200px] w-full">

                <thead className="border-b border-[#E2EFED] bg-[#F5FAF9]">

                  <tr>
                    {[
                      "Blood ID",
                      "Blood Group",
                      "Component",
                      "Units",
                      "Expiry Date",
                      "Donors",
                      "Location",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredBloodStocks.length > 0 ? (
                    filteredBloodStocks.map(
                      (blood) => {
                        const expiryStatus =
                          getExpiryStatus(
                            blood.expiryDate
                          );

                        return (
                          <tr
                            key={blood.id}
                            className="transition hover:bg-[#F5FAF9]"
                          >

                            <td className="px-5 py-4">
                              <span className="font-semibold text-[#08A6A0]">
                                {blood.id}
                              </span>
                            </td>

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F8F6] font-bold text-[#08A6A0]">
                                  {blood.bloodGroup}
                                </div>

                                <span className="font-semibold text-[#073F42]">
                                  {blood.bloodGroup}
                                </span>

                              </div>

                            </td>

                            <td className="px-5 py-4 text-sm font-medium text-gray-800">
                              {blood.component}
                            </td>

                            <td className="px-5 py-4">

                              <span className="font-bold text-[#073F42]">
                                {blood.units}
                              </span>

                              <span className="ml-1 text-xs text-gray-500">
                                units
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <p className="text-sm font-medium text-gray-800">
                                {formatDate(
                                  blood.expiryDate
                                )}
                              </p>

                              <p
                                className={`text-xs ${
                                  expiryStatus ===
                                  "Expired"
                                    ? "text-red-600"
                                    : expiryStatus ===
                                      "Expiring Soon"
                                    ? "text-orange-600"
                                    : "text-green-600"
                                }`}
                              >
                                {expiryStatus}
                              </p>

                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                              {blood.donorCount}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                              {blood.location}
                            </td>

                            <td className="px-5 py-4">

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                  statusStyles[
                                    blood.status
                                  ]
                                }`}
                              >
                                {blood.status}
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <div className="flex items-center justify-end gap-2">

                                <button
                                  onClick={() =>
                                    setSelectedBlood(
                                      blood
                                    )
                                  }
                                  title="View Details"
                                  className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                                >
                                  <Eye size={17} />
                                </button>

                                <button
                                  onClick={() =>
                                    handleStockUpdate(
                                      blood.id,
                                      "add"
                                    )
                                  }
                                  title="Add Unit"
                                  className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                                >
                                  <ArrowUp size={17} />
                                </button>

                                <button
                                  onClick={() =>
                                    handleStockUpdate(
                                      blood.id,
                                      "remove"
                                    )
                                  }
                                  title="Remove Unit"
                                  className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                  <ArrowDown size={17} />
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-5 py-12 text-center"
                      >
                        <Droplets
                          size={42}
                          className="mx-auto mb-3 text-gray-300"
                        />

                        <h3 className="font-semibold text-gray-800">
                          No blood stock found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>
        </>
      )}

      {/* DONORS */}
      {activeTab === "Donors" && (
        <div className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-[#E2EFED] p-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="font-bold text-[#073F42]">
                Blood Donors
              </h2>

              <p className="text-sm text-gray-500">
                Manage registered blood donors
              </p>
            </div>

            <button
              type="button"
              onClick={openDonorModal}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
            >
              <UserPlus size={17} />
              Add Donor
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-[900px] w-full">

              <thead className="bg-[#F5FAF9]">

                <tr>
                  {[
                    "Donor ID",
                    "Donor Name",
                    "Blood Group",
                    "Age",
                    "Gender",
                    "Phone",
                    "Last Donation",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {donors.map((donor) => (
                  <tr
                    key={donor.id}
                    className="hover:bg-[#F5FAF9]"
                  >

                    <td className="px-5 py-4 font-semibold text-[#08A6A0]">
                      {donor.id}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F8F6] font-semibold text-[#08A6A0]">
                          {donor.name.charAt(0)}
                        </div>

                        <span className="font-medium text-[#073F42]">
                          {donor.name}
                        </span>

                      </div>

                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#E8F8F6] px-3 py-1 text-xs font-bold text-[#08A6A0]">
                        {donor.bloodGroup}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {donor.age}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {donor.gender}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {donor.phone}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatDate(
                        donor.lastDonation
                      )}
                    </td>

                    <td className="px-5 py-4">

                      <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        {donor.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* REQUESTS */}
      {activeTab === "Requests" && (
        <div className="overflow-hidden rounded-xl border border-[#E2EFED] bg-white shadow-sm">

          <div className="border-b border-[#E2EFED] p-5">

            <h2 className="font-bold text-[#073F42]">
              Blood Requests & Booking
            </h2>

            <p className="text-sm text-gray-500">
              Manage patient blood requests and reservations
            </p>

            <div className="mt-3 flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500">Priority</label>
              <select value={requestFilter} onChange={(e) => setRequestFilter(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#08A6A0]">
                <option value="All">All Requests</option>
                <option value="Emergency">Emergency</option>
                <option value="Urgent">Urgent</option>
                <option value="Normal">Normal</option>
              </select>
              {requestFilter !== "All" && <button type="button" onClick={() => setRequestFilter("All")} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Clear</button>}
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-[1000px] w-full">

              <thead className="bg-[#F5FAF9]">

                <tr>
                  {[
                    "Request ID",
                    "Patient",
                    "Blood Group",
                    "Units",
                    "Priority",
                    "Doctor",
                    "Date",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-[#F5FAF9]"
                  >

                    <td className="px-5 py-4 font-semibold text-[#08A6A0]">
                      {request.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#073F42]">
                        {request.patient}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.patientId}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-[#08A6A0]">
                        {request.bloodGroup}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#073F42]">
                      {request.units}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          request.priority ===
                          "Emergency"
                            ? "bg-red-50 text-red-600"
                            : request.priority ===
                              "Urgent"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {request.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {request.doctor}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatDate(request.date)}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          requestStatusStyles[
                            request.status
                          ]
                        }`}
                      >
                        {request.status}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <button
                        onClick={() =>
                          setSelectedRequest(
                            request
                          )
                        }
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                      >
                        <Eye size={17} />
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* BLOOD ISSUE */}
      {activeTab === "Blood Issue" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          <div className="rounded-2xl border border-[#E2EFED] bg-white p-6 shadow-sm lg:col-span-2">

            <div className="mb-5">
              <h2 className="font-bold text-[#073F42]">
                Blood Issue Management
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Approved and reserved blood requests ready for issue
              </p>
            </div>

            <div className="space-y-3">

              {requests
                .filter(
                  (request) =>
                    request.status ===
                      "Approved" ||
                    request.status ===
                      "Reserved"
                )
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 rounded-xl border border-[#E2EFED] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8F6] font-bold text-[#08A6A0]">
                        {request.bloodGroup}
                      </div>

                      <div>
                        <p className="font-semibold text-[#073F42]">
                          {request.patient}
                        </p>

                        <p className="text-sm text-gray-500">
                          {request.id} ·{" "}
                          {request.units} units
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        issueRequest(request.id)
                      }
                      className="rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                    >
                      Issue Blood
                    </button>

                  </div>
                ))}

            </div>

          </div>

          <div className="rounded-2xl border border-[#E2EFED] bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center gap-3">

              <div className="rounded-lg bg-[#E8F8F6] p-2 text-[#08A6A0]">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h3 className="font-bold text-[#073F42]">
                  Issue Workflow
                </h3>

                <p className="text-xs text-gray-500">
                  Blood issue process
                </p>
              </div>

            </div>

            <div className="space-y-4">

              {[
                "Request Approved",
                "Blood Reserved",
                "Cross-match Verified",
                "Blood Issued",
                "Inventory Updated",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3"
                >

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#08A6A0] text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {step}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

      {/* ADD BLOOD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl scrollbar-hide overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-[#073F42]">
                  Add Blood Stock
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add new blood inventory
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

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

                <FormSelect
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  options={bloodGroups}
                  placeholder="Select blood group"
                  required
                />

                <FormSelect
                  label="Blood Component"
                  name="component"
                  value={formData.component}
                  onChange={handleInputChange}
                  options={components}
                  required
                />

                <FormInput
                  label="Blood Units"
                  name="units"
                  type="number"
                  value={formData.units}
                  onChange={handleInputChange}
                  placeholder="Enter units"
                  required
                />

                <FormInput
                  label="Minimum Stock"
                  name="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  placeholder="Enter minimum stock"
                  required
                />

                <FormInput
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />

                <FormInput
                  label="Donor Count"
                  name="donorCount"
                  type="number"
                  value={formData.donorCount}
                  onChange={handleInputChange}
                  placeholder="Enter donor count"
                />

                <FormSelect
                  label="Storage Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  options={locations}
                />

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter blood stock notes..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />

                </div>

              </div>

              <div className="relative bottom-5 flex flex-col-reverse gap-3 border-t  border-gray-200 pt-5 sm:flex-row sm:justify-end">

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
                  Add Blood Stock
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ADD DONOR MODAL */}
      {showDonorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div><h2 className="text-lg font-bold text-[#073F42]">Add Blood Donor</h2><p className="mt-1 text-sm text-gray-500">Register a new blood donor</p></div>
              <button type="button" onClick={closeDonorModal} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDonor} className="space-y-5 p-6">
              {donorError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{donorError}</div>}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormInput label="Donor Name" name="name" value={donorForm.name} onChange={handleDonorInputChange} placeholder="Enter donor name" required />
                <FormSelect label="Blood Group" name="bloodGroup" value={donorForm.bloodGroup} onChange={handleDonorInputChange} options={bloodGroups} placeholder="Select blood group" required />
                <FormInput label="Age" name="age" type="number" value={donorForm.age} onChange={handleDonorInputChange} placeholder="Enter age" required />
                <FormSelect label="Gender" name="gender" value={donorForm.gender} onChange={handleDonorInputChange} options={["Male", "Female", "Other"]} placeholder="Select gender" required />
                <FormInput label="Phone" name="phone" value={donorForm.phone} onChange={handleDonorInputChange} placeholder="Enter phone number" required />
                <FormInput label="Last Donation" name="lastDonation" type="date" value={donorForm.lastDonation} onChange={handleDonorInputChange} />
                <FormSelect label="Donor Status" name="status" value={donorForm.status} onChange={handleDonorInputChange} options={["Eligible", "Active", "Inactive"]} required />
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeDonorModal} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#078F8A]"><UserPlus size={18} />Add Donor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOOD DETAILS MODAL */}
      {selectedBlood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-[#073F42]">
                  Blood Stock Details
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

            <div className="space-y-5 p-6">

              <div className="rounded-xl bg-[#E8F8F6] p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-bold text-[#08A6A0]">
                    {selectedBlood.bloodGroup}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Blood Group
                    </p>

                    <p className="text-lg font-bold text-[#073F42]">
                      {selectedBlood.bloodGroup}
                    </p>

                    <p className="text-sm text-gray-500">
                      {selectedBlood.component}
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-5">

                <Detail
                  label="Available Units"
                  value={selectedBlood.units}
                />

                <Detail
                  label="Minimum Stock"
                  value={selectedBlood.minStock}
                />

                <Detail
                  label="Expiry Date"
                  value={formatDate(
                    selectedBlood.expiryDate
                  )}
                />

                <Detail
                  label="Donor Count"
                  value={selectedBlood.donorCount}
                />

                <Detail
                  label="Storage Location"
                  value={selectedBlood.location}
                />

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

              <div className="rounded-xl border border-[#E2EFED] bg-gray-50 p-4">

                <p className="mb-3 text-sm font-semibold text-[#073F42]">
                  Stock Control
                </p>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      handleStockUpdate(
                        selectedBlood.id,
                        "remove"
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <ArrowDown size={17} />
                    Remove
                  </button>

                  <button
                    onClick={() =>
                      handleStockUpdate(
                        selectedBlood.id,
                        "add"
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                  >
                    <ArrowUp size={17} />
                    Add Unit
                  </button>

                </div>

              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Notes
                </p>

                <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                  {selectedBlood.notes}
                </p>
              </div>

            </div>

            <div className="flex justify-end border-t border-gray-200 px-6 py-4">

              <button
                onClick={() =>
                  setSelectedBlood(null)
                }
                className="rounded-lg bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* REQUEST DETAILS MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-[#073F42]">
                  Blood Request Details
                </h2>

                <p className="text-sm text-[#08A6A0]">
                  {selectedRequest.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="rounded-xl bg-[#E8F8F6] p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white font-bold text-[#08A6A0]">
                    {selectedRequest.bloodGroup}
                  </div>

                  <div>
                    <p className="font-bold text-[#073F42]">
                      {selectedRequest.patient}
                    </p>

                    <p className="text-sm text-gray-500">
                      {selectedRequest.patientId}
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-5">

                <Detail
                  label="Blood Group"
                  value={selectedRequest.bloodGroup}
                />

                <Detail
                  label="Required Units"
                  value={selectedRequest.units}
                />

                <Detail
                  label="Priority"
                  value={selectedRequest.priority}
                />

                <Detail
                  label="Doctor"
                  value={selectedRequest.doctor}
                />

                <Detail
                  label="Request Date"
                  value={formatDate(
                    selectedRequest.date
                  )}
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                      requestStatusStyles[
                        selectedRequest.status
                      ]
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                {selectedRequest.status ===
                  "Pending" && (
                  <button
                    onClick={() =>
                      approveRequest(
                        selectedRequest.id
                      )
                    }
                    className="rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                  >
                    Approve
                  </button>
                )}

                {(selectedRequest.status ===
                    "Approved" ||
                  selectedRequest.status ===
                    "Pending") && (
                  <button
                    onClick={() =>
                      reserveRequest(
                        selectedRequest.id
                      )
                    }
                    className="rounded-lg border border-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-[#08A6A0] transition hover:bg-[#E8F8F6]"
                  >
                    Reserve
                  </button>
                )}

                {selectedRequest.status ===
                  "Reserved" && (
                  <button
                    onClick={() =>
                      issueRequest(
                        selectedRequest.id
                      )
                    }
                    className="rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
                  >
                    Issue Blood
                  </button>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ========================= */
/* REUSABLE COMPONENTS */
/* ========================= */

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#073F42]">
            {value}
          </h2>
        </div>

        <div
          className={`rounded-lg p-3 ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

function AlertBox({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-[#E2EFED] bg-white p-4 text-left shadow-sm transition hover:border-[#08A6A0] hover:bg-[#F5FAF9]">

      <div className="rounded-lg bg-[#E8F8F6] p-2 text-[#08A6A0]">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-[#073F42]">
          {title}
        </p>

        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>

    </button>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}{" "}
        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
      />

    </div>
  );
}

function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}{" "}
        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
      >

        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#073F42]">
        {value}
      </p>
    </div>
  );
}

export default BloodBank;