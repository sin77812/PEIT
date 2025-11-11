import { Suspense } from 'react';
import TestPageContent from '@/components/TestPageContent';

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