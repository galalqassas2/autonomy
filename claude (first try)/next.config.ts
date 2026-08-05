import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    /*
      These three ship large barrel files. Without per-export rewriting the
      Phosphor index alone pulls thousands of icons into the client chunk.
    */
    optimizePackageImports: ["@phosphor-icons/react", "motion", "animejs"],
  },
}

export default nextConfig
