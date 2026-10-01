"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export interface HomeGuide {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string | null;
  image: string | null;
}

// Same card language as ActivityCard (4:3 photo, category, title, one line).
export default function GuideCard({ guide }: { guide: HomeGuide }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="group block no-underline">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-calma-sand">
        {guide.image ? (
          <Image
            src={guide.image}
            alt={guide.title}
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 75vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-calma-ink/35">
            <BookOpen size={40} strokeWidth={1.4} />
          </div>
        )}
      </div>
      <div className="pt-3">
        {guide.category && (
          <div className="mb-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
            {guide.category}
          </div>
        )}
        <h3 className="m-0 line-clamp-2 text-[16px] font-bold leading-snug text-calma-ink group-hover:underline">
          {guide.title}
        </h3>
        <p className="mb-0 mt-1.5 line-clamp-2 text-[13.5px] leading-snug text-calma-taupe">
          {guide.summary}
        </p>
      </div>
    </Link>
  );
}
