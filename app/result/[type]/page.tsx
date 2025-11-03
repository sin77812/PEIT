import ResultPageClient from '@/components/ResultPageClient';
import SimpleResultCard from '@/components/SimpleResultCard';

interface ResultPageProps {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    explore?: string;
  }>;
}

export default async function ResultPage({ params, searchParams }: ResultPageProps) {
  const { type } = await params;
  const { explore } = await searchParams;
  
  // explore=true 파라미터가 있으면 간단한 버전 표시
  if (explore === 'true') {
    return <SimpleResultCard type={type} />;
  }
  
  // 기본적으로는 전체 기능이 있는 버전 표시
  return <ResultPageClient type={type} />;
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