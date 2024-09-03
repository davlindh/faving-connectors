/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['evatwevgvyraitfiwbgr.supabase.co'], // Add your Supabase project URL here
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;