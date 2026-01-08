// import { serve } from '@hono/node-server'
// import { Server, Socket } from 'socket.io' // Thêm Socket để định nghĩa kiểu
// import app from '@/app/api/[[...route]]/route' // Import cùng một file app đó

// const port = 3001

// // 1. Sử dụng serve để khởi tạo server và lấy về instance của nó
// const server = serve({
//   fetch: app.fetch,
//   port
// }, (info) => {
//   console.log(`Server is running on http://localhost:${info.port}`)
// })

// // 2. Gắn Socket.io vào instance server vừa tạo
// // Dùng 'as any' vì kiểu dữ liệu của Hono Server và Socket.io đôi khi không khớp hoàn toàn ở mức TS
// const io = new Server(server as any, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// })

// // 3. Quản lý kết nối (Thêm kiểu dữ liệu cho socket để hết lỗi 'any')
// io.on('connection', (socket: Socket) => {
//   const userId = socket.handshake.query.userId as string;
  
//   if (userId) {
//     socket.join(userId);
//     console.log(`User ${userId} connected to socket`);
//   }

//   socket.on('disconnect', () => {
//     console.log(`User ${userId} disconnected`);
//   });
// })

// // 4. Xuất io để dùng ở các Route
// export { io }