import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  // Letiltja a Next.js adatfetching cache-elését
  experimental: {
    // Kényszeríti a fetch kérések újra futtatását minden kérésnél
    workerThreads: true,
    cpus: 1
  },
};

export default withPayload({
  ...nextConfig,
  // Kikapcsolja a server-side adatok gyorsítótárazását
  // Minden kérésre új adatokat kér a szerver
  revalidate: 0
});
