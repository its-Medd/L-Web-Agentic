"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Arrow, assetPath, BlockLink, BrandMark, SiteImage, siteOrigin, TextLink } from "./site-primitives";
import { useSiteMotion } from "./motion";
import { SiteFooter } from "./team-footer";

const navigation = [["Over", "/over"], ["Werk", "/werk"], ["Wat we doen", "/wat-we-doen"]] as const;
const clients = [["fontys", "Fontys"], ["janzen", "Janzen"], ["jumbo", "Jumbo"], ["cordaid", "Cordaid"], ["nationaal-archief", "Nationaal Archief"], ["source", "Source"], ["willem-2", "Willem II"], ["odido", "Odido"]] as const;
const projects = [
  { name: "P. van der Niet", image: "pvdniet", slug: "p-van-der-niet", tone: "yellow" },
  { name: "Odido", image: "odido", slug: "odido", tone: "blue" },
  { name: "Willem II", image: "willem-ii", slug: "willem-ii", tone: "red" },
] as const;
const clips = ["odido", "fatboy", "veilig-thuis", "willem-ii"];

export function SiteNavigation() {
  const pathname = usePathname();
  return <header className="ef-nav" data-ef-nav><div className="ef-nav-inner">
      <Link className="ef-nav-logo" href="/" aria-label="L'Web agentic — naar boven">
        <BrandMark />
      </Link>
      <nav className="ef-desktop-links" aria-label="Hoofdnavigatie">{navigation.map(([label, path]) => <a href={siteOrigin + path} key={path} aria-current={pathname === path || pathname.startsWith(path + "/") ? "page" : undefined}>{label}</a>)}</nav>
      <a href={siteOrigin + "/contact"} className="ef-contact-link"><span />Contact</a>
    </div></header>;
}

function Word({ text, serif = false }: { text: string; serif?: boolean }) {
  const restingWeight = serif ? 300 : 700;
  const nearbyWeight = serif ? 800 : 200;
  return <span className={`ef-word${serif ? " ef-alt" : ""}`}>{Array.from(text).map((letter, index) => <span data-ef-hero-letter data-ef-rest={restingWeight} data-ef-near={nearbyWeight} key={index}>{letter}</span>)}</span>;
}

