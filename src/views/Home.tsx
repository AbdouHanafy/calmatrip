'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plane, MapPin, Compass, ArrowRight, Star, Shield, Car,Users } from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';
import SectionHero from '@/components/home/SectionHero';
import SectionService from '@/components/home/SectionService';
import SectionTravelNotes from '@/components/home/SectionTravelNotes';
import CTASection from '@/components/home/CTASection';
import ExploreSection from '@/components/home/ExploreSection';

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  useEffect(() => {
  let isMounted = true;

  const loadServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();

      const activeServices = data
        .filter((service: any) => service.active !== false)
        .map((service: any, index: number) => {
          const category = (service.category || "").toLowerCase();

          let icon = Car;

          if (
            category.includes("airport") ||
            category.includes("transfer") ||
            category.includes("transport")
          ) {
            icon = Plane;
          } else if (
            category.includes("tour") ||
            category.includes("excursion")
          ) {
            icon = MapPin;
          } else if (
            category.includes("group") ||
            category.includes("vip")
          ) {
            icon = Users;
          }

          return {
            id: service.id,
            title: service.title,
            subtitle: service.subtitle || service.category || "Premium Service",
            description: service.description,
            price: service.price ? `${service.price} TND` : "Contact us",
            features: Array.isArray(service.features)
              ? service.features
              : typeof service.features === "string"
              ? service.features.split(",").map((f: string) => f.trim())
              : [],
            images: parseImages(service.image),
            icon,
            color: index % 2 === 0 ? "#D4A373" : "#1E6091",
          };
        });

      if (isMounted) setServices(activeServices);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      if (isMounted) setLoadingServices(false);
    }
  };

  loadServices();

  return () => {
    isMounted = false;
  };
}, []);

function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {}

  return [raw];
}
  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans">
        
        {/* HERO SECTION */}
        <SectionHero />
        <SectionService services={services} />
        <ExploreSection />
        <SectionTravelNotes />
        <CTASection />

      </div>
      <Footer />
    </>
  );
}
