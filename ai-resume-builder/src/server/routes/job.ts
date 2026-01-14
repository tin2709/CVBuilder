import { OpenAPIHono } from '@hono/zod-openapi';
import { createJobDoc,updateJobDoc, deleteJobDoc,deleteManyJobsDoc,getMyJobsDoc,toggleSaveJobDoc,
  getJobsDoc, 
  getJobByIdDoc, 
  getSavedJobsDoc,
  importJobFromLinkDoc 
 } from '@/schemas/api-doc';
import { prisma } from '@/lib/db';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import { verifyRole } from '@/middlewares/auth.middleware';

// 1. Định nghĩa kiểu dữ liệu khớp với những gì Middleware lưu trữ
type Variables = {
  jwtPayload: {
    id: string;    // Giả sử trong JWT payload của bạn có trường 'id'
    role: string;
    email: string;
  }
}
function manualParseJob(title: string, text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let requirements = "";
  let description = "";
  let currentSection = "description";

  for (const line of lines) {
    const lower = line.toLowerCase();
    // Logic nhận diện section
    if (lower.includes("yêu cầu") || lower.includes("requirement") || lower.includes("kỹ năng")) {
      currentSection = "requirements";
      continue;
    }
    if (lower.includes("quyền lợi") || lower.includes("benefit") || lower.includes("chế độ")) {
      currentSection = "benefits"; // Tạm thời bỏ qua benefits hoặc gộp vào desc
      continue;
    }

    if (currentSection === "requirements") requirements += line + "\n";
    else description += line + "\n";
  }

  return {
    title: title || lines[0] || "",
    description: description.trim(),
    requirements: requirements.trim() || "Vui lòng kiểm tra lại nội dung trích xuất",
  };
}
const jobRoute = new OpenAPIHono<{ Variables: Variables }>();
jobRoute.use('/import-link', verifyRole('RECRUITER'));
jobRoute.openapi(importJobFromLinkDoc, async (c) => {
  const { url } = c.req.valid('json');

  try {
    // 1. Tải HTML (Giả danh trình duyệt để tránh bị chặn cơ bản)
    const response = await axios.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Referer': 'https://www.google.com/', // Giả vờ đến từ Google
    'Sec-Ch-Ua': '"Not A(Bit<BR;vid";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1'
  },
  timeout: 15000 // Tăng thời gian chờ lên 15s
});

    // 2. Sử dụng Readability để làm sạch nội dung
    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      return c.json({ success: false, message: "Không thể trích xuất nội dung từ trang web này" }, 400);
    }

    // 3. Sử dụng hàm bóc tách thủ công (Manual Parsing) 
    // Nếu sau này bạn có AI (Gemini), hãy gửi article.textContent cho AI ở bước này
const parsedData = manualParseJob(
  article.title ?? "", 
  article.textContent ?? ""
);
    return c.json({
      success: true,
      data: {
        ...parsedData,
        companyName: article.siteName || "",
        location: null, // Bóc tách location thủ công rất khó, nên để user tự điền
      }
    }, 200);

  } catch (error: any) {
    return c.json({ success: false, message: "Lỗi khi tải trang: " + error.message }, 400);
  }
});