function Hero() {
  const [clip, setClip] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const card = cardRef.current, hero = heroRef.current;
    if (!card || !hero) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 992px) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const xTo = gsap.quickTo(card, "x", { duration: 1, ease: "power4.out" });
      const yTo = gsap.quickTo(card, "y", { duration: 1, ease: "power4.out" });
      const rotate = gsap.quickTo(card, "rotation", { duration: 1, ease: "power4.out" });
      let reset: ReturnType<typeof setTimeout>;
      const point = { x: 0, y: 0, distance: 0, active: false };
      gsap.set(card, { autoAlpha: 0 });
      const move = (event: MouseEvent) => {
        if ((event.target as HTMLElement).closest("a, button")) { gsap.to(card, { autoAlpha: 0, duration: 0.25 }); return; }
        const box = hero.getBoundingClientRect(), x = event.clientX - box.width / 2, y = event.clientY - box.top - box.height / 2;
        if (!point.active) { gsap.set(card, { x, y }); point.active = true; point.x = event.clientX; point.y = event.clientY; }
        gsap.to(card, { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
        const dx = event.clientX - point.x, dy = event.clientY - point.y;
        point.distance += (Math.abs(dx) + Math.abs(dy)) / 2;
        if (point.distance > 300) { point.distance = 0; setClip((current) => (current + 1) % clips.length); }
        xTo(x); yTo(y); rotate(dx / 4); point.x = event.clientX; point.y = event.clientY;
        clearTimeout(reset); reset = setTimeout(() => rotate(0), 66);
      };
      const leave = () => { point.active = false; gsap.to(card, { autoAlpha: 0, duration: 0.3 }); };
      hero.addEventListener("mousemove", move); hero.addEventListener("mouseleave", leave);
      return () => { hero.removeEventListener("mousemove", move); hero.removeEventListener("mouseleave", leave); clearTimeout(reset); gsap.killTweensOf(card); };
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const heading = hero.querySelector<HTMLElement>(".ef-hero-heading");
    const letters = Array.from(hero.querySelectorAll<HTMLElement>("[data-ef-hero-letter]"));
    if (!heading || !letters.length) return;
    const animateIn = () => {
      gsap.fromTo(letters, { yPercent: 125, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.018, ease: "expo.out", clearProps: "transform" });
    };
    const revealTimer = window.setTimeout(animateIn, 450);
    document.addEventListener("ef-page-reveal", animateIn, { once: true });
    if (!window.matchMedia("(min-width: 992px) and (hover: hover) and (pointer: fine)").matches) {
      return () => {
        window.clearTimeout(revealTimer);
        document.removeEventListener("ef-page-reveal", animateIn);
        gsap.killTweensOf(letters);
      };
    }
    const weightTo = new Map(letters.map((letter) => [letter, gsap.quickTo(letter, "--ef-hero-weight", { duration: 0.42, ease: "power3.out" })]));
    const liftTo = new Map(letters.map((letter) => [letter, gsap.quickTo(letter, "y", { duration: 0.42, ease: "power3.out" })]));
    const reset = () => letters.forEach((letter) => {
      weightTo.get(letter)?.(Number(letter.dataset.efRest));
      liftTo.get(letter)?.(0);
    });
    const move = (event: PointerEvent) => {
      letters.forEach((letter) => {
        const box = letter.getBoundingClientRect();
        const distance = Math.hypot(event.clientX - (box.left + box.width / 2), event.clientY - (box.top + box.height / 2));
        const influence = Math.max(0, 1 - distance / 400);
        const resting = Number(letter.dataset.efRest);
        const nearby = Number(letter.dataset.efNear);
        const weight = resting + (nearby - resting) * influence;
        weightTo.get(letter)?.(weight);
        liftTo.get(letter)?.(influence * -5);
      });
    };
    heading.addEventListener("pointermove", move);
    heading.addEventListener("pointerleave", reset);
    return () => {
      window.clearTimeout(revealTimer);
      document.removeEventListener("ef-page-reveal", animateIn);
      heading.removeEventListener("pointermove", move);
      heading.removeEventListener("pointerleave", reset);
      gsap.killTweensOf(letters);
      reset();
    };
  }, []);
  return <section id="top" className="ef-hero" ref={heroRef} aria-labelledby="ef-hero-title">
    <div className="ef-hero-stage">
      <div className="ef-hero-card" ref={cardRef} aria-hidden="true"><video key={clips[clip]} src={assetPath(`hero-${clips[clip]}.mp4`)} poster={assetPath(`hero-${clips[clip]}.avif`)} autoPlay muted loop playsInline preload="metadata" /></div>
      <div className="ef-hero-content">
        <p className="ef-hero-subtitle">Social content,<br />video&apos;s &amp; animatie</p>
        <h1 id="ef-hero-title" className="ef-hero-heading" aria-label="Brengt je merk in beweging"><span aria-hidden="true"><Word text="Brengt" /> <Word text="je" /> <Word text="merk" /><br /><Word text="in" /> <Word text="beweging" serif /></span></h1>
        <TextLink href="#intro" direction="down">Ontdek meer</TextLink>
      </div>
    </div>
    <div className="ef-clients" aria-label="Een selectie van onze opdrachtgevers"><div className="ef-client-track">{[0, 1].map((copy) => <div className="ef-client-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{clients.map(([file, name]) => <div className="ef-client" key={file}><SiteImage name={`client-${file}.avif`} alt={copy === 0 ? name : ""} width={400} height={200} /></div>)}</div>)}</div></div>
  </section>;
}

function Intro() {
  return <section id="intro" className="ef-intro ef-section-pad ef-page-pad" aria-labelledby="ef-intro-title"><div className="ef-intro-grid">
    <div className="ef-intro-media">
      <div className="ef-intro-large"><div><SiteImage name="intro-home-1.avif" alt="De makers van Extrafazant voor hun studio in Tilburg" /></div></div>
      <div className="ef-intro-small"><div><SiteImage name="intro-home-2.avif" alt="Geen praatjes, wel plaatjes" /></div></div>
      <SiteImage name="ef-run-club.svg" className="ef-intro-sticker" width={500} height={424} />
    </div>
    <div className="ef-intro-content"><p className="ef-eyebrow">Wie wij zijn</p><h2 className="ef-heading-l" id="ef-intro-title">De creatives van<br /><span className="ef-alt">L&apos;Web agentic</span></h2><p className="ef-copy">Geen loggggg bureauproces. Wij zijn een club makers die snel schakelt en meedenkt. Gevat, voordat je ‘m zelf hebt bedacht.</p><BlockLink href={siteOrigin + "/over"}>Meer over ons</BlockLink></div>
  </div></section>;
}

function FeaturedWork() {
  return <section className="ef-featured" data-ef-dark aria-labelledby="ef-work-title"><div className="ef-featured-viewport">
    <div className="ef-featured-title"><p className="ef-eyebrow-small">Niet te missen, wel te delen. Hier <br className="ef-featured-break" />een greep uit wat we maken.</p><h2 className="ef-heading-xl" id="ef-work-title">Recent <span className="ef-alt">Werk</span></h2></div>
    <div className="ef-featured-stack">{projects.map((project) => <div className="ef-project-slide" key={project.slug}><a href={siteOrigin + "/werk/" + project.slug} className={`ef-project-card ef-project-${project.tone}`} aria-label={`Bekijk de case ${project.name}`}><SiteImage name={`project-${project.image}.avif`} alt={project.name} width={1600} height={900} /><div className="ef-project-shade" /><h3>{project.name}</h3></a></div>)}</div>
    <div className="ef-featured-button"><BlockLink href={siteOrigin + "/werk"} tone="pink">Bekijk ons werk</BlockLink></div><SiteImage name="scroll.svg" width={300} height={300} className="ef-scroll-sticker" />
  </div></section>;
}

function ServiceCard({ name, title, description }: { name: string; title: string; description: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => { if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) void videoRef.current?.play().catch(() => undefined); };
  const pause = () => { videoRef.current?.pause(); };
  return <button className={`ef-service-card ef-service-${name}`} onMouseEnter={play} onMouseLeave={pause} onFocus={play} onBlur={pause} onClick={() => videoRef.current?.paused ? play() : pause()} aria-label={`${title}: voorbeeld ${playing ? "pauzeren" : "afspelen"}`} aria-pressed={playing}>
    <span className="ef-service-media"><SiteImage name={`service-${name}.avif`} width={800} height={1000} /><video ref={videoRef} src={assetPath(`service-${name}.mp4`)} muted loop playsInline preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className={playing ? "is-playing" : ""} /></span>
    <span className="ef-service-copy"><span className="ef-service-heading">{title}</span><span className="ef-eyebrow-small">{description}</span></span>
  </button>;
}

function Services() {
  return <section className="ef-services ef-section-pad ef-page-pad" aria-labelledby="ef-services-title">
    <div className="ef-services-title"><p className="ef-eyebrow">Onze diensten</p><h2 id="ef-services-title" className="ef-heading-xl">Wat we <span className="ef-alt">Doen</span></h2></div>
    <div className="ef-service-list"><ServiceCard name="animatie" title="Animatie" description="2D, 3D en motion graphics die blijven hangen" /><ServiceCard name="video" title="Video" description="Jouw verhaal, op beeld" /><ServiceCard name="social" title="Social" description="Social content die je laat stoppen met scrollen" /></div>
    <div className="ef-services-link"><TextLink href={siteOrigin + "/wat-we-doen"}>Ontdek meer</TextLink></div>
  </section>;
}

function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { try { if (!localStorage.getItem("extrafazant-local-consent")) setVisible(true); } catch { setVisible(true); } }, 1200);
    return () => clearTimeout(timer);
  }, []);
  const dismiss = (choice: string) => { try { localStorage.setItem("extrafazant-local-consent", choice); } catch { /* Dismissal also works without storage. */ } setVisible(false); };
  if (!visible) return null;
  return <aside className="ef-cookie" aria-label="Cookiebericht"><div className="ef-cookie-top"><span><SiteImage name="cookie-location.svg" width={14} height={14} />Zone 1</span><span><SiteImage name="cookie-notice.svg" width={14} height={14} />Notitie</span><button onClick={() => dismiss("dismissed")} aria-label="Cookiebericht sluiten"><SiteImage name="cookie-close.svg" width={20} height={20} /></button></div><p>L&apos;Web agentic gebruikt cookies en vergelijkbare technologieën om jouw ervaring te verbeteren, verkeer te analyseren en relevante content en advertenties te tonen.</p><button className="ef-cookie-accept" onClick={() => dismiss("accepted")}>Accepteer <Arrow /></button></aside>;
}

export function ExtrafazantHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  useSiteMotion(rootRef);
  return <div ref={rootRef} className="ef-site"><a href="#intro" className="ef-skip">Naar de inhoud</a><SiteNavigation /><main><Hero /><Intro /><FeaturedWork /><Services /></main><SiteFooter /><CookieNotice /></div>;
}
