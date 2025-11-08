"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link href="/test?type=political" className="text-black font-bold hover:text-accent transition-colors" onClick={onClick}>
        정치 검사
      </Link>
      <Link href="/test?type=economic" className="text-black font-bold hover:text-accent transition-colors" onClick={onClick}>
        경제 검사
      </Link>
      <Link href="/types" className="text-black font-bold hover:text-accent transition-colors" onClick={onClick}>
        유형 종류
      </Link>
      <Link href="/about" className="text-black font-bold hover:text-accent transition-colors" onClick={onClick}>
        서비스
      </Link>
    </>
  );

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

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Right drawer: 40% of viewport width on mobile */}
      <div
        className={`fixed top-0 right-0 h-screen w-[40vw] max-w-[80%] min-w-[240px] bg-white shadow-xl md:hidden transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-lg font-semibold text-accent">메뉴</span>
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <NavLinks onClick={() => setOpen(false)} />
        </div>
      </div>
    </nav>
  );
}
