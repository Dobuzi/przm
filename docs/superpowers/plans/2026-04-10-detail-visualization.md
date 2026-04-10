# Detail Visualization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 상세 패널의 최근 추세, 연령 분포, 성별 분포를 더 시각적으로 읽기 쉽게 개선한다.

**Architecture:** 기존 breakdown 데이터 계약은 유지하고, 시각화용 presentation helper를 추가해 `DetailPanel`이 계산보다 렌더링에 집중하도록 만든다.

**Tech Stack:** TypeScript, Vitest, React

---

## Chunk 1: Visualization Presentation

### Task 1: failing test 작성

**Files:**
- Create: `src/widgets/detail-panel/detailPanelPresentation.test.ts`

- [ ] 추세 막대 높이 계산과 선택 연령 강조 규칙을 테스트로 먼저 고정한다.
- [ ] 성별 분포 비율 계산 테스트를 작성한다.
- [ ] 테스트를 실행해 실패를 확인한다.

### Task 2: helper 구현

**Files:**
- Create: `src/widgets/detail-panel/detailPanelPresentation.ts`

- [ ] 최소 구현으로 테스트를 통과시킨다.
- [ ] 추세, 연령 분포, 성별 분포의 시각 표현용 값을 만든다.

## Chunk 2: Detail Panel Wiring

### Task 3: DetailPanel UI 강화

**Files:**
- Modify: `src/widgets/detail-panel/DetailPanel.tsx`

- [ ] 최근 4주 추세를 미니 바 차트 형태로 바꾼다.
- [ ] 연령 분포에서 현재 선택 연령을 강조한다.
- [ ] 성별 분포에 비율을 추가한다.

### Task 4: TASK 문서 보정과 검증

**Files:**
- Modify: `docs/TASK.md`

- [ ] 현재 우선순위 문구를 실제 상태에 맞게 보정한다.
- [ ] 관련 테스트와 `npm run build`를 실행한다.
