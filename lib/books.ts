import { politicalDetails } from './political_details';
import { results } from './results';

export interface Book {
  title: string;
  author: string;
  link: string;
  relatedTypes: string[]; // 연관된 유형 코드들
}

/**
 * recommended_content에서 도서 정보를 추출합니다.
 * 형식: **📚 추천 도서:** **『도서명』 (저자):** <a href="링크">...</a>
 * 또는: **📚 추천 도서:** **도서명 (저자):** <a href="링크">...</a>
 */
function parseRecommendedContent(content: string): Book[] {
  const books: Book[] = [];
  
  // 도서 추천 섹션만 추출 (영상/강의 섹션 제외)
  const bookSection = content.split('**🎬')[0];
  
  // 각 도서 추천 라인을 찾습니다
  // 『도서명』 형식 또는 그냥 도서명 형식 모두 지원
  const bookRegex = /\*\*📚 추천 도서:\*\*\s*\*\*『?([^』]+?)』?\s*\(([^)]+)\):\*\*\s*<a\s+href="([^"]+)"[^>]*>/g;
  let match;
  
  while ((match = bookRegex.exec(bookSection)) !== null) {
    const title = match[1].trim();
    const author = match[2].trim();
    const link = match[3].trim();
    
    // 유효한 데이터인지 확인
    if (title && author && link) {
      books.push({
        title,
        author,
        link,
        relatedTypes: [] // 나중에 채워짐
      });
    }
  }
  
  return books;
}

/**
 * 모든 유형의 도서 정보를 수집하고 중복을 제거합니다.
 */
export function getAllBooks(): Book[] {
  const bookMap = new Map<string, Book>();
  
  // 정치 유형 도서 수집
  Object.entries(politicalDetails).forEach(([typeCode, details]) => {
    if (details.recommended_content) {
      const books = parseRecommendedContent(details.recommended_content);
      
      books.forEach(book => {
        // 같은 도서(제목+저자)가 이미 있으면 유형만 추가
        const key = `${book.title}|${book.author}`;
        if (bookMap.has(key)) {
          const existingBook = bookMap.get(key)!;
          if (!existingBook.relatedTypes.includes(typeCode)) {
            existingBook.relatedTypes.push(typeCode);
          }
        } else {
          book.relatedTypes = [typeCode];
          bookMap.set(key, book);
        }
      });
    }
  });
  
  // 경제 유형 도서 수집
  Object.entries(results).forEach(([typeCode, data]) => {
    if (data.category === 'economic' && data.recommended_content) {
      const books = parseRecommendedContent(data.recommended_content);
      
      books.forEach(book => {
        const key = `${book.title}|${book.author}`;
        if (bookMap.has(key)) {
          const existingBook = bookMap.get(key)!;
          if (!existingBook.relatedTypes.includes(typeCode)) {
            existingBook.relatedTypes.push(typeCode);
          }
        } else {
          book.relatedTypes = [typeCode];
          bookMap.set(key, book);
        }
      });
    }
  });
  
  return Array.from(bookMap.values());
}

/**
 * 특정 유형에 연관된 도서들을 반환합니다.
 */
export function getBooksByType(typeCode: string): Book[] {
  const allBooks = getAllBooks();
  return allBooks.filter(book => book.relatedTypes.includes(typeCode));
}

/**
 * 모든 정치 유형 코드를 반환합니다.
 */
export function getAllPoliticalTypes(): string[] {
  return Object.keys(politicalDetails).filter(code => 
    politicalDetails[code].category === 'political'
  ).sort();
}

/**
 * 모든 경제 유형 코드를 반환합니다.
 */
export function getAllEconomicTypes(): string[] {
  return Object.keys(results).filter(code => 
    results[code].category === 'economic'
  ).sort();
}

