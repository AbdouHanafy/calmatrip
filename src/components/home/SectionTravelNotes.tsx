'use client';

import { Globe, Compass, Lightbulb } from "lucide-react";

export default function TravelNotes() {
  const travelNotesGlobal = [
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Local Etiquette Matters",
      description:
        "Learning a few local phrases and customs can transform your travel experience. From bowing in Japan to removing shoes in Southeast Asia, small gestures build bridges.",
    },
    {
      icon: <Compass className="w-6 h-6 text-white" />,
      title: "Off-Peak Magic",
      description:
        "Traveling during shoulder seasons gives you better prices, fewer crowds, and authentic encounters. Discover why September is ideal for Mediterranean coasts.",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: "Sustainable Choices",
      description:
        "Eco-friendly travel is easier than you think: choose local guides, avoid single-use plastics, and respect wildlife. Make your journey a positive force.",
    },
  ];

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FAEDCD 0%, #F4E5CC 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-[#D4A373]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4A373]">
              Travel Notes
            </span>
            <div className="w-6 h-px bg-[#D4A373]" />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Global Travel Insights
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Practical tips, cultural discoveries, and inspiration from around the world
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {travelNotesGlobal.map((note, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#D4A373]/20 hover:-translate-y-1"
            >
              <div className="mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A373] to-[#1E6091] flex items-center justify-center shadow-md">
                  {note.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {note.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {note.description}
              </p>

              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#D4A373] to-[#1E6091] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}