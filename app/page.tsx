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
          priority
        />
      </div>
      
      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-black mb-4">
          PEIT
        </h1>
        <p className="text-xl md:text-2xl text-black mb-8">
          당신의 정치·경제 좌표
        </p>
        
        {/* 새로운 프로모션 텍스트 */}
        <div className="text-center mb-16 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-md px-6 py-5 md:px-8 md:py-6">
          <p className="text-lg md:text-xl text-gray-900 leading-relaxed text-pretty">
            여러분은 스스로를 얼마나 깊이 알고 있나요?<br />
            PEIT에서 기존의 고정관념을 깨고,<br />
            가장 정교한 정치경제 DNA를 확인하세요.
          </p>
        </div>
        
        {/* 두 개의 테스트 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/test?type=political" size="lg">
            정치 테스트 시작하기
          </Button>
          <Button href="/test?type=economic" size="lg">
            경제 테스트 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
