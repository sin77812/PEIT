// Simple parser to convert data/political_details.txt into TS export
// Heuristic-based; expects blocks starting with "CODE → Name" lines.
const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'data', 'political_details.txt');
const outPath = path.join(__dirname, '..', 'lib', 'political_details.ts');

function normalize(s) {
  return (s || '').replace(/\r/g, '').replace(/\u2028|\u2029/g, '').trim();
}

function parse() {
  const raw = fs.readFileSync(srcPath, 'utf-8');
  const lines = raw.split(/\n/);
  const blocks = [];
  let current = null;

  const headerRe = /^([A-Z]{4})\s*[→>\-]\s*(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(headerRe);
    if (m) {
      if (current) blocks.push(current);
      current = { code: m[1], name: normalize(m[2]), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) blocks.push(current);

  const result = {};

  blocks.forEach((b) => {
    const data = { name: b.name, category: 'political' };
    const text = b.lines.join('\n');

    // hashtags line: contains many #tokens
    const hashMatch = text.match(/#[^\n]+/);
    if (hashMatch) {
      const tags = hashMatch[0]
        .split(/\s+/)
        .filter((w) => w.startsWith('#'))
        .map((w) => w.replace(/^#/, ''));
      if (tags.length) data.keywords = tags;
    }

    // summary
    const summaryMatch = text.match(/한 줄 요약\s*:\s*([^\n]+)/);
    if (summaryMatch) data.summary = normalize(summaryMatch[1]);

    // spectrum
    const spectrumTitle = text.match(/종합 정치 스펙트럼\s*:\s*([^\n]+)/);
    if (spectrumTitle) data.political_spectrum = normalize(spectrumTitle[1]);
    // spectrum detail: from "'보수(우파)'란?" or similar until next section
    const specDetailMatch = text.match(/['\"]?.+?\'?란\?\s*\n([\s\S]*?)(\n\s*[\-•\t]|\n\s*당신은 이런 사람|\n\s*강점과 약점)/);
    if (specDetailMatch) data.political_spectrum_detail = normalize(specDetailMatch[1]);

    // detailed description
    const detailMatch = text.match(/당신은 이런 사람입니다[^(]*\([^)]*\)?[:：]?\s*\n([\s\S]*?)(\n\s*강점과 약점)/);
    if (detailMatch) data.detailed_description = normalize(detailMatch[1]);

    // strengths
    const strengthsMatch = text.match(/강점\s*\(Strengths\)[\s\S]*?\n([\s\S]*?)\n\s*•?\s*⚠️\s*약점|약점 \(Weaknesses\)/);
    if (strengthsMatch) {
      const body = strengthsMatch[1] || '';
      const items = body
        .split(/\n/)
        .map((l) => l.replace(/^\s*\d+\s*/, '').trim())
        .filter((l) => l);
      if (items.length) data.strengths = items;
    }

    // weaknesses
    const weaknessesMatch = text.match(/약점\s*\(Weaknesses\)[\s\S]*?\n([\s\S]*?)(\n\S|$)/);
    if (weaknessesMatch) {
      const body = weaknessesMatch[1] || '';
      const items = body
        .split(/\n/)
        .map((l) => l.replace(/^\s*\d+\s*/, '').trim())
        .filter((l) => l);
      if (items.length) data.weaknesses = items;
    }

    // speech style
    const speechMatch = text.match(/당신의 화법[\s\S]*?\n([\s\S]*?)(\n\s*💔|\n\s*돈과 일|\n\s*역사와 현실|\n\s*개인적 성장|$)/);
    if (speechMatch) data.speech_style = normalize(speechMatch[1]);

    // stress moment
    const stressMatch = text.match(/스트레스[^\n]*:\s*([\s\S]*?)(\n\s*•|\n\s*돈과 일|\n\s*역사와 현실|\n\s*개인적 성장|$)/);
    if (stressMatch) data.stress_moment = normalize(stressMatch[1]);

    // career and finance
    const careerMatch = text.match(/직업적 가치관[\s\S]*?\n([\s\S]*?)(\n\s*•|\n\s*역사와 현실|\n\s*개인적 성장|$)/);
    if (careerMatch) data.career_value = normalize(careerMatch[1]);
    const financeMatch = text.match(/재무 스타일[\s\S]*?\n([\s\S]*?)(\n\s*역사와 현실|\n\s*개인적 성장|$)/);
    if (financeMatch) data.money_value = normalize(financeMatch[1]);

    // growth task, recommended
    const growthTaskMatch = text.match(/핵심 성장 과제[^\n]*\n([\s\S]*?)(\n\s*🏆|$)/);
    if (growthTaskMatch) data.growth_task = normalize((growthTaskMatch[1].split('\n')[0] || '').replace(/^[-•\s]+/, ''));

    // recommended books simple extraction
    const books = [];
    const bookRe = /추천 도서[:：]?『?([^』\n]+)』?\s*\(([^)]+)\)/g;
    let bm;
    while ((bm = bookRe.exec(text))) {
      books.push({ title: normalize(bm[1]), author: normalize(bm[2]) });
    }
    if (books.length) data.recommended_books = books;

    // recommended content (영상/강의)
    const rcMatch = text.match(/추천 영상[\/•\s\S]*?\n([^\n]+)\n/);
    if (rcMatch) data.recommended_content = normalize(rcMatch[1]);

    // final goal
    const finalGoalMatch = text.match(/성장의 최종 목표[\s\S]*?\n([\s\S]*?)$/);
    if (finalGoalMatch) data.final_goal = normalize(finalGoalMatch[1]);

    result[b.code] = data;
  });

  return result;
}

function main() {
  const data = parse();
  const content = `export const politicalDetails: Record<string, any> = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(outPath, content);
  console.log(`Wrote ${Object.keys(data).length} political entries to lib/political_details.ts`);
}

main();

