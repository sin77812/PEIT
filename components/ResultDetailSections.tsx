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

        {data.speech_style && (
          <ExpandableSection title="당신의 화법: '가능성을 여는 대화'" borderColor="border-accent" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.speech_style) }} />
          </ExpandableSection>
        )}

        {data.stress_moment && (
          <ExpandableSection title="당신이 스트레스 받는 순간" borderColor="border-red-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.stress_moment) }} />
          </ExpandableSection>
        )}

        {data.solution && (
          <ExpandableSection title="솔루션: 'If' 화법을 사용해 보세요" borderColor="border-blue-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.solution) }} />
          </ExpandableSection>
        )}

        {data.love_value && (
          <ExpandableSection title="당신의 연애 가치관" borderColor="border-pink-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.love_value) }} />
          </ExpandableSection>
        )}

        {data.best_partner && (
          <ExpandableSection title="최고의 연애 파트너" borderColor="border-green-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.best_partner) }} />
          </ExpandableSection>
        )}

        {data.worst_partner && (
          <ExpandableSection title="최악의 갈등 상대" borderColor="border-red-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.worst_partner) }} />
          </ExpandableSection>
        )}

        {data.communication_barrier && (
          <ExpandableSection title="소통의 벽: 당신이 보수주의자와 대화할 때 답답함을 느끼는 이유" borderColor="border-orange-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.communication_barrier) }} />
          </ExpandableSection>
        )}

        {data.career_value && (
          <ExpandableSection title="직업적 가치관" icon="💼" borderColor="border-indigo-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.career_value) }} />
          </ExpandableSection>
        )}

        {data.financial_style && (
          <ExpandableSection title="잠재적 재무 스타일" icon="💰" borderColor="border-yellow-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.financial_style) }} />
          </ExpandableSection>
        )}

        {data.historical_avatar && (
          <ExpandableSection title="역사적 아바타" borderColor="border-purple-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.historical_avatar) }} />
          </ExpandableSection>
        )}

        {data.real_avatar && (
          <ExpandableSection title="현실 속 아바타" borderColor="border-purple-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.real_avatar) }} />
          </ExpandableSection>
        )}

        {data.growth_direction && (
          <ExpandableSection title="성장 방향성" icon="🌱" borderColor="border-green-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.growth_direction) }} />
          </ExpandableSection>
        )}

        {data.growth_task && (
          <ExpandableSection title={`핵심 성장 과제: ${data.growth_task}`} icon="🎯" borderColor="border-blue-500" defaultExpanded={defaultExpanded}>
            <div className="space-y-4">
              {data.recommended_books && data.recommended_books.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold">추천도서</p>
                  {data.recommended_books.map((book: any, i: number) => (
                    <div key={i} className="flex items-start">
                      <div>
                        <span className="font-semibold">『{book.title}』</span>
                        <span className="text-gray-600 ml-1">({book.author})</span>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-accent ml-2 underline">도서 최저가 구매하기</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {data.recommended_content && (
                <div>
                  <p className="font-semibold mb-2">추천 영상/강의:</p>
                  <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.recommended_content) }} />
                </div>
              )}
            </div>
          </ExpandableSection>
        )}

        {data.final_goal && (
          <ExpandableSection title="성장의 최종 목표" borderColor="border-yellow-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.final_goal) }} />
          </ExpandableSection>
        )}

        {/* 강점/약점: 정치 데이터에 공통으로 존재하는 경우가 많아 기본 제공 */}
        {Array.isArray(data.strengths) && data.strengths.length > 0 && (
          <ExpandableSection title="강점 (Strengths)" borderColor="border-green-500" defaultExpanded={defaultExpanded}>
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
          </ExpandableSection>
        )}

        {Array.isArray(data.weaknesses) && data.weaknesses.length > 0 && (
          <ExpandableSection title="약점 (Weaknesses)" borderColor="border-red-500" defaultExpanded={defaultExpanded}>
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
