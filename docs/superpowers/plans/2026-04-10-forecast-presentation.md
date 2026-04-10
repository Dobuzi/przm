# Forecast Presentation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 요약 카드와 상세 패널의 예측 섹션을 방향 중심, 해석 문장, 신뢰도, 빈 상태를 포함한 표현으로 구체화한다.

**Architecture:** 기존 `Forecast` 도메인 타입은 유지하고, 예측을 UI 친화적 문구와 상태로 변환하는 작은 presentation helper를 추가한다. `SummaryCard`와 `DetailPanel`은 이 helper 결과만 사용한다.

**Tech Stack:** TypeScript, Vitest, React

---

## Chunk 1: Forecast Presentation Model

### Task 1: failing test 작성

**Files:**
- Create: `src/shared/lib/forecastPresentation.test.ts`

- [ ] 예측 방향과 신뢰도를 표현 모델로 바꾸는 테스트를 먼저 작성한다.
- [ ] 예측 없음 상태를 위한 테스트도 작성한다.
- [ ] 테스트를 실행해 실패를 확인한다.

### Task 2: helper 구현

**Files:**
- Create: `src/shared/lib/forecastPresentation.ts`

- [ ] 최소 구현으로 테스트를 통과시킨다.
- [ ] 해석 문장, 라벨, 톤 값을 helper에서 만든다.

## Chunk 2: Widget Wiring

### Task 3: 요약 카드 반영

**Files:**
- Modify: `src/widgets/summary-card/SummaryCard.tsx`

- [ ] 요약 카드에서 helper 결과를 사용한다.
- [ ] `1주`, `1달`, 해석 문장을 더 명확하게 보여준다.
- [ ] 예측 없음 상태를 처리한다.

### Task 4: 상세 패널 반영

**Files:**
- Modify: `src/widgets/detail-panel/DetailPanel.tsx`

- [ ] 상세 패널의 예측 섹션을 개요 + 기간별 카드로 교체한다.
- [ ] 현재 위험과 연결된 한 줄 요약을 보여준다.
- [ ] 신뢰도 배지를 표시한다.

### Task 5: 검증

**Files:**
- Verify only

- [ ] 관련 테스트를 실행한다.
- [ ] `npm run build`를 실행한다.
