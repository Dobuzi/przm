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
- `DATA-PIPELINE.md` 작성
- `SCHEMA.md` 작성
- `INGESTION.md` 작성
- `SNAPSHOTS.md` 작성
- `FORECAST-PIPELINE.md` 작성
- `SOURCE-MAPPINGS.md` 작성
- `OPERATIONS.md` 작성
- mock ingestion runner scaffold 추가
- sample source adapter / normalization / quarantine 분리 구현

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
- `observations/breakdown` mock endpoint 추가 및 상세 패널 연동
- 예측 표현 helper 추가 및 요약 카드/상세 패널 예측 섹션 구체화
- 지도 범례, hover 상태, 선택/포커스 상태 표현 개선
- mock/real 전환 가능한 API client 계층 추가
- 상세 패널 추세/분포 시각화 강화
- 상세 패널 보조 비교 기능 추가 (`지역 비교`, `질병 비교`)
- 로컬 개발 문서 및 환경 변수 정리

### 검증 완료 항목

- `mapModel` 테스트 작성 및 통과
- `mockApi` 테스트 작성 및 통과
- `adapters` 테스트 작성 및 통과
- `forecastPresentation` 테스트 작성 및 통과
- `mapPresentation` 테스트 작성 및 통과
- `api client` 테스트 작성 및 통과
- `comparisonPresentation` 테스트 작성 및 통과
- `npm run build` 통과

## 현재 상태

현재 PRZM은 아래 수준까지 올라와 있습니다.

- 제품과 UX 방향 문서가 1차 정리된 상태
- 메인 지도 중심 MVP 프론트엔드 scaffold가 구현된 상태
- 실제 서울/경기 시군구 경계가 지도에 반영된 상태
- 지역/질병/연령 선택에 따라 mock API 결과가 바뀌는 상태
- mock/real API 전환 지점이 정리된 상태
- 요약 카드, 상세 패널, 지도 레이어가 선택 상태와 연결된 상태
- 샘플 source fixture를 처리하는 mock ingestion runner가 동작하는 상태

아직 아래는 placeholder 또는 mock 기반입니다.

- 실제 백엔드 API 연결
- 실제 질병 데이터 수집/가공 파이프라인
- 실제 source adapter 구현
- 비교 기능의 지도 연동 확장

## 다음 우선순위 작업

### 1. 실제 API 연결 검증

- `VITE_API_MODE=real` 기준으로 실제 서버와 endpoint 연결 점검
- 응답 누락, 상태 코드, 네트워크 오류 처리 확인
- 필요 시 endpoint별 adapter 보정

### 2. 상세 분석 시각화 강화

- 데이터 부족 상태의 표현 품질 향상
- 필요 시 정식 차트 라이브러리 도입 여부 검토

### 3. 실제 데이터 파이프라인 준비

- `SCHEMA.md` 기준으로 저장 구조 확정
- `DATA-PIPELINE.md` 기준으로 세부 구현 문서 분해
- `INGESTION.md` 기준으로 수집/정규화 배치 순서 구체화
- `SNAPSHOTS.md` 기준으로 publish gate와 rollback 규칙 구체화
- `FORECAST-PIPELINE.md` 기준으로 forecast input / validation / snapshot 연결 규칙 구체화
- `SOURCE-MAPPINGS.md` 기준으로 region / disease alias와 review 규칙 구체화
- `OPERATIONS.md` 기준으로 일일 운영, health check, 재처리, rollback 기준 구체화
- 실제 관측 데이터 소스 최종 선정
- 실제 source adapter 추가
- snapshot 발행 규칙과 failure handling 구체화

### 4. 비교 기능 확장

- 상세 패널 비교를 지도 레이어와 더 자연스럽게 연결
- 필요 시 연령 비교까지 확장 여부 검토

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
- 데이터 파이프라인 작업은 `docs/DATA-PIPELINE.md`, `docs/SCHEMA.md`, `docs/INGESTION.md`, `docs/SNAPSHOTS.md`, `docs/FORECAST-PIPELINE.md`, `docs/SOURCE-MAPPINGS.md`, `docs/OPERATIONS.md`를 함께 기준으로 삼는다.
