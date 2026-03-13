import { Bell, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../../axios/axios";
import { socket } from "../../socket/socket";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]); // flat array
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // ── Initial load ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notification");
        if (res.status === "success") {
          setNotifications(res.data.notifications ?? []);
          setUnreadCount(res.data.unreadCount ?? 0);
        }
      } catch (error) {
        console.error("[Notification] Fetch error:", error);
      }
    };
    fetchNotifications();
  }, []);

  // ── Real-time: prepend incoming notification ──────────────────────────
  useEffect(() => {
    const onNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification", onNotification);
    return () => socket.off("notification", onNotification);
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notification/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("[Notification] Mark as read error:", error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notification/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("[Notification] Mark all read error:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notification/${id}`);
      const target = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("[Notification] Delete error:", error);
    }
  };

  const handleClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────
  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-primary rounded-full hover:bg-gray-100 transition"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white border border-primary/20 rounded-xl shadow-lg z-50">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h4 className="font-semibold text-primary">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-500 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="text-center text-gray-400 py-6 text-sm">
                No notifications
              </p>
            )}
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                  !n.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div onClick={() => handleClick(n)} className="flex-1">
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
