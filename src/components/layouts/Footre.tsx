import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#143f5f] pb-10 pt-20 text-white">
      {/* Motif zellige en filigrane */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id="zellige-footer" width="56" height="56" patternUnits="userSpaceOnUse">
            <path
              d="M28 2 L34 22 L54 28 L34 34 L28 54 L22 34 L2 28 L22 22 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            <circle cx="28" cy="28" r="4" fill="none" stroke="#ffffff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zellige-footer)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div className="space-y-6">
            <Link href="/" className="flex-shrink-0">
              <span className="font-serif text-2xl tracking-tight text-white">
                Calma <em className="italic text-[#D4A373]">Trip</em>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              Your trusted partner to discover the beauty and cultural richness
              of Tunisia. Premium transport and excursion services.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="https://www.facebook.com/profile.php?id=61590996770536"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-300 hover:border-[#D4A373] hover:bg-[#D4A373] hover:text-[#143f5f]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="mb-6 text-[0.72rem] uppercase tracking-[0.22em] text-[#D4A373]">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'About Calma', path: '/about' },
                { name: 'Our Services', path: '/services' },
                { name: 'Marketplace', path: '/marketplace' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <span className="h-px w-4 bg-[#D4A373]/50 transition-all group-hover:w-6 group-hover:bg-[#D4A373]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-[0.72rem] uppercase tracking-[0.22em] text-[#D4A373]">
              Our Services
            </h3>
            <ul className="space-y-4">
              {[
                'Airport Transfers',
                'Private Excursions',
                'Corporate Transport',
                'Desert Safari',
                'Local Market Products',
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <span className="h-px w-4 bg-[#D4A373]/50 transition-all group-hover:w-6 group-hover:bg-[#D4A373]" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-[0.72rem] uppercase tracking-[0.22em] text-[#D4A373]">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A373]" />
                <span>Hammamet, Tunisia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-5 w-5 shrink-0 text-[#D4A373]" />
                <span>+216 21 622 972</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="h-5 w-5 shrink-0 text-[#D4A373]" />
                <span>contact@calmatrip.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Calma Trip. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-white/40 transition-colors hover:text-[#D4A373]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 transition-colors hover:text-[#D4A373]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
