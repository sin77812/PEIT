import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.peit24.co.kr'
  
  // 정치 유형 16개
  const politicalTypes = [
    'IPAE', 'IPAS', 'IPUE', 'IPUS',
    'CPAE', 'CPAS', 'CPUE', 'CPUS',
    'ITAE', 'ITAS', 'ITUE', 'ITUS',
    'CTAE', 'CTAS', 'CTUE', 'CTUS'
  ]
  
  // 경제 유형 8개
  const economicTypes = [
    'GVE', 'GVW', 'GAE', 'GAW',
    'SVE', 'SVW', 'SAE', 'SAW'
  ]
  
  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/test`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/types`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]
  
  // 정치 결과 페이지들
  const politicalResultPages = politicalTypes.map((type) => ({
    url: `${baseUrl}/result/${type}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // 경제 결과 페이지들
  const economicResultPages = economicTypes.map((type) => ({
    url: `${baseUrl}/result/${type}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [
    ...staticPages,
    ...politicalResultPages,
    ...economicResultPages,
  ]
}











