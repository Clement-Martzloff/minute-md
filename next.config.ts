import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://drive-thirdparty.googleusercontent.com/**"),
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude 'test' directories from pdf-parse to prevent ENOENT errors
      config.externals.push({
        "pdf-parse": "commonjs pdf-parse",
      });
      config.module.rules.push({
        test: /pdf-parse\/lib\/test\//,
        use: "null-loader",
      });
    }
    return config;
  },
};

export default nextConfig;
