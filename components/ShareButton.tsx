'use client';

import { useState } from 'react';

interface ShareButtonProps {
  shareUrl: string;
  shareText: string;
  type?: string;
  name?: string;
  category?: 'political' | 'economic';
  className?: string;
}

export default function ShareButton({ shareUrl, shareText, type, name, category, className = '' }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const categoryText = category === 'political' ? '정치' : '경제';
      const shareTitle = '나의 정치/경제 성향 테스트 결과는?';
      const shareTextContent = type && name 
        ? `${type} (${name}) - PEIT24 ${categoryText} 성향 테스트`
        : shareText;

      // navigator.share 지원 여부 확인 (모바일)
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareTextContent,
            url: shareUrl,
          });
          // 공유 성공
          return;
        } catch (shareError: any) {
          // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
          if (shareError.name === 'AbortError') {
            return;
          }
          // 공유 실패 시 클립보드로 폴백
          console.error('공유 실패:', shareError);
        }
      }
      
      // navigator.share를 지원하지 않는 경우 (PC) 또는 공유 실패 시 클립보드 복사
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('📋 링크가 복사되었습니다!\n\nSNS나 메신저에 붙여넣기 하세요.');
        } catch {
          prompt('아래 링크를 복사해서 공유하세요:', shareUrl);
        }
      } else {
        prompt('아래 링크를 복사해서 공유하세요:', shareUrl);
      }
    } catch (error) {
      console.error('공유 실패:', error);
      alert('공유에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button 
      onClick={handleShare} 
      disabled={isSharing}
      className={`px-6 py-3 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSharing ? '공유 중...' : '결과 공유하기'}
    </button>
  );
}
