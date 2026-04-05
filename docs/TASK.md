# TASK.md

## 목적

이 문서는 PRZM 프로젝트에서 지금까지 수행한 작업과 앞으로 수행해야 할 작업을 한 곳에서 추적하기 위한 작업 정리 문서입니다.

- 완료된 작업은 현재 기준으로 이미 문서화되었거나 구현/검증까지 끝난 항목입니다.
- 다음 작업은 제품 문서, 현재 코드베이스, 그리고 MVP 우선순위를 기준으로 정리합니다.
- 이 문서는 세부 이슈 트래커가 아니라, 현재 프로젝트 레벨의 실행 체크리스트입니다.

## 완료된 작업

### 제품 정의와 경험 설계

- `GOAL.md` 작성
- `PRODUCT.md` 작성
- `FEATURES.md` 작성
- `IA.md` 작성
- `USER-FLOWS.md` 작성
- `SCREENS.md` 작성
- `DATA.md` 작성
- `PREDICTION.md` 작성
- `UI.md` 작성
- `WIREFRAMES.md` 작성
- `COMPONENTS.md` 작성

### 기술/구현 설계

- 문서를 `docs/` 폴더로 정리
- `README.md` 작성 및 문서 인덱스 구성
- `APP-ARCHITECTURE.md` 작성
- `TECH-STACK.md` 작성
- `API.md` 작성

### 프론트엔드 초기 구현

- React + Vite + TypeScript 기반 scaffold 구성
- Tailwind CSS, React Router, Zustand, TanStack Query 기본 설정
- 메인 홈 화면 골격 구현
- 선택 컨텍스트 store 구현
- 상단 제어 바, 요약 카드, 상세 패널 placeholder 구현
- Mapbox 기반 지도 뷰포트 구현
- 서울/경기 시군구 GeoJSON 연결
- 지역 선택 시 지도 강조 및 `flyTo` 동작 구현
- 위험도 색상 레이어와 선택 상태 반영
- mock API 레이어 구현
- `dashboard`, `observations`, `forecasts`, `regions`, `diseases` 단위 mock endpoint 함수 분리
- API record를 도메인 타입으로 변환하는 adapter 계층 정리
- endpoint 단위 query hook 분리 (`useRegions`, `useDiseases`, `useObservations`, `useForecasts`)

### 검증 완료 항목

- `mapModel` 테스트 작성 및 통과
- `mockApi` 테스트 작성 및 통과
- `adapters` 테스트 작성 및 통과
- `npm run build` 통과

## 현재 상태

현재 PRZM은 아래 수준까지 올라와 있습니다.

- 제품과 UX 방향 문서가 1차 정리된 상태
- 메인 지도 중심 MVP 프론트엔드 scaffold가 구현된 상태
- 실제 서울/경기 시군구 경계가 지도에 반영된 상태
- 지역/질병/연령 선택에 따라 mock API 결과가 바뀌는 상태
- 요약 카드, 상세 패널, 지도 레이어가 선택 상태와 연결된 상태

아직 아래는 placeholder 또는 mock 기반입니다.

- 상세 분석 내용
- 예측 상세 표현
- 실제 백엔드 API 연결
- 실제 질병 데이터 수집/가공 파이프라인

## 다음 우선순위 작업

### 1. 상세 패널의 실제 데이터 흐름 강화

- `breakdown` 성격의 mock endpoint 추가
- 연령 분포, 성별 분포, 최근 기간 추세 데이터 구조 정의
- 상세 패널 placeholder를 실제 데이터 카드/차트로 교체

### 2. 예측 섹션 구체화

- `1주`, `1개월` 방향 예측을 더 명확한 UI로 표현
- 신뢰도 표현 방식 정리
- 지역/질병/연령 조합에 따른 예측 빈 상태 처리

### 3. 지도 경험 개선

- 지도 범례와 선택 상태 설명 강화
- 지도 hover 상태와 선택 상태의 시각 차이 보강
- 지도 위 요약 정보와 상세 패널 간 전환 다듬기

### 4. 실제 API 연결 준비

- `API.md` 기준으로 프론트엔드 fetch 계층 정리
- 현재 `mockApi.ts`와 동일한 인터페이스를 실제 API 클라이언트로 교체할 수 있게 구조 고정
- 에러 상태, 재시도, 빈 결과 처리 규칙 정리

### 5. 로컬 개발 경험 정리

- `README.md` 실행 가이드 보강
- `.env.local` 설정 예시 명확화
- 개발용 샘플 상태를 쉽게 재현할 수 있는 방식 정리

## 후속 작업

### 데이터와 제품 확장

- 서울/경기 외 전국 확장
- `0~13세` 외 연령 확장
- 성별 외 추가 인구 특성 확장
- 질병 종류 확대

### 시각화 확장

- 상세 분석 차트 추가
- 지역 간 비교 보기
- 질병 간 비교 보기
- 시간 축 기반 추세 탐색 강화

### 제품 기능 확장

- 즐겨찾기 지역
- 알림 기능
- 공유 가능한 지역 상태 링크
- 설명형 마이크로카피 개선

## 작업 원칙

- 문서에서 합의한 MVP 범위를 먼저 완성한다.
- 실제 API 연결 전까지는 mock 계층과 adapter 계층을 유지해 UI 구조를 고정한다.
- 지도는 계속 핵심 인터페이스로 유지하고, 상세 화면은 보조 레이어로 발전시킨다.
- 새 작업은 가능하면 `docs/API.md`, `docs/APP-ARCHITECTURE.md`, `docs/FEATURES.md`와 정합성을 유지한다.
