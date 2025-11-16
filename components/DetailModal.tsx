'use client';

import { useEffect } from 'react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

// 마크다운 스타일 텍스트를 HTML로 변환하는 함수
function renderMarkdownText(text: string) {
  // **텍스트** -> <strong>텍스트</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // '텍스트' -> <span class="text-accent">텍스트</span>
  html = html.replace(/'([^']+)'/g, '<span class="text-accent font-medium">\'$1\'</span>');
  
  // 줄바꿈 처리 - ### 제목 처리 포함
  html = html.split('\n').map(paragraph => {
    const trimmed = paragraph.trim();
    if (!trimmed) return '';
    
    // ### 제목 처리
    if (trimmed.startsWith('### ')) {
      const titleText = trimmed.substring(4).trim();
      return `<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">${titleText}</h3>`;
    }
    
    return `<p class="mb-4 last:mb-0">${paragraph}</p>`;
  }).join('');
  
  return html;
}

export default function DetailModal({ isOpen, onClose, title, content }: DetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdownText(content) }}
          />
        </div>
      </div>
    </>
  );
}