'use client';

import ExpandableSection from '@/components/ExpandableSection';

interface ResultDetailSectionsProps {
  type: string;
  data: any; // shape follows lib/results.ts entries
  defaultExpanded?: boolean;
}

// Remove emoji characters for clean UI
function stripEmojis(s: string) {
  return s.replace(/[\u{1F300}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '');
}

// Simple markdown-ish to HTML used in detail sections
function renderMarkdownText(text: string) {
  const cleaned = stripEmojis(text || '');
  let html = cleaned.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  html = html.replace(/'([^']+)'/g, '<span class="text-accent font-medium">\'$1\'</span>');
  html = html
    .split('\n')
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      
      // ### 제목 처리
      if (trimmed.startsWith('### ')) {
        const titleText = trimmed.substring(4).trim();
        return `<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">${titleText}</h3>`;
      }
      
      return `<p class="mb-4 last:mb-0">${p}</p>`;
    })
    .join('');
  return html;
}

export default function ResultDetailSections({ type, data, defaultExpanded = false }: ResultDetailSectionsProps) {
  if (!data) return null;

  // Political detail sections — mirror dedicated political page
  if (data.category === 'political') {
    return (
      <div className="mt-6 space-y-4">
        {data.keywords && (
          <ExpandableSection title="핵심 키워드" borderColor="border-purple-gradient-100" defaultExpanded={defaultExpanded}>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {data.keywords.map((k: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-base font-medium">#{k}</span>
                ))}
              </div>
              {Array.isArray(data.strengths) && data.strengths.length > 0 && Array.isArray(data.weaknesses) && data.weaknesses.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">강점</h4>
                    <ul className="space-y-3">
                      {data.strengths.map((item: string, i: number) => {
                        const [title, ...descParts] = item.split(':');
                        const description = descParts.join(':').trim();
                        const hasDescription = descParts.length > 0;
                        return (
                          <li key={i} className="flex flex-col space-y-1">
                              <div className="flex-1">
                              <strong className="font-bold text-gray-900 text-sm md:text-base">{title.trim()}</strong>
                                {hasDescription && (
                                <span className="text-gray-700 text-xs md:text-sm ml-1">: {description}</span>
                                )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">약점</h4>
                    <ul className="space-y-3">
                      {data.weaknesses.map((item: string, i: number) => {
                        const [title, ...descParts] = item.split(':');
                        const description = descParts.join(':').trim();
                        const hasDescription = descParts.length > 0;
                        return (
                          <li key={i} className="flex flex-col space-y-1">
                              <div className="flex-1">
                              <strong className="font-bold text-gray-900 text-sm md:text-base">{title.trim()}</strong>
                                {hasDescription && (
                                <span className="text-gray-700 text-xs md:text-sm ml-1">: {description}</span>
                                )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </ExpandableSection>
        )}

        {data.summary && (
          <ExpandableSection title="한 줄 요약" borderColor="border-purple-gradient-200" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.summary) }} />
          </ExpandableSection>
        )}

        {data.political_spectrum && data.political_spectrum_detail && (
          <ExpandableSection title={`종합 정치 스펙트럼: ${data.political_spectrum}`} borderColor="border-purple-gradient-300" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.political_spectrum_detail) }} />
          </ExpandableSection>
        )}

        {data.detailed_description && (
          <ExpandableSection title="당신은 이런 사람입니다" borderColor="border-purple-gradient-400" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.detailed_description) }} />
          </ExpandableSection>
        )}

        {(data.speech_style || data.stress_moment || data.solution || data.love_value || data.best_partner || data.worst_partner) && (
          <ExpandableSection title="당신의 화법" borderColor="border-purple-gradient-500" defaultExpanded={defaultExpanded}>
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

        {data.communication_barrier && (
          <ExpandableSection title="소통의 벽: 당신이 보수주의자와 대화할 때 답답함을 느끼는 이유" borderColor="border-purple-gradient-600" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.communication_barrier) }} />
          </ExpandableSection>
        )}

        {(data.career_value || data.financial_style) && (
          <ExpandableSection title="돈과 일에 대한 태도" borderColor="border-purple-gradient-700" defaultExpanded={defaultExpanded}>
            <div className="space-y-6">
              {data.career_value && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.career_value) }} />
              )}
              {data.financial_style && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.financial_style) }} />
              )}
            </div>
          </ExpandableSection>
        )}

        {(data.historical_avatar || data.real_avatar) && (
          <ExpandableSection title="역사와 현실 속 당신의 아바타" borderColor="border-purple-gradient-800" defaultExpanded={defaultExpanded}>
            <div className="space-y-6">
              {data.historical_avatar && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.historical_avatar) }} />
              )}
              {data.real_avatar && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.real_avatar) }} />
              )}
            </div>
          </ExpandableSection>
        )}

        {(data.growth_direction || data.final_goal) && (
          <ExpandableSection title="개인적 성장과 자기계발" borderColor="border-purple-gradient-900" defaultExpanded={defaultExpanded}>
            <div className="space-y-6">
              {data.growth_direction && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.growth_direction) }} />
              )}
              {data.final_goal && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.final_goal) }} />
              )}
            </div>
          </ExpandableSection>
        )}

        {/* 추천도서/강의 */}
        {data.recommended_content && (
          <ExpandableSection 
            title="추천도서/강의"
            borderColor="border-blue-500"
            defaultExpanded={defaultExpanded}
          >
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.recommended_content) }}
            />
          </ExpandableSection>
        )}

        {/* 강점/약점은 핵심 키워드 섹션 내부로 통합 */}
      </div>
    );
  }

  // Economic detail sections
  return (
    <div className="mt-6 space-y-4">
      {data.keywords && (
        <ExpandableSection title="핵심 키워드" borderColor="border-purple-gradient-100" defaultExpanded={defaultExpanded}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {data.keywords.map((k: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-base font-medium">#{k}</span>
              ))}
            </div>
            {Array.isArray(data.strengths) && data.strengths.length > 0 && Array.isArray(data.weaknesses) && data.weaknesses.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">강점</h4>
                  <ul className="space-y-3">
                    {data.strengths.map((item: string, i: number) => {
                      const [title, ...descParts] = item.split(':');
                      const description = descParts.join(':').trim();
                      const hasDescription = descParts.length > 0;
                      return (
                        <li key={i} className="flex flex-col space-y-1">
                            <div className="flex-1">
                            <strong className="font-bold text-gray-900 text-sm md:text-base">{title.trim()}</strong>
                              {hasDescription && (
                              <span className="text-gray-700 text-xs md:text-sm ml-1">: {description}</span>
                              )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">약점</h4>
                  <ul className="space-y-3">
                    {data.weaknesses.map((item: string, i: number) => {
                      const [title, ...descParts] = item.split(':');
                      const description = descParts.join(':').trim();
                      const hasDescription = descParts.length > 0;
                      return (
                        <li key={i} className="flex flex-col space-y-1">
                            <div className="flex-1">
                            <strong className="font-bold text-gray-900 text-sm md:text-base">{title.trim()}</strong>
                              {hasDescription && (
                              <span className="text-gray-700 text-xs md:text-sm ml-1">: {description}</span>
                              )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </ExpandableSection>
      )}

      {data.spectrum_analysis && (
        <ExpandableSection title="종합 경제 스펙트럼 분석" borderColor="border-purple-gradient-200" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.spectrum_analysis) }} />
        </ExpandableSection>
      )}

      {data.detailed_analysis && (
        <ExpandableSection title="당신은 이런 사람입니다" borderColor="border-purple-gradient-300" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.detailed_analysis) }} />
        </ExpandableSection>
      )}

      {data.coaching && (
        <ExpandableSection title="종합 코칭 제언" borderColor="border-purple-gradient-400" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.coaching) }} />
        </ExpandableSection>
      )}

      {data.synergy_partner && (
        <ExpandableSection title="시너지 파트너" borderColor="border-purple-gradient-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.synergy_partner) }} />
        </ExpandableSection>
      )}

      {data.risk_partner && (
        <ExpandableSection title="리스크 파트너" borderColor="border-purple-gradient-600" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.risk_partner) }} />
        </ExpandableSection>
      )}

      {data.success_formula && (
        <ExpandableSection title="성공 공식" borderColor="border-purple-gradient-700" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.success_formula) }} />
        </ExpandableSection>
      )}

      {data.failure_formula && (
        <ExpandableSection title="실패 공식" borderColor="border-purple-gradient-800" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.failure_formula) }} />
        </ExpandableSection>
      )}
    </div>
  );
}
