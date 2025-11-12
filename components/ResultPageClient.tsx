'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { results } from '@/lib/results';
import ResultCard from '@/components/ResultCard';
import Button from '@/components/Button';
import ShareButton from '@/components/ShareButton';
import { calculateResult, calculateRelativeScores } from '@/lib/calculate';
import ExpandableSection from '@/components/ExpandableSection';
import SimpleResultCard from '@/components/SimpleResultCard';

interface ResultPageClientProps {
  type: string;
  showExpanded?: boolean;
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

export default function ResultPageClient({ type, showExpanded = false }: ResultPageClientProps) {
  const searchParams = useSearchParams();
  const explore = searchParams.get('explore');
  const detailed = searchParams.get('detailed');
  
  const [data, setData] = useState(results[type]);
  
  // explore=true 파라미터가 있으면 간단한 버전 표시
  if (explore === 'true') {
    return <SimpleResultCard type={type} />;
  }
  
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

  const shareUrl = `https://peit.kr/result/${type}?detailed=true`;
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
    <div className="min-h-screen bg-bg-light-purple">
      <div className="max-w-4xl mx-auto px-4 py-12">
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
          hideDetailButton={data.category === 'economic'}
        />

        {/* 정치 유형 상세 정보 - 확장 가능한 섹션들 */}
        {data.category === 'political' && (
          <div className="mt-8 space-y-4">
            {/* 핵심 키워드 */}
            {data.keywords && (
              <ExpandableSection 
                title="핵심 키워드"
                borderColor="border-accent"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-4">
                  {/* 키워드 태그 */}
                  <div className="flex flex-wrap gap-3">
                    {data.keywords.map((keyword, i) => (
                      <span key={i} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-base font-medium">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                  
                  {/* 강점과 약점 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {data.strengths && data.strengths.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">🌟 강점</h4>
                        <ul className="space-y-1">
                          {data.strengths.map((strength, i) => (
                            <li key={i} className="text-gray-700">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {data.weaknesses && data.weaknesses.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2">⚠️ 약점</h4>
                        <ul className="space-y-1">
                          {data.weaknesses.map((weakness, i) => (
                            <li key={i} className="text-gray-700">• {weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </ExpandableSection>
            )}
            
            {/* 종합 정치 스펙트럼 */}
            {(data.political_spectrum_detail || data.summary) && (
              <ExpandableSection 
                title="종합 정치 스펙트럼"
                borderColor="border-accent"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdownText(data.political_spectrum_detail || data.summary || '') 
                  }}
                />
              </ExpandableSection>
            )}
            
            
            {/* 당신은 이런 사람입니다 */}
            {data.detailed_description && (
              <ExpandableSection 
                title="당신은 이런 사람입니다"
                borderColor="border-accent"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.detailed_description) }}
                />
              </ExpandableSection>
            )}
            
            {/* 당신의 화법 (하위: 스트레스/솔루션/연애/파트너) */}
            {(data.speech_style || data.stress_moment || data.solution || data.love_value || data.best_partner || data.worst_partner) && (
              <ExpandableSection 
                title="당신의 화법"
                borderColor="border-accent"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {data.speech_style && (
                    <div>
                      <h4 className="font-semibold mb-2">당신의 화법</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.speech_style) }} />
                    </div>
                  )}
                  {data.stress_moment && (
                    <div>
                      <h4 className="font-semibold mb-2">당신이 스트레스 받는 순간</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.stress_moment) }} />
                    </div>
                  )}
                  {data.solution && (
                    <div>
                      <h4 className="font-semibold mb-2">솔루션</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.solution) }} />
                    </div>
                  )}
                  {data.love_value && (
                    <div>
                      <h4 className="font-semibold mb-2">당신의 연애 가치관</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.love_value) }} />
                    </div>
                  )}
                  {data.best_partner && (
                    <div>
                      <h4 className="font-semibold mb-2">최고의 연애 파트너</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.best_partner) }} />
                    </div>
                  )}
                  {data.worst_partner && (
                    <div>
                      <h4 className="font-semibold mb-2">최악의 갈등 상대</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.worst_partner) }} />
                    </div>
                  )}
                </div>
              </ExpandableSection>
            )}
            
            {/* 소통의 벽 */}
            {data.communication_barrier && (
              <ExpandableSection 
                title="소통의 벽: 당신이 보수주의자와 대화할 때 답답함을 느끼는 이유"
                borderColor="border-orange-500"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.communication_barrier) }}
                />
              </ExpandableSection>
            )}
            
            {/* 직업적 가치관 */}
            {data.career_value && (
              <ExpandableSection 
                title="돈과 일에 대한 태도"
                borderColor="border-indigo-500"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.career_value) }}
                />
              </ExpandableSection>
            )}
            
            {/* 재무 스타일 */}
            {data.financial_style && (
              <ExpandableSection 
                title="잠재적 재무 스타일"
                borderColor="border-yellow-500"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.financial_style) }}
                />
              </ExpandableSection>
            )}
            
            {/* 역사와 현실 속 아바타 */}
            {(data.historical_avatar || data.real_avatar) && (
              <ExpandableSection 
                title="역사와 현실 속 당신의 아바타,유사 유형 인물 분석"
                borderColor="border-purple-500"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {data.historical_avatar && (
                    <div>
                      <h4 className="font-semibold mb-2">역사적 아바타</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.historical_avatar) }} />
                    </div>
                  )}
                  {data.real_avatar && (
                    <div>
                      <h4 className="font-semibold mb-2">현실 속 아바타</h4>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.real_avatar) }} />
                    </div>
                  )}
                </div>
              </ExpandableSection>
            )}
            
            
            {/* 개인적 성장과 자기계발 */}
            {data.growth_direction && (
              <ExpandableSection 
                title="개인적 성장과 자기계발"
                borderColor="border-green-500"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.growth_direction) }}
                />
              </ExpandableSection>
            )}
            
            {/* 도서추천 */}
            {(data.recommended_books?.length || data.recommended_content) && (
              <ExpandableSection 
                title="도서추천"
                borderColor="border-blue-500"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-4">
                  {data.recommended_books && data.recommended_books.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-semibold">도서추천</p>
                      {data.recommended_books.map((book, i) => (
                        <div key={i} className="flex items-start">
                          <div>
                            <span className="font-semibold">『{book.title}』</span>
                            <span className="text-gray-600 ml-1">({book.author})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {data.recommended_content && (
                    <div>
                      <p className="font-semibold mb-2">추천 영상/강의:</p>
                      <div 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.recommended_content) }}
                      />
                    </div>
                  )}
                </div>
              </ExpandableSection>
            )}
            
            {/* 성장의 최종 목표 */}
            {data.final_goal && (
              <ExpandableSection 
                title="성장의 최종 목표"
                borderColor="border-yellow-500"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.final_goal) }}
                />
              </ExpandableSection>
            )}
          </div>
        )}
        
        {/* 경제 유형 상세 정보 - 확장 가능한 섹션들 (모바일/데스크톱 공통) */}
        {data.category === 'economic' && (
          <div className="mt-8 space-y-4">
              {/* 핵심 키워드 섹션 */}
              {data.keywords && (
                <ExpandableSection 
                  title="핵심 키워드"
                  borderColor="border-accent"
                  defaultExpanded={showExpanded}
                >
                  <div className="space-y-4">
                    {/* 키워드 태그 */}
                    <div className="flex flex-wrap gap-3">
                      {data.keywords.map((keyword, i) => (
                        <span key={i} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-base font-medium">
                          #{keyword}
                        </span>
                      ))}
                    </div>
                    
                    {/* 강점과 약점 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {data.strengths && data.strengths.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2">🌟 강점</h4>
                          <ul className="space-y-1">
                            {data.strengths.map((strength, i) => (
                              <li key={i} className="text-gray-700">• {strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {data.weaknesses && data.weaknesses.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-orange-600 mb-2">⚠️ 약점</h4>
                          <ul className="space-y-1">
                            {data.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-gray-700">• {weakness}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </ExpandableSection>
              )}
              
              {/* 종합 경제 스펙트럼 분석 */}
              {data.spectrum_analysis && (
                <ExpandableSection 
                  title="종합 경제 스펙트럼"
                  borderColor="border-accent"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.spectrum_analysis) }}
                  />
                </ExpandableSection>
              )}
              
              {data.detailed_analysis && (
                <ExpandableSection 
                  title="당신은 이런 사람입니다"
                  borderColor="border-accent"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.detailed_analysis) }}
                  />
                </ExpandableSection>
              )}
              
              {data.coaching && (
                <ExpandableSection 
                  title="당신의 파트너십"
                  borderColor="border-accent"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.coaching) }}
                  />
                </ExpandableSection>
              )}
              
              {data.synergy_partner && (
                <ExpandableSection 
                  title="시너지 파트너"
                  borderColor="border-green-500"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.synergy_partner) }}
                  />
                </ExpandableSection>
              )}
              
              {data.risk_partner && (
                <ExpandableSection 
                  title="리스크 파트너"
                  borderColor="border-red-500"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.risk_partner) }}
                  />
                </ExpandableSection>
              )}
              
              {data.success_formula && (
                <ExpandableSection 
                  title="부의 공식"
                  borderColor="border-blue-500"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.success_formula) }}
                  />
                </ExpandableSection>
              )}
              
              {data.failure_formula && (
                <ExpandableSection 
                  title="실패 공식"
                  borderColor="border-orange-500"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.failure_formula) }}
                  />
                </ExpandableSection>
              )}
              
              {data.benchmarking && (
                <ExpandableSection 
                  title="성공 DNA 벤치마킹"
                  borderColor="border-accent"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.benchmarking) }}
                  />
                </ExpandableSection>
              )}
              
              {data.career_navigation && (
                <ExpandableSection 
                  title="커리어 내비게이션"
                  borderColor="border-indigo-500"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.career_navigation) }}
                  />
                </ExpandableSection>
              )}
          </div>
        )}
        
        {/* 강점과 약점 하단 통합 섹션 제거: 강점/약점은 '핵심 키워드' 섹션 내부에서 노출 */}

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button href="/test" variant="primary" className="no-glass btn-purple">
            다시 검사하기
          </Button>
          {otherType && (
            <Button href={`/result/${otherType}`} variant="primary" className="no-glass btn-purple">
              {data.category === 'political' ? '경제' : '정치'} 성향 보기
            </Button>
          )}
          <Button href="/types" variant="outline" className="no-glass btn-purple">
            다른 유형 보기
          </Button>
          <ShareButton 
            shareUrl={shareUrl} 
            shareText={shareText}
            type={type}
            name={data.name}
            category={data.category}
            className="no-glass btn-purple"
          />
        </div>
      </div>
    </div>
  );
}
