"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Facebook, Heart, Loader2, Send, Trash2, Users } from "lucide-react";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
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

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 30) return `Il y a ${days} jours`;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CommunityPageContent() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
      setError("Votre message doit contenir au moins 10 caractères.");
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
        throw new Error(data.error ?? "Une erreur est survenue.");
      }
      setContent("");
      setImage("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce partage ?")) return;
    await fetch(`/api/community/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <CalmaHeader active="community" />
      <main className="min-h-screen bg-calma-cream font-hanken">
        {/* Hero */}
        <section className="bg-calma-olive px-6 pb-16 pt-20 text-center sm:px-10">
          <div className="mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <Users size={13} />
              Communauté
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(30px,4vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] text-calma-cream">
              Partagez votre expérience Calma Trip
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              Racontez votre voyage, donnez votre avis, échangez avec d&apos;autres voyageurs — et
              rejoignez notre groupe Facebook pour ne rien manquer.
            </p>
          </div>
        </section>

        {/* Facebook group CTA */}
        <section className="mx-auto -mt-8 max-w-[720px] px-6 sm:px-10">
          <a
            href={FACEBOOK_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-calma-block border border-calma-olive/10 bg-white p-5 no-underline shadow-[0_18px_40px_-20px_rgba(21,36,46,.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-20px_rgba(21,36,46,.45)] sm:p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1877F2]/10 text-[#1877F2]">
              <Facebook size={22} />
            </div>
            <div className="flex-1">
              <p className="font-fraunces text-lg font-normal text-calma-ink">
                Rejoignez notre groupe Facebook
              </p>
              <p className="text-sm text-calma-taupe">
                Discutez avec la communauté Calma Trip, posez vos questions, partagez vos photos.
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white sm:inline-block">
              Rejoindre →
            </span>
          </a>
        </section>

        {/* Post form */}
        <section className="mx-auto max-w-[720px] px-6 pt-10 sm:px-10">
          <div
            className="rounded-calma-block border border-calma-olive/10 bg-white p-6 sm:p-8"
            style={{ boxShadow: "0 22px 50px -22px rgba(21,36,46,.25)" }}
          >
            {status !== "authenticated" ? (
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-calma-taupe">
                <span>Connectez-vous pour partager votre expérience.</span>
                <Link
                  href="/login?callbackUrl=/community"
                  className="rounded-full bg-calma-terracotta px-5 py-2.5 font-semibold text-calma-ink no-underline"
                >
                  Se connecter
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Racontez votre expérience avec Calma Trip..."
                  className="w-full resize-none rounded-2xl border border-calma-olive/15 bg-calma-cream px-5 py-4 text-[15px] text-calma-ink outline-none transition-colors focus:border-calma-terracotta"
                />
                <p className="-mt-2 text-xs text-calma-taupe">{content.length} / 2000 caractères</p>

                <SingleImageUpload
                  value={image}
                  onChange={setImage}
                  label="Photo"
                  endpoint="/api/community/upload"
                />

                {error && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
                )}
                {submitted && (
                  <p className="rounded-2xl bg-calma-success/10 px-4 py-3 text-sm text-calma-success">
                    Merci ! Votre partage sera publié après validation par notre équipe.
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-calma-cream shadow-[0_14px_28px_-10px_rgba(210,179,139,.6)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  style={{
                    backgroundColor: "#D2B38B",
                  }}
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Partager
                      <Send
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Feed */}
        <section className="mx-auto max-w-[720px] px-6 py-16 sm:px-10">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-calma-block bg-calma-sand" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-calma-block border border-dashed border-calma-olive/20 py-16 text-center text-calma-taupe">
              <Heart className="mx-auto mb-3 h-9 w-9 opacity-30" />
              <p>Aucun partage pour le moment. Soyez le premier !</p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-calma-block border border-calma-olive/10 bg-white p-6"
                  style={{ boxShadow: "0 14px 36px -22px rgba(21,36,46,.3)" }}
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-calma-olive text-sm font-bold text-white">
                          {post.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-calma-ink">{post.authorName}</p>
                        <p className="text-xs text-calma-taupe">{timeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                    {session?.user?.id === post.authorId && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        aria-label="Supprimer"
                        className="rounded-lg p-2 text-calma-taupe transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-calma-ink">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="relative mt-4 h-72 w-full overflow-hidden rounded-2xl bg-calma-sand">
                      <Image src={post.image} alt="" fill className="object-cover" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
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
