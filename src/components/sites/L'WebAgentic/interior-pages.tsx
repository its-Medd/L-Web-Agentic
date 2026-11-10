"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowUpRight, Mail, Phone } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteMotion } from "./motion";
import { useInteriorMotion } from "./interior-motion";
import { SiteNavigation } from "./home";
import { SiteFooter } from "./team-footer";
import { assetPath, BlockLink, SiteImage, TextLink } from "./site-primitives";
import content from "./interior-data.json";
import "./interior-pages.css";

type Project = typeof content.work[number];

export function RevealHeading({ title, serif = "", as: Tag = "h1", className = "", enter = false }: { title: string; serif?: string; as?: "h1" | "h2"; className?: string; enter?: boolean }) {
  const words = (text: string) => text.split(" ").map((word, index) => <span className="ef-reveal-word" key={index}>{Array.from(word).map((letter, i) => <span className="ef-letter" key={i}>{letter}</span>)}{" "}</span>);
  return <Tag className={className} aria-label={`${title} ${serif}`.trim()} data-ef-heading={enter ? "enter" : "scroll"}><span aria-hidden="true">{words(title)}{serif && <span className="ef-alt">{words(serif)}</span>}</span></Tag>;
}

function InteriorFrame({ children, className, footerCta }: { children: ReactNode; className: string; footerCta: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useSiteMotion(rootRef);
  useInteriorMotion(rootRef);
  return <div id="top" ref={rootRef} className="ef-site ef-subsite"><a href="#main-content" className="ef-skip">Naar de inhoud</a><SiteNavigation /><main id="main-content" className={`ef-inner-page ${className}`}>{children}</main><SiteFooter showCta={footerCta} /></div>;
}

export function PageFrame({ children, className = "", footerCta = true }: { children: ReactNode; className?: string; footerCta?: boolean }) {
  const pathname = usePathname();
  return <InteriorFrame key={pathname} className={className} footerCta={footerCta}>{children}</InteriorFrame>;
}

function PageIntro({ eyebrow, title, serif, children }: { eyebrow?: string; title: string; serif?: string; children?: ReactNode }) {
  return <header className="ef-page-intro"><div className="ef-page-intro-content">{eyebrow && <p className="ef-eyebrow" data-ef-enter>{eyebrow}</p>}<RevealHeading title={title} serif={serif} className="ef-heading-xl" enter />{children && <div className="ef-page-lead" data-ef-enter>{children}</div>}</div></header>;
}

const team = [
  { name: "Tom", role: "Founder / Creative Director", text: "Bedenkt raak. Zegt het ook gewoon." },
  { name: "Willem", role: "Founder / Art Director", text: "Begrijpt wat je bedoelt en wat je eigenlijk bedoelt." },
  { name: "Natasja", role: "All-round creative", text: "2D Animator, regelneef, uitstekende grader, regiegenie. Wat niet?" },
  { name: "Ted", role: "2D/3D Animator", text: "Maakt, knipt en animeert tot het klopt." },
  { name: "Romy", role: "Creative producer", text: "Weet precies wat je nodig hebt, en laat het ook lukken." },
  { name: "Tarrel", role: "Interieurverzorger", text: "Veegt de vloer met je aan." },
];

export function AboutPage() {
  return <PageFrame className="ef-about-page">
    <PageIntro eyebrow="Over ons" title="Wij zijn" serif="makers"><p>Bij Extrafazant hebben we geen stroperig bureauproces. Wij zijn een club creatieven die snel schakelt en meedenkt. Wij zetten jouw ideeën op poten en geven ze vleugels. Van stilstaand verhaal naar lopend vuurtje.</p><TextLink href="#team" direction="down">Ontdek ons team</TextLink></PageIntro>
    <section id="team" className="ef-about-team">
      <div className="ef-about-team-title"><p className="ef-eyebrow ef-reveal">De creatives van Extrafazant</p><RevealHeading title="ABCD" serif="EF-Team" as="h2" className="ef-heading-xl" /><SiteImage name="ef.svg" className="ef-about-sticker" width={258} height={159} /></div>
      {team.map((member, index) => <article className={`ef-person ef-person-${index}`} key={member.name}><div className="ef-person-drift"><div className="ef-person-image ef-reveal-media"><SiteImage name={`team-${member.name.toLowerCase()}.avif`} alt={member.name} width={900} height={1125} /></div><div className="ef-person-caption ef-reveal"><h3>{member.role}</h3><p>{member.text}</p></div></div></article>)}
    </section>
  </PageFrame>;
}

function WorkCard({ project }: { project: Project }) {
  return <a className="ef-work-tile" href={`/werk/${project.slug}`}><div className="ef-work-drift"><div className="ef-work-card"><span className="ef-work-image"><SiteImage name={project.image} alt={project.name} width={900} height={1125} /></span><span className="ef-work-tile-copy"><strong>{project.name}</strong><small>{project.category}</small></span><span className="ef-work-open" aria-hidden="true"><ArrowUpRight /></span></div></div></a>;
}

export function WorkPage() {
  return <PageFrame className="ef-work-page"><PageIntro eyebrow="Ons werk" title="Wat je ziet" serif="is wat je krijgt" /><section className="ef-work-grid" aria-label="Projecten">{content.work.map(project => <WorkCard project={project} key={project.slug} />)}</section></PageFrame>;
}

const services = [
  { name: "animatie", title: "Animatie", text: "Een technisch proces. Een nieuw product of concept. Een ingewikkelde dienst. Of een verhaal waar zelfs jij nog niet helemaal uit bent. Dat is precies waar wij warm van worden. Wij vertalen complexe materie naar beelden die mensen snappen én onthouden. Met scherpe copy, sterke illustraties en animaties die niet alleen bewegen, maar iets in beweging zetten.", label: "Moeilijk verhaal? Makkelijk vertelt.", sticker: "vliegensvlug.svg" },
  { name: "video", title: "Video", text: "Video moet niet alleen mooi zijn. Het moet iets doen. Aandacht trekken. Mensen overtuigen. Of gewoon zorgen dat iemand niet doorscrollt. Dat is wat video moet doen. Van employer branding tot productvideo en van social campagne tot brandfilm: wij maken video's die precies weten waar ze naartoe moeten.", label: "Geen praatjes. Wel plaatjes.", sticker: "geen-praatjes.svg" },
  { name: "social", title: "Social", text: "Social media is geen bijzaak. Het is ons speelveld. Daarom maken wij content die gemaakt is om bekeken, gedeeld en onthouden te worden. Niet te missen. Wel te delen.", label: "Niets is ons te scroll", sticker: "scroll.svg" },
];

function ServiceFilm({ name }: { name: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return <div className="ef-service-film"><video ref={ref} src={assetPath(`service-${name}.mp4`)} poster={assetPath(`service-${name}.avif`)} muted loop playsInline preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><button type="button" className="ef-film-control" onClick={() => ref.current?.paused ? void ref.current.play().catch(() => undefined) : ref.current?.pause()} aria-label={playing ? "Voorbeeld pauzeren" : "Voorbeeld afspelen"} aria-pressed={playing}>{playing ? "Pauze" : "Afspelen"}</button></div>;
}

export function ServicesPage() {
  return <PageFrame className="ef-services-page">
    <div className="ef-services-hero"><PageIntro eyebrow="Wat we doen" title="Alles" serif="beweegt"><p>Merken, mensen, aandacht. Maar niet alles brengt iets in beweging. Wat wij doen wel.</p></PageIntro><div className="ef-orbit" aria-hidden="true">{content.orbit.map((item, index) => <div className="ef-orbit-item" key={item.image} style={{ "--orbit-index": index } as CSSProperties}><SiteImage name={item.image} alt="" width={240} height={240} /></div>)}</div></div>
    <section className="ef-services-statement"><p className="ef-reveal">Extrafazant maakt visuele content voor merken die niet bang zijn om op te vallen. Slim bedacht, vliegensvlug gemaakt en altijd met een idee dat blijft plakken.</p><p className="ef-copy ef-reveal">Geen log bureauproces. Geen eindeloze presentaties. Geen meuk. Wel animaties, video’s en social content die je verhaal stevig bij de lurven vat.</p></section>
    <div className="ef-service-details">{services.map(service => <section className={`ef-service-detail ef-detail-${service.name}`} id={service.name} key={service.name}>
      <div className="ef-service-detail-copy"><SiteImage name={service.sticker} className="ef-service-sticker ef-reveal" width={240} height={180} /><p className="ef-eyebrow ef-reveal">{service.label}</p><RevealHeading title={service.title} as="h2" className="ef-heading-xl" /><p className="ef-copy ef-reveal">{service.text}</p></div>
      <div className="ef-service-detail-image"><div className="ef-service-film-wrap"><ServiceFilm name={service.name} /></div></div>
    </section>)}</div>
  </PageFrame>;
}

export function ContactPage() {
  return <PageFrame className="ef-contact-page" footerCta={false}><section className="ef-contact-hero"><div className="ef-contact-intro"><p className="ef-eyebrow" data-ef-enter>Contact</p><RevealHeading title="Ook iets in" serif="beweging brengen?" className="ef-heading-xl" enter /><p className="ef-eyebrow" data-ef-enter>Zeg waar je mee zit.<br />Wij maken het zichtbaar.</p><div className="ef-contact-actions" data-ef-enter><a href="tel:0132032118" className="ef-block-link ef-block-pink"><span className="ef-block-icon"><Phone size={16} /></span><span className="ef-block-label">Bel ons</span></a><a href="mailto:info@extrafazant.nl" className="ef-block-link ef-block-blue"><span className="ef-block-icon"><Mail size={16} /></span><span className="ef-block-label">Mail ons</span></a></div></div><div className="ef-contact-photo"><SiteImage name={content.contactImage} alt="Het team voor de studio van Extrafazant aan de Spoorlaan in Tilburg" width={1200} height={1500} priority /><SiteImage name="jij-bent-aan-de-bird.svg" className="ef-contact-sticker" width={300} height={160} /></div></section></PageFrame>;
}

function FaqGroup({ group }: { group: typeof content.faq[number] }) {
  const [open, setOpen] = useState<number | null>(null);
  return <section id={group.id} className="ef-faq-group"><RevealHeading title={group.title.split(" ")[0]} serif={group.title.split(" ").slice(1).join(" ")} as="h2" className="ef-heading-l" /><div>{group.questions.map((item, index) => {
    const expanded = open === index;
    const id = `${group.id}-${index}`;
    return <div className="ef-faq-item" data-open={expanded} key={item.question}><h3><button id={`${id}-button`} aria-expanded={expanded} aria-controls={id} onClick={() => setOpen(expanded ? null : index)}><span>{item.question}</span><ChevronDown aria-hidden="true" /></button></h3><div id={id} role="region" aria-labelledby={`${id}-button`} aria-hidden={!expanded} className="ef-faq-panel" onTransitionEnd={() => ScrollTrigger.refresh()}><div><p>{item.answer}</p></div></div></div>;
  })}</div></section>;
}

function FaqDock() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const dock = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = 0;
      content.faq.forEach((group, index) => { if ((document.getElementById(group.id)?.getBoundingClientRect().top ?? Infinity) < innerHeight * 0.5) current = index; });
      setActive(current);
      setVisible((document.querySelector("footer")?.getBoundingClientRect().top ?? Infinity) > innerHeight * 0.8);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const click = (event: MouseEvent) => { if (!dock.current?.contains(event.target as Node)) setOpen(false); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); dock.current?.querySelector("button")?.focus(); } };
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("click", click);
    document.addEventListener("keydown", key);
    update();
    return () => { window.removeEventListener("scroll", scroll); document.removeEventListener("click", click); document.removeEventListener("keydown", key); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={dock} className="ef-faq-dock" data-visible={visible}><button aria-expanded={open} aria-controls="ef-faq-navigation" onClick={() => setOpen(!open)}>{String(active + 1).padStart(2, "0")} {content.faq[active]?.title}<ChevronDown size={16} /></button><nav id="ef-faq-navigation" aria-label="FAQ onderwerpen" hidden={!open}>{content.faq.map((group, i) => <a href={`#${group.id}`} key={group.id} aria-current={active === i ? "location" : undefined} onClick={() => setOpen(false)}>{String(i + 1).padStart(2, "0")} {group.title}</a>)}</nav></div>;
}

