/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: isGitHubPages,
  },
  // Turbopack 오류 방지를 위해 webpack 사용
  experimental: {
    turbo: false,
  },
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/PEIT',
    assetPrefix: '/PEIT/',
  }),
}

module.exports = nextConfig