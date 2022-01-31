import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import UserModel from "./UserModel";

const app = express();

const httpServer = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer);

io.on("connection", (socket) => {
  console.log("connection ", socket.id);
  // socket.emit("hello", "test message");
  socket.on("joinRoom", (data) => {
    console.log(data.myId);
    setTimeout(async () => {
      const user = new UserModel({ name: "papago", age: 18, myId: data.myId });
      await user.save();
    }, 2_000);

    socket.on("disconnect", () => console.log("Disconnect ", socket.id));
  });
});

UserModel.watch().on("change", (change) => {
  console.log(
    "Something has changed",
    JSON.stringify(change.fullDocument, null, 2)
  );
  io.sockets.to(change.fullDocument.myId).emit("hello", change.fullDocument);
});

// app.get("/welcome", (req: Request, res: Response, next: NextFunction) => {
//   res.send("welcome!");
// });

httpServer.listen("9000", () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 9000
  ################################################
`);
});

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: string) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  hello: (msg: string) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  joinRoom: (data: Req) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

interface Req {
  myId: string;
}
