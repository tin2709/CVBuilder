import { PrismaClient, Role } from '@prisma/client';
import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

const candidatesData = [
  {
    name: 'Ly Van I',
    email: 'vani@gmail.com',
    headline: 'Intern Fullstack Developer',
    summary: 'Enthusiastic Developer skilled in both Frontend (React/Next.js) and Backend (Spring Boot/NestJS).',
    skills: ['Java', 'TypeScript', 'React', 'NestJS', 'Spring Boot', 'PostgreSQL'],
    softSkills: ['Teamwork', 'Problem-solving', 'Adaptability'],
    experiences: [
      {
        companyName: 'BitGroup',
        role: 'Intern Fullstack Developer',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-12-31'),
        description: 'Stadium Booking Platform & E-commerce',
        responsibilities: ['Designed DB schemas', 'Developed RESTful APIs', 'Built Frontend components']
      }
    ],
    projects: [
      {
        projectName: 'Online Video Editor',
        techStack: ['React', 'Python', 'FFmpeg'],
        features: ['AI auto-transcription', 'Real-time styling'],
        githubLink: 'github.com/tin2709/DoAnCDWeb'
      }
    ],
    education: {
      schoolName: 'NongLam University',
      major: 'Information Technology',
      startDate: new Date('2021-09-01'),
      endDate: new Date('2025-10-01')
    }
  },
  {
    name: 'Vu Minh H',
    email: 'minhh@gmail.com',
    headline: 'Senior React Developer',
    summary: 'Expert in Frontend with 5 years experience.',
    skills: ['React', 'Redux', 'TypeScript', 'Next.js'],
    softSkills: ['Leadership', 'Communication'],
    experiences: [
      {
        companyName: 'VNG Corp',
        role: 'Senior Frontend',
        startDate: new Date('2020-01-01'),
        endDate: null,
        description: 'Leading the Zalo Web team',
        responsibilities: ['Optimize performance', 'Mentoring juniors']
      }
    ],
    projects: [],
    education: {
        schoolName: 'Bach Khoa University',
        major: 'Computer Science',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-06-01')
    }
  }
];

async function main() {
  await redisClient.connect();
  console.log('--- Cleaning Database ---');
  // 1. Xóa các bảng phụ thuộc sâu nhất trước (Các bảng con)
  await prisma.interview.deleteMany({});      // Interview phụ thuộc Application
  await prisma.application.deleteMany({});    // Application phụ thuộc CandidateProfile và Job
  await prisma.question.deleteMany({});       // Question phụ thuộc Job và User
  await prisma.review.deleteMany({});         // Review phụ thuộc Company và User
  await prisma.notification.deleteMany({});   // Notification phụ thuộc User

  // 2. Xóa các bảng cấp trung bình
  await prisma.job.deleteMany({});            // Job phụ thuộc User (Recruiter) và Company
  await prisma.workExperience.deleteMany({}); // Phụ thuộc CandidateProfile
  await prisma.personalProject.deleteMany({});// Phụ thuộc CandidateProfile
  await prisma.educationRecord.deleteMany({});// Phụ thuộc CandidateProfile
  
  // 3. Xóa các bảng cha cuối cùng
  await prisma.candidateProfile.deleteMany({}); // Giờ đã có thể xóa an toàn
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('--- Database Cleaned ---');
  
  // Xóa Redis keys cũ
  const keys = await redisClient.keys('candidate:*');
  if (keys.length > 0) await redisClient.del(keys);

  console.log('--- Seeding Candidates ---');

  for (const item of candidatesData) {
    // Tạo User kèm Profile và các quan hệ con trong 1 lần (Nested Write)
    const user = await prisma.user.create({
      data: {
        email: item.email,
        name: item.name,
        password: '$2b$10$hashedpasswordhere', // Trong thực tế nên dùng bcrypt
        role: Role.CANDIDATE,
        candidateProfiles: {
          create: {
            headline: item.headline,
            summary: item.summary,
            skills: item.skills,
            softSkills: item.softSkills,
            // Tạo các bảng con
            workExperiences: {
              create: item.experiences
            },
            projects: {
              create: item.projects
            },
            educations: {
              create: item.education
            }
          }
        }
      },
      include: {
        candidateProfiles: true
      }
    });

    const profileId = user.candidateProfiles[0].id;

    // Đẩy lên Redis JSON để phục vụ tìm kiếm (Flatten dữ liệu cho Redis Search)
    await redisClient.json.set(`candidate:${profileId}`, '$', {
      id: profileId,
      name: item.name,
      headline: item.headline,
      skills: item.skills,
      summary: item.summary,
      // Ta có thể lưu thêm text từ kinh nghiệm để search thông minh hơn
      allText: `${item.headline} ${item.skills.join(' ')} ${item.summary} ${item.experiences.map(e => e.companyName).join(' ')}`
    });

    console.log(`Successfully seeded: ${item.name} (Profile ID: ${profileId})`);
  }

  console.log('--- Seed Finished! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await redisClient.disconnect();
  });