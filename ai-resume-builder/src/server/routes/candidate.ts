// src/server/routes/candidate.ts
import { OpenAPIHono } from '@hono/zod-openapi'; // Dùng OpenAPIHono thay vì Hono
import { candidateSearchDoc } from '@/schemas/api-doc'; // Import Doc bạn đã viết
import { redis } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as doc from '@/schemas/api-doc';
import { prisma } from '@/lib/db'; // Giả sử đường dẫn prisma của bạn
 import * as crypto from 'crypto';

// 1. Khởi tạo bằng OpenAPIHono
const candidateRoute = new OpenAPIHono();

// 2. Sử dụng middleware (nếu cần cho toàn bộ route này)
candidateRoute.use('/search', verifyRole('RECRUITER'));

// 3. Sử dụng hàm .openapi() thay vì .get()
candidateRoute.openapi(candidateSearchDoc, async (c) => {
  // 4. Lấy query từ c.req.valid('query') để đảm bảo Type-safe và Swagger nhận diện được
  const { q } = c.req.valid('query'); 
  
  if (!q) {
    return c.json({ success: true, total: 0, results: [] }, 200);
  }

  try {
    const smartQuery = `(${q}*) | (@skills:{${q}*})`;

    // Logic Redis giữ nguyên
    const searchResult: any = await redis.ft.search('idx:candidates', smartQuery, {
      LIMIT: { from: 0, size: 10 }
    });

    return c.json({
      success: true,
      total: searchResult.total,
      results: searchResult.documents.map((doc: any) => doc.value)
    }, 200); // Đảm bảo status 200 khớp với Doc
  } catch (error) {
    console.error("Search Error:", error);
    return c.json({ 
      success: false, 
      message: 'Tìm kiếm thất bại' 
    }, 500); // 500 phải được định nghĩa trong responses của candidateSearchDoc
  }
});
candidateRoute.use('/*', verifyRole("CANDIDATE"));

// --- 1. Helper để lấy Profile ID của User hiện tại ---
async function getProfileId(userId: string) {
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId }
  });
  if (!profile) throw new Error("Profile not found");
  return profile.id;
}

// --- 2. APIs cho Work Experience ---
candidateRoute.use('/experience/create', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.addWorkExperienceDoc, async (c) => {
  const userId = c.get('jwtPayload').id; // Lấy từ token
  const data = c.req.valid('json');
  
  const profileId = await getProfileId(userId);
  
  await prisma.workExperience.create({
    data: {
      ...data,
      candidateProfileId: profileId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null
    }
  });
  
  return c.json({ success: true, message: "Added work experience" }, 201);
});

candidateRoute.openapi(doc.deleteWorkExperienceDoc, async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('jwtPayload').id;
  const profileId = await getProfileId(userId);

  // Kiểm tra quyền sở hữu trước khi xóa
  const exp = await prisma.workExperience.findFirst({
    where: { id, candidateProfileId: profileId }
  });

  if (!exp) return c.json({ message: "Not found or No permission" }, 404);

  await prisma.workExperience.delete({ where: { id } });
  return c.json({ success: true, message: "Deleted" }, 200);
});

// --- 3. APIs cho Personal Projects ---
candidateRoute.use('/project/create', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.addProjectDoc, async (c) => {
  const userId = c.get('jwtPayload').id;
  const data = c.req.valid('json');
  const profileId = await getProfileId(userId);

  await prisma.personalProject.create({
    data: {
      ...data,
      candidateProfileId: profileId
    }
  });

  return c.json({ success: true, message: "Project added" }, 201);
});

candidateRoute.openapi(doc.deleteProjectDoc, async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('jwtPayload').id;
  const profileId = await getProfileId(userId);

  const project = await prisma.personalProject.findFirst({
    where: { id, candidateProfileId: profileId }
  });

  if (!project) return c.json({ message: "Not found" }, 404);

  await prisma.personalProject.delete({ where: { id } });
  return c.json({ success: true, message: "Project deleted" }, 200);
});

// --- 4. APIs cho Education ---
candidateRoute.use('/education/create', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.addEducationDoc, async (c) => {
    const userId = c.get('jwtPayload').id;
    const data = c.req.valid('json');
    const profileId = await getProfileId(userId);
  
    await prisma.educationRecord.create({
      data: {
        ...data,
        candidateProfileId: profileId
      }
    });
  
    return c.json({ success: true, message: "Education added" }, 201);
});
candidateRoute.openapi(doc.updateCandidateProfileDoc, async (c) => {
  const userId = c.get('jwtPayload').id;
  const data = c.req.valid('json');
  
  await prisma.candidateProfile.update({
    where: { userId },
    data: data
  });
  
  return c.json({ success: true, message: "Profile updated" }, 200);
});

