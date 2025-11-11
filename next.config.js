/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: isGitHubPages,
  },
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/PEIT',
    assetPrefix: '/PEIT/',
  }),
}

module.exports = nextConfig