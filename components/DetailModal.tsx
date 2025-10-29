'use client';

import { useEffect } from 'react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
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
          <p className="text-gray-700 whitespace-pre-line">{content}</p>
        </div>
      </div>
    </>
  );
}