import type { Bilingual } from "@/contexts/LanguageContext";

/* Placeholder copy for the bibliography page. Entries are not written yet; when
   they are, they belong in this file. TODO: verify VI. */
export const bibliographyTitle: Bilingual = { en: "Bibliography", vi: "Thư mục" };

export const bibliographyDek: Bilingual = {
  en: "Sources about and relating to Phạm Xuân Ẩn.",
  vi: "Các nguồn thông tin và liên quan đến Phạm Xuân Ẩn.",
};

export const bibliographyNote: Bilingual = {
  en: "The Dartmouth Digital History Initiative team is compiling the bibliography. It will list the published accounts of An's life in English and Vietnamese, so that the recordings in this archive can be read against them. The first two entries are below.",
  vi: "Nhóm Sáng kiến Lịch sử Số Dartmouth đang biên soạn thư mục. Thư mục sẽ liệt kê các công trình đã xuất bản về cuộc đời ông Ẩn bằng tiếng Anh và tiếng Việt, để người đọc có thể đối chiếu chúng với các bản ghi trong kho lưu trữ này. Hai mục đầu tiên ở bên dưới.",
};

/* The published accounts, one record each. `summary` and `context` are the
   project's own reading of a work, written by its researchers, and the entry
   page says so. Paragraphs are separated by a blank line; *asterisks* mark
   titles to be set in italics. The citation is Chicago style and stays in one
   form in both languages, as a bibliographic record does.
   TODO: verify VI for every summary and context. */
export type Source = {
  slug: string;
  author: string;
  title: string;
  subtitle?: string;
  year: string;
  place: string;
  publisher: string;
  lang: "en" | "vi";
  kind: Bilingual;
  citation: string;
  summary: Bilingual;
  context: Bilingual;
};

