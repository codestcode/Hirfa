/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: { root: '.' },
};

if (process.env.CAPACITOR_BUILD === 'true') {
  nextConfig.output = 'export';
}

export default nextConfig;
