
import { Server, ServerOptions } from 'socket.io';
import { CustomServer, CustomSocket } from './types';



class SocketHandler {
  io: CustomServer | undefined = undefined;
  public static instance: SocketHandler;
  public userToSocket: Map<string, CustomSocket> = new Map();
  private _config: Partial<ServerOptions> = {
    allowRequest(req, fn) {
      fn(null, true);
    },
    path: '/socket.io',
    cors: { origin: '*' },
    transports: ['websocket'],
    pingInterval: 25000,
    pingTimeout: 5000,
    serveClient: false
  };

  constructor(port: number) {
    SocketHandler.instance = this;
    this.io = new Server(port, this._config);

    this.io
      .use(async (socket, next) => {
        next()
      })
      .on('connection', this.listeners);
    console.log(`🚀 Socket server started... on port ${port}`);
  }

  private listeners = async (socket: CustomSocket) => {
    console.log(
      `[socket] user-connected => ${socket.id.slice(-3)}`
    );
    socket.on('disconnect', async () => {
      console.log(`[socket] user-disconnected => ${socket.id.slice(-3)}`);
    });
  };
}



export { SocketHandler }