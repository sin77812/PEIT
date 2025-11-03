'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import AnswerButton from '@/components/AnswerButton';
import { questions } from '@/lib/questions';
import { Question } from '@/lib/types';

export default function TestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testType = searchParams.get('type') as 'political' | 'economic' | null;
  
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 테스트 타입에 따라 질문 필터링
  const filteredQuestions = testType 
    ? questions.filter(q => q.category === testType)
    : questions;
  
  const currentQuestion: Question | undefined = filteredQuestions[currentQ - 1];

  useEffect(() => {
    // localStorage에서 이전 답변 불러오기
    const storageKey = testType ? `${testType}_answers` : 'answers';
    const savedAnswers = localStorage.getItem(storageKey);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [testType]);

  const handleAnswer = (answer: 'A' | 'B') => {
    setIsTransitioning(true);
    
    // 실제 질문 ID를 저장 (원본 questions 배열의 인덱스)
    const actualQuestionId = questions.indexOf(currentQuestion!);
    const newAnswers = { ...answers, [`q${actualQuestionId + 1}`]: answer };
    setAnswers(newAnswers);
    
    // 테스트 타입별로 다른 localStorage 키 사용
    const storageKey = testType ? `${testType}_answers` : 'answers';
    localStorage.setItem(storageKey, JSON.stringify(newAnswers));
    
    // 다음 질문으로 이동
    setTimeout(() => {
      if (currentQ < filteredQuestions.length) {
        setCurrentQ(currentQ + 1);
        setIsTransitioning(false);
      } else {
        // 마지막 질문 완료 - 결과 계산 후 해당 페이지로 이동
        if (testType === 'political') {
          // 정치 테스트만 완료한 경우 - 경제 테스트로 안내하거나 정치 결과만 보여주기
          localStorage.setItem('political_answers', JSON.stringify(newAnswers));
          router.push('/result');
        } else if (testType === 'economic') {
          // 경제 테스트만 완료한 경우 - 정치 테스트로 안내하거나 경제 결과만 보여주기
          localStorage.setItem('economic_answers', JSON.stringify(newAnswers));
          router.push('/result');
        } else {
          // 전체 테스트 완료
          router.push('/result');
        }
      }
    }, 300);
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-bg-light-purple py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ProgressBar current={currentQ} total={filteredQuestions.length} />
        
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <QuestionCard question={currentQuestion} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
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
  );
}