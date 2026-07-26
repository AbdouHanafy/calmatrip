// Minimal local type shim for next-pwa, which ships no types of its own.
// Replaces @types/next-pwa (DefinitelyTyped), which pins a hard runtime
// dependency on next@^12 || ^13 purely for typings — dragging a whole
// dead copy of an old Next.js version (and its own vulnerable postcss/sharp)
// into node_modules for no functional reason. This shim covers only the
// `withPWA(config)(nextConfig)` shape actually used in next.config.ts.
declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    [key: string]: unknown;
  }

  export default function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}
