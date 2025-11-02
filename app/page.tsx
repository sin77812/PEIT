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
        <div className="text-center mb-16 max-w-2xl">
          <p className="text-lg md:text-xl text-black leading-relaxed">
            여러분은 스스로를 얼마나 깊이 알고 있나요?<br />
            PEIT에서 기존의 고정관념을 깨고,<br />
            가장 정교한 정치경제 DNA를 확인하세요.
          </p>
        </div>
        
        <Button href="/test" size="lg">
          검사 시작하기
        </Button>
      </div>
    </div>
  );
}