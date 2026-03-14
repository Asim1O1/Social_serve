import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:6190/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:6190";
const PAGE_LIMIT = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmtDate = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yest.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const AVATAR_COLOURS = [
  "bg-emerald-100 text-emerald-800",
  "bg-violet-100 text-violet-800",
  "bg-orange-100 text-orange-800",
  "bg-sky-100 text-sky-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
];
const avatarCls = (id = "") =>
  AVATAR_COLOURS[
  [...(id ?? "")].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLOURS.length
  ];

// ─── API helper ───────────────────────────────────────────────────────────────
// ─── Replace this import at the top of CampaignChat.jsx ─────────────────────
import { api } from "../../axios/axios";

// ─── Remove the old apiFetch and API_BASE constant, replace with this ─────────

// apiFetch now uses the axios `api` instance which:
//   - automatically attaches the Bearer token from sessionStorage
//   - handles 401 → refresh token → retry
//   - returns response.data already (interceptor unwraps it)
const apiFetch = async (path, opts = {}) => {
  const { method = "GET", body, ...rest } = opts;

  const response = await api.request({
    url: path,
    method,
    data: body ? JSON.parse(body) : undefined, // body was JSON.stringify'd, parse it back
    ...rest,
  });

  // axios interceptor already unwraps to response.data
  // your backend wraps in { status, data, message } so unwrap .data
  return response.data ?? response;
};

// ─── Replace the file upload fetch() call inside handleFileChange ─────────────
// Find this block in handleFileChange and replace it:
const handleFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);
  try {
    const fd = new FormData();
    fd.append("file", file);

    // Use api instance — token is attached automatically by the request interceptor
    const response = await api.post("/messages/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // interceptor returns response.data, backend wraps in { data: {...} }
    const att = response.data ?? response;
    await sendMessage(att);
  } catch (err) {
    console.error("Attachment error:", err);
  } finally {
    setUploading(false);
    e.target.value = "";
  }
};

// ─── Socket URL — derive from VITE_BE since port is now in the env var ────────
// Replace the SOCKET_URL constant at the top:

// ─── Socket auth — attach the Bearer token so the server can auth the socket ──
// Replace the socket init inside the useEffect:
export const socket = io(SOCKET_URL, {
  auth: {
    token: sessionStorage.getItem("at"),
  },
});

// ─── Shared components ────────────────────────────────────────────────────────
const Avatar = ({ name = "", userId = "", size = "w-10 h-10", text = "text-sm", online = false }) => (
  <div className="relative flex-shrink-0">
    <div className={`${size} ${text} ${avatarCls(userId)} rounded-full flex items-center justify-center font-medium select-none`}>
      {getInitials(name)}
    </div>
    {online && (
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
    )}
  </div>
);

