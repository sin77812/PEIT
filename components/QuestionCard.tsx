import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  // 마침표/쉼표 뒤에서 줄바꿈 적용
  const lines = question.text.split(/(?<=[\.,，])\s*/);
  return (
    <div className="text-center py-12">
      <h2 className="text-balance break-keep text-2xl md:text-3xl font-medium leading-snug md:leading-relaxed w-full max-w-none px-2 sm:px-4">
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h2>
    </div>
  );
}
