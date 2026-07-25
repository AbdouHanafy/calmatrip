'use client';

import React, { useState } from 'react';
import { 
  Coffee, 
  Landmark, 
  Mountain, 
  Sparkles, 
  MapPinned, 
  Search, 
  Star, 
  MapPin, 
  Navigation,
  ArrowRight,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { CalmaLangProvider, useCalmaLang } from '@/lib/calma/i18n';
import CalmaHeader from '@/components/calma/CalmaHeader';
import CalmaFooter from '@/components/calma/CalmaFooter';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const MapExplorer = dynamic(() => import('@/components/explore/MapExplorer'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-900/50 animate-pulse rounded-3xl flex items-center justify-center font-bold text-gray-400">Loading Map...</div>
});

interface Place {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviews?: number;
  tags?: string[];
  duration?: string;
  location?: string;
  city: string;
  budget: number; // 1: Cheap, 2: Moderate, 3: Premium
  coordinates: {
    lat: number;
    lng: number;
  };
}

const CATEGORY_IDS = ["all", "Food & Drink", "Sight", "Activity", "Hidden Gem"];
const CATEGORY_ICONS = [Sparkles, Coffee, Landmark, Mountain, MapPinned];

const cities = ["All Cities", "Tunis", "Kairouan", "Douz", "Tozeur", "Carthage", "Sidi Bou Said"];

const allPlaces: Place[] = [
  {
    id: 1,
    title: "Great Mosque of Kairouan",
    category: "Sight",
    image: "/images/explore/kairouan_mosque.png",
    description: "One of Islam's oldest mosques with stunning architecture and a majestic courtyard.",
    rating: 4.9,
    reviews: 1240,
    tags: ["History", "Architecture", "Sacred"],
    duration: "1-2 hours",
    city: "Kairouan",
    budget: 1,
    coordinates: { lat: 35.6811, lng: 10.1039 }
  },
  {
    id: 2,
    title: "Café des Nattes",
    category: "Food & Drink",
    image: "/images/explore/sidi_bou_said.png",
    description: "Legendary café overlooking Sidi Bou Said, famous for its tea with pine nuts and views.",
    rating: 4.8,
    reviews: 850,
    tags: ["View", "Local Tea", "Sunset"],
    duration: "45 mins",
    city: "Sidi Bou Said",
    budget: 2,
    coordinates: { lat: 36.8711, lng: 10.3458 }
  },
  {
    id: 3,
    title: "Sahara Camel Trek",
    category: "Activity",
    image: "/images/explore/sahara_camel.png",
    description: "Experience the magic of the golden dunes of Douz on a traditional camel caravan.",
    rating: 4.9,
    reviews: 2100,
    tags: ["Desert", "Adventure", "Camping"],
    duration: "3-4 hours",
    city: "Douz",
    budget: 3,
    coordinates: { lat: 33.4611, lng: 9.0203 }
  },
  {
    id: 4,
    title: "Punic Ports, Carthage",
    category: "Hidden Gem",
    image: "/images/explore/carthage_ports.png",
    description: "Ancient naval harbors of Carthage, a peaceful site steeped in Punic and Roman history.",
    rating: 4.8,
    reviews: 540,
    tags: ["History", "Coast", "Ruins"],
    city: "Carthage",
    budget: 1,
    coordinates: { lat: 36.8406, lng: 10.3228 }
  },
  {
    id: 5,
    title: "Chebika Oasis",
    category: "Hidden Gem",
    image: "/images/explore/chebika_oasis.png",
    description: "A breathtaking mountain oasis featuring waterfalls and lush palms amidst rugged canyons.",
    rating: 4.9,
    reviews: 620,
    tags: ["Nature", "Hiking", "Oasis"],
    city: "Tozeur",
    budget: 2,
    coordinates: { lat: 34.3211, lng: 8.1203 }
  },
  {
    id: 6,
    title: "El Jem Amphitheatre",
    category: "Sight",
    image: "/images/explore/El Jem Amphitheatre.jpg",
    description: "The world's third largest Roman amphitheatre and a UNESCO World Heritage site.",
    rating: 4.9,
    reviews: 3200,
    tags: ["History", "UNESCO", "Colosseum"],
    duration: "2-3 hours",
    city: "Mahdia",
    budget: 1,
    coordinates: { lat: 35.2961, lng: 10.7064 }
  },
  
];

function ExplorePageContent() {
  const { t } = useCalmaLang();
  const categories = CATEGORY_IDS.map((id, i) => ({
    id,
    label: [t.exp.catAll, t.exp.catFood, t.exp.catSights, t.exp.catActivities, t.exp.catHidden][i],
    icon: CATEGORY_ICONS[i],
  }));
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [budgetLimit, setBudgetLimit] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [sortBy, setSortBy] = useState("Popularity");

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCity("All Cities");
    setBudgetLimit(3);
    setSearchQuery("");
  };

  const filteredPlaces = allPlaces.filter(place => {
    const matchesSearch = place.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         place.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || place.category === selectedCategory;
    const matchesCity = selectedCity === "All Cities" || place.city === selectedCity;
    const matchesBudget = place.budget <= budgetLimit;

    return matchesSearch && matchesCategory && matchesCity && matchesBudget;
  }).sort((a, b) => {
    if (sortBy === "Rating") return b.rating - a.rating;
    if (sortBy === "Reviews") return (b.reviews || 0) - (a.reviews || 0);
    return 0; // Default to Popularity (mocked by array order)
  });

  const activeFilters = [
    ...(selectedCategory !== "all" ? [{ id: 'cat', label: selectedCategory, onClear: () => setSelectedCategory("all") }] : []),
    ...(selectedCity !== "All Cities" ? [{ id: 'city', label: selectedCity, onClear: () => setSelectedCity("All Cities") }] : []),
    ...(budgetLimit < 3 ? [{ id: 'budget', label: `$${"$".repeat(budgetLimit)} Limit`, onClear: () => setBudgetLimit(3) }] : []),
    ...(searchQuery ? [{ id: 'search', label: `"${searchQuery}"`, onClear: () => setSearchQuery("") }] : []),
  ];

  return (
    <>
      <CalmaHeader active="explore" />
      <main className="min-h-screen bg-calma-sand font-hanken pb-32">

        {/* ── Hero — cinematic, photo-backed, sand texture ── */}
        <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-6 pb-24 pt-16 text-center sm:px-10">
          <Image
            src="/images/explore/sahara_camel.png"
            alt="Sahara, Tunisie"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg,rgba(42,38,34,.68) 0%,rgba(42,38,34,.5) 45%,rgba(42,38,34,.82) 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[.07]"
            style={{
              backgroundImage: 'repeating-linear-gradient(100deg,transparent 0 26px,#F8F5F0 26px 27px)',
            }}
          />
          <div className="relative z-[2] mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
              {t.exp.eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.05] tracking-[-0.02em] text-calma-cream">
              {t.exp.heroTitle}
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              {t.exp.heroSub}
            </p>
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 -mt-16 relative z-20 mb-10">
          <div className="relative group" style={{ boxShadow: '0 24px 56px -24px rgba(42,38,34,.5)' }}>
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-calma-taupe group-focus-within:text-calma-terracotta transition-colors" />
            <input
              type="text"
              placeholder={t.exp.searchPh}
              className="w-full h-14 rounded-[28px] border border-white/50 bg-white/90 pl-14 pr-6 text-calma-ink outline-none backdrop-blur-xl transition-all placeholder:text-calma-taupe focus:ring-2 focus:ring-calma-terracotta/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* FILTERS SECTION */}
        <section className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="flex flex-col gap-6 rounded-[28px] border border-calma-olive/10 bg-calma-cream/95 p-4 backdrop-blur-2xl md:p-6" style={{ boxShadow: '0 20px 50px -24px rgba(42,38,34,.3)' }}>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Category Scroll — sliding pill */}
              <div className="flex gap-1.5 min-w-0 max-w-full overflow-x-auto pb-1 calma-scrollbar-hide rounded-full">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="relative flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-calma-taupe transition-colors data-[active=true]:text-white"
                    data-active={selectedCategory === cat.id}
                  >
                    {selectedCategory === cat.id && (
                      <motion.span
                        layoutId="explore-cat-pill"
                        className="absolute inset-0 rounded-full bg-calma-olive"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <cat.icon size={15} className="relative z-[1]" />
                    <span className="relative z-[1]">{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="h-8 w-px bg-calma-olive/10 hidden md:block" />

                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-white px-4 py-2.5 rounded-full border border-calma-olive/15 text-xs font-bold text-calma-ink outline-none focus:border-calma-terracotta transition-colors cursor-pointer"
                >
                  {cities.map(city => <option key={city} value={city}>{city === "All Cities" ? t.exp.allCities : city}</option>)}
                </select>

                <div className="flex items-center gap-1.5 bg-white px-3.5 py-2.5 rounded-full border border-calma-olive/15">
                  <span className="text-[10px] font-bold text-calma-taupe uppercase tracking-widest mr-1">{t.exp.budgetLabel}</span>
                  {[1, 2, 3].map(b => (
                    <button
                      key={b}
                      onClick={() => setBudgetLimit(b)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all
                        ${budgetLimit === b ? "bg-calma-terracotta text-white shadow-sm" : "bg-calma-sand text-calma-taupe hover:text-calma-ink"}
                      `}
                    >
                      {"$".repeat(b)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleGeolocation}
                  className="p-3 bg-white rounded-full text-calma-taupe hover:bg-calma-olive hover:text-white transition-colors border border-calma-olive/15"
                  title={t.exp.useLocation}
                >
                  <Navigation size={17} />
                </button>
                <div className="bg-calma-sand p-1 rounded-full flex gap-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${viewMode === "list" ? "bg-white shadow-sm text-calma-ink" : "text-calma-taupe hover:text-calma-ink"}`}
                  >
                    {t.exp.listLabel}
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${viewMode === "map" ? "bg-white shadow-sm text-calma-ink" : "text-calma-taupe hover:text-calma-ink"}`}
                  >
                    {t.exp.mapLabel}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Tags & Sorting */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-calma-olive/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-calma-taupe uppercase tracking-widest mr-2">{t.exp.filtersLabel}:</span>
                  {activeFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={filter.onClear}
                      className="px-3 py-1.5 bg-calma-terracotta/10 text-calma-terracotta text-[11px] font-bold rounded-full border border-calma-terracotta/20 flex items-center gap-2 hover:bg-calma-terracotta hover:text-white transition-all group"
                    >
                      {filter.label}
                      <span className="text-lg leading-none opacity-50 group-hover:opacity-100">&times;</span>
                    </button>
                  ))}
                  <button onClick={clearFilters} className="text-[11px] font-bold text-calma-taupe hover:text-calma-ink underline underline-offset-4 ml-2">{t.exp.clearAll}</button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-calma-taupe uppercase tracking-widest">{t.exp.sortLabel}:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-[11px] font-bold text-calma-ink outline-none bg-transparent cursor-pointer hover:text-calma-terracotta"
                  >
                    <option value="Popularity">{t.exp.sortPopularity}</option>
                    <option value="Rating">{t.exp.sortRating}</option>
                    <option value="Reviews">{t.exp.sortReviews}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* MAIN CONTENT AREA */}
        <section className="max-w-7xl mx-auto px-6 pt-12">
          {viewMode === "list" ? (
            <>
              {filteredPlaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredPlaces.map((place, idx) => (
                    <div 
                      key={place.id} 
                      className={`group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-30px_rgba(30,58,58,0.15)] transition-all duration-700 border border-transparent hover:border-[#F2994A]/10 animate-fade-in`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="relative h-72 overflow-hidden">
                        <Image 
                          src={place.image} 
                          alt={place.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                        />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-[#4A667D] shadow-xl">
                            {place.category}
                          </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                           <div className="flex gap-2">
                             {place.tags?.slice(0, 2).map((tag) => (
                               <span key={tag} className="px-3 py-1 bg-[#4A667D]/40 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-tighter rounded-md border border-white/20">
                                 {tag}
                               </span>
                             ))}
                           </div>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-1.5 bg-calma-sand px-3 py-1.5 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-[#F2994A] text-[#F2994A]" />
                            <span className="text-sm font-black text-calma-ink">{place.rating}</span>
                            <span className="text-[10px] text-calma-taupe font-bold uppercase">({place.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-calma-taupe text-[11px] font-bold uppercase tracking-wide">
                            {place.duration ? <><Clock size={14} className="text-[#F2994A]" /> {place.duration}</> : <><MapPin size={14} className="text-[#F2994A]" /> {place.city}</>}
                          </div>
                        </div>
                        
                        
                        
                        
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center animate-fade-in">
                   <div className="w-24 h-24 bg-calma-cream rounded-full flex items-center justify-center mx-auto mb-8">
                      <Search size={32} className="text-calma-taupe/50" />
                   </div>
                   <h3 className="mb-4 font-fraunces text-3xl font-normal text-calma-ink">{t.exp.emptyTitle}</h3>
                   <p className="text-calma-taupe max-w-md mx-auto mb-10 leading-relaxed">{t.exp.emptySub}</p>
                   <button
                    onClick={clearFilters}
                    className="px-10 py-4 bg-[#4A667D] text-white rounded-2xl font-bold hover:bg-[#F2994A] transition-all shadow-2xl"
                   >
                     {t.exp.resetFilters}
                   </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-white animate-fade-in">
               <MapExplorer places={filteredPlaces} userLocation={userLocation} />
            </div>
          )}
        </section>

      </main>
      <CalmaFooter />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

export default function ExplorePage() {
  return (
    <CalmaLangProvider>
      <ExplorePageContent />
    </CalmaLangProvider>
  );
}
