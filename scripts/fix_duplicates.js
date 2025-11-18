const fs = require('fs');
const path = require('path');

// political_details.ts 파일 읽기
const filePath = path.join(__dirname, '../lib/political_details.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 모든 타입의 career_value와 money_value 확인
const typeMatches = content.matchAll(/"([A-Z]+)":\s*\{[\s\S]*?"career_value":\s*"([^"]*(?:"[^"]*")*[^"]*)"[\s\S]*?"money_value":\s*"([^"]*(?:"[^"]*")*[^"]*)"[\s\S]*?}/g);

let modified = false;
const fixes = [];

// 각 타입에 대해 중복 확인 및 제거
for (const match of content.matchAll(/"([A-Z]+)":\s*\{([\s\S]*?)\n\s*\},?/g)) {
  const type = match[1];
  const typeContent = match[2];
  
  // career_value와 money_value 추출
  const careerMatch = typeContent.match(/"career_value":\s*"((?:[^"\\]|\\.|"(?:[^"\\]|\\.)*")*)"/);
  const moneyMatch = typeContent.match(/"money_value":\s*"((?:[^"\\]|\\.|"(?:[^"\\]|\\.)*")*)"/);
  
  if (!careerMatch || !moneyMatch) continue;
  
  let careerValue = careerMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
  let moneyValue = moneyMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
  
  // money_value에서 제목 제거한 순수 내용
  const moneyContent = moneyValue
    .replace(/^\*\*💰\s*잠재적 재무 스타일:\*\*\s*\n\n?/i, '')
    .replace(/^\*\*💰\s*잠재적 재무 스타일:\*\*/i, '')
    .replace(/^💰\s*잠재적 재무 스타일:\s*\n\n?/i, '')
    .trim();
  
  // career_value에서 money_value 내용이 포함되어 있는지 확인 (20자 이상인 경우만)
  if (moneyContent.length > 20 && careerValue.includes(moneyContent)) {
    // career_value에서 money_value 내용 제거
    let newCareerValue = careerValue
      .replace(new RegExp('\\s*' + moneyContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\s*'), 'g'), '')
      .replace(/\n\n\n+/g, '\n\n')
      .trim();
    
    if (newCareerValue !== careerValue) {
      fixes.push({ type, field: 'career_value', old: careerValue, new: newCareerValue });
      // 파일에서 교체
      const escapedOld = careerValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\n').replace(/"/g, '\\"');
      const escapedNew = newCareerValue.replace(/\n/g, '\\n').replace(/"/g, '\\"');
      content = content.replace(
        new RegExp(`"career_value":\\s*"${escapedOld}"`, 'g'),
        `"career_value": "${escapedNew}"`
      );
      modified = true;
    }
  }
  
  // 반대로 career_value의 내용이 money_value에 포함되어 있는지도 확인
  const careerContent = careerValue
    .replace(/^\*\*💼\s*직업적 가치관:\*\*\s*\n\n?/i, '')
    .replace(/^\*\*💼\s*직업적 가치관:\*\*/i, '')
    .replace(/^💼\s*직업적 가치관:\s*\n\n?/i, '')
    .trim();
  
  if (careerContent.length > 20 && moneyValue.includes(careerContent)) {
    let newMoneyValue = moneyValue
      .replace(new RegExp('\\s*' + careerContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\s*'), 'g'), '')
      .replace(/\n\n\n+/g, '\n\n')
      .trim();
    
    if (newMoneyValue !== moneyValue) {
      fixes.push({ type, field: 'money_value', old: moneyValue, new: newMoneyValue });
      const escapedOld = moneyValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\n').replace(/"/g, '\\"');
      const escapedNew = newMoneyValue.replace(/\n/g, '\\n').replace(/"/g, '\\"');
      content = content.replace(
        new RegExp(`"money_value":\\s*"${escapedOld}"`, 'g'),
        `"money_value": "${escapedNew}"`
      );
      modified = true;
    }
  }
}

if (modified) {
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Fixed duplicates:');
  fixes.forEach(fix => {
    console.log(`- ${fix.type}.${fix.field}`);
  });
} else {
  console.log('No duplicates found');
}

