"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Arrow, BlockLink, BrandMark, SiteImage, siteOrigin, TextLink } from "./site-primitives";
import styles from "./team-footer.module.css";

const team = [
  { name: "Tom", image: "team-tom.avif" },
  { name: "Willem", image: "team-willem.avif" },
  { name: "Natasja", image: "team-natasja.avif" },
  { name: "Ted", image: "team-ted.avif" },
  { name: "Romy", image: "team-romy.avif" },
  { name: "Tarrel", image: "team-tarrel.avif" },
];

const trailAssets = ["vliegensvlug.svg", "anti-meuk.svg", "jij-bent-aan-de-bird.svg", "ef.svg", "geen-praatjes.svg", "fire.svg"];

type TrailSticker = { id: number; name: string; x: number; y: number; driftX: number; driftY: number; wanderX: number; wanderY: number; rotation: number; twist: number };

function FooterStickerTrail() {
  const trailRef = useRef<HTMLDivElement>(null);
  const [stickers, setStickers] = useState<TrailSticker[]>([]);
  const counter = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const assetIndex = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const trail = trailRef.current;
    const target = trail?.parentElement;
    if (!trail || !target || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const pendingTimers = timers.current;
    const addSticker = (event: PointerEvent) => {
      const box = target.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      const previous = last.current;
      if (!previous) { last.current = { x, y }; return; }
      const deltaX = x - previous.x;
      const deltaY = y - previous.y;
      if (Math.hypot(deltaX, deltaY) < Math.max(28, window.innerWidth / 120)) return;
      last.current = { x, y };
      const id = counter.current++;
      const sticker: TrailSticker = {
        id,
        name: trailAssets[assetIndex.current++ % trailAssets.length],
        x,
        y,
        driftX: Math.max(-190, Math.min(190, deltaX * 5)),
        driftY: Math.max(-150, Math.min(150, deltaY * 5)),
        wanderX: (Math.random() - .5) * 90,
        wanderY: -28 - Math.random() * 64,
        rotation: (Math.random() - .5) * 22,
        twist: (Math.random() - .5) * 28,
      };
      setStickers((current) => [...current.slice(-11), sticker]);
      pendingTimers.push(window.setTimeout(() => setStickers((current) => current.filter((item) => item.id !== id)), 2200));
    };
    const leave = () => { last.current = null; };
    target.addEventListener("pointermove", addSticker);
    target.addEventListener("pointerleave", leave);
    return () => {
      target.removeEventListener("pointermove", addSticker);
      target.removeEventListener("pointerleave", leave);
      pendingTimers.forEach(window.clearTimeout);
    };
  }, []);

  return <div ref={trailRef} className={styles.trailArea} aria-hidden="true">{stickers.map((sticker) => <SiteImage key={sticker.id} name={sticker.name} className={styles.trailSticker} width={280} height={220} style={{ "--trail-x": `${sticker.x}px`, "--trail-y": `${sticker.y}px`, "--trail-drift-x": `${sticker.driftX}px`, "--trail-drift-y": `${sticker.driftY}px`, "--trail-wander-x": `${sticker.wanderX}px`, "--trail-wander-y": `${sticker.wanderY}px`, "--trail-rotation": `${sticker.rotation}deg`, "--trail-twist": `${sticker.twist}deg` } as CSSProperties} />)}</div>;
}

