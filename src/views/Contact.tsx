'use client';
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ChevronDown, ChevronUp, Star, Award, Headphones, MessageCircle, Globe, CreditCard, Car, Users, Shield } from "lucide-react";
import Link from "next/link";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        }, 3000);
      } else {
        alert("Failed to send message: Server error");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message: Network error");
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+216 21 622 972", "+216 70 000 001"],
      description: "Available 24/7",
      gradient: "from-[#87CEEB] to-[#4CAF50]",
      action: "Call now",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@sahara-tunisia.com", "reservations@sahara-tunisia.com"],
      description: "Response within 24h",
      gradient: "from-[#FFD700] to-[#FFC107]",
      action: "Send email",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Avenue Habib Bourguiba", "Tunis 1000, Tunisia"],
      description: "Visit our office",
      gradient: "from-[#4CAF50] to-[#45A049]",
      action: "View on map",
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Fri: 8:00 - 20:00", "Sat-Sun: 9:00 - 18:00"],
      description: "Customer service",
      gradient: "from-[#87CEEB] to-[#FFD700]",
      action: "Schedule a call",
    },
  ];

  const faqs = [
    {
      q: "How can I book a service?",
      a: "You can book online via our platform, by phone at +216 21 622 972, or by visiting our office in Tunis. Our team is available 24/7 to assist you.",
      icon: Car,
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept cash payments, credit cards (Visa, Mastercard), and bank transfers. Online payment is secure through our platform.",
      icon: CreditCard,
    },
    {
      q: "Can I cancel my reservation?",
      a: "Yes, you can cancel free of charge up to 24 hours before the scheduled date for a full refund. For late cancellations, fees may apply.",
      icon: Clock,
    },
    {
      q: "Do you offer services for groups?",
      a: "Absolutely! We have solutions adapted for groups of all sizes, with minibuses and buses accommodating up to 50 people. Contact us for a custom quote.",
      icon: Users,
    },
    {
      q: "Are the vehicles insured?",
      a: "Yes, all our vehicles are fully insured and regularly maintained. The safety of our passengers is our top priority.",
      icon: Shield,
    },
    {
      q: "Do you provide tour guides?",
      a: "Yes, we provide professional multilingual tour guides (French, English, Arabic) for all our excursions.",
      icon: Award,
    },
  ];

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
              <pattern id="contact-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L45 15 L30 30 L15 15 Z" fill="#87CEEB" fillOpacity="0.3" />
                <circle cx="30" cy="30" r="2" fill="#FFD700" />
                <circle cx="15" cy="15" r="1.5" fill="#4CAF50" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-pattern)" />
          </svg>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#87CEEB] rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FFD700] rounded-full blur-[120px] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <MessageCircle className="w-4 h-4 text-[#87CEEB]" />
              <span className="text-sm font-medium tracking-wide">24/7 Customer Support</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Contact <span className="bg-gradient-to-r from-[#87CEEB] via-[#FFD700] to-[#4CAF50] bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our team is here to answer all your questions and support you in your travel plans
            </p>
          </div>

          {/* Quick contact badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Headphones className="w-4 h-4 text-[#87CEEB]" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Globe className="w-4 h-4 text-[#FFD700]" />
              <span className="text-sm">French - English - Arabic</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Shield className="w-4 h-4 text-[#4CAF50]" />
              <span className="text-sm">100% secure service</span>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L1440 0V120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center mb-5 transform group-hover:scale-110 transition-all duration-300`}>
                  <info.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
                <p className="text-xs text-gray-400 mt-2">{info.description}</p>
                <button className="mt-4 text-sm font-medium text-[#87CEEB] hover:text-[#4CAF50] transition-colors flex items-center gap-1 group">
                  <span>{info.action}</span>
                  <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">Write to us</span>
              <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Send us a <span className="bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">Message</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Fill out the form below and we will get back to you as soon as possible
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              {submitted ? (
                <div className="bg-gradient-to-r from-[#87CEEB]/10 via-[#4CAF50]/10 to-[#FFD700]/10 border border-[#4CAF50]/20 rounded-2xl p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#45A049] flex items-center justify-center animate-scale-in">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#4CAF50] mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for contacting us. Our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-[#87CEEB]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-[#87CEEB]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject <span className="text-[#87CEEB]">*</span>
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="reservation">Booking</option>
                        <option value="information">Information request</option>
                        <option value="reclamation">Complaint</option>
                        <option value="devis">Quote request</option>
                        <option value="autre">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-[#87CEEB]">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#87CEEB]/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map & Info */}
            <div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl h-80 mb-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="map-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="2" fill="#87CEEB" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-pattern)" />
                  </svg>
                </div>
                <MapPin className="w-20 h-20 text-[#87CEEB] opacity-50" />
                <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-1.5 shadow-md">
                  <p className="text-xs text-gray-600">📍 Avenue Habib Bourguiba, Hammamet</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#87CEEB]/5 via-[#4CAF50]/5 to-[#FFD700]/5 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD700]" />
                  Practical Information
                </h3>
                <ul className="space-y-4">
                  {[
                    "Free parking available for visitors",
                    "Office accessible for people with reduced mobility",
                    "Customer service available in French, Arabic, and English",
                    "Cash and credit card payments accepted",
                    "Secure online booking 24/7",
                    "Phone support available 24 hours a day, 7 days a week",
                  ].map((info, idx) => (
                    <li key={idx} className="flex items-start group">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsive Badge */}
              <div className="mt-6 flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Average response time</p>
                    <p className="text-sm font-semibold text-gray-900">Less than 30 minutes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Satisfaction rate</p>
                  <p className="text-sm font-semibold text-[#4CAF50]">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-[#87CEEB] to-[#4CAF50]"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#87CEEB]">FAQ</span>
              <div className="w-8 h-px bg-gradient-to-r from-[#4CAF50] to-[#FFD700]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked <span className="bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Quickly find answers to your most common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center flex-shrink-0">
                      <faq.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                  </div>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#87CEEB]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-0 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pl-14">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600">
              Didn't find an answer?{" "}
              <Link href="/services" className="text-[#87CEEB] hover:text-[#4CAF50] font-semibold transition-colors">
                Contact our support
              </Link>
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
                Need immediate assistance?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Our team is available 24/7 to answer your questions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+21621622972"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#1B4F6E] rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call now</span>
                </a>
                <Link
                  href="https://wa.me/21621622972"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-black/30 transition-all duration-300 border border-white/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
    <Footer />
        </>
  );
}
