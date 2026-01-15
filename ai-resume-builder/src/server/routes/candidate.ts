// src/server/routes/candidate.ts
import { OpenAPIHono } from '@hono/zod-openapi';
import { redis } from '@/lib/db';
import { verifyRole } from '@/middlewares/auth.middleware';
import * as doc from '@/schemas/api-doc';
import { prisma } from '@/lib/db';
import * as crypto from 'crypto';
import { nanoid } from 'nanoid';

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
const mapToFullSchema = (p: any) => ({
  ...p,
  createdAt: p.createdAt?.toISOString(),
  updatedAt: p.updatedAt?.toISOString(),
  // Đảm bảo các mảng quan hệ luôn tồn tại để không lỗi Schema
  workExperiences: p.workExperiences || [],
  projects: p.projects || [],
  educations: p.educations || [],
  user: {
    name: p.user?.name || "",
    email: p.user?.email || "",
    role: p.user?.role || "CANDIDATE"
  }
});


// ==========================================
// 1. SEARCH API (Dành cho RECRUITER - Đặt trên cùng)
// ==========================================
candidateRoute.openapi(doc.candidateSearchDoc, async (c) => {
  candidateRoute.use('/search', verifyRole('RECRUITER'));
  const { q } = c.req.valid('query'); 
  if (!q) return c.json({ success: true, total: 0, results: [] }, 200);

  try {
    const smartQuery = `(${q}*) | (@skills:{${q}*})`;
     const rawResult = await redis.call(
        'FT.SEARCH', 
        'idx:candidates', 
        smartQuery, 
        'LIMIT', '0', '10'
    ) as any[];

    const total = rawResult[0] || 0;
    const results = [];

    // Parse mảng phẳng từ FT.SEARCH (Lấy các giá trị JSON)
    for (let i = 1; i < rawResult.length; i += 2) {
      const fields = rawResult[i + 1];
      // Trong RedisJSON Search, trường JSON nằm ở index 1 của mảng fields
      const jsonString = fields[1]; 
      if (jsonString) {
        results.push(JSON.parse(jsonString));
      }
    }

    return c.json({
      success: true,
      total: total,
      results: results
    }, 200);
  } catch (error: any) {
    console.error(error);
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
candidateRoute.use('/me/versions', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.getCVHistoryDoc, async (c) => {
  try {
    const userId = getSafeUserId(c);

    // 1. Tìm tất cả các bản ghi Profile của User này
    // Sắp xếp theo phiên bản mới nhất lên đầu
    const profiles = await prisma.candidateProfile.findMany({
      where: { userId },
      include: {
        user: { select: { name: true, email: true, role: true } },
        workExperiences: { orderBy: { startDate: 'desc' } },
        projects: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } }
      },
      orderBy: { version: 'desc' }
    });

    // 2. Nếu không có profile nào
    if (profiles.length === 0) {
      return c.json({
        success: true,
        data: []
      }, 200);
    }

    // 3. Chuẩn hóa dữ liệu mảng trả về bằng helper mapToFullSchema
    const formattedData = profiles.map(p => mapToFullSchema(p));

    return c.json({
      success: true,
      data: formattedData
    }, 200);

  } catch (error: any) {
    console.error("Get CV History Error:", error);
    return c.json({ 
      success: false, 
      message: error.message 
    }, 400);
  }
});
// --- TẠO HỒ SƠ ---
candidateRoute.use('/me/create-profile', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.createCandidateProfileDoc, async (c) => {
  try {
    const userId = getSafeUserId(c);
    const data = c.req.valid('json');

    // 1. Kiểm tra xem đã có bản Master chưa
    const existingMaster = await prisma.candidateProfile.findFirst({
      where: { userId, isMaster: true }
    });
    if (existingMaster) return c.json({ message: "Hồ sơ chính đã tồn tại" }, 400);

    // 2. Tạo Profile mới (Master)
    const profile = await prisma.candidateProfile.create({
      data: {
        ...data,
        userId,
        isMaster: true,
        version: 1,
        documentId: nanoid(),
        status: 'DRAFT',
        // Gán token ngẫu nhiên để tránh lỗi Unique Null của MongoDB
        shareToken: crypto.randomBytes(16).toString('hex'),
      },
      include: {
        user: { select: { name: true, email: true, role: true } },
        workExperiences: true,
        projects: true,
        educations: true
      }
    });

    // 3. Cập nhật Redis Search
    await redis.call('JSON.SET', `candidate:${profile.id}`, '$', JSON.stringify({
      id: profile.id,
      name: profile.user.name,
      headline: profile.headline,
      skills: profile.skills,
      summary: profile.summary
    }));

    // Trả về đúng object Profile như Doc yêu cầu
    return c.json(mapToFullSchema(profile), 201);

  } catch (error: any) {
    console.error(error);
    return c.json({ success: false, message: error.message }, 500);
  }
})
candidateRoute.use('/me/publish', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.publishCVDoc, async (c) => {
  try {
    const userId = getSafeUserId(c);

    const masterProfile = await prisma.candidateProfile.findFirst({
      where: { userId, isMaster: true },
      include: {
        user: { select: { name: true, email: true, role: true } },
        workExperiences: true,
        projects: true,
        educations: true
      }
    });

    if (!masterProfile) {
      // SỬA: Phải có success: false để khớp với ErrorResponseSchema
      return c.json({ success: false, message: "Không tìm thấy hồ sơ chính" }, 404);
    }

    const updated = await prisma.candidateProfile.update({
      where: { id: masterProfile.id },
      data: { status: 'PUBLISHED' },
      include: {
        user: { select: { name: true, email: true, role: true } },
        workExperiences: true,
        projects: true,
        educations: true
      }
    });

    // Đồng bộ Redis...
    await redis.call('JSON.SET', `candidate:${updated.id}`, '$', JSON.stringify({
      id: updated.id,
      name: updated.user.name,
      headline: updated.headline,
      skills: updated.skills,
      summary: updated.summary
    }));

    // Trả về đúng schema cho mã 200
    return c.json(mapToFullSchema(updated), 200);

  } catch (error: any) {
    // SỬA: Trả về đúng schema cho mã 400
    return c.json({ success: false, message: error.message }, 400);
  }
});
candidateRoute.use('/me/blocks', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.addCVBlockDoc, async (c) => {
  const userId = getSafeUserId(c);
  const body = c.req.valid('json');

  const profile = await prisma.candidateProfile.findFirst({
    where: { userId, isMaster: true }
  });

  if (!profile) return c.json({ success: false, message: "Profile not found" }, 404);

  const newBlock = await prisma.cVBlock.create({
    data: {
      ...body,
      candidateProfileId: profile.id
    }
  });

  return c.json(newBlock, 201);
});
candidateRoute.use('/me/blocks/:id', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.updateCVBlockDoc, async (c) => {
  const { id } = c.req.valid('param'); // Lấy ID của Block từ URL
  const body = c.req.valid('json');    // Lấy dữ liệu cần sửa từ Body
  const userId = getSafeUserId(c);

  try {
    // 1. Tìm block và kiểm tra quyền sở hữu (Bảo mật)
    const block = await prisma.cVBlock.findUnique({
      where: { id },
      include: { 
        candidateProfile: {
          select: { userId: true }
        } 
      }
    });

    if (!block) {
      return c.json({ success: false, message: "Không tìm thấy khối nội dung này" }, 404);
    }

    // Kiểm tra xem block này có thuộc về User đang đăng nhập không
    if (block.candidateProfile.userId !== userId) {
      return c.json({ success: false, message: "Bạn không có quyền chỉnh sửa khối này" }, 403);
    }

    // 2. Thực hiện cập nhật
    const updatedBlock = await prisma.cVBlock.update({
      where: { id },
      data: {
        title: body.title,
        order: body.order,
        isVisible: body.isVisible,
        customContent: body.customContent,
        // Lưu ý: type thường không nên cho phép sửa sau khi tạo 
        // để tránh làm hỏng logic render ở Frontend.
      }
    });

    // 3. Trả về kết quả (đảm bảo đúng schema đã định nghĩa ở Doc)
    return c.json({
      id: updatedBlock.id,
      type: updatedBlock.type,
      title: updatedBlock.title,
      order: updatedBlock.order,
      isVisible: updatedBlock.isVisible,
      customContent: updatedBlock.customContent,
    }, 200);

  } catch (error: any) {
    console.error("Update CV Block Error:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});
candidateRoute.use('/me/reorder', verifyRole("CANDIDATE"));
candidateRoute.openapi(doc.reorderLayoutDoc, async (c) => {
  const userId = getSafeUserId(c);
  const { orders } = c.req.valid('json');

  const profile = await prisma.candidateProfile.findFirst({
    where: { userId, isMaster: true }
  });

  // Sử dụng Transaction để đảm bảo tất cả đều được cập nhật hoặc không cái nào cả
  await prisma.$transaction(
    orders.map((item) =>
      prisma.cVBlock.update({
        where: { id: item.id, candidateProfileId: profile!.id },
        data: { order: item.order }
      })
    )
  );

  return c.json({ success: true, message: "Layout updated" }, 200);
});
// --- CẬP NHẬT HỒ SƠ ---
candidateRoute.use('/me/update', verifyRole("CANDIDATE"));

candidateRoute.openapi(doc.updateCandidateProfileDoc, async (c) => {
  const userId = getSafeUserId(c);
  const data = c.req.valid('json');
  
  const updated = await prisma.candidateProfile.update({ where: { userId }, data });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  await redis.call('JSON.SET', `candidate:${updated.id}`, '$', JSON.stringify({
    id: updated.id,
    name: user?.name ?? '',
    headline: updated.headline ?? '',
    skills: updated.skills,
    summary: updated.summary ?? ''
  }));
  
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