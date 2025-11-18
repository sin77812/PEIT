#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
정치 유형 데이터 최종 정리 스크립트
- weaknesses 배열에서 화법 관련 내용 제거
- 각 필드에서 중복 내용 제거하고 해당 소제목에만 해당하는 내용만 남김
- 원본 내용은 모두 보존
"""

import re

def clean_weaknesses_array(content):
    """weaknesses 배열에서 화법 관련 내용 제거"""
    # 각 유형의 weaknesses 배열에서 •, ◦, ▪로 시작하는 줄 제거
    pattern = r'("weaknesses":\s*\[)(.*?)(\]\s*,)'
    
    def clean_weaknesses(match):
        prefix = match.group(1)
        weaknesses_content = match.group(2)
        suffix = match.group(3)
        
        lines = weaknesses_content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            stripped = line.strip()
            # •, ◦, ▪로 시작하는 줄은 제거 (화법, 스트레스, 솔루션, 연애 관련)
            if stripped.startswith('"•') or stripped.startswith('"◦') or stripped.startswith('"▪'):
                continue
            # 일반적인 약점만 유지
            if stripped and (stripped.startswith('"') or stripped.startswith('      "')):
                cleaned_lines.append(line)
        
        # 마지막 줄이 비어있으면 제거
        while cleaned_lines and not cleaned_lines[-1].strip():
            cleaned_lines.pop()
        
        return prefix + '\n'.join(cleaned_lines) + suffix
    
    return re.sub(pattern, clean_weaknesses, content, flags=re.DOTALL)

def extract_text_before_keywords(text, keywords):
    """특정 키워드 이전의 텍스트만 추출"""
    for keyword in keywords:
        if keyword in text:
            text = text.split(keyword)[0]
    return text.strip()

def clean_field_content(field_value, field_name):
    """각 필드의 내용을 정리"""
    if not field_value:
        return field_value
    
    original = field_value
    
    # speech_style: 화법만
    if field_name == 'speech_style':
        # '당신의 화법:' 또는 '🗣️' 이후부터
        if '당신의 화법:' in field_value:
            field_value = field_value.split('당신의 화법:')[1]
        elif '🗣️' in field_value:
            field_value = field_value.split('🗣️')[1]
        
        # 다음 섹션 이전까지만
        field_value = extract_text_before_keywords(field_value, [
            '스트레스 받는 순간', '💔', '솔루션', '💡', '연애 가치관', '❤️',
            '최고의 연애 파트너', '💚', '최악의 갈등 상대', '소통의 벽',
            '돈과 일', '역사와 현실', '개인적 성장'
        ])
        
        return field_value
    
    # stress_moment: 스트레스 받는 순간만
    if field_name == 'stress_moment':
        if '스트레스 받는 순간' in field_value:
            parts = field_value.split('스트레스 받는 순간', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '💔' in field_value:
            parts = field_value.split('💔', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '솔루션', '💡', '연애 가치관', '❤️', '최고의 연애 파트너', '💚',
            '최악의 갈등 상대', '소통의 벽', '돈과 일'
        ])
        
        return field_value
    
    # solution: 솔루션만
    if field_name == 'solution':
        if '솔루션' in field_value:
            parts = field_value.split('솔루션', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '💡' in field_value:
            parts = field_value.split('💡', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '연애 가치관', '❤️', '최고의 연애 파트너', '💚', '최악의 갈등 상대',
            '소통의 벽', '돈과 일'
        ])
        
        return field_value
    
    # love_value: 연애 가치관만
    if field_name == 'love_value':
        if '연애 가치관' in field_value:
            parts = field_value.split('연애 가치관', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '❤️' in field_value:
            parts = field_value.split('❤️', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '최고의 연애 파트너', '💚', '최악의 갈등 상대', '💔', '소통의 벽',
            '돈과 일', '역사와 현실', '개인적 성장', '추천 도서', '📚'
        ])
        
        return field_value
    
    # best_partner: 최고의 파트너만
    if field_name == 'best_partner':
        if '최고의 연애 파트너' in field_value:
            parts = field_value.split('최고의 연애 파트너', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '💚' in field_value:
            parts = field_value.split('💚', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '최악의 갈등 상대', '💔', '소통의 벽', '돈과 일', '역사와 현실'
        ])
        
        return field_value
    
    # worst_partner: 최악의 상대만
    if field_name == 'worst_partner':
        if '최악의 갈등 상대' in field_value:
            parts = field_value.split('최악의 갈등 상대', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '💔' in field_value and '최악' in original:
            parts = field_value.split('💔', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '소통의 벽', '돈과 일', '역사와 현실'
        ])
        
        return field_value
    
    # communication_barrier: 소통의 벽만
    if field_name == 'communication_barrier':
        if '소통의 벽' in field_value:
            parts = field_value.split('소통의 벽', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '돈과 일', '역사와 현실', '개인적 성장'
        ])
        
        return field_value
    
    # career_value: 직업적 가치관만
    if field_name == 'career_value':
        if '직업적 가치관' in field_value:
            parts = field_value.split('직업적 가치관', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '💼' in field_value:
            parts = field_value.split('💼', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '잠재적 재무 스타일', '💰', '역사와 현실', '개인적 성장'
        ])
        
        return field_value
    
    # money_value: 재무 스타일만
    if field_name == 'money_value':
        if '잠재적 재무 스타일' in field_value:
            parts = field_value.split('잠재적 재무 스타일', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '💰' in field_value:
            parts = field_value.split('💰', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '역사와 현실', '개인적 성장', '추천 도서'
        ])
        
        return field_value
    
    # growth_direction: 성장 방향성만
    if field_name == 'growth_direction':
        if '성장 방향성' in field_value:
            parts = field_value.split('성장 방향성', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '🌱' in field_value:
            parts = field_value.split('🌱', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '핵심 성장 과제', '🎯', '추천 도서', '📚', '추천 영상', '🎬',
            '성장의 최종 목표', '🏆'
        ])
        
        return field_value
    
    # final_goal: 성장의 최종 목표만
    if field_name == 'final_goal':
        if '성장의 최종 목표' in field_value:
            parts = field_value.split('성장의 최종 목표', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '🏆' in field_value:
            parts = field_value.split('🏆', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        return field_value
    
    # historical_avatar: 역사적 아바타만
    if field_name == 'historical_avatar':
        if '역사적 아바타' in field_value:
            parts = field_value.split('역사적 아바타', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '현실 속 아바타', '개인적 성장', '성장 방향성'
        ])
        
        return field_value
    
    # real_avatar: 현실 속 아바타만
    if field_name == 'real_avatar':
        if '현실 속 아바타' in field_value:
            parts = field_value.split('현실 속 아바타', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '개인적 성장', '성장 방향성', '핵심 성장 과제', '추천 도서'
        ])
        
        return field_value
    
    # recommended_content: 추천 영상/강의만
    if field_name == 'recommended_content':
        if '추천 영상' in field_value:
            parts = field_value.split('추천 영상', 1)
            if len(parts) > 1:
                field_value = parts[1]
        elif '🎬' in field_value:
            parts = field_value.split('🎬', 1)
            if len(parts) > 1:
                field_value = parts[1]
        
        field_value = extract_text_before_keywords(field_value, [
            '성장의 최종 목표', '🏆'
        ])
        
        return field_value
    
    return field_value

# 파일 읽기
with open('lib/political_details.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# weaknesses 배열 정리
print("weaknesses 배열 정리 중...")
content = clean_weaknesses_array(content)

# 각 유형별로 필드 정리
types = ['IPAS', 'IPAE', 'IPUE', 'IPUS', 'ITAE', 'ITAS', 'ITUE', 'ITUS', 
         'CPAE', 'CPAS', 'CPUE', 'CPUS', 'CTAE', 'CTAS', 'CTUE', 'CTUS']

fields_to_clean = ['speech_style', 'stress_moment', 'solution', 'love_value', 
                   'best_partner', 'worst_partner', 'communication_barrier',
                   'career_value', 'money_value', 'growth_direction', 'final_goal',
                   'historical_avatar', 'real_avatar', 'recommended_content']

for type_name in types:
    print(f"정리 중: {type_name}")
    
    for field_name in fields_to_clean:
        # 해당 유형의 필드 찾기 (JSON 문자열 내에서)
        # 패턴: "field_name": "..." 다음 쉼표나 닫는 중괄호 전까지
        pattern = rf'("{type_name}":\s*\{{[^}}]*?"{field_name}":\s*")(.*?)("\s*[,}}])'
        
        def replace_field(match):
            prefix = match.group(1)
            field_value = match.group(2)
            suffix = match.group(3)
            
            # 필드 내용 정리
            cleaned_value = clean_field_content(field_value, field_name)
            
            # JSON 문자열 내에서 이스케이프 처리
            cleaned_value = cleaned_value.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
            
            return prefix + cleaned_value + suffix
        
        content = re.sub(pattern, replace_field, content, flags=re.DOTALL)

print("모든 필드 정리 완료")

# 파일 저장
with open('lib/political_details.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("파일 저장 완료")

