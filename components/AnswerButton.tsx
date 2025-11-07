interface AnswerButtonProps {
  option: 'A' | 'B';
  text: string;
  onClick: () => void;
}

export default function AnswerButton({ option, text, onClick }: AnswerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        group w-full p-8 bg-white border-2 border-border-light rounded-xl
        hover:bg-[#8B5CF6] hover:border-[#7C3AED] hover:shadow-md
        transition-all duration-200
        text-lg font-medium
        active:bg-gray-50 active:scale-98
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white
      "
    >
      <span className="block text-accent group-hover:text-white font-bold text-xl mb-2">
        {option}
      </span>
      <span className="text-gray-800 group-hover:text-white break-keep text-pretty leading-7">
        {text}
      </span>
    </button>
  );
}