export const sources: Source[] = [
  {
    slug: "berman-perfect-spy",
    author: "Larry Berman",
    title: "Perfect Spy",
    subtitle: "The Incredible Double Life of Pham Xuan An, Time Magazine Reporter and Vietnamese Communist Agent",
    year: "2007",
    place: "New York",
    publisher: "Smithsonian Books/Collins",
    lang: "en",
    kind: { en: "Biography", vi: "Tiểu sử" },
    citation:
      "Berman, Larry. *Perfect Spy: The Incredible Double Life of Pham Xuan An, Time Magazine Reporter and Vietnamese Communist Agent*. New York: Smithsonian Books/Collins, 2007.",
    summary: {
      en: "*Perfect Spy* is Larry Berman’s biography of Pham Xuan An, based on interviews with An in Ho Chi Minh City beginning in 2001, which grew into a warm, collaborative friendship. Berman pairs these conversations with research in U.S. government archives and personal papers, plus interviews with Vietnamese and Americans who knew An, including his former press colleagues. He traces An’s path from the Viet Minh, through journalism school in California, to Reuters and Time in Saigon, all while secretly reporting to Communist intelligence. Berman credits An with key roles at Ap Bac (1963) and in choosing Saigon targets for the 1968 Tet Offensive, and acknowledges this cost American and South Vietnamese lives. An died in 2006 as the two countries were growing closer, and Berman casts his affection for America as a symbol of U.S.–Vietnam reconciliation.",
      vi: "*Perfect Spy* là cuốn tiểu sử Phạm Xuân Ẩn của Larry Berman, dựa trên các cuộc phỏng vấn với ông Ẩn tại Thành phố Hồ Chí Minh bắt đầu từ năm 2001, về sau trở thành một tình bạn thân thiết và gắn bó cộng tác. Berman kết hợp những cuộc trò chuyện này với nghiên cứu trong các kho lưu trữ của chính phủ Mỹ và tư liệu cá nhân, cùng các cuộc phỏng vấn với những người Việt và người Mỹ từng quen biết ông Ẩn, trong đó có các đồng nghiệp báo chí cũ của ông. Tác giả lần theo con đường của ông Ẩn từ Việt Minh, qua trường báo chí ở California, đến Reuters và Time tại Sài Gòn, trong khi bí mật báo cáo cho tình báo cộng sản. Berman cho rằng ông Ẩn giữ vai trò then chốt trong trận Ấp Bắc (1963) và trong việc chọn các mục tiêu ở Sài Gòn cho cuộc Tổng tiến công Tết Mậu Thân 1968, và thừa nhận điều đó đã khiến nhiều người Mỹ và người miền Nam Việt Nam thiệt mạng. Ông Ẩn qua đời năm 2006, khi hai nước đang xích lại gần nhau, và Berman xem tình cảm của ông dành cho nước Mỹ như một biểu tượng của sự hòa giải Mỹ–Việt.",
    },
    context: {
      en: "Larry Berman is a political scientist and Vietnam War historian at the University of California Davis. Before *Perfect Spy*, he wrote three books on U.S. decision-making in Vietnam, including *No Peace, No Honor* (2001). He met An in 2001, and An came to regard him as his official American biographer. The book came out in 2007, months after An’s death, as U.S.–Vietnam ties were warming. Vietnam joined the World Trade Organization that year, and its president made the first White House visit since the war. The book was later translated into Vietnamese and became a bestseller there.",
      vi: "Larry Berman là nhà khoa học chính trị và sử gia về Chiến tranh Việt Nam tại Đại học California, Davis. Trước *Perfect Spy*, ông đã viết ba cuốn sách về quá trình ra quyết định của Mỹ tại Việt Nam, trong đó có *No Peace, No Honor* (2001). Ông gặp ông Ẩn năm 2001, và ông Ẩn dần xem ông là người viết tiểu sử chính thức người Mỹ của mình. Cuốn sách ra mắt năm 2007, vài tháng sau khi ông Ẩn qua đời, giữa lúc quan hệ Mỹ–Việt đang ấm lên. Cũng trong năm đó, Việt Nam gia nhập Tổ chức Thương mại Thế giới, và Chủ tịch nước Việt Nam có chuyến thăm Nhà Trắng đầu tiên kể từ sau chiến tranh. Cuốn sách sau đó được dịch sang tiếng Việt và trở thành sách bán chạy tại Việt Nam.",
    },
  },
  {
    slug: "bass-spy-who-loved-us",
    author: "Thomas A. Bass",
    title: "The Spy Who Loved Us",
    subtitle: "The Vietnam War and Pham Xuan An’s Dangerous Game",
    year: "2009",
    place: "New York",
    publisher: "PublicAffairs",
    lang: "en",
    kind: { en: "Book", vi: "Sách" },
    citation:
      "Bass, Thomas A. *The Spy Who Loved Us: The Vietnam War and Pham Xuan An’s Dangerous Game*. New York: PublicAffairs, 2009.",
    summary: {
      en: "The book follows Pham Xuan An from his childhood home in southern Vietnam and early work with the Viet Minh to his studies in California and his years as a Saigon correspondent for Reuters and *Time*, all while secretly passing information to Hanoi. Bass connects An to key moments in the war, such as the Battle of Ap Bac and the Tet Offensive, and describes how he helped South Vietnamese intelligence chief Tran Kim Tuyen escape in 1975. Later chapters are dedicated to postwar years, when the communist government kept An at a distance and monitored him. Bass’s central claim is that An’s loyalties were divided. He worked for the revolution but was also devoted to American journalism and his American colleagues, and at times he shielded the people he was supposed to be spying on. An is portrayed as someone who truly loved multiple sides, torn between allegiances to both.",
      vi: "Cuốn sách theo chân Phạm Xuân Ẩn từ ngôi nhà thời thơ ấu ở miền Nam Việt Nam và những công việc đầu tiên cho Việt Minh, đến thời gian học ở California và những năm làm phóng viên tại Sài Gòn cho Reuters và *Time*, trong khi bí mật chuyển thông tin về Hà Nội. Bass gắn ông Ẩn với những thời điểm then chốt của cuộc chiến, như trận Ấp Bắc và cuộc Tổng tiến công Tết Mậu Thân, và kể lại việc ông giúp người đứng đầu ngành tình báo miền Nam là Trần Kim Tuyến thoát đi năm 1975. Các chương sau dành cho những năm hậu chiến, khi chính quyền cộng sản giữ khoảng cách với ông Ẩn và theo dõi ông. Luận điểm trung tâm của Bass là lòng trung thành của ông Ẩn bị chia đôi. Ông làm việc cho cách mạng nhưng cũng gắn bó với nghề báo Mỹ và các đồng nghiệp người Mỹ, và có lúc che chở chính những người mà lẽ ra ông phải do thám. Ông Ẩn được khắc họa như một người thực lòng yêu mến nhiều phía, giằng xé giữa lòng trung thành với cả hai bên.",
    },
    context: {
      en: "Bass is an American writer who teaches at SUNY Albany and is a scholar of history and journalism. He has a personal relationship with An and interviewed him repeatedly until An died in 2006. As a result, much of the book draws on An’s own version of events. It expands on an article Bass published in *The New Yorker* in 2005 under the same title. Bass treats An with sympathy and presents him not as a straightforward double agent but as a man with complex allegiances.",
      vi: "Bass là một nhà văn người Mỹ, giảng dạy tại SUNY Albany và nghiên cứu về lịch sử và báo chí. Ông có quan hệ riêng với ông Ẩn và đã nhiều lần phỏng vấn ông cho đến khi ông Ẩn qua đời năm 2006. Vì vậy, phần lớn cuốn sách dựa trên cách chính ông Ẩn kể lại các sự kiện. Cuốn sách mở rộng từ bài viết cùng tên mà Bass đăng trên *The New Yorker* năm 2005. Bass viết về ông Ẩn với sự cảm thông, và trình bày ông không đơn thuần là một điệp viên hai mang mà là một con người với những lòng trung thành phức tạp.",
    },
  },
];
