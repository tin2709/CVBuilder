# 1. Dùng Node 22 làm nền
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# --- THÊM 2 DÒNG NÀY VÀO ĐÂY ---
# Khai báo biến nhận từ bên ngoài vào
ARG DATABASE_URL
# Gán nó thành biến môi trường để Prisma dùng
ENV DATABASE_URL=$DATABASE_URL
# -------------------------------

# 5. Chạy Prisma Generate
RUN npx prisma generate

# 6. Build dự án Next.js
RUN npm run build

# --- GIAI ĐOẠN CHẠY (Runner) ---
FROM node:22-alpine AS runner
WORKDIR /app

# Copy các file cần thiết từ bước build sang để chạy cho nhẹ
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Mở cổng 3000
EXPOSE 3000

CMD ["npm", "start"]
