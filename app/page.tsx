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
      <div className="relative z-10 flex flex-col items-center justify-center md:justify-start h-full px-8 sm:px-12 md:px-4 pt-[28vh] md:pt-[calc(25vh+4rem)] gap-2">
        {/* 제목 */}
        <h1 className="text-6xl md:text-8xl font-bold text-white leading-none">
          PEIT24
        </h1>
        
        {/* 부제목 */}
        <p className="subtitle-custom text-white whitespace-nowrap md:leading-tight subtitle-underline -mt-1 md:mt-0">
          가장 완벽한 <span className="font-bold">정치 / 경제</span> 성향 테스트
        </p>
        
        {/* 프로모션 텍스트 */}
        <div className="text-center max-w-full md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-4 md:px-4">
          <p className="text-[0.9em] sm:text-lg md:text-xl text-white leading-tight md:leading-tight text-pretty break-keep">
            스스로를 얼마나 깊이 알고 있나요?<br />
            PEIT24에서 고정관념을 깨고,<br />
            정교한 정치경제 DNA를 확인하세요.
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
