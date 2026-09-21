import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { apiRequest } from "../../../api/api";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

const assetCategories = [
  "Diagnostic Equipment",
  "Life Support & ICU",
  "Patient Monitoring",
  "Surgical & OT",
  "Hospital Furniture",
  "Laboratory Equipment",
  "Emergency & Transport",
  "Other",
];

const departments = [
  "All Departments",
  "ICU",
  "Cardiology",
  "Radiology",
  "Emergency",
  "Operation Theatre",
  "General Ward",
  "Laboratory",
];

const emptyAssetForm = {
  asset_code: "",
  name: "",
  category: "Diagnostic Equipment",
  department: "General Ward",
  model_number: "",
  serial_number: "",
  location: "",
  purchase_cost: "",
  purchase_date: "",
  warranty_expiry: "",
  next_maintenance: "",
  assigned_to: "",
  condition: "Good",
  status: "Operational",
  notes: "",
};

export default function AssetsTable({ assets, setAssets, showToast }) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [form, setForm] = useState(emptyAssetForm);

  // Statistics
  const stats = useMemo(() => {
    const total = assets.length;
    const operational = assets.filter((a) => a.status === "Operational").length;
    const inUse = assets.filter((a) => a.status === "In Use").length;
    const underMaintenance = assets.filter(
      (a) =>
        a.status === "Under Maintenance" ||
        a.condition === "Under Maintenance" ||
        a.condition === "Needs Calibration"
    ).length;
    const totalValuation = assets.reduce(
      (sum, a) => sum + (Number(a.purchase_cost) || 0),
      0
    );

    return { total, operational, inUse, underMaintenance, totalValuation };
  }, [assets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (asset.name || "").toLowerCase().includes(q) ||
        (asset.asset_code || "").toLowerCase().includes(q) ||
        (asset.serial_number || "").toLowerCase().includes(q) ||
        (asset.model_number || "").toLowerCase().includes(q) ||
        (asset.assigned_to || "").toLowerCase().includes(q);

      const matchesDept =
        departmentFilter === "All Departments" ||
        asset.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || asset.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || asset.category === categoryFilter;

      return matchesSearch && matchesDept && matchesStatus && matchesCategory;
    });
  }, [assets, search, departmentFilter, statusFilter, categoryFilter]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditingAsset(null);
    const nextNum = assets.length + 1;
    setForm({
      ...emptyAssetForm,
      asset_code: `AST-${String(nextNum).padStart(3, "0")}`,
      purchase_date: new Date().toISOString().slice(0, 10),
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (asset) => {
    setEditingAsset(asset);
    setForm({
      asset_code: asset.asset_code || "",
      name: asset.name || "",
      category: asset.category || "Diagnostic Equipment",
      department: asset.department || "General Ward",
      model_number: asset.model_number || "",
      serial_number: asset.serial_number || "",
      location: asset.location || "",
      purchase_cost: asset.purchase_cost ?? "",
      purchase_date: asset.purchase_date || "",
      warranty_expiry: asset.warranty_expiry || "",
      next_maintenance: asset.next_maintenance || "",
      assigned_to: asset.assigned_to || "",
      condition: asset.condition || "Good",
      status: asset.status || "Operational",
      notes: asset.notes || "",
    });
    setShowAddModal(true);
  };

  const handleSubmitAsset = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast?.("Please enter an asset name", "error");
      return;
    }

    const payload = {
      ...form,
      purchase_cost: Number(form.purchase_cost) || 0,
    };

    if (editingAsset) {
      const assetId = editingAsset.id;
      try {
        const updated = await apiRequest(`/api/assets/${assetId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setAssets((prev) =>
          prev.map((a) => (a.id === assetId ? { ...a, ...updated } : a))
        );
        showToast?.("Asset updated successfully!", "success");
      } catch (err) {
        console.error("Failed to update asset on server:", err);
        setAssets((prev) =>
          prev.map((a) => (a.id === assetId ? { ...a, ...payload } : a))
        );
        showToast?.("Asset updated locally", "success");
      }
    } else {
      try {
        const created = await apiRequest("/api/assets", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setAssets((prev) => [created, ...prev]);
        showToast?.("New asset added successfully!", "success");
      } catch (err) {
        console.error("Failed to add asset on server:", err);
        const fallback = {
          id: Date.now(),
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setAssets((prev) => [fallback, ...prev]);
        showToast?.("Asset added successfully!", "success");
      }
    }

    setShowAddModal(false);
    setEditingAsset(null);
    setForm(emptyAssetForm);
  };

  const confirmDeleteAsset = async () => {
    if (!assetToDelete) return;
    const assetId = assetToDelete.id;

    try {
      await apiRequest(`/api/assets/${assetId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete asset on server:", err);
    }

    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    setAssetToDelete(null);
    showToast?.("Asset removed successfully", "success");
  };

  const handleExportCSV = () => {
    const headers = [
      "Asset Code",
      "Name",
      "Category",
      "Department",
      "Location",
      "Model",
      "Serial Number",
      "Cost",
      "Purchase Date",
      "Next Maintenance",
      "Condition",
      "Status",
    ];

    const rows = filteredAssets.map((a) => [
      a.asset_code,
      a.name,
      a.category,
      a.department,
      a.location,
      a.model_number,
      a.serial_number,
      a.purchase_cost,
      a.purchase_date,
      a.next_maintenance,
      a.condition,
      a.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((val) => `"${val || ""}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `hospital_assets_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadge = (status) => {
    const config =
      {
        Operational: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "In Use": "bg-blue-50 text-blue-700 border-blue-200",
        "Under Maintenance": "bg-amber-50 text-amber-700 border-amber-200",
        Standby: "bg-purple-50 text-purple-700 border-purple-200",
        Decommissioned: "bg-slate-100 text-slate-600 border-slate-200",
      }[status] || "bg-slate-100 text-slate-600 border-slate-200";

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
        {status || "Operational"}
      </span>
    );
  };

  const conditionBadge = (condition) => {
    const config =
      {
        Good: "text-emerald-700 bg-emerald-50",
        "Needs Calibration": "text-blue-700 bg-blue-50",
        "Under Maintenance": "text-amber-700 bg-amber-50",
        Damaged: "text-rose-700 bg-rose-50",
      }[condition] || "text-slate-700 bg-slate-50";

    return (
      <span
        className={`rounded-lg px-2 py-0.5 text-[11px] font-medium ${config}`}
      >
        {condition || "Good"}
      </span>
    );
  };

  return (
    <div>
      {/* HEADER ACTIONS */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#073F42] sm:text-2xl">
            Assets Management
          </h2>
          <p className="mt-0.5 text-xs text-[#789092] sm:text-sm">
            Check and register hospital medical equipment, devices, machinery and furniture
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-[#D9E9E7] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#31585A] shadow-sm hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
          >
            <Download size={15} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F8A]"
          >
            <Plus size={16} />
            Add Asset
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-5">
        <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#819596]">Total Assets</p>
              <h3 className="text-xl font-bold text-[#073F42]">{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#819596]">Operational</p>
              <h3 className="text-xl font-bold text-emerald-700">{stats.operational}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#819596]">In Active Use</p>
              <h3 className="text-xl font-bold text-blue-700">{stats.inUse}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Wrench size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#819596]">Maintenance</p>
              <h3 className="text-xl font-bold text-amber-700">{stats.underMaintenance}</h3>
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#078F8A]">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#819596]">Asset Valuation</p>
              <h3 className="text-lg font-bold text-[#073F42]">
                ₹{stats.totalValuation.toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="mb-6 rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AAEAF]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search asset name, code, model, serial or in-charge..."
              className="w-full rounded-xl border border-[#D9E9E7] bg-[#FBFDFD] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#173F41] outline-none placeholder:text-[#9AAEAF] focus:border-[#08A6A0] focus:ring-2 focus:ring-[#E8F8F6]"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Department Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white py-2.5 pl-3 pr-8 text-xs sm:text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#819596]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white py-2.5 pl-3 pr-8 text-xs sm:text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
              >
                <option value="All">All Statuses</option>
                <option value="Operational">Operational</option>
                <option value="In Use">In Use</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Standby">Standby</option>
                <option value="Decommissioned">Decommissioned</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#819596]"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[170px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white py-2.5 pl-3 pr-8 text-xs sm:text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
              >
                <option value="All">All Categories</option>
                {assetCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#819596]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDepartmentFilter("All Departments");
                setStatusFilter("All");
                setCategoryFilter("All");
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-[#D9E9E7] px-3 py-2 text-xs font-semibold text-[#31585A] hover:border-[#08A6A0] hover:text-[#078F8A]"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ASSETS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAF2F0] px-5 py-4">
          <div>
            <h3 className="font-bold text-[#073F42]">Asset Inventory & Registry</h3>
            <p className="text-xs text-[#819596]">
              Showing {filteredAssets.length} of {assets.length} registered hospital assets
            </p>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EAF2F0] bg-[#FBFDFD] text-[11px] font-bold uppercase tracking-wider text-[#819596]">
                <th className="px-5 py-3.5">Asset Code & Name</th>
                <th className="px-5 py-3.5">Category & Dept</th>
                <th className="px-5 py-3.5">Model / Serial</th>
                <th className="px-5 py-3.5">Cost</th>
                <th className="px-5 py-3.5">Next Service</th>
                <th className="px-5 py-3.5">Condition</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAF2F0] text-sm">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-12 text-center text-sm text-[#819596]"
                  >
                    No assets found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="transition hover:bg-[#FBFDFD]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-[#173F41]">
                            {asset.name}
                          </p>
                          <p className="text-xs font-mono text-[#9AAEAF]">
                            {asset.asset_code}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-[#31585A]">
                        {asset.category}
                      </p>
                      <p className="text-[11px] text-[#9AAEAF]">
                        {asset.department} • {asset.location || "Main Building"}
                      </p>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-[#31585A]">
                        {asset.model_number || "-"}
                      </p>
                      <p className="text-[11px] font-mono text-[#9AAEAF]">
                        {asset.serial_number || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-[#173F41]">
                        ₹{(Number(asset.purchase_cost) || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-[#9AAEAF]">
                        Pur: {asset.purchase_date || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-[#31585A]">
                        <Calendar size={13} className="text-[#819596]" />
                        {asset.next_maintenance || "Scheduled"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      {conditionBadge(asset.condition)}
                    </td>

                    <td className="px-5 py-3.5">{statusBadge(asset.status)}</td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="View Details"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowViewModal(true);
                          }}
                          className="rounded-lg p-1.5 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          title="Edit Asset"
                          onClick={() => handleOpenEdit(asset)}
                          className="rounded-lg p-1.5 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete Asset"
                          onClick={() => setAssetToDelete(asset)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="divide-y divide-[#EAF2F0] lg:hidden">
          {filteredAssets.length === 0 ? (
            <p className="p-8 text-center text-sm text-[#819596]">
              No assets found.
            </p>
          ) : (
            filteredAssets.map((asset) => (
              <div key={asset.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#173F41]">
                        {asset.name}
                      </h4>
                      <p className="text-xs font-mono text-[#9AAEAF]">
                        {asset.asset_code}
                      </p>
                    </div>
                  </div>
                  {statusBadge(asset.status)}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#FBFDFD] p-3 text-xs">
                  <div>
                    <span className="text-[#819596]">Category:</span>
                    <p className="font-medium text-[#31585A]">
                      {asset.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#819596]">Department:</span>
                    <p className="font-medium text-[#31585A]">
                      {asset.department}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#819596]">Cost:</span>
                    <p className="font-semibold text-[#173F41]">
                      ₹{(Number(asset.purchase_cost) || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#819596]">Condition:</span>
                    <div className="mt-0.5">{conditionBadge(asset.condition)}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#819596]">
                    Due: {asset.next_maintenance || "-"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedAsset(asset);
                        setShowViewModal(true);
                      }}
                      className="rounded-lg border border-[#D9E9E7] p-1.5 text-xs text-[#31585A]"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(asset)}
                      className="rounded-lg border border-[#D9E9E7] p-1.5 text-xs text-[#31585A]"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => setAssetToDelete(asset)}
                      className="rounded-lg border border-rose-200 p-1.5 text-xs text-rose-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD / EDIT ASSET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-3 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EAF2F0] px-5 py-4">
              <h3 className="text-base sm:text-lg font-bold text-[#073F42]">
                {editingAsset ? "Edit Asset Details" : "Add New Hospital Asset"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#073F42]"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmitAsset}
              className="max-h-[calc(92vh-75px)] overflow-y-auto p-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Asset Code *
                  </label>
                  <input
                    type="text"
                    name="asset_code"
                    required
                    value={form.asset_code}
                    onChange={handleFormChange}
                    placeholder="e.g. AST-008"
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Defibrillator Machine"
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  >
                    {assetCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  >
                    {departments
                      .filter((d) => d !== "All Departments")
                      .map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Model Number
                  </label>
                  <input
                    type="text"
                    name="model_number"
                    value={form.model_number}
                    onChange={handleFormChange}
                    placeholder="e.g. GE-Mac2000"
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serial_number"
                    value={form.serial_number}
                    onChange={handleFormChange}
                    placeholder="e.g. SN-88219"
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Physical Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleFormChange}
                    placeholder="e.g. Room 204, Block B"
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Purchase Cost (₹)
                  </label>
                  <input
                    type="number"
                    name="purchase_cost"
                    value={form.purchase_cost}
                    onChange={handleFormChange}
                    placeholder="e.g. 150000"
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    name="purchase_date"
                    value={form.purchase_date}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Next Maintenance / Service Date
                  </label>
                  <input
                    type="date"
                    name="next_maintenance"
                    value={form.next_maintenance}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Assigned Person / In-Charge
                  </label>
                  <input
                    type="text"
                    name="assigned_to"
                    value={form.assigned_to}
                    onChange={handleFormChange}
                    placeholder="e.g. Dr. Sen / Nurse Moumita"
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Operational Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  >
                    <option value="Operational">Operational</option>
                    <option value="In Use">In Use</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Standby">Standby</option>
                    <option value="Decommissioned">Decommissioned</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Physical Condition
                  </label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#D9E9E7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  >
                    <option value="Good">Good</option>
                    <option value="Needs Calibration">Needs Calibration</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Warranty Expiry Date
                  </label>
                  <input
                    type="date"
                    name="warranty_expiry"
                    value={form.warranty_expiry}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#D9E9E7] px-3.5 py-2.5 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-[#31585A]">
                    Operational Notes / Maintenance Log
                  </label>
                  <textarea
                    name="notes"
                    rows="2"
                    value={form.notes}
                    onChange={handleFormChange}
                    placeholder="Enter any maintenance notes, manufacturer remarks, or service history..."
                    className="w-full rounded-xl border border-[#D9E9E7] p-3 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2.5 border-t border-[#EAF2F0] pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-[#D9E9E7] px-4 py-2 text-xs sm:text-sm font-semibold text-[#31585A] hover:bg-[#F7FBFA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#08A6A0] px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#078F8A]"
                >
                  {editingAsset ? "Update Asset" : "Save Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ASSET MODAL */}
      {showViewModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-3 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EAF2F0] px-5 py-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#073F42]">
                  {selectedAsset.name}
                </h3>
                <p className="text-xs font-mono text-[#819596]">
                  {selectedAsset.asset_code} • {selectedAsset.department}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="rounded-lg p-1.5 text-[#819596] hover:bg-[#E8F8F6] hover:text-[#073F42]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(92vh-75px)] overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Category</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#173F41]">
                    {selectedAsset.category}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Department</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#173F41]">
                    {selectedAsset.department}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Location</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#173F41]">
                    {selectedAsset.location || "Not assigned"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Model & Serial</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#173F41]">
                    {selectedAsset.model_number || "-"} •{" "}
                    {selectedAsset.serial_number || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Purchase Cost</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-bold text-emerald-700">
                    ₹{(Number(selectedAsset.purchase_cost) || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Purchase Date</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#173F41]">
                    {selectedAsset.purchase_date || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">
                    Next Service / Calibration
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#173F41]">
                    {selectedAsset.next_maintenance || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Warranty Expiry</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#173F41]">
                    {selectedAsset.warranty_expiry || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">
                    Assigned In-Charge
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#173F41]">
                    {selectedAsset.assigned_to || "Unassigned"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Current Status</p>
                  <div className="mt-1">{statusBadge(selectedAsset.status)}</div>
                </div>
                <div className="col-span-2 rounded-xl border border-[#EAF2F0] bg-[#FBFEFD] p-3">
                  <p className="text-[11px] text-[#819596]">Condition & Notes</p>
                  <div className="mt-1 flex items-center gap-2">
                    {conditionBadge(selectedAsset.condition)}
                    <span className="text-xs text-[#31585A]">
                      {selectedAsset.notes || "No special notes recorded."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-[#EAF2F0] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    handleOpenEdit(selectedAsset);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#08A6A0] px-4 py-2 text-xs sm:text-sm font-semibold text-white"
                >
                  <Edit size={14} />
                  Edit Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        open={Boolean(assetToDelete)}
        title="Delete Hospital Asset"
        message={`Are you sure you want to decommission / delete asset "${assetToDelete?.name}" (${assetToDelete?.asset_code})? This action cannot be undone.`}
        confirmText="Delete Asset"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteAsset}
        onCancel={() => setAssetToDelete(null)}
      />
    </div>
  );
}
