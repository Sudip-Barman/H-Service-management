import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Download,
  Edit3,
  Eye,
  FileText,
  FlaskConical,
  Filter,
  Package,
  Pill,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Truck,
  XCircle,
  Droplet,
} from "lucide-react";

/* =========================================================
   THEME
========================================================= */

/* =========================================================
   SAMPLE DATA
========================================================= */

const initialItems = [
  {
    id: 1,
    code: "INV-001",
    name: "Surgical Gloves",
    category: "Surgical Items",
    type: "Disposable",
    unit: "Box",
    quantity: 500,
    minimum: 100,
    maximum: 1000,
    price: 250,
    supplier: "MedSupply India",
    batch: "GLV-2026-01",
    manufacture: "2026-01-10",
    expiry: "2028-01-10",
    location: "Store Room A",
    condition: "Good",
    status: "Available",
  },
  {
    id: 2,
    code: "INV-002",
    name: "Disposable Syringe",
    category: "Medical Consumables",
    type: "Disposable",
    unit: "Piece",
    quantity: 75,
    minimum: 100,
    maximum: 1000,
    price: 8,
    supplier: "HealthCare Supplies",
    batch: "SYR-2026-05",
    manufacture: "2026-05-05",
    expiry: "2030-05-05",
    location: "Store Room B",
    condition: "Good",
    status: "Low Stock",
  },
  {
    id: 3,
    code: "INV-003",
    name: "Wheelchair",
    category: "Medical Equipment",
    type: "Equipment",
    unit: "Piece",
    quantity: 0,
    minimum: 2,
    maximum: 20,
    price: 8500,
    supplier: "Hospital Equipment Ltd",
    batch: "WC-2026-02",
    manufacture: "2026-02-15",
    expiry: null,
    location: "Equipment Store",
    condition: "Good",
    status: "Out of Stock",
  },
  {
    id: 4,
    code: "INV-004",
    name: "Face Mask",
    category: "PPE",
    type: "PPE",
    unit: "Box",
    quantity: 200,
    minimum: 50,
    maximum: 500,
    price: 180,
    supplier: "SafeCare",
    batch: "MSK-2026-03",
    manufacture: "2026-03-10",
    expiry: "2027-09-15",
    location: "PPE Store",
    condition: "Good",
    status: "Available",
  },
  {
    id: 5,
    code: "INV-005",
    name: "Cleaning Disinfectant",
    category: "Cleaning Supplies",
    type: "Cleaning Material",
    unit: "Bottle",
    quantity: 40,
    minimum: 50,
    maximum: 300,
    price: 320,
    supplier: "Clean Hospital",
    batch: "CLN-2026-06",
    manufacture: "2026-06-01",
    expiry: "2027-06-01",
    location: "Cleaning Store",
    condition: "Good",
    status: "Low Stock",
  },
  {
    id: 6,
    code: "INV-006",
    name: "Oxygen Mask",
    category: "Emergency Supplies",
    type: "Disposable",
    unit: "Piece",
    quantity: 120,
    minimum: 30,
    maximum: 300,
    price: 95,
    supplier: "LifeCare Medical",
    batch: "OXY-2026-02",
    manufacture: "2026-02-20",
    expiry: "2027-02-20",
    location: "Emergency Store",
    condition: "Good",
    status: "Available",
  },
  {
    id: 7,
    code: "INV-007",
    name: "ECG Machine",
    category: "Diagnostic Supplies",
    type: "Equipment",
    unit: "Piece",
    quantity: 3,
    minimum: 2,
    maximum: 10,
    price: 85000,
    supplier: "MedTech Systems",
    batch: "ECG-2026-01",
    manufacture: "2026-01-20",
    expiry: null,
    location: "Diagnostic Room",
    condition: "Under Maintenance",
    status: "Available",
  },
  {
    id: 8,
    code: "INV-008",
    name: "Patient Bed",
    category: "Furniture",
    type: "Furniture",
    unit: "Piece",
    quantity: 20,
    minimum: 5,
    maximum: 50,
    price: 18000,
    supplier: "Hospital Furniture Co.",
    batch: "BED-2026",
    manufacture: "2026-01-01",
    expiry: null,
    location: "Furniture Store",
    condition: "Good",
    status: "Available",
  },
];

