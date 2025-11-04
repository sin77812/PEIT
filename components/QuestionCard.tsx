import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="text-center py-12">
      <h2 className="text-balance break-keep text-xl md:text-3xl font-medium leading-relaxed max-w-[320px] sm:max-w-[520px] mx-auto px-4">
        {question.text}
      </h2>
    </div>
  );
}
