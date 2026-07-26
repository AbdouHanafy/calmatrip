import { prisma } from "@/lib/prisma";

async function withBookingSummary<T extends { email: string | null }>(user: T) {
  const bookings = await prisma.booking.findMany({
    where: { customerEmail: user.email || "" },
    orderBy: { createdAt: "desc" },
  });

  const totalSpent = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);

  return { bookings, totalSpent };
}

interface ClientListFilters {
  search?: string;
  status?: string;
}

export async function getClients({ search = "", status = "all" }: ClientListFilters) {
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
      OR: [{ name: { contains: search } }, { email: { contains: search } }],
    },
    orderBy: { createdAt: "desc" },
  });

  const clients = await Promise.all(
    users.map(async (user) => {
      const { bookings, totalSpent } = await withBookingSummary(user);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: bookings[0]?.customerPhone || "",
        registeredDate: user.createdAt,
        totalBookings: bookings.length,
        status: user.role === "BLOCKED" ? "blocked" : "active",
        lastBooking: bookings[0]?.createdAt || null,
        totalSpent,
        favoriteService: bookings[0]?.service || null,
      };
    }),
  );

  return status === "all" ? clients : clients.filter((c) => c.status === status);
}

export async function getClientById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;

  const { bookings, totalSpent } = await withBookingSummary(user);

  return { ...user, bookings, totalBookings: bookings.length, totalSpent };
}

export async function updateClientStatus(id: string, status: string) {
  return prisma.user.update({ where: { id }, data: { status } });
}

export async function getClientsForExport() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    where: { role: "USER" },
  });
}

export async function getClientStats() {
  const [totalClients, activeClients, blockedClients, totalBookings] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "active" } }),
    prisma.user.count({ where: { status: "blocked" } }),
    prisma.booking.count(),
  ]);

  return { totalClients, activeClients, blockedClients, totalBookings };
}
