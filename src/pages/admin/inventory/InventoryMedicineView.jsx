import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Filter,
  Package,
  Pill,
  RefreshCw,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryMedicineView({ medicines }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(medicines.map((m) => m.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [medicines]);

  const stats = useMemo(() => {
    const total = medicines.length;
    const available = medicines.filter((m) => m.quantity > (m.reorder_level || 20)).length;
    const lowStock = medicines.filter(
      (m) => m.quantity > 0 && m.quantity <= (m.reorder_level || 20)
    ).length;
    const outOfStock = medicines.filter((m) => m.quantity <= 0).length;
    const totalUnits = medicines.reduce((sum, m) => sum + (Number(m.quantity) || 0), 0);

    return { total, available, lowStock, outOfStock, totalUnits };
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (m.medicine_name || "").toLowerCase().includes(q) ||
        (m.medicine_code || "").toLowerCase().includes(q) ||
        (m.generic_name || "").toLowerCase().includes(q);

      const matchesCat =
        categoryFilter === "All" || m.category === categoryFilter;

      const isLow = m.quantity > 0 && m.quantity <= (m.reorder_level || 20);
      const isOut = m.quantity <= 0;
      const isAvail = m.quantity > (m.reorder_level || 20);

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "Available" && isAvail) ||
        (stockFilter === "Low Stock" && isLow) ||
        (stockFilter === "Out of Stock" && isOut);

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [medicines, search, categoryFilter, stockFilter]);

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#073F42] sm:text-2xl">
            Medicine & Pharmaceutical Stock
          </h2>
          <p className="mt-0.5 text-xs text-[#789092] sm:text-sm">
            Overview of prescription drugs, tablets, syrups, and pharmaceutical inventory
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/pharmacy")}
          className="flex items-center gap-1.5 rounded-xl bg-[#08A6A0] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#078F8A]"
        >
          <Pill size={16} />
          Go to Pharmacy Management →
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#819596]">Total Medicines</p>
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
              <p className="text-xs font-semibold text-[#819596]">Available</p>
              <h3 className="text-xl font-bold text-emerald-700">{stats.available}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#819596]">Low Stock</p>
              <h3 className="text-xl font-bold text-amber-700">{stats.lowStock}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Pill size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#819596]">Total Units</p>
              <h3 className="text-xl font-bold text-[#073F42]">{stats.totalUnits.toLocaleString("en-IN")}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="mb-6 rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AAEAF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine name, code, generic formulation..."
              className="w-full rounded-xl border border-[#D9E9E7] bg-[#FBFDFD] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#173F41] outline-none focus:border-[#08A6A0]"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <div className="relative min-w-[150px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white py-2.5 pl-3 pr-8 text-xs sm:text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#819596]" />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#D9E9E7] bg-white py-2.5 pl-3 pr-8 text-xs sm:text-sm font-medium text-[#31585A] outline-none focus:border-[#08A6A0]"
              >
                <option value="All">All Stock Status</option>
                <option value="Available">Available</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#819596]" />
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("All");
                setStockFilter("All");
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-[#D9E9E7] px-3 py-2 text-xs font-semibold text-[#31585A] hover:border-[#08A6A0] hover:text-[#078F8A]"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* MEDICINES TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm">
        <div className="border-b border-[#EAF2F0] px-5 py-4">
          <h3 className="font-bold text-[#073F42]">Pharmaceutical Stock List</h3>
          <p className="text-xs text-[#819596]">
            Showing {filteredMedicines.length} of {medicines.length} medicine records
          </p>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EAF2F0] bg-[#FBFDFD] text-[11px] font-bold uppercase tracking-wider text-[#819596]">
                <th className="px-5 py-3.5">Medicine Name & Code</th>
                <th className="px-5 py-3.5">Category & Type</th>
                <th className="px-5 py-3.5">Dosage / Unit</th>
                <th className="px-5 py-3.5">Current Stock</th>
                <th className="px-5 py-3.5">Reorder Level</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAF2F0] text-sm">
              {filteredMedicines.map((med) => {
                const isLow = med.quantity > 0 && med.quantity <= (med.reorder_level || 20);
                const isOut = med.quantity <= 0;

                return (
                  <tr key={med.medicine_id || med.id} className="transition hover:bg-[#FBFDFD]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#08A6A0]">
                          <Pill size={17} />
                        </div>
                        <div>
                          <p className="font-semibold text-[#173F41]">{med.medicine_name}</p>
                          <p className="text-xs font-mono text-[#9AAEAF]">{med.medicine_code}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-[#31585A]">{med.category}</p>
                      <p className="text-[11px] text-[#9AAEAF]">{med.medicine_type || "Tablet"}</p>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-[#31585A]">{med.dosage || "-"}</p>
                      <p className="text-[11px] text-[#9AAEAF]">{med.unit || "Unit"}</p>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-[#173F41]">{med.quantity} {med.unit}</p>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-xs text-[#819596]">{med.reorder_level || 20} {med.unit}</p>
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-[#173F41]">
                        ₹{Number(med.selling_price || med.purchase_price || 0).toFixed(2)}
                      </p>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isOut
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : isLow
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "Available"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="divide-y divide-[#EAF2F0] lg:hidden">
          {filteredMedicines.map((med) => (
            <div key={med.medicine_id || med.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-[#173F41]">{med.medicine_name}</h4>
                  <p className="text-xs font-mono text-[#9AAEAF]">{med.medicine_code} • {med.category}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    med.quantity <= 0
                      ? "bg-rose-50 text-rose-700"
                      : med.quantity <= (med.reorder_level || 20)
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {med.quantity <= 0 ? "Out of Stock" : med.quantity <= (med.reorder_level || 20) ? "Low Stock" : "Available"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#31585A]">
                <span>Stock: <strong>{med.quantity} {med.unit}</strong></span>
                <span>Price: <strong>₹{Number(med.selling_price || 0).toFixed(2)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
