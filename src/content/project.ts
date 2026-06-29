import type { Bilingual } from "@/contexts/LanguageContext";

export const mission: Bilingual = {
  en: "In this oral history and digital humanities project, the Dartmouth Digital History Initiative (DDHI) at Dartmouth College will collaborate with the Vietnam Studies Center at Fulbright University Vietname to forge new interpretive approaches to the study of the Vietnam War.",
  vi: "Dự án Phạm Xuân Ẩn thu thập, bảo tồn và phổ biến các cuộc phỏng vấn lịch sử truyền miệng với những người từng quen biết ông — đồng nghiệp, gia đình, nhà báo, sử gia và sĩ quan tình báo — cùng với các bản ghi âm được khôi phục và cải thiện chất lượng ghi lại chính lời kể của ông. Chúng tôi mong muốn hỗ trợ việc nghiên cứu, giảng dạy và tìm hiểu về nhân vật phức tạp này cũng như bối cảnh rộng lớn hơn của hoạt động tình báo trong Chiến tranh Việt Nam.",
};

export const methodology: Bilingual = {
  en: "This project is recovering, digitally enhancing, and making accessible a set of oral history interviews recorded more than twenty years ago with the late Pham Xuan An, the most celebrated spy of the Vietnam War. We are also developing a free digital archive that includes the enhanced original interviews, new oral histories with An’s associates (conducted in Vietnamese by Fulbright University students), scholarly essays, and interactive data visualization tools. Together, the features of this archive invite audiences in the United States, Vietnam, and other countries to consider and reassess the sources we have and the stories we tell about the Vietnam War in 2025 – 50 years after the fall of Saigon",
  vi: "Các cuộc phỏng vấn được thực hiện bằng tiếng Anh, tiếng Việt hoặc tiếng Pháp. Mỗi cuộc đều được ghi âm với sự đồng ý của người kể, được gỡ băng, chỉnh sửa nhẹ và dịch. Bản ghi gốc được lưu giữ cùng với bản dịch. Âm thanh được mã hóa MP3 để phát trực tuyến và lưu trữ ở dạng WAV không nén.",
};

export const team: { name: string; role: Bilingual }[] = [
  { name: "Team Member", role: { en: "Role", vi: "Phụ trách biên tập và định hướng nội dung." } },
  { name: "Team Member", role: { en: "Role", vi: "Thực hiện phỏng vấn và nghiên cứu tư liệu." } },
  { name: "Team Member", role: { en: "Role", vi: "Hiệu đính bản dịch Anh ↔ Việt." } },
];

export const studentResearchers: { name: string; role: Bilingual }[] = [
  { name: "Student Researcher", role: { en: "Role", vi: "Vai trò" } },
  { name: "Student Researcher", role: { en: "Role", vi: "Vai trò" } },
  { name: "Student Researcher", role: { en: "Role", vi: "Vai trò" } },
];

export const partners: Bilingual = {
  en: "Developed in partnership with ....",
  vi: "Phát triển hợp tác với các thư viện nghiên cứu đại học và nhà báo độc lập tại Việt Nam, Pháp và Hoa Kỳ.",
};

export const cite: Bilingual = {
  en: "Cite as: \"[Interviewee name], interviewed by [Interviewer], [Date], The Pham Xuan An Project.\"",
  vi: "Trích dẫn: \"[Tên người được phỏng vấn], phỏng vấn bởi [Người phỏng vấn], [Ngày], Dự án Phạm Xuân Ẩn.\"",
};