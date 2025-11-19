import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = 'https://www.peit24.co.kr'
  const currentDate = new Date().toUTCString()
  
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
  
  // RSS 아이템 생성
  const items = [
    // 메인 페이지
    `<item>
      <title>PEIT - 정치성향테스트, 경제성향테스트 | 정치mbti</title>
      <link>${baseUrl}</link>
      <description>정치성향테스트 PEIT24! 69개 질문으로 나의정치성향 알아보기. 진보보수차이, 좌파우파차이를 쉽게 이해하고 정치mbti로 재미있게 확인해보세요.</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${baseUrl}</guid>
    </item>`,
    // 테스트 페이지
    `<item>
      <title>정치성향테스트 시작하기 - PEIT24</title>
      <link>${baseUrl}/test</link>
      <description>69개 질문으로 나의 정치성향과 경제성향을 알아보는 테스트</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${baseUrl}/test</guid>
    </item>`,
    // 유형 목록 페이지
    `<item>
      <title>정치·경제 유형 전체보기 - PEIT24</title>
      <link>${baseUrl}/types</link>
      <description>16가지 정치 유형과 8가지 경제 유형 전체 목록</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${baseUrl}/types</guid>
    </item>`,
    // 정치 결과 페이지들
    ...politicalTypes.map(type => `<item>
      <title>${type} 결과 - PEIT24 정치성향테스트</title>
      <link>${baseUrl}/result/${type}</link>
      <description>${type} 정치성향 테스트 결과 및 상세 분석</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${baseUrl}/result/${type}</guid>
    </item>`),
    // 경제 결과 페이지들
    ...economicTypes.map(type => `<item>
      <title>${type} 결과 - PEIT24 경제성향테스트</title>
      <link>${baseUrl}/result/${type}</link>
      <description>${type} 경제성향 테스트 결과 및 상세 분석</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${baseUrl}/result/${type}</guid>
    </item>`),
  ].join('\n')
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PEIT24 - 정치성향테스트, 경제성향테스트</title>
    <link>${baseUrl}</link>
    <description>정치성향테스트 PEIT24! 69개 질문으로 나의정치성향 알아보기. 진보보수차이, 좌파우파차이를 쉽게 이해하고 정치mbti로 재미있게 확인해보세요.</description>
    <language>ko</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
  
  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}











