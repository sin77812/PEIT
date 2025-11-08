import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="text-center py-12">
      <h2 className="text-balance break-keep text-2xl md:text-3xl font-medium leading-snug md:leading-relaxed w-full max-w-none px-2 sm:px-4">
        {question.text}
      </h2>
    </div>
  );
}
