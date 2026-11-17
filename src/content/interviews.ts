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
  date: string; // ISO, or a bare year when only the year is known
  /** Shown instead of a formatted `date` when the date is uncertain/approximate. */
  dateDisplay?: string;
  duration: string; // hh:mm:ss, or "—" when the OHMS record carries no duration
  originalLanguage: "en" | "vi" | "fr";
  summary: Bilingual;
  audio: string; // direct media URL (also used by the fallback <audio> player)
  transcript: TranscriptSegment[];
  /** Hosted OHMS Viewer URL (…/viewer.php?cachefile=<file>.xml or an Aviary embed).
   *  Wins over `ohmsXml` when both are set. */
  ohmsUrl?: string;
  /** OHMS XML export served by this site, e.g. "/ohms/interview36980.xml".
   *  The native in-browser player renders it — the XML alone is sufficient. */
  ohmsXml?: string;
};

/* Records generated from the project's OHMS 6.0 exports (collection "Pham Xuan An",
   repository "Dartmouth DDHI"), which live in `public/ohms/`. Notes:
   - These exports are INDEX-ONLY: they carry index segments (title, synopsis,
     keywords, subjects, partial transcript) but no full <transcript> and no <sync>,
     so the player shows a browsable index rather than a following transcript.
   - `audio` points at the same public https media the XML references.
   - Summaries are derived from the indexed segment titles.
     TODO: replace with curated bilingual summaries; VI copy needs review.
   - Berman 1a/1b have no index segments published yet (audio only).
   - Miller, McMorris 1/2 and Cloud carry <duration>00:00:00</duration> in their
     OHMS exports. Their `duration` below was read from the media files' own
     headers instead (MP3 frame/Xing headers, MP4 `mvhd`), a method verified
     against the Morrow records, where it reproduces the OHMS values exactly.
   - Swanson is the one disagreement: OHMS says 01:52:46, the published media runs
     01:58:41. OHMS's value is kept here pending a check of which cut is current. */
