import { useMemo, useState } from "react";
import {
  allPlaces,
  mapEventToPlace,
  mapMuseumToPlace,
  STATIC_CITIES,
  type EventItem,
  type MuseumItem,
  type Place,
} from "@/lib/explore/places";

export function useExploreFilters(events: EventItem[], museums: MuseumItem[]) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [budgetLimit, setBudgetLimit] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState("Popularity");

  const places = useMemo<Place[]>(
    () => [...allPlaces, ...events.map(mapEventToPlace), ...museums.map(mapMuseumToPlace)],
    [events, museums],
  );

  const cities = useMemo(() => {
    const extra = [...events.map((e) => e.city), ...museums.map((m) => m.city)];
    return [
      ...STATIC_CITIES,
      ...Array.from(new Set(extra)).filter((c) => !STATIC_CITIES.includes(c)),
    ];
  }, [events, museums]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.error("Error getting location", error);
        },
      );
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCity("All Cities");
    setBudgetLimit(3);
    setSearchQuery("");
  };

  const filteredPlaces = places
    .filter((place) => {
      const matchesSearch =
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || place.category === selectedCategory;
      const matchesCity = selectedCity === "All Cities" || place.city === selectedCity;
      const matchesBudget = place.budget <= budgetLimit;

      return matchesSearch && matchesCategory && matchesCity && matchesBudget;
    })
    .sort((a, b) => {
      if (sortBy === "Rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === "Reviews") return (b.reviews || 0) - (a.reviews || 0);
      return 0; // Default to Popularity (mocked by array order)
    });

  const activeFilters = [
    ...(selectedCategory !== "all"
      ? [{ id: "cat", label: selectedCategory, onClear: () => setSelectedCategory("all") }]
      : []),
    ...(selectedCity !== "All Cities"
      ? [{ id: "city", label: selectedCity, onClear: () => setSelectedCity("All Cities") }]
      : []),
    ...(budgetLimit < 3
      ? [
          {
            id: "budget",
            label: `$${"$".repeat(budgetLimit)} Limit`,
            onClear: () => setBudgetLimit(3),
          },
        ]
      : []),
    ...(searchQuery
      ? [{ id: "search", label: `"${searchQuery}"`, onClear: () => setSearchQuery("") }]
      : []),
  ];

  return {
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity,
    budgetLimit,
    setBudgetLimit,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    userLocation,
    sortBy,
    setSortBy,
    cities,
    handleGeolocation,
    clearFilters,
    filteredPlaces,
    activeFilters,
  };
}
