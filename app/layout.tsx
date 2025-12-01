import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import DisableTextSelection from '@/components/DisableTextSelection'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.peit24.co.kr'),
  title: '정치성향테스트 정치유형테스트 사상검증테스트 / 정치mbti',
  description: '가장 정교한 정치/경제 테스트',
  keywords: '정치테스트, 정치유형테스트, 정치 성향테스트 모음, 정치테스트 모음, 정치성향테스트, PEIT24, 정치mbti, 진보보수차이, 좌파우파차이, 나의정치성향, 정치성향알아보기, 경제성향테스트, 폴리티컬컴퍼스, 정치좌표테스트, 정치잘모르는데, 나는진보일까보수일까, 나랑맞는정당, 투표전테스트, 재미있는정치테스트, 정치처음, 정치색깔, 성향테스트, 정치유형, 좌파우파뜻, 진보뜻, 보수뜻, 정치스펙트럼, 정치이념, 중도성향, 정치입문, 청년정치, 친구랑할테스트, 심심풀이테스트, mbti말고',
  authors: [{ name: 'PEIT Team' }],
  creator: 'PEIT24',
  publisher: 'PEIT24',
  verification: {
    google: ['yYjwR4HFcKoWN2W7zihpikkSAxtV0kjLaKYLlmYm64w', 'aY-OP_HKvLbejW5qyIFKDhjkDM0h8fiK4FjvSw7OksM'],
    other: {
      'naver-site-verification': '62329bb9560fad8cb9d75900ac2459876081462a',
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: 'https://www.peit24.co.kr/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://www.peit24.co.kr/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://www.peit24.co.kr/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: 'https://www.peit24.co.kr/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: 'https://www.peit24.co.kr/favicon.png',
  },
  openGraph: {
    title: '정치성향테스트 정치유형테스트 사상검증테스트 / 정치mbti',
    description: '가장 정교한 정치/경제 테스트',
    url: 'https://www.peit24.co.kr',
    siteName: 'PEIT24 - 정치경제성향테스트',
    images: [
      {
        url: 'https://www.peit24.co.kr/favicon.png',
        alt: 'PEIT24 정치성향테스트 - 정치mbti로 나의정치성향 알아보기',
      }
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '정치성향테스트 정치유형테스트 사상검증테스트 / 정치mbti',
    description: '가장 정교한 정치/경제 테스트',
    images: ['https://www.peit24.co.kr/favicon.png'],
    creator: '@peit24',
    site: '@peit24',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.peit24.co.kr',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PEIT24 - 정치성향테스트',
    applicationCategory: 'LifestyleApplication',
    description: '나의 정치성향 DNA는? 69개 질문으로 알아보는 나의 정치성향 경제성향. 진보보수, 좌파우파 쉽게 이해하고, 나의 가치관과 투자성향까지 확인해볼 수 있는 성향종합테스트.',
    url: 'https://www.peit24.co.kr',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1024',
    },
    author: {
      '@type': 'Organization',
      name: 'PEIT Team',
    },
  }

  return (
    <html lang="ko">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7637419448849595"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="https://www.peit24.co.kr/favicon.png" type="image/png" />
        <link rel="icon" href="https://www.peit24.co.kr/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="https://www.peit24.co.kr/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="https://www.peit24.co.kr/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <DisableTextSelection />
        <Navigation />
        <div className="pt-16 min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}