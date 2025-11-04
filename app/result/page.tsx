'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateResult, calculateRelativeScores } from '@/lib/calculate';
import { results } from '@/lib/results';
import FlipCard from '@/components/FlipCard';
import Button from '@/components/Button';

interface ResultSummary {
  political?: string;
  economic?: string;
  politicalData?: any;
  economicData?: any;
  testType?: 'political' | 'economic' | 'both';
}

export default function ResultPage() {
  const [resultData, setResultData] = useState<ResultSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const forcedType = searchParams.get('type') as 'political' | 'economic' | null;

  useEffect(() => {
    // localStorage에서 답변 가져오기
    const politicalAnswers = localStorage.getItem('political_answers');
    const economicAnswers = localStorage.getItem('economic_answers');
    const fullAnswers = localStorage.getItem('answers');
    
    let resultData: ResultSummary | null = null;

    // 우선순위 1: URL 파라미터로 강제된 타입 처리
    if (forcedType === 'political') {
      const politicalAnswers = localStorage.getItem('political_answers');
      if (politicalAnswers) {
        const parsed = JSON.parse(politicalAnswers);
        const calculated = calculateResult(parsed);
        const politicalData = { ...results[calculated.political] };
        if (politicalData) {
          politicalData.scores = calculateRelativeScores(calculated.scores, 'political');
          resultData = { political: calculated.political, politicalData, testType: 'political' };
        }
      }
    } else if (forcedType === 'economic') {
      const economicAnswers = localStorage.getItem('economic_answers');
      if (economicAnswers) {
        const parsed = JSON.parse(economicAnswers);
        const calculated = calculateResult(parsed);
        const economicData = { ...results[calculated.economic] };
        if (economicData) {
          economicData.scores = calculateRelativeScores(calculated.scores, 'economic');
          resultData = { economic: calculated.economic, economicData, testType: 'economic' };
        }
      }
    }
    // 우선순위 2: 파라미터 없으면 부분 테스트 우선 표시
    else if (politicalAnswers && !economicAnswers && !fullAnswers) {
      const parsedAnswers = JSON.parse(politicalAnswers);
      const calculatedResult = calculateResult(parsedAnswers);
      const politicalData = { ...results[calculatedResult.political] };
      if (politicalData) {
        politicalData.scores = calculateRelativeScores(calculatedResult.scores, 'political');
        resultData = { political: calculatedResult.political, politicalData, testType: 'political' };
      }
    } else if (economicAnswers && !politicalAnswers && !fullAnswers) {
      const parsedAnswers = JSON.parse(economicAnswers);
      const calculatedResult = calculateResult(parsedAnswers);
      const economicData = { ...results[calculatedResult.economic] };
      if (economicData) {
        economicData.scores = calculateRelativeScores(calculatedResult.scores, 'economic');
        resultData = { economic: calculatedResult.economic, economicData, testType: 'economic' };
      }
    }
    // 우선순위 3: 전체 테스트 결과가 있는 경우
    else if (fullAnswers) {
      const parsedAnswers = JSON.parse(fullAnswers);
      const calculatedResult = calculateResult(parsedAnswers);
      
      const politicalData = { ...results[calculatedResult.political] };
      const economicData = { ...results[calculatedResult.economic] };

      if (politicalData && economicData) {
        politicalData.scores = calculateRelativeScores(calculatedResult.scores, 'political');
        economicData.scores = calculateRelativeScores(calculatedResult.scores, 'economic');

        resultData = {
          political: calculatedResult.political,
          economic: calculatedResult.economic,
          politicalData,
          economicData,
          testType: 'both'
        };
      }
    }
    // 정치 테스트만 완료한 경우 (fallback)
    else if (politicalAnswers) {
      const parsedAnswers = JSON.parse(politicalAnswers);
      const calculatedResult = calculateResult(parsedAnswers);
      
      const politicalData = { ...results[calculatedResult.political] };
      if (politicalData) {
        politicalData.scores = calculateRelativeScores(calculatedResult.scores, 'political');
        
        resultData = {
          political: calculatedResult.political,
          politicalData,
          testType: 'political'
        };
      }
    }
    // 경제 테스트만 완료한 경우 (fallback)
    else if (economicAnswers) {
      const parsedAnswers = JSON.parse(economicAnswers);
      const calculatedResult = calculateResult(parsedAnswers);
      
      const economicData = { ...results[calculatedResult.economic] };
      if (economicData) {
        economicData.scores = calculateRelativeScores(calculatedResult.scores, 'economic');
        
        resultData = {
          economic: calculatedResult.economic,
          economicData,
          testType: 'economic'
        };
      }
    }

    setResultData(resultData);
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

  const getTitle = () => {
    if (resultData?.testType === 'political') return '당신의 정치 성향 결과';
    if (resultData?.testType === 'economic') return '당신의 경제 성향 결과';
    return '당신의 성향 결과';
  };

  return (
    <div className="min-h-screen bg-bg-light-purple py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{getTitle()}</h1>
          <p className="text-lg text-gray-600">카드를 클릭하여 자세한 내용을 확인하세요</p>
        </div>

        <div className={`grid gap-8 mb-12 ${resultData?.testType === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
          {/* 정치 성향 카드 */}
          {resultData?.political && resultData?.politicalData && (
            <FlipCard
              type={resultData.political}
              data={resultData.politicalData}
              category="political"
              title="정치 성향"
            />
          )}

          {/* 경제 성향 카드 */}
          {resultData?.economic && resultData?.economicData && (
            <FlipCard
              type={resultData.economic}
              data={resultData.economicData}
              category="economic"
              title="경제 성향"
            />
          )}
        </div>

        {/* 하단 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/test" variant="primary">
            다시 검사하기
          </Button>
          
          {/* 정치 테스트만 한 경우 경제 테스트 추천 */}
          {resultData?.testType === 'political' && (
            <Button href="/test?type=economic" variant="outline">
              경제 테스트 하기
            </Button>
          )}
          
          {/* 경제 테스트만 한 경우 정치 테스트 추천 */}
          {resultData?.testType === 'economic' && (
            <Button href="/test?type=political" variant="outline">
              정치 테스트 하기
            </Button>
          )}
          
          {/* 상세 보기 버튼들은 카드 내부로 통합되어 제거 */}
          
          <Button href="/types" variant="secondary">
            다른 유형 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
