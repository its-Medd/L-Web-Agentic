"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function useSiteMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduced ? null : new Lenis({ lerp: 0.165, wheelMultiplier: 1.25, anchors: true });
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) { lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0); }
    let menuOpen = false;
    const syncScroll = () => { if (menuOpen || document.documentElement.hasAttribute("data-ef-transitioning")) lenis?.stop(); else lenis?.start(); };
    const menuToggle = (event: Event) => { menuOpen = (event as CustomEvent<boolean>).detail; syncScroll(); };
    document.addEventListener("ef-menu-toggle", menuToggle);
    document.addEventListener("ef-route-state", syncScroll);
    syncScroll();
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(min-width: 992px) and (prefers-reduced-motion: no-preference)", () => {
        const scene = root.querySelector<HTMLElement>(".ef-featured"), pin = root.querySelector<HTMLElement>(".ef-featured-viewport"), stack = root.querySelector<HTMLElement>(".ef-featured-stack");
        const slides = gsap.utils.toArray<HTMLElement>(".ef-project-slide", root), badge = root.querySelector(".ef-scroll-sticker");
        if (!scene || !pin || !stack) return;
        slides.forEach((slide, index) => gsap.set(slide, { z: -120 * index, y: -40 * index, zIndex: slides.length - index, autoAlpha: 1 }));
        const timeline = gsap.timeline({ paused: true });
        slides.slice(0, -1).forEach((slide, index) => {
          timeline.to(slide, { y: `+=${window.innerHeight * 0.9}`, ease: "power2.in", duration: 1 }, index);
          timeline.to(slide, { autoAlpha: 0, duration: 0.25, ease: "none" }, index + 0.7);
          slides.slice(index + 1).forEach((following, depth) => timeline.to(following, { z: -depth * 120, y: -depth * 40, duration: 1, ease: "none" }, index));
        });
        if (badge) timeline.fromTo(badge, { rotation: 0 }, { rotation: 180, duration: 2, ease: "none" }, 0);
        const scroll = ScrollTrigger.create({ trigger: scene, start: "top top", end: () => `+=${window.innerHeight * 2.4}`, pin, pinSpacing: true, scrub: 0.3, invalidateOnRefresh: true, refreshPriority: 1, onUpdate: (self) => timeline.progress(self.progress) });
        const tiltX = gsap.quickTo(stack, "rotationX", { duration: 0.6, ease: "power3.out" }), tiltY = gsap.quickTo(stack, "rotationY", { duration: 0.6, ease: "power3.out" });
        const pointer = (event: MouseEvent) => { const box = pin.getBoundingClientRect(); tiltX(-((event.clientY - box.top) / box.height - 0.5) * 6); tiltY(((event.clientX - box.left) / box.width - 0.5) * 10); };
        const leave = () => { tiltX(0); tiltY(0); };
        pin.addEventListener("mousemove", pointer); pin.addEventListener("mouseleave", leave);
        return () => { scroll.kill(); timeline.kill(); pin.removeEventListener("mousemove", pointer); pin.removeEventListener("mouseleave", leave); gsap.killTweensOf(stack); };
      });
      if (!reduced && window.innerWidth < 992) {
        const scene = root.querySelector<HTMLElement>(".ef-featured"), pin = root.querySelector<HTMLElement>(".ef-featured-viewport"), stack = root.querySelector<HTMLElement>(".ef-featured-stack");
        const slides = gsap.utils.toArray<HTMLElement>(".ef-project-slide", root), badge = root.querySelector(".ef-scroll-sticker");
        const finalProjectCard = root.querySelector<HTMLElement>(".ef-project-card.ef-project-red");
        if (!scene || !pin || !stack || slides.length < 2) return;
        slides.forEach((slide, index) => gsap.set(slide, { xPercent: -50, yPercent: -50, y: -18 * index, zIndex: slides.length - index, autoAlpha: 1 }));
        const timeline = gsap.timeline({ paused: true });
        slides.slice(0, -1).forEach((slide, index) => {
          timeline.to(slide, { y: window.innerHeight * 1.05, autoAlpha: 0, duration: 1, ease: "power2.in" }, index);
          slides.slice(index + 1).forEach((following, depth) => timeline.to(following, { y: -18 * depth, duration: 1, ease: "none" }, index));
        });
        if (finalProjectCard) timeline.fromTo(finalProjectCard, { scale: 0.9, rotation: 2 }, { scale: 1, rotation: 0, duration: 0.65, ease: "power3.out" }, 1.08);
        if (badge) timeline.fromTo(badge, { rotation: 0 }, { rotation: 180, duration: 2, ease: "none" }, 0);
        ScrollTrigger.create({ trigger: scene, start: "top top", end: () => `+=${window.innerHeight * 2.1}`, pin, pinSpacing: true, scrub: 0.3, invalidateOnRefresh: true, refreshPriority: 1, onUpdate: (self) => timeline.progress(self.progress) });
      }
      if (!reduced && window.innerWidth < 768) {
        const scene = root.querySelector<HTMLElement>(".ef-services"), pin = scene, serviceList = root.querySelector<HTMLElement>(".ef-service-list"), cards = gsap.utils.toArray<HTMLElement>(".ef-service-card", root);
        if (!scene || cards.length < 2) return;
        cards.forEach((card, index) => gsap.set(card, { xPercent: -50, yPercent: -50, rotationY: index === 0 ? 0 : 90, scale: index === 0 ? 1.035 : 0.96, zIndex: cards.length - index, autoAlpha: index === 0 ? 1 : 0 }));
        const timeline = gsap.timeline({ paused: true });
        cards.slice(1).forEach((card, index) => {
          timeline.to(cards[index], { x: -window.innerWidth * 0.72, rotationY: -24, scale: 0.96, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, index);
          timeline.fromTo(card, { x: window.innerWidth * 0.72, rotationY: 24, scale: 0.96, autoAlpha: 0 }, { x: 0, rotationY: 0, scale: 1.045, autoAlpha: 1, duration: 0.8, ease: "power2.out" }, index + 0.08);
        });
        if (serviceList) timeline.to(serviceList, { y: -12, duration: 1.6, ease: "none" }, 0);
        let activeCard = -1;
        const activateCard = (index: number) => {
          if (index === activeCard) return;
          activeCard = index;
          cards.forEach((card, cardIndex) => {
            const video = card.querySelector("video");
            if (cardIndex === activeCard) void video?.play().catch(() => undefined);
            else video?.pause();
          });
        };
        ScrollTrigger.create({
          trigger: scene,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`,
          pin,
          pinSpacing: true,
          scrub: 0.35,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onEnter: () => activateCard(0),
          onEnterBack: () => activateCard(cards.length - 1),
          onLeave: () => activateCard(-1),
          onLeaveBack: () => activateCard(-1),
          onUpdate: (self) => {
            timeline.progress(self.progress);
            activateCard(Math.min(cards.length - 1, Math.floor(self.progress * (cards.length - 1) + 0.02)));
          },
        });
      }
    }, root);
    const nav = root.querySelector<HTMLElement>("[data-ef-nav]"), darkSections = [...root.querySelectorAll<HTMLElement>("[data-ef-dark]")];
    const updateTheme = () => { const line = nav?.offsetHeight ?? 64; const dark = darkSections.some((section) => { const box = section.getBoundingClientRect(); return box.top <= line && box.bottom > line; }); if (nav) nav.dataset.dark = String(dark); };
    window.addEventListener("scroll", updateTheme, { passive: true }); updateTheme();
    const refreshMotion = () => { ScrollTrigger.refresh(); lenis?.resize(); updateTheme(); };
    document.addEventListener("ef-page-ready", refreshMotion);
    let alive = true;
    void document.fonts.ready.then(() => { if (alive) refreshMotion(); });
    return () => { alive = false; window.removeEventListener("scroll", updateTheme); document.removeEventListener("ef-page-ready", refreshMotion); document.removeEventListener("ef-menu-toggle", menuToggle); document.removeEventListener("ef-route-state", syncScroll); media.revert(); context.revert(); gsap.ticker.remove(tick); lenis?.destroy(); };
  }, [rootRef]);
}
