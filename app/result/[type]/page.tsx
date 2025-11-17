import ResultPageClient from '@/components/ResultPageClient';

interface ResultPageProps {
  params: Promise<{
    type: string;
  }>;
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