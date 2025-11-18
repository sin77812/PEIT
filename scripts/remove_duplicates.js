const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/political_details.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// politicalDetails 객체 추출
const detailsMatch = content.match(/export const politicalDetails[^=]*=\s*({[\s\S]*});/);
if (!detailsMatch) {
  console.error('Could not find politicalDetails object');
  process.exit(1);
}

const detailsStr = detailsMatch[1];
const details = eval(`(${detailsStr})`);

let modified = false;

// 각 타입에 대해 중복 제거
Object.keys(details).forEach(type => {
  const data = details[type];
  
  if (data.career_value && data.money_value) {
    const careerValue = data.career_value;
    const moneyValue = data.money_value;
    
    // money_value의 내용이 career_value에 포함되어 있는지 확인
    // money_value에서 제목 제거한 순수 내용 추출
    const moneyContent = moneyValue
      .replace(/^\*\*💰\s*잠재적 재무 스타일:\*\*\s*\n\n?/i, '')
      .replace(/^\*\*💰\s*잠재적 재무 스타일:\*\*/i, '')
      .trim();
    
    // career_value에서 money_value 내용이 포함되어 있는지 확인
    if (careerValue.includes(moneyContent) && moneyContent.length > 20) {
      // career_value에서 money_value 내용 제거
      const newCareerValue = careerValue
        .replace(new RegExp(moneyContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
        .replace(/\n\n\n+/g, '\n\n')
        .trim();
      
      if (newCareerValue !== careerValue) {
        console.log(`Removing duplicate from ${type}.career_value`);
        data.career_value = newCareerValue;
        modified = true;
      }
    }
    
    // 반대로 career_value의 내용이 money_value에 포함되어 있는지도 확인
    const careerContent = careerValue
      .replace(/^\*\*💼\s*직업적 가치관:\*\*\s*\n\n?/i, '')
      .replace(/^\*\*💼\s*직업적 가치관:\*\*/i, '')
      .trim();
    
    if (moneyValue.includes(careerContent) && careerContent.length > 20) {
      const newMoneyValue = moneyValue
        .replace(new RegExp(careerContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
        .replace(/\n\n\n+/g, '\n\n')
        .trim();
      
      if (newMoneyValue !== moneyValue) {
        console.log(`Removing duplicate from ${type}.money_value`);
        data.money_value = newMoneyValue;
        modified = true;
      }
    }
  }
});

if (modified) {
  // 파일 다시 쓰기
  const newContent = content.replace(
    /export const politicalDetails[^=]*=\s*({[\s\S]*});/,
    `export const politicalDetails: Record<string, any> = ${JSON.stringify(details, null, 2)};`
  );
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Duplicates removed successfully');
} else {
  console.log('No duplicates found');
}

