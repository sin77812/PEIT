export type PoliticalAxis = 'I' | 'C' | 'P' | 'T' | 'A' | 'U' | 'E' | 'S';
export type EconomicAxis = 'G' | 'S' | 'V' | 'A' | 'E' | 'W';
export type Axis = PoliticalAxis | EconomicAxis;

export interface Question {
  id: number;
  category: 'political' | 'economic';
  axis: string;
  text: string;
  optionA: string;
  optionB: string;
}

export interface ResultData {
  name: string;
  category: 'political' | 'economic';
  scores: {
    [key: string]: number;
  };
  description: string;
  strengths: string[];
  weaknesses: string[];
  // 경제 유형 전용 상세 필드들
  code?: string;
  nickname?: string;
  keywords?: string[];
  spectrum_analysis?: string;
  detailed_analysis?: string;
  coaching?: string;
  synergy_partner?: string;
  risk_partner?: string;
  success_formula?: string;
  failure_formula?: string;
  benchmarking?: string;
  career_navigation?: string;
  // 정치 유형 전용 상세 필드들
  summary?: string;
  political_spectrum?: string;
  political_spectrum_detail?: string;
  detailed_description?: string;
  speech_style?: string;
  stress_moment?: string;
  solution?: string;
  love_value?: string;
  best_partner?: string;
  worst_partner?: string;
  communication_barrier?: string;
  career_value?: string;
  financial_style?: string;
  historical_avatar?: string;
  real_avatar?: string;
  growth_direction?: string;
  growth_task?: string;
  recommended_books?: Array<{title: string; author: string; link?: string}>;
  recommended_content?: string;
  final_goal?: string;
}

export interface Scores {
  I: number; C: number;  // 사회관
  P: number; T: number;  // 변화관
  A: number; U: number;  // 평등관
  E: number; S: number;  // 외교안보관
  G: number; S2: number; // 경제관
  V: number; A2: number; // 투자관
  E2: number; W: number; // 직업관
}