// --- 2. API Sửa Experience ---
candidateRoute.openapi(doc.updateWorkExperienceDoc, async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('jwtPayload').id;
  const data = c.req.valid('json');
  const profileId = await getProfileId(userId);

  // Chỉ update nếu bản ghi đó thuộc về Profile của User này
  await prisma.workExperience.updateMany({
    where: { id, candidateProfileId: profileId },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    }
  });

  return c.json({ success: true, message: "Experience updated" }, 200);
});

// --- 3. API Sửa Project ---
candidateRoute.openapi(doc.updateProjectDoc, async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('jwtPayload').id;
  const data = c.req.valid('json');
  const profileId = await getProfileId(userId);

  await prisma.personalProject.updateMany({
    where: { id, candidateProfileId: profileId },
    data: data
  });

  return c.json({ success: true, message: "Project updated" }, 200);
});
candidateRoute.openapi(doc.deleteProjectDoc, async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('jwtPayload').id;
  const profileId = await getProfileId(userId);

  const project = await prisma.personalProject.findFirst({
    where: { id, candidateProfileId: profileId }
  });

  if (!project) return c.json({ message: "Not found" }, 404);

  await prisma.personalProject.delete({ where: { id } });
  return c.json({ success: true, message: "Project deleted" }, 200);
});
// --- 4. API Sửa & Xóa Education ---
candidateRoute.openapi(doc.updateEducationDoc, async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('jwtPayload').id;
  const data = c.req.valid('json');
  const profileId = await getProfileId(userId);

  await prisma.educationRecord.updateMany({
    where: { id, candidateProfileId: profileId },
    data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
    }
  });

  return c.json({ success: true, message: "Education updated" }, 200);
});

candidateRoute.openapi(doc.deleteEducationDoc, async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('jwtPayload').id;
  const profileId = await getProfileId(userId);

  const deleted = await prisma.educationRecord.deleteMany({
    where: { id, candidateProfileId: profileId }
  });

  if (deleted.count === 0) return c.json({ message: "Not found" }, 404);
  return c.json({ success: true, message: "Education deleted" }, 200);
});
// --- 1. API TẠO PROFILE (POST /me/create) ---
candidateRoute.openapi(doc.createCandidateProfileDoc, async (c) => {
  const userId = c.get('jwtPayload').id;
  const data = c.req.valid('json');

  // Kiểm tra trùng lặp
  const existing = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (existing) return c.json({ message: "Profile already exists" }, 400);

  // Tạo trong MongoDB
  const profile = await prisma.candidateProfile.create({
    data: { ...data, userId }
  });

  // Đẩy lên Redis để search (Cần lấy thêm tên từ User)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  // Dùng toán tử ?? để thay thế null/undefined bằng chuỗi rỗng
await redis.json.set(`candidate:${profile.id}`, '$', {
  id: profile.id,
  name: user?.name ?? '',         // Nếu null/undefined thì lấy ''
  headline: profile.headline ?? '',
  skills: profile.skills,
  summary: profile.summary ?? ''
} as any); // Thêm 'as any' để bypass qua kiểm tra kiểu quá khắt khe của RedisJSON

  return c.json({ success: true, data: profile }, 201);
});

// --- 2. CẬP NHẬT PROFILE (Đã có trong code của bạn, nhưng cần thêm logic Redis) ---
candidateRoute.openapi(doc.updateCandidateProfileDoc, async (c) => {
  const userId = c.get('jwtPayload').id;
  const data = c.req.valid('json');
  
  const updatedProfile = await prisma.candidateProfile.update({
    where: { userId },
    data: data
  });

  // CẬP NHẬT REDIS (Quan trọng: Để nhà tuyển dụng thấy thông tin mới nhất)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  await redis.json.set(`candidate:${updatedProfile.id}`, '$', {
  id: updatedProfile.id,
  name: user?.name ?? '',
  headline: updatedProfile.headline ?? '',
  skills: updatedProfile.skills,
  summary: updatedProfile.summary ?? ''
} as any);
  
  return c.json({ success: true, message: "Profile updated" }, 200);
});

