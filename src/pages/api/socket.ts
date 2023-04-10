import {createDefaultMapFromNodeModules} from "@typescript/vfs";
import { Server } from "socket.io";
import { ROOM_ACTION } from "../../constants/events";
import {
  codeChangesListener,
  connectToRoomListener,
} from "../../lib/socket/socketControllers";
import {TSocketData} from "../../schemas/socket";
import ts from 'typescript'
type MapUser = {
  socketId: string;
  position?: number;
  fileId: string;
};
export default function SocketHandler(req, res: any) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    const users = new Map<string, MapUser>();

    io.on("connection", (socket) => {

const fsMapDefaultFull = createDefaultMapFromNodeModules({ target: ts.ScriptTarget.ES2015 })
      connectToRoomListener(socket, users);
      codeChangesListener(socket, io);

      socket.on("POSITION", (data:TSocketData) => {
        socket.to(data.fileId).emit("SENDPOS", data);
        const isPresent = users.get(data.userId);
        if (isPresent) {
          users.set(data.userId, {
            ...isPresent,
            position: data.pos,
          });
        }
      });
      socket.on("disconnect", async () => {
        users.forEach((user, key) => {
          if (user.socketId === socket.id) {
            users.delete(key);
          }
        });
      });
    });
  }
  res.end();
}
