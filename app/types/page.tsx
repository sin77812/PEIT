import Link from 'next/link';
import Image from 'next/image';
import { results } from '@/lib/results';

export default function TypesPage() {
  const politicalTypes = Object.entries(results)
    .filter(([_, data]) => data.category === 'political')
    .map(([code, data]) => ({ code, ...data }));
    
  const economicTypes = Object.entries(results)
    .filter(([_, data]) => data.category === 'economic')
    .map(([code, data]) => ({ code, ...data }));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          모든 유형 알아보기
        </h1>

        {/* 정치 유형 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">정치 유형 (16개)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {politicalTypes.map(({ code, name }) => (
              <Link
                key={code}
                href={`/result/${code}`}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="relative w-full h-32 mb-3">
                  <Image
                    src={`/images/political/${code}.jpg`}
                    alt={name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <h3 className="font-bold text-accent text-center">{code}</h3>
                <p className="text-sm text-center mt-1">{name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 경제 유형 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">경제 유형 (8개)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {economicTypes.map(({ code, name }) => (
              <Link
                key={code}
                href={`/result/${code}`}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="relative w-full h-32 mb-3">
                  <Image
                    src={`/images/economic/${code}.jpg`}
                    alt={name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <h3 className="font-bold text-accent text-center">{code}</h3>
                <p className="text-sm text-center mt-1">{name}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}