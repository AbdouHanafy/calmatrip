import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface PageCrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Photo behind the title. Without it the header is a plain ink-on-white title block. */
  image?: string;
  imageAlt?: string;
  crumbs?: PageCrumb[];
  /** Rendered under the banner, e.g. a search bar that overlaps its bottom edge. */
  children?: React.ReactNode;
}

// Compact sibling of HomeHero: same 1240px column, rounded photo, bold left-aligned
// title. Used at the top of every inner public page so they read as one site.
export default function PageHeader({
  title,
  subtitle,
  image,
  imageAlt = "",
  crumbs,
  children,
}: PageHeaderProps) {
  const crumbTone = image ? "text-white/80" : "text-calma-taupe";

  const breadcrumb = crumbs && crumbs.length > 0 && (
    <nav
      aria-label="Breadcrumb"
      className={`mb-3 flex flex-wrap items-center gap-1 text-[13px] ${crumbTone}`}
    >
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="inline-flex items-center gap-1">
            {c.href && !last ? (
              <Link href={c.href} className="no-underline hover:underline">
                {c.label}
              </Link>
            ) : (
              <span
                aria-current={last ? "page" : undefined}
                className={last ? "font-semibold" : ""}
              >
                {c.label}
              </span>
            )}
            {!last && <ChevronRight size={13} className="rtl:rotate-180" />}
          </span>
        );
      })}
    </nav>
  );

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      {image ? (
        <div className="relative h-[240px] overflow-hidden rounded-2xl sm:h-[280px] lg:h-[320px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1240px) 1240px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/0" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-black/0 rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
            {breadcrumb}
            <h1 className="m-0 max-w-[640px] text-balance text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[40px] lg:text-[46px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mb-0 mt-3 max-w-[560px] text-[15px] font-medium leading-relaxed text-white sm:text-[17px]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="py-6 sm:py-8">
          {breadcrumb}
          <h1 className="m-0 max-w-[720px] text-balance text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-calma-ink sm:text-[40px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-0 mt-3 max-w-[620px] text-[15px] leading-relaxed text-calma-taupe sm:text-[17px]">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
