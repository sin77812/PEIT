import { politicalDetails } from './political_details';
import { results } from './results';

export interface Book {
  title: string;
  author: string;
  link: string;
  relatedTypes: string[]; // 연관된 유형 코드들
  imageFileName?: string; // 실제 이미지 파일명 (예: "국가는 왜 실패하는가.jpg")
}

/**
 * 도서 제목과 실제 파일명 매핑
 * 실제 파일명을 직접 명시하여 1:1 매칭
 */
/**
 * 도서 제목과 실제 파일명 매핑
 * 실제 파일명을 직접 명시하여 1:1 매칭
 * 파일명은 /public/images/for shop/ 폴더에 있는 실제 파일명과 정확히 일치해야 함
 */
const bookImageFileNameMap: Record<string, string> = {
  '권력의 법칙': '권력의 법칙.jpg',
  '어떻게 원하는 것을 얻는가': '어떻게 원하는 것을 얻는가.jpeg',
  '린 스타트업': '린 스타트업.jpg',
  '팩트풀니스': '팩트풀니스.jpg',
  '인간관계론': '인간관계론.jpg',
  '생각에 관한 생각': '생각에 관한 생각.jpg',
  '나 홀로 볼링': '나홀로 볼링.jpg',
  '총, 균, 쇠': '총균쇠.webp',
  '리더십 불변의 법칙': '리더십불변의 법칙.jpeg',
  '블랙 스완': '블랙스완.jpg',
  '정의란 무엇인가': '정의란 무엇인가.jpg',
  '돈의 심리학': '돈의 심리학.jpeg',
  '성공하는 사람들의 7가지 습관': '성공하는 사람들의 7가지 습관.jpg',
  '안티프래질': '안티프래질.jpg',
  '사피엔스': '사피엔스.jpg',
  '지리의 힘': '지리의 힘.jpg',
  '바른 마음': '바른마음.jpg',
  '설득의 심리학': '설득의 심리학.jpg',
  '아주 작은 습관의 힘': '아주 작은 습관의 힘.jpg', // 실제 파일명: 아주 작은 습관의 힘.jpg
  '군주론': '군주론.jpg',
  '국가는 왜 실패하는가': '국가는 왜 실패하는가.jpg',
  '정치와 비전': '정치와 비전.jpeg',
  '감시와 처벌': '감시와 처벌.jpeg',
  '좋은 기업을 넘어 위대한 기업으로': '좋은 기업을 넘어 위대한 기업으로.jpg',
  '원칙': '원칙.jpg',
  '코스모스': '코스모스.jpg',
  '딥워크': '딥워크.jpg',
  '정리하는 뇌': '정리하는 뇌.jpg',
  '기브 앤 테이크': '기브 앤 테이크.jpg',
  '나쁜 사마리아인들': '나쁜 사마리아인들.jpeg',
  '더 골': '더 골.jpg',
  '데이터는 어떻게 세상을 지배하는가': '데이터는 어떻게 세상을 지배하는가.jpg',
  '경영의 모험': '경영의 모험.jpg',
  '스타트업 바이블': '스타트업 바이블.jpg',
  '변화의 시작 5초의 법칙': '변화의 시작 5초의 법칙.jpg',
  '부자의 그릇': '부자의 그릇.jpg',
  '부자의 그릿': '부자의 그릇.jpg', // 그릿으로도 검색 가능하도록
  '그릿': '그릿.jpg',
  '제로투원': '제로투원.jpg',
  '제로 투 원': '제로투원.jpg',
  '생각의 탄생': '생각의 탄생.jpg',
  '한국형 장사의 신': '한국형 장사의 신.jpeg',
  '아이디어 불패의 법칙': '아이디어 불패의 법칙.jpg',
};

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
        relatedTypes: [], // 나중에 채워짐
        imageFileName: bookImageFileNameMap[title] // 실제 파일명 매핑
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

