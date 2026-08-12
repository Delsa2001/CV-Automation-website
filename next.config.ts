import type { NextConfig } from "next";

const atsUrl = (process.env.ATS_URL || "https://cv-automationdeshancosta.vercel.app").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${atsUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
