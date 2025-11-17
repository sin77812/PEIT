import { Metadata } from 'next';
import ResultPageClient from '@/components/ResultPageClient';
import { results } from '@/lib/results';

interface ResultPageProps {
  params: Promise<{
    type: string;
  }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { type } = await params;
  const data = results[type];
  
  if (!data) {
    return {
      title: 'PEIT - 결과를 찾을 수 없습니다',
    };
  }
  
  const categoryText = data.category === 'political' ? '정치' : '경제';
  const imageExtension = type === 'IPUE' ? 'png' : 'jpg';
  const imageUrl = data.category === 'political'
    ? `https://www.peit24.co.kr/images/political/${type}.${imageExtension}`
    : `https://www.peit24.co.kr/images/economic/${type}.jpg`;
  
  const pageUrl = `https://www.peit24.co.kr/result/${type}?explore=true`;
  const title = `${type} (${data.name}) - PEIT ${categoryText} 성향 테스트`;
  const description = data.description?.substring(0, 150) || `PEIT ${categoryText} 성향 테스트 결과: ${type} (${data.name})`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'PEIT24 - 정치경제성향테스트',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${type} - ${data.name}`,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { type } = await params;
  
  return <ResultPageClient type={type} showExpanded={false} />;
}

// 빌드 시 24개 페이지 생성
export async function generateStaticParams() {
  const types = [
    // 정치 16개 - 계산 로직과 일치하도록 수정
    'IPAE', 'IPAS', 'IPUE', 'IPUS',
    'ITAE', 'ITAS', 'ITUE', 'ITUS', 
    'CPAE', 'CPAS', 'CPUE', 'CPUS',
    'CTAE', 'CTAS', 'CTUE', 'CTUS',
    // 경제 8개
    'GVE', 'GVW', 'GAE', 'GAW',
    'SVE', 'SVW', 'SAE', 'SAW'
  ];

  return types.map((type) => ({
    type,
  }));
}