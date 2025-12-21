import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';

export const authService = {
  async register(userData: any) {
    const { email, password, name, role } = userData;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email này đã được sử dụng!');
    }

    // 2. Mã hóa mật khẩu (Bắt buộc để bảo mật)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Gọi repository để lưu
    const newUser = await userRepository.create({
      email,
      password: hashedPassword,
      name,
      role
    });

    // 4. Trả về thông tin user (không trả về mật khẩu)
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
};