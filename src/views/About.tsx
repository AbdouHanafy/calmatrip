'use client';
import { Award, Heart, Users, Target, CheckCircle, Star, MapPin, Clock, Shield, ChevronRight, Quote, Briefcase, GraduationCap, Smile, Globe, Zap, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';

export default function About() {
  const stats = [
    { value: "2026", label: "Founded in Hammamet", icon: MapPin, gradient: "from-[#87CEEB] to-[#4CAF50]" },
    { value: "500+", label: "Happy Clients", icon: Users, gradient: "from-[#FFD700] to-[#FFC107]" },
    { value: "50+", label: "Local Partners", icon: Briefcase, gradient: "from-[#4CAF50] to-[#45A049]" },
    { value: "98%", label: "Client Satisfaction", icon: Star, gradient: "from-[#87CEEB] to-[#FFD700]" },
  ];

  const offerings = [
    {
      icon: Smile,
      title: "Stress-Free Planning",
      description:
        "We remove the complexity from your travel experience by handling all the logistical details, allowing you to focus entirely on enjoying your journey rather than managing it.",
      gradient: "from-[#87CEEB] to-[#4CAF50]",
    },
    {
      icon: Shield,
      title: "End-to-End Support",
      description:
        "From the moment you begin your booking until you safely return home, our team provides comprehensive oversight, ensuring reliable assistance at every stage of your trip.",
      gradient: "from-[#FFD700] to-[#FFC107]",
    },
    {
      icon: Award,
      title: "Local Prices",
      description:
        "You get the real Tunisian experience without the inflated tourist rates. Authentic value, every time.",
      gradient: "from-[#4CAF50] to-[#45A049]",
    },
    {
      icon: Zap,
      title: "Instant Care",
      description:
        "We prioritize your comfort and peace of mind by offering quick, responsive service to address any needs or questions before or during the trip.",
      gradient: "from-[#87CEEB] to-[#FFD700]",
    },
  ];

  const languages = [
    { flag: "🇬🇧", lang: "English" },
    { flag: "🇫🇷", lang: "French" },
    { flag: "🇹🇳", lang: "Arabic" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#0A1A2F] via-[#0F2740] to-[#1B4F6E] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="about-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M30 0 L45 15 L30 30 L15 15 Z" fill="#87CEEB" fillOpacity="0.3" />
                  <circle cx="30" cy="30" r="2" fill="#FFD700" />
                  <circle cx="15" cy="15" r="1.5" fill="#4CAF50" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#about-pattern)" />
            </svg>
          </div>

          <div className="absolute top-20 left-10 w-64 h-64 bg-[#87CEEB] rounded-full blur-[100px] opacity-10"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD700] rounded-full blur-[120px] opacity-10"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <Heart className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm font-medium tracking-wide">Who we are</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-[#87CEEB] via-[#FFD700] to-[#4CAF50] bg-clip-text text-transparent">
                  Calma Trip
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Your ultimate travel hub designed for a truly stress-free journey — founded in Hammamet, Tunisia.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center transform group-hover:scale-110 transition-all duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L1440 0V120H0Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

              {/* Story Card */}
              <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="h-1.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
                <div className="p-8 lg:p-10">
                  <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Story</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Founded in Hammamet, Tunisia in 2026, Calma Trip was born from a simple belief: travel should be peaceful. Our name reflects that vision — empowering you to discover the heart of your destination before you even land.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We are more than just a tourism platform and marketplace. We connect you with premium travel services through our trusted local partners, while our team provides consistent, proactive follow-up to ensure every detail goes exactly as planned.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Premium services via trusted local partners",
                      "Proactive follow-up on every booking",
                      "Your satisfaction is our primary commitment",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center group/item">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center mr-3 flex-shrink-0 transition-transform group-hover/item:scale-110">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calm Promise Card */}
              <div className="group bg-gradient-to-br from-[#0A1A2F] to-[#0F2740] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="h-1.5 bg-gradient-to-r from-[#FFD700] to-[#FFC107]"></div>
                <div className="p-8 lg:p-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">The "Calm" Promise</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      With Calma Trip, you can finally travel with peace of mind. Forget the hassle of endless negotiations and multiple bookings — we act as your single, trusted hub to secure all your services instantly.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Your satisfaction is our primary commitment. We actively gather your feedback and provide instant care to guarantee a seamless, worry-free experience from start to finish.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-[#FFD700]">
                      <Quote className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm italic">One hub. All your services. Zero stress.</span>
                      <Quote className="w-4 h-4 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">What We Offer</span>
                <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]"></div>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Everything you need,{" "}
                <span className="bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">
                  handled for you
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From the first click to your safe return home, we've got every detail covered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {offerings.map((item, index) => (
                <div key={index} className="group text-center">
                  <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Destination Specialists Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">Our Team</span>
                <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Destination{" "}
                <span className="bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">
                  Specialists
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our dedicated specialists are always available to act as your personal guides — answering any question, whether it's about your excursion or simply curious inquiries about life in Tunisia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              {languages.map((l, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <span className="text-4xl">{l.flag}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{l.lang}</p>
                    <p className="text-xs text-gray-500">Speaking</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#87CEEB]/10 via-[#4CAF50]/10 to-[#FFD700]/10 rounded-2xl p-8 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-4 text-[#4CAF50]" />
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Beyond simple bookings, our destination specialists are here to help you get the most out of Tunisia — from hidden gems and local dining to cultural tips and travel logistics. Think of us as your personal connection to the real Tunisia.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 0 L30 20 L20 40 L10 20 Z" fill="white" fillOpacity="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cta-pattern)" />
                </svg>
              </div>

              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Ready to travel with calm?
                </h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Join hundreds of satisfied travelers and discover Tunisia — stress-free, fully supported, at local prices.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#1B4F6E] rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
                >
                  <span>Discover our services</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}