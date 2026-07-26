import ExplorePage from "@/views/ExplorePage";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getActiveEvents } from "@/repositories/eventRepository";
import { getActiveMuseums } from "@/repositories/museumRepository";

export const metadata: Metadata = buildMetadata({
  title: "Explore Tunisia — Discover Local Favourites",
  description:
    "Explore the best sights, food, and activities in Tunisia. Hand-picked recommendations for an authentic travel experience with Calmatrip.",
  path: "/explore",
});

export default async function Explore() {
  const [events, museums] = await Promise.all([getActiveEvents(), getActiveMuseums()]);

  return (
    <ExplorePage
      events={JSON.parse(JSON.stringify(events))}
      museums={JSON.parse(JSON.stringify(museums))}
    />
  );
}
