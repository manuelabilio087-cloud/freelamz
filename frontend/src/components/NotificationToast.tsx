"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";

interface Notification {
  id: string;
  type: "message" | "proposal" | "info";
  title: string;
  body: string;
  url: string;
}

export default function NotificationToast() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { onNotification } = useSocket(user?.id);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    // Busca contagem inicial de não lidas
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://freelamz-production.up.railway.app/api/messages/unread/count`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch {}
    };
    fetchUnread();

    // Escuta notificações em tempo real
    const cleanup = onNotification(user.id, (notif: Notification) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { ...notif, id }]);
      setUnreadCount((c) => c + 1);

      // Remove após 5 segundos
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    });

    return cleanup;
  }, [user?.id]);

  const removeNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case "proposal":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Badge de não lidas — exportado via window para navbar usar */}
      {typeof window !== "undefined" && ((window as any).__unreadCount = unreadCount)}

      {/* Toasts */}
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "360px",
      }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => { window.location.href = n.url; }}
            style={{
              background: "#fff",
              border: "1px solid #e8eaf0",
              borderRadius: "14px",
              padding: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              cursor: "pointer",
              animation: "slideIn 0.3s ease",
              borderLeft: "4px solid #6366f1",
            }}
          >
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#eef2ff",
              color: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {getIcon(n.type)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "700", fontSize: "14px", color: "#1a1d27", marginBottom: "2px" }}>
                {n.title}
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {n.body}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "2px", flexShrink: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}