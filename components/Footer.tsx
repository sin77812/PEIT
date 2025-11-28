export default function Footer() {
  return (
    <footer className="bg-bg-light-purple border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PEIT</h3>
            <p className="text-gray-600">당신의 정치·경제 좌표</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-center md:items-end">
            <div className="flex items-center gap-4 mb-2">
              <a
                href="mailto:peit24purples@gmail.com"
                className="text-gray-700 hover:text-accent transition-colors"
              >
                peit24purples@gmail.com
              </a>
              <a
                href="https://www.instagram.com/peit24__purples"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-600 hover:text-accent transition-colors"
                title="Instagram: @peit24__purples"
              >
                {/* Instagram Icon (inline SVG) */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z" />
                  <path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                  <circle cx="17.5" cy="6.5" r="1.2" />
                </svg>
              </a>
            </div>
            <p className="text-sm text-gray-500">웹디자인 by 치로웹디자인</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2024 PEIT24 . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
