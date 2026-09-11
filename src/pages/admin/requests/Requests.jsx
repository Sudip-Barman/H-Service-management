import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Filter,
  Package,
  Plus,
  RefreshCcw,
  Trash2,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

const initialRequests = [
  {
    id: "REQ-1001",
    type: "Lab Test",
    item: "Complete Blood Count",
    requestedFor: "Rahul Sharma",
    patientId: "PAT-1024",
    requestedBy: "Dr. Ananya Sen",
    department: "Laboratory",
    priority: "Urgent",
    status: "Pending",
    date: "2026-09-09",
    requiredDate: "2026-09-09",
    description: "CBC required for immediate diagnosis.",
  },
  {
    id: "REQ-1002",
    type: "Medicine",
    item: "Paracetamol 500mg",
    requestedFor: "Priya Das",
    patientId: "PAT-1025",
    requestedBy: "Nurse Riya",
    department: "Pharmacy",
    priority: "Normal",
    status: "Approved",
    date: "2026-09-09",
    requiredDate: "2026-09-10",
    description: "Medicine required for patient treatment.",
  },
  {
    id: "REQ-1003",
    type: "Equipment",
    item: "Infusion Pump",
    requestedFor: "Amit Roy",
    patientId: "PAT-1026",
    requestedBy: "Nurse Suman",
    department: "ICU",
    priority: "Critical",
    status: "In Progress",
    date: "2026-09-08",
    requiredDate: "2026-09-09",
    description: "Infusion pump required for ICU treatment.",
  },
  {
    id: "REQ-1004",
    type: "Room / Bed",
    item: "General Ward Bed",
    requestedFor: "Sourav Ghosh",
    patientId: "PAT-1027",
    requestedBy: "Reception",
    department: "General Ward",
    priority: "High",
    status: "Completed",
    date: "2026-09-08",
    requiredDate: "2026-09-08",
    description: "Bed allocation request completed.",
  },
  {
    id: "REQ-1005",
    type: "Service",
    item: "Wheelchair Assistance",
    requestedFor: "Mita Roy",
    patientId: "PAT-1028",
    requestedBy: "Reception",
    department: "Emergency",
    priority: "Urgent",
    status: "Pending",
    date: "2026-09-09",
    requiredDate: "2026-09-09",
    description: "Wheelchair assistance required at emergency entrance.",
  },
  {
    id: "REQ-1006",
    type: "Other",
    item: "Patient File",
    requestedFor: "Arindam Paul",
    patientId: "PAT-1029",
    requestedBy: "Dr. Amit Kumar",
    department: "OPD",
    priority: "Normal",
    status: "Rejected",
    date: "2026-09-07",
    requiredDate: "2026-09-08",
    description: "Old patient file requested for review.",
  },
];

const requestTypes = ["Lab Test", "Equipment", "Medicine", "Room / Bed", "Service", "Other"];
const statuses = ["Pending", "In Progress", "Approved", "Completed", "Rejected"];
const priorities = ["Normal", "High", "Urgent", "Critical"];

const emptyForm = {
  type: "Lab Test",
  item: "",
  requestedFor: "",
  patientId: "",
  requestedBy: "",
  department: "",
  priority: "Normal",
  requiredDate: "",
  description: "",
};

const getPriorityType = (priority) => priority?.toLowerCase() || "normal";

