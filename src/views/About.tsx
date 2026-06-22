'use client';
import { Award, Heart, Users, Target, CheckCircle, Star, MapPin, Clock, Shield, ChevronRight, Quote, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';

export default function About() {
  const stats = [
    { value: "3+", label: "Years of Experience", icon: Award, gradient: "from-[#87CEEB] to-[#4CAF50]" },
    { value: "500+", label: "Happy Clients", icon: Users, gradient: "from-[#FFD700] to-[#FFC107]" },
    { value: "50+", label: "Modern Vehicles", icon: Clock, gradient: "from-[#4CAF50] to-[#45A049]" },
    { value: "98%", label: "Client Satisfaction", icon: Star, gradient: "from-[#87CEEB] to-[#FFD700]" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Service",
      description: "We love what we do and it shows in every service we provide.",
      gradient: "from-[#87CEEB] to-[#4CAF50]",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "High standards to ensure your complete satisfaction at every step.",
      gradient: "from-[#FFD700] to-[#FFC107]",
    },
    {
      icon: Users,
      title: "Professional Team",
      description: "Experienced drivers and certified tour guides at your service.",
      gradient: "from-[#4CAF50] to-[#45A049]",
    },
    {
      icon: Target,
      title: "Reliability",
      description: "Punctuality and professionalism with every service, 24/7.",
      gradient: "from-[#87CEEB] to-[#FFD700]",
    },
  ];

  const timeline = [
    { year: "2023", event: "Calma trip founded with one vehicle", icon: Briefcase, completed: true },
    { year: "2024", event: "", icon: Target, completed: true },
    { year: "2025", event: "Partnership with major Tunisian hotels", icon: Award, completed: true },
    { year: "2026", event: "Launch of online booking service", icon: Clock, completed: true },
  ];

  const team = [""];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A1A2F] via-[#0F2740] to-[#1B4F6E] text-white overflow-hidden">
        {/* Background Pattern */}
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

        {/* Decorative elements */}
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
              Your trusted partner to discover the beauty and cultural richness of Tunisia since 2023
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

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L1440 0V120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Mission Card */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-1.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
              <div className="p-8 lg:p-10">
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                   We are a Tunisia-based tourism platform offering transfers, excursions, local recommendations and a wide range of tourism services.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We help you understand your destination before you arrive so you can enjoy a smooth, stress-free journey.                </p>
                <div className="space-y-3">
                  {["Personalized customer service", "Modern and comfortable vehicles", "Professional and courteous drivers"].map((item, idx) => (
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

            {/* Vision Card */}
            <div className="group bg-gradient-to-br from-[#0A1A2F] to-[#0F2740] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-1.5 bg-gradient-to-r from-[#FFD700] to-[#FFC107]"></div>
              <div className="p-8 lg:p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  To become the leader in tourism services in Tunisia, recognized for our excellence, 
                  innovation, and commitment to customer satisfaction.
                </p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2 text-[#FFD700]">
                    <Quote className="w-4 h-4" />
                    <span className="text-sm italic">Excellence is our standard</span>
                    <Quote className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">Our Values</span>
              <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What <span className="bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">drives us</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Core values that guide our daily actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group text-center">
                <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">Our Journey</span>
              <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our <span className="text-[#87CEEB]">History</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#87CEEB] via-[#4CAF50] to-[#FFD700] rounded-full"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] z-10 mt-1"></div>
                  
                  {/* Year */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="ml-16 md:ml-0">
                      <div className="inline-flex items-center gap-2 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] bg-clip-text text-transparent">
                          {item.year}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
                        <p className="text-gray-700">{item.event}</p>
                        <div className="mt-3 flex items-center gap-1 text-xs text-[#4CAF50]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Achieved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Empty space for even/odd */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">Our Team</span>
              <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Passionate <span className="bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">professionals</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A dedicated team at your service for unforgettable experiences
            </p>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={`h-1.5 bg-gradient-to-r ${member.gradient}`}></div>
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {member.icon}
                  </div>
                  <div className={`w-16 h-1 mx-auto mb-4 bg-gradient-to-r ${member.gradient} rounded-full`}></div>
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-[#87CEEB] font-medium text-sm mb-2">{member.role}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <GraduationCap className="w-3 h-3" />
                    <span>{member.experience}</span>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          <div className="mt-12 text-center max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-[#87CEEB]/10 via-[#4CAF50]/10 to-[#FFD700]/10 rounded-2xl p-8">
              <p className="text-gray-700 leading-relaxed">
                Our team is made up of passionate professionals dedicated to providing the best possible service. 
                Experienced drivers, certified tour guides, and support staff available 24/7, 
                we are all united by the same vision: making your stay in Tunisia an extraordinary experience.
              </p>
            </div>
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
                Ready to experience Sahara?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join our satisfied clients and discover Tunisia differently
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