export const interviews: Interview[] = [
  {
    slug: "miller-pham-xuan-an",
    title: { en: "Miller Interview with Pham Xuan An", vi: "Phỏng vấn của Miller với Phạm Xuân Ẩn" },
    interviewee: "Pham Xuan An",
    interviewer: "Edward G. Miller",
    date: "2005-01-11",
    duration: "01:28:47",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Pham Xuan An, conducted by Edward G. Miller. Topics include The Rivalry Between Ngô Đình Nhu and Ngô Đình Cẩn, Labor Unions and Dr. Trần Kim Tuyến's Role in 1950s South Vietnamese Politics.",
      vi: "Phỏng vấn lịch sử truyền miệng với Phạm Xuân Ẩn, do Edward G. Miller thực hiện. Gồm 10 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/pham_xuan_an/miller_interview/Miller.mp3",
    transcript: [],
    ohmsXml: "/ohms/interview36980.xml",
  },
  {
    slug: "mcmorris-pham-xuan-an-1",
    title: { en: "McMorris Interview with Pham Xuan An (Part 1)", vi: "Phỏng vấn của McMorris với Phạm Xuân Ẩn (Phần 1)" },
    interviewee: "Pham Xuan An",
    interviewer: "Sean McMorris",
    date: "2005",
    dateDisplay: "2005 (date uncertain)",
    duration: "01:02:36",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Pham Xuan An, conducted by Sean McMorris. Topics include Greetings and Light Conversations, American Ideology, Foreign Intervention, and Vietnamese Resistance in early Vietnam War and The Vietnam War v.s. Previous 20th Century Conflicts.",
      vi: "Phỏng vấn lịch sử truyền miệng với Phạm Xuân Ẩn, do Sean McMorris thực hiện. Gồm 8 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/pham_xuan_an/mcmorris_interviews/mcmorris_1of2.mp4",
    transcript: [],
    ohmsXml: "/ohms/interview36981.xml",
  },
  {
    slug: "mcmorris-pham-xuan-an-2",
    title: { en: "McMorris Interview with Pham Xuan An (Part 2)", vi: "Phỏng vấn của McMorris với Phạm Xuân Ẩn (Phần 2)" },
    interviewee: "Pham Xuan An",
    interviewer: "Sean McMorris",
    date: "2005",
    dateDisplay: "2005 (date uncertain)",
    duration: "00:55:48",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Pham Xuan An, conducted by Sean McMorris. Topics include Start of discussion, literature and general reflections on the war, Pause in Interview, Visuals of books and American Lessons Learned about the War/ What was the war about?.",
      vi: "Phỏng vấn lịch sử truyền miệng với Phạm Xuân Ẩn, do Sean McMorris thực hiện. Gồm 11 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/pham_xuan_an/mcmorris_interviews/mcmorris_2of2.mp4",
    transcript: [],
    ohmsXml: "/ohms/interview36982.xml",
  },
  {
    slug: "berman-pham-xuan-an-1a",
    title: { en: "Oral History Interview with Pham Xuan An (Berman 1a)", vi: "Phỏng vấn lịch sử truyền miệng với Phạm Xuân Ẩn (Berman 1a)" },
    interviewee: "Pham Xuan An",
    interviewer: "Larry Berman",
    date: "2005-08-09",
    duration: "01:37:01",
    originalLanguage: "en",
    summary: {
      en: "Oral history interview with Pham Xuan An, conducted by Larry Berman. Audio only; no index has been published for this recording yet.",
      vi: "Phỏng vấn lịch sử truyền miệng với Phạm Xuân Ẩn, do Larry Berman thực hiện. Chỉ có âm thanh; chưa có chỉ mục cho bản ghi này.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/1237au4106a.wav",
    transcript: [],
    ohmsXml: "/ohms/interview41608.xml",
  },
  {
    slug: "berman-pham-xuan-an-1b",
    title: { en: "Oral History Interview with Pham Xuan An (Berman 1b)", vi: "Phỏng vấn lịch sử truyền miệng với Phạm Xuân Ẩn (Berman 1b)" },
    interviewee: "Pham Xuan An",
    interviewer: "Larry Berman",
    date: "2005-08-09",
    duration: "04:51:30",
    originalLanguage: "en",
    summary: {
      en: "Oral history interview with Pham Xuan An, conducted by Larry Berman. Audio only; no index has been published for this recording yet.",
      vi: "Phỏng vấn lịch sử truyền miệng với Phạm Xuân Ẩn, do Larry Berman thực hiện. Chỉ có âm thanh; chưa có chỉ mục cho bản ghi này.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/1237au4106b.wav",
    transcript: [],
    ohmsXml: "/ohms/interview41609.xml",
  },
  {
    slug: "morrow-michael-1",
    title: { en: "Oral History Interview with Mike Morrow (part 1)", vi: "Phỏng vấn lịch sử truyền miệng với Mike Morrow (phần 1)" },
    interviewee: "Michael Morrow",
    interviewer: "Joanna Jou",
    date: "2025-10-28",
    duration: "01:09:34",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Michael Morrow, conducted by Joanna Jou. Topics include Introduction, Family History and Childhood and Time at the Seattle World's Fair and First Exposure to Dartmouth.",
      vi: "Phỏng vấn lịch sử truyền miệng với Michael Morrow, do Joanna Jou thực hiện. Gồm 13 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/morrow_michael/morrow_michael1of4.m4a",
    transcript: [],
    ohmsXml: "/ohms/interview41646.xml",
  },
  {
    slug: "morrow-michael-2",
    title: { en: "Oral History Interview with Mike Morrow (part 2)", vi: "Phỏng vấn lịch sử truyền miệng với Mike Morrow (phần 2)" },
    interviewee: "Michael Morrow",
    interviewer: "Joanna Jou",
    date: "2025-12-04",
    duration: "02:31:49",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Michael Morrow, conducted by Joanna Jou. Topics include Arrival in Vietnam, Life in Cholon and Encounter with Violence and Experience at the Mekong Delta Base.",
      vi: "Phỏng vấn lịch sử truyền miệng với Michael Morrow, do Joanna Jou thực hiện. Gồm 10 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/morrow_michael/morrow_michael2of4.m4a",
    transcript: [],
    ohmsXml: "/ohms/interview42105.xml",
  },
  {
    slug: "morrow-michael-3",
    title: { en: "Oral History Interview with Mike Morrow (part 3)", vi: "Phỏng vấn lịch sử truyền miệng với Mike Morrow (phần 3)" },
    interviewee: "Michael Morrow",
    interviewer: "Joanna Jou",
    date: "2025-12-20",
    duration: "01:52:58",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Michael Morrow, conducted by Joanna Jou. Topics include Decision to Report Highway 1, Massacre on Highway 1 and Capture and Identification as High-Value Prisoners and Transfer to Khmer Guards.",
      vi: "Phỏng vấn lịch sử truyền miệng với Michael Morrow, do Joanna Jou thực hiện. Gồm 7 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/morrow_michael/morrow_michael3of4.m4a",
    transcript: [],
    ohmsXml: "/ohms/interview42197.xml",
  },
  {
    slug: "morrow-michael-4",
    title: { en: "Oral History Interview with Mike Morrow (part 4)", vi: "Phỏng vấn lịch sử truyền miệng với Mike Morrow (phần 4)" },
    interviewee: "Michael Morrow",
    interviewer: "Joanna Jou",
    date: "2026-12-30",
    duration: "03:58:11",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Michael Morrow, conducted by Joanna Jou. Topics include Dartmouth Mentorship and Returning from Cambodian Captivity, Laos as a Neutral State and Hidden Theater of War and Intellectual Curiosity and Southeast Asia as an Unformed Field.",
      vi: "Phỏng vấn lịch sử truyền miệng với Michael Morrow, do Joanna Jou thực hiện. Gồm 20 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/morrow_michael/morrow_michael4of4.mp3",
    transcript: [],
    ohmsXml: "/ohms/interview42211.xml",
  },
  {
    slug: "swanson-germaine",
    title: { en: "Oral History Interview with Germaine Swanson", vi: "Phỏng vấn lịch sử truyền miệng với Germaine Swanson" },
    interviewee: "Germaine Swanson",
    interviewer: "Jack Zipper",
    date: "2026-01-18",
    duration: "01:52:46",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Germaine Swanson, conducted by Jack Zipper. Topics include Introduction and Early Life, Japanese Occupation and Joining the army / nursing.",
      vi: "Phỏng vấn lịch sử truyền miệng với Germaine Swanson, do Jack Zipper thực hiện. Gồm 17 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/swanson_germaine/swanson_germaine.mp3",
    transcript: [],
    ohmsXml: "/ohms/interview42374.xml",
  },
  {
    slug: "cloud-stanley",
    title: { en: "Oral History Interview with Stanley Cloud", vi: "Phỏng vấn lịch sử truyền miệng với Stanley Cloud" },
    interviewee: "Stanley Cloud",
    interviewer: "Jack Zipper",
    date: "2026-04-04",
    duration: "01:34:56",
    originalLanguage: "en",
    summary: {
      en: "Indexed oral history interview with Stanley Cloud, conducted by Jack Zipper. Topics include Introduction, Early Life and Military Service and Early Journalism and Tenure at Time San Francisco.",
      vi: "Phỏng vấn lịch sử truyền miệng với Stanley Cloud, do Jack Zipper thực hiện. Gồm 17 đoạn được lập chỉ mục.",
    },
    audio: "https://rcweb.dartmouth.edu/DDHI/pham_xuan_an/cloud_stanley/cloud_stanley_edited.mp3",
    transcript: [],
    ohmsXml: "/ohms/interview42707.xml",
  },
];

/* One entry per voice in the archive, in catalogue order. Ẩn's own recordings
   are split by who interviewed him — three separate projects, years apart in
   method if not in date — and everyone else is grouped under their own name.
   `name` is therefore the person who is not Ẩn in either case. */
export type Voice = {
  name: string;
  /** True when the recordings are of Ẩn himself. */
  withAn: boolean;
  recordings: Interview[];
};

export const voices: Voice[] = interviews.reduce<Voice[]>((acc, iv) => {
  const withAn = iv.interviewee === "Pham Xuan An";
  const name = withAn ? iv.interviewer : iv.interviewee;
  const found = acc.find((v) => v.name === name);
  if (found) found.recordings.push(iv);
  else acc.push({ name, withAn, recordings: [iv] });
  return acc;
}, []);

/* What each voice is to Ẩn, and where to start listening. Keyed by
   `Voice.name`. The homepage reads `subject` and `start`.

   `relation` is not rendered at the moment. It is kept on purpose: it is the
   project's sourced record of who each person was to Ẩn; drop it only once the
   project decides that record is not wanted on the site.

   `relation` is drawn from the OHMS index of the voice's own recordings where
   they say it (Morrow, Swanson, Cloud), and from the interviewer's published
   work otherwise. Every line is a fact about a real person and should be read
   by the project before launch. TODO: verify each relation against the
   project's own records.

   `subject` is one broad line on what the recordings cover as a whole, read
   from the full OHMS index (Berman's publish none, so his line says only what
   is known of them). It leads each voice on the homepage, ahead of the
   speaker. TODO: have the project check each line.

   `start` points at the first indexed passage in which Ẩn comes up, so a tile
   opens on him rather than on the narrator's childhood. A voice without one
   starts at the beginning of its first recording: Ẩn's own interviews are
   about him from the first minute, and Berman's publish no index. */
export const voiceNotes: Record<string, { relation: Bilingual; subject: Bilingual; start?: { slug: string; time: number } }> = {
  "Larry Berman": {
    subject: {
      en: "Long conversations with Ẩn, recorded while Berman was writing his biography of him.",
      // TODO: verify VI
      vi: "Những cuộc trò chuyện dài với ông Ẩn, được ghi khi Berman đang viết cuốn tiểu sử về ông.",
    },
    relation: {
      en: "Historian, author of the biography Perfect Spy. Interviewed Ẩn.",
      // TODO: verify VI
      vi: "Nhà sử học, tác giả cuốn tiểu sử Perfect Spy. Đã phỏng vấn ông Ẩn.",
    },
  },
  "Stanley Cloud": {
    subject: {
      en: "A Time bureau chief remembers working with Ẩn in Saigon, and hearing after the war that he had been a spy.",
      // TODO: verify VI
      vi: "Một trưởng văn phòng của Time nhớ lại thời làm việc cùng ông Ẩn ở Sài Gòn, và lúc biết tin sau chiến tranh rằng ông là một điệp viên.",
    },
    relation: {
      en: "Time correspondent and bureau chief who worked alongside Ẩn in Saigon.",
      // TODO: verify VI
      vi: "Phóng viên và trưởng văn phòng của Time, từng làm việc cùng ông Ẩn tại Sài Gòn.",
    },
    start: { slug: "cloud-stanley", time: 1576 },
  },
  "Sean McMorris": {
    subject: {
      en: "Ẩn reflects on the war, American foreign policy, and Vietnam since 1975.",
      // TODO: verify VI
      vi: "Ông Ẩn suy ngẫm về cuộc chiến, chính sách đối ngoại của Mỹ, và Việt Nam từ sau năm 1975.",
    },
    relation: {
      en: "Filmed a series of interviews with Ẩn.",
      // TODO: verify VI
      vi: "Đã quay phim một loạt cuộc phỏng vấn với ông Ẩn.",
    },
  },
  "Edward G. Miller": {
    subject: {
      en: "Ẩn on the Ngô family and South Vietnamese politics in the 1950s and early 1960s.",
      // TODO: verify VI
      vi: "Ông Ẩn nói về gia đình họ Ngô và chính trường miền Nam Việt Nam trong thập niên 1950 và đầu thập niên 1960.",
    },
    relation: {
      en: "Historian of South Vietnam. Interviewed Ẩn.",
      // TODO: verify VI
      vi: "Nhà sử học về miền Nam Việt Nam. Đã phỏng vấn ông Ẩn.",
    },
  },
  "Michael Morrow": {
    subject: {
      en: "A reporter's life across Asia, including his capture in Cambodia and the part he believes Ẩn played in his release.",
      // TODO: verify VI
      vi: "Cuộc đời một phóng viên khắp châu Á, trong đó có lần ông bị bắt ở Campuchia và vai trò mà ông tin rằng ông Ẩn đã có trong việc ông được thả.",
    },
    relation: {
      en: "Journalist held captive in Cambodia, who links his release to Ẩn.",
      // TODO: verify VI
      vi: "Nhà báo từng bị giam giữ ở Campuchia, người cho rằng việc mình được thả có liên quan đến ông Ẩn.",
    },
    start: { slug: "morrow-michael-3", time: 4009 },
  },
  "Germaine Swanson": {
    subject: {
      en: "A Reuters colleague and friend on working beside Ẩn, and on the years after the war.",
      // TODO: verify VI
      vi: "Một đồng nghiệp ở Reuters, cũng là bạn của ông Ẩn, kể về thời làm việc bên cạnh ông và về những năm sau chiến tranh.",
    },
    relation: {
      en: "Colleague of Ẩn's at Reuters, and a friend after the war.",
      // TODO: verify VI
      vi: "Đồng nghiệp của ông Ẩn tại Reuters, và là bạn của ông sau chiến tranh.",
    },
    start: { slug: "swanson-germaine", time: 1459 },
  },
};