// --- 3. XÓA PROFILE (DELETE /me/delete) ---
candidateRoute.openapi(doc.deleteCandidateProfileDoc, async (c) => {
  const userId = c.get('jwtPayload').id;

  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return c.json({ message: "Profile not found" }, 404);

  // Xóa Transaction trong MongoDB (Xóa sạch Exp, Project, Edu trước)
  await prisma.$transaction([
    prisma.workExperience.deleteMany({ where: { candidateProfileId: profile.id } }),
    prisma.personalProject.deleteMany({ where: { candidateProfileId: profile.id } }),
    prisma.educationRecord.deleteMany({ where: { candidateProfileId: profile.id } }),
    prisma.candidateProfile.delete({ where: { id: profile.id } })
  ]);

  // Xóa khỏi Redis Search
  await redis.del(`candidate:${profile.id}`);

  return c.json({ success: true, message: "All profile data deleted" }, 200);
});
candidateRoute.openapi(doc.updateSharingSettingsDoc, async (c) => {
  const userId = c.get('jwtPayload').id;
  const { mode } = c.req.valid('json');

  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return c.json({ message: "Profile not found" }, 404);

  let shareToken = profile.shareToken;
  // Nếu chuyển sang Public mà chưa có token thì tạo mới
  if (mode !== 'PRIVATE' && !shareToken) {
    shareToken = crypto.randomBytes(16).toString('hex');
  } 
  // Nếu chuyển về Private thì có thể xóa token
  else if (mode === 'PRIVATE') {
    shareToken = null;
  }

  const updated = await prisma.candidateProfile.update({
    where: { userId },
    data: { 
      sharingMode: mode as any, 
      shareToken 
    }
  });

  return c.json({
    success: true,
    sharingMode: updated.sharingMode,
    shareLink: updated.shareToken ? `/shared/cv/${updated.shareToken}` : null
  }, 200);
});

// API Thêm cộng tác viên (Mời Mentor/Bạn bè sửa giúp)
candidateRoute.openapi(doc.addCollaboratorDoc, async (c) => {
  const userId = c.get('jwtPayload').id; // Chủ sở hữu
  const { email, role } = c.req.valid('json');

  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return c.json({ message: "Profile not found" }, 404);

  // Tìm người được mời
  const invitee = await prisma.user.findUnique({ where: { email } });
  if (!invitee) return c.json({ message: "User with this email not found" }, 404);
  if (invitee.id === userId) return c.json({ message: "You are the owner" }, 400);

  // Lưu vào bảng Collaboration
  await prisma.collaboration.upsert({
    where: {
      candidateProfileId_userId: {
        candidateProfileId: profile.id,
        userId: invitee.id
      }
    },
    update: { role: role as any },
    create: {
      candidateProfileId: profile.id,
      userId: invitee.id,
      role: role as any
    }
  });

  return c.json({ success: true, message: "Collaborator added/updated" }, 200);
});

// API Kiểm tra quyền (Cho Frontend Yjs Provider)
candidateRoute.openapi(doc.checkProfileAccessDoc, async (c) => {
  const { id } = c.req.valid('param'); // profileId
  const { token } = c.req.valid('query'); // shareToken (nếu có)
  const userId = c.get('jwtPayload')?.id;

  const profile = await prisma.candidateProfile.findUnique({
    where: { id },
    include: { collaborators: true }
  });

  if (!profile) return c.json({ message: "Not found" }, 404);

  let canView = false;
  let canEdit = false;

  // 1. Nếu là chủ sở hữu
  if (userId && profile.userId === userId) {
    canView = true;
    canEdit = true;
  } 
  // 2. Nếu truy cập qua link public
  else if (token && profile.shareToken === token) {
    canView = true;
    if (profile.sharingMode === 'PUBLIC_EDIT') canEdit = true;
  }
  // 3. Nếu được mời đích danh
  else if (userId) {
    const collab = profile.collaborators.find((col: any) => col.userId === userId);


   if (collab) {
      canView = true;
      if (collab.role === 'EDITOR') canEdit = true;
    }
  }
  // 4. Nếu profile ở chế độ Public View
  else if (profile.sharingMode === 'PUBLIC_VIEW') {
    canView = true;
  }

  return c.json({
    canView,
    canEdit,
    mode: profile.sharingMode
  }, 200);
});
candidateRoute.openapi(doc.getSharedProfilesDoc, async (c) => {
  const userId = c.get('jwtPayload').id; // ID của người đang đăng nhập (Collaborator)

  const sharedProfiles = await prisma.collaboration.findMany({
    where: { userId: userId },
    include: {
      candidateProfile: {
        include: {
          user: { select: { name: true, email: true } } // Thông tin chủ sở hữu
        }
      }
    }
  });

  return c.json({
    success: true,
    data: sharedProfiles.map(item => ({
      profileId: item.candidateProfileId,
      ownerName: item.candidateProfile.user.name,
      role: item.role,
      headline: item.candidateProfile.headline
    }))
  });
});
export default candidateRoute;