import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://drive-thirdparty.googleusercontent.com/**"),
    ],
  },
};

export default nextConfig;