const initialTransactions = [
  {
    id: 1,
    item: "Surgical Gloves",
    code: "INV-001",
    type: "Stock In",
    quantity: 100,
    date: "2026-09-08",
    user: "Admin",
  },
  {
    id: 2,
    item: "Disposable Syringe",
    code: "INV-002",
    type: "Stock Out",
    quantity: 25,
    date: "2026-09-07",
    user: "Admin",
  },
];

const inventoryCategories = [
  { id: "blood", label: "Blood Stock", icon: Droplet },
  { id: "medicine", label: "Medicine", icon: Pill },
  { id: "lab", label: "Lab Tests & Equipment", icon: FlaskConical },
];

const bloodInventory = [
  {
    name: "O Positive Whole Blood",
    group: "O+",
    quantity: "12 units",
    storedDate: "2026-09-02",
    expiryDate: "2026-10-14",
    usedDate: "Not used",
    reason: "Emergency and surgical transfusion",
    location: "Blood Bank Refrigerator A",
  },
  {
    name: "AB Negative Plasma",
    group: "AB-",
    quantity: "4 units",
    storedDate: "2026-08-29",
    expiryDate: "2026-09-26",
    usedDate: "2026-09-05",
    reason: "Plasma replacement",
    location: "Blood Bank Refrigerator B",
  },
];

const medicineInventory = [
  {
    name: "Paracetamol 500mg",
    batch: "PCM-26-08",
    quantity: "850 tablets",
    storedDate: "2026-08-10",
    expiryDate: "2028-08-09",
    usedDate: "2026-09-08",
    reason: "Fever and pain management",
    location: "Pharmacy Shelf A1",
  },
  {
    name: "Amoxicillin 500mg",
    batch: "AMX-26-04",
    quantity: "240 capsules",
    storedDate: "2026-07-21",
    expiryDate: "2028-07-20",
    usedDate: "2026-09-07",
    reason: "Bacterial infection treatment",
    location: "Pharmacy Shelf B2",
  },
];

const labInventory = [
  {
    name: "CBC Test Kit",
    kind: "Blood Test",
    quantity: "6 kits",
    storedDate: "2026-08-25",
    usedDate: "2026-09-08",
    reason: "Complete Blood Count testing",
    location: "Laboratory Cabinet L1",
  },
  {
    name: "ECG Machine",
    kind: "Lab Equipment",
    quantity: "3 units",
    storedDate: "2026-01-20",
    usedDate: "2026-09-09",
    reason: "Cardiac examination and monitoring",
    location: "Diagnostic Room",
  },
];

const commonLabTests = [
  "CBC",
  "Hemoglobin (Hb)",
  "Blood Group",
  "ESR",
  "Blood Sugar (FBS, PPBS, RBS)",
  "HbA1c",
  "Lipid Profile",
  "LFT",
  "KFT/RFT",
  "Thyroid Profile (T3, T4, TSH)",
  "CRP",
  "Routine Urine Examination",
  "Urine Culture",
  "Stool Routine Examination",
  "Blood Culture",
  "Dengue Test",
  "Malaria Test",
  "HIV Test",
  "Hepatitis B (HBsAg)",
  "Troponin",
  "Urine Pregnancy Test",
  "β-hCG",
  "ABO Blood Group",
  "Cross Matching",
  "Pap Smear",
  "FNAC",
  "Biopsy",
];

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusStyles = {
  Available: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  "Low Stock": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: AlertTriangle,
  },
  "Out of Stock": {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: XCircle,
  },
  Inactive: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: Archive,
  },
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const config = statusStyles[status] || statusStyles.Inactive;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <Icon size={14} />
      {status}
    </span>
  );
};

/* =========================================================
   CONDITION BADGE
========================================================= */

