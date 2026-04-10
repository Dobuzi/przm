# Detail Panel Breakdown Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 상세 패널의 placeholder 분석 섹션을 실제 mock breakdown 데이터 기반 UI로 교체한다.

**Architecture:** 기존 `mockApi -> adapters -> query hook -> widget` 흐름을 유지한다. 새 `breakdown` 응답 계약을 추가하고, 상세 패널은 이 데이터를 간단한 카드와 바 리스트로 표시한다.

**Tech Stack:** TypeScript, Vitest, React, TanStack Query

---

## Chunk 1: Breakdown Contract

### Task 1: 타입과 테스트 추가

**Files:**
- Modify: `src/shared/api/types.ts`
- Modify: `src/shared/api/mockApi.test.ts`
- Modify: `src/shared/api/adapters.test.ts`

- [ ] `breakdown` 응답 타입을 추가한다.
- [ ] failing test를 먼저 작성한다.
- [ ] 테스트를 실행해 실패를 확인한다.

### Task 2: mock API와 adapter 구현

**Files:**
- Modify: `src/shared/api/mockApi.ts`
- Modify: `src/shared/api/adapters.ts`

- [ ] 최소 mock breakdown 데이터를 반환한다.
- [ ] adapter에서 UI 친화적 구조로 변환한다.
- [ ] 테스트를 다시 실행해 통과시킨다.

## Chunk 2: Detail Panel Wiring

### Task 3: hook과 상세 패널 연결

**Files:**
- Create: `src/shared/api/useObservationBreakdown.ts`
- Modify: `src/widgets/detail-panel/DetailPanel.tsx`

- [ ] breakdown query hook을 추가한다.
- [ ] 상세 패널 placeholder를 실제 breakdown 카드로 교체한다.
- [ ] 빈 상태를 처리한다.

### Task 4: 검증

**Files:**
- Verify only

- [ ] 관련 Vitest 테스트를 실행한다.
- [ ] `npm run build`를 실행한다.
