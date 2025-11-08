import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  // 마침표/쉼표 뒤에서 줄바꿈 (Safari 호환): lookbehind 미사용
  const lines = (question.text.match(/[^\.,，]+[\.,，]?/g) || [])
    .map(s => s.trim())
    .filter(Boolean);
  return (
    <div className="text-center py-6 sm:py-8 md:py-12">
      <h2 className="text-balance break-keep text-lg sm:text-xl md:text-3xl font-medium leading-snug md:leading-relaxed w-full max-w-none px-2 sm:px-4">
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
