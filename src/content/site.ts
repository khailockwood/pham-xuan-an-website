import type { Bilingual } from "@/contexts/LanguageContext";

export const siteName: Bilingual = {
  en: "The Pham Xuan An Project",
  vi: "Dự án Phạm Xuân Ẩn",
};

export const tagline: Bilingual = {
  en: "An oral history archive of the journalist who lived two lives.",
  vi: "Kho lưu trữ lịch sử truyền miệng về nhà báo đã sống hai cuộc đời.",
};

export const nav: { to: string; label: Bilingual }[] = [
  { to: "/about-pxa", label: { en: "Who Was Pham Xuan An?", vi: "Phạm Xuân Ẩn là ai?" } },
  { to: "/about-project", label: { en: "The Pham Xuan An Project", vi: "Về dự án" } },
  { to: "/exhibits", label: { en: "Exhibits", vi: "Triển lãm" } },
  { to: "/interviews", label: { en: "Interviews", vi: "Phỏng vấn" } },
  { to: "/contact", label: { en: "Contact", vi: "Liên hệ" } },
];

export const ui = {
  readMore: { en: "Read more", vi: "Đọc thêm" },
  listen: { en: "Listen", vi: "Nghe" },
  download: { en: "Download audio", vi: "Tải âm thanh" },
  transcript: { en: "Transcript", vi: "Bản ghi" },
  duration: { en: "Duration", vi: "Thời lượng" },
  date: { en: "Date recorded", vi: "Ngày ghi" },
  interviewer: { en: "Interviewer", vi: "Người phỏng vấn" },
  interviewee: { en: "Interviewee", vi: "Người được phỏng vấn" },
  language: { en: "Language", vi: "Ngôn ngữ" },
  search: { en: "Search interviews…", vi: "Tìm phỏng vấn…" },
  noResults: { en: "No interviews match your search.", vi: "Không tìm thấy phỏng vấn nào." },
  backTo: { en: "Back to", vi: "Quay lại" },
  send: { en: "Send message", vi: "Gửi tin nhắn" },
  name: { en: "Name", vi: "Họ tên" },
  email: { en: "Email", vi: "Email" },
  subject: { en: "Subject", vi: "Chủ đề" },
  message: { en: "Message", vi: "Tin nhắn" },
  sent: { en: "Message ready — your email client will open.", vi: "Tin nhắn đã sẵn sàng — ứng dụng thư của bạn sẽ mở." },
  footerRights: {
    en: "An oral history and digital humanities project.",
    vi: "Một dự án lịch sử truyền miệng và nhân văn số.",
  },
};