'use client';

import { useEffect, useState } from 'react';
import { results } from '@/lib/results';
import ResultCard from '@/components/ResultCard';
import Button from '@/components/Button';
import ShareButton from '@/components/ShareButton';
import { calculateResult, calculateRelativeScores } from '@/lib/calculate';

interface ResultPageClientProps {
  type: string;
}

export default function ResultPageClient({ type }: ResultPageClientProps) {
  const [data, setData] = useState(results[type]);
  
  useEffect(() => {
    if (!results[type]) return;
    
    const originalData = { ...results[type] };
    const answers = localStorage.getItem('answers');
    
    if (answers) {
      const parsedAnswers = JSON.parse(answers);
      const calculatedResult = calculateResult(parsedAnswers);
      originalData.scores = calculateRelativeScores(calculatedResult.scores, originalData.category);
    }
    
    setData(originalData);
  }, [type]);

  if (!data) {
    return <div>결과를 찾을 수 없습니다.</div>;
  }

  const imagePath = data.category === 'political' 
    ? `/images/political/${type}.jpg`
    : `/images/economic/${type}.jpg`;

  const shareUrl = `https://peit.kr/result/${type}`;
  const shareText = `나의 ${data.category === 'political' ? '정치' : '경제'} 성향은 ${data.name}입니다! 당신도 PEIT 테스트를 해보세요.`;

  // localStorage에서 다른 성향 결과 가져오기
  const getOtherTypeResult = () => {
    if (typeof window !== 'undefined') {
      if (data.category === 'political') {
        return localStorage.getItem('economicResult');
      } else {
        // 경제 결과 페이지에서는 정치 결과를 찾기 위해 fullResults 사용
        const fullResults = localStorage.getItem('fullResults');
        if (fullResults) {
          const parsed = JSON.parse(fullResults);
          return parsed.political;
        }
      }
    }
    return null;
  };

  const otherType = getOtherTypeResult();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          당신의 {data.category === 'political' ? '정치' : '경제'} 성향은
        </h1>

        <ResultCard
          type={type}
          name={data.name}
          image={imagePath}
          scores={data.scores}
          description={data.description}
          category={data.category}
        />

        {/* 경제 유형 상세 정보 */}
        {data.category === 'economic' && (
          <div className="mt-8 space-y-6">
            {data.nickname && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">별칭</h3>
                <p className="text-lg font-medium text-accent">{data.nickname}</p>
              </div>
            )}
            
            {data.keywords && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">키워드</h3>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.spectrum_analysis && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">스펙트럼 분석</h3>
                <p className="text-gray-700 whitespace-pre-line">{data.spectrum_analysis}</p>
              </div>
            )}
            
            {data.detailed_analysis && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">상세 분석</h3>
                <p className="text-gray-700 whitespace-pre-line">{data.detailed_analysis}</p>
              </div>
            )}
            
            {data.coaching && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">코칭</h3>
                <p className="text-gray-700 whitespace-pre-line">{data.coaching}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.synergy_partner && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-green-600">시너지 파트너</h3>
                  <p className="text-gray-700">{data.synergy_partner}</p>
                </div>
              )}
              
              {data.risk_partner && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-red-600">리스크 파트너</h3>
                  <p className="text-gray-700">{data.risk_partner}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.success_formula && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">성공 공식</h3>
                  <p className="text-gray-700">{data.success_formula}</p>
                </div>
              )}
              
              {data.failure_formula && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-orange-600">실패 공식</h3>
                  <p className="text-gray-700">{data.failure_formula}</p>
                </div>
              )}
            </div>
            
            {data.benchmarking && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">벤치마킹</h3>
                <p className="text-gray-700 whitespace-pre-line">{data.benchmarking}</p>
              </div>
            )}
            
            {data.career_navigation && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">커리어 내비게이션</h3>
                <p className="text-gray-700 whitespace-pre-line">{data.career_navigation}</p>
              </div>
            )}
          </div>
        )}
        
        {/* 강점과 약점 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-600">강점</h3>
            <ul className="space-y-2">
              {data.strengths.map((strength, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-red-600">약점</h3>
            <ul className="space-y-2">
              {data.weaknesses.map((weakness, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button href="/result" variant="secondary">
            ← 결과 페이지로 돌아가기
          </Button>
          <Button href="/test" variant="primary">
            다시 검사하기
          </Button>
          {otherType && (
            <Button href={`/result/${otherType}`} variant="primary">
              {data.category === 'political' ? '경제' : '정치'} 성향 보기
            </Button>
          )}
          <Button href="/types" variant="outline">
            다른 유형 보기
          </Button>
          <ShareButton shareUrl={shareUrl} shareText={shareText} />
        </div>
      </div>
    </div>
  );
}