import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./types";

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export const connectSocketServer = (url: string, query: Record<string, string> = {}) => {
  return io(url, {
    autoConnect: true,
    reconnection: true,
    path: '/socket.io/',
    transports: ['websocket'],
    query
  }) as SocketClient;
}


export * from 'socket.io-client';

