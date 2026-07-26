"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface Review {
  id: number;
  name: string;
  avatar: string | null;
  rating: number;
  comment: string;
  service: string | null;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "fill-calma-gold text-calma-gold" : "text-calma-olive/15"}
        />
      ))}
    </div>
  );
}

function Avatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-calma-terracotta flex items-center justify-center ring-2 ring-white shadow">
      <span className="text-white font-bold text-lg">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const { t } = useCalmaLang();
  const [current, setCurrent] = useState(0);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % reviews.length);
    }, 5000);
  };

  useEffect(() => {
    if (reviews.length > 1) resetAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [reviews]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (dir: number) => {
    setCurrent((c) => (c + dir + reviews.length) % reviews.length);
    resetAuto();
  };

  // Average rating
  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (reviews.length === 0) return null;

  const review = reviews[current];

  return (
    <section className="py-20 bg-calma-sand font-hanken">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-fraunces text-[clamp(28px,3.4vw,40px)] font-normal tracking-[-0.02em] text-calma-ink mb-3">
            {t.testiHeading}
          </h2>
          {avg && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={20}
                    className={
                      s <= Math.round(Number(avg))
                        ? "fill-calma-gold text-calma-gold"
                        : "text-calma-olive/15"
                    }
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-calma-ink">{avg}</span>
              <span className="text-calma-taupe text-sm">({reviews.length} reviews)</span>
            </div>
          )}
        </div>

        {/* Main card */}
        <div className="relative max-w-3xl mx-auto">
          <div
            key={review.id}
            className="bg-calma-cream rounded-calma-card border border-calma-olive/[.12] p-8 md:p-12 relative overflow-hidden"
          >
            {/* Quote icon */}
            <Quote
              className="absolute top-6 right-8 text-calma-terracotta/15"
              size={64}
              strokeWidth={1}
            />

            {/* Stars + service */}
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={review.rating} />
              {review.service && (
                <span className="text-xs bg-calma-terracotta/10 text-calma-terracotta px-2.5 py-1 rounded-full font-medium">
                  {review.service}
                </span>
              )}
            </div>

            {/* Comment */}
            <p className="font-fraunces italic text-calma-ink text-lg leading-relaxed mb-8 relative z-10">
              &ldquo;{review.comment}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <Avatar name={review.name} avatar={review.avatar} />
              <div>
                <p className="font-semibold text-calma-olive">{review.name}</p>
                <p className="text-sm text-calma-taupe">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-calma-cream rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} className="text-calma-olive" />
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-calma-cream rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight size={20} className="text-calma-olive" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  resetAuto();
                }}
                className={`transition-all rounded-full ${
                  i === current
                    ? "w-8 h-2.5 bg-calma-terracotta"
                    : "w-2.5 h-2.5 bg-calma-olive/20 hover:bg-calma-olive/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
