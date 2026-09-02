import { auth } from "@/auth";
import { notificationEvents } from "@/lib/notificationEvents";

export const dynamic = "force-dynamic";

// Server-Sent Events stream — pushes new notifications to the client the
// instant they're created (see src/lib/notificationEvents.ts for scope caveats).
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const channel = isAdmin ? "admin" : `user:${session.user.id}`;

  const encoder = new TextEncoder();
  let keepAlive: ReturnType<typeof setInterval>;
  let listener: (payload: unknown) => void;

  const stream = new ReadableStream({
    start(controller) {
      listener = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };
      notificationEvents.on(channel, listener);

      controller.enqueue(encoder.encode(`: connected\n\n`));
      keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 20_000);
    },
    cancel() {
      clearInterval(keepAlive);
      notificationEvents.off(channel, listener);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
