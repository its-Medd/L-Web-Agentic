"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

// The same stroke and reveal timing as the completed homepage.
const snakePath = "M43 259C296 11.5688 994 -3 922.994 498.259C851.988 999.517 281.229 1004.28 123 767C-35.2287 529.721 179 259 472 259C765 259 792 498.259 659 654C526 809.741 319 755 285 669.001C251 583.001 299 452 496 452C693 452 876.073 639.171 935 937.001";

export function PageTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const busy = useRef(false);
  const pending = useRef<string | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const element = overlay.current;
    const path = element?.querySelector("path");
    const backdrop = element?.querySelector(".ef-transition-backdrop");
    if (!element || !path || !backdrop) return;
    timeline.current?.kill();
    if (fallback.current) clearTimeout(fallback.current);
    const arrivingFromLink = pending.current !== null;
    pending.current = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lock = (active: boolean) => {
      busy.current = active;
      document.documentElement.toggleAttribute("data-ef-transitioning", active);
      document.querySelectorAll<HTMLElement>(".ef-site").forEach(site => { site.inert = active; });
      document.dispatchEvent(new CustomEvent("ef-route-state", { detail: active }));
    };
    const finish = () => {
      element.dataset.phase = "idle";
      lock(false);
      if (arrivingFromLink) {
        const main = document.querySelector<HTMLElement>("main");
        main?.setAttribute("tabindex", "-1");
        main?.focus({ preventScroll: true });
      }
      document.dispatchEvent(new Event("ef-page-ready"));
    };
    if (arrivingFromLink) window.scrollTo({ top: 0, behavior: "instant" });
    if (reduced) {
      finish();
      document.dispatchEvent(new Event("ef-page-reveal"));
      first.current = false;
      return;
    }
    element.dataset.phase = "enter";
    lock(true);
    const delay = first.current ? 0.35 : 0.1;
    first.current = false;
    timeline.current = gsap.timeline({ onComplete: finish })
      .set(backdrop, { opacity: 1 })
      .set(path, { strokeDasharray: 5000, strokeDashoffset: 0, strokeWidth: 300 })
      .set(backdrop, { opacity: 0 }, delay)
      .call(() => { document.dispatchEvent(new Event("ef-page-reveal")); }, [], delay)
      .to(path, { strokeDashoffset: 5000, strokeWidth: 50, duration: 1.25, ease: "power1.inOut" }, delay);
    return () => { timeline.current?.kill(); lock(false); };
  }, [pathname]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !["http:", "https:"].includes(url.protocol)) return;
      if (url.pathname === window.location.pathname) return;
      event.preventDefault();
      if (busy.current) return;
      const href = url.pathname + url.search + url.hash;
      document.dispatchEvent(new Event("ef-route-start"));
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { router.push(href); return; }
      const element = overlay.current;
      const path = element?.querySelector("path");
      const backdrop = element?.querySelector(".ef-transition-backdrop");
      if (!element || !path || !backdrop) { router.push(href); return; }
      busy.current = true;
      pending.current = href;
      element.dataset.phase = "exit";
      document.documentElement.setAttribute("data-ef-transitioning", "");
      document.querySelectorAll<HTMLElement>(".ef-site").forEach(site => { site.inert = true; });
      document.dispatchEvent(new CustomEvent("ef-route-state", { detail: true }));
      router.prefetch(href);
      timeline.current?.kill();
      timeline.current = gsap.timeline({ onComplete: () => {
        element.dataset.phase = "covered";
        router.push(href, { scroll: false });
        // A failed route request must never leave the visitor behind an overlay.
        fallback.current = setTimeout(() => { window.location.assign(href); }, 12000);
      } })
        .set(backdrop, { opacity: 0 })
        .set(path, { strokeDasharray: 5000, strokeDashoffset: -5000, strokeWidth: 50 })
        .to(path, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, 0)
        .to(path, { strokeWidth: 300, duration: 0.75, ease: "power1.inOut" }, 0.25)
        .set(backdrop, { opacity: 1 }, 1);
    };
    const blockScroll = (event: Event) => { if (busy.current) event.preventDefault(); };
    const restore = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      busy.current = false;
      pending.current = null;
      if (overlay.current) overlay.current.dataset.phase = "idle";
      document.documentElement.removeAttribute("data-ef-transitioning");
      document.querySelectorAll<HTMLElement>(".ef-site").forEach(site => { site.inert = false; });
      document.dispatchEvent(new CustomEvent("ef-route-state", { detail: false }));
    };
    document.addEventListener("click", click, true);
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("pageshow", restore);
    return () => {
      document.removeEventListener("click", click, true);
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("pageshow", restore);
      if (fallback.current) clearTimeout(fallback.current);
    };
  }, [router]);

  return <>{children}<div ref={overlay} className="ef-transition ef-route-transition" data-phase="enter" aria-hidden="true"><div className="ef-transition-backdrop" /><svg viewBox="0 0 1000 1000" preserveAspectRatio="none"><path d={snakePath} /></svg></div></>;
}
