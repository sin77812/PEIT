'use client';

import { useState, useMemo } from 'react';
import { getAllBooks, getBooksByType, getAllPoliticalTypes, getAllEconomicTypes, Book } from '@/lib/books';
import Image from 'next/image';
import Link from 'next/link';

export default function PeitShopPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const politicalTypes = getAllPoliticalTypes();
  const economicTypes = getAllEconomicTypes();
  const allBooks = getAllBooks();

  // 선택된 유형에 따라 도서 필터링
  const displayedBooks = useMemo(() => {
    if (selectedType) {
      return getBooksByType(selectedType);
    }
    return allBooks;
  }, [selectedType, allBooks]);

  return (
    <div className="min-h-screen bg-bg-light-purple py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">PEIT 도서 추천</h1>
          <p className="text-gray-600">당신의 성향에 맞는 도서를 찾아보세요</p>
        </div>

        {/* 유형 태그 필터 */}
        <div className="mb-8">
          <div className="space-y-4">
            {/* 전체 버튼 */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all shadow-md ${
                  selectedType === null
                    ? 'bg-[#7C3AED] text-white shadow-lg scale-105 border-2 border-[#7C3AED]'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border-2 border-gray-200'
                }`}
              >
                전체
              </button>
            </div>

            {/* 정치 유형 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">정치 유형</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {politicalTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                      selectedType === type
                        ? 'bg-[#7C3AED] text-white shadow-lg scale-105 border-2 border-[#7C3AED]'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border-2 border-gray-200 hover:border-[#7C3AED]/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 경제 유형 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">경제 유형</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {economicTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                      selectedType === type
                        ? 'bg-[#7C3AED] text-white shadow-lg scale-105 border-2 border-[#7C3AED]'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border-2 border-gray-200 hover:border-[#7C3AED]/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 배너 광고 공간 (플레이스홀더) */}
        <div className="mb-8">
          <div className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center w-full"
               style={{ 
                 height: '100px',
                 minHeight: '100px'
               }}>
            <div className="text-center text-gray-500">
              <p className="text-sm font-semibold mb-1">배너 광고 공간</p>
              <p className="text-xs hidden md:block">728 x 90 (PC 리더보드)</p>
              <p className="text-xs md:hidden">320 x 100 (모바일)</p>
            </div>
          </div>
        </div>

        {/* 도서 그리드 */}
        <div className="mb-8">
          {displayedBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">표시할 도서가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedBooks.map((book, index) => (
                <BookCard key={`${book.title}-${book.author}-${index}`} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* 하단 배너 광고 공간 (선택사항) */}
        <div className="mt-12">
          <div className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center w-full"
               style={{ 
                 height: '100px',
                 minHeight: '100px'
               }}>
            <div className="text-center text-gray-500">
              <p className="text-sm font-semibold mb-1">배너 광고 공간</p>
              <p className="text-xs hidden md:block">728 x 90 (PC 리더보드)</p>
              <p className="text-xs md:hidden">320 x 100 (모바일)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={book.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 p-4 flex flex-col"
    >
      {/* 도서 이미지 (추후 추가 예정) */}
      <div className="w-full aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
        <div className="text-gray-400 text-xs text-center px-2">
          이미지 준비중
        </div>
      </div>

      {/* 도서 정보 */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 mb-2">{book.author}</p>
        
        {/* 연관 유형 */}
        <div className="flex flex-wrap gap-1 mt-2">
          {book.relatedTypes.slice(0, 3).map((type) => (
            <span
              key={type}
              className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded"
            >
              {type}
            </span>
          ))}
          {book.relatedTypes.length > 3 && (
            <span className="text-[10px] text-gray-500">
              +{book.relatedTypes.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

