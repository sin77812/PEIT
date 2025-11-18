import Button from '@/components/Button';
import Image from 'next/image';

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
      <div className="relative z-10 flex flex-col items-center justify-center md:justify-start h-full px-8 sm:px-12 md:px-4 md:pt-[calc(25vh+4rem)] translate-y-[50vh] md:-translate-y-[30vh]">
        {/* 모바일: 제목과 소제목 모두 이전 크기로 복원 */}
        {/* 웹: 소제목 이전 크기로 복원 (md:text-2xl lg:text-3xl), 제목과 소제목 끝단 맞추기 위해 조정 필요 */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-[1px] md:mb-0">
          PEIT24
        </h1>
        <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-white mb-8 whitespace-nowrap md:leading-tight md:-mt-[0.5px]">
          가장 완벽한 <span className="font-bold">정치 / 경제</span> 성향 테스트
        </p>
        
        {/* 프로모션 텍스트 - "가장 완벽한 정치 / 경제 성향 테스트." 문장 제거 */}
        <div className="text-center mb-16 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-2 sm:px-4">
          <p className="text-[0.9em] sm:text-lg md:text-xl text-white leading-tight md:leading-tight text-pretty break-keep text-balance">
            스스로를 얼마나 깊이 알고 있나요?<br />
            PEIT24에서 기존의 고정관념을 깨고,<br />
            가장 정교한 정치경제 DNA를 확인하세요.
          </p>
        </div>
        
        {/* 두 개의 테스트 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/test?type=political" size="lg">
            정치성향 테스트 시작하기
          </Button>
          <Button href="/test?type=economic" size="lg">
            경제성향 테스트 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
