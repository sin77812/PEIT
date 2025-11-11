import { Suspense } from 'react';
import ResultPageClient from '@/components/ResultPageClient';

interface ResultPageProps {
  params: {
    type: string;
  };
}

export default function ResultPage({ params }: ResultPageProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ResultPageClient type={params.type} showExpanded={false} />
    </Suspense>
  );
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