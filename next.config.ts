import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.bfori.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.bfori.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
