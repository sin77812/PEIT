'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { results } from '@/lib/results';

function TypesPageContent() {
  const searchParams = useSearchParams();
  const highlightedCode = searchParams.get('code');
  const politicalTypes = Object.entries(results)
    .filter(([_, data]) => data.category === 'political')
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => a.code.localeCompare(b.code));
    
  const economicTypes = Object.entries(results)
    .filter(([_, data]) => data.category === 'economic')
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => a.code.localeCompare(b.code));

  const stripEnglish = (label: string) => label.replace(/\s*\([^)]*\)$/, '');

  // 정치 유형을 카테고리별로 그룹화
  const groupPoliticalTypes = () => {
    const groups: Record<string, typeof politicalTypes> = {
      '개인주의 + 진보': [],
      '개인주의 + 보수': [],
      '공동체주의 + 진보': [],
      '공동체주의 + 보수': [],
    };

    politicalTypes.forEach(type => {
      const first = type.code[0]; // I or C
      const second = type.code[1]; // P or T
      
      if (first === 'I' && second === 'P') {
        groups['개인주의 + 진보'].push(type);
      } else if (first === 'I' && second === 'T') {
        groups['개인주의 + 보수'].push(type);
      } else if (first === 'C' && second === 'P') {
        groups['공동체주의 + 진보'].push(type);
      } else if (first === 'C' && second === 'T') {
        groups['공동체주의 + 보수'].push(type);
      }
    });

    return groups;
  };

  const politicalGroups = groupPoliticalTypes();

  // 경제 유형을 카테고리별로 그룹화
  const groupEconomicTypes = () => {
    const groups: Record<string, typeof economicTypes> = {
      '성장 지향': [],
      '안정 지향': [],
    };

    economicTypes.forEach(type => {
      const first = type.code[0]; // G or S
      if (first === 'G') {
        groups['성장 지향'].push(type);
      } else if (first === 'S') {
        groups['안정 지향'].push(type);
      }
    });

    return groups;
  };

  const economicGroups = groupEconomicTypes();

  // 강조된 유형이 있으면 해당 카드로 스크롤
  useEffect(() => {
    if (highlightedCode) {
      const element = document.getElementById(`highlighted-${highlightedCode}`);
      if (element) {
        // 약간의 지연 후 스크롤 (렌더링 완료 대기)
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [highlightedCode]);

  return (
    <div className="min-h-screen bg-bg-light-purple py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          모든 유형 알아보기
        </h1>
        <p className="text-center text-gray-600 mb-12">
          정치 유형 16개 · 경제 유형 8개
        </p>

        {/* 정치 유형 */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">정치 유형</h2>
            <span className="text-lg text-gray-600">총 16개</span>
          </div>
          
          <div className="space-y-12">
            {Object.entries(politicalGroups).map(([category, types]) => (
              <div key={category} className="bg-white/50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-accent/30 pb-2">
                  {category} ({types.length}개)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {types.map(({ code, name, keywords }) => {
                    const isHighlighted = highlightedCode === code;
                    return (
                    <Link
                      key={code}
                      href={`/result/${code}?from=types`}
                      className={`bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border-2 ${
                        isHighlighted 
                          ? 'border-accent shadow-lg scale-105 ring-2 ring-accent/50' 
                          : 'border-transparent hover:border-accent/50'
                      }`}
                      id={isHighlighted ? `highlighted-${code}` : undefined}
                    >
                      <div className="relative w-full h-24 sm:h-28 mb-3 overflow-hidden isolation-isolate">
                        <Image
                          src={`/images/political/${code}.${code === 'IPUE' ? 'png' : 'jpg'}`}
                          alt={name}
                          fill
                          className="object-contain"
                          quality={95}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                        />
                      </div>
                      <h4 className="font-bold text-accent text-center text-sm mb-1">{code}</h4>
                      <p className="text-xs text-center text-gray-700 mb-2 leading-tight">
                        {stripEnglish(name as string)}
                      </p>
                      {keywords && keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                          {keywords.slice(0, 2).map((keyword, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded">
                              #{keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 경제 유형 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">경제 유형</h2>
            <span className="text-lg text-gray-600">총 8개</span>
          </div>
          
          <div className="space-y-12">
            {Object.entries(economicGroups).map(([category, types]) => (
              <div key={category} className="bg-white/50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-accent/30 pb-2">
                  {category} ({types.length}개)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {types.map(({ code, name, keywords }) => {
                    const isHighlighted = highlightedCode === code;
                    return (
                    <Link
                      key={code}
                      href={`/result/${code}?from=types`}
                      className={`bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border-2 ${
                        isHighlighted 
                          ? 'border-accent shadow-lg scale-105 ring-2 ring-accent/50' 
                          : 'border-transparent hover:border-accent/50'
                      }`}
                      id={isHighlighted ? `highlighted-${code}` : undefined}
                    >
                      <div className="relative w-full h-24 sm:h-28 mb-3 overflow-hidden isolation-isolate">
                        <Image
                          src={`/images/economic/${code}.jpg`}
                          alt={name}
                          fill
                          className="object-contain"
                          quality={95}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                        />
                      </div>
                      <h4 className="font-bold text-accent text-center text-sm mb-1">{code}</h4>
                      <p className="text-xs text-center text-gray-700 mb-2 leading-tight">
                        {stripEnglish(name as string)}
                      </p>
                      {keywords && keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                          {keywords.slice(0, 2).map((keyword, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded">
                              #{keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function TypesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-light-purple flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    }>
      <TypesPageContent />
    </Suspense>
  );
}
