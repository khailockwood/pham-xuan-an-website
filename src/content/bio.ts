import type { Bilingual } from "@/contexts/LanguageContext";

export const bioIntro: Bilingual = {
  en: "During the Vietnam War, Pham Xuan An (1927-2006) worked as a journalist for US and international news agencies in South Vietnam, including Reuters and TIME magazine. After the war ended in 1975, An’s friends and colleagues were stunned to learn that he had been spying for North Vietnam throughout the conflict.",
  vi: "Trong Chiến tranh Việt Nam, Phạm Xuân Ẩn (1927-2006) làm việc với vai trò nhà báo cho các hãng tin Mỹ và quốc tế tại miền Nam Việt Nam, bao gồm Reuters và tạp chí TIME. Sau khi chiến tranh kết thúc vào năm 1975, bạn bè và đồng nghiệp của ông đã vô cùng kinh ngạc khi biết rằng ông là một nhà tình báo của miền Bắc trong suốt cuộc xung đột.",
};

export const bioBody: Bilingual = {
  en: "Born in Bien Hoa in 1927, An was educated in French colonial schools before traveling to California in the 1950s to study journalism at Orange Coast College — a rare path for a Vietnamese student of his generation. He returned to Saigon and built a career covering the war for Reuters, the New York Herald Tribune, and finally Time, where he became the only Vietnamese staff correspondent on the magazine's masthead.\n\nWhat his colleagues did not know was that An was also Hai Trung, an intelligence officer whose dispatches helped shape decisions in Hanoi from the early 1960s through the fall of Saigon in 1975. After the war he remained in Vietnam, gave careful interviews to Western historians, and lived in a city that was now both his home and the subject of his life's work.",
  vi: "Sinh tại Biên Hòa năm 1927, ông Ẩn học tại các trường thuộc địa Pháp trước khi sang California vào những năm 1950 để học báo chí tại Orange Coast College — một con đường hiếm hoi đối với sinh viên Việt Nam thời ấy. Ông trở về Sài Gòn và xây dựng sự nghiệp đưa tin về chiến tranh cho Reuters, New York Herald Tribune, và cuối cùng là Time, nơi ông trở thành phóng viên Việt Nam duy nhất trong danh sách biên tập của tạp chí.\n\nĐiều mà các đồng nghiệp của ông không biết là ông còn là Hai Trung, một sĩ quan tình báo có những bản tin đã góp phần định hình quyết định tại Hà Nội từ đầu những năm 1960 đến khi Sài Gòn sụp đổ năm 1975. Sau chiến tranh, ông ở lại Việt Nam, trả lời cẩn trọng các nhà sử học phương Tây, và sống trong một thành phố vừa là nhà vừa là chủ đề công việc cả đời ông.",
};

export const timeline: { year: string; event: Bilingual }[] = [
  { year: "1927", event: { en: "Born September 12 in Bien Hoa, French Indochina.", vi: "Sinh ngày 12 tháng 9 tại Biên Hòa, Đông Dương thuộc Pháp." } },
  { year: "1953", event: { en: "Joins the Viet Minh; later recruited into strategic intelligence.", vi: "Gia nhập Việt Minh; sau được tuyển vào tình báo chiến lược." } },
  { year: "1957", event: { en: "Travels to California to study journalism at Orange Coast College.", vi: "Sang California học báo chí tại Orange Coast College." } },
  { year: "1959", event: { en: "Returns to Saigon and begins reporting for Reuters.", vi: "Trở về Sài Gòn và bắt đầu làm phóng viên cho Reuters." } },
  { year: "1965", event: { en: "Hired by Time magazine as a Saigon correspondent.", vi: "Được Time tuyển làm phóng viên tại Sài Gòn." } },
  { year: "1975", event: { en: "Reports on the fall of Saigon for Time; remains in Vietnam.", vi: "Đưa tin về sự kiện 30 tháng 4 cho Time; tiếp tục ở lại Việt Nam." } },
  { year: "1976", event: { en: "Publicly recognized as Colonel, People's Army of Vietnam.", vi: "Được công nhận là Đại tá Quân đội Nhân dân Việt Nam." } },
  { year: "2006", event: { en: "Dies in Ho Chi Minh City on September 20.", vi: "Qua đời tại Thành phố Hồ Chí Minh ngày 20 tháng 9." } },
];