import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../../api/api";
import {
  Activity,
  AlertTriangle,
  Archive,
  Boxes,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  DollarSign,
  Download,
  Eye,
  Filter,
  MapPin,
  Package,
  Pill,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Tag,
  User,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import AssetsTable from "./AssetsTable";
import InventoryMedicineView from "./InventoryMedicineView";

const inventoryCategories = [
  { id: "All", label: "All Items", icon: Boxes },
  { id: "Medicine", label: "Medicine", icon: Pill },
  { id: "Assets", label: "Assets", icon: ShieldCheck },
];

/* =========================================================
   STATUS STYLES & BADGES
========================================================= */

const statusStyles = {
  Available: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  Operational: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  "In Use": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: Activity,
  },
  "Low Stock": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: AlertTriangle,
  },
  "Under Maintenance": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: Wrench,
  },
  Standby: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    icon: Clock3,
  },
  "Out of Stock": {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: XCircle,
  },
  Decommissioned: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: Archive,
  },
  Inactive: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: Archive,
  },
};

const StatusBadge = ({ status }) => {
  const config =
    statusStyles[status] || statusStyles.Available || statusStyles.Inactive;
  const Icon = config.icon || CheckCircle2;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <Icon size={13} />
      {status || "Available"}
    </span>
  );
};

