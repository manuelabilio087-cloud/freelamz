import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://freelamz-production.up.railway.app";
let socketInstance: Socket | null = null;

export const useSocket = (userId?: number) => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }
    socket.current = socketInstance;
    socket.current.emit("user:join", userId);
  }, [userId]);

  const onMessage = useCallback((uid: number, callback: (msg: any) => void) => {
    if (!socket.current) return;
    socket.current.on(`message:${uid}`, callback);
  }, []);

  const onNotification = useCallback((uid: number, callback: (notif: any) => void) => {
    if (!socket.current) return;
    socket.current.on(`notification:${uid}`, callback);
  }, []);

  const emitMessage = useCallback((receiverId: number, message: any) => {
    socket.current?.emit("message:send", { receiver_id: receiverId, message });
  }, []);

  return { socket: socket.current, onMessage, onNotification, emitMessage };
};