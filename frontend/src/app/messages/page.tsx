"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Messages() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    if (u) setUser(JSON.parse(u));

    fetch(`${API_URL}/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setConversations(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/messages/${selected.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data : []));
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selected) return;
    setSending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiver_id: selected.id, content: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { ...data, sender_name: user?.name }]);
        setText("");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff !important; height: 100%; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        .layout { display: flex; flex-direction: column; height: 100vh; }
        .navbar { background: #fff; border-bottom: 1px solid #e4e5e7; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .chat-layout { display: flex; flex: 1; overflow: hidden; }
        .sidebar { width: 320px; border-right: 1px solid #e4e5e7; display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-header { padding: 20px; border-bottom: 1px solid #e4e5e7; }
        .sidebar-header h2 { font-size: 18px; font-weight: 700; }
        .conv-list { flex: 1; overflow-y: auto; }
        .conv-item { display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }
        .conv-item:hover { background: #f9f9f9; }
        .conv-item.active { background: #e8faf0; }
        .avatar { width: 44px; height: 44px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px; flex-shrink: 0; }
        .conv-info { flex: 1; min-width: 0; }
        .conv-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .conv-last { font-size: 12px; color: #74767e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chat-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 16px 24px; border-bottom: 1px solid #e4e5e7; display: flex; align-items: center; gap: 12px; flex-shrink: 0; background: #fff; }
        .chat-header-name { font-weight: 700; font-size: 16px; }
        .messages-list { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .msg { display: flex; gap: 10px; max-width: 70%; }
        .msg.mine { align-self: flex-end; flex-direction: row-reverse; }
        .msg-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e4e5e7; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
        .msg.mine .msg-avatar { background: #1dbf73; color: #fff; }
        .msg-bubble { background: #f0f0f0; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.5; }
        .msg.mine .msg-bubble { background: #1dbf73; color: #fff; }
        .msg-time { font-size: 11px; color: #b5b6b9; margin-top: 4px; }
        .msg.mine .msg-time { text-align: right; }
        .input-area { padding: 16px 24px; border-top: 1px solid #e4e5e7; display: flex; gap: 12px; flex-shrink: 0; background: #fff; }
        .input-area input { flex: 1; padding: 12px 16px; border: 1px solid #e4e5e7; border-radius: 24px; font-size: 14px; outline: none; font-family: inherit; }
        .input-area input:focus { border-color: #1dbf73; }
        .btn-send { background: #1dbf73; color: #fff; border: none; border-radius: 50%; width: 44px; height: 44px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .empty-chat { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #74767e; gap: 12px; }
        .empty-chat .icon { font-size: 64px; }
        .empty-conv { padding: 40px 20px; text-align: center; color: #74767e; font-size: 14px; }
        @media (max-width: 768px) {
          .sidebar { width: 100%; display: ${selected ? 'none' : 'flex'}; }
          .chat-area { display: ${selected ? 'flex' : 'none'}; }
        }
      `}</style>

      <div className="layout">
        <nav className="navbar">
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <div style={{display:"flex",gap:"16px",fontSize:"14px"}}>
            <Link href="/projects">Projectos</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </nav>

        <div className="chat-layout">
          <div className="sidebar">
            <div className="sidebar-header">
              <h2>💬 Mensagens</h2>
            </div>
            <div className="conv-list">
              {loading ? (
                <div className="empty-conv">A carregar...</div>
              ) : conversations.length === 0 ? (
                <div className="empty-conv">
                  <div style={{fontSize:"40px",marginBottom:"8px"}}>💬</div>
                  <p>Nenhuma conversa ainda</p>
                  <p style={{marginTop:"8px"}}>Envia uma proposta para iniciar uma conversa</p>
                </div>
              ) : (
                conversations.map((c, i) => (
                  <div key={i} className={`conv-item ${selected?.id === c.id ? "active" : ""}`} onClick={() => setSelected(c)}>
                    <div className="avatar">{c.name?.[0] || "U"}</div>
                    <div className="conv-info">
                      <div className="conv-name">{c.name}</div>
                      <div className="conv-last">{c.last_message || "Iniciar conversa"}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="chat-area">
            {!selected ? (
              <div className="empty-chat">
                <div className="icon">💬</div>
                <p style={{fontWeight:"600",fontSize:"18px"}}>Selecciona uma conversa</p>
                <p style={{fontSize:"14px"}}>Escolhe uma conversa na lista para comecar</p>
              </div>
            ) : (
              <>
                <div className="chat-header">
                  <div className="avatar" style={{width:"36px",height:"36px",fontSize:"14px"}}>{selected.name?.[0]}</div>
                  <span className="chat-header-name">{selected.name}</span>
                </div>
                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div style={{textAlign:"center",color:"#74767e",marginTop:"40px",fontSize:"14px"}}>
                      Nenhuma mensagem ainda. Diz ola! 👋
                    </div>
                  ) : (
                    messages.map((m, i) => {
                      const isMine = m.sender_id === user?.id;
                      return (
                        <div key={i} className={`msg ${isMine ? "mine" : ""}`}>
                          <div className="msg-avatar">{isMine ? user?.name?.[0] : selected.name?.[0]}</div>
                          <div>
                            <div className="msg-bubble">{m.content}</div>
                            <div className="msg-time">{new Date(m.created_at).toLocaleTimeString("pt", {hour:"2-digit",minute:"2-digit"})}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef}></div>
                </div>
                <div className="input-area">
                  <input type="text" placeholder="Escreve uma mensagem..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
                  <button className="btn-send" disabled={!text.trim() || sending} onClick={sendMessage}>➤</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}