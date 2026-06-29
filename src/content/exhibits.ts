import type { Bilingual } from "@/contexts/LanguageContext";
import exhibitViz1 from "@/assets/exhibit-viz-1.jpg";
import exhibitViz2 from "@/assets/exhibit-viz-2.jpg";

export type Exhibit = {
  slug: string;
  title: Bilingual;
  dek: Bilingual;
  cover: string;
  body: Bilingual; // paragraphs separated by \n\n
  pullQuote?: Bilingual;
  relatedInterviews?: string[];
};

export const exhibits: Exhibit[] = [
  {
    slug: "the-double-life",
    title: { en: "Coming soon", vi: "Sắp ra mắt" },
    dek: {
      en: "Exhibit coming soon",
      vi: "Triển lãm sắp ra mắt",
    },
    cover: exhibitViz1,
    body: {
      en: "For nearly two decades, Pham Xuan An lived a life that should not have been possible. By day he filed dispatches from the Continental Hotel terrace; by night he encoded reports for Hanoi. This exhibit assembles colleagues' recollections, declassified material, and An's own carefully chosen words.\n\nWhat emerges is not a portrait of duplicity but of a man who insisted, until the end of his life, that he had betrayed no one. The interviews gathered here let visitors weigh that claim for themselves.",
      vi: "Trong gần hai thập kỷ, Phạm Xuân Ẩn sống một cuộc đời tưởng chừng không thể. Ban ngày ông gửi bản tin từ sân thượng khách sạn Continental; ban đêm ông mã hóa báo cáo gửi về Hà Nội. Triển lãm này tập hợp ký ức của đồng nghiệp, tư liệu giải mật và những lời nói được lựa chọn cẩn trọng của chính ông.\n\nNhững gì hiện ra không phải là chân dung của sự phản bội mà là của một người, đến cuối đời, vẫn khẳng định rằng ông không phản bội ai. Các cuộc phỏng vấn ở đây để người xem tự đánh giá lời khẳng định ấy.",
    },
    pullQuote: {
      en: "\"He was the best journalist among us. The fact that he was also something else does not change that.\"",
      vi: "\"Ông là nhà báo giỏi nhất trong số chúng tôi. Việc ông còn là một điều gì khác không thay đổi điều đó.\"",
    },
    relatedInterviews: ["robert-shaplen-recollection", "nguyen-thi-thu-an"],
  },
  {
    slug: "time-magazine-years",
    title: { en: "Coming soon", vi: "Sắp ra mắt" },
    dek: {
      en: "Exhibit coming soon",
      vi: "Bên trong văn phòng Sài Gòn, 1965–1975: nếp làm việc, sự cạnh tranh và bài báo đã định hình cách nước Mỹ nhìn cuộc chiến.",
    },
    cover: exhibitViz2,
    body: {
      en: "An was hired by Time in 1965 and remained the magazine's only Vietnamese staff correspondent for the next decade. This exhibit reconstructs the daily life of the bureau — the coffee at Givral, the wire copy filed by teletype, the Sunday morning analyses that shaped how Henry Luce's magazine framed the war for millions of American readers.",
      vi: "Ông Ẩn được Time tuyển dụng năm 1965 và trong suốt một thập kỷ sau đó là phóng viên Việt Nam duy nhất của tạp chí. Triển lãm này tái dựng đời sống hằng ngày của văn phòng — cà phê tại Givral, bản tin gửi bằng teletype, các phân tích sáng Chủ nhật đã định hình cách tạp chí của Henry Luce trình bày cuộc chiến cho hàng triệu độc giả Mỹ.",
    },
    relatedInterviews: ["robert-shaplen-recollection"],
  },
];