const ConditionBadge = ({ condition }) => {
  const styles = {
    Good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Fair: "bg-blue-50 text-blue-700 border-blue-200",
    "Needs Repair": "bg-amber-50 text-amber-700 border-amber-200",
    Damaged: "bg-red-50 text-red-700 border-red-200",
    "Under Maintenance": "bg-amber-50 text-amber-700 border-amber-200",
    Expired: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[condition] || "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {condition || "Good"}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  if (type === "Medicine") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
        <Pill size={12} />
        Medicine
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
      <ShieldCheck size={12} />
      Asset
    </span>
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
    <div className="min-w-0 rounded-lg border border-[#E2EFED] bg-white px-2 py-1.5 shadow-sm transition hover:shadow-md sm:rounded-xl sm:px-2.5 sm:py-2.5 md:rounded-2xl md:px-4 md:py-4">
      <div className="flex items-center justify-between gap-1.5">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md sm:h-7 sm:w-7 sm:rounded-lg md:h-10 md:w-10 md:rounded-xl ${
            iconClasses[type]
          } [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5`}
        >
          <Icon />
        </span>
        <strong className="text-base font-bold leading-none text-[#073F42] sm:text-lg md:text-2xl">
          {value}
        </strong>
      </div>
      <p className="mt-1 truncate text-[9px] font-semibold text-[#819596] sm:mt-1.5 sm:text-[10px] md:mt-2 md:text-xs">
        {title}
      </p>
      {subtitle && (
        <p className="mt-0.5 hidden truncate text-[9px] text-[#9AAEAF] sm:block sm:text-[10px]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All"); // "All", "Medicine", "Assets"
  const [typeFilter, setTypeFilter] = useState("All"); // "All", "Medicine", "Asset"
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [medData, assetData] = await Promise.all([
          apiRequest("/api/medicines"),
          apiRequest("/api/assets"),
        ]);
        if (Array.isArray(medData)) setMedicines(medData);
        if (Array.isArray(assetData)) setAssets(assetData);
      } catch (err) {
        console.error("Failed to load inventory data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* =======================================================
     UNIFIED ALL ITEMS (MEDICINE + ASSETS)
  ======================================================= */

  const allItems = useMemo(() => {
    const medList = (medicines || []).map((m) => {
      const isLow = m.quantity > 0 && m.quantity <= (m.reorder_level || 20);
      const isOut = m.quantity <= 0;
      let status =
        m.status || (isOut ? "Out of Stock" : isLow ? "Low Stock" : "Available");
      const unitPrice = Number(m.selling_price || m.purchase_price) || 0;
      const totalVal =
        (Number(m.quantity) || 0) *
        (Number(m.purchase_price || m.selling_price) || 0);

      return {
        id: `med-${m.id}`,
        rawId: m.id,
        itemType: "Medicine",
        code: m.medicine_code || `MED-${String(m.id).padStart(3, "0")}`,
        name: m.medicine_name,
        subtitle: m.generic_name || m.manufacturer || "Pharmaceutical",
        category: m.category || "General Medicine",
        department: "Pharmacy",
        quantity: Number(m.quantity) || 0,
        unit: m.unit || m.medicine_type || "Unit",
        price: unitPrice,
        totalValue: totalVal,
        location: m.storage_location || "Pharmacy Store",
        supplierOrPerson: m.manufacturer || "Hospital Pharmacy",
        batch: m.batch_number || "-",
        expiry: m.expiry_date || "",
        condition: isOut ? "Out of Stock" : isLow ? "Low Stock" : "Good",
        status,
        original: m,
      };
    });

    const astList = (assets || []).map((a) => {
      const cost = Number(a.purchase_cost) || 0;
      return {
        id: `ast-${a.id}`,
        rawId: a.id,
        itemType: "Asset",
        code: a.asset_code || `AST-${String(a.id).padStart(3, "0")}`,
        name: a.name,
        subtitle:
          [a.model_number, a.serial_number].filter(Boolean).join(" • ") ||
          a.department,
        category: a.category || "Hospital Asset",
        department: a.department || "General Ward",
        quantity: 1,
        unit: "Unit",
        price: cost,
        totalValue: cost,
        location: a.location || a.department || "Hospital Premises",
        supplierOrPerson: a.assigned_to
          ? `Assigned: ${a.assigned_to}`
          : "Hospital Central",
        batch: a.serial_number || "-",
        expiry: a.warranty_expiry || a.next_maintenance || "",
        condition: a.condition || "Good",
        status: a.status || "Operational",
        original: a,
      };
    });

    return [...medList, ...astList];
  }, [medicines, assets]);

  /* =======================================================
     DEPARTMENTS LIST
  ======================================================= */

  const departmentOptions = useMemo(() => {
    const depts = new Set(allItems.map((i) => i.department).filter(Boolean));
    return ["All Departments", ...Array.from(depts)];
  }, [allItems]);

  /* =======================================================
     FILTERED ITEMS (FOR "ALL ITEMS" VIEW)
  ======================================================= */

  const filteredAllItems = useMemo(() => {
    return allItems.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (item.name || "").toLowerCase().includes(q) ||
        (item.code || "").toLowerCase().includes(q) ||
        (item.subtitle || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q) ||
        (item.department || "").toLowerCase().includes(q) ||
        (item.location || "").toLowerCase().includes(q) ||
        (item.supplierOrPerson || "").toLowerCase().includes(q);

      const matchesType = typeFilter === "All" || item.itemType === typeFilter;

      const matchesDepartment =
        departmentFilter === "All Departments" ||
        item.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter ||
        (statusFilter === "Available" &&
          (item.status === "Available" ||
            item.status === "Operational" ||
            item.status === "In Use")) ||
        (statusFilter === "Low Stock" &&
          (item.status === "Low Stock" ||
            item.status === "Under Maintenance")) ||
        (statusFilter === "Out of Stock" &&
          (item.status === "Out of Stock" ||
            item.status === "Decommissioned"));

      return matchesSearch && matchesType && matchesDepartment && matchesStatus;
    });
  }, [allItems, search, typeFilter, departmentFilter, statusFilter]);

  /* =======================================================
     STATS (COMBINED MEDICINE + ASSETS)
  ======================================================= */

  const stats = useMemo(() => {
    const totalItems = allItems.length;

    const availableItems = allItems.filter(
      (item) =>
        item.status === "Available" ||
        item.status === "Operational" ||
        item.status === "In Use"
    ).length;

    const lowStock = allItems.filter(
      (item) =>
        item.status === "Low Stock" ||
        item.status === "Under Maintenance" ||
        item.status === "Standby"
    ).length;

    const outOfStock = allItems.filter(
      (item) =>
        item.status === "Out of Stock" ||
        item.status === "Decommissioned"
    ).length;

    const damaged = allItems.filter(
      (item) =>
        (item.condition || "").toLowerCase().includes("damaged") ||
        (item.condition || "").toLowerCase().includes("repair")
    ).length;

    const now = new Date();
    const in90Days = new Date();
    in90Days.setDate(now.getDate() + 90);

    const expired = allItems.filter((item) => {
      if ((item.condition || "").toLowerCase() === "expired") return true;
      if (item.expiry) {
        const exp = new Date(item.expiry);
        return !isNaN(exp.getTime()) && exp < now;
      }
      return false;
    }).length;

    const expiringItems = allItems.filter((item) => {
      if (item.expiry) {
        const exp = new Date(item.expiry);
        return !isNaN(exp.getTime()) && exp >= now && exp <= in90Days;
      }
      return false;
    }).length;

    const inventoryValue = allItems.reduce(
      (total, item) => total + (Number(item.totalValue) || 0),
      0
    );

    return {
      totalItems,
      availableItems,
      lowStock,
      outOfStock,
      damaged,
      expired,
      expiringItems,
      inventoryValue,
    };
  }, [allItems]);

  /* =======================================================
     EXPORT ACTUAL DATA
  ======================================================= */

  const handleExport = () => {
    let headers = [];
    let rows = [];
    let filename = "hospital-inventory-export.csv";
    const dateStr = new Date().toISOString().slice(0, 10);

    if (categoryFilter === "Assets") {
      filename = `hospital-assets-${dateStr}.csv`;
      headers = [
        "Asset Code",
        "Asset Name",
        "Category",
        "Department",
        "Model Number",
        "Serial Number",
        "Location",
        "Purchase Cost (INR)",
        "Purchase Date",
        "Warranty Expiry",
        "Next Maintenance",
        "Assigned To",
        "Condition",
        "Status",
        "Notes",
      ];
      rows = assets.map((a) => [
        a.asset_code || "",
        a.name || "",
        a.category || "",
        a.department || "",
        a.model_number || "",
        a.serial_number || "",
        a.location || "",
        a.purchase_cost ?? "",
        a.purchase_date || "",
        a.warranty_expiry || "",
        a.next_maintenance || "",
        a.assigned_to || "",
        a.condition || "",
        a.status || "",
        a.notes || "",
      ]);
    } else if (categoryFilter === "Medicine") {
      filename = `hospital-pharmacy-${dateStr}.csv`;
      headers = [
        "Medicine Code",
        "Medicine Name",
        "Generic Name",
        "Category",
        "Type",
        "Unit",
        "Quantity",
        "Reorder Level",
        "Purchase Price (INR)",
        "Selling Price (INR)",
        "Storage Location",
        "Batch Number",
        "Expiry Date",
        "Prescription Required",
        "Status",
      ];
      rows = medicines.map((m) => [
        m.medicine_code || "",
        m.medicine_name || "",
        m.generic_name || "",
        m.category || "",
        m.medicine_type || "",
        m.unit || "",
        m.quantity ?? "",
        m.reorder_level ?? "",
        m.purchase_price ?? "",
        m.selling_price ?? "",
        m.storage_location || "",
        m.batch_number || "",
        m.expiry_date || "",
        m.prescription_required ? "Yes" : "No",
        m.status || "",
      ]);
    } else {
      filename = `hospital-inventory-all-items-${dateStr}.csv`;
      headers = [
        "Type",
        "Item Code",
        "Name",
        "Details",
        "Category",
        "Department",
        "Quantity",
        "Unit",
        "Unit Price / Cost (INR)",
        "Total Value (INR)",
        "Location",
        "Supplier / In-Charge",
        "Batch / Serial",
        "Condition",
        "Status",
        "Expiry / Warranty Date",
      ];
      const dataToExport =
        filteredAllItems.length > 0 ? filteredAllItems : allItems;
      rows = dataToExport.map((item) => [
        item.itemType,
        item.code,
        item.name,
        item.subtitle,
        item.category,
        item.department,
        item.quantity,
        item.unit,
        item.price,
        item.totalValue,
        item.location,
        item.supplierOrPerson,
        item.batch,
        item.condition,
        item.status,
        item.expiry,
      ]);
    }

    if (rows.length === 0) {
      showToast("No data available to export.", "error");
      return;
    }

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((val) => {
            const str = String(val ?? "").replaceAll('"', '""');
            return `"${str}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showToast(`Exported ${rows.length} records to ${filename}`);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          PAGE HEADING
      =================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0] sm:h-11 sm:w-11">
              <Boxes className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#073F42] sm:text-2xl md:text-3xl">
                Inventory
              </h1>

              <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">
                Unified inventory management for hospital medicines and medical assets
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#D9E9E7] bg-white px-3 text-xs font-semibold text-[#31585A] shadow-sm transition hover:border-[#08A6A0] hover:text-[#078F8A] sm:h-11 sm:px-4 sm:text-sm"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="space-y-6">
        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            subtitle="Medicines & Hospital Assets"
            icon={Package}
          />

          <StatCard
            title="Available Items"
            value={stats.availableItems}
            subtitle="Operational & in stock"
            icon={CheckCircle2}
            type="success"
          />

          <StatCard
            title="Low Stock / Alert"
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
            title="Expiring / Due Soon"
            value={stats.expiringItems}
            subtitle="Within next 90 days"
            icon={Clock3}
            type="purple"
          />

          <StatCard
            title="Expired / Outdated"
            value={stats.expired}
            subtitle="Require removal or check"
            icon={Archive}
            type="danger"
          />

          <StatCard
            title="Needs Inspection"
            value={stats.damaged}
            subtitle="Fair or repair condition"
            icon={AlertTriangle}
            type="warning"
          />

          <StatCard
            title="Total Inventory Value"
            value={`₹${(stats.inventoryValue || 0).toLocaleString("en-IN")}`}
            subtitle="Total medicines & assets"
            icon={ClipboardList}
            type="blue"
          />
        </div>

        {/* =================================================
            Navigation Tabs
        ================================================= */}
        <nav className="hide-scrollbar mb-6 mt-6 flex select-none gap-2 overflow-x-auto rounded-2xl border border-[#E2EFED] bg-white p-2 shadow-sm">
          {inventoryCategories.map(({ id, label, icon: Icon }) => {
            const isActive = categoryFilter === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategoryFilter(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#08A6A0] text-white shadow-sm"
                    : "text-[#31585A] hover:bg-[#E8F8F6] hover:text-[#078F8A]"
                }`}
              >
                <Icon size={17} />
                {label}
                {id === "All" && (
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#E8F8F6] text-[#08A6A0]"
                    }`}
                  >
                    {allItems.length}
                  </span>
                )}
                {id === "Medicine" && (
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#E8F8F6] text-[#08A6A0]"
                    }`}
                  >
                    {medicines.length}
                  </span>
                )}
                {id === "Assets" && (
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#E8F8F6] text-[#08A6A0]"
                    }`}
                  >
                    {assets.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* =================================================
            VIEW: ASSETS TAB
        ================================================= */}
        {categoryFilter === "Assets" && (
          <div className="mt-6">
            <AssetsTable
              assets={assets}
              setAssets={setAssets}
              showToast={showToast}
            />
          </div>
        )}

        {/* =================================================
            VIEW: MEDICINE TAB
        ================================================= */}
        {categoryFilter === "Medicine" && (
          <div className="mt-6">
            <InventoryMedicineView medicines={medicines} />
          </div>
        )}

        {/* =================================================
            VIEW: ALL ITEMS (MEDICINE + ASSETS)
        ================================================= */}
        {categoryFilter === "All" && (
          <>
            {/* SEARCH + FILTER TOOLBAR */}
            <div className="mt-6 rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AAEAF]"
                  />

                  <input
                    type="text"
                    placeholder="Search medicines or assets by name, code, model, department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-[#FBFDFD] py-3 pl-11 pr-4 text-sm text-[#173F41] outline-none transition placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
                  />
                </div>

                {/* TYPE FILTER */}
                <div className="relative min-w-[150px]">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white px-4 py-3 pr-10 text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
                  >
                    <option value="All">All Types</option>
                    <option value="Medicine">Medicine ({medicines.length})</option>
                    <option value="Asset">Asset ({assets.length})</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#819596]"
                  />
                </div>

                {/* DEPARTMENT FILTER */}
                <div className="relative min-w-[190px]">
                  <Building2
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#819596]"
                  />

                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white py-3 pl-11 pr-10 text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#819596]"
                  />
                </div>

                {/* STATUS FILTER */}
                <div className="relative min-w-[170px]">
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
                    <option value="Available">Available / Operational</option>
                    <option value="In Use">In Use</option>
                    <option value="Low Stock">Low Stock / Maintenance</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#819596]"
                  />
                </div>

                {/* RESET */}
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("All");
                    setDepartmentFilter("All Departments");
                    setStatusFilter("All");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] px-4 py-3 text-sm font-semibold text-[#31585A] transition hover:border-[#08A6A0] hover:text-[#078F8A]"
                >
                  <RefreshCw size={17} />
                  Reset
                </button>
              </div>
            </div>

            {/* ALL ITEMS TABLE */}
            <div
              id="inventory-items"
              className="mt-6 scroll-mt-6 overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm"
            >
              <div className="flex flex-col gap-3 border-b border-[#EAF2F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-[#073F42]">
                    Unified Hospital Inventory
                  </h2>
                  <p className="mt-1 text-xs text-[#819596]">
                    Showing {filteredAllItems.length} of {allItems.length} records (Medicines & Assets)
                  </p>
                </div>
              </div>

              {/* DESKTOP TABLE */}
              <div className="hide-scrollbar hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="border-b border-[#EAF2F0] bg-[#FBFDFD] text-left">
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                        Item & Code
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                        Type
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                        Category & Dept
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                        Stock / Qty
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                        Price / Valuation
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                        Location
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#819596]">
                        Status
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#819596]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EAF2F0]">
                    {filteredAllItems.map((item) => {
                      const isMed = item.itemType === "Medicine";
                      return (
                        <tr
                          key={item.id}
                          className="transition hover:bg-[#FBFDFD]"
                        >
                          {/* Item & Code */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                  isMed
                                    ? "bg-teal-50 text-teal-600"
                                    : "bg-sky-50 text-sky-600"
                                }`}
                              >
                                {isMed ? <Pill size={19} /> : <ShieldCheck size={19} />}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-[#173F41]">
                                  {item.name}
                                </p>
                                <p className="mt-0.5 text-xs text-[#9AAEAF]">
                                  {item.code}
                                  {item.subtitle && ` • ${item.subtitle}`}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-5 py-4">
                            <TypeBadge type={item.itemType} />
                          </td>

                          {/* Category & Department */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-[#31585A]">
                              {item.category}
                            </p>
                            <p className="mt-0.5 text-xs text-[#9AAEAF]">
                              {item.department}
                            </p>
                          </td>

                          {/* Stock / Quantity */}
                          <td className="px-5 py-4">
                            <p className="font-bold text-[#173F41]">
                              {item.quantity} {item.unit}
                            </p>
                            <p className="mt-0.5 text-xs text-[#9AAEAF]">
                              {isMed ? "Available Stock" : "Asset Registry"}
                            </p>
                          </td>

                          {/* Price / Valuation */}
                          <td className="px-5 py-4">
                            <p className="font-bold text-[#173F41]">
                              ₹{(item.totalValue || 0).toLocaleString("en-IN")}
                            </p>
                            <p className="mt-0.5 text-xs text-[#9AAEAF]">
                              {isMed
                                ? `₹${item.price.toLocaleString("en-IN")} / ${item.unit}`
                                : "Purchase Cost"}
                            </p>
                          </td>

                          {/* Location */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-[#31585A]">
                              <MapPin size={14} className="shrink-0 text-[#819596]" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <StatusBadge status={item.status} />
                          </td>

                          {/* Action */}
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              title="View Details"
                              onClick={() => setSelectedItem(item)}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#08A6A0] hover:bg-[#E8F8F6]"
                            >
                              <Eye size={15} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-[#EAF2F0] lg:hidden">
                {filteredAllItems.map((item) => {
                  const isMed = item.itemType === "Medicine";
                  return (
                    <div key={item.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isMed
                                ? "bg-teal-50 text-teal-600"
                                : "bg-sky-50 text-sky-600"
                            }`}
                          >
                            {isMed ? <Pill size={19} /> : <ShieldCheck size={19} />}
                          </div>

                          <div>
                            <p className="font-semibold text-[#173F41]">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#9AAEAF]">
                              {item.code} • {item.department}
                            </p>
                          </div>
                        </div>

                        <TypeBadge type={item.itemType} />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-[#F8FCFB] p-2">
                          <span className="text-[#819596]">Quantity:</span>
                          <p className="font-bold text-[#173F41]">
                            {item.quantity} {item.unit}
                          </p>
                        </div>

                        <div className="rounded-lg bg-[#F8FCFB] p-2">
                          <span className="text-[#819596]">Valuation:</span>
                          <p className="font-bold text-[#173F41]">
                            ₹{(item.totalValue || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <StatusBadge status={item.status} />

                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#08A6A0] hover:bg-[#E8F8F6]"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EMPTY STATE */}
              {filteredAllItems.length === 0 && (
                <div className="px-5 py-16 text-center">
                  <Package size={42} className="mx-auto text-[#9AAEAF]" />
                  <h3 className="mt-4 font-bold text-[#073F42]">
                    No items found
                  </h3>
                  <p className="mt-1 text-sm text-[#819596]">
                    Try changing your search query or filters.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ===================================================
          ITEM DETAIL MODAL
      =================================================== */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EAF2F0] px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    selectedItem.itemType === "Medicine"
                      ? "bg-teal-50 text-teal-600"
                      : "bg-sky-50 text-sky-600"
                  }`}
                >
                  {selectedItem.itemType === "Medicine" ? (
                    <Pill size={22} />
                  ) : (
                    <ShieldCheck size={22} />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#073F42]">
                      {selectedItem.name}
                    </h2>
                    <TypeBadge type={selectedItem.itemType} />
                  </div>
                  <p className="text-xs text-[#819596]">
                    {selectedItem.code} • {selectedItem.department}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl p-2 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#078F8A]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[calc(92vh-140px)] space-y-5 overflow-y-auto p-6">
              {/* Top Highlights */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3 text-center">
                  <p className="text-xs text-[#819596]">Quantity</p>
                  <p className="mt-1 text-base font-bold text-[#073F42]">
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3 text-center">
                  <p className="text-xs text-[#819596]">Unit Price</p>
                  <p className="mt-1 text-base font-bold text-[#073F42]">
                    ₹{(selectedItem.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3 text-center">
                  <p className="text-xs text-[#819596]">Total Value</p>
                  <p className="mt-1 text-base font-bold text-[#08A6A0]">
                    ₹{(selectedItem.totalValue || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2EFED] bg-[#FBFDFD] p-3 text-center">
                  <p className="text-xs text-[#819596]">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedItem.status} />
                  </div>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E2EFED] bg-white p-3">
                  <span className="text-xs text-[#819596]">Category</span>
                  <p className="mt-1 text-sm font-semibold text-[#173F41]">
                    {selectedItem.category}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2EFED] bg-white p-3">
                  <span className="text-xs text-[#819596]">Department</span>
                  <p className="mt-1 text-sm font-semibold text-[#173F41]">
                    {selectedItem.department}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2EFED] bg-white p-3">
                  <span className="text-xs text-[#819596]">Storage Location</span>
                  <p className="mt-1 text-sm font-semibold text-[#173F41]">
                    {selectedItem.location || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2EFED] bg-white p-3">
                  <span className="text-xs text-[#819596]">
                    {selectedItem.itemType === "Medicine"
                      ? "Manufacturer"
                      : "Assigned Personnel"}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-[#173F41]">
                    {selectedItem.supplierOrPerson || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2EFED] bg-white p-3">
                  <span className="text-xs text-[#819596]">
                    {selectedItem.itemType === "Medicine"
                      ? "Batch Number"
                      : "Serial Number"}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-[#173F41]">
                    {selectedItem.batch || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2EFED] bg-white p-3">
                  <span className="text-xs text-[#819596]">
                    {selectedItem.itemType === "Medicine"
                      ? "Expiry Date"
                      : "Warranty / Maintenance"}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-[#173F41]">
                    {selectedItem.expiry || "N/A"}
                  </p>
                </div>
              </div>

              {/* Medicine specific details */}
              {selectedItem.itemType === "Medicine" && selectedItem.original && (
                <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 text-xs">
                  <p className="font-semibold text-teal-800">Pharmaceutical Specs:</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-teal-900">
                    <div>Generic Name: <strong>{selectedItem.original.generic_name || "N/A"}</strong></div>
                    <div>Dosage: <strong>{selectedItem.original.dosage || "N/A"}</strong></div>
                    <div>Prescription: <strong>{selectedItem.original.prescription_required ? "Required" : "Not Required"}</strong></div>
                    <div>Reorder Level: <strong>{selectedItem.original.reorder_level || "20"}</strong></div>
                  </div>
                </div>
              )}

              {/* Asset specific details */}
              {selectedItem.itemType === "Asset" && selectedItem.original && (
                <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 text-xs">
                  <p className="font-semibold text-sky-800">Asset Specifications:</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sky-900">
                    <div>Model: <strong>{selectedItem.original.model_number || "N/A"}</strong></div>
                    <div>Purchase Date: <strong>{selectedItem.original.purchase_date || "N/A"}</strong></div>
                    <div>Next Maintenance: <strong>{selectedItem.original.next_maintenance || "N/A"}</strong></div>
                    <div>Condition: <strong>{selectedItem.original.condition || "Good"}</strong></div>
                  </div>
                  {selectedItem.original.notes && (
                    <p className="mt-2 text-sky-700 italic">Notes: {selectedItem.original.notes}</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#EAF2F0] px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  const targetCat =
                    selectedItem.itemType === "Medicine" ? "Medicine" : "Assets";
                  setCategoryFilter(targetCat);
                  setSelectedItem(null);
                }}
                className="text-xs font-semibold text-[#08A6A0] hover:underline"
              >
                Open in {selectedItem.itemType} View &rarr;
              </button>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-[#D9E9E7] px-4 py-2 text-xs font-semibold text-[#31585A] hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
            toast.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Inventory;