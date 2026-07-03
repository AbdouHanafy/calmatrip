// instrumentation.ts
export async function register() {
  // Le cron ne doit tourner que sur le runtime Node.js, jamais sur Edge
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startCleanupCron } = await import("@/lib/cron");
    startCleanupCron();
  }
}