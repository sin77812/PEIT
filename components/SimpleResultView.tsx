'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import Button from './Button';

interface SimpleResultViewProps {
  type: string;
  name: string;
  category: 'political' | 'economic';
}

export default function SimpleResultView({ type, name, category }: SimpleResultViewProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // IPUE는 PNG 파일이므로 특별 처리
  const imageExtension = type === 'IPUE' ? 'png' : 'jpg';
  const imagePath = category === 'political' 
    ? `/images/political/${type}.${imageExtension}`
    : `/images/economic/${type}.jpg`;

  const handleSaveCard = async () => {
    if (!cardRef.current) return;
    
    setIsCapturing(true);
    
    try {
      const canvas = await html2canvas(cardRef.current);
      
      // 캔버스를 이미지로 변환하여 다운로드
      const link = document.createElement('a');
      link.download = `PEIT-${type}-결과.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('카드 저장 중 오류:', error);
      alert('카드 저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light-purple py-12 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          당신의 {category === 'political' ? '정치' : '경제'} 성향은
        </h1>

        {/* 캡처될 카드 영역 */}
        <div 
          ref={cardRef}
          className="bg-white rounded-3xl border-4 border-accent shadow-xl p-8 text-center mb-8"
        >
          <div className="relative mx-auto mb-6 w-full h-64">
            <Image
              src={imagePath}
              alt={type}
              fill
              className="object-contain rounded-xl"
            />
          </div>
          
          <h2 className="text-4xl font-bold text-accent mb-2">{type}</h2>
          <h3 className="text-2xl font-medium text-gray-800">{name}</h3>
          
          {/* PEIT 로고 추가 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">PEIT - 당신의 정치·경제 좌표</p>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleSaveCard}
            disabled={isCapturing}
            className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {isCapturing ? '저장 중...' : '📱 카드 저장하기'}
          </button>
          
          <Button 
            href={`/result/${type}?detailed=true`}
            variant="primary"
            className="w-full"
          >
            📊 클릭하여 결과 확인
          </Button>
        </div>
      </div>
    </div>
  );
}