function Request() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const departments = useMemo(
    () => ["All", ...new Set(requests.map((request) => request.department).filter(Boolean))],
    [requests]
  );

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    progress: requests.filter((r) => r.status === "In Progress").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    completed: requests.filter((r) => r.status === "Completed").length,
    urgent: requests.filter((r) => r.priority === "Urgent" || r.priority === "Critical").length,
  }), [requests]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.id.toLowerCase().includes(query) ||
        request.item.toLowerCase().includes(query) ||
        request.requestedFor.toLowerCase().includes(query) ||
        request.patientId.toLowerCase().includes(query) ||
        request.requestedBy.toLowerCase().includes(query) ||
        request.department.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (typeFilter === "All" || request.type === typeFilter) &&
        (statusFilter === "All" || request.status === statusFilter) &&
        (priorityFilter === "All" || request.priority === priorityFilter) &&
        (departmentFilter === "All" || request.department === departmentFilter)
      );
    });
  }, [requests, search, typeFilter, statusFilter, priorityFilter, departmentFilter]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setPriorityFilter("All");
    setDepartmentFilter("All");
  };

  const openAddRequest = () => {
    setForm(emptyForm);
    setFormError("");
    setShowAddModal(true);
  };

  const handleFormChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const createRequest = (event) => {
    event.preventDefault();

    if (!form.item.trim() || !form.requestedFor.trim() || !form.requestedBy.trim() || !form.department.trim()) {
      setFormError("Please fill in Request / Item, Requested For, Requested By and Department.");
      return;
    }

    const nextNumber = Math.max(
      ...requests.map((request) => Number(request.id.replace(/\D/g, "")) || 0),
      1000
    ) + 1;
    const today = new Date().toISOString().slice(0, 10);

    const newRequest = {
      id: `REQ-${nextNumber}`,
      ...form,
      item: form.item.trim(),
      requestedFor: form.requestedFor.trim(),
      patientId: form.patientId.trim() || "N/A",
      requestedBy: form.requestedBy.trim(),
      department: form.department.trim(),
      description: form.description.trim(),
      status: "Pending",
      date: today,
      requiredDate: form.requiredDate || today,
    };

    setRequests((current) => [newRequest, ...current]);
    setShowAddModal(false);
  };

  const updateStatus = (id, status) => {
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    setSelectedRequest((current) => current?.id === id ? { ...current, status } : current);
  };

  const deleteRequest = () => {
    if (!requestToDelete) return;
    setRequests((current) => current.filter((request) => request.id !== requestToDelete.id));
    if (selectedRequest?.id === requestToDelete.id) setSelectedRequest(null);
    setRequestToDelete(null);
  };

  return (
    <div className="min-h-full bg-[#F7FBFA] p-3 sm:p-4 lg:p-5">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F6] text-[#08A6A0]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#173F41] sm:text-2xl">Requests</h1>
            <p className="mt-0.5 text-xs text-[#819596] sm:text-sm">Manage hospital service and resource requests</p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddRequest}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#08A6A0] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078E89] sm:h-11"
        >
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Requests" value={stats.total} icon={FileText} onClick={clearFilters} />
        <StatCard label="Pending" value={stats.pending} icon={Clock3} onClick={() => { setStatusFilter("Pending"); setPriorityFilter("All"); }} />
        <StatCard label="In Progress" value={stats.progress} icon={RefreshCcw} onClick={() => setStatusFilter("In Progress")} />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} onClick={() => setStatusFilter("Approved")} />
        <StatCard label="Completed" value={stats.completed} icon={Check} onClick={() => setStatusFilter("Completed")} />
        <StatCard label="Urgent" value={stats.urgent} icon={AlertTriangle} onClick={() => { setPriorityFilter("Urgent"); setStatusFilter("All"); }} />
      </div>

      {/* Search & Filters */}
      <div className="mb-5">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          placeholder="Search request, patient, ID..."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Request Type" value={typeFilter} onChange={setTypeFilter} options={requestTypes} />
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={statuses} />
            <FilterSelect label="Priority" value={priorityFilter} onChange={setPriorityFilter} options={priorities} />
            <FilterSelect label="Department" value={departmentFilter} onChange={setDepartmentFilter} options={departments.filter((x) => x !== "All")} />
          </div>

          {(typeFilter !== "All" || statusFilter !== "All" || priorityFilter !== "All" || departmentFilter !== "All" || search) && (
            <div className="mt-3 flex justify-end">
              <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#08A6A0] hover:text-[#078E89]">
                Clear Filters
              </button>
            </div>
          )}
        </SearchFilter>
      </div>

      {/* Results */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-[#819596] sm:text-sm">
          Showing <span className="font-semibold text-[#31585A]">{filteredRequests.length}</span> of <span className="font-semibold text-[#31585A]">{requests.length}</span> requests
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#E2EFED] bg-white shadow-sm lg:block">
        <div className="max-h-[560px] overflow-auto">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#FAFDFC]">
              <tr className="border-b border-[#E2EFED]">
                <TableHead>ID</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Requested For</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead align="right">Actions</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAF2F0]">
              {filteredRequests.length ? filteredRequests.map((request) => (
                <tr key={request.id} className="transition hover:bg-[#FAFDFC]">
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-[#078E89]">{request.id}</td>
                  <td className="min-w-[180px] max-w-[260px] px-4 py-3">
                    <button type="button" onClick={() => setSelectedRequest(request)} className="block max-w-full truncate text-left text-sm font-bold text-[#173F41] hover:text-[#08A6A0]">
                      {request.item}
                    </button>
                    <div className="mt-0.5 flex items-center gap-2 truncate text-xs text-[#819596]">
                      <TypeBadge type={request.type} />
                      <span className="truncate">{request.patientId}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#31585A]">{request.requestedFor}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#31585A]">{request.requestedBy}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#31585A]">{request.department}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={request.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={request.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#5F7375]">{formatDate(request.date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <ActionButton title="View Request" onClick={() => setSelectedRequest(request)}><Eye className="h-4 w-4" /></ActionButton>
                      <ActionButton title="Delete Request" danger onClick={() => setRequestToDelete(request)}><Trash2 className="h-4 w-4" /></ActionButton>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9}><EmptyState onReset={clearFilters} /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filteredRequests.length ? filteredRequests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-[#E2EFED] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#078E89]">{request.id}</p>
                <button type="button" onClick={() => setSelectedRequest(request)} className="mt-1 block truncate text-left text-sm font-bold text-[#173F41]">{request.item}</button>
                <p className="mt-0.5 text-xs text-[#819596]">{request.requestedFor} · {request.patientId}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2"><TypeBadge type={request.type} /><PriorityBadge priority={request.priority} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EDF4F2] pt-3">
              <Info label="Requested By" value={request.requestedBy} />
              <Info label="Department" value={request.department} />
              <Info label="Date" value={formatDate(request.date)} />
              <Info label="Required" value={formatDate(request.requiredDate)} />
            </div>
            <div className="mt-3 flex justify-end gap-1 border-t border-[#EDF4F2] pt-3">
              <ActionButton title="View Request" onClick={() => setSelectedRequest(request)}><Eye className="h-4 w-4" /></ActionButton>
              <ActionButton title="Delete Request" danger onClick={() => setRequestToDelete(request)}><Trash2 className="h-4 w-4" /></ActionButton>
            </div>
          </div>
        )) : <div className="rounded-2xl border border-[#E2EFED] bg-white"><EmptyState onReset={clearFilters} /></div>}
      </div>

      {/* Add Request */}
      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <form onSubmit={createRequest} className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2EFED] px-5 py-4">
              <div><h2 className="text-lg font-bold text-[#173F41]">New Request</h2><p className="mt-0.5 text-xs text-[#819596]">Create a hospital resource or service request</p></div>
              <button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg p-2 text-[#819596] hover:bg-[#F1F7F6]"><X className="h-5 w-5" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Request Type" required><SelectInput value={form.type} onChange={(v) => handleFormChange("type", v)} options={requestTypes} /></FormField>
                <FormField label="Request / Item" required><TextInput value={form.item} onChange={(v) => handleFormChange("item", v)} placeholder="e.g. Complete Blood Count" /></FormField>
                <FormField label="Requested For" required><TextInput value={form.requestedFor} onChange={(v) => handleFormChange("requestedFor", v)} placeholder="Patient name" /></FormField>
                <FormField label="Patient ID"><TextInput value={form.patientId} onChange={(v) => handleFormChange("patientId", v)} placeholder="PAT-XXXX" /></FormField>
                <FormField label="Requested By" required><TextInput value={form.requestedBy} onChange={(v) => handleFormChange("requestedBy", v)} placeholder="Doctor / Staff name" /></FormField>
                <FormField label="Department" required><TextInput value={form.department} onChange={(v) => handleFormChange("department", v)} placeholder="Department" /></FormField>
                <FormField label="Priority"><SelectInput value={form.priority} onChange={(v) => handleFormChange("priority", v)} options={priorities} /></FormField>
                <FormField label="Required Date"><input type="date" value={form.requiredDate} onChange={(e) => handleFormChange("requiredDate", e.target.value)} className={inputClass} /></FormField>
                <div className="sm:col-span-2"><FormField label="Description"><textarea value={form.description} onChange={(e) => handleFormChange("description", e.target.value)} rows={4} placeholder="Describe the request..." className={`${inputClass} h-auto resize-none py-2.5`} /></FormField></div>
              </div>
              {formError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{formError}</p>}
            </div>
            <div className="flex shrink-0 justify-end gap-2 border-t border-[#E2EFED] bg-white px-5 py-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg border border-[#E2EFED] px-4 py-2 text-sm font-semibold text-[#5F7375] hover:bg-[#F8FCFB]">Cancel</button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#08A6A0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#078E89]"><Plus className="h-4 w-4" />Create Request</button>
            </div>
          </form>
        </ModalOverlay>
      )}

      {/* Details */}
      {selectedRequest && (
        <ModalOverlay onClose={() => setSelectedRequest(null)}>
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E2EFED] px-5 py-4">
              <div><p className="text-xs font-bold text-[#08A6A0]">{selectedRequest.id}</p><h2 className="mt-1 text-lg font-bold text-[#173F41]">{selectedRequest.item}</h2></div>
              <button type="button" onClick={() => setSelectedRequest(null)} className="rounded-lg p-2 text-[#819596] hover:bg-[#F1F7F6]"><X className="h-5 w-5" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="flex flex-wrap gap-2"><TypeBadge type={selectedRequest.type} /><PriorityBadge priority={selectedRequest.priority} /><StatusBadge status={selectedRequest.status} /></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2"><Detail label="Requested For" value={`${selectedRequest.requestedFor} (${selectedRequest.patientId})`} /><Detail label="Requested By" value={selectedRequest.requestedBy} /><Detail label="Department" value={selectedRequest.department} /><Detail label="Request Date" value={formatDate(selectedRequest.date)} /><Detail label="Required Date" value={formatDate(selectedRequest.requiredDate)} /><Detail label="Priority" value={selectedRequest.priority} /></div>
              <div className="mt-3 rounded-xl border border-[#EDF4F2] bg-[#F8FCFB] p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-[#9AA9AA]">Description</p><p className="mt-2 text-sm leading-6 text-[#5F7375]">{selectedRequest.description || "No description provided."}</p></div>
            </div>
            <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-[#E2EFED] bg-white px-5 py-3">
              {selectedRequest.status === "Pending" && <><button type="button" onClick={() => updateStatus(selectedRequest.id, "Rejected")} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"><XCircle className="h-4 w-4" />Reject</button><button type="button" onClick={() => updateStatus(selectedRequest.id, "Approved")} className="inline-flex items-center gap-1.5 rounded-lg bg-[#08A6A0] px-3 py-2 text-xs font-semibold text-white hover:bg-[#078E89]"><Check className="h-4 w-4" />Approve</button></>}
              {selectedRequest.status === "Approved" && <button type="button" onClick={() => updateStatus(selectedRequest.id, "In Progress")} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"><RefreshCcw className="h-4 w-4" />Start Processing</button>}
              {selectedRequest.status === "In Progress" && <button type="button" onClick={() => updateStatus(selectedRequest.id, "Completed")} className="inline-flex items-center gap-1.5 rounded-lg bg-[#08A6A0] px-3 py-2 text-xs font-semibold text-white hover:bg-[#078E89]"><CheckCircle2 className="h-4 w-4" />Complete</button>}
              <button type="button" onClick={() => setSelectedRequest(null)} className="rounded-lg border border-[#E2EFED] px-3 py-2 text-xs font-semibold text-[#5F7375] hover:bg-[#F8FCFB]">Close</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {requestToDelete && (
        <ConfirmDialog
          open={Boolean(requestToDelete)}
          title="Delete Request"
          message={`Are you sure you want to delete ${requestToDelete.id}? This action cannot be undone.`}
          confirmText="Delete Request"
          cancelText="Cancel"
          onConfirm={deleteRequest}
          onCancel={() => setRequestToDelete(null)}
        />
      )}
    </div>
  );
}

const inputClass = "h-10 sm:h-11 w-full rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 sm:px-3.5 text-xs sm:text-sm text-[#173F41] outline-none transition focus:border-[#08A6A0] focus:ring-2 focus:ring-[#08A6A0]/10";

function TableHead({ children, align = "left" }) {
  return <th className={`whitespace-nowrap px-4 py-3.5 text-${align} text-[11px] font-bold uppercase tracking-wide text-[#819596]`}>{children}</th>;
}

function FilterSelect({ label, value, onChange, options }) {
  return <div><label className="mb-1.5 block text-xs font-semibold text-[#31585A]">{label}</label><div className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} appearance-none pr-9`}><option value="All">All {label}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA9AA]" /></div></div>;
}

function SelectInput({ value, onChange, options }) {
  return <div className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} appearance-none pr-9`}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA9AA]" /></div>;
}

