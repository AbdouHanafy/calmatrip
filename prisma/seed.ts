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
        description:
          "Personalized welcome, real-time flight tracking. Your driver waits for you right after baggage claim, no matter the hour.",
        price: "From 35 TND",
        icon: "Plane",
        image: "/images/services/airport-transfer.jpg",
        color: "#D4A373",
        category: "Transport",
        duration: "30-60 min",
        active: true,
        popular: true,
        features: [
          "Real-time flight tracking",
          "Welcome sign",
          "Luggage assistance",
          "Air-conditioned vehicles",
          "Professional drivers",
        ],
        order: 1,
      },
      {
        title: "Excursions",
        subtitle: "Discovery & Culture",
        description:
          "Explore Djerba, Tozeur, Carthage and beyond. Our passionate guides reveal the secrets of authentic Tunisia.",
        price: "From 80 TND",
        icon: "MapPin",
        image: "/images/services/excursions-matmata.jpg",
        color: "#1E6091",
        category: "Excursion",
        duration: "4-8 hours",
        active: true,
        popular: true,
        features: [
          "Bilingual guides",
          "Lunch included",
          "Souvenir photos",
          "UNESCO site visits",
          "Groups of 4-8 people",
        ],
        order: 2,
      },
      {
        title: "Activités",
        subtitle: "Sensations & Loisirs",
        description:
          "Randonnée, quad, plongée, ateliers artisanaux et sports nautiques. Des activités encadrées par des professionnels locaux, partout en Tunisie.",
        price: "From 40 TND",
        icon: "Compass",
        color: "#F7B77E",
        category: "Activity",
        duration: "2-6 hours",
        active: true,
        popular: false,
        features: [
          "Encadrement professionnel",
          "Matériel fourni",
          "Petits groupes",
          "Tous niveaux",
          "Réservation flexible",
        ],
        order: 3,
      },
    ],
  });

  // Products
  await prisma.product.createMany({
    data: [
      // Photos in public/images/products — see public/images/CREDITS.md
      {
        name: "Hand-painted Nabeul Plate",
        price: 45,
        category: "Ceramics",
        image: "/images/products/nabeul-plate.jpg",
        description:
          "Glazed earthenware plate painted by hand in a Nabeul workshop with the town's traditional fish motif. About 25 cm across. Food-safe glaze; hand wash only.",
      },
      {
        name: "Mini Tajine Dish with Tray",
        price: 35,
        category: "Ceramics",
        image: "/images/products/nabeul-tajine.jpg",
        description:
          "Small lidded pot on a matching square tray, painted in the blue-and-white Nabeul style. Used for olives, harissa or sugar. Each piece is painted by hand, so patterns vary slightly.",
      },
      {
        name: "Nabeul Ceramic Cup",
        price: 18,
        category: "Ceramics",
        image: "/images/products/nabeul-cup.jpg",
        description:
          "Wide cup for tea or coffee, wheel-thrown and hand-painted in green and black. Holds about 250 ml.",
      },
      {
        name: "Hand-woven Cotton Fouta",
        price: 30,
        category: "Textiles",
        image: "/images/products/fouta.jpg",
        description:
          "Flat-woven cotton fouta, the traditional Tunisian hammam towel. Light, quick-drying and good as a beach towel or throw. About 100 × 180 cm; colours vary by batch.",
      },
      {
        name: "Kairouan Mergoum Rug (60 × 90 cm)",
        price: 280,
        category: "Textiles",
        image: "/images/products/kairouan-carpet.jpg",
        description:
          "Small flat-woven mergoum rug from Kairouan, wool on a cotton warp, with geometric Berber-style patterns. Each rug is unique; the one you receive may differ from the photo.",
      },
      {
        name: "Traditional Chechia",
        price: 40,
        category: "Accessories",
        image: "/images/products/chechia.jpg",
        description:
          "The red felted-wool cap made in the Souk des Chaouachia in Tunis medina, knitted, felted and shaped by hand. Tell us your head size at checkout.",
      },
    ],
  });

  // Destinations
  // Only Hammamet is offered in the search bar at launch; admins switch the
  // others on from /admin/destinations.
  await prisma.destination.createMany({
    data: [
      { name: "Djerba", emoji: "🏝️", description: "Enchanting island", order: 1, active: false },
      { name: "Tozeur", emoji: "🌴", description: "Gateway to Sahara", order: 2, active: false },
      { name: "Carthage", emoji: "🏛️", description: "Ancient city", order: 3, active: false },
      { name: "Sidi Bou Saïd", emoji: "🔵", description: "Blue village", order: 4, active: false },
      { name: "Douz", emoji: "🐪", description: "Endless desert", order: 5, active: false },
      { name: "Hammamet", emoji: "🌊", description: "Tunisian Riviera", order: 0, active: true },
    ],
  });

  // Team Members
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Mohamed Ben Salah",
        role: "Directeur général",
        experience: "15 ans d'expérience",
        icon: "👨‍💼",
        gradient: "from-[#87CEEB] to-[#4CAF50]",
        order: 1,
      },
      {
        name: "Fatima Trabelsi",
        role: "Responsable des opérations",
        experience: "10 ans d'expérience",
        icon: "👩‍💼",
        gradient: "from-[#FFD700] to-[#FFC107]",
        order: 2,
      },
      {
        name: "Ahmed Gharbi",
        role: "Chef d'équipe chauffeurs",
        experience: "12 ans d'expérience",
        icon: "👨‍✈️",
        gradient: "from-[#4CAF50] to-[#45A049]",
        order: 3,
      },
      {
        name: "Nadia Mansour",
        role: "Responsable commerciale",
        experience: "8 ans d'expérience",
        icon: "👩‍💻",
        gradient: "from-[#87CEEB] to-[#FFD700]",
        order: 4,
      },
    ],
  });

  // FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "How can I book a service?",
        answer:
          "You can book online via our platform, by phone at +216 21 622 972, or by visiting our office. Our team is available 24/7.",
        icon: "Car",
        order: 1,
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept cash, credit cards (Visa, Mastercard), and bank transfers.",
        icon: "CreditCard",
        order: 2,
      },
      {
        question: "Can I cancel my reservation?",
        answer:
          "Yes, free cancellation up to 24 hours before the scheduled date for a full refund.",
        icon: "Clock",
        order: 3,
      },
      {
        question: "Do you offer services for groups?",
        answer: "Absolutely! Solutions for groups up to 50 people with minibuses and buses.",
        icon: "Users",
        order: 4,
      },
      {
        question: "Are the vehicles insured?",
        answer: "Yes, all vehicles are fully insured and regularly maintained.",
        icon: "Shield",
        order: 5,
      },
      {
        question: "Do you provide tour guides?",
        answer:
          "Yes, professional multilingual guides (French, English, Arabic) for all excursions.",
        icon: "Award",
        order: 6,
      },
    ],
  });

  // Sample bookings
  await prisma.booking.create({
    data: {
      service: "Airport Transfer",
      date: new Date("2026-06-20"),
      time: "14:30",
      fromLocation: "Tunis-Carthage Airport",
      toLocation: "Golden Tulip Hotel",
      status: "confirmed",
      price: "35 TND",
      driver: "Mohamed Ali",
      vehicle: "Mercedes E-Class",
      customerName: "Ahmed Ben Ali",
      customerEmail: "ahmed@example.com",
    },
  });

  // TimeSlots (Generation for the next 30 days for each service)
  console.log("⏳ Generating time slots for the next 30 days...");
  const dbServices = await prisma.service.findMany();
  const times = ["08:00", "10:00", "14:00", "16:00", "18:00"];

  for (const service of dbServices) {
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split("T")[0];
      const dayStartUTC = new Date(`${dateString}T00:00:00.000Z`);

      await prisma.timeSlot.createMany({
        data: times.map((t) => ({
          serviceId: service.id,
          date: dayStartUTC,
          time: t,
          capacity: 5,
        })),
        skipDuplicates: true,
      });
    }
  }

  console.log("✅ Calmatrip database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
