'use client';

import { useState } from 'react';
import Image from 'next/image';
import ResultCard from './ResultCard';
import ResultDetailSections from './ResultDetailSections';

interface FlipCardProps {
  type: string;
  data: any;
  category: 'political' | 'economic';
  title: string;
}

export default function FlipCard({ type, data, category, title }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const imagePath = category === 'political' 
    ? `/images/political/${type}.${type === 'IPUE' ? 'png' : 'jpg'}`
    : `/images/economic/${type}.jpg`;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };


  return (
    <div className="relative z-0 h-[600px] w-full" style={{ perspective: '1000px' }}>
      <div 
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* 앝면 */}
        <div 
          className={`absolute inset-0 w-full h-full ${isFlipped ? 'pointer-events-none' : ''}`}
          style={{ 
            backfaceVisibility: 'hidden',
            visibility: isFlipped ? 'hidden' : 'visible',
            touchAction: 'pan-y'
          }}
        >
          <div className="bg-white rounded-2xl shadow-lg border-2 border-accent h-full flex flex-col items-center justify-center p-8 hover:shadow-xl transition-shadow">
            <div className="relative w-full sm:w-64 h-64 sm:h-64 mb-8 px-4 sm:px-0">
              {/* 실제 이미지 표시 */}
              <div className="w-full h-full overflow-hidden isolation-isolate flex items-center justify-center">
                <Image
                  src={imagePath}
                  alt={type}
                  width={320}
                  height={320}
                  className="object-contain w-full h-full"
                  quality={95}
                  sizes="(max-width: 640px) 100vw, 320px"
                  priority
                  onError={(e) => {
                    // 이미지 로드 실패 시 이모지로 폴백
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = category === 'political' ? '🏛️' : '💼';
                    e.currentTarget.parentElement!.style.fontSize = '4rem';
                    e.currentTarget.parentElement!.style.color = 'gray';
                  }}
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-center text-accent">{title}</h2>
            <p className="text-lg text-center text-gray-600 mb-8">당신의 성향을 확인해보세요</p>
            <div 
              className="bg-accent/10 px-8 py-4 rounded-full cursor-pointer select-none"
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
              role="button"
              aria-label="결과 카드 뒤집기"
            >
              <span className="text-accent font-semibold text-xl">클릭하여 결과 확인</span>
            </div>
          </div>
        </div>

        {/* 뒷면 */}
        <div 
          className={`absolute inset-0 w-full h-full ${!isFlipped ? 'pointer-events-none' : ''}`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            visibility: !isFlipped ? 'hidden' : 'visible'
          }}
        >
          <div 
            className="h-full overflow-y-auto"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ResultCard
              type={type}
              name={data.name}
              image={imagePath}
              scores={data.scores}
              description={data.description}
              isCompact={true}
              category={category}
              hideDetailButton={true}
              showChart={true}
            />
            {/* 카드 뒤집자마자 상세 섹션을 카드 내부에 노출 */}
            <div className="px-2 pb-6">
              <ResultDetailSections type={type} data={data} />
            </div>
            <div className="absolute top-4 right-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
