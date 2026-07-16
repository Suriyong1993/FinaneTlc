/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Supabase client env vars are validated at runtime in lib/supabase.ts
  // Disable x-powered-by for security
  poweredByHeader: false,
};

export default nextConfig;