function TextInput({ value, onChange, placeholder }) { return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />; }

function FormField({ label, required, children }) { return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#5F7375]">{label}{required && <span className="ml-1 text-red-500">*</span>}</span>{children}</label>; }

function ActionButton({ children, title, onClick, danger = false }) { return <button type="button" title={title} onClick={onClick} className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${danger ? "text-[#819596] hover:bg-[#FFF1F1] hover:text-[#C85A5A]" : "text-[#819596] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"}`}>{children}</button>; }

function TypeBadge({ type }) {
  const styles = { "Lab Test": "bg-purple-50 text-purple-700", Equipment: "bg-blue-50 text-blue-700", Medicine: "bg-orange-50 text-orange-700", "Room / Bed": "bg-cyan-50 text-cyan-700", Service: "bg-[#E8F8F6] text-[#078E89]", Other: "bg-[#F1F7F6] text-[#5F7375]" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[type] || styles.Other}`}>{type}</span>;
}

function PriorityBadge({ priority }) {
  const styles = { Normal: "bg-[#F1F7F6] text-[#5F7375]", High: "bg-yellow-50 text-yellow-700", Urgent: "bg-orange-50 text-orange-700", Critical: "bg-red-50 text-red-700" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[priority] || styles.Normal}`}>{priority}</span>;
}

function StatusBadge({ status }) {
  const styles = { Pending: "bg-yellow-50 text-yellow-700", "In Progress": "bg-blue-50 text-blue-700", Approved: "bg-[#E8F8F6] text-[#078E89]", Completed: "bg-green-50 text-green-700", Rejected: "bg-red-50 text-red-700" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status] || styles.Pending}`}>{status}</span>;
}

function Info({ label, value }) { return <div><p className="mb-1 text-[10px] font-semibold uppercase text-[#9AA9AA]">{label}</p><p className="truncate text-xs font-medium text-[#5F7375]">{value}</p></div>; }
function Detail({ label, value }) { return <div className="rounded-xl border border-[#EDF4F2] bg-[#F8FCFB] p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#9AA9AA]">{label}</p><p className="mt-1 text-xs sm:text-sm font-semibold text-[#173F41]">{value}</p></div>; }

function EmptyState({ onReset }) { return <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8F6] text-[#08A6A0]"><Package className="h-7 w-7" /></div><h3 className="mt-4 text-sm font-bold text-[#173F41]">No requests found</h3><p className="mt-1 max-w-sm text-xs leading-5 text-[#819596]">No request matches your current search or filter criteria.</p><button type="button" onClick={onReset} className="mt-4 text-xs font-semibold text-[#08A6A0] hover:text-[#078E89]">Clear Search & Filters</button></div>; }

function ModalOverlay({ children, onClose }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#073F42]/50 p-2.5 sm:p-4 md:p-6 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>{children}</div>; }

function formatDate(date) {
  if (!date) return "N/A";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default Request;
