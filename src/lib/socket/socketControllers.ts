import { Socket as SocketServer } from "socket.io";
import { Socket as SocketClient } from "socket.io-client";
import { ROOM_ACTION } from "../../constants/events";
import { TViewState } from "../../schemas/socket";

//client
export const updateContentEmitter = (
  socket: SocketClient,
  fn: (values: TViewState) => void
) => {
  socket.on(ROOM_ACTION.SEND_MESSAGE, (data: TViewState) => {
    fn(data);
  });
};

// socket.on("connect", async () => {
//   if (projectId) {
//     connectToRoomEmitter(socket, projectId);
//   }
// });
export const connectToRoom = (
  socket: SocketClient,
  projectId: string | string[]
) => {
  socket.on("connect", () => {
      socket.emit(ROOM_ACTION.CONNECT_TO_ROOM, projectId);
  });
};
export const userConnectedListener = (socket: SocketClient) => {
  socket.on(ROOM_ACTION.USER_CONNECTED, (msg) => {
    console.log(msg);
  });
};
//server
export const connectToRoomListener = (socket: SocketServer) => {
  socket.on(ROOM_ACTION.CONNECT_TO_ROOM, async (roomId: string) => {
    await socket.join(roomId);
    socket.to(roomId).emit(ROOM_ACTION.USER_CONNECTED, "User joined");
  });
};

export const codeChangesListener = (socket: SocketServer) => {
  socket.on(ROOM_ACTION.CODE_CHANGED, (data: TViewState) => {
    socket.to(data.projectId).emit(ROOM_ACTION.SEND_MESSAGE, data);
  });
};
// socket.on(ROOM_ACTION.CODE_CHANGED,(data)=>{
//         socket.to(data.projectId).emit(ROOM_ACTION.SEND_MESSAGE,(data))
//     })
