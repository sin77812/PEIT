'use client';

import { useEffect, useState, Suspense } from 'react';
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
  // HTML 링크가 이미 포함된 경우를 처리하기 위해 먼저 링크를 보호
  const linkPlaceholders: string[] = [];
  let html = text.replace(new RegExp('<a[^>]*>.*?</a>', 'g'), (match) => {
    const placeholder = `__LINK_${linkPlaceholders.length}__`;
    linkPlaceholders.push(match);
    return placeholder;
  });
  
  // ### **제목** 형태의 소제목에서 ** 제거 (경제테스트 결과 최종 텍스트용)
  html = html.replace(new RegExp('### \\*\\*([^*]+?)\\*\\*', 'g'), '### $1');
  
  // **텍스트** -> <strong>텍스트</strong>
  html = html.replace(new RegExp('\\*\\*(.*?)\\*\\*', 'g'), '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // '텍스트' -> <span class="text-accent">텍스트</span>
  html = html.replace(new RegExp("'([^']+)'", 'g'), '<span class="text-accent font-medium">\'$1\'</span>');
  
  // 줄바꿈 처리 - ### 제목 처리 포함
  html = html.split('\n').map(paragraph => {
    const trimmed = paragraph.trim();
    if (!trimmed) return '';
    
    // ### 제목 처리
    if (trimmed.startsWith('### ')) {
      const titleText = trimmed.substring(4).trim();
      return `<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">${titleText}</h3>`;
    }
    
    // 링크가 포함된 줄도 <p> 태그로 감싸서 줄바꿈 처리 (경제테스트 결과 추천도서 줄바꿈용)
    if (trimmed.includes('__LINK_')) {
      return `<p class="mb-4 last:mb-0">${trimmed}</p>`;
    }
    
    return `<p class="mb-4 last:mb-0">${paragraph}</p>`;
  }).join('');
  
  // 링크 플레이스홀더를 원래 HTML로 복원
  linkPlaceholders.forEach((link, index) => {
    html = html.replace(`__LINK_${index}__`, link);
  });
  
  // 최종 HTML에서 남아있는 ** 제거 (경제테스트 결과 최종 텍스트용)
  html = html.replace(new RegExp('\\*\\*', 'g'), '');
  
  return html;
}

