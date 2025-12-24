import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { sign } from 'hono/jwt'; // Hono có sẵn thư viện hỗ trợ JWT

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
  },
  async login(credentials: any) {
    const { email, password } = credentials;

    // 1. Tìm user theo email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    // 2. Kiểm tra mật khẩu
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    // 3. Tạo Access Token (JWT)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token hết hạn sau 24h
    };

    const secret = process.env.JWT_SECRET || 'default_secret';
    const token = await sign(payload, secret);

    // 4. Trả về thông tin (không kèm password) và token
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      accessToken: token
    };
  }
  
};