"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Messages() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  const loadMessages = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {}
  };

  const sendMessage = async () => {
    if (!text.trim() || !selected) return;
    setSending(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiver_id: selected.id, content: text }),
      });
      setText("");
      loadMessages(selected.id);
    } catch {}
    setSending(false);
  };

  const selectConversation = (conv: any) => {
    setSelected(conv);
    loadMessages(conv.id);
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff !important; height: 100%; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        .page { display: flex; flex-direction: column; height: 100vh; }
        .navbar { background: #fff; border-bottom: 1px solid #e4e5e7; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .chat-container { display: flex; flex: 1; overflow: hidden; }
        .sidebar { width: 320px; border-right: 1px solid #e4e5e7; display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-header { padding: 20px; border-bottom: 1px solid #e4e5e7; }
        .sidebar-header h2 { font-size: 18px; font-weight: 700; }
        .conv-list { flex: 1; overflow-y: auto; }
        .conv-item { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: background 0.15s; }
        .conv-item:hover { background: #f9f9f9; }
        .conv-item.active { background: #e8faf0; }
        .avatar { width: 44px; height: 44px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px; flex-shrink: 0; }
        .conv-info { flex: 1; min-width: 0; }
        .conv-name { font-weight: 600; font-size: 14px; color: #404145; }
        .conv-preview { font-size: 12px; color: #74767e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
        .chat-area { flex: 1; display: flex; flex-direction: column; }
        .chat-header { padding: 16px 24px; border-bottom: 1px solid #e4e5e7; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .chat-name { font-weight: 700; font-size: 16px; }
        .messages-list { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .message { max-width: 70%; }
        .message.mine { align-self: flex-end; }
        .message.theirs { align-self: flex-start; }
        .bubble { padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; }
        .mine .bubble { background: #1dbf73; color: #fff; border-bottom-right-radius: 4px; }
        .theirs .bubble { background: #f0f0f0; color: #404145; border-bottom-left-radius: 4px; }
        .msg-time { font-size: 11px; color: #b5b6b9; margin-top: 4px; text-align: right; }
        .theirs .msg-time { text-align: left; }
        .input-area { padding: 16px 24px; border-top: 1px solid #e4e5e7; display: flex; gap: 12px; align-items: center; flex-shrink: 0; }
        .input-area input { flex: 1; padding: 12px 16px; border: 1px solid #e4e5e7; border-radius: 24px; font-size: 14px; outline: none; font-family: inherit; }
        .input-area input:focus { border-color: #1dbf73; }
        .btn-send { width: 44px; height: 44px; border-radius: 50%; background: #1dbf73; color: #fff; border: none; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .empty-chat { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #74767e; gap: 12px; }
        .empty-icon { font-size: 64px; }
        .empty-chat h3 { font-size: 18px; font-weight: 600; color: #404145; }
        .empty-conv { padding: 40px 20px; text-align: center; color: #74767e; font-size: 14px; }
        @media (max-width: 768px) {
          .sidebar { width: 100%; display: ${`${selected ? "none" : "flex"}`}; }
          .chat-area { display: ${`${selected ? "flex" : "none"}`}; }
        }
      `}</style>

      <div className="page">
        <nav className="navbar">
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <div style={{display:"flex", gap:"16px", fontSize:"14px"}}>
            <Link href="/projects">Projectos</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </nav>

        <div className="chat-container">
          <div className="sidebar">
            <div className="sidebar-header">
              <h2>💬 Mensagens</h2>
            </div>
            <div className="conv-list">
              {loading ? (
                <div className="empty-conv">⏳ A carregar...</div>
              ) : conversations.length === 0 ? (
                <div className="empty-conv">
                  <div style={{fontSize:"40px",marginBottom:"8px"}}>💬</div>
                  Ainda nao tens conversas.<br/>Envia uma proposta para comecar!
                </div>
              ) : (
                conversations.map((c, i) => (
                  <div key={i} className={`conv-item ${selected?.id === c.id ? "active" : ""}`} onClick={() => selectConversation(c)}>
                    <div className="avatar">{c.name?.[0] || "?"}</div>
                    <div className="conv-info">
                      <div className="conv-name">{c.name}</div>
                      <div className="conv-preview">{c.last_message || "Sem mensagens"}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="chat-area">
            {!selected ? (
              <div className="empty-chat">
                <div className="empty-icon">💬</div>
                <h3>Selecciona uma conversa</h3>
                <p>Escolhe uma conversa no painel esquerdo</p>
              </div>
            ) : (
              <>
                <div className="chat-header">
                  <div className="avatar" style={{width:"36px",height:"36px",fontSize:"14px"}}>{selected.name?.[0]}</div>
                  <div className="chat-name">{selected.name}</div>
                </div>

                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div style={{textAlign:"center",color:"#74767e",fontSize:"14px",marginTop:"40px"}}>
                      Nenhuma mensagem ainda. Diz ola! 👋
                    </div>
                  ) : (
                    messages.map((m, i) => (
                      <div key={i} className={`message ${m.sender_id === user?.id ? "mine" : "theirs"}`}>
                        <div className="bubble">{m.content}</div>
                        <div className="msg-time">
                          {new Date(m.created_at).toLocaleTimeString("pt-PT", {hour:"2-digit",minute:"2-digit"})}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef}></div>
                </div>

                <div className="input-area">
                  <input
                    type="text"
                    placeholder="Escreve uma mensagem..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                  />
                  <button className="btn-send" disabled={!text.trim() || sending} onClick={sendMessage}>
                    ➤
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}