export function TeamSection() {
  return (
    <section className={`ef-section-pad ef-page-pad ${styles.team}`} aria-labelledby="team-heading">
      <div className={styles.teamWrapper}>
        <div className={styles.teamTitle}>
          <p className="ef-eyebrow">De creatives van L&apos;Web agentic</p>
          <h2 id="team-heading" className="ef-heading-xl"><span className="ef-alt">ABCD</span>EF-<wbr /><span className="ef-alt">Team</span></h2>
          <SiteImage name="ef.svg" width={258} height={159} className={`${styles.sticker} ${styles.stickerOne}`} />
        </div>
        <div className={styles.teamList} data-ef-team-list>
          {team.map((member) => (
            <div key={member.name} className={styles.teamItem} data-ef-team-item>
              <div className={styles.teamCard} data-ef-team-card>
                <div className={styles.teamImage}>
                  <SiteImage name={member.image} alt={member.name} className={styles.portrait} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <SiteImage name="abcdef.svg" width={319} height={115} className={`${styles.sticker} ${styles.stickerTwo}`} />
        <SiteImage name="geen-praatjes.svg" width={239} height={237} className={`${styles.sticker} ${styles.stickerThree}`} />
        <div className={styles.teamLink}><TextLink href={`${siteOrigin}/over`}>Ontdek meer over ons</TextLink></div>
      </div>
    </section>
  );
}

export function SiteFooter({ showCta = true }: { showCta?: boolean }) {
  return (
    <footer className={`ef-page-pad ${styles.footer}`} data-ef-dark>
      {showCta && <div className={styles.footerCta}>
        <FooterStickerTrail />
        <div className={styles.ctaContent}>
          <h2 className="ef-heading-xl">Ook iets in<br /><span className="ef-alt">Beweging brengen?</span></h2>
          <p className={`ef-copy ${styles.ctaCopy}`}>Zeg waar je mee zit. Wij maken het zichtbaar.</p>
          <div className={styles.ctaButton}><BlockLink href={`${siteOrigin}/contact`} tone="pink">Vooruit met je verhaal</BlockLink></div>
        </div>
      </div>}
      <div className={styles.footerMain}>
        <div className={styles.footerMainLogo}>
          <a href="#top" className={styles.footerLogo} aria-label="L'Web agentic, naar boven">
            <BrandMark />
          </a>
        </div>
        <div className={styles.footerColumns}>
          <nav className={styles.footerColumn} aria-label="Voetnavigatie">
            <h3 className={styles.columnHeading}>Navigatie</h3>
            <div className={styles.footerLinks}>
              <a className={styles.footerLink} href={`${siteOrigin}/over`}>Over</a>
              <a className={styles.footerLink} href={`${siteOrigin}/werk`}>Werk</a>
              <a className={styles.footerLink} href={`${siteOrigin}/wat-we-doen`}>Wat we doen</a>
              <a className={styles.footerLink} href={`${siteOrigin}/contact`}>Contact</a>
              <a className={styles.footerLink} href={`${siteOrigin}/faq`}>FAQ</a>
            </div>
          </nav>
          <div className={styles.footerColumn}>
            <h3 className={styles.columnHeading}>Contact</h3>
            <div className={`${styles.footerLinks} ${styles.contactLinks}`}>
              <a className={`${styles.footerLink} ${styles.address}`} href="https://maps.app.goo.gl/87wBF96HWgbhAwz36">Spoorlaan 15<br />5038 CB<br />Tilburg</a>
              <a className={styles.footerLink} href="mailto:info@extrafazant.nl">info@extrafazant.nl</a>
              <a className={styles.footerLink} href="tel:0132032118">(013) 203 21 18</a>
            </div>
          </div>
          <div className={`${styles.footerColumn} ${styles.socialColumn}`}>
            <h3 className={styles.columnHeading}>Socials</h3>
            <div className={styles.footerLinks}>
              <a className={styles.footerLink} href="https://www.instagram.com/extrafazant/">Instagram</a>
              <a className={styles.footerLink} href="https://vimeo.com/extrafazant">Vimeo</a>
              <a className={styles.footerLink} href="https://linkedin.com/company/extrafazant?originalSubdomain=nl">LinkedIn</a>
            </div>
          </div>
          <a href="#top" aria-label="Terug naar boven" className={styles.backTop}><Arrow direction="up" /></a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={`${styles.bottomLink} ${styles.copyright}`}>© 2026 L&apos;Web agentic</p>
        <div className={styles.legalLinks}>
          <a className={styles.bottomLink} href={`${siteOrigin}/privacyverklaring`}>Privacyverklaring</a>
          <a className={styles.bottomLink} href={`${siteOrigin}/algemene-voorwaarden`}>Algemene voorwaarden</a>
        </div>
        <a className={`${styles.bottomLink} ${styles.credit}`} href="https://dylanbrouwer.design/">© Design by Dylan</a>
      </div>
    </footer>
  );
}
