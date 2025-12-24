import { PrismaClient, Role } from '@prisma/client';
import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

// Khởi tạo cực kỳ đơn giản, không tham số
const prisma = new PrismaClient();

const redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});
const candidates = [
  { name: 'Nguyen Van A', email: 'vana@gmail.com', headline: 'Senior React Developer', skills: ['React', 'NodeJS', 'TypeScript'], experience: '5 years of experience in Frontend' },
  { name: 'Tran Thi B', email: 'thib@gmail.com', headline: 'Fullstack Engineer', skills: ['Next.js', 'PostgreSQL', 'Docker'], experience: '3 years working with modern web' },
  { name: 'Le Van C', email: 'vanc@gmail.com', headline: 'Backend Developer', skills: ['Go', 'Redis', 'Microservices'], experience: 'Worked at Google for 2 years' },
  { name: 'Pham Minh D', email: 'minhd@gmail.com', headline: 'Mobile Developer', skills: ['React Native', 'Flutter', 'Firebase'], experience: 'Build many apps on AppStore' },
  { name: 'Hoang Thi E', email: 'thie@gmail.com', headline: 'UI/UX Designer', skills: ['Figma', 'Adobe XD', 'Tailwind'], experience: 'Creative designer with 4 years exp' },
  { name: 'Doan Van F', email: 'vanf@gmail.com', headline: 'Data Scientist', skills: ['Python', 'TensorFlow', 'SQL'], experience: 'Expert in Machine Learning' },
  { name: 'Bui Thi G', email: 'thig@gmail.com', headline: 'DevOps Engineer', skills: ['AWS', 'Kubernetes', 'CI/CD'], experience: 'Cloud infrastructure specialist' },
  { name: 'Vu Minh H', email: 'minhh@gmail.com', headline: 'Project Manager', skills: ['Agile', 'Scrum', 'Jira'], experience: 'Managed teams of 20 people' },
  { name: 'Ly Van I', email: 'vani@gmail.com', headline: 'Security Engineer', skills: ['Penetration Testing', 'Python', 'Linux'], experience: 'Cyber security enthusiast' },
  { name: 'Dang Thi K', email: 'thik@gmail.com', headline: 'AI Engineer', skills: ['Python', 'PyTorch', 'NLP'], experience: 'Researching on Large Language Models' },
];

async function main() {
  await redisClient.connect();
  console.log('--- Đang xóa dữ liệu cũ (Tùy chọn) ---');
  // await prisma.candidateProfile.deleteMany();
  // await prisma.user.deleteMany();
await prisma.candidateProfile.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('--- Đang bắt đầu seed 10 ứng viên ---');

  for (const item of candidates) {
    // 1. Tạo User trong MongoDB
    const user = await prisma.user.create({
      data: {
        email: item.email,
        name: item.name,
        password: 'hashed_password_123', // Demo nên để cứng
        role: Role.CANDIDATE,
      }
    });

    // 2. Tạo Profile trong MongoDB
    const profile = await prisma.candidateProfile.create({
      data: {
        userId: user.id,
        headline: item.headline,
        skills: item.skills,
        experience: { summary: item.experience }, // Lưu dạng JSON
      }
    });

    // 3. Đẩy lên Redis JSON để phục vụ Redis Search
    // Key: candidate:<id_mongodb>
    await redisClient.json.set(`candidate:${profile.id}`, '$', {
      id: profile.id,
      headline: profile.headline,
      skills: profile.skills,
      experience: item.experience, // Lưu text để Redis Search dễ quét
    });

    console.log(`Đã tạo: ${item.name} - ID: ${profile.id}`);
  }

  console.log('--- Seed hoàn tất! ---');
  await prisma.$disconnect();
  await redisClient.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});