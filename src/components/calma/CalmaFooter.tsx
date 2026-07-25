'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, Check } from 'lucide-react';
import { useCalmaLang } from '@/lib/calma/i18n';

function NewsletterForm() {
  const { t } = useCalmaLang();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-calma-terracotta-soft">
        <Check className="h-4 w-4" />
        {t.newsletterSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-[320px] items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.newsletterPlaceholder}
        className="min-w-0 flex-1 rounded-full border border-calma-cream/20 bg-calma-cream/[.06] px-4 py-2.5 text-sm text-calma-cream placeholder:text-calma-cream/40 outline-none focus:border-calma-terracotta-soft"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        aria-label={t.newsletterCta}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-calma-terracotta text-white transition-colors hover:bg-calma-terracotta-deep disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function CalmaFooter() {
  const { t } = useCalmaLang();

  const exploreLinks = [t.cats[0].title, t.cats[1].title, t.cats[2].title, t.cats[3].title];

  return (
    <footer className="mt-20 bg-[#221F1D] font-hanken text-calma-cream">
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-8 px-6 pb-14 pt-[52px] sm:px-10">
        <div className="max-w-[280px]">
          <Link href="/" className="mb-4 flex items-center no-underline">
            <Image src="/images/logo-cream.png" alt="Calma Trip" width={252} height={78} className="h-8 w-auto" />
          </Link>
          <p className="m-0 text-[13.5px] leading-[1.55] text-calma-cream/[.68]">{t.footTag}</p>
        </div>

        <div className="flex flex-wrap gap-14">
          <div>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-[.12em] text-calma-terracotta-soft">
              {t.footExplore}
            </div>
            <div className="flex flex-col gap-2.5 text-sm">
              {exploreLinks.map((label) => (
                <Link key={label} href="/explore" className="text-calma-cream/[.82] no-underline hover:text-calma-cream">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-[.12em] text-calma-terracotta-soft">
              {t.footCompany}
            </div>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/about" className="text-calma-cream/[.82] no-underline hover:text-calma-cream">
                {t.navAbout}
              </Link>
              <Link href="/services" className="text-calma-cream/[.82] no-underline hover:text-calma-cream">
                {t.navServices}
              </Link>
              <Link href="/contact" className="text-calma-cream/[.82] no-underline hover:text-calma-cream">
                {t.navContact}
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-[300px]">
          <div className="mb-3.5 text-xs font-bold uppercase tracking-[.12em] text-calma-terracotta-soft">
            {t.newsletterTitle}
          </div>
          <p className="mb-3.5 text-[13px] leading-[1.5] text-calma-cream/[.68]">{t.newsletterSub}</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-calma-cream/[.14]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-2.5 px-6 py-[18px] text-[12.5px] text-calma-cream/60 sm:px-10">
          <span>© {new Date().getFullYear()} Calma Trip · Tunisie</span>
          <span>Paiement sécurisé · Support 24/7</span>
        </div>
      </div>
    </footer>
  );
}
