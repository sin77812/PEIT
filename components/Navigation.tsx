import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-accent">
            PEIT
          </Link>
          
          <div className="flex space-x-8">
            <Link href="/test" className="text-gray-700 hover:text-accent transition-colors">
              검사
            </Link>
            <Link href="/types" className="text-gray-700 hover:text-accent transition-colors">
              유형 종류
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-accent transition-colors">
              서비스
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}