/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep development chunks separate from production-build output. This
  // prevents stale Webpack modules when switching between `dev` and `build`.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
};

export default nextConfig;
