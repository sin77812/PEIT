'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import AnswerButton from '@/components/AnswerButton';
import { questions } from '@/lib/questions';
import { Question } from '@/lib/types';
import { calculateResult } from '@/lib/calculate';

export default function TestPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const currentQuestion: Question | undefined = questions[currentQ - 1];

  useEffect(() => {
    // localStorage에서 이전 답변 불러오기
    const savedAnswers = localStorage.getItem('answers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const handleAnswer = (answer: 'A' | 'B') => {
    setIsTransitioning(true);
    
    // 답변 저장
    const newAnswers = { ...answers, [`q${currentQ}`]: answer };
    setAnswers(newAnswers);
    localStorage.setItem('answers', JSON.stringify(newAnswers));
    
    // 다음 질문으로 이동
    setTimeout(() => {
      if (currentQ < 69) {
        setCurrentQ(currentQ + 1);
        setIsTransitioning(false);
      } else {
        // 마지막 질문 완료 - 결과 확인 페이지로 이동
        router.push('/result');
      }
    }, 300);
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-bg-light-purple py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ProgressBar current={currentQ} total={69} />
        
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