// 2. Áp dụng middleware (Đảm bảo path khớp với route /create)
jobRoute.use('/create', verifyRole('RECRUITER'));
jobRoute.openapi(createJobDoc, async (c) => {
  // 3. LẤY DỮ LIỆU TỪ 'jwtPayload'
  const payload = c.get('jwtPayload');

  // 4. Kiểm tra an toàn trước khi lấy id
  const recruiterId = payload?.id;

  if (!recruiterId) {
    return c.json({ 
      success: false, 
      message: 'Không tìm thấy thông tin định danh trong Token (thiếu id)' 
    }, 401);
  }

  const body = c.req.valid('json');

  try {
    const job = await prisma.job.create({
      data: {
        title: body.title,
        companyName: body.companyName,
        description: body.description,
        requirements: body.requirements,
        location: body.location,
        salaryRange: body.salaryRange,
        startDate: new Date(body.startDate),
        deadline: new Date(body.deadline),
        applyLink: body.applyLink,
        hotline: body.hotline,
        recruiterId: recruiterId, // Gán ID lấy từ Token vào đây
      },
    });

    // Tạo nội dung quảng cáo
    const marketingText = `
Mùa đông lạnh lẽo hão huyền
Lạnh! Ừ thì lạnh, nhưng ${body.companyName} vẫn chờ!
Chờ đợt TUYỂN DỤNG tháng ${new Date(body.deadline).getMonth() + 1}.
Cơ hội dành cho tất cả mọi ứng viên tại khu vực ${body.location}.
Thời gian dự kiến đi làm: ${new Date(body.startDate).toLocaleDateString('vi-VN')}.
Địa điểm: ${body.location}.

Mô tả công việc:
${body.description}

Yêu cầu: ${body.requirements}

Hạn nộp hồ sơ: ${new Date(body.deadline).toLocaleDateString('vi-VN')}.
Link đăng ký: ${body.applyLink}
Hotline: ${body.hotline}
    `.trim();

    return c.json({ success: true, data: job, marketingText }, 201);
  } catch (error: any) {
    console.error("Prisma Error:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});
jobRoute.use('/update/:id', verifyRole('RECRUITER'));
jobRoute.openapi(updateJobDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  try {
    // 1. Tìm bài đăng và kiểm tra chủ sở hữu
    const existingJob = await prisma.job.findUnique({ where: { id } });
    
    if (!existingJob) return c.json({ success: false, message: "Không tìm thấy bài đăng" }, 404);
    if (existingJob.recruiterId !== payload.id) {
      return c.json({ success: false, message: "Bạn không có quyền sửa bài đăng của người khác" }, 403);
    }

    // 2. Cập nhật
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
      },
    });

    // 3. Tạo lại marketingText mới
    const marketingText = `(Nội dung đã cập nhật)\nLạnh! Nhưng ${updatedJob.companyName} vẫn chờ...\n...`; 

    return c.json({ success: true, data: updatedJob, marketingText }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// --- API XÓA BÀI ĐĂNG ---
jobRoute.use('/delete/:id', verifyRole('RECRUITER'));
jobRoute.openapi(deleteJobDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = c.req.valid('param');

  try {
    const existingJob = await prisma.job.findUnique({ where: { id } });
    
    if (!existingJob) return c.json({ success: false, message: "Không tìm thấy bài đăng" }, 404);
    
    // Kiểm tra chủ sở hữu
    if (existingJob.recruiterId !== payload.id) {
      return c.json({ success: false, message: "Bạn không có quyền xóa bài này" }, 403);
    }

    await prisma.job.delete({ where: { id } });

    return c.json({ success: true, message: "Xóa bài đăng thành công" }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
jobRoute.use('/bulk-delete', verifyRole('RECRUITER'));

jobRoute.openapi(deleteManyJobsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const recruiterId = payload?.id;
  if (!recruiterId) return c.json({ success: false, message: 'Chưa đăng nhập' }, 401);

  const { ids } = c.req.valid('json');

  try {
    // Prisma deleteMany cực kỳ mạnh mẽ:
    // Nó sẽ chỉ xóa những bài có ID nằm trong mảng VÀ thuộc về recruiterId này
    const result = await prisma.job.deleteMany({
      where: {
        id: { in: ids },
        recruiterId: recruiterId
      }
    });

    return c.json({
      success: true,
      count: result.count, // Trả về số lượng bản ghi thực tế đã bị xóa
      message: `Đã xóa thành công ${result.count} bài đăng`
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});
// src/server/routes/job.ts

// Thêm middleware bảo vệ đường dẫn /my-jobs
jobRoute.use('/my-jobs', verifyRole('RECRUITER'));

jobRoute.openapi(getMyJobsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const recruiterId = payload?.id;

  if (!recruiterId) return c.json({ success: false, message: 'Chưa đăng nhập' }, 401);

  try {
    // Tìm tất cả Job có recruiterId khớp với người đang đăng nhập
    const jobs = await prisma.job.findMany({
      where: {
        recruiterId: recruiterId
      },
      orderBy: {
        createdAt: 'desc' // Bài mới nhất hiện lên đầu
      },
      select: {
        id: true,
        title: true,
        companyName: true,
        description:true,
        salaryRange:true,
        location: true,
        status: true,
        createdAt: true,
        deadline: true,
        applyLink:true,
        hotline:true,
        questions:true
      }
    });

    return c.json({
      success: true,
      count: jobs.length,
      data: jobs.map(j => ({
        ...j,
        createdAt: j.createdAt.toISOString(),
        deadline: j.deadline ? j.deadline.toISOString() : null,
      }))
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

jobRoute.use('/:id/save', verifyRole('CANDIDATE'));
jobRoute.openapi(toggleSaveJobDoc, async (c) => {
  const payload = c.get('jwtPayload');
  const jobId = c.req.param('id');
  const userId = payload.id;

  // 1. Kiểm tra xem User đã lưu job này chưa
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { savedJobIds: true }
  });

  const isSaved = user?.savedJobIds.includes(jobId);

  // 2. Sử dụng lệnh update với connect/disconnect của Prisma
  await prisma.user.update({
    where: { id: userId },
    data: {
      savedJobs: isSaved 
        ? { disconnect: { id: jobId } } // Nếu đã lưu thì bỏ lưu
        : { connect: { id: jobId } }    // Nếu chưa lưu thì lưu
    }
  });

  return c.json({
    success: true,
    message: isSaved ? "Đã xóa khỏi danh sách yêu thích" : "Đã lưu vào danh sách yêu thích",
    isSaved: !isSaved
  }, 200);
});
jobRoute.openapi(getJobsDoc, async (c) => {
  const query = c.req.valid('query');
  const payload = c.get('jwtPayload'); // Có thể null nếu không qua middleware
  
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const skip = (page - 1) * limit;

  // Xây dựng bộ lọc
  const where: any = {
    status: 'OPEN',
    ...(query.search && {
      OR: [
        { title: { contains: query.search, mode: 'insensitive' } },
        { companyName: { contains: query.search, mode: 'insensitive' } },
      ],
    }),
    ...(query.location && { location: { contains: query.location, mode: 'insensitive' } }),
    ...(query.categoryId && { categoryId: query.categoryId }),
  };

  try {
    const [total, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: { select: { id: true, name: true, logoUrl: true } },
          category: { select: { id: true, name: true, icon: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Xử lý logic kiểm tra user đã save hay apply chưa
    const candidateId = payload?.id;
    const formattedData = jobs.map((job) => ({
      ...job,
      createdAt: job.createdAt.toISOString(),
      deadline: job.deadline?.toISOString() || null,
      isSaved: candidateId ? job.savedByUserIds.includes(candidateId) : false,
      // Logic isApplied có thể check trong bảng Application nếu cần
    }));

    return c.json({
      success: true,
      count: jobs.length,
      total,
      data: formattedData,
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// --- 2. API: Xem chi tiết công việc ---
jobRoute.use('/:id', verifyRole('CANDIDATE'));
jobRoute.openapi(getJobByIdDoc, async (c) => {
  const { id } = c.req.valid('param');
  const payload = c.get('jwtPayload');

  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        category: true,
        applications: payload ? { where: { candidate: { userId: payload.id } } } : false
      }
    });

    if (!job) return c.json({ success: false, message: "Không tìm thấy công việc" }, 404);

    const application = job.applications?.[0];

    const result = {
      ...job,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      startDate: job.startDate?.toISOString() || null,
      deadline: job.deadline?.toISOString() || null,
      isSaved: payload ? job.savedByUserIds.includes(payload.id) : false,
      applicationStatus: application ? application.status : null,
    };

    return c.json({ success: true, data: result }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// --- 3. API: Lấy danh sách công việc đã lưu ---
jobRoute.use('/me/saved', verifyRole('CANDIDATE'));
jobRoute.openapi(getSavedJobsDoc, async (c) => {
  const payload = c.get('jwtPayload');
  
  try {
    const userWithSavedJobs = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        savedJobs: {
          include: {
            company: { select: { id: true, name: true, logoUrl: true } },
            category: { select: { id: true, name: true, icon: true } },
          }
        }
      }
    });

    const jobs = userWithSavedJobs?.savedJobs || [];

    return c.json({
      success: true,
      count: jobs.length,
      total: jobs.length,
      data: jobs.map(job => ({
        ...job,
        createdAt: job.createdAt.toISOString(),
        deadline: job.deadline?.toISOString() || null,
        isSaved: true // Chắc chắn là true vì đang lấy trong list đã lưu
      }))
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});


export default jobRoute;