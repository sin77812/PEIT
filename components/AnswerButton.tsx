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
        w-full p-8 bg-white border-2 border-border-light rounded-xl
        hover:border-accent hover:shadow-md
        transition-all duration-200
        text-lg font-medium
        active:bg-gray-50 active:scale-98
      "
    >
      <span className="block text-accent font-bold text-xl mb-2">
        {option}
      </span>
      <span className="text-gray-800">
        {text}
      </span>
    </button>
  );
}