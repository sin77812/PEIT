/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: isGitHubPages,
    // 이미지 품질 향상 설정
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // 이미지 최적화 품질 (1-100, 기본값 75)
    // 높은 값일수록 더 나은 품질이지만 파일 크기도 커짐
    dangerouslyAllowSVG: false,
  },
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/PEIT',
    assetPrefix: '/PEIT/',
  }),
}

module.exports = nextConfig