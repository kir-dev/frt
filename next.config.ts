import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["i.ytimg.com"],
  },
  /* config options here */
};

export default withPayload(nextConfig);
