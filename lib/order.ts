import { questions } from './questions';

// 표시용 고정 순서 설정
// 요구사항: 단일 검사(정치/경제 각각)에서 주제(축)들이 섞여서 나오도록 고정된 순서 생성

function interleaveByAxis(idsByAxis: Record<string, number[]>, axisOrder: string[]): number[] {
  const queues = axisOrder.map(axis => [...(idsByAxis[axis] || [])]);
  const result: number[] = [];
  let remaining = queues.reduce((sum, q) => sum + q.length, 0);
  while (remaining > 0) {
    for (let i = 0; i < queues.length; i++) {
      if (queues[i].length > 0) {
        result.push(queues[i].shift()!);
        remaining--;
      }
    }
  }
  return result;
}

function buildOrderForCategory(category: 'political' | 'economic'): number[] {
  const byAxis: Record<string, number[]> = {};
  const axisOrder = category === 'political'
    ? ['I/C', 'P/T', 'A/U', 'E/S']
    : ['G/S', 'V/A', 'E/W'];

  questions
    .filter(q => q.category === category)
    .forEach(q => {
      if (!byAxis[q.axis]) byAxis[q.axis] = [];
      byAxis[q.axis].push(q.id);
    });

  return interleaveByAxis(byAxis, axisOrder);
}

export const DISPLAY_ORDER = {
  political: buildOrderForCategory('political'),
  economic: buildOrderForCategory('economic'),
};

// 전체 테스트(사용 시)에선 정치 후 경제 순으로 고정
export const DISPLAY_ORDER_BOTH: number[] = [
  ...DISPLAY_ORDER.political,
  ...DISPLAY_ORDER.economic,
];
