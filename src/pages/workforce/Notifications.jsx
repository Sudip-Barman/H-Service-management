import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Info,
  AlertCircle,
  CalendarDays,
  UserRound,
  Trash2,
  ExternalLink,
} from "lucide-react";

import { apiRequest } from "../../api/api";

const getTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "appointment":
      return CalendarDays;

    case "attendance":
      return Clock;

    case "profile":
      return UserRound;

    case "alert":
      return AlertCircle;

    default:
      return Info;
  }
};

const getTypeClasses = (type) => {
  switch (type?.toLowerCase()) {
    case "appointment":
      return "bg-blue-50 text-blue-600";

    case "attendance":
      return "bg-amber-50 text-amber-600";

    case "profile":
      return "bg-purple-50 text-purple-600";

    case "alert":
      return "bg-red-50 text-red-600";

    default:
      return "bg-[#E8F8F6] text-[#08A6A0]";
  }
};

const formatNotificationDate = (date) => {
  if (!date) return "";

  const notificationDate = new Date(date);
  const today = new Date();

  const isToday =
    notificationDate.getDate() === today.getDate() &&
    notificationDate.getMonth() === today.getMonth() &&
    notificationDate.getFullYear() === today.getFullYear();

  if (isToday) {
    return notificationDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return notificationDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Notifications({ user }) {
  const storedUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const currentUser = user || storedUser;
  const employeeId = currentUser?.id ? String(currentUser.id) : "";
  const profile = currentUser;

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const isRegistrationNotification = (n) => {
    const title = (n?.title || "").toLowerCase();
    return (
      title.includes("registered") ||
      title.includes("new patient") ||
      title.includes("new doctor") ||
      title.includes("new nurse") ||
      title.includes("new staff")
    );
  };

  const fetchNotifications = async () => {
    try {
      const data = await apiRequest("/api/notifications");
      if (Array.isArray(data)) {
        // Exclude all registration events (Patient, Doctor, Nurse, Staff) from workforce view
        const workforceOnly = data.filter((n) => !isRegistrationNotification(n));
        const mapped = workforceOnly.map((n) => ({
          id: n.id,
          employeeId: employeeId,
          type: n.type?.toLowerCase() || "alert",
          title: n.title,
          message: n.message,
          date: n.date || "",
          read: Boolean(n.read),
          actionUrl: n.action_url,
          relatedEntityType: n.related_entity_type,
          relatedEntityId: n.related_entity_id,
        }));
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else if (notification.relatedEntityType === "schedule" || notification.type?.includes("schedule")) {
      navigate("/workforce/schedule");
    } else if (notification.relatedEntityType === "appointment" || notification.type?.includes("appointment")) {
      navigate("/workforce/appointments");
    } else if (notification.relatedEntityType === "patient" && notification.relatedEntityId) {
      navigate(`/workforce/patients/${notification.relatedEntityId}`);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [employeeId]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.read);
    }

    if (filter === "read") {
      return notifications.filter((notification) => notification.read);
    }

    return notifications;
  }, [notifications, filter]);

  const markAsRead = async (notificationId) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    try {
      await apiRequest(`/notifications/${notificationId}/read`, {
        method: "PUT",
      });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
    try {
      await apiRequest("/notifications/mark-all-read", {
        method: "PUT",
      });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId)
    );
    try {
      await apiRequest(`/notifications/${notificationId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#073F42] sm:text-2xl">
            Notifications
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            Stay updated with your latest hospital activities and alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#08A6A0] px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#078f8a]"
          >
            <CheckCheck size={16} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notification Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">
                Total Notifications
              </p>
              <p className="mt-0.5 sm:mt-1 text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">
                {notifications.length}
              </p>
            </div>

            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-[#E8F8F6] text-[#08A6A0] [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <Bell />
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">
                Unread
              </p>
              <p className="mt-0.5 sm:mt-1 text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-amber-50 text-amber-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <AlertCircle />
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-[#E2EFED] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2.5 md:px-4 md:py-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#819596]">
                Read
              </p>
              <p className="mt-0.5 sm:mt-1 text-base sm:text-lg md:text-2xl font-bold leading-none text-[#073F42]">
                {notifications.length - unreadCount}
              </p>
            </div>

            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-md sm:rounded-lg md:rounded-xl bg-green-50 text-green-600 [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5 md:[&>svg]:h-5 md:[&>svg]:w-5">
              <CheckCheck />
            </div>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* List Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#073F42]">
              Your Notifications
            </h2>

            {profile && (
              <p className="mt-1 text-xs text-gray-500">
                Notifications for {profile.name}
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="flex w-full gap-2 sm:w-auto">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "read", label: "Read" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition sm:flex-none ${
                  filter === item.key
                    ? "bg-[#E8F8F6] text-[#08A6A0]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const Icon = getTypeIcon(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`p-4 transition hover:bg-gray-50 sm:p-5 ${
                    !notification.read ? "bg-[#E8F8F6]/40" : "bg-white"
                  }`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${getTypeClasses(
                        notification.type
                      )}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm font-semibold ${
                              notification.read
                                ? "text-gray-700"
                                : "text-[#073F42]"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-[#08A6A0]" />
                          )}
                        </div>

                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={13} />
                          {formatNotificationDate(notification.date)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {(notification.actionUrl || notification.relatedEntityType) && (
                          <button
                            onClick={() => handleNotificationClick(notification)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8F8F6] px-2.5 py-1 text-xs font-semibold text-[#08A6A0] transition hover:bg-[#D5F3EF]"
                          >
                            <ExternalLink size={13} />
                            View Related
                          </button>
                        )}

                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#08A6A0] hover:underline"
                          >
                            <Check size={14} />
                            Mark as read
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F8F6] text-[#08A6A0]">
              <Bell size={28} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[#073F42]">
              No notifications
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {filter === "unread"
                ? "You are all caught up. There are no unread notifications."
                : filter === "read"
                ? "You don't have any read notifications yet."
                : "You don't have any notifications at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}