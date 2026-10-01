"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Facebook, Heart, Loader2, Send, Trash2 } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import PageHeader from "@/components/calma/PageHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";

// TODO: swap in the real Facebook Group URL if it differs from the main page.
const FACEBOOK_GROUP_URL = "https://www.facebook.com/calmatrip";

interface CommunityPost {
  id: number;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  image: string | null;
  createdAt: string;
}

function CommunityPageContent() {
  const { t, lang } = useCalmaLang();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const timeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diffMs / 86400000);
    if (days === 0) return t.community.today;
    if (days === 1) return t.community.yesterday;
    if (days < 30) return t.community.daysAgo.replace("{n}", String(days));
    const locale = lang === "en" ? "en-US" : lang === "ar" ? "ar-TN" : "fr-FR";
    return new Date(dateStr).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const load = () => {
    setLoading(true);
    fetch("/api/community")
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (content.trim().length < 10) {
      setError(t.community.errorMin);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, image: image || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t.community.errorMin);
      }
      setContent("");
      setImage("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.community.errorMin);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.community.deleteConfirm)) return;
    await fetch(`/api/community/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <CalmaHeader active="community" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={t.community.heroTitle}
          subtitle={t.community.heroSub}
          image="/images/hero/sea.png"
          crumbs={[{ label: t.cnt.breadcrumbHome, href: "/" }, { label: t.community.eyebrow }]}
        />

        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <a
            href={FACEBOOK_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-4 rounded-2xl border border-calma-ink/10 p-5 no-underline transition-colors hover:border-calma-ink/30"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1877F2]/10 text-[#1877F2]">
              <Facebook size={20} />
            </div>
            <div className="flex-1">
              <p className="m-0 text-[16px] font-bold text-calma-ink">{t.community.fbTitle}</p>
              <p className="m-0 text-[14px] text-calma-taupe">{t.community.fbDesc}</p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-calma-ink px-4 py-2 text-[14px] font-semibold text-white sm:inline-block">
              {t.community.fbJoin}
            </span>
          </a>

          <div className="mt-6 rounded-2xl border border-calma-ink/10 bg-white p-5 sm:p-6">
            {status !== "authenticated" ? (
              <div className="flex flex-wrap items-center justify-between gap-3 text-[14.5px] text-calma-taupe">
                <span>{t.community.loginPrompt}</span>
                <Link
                  href="/login?callbackUrl=/community"
                  className="rounded-full bg-calma-ink px-5 py-2.5 text-[14px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
                >
                  {t.community.loginCta}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder={t.community.placeholder}
                  className="w-full resize-none rounded-xl border border-calma-ink/20 bg-white px-4 py-3 text-[15px] text-calma-ink outline-none transition-colors placeholder:text-calma-taupe/70 focus:border-calma-ink"
                />
                <p className="-mt-2 mb-0 text-[12.5px] text-calma-taupe">
                  {t.community.charCount.replace("{n}", String(content.length))}
                </p>

                <SingleImageUpload
                  value={image}
                  onChange={setImage}
                  label={t.community.photoLabel}
                  endpoint="/api/community/upload"
                />

                {error && (
                  <p className="m-0 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-600">
                    {error}
                  </p>
                )}
                {submitted && (
                  <p className="m-0 rounded-xl bg-calma-success/10 px-4 py-3 text-[14px] text-calma-success">
                    {t.community.successMsg}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      {t.community.shareCta}
                      <Send size={16} className="rtl:-scale-x-100" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <section className="pt-8">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 animate-pulse rounded-2xl bg-calma-sand" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-calma-ink/20 py-14 text-center text-calma-taupe">
                <Heart size={36} strokeWidth={1.4} className="mx-auto mb-3 opacity-40" />
                <p className="m-0">{t.community.emptyTitle}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-2xl border border-calma-ink/10 bg-white p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {post.authorAvatar ? (
                          <Image
                            src={post.authorAvatar}
                            alt={post.authorName}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-calma-ink text-[14px] font-bold text-white">
                            {post.authorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="m-0 text-[14.5px] font-bold text-calma-ink">
                            {post.authorName}
                          </p>
                          <p className="m-0 text-[12.5px] text-calma-taupe">
                            {timeAgo(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      {session?.user?.id === post.authorId && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          aria-label={t.community.deleteLabel}
                          className="rounded-lg p-2 text-calma-taupe transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <p className="m-0 whitespace-pre-wrap text-[15px] leading-relaxed text-calma-ink">
                      {post.content}
                    </p>

                    {post.image && (
                      <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-calma-sand">
                        <Image src={post.image} alt="" fill className="object-cover" />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function CommunityPage() {
  return (
    <CalmaLangProvider>
      <CommunityPageContent />
    </CalmaLangProvider>
  );
}
