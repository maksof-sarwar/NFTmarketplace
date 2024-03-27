import { Server, Socket } from 'socket.io';

export interface ServerToClientEvents {
  token_fetching_progress: (args: { progress: number; address: string, name: string }) => void
  token_fetching_done: (args: { address: string, name: string }) => void
  token_fetching_error: (args: { error: string, address: string, name: string }) => void
}

export interface ClientToServerEvents {

}

export type CustomServer = Server<ClientToServerEvents, ServerToClientEvents>;
export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
