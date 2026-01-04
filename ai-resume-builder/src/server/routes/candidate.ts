// src/server/routes/candidate.ts
import { OpenAPIHono } from '@hono/zod-openapi';
import { redis } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as doc from '@/schemas/api-doc';
import { prisma } from '@/lib/db';
import * as crypto from 'crypto';

// 1. Định nghĩa Type cho Context Variables
type Variables = {
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  };
};

const candidateRoute = new OpenAPIHono<{ Variables: Variables }>();

// --- HELPER FUNCTIONS ---

/**
 * Lấy UserId từ Context một cách an toàn
 */
const getSafeUserId = (c: any): string => {
  const payload = c.get('jwtPayload');
  if (!payload || !payload.id) {
    throw new Error("Unauthorized: Missing User ID");
  }
  return payload.id;
};

/**
 * Lấy ProfileId dựa trên UserId
 */
async function getProfileId(userId: string) {
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId }
  });
  if (!profile) throw new Error("Profile not found. Please create a profile first.");
  return profile.id;
}

// ==========================================
// 1. SEARCH API (Dành cho RECRUITER - Đặt trên cùng)
// ==========================================
candidateRoute.openapi(doc.candidateSearchDoc, async (c) => {
  candidateRoute.use('/search', verifyRole('RECRUITER'));
  const { q } = c.req.valid('query'); 
  if (!q) return c.json({ success: true, total: 0, results: [] }, 200);

  try {
    const smartQuery = `(${q}*) | (@skills:{${q}*})`;
    const searchResult: any = await redis.ft.search('idx:candidates', smartQuery, {
      LIMIT: { from: 0, size: 10 }
    });
    return c.json({
      success: true,
      total: searchResult.total,
      results: searchResult.documents.map((doc: any) => doc.value)
    }, 200);
  } catch (error) {
    return c.json({ success: false, message: 'Tìm kiếm thất bại' }, 500);
  }
});

// ==========================================
// 2. MIDDLEWARE CHUNG CHO CANDIDATE (Áp dụng cho tất cả các route bên dưới)
// ==========================================
candidateRoute.use('/me', verifyRole("CANDIDATE"));

// ==========================================
// 3. MAIN PROFILE APIs
// ==========================================

// --- LẤY HỒ SƠ CỦA TÔI ---
candidateRoute.openapi(doc.getMyProfileDoc, async (c) => {
  try {
    const userId = getSafeUserId(c);
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        workExperiences: { orderBy: { startDate: 'desc' } },
        projects: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
        user: { select: { name: true, email: true, role: true } }
      }
    });

    if (!profile) return c.json({ success: false, message: "Hồ sơ chưa được khởi tạo" }, 404);
    return c.json({ success: true, data: profile as any }, 200);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 401);
  }
});

// --- TẠO HỒ SƠ ---
candidateRoute.openapi(doc.createCandidateProfileDoc, async (c) => {
  const userId = getSafeUserId(c);
  const data = c.req.valid('json');

  const existing = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (existing) return c.json({ message: "Profile already exists" }, 400);

  const profile = await prisma.candidateProfile.create({ data: { ...data, userId } });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  await redis.json.set(`candidate:${profile.id}`, '$', {
    id: profile.id,
    name: user?.name ?? '',
    headline: profile.headline ?? '',
    skills: profile.skills,
    summary: profile.summary ?? ''
  } as any);

  return c.json({ success: true, data: profile as any }, 201);
});

// --- CẬP NHẬT HỒ SƠ ---
candidateRoute.use('/me/update', verifyRole("CANDIDATE"));

