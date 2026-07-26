// lib/notificationEvents.ts
// In-process pub/sub used to push new notifications to open SSE connections
// the instant they're created — this is what makes the notification bell
// truly real-time instead of polling.
//
// Caveat: this is a module-level EventEmitter, scoped to a single Node.js
// process. It works correctly for a traditional persistent server (`next
// start`, one instance). On serverless/multi-instance deployments, each
// instance has its own emitter and events won't cross instances — a
// notification created by the instance handling the write won't reach an
// SSE connection held open by a different instance. Fine for this app's
// current single-instance setup; would need a shared bus (Redis pub/sub,
// Ably, Pusher) to scale beyond that.

import { EventEmitter } from "events";

export const notificationEvents = new EventEmitter();
notificationEvents.setMaxListeners(0);

export function emitNotificationEvent(
  recipient: "admin" | "user",
  userId: string | null | undefined,
  payload: unknown,
) {
  if (recipient === "admin") {
    notificationEvents.emit("admin", payload);
  } else if (userId) {
    notificationEvents.emit(`user:${userId}`, payload);
  }
}
