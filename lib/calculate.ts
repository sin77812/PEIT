import { mapping } from './mapping';

type Axis = 'I' | 'C' | 'P' | 'T' | 'A' | 'U' | 'E' | 'S' | 'G' | 'V' | 'A2' | 'E2' | 'W';

interface Scores {
  I: number; C: number;   // 사회관 (개인주의 vs 공동체주의)
  P: number; T: number;   // 변화관 (진보주의 vs 보수주의)
  A: number; U: number;   // 평등관 (적극적 평등 vs 보편적 평등)
  E: number; S: number;   // 외교안보관 (협력 우선 vs 안보 우선)
  G: number; S2: number;  // 경제관 (성장 중시 vs 안정 중시) - S2는 안정 중시
  V: number; A2: number;  // 투자관 (비전 투자 vs 데이터 투자) - A2는 데이터 투자
  E2: number; W: number;  // 직업관 (기업가 기질 vs 안정가 기질) - E2는 기업가 기질
}

export interface CalculationResult {
  political: string;
  economic: string;
  scores: Scores;
  politicalScores: {
    I: number; C: number;
    P: number; T: number;
    A: number; U: number;
    E: number; S: number;
  };
  economicScores: {
    G: number; S: number;
    V: number; A: number;
    E: number; W: number;
  };
}

export function calculateResult(answers: Record<string, 'A' | 'B'>, testType?: 'political' | 'economic'): CalculationResult {
  const scores: Scores = {
    I: 0, C: 0, P: 0, T: 0, A: 0, U: 0, E: 0, S: 0,
    G: 0, S2: 0, V: 0, A2: 0, E2: 0, W: 0
  };

  // 1. 각 답변에 따라 점수 부여
  Object.entries(answers).forEach(([questionId, answer]) => {
    const qNum = parseInt(questionId.replace('q', ''));
    const axisMapping = mapping[qNum];
    
    if (axisMapping) {
      const axis = axisMapping[answer] as Axis;
      if (scores.hasOwnProperty(axis)) {
        scores[axis]++;
      }
    }
  });

  // 2. 정치 유형 결정 (4축 조합)
  const political = 
    (scores.I > scores.C ? 'I' : 'C') +
    (scores.P > scores.T ? 'P' : 'T') +
    (scores.A > scores.U ? 'A' : 'U') +
    (scores.E > scores.S ? 'E' : 'S');

  // 3. 경제 유형 결정 (3축 조합)
  const economic =
    (scores.G > scores.S2 ? 'G' : 'S') +
    (scores.V > scores.A2 ? 'V' : 'A') +
    (scores.E2 > scores.W ? 'E' : 'W');

  // 4. 결과 반환
  return {
    political,
    economic,
    scores,
    politicalScores: {
      I: scores.I,
      C: scores.C,
      P: scores.P,
      T: scores.T,
      A: scores.A,
      U: scores.U,
      E: scores.E,
      S: scores.S
    },
    economicScores: {
      G: scores.G,
      S: scores.S2,  // S2를 S로 매핑
      V: scores.V,
      A: scores.A2,  // A2를 A로 매핑
      E: scores.E2,  // E2를 E로 매핑
      W: scores.W
    }
  };
}

// 정치 유형만 계산하는 함수 (기존 호환성 유지)
export function calculatePoliticalType(answers: Record<string, 'A' | 'B'>): string {
  return calculateResult(answers).political;
}

// 경제 유형만 계산하는 함수
export function calculateEconomicType(answers: Record<string, 'A' | 'B'>): string {
  return calculateResult(answers).economic;
}

// 성향을 상대적 비율로 계산하는 함수
export function calculateRelativeScores(scores: any, category: 'political' | 'economic'): { [key: string]: number } {
  if (category === 'political') {
    const iTotal = scores.I + scores.C;
    const pTotal = scores.P + scores.T;
    const aTotal = scores.A + scores.U;
    const eTotal = scores.E + scores.S;

    return {
      '개인주의 vs 공동체주의': iTotal > 0 ? Math.round((scores.I / iTotal) * 100) : 50,
      '진보주의 vs 전통주의': pTotal > 0 ? Math.round((scores.P / pTotal) * 100) : 50,
      '적극적 평등 vs 보편적 평등': aTotal > 0 ? Math.round((scores.A / aTotal) * 100) : 50,
      '협력 우선 vs 안보 우선': eTotal > 0 ? Math.round((scores.E / eTotal) * 100) : 50,
    };
  } else {
    const gTotal = scores.G + scores.S2;
    const vTotal = scores.V + scores.A2;
    const eTotal = scores.E2 + scores.W;

    return {
      '성장 중시 vs 안정 중시': gTotal > 0 ? Math.round((scores.G / gTotal) * 100) : 50,
      '비전 투자 vs 데이터 투자': vTotal > 0 ? Math.round((scores.V / vTotal) * 100) : 50,
      '기업가 기질 vs 안정가 기질': eTotal > 0 ? Math.round((scores.E2 / eTotal) * 100) : 50,
    };
  }
}

// 점수 퍼센트 계산 함수
export function calculatePercentages(scores: Scores): Record<string, number> {
  const politicalTotal = scores.I + scores.C + scores.P + scores.T + scores.A + scores.U + scores.E + scores.S;
  const economicTotal = scores.G + scores.S2 + scores.V + scores.A2 + scores.E2 + scores.W;

  return {
    // 정치 축별 퍼센트
    I: politicalTotal > 0 ? Math.round((scores.I / (scores.I + scores.C)) * 100) : 50,
    C: politicalTotal > 0 ? Math.round((scores.C / (scores.I + scores.C)) * 100) : 50,
    P: politicalTotal > 0 ? Math.round((scores.P / (scores.P + scores.T)) * 100) : 50,
    T: politicalTotal > 0 ? Math.round((scores.T / (scores.P + scores.T)) * 100) : 50,
    A: politicalTotal > 0 ? Math.round((scores.A / (scores.A + scores.U)) * 100) : 50,
    U: politicalTotal > 0 ? Math.round((scores.U / (scores.A + scores.U)) * 100) : 50,
    E: politicalTotal > 0 ? Math.round((scores.E / (scores.E + scores.S)) * 100) : 50,
    S: politicalTotal > 0 ? Math.round((scores.S / (scores.E + scores.S)) * 100) : 50,
    
    // 경제 축별 퍼센트
    G: economicTotal > 0 ? Math.round((scores.G / (scores.G + scores.S2)) * 100) : 50,
    S2: economicTotal > 0 ? Math.round((scores.S2 / (scores.G + scores.S2)) * 100) : 50,
    V: economicTotal > 0 ? Math.round((scores.V / (scores.V + scores.A2)) * 100) : 50,
    A2: economicTotal > 0 ? Math.round((scores.A2 / (scores.V + scores.A2)) * 100) : 50,
    E2: economicTotal > 0 ? Math.round((scores.E2 / (scores.E2 + scores.W)) * 100) : 50,
    W: economicTotal > 0 ? Math.round((scores.W / (scores.E2 + scores.W)) * 100) : 50,
  };
}