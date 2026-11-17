import type { Bilingual } from "@/contexts/LanguageContext";
import ddhiLogo from "@/assets/ddhi-logo.svg";
import fulbrightLogo from "@/assets/fulbright-logo-t.png";
import ttuLogo from "@/assets/ttu-logo.svg";

/* All copy in this file is bilingual. The Vietnamese was drafted alongside the
   English rather than machine-translated from it, but it has not yet been read by
   a native reviewer. TODO: have the VI strings reviewed before launch. */

export const standfirst: Bilingual = {
  en: "A free archive, in English and Vietnamese, of oral history interviews with Phạm Xuân Ẩn and with people who knew him. Readers in Vietnam and the United States work from the same recordings, each in their own language.",
  vi: "Một kho lưu trữ miễn phí, bằng tiếng Anh và tiếng Việt, gồm các cuộc phỏng vấn lịch sử truyền miệng với Phạm Xuân Ẩn và với những người từng quen biết ông. Độc giả ở Việt Nam và Hoa Kỳ cùng làm việc trên những bản ghi giống nhau, mỗi người bằng ngôn ngữ của mình.",
};

export const mission: Bilingual = {
  en: "The Dartmouth Digital History Initiative (DDHI) at Dartmouth College runs the project with the Vietnam Studies Center at Fulbright University Vietnam.",
  vi: "Sáng kiến Lịch sử Số Dartmouth (DDHI) thuộc Đại học Dartmouth thực hiện dự án cùng Trung tâm Nghiên cứu Việt Nam thuộc Đại học Fulbright Việt Nam.",
};

export const methodology: Bilingual = {
  en: "Historians and writers recorded long conversations with Ẩn in 2005. We are restoring the audio of those recordings and publishing each one with an index you can search. Students and researchers at Fulbright and Dartmouth are adding new interviews with people who knew him. Essays and data visualizations built from the same material are in preparation.",
  vi: "Năm 2005, các nhà sử học và nhà văn đã ghi lại những cuộc trò chuyện dài với ông Ẩn. Chúng tôi đang phục hồi âm thanh của những bản ghi ấy và công bố mỗi bản ghi kèm một chỉ mục có thể tìm kiếm. Sinh viên và nhà nghiên cứu tại Fulbright và Dartmouth đang bổ sung các cuộc phỏng vấn mới với những người từng quen biết ông. Các tiểu luận và trực quan hóa dữ liệu dựng từ chính nguồn tư liệu ấy đang được chuẩn bị.",
};

/** How a reader actually uses a recording on this site. */
export const presentation: Bilingual = {
  en: "Every recording is published through OHMS, the viewer the University of Kentucky built for oral history archives. Each interview is split into indexed segments, each with a title, a synopsis and keywords, so you can read what a stretch of tape covers and jump straight to it. Searching the index returns the moments where a name or subject comes up.",
  vi: "Mỗi bản ghi được công bố qua OHMS, trình xem do Đại học Kentucky xây dựng cho các kho lưu trữ lịch sử truyền miệng. Mỗi cuộc phỏng vấn được chia thành các đoạn có lập chỉ mục, mỗi đoạn có tiêu đề, tóm lược và từ khóa, để người dùng biết đoạn băng ấy nói về điều gì và chuyển thẳng tới đó. Tìm kiếm trong chỉ mục sẽ trả về những thời điểm một cái tên hay chủ đề được nhắc đến.",
};

/** What the two languages do and do not cover yet. */
export const bilingualNote: Bilingual = {
  en: "Everything we wrote for the site is in English and Vietnamese, and the EN / VI toggle in the header switches all of it at once. The recordings stay in the language they were made in. Their index titles are in English for now: none of the current exports carries a Vietnamese index yet.",
  vi: "Mọi nội dung chúng tôi viết cho trang đều có bằng tiếng Anh và tiếng Việt, và nút EN / VI ở đầu trang chuyển toàn bộ cùng lúc. Các bản ghi giữ nguyên ngôn ngữ lúc được ghi. Tiêu đề chỉ mục hiện chỉ có bằng tiếng Anh, vì chưa bản xuất nào có chỉ mục tiếng Việt.",
};