const TypingDots = () => (
  <div className="flex gap-1 px-3 py-2">
    {[0, 1, 2].map((i) => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </div>
);

const AttachmentBubble = ({ att, mine }) => (
  <a href={att.url} target="_blank" rel="noreferrer"
    className={`flex items-center gap-2 mt-1.5 px-3 py-2 rounded-lg text-xs border
      hover:opacity-80 transition-opacity
      ${mine ? "border-white/20 bg-white/10 text-white" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
    <span className="text-lg">{att.type === "image" ? "🖼" : "📄"}</span>
    <span className="truncate max-w-[160px]">{att.originalName}</span>
  </a>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="px-3 py-2.5 border-b border-gray-100">
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
      <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none min-w-0" />
      {value && (
        <button onClick={() => onChange("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
      )}
    </div>
  </div>
);

const Spinner = ({ size = "w-5 h-5" }) => (
  <div className={`${size} border-2 border-sky-400 border-t-transparent rounded-full animate-spin`} />
);

// ═══════════════════════════════════════════════════════════════════════════════
// CHATS TAB — lists all existing conversations from GET /api/conversations
// ═══════════════════════════════════════════════════════════════════════════════
const ChatsTab = ({ conversations, loadingConvos, activeConvoId, currentUser, onlineUsers, onOpenConvo, onSwitchToPeople }) => {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    const other = c.participants?.find(
      (p) => p && typeof p === "object" && p._id !== currentUser._id
    );
    return `${other?.firstName ?? ""} ${other?.lastName ?? ""}`.toLowerCase()
      .includes(search.toLowerCase());
  });

  if (loadingConvos) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400">
        <Spinner size="w-6 h-6" />
        <span className="text-sm">Loading conversations…</span>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600">No conversations yet</p>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Go to{" "}
            <button onClick={onSwitchToPeople} className="text-sky-500 font-semibold hover:underline">
              People
            </button>{" "}
            and select someone to start chatting
          </p>
        </div>
        <button onClick={onSwitchToPeople}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500 text-white
                     text-sm font-semibold hover:bg-sky-600 transition-colors shadow-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Browse people
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <SearchBar value={search} onChange={setSearch} placeholder="Search conversations…" />
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No results for "{search}"</p>
          </div>
        )}
        {filtered.map((c) => {
          const other = c.participants?.find((p) => p && typeof p === "object" && p._id !== currentUser._id);
          const name = `${other?.firstName ?? ""} ${other?.lastName ?? ""}`.trim();
          const isActive = c._id === activeConvoId;
          const isOnline = !!(other?._id && onlineUsers.has(other._id));
          const lastTxt = c.lastMessage?.text || (c.lastMessage?.attachment ? "Sent an attachment" : "Say hello 👋");
          const lastTime = c.lastMessage?.createdAt ? fmtTime(c.lastMessage.createdAt) : "";

          return (
            <button key={c._id} onClick={() => onOpenConvo(c)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50
                          transition-colors text-left border-l-[3px]
                          ${isActive ? "bg-sky-50 border-l-sky-500" : "hover:bg-gray-50 border-l-transparent"}`}>
              <Avatar name={name} userId={other?._id} size="w-11 h-11" online={isOnline} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1">
                  <p className={`text-[13.5px] font-medium truncate ${isActive ? "text-sky-700" : "text-gray-900"}`}>
                    {name || "Unknown"}
                  </p>
                  <span className={`text-[11px] flex-shrink-0 ${(c.unreadCount ?? 0) > 0 ? "text-sky-500 font-semibold" : "text-gray-300"}`}>
                    {lastTime}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <p className="text-xs text-gray-400 truncate">{lastTxt}</p>
                  {(c.unreadCount ?? 0) > 0 && (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-sky-500
                                     text-white text-[10px] font-bold flex items-center justify-center">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PEOPLE TAB
//
// Clicking a person does NOT call any API.
// It just calls onSelectPerson(entry) which sets a "pendingChat" in the parent.
// The chat panel renders immediately showing the person's info + empty message area.
// POST /api/conversation is only called when the user sends their first message.
// ═══════════════════════════════════════════════════════════════════════════════
const PeopleTab = ({ currentUser, conversations, onlineUsers, onSelectPerson }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = currentUser.role === "ADMIN"
      ? "/campaign"
      : "/campaign?myVolunteerStatus=accepted";

    apiFetch(url)
      .then((res) => setCampaigns(res.campaigns ?? res ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser.role]);

  // Build flat list of chattable people across all campaigns.
  // Same interface for both roles.
  const allEntries = [];
  campaigns.forEach((camp) => {
    const campId = camp.id ?? camp._id;
    const adminId = typeof camp.createdBy === "object"
      ? camp.createdBy?._id
      : camp.createdBy;

    const iAmAdmin = adminId === currentUser._id;

    if (iAmAdmin) {
      // I created this campaign → show each accepted volunteer
      (camp.volunteers ?? [])
        .filter((v) => v.status === "accepted" && v.volunteer)
        .forEach((v) => {
          const vol = v.volunteer;
          const name = `${vol.firstName ?? ""} ${vol.lastName ?? ""}`.trim();
          allEntries.push({
            key: `${campId}-${vol._id}`,
            campaignId: campId,
            campaignTitle: camp.title,
            personId: vol._id,
            personName: name,
            personObj: vol,
            volunteerId: vol._id,
            roleLabel: "Volunteer",
          });
        });
    } else {
      // I am a volunteer in this campaign → show the admin
      const iAmAccepted = (camp.volunteers ?? []).some(
        (v) =>
          v.status === "accepted" &&
          v.volunteer &&
          (typeof v.volunteer === "object" ? v.volunteer._id : v.volunteer) === currentUser._id
      );
      if (!iAmAccepted) return;

      const admin = typeof camp.createdBy === "object" ? camp.createdBy : null;
      if (!admin) return;

      const name = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();
      allEntries.push({
        key: `${campId}-${admin._id}`,
        campaignId: campId,
        campaignTitle: camp.title,
        personId: admin._id,
        personName: name,
        personObj: admin,
        volunteerId: currentUser._id,
        roleLabel: "Campaign Admin",
      });
    }
  });

  const filtered = search.trim()
    ? allEntries.filter(
      (e) =>
        e.personName.toLowerCase().includes(search.toLowerCase()) ||
        e.campaignTitle.toLowerCase().includes(search.toLowerCase()),
    )
    : allEntries;

  const grouped = filtered.reduce((acc, e) => {
    if (!acc[e.campaignId]) acc[e.campaignId] = { title: e.campaignTitle, items: [] };
    acc[e.campaignId].items.push(e);
    return acc;
  }, {});

  // Find an existing conversation with this person (if any)
  const findConvo = (personId) =>
    conversations.find((c) =>
      c.participants?.some((p) => p && typeof p === "object" && p._id === personId)
    );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400">
        <Spinner size="w-6 h-6" />
        <span className="text-sm">Loading people…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <SearchBar value={search} onChange={setSearch} placeholder="Search name or campaign…" />
      <div className="flex-1 overflow-y-auto">
        {allEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-2">
            <span className="text-4xl">👥</span>
            <p className="text-sm font-semibold text-gray-500 mt-1">Nobody to chat with yet</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Volunteers must be accepted into a campaign before they appear here.
            </p>
          </div>
        )}
        {allEntries.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center">
            <span className="text-3xl">🔍</span>
            <p className="text-sm text-gray-500 mt-2">No results for "{search}"</p>
          </div>
        )}

        {Object.entries(grouped).map(([campId, group]) => (
          <div key={campId}>
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 sticky top-0 z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">
                {group.title}
              </p>
            </div>

            {group.items.map((entry) => {
              const isOnline = !!(entry.personId && onlineUsers.has(entry.personId));
              const existingConvo = findConvo(entry.personId);

              return (
                <button
                  key={entry.key}
                  onClick={() => onSelectPerson(entry, existingConvo ?? null)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50
                             hover:bg-sky-50/70 active:bg-sky-100/60 transition-colors text-left group"
                >
                  <Avatar name={entry.personName} userId={entry.personId}
                    size="w-11 h-11" text="text-sm" online={isOnline} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-gray-900 truncate">
                      {entry.personName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {entry.roleLabel}
                      {isOnline && <span className="ml-2 text-emerald-500 font-medium">● Online</span>}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-10 flex items-center justify-center">
                    {existingConvo ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                                       bg-sky-50 text-sky-500 border border-sky-100 whitespace-nowrap">
                        Open
                      </span>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center
                                      opacity-0 group-hover:opacity-100 transition-all
                                      scale-90 group-hover:scale-100 shadow-sm">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
//
// State model:
//   activeConvoId  — _id of an existing conversation (from GET /conversations or POST /conversation)
//   pendingChat    — { entry } when a person is selected from People but no convo exists yet
//
// Flow for new chat:
//   1. User clicks person in People tab
//   2. If existing convo found → openConvo(convo) → fetch messages normally
//   3. If no existing convo   → setPendingChat(entry) → show empty chat UI immediately
//   4. User types and sends first message
//   5. sendMessage() calls POST /api/conversation to create the convo
//   6. Gets back convoId → emits send_message via socket → clears pendingChat
// ═══════════════════════════════════════════════════════════════════════════════
export default function CampaignChat({ currentUser, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [pendingChat, setPendingChat] = useState(null); // { entry } — no convo yet
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [sidebarTab, setSidebarTab] = useState("chats");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);

  const activeConvo = conversations.find((c) => c._id === activeConvoId) ?? null;
  const totalUnread = conversations.reduce((a, c) => a + (c.unreadCount ?? 0), 0);
  // True when we should show a chat panel (either real convo or pending new one)
  const hasChatOpen = activeConvoId !== null || pendingChat !== null;

  // ── Socket ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => socket.emit("register", currentUser._id));

    socket.on("online_users", (ids) => setOnlineUsers(new Set(ids)));
    socket.on("user_online", ({ userId }) => setOnlineUsers((p) => new Set([...p, userId])));
    socket.on("user_offline", ({ userId }) => setOnlineUsers((p) => { const n = new Set(p); n.delete(userId); return n; }));

    socket.on("message_received", ({ message }) => {
      setMessages((p) => p.find((m) => m._id === message._id) ? p : [...p, message]);
      setConversations((p) =>
        p.map((c) =>
          c._id === message.conversationId
            ? { ...c, lastMessage: message, unreadCount: (c.unreadCount ?? 0) + (message.sender?._id !== currentUser._id ? 1 : 0) }
            : c
        )
      );
    });

    socket.on("new_message_notification", ({ conversationId }) =>
      setConversations((p) =>
        p.map((c) => c._id === conversationId && c._id !== activeConvoId
          ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 }
          : c
        )
      )
    );

    socket.on("user_typing", ({ userId }) => setTypingUsers((p) => ({ ...p, [userId]: true })));
    socket.on("user_stop_typing", ({ userId }) => setTypingUsers((p) => { const n = { ...p }; delete n[userId]; return n; }));

    socket.on("messages_seen", ({ conversationId, readBy }) => {
      if (conversationId === activeConvoId) {
        setMessages((p) => p.map((m) =>
          m.sender?._id === currentUser._id
            ? { ...m, readBy: [...(m.readBy ?? []), readBy] }
            : m
        ));
      }
    });

    socket.on("message_error", ({ error }) => console.error("Socket error:", error));

    return () => {
      if (activeConvoId) socket.emit("leave_conversation", { conversationId: activeConvoId });
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load conversations on mount ─────────────────────────────────────────────
  useEffect(() => {
    setLoadingConvos(true);
    apiFetch("/message/conversations")
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoadingConvos(false));
  }, []);

  // Auto-switch to People tab if no conversations
  useEffect(() => {
    if (!loadingConvos && conversations.length === 0) setSidebarTab("people");
  }, [loadingConvos, conversations.length]);

  // ── Open an EXISTING conversation (from ChatsTab or after first message sent) ─
  const openConvo = useCallback(async (convo) => {
    const convoId = typeof convo === "object" ? convo._id : convo;
    if (!convoId) return;

    const socket = socketRef.current;
    if (activeConvoId && activeConvoId !== convoId && socket)
      socket.emit("leave_conversation", { conversationId: activeConvoId });

    setPendingChat(null);
    setActiveConvoId(convoId);
    setSidebarTab("chats");
    setMessages([]);
    setPage(1);
    setHasMore(false);
    setLoadingMsgs(true);

    try {
      const data = await apiFetch(`/message/conversation/${convoId}/messages?page=1&limit=${PAGE_LIMIT}`);
      const msgs = data.messages ?? [];
      setMessages([...msgs].reverse());
      setHasMore(msgs.length === PAGE_LIMIT);
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setLoadingMsgs(false);
    }

    if (socket) {
      socket.emit("join_conversation", { conversationId: convoId });
      socket.emit("messages_read", { conversationId: convoId, userId: currentUser._id });
    }
    setConversations((p) => p.map((c) => c._id === convoId ? { ...c, unreadCount: 0 } : c));
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [activeConvoId, currentUser._id]);

  // ── Select a person from PeopleTab ──────────────────────────────────────────
  // If they already have a convo → open it normally (fetch messages)
  // If no convo yet             → set pendingChat, show empty chat UI immediately
  //                               POST /api/conversation happens only on first send
  const handleSelectPerson = useCallback((entry, existingConvo) => {
    if (existingConvo) {
      openConvo(existingConvo);
      return;
    }
    // No convo yet — show chat UI without any API call
    if (activeConvoId) {
      socketRef.current?.emit("leave_conversation", { conversationId: activeConvoId });
    }
    setActiveConvoId(null);
    setMessages([]);
    setPage(1);
    setHasMore(false);
    setPendingChat(entry);
    setSidebarTab("chats");
  }, [activeConvoId, openConvo]);

  // ── Load older messages ─────────────────────────────────────────────────────
  const loadMore = async () => {
    if (!hasMore || loadingMsgs || !activeConvoId) return;
    const next = page + 1;
    setLoadingMsgs(true);
    try {
      const data = await apiFetch(`/messages/conversation/${activeConvoId}/messages?page=${next}&limit=${PAGE_LIMIT}`);
      const msgs = data.messages ?? [];
      setMessages((p) => [...[...msgs].reverse(), ...p]);
      setHasMore(msgs.length === PAGE_LIMIT);
      setPage(next);
    } catch (e) { console.error(e); }
    finally { setLoadingMsgs(false); }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Typing ──────────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!activeConvoId) return; // no typing events for pending chats
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("typing", { conversationId: activeConvoId, userId: currentUser._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { conversationId: activeConvoId, userId: currentUser._id });
    }, 2000);
  };

  // ── Send message ─────────────────────────────────────────────────────────────
  // If pendingChat (no convo yet):
  //   1. POST /api/conversation { campaignId, volunteerId } → get convoId
  //   2. Merge new convo into conversations[]
  //   3. Emit send_message via socket
  //   4. Clear pendingChat, set activeConvoId
  // If activeConvoId (existing convo):
  //   Just emit send_message via socket
  const sendMessage = async (attachmentPayload = null) => {
    const trimmed = text.trim();
    if (!trimmed && !attachmentPayload) return;

    const socket = socketRef.current;

    if (pendingChat) {
      // ── First message in a new conversation ──────────────────────────────
      setText("");
      if (inputRef.current) inputRef.current.style.height = "auto";

      try {
        // Create the conversation
        const convo = await apiFetch("/message/conversation", {
          method: "POST",
          body: JSON.stringify({
            campaignId: pendingChat.campaignId,
            volunteerId: pendingChat.volunteerId,
          }),
        });

        const convoId = convo._id;

        // Merge into conversations list
        setConversations((p) => {
          const exists = p.find((c) => c._id === convoId);
          return exists ? p : [convo, ...p];
        });

        // Set as active
        setActiveConvoId(convoId);
        setPendingChat(null);

        // Join socket room
        socket?.emit("join_conversation", { conversationId: convoId });

        // Send the message
        socket?.emit("send_message", {
          conversationId: convoId,
          senderId: currentUser._id,
          text: trimmed || null,
          attachment: attachmentPayload || undefined,
        });

        // Reload conversations so sidebar shows the new one with lastMessage
        apiFetch("/message/conversations").then(setConversations).catch(console.error);

      } catch (e) {
        console.error("Failed to create conversation:", e);
        // Restore text if failed
        if (trimmed) setText(trimmed);
      }

    } else if (activeConvoId) {
      // ── Normal send to existing conversation ─────────────────────────────
      socket?.emit("send_message", {
        conversationId: activeConvoId,
        senderId: currentUser._id,
        text: trimmed || null,
        attachment: attachmentPayload || undefined,
      });
      socket?.emit("stop_typing", { conversationId: activeConvoId, userId: currentUser._id });
      clearTimeout(typingTimeout.current);
      setText("");
      if (inputRef.current) inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Upload attachment ─────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/messages/upload`, {
        method: "POST", credentials: "include", body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const att = (await res.json()).data;
      await sendMessage(att);
    } catch (err) {
      console.error("Attachment error:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ── Derive chat header info ───────────────────────────────────────────────────
  // Works for both existing convo (participants) and pending chat (entry.personObj)
  const chatOther = (() => {
    if (pendingChat) {
      return {
        _id: pendingChat.personId,
        firstName: pendingChat.personObj?.firstName ?? pendingChat.personName?.split(" ")[0] ?? "",
        lastName: pendingChat.personObj?.lastName ?? pendingChat.personName?.split(" ")[1] ?? "",
      };
    }
    if (activeConvo) {
      return activeConvo.participants?.find(
        (p) => p && typeof p === "object" && p._id && p._id !== currentUser._id
      ) ?? null;
    }
    return null;
  })();

  const chatOtherName = chatOther ? `${chatOther.firstName ?? ""} ${chatOther.lastName ?? ""}`.trim() : "";
  const chatOtherOnline = !!(chatOther?._id && onlineUsers.has(chatOther._id));
  const chatSomebodyTyping = !!(chatOther?._id && typingUsers[chatOther._id]);

  // Group messages by date
  const groupedMessages = messages.reduce((acc, m) => {
    const key = m.createdAt ? fmtDate(m.createdAt) : "Today";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex absolute top-10 right-4 h-[80vh] bg-gray-50 overflow-hidden font-sans">

      {/* ════════════ SIDEBAR ════════════ */}
      <aside className="w-[300px] min-w-[300px] bg-white border-r border-gray-100 flex flex-col h-screen">

        {/* Current user */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <Avatar name={`${currentUser.firstName} ${currentUser.lastName}`}
            userId={currentUser._id} size="w-9 h-9" text="text-xs" online={true} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-[11px] text-emerald-500 font-medium">● Active</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {[
            { id: "chats", label: "Chats", badge: totalUnread > 0 ? totalUnread : null },
            { id: "people", label: "People", badge: null },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setSidebarTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px]
                          font-semibold transition-colors relative
                          ${sidebarTab === tab.id ? "text-sky-600" : "text-gray-400 hover:text-gray-600"}`}>
              {tab.label}
              {tab.badge !== null && (
                <span className="min-w-[16px] h-4 px-1 rounded-full bg-sky-500 text-white
                                 text-[10px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
              {sidebarTab === tab.id && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-sky-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div className="flex flex-col flex-1 min-h-0">
          {sidebarTab === "chats" ? (
            <ChatsTab
              conversations={conversations}
              loadingConvos={loadingConvos}
              activeConvoId={activeConvoId}
              currentUser={currentUser}
              onlineUsers={onlineUsers}
              onOpenConvo={openConvo}
              onSwitchToPeople={() => setSidebarTab("people")}
            />
          ) : (
            <PeopleTab
              currentUser={currentUser}
              conversations={conversations}
              onlineUsers={onlineUsers}
              onSelectPerson={handleSelectPerson}
            />
          )}
        </div>
      </aside>

      {/* ════════════ CHAT AREA ════════════ */}
      {!hasChatOpen ? (
        /* Welcome state */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-10 bg-gray-50/80">
          <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <svg className="w-9 h-9 text-gray-300" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-500">Your messages live here</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {conversations.length === 0
                ? "Go to People and select someone to start your first conversation."
                : "Select a conversation from the left to continue chatting."}
            </p>
          </div>
          {conversations.length === 0 && (
            <button onClick={() => setSidebarTab("people")}
              className="px-5 py-2 rounded-full bg-sky-500 text-white text-sm font-semibold
                         hover:bg-sky-600 transition-colors shadow-sm">
              Browse people
            </button>
          )}
        </div>
      ) : (
        /* Chat panel — works for both pending and existing convos */
        <div className="flex-1 flex flex-col h-screen min-w-0">

          {/* Header */}
          <div className="h-[60px] bg-white border-b border-gray-100 flex items-center
                          px-5 gap-3 flex-shrink-0 shadow-sm">
            {chatOther ? (
              <>
                <Avatar name={chatOtherName} userId={chatOther._id}
                  size="w-9 h-9" text="text-xs" online={chatOtherOnline} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{chatOtherName || "Unknown"}</p>
                  <p className={`text-xs ${chatOtherOnline ? "text-emerald-500" : "text-gray-400"}`}>
                    {chatOtherOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <Spinner size="w-4 h-4" />
                <span className="text-sm text-gray-400">Loading…</span>
              </div>
            )}
            {onClose && (
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                           hover:bg-gray-100 hover:text-gray-600 transition-colors">
                ✕
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1">

            {hasMore && (
              <div className="text-center mb-2">
                <button onClick={loadMore} disabled={loadingMsgs}
                  className="text-xs text-sky-500 border border-sky-100 bg-sky-50 rounded-full
                             px-4 py-1.5 hover:bg-sky-100 transition-colors disabled:opacity-50">
                  {loadingMsgs ? "Loading…" : "Load older messages"}
                </button>
              </div>
            )}

            {loadingMsgs && messages.length === 0 && (
              <div className="flex justify-center py-10"><Spinner size="w-5 h-5" /></div>
            )}

            {/* Empty state — pending chat or new conversation with no messages */}
            {!loadingMsgs && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  {chatOther && (
                    <Avatar name={chatOtherName} userId={chatOther._id}
                      size="w-14 h-14" text="text-base" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">{chatOtherName}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {pendingChat
                      ? "Send a message to start the conversation"
                      : "No messages yet — say something!"}
                  </p>
                </div>
              </div>
            )}

            {/* Message bubbles grouped by date */}
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date} className="flex flex-col gap-1">
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[11px] text-gray-400 whitespace-nowrap
                                   border border-gray-100 rounded-full py-0.5 px-2.5">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {msgs.map((m, i) => {
                  const isMine = m.sender?._id === currentUser._id || m.sender === currentUser._id;
                  const isLast = i === msgs.length - 1;
                  const seen = isMine && (m.readBy ?? []).some((id) => id !== currentUser._id);

                  return (
                    <div key={m._id}
                      className={`flex flex-col mb-0.5 ${isMine ? "items-end" : "items-start"}`}>
                      <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
                        {!isMine && chatOther && (
                          <Avatar name={chatOtherName} userId={chatOther._id}
                            size="w-7 h-7" text="text-[10px]" />
                        )}
                        <div className={`max-w-[60%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed
                          ${isMine
                            ? "bg-sky-500 text-white rounded-br-sm"
                            : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"}`}>
                          {m.text && <p>{m.text}</p>}
                          {m.attachment?.url && <AttachmentBubble att={m.attachment} mine={isMine} />}
                          <p className={`text-[11px] mt-1 ${isMine ? "text-white/60 text-right" : "text-gray-400"}`}>
                            {m.createdAt ? fmtTime(m.createdAt) : ""}
                          </p>
                        </div>
                      </div>
                      {isMine && isLast && (
                        <p className={`text-[11px] mt-0.5 mr-1 ${seen ? "text-emerald-500" : "text-gray-400"}`}>
                          {seen ? "Seen" : "Delivered"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {chatSomebodyTyping && chatOther && (
              <div className="flex items-end gap-2 mt-1">
                <Avatar name={chatOtherName} userId={chatOther._id} size="w-7 h-7" text="text-[10px]" />
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 flex items-center gap-2.5 px-4 py-3 flex-shrink-0">
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              title="Attach file"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
                         text-gray-400 text-lg hover:bg-gray-50 hover:text-gray-600
                         transition-colors flex-shrink-0 disabled:opacity-40">
              📎
            </button>
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={uploading}
              placeholder={
                uploading
                  ? "Uploading…"
                  : pendingChat
                    ? `Message ${chatOtherName || ""}…`
                    : "Type a message…"
              }
              rows={1}
              className="flex-1 px-4 py-2.5 text-[13.5px] bg-gray-50 border border-gray-200
                         rounded-2xl placeholder-gray-400 resize-none leading-snug max-h-20
                         focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400
                         transition-all disabled:opacity-50"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!text.trim() || uploading}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                          transition-all
                          ${text.trim()
                  ? "bg-sky-500 hover:bg-sky-600 shadow-sm"
                  : "bg-gray-200 cursor-not-allowed"}`}>
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}