const ConditionBadge = ({ condition }) => {
  const styles = {
    Good: "bg-emerald-50 text-emerald-700",
    Damaged: "bg-red-50 text-red-700",
    "Under Maintenance": "bg-amber-50 text-amber-700",
    Expired: "bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[condition] || "bg-slate-100 text-slate-600"
      }`}
    >
      {condition}
    </span>
  );
};

const CategoryDetails = ({ category }) => {
  if (category === "all") return null;

  const isBlood = category === "blood";
  const isMedicine = category === "medicine";
  const records = isBlood
    ? bloodInventory
    : isMedicine
      ? medicineInventory
      : labInventory;
  const title = isBlood
    ? "Blood Stock Details"
    : isMedicine
      ? "Medicine Details"
      : "Laboratory Tests & Equipment";

  const columns = isBlood
    ? ["Blood Product", "Blood Group", "Quantity", "Stored Date", "Expiry Date", "Used Date", "Why Used", "Location"]
    : isMedicine
      ? ["Medicine", "Batch", "Quantity", "Stored Date", "Expiry Date", "Used Date", "Why Used", "Location"]
      : ["Test / Equipment", "Type", "Quantity", "Stored Date", "Used Date", "Why Used", "Location"];

  return (
    <section
      id="inventory-items"
      className="mt-6 overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm"
    >
      <div className="border-b border-[#EAF2F0] px-5 py-5">
        <h2 className="text-lg font-bold text-[#073F42]">{title}</h2>
        <p className="mt-1 text-sm text-[#819596]">
          Complete storage, usage and product information
        </p>
      </div>

      <div className="hide-scrollbar overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-[#F7FBFA]">
            <tr className="border-b border-[#EAF2F0]">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#819596]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAF2F0]">
            {records.map((record) => (
              <tr key={record.name} className="transition hover:bg-[#FBFDFD]">
                <td className="px-5 py-4 text-sm font-semibold text-[#173F41]">
                  {record.name}
                </td>
                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {isBlood ? record.group : isMedicine ? record.batch : record.kind}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#31585A]">
                  {record.quantity}
                </td>
                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {record.storedDate}
                </td>
                {record.expiryDate && (
                  <td className="px-5 py-4 text-sm text-[#31585A]">
                    {record.expiryDate}
                  </td>
                )}
                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {record.usedDate}
                </td>
                <td className="max-w-[260px] px-5 py-4 text-sm text-[#31585A]">
                  {record.reason}
                </td>
                <td className="px-5 py-4 text-sm text-[#31585A]">
                  {record.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {category === "lab" && (
        <div className="border-t border-[#EAF2F0] px-5 py-5">
          <h3 className="text-sm font-bold text-[#073F42]">
            Common Hospital Laboratory Tests
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {commonLabTests.map((test) => (
              <span
                key={test}
                className="rounded-full bg-[#F1F8F7] px-3 py-1.5 text-xs font-medium text-[#31585A]"
              >
                {test}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ title, value, subtitle, icon: Icon, type = "primary" }) => {
  const iconClasses = {
    primary: "bg-[#E8F8F6] text-[#08A6A0]",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-[#E2EFED] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#819596]">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#073F42]">{value}</h3>
          <p className="mt-1 text-xs text-[#9AAEAF]">{subtitle}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            iconClasses[type]
          }`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Inventory = () => {
  const [items, setItems] = useState(initialItems);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showExpiryItems, setShowExpiryItems] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemModalMode, setItemModalMode] = useState("view");
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockType, setStockType] = useState("Stock In");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("blood");

  const showTransactionHistory = () => {
    setShowHistory(true);
    requestAnimationFrame(() => {
      document.getElementById("inventory-history")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const focusInventoryItems = ({ status = "All", expiry = false } = {}) => {
    setStatusFilter(status);
    setShowExpiryItems(expiry);
    requestAnimationFrame(() => {
      document.getElementById("inventory-items")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const openItemModal = (item, mode) => {
    setSelectedItem(item);
    setItemModalMode(mode);
    setShowItemModal(true);
  };

  const handleExport = () => {
    const csv = [
      ["Code", "Name", "Category", "Quantity", "Status", "Location"],
      ...items.map((item) => [
        item.code,
        item.name,
        item.category,
        item.quantity,
        item.status,
        item.location,
      ]),
    ]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "inventory-items.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleAddItem = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") || "New Inventory Item";
    const nextId = Math.max(...items.map((item) => item.id), 0) + 1;
    const quantity = Number(formData.get("quantity")) || 0;
    const minimum = Number(formData.get("minimum")) || 0;

    setItems((current) => [
      ...current,
      {
        id: nextId,
        code: formData.get("code") || `INV-${String(nextId).padStart(3, "0")}`,
        name,
        category: formData.get("category") || "Other",
        type: formData.get("type") || "Consumable",
        unit: formData.get("unit") || "Piece",
        quantity,
        minimum,
        maximum: Number(formData.get("maximum")) || quantity,
        price: Number(formData.get("price")) || 0,
        supplier: formData.get("supplier") || "Not specified",
        batch: formData.get("batch") || "Not specified",
        manufacture: formData.get("manufacture") || "",
        expiry: formData.get("expiry") || null,
        location: formData.get("location") || "Main Store",
        condition: formData.get("condition") || "Good",
        status: formData.get("status") || (quantity > minimum ? "Available" : "Low Stock"),
      },
    ]);
    setShowAddModal(false);
  };

  const handleEditItem = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setItems((current) =>
      current.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: formData.get("name") || item.name,
              quantity: Number(formData.get("quantity")) || 0,
              location: formData.get("location") || item.location,
              status: formData.get("status") || item.status,
            }
          : item
      )
    );
    setShowItemModal(false);
  };

  const handleQuickAction = (title) => {
    window.alert(`${title} management will be Unavailable from this inventory.`);
  };

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const totalItems = items.length;

    const availableItems = items.filter(
      (item) => item.status === "Available"
    ).length;

    const lowStock = items.filter(
      (item) => item.status === "Low Stock"
    ).length;

    const outOfStock = items.filter(
      (item) => item.status === "Out of Stock"
    ).length;

    const damaged = items.filter(
      (item) => item.condition === "Damaged"
    ).length;

    const expired = items.filter(
      (item) => item.condition === "Expired"
    ).length;

    const inventoryValue = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    return {
      totalItems,
      availableItems,
      lowStock,
      outOfStock,
      damaged,
      expired,
      inventoryValue,
    };
  }, [items]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesExpiry =
        !showExpiryItems || (item.expiry && item.condition !== "Expired");

      return matchesSearch && matchesStatus && matchesCategory && matchesExpiry;
    });
  }, [items, search, statusFilter, categoryFilter, showExpiryItems]);

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this inventory item?"
    );

    if (!confirmed) return;

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Inactive" } : item
      )
    );
  };

  /* =======================================================
     STOCK MODAL
  ======================================================= */

  const openStockModal = (item, type) => {
    setSelectedItem(item);
    setStockType(type);
    setShowStockModal(true);
  };

  const handleStockSubmit = (event) => {
    event.preventDefault();

    setTransactions((current) => [
      {
        id: Date.now(),
        item: selectedItem?.name || "Inventory item",
        code: selectedItem?.code || "-",
        type: stockType,
        quantity: "Recorded",
        date: new Date().toISOString().slice(0, 10),
        user: "Admin",
      },
      ...current,
    ]);
    setShowStockModal(false);
    setShowHistory(true);
    requestAnimationFrame(() => {
      document.getElementById("inventory-history")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F7FBFA]">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-[#E2EFED] bg-white">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F8F6] text-[#08A6A0]">
                  <Boxes size={25} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#073F42]">
                    Inventory Management
                  </h1>

                  <p className="mt-1 text-sm text-[#819596]">
                    Manage hospital equipment, consumables and general stock
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-xl border border-[#D9E9E7] bg-white px-4 py-2.5 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#078F8A]"
              >
                <Download size={17} />
                Export
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#078F8A]"
              >
                <Plus size={18} />
                Add New Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            subtitle="Inventory item records"
            icon={Package}
          />

          <StatCard
            title="Available Items"
            value={stats.availableItems}
            subtitle="Currently available"
            icon={CheckCircle2}
            type="success"
          />

          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            subtitle="Needs replenishment"
            icon={AlertTriangle}
            type="warning"
          />

          <StatCard
            title="Out of Stock"
            value={stats.outOfStock}
            subtitle="Immediate action required"
            icon={XCircle}
            type="danger"
          />

          <StatCard
            title="Expiring Items"
            value="12"
            subtitle="Within next 90 days"
            icon={Clock3}
            type="purple"
          />

          <StatCard
            title="Expired Items"
            value={stats.expired}
            subtitle="Require removal"
            icon={Archive}
            type="danger"
          />

          <StatCard
            title="Damaged Items"
            value={stats.damaged}
            subtitle="Require inspection"
            icon={AlertTriangle}
            type="warning"
          />

          <StatCard
            title="Inventory Value"
            value={`₹${stats.inventoryValue.toLocaleString("en-IN")}`}
            subtitle="Current stock valuation"
            icon={ClipboardList}
            type="blue"
          />
        </div>

        {/* =================================================
            ALERT SECTION
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3 text-amber-600">
                <AlertTriangle size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Low Stock Alert
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  {stats.lowStock} items are below minimum stock level.
                </p>
                <button
                  type="button"
                  onClick={() => focusInventoryItems({ status: "Low Stock" })}
                  className="mt-3 text-sm font-bold text-amber-800 hover:underline"
                >
                  View Items →
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3 text-red-600">
                <XCircle size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-red-900">
                  Out of Stock
                </p>
                <p className="mt-1 text-sm text-red-700">
                  {stats.outOfStock} items are currently unavailable.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    focusInventoryItems({ status: "Out of Stock" })
                  }
                  className="mt-3 text-sm font-bold text-red-800 hover:underline"
                >
                  View Items →
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3 text-purple-600">
                <Clock3 size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-purple-900">
                  Expiry Alert
                </p>
                <p className="mt-1 text-sm text-purple-700">
                  12 items are approaching their expiry date.
                </p>
                <button
                  type="button"
                  onClick={() => focusInventoryItems({ expiry: true })}
                  className="mt-3 text-sm font-bold text-purple-800 hover:underline"
                >
                  Check Expiry →
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* =================================================
            Navigation
        ================================================= */}
        <nav className="hide-scrollbar flex select-none gap-2 overflow-x-auto rounded-2xl border border-[#E2EFED] bg-white p-2 shadow-sm mb-6 mt-6">
          {inventoryCategories.map(({ id, label, icon: Icon }) => {
            const isActive = selectedCategory === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#08A6A0] text-white"
                    : "text-[#31585A] hover:bg-[#E8F8F6] hover:text-[#078F8A]"
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AAEAF]"
              />

              <input
                type="text"
                placeholder="Search item name, code or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#D9E9E7] bg-[#FBFDFD] py-3 pl-11 pr-4 text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
              />
            </div>

            <div className="relative min-w-[190px]">
              <Filter
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#819596]"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white py-3 pl-11 pr-10 text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Inactive">Inactive</option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#819596]"
              />
            </div>

            <div className="relative min-w-[220px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white px-4 py-3 pr-10 text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
              >
                <option value="All">All Categories</option>
                <option value="Medical Equipment">
                  Medical Equipment
                </option>
                <option value="Surgical Items">Surgical Items</option>
                <option value="Medical Consumables">
                  Medical Consumables
                </option>
                <option value="Diagnostic Supplies">
                  Diagnostic Supplies
                </option>
                <option value="Emergency Supplies">
                  Emergency Supplies
                </option>
                <option value="PPE">PPE</option>
                <option value="Cleaning Supplies">
                  Cleaning Supplies
                </option>
                <option value="Furniture">Furniture</option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#819596]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setCategoryFilter("All");
                setShowExpiryItems(false);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-5 py-3 text-sm font-semibold text-[#31585A] hover:border-[#08A6A0] hover:text-[#078F8A]"
            >
              <RefreshCw size={17} />
              Reset
            </button>
          </div>
        </div>

        {/* =================================================
            ITEMS TABLE
        ================================================= */}

        {selectedCategory === "all" ? (
          <div
            id="inventory-items"
            className="mt-6 scroll-mt-6 overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm"
          >
          <div className="flex flex-col gap-3 border-b border-[#EAF2F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-[#073F42]">All Inventory Items</h2>
              <p className="mt-1 text-xs text-[#819596]">
                Showing {filteredItems.length} of {items.length} items
              </p>
            </div>

            <button
              type="button"
              onClick={showTransactionHistory}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-[#E8F8F6] px-4 py-2 text-sm font-semibold text-[#078F8A]"
            >
              <FileText size={16} />
              Transaction History
            </button>
          </div>

          {/* DESKTOP TABLE */}

          <div className="hide-scrollbar hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-[#EAF2F0] bg-[#FBFDFD] text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                    Item
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                    Category
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                    Stock
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                    Supplier
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                    Location
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                    Condition
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#819596]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EAF2F0]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="transition hover:bg-[#FBFDFD]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                          <Package size={19} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#173F41]">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#9AAEAF]">
                            {item.code} • {item.unit}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#31585A]">
                        {item.category}
                      </p>
                      <p className="mt-1 text-xs text-[#9AAEAF]">
                        {item.type}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-[#173F41]">
                        {item.quantity}
                      </p>
                      <p className="mt-1 text-xs text-[#9AAEAF]">
                        Min: {item.minimum} / Max: {item.maximum}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#31585A]">
                        {item.supplier}
                      </p>
                      <p className="mt-1 text-xs text-[#9AAEAF]">
                        ₹{item.price.toLocaleString("en-IN")} / {item.unit}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-[#31585A]">
                        {item.location}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <ConditionBadge condition={item.condition} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="View"
                          onClick={() => openItemModal(item, "view")}
                          className="rounded-lg p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() => openItemModal(item, "edit")}
                          className="rounded-lg p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          type="button"
                          title="Stock In"
                          onClick={() => openStockModal(item, "Stock In")}
                          className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                        >
                          <ArrowDownToLine size={17} />
                        </button>

                        <button
                          type="button"
                          title="Stock Out"
                          onClick={() => openStockModal(item, "Stock Out")}
                          className="rounded-lg p-2 text-orange-600 hover:bg-orange-50"
                        >
                          <ArrowUpFromLine size={17} />
                        </button>

                        <button
                          type="button"
                          title="Deactivate"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}

          <div className="divide-y divide-[#EAF2F0] lg:hidden">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                      <Package size={20} />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#173F41]">
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#9AAEAF]">
                        {item.code} • {item.unit}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#FBFDFD] p-3">
                  <div>
                    <p className="text-xs text-[#9AAEAF]">Category</p>
                    <p className="mt-1 text-sm font-semibold text-[#31585A]">
                      {item.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9AAEAF]">Quantity</p>
                    <p className="mt-1 text-sm font-semibold text-[#31585A]">
                      {item.quantity} {item.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9AAEAF]">Supplier</p>
                    <p className="mt-1 text-sm font-semibold text-[#31585A]">
                      {item.supplier}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9AAEAF]">Location</p>
                    <p className="mt-1 text-sm font-semibold text-[#31585A]">
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <ConditionBadge condition={item.condition} />

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openItemModal(item, "view")}
                      className="rounded-lg p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openItemModal(item, "edit")}
                      className="rounded-lg p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openStockModal(item, "Stock In")}
                      className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                    >
                      <ArrowDownToLine size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openStockModal(item, "Stock Out")}
                      className="rounded-lg p-2 text-orange-600 hover:bg-orange-50"
                    >
                      <ArrowUpFromLine size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Package
                size={42}
                className="mx-auto text-[#9AAEAF]"
              />

              <h3 className="mt-4 font-bold text-[#073F42]">
                No inventory items found
              </h3>

              <p className="mt-1 text-sm text-[#819596]">
                Try changing your search or filters.
              </p>
            </div>
          )}
          </div>
        ) : (
          <CategoryDetails category={selectedCategory} />
        )}

        {showHistory && (
          <section
            id="inventory-history"
            className="mt-6 overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-[#EAF2F0] px-5 py-4">
              <div>
                <h2 className="font-bold text-[#073F42]">Transaction History</h2>
                <p className="mt-1 text-xs text-[#819596]">
                  Recent stock movement across inventory items
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-sm font-semibold text-[#078F8A] hover:underline"
              >
                Hide
              </button>
            </div>

            <div className="hide-scrollbar overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-[#EAF2F0] bg-[#FBFDFD] text-left">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Item
                    </th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Type
                    </th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Quantity
                    </th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Date
                    </th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#819596]">
                      Performed By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAF2F0]">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#173F41]">
                          {transaction.item}
                        </p>
                        <p className="mt-1 text-xs text-[#9AAEAF]">
                          {transaction.code}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            transaction.type === "Stock In"
                              ? "text-emerald-700"
                              : "text-orange-700"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#31585A]">
                        {transaction.quantity}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#31585A]">
                        {transaction.date}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#31585A]">
                        {transaction.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* =================================================
            QUICK MANAGEMENT
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <QuickCard
            icon={ArrowDownToLine}
            title="Stock In"
            description="Receive new inventory items"
            onClick={() => {
              setSelectedItem(null);
              setStockType("Stock In");
              setShowStockModal(true);
            }}
          />

          <QuickCard
            icon={ArrowUpFromLine}
            title="Stock Out"
            description="Issue items to departments"
            onClick={() => {
              setSelectedItem(null);
              setStockType("Stock Out");
              setShowStockModal(true);
            }}
          />

          <QuickCard
            icon={Truck}
            title="Suppliers"
            description="Manage inventory suppliers"
            onClick={() => handleQuickAction("Supplier")}
          />

          <QuickCard
            icon={FileText}
            title="Reports"
            description="View stock and usage reports"
            onClick={handleExport}
          />
        </div>
      </main>

      {/* ===================================================
          ADD ITEM MODAL
      =================================================== */}

      {showAddModal && (
        <Modal
          title="Add New Inventory Item"
          subtitle="Create a new hospital inventory item"
          onClose={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleAddItem}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput name="code" label="Item Code" placeholder="INV-009" />
              <FormInput name="name" label="Item Name" placeholder="Enter item name" />

              <FormSelect
                name="category"
                label="Category"
                options={[
                  "Medical Equipment",
                  "Surgical Items",
                  "Medical Consumables",
                  "Diagnostic Supplies",
                  "Laboratory Supplies",
                  "Emergency Supplies",
                  "ICU Supplies",
                  "Operation Theatre Supplies",
                  "PPE",
                  "Cleaning Supplies",
                  "Office/Stationery",
                  "Electrical Items",
                  "Furniture",
                  "Other",
                ]}
              />

              <FormSelect
                name="type"
                label="Item Type"
                options={[
                  "Equipment",
                  "Consumable",
                  "Surgical Instrument",
                  "Disposable",
                  "PPE",
                  "Laboratory Item",
                  "Cleaning Material",
                  "Stationery",
                  "Furniture",
                  "Electrical Equipment",
                  "Other",
                ]}
              />

              <FormInput name="unit" label="Unit" placeholder="Piece / Box / Bottle" />
              <FormInput name="quantity" label="Quantity" type="number" placeholder="0" />

              <FormInput
                name="minimum"
                label="Minimum Stock"
                type="number"
                placeholder="0"
              />

              <FormInput
                name="maximum"
                label="Maximum Stock"
                type="number"
                placeholder="0"
              />

              <FormInput
                name="price"
                label="Purchase Price"
                type="number"
                placeholder="0.00"
              />

              <FormInput
                name="supplier"
                label="Supplier Name"
                placeholder="Supplier name"
              />

              <FormInput
                name="batch"
                label="Batch Number"
                placeholder="Batch number"
              />

              <FormInput
                name="location"
                label="Storage Location"
                placeholder="Store Room A"
              />

              <FormInput
                name="manufacture"
                label="Manufacture Date"
                type="date"
              />

              <FormInput name="expiry" label="Expiry Date" type="date" />

              <FormSelect
                name="condition"
                label="Condition Status"
                options={[
                  "Good",
                  "Damaged",
                  "Under Maintenance",
                  "Expired",
                ]}
              />

              <FormSelect
                name="status"
                label="Status"
                options={[
                  "Available",
                  "Low Stock",
                  "Out of Stock",
                  "Inactive",
                ]}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#31585A]">
                Description
              </label>

              <textarea
                rows="3"
                placeholder="Enter item description..."
                className="w-full rounded-xl border border-[#D9E9E7] px-4 py-3 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-[#EAF2F0] pt-5">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-[#D9E9E7] px-5 py-2.5 text-sm font-semibold text-[#31585A]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#078F8A]"
              >
                Add Item
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showItemModal && selectedItem && (
        <Modal
          title={itemModalMode === "edit" ? "Edit Inventory Item" : selectedItem.name}
          subtitle={`${selectedItem.code} • ${selectedItem.category}`}
          onClose={() => setShowItemModal(false)}
        >
          {itemModalMode === "view" ? (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Item Name", selectedItem.name],
                ["Code", selectedItem.code],
                ["Category", selectedItem.category],
                ["Type", selectedItem.type],
                ["Quantity", `${selectedItem.quantity} ${selectedItem.unit}`],
                ["Supplier", selectedItem.supplier],
                ["Batch", selectedItem.batch],
                ["Location", selectedItem.location],
                ["Condition", selectedItem.condition],
                ["Status", selectedItem.status],
                ["Expiry Date", selectedItem.expiry || "Not applicable"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#FBFDFD] p-4">
                  <dt className="text-xs text-[#819596]">{label}</dt>
                  <dd className="mt-1 font-semibold text-[#31585A]">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <form onSubmit={handleEditItem} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput name="name" label="Item Name" defaultValue={selectedItem.name} />
                <FormInput name="quantity" label="Quantity" type="number" defaultValue={selectedItem.quantity} />
                <FormInput name="location" label="Storage Location" defaultValue={selectedItem.location} />
                <FormSelect
                  name="status"
                  label="Status"
                  defaultValue={selectedItem.status}
                  options={["Available", "Low Stock", "Out of Stock", "Inactive"]}
                />
              </div>
              <div className="flex justify-end gap-3 border-t border-[#EAF2F0] pt-5">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="rounded-xl border border-[#D9E9E7] px-5 py-2.5 text-sm font-semibold text-[#31585A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#078F8A]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* ===================================================
          STOCK MODAL
      =================================================== */}

      {showStockModal && (
        <Modal
          title={stockType}
          subtitle={
            selectedItem
              ? `${selectedItem.name} • ${selectedItem.code}`
              : "Update hospital inventory stock"
          }
          onClose={() => setShowStockModal(false)}
        >
          <form
            onSubmit={handleStockSubmit}
            className="space-y-5"
          >
            {selectedItem && (
              <div className="rounded-xl bg-[#E8F8F6] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#819596]">
                      Current Quantity
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#073F42]">
                      {selectedItem.quantity}
                    </p>
                  </div>

                  <Package className="text-[#08A6A0]" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {!selectedItem && (
                <FormSelect
                  label="Item"
                  options={items.map((item) => item.name)}
                />
              )}

              {stockType === "Stock In" ? (
                <>
                  <FormInput
                    label="Supplier"
                    placeholder="Supplier name"
                  />

                  <FormInput
                    label="Purchase / Reference Number"
                    placeholder="PUR-001"
                  />

                  <FormInput
                    label="Batch Number"
                    placeholder="Batch number"
                  />

                  <FormInput
                    label="Quantity"
                    type="number"
                    placeholder="Enter quantity"
                  />

                  <FormInput
                    label="Purchase Price"
                    type="number"
                    placeholder="0.00"
                  />

                  <FormInput
                    label="Received Date"
                    type="date"
                  />

                  <FormInput
                    label="Expiry Date"
                    type="date"
                  />

                  <FormInput
                    label="Storage Location"
                    placeholder="Store Room"
                  />

                  <FormInput
                    label="Received By"
                    placeholder="Staff name"
                  />
                </>
              ) : (
                <>
                  <FormInput
                    label="Quantity"
                    type="number"
                    placeholder="Enter quantity"
                  />

                  <FormSelect
                    label="Department"
                    options={[
                      "Emergency",
                      "ICU",
                      "OPD",
                      "IPD",
                      "Laboratory",
                      "Operation Theatre",
                      "Blood Bank",
                      "Nursing Department",
                      "Pharmacy",
                      "Administration",
                      "Other Departments",
                    ]}
                  />

                  <FormInput
                    label="Issued To"
                    placeholder="Employee / Department"
                  />

                  <FormInput
                    label="Purpose"
                    placeholder="Purpose of issue"
                  />

                  <FormInput
                    label="Issue Date"
                    type="date"
                  />

                  <FormInput
                    label="Issued By"
                    placeholder="Staff name"
                  />
                </>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#31585A]">
                Remarks
              </label>

              <textarea
                rows="3"
                placeholder="Add remarks..."
                className="w-full rounded-xl border border-[#D9E9E7] px-4 py-3 text-sm outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-[#EAF2F0] pt-5">
              <button
                type="button"
                onClick={() => setShowStockModal(false)}
                className="rounded-xl border border-[#D9E9E7] px-5 py-2.5 text-sm font-semibold text-[#31585A]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#08A6A0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#078F8A]"
              >
                Save {stockType}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* =========================================================
   QUICK CARD
========================================================= */

const QuickCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-[#E2EFED] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#08A6A0] hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0] transition group-hover:bg-[#08A6A0] group-hover:text-white">
          <Icon size={21} />
        </div>

        <div>
          <h3 className="font-bold text-[#073F42]">{title}</h3>
          <p className="mt-1 text-xs text-[#819596]">{description}</p>
        </div>
      </div>
    </button>
  );
};

/* =========================================================
   MODAL
========================================================= */

const Modal = ({ title, subtitle, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#EAF2F0] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#073F42]">{title}</h2>
            <p className="mt-1 text-sm text-[#819596]">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#078F8A]"
          >
            <XCircle size={21} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-90px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FORM INPUT
========================================================= */

const FormInput = ({
  name,
  label,
  placeholder,
  type = "text",
  defaultValue,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#31585A]">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-[#D9E9E7] bg-white px-4 py-3 text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
      />
    </div>
  );
};

/* =========================================================
   FORM SELECT
========================================================= */

const FormSelect = ({ name, label, options, defaultValue }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#31585A]">
        {label}
      </label>

      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-[#D9E9E7] bg-white px-4 py-3 text-sm text-[#173F41] outline-none focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Inventory;