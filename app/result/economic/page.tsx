'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateResult } from '@/lib/calculate';
import { results } from '@/lib/results';
import SimpleResultView from '@/components/SimpleResultView';
import Button from '@/components/Button';

function EconomicResultContent() {
  const searchParams = useSearchParams();
  const showDetailed = searchParams.get('detailed') === 'true';
  
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
    }
    setLoading(false);
  }, []);

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

  const resultData = results[economicType];
  
  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">결과 데이터를 찾을 수 없습니다</h2>
          <Button href="/test?type=economic">경제 테스트 다시 하기</Button>
        </div>
      </div>
    );
  }

  return (
    <SimpleResultView 
      type={economicType}
      name={resultData.name}
      category="economic"
    />
  );
}

export default function EconomicResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    }>
      <EconomicResultContent />
    </Suspense>
  );
}