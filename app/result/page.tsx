'use client';

import { useEffect, useState } from 'react';
import { calculateResult, calculateRelativeScores } from '@/lib/calculate';
import { results } from '@/lib/results';
import FlipCard from '@/components/FlipCard';
import Button from '@/components/Button';

interface ResultSummary {
  political: string;
  economic: string;
  politicalData: any;
  economicData: any;
}

export default function ResultPage() {
  const [resultData, setResultData] = useState<ResultSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 답변 가져오기
    const answers = localStorage.getItem('answers');
    if (answers) {
      const parsedAnswers = JSON.parse(answers);
      const calculatedResult = calculateResult(parsedAnswers);
      
      const politicalData = { ...results[calculatedResult.political] };
      const economicData = { ...results[calculatedResult.economic] };

      if (politicalData && economicData) {
        // 실제 점수를 기반으로 상대적 비율 계산
        politicalData.scores = calculateRelativeScores(calculatedResult.scores, 'political');
        economicData.scores = calculateRelativeScores(calculatedResult.scores, 'economic');

        setResultData({
          political: calculatedResult.political,
          economic: calculatedResult.economic,
          politicalData,
          economicData
        });
      }
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

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">검사 결과를 찾을 수 없습니다</h2>
          <Button href="/test">다시 검사하기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light-purple py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">당신의 성향 결과</h1>
          <p className="text-lg text-gray-600">카드를 클릭하여 자세한 내용을 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 정치 성향 카드 */}
          <FlipCard
            type={resultData.political}
            data={resultData.politicalData}
            category="political"
            title="정치 성향"
          />

          {/* 경제 성향 카드 */}
          <FlipCard
            type={resultData.economic}
            data={resultData.economicData}
            category="economic"
            title="경제 성향"
          />
        </div>

        {/* 하단 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/test" variant="primary">
            다시 검사하기
          </Button>
          <Button href={`/result/${resultData.political}`} variant="outline">
            정치 성향 자세히 보기
          </Button>
          <Button href={`/result/${resultData.economic}`} variant="outline">
            경제 성향 자세히 보기
          </Button>
          <Button href="/types" variant="secondary">
            다른 유형 보기
          </Button>
        </div>
      </div>
    </div>
  );
}