import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'PEIT - 당신의 정치·경제 좌표',
  description: '69개 질문으로 알아보는 나의 정치·경제 성향 테스트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Navigation />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  )
}