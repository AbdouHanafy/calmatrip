'use client';
import { useState, useEffect, useRef, type CSSProperties } from "react";
import { MapPin, ArrowRight,  } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';



/* ─── TICKER ──────────────────────────────────────────────────────────────── */
function Ticker({ items }: { items: string[] }) {
  return (
    <div className="ticker-wrap">
      <div className="ticker-content">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHero() {
const [bookingType, setBookingType] = useState('Transfer');

  return (
    <><section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A1A2F]">
          {/* Background image or gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1A2F] via-[#1B4F6E] to-[#0A1A2F] opacity-90 z-0">
              <Image
                  src="/images/tunisia.jpeg"
                  alt="Hero Background"
                  fill
                  className="object-cover opacity-50" />
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#87CEEB] rounded-full blur-[150px] opacity-20 z-0 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#4CAF50] rounded-full blur-[150px] opacity-10 z-0"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20 pb-24">

              {/* Left Content */}
              <div className="space-y-8 text-white">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                      Discover the world with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]">Calmatrip</span>
                  </h1>

                  <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
                      Seamless airport transfers, breathtaking excursions, and unparalleled comfort. Your journey starts here.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                      <Link href="/services" className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-[#4CAF50]/30 transition-all hover:-translate-y-1">
                          Explore Services <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link href="/contact" className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                          Contact Us
                      </Link>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
                      <div>
                          <div className="text-3xl font-bold text-white">5k+</div>
                          <div className="text-sm text-gray-100 uppercase tracking-widest mt-1">Happy Clients</div>
                      </div>
                      <div>
                          <div className="text-3xl font-bold text-[#87CEEB]">50+</div>
                          <div className="text-sm text-gray-100 uppercase tracking-widest mt-1">Destinations</div>
                      </div>
                      <div>
                          <div className="text-3xl font-bold text-[#4CAF50]">4.9</div>
                          <div className="text-sm text-gray-100 uppercase tracking-widest mt-1">User Rating</div>
                      </div>
                  </div>
              </div>

              {/* Right Booking Widget */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative">
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6">
                      {['Transfer', 'Excursion', 'Corporate'].map((tab) => (
                          <button
                              key={tab}
                              onClick={() => setBookingType(tab)}
                              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${bookingType === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                              {tab}
                          </button>
                      ))}
                  </div>

                  <div className="space-y-5">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">From</label>
                          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#87CEEB] focus-within:ring-1 focus-within:ring-[#87CEEB] transition-all">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <input type="text" placeholder="Pick up location" className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400" />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">To</label>
                          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#4CAF50] focus-within:ring-1 focus-within:ring-[#4CAF50] transition-all">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <input type="text" placeholder="Destination" className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400" />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                              <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-800 focus:border-[#87CEEB] transition-all font-sans" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Time</label>
                              <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-800 focus:border-[#87CEEB] transition-all font-sans" />
                          </div>
                      </div>

                      <button className="w-full py-4 mt-4 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#4CAF50]/30 transition-all hover:-translate-y-0.5">
                          Booking Now
                      </button>
                  </div>
              </div>

          </div>
      </section><div className="py-4" style={{ background: "#0F2828" }}>
                       {/* ═══════════════ TICKER ═════════════════════════════════════════════ */}
              <Ticker
                  items={[
                      "Premium transfers",
                      "Private excursions",
                      "Airport pickups",
                      "Djerba · Tozeur · Carthage · Sousse",
                      "Available 24/7",
                      "Free quotes",
                  ]} />
          </div></>
        );
       
        

  
}

export default SectionHero;
