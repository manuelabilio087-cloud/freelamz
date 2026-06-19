"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Messages() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("2");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setUser({ name: "Manuel" });
    
    fetch("http://localhost:5000/api/messages/conversations", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(() => {});
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: parseInt(receiverId), content: newMessage }),
      });
      const data = await res.json();
      if (data.id) {
        setMessages([...messages, data]);
        setNewMessage("");
      }
    } catch (err) {}
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mensagens</h1>
        
        <div className="bg-white rounded-lg shadow-md h-96 overflow-y-auto p-4 mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhuma mensagem ainda.</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{msg.sender_name || "Utilizador"}:</p>
                <p>{msg.content || msg.last_message}</p>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreve uma mensagem..."
            className="flex-1 px-3 py-2 border rounded-lg"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Enviar
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
