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
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';
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

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "Food & Drink", label: "Food & Drink", icon: Coffee },
  { id: "Sight", label: "Sights", icon: Landmark },
  { id: "Activity", label: "Activities", icon: Mountain },
  { id: "Hidden Gem", label: "Hidden Gems", icon: MapPinned },
];

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
    image: "https://images.unsplash.com/photo-1549444158-947703358057?auto=format&fit=crop&q=80&w=1000",
    description: "The world's third largest Roman amphitheatre and a UNESCO World Heritage site.",
    rating: 4.9,
    reviews: 3200,
    tags: ["History", "UNESCO", "Colosseum"],
    duration: "2-3 hours",
    city: "Mahdia",
    budget: 1,
    coordinates: { lat: 35.2961, lng: 10.7064 }
  },
  {
    id: 7,
    title: "Djerba Hood",
    category: "Activity",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1000",
    description: "An open-air museum of street art in the traditional village of Erriadh.",
    rating: 4.7,
    reviews: 1450,
    tags: ["Art", "Culture", "Walk"],
    duration: "2 hours",
    city: "Djerba",
    budget: 1,
    coordinates: { lat: 33.8406, lng: 10.8524 }
  }
];

export default function ExplorePage() {
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
      <Navbar />
      <main className="min-h-screen bg-[#FAEDCD]/20 font-sans pb-32">
        
        {/* HERO SECTION */}
        <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/tunisia.jpeg" 
              alt="Explore Tunisia" 
              fill 
              className="object-cover transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A3A]/90 via-[#1E3A3A]/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-3 mb-4 animate-fade-in">
              <Sparkles size={16} className="text-[#D4A373]" />
              <span className="text-xs uppercase tracking-[0.4em] text-[#D4A373] font-bold">The Calmatrip Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
              Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A373] to-[#FAEDCD] italic">Soul</span> of Tunisia
            </h1>

            <div className="max-w-xl mx-auto relative group translate-y-4 animate-fade-in [animation-delay:200ms]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#D4A373] transition-colors" />
              <input 
                type="text" 
                placeholder="Where do you want to go?" 
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-[#D4A373]/50 focus:bg-white/10 transition-all shadow-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* FILTERS SECTION */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
          <div className="bg-white/95 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(30,58,58,0.2)] border border-white flex flex-col gap-6">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Category Scroll */}
              <div className="flex gap-2 min-w-0 max-w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-500 whitespace-nowrap text-sm
                      ${selectedCategory === cat.id 
                        ? "bg-[#1E3A3A] text-white shadow-xl scale-[1.02]" 
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"}
                    `}
                  >
                    <cat.icon size={16} />
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="h-8 w-px bg-gray-200 hidden md:block" />
                
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 outline-none focus:ring-2 focus:ring-[#D4A373]/30 transition-all cursor-pointer"
                >
                  {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>

                <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Budget</span>
                  {[1, 2, 3].map(b => (
                    <button 
                      key={b}
                      onClick={() => setBudgetLimit(b)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold transition-all
                        ${budgetLimit === b ? "bg-[#D4A373] text-white shadow-md" : "bg-white text-gray-300 hover:text-gray-500 border border-gray-100"}
                      `}
                    >
                      {"$".repeat(b)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <button 
                  onClick={handleGeolocation}
                  className="p-3.5 bg-gray-50 rounded-xl text-gray-400 hover:bg-[#1E3A3A] hover:text-white transition-all border border-gray-100"
                  title="Use My Location"
                >
                  <Navigation size={18} />
                </button>
                <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${viewMode === "list" ? "bg-white shadow-md text-[#1E3A3A]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    List
                  </button>
                  <button 
                    onClick={() => setViewMode("map")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${viewMode === "map" ? "bg-white shadow-md text-[#1E3A3A]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Map
                  </button>
                </div>
              </div>
            </div>

            {/* Active Tags & Sorting */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Filters:</span>
                  {activeFilters.map(filter => (
                    <button 
                      key={filter.id}
                      onClick={filter.onClear}
                      className="px-3 py-1.5 bg-[#D4A373]/10 text-[#D4A373] text-[11px] font-bold rounded-lg border border-[#D4A373]/20 flex items-center gap-2 hover:bg-[#D4A373] hover:text-white transition-all group"
                    >
                      {filter.label}
                      <span className="text-lg leading-none opacity-50 group-hover:opacity-100">&times;</span>
                    </button>
                  ))}
                  <button onClick={clearFilters} className="text-[11px] font-bold text-gray-400 hover:text-[#1E3A3A] underline underline-offset-4 ml-2">Clear All</button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-[11px] font-bold text-gray-600 outline-none bg-transparent cursor-pointer hover:text-[#D4A373]"
                  >
                    <option>Popularity</option>
                    <option>Rating</option>
                    <option>Reviews</option>
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
                      className={`group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-30px_rgba(30,58,58,0.15)] transition-all duration-700 border border-transparent hover:border-[#D4A373]/10 animate-fade-in`}
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
                          <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1E3A3A] shadow-xl">
                            {place.category}
                          </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                           <div className="flex gap-2">
                             {place.tags?.slice(0, 2).map((tag) => (
                               <span key={tag} className="px-3 py-1 bg-[#1E3A3A]/40 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-tighter rounded-md border border-white/20">
                                 {tag}
                               </span>
                             ))}
                           </div>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                            <span className="text-sm font-black text-gray-900">{place.rating}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">({place.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold uppercase tracking-wide">
                            {place.duration ? <><Clock size={14} className="text-[#D4A373]" /> {place.duration}</> : <><MapPin size={14} className="text-[#D4A373]" /> {place.city}</>}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-[#1E3A3A] mb-3 group-hover:text-[#D4A373] transition-colors duration-300 tracking-tight leading-tight">
                          {place.title}
                        </h3>
                        <p className="text-gray-500/80 leading-relaxed text-sm mb-8 line-clamp-2 italic font-medium">
                          {place.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                          <div className="flex items-center gap-1">
                             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mr-2 leading-none">Budget</span>
                             <span className="text-sm font-black text-[#D4A373] leading-none">{"$".repeat(place.budget)}</span>
                          </div>
                          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1E3A3A] group-hover:text-[#D4A373] transition-all">
                            Discovery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center animate-fade-in">
                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Search size={32} className="text-gray-300" />
                   </div>
                   <h3 className="text-3xl font-bold text-[#1E3A3A] mb-4">No treasures found...</h3>
                   <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">We couldn't find anything matching your exact criteria. Try broadening your search or exploring a different category.</p>
                   <button 
                    onClick={clearFilters}
                    className="px-10 py-4 bg-[#1E3A3A] text-white rounded-2xl font-bold hover:bg-[#D4A373] transition-all shadow-2xl"
                   >
                     Reset All Filters
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
      <Footer />

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