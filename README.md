# PRZM

PRZM은 한국어 "퍼짐"의 발음을 바탕으로 만든 이름으로, 지역에 퍼지는 질병의 확산을 지도 중심으로 모니터링하고 해석하며 예측하는 웹 앱입니다.

초기 제품은 서울특별시와 경기도의 어린이 `0~13세`를 `1세 단위`로 모니터링하는 데 집중합니다. 사용자가 가장 먼저 답받아야 하는 질문은 아래와 같습니다.

> 우리 동네에서 지금 어떤 질병이 우리 아이 연령대에 퍼지고 있나?

## Current Scope

- 지역: 서울특별시, 경기도
- 연령: `0~13세`
- 경험 중심: 지도 기반 위험 확인
- 분석 범위: 확산 영역, 확산 속도, 연령/성별 분포
- 예측 범위: 앞으로 `1주`, `1개월` 방향성 예측

## Product Direction

- 지도는 보조 수단이 아니라 핵심 인터페이스입니다.
- 사용자는 먼저 현재 위험을 보고, 필요할 때 상세 분석과 예측으로 들어갑니다.
- 예측은 수치 나열보다 `증가 / 정체 / 감소` 같은 방향 해석을 우선합니다.
- 초기에는 좁은 범위를 깊게 풀고, 이후 전국/전 연령으로 확장합니다.

## Documentation

프로젝트 문서는 [`docs/`](./docs) 아래에 정리되어 있습니다.

### Core Docs

- [`docs/GOAL.md`](./docs/GOAL.md): PRZM의 목적, 지향점, 초기 범위
- [`docs/PRODUCT.md`](./docs/PRODUCT.md): 목표 사용자, 핵심 질문, 제품 구조
- [`docs/FEATURES.md`](./docs/FEATURES.md): MVP 기능 범위와 출시 기준

### Experience Docs

- [`docs/IA.md`](./docs/IA.md): 정보 구조
- [`docs/USER-FLOWS.md`](./docs/USER-FLOWS.md): 핵심 사용자 흐름
- [`docs/SCREENS.md`](./docs/SCREENS.md): 상태 기반 화면 정의
- [`docs/UI.md`](./docs/UI.md): UI 원칙과 시각 방향
- [`docs/WIREFRAMES.md`](./docs/WIREFRAMES.md): 저해상도 와이어프레임
- [`docs/COMPONENTS.md`](./docs/COMPONENTS.md): 주요 UI 컴포넌트 정의

### Data Docs

- [`docs/DATA.md`](./docs/DATA.md): 핵심 데이터 개체와 필드 초안
- [`docs/DATA-PIPELINE.md`](./docs/DATA-PIPELINE.md): 실제 데이터 수집, 집계, snapshot, API 발행 흐름
- [`docs/SCHEMA.md`](./docs/SCHEMA.md): 실제 저장 단위 기준의 스키마 초안
- [`docs/INGESTION.md`](./docs/INGESTION.md): 원천 수집, 정규화, 매핑, quarantine, normalized 적재 흐름
- [`docs/SNAPSHOTS.md`](./docs/SNAPSHOTS.md): draft, published, superseded, failed 기준의 snapshot 발행 규칙
- [`docs/FORECAST-PIPELINE.md`](./docs/FORECAST-PIPELINE.md): forecast 입력, 생성, validation, snapshot 연결 흐름
- [`docs/SOURCE-MAPPINGS.md`](./docs/SOURCE-MAPPINGS.md): 원천 지역명/질병명 alias, confidence, review, quarantine 규칙
- [`docs/OPERATIONS.md`](./docs/OPERATIONS.md): 일일 배치 운영, health check, 재처리, rollback 기준
- [`docs/PREDICTION.md`](./docs/PREDICTION.md): 예측 기능 구조와 사용자 노출 방식

### Implementation Docs

- [`docs/APP-ARCHITECTURE.md`](./docs/APP-ARCHITECTURE.md): 라우트, 기능 모듈, 상태, 데이터 흐름 구조
- [`docs/TECH-STACK.md`](./docs/TECH-STACK.md): 초기 프론트엔드 기술 스택과 선택 이유
- [`docs/API.md`](./docs/API.md): 프론트엔드와 백엔드 사이의 초기 API 계약
- [`docs/LOCAL-DEVELOPMENT.md`](./docs/LOCAL-DEVELOPMENT.md): 로컬 실행, 환경 변수, mock/real API 전환 방법
- [`docs/TASK.md`](./docs/TASK.md): 지금까지 수행한 작업과 앞으로의 우선순위 작업 정리
- [`docs/superpowers/plans/2026-04-05-initial-scaffold.md`](./docs/superpowers/plans/2026-04-05-initial-scaffold.md): 초기 scaffold 구현 계획

## Current Status

현재는 제품 정의 문서, 지도 중심 MVP UI, mock/real 전환 가능한 API client 계층, mock ingestion runner, 그리고 draft snapshot candidate를 만드는 mock analytics runner까지 정리된 상태입니다. 테스트와 production build 검증까지 완료했습니다.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
npm run ingest:mock
npm run analytics:mock
```

기본값은 `mock` API 모드입니다. `VITE_MAPBOX_TOKEN`을 설정하면 실제 Mapbox 지도가 렌더링됩니다. `VITE_API_MODE=real`과 `VITE_API_BASE_URL`을 설정하면 실제 HTTP API를 호출할 수 있습니다.

`npm run ingest:mock`은 샘플 source fixture를 읽어 `tmp/ingestion/mock-ingestion-output.json`에 normalized / quarantined 결과와 summary를 생성합니다.

`npm run analytics:mock`은 ingestion 결과를 바탕으로 `tmp/analytics/mock-snapshot-candidate.json`에 draft snapshot candidate, observation, forecast, breakdown 결과를 생성하고, 프론트 mock API용 fixture를 `src/shared/constants/generated/mockSnapshotCandidate.generated.ts`에 갱신합니다.

실제 HTTP JSON 소스를 시험할 때는 `PRZM_SOURCE_URL`을 지정한 뒤 `npm run ingest:http`를 실행합니다. 한국어 공공데이터형 필드는 `PRZM_SOURCE_FORMAT=korean-public-health`로 PRZM ingestion field에 매핑할 수 있고, 공공데이터포털의 `response.body.items.item` 형태도 읽습니다. 질병관리청 온열질환 감시 데이터 형태는 `PRZM_SOURCE_PRESET=kdca-heat-illness`로 시작할 수 있습니다. 자세한 입력 shape는 [`docs/LOCAL-DEVELOPMENT.md`](./docs/LOCAL-DEVELOPMENT.md)에 정리되어 있습니다.

자세한 로컬 개발 방법은 [`docs/LOCAL-DEVELOPMENT.md`](./docs/LOCAL-DEVELOPMENT.md) 에 정리되어 있습니다.

다음으로 자연스러운 작업은 아래 중 하나입니다.

1. 실제 `real` API 서버와 연결 검증
2. 실제 소스별 field mapper 추가와 ingestion / analytics runner 확장
3. pipeline-derived breakdown coverage 확대
