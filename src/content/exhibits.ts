import type { Bilingual } from "@/contexts/LanguageContext";
import exhibitViz1 from "@/assets/exhibit-viz-1.jpg";
import exhibitViz2 from "@/assets/exhibit-viz-2.jpg";

export type Exhibit = {
  slug: string;
  title: Bilingual;
  dek: Bilingual;
  cover: string;
  body: Bilingual; // paragraphs separated by \n\n
  relatedInterviews?: string[];
};

/* Both exhibits are unpublished drafts. The bodies below are working text, not
   final copy, and the specifics in them have not been checked against a source.
   TODO before publishing either one: verify every factual claim, have the VI
   reviewed, and set `relatedInterviews` to real slugs from interviews.ts. */
export const exhibits: Exhibit[] = [
  {
    slug: "the-double-life",
    title: { en: "Coming soon", vi: "Sắp ra mắt" },
    dek: {
      en: "Exhibit coming soon.",
      vi: "Triển lãm sắp ra mắt.",
    },
    cover: exhibitViz1,
    body: {
      en: "For nearly two decades Phạm Xuân Ẩn filed for the American press in Saigon and reported to Hanoi at the same time. This exhibit sets his colleagues' recollections alongside the documentary record and his own account, given late in his life.\n\nAn maintained to the end that he had betrayed no one. The interviews gathered here let visitors weigh that claim against what the people around him say.",
      vi: "Trong gần hai thập kỷ, Phạm Xuân Ẩn vừa viết bài cho báo chí Mỹ tại Sài Gòn vừa báo cáo về Hà Nội. Triển lãm này đặt ký ức của các đồng nghiệp bên cạnh tư liệu lưu trữ và lời kể của chính ông những năm cuối đời.\n\nÔng Ẩn khẳng định đến cuối đời rằng mình không phản bội ai. Các cuộc phỏng vấn tập hợp tại đây để người xem tự đối chiếu lời khẳng định ấy với những gì người quanh ông kể lại.",
    },
  },
  {
    slug: "time-magazine-years",
    title: { en: "Coming soon", vi: "Sắp ra mắt" },
    dek: {
      en: "Exhibit coming soon.",
      vi: "Triển lãm sắp ra mắt.",
    },
    cover: exhibitViz2,
    body: {
      en: "Time hired An in 1965, and for the next decade he was the magazine's only Vietnamese staff correspondent. This exhibit reconstructs how the Saigon bureau worked day to day, and how its reporting reached American readers.",
      vi: "Time tuyển ông Ẩn năm 1965, và trong một thập kỷ sau đó ông là phóng viên chính thức người Việt duy nhất của tạp chí. Triển lãm này tái dựng cách văn phòng Sài Gòn vận hành hằng ngày, và cách những bài viết từ đó đến với độc giả Mỹ.",
    },
  },
];