/** Named on the site only where the archive's own records name them. */
export const teamNote: Bilingual = {
  en: "Faculty, staff and student researchers at Dartmouth College and Fulbright University Vietnam run the project. A full list of names and credits will be published here.",
  vi: "Dự án do giảng viên, cán bộ và sinh viên nghiên cứu tại Đại học Dartmouth và Đại học Fulbright Việt Nam thực hiện. Danh sách tên và phần ghi công đầy đủ sẽ được công bố tại đây.",
};

export const partnersNote: Bilingual = {
  en: "Three institutions, in the United States and Vietnam, work on the archive.",
  vi: "Ba tổ chức, ở Hoa Kỳ và Việt Nam, cùng thực hiện kho lưu trữ.",
};

export type Partner = {
  name: Bilingual;
  sub: Bilingual;
  /** What this institution contributes to the archive. */
  role: Bilingual;
  href: string;
  /** Bare domain, shown as the outbound destination. */
  go: string;
  logo: string;
  logoAlt: string;
};

export const partners: Partner[] = [
  {
    name: { en: "Dartmouth Digital History Initiative", vi: "Sáng kiến Lịch sử Số Dartmouth" },
    sub: { en: "Dartmouth College", vi: "Đại học Dartmouth" },
    role: {
      en: "Leads the project, holds the original recordings, and builds and hosts the archive.",
      vi: "Chủ trì dự án, lưu giữ các bản ghi gốc, xây dựng và vận hành kho lưu trữ.",
    },
    href: "https://ddhi.dartmouth.edu/",
    go: "ddhi.dartmouth.edu",
    logo: ddhiLogo,
    logoAlt: "Dartmouth Digital History Initiative",
  },
  {
    name: { en: "Vietnam Studies Center", vi: "Trung tâm Nghiên cứu Việt Nam" },
    sub: { en: "Fulbright University Vietnam", vi: "Đại học Fulbright Việt Nam" },
    role: {
      en: "Conducts new oral histories in Vietnamese and guides the archive's Vietnamese-language scholarship.",
      vi: "Thực hiện các cuộc phỏng vấn lịch sử truyền miệng mới bằng tiếng Việt và định hướng phần học thuật tiếng Việt của kho lưu trữ.",
    },
    href: "https://fulbright.edu.vn/vietnam-studies-center/",
    go: "fulbright.edu.vn",
    logo: fulbrightLogo,
    logoAlt: "Fulbright University Vietnam",
  },
  {
    name: { en: "Vietnam Center & Sam Johnson Archive", vi: "Vietnam Center & Sam Johnson Archive" },
    sub: { en: "Texas Tech University", vi: "Đại học Texas Tech" },
    role: {
      en: "The archival partner. Its Vietnam Archive is one of the largest collections of Vietnam War material outside the U.S. government.",
      vi: "Đối tác lưu trữ. Kho Lưu trữ Việt Nam của trung tâm là một trong những bộ sưu tập tư liệu Chiến tranh Việt Nam lớn nhất nằm ngoài chính phủ Mỹ.",
    },
    href: "https://www.vietnam.ttu.edu/",
    go: "vietnam.ttu.edu",
    logo: ttuLogo,
    logoAlt: "Texas Tech University",
  },
];

export const citeNote: Bilingual = {
  en: "You may quote this material for research and teaching. Cite an interview by the person speaking, in this form:",
  vi: "Bạn có thể trích dẫn tư liệu này cho nghiên cứu và giảng dạy. Xin trích dẫn một cuộc phỏng vấn theo tên người kể, theo mẫu sau:",
};

/** How to cite one moment rather than a whole recording. */
export const citeLinkNote: Bilingual = {
  en: "Every indexed passage has a link of its own, under \"Direct segment link\" in the player, so a citation can point at the moment rather than the whole recording.",
  // TODO: verify VI
  vi: "Mỗi đoạn được lập chỉ mục có đường dẫn riêng, ở mục \"Direct segment link\" trong trình phát, để trích dẫn có thể trỏ đúng thời điểm thay vì cả bản ghi.",
};

export const cite: Bilingual = {
  en: "[Interviewee name], interviewed by [Interviewer], [Date], The Pham Xuan An Project.",
  vi: "[Tên người được phỏng vấn], phỏng vấn bởi [Người phỏng vấn], [Ngày], Dự án Phạm Xuân Ẩn.",
};

