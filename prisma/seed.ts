import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Calmatrip database...");

  // Clean existing data
  await prisma.fAQ.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.product.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.service.deleteMany();

  // Services
  await prisma.service.createMany({
    data: [
      {
        title: "Airport Transfer",
        subtitle: "Arrival & Departure",
        description: "Personalized welcome, real-time flight tracking. Your driver waits for you right after baggage claim, no matter the hour.",
        price: "From 35 TND",
        icon: "Plane",
        color: "#D4A373",
        category: "Transport",
        duration: "30-60 min",
        active: true,
        popular: true,
        features: ["Real-time flight tracking", "Welcome sign", "Luggage assistance", "Air-conditioned vehicles", "Professional drivers"],
        order: 1,
      },
      {
        title: "Excursions",
        subtitle: "Discovery & Culture",
        description: "Explore Djerba, Tozeur, Carthage and beyond. Our passionate guides reveal the secrets of authentic Tunisia.",
        price: "From 80 TND",
        icon: "MapPin",
        color: "#1E6091",
        category: "Excursion",
        duration: "4-8 hours",
        active: true,
        popular: true,
        features: ["Bilingual guides", "Lunch included", "Souvenir photos", "UNESCO site visits", "Groups of 4-8 people"],
        order: 2,
      },
      {
        title: "Private Transport",
        subtitle: "Comfort & Flexibility",
        description: "Air-conditioned vehicles and certified drivers for all your travels. Available 24/7 across the country.",
        price: "From 50 TND",
        icon: "Car",
        color: "#D4A373",
        category: "Transport",
        duration: "8 hours",
        active: true,
        popular: false,
        features: ["Premium fleet", "Certified drivers", "24/7 availability", "Bilingual driver", "Customizable itinerary"],
        order: 3,
      },
      {
        title: "Groups & Events",
        subtitle: "Tailor-made",
        description: "Complete organization for groups, incentives and corporate events. Buses, vans and cars available.",
        price: "Custom quote",
        icon: "Users",
        color: "#1E6091",
        category: "Group",
        duration: "Custom",
        active: true,
        popular: false,
        features: ["Up to 50 people", "Complete coordination", "Group rates", "Event organization", "Flexible scheduling"],
        order: 4,
      },
    ],
  });

  // Products
  await prisma.product.createMany({
    data: [
      { name: "Calmatrip T-Shirt", price: 25, category: "Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", description: "Cotton tee with embroidered Calmatrip logo." },
      { name: "Desert Cap", price: 18, category: "Accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop", description: "Adjustable cap with desert-inspired pattern." },
      { name: "Tunisia Hoodie", price: 45, category: "Clothing", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", description: "Warm hoodie featuring traditional Tunisian motifs." },
      { name: "Ceramic Mug", price: 12, category: "Home", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop", description: "Handcrafted ceramic mug with Calmatrip print." },
      { name: "Leather Journal", price: 22, category: "Stationery", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop", description: "Genuine leather travel journal. 120 pages." },
      { name: "Sunrise Tote Bag", price: 15, category: "Accessories", image: "https://images.unsplash.com/photo-1597484661643-2f5fef640b91?w=400&h=400&fit=crop", description: "Eco-friendly cotton tote bag with desert illustration." },
    ],
  });

  // Destinations
  await prisma.destination.createMany({
    data: [
      { name: "Djerba", emoji: "🏝️", description: "Enchanting island", order: 1 },
      { name: "Tozeur", emoji: "🌴", description: "Gateway to Sahara", order: 2 },
      { name: "Carthage", emoji: "🏛️", description: "Ancient city", order: 3 },
      { name: "Sidi Bou Saïd", emoji: "🔵", description: "Blue village", order: 4 },
      { name: "Douz", emoji: "🐪", description: "Endless desert", order: 5 },
      { name: "Hammamet", emoji: "🌊", description: "Tunisian Riviera", order: 6 },
    ],
  });

  // Team Members
  await prisma.teamMember.createMany({
    data: [
      { name: "Mohamed Ben Salah", role: "General Manager", experience: "15 years experience", icon: "👨‍💼", gradient: "from-[#87CEEB] to-[#4CAF50]", order: 1 },
      { name: "Fatima Trabelsi", role: "Operations Manager", experience: "10 years experience", icon: "👩‍💼", gradient: "from-[#FFD700] to-[#FFC107]", order: 2 },
      { name: "Ahmed Gharbi", role: "Driver Team Leader", experience: "12 years experience", icon: "👨‍✈️", gradient: "from-[#4CAF50] to-[#45A049]", order: 3 },
      { name: "Nadia Mansour", role: "Sales Manager", experience: "8 years experience", icon: "👩‍💻", gradient: "from-[#87CEEB] to-[#FFD700]", order: 4 },
    ],
  });

  // FAQs
  await prisma.fAQ.createMany({
    data: [
      { question: "How can I book a service?", answer: "You can book online via our platform, by phone at +216 70 000 000, or by visiting our office. Our team is available 24/7.", icon: "Car", order: 1 },
      { question: "What payment methods are accepted?", answer: "We accept cash, credit cards (Visa, Mastercard), and bank transfers.", icon: "CreditCard", order: 2 },
      { question: "Can I cancel my reservation?", answer: "Yes, free cancellation up to 24 hours before the scheduled date for a full refund.", icon: "Clock", order: 3 },
      { question: "Do you offer services for groups?", answer: "Absolutely! Solutions for groups up to 50 people with minibuses and buses.", icon: "Users", order: 4 },
      { question: "Are the vehicles insured?", answer: "Yes, all vehicles are fully insured and regularly maintained.", icon: "Shield", order: 5 },
      { question: "Do you provide tour guides?", answer: "Yes, professional multilingual guides (French, English, Arabic) for all excursions.", icon: "Award", order: 6 },
    ],
  });

  // Sample bookings
  const b1 = await prisma.booking.create({
    data: { service: "Airport Transfer", date: new Date("2026-06-20"), time: "14:30", fromLocation: "Tunis-Carthage Airport", toLocation: "Golden Tulip Hotel", status: "confirmed", price: "35 TND", driver: "Mohamed Ali", vehicle: "Mercedes E-Class", customerName: "Ahmed Ben Ali", customerEmail: "ahmed@example.com" }
  });

  // TimeSlots (Generation for the next 30 days for each service)
  console.log("⏳ Generating time slots for the next 30 days...");
  const dbServices = await prisma.service.findMany();
  const times = ["08:00", "10:00", "14:00", "16:00", "18:00"];
  
  for (const service of dbServices) {
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const dayStartUTC = new Date(`${dateString}T00:00:00.000Z`);

      await prisma.timeSlot.createMany({
        data: times.map(t => ({
          serviceId: service.id,
          date: dayStartUTC,
          time: t,
          capacity: 5
        })),
        skipDuplicates: true
      });
    }
  }

  console.log("✅ Calmatrip database seeded successfully!");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
