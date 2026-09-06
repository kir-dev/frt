import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "**.facebook.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // A Tagfelvétel oldal Karrier néven, /karrier útvonalon él tovább.
        source: "/tagfelvetel",
        destination: "/karrier",
        permanent: true,
      },
    ];
  },
  /* config options here */
};

export default withPayload(nextConfig);
