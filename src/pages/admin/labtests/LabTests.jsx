import { useMemo, useState } from "react";
import {
  Activity,
  Beaker,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Edit3,
  FlaskConical,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const initialTests = [
  {
    id: "LAB-001",
    name: "Complete Blood Count",
    shortName: "CBC",
    category: "Hematology",
    sample: "Blood",
    price: 350,
    turnaround: "4 Hours",
    status: "Active",
    description:
      "Measures red blood cells, white blood cells, hemoglobin and platelets.",
  },
  {
    id: "LAB-002",
    name: "Blood Glucose",
    shortName: "FBS",
    category: "Biochemistry",
    sample: "Blood",
    price: 150,
    turnaround: "2 Hours",
    status: "Active",
    description:
      "Measures fasting blood glucose level.",
  },
  {
    id: "LAB-003",
    name: "Liver Function Test",
    shortName: "LFT",
    category: "Biochemistry",
    sample: "Blood",
    price: 750,
    turnaround: "6 Hours",
    status: "Active",
    description:
      "Evaluates liver function through multiple biochemical markers.",
  },
  {
    id: "LAB-004",
    name: "Kidney Function Test",
    shortName: "KFT",
    category: "Biochemistry",
    sample: "Blood",
    price: 650,
    turnaround: "6 Hours",
    status: "Active",
    description:
      "Evaluates kidney function using blood biochemical parameters.",
  },
  {
    id: "LAB-005",
    name: "Urine Routine Examination",
    shortName: "Urine R/E",
    category: "Pathology",
    sample: "Urine",
    price: 200,
    turnaround: "3 Hours",
    status: "Active",
    description:
      "Routine physical, chemical and microscopic examination of urine.",
  },
  {
    id: "LAB-006",
    name: "Thyroid Profile",
    shortName: "T3/T4/TSH",
    category: "Hormones",
    sample: "Blood",
    price: 550,
    turnaround: "8 Hours",
    status: "Active",
    description:
      "Measures thyroid hormones and thyroid stimulating hormone.",
  },
  {
    id: "LAB-007",
    name: "Lipid Profile",
    shortName: "Lipid",
    category: "Biochemistry",
    sample: "Blood",
    price: 600,
    turnaround: "6 Hours",
    status: "Active",
    description:
      "Measures cholesterol, triglycerides and related lipid parameters.",
  },
  {
    id: "LAB-008",
    name: "Chest X-Ray",
    shortName: "CXR",
    category: "Radiology",
    sample: "Imaging",
    price: 500,
    turnaround: "2 Hours",
    status: "Inactive",
    description:
      "Radiographic examination of the chest.",
  },
];

/* -------------------------------------------------------------------------- */
/*                              STATUS CONFIG                                 */
/* -------------------------------------------------------------------------- */

const statusConfig = {
  Active: {
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  Inactive: {
    classes: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

/* -------------------------------------------------------------------------- */
/*                              STAT CARD                                     */
/* -------------------------------------------------------------------------- */

function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-800">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              TEST FORM                                     */
/* -------------------------------------------------------------------------- */

function TestForm({
  form,
  setForm,
  onSubmit,
  editing,
  onClose,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Test Name */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Test Name
          </label>

          <input
            type="text"
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Enter test name"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Short Name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Short Name
          </label>

          <input
            type="text"
            required
            value={form.shortName}
            onChange={(e) =>
              setForm({
                ...form,
                shortName: e.target.value,
              })
            }
            placeholder="e.g. CBC"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Category
          </label>

          <select
            required
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-emerald-100"
          >
            <option value="">Select category</option>
            <option value="Hematology">Hematology</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Pathology">Pathology</option>
            <option value="Hormones">Hormones</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Radiology">Radiology</option>
            <option value="Immunology">Immunology</option>
          </select>
        </div>

        {/* Sample */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Sample Type
          </label>

          <select
            required
            value={form.sample}
            onChange={(e) =>
              setForm({
                ...form,
                sample: e.target.value,
              })
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-emerald-100"
          >
            <option value="">Select sample</option>
            <option value="Blood">Blood</option>
            <option value="Urine">Urine</option>
            <option value="Stool">Stool</option>
            <option value="Swab">Swab</option>
            <option value="Imaging">Imaging</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Price
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              ₹
            </span>

            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Turnaround */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Turnaround Time
          </label>

          <input
            type="text"
            required
            value={form.turnaround}
            onChange={(e) =>
              setForm({
                ...form,
                turnaround: e.target.value,
              })
            }
            placeholder="e.g. 4 Hours"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Status
          </label>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-emerald-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Description
          </label>

          <textarea
            rows="3"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Enter test description"
            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {editing ? (
            <>
              <Edit3 size={15} />
              Update Test
            </>
          ) : (
            <>
              <Plus size={15} />
              Add Test
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*                            MAIN COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function LabTests() {
  const [tests, setTests] = useState(initialTests);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedTest, setSelectedTest] = useState(null);
  const [editingTest, setEditingTest] = useState(null);

  const [deleteTest, setDeleteTest] = useState(null);

  const emptyForm = {
    name: "",
    shortName: "",
    category: "",
    sample: "",
    price: "",
    turnaround: "",
    status: "Active",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* ---------------------------------------------------------------------- */
  /*                                STATS                                   */
  /* ---------------------------------------------------------------------- */

  const stats = useMemo(() => {
    return {
      total: tests.length,
      active: tests.filter((test) => test.status === "Active").length,
      inactive: tests.filter(
        (test) => test.status === "Inactive"
      ).length,
    };
  }, [tests]);

  /* ---------------------------------------------------------------------- */
  /*                               FILTERS                                  */
  /* ---------------------------------------------------------------------- */

  const categories = [
    "All",
    ...new Set(tests.map((test) => test.category)),
  ];

  const filteredTests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tests.filter((test) => {
      const matchesSearch =
        !query ||
        test.name.toLowerCase().includes(query) ||
        test.shortName.toLowerCase().includes(query) ||
        test.id.toLowerCase().includes(query) ||
        test.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        test.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        test.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    tests,
    search,
    categoryFilter,
    statusFilter,
  ]);

  /* ---------------------------------------------------------------------- */
  /*                              ADD TEST                                  */
  /* ---------------------------------------------------------------------- */

  const openAddForm = () => {
    setEditingTest(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  /* ---------------------------------------------------------------------- */
  /*                              EDIT TEST                                 */
  /* ---------------------------------------------------------------------- */

  const openEditForm = (test) => {
    setEditingTest(test);

    setForm({
      name: test.name,
      shortName: test.shortName,
      category: test.category,
      sample: test.sample,
      price: test.price,
      turnaround: test.turnaround,
      status: test.status,
      description: test.description,
    });

    setShowForm(true);
  };

  /* ---------------------------------------------------------------------- */
  /*                             SAVE TEST                                  */
  /* ---------------------------------------------------------------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTest) {
      setTests((current) =>
        current.map((test) =>
          test.id === editingTest.id
            ? {
                ...test,
                ...form,
                price: Number(form.price),
              }
            : test
        )
      );
    } else {
      const newTest = {
        id: `LAB-${String(tests.length + 1).padStart(3, "0")}`,
        ...form,
        price: Number(form.price),
      };

      setTests((current) => [newTest, ...current]);
    }

    setShowForm(false);
    setEditingTest(null);
    setForm(emptyForm);
  };

  /* ---------------------------------------------------------------------- */
  /*                             DELETE TEST                                */
  /* ---------------------------------------------------------------------- */

  const confirmDelete = () => {
    if (!deleteTest) return;

    setTests((current) =>
      current.filter((test) => test.id !== deleteTest.id)
    );

    setDeleteTest(null);
  };

  /* ---------------------------------------------------------------------- */
  /*                                VIEW                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 lg:p-5">
      {/* ---------------------------------------------------------------- */}
      {/* HEADER                                                           */}
      {/* ---------------------------------------------------------------- */}

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
            <FlaskConical size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Lab Tests
            </h1>

            <p className="text-xs text-slate-500 sm:text-sm">
              Manage laboratory tests, pricing and availability
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus size={17} />
          Add Lab Test
        </button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* STAT CARDS                                                       */}
      {/* ---------------------------------------------------------------- */}

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard
          title="Total Tests"
          value={stats.total}
          icon={ClipboardList}
          iconClass="bg-sky-50 text-sky-700"
        />

        <StatCard
          title="Active Tests"
          value={stats.active}
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Inactive Tests"
          value={stats.inactive}
          icon={Clock3}
          iconClass="bg-slate-100 text-slate-600"
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* FILTER BAR                                                       */}
      {/* ---------------------------------------------------------------- */}

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
              placeholder="Search test name, ID or category..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 lg:w-48"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "All"
                  ? "All Categories"
                  : category}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 lg:w-40"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Reset */}
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
              setStatusFilter("All");
            }}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* TABLE                                                            */}
      {/* ---------------------------------------------------------------- */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Laboratory Test Catalog
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-500">
              {filteredTests.length} test
              {filteredTests.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Beaker size={15} />
            Lab Services
          </div>
        </div>

        <div className="h-[520px] overflow-auto">
          <table className="w-full min-w-[950px] table-fixed border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100">
              <tr className="border-b border-slate-200">
                <th className="w-[90px] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  ID
                </th>

                <th className="w-[230px] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Test
                </th>

                <th className="w-[145px] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="w-[120px] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Sample
                </th>

                <th className="w-[100px] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Price
                </th>

                <th className="w-[120px] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  TAT
                </th>

                <th className="w-[110px] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="w-[135px] px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <tr
                    key={test.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* ID */}
                    <td className="px-3 py-3">
                      <span className="text-xs font-semibold text-slate-600">
                        {test.id}
                      </span>
                    </td>

                    {/* Test */}
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTest(test);
                          setShowDetails(true);
                        }}
                        className="text-left"
                      >
                        <p className="text-xs font-bold text-slate-800 hover:text-emerald-700">
                          {test.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {test.shortName}
                        </p>
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-3 py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                        {test.category}
                      </span>
                    </td>

                    {/* Sample */}
                    <td className="px-3 py-3 text-xs text-slate-600">
                      {test.sample}
                    </td>

                    {/* Price */}
                    <td className="px-3 py-3 text-xs font-semibold text-slate-700">
                      ₹{test.price}
                    </td>

                    {/* TAT */}
                    <td className="px-3 py-3 text-xs text-slate-600">
                      {test.turnaround}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${statusConfig[test.status].classes}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusConfig[test.status].dot}`}
                        />
                        {test.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          title="View details"
                          onClick={() => {
                            setSelectedTest(test);
                            setShowDetails(true);
                          }}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Activity size={14} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            openEditForm(test)
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() =>
                            setDeleteTest(test)
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="flex h-64 flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                        <Search size={24} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        No laboratory tests found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* ADD / EDIT MODAL                                                 */}
      {/* ---------------------------------------------------------------- */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <FlaskConical size={18} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {editingTest
                      ? "Edit Lab Test"
                      : "Add Lab Test"}
                  </h2>

                  <p className="text-[11px] text-slate-500">
                    {editingTest
                      ? "Update laboratory test information"
                      : "Create a new laboratory test"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <TestForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                editing={editingTest}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* DETAILS MODAL                                                    */}
      {/* ---------------------------------------------------------------- */}

      {showDetails && selectedTest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <FlaskConical size={18} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {selectedTest.name}
                  </h2>

                  <p className="text-[11px] text-slate-500">
                    {selectedTest.id} •{" "}
                    {selectedTest.shortName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500">
                    Category
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {selectedTest.category}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500">
                    Sample
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {selectedTest.sample}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500">
                    Price
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    ₹{selectedTest.price}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500">
                    Turnaround
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {selectedTest.turnaround}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold text-slate-700">
                  Status
                </p>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusConfig[selectedTest.status].classes}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusConfig[selectedTest.status].dot}`}
                  />

                  {selectedTest.status}
                </span>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold text-slate-700">
                  Description
                </p>

                <p className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  {selectedTest.description ||
                    "No description available."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
              <button
                type="button"
                onClick={() => {
                  setShowDetails(false);
                  openEditForm(selectedTest);
                }}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <Edit3 size={14} />
                Edit Test
              </button>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION                                              */}
      {/* ---------------------------------------------------------------- */}

      {deleteTest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <Trash2 size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Delete Lab Test?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Are you sure you want to remove{" "}
                    <span className="font-semibold text-slate-700">
                      {deleteTest.name}
                    </span>{" "}
                    from the laboratory test catalog?
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
              <button
                type="button"
                onClick={() => setDeleteTest(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Delete Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}