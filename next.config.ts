import withPWA from "next-pwa";

const withPWANext = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPWANext({
  reactStrictMode: true,

  images: {
    // AVIF first (smaller than WebP where supported), WebP fallback — Next
    // serves whichever the browser's Accept header supports.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // seeded demo product images only — real uploads go through Cloudinary
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Google OAuth profile pictures (session.user.image / review.avatar)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // ✅ Security headers + cache
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/og/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },

  // ✅ non-www → www redirect
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "calmatrip.com" }],
        destination: "https://www.calmatrip.com/:path*",
        permanent: true,
      },
    ];
  },
});
