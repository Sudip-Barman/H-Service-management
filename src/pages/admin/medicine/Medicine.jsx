import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Edit3,
  Eye,
  Filter,
  Package,
  Pill,
  Plus,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

const initialMedicines = [
  {
    medicine_id: 1,
    medicine_code: "MED001",
    medicine_name: "Paracetamol 500mg",
    generic_name: "Paracetamol",
    medicine_type: "Tablet",
    category: "Pain Relief",
    manufacturer: "Cipla",
    batch_number: "PCM001",
    dosage: "500mg",
    unit: "Tablet",
    quantity: 250,
    reorder_level: 50,
    purchase_price: 1.5,
    selling_price: 2,
    manufacture_date: "2025-12-10",
    expiry_date: "2027-12-10",
    storage_location: "Rack A-01",
    prescription_required: false,
    status: "Available",
  },
  {
    medicine_id: 2,
    medicine_code: "MED002",
    medicine_name: "Amoxicillin 500mg",
    generic_name: "Amoxicillin",
    medicine_type: "Capsule",
    category: "Antibiotic",
    manufacturer: "Sun Pharma",
    batch_number: "AMX002",
    dosage: "500mg",
    unit: "Capsule",
    quantity: 120,
    reorder_level: 30,
    purchase_price: 6,
    selling_price: 8,
    manufacture_date: "2025-09-15",
    expiry_date: "2027-09-15",
    storage_location: "Rack A-02",
    prescription_required: true,
    status: "Available",
  },
  {
    medicine_id: 3,
    medicine_code: "MED003",
    medicine_name: "Omeprazole 20mg",
    generic_name: "Omeprazole",
    medicine_type: "Capsule",
    category: "Gastric",
    manufacturer: "Dr. Reddy's",
    batch_number: "OMP003",
    dosage: "20mg",
    unit: "Capsule",
    quantity: 15,
    reorder_level: 20,
    purchase_price: 3.5,
    selling_price: 5,
    manufacture_date: "2025-11-20",
    expiry_date: "2026-11-20",
    storage_location: "Rack B-01",
    prescription_required: false,
    status: "Low Stock",
  },
  {
    medicine_id: 4,
    medicine_code: "MED004",
    medicine_name: "Cetirizine 10mg",
    generic_name: "Cetirizine",
    medicine_type: "Tablet",
    category: "Allergy",
    manufacturer: "Mankind",
    batch_number: "CTZ004",
    dosage: "10mg",
    unit: "Tablet",
    quantity: 80,
    reorder_level: 25,
    purchase_price: 2,
    selling_price: 3,
    manufacture_date: "2025-10-05",
    expiry_date: "2027-10-05",
    storage_location: "Rack B-02",
    prescription_required: false,
    status: "Available",
  },
  {
    medicine_id: 5,
    medicine_code: "MED005",
    medicine_name: "Azithromycin 500mg",
    generic_name: "Azithromycin",
    medicine_type: "Tablet",
    category: "Antibiotic",
    manufacturer: "Zydus",
    batch_number: "AZT005",
    dosage: "500mg",
    unit: "Tablet",
    quantity: 0,
    reorder_level: 20,
    purchase_price: 8,
    selling_price: 12,
    manufacture_date: "2025-08-12",
    expiry_date: "2027-08-12",
    storage_location: "Rack C-01",
    prescription_required: true,
    status: "Out of Stock",
  },
  {
    medicine_id: 6,
    medicine_code: "MED006",
    medicine_name: "Insulin Injection",
    generic_name: "Human Insulin",
    medicine_type: "Injection",
    category: "Diabetes",
    manufacturer: "Novo Nordisk",
    batch_number: "INS006",
    dosage: "40 IU/ml",
    unit: "Vial",
    quantity: 25,
    reorder_level: 10,
    purchase_price: 180,
    selling_price: 220,
    manufacture_date: "2025-06-10",
    expiry_date: "2026-10-15",
    storage_location: "Cold Storage",
    prescription_required: true,
    status: "Available",
  },
  {
    medicine_id: 7,
    medicine_code: "MED007",
    medicine_name: "Vitamin B Complex",
    generic_name: "Vitamin B Complex",
    medicine_type: "Tablet",
    category: "Vitamin",
    manufacturer: "Abbott",
    batch_number: "VBC007",
    dosage: "100mg",
    unit: "Tablet",
    quantity: 200,
    reorder_level: 40,
    purchase_price: 2,
    selling_price: 3.5,
    manufacture_date: "2025-07-01",
    expiry_date: "2028-07-01",
    storage_location: "Rack C-02",
    prescription_required: false,
    status: "Available",
  },
  {
    medicine_id: 8,
    medicine_code: "MED008",
    medicine_name: "Cough Syrup",
    generic_name: "Dextromethorphan",
    medicine_type: "Syrup",
    category: "Respiratory",
    manufacturer: "Himalaya",
    batch_number: "CS008",
    dosage: "100ml",
    unit: "Bottle",
    quantity: 10,
    reorder_level: 15,
    purchase_price: 55,
    selling_price: 70,
    manufacture_date: "2025-05-20",
    expiry_date: "2026-09-20",
    storage_location: "Rack D-01",
    prescription_required: false,
    status: "Low Stock",
  },
];

