// server.ts
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Khởi tạo Next.js
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

// Tạo một biến để chứa instance của socket.io
let io: Server;

nextApp.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    
    // Để Next.js xử lý tất cả các request (bao gồm cả Hono API bên trong Next.js)
    handle(req, res, parsedUrl);
  });

  // Gắn Socket.io vào cùng HTTP Server
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} connected via port 3000`);
    }
  });

  // Gán io vào global để các route Hono có thể truy cập được
  (global as any).io = io;

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

export { io };