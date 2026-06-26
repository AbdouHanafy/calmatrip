"use client";

import { useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

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
          className={
            s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
          }
        />
      ))}
    </div>
  );
}

function Avatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-white shadow">
      <span className="text-white font-bold text-lg">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

 useEffect(() => {
  fetch("/api/reviews")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      setReviews(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Reviews fetch error:", err);
      setReviews([]);
      setLoading(false);
    });
}, []);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % reviews.length);
    }, 5000);
  };

  useEffect(() => {
  fetch("/api/reviews")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      setReviews(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Reviews fetch error:", err);
      setReviews([]);
      setLoading(false);
    });
}, []);

  useEffect(() => {
    if (reviews.length > 1) resetAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [reviews]);

  const go = (dir: number) => {
    setCurrent((c) => (c + dir + reviews.length) % reviews.length);
    resetAuto();
  };

  // Average rating
  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
            <div className="h-48 bg-gray-200 rounded-2xl max-w-2xl mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  const review = reviews[current];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            What our clients say
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
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">{avg}</span>
              <span className="text-gray-500 text-sm">
                ({reviews.length} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Main card */}
        <div className="relative max-w-3xl mx-auto">
          <div
            key={review.id}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden"
          >
            {/* Quote icon */}
            <Quote
              className="absolute top-6 right-8 text-blue-100"
              size={64}
              strokeWidth={1}
            />

            {/* Stars + service */}
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={review.rating} />
              {review.service && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                  {review.service}
                </span>
              )}
            </div>

            {/* Comment */}
            <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10">
              &ldquo;{review.comment}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <Avatar name={review.name} avatar={review.avatar} />
              <div>
                <p className="font-semibold text-gray-900">{review.name}</p>
                <p className="text-sm text-gray-400">
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
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
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
                    ? "w-8 h-2.5 bg-blue-600"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}