export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-light-purple py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          이 서비스에 대해
        </h1>

        <div className="space-y-8">
          {/* 검사 방식 설명 */}
          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">검사 방식</h2>
            <p className="text-gray-700 leading-relaxed">
              본 검사는 69개 질문을 통해 당신의 정치·경제 성향을 분석합니다.
              각 질문에 대해 자신의 생각과 가까운 답변을 선택하면,
              총 24개의 세분화된 유형 중 하나로 결과가 나타납니다.
              소요 시간은 약 10-15분입니다.
            </p>
          </section>

          {/* 방법론 소개 */}
          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">분석 방법론</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">정치 성향 4축 모델</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>사회관 (I/C):</strong> 개인주의 vs 공동체주의</li>
                <li><strong>변화관 (P/T):</strong> 진보주의 vs 보수주의</li>
                <li><strong>평등관 (A/U):</strong> 적극적 평등 vs 보편적 평등</li>
                <li><strong>외교안보관 (E/S):</strong> 국제협력 vs 자국우선</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">경제 성향 3축 모델</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>경제관 (G/S):</strong> 성장 중시 vs 안정 중시</li>
                <li><strong>투자관 (V/A):</strong> 비전 투자 vs 분석 투자</li>
                <li><strong>직업관 (E/W):</strong> 기업가형 vs 직장인형</li>
              </ul>
            </div>
          </section>

          {/* 운영 정보 */}
          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">운영 정보</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              이 서비스는 개인정보를 수집하지 않으며, 모든 검사 데이터는
              사용자의 브라우저에만 저장됩니다. 서버에는 어떤 개인 데이터도
              전송되지 않습니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              본 검사는 학술적 목적이나 진단을 위한 것이 아닌,
              자기 이해와 재미를 위한 참고 자료입니다.
            </p>
          </section>

          {/* 문의 */}
          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">문의</h2>
            <p className="text-gray-700">
              서비스 이용에 관한 문의사항이 있으시면 아래 이메일로 연락주세요.
            </p>
            <p className="mt-2">
              <a href="mailto:peit24purples@gmail.com" className="text-accent hover:underline">
                peit24purples@gmail.com
              </a>
            </p>
            <p className="mt-3 flex items-center gap-2">
              <a
                href="https://www.instagram.com/peit24__purples"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram: @peit24__purples"
                className="text-gray-700 hover:text-accent transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z" />
                  <path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                  <circle cx="17.5" cy="6.5" r="1.2" />
                </svg>
                <span className="underline decoration-transparent hover:decoration-inherit">@peit24__purples</span>
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
