"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close drawer on route change to avoid overlay blocking clicks
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleTestNavigation = (testType: 'political' | 'economic') => {
    // Clear the localStorage for the test being started to ensure it begins from question 1
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${testType}_currentQuestion`);
      localStorage.removeItem(`${testType}_answers`);
      localStorage.removeItem(`${testType}_shuffledOrder`);
    }
    router.push(`/test?type=${testType}`);
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => {
    // PC 버전 스타일 (onClick이 없을 때)
    const isMobile = !!onClick;
    const baseClasses = isMobile 
      ? "text-xl font-bold text-gray-900 hover:text-accent hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 text-left py-4 px-4 rounded-lg"
      : "text-black font-bold hover:text-accent transition-colors";
    
    return (
      <>
        <button 
          className={baseClasses}
          onClick={() => {
            handleTestNavigation('political');
            onClick?.();
          }}
        >
          정치 검사
        </button>
        <button 
          className={baseClasses}
          onClick={() => {
            handleTestNavigation('economic');
            onClick?.();
          }}
        >
          경제 검사
        </button>
        <Link 
          href="/types" 
          className={baseClasses} 
          onClick={onClick}
        >
          유형 종류
        </Link>
        <Link 
          href="/peitshop" 
          className={baseClasses} 
          onClick={onClick}
        >
          도서추천
        </Link>
        <Link 
          href="/about" 
          className={baseClasses} 
          onClick={onClick}
        >
          서비스
        </Link>
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-accent">
            PEIT24
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <a
              href="https://www.instagram.com/peit24__purples"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-700 hover:text-accent transition-colors"
              title="Instagram: @peit24__purples"
            >
              {/* Instagram Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z" />
                <path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                <circle cx="17.5" cy="6.5" r="1.2" />
              </svg>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            aria-label="메뉴 열기"
            onClick={() => setOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay - 화면 전체를 덮는 어두운 배경 */}
      {open && (
        <div
          className="fixed inset-0 z-40 w-full h-screen bg-black/60 md:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Right drawer: 완전 불투명한 오른쪽 슬라이드 메뉴 */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[40vw] max-w-[240px] min-w-[200px] bg-white shadow-2xl md:hidden transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        {/* 메뉴 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">메뉴</span>
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {/* 메뉴 리스트 */}
        <div className="flex flex-col p-6 gap-1">
          <NavLinks onClick={() => setOpen(false)} />
          <a
            href="https://www.instagram.com/peit24__purples"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-xl font-bold text-gray-900 hover:text-accent hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 text-left py-4 px-4 rounded-lg flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            {/* Instagram Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z" />
              <path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
              <circle cx="17.5" cy="6.5" r="1.2" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
