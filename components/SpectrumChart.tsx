'use client';

interface SpectrumChartProps {
  data: { [key: string]: number };
  category?: 'political' | 'economic';
  showAxisTitle?: boolean; // 그래프 위 제목(예: 기업가 기질 vs 안정가 기질) 표시 여부
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

// 간단한 키를 전체 축 이름으로 매핑하는 함수
const expandKeyToFullAxis = (key: string, category: 'political' | 'economic'): string | null => {
  const mappings = {
    political: {
      '개인주의': '개인주의 vs 공동체주의',
      '진보주의': '진보주의 vs 전통주의',
      '적극적 평등': '적극적 평등 vs 보편적 평등',
      '협력 우선': '협력 우선 vs 안보 우선',
      '공동체주의': '개인주의 vs 공동체주의',
      '전통주의': '진보주의 vs 전통주의',
      '보수주의': '진보주의 vs 전통주의', // 호환성을 위해 추가
      '보편적 평등': '적극적 평등 vs 보편적 평등',
      '안보 우선': '협력 우선 vs 안보 우선',
    },
    economic: {
      '성장': '성장 중시 vs 안정 중시',
      '성장 중시': '성장 중시 vs 안정 중시',
      '안정': '성장 중시 vs 안정 중시',
      '안정 중시': '성장 중시 vs 안정 중시',
      '비전': '비전 투자 vs 데이터 투자',
      '비전 투자': '비전 투자 vs 데이터 투자',
      '데이터': '비전 투자 vs 데이터 투자',
      '데이터 투자': '비전 투자 vs 데이터 투자',
      '기업가': '기업가 기질 vs 안정가 기질',
      '기업가 기질': '기업가 기질 vs 안정가 기질',
      '안정가': '기업가 기질 vs 안정가 기질',
      '안정가 기질': '기업가 기질 vs 안정가 기질',
    }
  };
  
  return (mappings[category] as Record<string, string>)[key] || null;
};

export default function SpectrumChart({ data, category = 'political', showAxisTitle = false }: SpectrumChartProps) {
  const labels = spectrumLabels[category];
  const barClass = category === 'political' ? 'bg-purple-500' : 'bg-red-500';
  const textClass = category === 'political' ? 'text-purple-600' : 'text-red-600';

  // 데이터를 정규화하여 전체 축 이름 형식으로 변환
  let normalizedData: { [key: string]: number } = {};
  
  // 이미 전체 축 이름 형식인지 확인
  const hasFullAxisNames = Object.keys(data).some(key => key.includes(' vs '));
  
  if (hasFullAxisNames) {
    // 이미 전체 형식이면 그대로 사용
    normalizedData = data;
  } else {
    // 간단한 키를 전체 축 이름으로 변환
    Object.entries(data).forEach(([key, value]) => {
      const fullAxisName = expandKeyToFullAxis(key, category);
      if (fullAxisName) {
        normalizedData[fullAxisName] = value;
      }
    });
  }

  return (
    <div className="w-full space-y-4">
      {Object.entries(labels).map(([fullAxisKey, label]) => {
        const value = normalizedData[fullAxisKey];
        if (value === undefined) return null;

        // 50%를 기준으로 좌우 계산
        const leftPercentage = value;
        const rightPercentage = 100 - value;
        const isLeftDominant = leftPercentage > 50;
        const dominantValue = Math.max(leftPercentage, rightPercentage);
        
        return (
          <div key={fullAxisKey} className="space-y-1">
            {/* 축 제목 (옵션) */}
            {showAxisTitle && (
              <div className="text-center text-sm font-medium text-gray-700">
                {fullAxisKey}
              </div>
            )}
            
            {/* 스펙트럼 바 */}
            <div className="relative">
              {/* 배경 바 */}
              <div className="h-5 bg-gray-200 rounded-lg relative overflow-hidden">
                {/* 중앙 구분선 */}
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-400 z-10"></div>
                
                {/* 채워진 영역 - 더 강한 성향을 표시 */}
                {leftPercentage >= 50 ? (
                  // 왼쪽이 더 강할 때: 중앙에서 왼쪽으로
                  <div 
                    className={`absolute top-0 h-full transition-all duration-500 ${barClass}`}
                    style={{ 
                      left: `${100 - leftPercentage}%`,
                      width: `${leftPercentage - 50}%`,
                    }}
                  ></div>
                ) : (
                  // 오른쪽이 더 강할 때: 중앙에서 오른쪽으로
                  <div 
                    className={`absolute top-0 h-full transition-all duration-500 ${barClass}`}
                    style={{ 
                      left: '50%',
                      width: `${rightPercentage - 50}%`,
                    }}
                  ></div>
                )}
                
              </div>
              
              {/* 좌우 라벨과 수치 */}
              <div className="flex justify-between items-center mt-1">
                <div className="text-left">
                  <div className={`text-sm ${isLeftDominant ? 'font-bold' : 'font-normal'} ${isLeftDominant ? textClass : 'text-gray-500'}`}>
                    {label.left}
                  </div>
                  <div className={`text-lg ${isLeftDominant ? 'font-bold' : 'font-normal'} ${isLeftDominant ? textClass : 'text-gray-400'}`}>
                    {leftPercentage}%
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm ${!isLeftDominant ? 'font-bold' : 'font-normal'} ${!isLeftDominant ? textClass : 'text-gray-500'}`}>
                    {label.right}
                  </div>
                  <div className={`text-lg ${!isLeftDominant ? 'font-bold' : 'font-normal'} ${!isLeftDominant ? textClass : 'text-gray-400'}`}>
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
