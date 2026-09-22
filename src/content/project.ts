import type { Bilingual } from "@/contexts/LanguageContext";
import ddhiLogo from "@/assets/ddhi-logo.svg";
import fulbrightLogo from "@/assets/fulbright-logo-t.png";
import ttuLogo from "@/assets/ttu-logo.svg";

/* All copy in this file is bilingual. The Vietnamese was drafted alongside the
   English rather than machine-translated from it, but it has not yet been read by
   a native reviewer. TODO: have the VI strings reviewed before launch. */

export const standfirst: Bilingual = {
  en: "A free, bilingual archive of oral history interviews with and about Phạm Xuân Ẩn, built so that readers in Vietnam and the United States can work from the same sources, each in their own language.",
  vi: "Một kho lưu trữ song ngữ, truy cập miễn phí, gồm các cuộc phỏng vấn lịch sử truyền miệng với và về Phạm Xuân Ẩn, được xây dựng để độc giả ở Việt Nam và Hoa Kỳ cùng làm việc trên một nguồn tư liệu, mỗi người bằng ngôn ngữ của mình.",
};

export const mission: Bilingual = {
  en: "In this oral history and digital humanities project, the Dartmouth Digital History Initiative (DDHI) at Dartmouth College collaborates with the Vietnam Studies Center at Fulbright University Vietnam to forge new interpretive approaches to the study of the Vietnam War.",
  vi: "Trong dự án lịch sử truyền miệng và nhân văn số này, Sáng kiến Lịch sử Số Dartmouth (DDHI) thuộc Đại học Dartmouth hợp tác với Trung tâm Nghiên cứu Việt Nam thuộc Đại học Fulbright Việt Nam nhằm xây dựng những hướng tiếp cận diễn giải mới cho việc nghiên cứu Chiến tranh Việt Nam.",
};

export const methodology: Bilingual = {
  en: "The project is recovering, digitally enhancing, and making accessible a set of oral history interviews recorded more than twenty years ago with the late Phạm Xuân Ẩn, the most celebrated spy of the Vietnam War. Alongside those recordings we are building a free digital archive that holds the enhanced originals, new oral histories with An's associates, scholarly essays, and interactive data visualizations. It is aimed at readers in the United States, Vietnam, and elsewhere who want to work from the primary sources rather than from the accounts built on them, fifty years after the fall of Saigon.",
  vi: "Dự án đang khôi phục, xử lý kỹ thuật số và mở quyền tiếp cận cho một loạt cuộc phỏng vấn lịch sử truyền miệng được ghi hơn hai mươi năm trước với cố nhà báo Phạm Xuân Ẩn, điệp viên nổi tiếng nhất của Chiến tranh Việt Nam. Song song với những bản ghi ấy, chúng tôi xây dựng một kho lưu trữ số miễn phí gồm các bản gốc đã xử lý, những cuộc phỏng vấn mới với người quen biết ông, các tiểu luận học thuật và công cụ trực quan hóa dữ liệu. Kho lưu trữ hướng tới độc giả tại Hoa Kỳ, Việt Nam và nhiều nơi khác, những người muốn làm việc trực tiếp với tư liệu gốc thay vì qua các diễn giải dựng trên đó, năm mươi năm sau ngày Sài Gòn sụp đổ.",
};

/** How a reader actually uses a recording on this site. */
export const presentation: Bilingual = {
  en: "Every recording is published through the OHMS viewer, the standard tool for oral history in the field. Rather than one long audio file, each interview arrives broken into indexed segments: a title, a synopsis, and a set of keywords for each passage, so you can read what a stretch of tape covers and jump straight to it. The index is searchable, and searching it returns the moments where a name or subject actually comes up.",
  vi: "Mỗi bản ghi được công bố qua trình xem OHMS, công cụ tiêu chuẩn của ngành lịch sử truyền miệng. Thay vì một tệp âm thanh dài, mỗi cuộc phỏng vấn được chia thành các đoạn có lập chỉ mục: mỗi đoạn có tiêu đề, tóm lược và bộ từ khóa, để người dùng biết đoạn băng ấy nói về điều gì và chuyển thẳng tới đó. Chỉ mục có thể tìm kiếm, và kết quả trả về đúng những thời điểm một cái tên hay chủ đề được nhắc đến.",
};

/** What the two languages do and do not cover yet. */
export const bilingualNote: Bilingual = {
  en: "The site's interface, biography, and project text are written in both English and Vietnamese, and the toggle in the header switches everything at once. The recordings themselves are in their original language and are not dubbed. Where OHMS carries a translated index, the toggle switches that too.",
  vi: "Giao diện, tiểu sử và phần giới thiệu dự án được viết bằng cả tiếng Anh và tiếng Việt; nút chuyển ở đầu trang đổi toàn bộ cùng lúc. Bản thân các bản ghi giữ nguyên ngôn ngữ gốc và không được lồng tiếng. Ở những bản ghi có chỉ mục đã dịch trong OHMS, nút chuyển cũng đổi phần đó.",
};

/** Named on the site only where the archive's own records name them. */
export const teamNote: Bilingual = {
  en: "The project is staffed by faculty, staff, and student researchers at Dartmouth College and Fulbright University Vietnam. A full roster and credits will be published here.",
  vi: "Dự án được thực hiện bởi giảng viên, cán bộ và sinh viên nghiên cứu tại Đại học Dartmouth và Đại học Fulbright Việt Nam. Danh sách đầy đủ và phần ghi công sẽ được công bố tại đây.",
};

export const partnersNote: Bilingual = {
  en: "The archive is a collaboration between three institutions on two continents.",
  vi: "Kho lưu trữ là sự hợp tác giữa ba tổ chức trên hai châu lục.",
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
      en: "Archival partner, and home to one of the largest collections of Vietnam War material outside government hands.",
      vi: "Đối tác lưu trữ, nơi lưu giữ một trong những bộ sưu tập tư liệu Chiến tranh Việt Nam lớn nhất ngoài khu vực nhà nước.",
    },
    href: "https://www.vietnam.ttu.edu/",
    go: "vietnam.ttu.edu",
    logo: ttuLogo,
    logoAlt: "Texas Tech University",
  },
];

export const citeNote: Bilingual = {
  en: "Material here may be quoted for research and teaching. Cite an interview by the person speaking, not by the page.",
  vi: "Tư liệu tại đây có thể được trích dẫn cho mục đích nghiên cứu và giảng dạy. Xin trích dẫn theo người kể, không theo trang web.",
};

export const cite: Bilingual = {
  en: "[Interviewee name], interviewed by [Interviewer], [Date], The Pham Xuan An Project.",
  vi: "[Tên người được phỏng vấn], phỏng vấn bởi [Người phỏng vấn], [Ngày], Dự án Phạm Xuân Ẩn.",
};
