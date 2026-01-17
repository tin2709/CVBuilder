import crypto from 'crypto';

export function generateCVHash(data: any) {
  // 1. Chỉ lọc ra các trường quan trọng cho việc chấm điểm
  const coreContent = {
    headline: data.headline,
    summary: data.summary,
    skills: data.skills,
    experiences: data.experiences?.map((e: any) => ({
      role: e.role,
      desc: e.description,
      company: e.companyName
    })),
    projects: data.projects?.map((p: any) => ({
      name: p.projectName,
      stack: p.techStack
    }))
  };

  // 2. Chuyển thành chuỗi JSON và băm SHA256
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(coreContent))
    .digest('hex');
}