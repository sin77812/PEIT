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
    .map((p) => (p.trim() ? `<p class="mb-4 last:mb-0">${p}</p>` : ''))
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
          <ExpandableSection title={`#${data.keywords.join(' #')}`} borderColor="border-accent" defaultExpanded={defaultExpanded}>
            <div className="flex flex-wrap gap-3">
              {data.keywords.map((k: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-base font-medium">#{k}</span>
              ))}
            </div>
          </ExpandableSection>
        )}

        {data.summary && (
          <ExpandableSection title="한 줄 요약" borderColor="border-accent" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed">{data.summary}</div>
          </ExpandableSection>
        )}

        {data.political_spectrum && data.political_spectrum_detail && (
          <ExpandableSection title={`종합 정치 스펙트럼: ${data.political_spectrum}`} borderColor="border-gray-300" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.political_spectrum_detail) }} />
          </ExpandableSection>
        )}

        {data.detailed_description && (
          <ExpandableSection title="당신은 이런 사람입니다" borderColor="border-gray-300" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.detailed_description) }} />
          </ExpandableSection>
        )}

        {(data.speech_style || data.stress_moment || data.solution || data.love_value || data.best_partner || data.worst_partner) && (
          <ExpandableSection title="당신의 화법" borderColor="border-accent" defaultExpanded={defaultExpanded}>
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

        {data.communication_barrier && (
          <ExpandableSection title="소통의 벽: 당신이 보수주의자와 대화할 때 답답함을 느끼는 이유" borderColor="border-orange-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.communication_barrier) }} />
          </ExpandableSection>
        )}

        {(data.career_value || data.financial_style) && (
          <ExpandableSection title="돈과 일에 대한 태도" borderColor="border-indigo-500" defaultExpanded={defaultExpanded}>
            <div className="space-y-6">
              {data.career_value && (
                <div>
                  <h4 className="font-semibold mb-2">직업적 가치관</h4>
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.career_value) }} />
                </div>
              )}
              {data.financial_style && (
                <div>
                  <h4 className="font-semibold mb-2">잠재적 재무 스타일</h4>
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.financial_style) }} />
                </div>
              )}
            </div>
          </ExpandableSection>
        )}

        {(data.historical_avatar || data.real_avatar) && (
          <ExpandableSection title="역사와 현실 속 당신의 아바타" borderColor="border-purple-500" defaultExpanded={defaultExpanded}>
            <div className="space-y-6">
              {data.historical_avatar && (
                <div>
                  <h4 className="font-semibold mb-2">역사적 아바타</h4>
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.historical_avatar) }} />
                </div>
              )}
              {data.real_avatar && (
                <div>
                  <h4 className="font-semibold mb-2">현실 속 아바타</h4>
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.real_avatar) }} />
                </div>
              )}
            </div>
          </ExpandableSection>
        )}

        {(data.growth_direction || data.recommended_books?.length || data.recommended_content || data.final_goal) && (
          <ExpandableSection title="개인적 성장과 자기계발" borderColor="border-green-500" defaultExpanded={defaultExpanded}>
            <div className="space-y-6">
              {data.growth_direction && (
                <div>
                  <h4 className="font-semibold mb-2">성장 방향성</h4>
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.growth_direction) }} />
                </div>
              )}
              {(data.recommended_books?.length || data.recommended_content) && (
                <div>
                  <h4 className="font-semibold mb-2">도서추천</h4>
                  {data.recommended_books && data.recommended_books.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {data.recommended_books.map((book: any, i: number) => (
                        <li key={i}><span className="font-semibold">『{book.title}』</span> <span className="text-gray-600">({book.author})</span></li>
                      ))}
                    </ul>
                  )}
                  {data.recommended_content && (
                    <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.recommended_content) }} />
                  )}
                </div>
              )}
              {data.final_goal && (
                <div>
                  <h4 className="font-semibold mb-2">성장의 최종 목표</h4>
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.final_goal) }} />
                </div>
              )}
            </div>
          </ExpandableSection>
        )}

        {Array.isArray(data.strengths) && data.strengths.length > 0 && Array.isArray(data.weaknesses) && data.weaknesses.length > 0 && (
          <ExpandableSection title="강점과 약점" borderColor="border-green-500" defaultExpanded={defaultExpanded}>
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
              <div>
                <h4 className="font-semibold mb-2">약점</h4>
                <ul className="space-y-3">
                  {data.weaknesses.map((item: string, i: number) => {
                    const [title, ...descParts] = item.split(':');
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
          </ExpandableSection>
        )}
      </div>
    );
  }

  // Economic detail sections (matches screenshot ordering/labels)
  return (
    <div className="mt-6 space-y-4">
      {data.nickname && (
        <ExpandableSection title={`#${stripEmojis(data.nickname)}`} borderColor="border-accent" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700">#{stripEmojis(data.nickname)}</div>
        </ExpandableSection>
      )}

      {data.spectrum_analysis && (
        <ExpandableSection title="종합 경제 스펙트럼 분석" borderColor="border-gray-300" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.spectrum_analysis) }} />
        </ExpandableSection>
      )}

      {data.detailed_analysis && (
        <ExpandableSection title="당신은 이런 사람입니다" borderColor="border-gray-300" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.detailed_analysis) }} />
        </ExpandableSection>
      )}

      {data.coaching && (
        <ExpandableSection title="종합 코칭 제언" borderColor="border-yellow-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.coaching) }} />
        </ExpandableSection>
      )}

      {data.synergy_partner && (
        <ExpandableSection title="시너지 파트너" borderColor="border-green-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.synergy_partner) }} />
        </ExpandableSection>
      )}

      {data.risk_partner && (
        <ExpandableSection title="리스크 파트너" borderColor="border-red-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.risk_partner) }} />
        </ExpandableSection>
      )}

      {data.success_formula && (
        <ExpandableSection title="성공 공식" borderColor="border-blue-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.success_formula) }} />
        </ExpandableSection>
      )}

      {data.failure_formula && (
        <ExpandableSection title="실패 공식" borderColor="border-gray-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.failure_formula) }} />
        </ExpandableSection>
      )}
    </div>
  );
}
