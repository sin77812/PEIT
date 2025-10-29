interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
        <span>{current} / {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 ease-out rounded-full shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* 추가: 단계별 표시 */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>시작</span>
        <span className={percentage >= 50 ? 'text-purple-600 font-medium' : ''}>
          중간점
        </span>
        <span className={percentage >= 100 ? 'text-purple-600 font-medium' : ''}>
          완료
        </span>
      </div>
    </div>
  );
}