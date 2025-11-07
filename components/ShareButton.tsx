'use client';

import { useState } from 'react';
import Button from './Button';

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

  const createShareContent = () => {
    // 더 풍부한 공유 텍스트 생성
    if (type && name && category) {
      const categoryText = category === 'political' ? '정치' : '경제';
      return `🎯 PEIT ${categoryText} 성향 테스트 결과

🏷️ 나의 ${categoryText} 성향: ${type} (${name})

📊 당신도 PEIT에서 자신의 정치·경제 성향을 알아보세요!
${shareUrl}

#PEIT #성향테스트 #${categoryText}성향`;
    }
    return `${shareText}\n\n${shareUrl}`;
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const shareContent = createShareContent();
      
      if (navigator.share) {
        await navigator.share({
          title: 'PEIT 성향 테스트 결과',
          text: shareContent,
          url: shareUrl,
        });
      } else {
        // 클립보드에 복사
        await navigator.clipboard.writeText(shareContent);
        alert('📋 결과가 클립보드에 복사되었습니다!\n\nSNS나 메신저에 붙여넣기 하세요.');
      }
    } catch (error) {
      console.error('공유 실패:', error);
      // 대체 방법: 텍스트 선택하여 복사하도록 안내
      const shareContent = createShareContent();
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareContent);
          alert('📋 결과가 클립보드에 복사되었습니다!');
        } catch {
          // 클립보드 접근도 실패한 경우
          prompt('아래 텍스트를 복사해서 공유하세요:', shareContent);
        }
      } else {
        prompt('아래 텍스트를 복사해서 공유하세요:', shareContent);
      }
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
