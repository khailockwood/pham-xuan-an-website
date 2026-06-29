import type { Bilingual } from "@/contexts/LanguageContext";

export type TranscriptSegment = {
  timestamp: string;
  speaker: string;
  text: Bilingual;
};

export type Interview = {
  slug: string;
  title: Bilingual;
  interviewee: string;
  interviewer: string;
  date: string; // ISO
  duration: string; // mm:ss or hh:mm:ss
  originalLanguage: "en" | "vi" | "fr";
  summary: Bilingual;
  audio: string; // path under /audio/
  transcript: TranscriptSegment[];
};

export const interviews: Interview[] = [
  {
    slug: "robert-shaplen-recollection",
    title: { en: "Interview with Pham Xuan An", vi: "Phỏng vấn với Phạm Xuân Ẩn" },
    interviewee: "Pham Xuan An",
    interviewer: "Edward Miller",
    date: "2005-01-11",
    duration: "01:28:47",
    originalLanguage: "en",
    summary: {
      en: "Pham Xuan An discusses his life, career, and interpretations of Vietnamese history and the Vietnam War.",
      vi: "Phạm Xuân Ẩn thảo luận về cuộc đời, sự nghiệp và những cách giải thích về lịch sử Việt Nam cũng như Chiến tranh Việt Nam.",
    },
    audio: "/audio/sample-1.mp3",
    transcript: [
      { timestamp: "00:00", speaker: "Interviewer", text: { en: "Could you tell us when you first met Pham Xuan An?", vi: "Ông có thể kể lần đầu tiên gặp Phạm Xuân Ẩn không?" } },
      { timestamp: "00:08", speaker: "Shaplen", text: { en: "It must have been 1962, perhaps early 1963. He was already known around the press corps as the man who knew everything that mattered in Saigon — and more importantly, who would tell you, accurately, who was rising and who was falling within the Diem government.", vi: "Chắc là khoảng năm 1962, có lẽ đầu 1963. Ông đã nổi tiếng trong giới nhà báo là người biết mọi chuyện quan trọng ở Sài Gòn — và quan trọng hơn, người sẽ nói cho bạn biết một cách chính xác ai đang lên, ai đang xuống trong chính quyền Diệm." } },
      { timestamp: "00:42", speaker: "Interviewer", text: { en: "Did you have any sense, even faintly, of his other work?", vi: "Ông có cảm nhận, dù chỉ thoáng qua, về công việc khác của ông Ẩn không?" } },
      { timestamp: "00:50", speaker: "Shaplen", text: { en: "None. None of us did. And I have spent many years thinking about why that was, and I've come to the conclusion that it was not because he was a great deceiver, but because he was a great listener. We told him things, and he never had to ask.", vi: "Không. Không ai trong chúng tôi nhận ra. Tôi đã dành nhiều năm suy nghĩ tại sao, và tôi đi đến kết luận rằng không phải vì ông là người dối trá tài tình, mà vì ông là người biết lắng nghe. Chúng tôi kể cho ông nghe mọi chuyện, và ông không bao giờ phải hỏi." } },
    ],
  },
  {
    slug: "nguyen-thi-thu-an",
    title: { en: "Interview with Germaine Swanson", vi: "Phỏng vấn với Germaine Swanson" },
    interviewee: "Germaine Swanson",
    interviewer: "Le Thi Hong Phuc",
    date: "2026-01-18",
    duration: "01:58:41",
    originalLanguage: "en",
    summary: {
      en: "Germaine Swanson, who worked with Pham Xuan An at Reuters, recounts her military service in the Army of the Republic of Vietnam, journalism career, and eventual immigration to the United States.",
      vi: "Germaine Swanson, người từng làm việc với Phạm Xuân Ẩn tại Reuters, kể lại quá trình phục vụ quân đội trong Quân lực Việt Nam Cộng hòa, sự nghiệp báo chí và việc định cư tại Hoa Kỳ.",
    },
    audio: "/audio/sample-2.mp3",
    transcript: [
      { timestamp: "00:00", speaker: "Interviewer", text: { en: "What do you remember most clearly about your father at home?", vi: "Điều bà nhớ rõ nhất về cha mình ở nhà là gì?" } },
      { timestamp: "00:06", speaker: "Nguyễn Thị Thu An", text: { en: "His birds. He kept songbirds, and every morning he would sit with them on the small balcony and read the foreign papers. He said the birds were his real colleagues — they did not ask him for opinions.", vi: "Những con chim của ông. Ông nuôi chim hót, và mỗi sáng ông ngồi cùng chúng trên ban công nhỏ và đọc báo nước ngoài. Ông nói chim mới là đồng nghiệp thật sự của ông — chúng không bao giờ hỏi ý kiến ông." } },
      { timestamp: "00:38", speaker: "Interviewer", text: { en: "Did he speak about the war years?", vi: "Ông có nói về những năm chiến tranh không?" } },
      { timestamp: "00:42", speaker: "Nguyễn Thị Thu An", text: { en: "Rarely, and never directly. He would tell stories about his American teachers in California, about the food, about driving on the freeways. The other half of his life he kept folded up, like a letter you mean to answer but never do.", vi: "Hiếm khi, và không bao giờ trực tiếp. Ông kể chuyện về thầy giáo Mỹ ở California, về thức ăn, về lái xe trên xa lộ. Nửa cuộc đời kia của ông, ông gấp lại, như một lá thư mà mình định trả lời nhưng không bao giờ trả lời." } },
    ],
  },
  {
    slug: "nguyen-thi-ngoc-hai",
    title: { en: "Interview with Nguyen Thi Ngoc Hai", vi: "Phỏng vấn với Nguyễn Thị Ngọc Hải" },
    interviewee: "Nguyen Thi Ngoc Hai",
    interviewer: "Le Thi Hong Phuc",
    date: "2026-04-10",
    duration: "48:02",
    originalLanguage: "vi",
    summary: {
      en: "1-sentence synopsis",
      vi: "Tóm tắt 1 câu",
    },
    audio: "/audio/sample-3.mp3",
    transcript: [],
  },
];