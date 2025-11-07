'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateResult, calculateRelativeScores } from '@/lib/calculate';
import { results } from '@/lib/results';
import FlipCard from '@/components/FlipCard';
import Button from '@/components/Button';
import ShareButton from '@/components/ShareButton';
import SaveCardButton from '@/components/SaveCardButton';

interface ResultSummary {
  political?: string;
  economic?: string;
  politicalData?: any;
  economicData?: any;
  testType?: 'political' | 'economic' | 'both';
}

export default function ResultLandingClient() {
  const [resultData, setResultData] = useState<ResultSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const forcedType = searchParams.get('type') as 'political' | 'economic' | null;

  useEffect(() => {
    const politicalAnswers = localStorage.getItem('political_answers');
    const economicAnswers = localStorage.getItem('economic_answers');
    const fullAnswers = localStorage.getItem('answers');
    
    let resultData: ResultSummary | null = null;

    // Priority 1: forced type via query
    if (forcedType === 'political') {
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
    // Priority 2: if only one part exists, show that part
    else if (politicalAnswers && !economicAnswers && !fullAnswers) {
      const parsed = JSON.parse(politicalAnswers);
      const calculated = calculateResult(parsed);
      const politicalData = { ...results[calculated.political] };
      if (politicalData) {
        politicalData.scores = calculateRelativeScores(calculated.scores, 'political');
        resultData = { political: calculated.political, politicalData, testType: 'political' };
      }
    } else if (economicAnswers && !politicalAnswers && !fullAnswers) {
      const parsed = JSON.parse(economicAnswers);
      const calculated = calculateResult(parsed);
      const economicData = { ...results[calculated.economic] };
      if (economicData) {
        economicData.scores = calculateRelativeScores(calculated.scores, 'economic');
        resultData = { economic: calculated.economic, economicData, testType: 'economic' };
      }
    }
    // Priority 3: full test
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
    // Fallbacks
    else if (politicalAnswers) {
      const parsed = JSON.parse(politicalAnswers);
      const calculated = calculateResult(parsed);
      const politicalData = { ...results[calculated.political] };
      if (politicalData) {
        politicalData.scores = calculateRelativeScores(calculated.scores, 'political');
        resultData = { political: calculated.political, politicalData, testType: 'political' };
      }
    } else if (economicAnswers) {
      const parsed = JSON.parse(economicAnswers);
      const calculated = calculateResult(parsed);
      const economicData = { ...results[calculated.economic] };
      if (economicData) {
        economicData.scores = calculateRelativeScores(calculated.scores, 'economic');
        resultData = { economic: calculated.economic, economicData, testType: 'economic' };
      }
    }

    setResultData(resultData);
    setLoading(false);
  }, [forcedType]);

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
  
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://peit.kr';
  const shareText = 'PEIT에서 정치·경제 성향 테스트 해보기';

  // compute image paths for save-card buttons
  const politicalImage = resultData?.political && resultData?.politicalData
    ? `/images/political/${resultData.political}.${resultData.political === 'IPUE' ? 'png' : 'jpg'}`
    : undefined;
  const economicImage = resultData?.economic && resultData?.economicData
    ? `/images/economic/${resultData.economic}.jpg`
    : undefined;

  return (
    <div className="min-h-screen bg-bg-light-purple py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{getTitle()}</h1>
          <p className="text-lg text-gray-600">카드를 클릭하여 자세한 내용을 확인하세요</p>
        </div>

        <div className={`grid gap-8 mb-12 ${resultData?.testType === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
          {resultData?.political && resultData?.politicalData && (
            <FlipCard type={resultData.political} data={resultData.politicalData} category="political" title="정치 성향" />
          )}

          {resultData?.economic && resultData?.economicData && (
            <FlipCard type={resultData.economic} data={resultData.economicData} category="economic" title="경제 성향" />
          )}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
          <ShareButton shareUrl={shareUrl} shareText={shareText} className="glass-purple text-white" />

          {resultData?.testType === 'political' && (
            <Button href="/test?type=economic" variant="outline" className="glass-purple text-white border-accent/40">경제 테스트 하기</Button>
          )}
          {resultData?.testType === 'economic' && (
            <Button href="/test?type=political" variant="outline" className="glass-purple text-white border-accent/40">정치 테스트 하기</Button>
          )}

          <Button href="/types" variant="secondary" className="glass-purple text-white">다른 유형 보기</Button>

          {/* Save card buttons */}
          {resultData?.political && resultData?.politicalData && politicalImage && (
            <SaveCardButton
              typeCode={resultData.political}
              name={resultData.politicalData.name}
              category="political"
              imageSrc={politicalImage}
              label={resultData?.testType === 'both' ? '정치 카드 저장' : '카드 저장하기'}
              className="glass-purple text-white"
            />
          )}
          {resultData?.economic && resultData?.economicData && economicImage && (
            <SaveCardButton
              typeCode={resultData.economic}
              name={resultData.economicData.name}
              category="economic"
              imageSrc={economicImage}
              label={resultData?.testType === 'both' ? '경제 카드 저장' : '카드 저장하기'}
              className="glass-purple text-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
