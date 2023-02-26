import { Socket as SocketServer } from "socket.io";
import { Socket as SocketClient } from "socket.io-client";
import { ROOM_ACTION } from "../../constants/events";
import { TSocketData, TUsers, TViewState } from "../../schemas/socket";
type MapUser = {
  socketId: string;
  position?: number;
  projectId: string;
};
//client
export const updateContentEmitter = (
  socket: SocketClient,
  fn: (values: TViewState) => void
) => {
  socket.on(ROOM_ACTION.SEND_MESSAGE, (data: TViewState) => {
    fn(data);
  });
};
export const getPositionListener = ({
  socket,
  setPositionCb,
  setNameCb,
}: {
  socket: SocketClient;
  setPositionCb: (pos: TSocketData["pos"]) => void;
  setNameCb: (name: TSocketData["username"]) => void;
}) => {
  socket.on("SENDPOS", (data: TSocketData) => {
    setPositionCb(data.pos);
    setNameCb(data.username);
  });
};

export const connectToRoom = ({
  socket,
  projectId,
  userId,
}: {
  socket: SocketClient;
  projectId: string | string[];
  userId: string | null;
}) => {
  // socket.on("connect", () => {
  socket.emit(ROOM_ACTION.CONNECT_TO_ROOM, { projectId, userId });
  // });
};
export const userConnectedListener = (socket: SocketClient) => {
  socket.on(ROOM_ACTION.USER_CONNECTED, (msg) => {});
};
//server
export const connectToRoomListener = (
  socket: SocketServer,
  users: Map<string, MapUser>
) => {
  socket.on(
    ROOM_ACTION.CONNECT_TO_ROOM,
    async ({ projectId, userId }: { projectId: string; userId: string }) => {
      await socket.join(projectId);
      const socketId = socket.id;
      users.set(userId, { socketId, projectId });
    }
  );
};

export const codeChangesListener = (socket: SocketServer, io: any) => {
  socket.on(ROOM_ACTION.CODE_CHANGED, (data: TViewState) => {
    console.log("DATA", data);
    socket.to(data.projectId).emit(ROOM_ACTION.SEND_MESSAGE, data);
  });
};
