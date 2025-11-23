import Image from 'next/image';
import SpectrumChart from './SpectrumChart';
import Button from './Button';
import { results } from '@/lib/results';

// 마크다운 스타일 텍스트를 HTML로 변환하는 함수
function renderMarkdownText(text: string) {
  // **텍스트** -> <strong>텍스트</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // ### 제목 처리
  html = html.split('\n').map(paragraph => {
    const trimmed = paragraph.trim();
    if (!trimmed) return '';
    
    if (trimmed.startsWith('### ')) {
      const titleText = trimmed.substring(4).trim();
      return `<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">${titleText}</h3>`;
    }
    
    return paragraph;
  }).join('\n');
  
  return html;
}

interface ResultCardProps {
  type: string;
  name: string;
  image: string;
  scores: { [key: string]: number };
  description: string;
  isCompact?: boolean;
  category?: 'political' | 'economic';
  hideDetailButton?: boolean;
  showChart?: boolean;
}

export default function ResultCard({ 
  type, 
  name, 
  image, 
  scores, 
  description,
  isCompact = false,
  category = 'political',
  hideDetailButton = false,
  showChart = true
}: ResultCardProps) {
  return (
    <div className={`bg-white rounded-3xl border-4 border-accent shadow-xl ${isCompact ? 'p-4' : 'p-8'}`}>
      <div className={`text-center ${isCompact ? 'mb-4' : 'mb-8'}`}>
        <div className={`relative mx-auto mb-4 ${isCompact ? 'w-48 h-32' : 'w-full'} overflow-hidden isolation-isolate`}>
          <Image
            src={image}
            alt={type}
            width={isCompact ? 192 : 800}
            height={isCompact ? 128 : 533}
            className="w-full h-auto object-cover"
            style={{ maxHeight: isCompact ? '128px' : '400px' }}
            quality={95}
            sizes={isCompact ? '192px' : '(max-width: 768px) 100vw, (max-width: 1200px) 800px, 800px'}
            priority={!isCompact}
          />
        </div>
        <h2 className="text-4xl font-bold text-accent mb-2">{type}</h2>
        <h3 className="text-2xl font-medium">{name}</h3>
      </div>
      
      {/* 성향 차트 - 검사 결과가 있을 때만 표시 */}
      {showChart && (
        <div className={`${isCompact ? 'mb-4' : 'mb-8'}`}>
          <h4 className={`font-semibold ${isCompact ? 'text-lg mb-2' : 'text-xl mb-4'} text-center`}>성향 분석</h4>
          <SpectrumChart data={scores} category={category} />
        </div>
      )}
      
      <p 
        className="text-lg leading-relaxed text-gray-700"
        dangerouslySetInnerHTML={{ __html: renderMarkdownText(
          category === 'economic' && results[type]?.spectrum_analysis 
            ? results[type].spectrum_analysis 
            : description
        ) }}
      />
      
      {/* 자세히보기 버튼 (옵션) */}
      {!hideDetailButton && (
        <div className="mt-8 text-center">
          <Button href={`/result/${type}`} variant="outline">
            {category === 'political' ? '정치' : '경제'} 성향 자세히 보기 →
          </Button>
        </div>
      )}
    </div>
  );
}
