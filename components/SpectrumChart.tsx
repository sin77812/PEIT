'use client';

interface SpectrumChartProps {
  data: { [key: string]: number };
  category?: 'political' | 'economic';
}

// 축별 대립 구조 정의
const spectrumLabels = {
  political: {
    '개인주의 vs 공동체주의': { left: '개인주의', right: '공동체주의' },
    '진보주의 vs 전통주의': { left: '진보주의', right: '전통주의' },
    '적극적 평등 vs 보편적 평등': { left: '적극적 평등', right: '보편적 평등' },
    '협력 우선 vs 안보 우선': { left: '협력 우선', right: '안보 우선' },
  },
  economic: {
    '성장 중시 vs 안정 중시': { left: '성장 중시', right: '안정 중시' },
    '비전 투자 vs 데이터 투자': { left: '비전 투자', right: '데이터 투자' },
    '기업가 기질 vs 안정가 기질': { left: '기업가 기질', right: '안정가 기질' },
  }
};

export default function SpectrumChart({ data, category = 'political' }: SpectrumChartProps) {
  const labels = spectrumLabels[category];

  return (
    <div className="w-full space-y-6">
      {Object.entries(data).map(([key, value]) => {
        const label = labels[key as keyof typeof labels] as { left: string; right: string } | undefined;
        if (!label) return null;

        // 50%를 기준으로 좌우 계산
        const leftPercentage = value;
        const rightPercentage = 100 - value;
        const isLeftDominant = leftPercentage > 50;
        const dominantValue = Math.max(leftPercentage, rightPercentage);
        
        return (
          <div key={key} className="space-y-2">
            {/* 축 제목 */}
            <div className="text-center text-sm font-medium text-gray-700">
              {key}
            </div>
            
            {/* 스펙트럼 바 */}
            <div className="relative">
              {/* 배경 바 */}
              <div className="h-8 bg-gray-200 rounded-lg relative overflow-hidden">
                {/* 중앙 구분선 */}
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-400 z-10"></div>
                
                {/* 채워진 영역 - 더 강한 성향을 표시 */}
                {leftPercentage >= 50 ? (
                  // 왼쪽이 더 강할 때: 중앙에서 왼쪽으로
                  <div 
                    className={`absolute top-0 h-full transition-all duration-500 ${
                      category === 'political' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      left: `${100 - leftPercentage}%`,
                      width: `${leftPercentage - 50}%`,
                    }}
                  ></div>
                ) : (
                  // 오른쪽이 더 강할 때: 중앙에서 오른쪽으로
                  <div 
                    className={`absolute top-0 h-full transition-all duration-500 ${
                      category === 'political' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      left: '50%',
                      width: `${rightPercentage - 50}%`,
                    }}
                  ></div>
                )}
                
              </div>
              
              {/* 좌우 라벨과 수치 */}
              <div className="flex justify-between items-center mt-2">
                <div className="text-left">
                  <div className={`text-sm ${isLeftDominant ? 'font-bold' : 'font-normal'} ${isLeftDominant ? 'text-purple-600' : 'text-gray-500'}`}>
                    {label.left}
                  </div>
                  <div className={`text-xl ${isLeftDominant ? 'font-bold' : 'font-normal'} ${isLeftDominant ? 'text-purple-600' : 'text-gray-400'}`}>
                    {leftPercentage}%
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm ${!isLeftDominant ? 'font-bold' : 'font-normal'} ${!isLeftDominant ? 'text-purple-600' : 'text-gray-500'}`}>
                    {label.right}
                  </div>
                  <div className={`text-xl ${!isLeftDominant ? 'font-bold' : 'font-normal'} ${!isLeftDominant ? 'text-purple-600' : 'text-gray-400'}`}>
                    {rightPercentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}