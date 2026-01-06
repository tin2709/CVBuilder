export type NotificationTemplate = {
  title: string;
  body: string;
  type: 'APPLICATION_STATUS' | 'NEW_INTERVIEW' | 'AI_SCREENING_DONE' | 'NEW_MESSAGE' | 'SYSTEM';
  allowDigest?: boolean
};

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  // --- DÀNH CHO ỨNG VIÊN ---
  APPLICATION_RECEIVED: {
    title: "Đã nhận đơn ứng tuyển",
    body: "Chào {{ candidateName }}, chúng tôi đã nhận được hồ sơ của bạn cho vị trí {{ jobTitle }} tại {{ companyName }}.",
    type: "APPLICATION_STATUS",
  },
  APPLICATION_STATUS_CHANGED: {
    title: "Cập nhật trạng thái hồ sơ",
    body: "Hồ sơ của bạn cho vị trí {{ jobTitle }} đã được chuyển sang trạng thái: **{{ status }}**.",
    type: "APPLICATION_STATUS",
  },
  NEW_INTERVIEW_SCHEDULED: {
    title: "Lịch phỏng vấn mới",
    body: "Bạn có lịch phỏng vấn vị trí {{ jobTitle }} vào lúc {{ startTime | date: '%H:%M %d/%m/%Y' }}. Hình thức: {{ format }}.",
    type: "NEW_INTERVIEW",
  },
  AI_MATCH_SCORE_READY: {
    title: "Kết quả phân tích hồ sơ",
    body: "AI đã hoàn tất phân tích hồ sơ của bạn cho vị trí {{ jobTitle }}. Điểm tương thích: {{ score }}%.",
    type: "AI_SCREENING_DONE",
  },

  // --- DÀNH CHO NHÀ TUYỂN DỤNG ---
  NEW_CANDIDATE_APPLIED: {
    title: "Ứng viên mới",
    body: "Bạn có {{ count }} ứng viên mới cho vị trí {{ jobTitle }}.",
    type: "APPLICATION_STATUS",
    allowDigest: true, // Chỉ những template này mới được gom
  },
  AI_SCREENING_COMPLETED_RECRUITER: {
    title: "Sàng lọc AI hoàn tất",
    body: "Hệ thống AI đã tự động sàng lọc {{ count }} hồ sơ mới cho vị trí {{ jobTitle }}. Xem ngay danh sách đề xuất.",
    type: "AI_SCREENING_DONE",
  },
  

  // --- HỆ THỐNG ---
  WELCOME_USER: {
    title: "Chào mừng bạn!",
    body: "Chào mừng {{ name }} đã gia nhập nền tảng AI Recruitment. Hãy hoàn thiện hồ sơ để bắt đầu tìm việc ngay.",
    type: "SYSTEM",
  },
  PASSWORD_CHANGED: {
    title: "Mật khẩu đã thay đổi",
    body: "Mật khẩu tài khoản của bạn vừa được thay đổi thành công vào lúc {{ time }}.",
    type: "SYSTEM",
  }
};
export type NotificationTemplateKey = keyof typeof NOTIFICATION_TEMPLATES;
