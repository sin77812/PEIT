export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PEIT</h3>
            <p className="text-gray-600">당신의 정치·경제 좌표</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600 mb-1">
              전화번호: 00000000
            </p>
            <p className="text-sm text-gray-500">
              웹디자인 by 치로웹디자인
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2024 PEIT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}