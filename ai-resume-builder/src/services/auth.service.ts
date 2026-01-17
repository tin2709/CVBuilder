import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { sign } from 'hono/jwt'; // Hono có sẵn thư viện hỗ trợ JWT
import { prisma } from '../lib/db';
import { transporter } from '../lib/mail';


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
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId, 
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
  },
   async forgotPassword(email: string) {
    // Kiểm tra email tồn tại trong hệ thống chưa
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email không tồn tại trên hệ thống!");
    }

    // Tạo mã OTP 6 số ngẫu nhiên
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Hết hạn sau 5 phút

    // Lưu OTP vào DB (Nếu đã có mã cũ cho mục đích này thì ghi đè)
    await prisma.otp.upsert({
      where: { email_purpose: { email, purpose: "FORGOT_PASSWORD" } },
      update: { code: otpCode, expiresAt },
      create: { email, code: otpCode, expiresAt, purpose: "FORGOT_PASSWORD" },
    });

    // Gửi email
    await transporter.sendMail({
      from: `"SmartRecruit AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã xác thực đặt lại mật khẩu",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Đặt lại mật khẩu</h2>
          <p>Mã OTP của bạn là: <b style="font-size: 24px; color: #136dec;">${otpCode}</b></p>
          <p>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ cho bất kỳ ai.</p>
        </div>
      `,
    });

    return { success: true };
  },

  // 2. RESET MẬT KHẨU MỚI
  async resetPassword(data: any) {
    const { email, otp, newPassword } = data;

    // Kiểm tra mã OTP trong DB
    const resetRecord = await prisma.otp.findUnique({
      where: { email_purpose: { email, purpose: "FORGOT_PASSWORD" } }
    });

    if (!resetRecord || resetRecord.code !== otp) {
      throw new Error("Mã OTP không chính xác!");
    }

    if (new Date() > resetRecord.expiresAt) {
      throw new Error("Mã OTP đã hết hạn!");
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật User & Xóa OTP (Dùng transaction để đảm bảo cả 2 đều thành công)
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      }),
      prisma.otp.delete({
        where: { email_purpose: { email, purpose: "FORGOT_PASSWORD" } }
      })
    ]);

    return { success: true };
  }
  
};