export function FaqPage() {
  return <PageFrame className="ef-faq-page"><PageIntro title="Extra" serif="FAQ" /><div className="ef-faq-groups">{content.faq.map(group => <FaqGroup group={group} key={group.id} />)}</div><FaqDock /></PageFrame>;
}

export function ProjectPage({ slug }: { slug: string }) {
  const project = content.work.find(item => item.slug === slug)!;
  return <PageFrame className="ef-project-page"><header className="ef-case-hero" style={{ "--case-color": project.color } as CSSProperties}><div className="ef-case-intro"><p className="ef-eyebrow" data-ef-enter>{project.category}</p><RevealHeading title={project.name} className={`ef-heading-xl${project.name.length > 14 ? " ef-case-title-long" : ""}`} enter /><p className="ef-copy" data-ef-enter>{project.intro}</p></div><div className="ef-case-media"><div className="ef-case-image"><SiteImage name={project.image} alt={project.name} width={900} height={1125} priority /></div></div></header>
    {project.sections.map((section, index) => <section className="ef-case-step" key={`${slug}-${index}`} style={{ "--case-color": project.color } as CSSProperties}><div className="ef-case-step-copy">{section.heading && <RevealHeading title={section.heading.split(" ")[0]} serif={section.heading.split(" ").slice(1).join(" ")} as="h2" className="ef-heading-l" />}{section.paragraphs.map((text, i) => <p className="ef-copy ef-reveal" key={i}>{text}</p>)}</div>{section.image && <div className="ef-case-media"><div className="ef-case-image ef-reveal-media"><SiteImage name={section.image} alt={`${project.name} — ${section.heading}`} width={1000} height={1200} /></div></div>}</section>)}
    <section className="ef-more-work"><RevealHeading title="Meer" serif="Werk" as="h2" className="ef-heading-xl" /><div className="ef-more-work-links">{content.work.filter(item => item.slug !== slug).slice(0, 3).map(item => <WorkCard project={item} key={item.slug} />)}</div><BlockLink href="/werk">Bekijk al ons werk</BlockLink></section>
  </PageFrame>;
}

export function LegalPage({ type }: { type: "privacyverklaring" | "algemene-voorwaarden" }) {
  const privacy = type === "privacyverklaring";
  return <PageFrame className="ef-legal-page"><PageIntro title={privacy ? "Privacy" : "Algemene"} serif={privacy ? "verklaring" : "voorwaarden"}><p>Laatst bijgewerkt: {privacy ? "29 juni 2026" : "1 juni 2026"}</p></PageIntro><article className="ef-legal-copy">{content.legal[type].map((block, i) => {
    if (block.tag === "h2") return <h2 className="ef-legal-heading ef-reveal" key={i}>{block.text}</h2>;
    if (block.tag === "ul" || block.tag === "ol") { const Tag = block.tag; return <Tag className="ef-reveal" key={i}>{block.items.map((item, index) => <li key={index}>{item}</li>)}</Tag>; }
    return <p className="ef-reveal" key={i}>{block.text}</p>;
  })}</article></PageFrame>;
}
