import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router";
import { api } from "../../axios/axios";
import { socket } from "../../socket/socket";

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    // const navigate = useNavigate();


    /* ================= SOCKET LISTENER ================= */
    useEffect(() => {

        socket.on("notification", (data) => {
            setNotifications((prev) => ({ data, ...prev }));
        });

        return () => {
            console.log("[Socket] Cleaning up socket listener");
            socket.off("notification");
        };
    }, []);

    /* ================= INITIAL LOAD ================= */
    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notification");

            if (res.status === "success") {
                setNotifications(res.data);
            } else {
                console.log("[API] Failed to fetch notifications:", res);
            }
        } catch (error) {
            console.error("[API] Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    /* ================= ACTIONS ================= */
    const markAsRead = async (id) => {
        console.log(`[Action] Marking notification ${id} as read`);
        try {
            await api.patch(`/notification/${id}/read`);

            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error(`[Action] Error marking notification ${id} as read:`, error);
        }
    };

    const markAllRead = async () => {
        console.log("[Action] Marking all notifications as read");
        try {
            await api.patch("/notification/read-all");

            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("[Action] Error marking all notifications as read:", error);
        }
    };

    const deleteNotification = async (id) => {
        console.log(`[Action] Deleting notification ${id}`);
        try {
            await api.delete(`/notification/${id}`);

            setNotifications((prev) => prev.filter((n) => n._id !== id));
        } catch (error) {
            console.error(`[Action] Error deleting notification ${id}:`, error);
        }
    };

    const handleClick = async (notification) => {

        if (!notification.isRead) {
            await markAsRead(notification._id);
        }

        // if (notification.redirectLink) {
        //     console.log("[Action] Redirecting to:", notification.redirectLink);
        //     navigate(notification.redirectLink);
        // }
    };



    /* ================= UI ================= */
    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => {
                    console.log("[UI] Toggling notification dropdown:", !open);
                    setOpen(!open);
                }}
                className="relative p-2 text-primary rounded-full hover:bg-gray-100 transition"
            >
                <Bell size={22} />

                {notifications?.unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-96 bg-white border border-primary/20 rounded-xl shadow-lg z-50">
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-3 border-b">
                        <h4 className="font-semibold text-primary">Notifications</h4>

                        {notifications?.unreadCount > 0 && (
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
                        {notifications?.length === 0 && (
                            <p className="text-center text-gray-400 py-6 text-sm">
                                No notifications
                            </p>
                        )}

                        {notifications?.notifications?.map((n) => (
                            <div
                                key={n._id}
                                className={`flex gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${!n.isRead ? "bg-blue-50" : ""
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