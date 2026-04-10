# Detail Panel Breakdown Design

## Goal

상세 패널의 placeholder 분석 섹션을 실제 mock breakdown 데이터 기반 UI로 교체한다.

## Scope

- 현재 선택된 `regionId`, `diseaseId`, `age` 조합에 대한 상세 breakdown 데이터만 다룬다.
- 데이터 범위는 `recentTrend`, `ageDistribution`, `genderDistribution`으로 제한한다.
- 시각화는 텍스트와 간단한 막대형 리스트로 표현한다.
- 차트 라이브러리 추가, 실제 API 연결, 고급 비교 기능은 이번 범위에서 제외한다.

## API Shape

초기 mock endpoint는 `observations/breakdown`에 해당하는 응답을 제공한다.

- `summary`: 현재 상태 설명
- `recent_trend`: 최근 4주 시계열
- `age_distribution`: 연령 분포
- `gender_distribution`: 성별 분포

## UI Design

상세 패널은 아래 순서로 구성한다.

1. 현재 상태 요약
2. 최근 4주 추세
3. 연령 분포
4. 성별 분포
5. 예측 섹션

데이터가 없을 때는 오류가 아니라 빈 상태 문구를 보여준다.

## Implementation Notes

- `mockApi`에 breakdown endpoint를 추가한다.
- `api/types`와 `api/adapters`에 breakdown 계약과 변환 로직을 추가한다.
- 상세 패널은 query hook을 통해 breakdown 데이터를 가져온다.
- 테스트는 `mockApi`와 `adapters`에서 먼저 고정한다.
