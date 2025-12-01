import Button from '@/components/Button';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '정치성향테스트 정치유형테스트 사상검증테스트 / 정치mbti',
  description: '나의 정치성향 DNA는? 69개 질문으로 알아보는 나의 정치성향 경제성향. 진보보수, 좌파우파 쉽게 이해하고, 나의 가치관과 투자성향까지 확인해볼 수 있는 성향종합테스트.',
};

export default function Home() {
  return (
    <div className="relative h-screen -mt-16 overflow-hidden">
      {/* 배경 이미지 */}
      {/* 모바일: 세로 끝단(위/아래)을 맞추기 위해 높이 기준으로 확대, 가로는 잘림 */}
      {/* 웹: 기존처럼 중앙 정렬 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/mainbackground.png"
          alt="PEIT 배경"
          fill
          className="object-cover bg-image-left md:bg-image-center"
          quality={90}
          sizes="100vw"
          priority
        />
      </div>
      
      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center md:justify-start h-full px-8 sm:px-12 md:px-4 pt-[23vh] md:pt-[calc(25vh+4rem)] gap-2">
        {/* 제목 */}
        <h1 className="text-6xl md:text-8xl font-bold text-white leading-none">
          PEIT24
        </h1>
        
        {/* 부제목 */}
        <p className="subtitle-custom text-white md:leading-tight -mt-1 md:mt-0 px-4 text-center">
          가장 완벽한 <strong>정치 / 경제</strong> 성향 테스트
        </p>
        
        {/* 프로모션 텍스트 */}
        <div className="text-center w-full md:max-w-4xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-4">
          <p className="text-[0.9em] sm:text-lg md:text-xl text-white leading-tight md:leading-tight">
            스스로를 얼마나 깊이 알고 있나요?<br />
            PEIT24에서 고정관념을 깨고,<br />
            <span className="whitespace-nowrap">정교한 정치경제 DNA를 확인하세요.</span>
          </p>
        </div>
        
        {/* 두 개의 테스트 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-2">
          <Button href="/test?type=political" size="lg" className="py-2.5 md:py-3">
            정치성향 테스트 시작하기
          </Button>
          <Button href="/test?type=economic" size="lg" className="py-2.5 md:py-3">
            경제성향 테스트 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