/* ------------------------------------------------------------------------- *
 * What the collection holds
 * ------------------------------------------------------------------------- */

/** Extent of the collection, stated in the finding-aid sense: how much material
 *  there is and how much of it has been indexed. Every figure is passed in by
 *  the caller, which derives it from `interviews.ts` and the OHMS exports, so
 *  this copy cannot drift out of date as recordings are added or indexed. */
export const collectionNote = (n: {
  recordings: number;
  people: number;
  hours: number;
  minutes: number;
  /** Indexed segments across every export. */
  segments: number;
}): Bilingual => ({
  en: `${n.recordings} recordings with ${n.people} people, ${n.hours} hours ${n.minutes} minutes in all, indexed into ${n.segments} passages. The 2005 sessions are conversations with Ẩn himself, recorded the year before he died. The project recorded the rest, with people who knew him.`,
  // TODO: verify VI
  vi: `${n.recordings} bản ghi với ${n.people} người, tổng cộng ${n.hours} giờ ${n.minutes} phút, được lập chỉ mục thành ${n.segments} đoạn. Các buổi ghi năm 2005 là những cuộc trò chuyện với chính ông Ẩn, được ghi một năm trước khi ông mất. Số còn lại do dự án ghi, với những người từng quen biết ông.`,
});

/** Stated on the voice whose recordings are only partly indexed, so a passage
 *  count is never read as covering everything that person recorded. */
export const pendingIndexLine = (n: { unindexed: number; total: number }): Bilingual => ({
  en: `${n.unindexed} of these ${n.total} recordings ${n.unindexed === 1 ? "is" : "are"} published as audio while indexing continues.`,
  // TODO: verify VI
  vi: `${n.unindexed} trong số ${n.total} bản ghi này hiện chỉ có âm thanh trong khi phần lập chỉ mục được hoàn thiện.`,
});

/** Lead-in to the sample of real indexed segment titles shown under each voice.
 *  The titles themselves come from the OHMS exports and are English-only —
 *  `title_alt` is empty in every current export — so the label carries the
 *  language and the titles are marked `lang="en"` rather than faked in VI. */
export const indexedTopicsLabel: Bilingual = {
  en: "Indexed topics include",
  // TODO: verify VI
  vi: "Các chủ đề được lập chỉ mục gồm",
};

/** Shown in place of the topic sample for a voice whose recordings carry no
 *  index segments at all. */
export const noIndexYet: Bilingual = {
  en: "No index has been published for these recordings yet.",
  // TODO: verify VI
  vi: "Chưa có chỉ mục nào được công bố cho các bản ghi này.",
};

/** Joins names as running prose. Deliberately not a middle-dot fact string. */
const joinNames = (names: string[], and: string) =>
  names.length <= 1
    ? (names[0] ?? "")
    : `${names.slice(0, -1).join(", ")} ${and} ${names[names.length - 1]}`;

/** Who recorded one person, and when. `span` is a year or a "2025–2026" range. */
export const recordingsLine = (n: {
  count: number;
  span: string;
  interviewers: string[];
}): Bilingual => {
  const range = n.span.includes("–");
  return {
    en: `${n.count} ${n.count === 1 ? "recording" : "recordings"}, made in ${n.span} by ${joinNames(n.interviewers, "and")}.`,
    // TODO: verify VI
    vi: `${n.count} bản ghi, do ${joinNames(n.interviewers, "và")} thực hiện ${range ? "trong" : "năm"} ${n.span}.`,
  };
};

/** Extent as a person reads it, so it stays out of the mono timecode register. */
export const runtimeLabel = (hours: number, minutes: number): Bilingual => ({
  en: hours === 0 ? `${minutes} min` : `${hours} hr ${minutes} min`,
  // TODO: verify VI
  vi: hours === 0 ? `${minutes} phút` : `${hours} giờ ${minutes} phút`,
});

/** How much of a person's material carries an OHMS index. */
export const passagesLabel = (count: number): Bilingual => ({
  en: `${count} indexed ${count === 1 ? "passage" : "passages"}`,
  // TODO: verify VI
  vi: `${count} đoạn được lập chỉ mục`,
});
