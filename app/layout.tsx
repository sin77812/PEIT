import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://sin77812.github.io'),
  title: 'PEIT - 정치성향테스트, 경제성향테스트 | 정치mbti',
  description: '정치성향테스트 PEIT24! 69개 질문으로 나의정치성향 알아보기. 진보보수차이, 좌파우파차이를 쉽게 이해하고 정치mbti로 재미있게 확인해보세요.',
  keywords: '정치성향테스트, PEIT24, 정치mbti, 진보보수차이, 좌파우파차이, 나의정치성향, 정치성향알아보기, 경제성향테스트, 폴리티컬컴퍼스, 정치좌표테스트, 정치잘모르는데, 나는진보일까보수일까, 나랑맞는정당, 투표전테스트, 재미있는정치테스트, 정치처음, 정치색깔, 성향테스트, 정치유형, 좌파우파뜻, 진보뜻, 보수뜻, 정치스펙트럼, 정치이념, 중도성향, 정치입문, 청년정치, 친구랑할테스트, 심심풀이테스트, mbti말고',
  authors: [{ name: 'PEIT Team' }],
  creator: 'PEIT24',
  publisher: 'PEIT24',
  verification: {
    google: 'yYjwR4HFcKoWN2W7zihpikkSAxtV0kjLaKYLlmYm64w',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/images/pabicon.jpg', sizes: '32x32', type: 'image/jpeg' },
    ],
    apple: '/images/pabicon.jpg',
    shortcut: '/images/pabicon.jpg',
  },
  openGraph: {
    title: 'PEIT - 정치성향테스트, 정치mbti로 나의정치성향 알아보기',
    description: '69개 질문으로 정치성향테스트! 진보보수, 좌파우파 쉽게 이해하고 나랑맞는정당 찾기. 재미있는정치테스트 PEIT24',
    url: 'https://peit24.com',
    siteName: 'PEIT24 - 정치경제성향테스트',
    images: [
      {
        url: '/images/forshare.jpg',
        width: 1200,
        height: 630,
        alt: 'PEIT24 정치성향테스트 - 정치mbti로 나의정치성향 알아보기',
      }
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEIT - 정치성향테스트, 정치mbti',
    description: '정치잘모르는데? 69개 질문으로 쉽게 알아보는 나의정치성향! 진보보수차이 이해하고 정치mbti 확인',
    images: ['/images/forshare.jpg'],
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
    canonical: 'https://peit24.com',
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
    description: '정치성향테스트 PEIT24! 69개 질문으로 나의정치성향 알아보기. 진보보수차이, 좌파우파차이를 쉽게 이해하고 정치mbti로 재미있게 확인해보세요.',
    url: 'https://peit24.com',
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
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