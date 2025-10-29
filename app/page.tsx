import Button from '@/components/Button';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative h-screen -mt-16 overflow-hidden">
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
        <p className="text-xl md:text-2xl text-black mb-12">
          당신의 정치·경제 좌표
        </p>
        <Button href="/test" size="lg">
          검사 시작하기
        </Button>
      </div>
    </main>
  );
}