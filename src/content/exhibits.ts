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
  /** False while the exhibit is in preparation: the site shows its working
      title and description, never the draft body. */
  published: boolean;
};

/* Both exhibits are unpublished drafts. The bodies below are working text, not
   final copy, and the specifics in them have not been checked against a source.
   TODO before publishing either one: verify every factual claim, have the VI
   reviewed, and set `relatedInterviews` to real slugs from interviews.ts. */
export const exhibits: Exhibit[] = [
  {
    slug: "the-double-life",
    title: { en: "Mapping a divided career", vi: "Bản đồ một sự nghiệp bị chia đôi" },
    dek: {
      en: "A data visualization of where Ẩn filed from and when, set against what he was sending to Hanoi in the same years.",
      // TODO: verify VI
      vi: "Một trực quan hóa dữ liệu về nơi và thời điểm ông Ẩn gửi bài, đối chiếu với những gì ông chuyển về Hà Nội trong cùng những năm đó.",
    },
    published: false,
    cover: exhibitViz1,
    body: {
      en: "For nearly two decades Phạm Xuân Ẩn filed for the American press in Saigon and reported to Hanoi at the same time. This exhibit sets his colleagues' recollections alongside the documentary record and his own account, given late in his life.\n\nAn maintained to the end that he had betrayed no one. The interviews gathered here let visitors weigh that claim against what the people around him say.",
      vi: "Trong gần hai thập kỷ, Phạm Xuân Ẩn vừa viết bài cho báo chí Mỹ tại Sài Gòn vừa báo cáo về Hà Nội. Triển lãm này đặt ký ức của các đồng nghiệp bên cạnh tư liệu lưu trữ và lời kể của chính ông những năm cuối đời.\n\nÔng Ẩn khẳng định đến cuối đời rằng mình không phản bội ai. Các cuộc phỏng vấn tập hợp tại đây để người xem tự đối chiếu lời khẳng định ấy với những gì người quanh ông kể lại.",
    },
  },
  {
    slug: "time-magazine-years",
    title: { en: "Inside the Saigon bureau", vi: "Bên trong văn phòng Sài Gòn" },
    dek: {
      en: "An essay on how Time's Saigon bureau worked between 1965 and 1975, and how its reporting reached readers in the United States.",
      // TODO: verify VI
      vi: "Một tiểu luận về cách văn phòng Time tại Sài Gòn vận hành giai đoạn 1965–1975, và cách những bài viết từ đó đến với độc giả Hoa Kỳ.",
    },
    published: false,
    cover: exhibitViz2,
    body: {
      en: "Time hired An in 1965, and for the next decade he was the magazine's only Vietnamese staff correspondent. This exhibit reconstructs how the Saigon bureau worked day to day, and how its reporting reached American readers.",
      vi: "Time tuyển ông Ẩn năm 1965, và trong một thập kỷ sau đó ông là phóng viên chính thức người Việt duy nhất của tạp chí. Triển lãm này tái dựng cách văn phòng Sài Gòn vận hành hằng ngày, và cách những bài viết từ đó đến với độc giả Mỹ.",
    },
  },
];
