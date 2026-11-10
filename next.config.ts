import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Lessons are read from disk at build time; include them in server traces
  // too, in case a route is ever rendered on demand.
  outputFileTracingIncludes: {
    "/*": ["./src/content/lessons/**/*.mdx"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
