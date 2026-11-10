"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useInteriorMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add({ desktop: "(min-width: 992px)", mobile: "(max-width: 991px)", reduce: "(prefers-reduced-motion: reduce)" }, match => {
        const { desktop, reduce } = match.conditions!;
        if (reduce) return;
        const intro = gsap.timeline({ paused: true });
        const enterText = root.querySelectorAll("[data-ef-enter]");
        const letters = root.querySelectorAll('[data-ef-heading="enter"] .ef-letter');
        if (enterText.length) intro.from(enterText, { y: 28, opacity: 0, duration: 0.85, stagger: 0.12, ease: "expo.out" }, 0.15);
        if (letters.length) intro.from(letters, { yPercent: 125, rotation: 4, duration: 1, stagger: 0.018, ease: "expo.out" }, 0.15);
        const heroMedia = root.querySelectorAll(".ef-contact-photo > img:first-child, .ef-case-hero .ef-case-image");
        if (heroMedia.length) intro.from(heroMedia, { scale: 1.09, duration: 1.6, ease: "power3.out" }, 0);
        const reveal = () => { intro.delay(0.45).play(); };
        document.addEventListener("ef-page-reveal", reveal);
        const ready = () => { if (!intro.isActive() && intro.progress() === 0) intro.play(); };
        document.addEventListener("ef-page-ready", ready);
        if (document.querySelector('.ef-route-transition[data-phase="idle"]')) intro.play();

        root.querySelectorAll<HTMLElement>('[data-ef-heading="scroll"]').forEach(heading => {
          gsap.from(heading.querySelectorAll(".ef-letter"), { yPercent: 120, duration: 1, stagger: 0.015, ease: "expo.out", scrollTrigger: { trigger: heading, start: "top 90%", once: true } });
        });
        root.querySelectorAll<HTMLElement>(".ef-reveal, footer h2, footer .ef-copy, footer .ef-block-link").forEach(element => {
          gsap.from(element, { y: 28, opacity: 0, duration: 0.85, ease: "expo.out", scrollTrigger: { trigger: element, start: "top 94%", once: true } });
        });
        root.querySelectorAll<HTMLElement>(".ef-reveal-media").forEach(element => {
          gsap.from(element, { clipPath: "inset(10% 0 10% 0)", y: 30, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 95%", once: true } });
          const image = element.querySelector("img");
          if (image) gsap.from(image, { scale: 1.08, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 95%", once: true } });
        });
        root.querySelectorAll<HTMLElement>(".ef-work-tile").forEach((card, index) => {
          gsap.from(card, { y: desktop ? 65 : 35, rotation: index % 2 ? 2 : -2, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 98%", once: true } });
        });
        if (desktop) {
          root.querySelectorAll<HTMLElement>(".ef-work-grid > :nth-child(3n + 2) .ef-work-drift").forEach(card => {
            gsap.to(card, { y: 120, ease: "none", scrollTrigger: { trigger: root.querySelector(".ef-work-grid"), start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: true } });
          });
        }
        root.querySelectorAll<HTMLElement>(".ef-person-drift").forEach((card, index) => {
          gsap.fromTo(card, { y: desktop ? 40 : 12 }, { y: desktop ? (index % 2 ? -45 : -80) : -12, ease: "none", scrollTrigger: { trigger: card.parentElement, start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: 0.5 } });
        });

        const orbit = root.querySelector<HTMLElement>(".ef-orbit");
        const orbitItems = [...root.querySelectorAll<HTMLElement>(".ef-orbit-item")];
        let orbitVisible = true;
        let orbitWidth = orbit?.clientWidth ?? 0;
        let orbitHeight = orbit?.clientHeight ?? 0;
        const resize = () => { orbitWidth = orbit?.clientWidth ?? 0; orbitHeight = orbit?.clientHeight ?? 0; };
        const tick = (time: number) => {
          if (!orbitVisible) return;
          orbitItems.forEach((item, i) => {
            const angle = time * 0.045 + (i / orbitItems.length) * Math.PI * 2 + Math.PI / 3;
            gsap.set(item, { x: Math.cos(angle) * orbitWidth * 0.42, y: Math.sin(angle) * orbitHeight * 0.39, rotation: Math.sin(angle) * 8, xPercent: -50, yPercent: -50 });
          });
        };
        if (orbitItems.length && orbit) {
          gsap.set(orbitItems, { left: "50%", top: "50%" });
          gsap.ticker.add(tick);
          window.addEventListener("resize", resize);
          ScrollTrigger.create({ trigger: orbit, start: "top bottom", end: "bottom top", onToggle: self => { orbitVisible = self.isActive; } });
        }

        const videoObservers: IntersectionObserver[] = [];
        root.querySelectorAll<HTMLElement>(".ef-service-film-wrap").forEach(element => {
          gsap.from(element, { xPercent: desktop ? 8 : 18, rotationY: desktop ? 0 : -18, rotation: desktop ? 3 : 2, scale: 0.94, opacity: 0, ease: "power2.out", scrollTrigger: { trigger: element.closest(".ef-service-detail-image"), start: "top 92%", end: "top 35%", scrub: 0.4 } });
          const video = element.querySelector("video");
          if (!video) return;
          const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void video.play().catch(() => undefined); else video.pause(); }, { threshold: 0.35 });
          observer.observe(video);
          videoObservers.push(observer);
        });
        const refresh = () => { ScrollTrigger.refresh(); };
        document.addEventListener("ef-page-ready", refresh);
        let alive = true;
        void document.fonts.ready.then(() => { if (alive) refresh(); });
        return () => {
          alive = false;
          document.removeEventListener("ef-page-reveal", reveal);
          document.removeEventListener("ef-page-ready", ready);
          document.removeEventListener("ef-page-ready", refresh);
          window.removeEventListener("resize", resize);
          gsap.ticker.remove(tick);
          videoObservers.forEach(observer => observer.disconnect());
          root.querySelectorAll("video").forEach(video => video.pause());
        };
      });
    }, root);
    return () => { media.revert(); context.revert(); };
  }, [rootRef]);
}
