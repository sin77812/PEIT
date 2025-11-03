import { Suspense } from 'react';
import TestPageContent from '@/components/TestPageContent';

// 페이지를 항상 동적으로 렌더링하도록 설정
export const dynamic = 'force-dynamic';

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    }>
      <TestPageContent />
    </Suspense>
  );
}