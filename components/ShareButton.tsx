'use client';

import { useState, useRef } from 'react';
import Button from './Button';
import html2canvas from 'html2canvas';

interface ShareButtonProps {
  shareUrl: string;
  shareText: string;
  type?: string;
  name?: string;
  category?: 'political' | 'economic';
  className?: string;
  resultContainerSelector?: string; // 결과지 전체를 캡처할 컨테이너 선택자
}

export default function ShareButton({ shareUrl, shareText, type, name, category, className = '', resultContainerSelector }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const createShareContent = () => {
    // 더 풍부한 공유 텍스트 생성
    if (type && name && category) {
      const categoryText = category === 'political' ? '정치' : '경제';
      // URL을 별도 줄에 배치하고 앞뒤 공백을 확실히 해서 메시지 앱이 링크로 인식하기 쉽게 함
      return `🎯 PEIT ${categoryText} 성향 테스트 결과

🏷️ 나의 ${categoryText} 성향: ${type} (${name})

📊 당신도 PEIT에서 자신의 정치·경제 성향을 알아보세요!

${shareUrl}

#PEIT #성향테스트 #${categoryText}성향`;
    }
    // URL을 별도 줄에 배치
    return `${shareText}

${shareUrl}`;
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // 결과지 전체를 이미지로 캡처하는 경우
      if (resultContainerSelector) {
        const container = document.querySelector(resultContainerSelector) as HTMLElement;
        if (container) {
          // 그래프 부분 숨기기 (성향 분석 섹션 전체)
          const chartParents: Array<{ element: HTMLElement; originalDisplay: string }> = [];
          
          // "성향 분석" 제목을 찾아서 그 섹션 전체를 숨김
          const allHeadings = container.querySelectorAll('h4');
          allHeadings.forEach(heading => {
            if (heading.textContent?.includes('성향 분석') || heading.textContent?.includes('분석')) {
              // h4의 부모 div를 찾아서 숨김 (ResultCard 구조상 h4 바로 위 div가 섹션)
              let section = heading.parentElement;
              // 최대 3단계까지 부모를 찾아봄
              for (let i = 0; i < 3 && section; i++) {
                if (section.tagName === 'DIV' && section.classList.length > 0) {
                  const originalDisplay = section.style.display;
                  section.style.display = 'none';
                  chartParents.push({ element: section, originalDisplay });
                  break;
                }
                section = section.parentElement;
              }
            }
          });
          
          // Canvas나 SVG 차트 요소도 숨김 (혹시 모를 경우를 대비)
          const chartElements = container.querySelectorAll('canvas, svg');
          chartElements.forEach(el => {
            const parent = el.closest('div');
            if (parent && !chartParents.find(p => p.element === parent)) {
              const originalDisplay = parent.style.display;
              parent.style.display = 'none';
              chartParents.push({ element: parent, originalDisplay });
            }
          });

          try {
            // html2canvas로 캡처
            const canvas = await html2canvas(container, {
              backgroundColor: '#FAF7FF',
              scale: 2,
              logging: false,
              useCORS: true,
            });

            // 그래프 다시 표시
            chartParents.forEach(({ element, originalDisplay }) => {
              element.style.display = originalDisplay;
            });

            // Canvas를 Blob으로 변환
            canvas.toBlob(async (blob) => {
              if (!blob) {
                // Blob 변환 실패 시 텍스트 공유로 폴백
                await shareAsText();
                return;
              }

              // File 객체 생성
              const file = new File([blob], `PEIT-${type || 'result'}-결과.png`, { type: 'image/png' });

              // navigator.share로 이미지 공유
              if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                  await navigator.share({
                    title: 'PEIT 성향 테스트 결과',
                    text: type && name && category 
                      ? `나의 ${category === 'political' ? '정치' : '경제'} 성향: ${type} (${name})`
                      : shareText,
                    files: [file],
                    url: shareUrl,
                  });
                } catch (shareError: any) {
                  // 파일 공유 실패 시 텍스트 공유로 폴백
                  if (shareError.name !== 'AbortError') {
                    console.error('이미지 공유 실패:', shareError);
                    await shareAsText();
                  }
                }
              } else {
                // 파일 공유를 지원하지 않는 경우 텍스트 공유
                await shareAsText();
              }
            }, 'image/png');
          } catch (captureError) {
            console.error('이미지 캡처 실패:', captureError);
            // 캡처 실패 시 텍스트 공유로 폴백
            await shareAsText();
          }
        } else {
          // 컨테이너를 찾을 수 없는 경우 텍스트 공유
          await shareAsText();
        }
      } else {
        // 결과지 컨테이너가 없는 경우 기존 방식 (텍스트 공유)
        await shareAsText();
      }
    } catch (error) {
      console.error('공유 실패:', error);
      await shareAsText();
    } finally {
      setIsSharing(false);
    }
  };

  const shareAsText = async () => {
    const shareContent = createShareContent();
    
    if (navigator.share) {
      try {
        const shareTextOnly = shareContent.replace(shareUrl, '').trim();
        await navigator.share({
          title: 'PEIT 성향 테스트 결과',
          text: shareTextOnly,
          url: shareUrl,
        });
      } catch (shareError: any) {
        // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
        if (shareError.name === 'AbortError') {
          return;
        }
        // 공유 실패 시 클립보드로 폴백
        if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(shareContent);
            alert('📋 결과가 클립보드에 복사되었습니다!\n\nSNS나 메신저에 붙여넣기 하세요.');
          } catch {
            prompt('아래 텍스트를 복사해서 공유하세요:', shareContent);
          }
        } else {
          prompt('아래 텍스트를 복사해서 공유하세요:', shareContent);
        }
      }
    } else {
      // navigator.share를 지원하지 않는 경우 클립보드에 복사
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareContent);
          alert('📋 결과가 클립보드에 복사되었습니다!\n\nSNS나 메신저에 붙여넣기 하세요.');
        } catch {
          prompt('아래 텍스트를 복사해서 공유하세요:', shareContent);
        }
      } else {
        prompt('아래 텍스트를 복사해서 공유하세요:', shareContent);
      }
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
