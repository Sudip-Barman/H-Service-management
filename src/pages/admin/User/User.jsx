import { useMemo, useState } from "react";
import {
  Activity,
  Eye,
  Mail,
  Phone,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import SearchFilter from "../../../components/admin/SearchFilter";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

import { userData } from "../../../data";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function User() {
  const [users, setUsers] = useState(
    Array.isArray(userData) ? userData : []
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [confirmDelete, setConfirmDelete] =
    useState(null);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const stats = useMemo(() => {
    const total = users.length;

    const currentDate = new Date("2026-09-07");

    const newUsers = users.filter((user) => {
      if (!user.registeredOn) {
        return false;
      }

      const registeredDate =
        new Date(user.registeredOn);

      const difference =
        (currentDate - registeredDate) /
        (1000 * 60 * 60 * 24);

      return difference >= 0 && difference <= 30;
    }).length;

    const totalRequests = users.reduce(
      (total, user) =>
        total + Number(user.serviceRequests || 0),
      0
    );

    return {
      total,
      newUsers,
      totalRequests,
    };
  }, [users]);

  /* =========================================================
     FILTER USERS
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [
        user.name,
        user.email,
        user.phone,
        user.id,
        user.location,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [users, searchTerm]);

  /* =========================================================
     DELETE USER
  ========================================================= */

  const requestDeleteUser = (user) => {
    setConfirmDelete(user);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const confirmDeleteUser = () => {
    if (!confirmDelete) {
      return;
    }

    const deletedUserId =
      confirmDelete.id;

    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) =>
          user.id !== deletedUserId
      )
    );

    if (
      selectedUser?.id ===
      deletedUserId
    ) {
      setSelectedUser(null);
    }

    setConfirmDelete(null);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <p className="mb-1 text-xs font-bold tracking-[0.18em] text-[#08A6A0]">
          USER MANAGEMENT
        </p>

        <h1 className="text-xl font-bold text-[#073F42] sm:text-2xl lg:text-3xl">
          User Management
        </h1>

        <p className="mt-0.5 text-xs text-[#789092] sm:text-sm">
          Manage registered patients, caretakers and
          their accounts, activity and service requests.
        </p>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">

        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.total}
        />

        <StatCard
          icon={Activity}
          label="New Users"
          value={stats.newUsers}
        />

        <StatCard
          icon={Activity}
          label="Service Requests"
          value={stats.totalRequests}
        />

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <SearchFilter
        search={searchTerm}
        setSearch={setSearchTerm}
        placeholder="Search by name, email, phone or ID..."
      />

      {/* =====================================================
          USER TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#D9E9E7] bg-white">

        {/* Table Header */}

        <div className="flex items-center justify-between border-b border-[#D9E9E7] px-4 py-3.5 sm:px-5 sm:py-4">

          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#073F42]">
              Registered Users
            </h2>

            <p className="mt-0.5 text-[10px] sm:text-xs text-[#789092]">
              Showing {filteredUsers.length} of{" "}
              {users.length} users
            </p>
          </div>

        </div>

        {/* =================================================
            DESKTOP
        ================================================= */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full min-w-[850px]">

            <thead className="bg-[#F7FBFA]">

              <tr className="border-b border-[#D9E9E7]">

                <th className="px-5 py-3 text-left text-xs font-bold text-[#789092]">
                  USER
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold text-[#789092]">
                  CONTACT
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold text-[#789092]">
                  REQUESTS
                </th>

                <th className="px-5 py-3 text-left text-xs font-bold text-[#789092]">
                  LAST ACTIVE
                </th>

                <th className="px-5 py-3 text-right text-xs font-bold text-[#789092]">
                  ACTIONS
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-b border-[#EDF4F3] transition hover:bg-[#F9FCFB]"
                >

                  {/* USER */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F7F3] text-[#08A6A0]">

                        <UserRound size={19} />

                      </div>

                      <div>

                        <p className="text-sm font-semibold text-[#073F42]">
                          {user.name || "Unnamed User"}
                        </p>

                        <p className="mt-0.5 text-xs text-[#789092]">
                          {user.id || "No ID"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* CONTACT */}

                  <td className="px-5 py-4">

                    <div className="space-y-1">

                      <div className="flex items-center gap-1.5 text-xs text-[#31585A]">

                        <Mail size={13} />

                        {user.email || "No email"}

                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#789092]">

                        <Phone size={13} />

                        {user.phone || "No phone"}

                      </div>

                    </div>

                  </td>

                  {/* REQUESTS */}

                  <td className="px-5 py-4">

                    <span className="text-sm font-semibold text-[#073F42]">
                      {user.serviceRequests || 0}
                    </span>

                  </td>

                  {/* LAST ACTIVE */}

                  <td className="px-5 py-4">

                    <span className="text-xs text-[#789092]">
                      {formatDate(user.lastActive)}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-1">

                      {/* View */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUser(user)
                        }
                        className="rounded-lg p-2 text-[#31585A] transition hover:bg-[#E6F7F3] hover:text-[#08A6A0]"
                        title="View user"
                      >

                        <Eye size={16} />

                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          requestDeleteUser(user)
                        }
                        className="rounded-lg p-2 text-[#789092] transition hover:bg-red-50 hover:text-red-500"
                        title="Remove user"
                      >

                        <Trash2 size={16} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* =================================================
            MOBILE
        ================================================= */}

        <div className="space-y-3 p-3 md:hidden">

          {filteredUsers.map((user) => (

            <div
              key={user.id}
              className="rounded-xl border border-[#E2EFED] bg-white p-3.5 shadow-sm transition"
            >

              {/* User Header */}

              <div className="flex items-start justify-between gap-2">

                <div className="flex items-center gap-2.5 min-w-0">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E6F7F3] text-[#08A6A0]">

                    <UserRound size={17} />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-xs sm:text-sm font-bold text-[#073F42]">
                      {user.name || "Unnamed User"}
                    </p>

                    <p className="mt-0.5 text-[10px] sm:text-xs text-[#789092]">
                      {user.id || "No ID"}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    requestDeleteUser(user)
                  }
                  className="rounded-lg p-1.5 text-[#789092] hover:bg-red-50 hover:text-red-500"
                  title="Remove user"
                >

                  <Trash2 size={16} />

                </button>

              </div>

              {/* Contact */}

              <div className="mt-3 space-y-1.5 rounded-lg bg-[#FAFDFC] p-2.5">

                <div className="flex items-center gap-2 text-xs text-[#31585A]">

                  <Mail size={13} className="shrink-0 text-[#819596]" />

                  <span className="truncate">
                    {user.email || "No email"}
                  </span>

                </div>

                <div className="flex items-center gap-2 text-xs text-[#789092]">

                  <Phone size={13} className="shrink-0 text-[#819596]" />

                  <span>
                    {user.phone || "No phone"}
                  </span>

                </div>

              </div>

              {/* Information */}

              <div className="mt-2.5 grid grid-cols-2 gap-2">

                <div className="rounded-lg bg-[#FAFDFC] p-2">

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                    Requests
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-[#073F42]">
                    {user.serviceRequests || 0}
                  </p>

                </div>

                <div className="rounded-lg bg-[#FAFDFC] p-2">

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                    Last Active
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-[#31585A]">
                    {formatDate(user.lastActive)}
                  </p>

                </div>

                <div className="col-span-2 rounded-lg bg-[#FAFDFC] p-2">

                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#789092]">
                    Location
                  </p>

                  <p className="mt-0.5 truncate text-xs font-medium text-[#073F42]">
                    {user.location || "Not available"}
                  </p>

                </div>

              </div>

              {/* View Button */}

              <div className="mt-3 border-t border-[#EAF2F0] pt-2.5">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedUser(user)
                  }
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#D9E9E7] bg-[#FAFDFC] px-3 py-1.5 text-xs font-semibold text-[#073F42] hover:bg-[#E8F8F6] hover:text-[#08A6A0]"
                >

                  <Eye size={14} />

                  View Details

                </button>

              </div>

            </div>

          ))}

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredUsers.length === 0 && (

          <div className="px-5 py-12 text-center">

            <UserRound
              className="mx-auto text-[#B4C7C5]"
              size={32}
            />

            <p className="mt-3 text-sm font-semibold text-[#31585A]">
              No users found
            </p>

            <p className="mt-1 text-xs text-[#789092]">
              Try searching with a different name,
              email, phone or ID.
            </p>

          </div>

        )}

      </div>

      {/* =====================================================
          USER DETAILS MODAL
      ===================================================== */}

      {selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-[#D9E9E7] px-5 py-4">

              <div>

                <p className="text-xs font-bold tracking-[0.15em] text-[#08A6A0]">
                  USER DETAILS
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#073F42]">
                  {selectedUser.name}
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg px-3 py-1 text-xl text-[#789092] hover:bg-gray-100"
                title="Close"
              >
                ×
              </button>

            </div>

            {/* Modal Content */}

            <div className="space-y-5 p-5">

              {/* Basic Information */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <p className="text-xs font-semibold text-[#789092]">
                    USER ID
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#073F42]">
                    {selectedUser.id || "N/A"}
                  </p>

                </div>

                <div>

                  <p className="text-xs font-semibold text-[#789092]">
                    GENDER / AGE
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#073F42]">
                    {selectedUser.gender || "N/A"},{" "}
                    {selectedUser.age
                      ? `${selectedUser.age} years`
                      : "N/A"}
                  </p>

                </div>

                <div>

                  <p className="text-xs font-semibold text-[#789092]">
                    EMAIL
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-[#073F42]">
                    {selectedUser.email || "N/A"}
                  </p>

                </div>

                <div>

                  <p className="text-xs font-semibold text-[#789092]">
                    PHONE
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#073F42]">
                    {selectedUser.phone || "N/A"}
                  </p>

                </div>

                <div>

                  <p className="text-xs font-semibold text-[#789092]">
                    LOCATION
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#073F42]">
                    {selectedUser.location || "N/A"}
                  </p>

                </div>

                <div>

                  <p className="text-xs font-semibold text-[#789092]">
                    REGISTERED ON
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#073F42]">
                    {formatDate(
                      selectedUser.registeredOn
                    )}
                  </p>

                </div>

              </div>

              {/* Service Activity */}

              <div className="rounded-xl border border-[#D9E9E7] bg-[#F7FBFA] p-4">

                <p className="text-xs font-bold uppercase tracking-wide text-[#789092]">
                  Service Activity
                </p>

                <div className="mt-3 flex items-center justify-between">

                  <span className="text-sm text-[#31585A]">
                    Total Service Requests
                  </span>

                  <span className="text-lg font-bold text-[#08A6A0]">
                    {selectedUser.serviceRequests || 0}
                  </span>

                </div>

                <div className="mt-2 flex items-center justify-between">

                  <span className="text-sm text-[#31585A]">
                    Last Active
                  </span>

                  <span className="text-sm font-semibold text-[#073F42]">
                    {formatDate(
                      selectedUser.lastActive
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t border-[#D9E9E7] px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg bg-[#073F42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A5559]"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Remove User?"
        message={
          confirmDelete
            ? `Are you sure you want to remove ${confirmDelete.name}? This action cannot be undone.`
            : ""
        }
        confirmText="Remove User"
        cancelText="Cancel"
        onCancel={cancelDelete}
        onConfirm={confirmDeleteUser}
        variant="danger"
      />

    </div>
  );
}