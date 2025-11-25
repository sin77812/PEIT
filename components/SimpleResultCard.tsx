import Image from 'next/image';
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

interface SimpleResultCardProps {
  type: string;
}

export default function SimpleResultCard({ type }: SimpleResultCardProps) {
  const data = results[type];

  console.log('SimpleResultCard DEBUG:');
  console.log('- type:', type);
  console.log('- data:', data);
  console.log('- results keys:', Object.keys(results));
  console.log('- has IPUE?', 'IPUE' in results);

  if (!data) {
    return (
      <div className="min-h-screen bg-red-100 p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">디버그 정보</h1>
          <p><strong>요청된 type:</strong> "{type}"</p>
          <p><strong>type의 타입:</strong> {typeof type}</p>
          <p><strong>사용 가능한 키들:</strong></p>
          <ul className="list-disc pl-6">
            {Object.keys(results).map(key => (
              <li key={key} className={key === type ? 'text-green-600 font-bold' : ''}>
                {key} {key === type && '← 매치!'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // IPUE는 PNG 파일이므로 특별 처리
  const imageExtension = type === 'IPUE' ? 'png' : 'jpg';
  const imagePath = data.category === 'political' 
    ? `/images/political/${type}.${imageExtension}`
    : `/images/economic/${type}.jpg`;

  return (
    <div className="min-h-screen bg-bg-light-purple py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          {data.category === 'political' ? '정치' : '경제'} 성향
        </h1>

        {/* 심플한 카드 - 심볼, 이름, 간단 설명만 */}
        <div className="bg-white rounded-3xl border-4 border-accent shadow-xl p-8 text-center">
          <div className="relative mx-auto mb-8 w-full h-80 overflow-hidden isolation-isolate">
            <Image
              src={imagePath}
              alt={type}
              fill
              className="object-contain"
              quality={95}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
          
          <h2 className="text-4xl font-bold text-accent mb-4">{type}</h2>
          <h3 className="text-2xl font-medium mb-6">{data.name}</h3>
          
          <p 
            className="text-lg leading-relaxed text-gray-700 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdownText(
              data.category === 'economic' && data.spectrum_analysis 
                ? data.spectrum_analysis 
                : data.description
            ) }}
          />
        </div>

        {/* 액션 버튼들 - 메인과 동일 링크 구성 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button href="/test?type=political" variant="primary" className="btn-purple">
            정치 성향 테스트
          </Button>
          <Button href="/test?type=economic" variant="primary" className="btn-purple">
            경제 성향 테스트
          </Button>
          <Button href="/types" variant="outline" className="btn-purple-outline">
            유형 더보기
          </Button>
          <Button href="/" variant="outline" className="btn-purple-outline">
            메인으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
}
