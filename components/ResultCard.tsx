import Image from 'next/image';
import SpectrumChart from './SpectrumChart';
import Button from './Button';

interface ResultCardProps {
  type: string;
  name: string;
  image: string;
  scores: { [key: string]: number };
  description: string;
  isCompact?: boolean;
  category?: 'political' | 'economic';
}

export default function ResultCard({ 
  type, 
  name, 
  image, 
  scores, 
  description,
  isCompact = false,
  category = 'political'
}: ResultCardProps) {
  return (
    <div className={`bg-white rounded-3xl border-4 border-accent shadow-xl ${isCompact ? 'p-4' : 'p-8'}`}>
      <div className={`text-center ${isCompact ? 'mb-4' : 'mb-8'}`}>
        <div className={`relative mx-auto mb-4 ${isCompact ? 'w-48 h-32' : 'w-full h-80'}`}>
          <Image
            src={image}
            alt={type}
            fill
            className="object-contain rounded-xl"
          />
        </div>
        <h2 className="text-4xl font-bold text-accent mb-2">{type}</h2>
        <h3 className="text-2xl font-medium">{name}</h3>
      </div>
      
      {/* 성향 차트 */}
      <div className={`${isCompact ? 'mb-4' : 'mb-8'}`}>
        <h4 className={`font-semibold ${isCompact ? 'text-lg mb-2' : 'text-xl mb-4'} text-center`}>성향 분석</h4>
        <SpectrumChart data={scores} category={category} />
      </div>
      
      <p className="text-lg leading-relaxed text-gray-700">
        {description}
      </p>
      
      {/* 자세히보기 버튼 - 카드 내부 하단에 위치 */}
      <div className="mt-8 text-center">
        {category === 'political' ? (
          <Button href="/political-detail" variant="outline">
            정치 성향 자세히 보기 →
          </Button>
        ) : (
          <Button href="/economic-detail" variant="outline">
            경제 성향 자세히 보기 →
          </Button>
        )}
      </div>
    </div>
  );
}