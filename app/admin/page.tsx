import Link from 'next/link';
import { results } from '@/lib/results';

export default function AdminPage() {
  const politicalTypes = Object.entries(results)
    .filter(([_, data]) => data.category === 'political')
    .map(([code, data]) => ({ code, name: data.name }));
    
  const economicTypes = Object.entries(results)
    .filter(([_, data]) => data.category === 'economic')
    .map(([code, data]) => ({ code, name: data.name }));

  return (
    <div className="min-h-screen bg-bg-light-purple py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          모든 유형 목록
        </h1>

        {/* 정치 유형 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">정치 유형 (16개)</h2>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex flex-wrap gap-2">
              {politicalTypes.map(({ code, name }) => (
                <Link
                  key={code}
                  href={`/result/${code}`}
                  className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium"
                >
                  {code} - {name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 경제 유형 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">경제 유형 (8개)</h2>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex flex-wrap gap-2">
              {economicTypes.map(({ code, name }) => (
                <Link
                  key={code}
                  href={`/result/${code}`}
                  className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium"
                >
                  {code} - {name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