// useSearchParams를 사용하는 내부 컴포넌트
function ResultPageContent({ type, showExpanded = false }: ResultPageClientProps) {
  const searchParams = useSearchParams();
  const explore = searchParams.get('explore');
  const detailed = searchParams.get('detailed');
  const from = searchParams.get('from');
  
  const [data, setData] = useState(results[type]);
  
  // explore=true 파라미터가 있으면 간단한 버전 표시
  if (explore === 'true') {
    return <SimpleResultCard type={type} />;
  }
  
  const [hasTestResult, setHasTestResult] = useState(false);

  useEffect(() => {
    if (!results[type]) return;
    
    const originalData = { ...results[type] };
    
    // 1. from=types 또는 from=admin일 때는 실제 테스트 결과를 무시하고 항상 100% 점수 표시
    // referrer 체크 제거: 쿼리 파라미터만으로 판단
    const isFromAdmin = from === 'admin' || from === 'types';
    
    if (isFromAdmin) {
      // 유형 코드를 파싱해서 각 축을 100%로 설정
      if (originalData.category === 'political') {
        // 정치 유형: 4자리 코드 (예: ITAE)
        const axis1 = type[0]; // I 또는 C
        const axis2 = type[1]; // P 또는 T
        const axis3 = type[2]; // A 또는 U
        const axis4 = type[3]; // E 또는 S
        
        originalData.scores = {
          '개인주의 vs 공동체주의': axis1 === 'I' ? 100 : 0,
          '진보주의 vs 전통주의': axis2 === 'P' ? 100 : 0,
          '적극적 평등 vs 보편적 평등': axis3 === 'A' ? 100 : 0,
          '협력 우선 vs 안보 우선': axis4 === 'E' ? 100 : 0,
        };
      } else {
        // 경제 유형: 3자리 코드 (예: GVE)
        const axis1 = type[0]; // G 또는 S
        const axis2 = type[1]; // V 또는 A
        const axis3 = type[2]; // E 또는 W
        
        originalData.scores = {
          '성장 중시 vs 안정 중시': axis1 === 'G' ? 100 : 0,
          '비전 투자 vs 데이터 투자': axis2 === 'V' ? 100 : 0,
          '기업가 기질 vs 안정가 기질': axis3 === 'E' ? 100 : 0,
        };
      }
      setHasTestResult(true); // 그래프 표시
      setData(originalData);
      return;
    }
    
    // 2. from=types가 아닐 때만 실제 테스트 결과 확인 및 사용
    const answers = localStorage.getItem('answers');
    const politicalAnswers = localStorage.getItem('political_answers');
    const economicAnswers = localStorage.getItem('economic_answers');
    
    // 실제 테스트 결과가 있는지 확인 (카테고리별로 정확히 매칭)
    const hasActualTestResult = !!(
      answers || 
      (politicalAnswers && originalData.category === 'political') || 
      (economicAnswers && originalData.category === 'economic')
    );
    
    if (hasActualTestResult) {
      if (answers) {
        const parsedAnswers = JSON.parse(answers);
        const calculatedResult = calculateResult(parsedAnswers);
        originalData.scores = calculateRelativeScores(calculatedResult.scores, originalData.category);
      } else if (politicalAnswers && originalData.category === 'political') {
        const parsedAnswers = JSON.parse(politicalAnswers);
        const calculatedResult = calculateResult(parsedAnswers);
        originalData.scores = calculateRelativeScores(calculatedResult.scores, originalData.category);
      } else if (economicAnswers && originalData.category === 'economic') {
        const parsedAnswers = JSON.parse(economicAnswers);
        const calculatedResult = calculateResult(parsedAnswers);
        originalData.scores = calculateRelativeScores(calculatedResult.scores, originalData.category);
      }
      setHasTestResult(true);
      setData(originalData);
      return;
    }
    
    // 3. 둘 다 없으면 그래프 숨김
    setHasTestResult(false);
    setData(originalData);
  }, [type, from]);

  if (!data) {
    return <div>결과를 찾을 수 없습니다.</div>;
  }

  // IPUE는 PNG 파일이므로 특별 처리
  const imageExtension = type === 'IPUE' ? 'png' : 'jpg';
  const imagePath = data.category === 'political' 
    ? `/images/political/${type}.${imageExtension}`
    : `/images/economic/${type}.jpg`;

  // 공유할 URL 생성 (해당 유형의 결과 페이지로 이동)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://peit.kr';
  const shareUrl = `${baseUrl}/result/${type}?from=types`;
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
        {/* 결과지 전체 캡처용 컨테이너 */}
        <div className="result-container-for-share">
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
              hideDetailButton={true}
              showChart={hasTestResult}
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
                        <ul className="space-y-2">
                          {data.strengths.map((strength, i) => {
                            const parts = strength.split(':');
                            const title = parts[0].trim().replace(new RegExp('\\*\\*', 'g'), '');
                            const description = parts.slice(1).join(':').trim().replace(new RegExp('\\*\\*', 'g'), '');
                            return (
                              <li key={i} className="text-gray-700">
                                <strong className="font-bold text-gray-900">{title}</strong>
                                {description && `: ${description}`}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    {data.weaknesses && data.weaknesses.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2">⚠️ 약점</h4>
                        <ul className="space-y-2">
                          {data.weaknesses.map((weakness, i) => {
                            const parts = weakness.split(':');
                            const title = parts[0].trim().replace(new RegExp('\\*\\*', 'g'), '');
                            const description = parts.slice(1).join(':').trim().replace(new RegExp('\\*\\*', 'g'), '');
                            return (
                              <li key={i} className="text-gray-700">
                                <strong className="font-bold text-gray-900">{title}</strong>
                                {description && `: ${description}`}
                              </li>
                            );
                          })}
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
            
            {/* 당신의 화법 */}
            {(data.speech_style || data.stress_moment || data.solution) && (
              <ExpandableSection 
                title="당신의 화법"
                borderColor="border-accent"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {data.speech_style && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.speech_style) }} />
                  )}
                  {data.stress_moment && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.stress_moment) }} />
                  )}
                  {data.solution && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.solution) }} />
                  )}
                </div>
              </ExpandableSection>
            )}
            
            {/* 당신의 연애 */}
            {(data.love_value || data.best_partner || data.worst_partner) && (
              <ExpandableSection 
                title="당신의 연애"
                borderColor="border-pink-500"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {data.love_value && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.love_value) }} />
                  )}
                  {data.best_partner && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.best_partner) }} />
                  )}
                  {data.worst_partner && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.worst_partner) }} />
                  )}
                </div>
              </ExpandableSection>
            )}
            
            {/* 소통의 벽 */}
            {data.communication_barrier && (
              <ExpandableSection 
                title="소통의 벽: 당신이 갈등을 겪는 이유"
                borderColor="border-orange-500"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.communication_barrier) }}
                />
              </ExpandableSection>
            )}
            
            {/* 돈과 일에 대한 태도 */}
            {(data.career_value || data.financial_style) && (
              <ExpandableSection 
                title="돈과 일에 대한 태도"
                borderColor="border-indigo-500"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {data.career_value && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.career_value) }} />
                  )}
                  {data.financial_style && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.financial_style) }} />
                  )}
                </div>
              </ExpandableSection>
            )}
            
            {/* 역사와 현실 속 당신의 아바타 */}
            {(data.historical_avatar || data.real_avatar) && (
              <ExpandableSection 
                title="역사와 현실 속 당신의 아바타"
                borderColor="border-purple-500"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {data.historical_avatar && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.historical_avatar) }} />
                  )}
                  {data.real_avatar && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.real_avatar) }} />
                  )}
                </div>
              </ExpandableSection>
            )}
            
            {/* 개인적 성장과 자기계발 */}
            {(data.growth_direction || data.final_goal) && (
              <ExpandableSection 
                title="개인적 성장과 자기계발"
                borderColor="border-green-500"
                defaultExpanded={showExpanded}
              >
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {data.growth_direction && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.growth_direction) }} />
                  )}
                  {data.final_goal && (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.final_goal) }} />
                  )}
                </div>
              </ExpandableSection>
            )}
            
            {/* 추천도서/강의 */}
            {data.recommended_content && (
              <ExpandableSection 
                title="추천도서/강의"
                borderColor="border-blue-500"
                defaultExpanded={showExpanded}
              >
                <div 
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.recommended_content) }}
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
                          <ul className="space-y-2">
                            {data.strengths.map((strength, i) => {
                              const parts = strength.split(':');
                              const title = parts[0].trim().replace(new RegExp('\\*\\*', 'g'), '');
                              const description = parts.slice(1).join(':').trim().replace(new RegExp('\\*\\*', 'g'), '');
                              return (
                                <li key={i} className="text-gray-700">
                                  <strong className="font-bold text-gray-900">{title}</strong>
                                  {description && `: ${description}`}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                      {data.weaknesses && data.weaknesses.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-orange-600 mb-2">⚠️ 약점</h4>
                          <ul className="space-y-2">
                            {data.weaknesses.map((weakness, i) => {
                              const parts = weakness.split(':');
                              const title = parts[0].trim().replace(new RegExp('\\*\\*', 'g'), '');
                              const description = parts.slice(1).join(':').trim().replace(new RegExp('\\*\\*', 'g'), '');
                              return (
                                <li key={i} className="text-gray-700">
                                  <strong className="font-bold text-gray-900">{title}</strong>
                                  {description && `: ${description}`}
                                </li>
                              );
                            })}
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
              
              {/* 당신의 파트너십 - 시너지 파트너와 리스크 파트너를 하나의 섹션으로 */}
              {(data.synergy_partner || data.risk_partner) && (
                <ExpandableSection 
                  title="당신의 파트너십"
                  borderColor="border-accent"
                  defaultExpanded={showExpanded}
                >
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    {data.synergy_partner && (
                      <div 
                        dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.synergy_partner) }}
                      />
                    )}
                    {data.risk_partner && (
                      <div 
                        dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.risk_partner) }}
                      />
                    )}
                  </div>
                </ExpandableSection>
              )}
              
              {/* 부의 공식 - 성공 공식과 실패 공식을 하나의 섹션으로 */}
              {(data.success_formula || data.failure_formula) && (
                <ExpandableSection 
                  title="부의 공식"
                  borderColor="border-blue-500"
                  defaultExpanded={showExpanded}
                >
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    {data.success_formula && (
                      <div 
                        dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.success_formula) }}
                      />
                    )}
                    {data.failure_formula && (
                      <div 
                        dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.failure_formula) }}
                      />
                    )}
                  </div>
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
              
              {/* 역사와 현실 속 당신의 아바타 */}
              {(data.historical_avatar || data.real_avatar) && (
                <ExpandableSection 
                  title="역사와 현실 속 당신의 아바타"
                  borderColor="border-purple-500"
                  defaultExpanded={showExpanded}
                >
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    {data.historical_avatar && (() => {
                      // 인물 이름 추출
                      // 패턴 1: "인물 이름 (설명) -" 예: "나폴레옹 보나파르트 (프랑스의 황제) -"
                      // 패턴 2: "인물 이름은" 예: "케네디는"
                      // 패턴 3: "인물 이름 (설명) -" 예: "존 스튜어트 밀 (영국의 철학자, 정치경제학자) -"
                      let personName = null;
                      const pattern1 = data.historical_avatar.match(new RegExp('^([^\\(]+?)\\s*\\([^\\)]+\\)\\s*-\\s*'));
                      const pattern2 = data.historical_avatar.match(new RegExp('^([^는은]+?)(?:는|은)\\s'));
                      // 패턴 3: "**인물 이름**" 형식
                      const pattern3 = data.historical_avatar.match(new RegExp('\\*\\*([^*]+?)\\*\\*'));
                      if (pattern1) {
                        personName = pattern1[1].trim();
                      } else if (pattern2) {
                        personName = pattern2[1].trim();
                      } else if (pattern3) {
                        personName = pattern3[1].trim();
                      }
                      return (
                        <div>
                          <h4 className="font-semibold mb-2 text-lg">
                            역사적 아바타{personName ? `: ${personName}` : ''}
                          </h4>
                          <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.historical_avatar) }} />
                        </div>
                      );
                    })()}
                    {data.real_avatar && (() => {
                      // 현실 속 아바타의 인물/그룹 이름 추출
                      // 패턴 1: "설명" 예: "기성 정치에 반기를 드는 제3지대의 젊은 개혁가"
                      // 패턴 2: "이들은..." 형태에서 첫 문장의 핵심 키워드 추출
                      let avatarName = null;
                      const quotedMatch = data.real_avatar.match(new RegExp('^"([^"]+)"'));
                      const boldMatch = data.real_avatar.match(new RegExp('\\*\\*([^*]+?)\\*\\*'));
                      if (quotedMatch) {
                        avatarName = quotedMatch[1].trim();
                      } else if (boldMatch) {
                        avatarName = boldMatch[1].trim();
                      } else {
                        // "이들은..." 형태에서 첫 문장의 핵심 부분 추출
                        const sentencePattern = new RegExp('[\\u002E\\u3002]');
                        const firstSentence = data.real_avatar.split(sentencePattern)[0];
                        if (firstSentence.includes('이들은') || firstSentence.includes('이들')) {
                          // 첫 문장에서 핵심 키워드 추출 (너무 길지 않게)
                          const keywordPattern = new RegExp('(?:데이터|합리적|정책|전문가|개혁가|논객|행정가|법조인|경제학자|정치인|지식인|분석|통찰|비전|원칙|안정|질서|기업가|투자자|경영자)[^,\\uFF0C]*');
                          const keywords = firstSentence.match(keywordPattern);
                          if (keywords) {
                            avatarName = keywords[0].trim();
                            // 너무 길면 자르기
                            if (avatarName.length > 30) {
                              avatarName = avatarName.substring(0, 27) + '...';
                            }
                          }
                        }
                      }
                      return (
                        <div>
                          <h4 className="font-semibold mb-2 text-lg">
                            현실 속 아바타{avatarName ? `: ${avatarName}` : ''}
                          </h4>
                          <div dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.real_avatar) }} />
                        </div>
                      );
                    })()}
                  </div>
                </ExpandableSection>
              )}
              
              {/* 추천도서/강의 */}
              {data.recommended_content && (
                <ExpandableSection 
                  title="추천도서/강의"
                  borderColor="border-blue-500"
                  defaultExpanded={showExpanded}
                >
                  <div 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.recommended_content) }}
                  />
                </ExpandableSection>
              )}
          </div>
        )}
        </div> {/* result-container-for-share 닫기 */}
        
        {/* 강점과 약점 하단 통합 섹션 제거: 강점/약점은 '핵심 키워드' 섹션 내부에서 노출 */}

        {/* 액션 버튼들 */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-12">
          {from === 'types' ? (
            // 유형종류 페이지에서 접근한 경우
            <>
              <Button 
                href="/test?type=political" 
                variant="primary" 
                className="no-glass btn-purple"
              >
                정치 테스트하기
              </Button>
              <Button 
                href="/test?type=economic" 
                variant="primary" 
                className="no-glass btn-purple"
              >
                경제 테스트하기
              </Button>
              <Button href="/types" variant="outline" className="no-glass btn-purple">
                다른 유형 보기
              </Button>
              <Button href="/peitshop" variant="outline" className="no-glass btn-purple">
                추천도서 보기
              </Button>
            </>
          ) : (
            // 결과 페이지 (테스트 완료 후)
            <>
              {otherType && (
                <Button href={`/result/${otherType}`} variant="primary" className="no-glass btn-purple">
                  {data.category === 'political' ? '경제' : '정치'} 성향 보기
                </Button>
              )}
              <Button 
                href={data.category === 'political' ? '/test?type=economic' : '/test?type=political'} 
                variant="primary" 
                className="no-glass btn-purple"
              >
                {data.category === 'political' ? '경제 테스트하기' : '정치 테스트하기'}
              </Button>
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
              <Button href="/peitshop" variant="outline" className="no-glass btn-purple">
                추천도서 보기
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Suspense로 감싼 메인 컴포넌트
export default function ResultPageClient({ type, showExpanded = false }: ResultPageClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-light-purple flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    }>
      <ResultPageContent type={type} showExpanded={showExpanded} />
    </Suspense>
  );
}
