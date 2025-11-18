#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
정치 유형 데이터 전체 정리 스크립트
- 각 필드에서 중복 내용 제거하고 해당 소제목에만 해당하는 내용만 남김
"""

import re
import json

def clean_text_field(text, field_name):
    """각 필드의 텍스트를 정리하여 해당 소제목에만 해당하는 내용만 남김"""
    if not text or not isinstance(text, str):
        return text
    
    original_text = text
    
    # speech_style: 화법만 (스트레스, 솔루션, 연애, 파트너, 소통의 벽 제거)
    if field_name == 'speech_style':
        # '당신의 화법:' 또는 '🗣️' 이후부터 다음 섹션 이전까지
        if '당신의 화법:' in text:
            text = text.split('당신의 화법:')[1]
        elif '🗣️' in text:
            text = text.split('🗣️')[1]
        
        # 다음 섹션 이전까지만
        for keyword in ['스트레스 받는 순간', '💔', '솔루션', '💡', '연애 가치관', '❤️', '최고의 연애 파트너', '💚', '최악의 갈등 상대', '소통의 벽', '돈과 일', '역사와 현실', '개인적 성장']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # stress_moment: 스트레스 받는 순간만
    if field_name == 'stress_moment':
        # '스트레스 받는 순간' 또는 '💔' 이후부터
        if '스트레스 받는 순간' in text:
            parts = text.split('스트레스 받는 순간', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '💔' in text:
            parts = text.split('💔', 1)
            if len(parts) > 1:
                text = parts[1]
        
        # 다음 섹션 이전까지만
        for keyword in ['솔루션', '💡', '연애 가치관', '❤️', '최고의 연애 파트너', '💚', '최악의 갈등 상대', '소통의 벽', '돈과 일']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # solution: 솔루션만
    if field_name == 'solution':
        if '솔루션' in text:
            parts = text.split('솔루션', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '💡' in text:
            parts = text.split('💡', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['연애 가치관', '❤️', '최고의 연애 파트너', '💚', '최악의 갈등 상대', '소통의 벽', '돈과 일']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # love_value: 연애 가치관만
    if field_name == 'love_value':
        if '연애 가치관' in text:
            parts = text.split('연애 가치관', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '❤️' in text:
            parts = text.split('❤️', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['최고의 연애 파트너', '💚', '최악의 갈등 상대', '💔', '소통의 벽', '돈과 일', '역사와 현실', '개인적 성장', '추천 도서', '📚']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # best_partner: 최고의 파트너만
    if field_name == 'best_partner':
        if '최고의 연애 파트너' in text:
            parts = text.split('최고의 연애 파트너', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '💚' in text:
            parts = text.split('💚', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['최악의 갈등 상대', '💔', '소통의 벽', '돈과 일', '역사와 현실']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # worst_partner: 최악의 상대만
    if field_name == 'worst_partner':
        if '최악의 갈등 상대' in text:
            parts = text.split('최악의 갈등 상대', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '💔' in text and '최악' in text:
            parts = text.split('💔', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['소통의 벽', '돈과 일', '역사와 현실']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # communication_barrier: 소통의 벽만
    if field_name == 'communication_barrier':
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
        if '직업적 가치관' in text:
            parts = text.split('직업적 가치관', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '💼' in text:
            parts = text.split('💼', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['잠재적 재무 스타일', '💰', '역사와 현실', '개인적 성장']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # money_value: 재무 스타일만
    if field_name == 'money_value':
        if '잠재적 재무 스타일' in text:
            parts = text.split('잠재적 재무 스타일', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '💰' in text:
            parts = text.split('💰', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['역사와 현실', '개인적 성장', '추천 도서']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # growth_direction: 성장 방향성만 (추천 도서, 최종 목표 제거)
    if field_name == 'growth_direction':
        if '성장 방향성' in text:
            parts = text.split('성장 방향성', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '🌱' in text:
            parts = text.split('🌱', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['핵심 성장 과제', '🎯', '추천 도서', '📚', '추천 영상', '🎬', '성장의 최종 목표', '🏆']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # final_goal: 성장의 최종 목표만
    if field_name == 'final_goal':
        if '성장의 최종 목표' in text:
            parts = text.split('성장의 최종 목표', 1)
            if len(parts) > 1:
                text = parts[1]
        elif '🏆' in text:
            parts = text.split('🏆', 1)
            if len(parts) > 1:
                text = parts[1]
        
        return text.strip()
    
    # historical_avatar: 역사적 아바타만
    if field_name == 'historical_avatar':
        if '역사적 아바타' in text:
            parts = text.split('역사적 아바타', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['현실 속 아바타', '개인적 성장', '성장 방향성']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # real_avatar: 현실 속 아바타만
    if field_name == 'real_avatar':
        if '현실 속 아바타' in text:
            parts = text.split('현실 속 아바타', 1)
            if len(parts) > 1:
                text = parts[1]
        
        for keyword in ['개인적 성장', '성장 방향성', '핵심 성장 과제', '추천 도서']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    # recommended_content: 추천 영상/강의만
    if field_name == 'recommended_content':
        if '추천 영상' in text or '추천 강의' in text:
            if '추천 영상' in text:
                parts = text.split('추천 영상', 1)
                if len(parts) > 1:
                    text = parts[1]
            elif '🎬' in text:
                parts = text.split('🎬', 1)
                if len(parts) > 1:
                    text = parts[1]
        
        for keyword in ['성장의 최종 목표', '🏆']:
            if keyword in text:
                text = text.split(keyword)[0]
        
        return text.strip()
    
    return text

# 파일 읽기
with open('lib/political_details.ts', 'r', encoding='utf-8') as f:
    content = f.read()

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
        # 해당 유형의 필드 찾기
        pattern = rf'("{type_name}":\s*\{{[^}}]*?"{field_name}":\s*")(.*?)("\s*[,}}])'
        
        def replace_field(match):
            prefix = match.group(1)
            field_value = match.group(2)
            suffix = match.group(3)
            
            # 필드 내용 정리
            cleaned_value = clean_text_field(field_value, field_name)
            
            # 이스케이프 처리
            cleaned_value = cleaned_value.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
            
            return prefix + cleaned_value + suffix
        
        content = re.sub(pattern, replace_field, content, flags=re.DOTALL)

print("모든 필드 정리 완료")

# 파일 저장
with open('lib/political_details.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("파일 저장 완료")

