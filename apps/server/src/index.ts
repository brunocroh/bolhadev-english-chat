import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import cron from "node-cron";

type Room = {
  id: string;
  host: string;
  users: string[];
};

type SocketEvents = {
  userConnect: (props: { id: string }) => void;
  queueJoin: (props: { id: string }) => void;
  queueUpdated: (props: { size: number }) => void;
  newUserConnect: (props: { size: number }) => void;
  queueExit: (props: { id: string }) => void;
  roomFound: (props: { room: string[]; roomId: string }) => void;
};

const queue = new Set();
const users = new Map();
const rooms = new Map();

const io = new Server<SocketEvents, SocketEvents>({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    queue.delete(socket.id);
    users.delete(socket.id);

    io.emit("newUserConnect", { size: queue.size });
  });

  socket.on("userConnect", ({ id }) => {
    users.set(id, socket);

    io.emit("newUserConnect", { size: users.size });
  });

  socket.on("queueJoin", ({ id }) => {
    queue.add(id);

    io.emit("queueUpdated", { size: queue.size });
  });

  socket.on("queueExit", ({ id }) => {
    queue.delete(id);

    io.emit("queueUpdated", { size: queue.size });
  });
});

io.listen(4000);

cron.schedule("*/5 * * * * *", () => {
  const _queue = Array.from(queue);

  console.log({ cron: _queue });

  for (; _queue.length >= 2; ) {
    const roomId = uuid();
    const room = _queue.splice(0, 2);

    queue.delete(room[1]);
    rooms.set(roomId, room);

    room.forEach((user) => {
      queue.delete(user);
      users.get(user).emit("roomFound", { room, roomId });
    });
  }
});

console.log("Server up");