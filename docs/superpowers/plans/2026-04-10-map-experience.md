# Map Experience Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 메인 지도의 범례, 선택 상태, hover 반응, 하단 지역 카드 동기화를 개선해 지도 탐색 경험을 더 명확하게 만든다.

**Architecture:** 기존 지도 데이터 계약은 유지하고, hover/selection 상태를 UI 친화적으로 표현하는 작은 helper를 추가한다. `MapViewport`는 hover 지역 상태를 내부에서 관리하고, 범례와 지역 카드 모두 같은 presentation 결과를 사용한다.

**Tech Stack:** TypeScript, Vitest, React, Mapbox GL

---

## Chunk 1: Presentation Rules

### Task 1: failing test 작성

**Files:**
- Create: `src/features/map/lib/mapPresentation.test.ts`

- [ ] 지도 카드 상태와 범례 설명을 만드는 helper 테스트를 먼저 작성한다.
- [ ] hover와 selected 상태가 겹칠 때 우선순위를 테스트로 고정한다.
- [ ] 테스트를 실행해 실패를 확인한다.

### Task 2: helper 구현

**Files:**
- Create: `src/features/map/lib/mapPresentation.ts`

- [ ] 최소 구현으로 테스트를 통과시킨다.
- [ ] 카드 tone, 상태 라벨, 범례 설명을 helper에서 만든다.

## Chunk 2: Map Viewport Wiring

### Task 3: hover 상태 연결

**Files:**
- Modify: `src/features/map/MapViewport.tsx`

- [ ] hover된 지역을 별도 상태로 관리한다.
- [ ] 지도 hover와 하단 카드 hover를 동기화한다.
- [ ] 선택 상태와 hover 상태가 함께 보이도록 지도 레이어를 조정한다.

### Task 4: 범례와 카드 UI 개선

**Files:**
- Modify: `src/features/map/MapViewport.tsx`

- [ ] 범례를 `위험도 / 선택 상태 / 질병 포커스` 설명 카드로 교체한다.
- [ ] 하단 지역 카드에 상태 배지와 hover/선택 시각 차이를 추가한다.

### Task 5: 검증

**Files:**
- Verify only

- [ ] 관련 테스트를 실행한다.
- [ ] `npm run build`를 실행한다.
