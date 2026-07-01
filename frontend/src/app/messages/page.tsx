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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selected && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [selected]);

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
      setTimeout(() => inputRef.current?.focus(), 100);
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
        .page { display: flex; flex-direction: column; height: 100dvh; }
        
        .logo { font-size: 20px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .page-topbar { display: flex; align-items: center; gap: 10px; padding: 0 16px; height: 56px; border-bottom: 1px solid #e4e5e7; flex-shrink: 0; background: #fff; }
        .page-topbar a { display: flex; align-items: center; color: #404145; }
        .chat-container { display: flex; flex: 1; overflow: hidden; }
        .sidebar { width: 320px; border-right: 1px solid #e4e5e7; display: flex; flex-direction: column; flex-shrink: 0; background: #fff; }
        .sidebar-header { padding: 16px 20px; border-bottom: 1px solid #e4e5e7; display: flex; align-items: center; gap: 10px; }
        .sidebar-header h2 { font-size: 16px; font-weight: 700; }
        .conv-list { flex: 1; overflow-y: auto; }
        .conv-item { padding: 14px 18px; border-bottom: 1px solid #f0f0f0; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: background 0.15s; }
        .conv-item:hover { background: #f9f9f9; }
        .conv-item.active { background: #e8faf0; }
        .avatar { width: 44px; height: 44px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px; flex-shrink: 0; }
        .conv-info { flex: 1; min-width: 0; }
        .conv-name { font-weight: 600; font-size: 14px; color: #404145; }
        .conv-preview { font-size: 12px; color: #74767e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
        .chat-area { flex: 1; display: flex; flex-direction: column; min-width: 0; background: #f9f9f9; position: relative; }
        .chat-header { padding: 12px 20px; border-bottom: 1px solid #e4e5e7; display: flex; align-items: center; gap: 12px; flex-shrink: 0; background: #fff; }
        .chat-name { font-weight: 700; font-size: 15px; }
        .online-dot { width: 8px; height: 8px; border-radius: 50%; background: #1dbf73; }
        .messages-list { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
        .message { max-width: 75%; display: flex; flex-direction: column; }
        .message.mine { align-self: flex-end; align-items: flex-end; }
        .message.theirs { align-self: flex-start; align-items: flex-start; }
        .bubble { padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; word-break: break-word; }
        .mine .bubble { background: #1dbf73; color: #fff; border-bottom-right-radius: 4px; }
        .theirs .bubble { background: #fff; color: #404145; border-bottom-left-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .msg-time { font-size: 11px; color: #b5b6b9; margin-top: 3px; }
        .input-area { padding: 12px 16px; border-top: 1px solid #e4e5e7; display: flex; gap: 10px; align-items: flex-end; background: #fff; position: relative; z-index: 10; }
        .input-wrap { flex: 1; display: flex; align-items: center; background: #f5f5f5; border-radius: 20px; border: 1.5px solid #e4e5e7; padding: 4px 14px; transition: border-color 0.2s; }
        .input-wrap:focus-within { border-color: #1dbf73; background: #fff; }
        .input-wrap input { flex: 1; border: none; outline: none; font-size: 15px; background: transparent; padding: 10px 0; color: #404145; font-family: inherit; min-width: 0; -webkit-appearance: none; appearance: none; }
        .btn-send { width: 40px; height: 40px; border-radius: 50%; background: #1dbf73; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; margin-bottom: 2px; }
        .btn-send:hover { background: #0fa85c; }
        .btn-send:disabled { opacity: 0.4; cursor: not-allowed; }
        .empty-chat { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #74767e; gap: 12px; background: #f9f9f9; }
        .empty-chat h3 { font-size: 16px; font-weight: 600; color: #404145; }
        .empty-conv { padding: 40px 20px; text-align: center; color: #74767e; font-size: 14px; }
        @media (min-width: 769px) { .page-topbar { display: none; } }
        @media (max-width: 768px) {
          .sidebar { display: none; position: absolute; top: 56px; left: 0; width: 100%; height: calc(100dvh - 56px); z-index: 50; }
          .sidebar.show { display: flex; }
          .chat-area { width: 100%; }
          .input-wrap input { font-size: 16px; }
        }
      `}</style>

      <div className="page">
        {!selected && (
          <div className="page-topbar">
            <Link href="/dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#404145" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <span className="logo">Freel<span>amz</span></span>
          </div>
        )}

        <div className="chat-container">
          {/* SIDEBAR */}
          <div className={`sidebar ${!selected ? "show" : ""}`}>
            <div className="sidebar-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <h2>Mensagens</h2>
            </div>
            <div className="conv-list">
              {loading ? (
                <div className="empty-conv">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2" style={{animation:"spin 1s linear infinite",margin:"0 auto 8px",display:"block"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  A carregar...
                </div>
              ) : conversations.length === 0 ? (
                <div className="empty-conv">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block"}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <p>Ainda nao tens conversas.</p>
                  <p style={{marginTop:"4px"}}>Envia uma proposta para começar!</p>
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

          {/* CHAT AREA */}
          <div className="chat-area">
            {selected && (
              <>
                <div className="chat-header">
                  <button onClick={() => setSelected(null)} style={{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#74767e",display:"flex",alignItems:"center"}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#74767e" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <div className="avatar" style={{width:"36px",height:"36px",fontSize:"14px"}}>{selected.name?.[0]}</div>
                  <div>
                    <div className="chat-name">{selected.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"12px",color:"#74767e"}}>
                      <div className="online-dot"></div> Online
                    </div>
                  </div>
                </div>

                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div style={{textAlign:"center",color:"#74767e",fontSize:"14px",marginTop:"40px"}}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block"}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      Nenhuma mensagem ainda. Diz olá! 👋
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
                  <div className="input-wrap">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Escreve uma mensagem..."
                      value={text}
                      onChange={e => setText(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="sentences"
                      inputMode="text"
                    />
                  </div>
                  <button className="btn-send" disabled={!text.trim() || sending} onClick={sendMessage}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </>
            )}

            {!selected && (
              <div className="empty-chat">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <h3>Selecciona uma conversa</h3>
                <p>Escolhe uma conversa no painel esquerdo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
