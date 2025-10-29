import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-medium leading-relaxed max-w-3xl mx-auto">
        {question.text}
      </h2>
    </div>
  );
}