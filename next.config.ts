import withPWA from "next-pwa";

const withPWANext = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development to avoid Workbox issues
});

export default withPWANext({
  reactStrictMode: true,
});