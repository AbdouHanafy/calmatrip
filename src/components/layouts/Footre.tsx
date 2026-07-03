import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0A1A2F] to-[#0A1A2F]/90 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                <img src='/images/logo-calma-trip.jpg' />
              </div>
              <span className="text-xl font-bold tracking-tight">Calmatrip</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner to discover the beauty and cultural richness of Tunisia. Premium transport and excursion services.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="https://www.facebook.com/profile.php?id=61590996770536" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#4CAF50] hover:text-white transition-all duration-300 text-gray-400">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'About Calma', path: '/about' },
                { name: 'Our Services', path: '/services' },
                { name: 'Marketplace', path: '/marketplace' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-gray-400 hover:text-[#87CEEB] transition-colors text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-4">
              {[
                'Airport Transfers',
                'Private Excursions',
                'Corporate Transport',
                'Desert Safari',
                'Local Market Products',
              ].map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-gray-400 hover:text-[#87CEEB] transition-colors text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#87CEEB]"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                <span>Hammamet, Tunisia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-[#4CAF50] shrink-0" />
                <span>+216 21 622 972</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-[#87CEEB] shrink-0" />
                <span>contact@calmatrip.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Calmatrip. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
