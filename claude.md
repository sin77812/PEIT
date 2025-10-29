 CLAUDE.md - PEIT 정치·경제 성향 테스트 사이트 제작 가이드

📋 프로젝트 개요
프로젝트명: PEIT (페이트)
사이트명 표기: 항상 대문자 PEIT 사용
개발 인원: 1명 (Claude Code 활용)
예산: 170만원
기간: 7-10일
목표: 16personalities 스타일의 초간결 성향 테스트 사이트

🛠️ 기술 스택
핵심 기술

Next.js 14 (App Router)
TypeScript (타입 안전성)
Tailwind CSS (유틸리티 CSS)
React 18 (자동 포함)

배포 및 호스팅

Vercel - 무료 호스팅 (Next.js 최적화)
도메인: 미정 (추후 연결)

왜 Next.js?
✅ 동적 라우팅: 24개 페이지를 1개 파일로 자동화
✅ 컴포넌트 재사용: 버튼/카드 1번만 만들면 끝
✅ 상태 관리: React Hooks로 localStorage보다 쉬움
✅ Tailwind: CSS 파일 관리 불필요
✅ 배포: vercel 명령어 1개로 끝
```

---

## 📁 프로젝트 구조
```
peit/
│
├── CLAUDE.md                    # 이 파일 (프로젝트 가이드)
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
│
├── app/
│   ├── layout.tsx              # 전역 레이아웃
│   ├── page.tsx                # 메인 페이지 (/)
│   │
│   ├── test/
│   │   └── page.tsx            # 검사 페이지 (/test)
│   │
│   ├── result/
│   │   └── [type]/
│   │       └── page.tsx        # 결과 페이지 (/result/IPAE 등 24개 자동)
│   │
│   ├── types/
│   │   └── page.tsx            # 유형 목록 (/types)
│   │
│   └── about/
│       └── page.tsx            # 서비스 소개 (/about)
│
├── components/
│   ├── Navigation.tsx          # 네비게이션 바
│   ├── Button.tsx              # 재사용 버튼
│   ├── QuestionCard.tsx        # 질문 카드
│   ├── AnswerButton.tsx        # A/B 답변 버튼
│   ├── ProgressBar.tsx         # 진행률 표시
│   ├── ResultCard.tsx          # 결과 카드
│   └── RadarChart.tsx          # 레이더 차트
│
├── lib/
│   ├── questions.ts            # 69개 질문 데이터
│   ├── mapping.ts              # 질문-축 매핑표
│   ├── calculate.ts            # 결과 계산 알고리즘
│   ├── types.ts                # 타입 정의
│   └── results.ts              # 24개 결과 상세 설명
│
├── hooks/
│   ├── useTest.ts              # 검사 상태 관리
│   └── useLocalStorage.ts     # localStorage 래퍼
│
└── public/
    └── images/
        ├── main-bg.jpg         # 메인 배경
        ├── political/          # 정치 16개
        │   ├── IPAE.jpg
        │   ├── IPAU.jpg
        │   ├── ... (16개 전체)
        │   └── CTSU.jpg
        └── economic/           # 경제 8개
            ├── GAE.jpg
            ├── GAW.jpg
            ├── GVE.jpg
            ├── GVW.jpg
            ├── SAE.jpg
            ├── SAW.jpg
            ├── SVE.jpg
            └── SVW.jpg

🎨 디자인 시스템
컬러 팔레트 (Tailwind 설정)
메인 컬러
typescript// tailwind.config.js
colors: {
  // 기본
  'bg-white': '#FFFFFF',
  'text-black': '#000000',
  'text-gray': '#666666',
  'border-light': '#E5E5E5',
  
  // 보라색 포인트
  'accent': {
    DEFAULT: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
  },
  
  // 성향별 컬러
  'political': '#8B5CF6',
  'economic-growth': '#F59E0B',
  'economic-stable': '#3B82F6',
}
타이포그래피
typescript// Tailwind 클래스 사용
text-5xl font-bold      // 48px, 700 - 헤드라인
text-2xl font-medium    // 24px, 500 - 질문
text-lg                 // 18px, 400 - 본문
text-base font-semibold // 16px, 600 - 버튼

font-family: 'Pretendard', sans-serif

🔧 핵심 기능 명세
1. 질문 순환 시스템 (app/test/page.tsx)
동작 방식:
typescript'use client';
import { useState, useEffect } from 'react';
import { questions } from '@/lib/questions';

export default function TestPage() {
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState({});
  const [shuffledOrder, setShuffledOrder] = useState([]);

  // 1. 질문 랜덤 섞기 (Fisher-Yates)
  useEffect(() => {
    const shuffled = shuffleArray([...questions]);
    setShuffledOrder(shuffled);
  }, []);

  // 2. 답변 선택 시
  const handleAnswer = (answer: 'A' | 'B') => {
    // localStorage에 저장
    const newAnswers = { ...answers, [`q${currentQ}`]: answer };
    setAnswers(newAnswers);
    localStorage.setItem('answers', JSON.stringify(newAnswers));
    
    // 다음 질문으로
    if (currentQ < 69) {
      setCurrentQ(currentQ + 1);
    } else {
      // 69번 완료 → 결과 계산
      const result = calculateResult(newAnswers);
      router.push(`/result/${result}`);
    }
  };

  return (
    <div>
      <ProgressBar current={currentQ} total={69} />
      <QuestionCard question={shuffledOrder[currentQ - 1]} />
      <AnswerButton option="A" onClick={() => handleAnswer('A')} />
      <AnswerButton option="B" onClick={() => handleAnswer('B')} />
    </div>
  );
}