const emptyForm = {
  medicine_code: "",
  medicine_name: "",
  generic_name: "",
  medicine_type: "Tablet",
  category: "Pain Relief",
  manufacturer: "",
  batch_number: "",
  dosage: "",
  unit: "Tablet",
  quantity: "",
  reorder_level: "",
  purchase_price: "",
  selling_price: "",
  manufacture_date: "",
  expiry_date: "",
  storage_location: "",
  prescription_required: false,
  status: "Available",
};

const medicineTypes = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Ointment",
  "Drops",
  "Inhaler",
  "Powder",
  "Suspension",
  "Lotion",
  "Spray",
];

const categories = [
  "Pain Relief",
  "Antibiotic",
  "Fever",
  "Allergy",
  "Gastric",
  "Diabetes",
  "Blood Pressure",
  "Cardiac",
  "Vitamin",
  "Respiratory",
  "Skin",
  "Pediatric",
  "Emergency",
  "Other",
];

const getStockStatus = (medicine) => {
  if (medicine.quantity === 0) return "Out of Stock";
  if (medicine.quantity <= medicine.reorder_level) return "Low Stock";
  return "Available";
};

const getExpiryStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);

  if (expiry < today) {
    return "Expired";
  }

  const difference = expiry.getTime() - today.getTime();
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (days <= 30) {
    return "Expiring Soon";
  }

  return "Valid";
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Medicines = () => {
  const [medicines, setMedicines] = useState(initialMedicines);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [stockAction, setStockAction] = useState("add");
  const [stockQuantity, setStockQuantity] = useState("");

  const [form, setForm] = useState(emptyForm);

  /* =========================================================
     DASHBOARD STATISTICS
  ========================================================= */

  const stats = useMemo(() => {
    const total = medicines.length;

    const available = medicines.filter(
      (medicine) => getStockStatus(medicine) === "Available"
    ).length;

    const lowStock = medicines.filter(
      (medicine) => getStockStatus(medicine) === "Low Stock"
    ).length;

    const outOfStock = medicines.filter(
      (medicine) => getStockStatus(medicine) === "Out of Stock"
    ).length;

    const expiringSoon = medicines.filter(
      (medicine) => getExpiryStatus(medicine.expiry_date) === "Expiring Soon"
    ).length;

    return {
      total,
      available,
      lowStock,
      outOfStock,
      expiringSoon,
    };
  }, [medicines]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        medicine.medicine_name.toLowerCase().includes(searchText) ||
        medicine.medicine_code.toLowerCase().includes(searchText) ||
        medicine.generic_name.toLowerCase().includes(searchText) ||
        medicine.batch_number.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        medicine.category === categoryFilter;

      const currentStatus = getStockStatus(medicine);

      const matchesStock =
        stockFilter === "All" || currentStatus === stockFilter;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [medicines, search, categoryFilter, stockFilter]);

  /* =========================================================
     FORM
  ========================================================= */

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     ADD MEDICINE
  ========================================================= */

  const handleAddMedicine = (e) => {
    e.preventDefault();

    const newMedicine = {
      medicine_id: Date.now(),
      ...form,
      quantity: Number(form.quantity) || 0,
      reorder_level: Number(form.reorder_level) || 0,
      purchase_price: Number(form.purchase_price) || 0,
      selling_price: Number(form.selling_price) || 0,
      status: "Available",
    };

    newMedicine.status = getStockStatus(newMedicine);

    setMedicines((previous) => [newMedicine, ...previous]);

    setForm(emptyForm);
    setShowAddModal(false);
  };

  /* =========================================================
     VIEW MEDICINE
  ========================================================= */

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setShowViewModal(true);
  };

  /* =========================================================
     STOCK
  ========================================================= */

  const openStockModal = (medicine, action) => {
    setSelectedMedicine(medicine);
    setStockAction(action);
    setStockQuantity("");
    setShowStockModal(true);
  };

  const handleStockUpdate = () => {
    const quantity = Number(stockQuantity);

    if (!quantity || quantity <= 0 || !selectedMedicine) {
      return;
    }

    setMedicines((previous) =>
      previous.map((medicine) => {
        if (medicine.medicine_id !== selectedMedicine.medicine_id) {
          return medicine;
        }

        let newQuantity = medicine.quantity;

        if (stockAction === "add") {
          newQuantity += quantity;
        } else {
          newQuantity = Math.max(0, newQuantity - quantity);
        }

        const updatedMedicine = {
          ...medicine,
          quantity: newQuantity,
        };

        updatedMedicine.status = getStockStatus(updatedMedicine);

        return updatedMedicine;
      })
    );

    setShowStockModal(false);
    setStockQuantity("");
    setSelectedMedicine(null);
  };

  /* =========================================================
     STATUS UI
  ========================================================= */

  const stockBadge = (medicine) => {
    const status = getStockStatus(medicine);

    if (status === "Available") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle2 size={13} />
          Available
        </span>
      );
    }

    if (status === "Low Stock") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
          <AlertCircle size={13} />
          Low Stock
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        <AlertCircle size={13} />
        Out of Stock
      </span>
    );
  };

  const expiryBadge = (expiryDate) => {
    const status = getExpiryStatus(expiryDate);

    if (status === "Expired") {
      return (
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          Expired
        </span>
      );
    }

    if (status === "Expiring Soon") {
      return (
        <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
          Expiring Soon
        </span>
      );
    }

    return (
      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
        Valid
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7FBFA] p-4 md:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F8F6]">
              <Pill className="text-[#08A6A0]" size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#073F42] md:text-3xl">
                Medicine / Pharmacy
              </h1>

              <p className="text-sm text-[#789092]">
                Manage medicines, inventory, sales and pharmacy stock
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
        >
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Total Medicines"
          value={stats.total}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Available"
          value={stats.available}
          icon={<CheckCircle2 size={22} />}
        />

        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon={<AlertCircle size={22} />}
        />

        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={<ShoppingCart size={22} />}
        />

        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={<AlertCircle size={22} />}
        />

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}
{/* 
      <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">

        <QuickAction
          title="Available"
          count={stats.available}
          onClick={() => setStockFilter("Available")}
        />

        <QuickAction
          title="Low Stock"
          count={stats.lowStock}
          onClick={() => setStockFilter("Low Stock")}
        />

        <QuickAction
          title="Out of Stock"
          count={stats.outOfStock}
          onClick={() => setStockFilter("Out of Stock")}
        />

        <QuickAction
          title="New Sale"
          count={<ShoppingCart size={19} />}
          onClick={() => alert("Medicine Sale page can be connected here.")}
        />

      </div> */}

      {/* =====================================================
          SEARCH & FILTER
      ===================================================== */}

      <div className="mb-5 rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#819596]"
            />

            <input
              type="text"
              placeholder="Search medicine name, code, generic name or batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#D9E9E7] bg-[#FBFEFD] py-3 pl-11 pr-4 text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-5 py-3 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]"
          >
            <Filter size={17} />
            Filters
          </button>

        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#EAF2F0] pt-4 md:grid-cols-2">

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-[#D9E9E7] bg-white px-4 py-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="rounded-xl border border-[#D9E9E7] bg-white px-4 py-3 text-sm text-[#31585A] outline-none focus:border-[#08A6A0]"
            >
              <option value="All">All Stock Status</option>
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

          </div>
        )}
      </div>

      {/* =====================================================
          MEDICINE TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b border-[#EAF2F0] px-5 py-5 md:flex-row md:items-center">

          <div>
            <h2 className="text-lg font-bold text-[#073F42]">
              Medicine Inventory
            </h2>

            <p className="mt-1 text-sm text-[#819596]">
              {filteredMedicines.length} medicine records found
            </p>
          </div>

          {(search || categoryFilter !== "All" || stockFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("All");
                setStockFilter("All");
              }}
              className="flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-[#08A6A0] hover:bg-[#E8F8F6]"
            >
              <X size={15} />
              Clear Filters
            </button>
          )}

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px] text-left">

            <thead className="bg-[#F7FBFA]">
              <tr className="border-b border-[#EAF2F0]">

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#708789]">
                  Medicine
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#708789]">
                  Type / Category
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#708789]">
                  Batch
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#708789]">
                  Stock
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#708789]">
                  Expiry
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#708789]">
                  Price
                </th>

                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#708789]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#708789]">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#EAF2F0]">

              {filteredMedicines.map((medicine) => (

                <tr
                  key={medicine.medicine_id}
                  className="transition hover:bg-[#FBFEFD]"
                >

                  {/* Medicine */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6]">
                        <Pill size={18} className="text-[#08A6A0]" />
                      </div>

                      <div>
                        <p className="font-semibold text-[#173F41]">
                          {medicine.medicine_name}
                        </p>

                        <p className="text-xs text-[#819596]">
                          {medicine.medicine_code}
                        </p>

                        <p className="text-xs text-[#9AAEAF]">
                          {medicine.generic_name}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Type */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-[#31585A]">
                      {medicine.medicine_type}
                    </p>

                    <p className="text-xs text-[#819596]">
                      {medicine.category}
                    </p>

                  </td>

                  {/* Batch */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-[#31585A]">
                      {medicine.batch_number}
                    </p>

                    <p className="text-xs text-[#9AAEAF]">
                      {medicine.manufacturer}
                    </p>

                  </td>

                  {/* Stock */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-bold text-[#173F41]">
                      {medicine.quantity} {medicine.unit}
                    </p>

                    <p className="text-xs text-[#819596]">
                      Reorder: {medicine.reorder_level}
                    </p>

                  </td>

                  {/* Expiry */}

                  <td className="px-5 py-4">

                    <p className="mb-1 text-sm font-medium text-[#31585A]">
                      {formatDate(medicine.expiry_date)}
                    </p>

                    {expiryBadge(medicine.expiry_date)}

                  </td>

                  {/* Price */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-bold text-[#173F41]">
                      ₹{medicine.selling_price.toFixed(2)}
                    </p>

                    <p className="text-xs text-[#819596]">
                      Buy ₹{medicine.purchase_price.toFixed(2)}
                    </p>

                  </td>

                  {/* Status */}

                  <td className="px-5 py-4">
                    {stockBadge(medicine)}
                  </td>

                  {/* Actions */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => handleView(medicine)}
                        title="View Medicine"
                        className="rounded-lg border border-[#D9E9E7] p-2 text-[#31585A] transition hover:border-[#08A6A0] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          openStockModal(medicine, "add")
                        }
                        title="Add Stock"
                        className="rounded-lg bg-[#E8F8F6] p-2 text-[#08A6A0] transition hover:bg-[#08A6A0] hover:text-white"
                      >
                        <ArrowUp size={16} />
                      </button>

                      <button
                        onClick={() =>
                          openStockModal(medicine, "remove")
                        }
                        title="Remove Stock"
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <ArrowDown size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredMedicines.length === 0 && (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6]">
                <Pill size={25} className="text-[#08A6A0]" />
              </div>

              <h3 className="font-bold text-[#073F42]">
                No medicines found
              </h3>

              <p className="mt-1 text-sm text-[#819596]">
                Try changing your search or filter.
              </p>

            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          ADD MEDICINE MODAL
      ===================================================== */}

      {showAddModal && (
        <Modal
          title="Add New Medicine"
          onClose={() => setShowAddModal(false)}
        >

          <form onSubmit={handleAddMedicine}>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <Input
                label="Medicine Code *"
                name="medicine_code"
                value={form.medicine_code}
                onChange={handleFormChange}
                required
              />

              <Input
                label="Medicine Name *"
                name="medicine_name"
                value={form.medicine_name}
                onChange={handleFormChange}
                required
              />

              <Input
                label="Generic Name"
                name="generic_name"
                value={form.generic_name}
                onChange={handleFormChange}
              />

              <Select
                label="Medicine Type"
                name="medicine_type"
                value={form.medicine_type}
                onChange={handleFormChange}
                options={medicineTypes}
              />

              <Select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleFormChange}
                options={categories}
              />

              <Input
                label="Manufacturer"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleFormChange}
              />

              <Input
                label="Batch Number"
                name="batch_number"
                value={form.batch_number}
                onChange={handleFormChange}
              />

              <Input
                label="Dosage"
                name="dosage"
                value={form.dosage}
                onChange={handleFormChange}
                placeholder="e.g. 500mg"
              />

              <Input
                label="Unit"
                name="unit"
                value={form.unit}
                onChange={handleFormChange}
                placeholder="Tablet / Bottle / Vial"
              />

              <Input
                label="Quantity"
                name="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleFormChange}
                required
              />

              <Input
                label="Reorder Level"
                name="reorder_level"
                type="number"
                min="0"
                value={form.reorder_level}
                onChange={handleFormChange}
              />

              <Input
                label="Purchase Price"
                name="purchase_price"
                type="number"
                min="0"
                step="0.01"
                value={form.purchase_price}
                onChange={handleFormChange}
              />

              <Input
                label="Selling Price"
                name="selling_price"
                type="number"
                min="0"
                step="0.01"
                value={form.selling_price}
                onChange={handleFormChange}
              />

              <Input
                label="Manufacture Date"
                name="manufacture_date"
                type="date"
                value={form.manufacture_date}
                onChange={handleFormChange}
              />

              <Input
                label="Expiry Date"
                name="expiry_date"
                type="date"
                value={form.expiry_date}
                onChange={handleFormChange}
              />

              <Input
                label="Storage Location"
                name="storage_location"
                value={form.storage_location}
                onChange={handleFormChange}
                placeholder="e.g. Rack A-01"
              />

            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-[#E2EFED] bg-[#F7FBFA] p-4">

              <input
                type="checkbox"
                name="prescription_required"
                checked={form.prescription_required}
                onChange={handleFormChange}
                className="h-4 w-4 accent-[#08A6A0]"
              />

              <div>
                <p className="text-sm font-semibold text-[#173F41]">
                  Prescription Required
                </p>

                <p className="text-xs text-[#819596]">
                  Mark this medicine as prescription-only.
                </p>
              </div>

            </label>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-[#D9E9E7] px-5 py-3 text-sm font-semibold text-[#31585A] hover:bg-[#F7FBFA]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#08A6A0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#078F8A]"
              >
                Add Medicine
              </button>

            </div>

          </form>

        </Modal>
      )}

      {/* =====================================================
          VIEW MEDICINE MODAL
      ===================================================== */}

      {showViewModal && selectedMedicine && (
        <Modal
          title="Medicine Details"
          onClose={() => setShowViewModal(false)}
        >

          <div className="mb-5 flex items-center gap-4 rounded-2xl bg-[#E8F8F6] p-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <Pill size={25} className="text-[#08A6A0]" />
            </div>

            <div>
              <h3 className="font-bold text-[#073F42]">
                {selectedMedicine.medicine_name}
              </h3>

              <p className="text-sm text-[#789092]">
                {selectedMedicine.medicine_code}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Detail
              label="Generic Name"
              value={selectedMedicine.generic_name}
            />

            <Detail
              label="Medicine Type"
              value={selectedMedicine.medicine_type}
            />

            <Detail
              label="Category"
              value={selectedMedicine.category}
            />

            <Detail
              label="Manufacturer"
              value={selectedMedicine.manufacturer}
            />

            <Detail
              label="Batch Number"
              value={selectedMedicine.batch_number}
            />

            <Detail
              label="Dosage"
              value={selectedMedicine.dosage}
            />

            <Detail
              label="Current Stock"
              value={`${selectedMedicine.quantity} ${selectedMedicine.unit}`}
            />

            <Detail
              label="Reorder Level"
              value={selectedMedicine.reorder_level}
            />

            <Detail
              label="Purchase Price"
              value={`₹${selectedMedicine.purchase_price.toFixed(2)}`}
            />

            <Detail
              label="Selling Price"
              value={`₹${selectedMedicine.selling_price.toFixed(2)}`}
            />

            <Detail
              label="Manufacture Date"
              value={formatDate(selectedMedicine.manufacture_date)}
            />

            <Detail
              label="Expiry Date"
              value={formatDate(selectedMedicine.expiry_date)}
            />

            <Detail
              label="Storage Location"
              value={selectedMedicine.storage_location}
            />

            <Detail
              label="Prescription"
              value={
                selectedMedicine.prescription_required
                  ? "Required"
                  : "Not Required"
              }
            />

          </div>

          <div className="mt-5 flex justify-end">

            <button
              onClick={() => setShowViewModal(false)}
              className="rounded-xl bg-[#08A6A0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#078F8A]"
            >
              Close
            </button>

          </div>

        </Modal>
      )}

      {/* =====================================================
          STOCK MODAL
      ===================================================== */}

      {showStockModal && selectedMedicine && (
        <Modal
          title={
            stockAction === "add"
              ? "Add Medicine Stock"
              : "Remove Medicine Stock"
          }
          onClose={() => setShowStockModal(false)}
        >

          <div className="mb-5 rounded-2xl bg-[#E8F8F6] p-4">

            <p className="font-bold text-[#073F42]">
              {selectedMedicine.medicine_name}
            </p>

            <p className="mt-1 text-sm text-[#789092]">
              Current Stock:{" "}
              <span className="font-bold text-[#08A6A0]">
                {selectedMedicine.quantity} {selectedMedicine.unit}
              </span>
            </p>

          </div>

          <label className="mb-2 block text-sm font-semibold text-[#31585A]">
            Quantity
          </label>

          <input
            type="number"
            min="1"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="w-full rounded-xl border border-[#D9E9E7] px-4 py-3 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
          />

          <div className="mt-6 flex justify-end gap-3">

            <button
              onClick={() => setShowStockModal(false)}
              className="rounded-xl border border-[#D9E9E7] px-5 py-3 text-sm font-semibold text-[#31585A]"
            >
              Cancel
            </button>

            <button
              onClick={handleStockUpdate}
              className={`rounded-xl px-5 py-3 text-sm font-semibold text-white ${
                stockAction === "add"
                  ? "bg-[#08A6A0] hover:bg-[#078F8A]"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {stockAction === "add" ? "Add Stock" : "Remove Stock"}
            </button>

          </div>

        </Modal>
      )}

    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-[#819596]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#073F42]">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
          {icon}
        </div>

      </div>

    </div>
  );
};

/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({ title, count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-[#E2EFED] bg-white p-4 text-left shadow-sm transition hover:border-[#08A6A0] hover:bg-[#E8F8F6]"
    >

      <span className="text-sm font-semibold text-[#31585A]">
        {title}
      </span>

      <span className="font-bold text-[#08A6A0]">
        {count}
      </span>

    </button>
  );
};

/* =========================================================
   INPUT
========================================================= */

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#31585A]">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#D9E9E7] bg-white px-4 py-3 text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
      />
    </div>
  );
};

/* =========================================================
   SELECT
========================================================= */

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#31585A]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#D9E9E7] bg-white px-4 py-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

/* =========================================================
   DETAIL
========================================================= */

const Detail = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-4">

      <p className="text-xs font-medium text-[#819596]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#173F41]">
        {value || "-"}
      </p>

    </div>
  );
};

/* =========================================================
   MODAL
========================================================= */

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4 backdrop-blur-sm">

      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-[#EAF2F0] px-6 py-5">

          <h2 className="text-xl font-bold text-[#073F42]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#819596] transition hover:bg-[#E8F8F6] hover:text-[#073F42]"
          >
            <X size={20} />
          </button>

        </div>

        <div className="max-h-[calc(92vh-80px)] overflow-y-auto p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default Medicines;