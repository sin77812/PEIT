import Button from '@/components/Button';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative h-screen -mt-16 overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/mainbackground2.png"
          alt="PEIT 배경"
          fill
          className="object-cover"
          quality={90}
          sizes="100vw"
          priority
        />
      </div>
      
      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-start h-full px-8 sm:px-12 md:px-4 pt-[calc(25vh+4rem-10vh)] sm:pt-[calc(25vh+4rem-6.25vh-10vh)] md:pt-[calc(25vh+4rem)]">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-[1px]">
          PEIT24
        </h1>
        {/* 모바일: 작은 폰트, 웹: 10% 큰 폰트 + 줄간격 줄임 */}
        <p className="text-base sm:text-lg md:text-xl lg:text-[1.1em] text-white mb-8 whitespace-nowrap md:leading-tight">
          가장 완벽한 <span className="font-bold">정치 / 경제</span> 성향 테스트
        </p>
        
        {/* 새로운 프로모션 텍스트 - 볼드 제거, 폰트 10% 축소 */}
        <div className="text-center mb-16 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-2 sm:px-4">
          <p className="text-[0.9em] sm:text-lg md:text-xl text-white leading-tight md:leading-tight text-pretty break-keep text-balance">
            스스로를 얼마나 깊이 알고 있나요?<br />
            가장 완벽한 정치 / 경제 성향 테스트.<br />
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
