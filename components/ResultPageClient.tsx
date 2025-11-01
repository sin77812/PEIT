'use client';

import { useEffect, useState } from 'react';
import { results } from '@/lib/results';
import ResultCard from '@/components/ResultCard';
import Button from '@/components/Button';
import ShareButton from '@/components/ShareButton';
import { calculateResult, calculateRelativeScores } from '@/lib/calculate';
import DetailModal from '@/components/DetailModal';

interface ResultPageClientProps {
  type: string;
}

// 마크다운 스타일 텍스트를 HTML로 변환하는 함수
function renderMarkdownText(text: string) {
  // **텍스트** -> <strong>텍스트</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // '텍스트' -> <span class="text-accent">텍스트</span>
  html = html.replace(/'([^']+)'/g, '<span class="text-accent font-medium">\'$1\'</span>');
  
  // 줄바꿈 처리
  html = html.split('\n').map(paragraph => {
    if (paragraph.trim()) {
      return `<p class="mb-4 last:mb-0">${paragraph}</p>`;
    }
    return '';
  }).join('');
  
  return html;
}

export default function ResultPageClient({ type }: ResultPageClientProps) {
  const [data, setData] = useState(results[type]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
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

  // IPUE는 PNG 파일이므로 특별 처리
  const imageExtension = type === 'IPUE' ? 'png' : 'jpg';
  const imagePath = data.category === 'political' 
    ? `/images/political/${type}.${imageExtension}`
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

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    setShowDetailModal(true);
  };

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

        {/* 경제 유형 상세 정보 - 모바일에서는 클릭 가능한 카드로 표시 */}
        {data.category === 'economic' && (
          <>
            {/* 모바일용 클릭 가능한 카드들 */}
            <div className="md:hidden mt-8 space-y-4">
              {/* 핵심 키워드 */}
              {data.keywords && (
                <button
                  onClick={() => handleSectionClick('keywords')}
                  className="bg-white p-4 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow w-full border-l-4 border-accent"
                >
                  <h3 className="text-base font-semibold mb-1">#{data.nickname || data.name}</h3>
                  <div className="flex gap-2 flex-wrap">
                    {data.keywords.slice(0, 3).map((keyword, i) => (
                      <span key={i} className="text-xs text-accent">#{keyword}</span>
                    ))}
                    {data.keywords.length > 3 && <span className="text-xs text-gray-500">...</span>}
                  </div>
                </button>
              )}
              
              {/* 주요 분석 섹션들 */}
              <div className="grid grid-cols-2 gap-3">
                {data.spectrum_analysis && (
                  <button
                    onClick={() => handleSectionClick('spectrum_analysis')}
                    className="bg-white p-4 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-sm font-semibold mb-1">경제 스펙트럼</h3>
                    <p className="text-xs text-gray-500">종합 분석</p>
                  </button>
                )}
                
                {data.detailed_analysis && (
                  <button
                    onClick={() => handleSectionClick('detailed_analysis')}
                    className="bg-white p-4 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-sm font-semibold mb-1">성향 분석</h3>
                    <p className="text-xs text-gray-500">상세 설명</p>
                  </button>
                )}
              </div>
              
              {/* 코칭 섹션 */}
              {data.coaching && (
                <button
                  onClick={() => handleSectionClick('coaching')}
                  className="bg-white p-4 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow w-full border-l-4 border-accent"
                >
                  <h3 className="text-base font-semibold mb-1 flex items-center">
                    <span className="mr-2">💡</span> 종합 코칭
                  </h3>
                  <p className="text-xs text-gray-500">맞춤형 조언</p>
                </button>
              )}
              
              {/* 파트너십 */}
              <div className="grid grid-cols-2 gap-3">
                {data.synergy_partner && (
                  <button
                    onClick={() => handleSectionClick('synergy_partner')}
                    className="bg-white p-4 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow border-l-4 border-green-500"
                  >
                    <h3 className="text-sm font-semibold mb-1 text-green-600">🤝 시너지</h3>
                    <p className="text-xs text-gray-500">최고의 파트너</p>
                  </button>
                )}
                
                {data.risk_partner && (
                  <button
                    onClick={() => handleSectionClick('risk_partner')}
                    className="bg-white p-4 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow border-l-4 border-red-500"
                  >
                    <h3 className="text-sm font-semibold mb-1 text-red-600">🔥 리스크</h3>
                    <p className="text-xs text-gray-500">주의할 파트너</p>
                  </button>
                )}
              </div>
              
              {/* 부의 공식 */}
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-base font-semibold mb-3 text-center">부(富)의 공식</h3>
                <div className="grid grid-cols-2 gap-3">
                  {data.success_formula && (
                    <button
                      onClick={() => handleSectionClick('success_formula')}
                      className="p-3 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <h4 className="text-sm font-semibold text-blue-600">💰 성공</h4>
                    </button>
                  )}
                  
                  {data.failure_formula && (
                    <button
                      onClick={() => handleSectionClick('failure_formula')}
                      className="p-3 rounded-lg border-2 border-orange-200 hover:bg-orange-50 transition-colors"
                    >
                      <h4 className="text-sm font-semibold text-orange-600">💸 실패</h4>
                    </button>
                  )}
                </div>
              </div>
              
              {/* 벤치마킹 & 커리어 */}
              {data.benchmarking && (
                <button
                  onClick={() => handleSectionClick('benchmarking')}
                  className="bg-white p-4 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow w-full border-t-4 border-accent"
                >
                  <h3 className="text-base font-semibold mb-1">성공 DNA 벤치마킹</h3>
                  <p className="text-xs text-gray-500">당신과 닮은 성공 인물</p>
                </button>
              )}
              
              {data.career_navigation && (
                <button
                  onClick={() => handleSectionClick('career_navigation')}
                  className="bg-white p-4 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow w-full border-t-4 border-indigo-500"
                >
                  <h3 className="text-base font-semibold mb-1">커리어 내비게이션</h3>
                  <p className="text-xs text-gray-500">추천 직업 & 성장 로드맵</p>
                </button>
              )}
            </div>

            {/* 데스크톱용 기존 레이아웃 */}
            <div className="hidden md:block mt-8 space-y-6">
              {/* 핵심 키워드 섹션 */}
              {data.keywords && (
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-accent">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">#{data.nickname || data.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {data.keywords.map((keyword, i) => (
                      <span key={i} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-base font-medium">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 종합 경제 스펙트럼 분석 */}
              {data.spectrum_analysis && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4">종합 경제 스펙트럼 분석</h3>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.spectrum_analysis) }}
                  />
                </div>
              )}
              
              {data.detailed_analysis && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4">당신은 이런 사람입니다</h3>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.detailed_analysis) }}
                  />
                </div>
              )}
              
              {data.coaching && (
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-accent">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">💡</span> 종합 코칭 제언
                  </h3>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.coaching) }}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.synergy_partner && (
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center">
                      <span className="mr-2">🤝</span> 시너지 파트너
                    </h3>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.synergy_partner) }}
                    />
                  </div>
                )}
                
                {data.risk_partner && (
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <h3 className="text-xl font-semibold mb-4 text-red-600 flex items-center">
                      <span className="mr-2">🔥</span> 리스크 파트너
                    </h3>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.risk_partner) }}
                    />
                  </div>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md mt-6">
                <h3 className="text-xl font-semibold mb-6 text-center">부(富)의 공식</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.success_formula && (
                    <div className="border-l-4 border-blue-500 pl-5">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
                        <span className="mr-2">💰</span> 성공 공식
                      </h4>
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.success_formula) }}
                      />
                    </div>
                  )}
                  
                  {data.failure_formula && (
                    <div className="border-l-4 border-orange-500 pl-5">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 flex items-center">
                        <span className="mr-2">💸</span> 실패 공식
                      </h4>
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.failure_formula) }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {data.benchmarking && (
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-accent">
                  <h3 className="text-xl font-semibold mb-4">성공 DNA 벤치마킹</h3>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.benchmarking) }}
                  />
                </div>
              )}
              
              {data.career_navigation && (
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500">
                  <h3 className="text-xl font-semibold mb-4">커리어 내비게이션</h3>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.career_navigation) }}
                  />
                </div>
              )}
            </div>
          </>
        )}
        
        {/* 강점과 약점 - 모바일에서도 2열로 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-green-600">✅ 강점 (Strengths)</h3>
            <ul className="space-y-3 md:space-y-4">
              {data.strengths.map((strength, i) => {
                const [title, ...descParts] = strength.split(':');
                const description = descParts.join(':').trim();
                const hasDescription = descParts.length > 0;
                
                return (
                  <li key={i} className="flex flex-col space-y-1">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <div className="flex-1">
                        <span className="font-semibold text-sm md:text-base">{title}</span>
                        {hasDescription && (
                          <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">{description}</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-red-600">⚠️ 약점 (Weaknesses)</h3>
            <ul className="space-y-3 md:space-y-4">
              {data.weaknesses.map((weakness, i) => {
                const [title, ...descParts] = weakness.split(':');
                const description = descParts.join(':').trim();
                const hasDescription = descParts.length > 0;
                
                return (
                  <li key={i} className="flex flex-col space-y-1">
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2 mt-1">•</span>
                      <div className="flex-1">
                        <span className="font-semibold text-sm md:text-base">{title}</span>
                        {hasDescription && (
                          <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">{description}</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
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
      
      {/* 모바일 상세 정보 모달 */}
      {showDetailModal && selectedSection && data.category === 'economic' && (
        <DetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={{
            nickname: data.nickname || data.name,
            keywords: `#${data.nickname || data.name}`,
            spectrum_analysis: '종합 경제 스펙트럼 분석',
            detailed_analysis: '당신은 이런 사람입니다',
            coaching: '💡 종합 코칭 제언',
            synergy_partner: '🤝 시너지 파트너',
            risk_partner: '🔥 리스크 파트너',
            success_formula: '💰 성공 공식',
            failure_formula: '💸 실패 공식',
            benchmarking: '성공 DNA 벤치마킹',
            career_navigation: '커리어 내비게이션'
          }[selectedSection] || ''}
          content={
            selectedSection === 'keywords' && data.keywords
              ? data.keywords.join(', ')
              : (data as any)[selectedSection] || ''
          }
        />
      )}
    </div>
  );
}