'use client';

import Button from './Button';

interface ShareButtonProps {
  shareUrl: string;
  shareText: string;
}

export default function ShareButton({ shareUrl, shareText }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PEIT 결과',
        text: shareText,
        url: shareUrl,
      });
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('결과가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <Button onClick={handleShare} variant="secondary">
      결과 공유하기
    </Button>
  );
}