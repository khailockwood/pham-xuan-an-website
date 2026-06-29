import { Link } from "react-router-dom";
import { ArrowRight, AudioLines, ImageIcon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteName, ui } from "@/content/site";
import { bioIntro } from "@/content/bio";
import { mission } from "@/content/project";
import { interviews } from "@/content/interviews";
import { exhibits } from "@/content/exhibits";
import heroImg from "@/assets/pxa-hero.webp";
import heroSample1 from "@/assets/hero-sample-1.jpg";
import heroSample2 from "@/assets/hero-sample-2.jpg";
import interviewPxaImg from "@/assets/interview-pxa.jpg";
import interviewNguyenImg from "@/assets/interview-nguyen.jpg";
import ddhiLogo from "@/assets/ddhi-logo.svg";
import fulbrightLogo from "@/assets/fulbright-logo.png";
import ttuLogo from "@/assets/ttu-logo.svg";

const Index = () => {
  const { t } = useLanguage();
  const featured = interviews[0];
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }));
  const heroSlides = [
    { src: heroImg, alt: "Pham Xuan An in Saigon" },
    { src: heroSample1, alt: "AI generated sample image" },
    { src: heroSample2, alt: "AI generated sample image" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="w-full bg-primary text-white">
          <div className="container py-12 md:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
                <div className="uppercase tracking-[0.25em] text-accent whitespace-pre-line text-sm font-bold">
                  {t({
                    en: "DARTMOUTH DIGITAL HISTORY INITIATIVE\nFULBRIGHT UNIVERSITY VIETNAM STUDIES CENTER",
                    vi: "SÁNG KIẾN LỊCH SỬ SỐ DARTMOUTH\nTRUNG TÂM NGHIÊN CỨU VIỆT NAM ĐẠI HỌC FULBRIGHT",
                  })}
                </div>
                <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">
                  {t(siteName)}
                </h1>
                <p className="text-lg leading-relaxed font-sans md:text-base text-white/85">
                  {t({
                    en: "Re-interpreting Pham Xuan An and the intelligence history of the Vietnam War",
                    vi: "Giải mã Pham Xuan An và lịch sử tình báo trong Chiến tranh Việt Nam",
                  })}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/interviews"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm tracking-wide hover:bg-secondary transition-colors"
                  >
                    {t({ en: "Explore the Interviews", vi: "Khám phá phỏng vấn" })}
                    <ArrowRight size={16} />
                  </Link>
                </div>
            </div>
            <Carousel
              opts={{ loop: true, align: "start" }}
              plugins={[autoplay.current]}
              className="w-full"
            >
              <CarouselContent>
                {heroSlides.map((slide, i) => (
                  <CarouselItem key={i}>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container py-16 md:py-24 grid lg:grid-cols-12 gap-12 bg-card">
        <div className="lg:col-span-4">
          <div className="text-xs uppercase tracking-[0.25em] text-accent font-bold mb-3">
            {t({ en: "About", vi: "Giới thiệu" })}
          </div>
          <h2 className="font-display text-2xl md:text-3xl leading-tight">
            {t({ en: "The most famous spy of the Vietnam War.", vi: "Nhà tình báo lừng lẫy nhất trong Chiến tranh Việt Nam." })}
          </h2>
        </div>
        <div className="lg:col-span-8 space-y-6 text-foreground/80 leading-relaxed">
          <p>{t(bioIntro)}</p>
          <p>{t(mission)}</p>
          <Link to="/about-project" className="inline-flex items-center gap-2 text-accent hover:underline">
            {t({ en: "About this project", vi: "Về dự án" })} <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Featured cards */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container pt-16 md:pt-20">
          <div className="text-xs uppercase tracking-[0.25em] text-accent font-bold mb-3">
            {t({ en: "ORAL HISTORY", vi: "LỊCH SỬ TRUYỀN MIỆNG" })}
          </div>
          <h2 className="font-display text-2xl md:text-3xl leading-tight max-w-2xl">
            {t({
              en: "Explore the interviews.",
              vi: "Khám phá các cuộc phỏng vấn.",
            })}
          </h2>
        </div>
        <div className="container pb-16 md:pb-20 pt-10 grid md:grid-cols-3 gap-8">
          {[
            {
              slug: "robert-shaplen-recollection",
              title: { en: "Interview with Pham Xuan An", vi: "Phỏng vấn với Phạm Xuân Ẩn" },
              subtitle: { en: "January 11, 2005", vi: "Ngày 11 tháng 1 năm 2005" },
              interviewer: "Edward Miller",
              date: "2005-01-11",
              duration: "01:28:47",
              image: interviewPxaImg,
              synopsis: {
                en: "Pham Xuan An discusses his life, career, and interpretations of Vietnamese history and the Vietnam War.",
                vi: "Phạm Xuân Ẩn thảo luận về cuộc đời, sự nghiệp và những cách giải thích về lịch sử Việt Nam cũng như Chiến tranh Việt Nam.",
              },
            },
            {
              slug: "nguyen-thi-thu-an",
              title: { en: "Interview with Germaine Swanson", vi: "Phỏng vấn với Germaine Swanson" },
              subtitle: { en: "January 18, 2026", vi: "Ngày 18 tháng 1 năm 2026" },
              interviewer: "Le Thi Hong Phuc",
              date: "2026-01-18",
              duration: "01:58:41",
              image: interviewNguyenImg,
              synopsis: {
                en: "Germaine Swanson, who worked with Pham Xuan An at Reuters, recounts her military service in the Army of the Republic of Vietnam, journalism career, and eventual immigration to the United States.",
                vi: "Germaine Swanson, người từng làm việc với Phạm Xuân Ẩn tại Reuters, kể lại quá trình phục vụ quân đội trong Quân lực Việt Nam Cộng hòa, sự nghiệp báo chí và việc định cư tại Hoa Kỳ.",
              },
            },
            {
              slug: "nguyen-thi-ngoc-hai",
              title: { en: "Interview with Nguyen Thi Ngoc Hai", vi: "Phỏng vấn với Nguyễn Thị Ngọc Hải" },
              subtitle: { en: "April 10, 2026", vi: "Ngày 10 tháng 4 năm 2026" },
              interviewer: "Le Thi Hong Phuc",
              date: "2026-04-10",
              duration: "48:02",
              synopsis: {
                en: "1-sentence synopsis",
                vi: "Tóm tắt 1 câu",
              },
            },
          ].map((item) => (
            <article key={item.slug} className="bg-background border border-border flex flex-col">
              <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} strokeWidth={1.25} />
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-2">
                  {t(item.subtitle)}
                </div>
                <h3 className="font-display text-xl leading-snug mb-2">{t(item.title)}</h3>
                <div className="text-xs text-foreground/60 mb-4">
                  <div>{t({ en: "Interviewer:", vi: "Người phỏng vấn:" })} {item.interviewer}</div>
                  <div>{item.duration}</div>
                </div>
                <p className="text-sm text-foreground/75 leading-relaxed mb-6">
                  {t(item.synopsis)}
                </p>
                <Link
                  to={`/interviews/${item.slug}`}
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 text-sm tracking-wide hover:bg-secondary transition-colors"
                >
                  <AudioLines size={16} />
                  {t({ en: "Listen", vi: "Nghe" })}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="container py-16 md:py-24">
        <div className="text-xs uppercase tracking-[0.25em] text-accent font-bold mb-3">
          {t({ en: "PARTNERS", vi: "ĐỐI TÁC" })}
        </div>
        <h2 className="font-display text-2xl md:text-3xl leading-tight max-w-2xl mb-10">
          {t({ en: "A multi-institution, international collaboration.", vi: "Sự cộng tác quốc tế giữa nhiều tổ chức." })}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "The Dartmouth Digital History Initiative", subtitle: "Dartmouth College", url: "https://ddhi.dartmouth.edu/", logo: ddhiLogo },
            { name: "Vietnam Studies Center", subtitle: "Fulbright University Vietnam", url: "https://fulbright.edu.vn/vietnam-studies-center/", logo: fulbrightLogo },
            { name: "Vietnam Center & Sam Johnson\nVietnam Archive", subtitle: "Texas Tech University", url: "https://www.vietnam.ttu.edu/", logo: ttuLogo },
          ].map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border bg-card p-6 flex flex-col items-center text-center gap-4 hover:border-accent transition-colors"
            >
              <div className="aspect-[3/2] w-full bg-muted flex items-center justify-center text-muted-foreground">
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt={p.name}
                    className={`object-contain ${p.logo === ttuLogo ? "max-h-20 max-w-[40%]" : "max-h-full max-w-full"}`}
                  />
                ) : (
                  <ImageIcon size={32} strokeWidth={1.25} />
                )}
              </div>
              <div>
                <div className="font-display text-lg whitespace-pre-line">{p.name}</div>
                <div className="text-xs text-foreground/60 mt-1">{p.subtitle}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

    </>
  );
};

export default Index;
