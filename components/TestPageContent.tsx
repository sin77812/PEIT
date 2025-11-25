'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import AnswerButton from '@/components/AnswerButton';
import { questions } from '@/lib/questions';
import { Question } from '@/lib/types';
import { DISPLAY_ORDER, DISPLAY_ORDER_BOTH } from '@/lib/order';
import { calculatePoliticalType, calculateEconomicType, calculateResult } from '@/lib/calculate';

export default function TestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testType = searchParams.get('type') as 'political' | 'economic' | null;
  
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 테스트 타입에 따라 질문 필터링 + 고정 표시 순서 적용
  const filtered = testType 
    ? questions.filter(q => q.category === testType)
    : questions;

  const orderList = testType === 'political'
    ? DISPLAY_ORDER.political
    : testType === 'economic'
    ? DISPLAY_ORDER.economic
    : DISPLAY_ORDER_BOTH;

  const orderIndex = new Map(orderList.map((id, idx) => [id, idx]));
  const orderedQuestions: Question[] = [...filtered].sort((a, b) => {
    const ai = orderIndex.get(a.id);
    const bi = orderIndex.get(b.id);
    // 순서 배열에 없는 경우는 뒤로 보내되, 기존 상대 순서를 유지
    if (ai === undefined && bi === undefined) return 0;
    if (ai === undefined) return 1;
    if (bi === undefined) return -1;
    return ai - bi;
  });

  const currentQuestion: Question | undefined = orderedQuestions[currentQ - 1];

  useEffect(() => {
    // 테스트 타입이 변경되면 현재 질문 번호를 1로 리셋
    setCurrentQ(1);
    
    // localStorage에서 이전 답변 불러오기
    const storageKey = testType ? `${testType}_answers` : 'answers';
    const savedAnswers = localStorage.getItem(storageKey);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    } else {
      // 저장된 답변이 없으면 빈 객체로 초기화
      setAnswers({});
    }
  }, [testType]);

  const handleAnswer = (answer: 'A' | 'B') => {
    setIsTransitioning(true);
    
    // 질문 고유 id를 저장 (배열 인덱스에 의존하지 않음)
    const newAnswers = { ...answers, [`q${currentQuestion!.id}`]: answer };
    setAnswers(newAnswers);
    
    // 테스트 타입별로 다른 localStorage 키 사용
    const storageKey = testType ? `${testType}_answers` : 'answers';
    localStorage.setItem(storageKey, JSON.stringify(newAnswers));
    
    // 다음 질문으로 이동
    setTimeout(() => {
      if (currentQ < orderedQuestions.length) {
        setCurrentQ(currentQ + 1);
        setIsTransitioning(false);
      } else {
        // 마지막 질문 완료 - 결과 계산 후 해당 페이지로 이동
        if (testType === 'political') {
          // 정치 테스트만 완료한 경우
          localStorage.setItem('political_answers', JSON.stringify(newAnswers));
          const politicalType = calculatePoliticalType(newAnswers);
          router.push(`/result/${politicalType}?from=test`);
        } else if (testType === 'economic') {
          // 경제 테스트만 완료한 경우
          localStorage.setItem('economic_answers', JSON.stringify(newAnswers));
          const economicType = calculateEconomicType(newAnswers);
          router.push(`/result/${economicType}?from=test`);
        } else {
          // 전체 테스트 완료
          const result = calculateResult(newAnswers);
          // 정치 유형으로 리다이렉트 (전체 테스트의 경우)
          router.push(`/result/${result.political}?from=test`);
        }
      }
    }, 300);
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl p-3 sm:p-4 md:p-8">
          <ProgressBar current={currentQ} total={orderedQuestions.length} />
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <QuestionCard question={currentQuestion} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4 md:mt-12">
              <AnswerButton
                option="A"
                text={currentQuestion.optionA}
                onClick={() => handleAnswer('A')}
              />
              <AnswerButton
                option="B"
                text={currentQuestion.optionB}
                onClick={() => handleAnswer('B')}
              />
            </div>
          </div>
          {/* 뒤로가기 버튼 (선택사항) */}
          {currentQ > 1 && (
            <button
              onClick={() => setCurrentQ(currentQ - 1)}
              className="mt-8 text-gray-500 hover:text-accent transition-colors"
            >
              ← 이전 질문
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
