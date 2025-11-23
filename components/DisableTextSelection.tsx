'use client';

import { useEffect } from 'react';

export default function DisableTextSelection() {
  useEffect(() => {
    // 텍스트 선택 방지
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'BUTTON' && target.tagName !== 'SELECT' && target.tagName !== 'A') {
        e.preventDefault();
        return false;
      }
    };

    // 복사 방지
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    };

    // 잘라내기 방지
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    };

    // 우클릭 메뉴에서 복사 방지 (일부 브라우저)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'BUTTON' && target.tagName !== 'SELECT' && target.tagName !== 'A') {
        e.preventDefault();
        return false;
      }
    };

    // 드래그 방지
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    // 클린업
    return () => {
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}

