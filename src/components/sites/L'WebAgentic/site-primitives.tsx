import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

// Internal links stay inside this local recreation. External contact/social links
// remain absolute so they still point to the real services.
export const siteOrigin = "";
export const assetPath = (name: string) => `/sites/extrafazant/${name}`;

export function BrandMark({ className = "" }: { className?: string }) {
  return <span className={`ef-brand-mark ${className}`}>L&apos;Web <span>agentic</span></span>;
}

export function SiteImage({
  name,
  alt = "",
  className = "",
  width = 1200,
  height = 1500,
  priority = false,
  style,
}: {
  name: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    <Image
      src={assetPath(name)}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      priority={priority}
      className={className}
      style={style}
    />
  );
}

export function Arrow({
  direction = "right",
  tone = "white",
}: {
  direction?: "right" | "down" | "up";
  tone?: "white" | "black" | "blue";
}) {
  return <SiteImage name={`arrow-up-${tone}.svg`} width={15} height={16} className={`ef-arrow ef-arrow-${direction}`} />;
}

export function BlockLink({
  href,
  children,
  tone = "blue",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "blue" | "pink";
  className?: string;
}) {
  return (
    <a className={`ef-block-link ef-block-${tone} ${className}`} href={href}>
      <span className="ef-block-icon"><Arrow tone={tone === "pink" ? "black" : "white"} /></span>
      <span className="ef-block-label"><span>{children}</span></span>
    </a>
  );
}

export function TextLink({
  href,
  children,
  direction = "right",
}: {
  href: string;
  children: ReactNode;
  direction?: "right" | "down";
}) {
  return (
    <a href={href} className="ef-text-link">
      <span className="ef-text-link-label">{children}</span>
      <span className="ef-text-link-icon"><Arrow direction={direction} /></span>
    </a>
  );
}
