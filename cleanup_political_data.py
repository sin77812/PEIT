#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
정치 유형 데이터 정리 스크립트
- weaknesses 배열에서 화법 관련 내용 제거
- 각 필드에서 중복 내용 제거하고 해당 소제목에만 해당하는 내용만 남김
"""

import re
import json

def clean_weaknesses_array(content, type_name):
    """weaknesses 배열에서 화법 관련 내용 제거"""
    # 해당 유형의 weaknesses 배열 찾기
    pattern = rf'"{type_name}":\s*\{{[^}}]*?"weaknesses":\s*\[(.*?)\]\s*,'
    
    def clean_weaknesses(match):
        weaknesses_content = match.group(1)
        # 화법 관련 줄 제거 (•, ◦, ▪로 시작하는 줄)
        lines = weaknesses_content.split('\n')
        cleaned_lines = []
        for line in lines:
            stripped = line.strip()
            # 화법, 스트레스, 솔루션, 연애 관련 내용 제거
            if any(keyword in stripped for keyword in ['당신의 화법', '스트레스 받는 순간', '솔루션', '연애 가치관', '최고의 연애 파트너', '최악의 갈등 상대']):
                if stripped.startswith('"•') or stripped.startswith('"◦') or stripped.startswith('"▪'):
                    continue
            cleaned_lines.append(line)
        
        return f'"{type_name}": {{... "weaknesses": [{chr(10).join(cleaned_lines)}],'
    
    return re.sub(pattern, clean_weaknesses, content, flags=re.DOTALL)

def extract_text_before_keyword(text, keyword):
    """특정 키워드 이전의 텍스트만 추출"""
    idx = text.find(keyword)
    if idx != -1:
        return text[:idx].strip()
    return text.strip()

def clean_field_content(field_value, field_name):
    """각 필드의 내용을 정리"""
    if not field_value:
        return field_value
    
    # speech_style: 화법만 (스트레스, 솔루션, 연애, 파트너, 소통의 벽 제거)
    if field_name == 'speech_style':
        # '당신의 화법:' 이후부터 '스트레스' 또는 '솔루션' 또는 '연애' 또는 '소통의 벽' 이전까지
        text = field_value
        # '당신의 화법:' 또는 '🗣️' 이후 내용만 추출
        if '당신의 화법:' in text:
            text = text.split('당신의 화법:')[1] if '당신의 화법:' in text else text
        if '🗣️' in text:
            text = text.split('🗣️')[1] if '🗣️' in text else text
        
        # 다음 섹션 이전까지만
        for keyword in ['스트레스', '솔루션', '연애', '소통의 벽', '돈과 일', '역사와 현실', '개인적 성장']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # stress_moment: 스트레스 받는 순간만
    if field_name == 'stress_moment':
        text = field_value
        # '스트레스 받는 순간' 또는 '💔' 이후부터 '솔루션' 또는 '연애' 이전까지
        if '스트레스 받는 순간' in text:
            text = text.split('스트레스 받는 순간')[1] if '스트레스 받는 순간' in text else text
        if '💔' in text:
            text = text.split('💔')[1] if '💔' in text else text
        
        for keyword in ['솔루션', '연애', '소통의 벽', '돈과 일']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # solution: 솔루션만
    if field_name == 'solution':
        text = field_value
        if '솔루션' in text:
            text = text.split('솔루션')[1] if '솔루션' in text else text
        if '💡' in text:
            text = text.split('💡')[1] if '💡' in text else text
        
        for keyword in ['연애', '소통의 벽', '돈과 일']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # love_value: 연애 가치관만
    if field_name == 'love_value':
        text = field_value
        if '연애 가치관' in text:
            text = text.split('연애 가치관')[1] if '연애 가치관' in text else text
        if '❤️' in text:
            text = text.split('❤️')[1] if '❤️' in text else text
        
        for keyword in ['최고의 연애 파트너', '최악의 갈등 상대', '소통의 벽', '돈과 일', '역사와 현실', '개인적 성장']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # best_partner: 최고의 파트너만
    if field_name == 'best_partner':
        text = field_value
        if '최고의 연애 파트너' in text:
            text = text.split('최고의 연애 파트너')[1] if '최고의 연애 파트너' in text else text
        if '💚' in text:
            text = text.split('💚')[1] if '💚' in text else text
        
        for keyword in ['최악의 갈등 상대', '소통의 벽', '돈과 일']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # worst_partner: 최악의 상대만
    if field_name == 'worst_partner':
        text = field_value
        if '최악의 갈등 상대' in text:
            text = text.split('최악의 갈등 상대')[1] if '최악의 갈등 상대' in text else text
        if '💔' in text:
            text = text.split('💔')[1] if '💔' in text else text
        
        for keyword in ['소통의 벽', '돈과 일']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # communication_barrier: 소통의 벽만
    if field_name == 'communication_barrier':
        text = field_value
        if '소통의 벽' in text:
            # 첫 번째 '소통의 벽' 이후부터
            parts = text.split('소통의 벽', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['돈과 일', '역사와 현실', '개인적 성장']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # career_value: 직업적 가치관만
    if field_name == 'career_value':
        text = field_value
        if '직업적 가치관' in text:
            text = text.split('직업적 가치관')[1] if '직업적 가치관' in text else text
        if '💼' in text:
            text = text.split('💼')[1] if '💼' in text else text
        
        for keyword in ['잠재적 재무 스타일', '💰', '역사와 현실', '개인적 성장']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # money_value: 재무 스타일만
    if field_name == 'money_value':
        text = field_value
        if '잠재적 재무 스타일' in text:
            text = text.split('잠재적 재무 스타일')[1] if '잠재적 재무 스타일' in text else text
        if '💰' in text:
            # 💰 이후부터
            parts = text.split('💰', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['역사와 현실', '개인적 성장']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # growth_direction: 성장 방향성만 (추천 도서, 최종 목표 제거)
    if field_name == 'growth_direction':
        text = field_value
        if '성장 방향성' in text:
            text = text.split('성장 방향성')[1] if '성장 방향성' in text else text
        if '🌱' in text:
            text = text.split('🌱')[1] if '🌱' in text else text
        
        for keyword in ['핵심 성장 과제', '🎯', '추천 도서', '📚', '추천 영상', '🎬', '성장의 최종 목표', '🏆']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # final_goal: 성장의 최종 목표만
    if field_name == 'final_goal':
        text = field_value
        if '성장의 최종 목표' in text:
            text = text.split('성장의 최종 목표')[1] if '성장의 최종 목표' in text else text
        if '🏆' in text:
            text = text.split('🏆')[1] if '🏆' in text else text
        
        return text.strip()
    
    # historical_avatar: 역사적 아바타만
    if field_name == 'historical_avatar':
        text = field_value
        if '역사적 아바타' in text:
            text = text.split('역사적 아바타')[1] if '역사적 아바타' in text else text
        
        for keyword in ['현실 속 아바타', '개인적 성장']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # real_avatar: 현실 속 아바타만
    if field_name == 'real_avatar':
        text = field_value
        if '현실 속 아바타' in text:
            text = text.split('현실 속 아바타')[1] if '현실 속 아바타' in text else text
        
        for keyword in ['개인적 성장', '성장 방향성']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # recommended_content: 추천 영상/강의만
    if field_name == 'recommended_content':
        text = field_value
        if '추천 영상' in text or '추천 강의' in text:
            # 추천 영상/강의 부분만
            if '추천 영상' in text:
                text = text.split('추천 영상')[1] if '추천 영상' in text else text
            if '🎬' in text:
                text = text.split('🎬')[1] if '🎬' in text else text
        
        for keyword in ['성장의 최종 목표', '🏆']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    return field_value

# 파일 읽기
with open('lib/political_details.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# weaknesses 배열에서 화법 관련 내용 제거
# IPAS 유형부터 시작
types = ['IPAS', 'IPAE', 'IPUE', 'IPUS', 'ITAE', 'ITAS', 'ITUE', 'ITUS', 
         'CPAE', 'CPAS', 'CPUE', 'CPUS', 'CTAE', 'CTAS', 'CTUE', 'CTUS']

# 각 유형별로 weaknesses 배열 정리
for type_name in types:
    # 해당 유형의 weaknesses 배열 찾기
    pattern = rf'("{type_name}":\s*\{{[^}}]*?"weaknesses":\s*\[)(.*?)(\]\s*,)'
    
    def replace_weaknesses(match):
        prefix = match.group(1)
        weaknesses_content = match.group(2)
        suffix = match.group(3)
        
        # weaknesses 배열 내용을 줄 단위로 분리
        lines = weaknesses_content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            stripped = line.strip()
            # 화법, 스트레스, 솔루션, 연애 관련 내용이 weaknesses 배열에 있으면 제거
            if any(keyword in stripped for keyword in ['당신의 화법', '스트레스 받는 순간', '솔루션', '연애 가치관', '최고의 연애 파트너', '최악의 갈등 상대']):
                # •, ◦, ▪로 시작하는 줄은 제거
                if stripped.startswith('"•') or stripped.startswith('"◦') or stripped.startswith('"▪'):
                    continue
            # 일반적인 약점만 유지
            if stripped and (stripped.startswith('"') or stripped.startswith('      "')):
                cleaned_lines.append(line)
        
        # 마지막 줄이 비어있으면 제거
        while cleaned_lines and not cleaned_lines[-1].strip():
            cleaned_lines.pop()
        
        return prefix + '\n'.join(cleaned_lines) + suffix
    
    content = re.sub(pattern, replace_weaknesses, content, flags=re.DOTALL)

print("weaknesses 배열 정리 완료")

# 파일 저장
with open('lib/political_details.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("파일 저장 완료")

