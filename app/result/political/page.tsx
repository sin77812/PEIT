'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateResult } from '@/lib/calculate';
import { results } from '@/lib/results';
import SimpleResultView from '@/components/SimpleResultView';
import Button from '@/components/Button';

function PoliticalResultContent() {
  const searchParams = useSearchParams();
  const showDetailed = searchParams.get('detailed') === 'true';
  
  const [politicalType, setPoliticalType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 정치 답변 가져오기
    const answers = localStorage.getItem('political_answers');
    if (answers) {
      const parsedAnswers = JSON.parse(answers);
      const calculatedResult = calculateResult(parsedAnswers, 'political');
      
      setPoliticalType(calculatedResult.political);
      localStorage.setItem('politicalResult', calculatedResult.political);
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

  if (!politicalType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">검사 결과를 찾을 수 없습니다</h2>
          <Button href="/test?type=political">정치 테스트 다시 하기</Button>
        </div>
      </div>
    );
  }

  const resultData = results[politicalType];
  
  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">결과 데이터를 찾을 수 없습니다</h2>
          <Button href="/test?type=political">정치 테스트 다시 하기</Button>
        </div>
      </div>
    );
  }

  return (
    <SimpleResultView 
      type={politicalType}
      name={resultData.name}
      category="political"
    />
  );
}

export default function PoliticalResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    }>
      <PoliticalResultContent />
    </Suspense>
  );
}