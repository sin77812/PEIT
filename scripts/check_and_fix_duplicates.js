const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/political_details.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 모든 타입의 career_value와 money_value 확인
const fixes = [];

// 각 타입 블록 찾기
const typeBlocks = content.matchAll(/"([A-Z]+)":\s*\{([\s\S]*?)\n\s*\},?/g);

for (const match of typeBlocks) {
  const type = match[1];
  const typeContent = match[2];
  
  // career_value와 money_value 추출
  const careerMatch = typeContent.match(/"career_value":\s*"((?:[^"\\]|\\.|"(?:[^"\\]|\\.)*")*)"/);
  const moneyMatch = typeContent.match(/"money_value":\s*"((?:[^"\\]|\\.|"(?:[^"\\]|\\.)*")*)"/);
  
  if (!careerMatch || !moneyMatch) continue;
  
  let careerValue = careerMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
  let moneyValue = moneyMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
  
  // money_value에서 제목 제거한 순수 내용 (20자 이상)
  const moneyContent = moneyValue
    .replace(/^\*\*💰\s*잠재적 재무 스타일:\*\*\s*\n\n?/i, '')
    .replace(/^\*\*💰\s*잠재적 재무 스타일:\*\*/i, '')
    .replace(/^💰\s*잠재적 재무 스타일:\s*\n\n?/i, '')
    .trim();
  
  // career_value에서 money_value 내용이 포함되어 있는지 확인
  if (moneyContent.length > 20) {
    // 정확한 매칭을 위해 문장 단위로 확인
    const moneySentences = moneyContent.split(/[\.。]/).filter(s => s.trim().length > 10);
    
    let hasDuplicate = false;
    let newCareerValue = careerValue;
    
    for (const sentence of moneySentences) {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length > 20 && newCareerValue.includes(trimmedSentence)) {
        hasDuplicate = true;
        // 해당 문장 제거
        newCareerValue = newCareerValue
          .replace(new RegExp('\\s*' + trimmedSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
          .replace(/\n\n\n+/g, '\n\n')
          .trim();
      }
    }
    
    // 전체 내용이 포함되어 있는지도 확인
    if (moneyContent.length > 50 && newCareerValue.includes(moneyContent)) {
      hasDuplicate = true;
      newCareerValue = newCareerValue
        .replace(new RegExp('\\s*' + moneyContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\s*'), 'g'), '')
        .replace(/\n\n\n+/g, '\n\n')
        .trim();
    }
    
    if (hasDuplicate && newCareerValue !== careerValue) {
      fixes.push({ type, field: 'career_value' });
      // 파일에서 교체 (이스케이프 처리)
      const escapedOld = careerValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\n').replace(/"/g, '\\"');
      const escapedNew = newCareerValue.replace(/\n/g, '\\n').replace(/"/g, '\\"');
      content = content.replace(
        new RegExp(`"career_value":\\s*"${escapedOld}"`, 'g'),
        `"career_value": "${escapedNew}"`
      );
    }
  }
}

if (fixes.length > 0) {
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed duplicates in ${fixes.length} types:`);
  fixes.forEach(fix => {
    console.log(`- ${fix.type}.${fix.field}`);
  });
} else {
  console.log('No duplicates found');
}

