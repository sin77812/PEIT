#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
파일 포맷 수정 및 최종 정리
"""

import re

# 파일 읽기
with open('lib/political_details.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. weaknesses 배열 포맷 수정 (줄바꿈 추가)
content = re.sub(r'"weaknesses":\s*\[\s*"', '"weaknesses": [\n      "', content)
content = re.sub(r',\s*"', ',\n      "', content)
content = re.sub(r',\s*\]', '\n    ]', content)

# 2. 이스케이프 문자 수정 (\\\" -> ")
content = re.sub(r'\\"', '"', content)

# 3. communication_barrier 필드에서 ": " 제거
content = re.sub(r'"communication_barrier":\s*":\s*', '"communication_barrier": "', content)

# 4. money_value 필드에서 ":\\n" 제거
content = re.sub(r'"money_value":\s*":\\n', '"money_value": "', content)

# 5. 빈 필드 정리
content = re.sub(r'"stress_moment":\s*""', '"stress_moment": ""', content)
content = re.sub(r'"love_value":\s*"▪\\t"', '"love_value": ""', content)
content = re.sub(r'"best_partner":\s*"▪\\t"', '"best_partner": ""', content)
content = re.sub(r'"worst_partner":\s*"\'"', '"worst_partner": ""', content)

# 6. communication_barrier에서 "을 만드는 것입니다." 같은 불완전한 텍스트 제거
content = re.sub(r'"communication_barrier":\s*"[^"]*을 만드는 것입니다\."', '"communication_barrier": ""', content)

# 파일 저장
with open('lib/political_details.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("포맷 수정 완료")