2. 결과 계산 알고리즘 (lib/calculate.ts)
typescripttype Axis = 'I' | 'C' | 'P' | 'T' | 'A' | 'U' | 'E' | 'S' | 'G' | 'V' | 'W';

interface Scores {
  I: number; C: number;  // 사회관
  P: number; T: number;  // 변화관
  A: number; U: number;  // 평등관
  E: number; S: number;  // 외교안보관
  G: number; S2: number; // 경제관
  V: number; A2: number; // 투자관
  E2: number; W: number; // 직업관
}

export function calculateResult(answers: Record<string, 'A' | 'B'>): string {
  const scores: Scores = {
    I: 0, C: 0, P: 0, T: 0, A: 0, U: 0, E: 0, S: 0,
    G: 0, S2: 0, V: 0, A2: 0, E2: 0, W: 0
  };

  // 1. 각 답변에 따라 점수 부여
  Object.entries(answers).forEach(([questionId, answer]) => {
    const qNum = parseInt(questionId.replace('q', ''));
    const axis = mapping[qNum][answer]; // 'I', 'C', 'P' 등
    scores[axis]++;
  });

  // 2. 정치 유형 결정
  const political = 
    (scores.I > scores.C ? 'I' : 'C') +
    (scores.P > scores.T ? 'P' : 'T') +
    (scores.A > scores.U ? 'A' : 'U') +
    (scores.E > scores.S ? 'E' : 'S');

  // 3. 경제 유형 결정
  const economic =
    (scores.G > scores.S2 ? 'G' : 'S') +
    (scores.V > scores.A2 ? 'V' : 'A') +
    (scores.E2 > scores.W ? 'E' : 'W');

  // 4. 현재는 정치 결과만 반환 (경제는 별도 페이지)
  return political;
}

3. 동적 결과 페이지 (app/result/[type]/page.tsx)
typescriptimport { results } from '@/lib/results';
import ResultCard from '@/components/ResultCard';

export default function ResultPage({ params }: { params: { type: string } }) {
  const { type } = params; // 'IPAE', 'GVE' 등
  const data = results[type];

  if (!data) {
    return <div>결과를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        당신의 {data.category === 'political' ? '정치' : '경제'} 성향은
      </h1>

      <ResultCard
        type={type}
        name={data.name}
        image={`/images/${data.category}/${type}.jpg`}
        scores={data.scores}
        description={data.description}
      />

      <div className="mt-12 flex gap-4 justify-center">
        <Button href="/test">다시 검사하기</Button>
        <Button href="/types">다른 유형 보기</Button>
        <Button onClick={handleShare}>결과 공유하기</Button>
      </div>
    </div>
  );
}

// 24개 페이지 자동 생성 (빌드 타임)
export async function generateStaticParams() {
  const types = [
    'IPAE', 'IPAU', 'IPSE', 'IPSU',
    'ITAE', 'ITAU', 'ITSE', 'ITSU',
    'CPAE', 'CPAU', 'CPSE', 'CPSU',
    'CTAE', 'CTAU', 'CTSE', 'CTSU',
    'GAE', 'GAW', 'GVE', 'GVW',
    'SAE', 'SAW', 'SVE', 'SVW'
  ];

  return types.map((type) => ({ type }));
}

📝 필수 데이터 파일
1. lib/questions.ts
typescriptexport interface Question {
  id: number;
  category: 'political' | 'economic';
  axis: string;
  text: string;
  optionA: string;
  optionB: string;
}