candidateRoute.openapi(doc.updateCandidateProfileDoc, async (c) => {
  const userId = getSafeUserId(c);
  const data = c.req.valid('json');
  
  const updated = await prisma.candidateProfile.update({ where: { userId }, data });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  await redis.json.set(`candidate:${updated.id}`, '$', {
    id: updated.id,
    name: user?.name ?? '',
    headline: updated.headline ?? '',
    skills: updated.skills,
    summary: updated.summary ?? ''
  } as any);
  
  return c.json({ success: true, message: "Profile updated" }, 200);
});
candidateRoute.openapi(doc.deleteCandidateProfileDoc, async (c) => {
  const userId = getSafeUserId(c);

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
// ==========================================
// 4. SUB-RECORDS APIs (Experience, Project, Education)
// ==========================================

// --- WORK EXPERIENCE ---
candidateRoute.use('/experience/create', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.addWorkExperienceDoc, async (c) => {
  const userId = getSafeUserId(c);
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
candidateRoute.use('/experience/:id', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.updateWorkExperienceDoc, async (c) => {
  const userId = getSafeUserId(c);
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');
  const profileId = await getProfileId(userId);

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
candidateRoute.use('/experience/:id', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.deleteWorkExperienceDoc, async (c) => {
  const userId = getSafeUserId(c);
  const { id } = c.req.valid('param');
  const profileId = await getProfileId(userId);

  const deleted = await prisma.workExperience.deleteMany({
    where: { id, candidateProfileId: profileId }
  });
  if (deleted.count === 0) return c.json({ message: "Not found" }, 404);
  return c.json({ success: true, message: "Deleted" }, 200);
});

// --- PERSONAL PROJECTS ---
candidateRoute.use('/project/create', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.addProjectDoc, async (c) => {
  const userId = getSafeUserId(c);
  const data = c.req.valid('json');
  const profileId = await getProfileId(userId);

  await prisma.personalProject.create({ data: { ...data, candidateProfileId: profileId } });
  return c.json({ success: true, message: "Project added" }, 201);
});
candidateRoute.use('/project/:id', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.updateProjectDoc, async (c) => {
  const userId = getSafeUserId(c);
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');
  const profileId = await getProfileId(userId);

  await prisma.personalProject.updateMany({
    where: { id, candidateProfileId: profileId },
    data: data
  });
  return c.json({ success: true, message: "Project updated" }, 200);
});
candidateRoute.use('/project/:id', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.deleteProjectDoc, async (c) => {
  const userId = getSafeUserId(c);
  const { id } = c.req.valid('param');
  const profileId = await getProfileId(userId);

  const deleted = await prisma.personalProject.deleteMany({
    where: { id, candidateProfileId: profileId }
  });
  if (deleted.count === 0) return c.json({ message: "Not found" }, 404);
  return c.json({ success: true, message: "Project deleted" }, 200);
});

// --- EDUCATION ---
candidateRoute.use('/education/create', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.addEducationDoc, async (c) => {
    const userId = getSafeUserId(c);
    const data = c.req.valid('json');
    const profileId = await getProfileId(userId);
    await prisma.educationRecord.create({ data: { ...data, candidateProfileId: profileId } });
    return c.json({ success: true, message: "Education added" }, 201);
});
candidateRoute.use('/education/:id', verifyRole("CANDIDATE"));

candidateRoute.openapi(doc.updateEducationDoc, async (c) => {
  const userId = getSafeUserId(c);
  const { id } = c.req.valid('param');
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
candidateRoute.use('/education/:id', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.deleteEducationDoc, async (c) => {
   const userId = getSafeUserId(c);
  const { id } = c.req.valid('param');
  const profileId = await getProfileId(userId);


  const deleted = await prisma.educationRecord.deleteMany({
    where: { id, candidateProfileId: profileId }
  });

  if (deleted.count === 0) return c.json({ message: "Not found" }, 404);
  return c.json({ success: true, message: "Education deleted" }, 200);
});

// ==========================================
// 5. SHARING & COLLABORATION
// ==========================================

candidateRoute.openapi(doc.updateSharingSettingsDoc, async (c) => {
  const userId = getSafeUserId(c);
  const { mode } = c.req.valid('json');

  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return c.json({ message: "Profile not found" }, 404);

  let shareToken = profile.shareToken;
  if (mode !== 'PRIVATE' && !shareToken) {
    shareToken = crypto.randomBytes(16).toString('hex');
  } else if (mode === 'PRIVATE') {
    shareToken = null;
  }

  const updated = await prisma.candidateProfile.update({
    where: { userId },
    data: { sharingMode: mode as any, shareToken }
  });

  return c.json({
    success: true,
    sharingMode: updated.sharingMode as any,
    shareLink: updated.shareToken ? `/shared/cv/${updated.shareToken}` : null
  }, 200);
});

candidateRoute.openapi(doc.checkProfileAccessDoc, async (c) => {
  const { id } = c.req.valid('param');
  const { token } = c.req.valid('query');
  const payload = c.get('jwtPayload');
  const userId = payload?.id;

  const profile = await prisma.candidateProfile.findUnique({
    where: { id },
    include: { collaborators: true }
  });

  if (!profile) return c.json({ message: "Not found" }, 404);

  let canView = false;
  let canEdit = false;

  if (userId && profile.userId === userId) {
    canView = true; canEdit = true;
  } else if (token && profile.shareToken === token) {
    canView = true;
    if (profile.sharingMode === 'PUBLIC_EDIT') canEdit = true;
  } else if (userId) {
    const collab = profile.collaborators.find((col: any) => col.userId === userId);
    if (collab) {
      canView = true;
      if (collab.role === 'EDITOR') canEdit = true;
    }
  } else if (profile.sharingMode === 'PUBLIC_VIEW') {
    canView = true;
  }

  return c.json({ canView, canEdit, mode: profile.sharingMode as any }, 200);
});
candidateRoute.openapi(doc.addCollaboratorDoc, async (c) => {
  const userId = getSafeUserId(c);
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
candidateRoute.openapi(doc.getSharedProfilesDoc, async (c) => {
    const userId = getSafeUserId(c);
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