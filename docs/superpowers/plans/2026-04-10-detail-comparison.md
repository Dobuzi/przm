# Detail Comparison Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 상세 패널 안에서 현재 기준과 비교 대상 1개를 비교할 수 있는 첫 비교 기능을 추가한다.

**Architecture:** 메인 선택 흐름은 유지하고, 별도 comparison store로 `region` 또는 `disease` 비교 대상 1개만 관리한다. 기존 API/hook 구조를 재사용하기 위해 observation/forecast/breakdown hooks에 optional filter override를 추가하고, DetailPanel은 현재 기준과 비교 기준을 나란히 렌더링한다.

**Tech Stack:** TypeScript, Vitest, React, Zustand, React Query

---

## Chunk 1: Comparison Rules

### Task 1: failing test 작성

**Files:**
- Create: `src/widgets/detail-panel/comparisonPresentation.test.ts`

- [ ] 비교 카드 제목과 요약 문장을 만드는 helper 테스트를 먼저 작성한다.
- [ ] 지역 비교와 질병 비교를 모두 테스트한다.
- [ ] 테스트를 실행해 실패를 확인한다.

### Task 2: helper 구현

**Files:**
- Create: `src/widgets/detail-panel/comparisonPresentation.ts`

- [ ] 최소 구현으로 테스트를 통과시킨다.

## Chunk 2: Comparison Wiring

### Task 3: 상태와 data hook 연결

**Files:**
- Create: `src/features/comparison/store.ts`
- Modify: `src/shared/api/useObservations.ts`
- Modify: `src/shared/api/useForecasts.ts`
- Modify: `src/shared/api/useObservationBreakdown.ts`

- [ ] 비교 모드와 비교 대상 1개를 관리하는 store를 추가한다.
- [ ] hooks가 optional filter override를 받을 수 있게 수정한다.

### Task 4: mock data와 DetailPanel UI 구현

**Files:**
- Modify: `src/shared/constants/mockData.ts`
- Modify: `src/widgets/detail-panel/DetailPanel.tsx`

- [ ] 비교 가능한 mock 조합을 추가한다.
- [ ] DetailPanel에 비교 모드 선택과 비교 대상 선택 UI를 추가한다.
- [ ] 현재 기준 vs 비교 기준의 위험, 추세 요약, 예측을 나란히 보여준다.

### Task 5: 문서와 검증

**Files:**
- Modify: `docs/TASK.md`

- [ ] 완료 상태를 TASK에 반영한다.
- [ ] 관련 테스트와 `npm run build`를 실행한다.
