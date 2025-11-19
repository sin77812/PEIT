import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
      {
        userAgent: 'Yeti', // 네이버 검색로봇
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    sitemap: 'https://www.peit24.co.kr/sitemap.xml',
  }
}

