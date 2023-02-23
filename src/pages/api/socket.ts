import { Server } from "socket.io";
import { ROOM_ACTION } from '../../constants/events';
import {  connectToRoomListener } from "../../lib/socket/socketControllers";
import { TUsers  } from "../../schemas/socket";

export default function SocketHandler(req, res:any) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    const users = new Set<TUsers>();
    io.on("connection",  (socket) => {
        connectToRoomListener(socket)
        socket.on(ROOM_ACTION.CODE_CHANGED,(data)=>{
                socket.to(data.projectId).emit(ROOM_ACTION.SEND_MESSAGE,(data))
            })
        socket.on('POSITION',(data)=>{
                socket.broadcast.emit('SENDPOS',data)
                // socket.to(data.projectId).emit('SENDPOS',(data.pos))
            })
      socket.on("disconnect", async () => {
        users.forEach((user) => {
          if (user.socketId === socket.id) {
            users.delete(user);
          }
        });
      });
    });
  }
  res.end();
}
