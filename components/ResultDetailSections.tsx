'use client';

import ExpandableSection from '@/components/ExpandableSection';

interface ResultDetailSectionsProps {
  type: string;
  data: any; // shape follows lib/results.ts entries
  defaultExpanded?: boolean;
}

// Simple markdown-ish to HTML used in detail sections
function renderMarkdownText(text: string) {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  html = html.replace(/'([^']+)'/g, '<span class="text-accent font-medium">\'$1\'</span>');
  html = html
    .split('\n')
    .map((p) => (p.trim() ? `<p class="mb-4 last:mb-0">${p}</p>` : ''))
    .join('');
  return html;
}

export default function ResultDetailSections({ type, data, defaultExpanded = false }: ResultDetailSectionsProps) {
  if (!data) return null;

  // Political detail sections
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

        {data.political_spectrum_detail && (
          <ExpandableSection title="종합 정치 스펙트럼 분석" borderColor="border-gray-300" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.political_spectrum_detail) }} />
          </ExpandableSection>
        )}

        {data.detailed_analysis && (
          <ExpandableSection title="당신은 이런 사람입니다" borderColor="border-gray-300" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.detailed_analysis) }} />
          </ExpandableSection>
        )}

        {data.coaching && (
          <ExpandableSection title="💡 종합 코칭 제언" borderColor="border-blue-500" defaultExpanded={defaultExpanded}>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.coaching) }} />
          </ExpandableSection>
        )}
      </div>
    );
  }

  // Economic detail sections (matches screenshot ordering/labels)
  return (
    <div className="mt-6 space-y-4">
      {data.nickname && (
        <ExpandableSection title={`#${data.nickname}`} borderColor="border-accent" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700">#{data.nickname}</div>
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
        <ExpandableSection title="💡 종합 코칭 제언" borderColor="border-yellow-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.coaching) }} />
        </ExpandableSection>
      )}

      {data.synergy_partner && (
        <ExpandableSection title="🤝 시너지 파트너" borderColor="border-green-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.synergy_partner) }} />
        </ExpandableSection>
      )}

      {data.risk_partner && (
        <ExpandableSection title="🔥 리스크 파트너" borderColor="border-red-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.risk_partner) }} />
        </ExpandableSection>
      )}

      {data.success_formula && (
        <ExpandableSection title="💰 성공 공식" borderColor="border-blue-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.success_formula) }} />
        </ExpandableSection>
      )}

      {data.failure_formula && (
        <ExpandableSection title="💸 실패 공식" borderColor="border-gray-500" defaultExpanded={defaultExpanded}>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdownText(data.failure_formula) }} />
        </ExpandableSection>
      )}
    </div>
  );
}

