import { prisma } from '../lib/db';
import { Role } from '@prisma/client';

export const userRepository = {
  // Tìm user theo email để kiểm tra trùng lặp
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  // Lưu user mới vào DB
  async create(data: any) {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // Mật khẩu đã hash
        name: data.name,
        role: data.role || Role.CANDIDATE
      }
    });
  }
};