export const questions: Question[] = [
  {
    id: 1,
    category: 'political',
    axis: 'I/C',
    text: '개인의 자유와 권리는 다른 어떤 가치보다 우선되어야 한다.',
    optionA: '그렇다',
    optionB: '아니다'
  },
  // ... 69개 질문
];
2. lib/mapping.ts
typescriptexport const mapping: Record<number, { A: string; B: string }> = {
  1: { A: 'I', B: 'C' },
  2: { A: 'P', B: 'T' },
  3: { A: 'A', B: 'U' },
  4: { A: 'E', B: 'S' },
  // ... 69개 매핑
};
3. lib/results.ts
typescriptexport interface ResultData {
  name: string;
  category: 'political' | 'economic';
  scores: {
    [key: string]: number;
  };
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export const results: Record<string, ResultData> = {
  IPAE: {
    name: '진보적 자유주의자',
    category: 'political',
    scores: {
      '개인주의': 85,
      '진보주의': 75,
      '적극적 평등': 70,
      '협력 우선': 80
    },
    description: '당신은 "원래 그래왔다"는 말보다...',
    strengths: ['정의로운 공감 능력', '유연한 사고'],
    weaknesses: ['이상주의적 경향', '조급함']
  },
  // ... 24개 결과
};

🚀 개발 명령어
프로젝트 생성
bashnpx create-next-app@latest peit

# 선택 사항
✅ TypeScript? Yes
✅ ESLint? Yes  
✅ Tailwind CSS? Yes
✅ src/ directory? No
✅ App Router? Yes
✅ import alias (@/*)? Yes
개발
bash# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:3000

# 타입 체크
npm run type-check

# 빌드 (배포 전 테스트)
npm run build
배포
bash# Vercel CLI 설치 (1회만)
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod

✅ 코드 작성 규칙
TypeScript
typescript// ✅ 인터페이스: PascalCase
interface Question { }
interface ResultData { }

// ✅ 타입: PascalCase
type Axis = 'I' | 'C' | 'P' | 'T';

// ✅ 함수: camelCase
function calculateResult() { }

// ✅ 상수: UPPER_SNAKE_CASE
const MAX_QUESTIONS = 69;

// ✅ 변수: camelCase
let currentQuestion = 1;

// ✅ export는 파일 최하단에 모아서
export { questions, mapping, calculateResult };
React 컴포넌트
tsx// ✅ 컴포넌트: PascalCase
export default function QuestionCard() { }

// ✅ Props 타입: ComponentNameProps
interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: 'A' | 'B') => void;
}

// ✅ 'use client' 지시어 (상태/이벤트 사용 시)
'use client';
import { useState } from 'react';

// ✅ 짧은 컴포넌트는 화살표 함수 가능
export const Button = ({ children, ...props }: ButtonProps) => (
  <button {...props}>{children}</button>
);
Tailwind CSS
tsx// ✅ 클래스명은 가독성 있게 줄바꿈
<div className="
  max-w-4xl mx-auto px-4 py-12
  bg-white rounded-2xl shadow-lg
  hover:shadow-xl transition-shadow
">
</div>

// ✅ 조건부 클래스는 clsx 사용
import clsx from 'clsx';

<button className={clsx(
  'px-6 py-3 rounded-lg',
  isActive ? 'bg-accent text-white' : 'bg-gray-100'
)}>
</button>
```

---

## 🚨 절대 건드리지 마시오

### 수정 금지 항목
```
❌ public/images/ 폴더 내 이미지 파일명
   → IPAE.jpg, GVE.jpg 등 유형 코드와 정확히 일치해야 함
   
❌ lib/mapping.ts의 질문 ID
   → 질문 순서 변경 시 매핑 깨짐
   
❌ localStorage 키 이름
   → 'answers', 'shuffledOrder' 고정
   
❌ generateStaticParams의 유형 코드
   → 24개 전체 명시되어야 빌드 성공

🎯 페이지별 구현 가이드
메인 페이지 (app/page.tsx)
tsxexport default function Home() {
  return (
    <main className="relative h-screen">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/main-bg.jpg"
          alt="PEIT"
          fill
          className="object-cover"
        />
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white mb-4">
          PEIT
        </h1>
        <p className="text-xl text-white/90 mb-12">
          당신의 정치·경제 좌표
        </p>
        <Button href="/test" size="lg">
          검사 시작하기
        </Button>
      </div>
    </main>
  );
}
검사 페이지 핵심 로직
tsx'use client';
import { useTest } from '@/hooks/useTest';

export default function TestPage() {
  const {
    currentQuestion,
    progress,
    handleAnswer,
    canGoBack
  } = useTest();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ProgressBar value={progress} />
      
      <div className="my-16 text-center">
        <p className="text-3xl leading-relaxed">
          {currentQuestion.text}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <AnswerButton
          option="A"
          text={currentQuestion.optionA}
          onClick={() => handleAnswer('A')}
        />
        <AnswerButton
          option="B"
          text={currentQuestion.optionB}
          onClick={() => handleAnswer('B')}
        />
      </div>
    </div>
  );
}

📦 필수 패키지
package.json 예시
json{
  "name": "peit",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}

🔍 디버깅 팁
개발 중 확인사항
typescript// 1. localStorage 확인 (브라우저 콘솔)
localStorage.getItem('answers')

// 2. 현재 상태 확인
console.log('Current Q:', currentQuestion);
console.log('Answers:', answers);

// 3. 결과 계산 검증
console.table(scores);

// 4. 빌드 에러 시
npm run type-check  // 타입 에러 확인
npm run lint        // 린트 에러 확인
자주 발생하는 에러
이미지 안 보임
typescript// ❌ 잘못된 경로
<Image src="./images/IPAE.jpg" />

// ✅ 올바른 경로
<Image src="/images/political/IPAE.jpg" />
localStorage is not defined
typescript// ❌ 서버 컴포넌트에서 사용
export default function Page() {
  const data = localStorage.getItem('answers'); // 에러!
}

// ✅ 클라이언트 컴포넌트로 변경
'use client';
export default function Page() {
  const data = localStorage.getItem('answers'); // OK
}
동적 라우팅 404
typescript// ✅ generateStaticParams 필수
export async function generateStaticParams() {
  return [
    { type: 'IPAE' },
    { type: 'IPAU' },
    // ... 24개 전체
  ];
}
```

---

## 📊 진행 체크리스트

### Phase 1: 프로젝트 셋업 (1일)
- [ ] Next.js 프로젝트 생성
- [ ] Tailwind 설정 완료
- [ ] 폴더 구조 생성
- [ ] 이미지 파일 배치 (24개 전체)

### Phase 2: 데이터 준비 (1일)
- [ ] lib/questions.ts 완성 (69개)
- [ ] lib/mapping.ts 완성 (69개 매핑)
- [ ] lib/results.ts 완성 (24개 설명)

### Phase 3: 컴포넌트 제작 (1-2일)
- [ ] Button 컴포넌트
- [ ] Navigation 컴포넌트
- [ ] QuestionCard 컴포넌트
- [ ] AnswerButton 컴포넌트
- [ ] ProgressBar 컴포넌트
- [ ] ResultCard 컴포넌트

### Phase 4: 페이지 구현 (2-3일)
- [ ] app/page.tsx (메인)
- [ ] app/test/page.tsx (검사)
- [ ] app/result/[type]/page.tsx (결과)
- [ ] app/types/page.tsx (유형 목록)
- [ ] app/about/page.tsx (소개)

### Phase 5: 로직 구현 (1-2일)
- [ ] hooks/useTest.ts (검사 로직)
- [ ] lib/calculate.ts (결과 계산)
- [ ] 질문 랜덤 섞기
- [ ] localStorage 저장/불러오기

### Phase 6: 테스트 & 배포 (1-2일)
- [ ] 데스크톱 테스트
- [ ] 모바일 반응형 테스트
- [ ] 결과 계산 정확성 검증
- [ ] Vercel 배포
- [ ] 도메인 연결 (옵션)

---

## 💡 Claude Code 프롬프트 예시

### 컴포넌트 생성
```
components/Button.tsx를 만들어줘.
- Tailwind CSS 사용
- href prop이 있으면 Link, 없으면 button 렌더링
- size: 'sm' | 'md' | 'lg' prop 지원
- 보라색 그라데이션 배경 (accent 컬러)
- hover 시 살짝 확대 애니메이션
- TypeScript로 작성
```

### 페이지 생성
```
app/test/page.tsx를 만들어줘.
- 'use client' 지시어 포함
- useTest 훅 사용해서 상태 관리
- 중앙에 질문 텍스트 (text-3xl)
- 하단에 A/B 버튼 (2열 그리드)
- 상단에 ProgressBar 컴포넌트
- CLAUDE.md의 디자인 시스템 준수
```

### 로직 구현
```
lib/calculate.ts를 만들어줘.
- calculateResult 함수 export
- 파라미터: answers (Record<string, 'A' | 'B'>)
- 리턴: string (유형 코드, 예: 'IPAE')
- mapping.ts 참고해서 점수 계산
- 각 축별로 높은 쪽 선택
- TypeScript 타입 안전성 보장
```

---

## 🎯 핵심 원칙

### 1. 컴포넌트 재사용
```
같은 코드 2번 쓰면 컴포넌트로 분리
→ Button, Card, Input 등
```

### 2. 타입 안전성
```
any 타입 사용 금지
→ 모든 props에 인터페이스 정의
```

### 3. 파일 위치 규칙
```
페이지: app/
컴포넌트: components/
로직/데이터: lib/
훅: hooks/
이미지: public/images/
```

### 4. 커밋 메시지
```
feat: 새 기능
fix: 버그 수정
style: 디자인 변경
refactor: 리팩토링
docs: 문서 수정

🚀 배포 전 최종 체크
bash# 1. 타입 체크
npm run type-check

# 2. 린트 체크
npm run lint

# 3. 로컬 빌드 테스트
npm run build
npm run start

# 4. 모든 페이지 확인
/ → 메인
/test → 검사
/result/IPAE → 결과 (24개 전체 확인)
/types → 유형 목록
/about → 소개

# 5. 배포
vercel --prod

📞 자주 묻는 질문
Q: 이미지가 안 보여요
typescript// public/images/political/IPAE.jpg 위치 확인
// 파일명이 정확히 유형 코드와 일치하는지 확인

// Next.js Image 컴포넌트 사용
import Image from 'next/image';

<Image
  src="/images/political/IPAE.jpg"
  alt="IPAE"
  width={600}
  height={400}
/>
Q: 빌드가 안 돼요
bash# generateStaticParams 확인
# 24개 유형 코드 전체가 포함되었는지 확인

export async function generateStaticParams() {
  return [
    { type: 'IPAE' }, { type: 'IPAU' }, // ... 24개 전체
  ];
}
Q: localStorage가 작동 안 해요
typescript// 'use client' 지시어 확인
'use client';

// useEffect 내에서 접근
useEffect(() => {
  const data = localStorage.getItem('answers');
}, []);

🎊 완성 후 체크리스트

 사이트명 "PEIT" 대문자 표기 확인
 24개 결과 페이지 모두 작동
 69개 질문 전부 표시
 결과 계산 정확성 검증
 모바일 반응형 확인
 이미지 로딩 확인
 공유 기능 테스트
 Vercel 배포 완료
 도메인 연결 (옵션)
 Google Analytics (옵션)


 정치·경제 성향 테스트 사이트 제작 가이드

📐 사이트 전체 구조
페이지 구성

메인 페이지 (1개)
검사 페이지 (동적 1개, 69문항 순환)
결과 페이지 (24개 - 정치 16개 + 경제 8개)
유형 종류 페이지 (1개)
서비스 소개 페이지 (1개)

총 28개 페이지

🎨 디자인 시스템
컬러 팔레트
메인 컬러 (흑백 베이스)

배경: 화이트 (#FFFFFF)
메인 텍스트: 블랙 (#000000)
서브 텍스트: 그레이 (#666666)
테두리: 라이트 그레이 (#E5E5E5)

포인트 컬러 (보라색 - 액센트만 사용)

메인 보라: #8B5CF6
라이트 보라: #A78BFA (호버)
다크 보라: #7C3AED (클릭)

성향별 컬러 (카드 테두리)

정치 성향: 보라 (#8B5CF6)
경제 성향 - 성장: 골드 (#F59E0B)
경제 성향 - 안정: 블루 (#3B82F6)

타이포그래피
폰트 패밀리

Pretendard (산세리프)

크기 및 굵기

헤드라인: 48px / Bold (700)
본문: 18px / Regular (400) / Line-height 1.6
버튼: 20px / Semi-Bold (600)

버튼 스타일
메인 CTA 버튼

배경: 보라색 그라데이션 (135도, #8B5CF6 → #7C3AED)
모서리: 12px 라운드
패딩: 18px 상하 / 48px 좌우
텍스트: 화이트
그림자: 0 8px 24px rgba(139, 92, 246, 0.3)

답변 선택 버튼 (A/B 카드)

기본 상태:

배경: 화이트
테두리: 2px 라이트 그레이 (#E5E5E5)
모서리: 12px 라운드
패딩: 20px 상하 / 40px 좌우
트랜지션: 0.3초


호버 상태:

테두리: 보라 (#8B5CF6)
그림자: 0 4px 12px rgba(139, 92, 246, 0.15)


클릭 상태:

배경: 연보라 (#F5F3FF)
테두리: 다크 보라 (#7C3AED)



카드 스타일
결과 카드

배경: 화이트
테두리: 3px 보라 스트로크
모서리: 24px 라운드
패딩: 40px
그림자: 0 12px 32px rgba(0, 0, 0, 0.08)

카드 이미지

최대 너비: 600px
높이: 자동 비율
정렬: 중앙


📄 페이지별 상세 구조
1. 메인 페이지 (/)
레이아웃
┌─────────────────────────────────────┐
│ [네비게이션]                         │
│  로고  |  검사  |  유형 종류  |  서비스 │
├─────────────────────────────────────┤
│                                     │
│      [풀 스크린 배경 이미지]         │
│                                     │
│                                     │
│           [사이트 로고]              │
│                                     │
│                                     │
│        [검사 시작하기 버튼]          │
│           (중앙 정렬)                │
│                                     │
│                                     │
│      [배경 이미지 계속...]           │
│                                     │
└─────────────────────────────────────┘
```

#### 구성 요소
- 네비게이션 바 (상단 고정)
  - 로고
  - 검사 링크
  - 유형 종류 링크
  - 서비스 링크

- 메인 콘텐츠
  - 배경 이미지 (풀 스크린)
  - 사이트 로고 (중앙 상단)
  - 검사 시작 버튼 (중앙)

#### 특징
- 초미니멀 디자인
- 버튼 하나만 강조
- 광고 배너 없음
- 설명 텍스트 없음

---

### 2. 검사 페이지 (/test)

#### 레이아웃
```
┌─────────────────────────────────────┐
│ [프로그레스바]  12/69               │
│ ████████░░░░░░░░░░░░░░░░            │
├─────────────────────────────────────┤
│                                     │
│                                     │
│        "개인의 자유와 권리는         │
│         다른 어떤 가치보다           │
│         우선되어야 한다."            │
│                                     │
│    (가운데, 큰 글씨, 읽기 편한 폰트) │
│                                     │
│                                     │
│  ┌──────────┐      ┌──────────┐   │
│  │          │      │          │   │
│  │ A. 그렇다 │      │ B. 아니다 │   │
│  │          │      │          │   │
│  └──────────┘      └──────────┘   │
│   (왼쪽 카드)       (오른쪽 카드)   │
│                                     │
└─────────────────────────────────────┘
```

#### 구성 요소

##### 상단
- 프로그레스바
  - 현재 진행 상황 표시 (예: 12/69)
  - 시각적 바 (채워진 비율 표시)

##### 중앙
- 질문 텍스트
  - 중앙 정렬
  - 큰 사이즈 (24-28px)
  - 읽기 편한 줄 간격
  - 최대 너비: 700px

##### 하단
- A 답안 카드 (왼쪽)
  - 답변 텍스트: "그렇다" 또는 해당 선택지
  
- B 답안 카드 (오른쪽)
  - 답변 텍스트: "아니다" 또는 해당 선택지

#### 동작 흐름
1. 사용자가 A 또는 B 카드 클릭
2. 선택한 답변을 localStorage에 저장
3. 0.3초 페이드 아웃 애니메이션
4. 다음 질문으로 자동 전환 (페이지 새로고침 없음)
5. 69번째 질문 완료 시 결과 계산 후 해당 결과 페이지로 리다이렉트

#### 질문 구조
- 정치 파트: 1-36번 질문
  - 사회관 (I/C): 9문항
  - 변화관 (P/T): 9문항
  - 평등관 (A/U): 9문항
  - 외교안보관 (E/S): 9문항

- 경제 파트: 37-69번 질문
  - 경제관 (G/S): 11문항
  - 투자관 (V/A): 11문항
  - 직업관 (E/W): 11문항

---

### 3. 결과 페이지 (/result/[유형코드])

#### 예시 URL
- /result/IPAE (정치 성향)
- /result/GVE (경제 성향)

#### 레이아웃
```
┌─────────────────────────────────────┐
│        당신의 정치 성향은            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │     [유형 캐릭터 이미지]     │   │
│  │                             │   │
│  │         IPAE                │   │
│  │    진보적 자유주의자         │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│          (보라색 테두리)             │
│                                     │
│  [4축 레이더 차트]                  │
│  - 개인주의 ████████░░ 85%         │
│  - 진보주의 ███████░░░ 75%         │
│  - 적극적 평등 ███████░░░ 70%      │
│  - 협력 우선 ████████░░ 80%        │
│                                     │
│  [상세 설명 텍스트]                 │
│  당신은 '원래 그래왔다'는 말보다... │
│  (2-3문단 분량)                     │
│                                     │
│  [다시 검사하기] [결과 공유하기]    │
│                                     │
└─────────────────────────────────────┘
```

#### 구성 요소

##### 헤더
- "당신의 [정치/경제] 성향은"

##### 결과 카드
- 유형 캐릭터 이미지 (로우폴리곤 동물)
- 유형 코드 (예: IPAE)
- 유형 명칭 (예: 진보적 자유주의자)
- 카드 테두리: 보라색 3px 스트로크

##### 성향 강도 그래프
- 레이더 차트 또는 막대 그래프
- 각 축별 퍼센트 표시
- 정치: 4개 축 (I/C, P/T, A/U, E/S)
- 경제: 3개 축 (G/S, V/A, E/W)

##### 상세 설명
- 해당 유형의 특징 설명 (2-3문단)
- 강점과 약점
- 화법 및 소통 스타일
- 연애 가치관
- 직업적 가치관 등

##### 액션 버튼
- 다시 검사하기 (메인 페이지로)
- 결과 공유하기 (SNS 공유)

#### 24개 결과 페이지 목록

##### 정치 유형 (16개)
1. IPAE - 진보적 자유주의자
2. IPAU - 실용적 자유주의자
3. IPSE - 현실주의적 자유주의자
4. IPSU - 보수적 자유주의자
5. ITAE - 온건한 보수주의자
6. ITAU - 전통적 보수주의자
7. ITSE - 강경 보수주의자
8. ITSU - 고립주의적 보수주의자
9. CPAE - 사회민주주의자
10. CPAU - 사회자유주의자
11. CPSE - 중도 실용주의자
12. CPSU - 권위주의적 보수주의자
13. CTAE - 온건한 공동체주의자
14. CTAU - 전통 공동체주의자
15. CTSE - 국가주의자
16. CTSU - 고립주의적 전통주의자

##### 경제 유형 (8개)
1. GAE - 성장형 분석 기업가
2. GAW - 성장형 분석 안정가
3. GVE - 성장형 비전 기업가
4. GVW - 성장형 비전 안정가
5. SAE - 안정형 분석 기업가
6. SAW - 안정형 분석 안정가
7. SVE - 안정형 비전 기업가
8. SVW - 안정형 비전 안정가

---

### 4. 유형 종류 페이지 (/types)

#### 레이아웃
```
┌─────────────────────────────────────┐
│       모든 유형 알아보기             │
│                                     │
│  [정치 유형] (16개)                 │
│  ┌─────┬─────┬─────┬─────┐       │
│  │IPAE │IPAU │IPSE │IPSU │       │
│  ├─────┼─────┼─────┼─────┤       │
│  │ITAE │ITAU │ITSE │ITSU │       │
│  ├─────┼─────┼─────┼─────┤       │
│  │CPAE │CPAU │CPSE │CPSU │       │
│  ├─────┼─────┼─────┼─────┤       │
│  │CTAE │CTAU │CTSE │CTSU │       │
│  └─────┴─────┴─────┴─────┘       │
│                                     │
│  [경제 유형] (8개)                  │
│  ┌─────┬─────┬─────┬─────┐       │
│  │GAE  │GAW  │GVE  │GVW  │       │
│  ├─────┼─────┼─────┼─────┤       │
│  │SAE  │SAW  │SVE  │SVW  │       │
│  └─────┴─────┴─────┴─────┘       │
│                                     │
└─────────────────────────────────────┘
```

#### 구성 요소

##### 정치 유형 섹션
- 제목: "정치 유형"
- 4×4 그리드 (16개 카드)
- 각 카드 구성:
  - 작은 캐릭터 이미지
  - 유형 코드 (예: IPAE)
  - 유형 명칭 (예: 진보적 자유주의자)
  - 클릭 시 해당 결과 페이지로 이동

##### 경제 유형 섹션
- 제목: "경제 유형"
- 2×4 그리드 (8개 카드)
- 각 카드 구성:
  - 작은 캐릭터 이미지
  - 유형 코드 (예: GVE)
  - 유형 명칭 (예: 성장형 비전 기업가)
  - 클릭 시 해당 결과 페이지로 이동

#### 기능
- 모든 유형 한눈에 보기
- 각 유형 클릭으로 상세 정보 확인
- 비교 및 탐색 용이

---

### 5. 서비스 소개 페이지 (/about)

#### 레이아웃
```
┌─────────────────────────────────────┐
│      이 서비스에 대해                │
│                                     │
│  [검사 방식 설명]                   │
│  본 검사는 69개 질문을 통해         │
│  당신의 정치·경제 성향을 분석합니다. │
│                                     │
│  [채용한 방법론]                    │
│  - 4축 정치 모델                    │
│    (사회관/변화관/평등관/외교안보관) │
│  - 3축 경제 모델                    │
│    (경제관/투자관/직업관)            │
│                                     │
│  [운영 정보]                        │
│  이 서비스는 쿠팡 파트너스를 통해   │
│  운영되고 있습니다.                 │
│                                     │
│  [문의]                             │
│  contact@example.com                │
│                                     │
└─────────────────────────────────────┘
```

#### 구성 요소

##### 검사 방식 설명
- 질문 개수 및 구조
- 소요 시간
- 결과 산출 방식

##### 방법론 소개
- 정치 성향 분석 모델 설명
- 경제 성향 분석 모델 설명
- 각 축의 의미

##### 운영 정보
- 서비스 유지 방법
- 쿠팡 파트너스 안내
- 개인정보 처리 방침

##### 문의
- 이메일 주소
- 피드백 방법

---

## 💾 데이터 저장 및 처리

### localStorage 활용 (데이터베이스 불필요)

#### 답변 저장 구조
```
{
  "q1": "A",
  "q2": "B",
  "q3": "A",
  ...
  "q69": "B"
}
```

#### 저장 시점
- 각 질문에서 A 또는 B 선택 시 즉시 저장
- 브라우저의 localStorage에 JSON 형태로 저장

#### 결과 계산 로직

##### 점수 집계 방식
1. 각 질문의 답변을 해당 축에 점수 부여
2. 예시:
   - Q1: A 선택 → I축 +1점
   - Q1: B 선택 → C축 +1점

##### 유형 결정
1. 각 축별 점수 비교
2. 높은 점수를 가진 쪽으로 결정
3. 예시:
   - I축 6점 vs C축 3점 → I 선택
   - P축 7점 vs T축 2점 → P 선택
   - A축 5점 vs U축 4점 → A 선택
   - E축 8점 vs S축 1점 → E 선택
   - 최종 유형: IPAE

##### 리다이렉트
- 계산된 유형 코드로 결과 페이지 URL 생성
- 예: /result/IPAE로 자동 이동

### 장점
- 서버 비용 없음
- 빠른 처리 속도
- 개인정보 안전 (클라이언트 측만 저장)
- 간단한 구조 (유지보수 용이)

### 제약사항
- 브라우저 닫으면 데이터 소실 (1회성 검사에는 문제 없음)
- 전체 통계 수집 불가 (Google Analytics로 대체 가능)

---

## 🎭 사용자 경험 흐름

### 전체 플로우
```
메인 페이지
   ↓ [검사 시작하기 클릭]
검사 페이지 (Q1)
   ↓ [A 또는 B 선택]
검사 페이지 (Q2)
   ↓ [계속 진행...]
검사 페이지 (Q36) - 정치 파트 완료
   ↓ [자동 전환]
검사 페이지 (Q37) - 경제 파트 시작
   ↓ [계속 진행...]
검사 페이지 (Q69) - 완료
   ↓ [결과 계산]
결과 페이지 (/result/[유형코드])
   ↓
[다시 검사] 또는 [공유] 또는 [다른 유형 보기]
```

### 상호작용 디테일

#### 버튼 클릭 시
1. 0.2초 하이라이트 효과
2. 답변 저장
3. 0.3초 페이드 아웃
4. 다음 질문 페이드 인

#### 진행 중 이탈 시
- 프로그레스바로 진행 상황 확인 가능
- 뒤로가기 버튼으로 이전 질문 수정 가능 (옵션)

#### 결과 확인 후
- 결과 공유 (SNS, 링크 복사)
- 다른 유형 탐색 (유형 종류 페이지)
- 재검사 (메인 페이지)

---

## 📱 반응형 디자인

### 데스크톱 (1200px 이상)
- 메인 페이지: 풀 스크린 배경, 중앙 버튼
- 검사 페이지: A/B 카드 좌우 배치
- 결과 페이지: 카드 최대 너비 800px, 중앙 정렬

### 태블릿 (768px - 1199px)
- 검사 페이지: A/B 카드 여전히 좌우 배치 (작은 패딩)
- 결과 페이지: 카드 너비 조정

### 모바일 (767px 이하)
- 메인 페이지: 배경 이미지 조정, 버튼 크기 최적화
- 검사 페이지: A/B 카드 상하 배치로 전환
- 결과 페이지: 단일 컬럼, 터치 최적화

---

## 🚀 기술 스택

### 프론트엔드
- HTML5
- CSS3
- Vanilla JavaScript

### 배포
- Vercel (무료 호스팅)

### 필요 없는 것
- 백엔드 서버
- 데이터베이스
- 프레임워크 (React, Vue 등)

---

## 📋 필요한 자료 목록

### 1. 이미지 자료

#### 현재 보유 (경제 6개)
- GAE.jpg (황금 매)
- GAW.jpg (늑대 on 파이어마운틴)
- GVE.jpg (황금 황소)
- GVW.jpg (블루 고래)
- SVE.jpg (골든 비)
- SVW.jpg (블루 거북이)

#### 누락 자료
- 경제 2개: SAE, SAW
- 정치 16개: IPAE, IPAU, IPSE, IPSU, ITAE, ITAU, ITSE, ITSU, CPAE, CPAU, CPSE, CPSU, CTAE, CTAU, CTSE, CTSU

#### 이미지 스타일
- 로우폴리곤 3D 렌더링
- 흰 배경
- 동물 모티브
- 1200×800px 이상 권장

### 2. 텍스트 콘텐츠

#### 이미 보유
- 69개 질문 전체 (노션)
- 24개 결과 유형별 상세 설명 (노션)

#### 추가 필요
- 사이트 이름/브랜드명
- 메인 페이지 카피 (옵션)
- 서비스 소개 페이지 텍스트

### 3. 질문 매핑표

#### 필요한 정보
각 질문이 어느 축에 영향을 주는지 명시

예시:
```
Q1: "개인의 자유와 권리는 우선되어야 한다"
- A 선택 → I축 +1
- B 선택 → C축 +1

Q2: "사회는 끊임없이 변화해야 한다"
- A 선택 → P축 +1
- B 선택 → T축 +1
69개 질문 전체에 대한 매핑 필요

✅ 제작 체크리스트
준비 단계

 사이트 이름 확정
 누락 이미지 수령 (SAE, SAW, 정치 16개)
 질문 매핑표 확인/제작
 서비스 소개 텍스트 작성

디자인 단계

 컬러 팔레트 최종 확정
 배경 이미지 제작/선정
 버튼 스타일 확정
 카드 레이아웃 확정

개발 단계

 HTML 구조 설계 (5개 페이지 타입)
 CSS 스타일링 (반응형 포함)
 JavaScript 로직 구현

 질문 순환 시스템
 localStorage 저장
 결과 계산 알고리즘
 페이지 전환 애니메이션


 24개 결과 페이지 생성

테스트 단계

 데스크톱 브라우저 테스트
 모바일 브라우저 테스트
 결과 계산 정확성 검증
 공유 기능 테스트

배포 단계

 Vercel 배포 설정
 도메인 연결 (있을 경우)
 Google Analytics 설치 (옵션)
 쿠팡 파트너스 코드 삽입


🎯 프로젝트 강점
UX 측면

초간결 플로우 (3단계)
빠른 응답 속도
직관적 인터페이스
모바일 최적화

기술 측면

서버 비용 0원
유지보수 간편
확장 용이
안정적 운영

마케팅 측면

결과 URL 공유 가능
SNS 바이럴 최적화
낮은 진입 장벽
재방문 유도 구조


📊 예상 일정
1일차: 자료 수집 및 기획 확정

누락 이미지 수령
질문 매핑표 완성
최종 디자인 시스템 확정

2-3일차: 코어 페이지 개발

메인 페이지
검사 페이지
결과 페이지 템플릿

4-5일차: 결과 페이지 제작

24개 결과 페이지 생성
콘텐츠 삽입
이미지 최적화

6일차: 서브 페이지 및 마무리

유형 종류 페이지
서비스 소개 페이지
전체 테스트

7일차: 배포 및 최적화

Vercel 배포
성능 최적화
최종 확인

총 소요 기간: 7-10일

이 문서는 사이트 제작에 필요한 모든 정보를 포함하고 있으며, 바로 프롬프트로 변환하여 코드 생성에 활용할 수 있습니다.