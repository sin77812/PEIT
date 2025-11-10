import Image from 'next/image';
import Button from './Button';
import { results } from '@/lib/results';

interface SimpleResultCardProps {
  type: string;
}

export default function SimpleResultCard({ type }: SimpleResultCardProps) {
  const data = results[type];

  if (!data) {
    return <div>결과를 찾을 수 없습니다.</div>;
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
          <div className="relative mx-auto mb-8 w-full h-80">
            <Image
              src={imagePath}
              alt={type}
              fill
              className="object-contain rounded-xl"
            />
          </div>
          
          <h2 className="text-4xl font-bold text-accent mb-4">{type}</h2>
          <h3 className="text-2xl font-medium mb-6">{data.name}</h3>
          
          <p className="text-lg leading-relaxed text-gray-700 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* 액션 버튼들 - 메인과 동일 링크 구성 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button href="/test?type=political" variant="primary" className="btn-purple">
            정치 성향 테스트
          </Button>
          <Button href="/test?type=economic" variant="primary" className="btn-purple">
            경제 성향 테스트
          </Button>
          <Button href="/" variant="outline" className="btn-purple-outline">
            메인으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
}
