import { Suspense } from 'react';
import ResultLandingClient from '@/components/ResultLandingClient';

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">결과 계산 중...</div>
      </div>
    }>
      <ResultLandingClient />
    </Suspense>
  );
}
