import type { Bilingual } from "@/contexts/LanguageContext";

export const bioIntro: Bilingual = {
  en: "During the Vietnam War, Pham Xuan An (1927–2006) worked as a journalist for US and international news agencies in South Vietnam, including Reuters and Time magazine. After the war ended in 1975, An’s friends and colleagues were stunned to learn that he had been spying for North Vietnam throughout the conflict.",
  vi: "Trong Chiến tranh Việt Nam, Phạm Xuân Ẩn (1927–2006) làm việc với vai trò nhà báo cho các hãng tin Mỹ và quốc tế tại miền Nam Việt Nam, bao gồm Reuters và tạp chí TIME. Sau khi chiến tranh kết thúc vào năm 1975, bạn bè và đồng nghiệp của ông đã vô cùng kinh ngạc khi biết rằng ông là một nhà tình báo của miền Bắc trong suốt cuộc xung đột.",
};

export const bioBody: Bilingual = {
  en: "Born in Bien Hoa in 1927, An was educated in French colonial schools before traveling to California in the 1950s to study journalism at Orange Coast College, a rare path for a Vietnamese student of his generation. He returned to Saigon and built a career covering the war for Reuters, the New York Herald Tribune, and finally Time, where he became the only Vietnamese staff correspondent on the magazine's masthead.\n\nWhat his colleagues did not know was that An was also Hai Trung, an intelligence officer whose dispatches helped shape decisions in Hanoi from the early 1960s through the fall of Saigon in 1975. After the war he remained in Vietnam and gave a small number of interviews to Western historians, including the ones in this archive.",
  vi: "Sinh tại Biên Hòa năm 1927, ông Ẩn học tại các trường thuộc địa Pháp trước khi sang California vào những năm 1950 để học báo chí tại Orange Coast College, một con đường hiếm hoi đối với sinh viên Việt Nam thời ấy. Ông trở về Sài Gòn và xây dựng sự nghiệp đưa tin về chiến tranh cho Reuters, New York Herald Tribune, và cuối cùng là Time, nơi ông trở thành phóng viên Việt Nam duy nhất trong danh sách biên tập của tạp chí.\n\nĐiều mà các đồng nghiệp của ông không biết là ông còn là Hai Trung, một sĩ quan tình báo có những bản tin đã góp phần định hình quyết định tại Hà Nội từ đầu những năm 1960 đến khi Sài Gòn sụp đổ năm 1975. Sau chiến tranh, ông ở lại Việt Nam và trả lời một số ít cuộc phỏng vấn với các nhà sử học phương Tây, trong đó có những cuộc phỏng vấn trong kho lưu trữ này.",
};

/* Birth and death, shown under the page title. */
export const lifeDates: { label: Bilingual; value: Bilingual }[] = [
  {
    label: { en: "Born", vi: "Sinh" },
    value: { en: "12 September 1927, Bien Hoa, French Indochina", vi: "Ngày 12 tháng 9 năm 1927, Biên Hòa, Đông Dương thuộc Pháp" },
  },
  {
    label: { en: "Died", vi: "Mất" },
    value: { en: "20 September 2006, Ho Chi Minh City", vi: "Ngày 20 tháng 9 năm 2006, Thành phố Hồ Chí Minh" },
  },
];

/* ---------------------------------------------------------------------------
   The double record.

   1953–1976 read as a single chronology with two sides: the career his
   colleagues in the Saigon press corps could see, and the one running underneath
   it. Every year belongs to one side or the other, except 1975, which is the
   only row with an entry on both — the pivot, and the reason the layout is a
   spine rather than two lists. TODO: have the VI strings reviewed.
--------------------------------------------------------------------------- */
export type RecordYear = {
  year: string;
  /** What the press corps knew at the time. */
  seen?: Bilingual;
  /** What was happening at the same time, and was not known until later. */
  also?: Bilingual;
};

export const recordHeads = {
  seen: { en: "What his colleagues saw", vi: "Điều các đồng nghiệp nhìn thấy" },
  also: { en: "What was also true", vi: "Điều cũng là sự thật" },
} satisfies Record<"seen" | "also", Bilingual>;

export const doubleRecord: RecordYear[] = [
  {
    year: "1953",
    also: {
      en: "Joins the Việt Minh, and is later recruited into strategic intelligence.",
      vi: "Gia nhập Việt Minh, sau đó được tuyển vào ngành tình báo chiến lược.",
    },
  },
  {
    year: "1957",
    seen: {
      en: "Sails to California to study journalism at Orange Coast College.",
      vi: "Sang California học báo chí tại Orange Coast College.",
    },
  },
  {
    year: "1959",
    seen: {
      en: "Returns to Saigon and begins filing for Reuters.",
      vi: "Trở về Sài Gòn và bắt đầu viết bài cho Reuters.",
    },
  },
  {
    year: "1960s",
    also: {
      en: "Begins sending intelligence north to Hanoi under the name Hai Trung.",
      vi: "Bắt đầu gửi tin tình báo ra Hà Nội dưới bí danh Hai Trung.",
    },
  },
  {
    year: "1965",
    seen: {
      en: "Hired by Time, the magazine's only Vietnamese staff correspondent.",
      vi: "Được Time tuyển dụng, phóng viên chính thức người Việt duy nhất của tạp chí.",
    },
  },
  {
    year: "1975",
    seen: {
      en: "Covers the fall of Saigon for Time.",
      vi: "Đưa tin về sự kiện 30 tháng 4 cho Time.",
    },
    also: {
      en: "Stays behind when the American correspondents fly out.",
      vi: "Ở lại khi các phóng viên Mỹ rời đi.",
    },
  },
  {
    year: "1976",
    also: {
      en: "Publicly named a colonel in the People's Army of Vietnam.",
      vi: "Được công khai phong hàm Đại tá Quân đội Nhân dân Việt Nam.",
    },
  },
];
