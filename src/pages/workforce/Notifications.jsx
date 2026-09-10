import { useMemo, useState } from "react";
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
} from "lucide-react";

import {
  getWorkforceUser,
  getUserNotifications,
} from "../../data/workforceData";

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
  const employeeId = user?.id || "EMP-1001";

  const profile = getWorkforceUser(employeeId);
  const initialNotifications = getUserNotifications(employeeId);

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

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

  const markAsRead = (notificationId) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#073F42]">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with your latest hospital activities and alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#08A6A0] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#078f8a]"
          >
            <CheckCheck size={17} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notification Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F8F6] text-[#08A6A0]">
              <Bell size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Notifications</p>
              <p className="text-2xl font-bold text-[#073F42]">
                {notifications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold text-[#073F42]">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <CheckCheck size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Read</p>
              <p className="text-2xl font-bold text-[#073F42]">
                {notifications.length - unreadCount}
              </p>
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