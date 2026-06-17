import withPWA from "next-pwa";

const withPWANext = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
});

export default withPWANext({
  reactStrictMode: true,
});