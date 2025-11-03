'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateResult, calculateRelativeScores } from '@/lib/calculate';
import { results } from '@/lib/results';
import Button from '@/components/Button';

export default function EconomicResultPage() {
  const router = useRouter();
  const [economicType, setEconomicType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 경제 답변 가져오기
    const answers = localStorage.getItem('economic_answers');
    if (answers) {
      const parsedAnswers = JSON.parse(answers);
      const calculatedResult = calculateResult(parsedAnswers, 'economic');
      
      setEconomicType(calculatedResult.economic);
      localStorage.setItem('economicResult', calculatedResult.economic);
      
      // 해당 결과 페이지로 리다이렉트
      router.push(`/result/${calculatedResult.economic}`);
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">결과 계산 중...</div>
      </div>
    );
  }

  if (!economicType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">검사 결과를 찾을 수 없습니다</h2>
          <Button href="/test?type=economic">경제 테스트 다시 하기</Button>
        </div>
      </div>
    );
  }

  return null; // 리다이렉트되므로 실제로는 렌더링되지 않음
}