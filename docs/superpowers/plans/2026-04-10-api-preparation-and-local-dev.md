# API Preparation And Local Dev Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 실제 API 연결 전환점을 만들고, 로컬 개발 실행 방법과 환경 변수 설정을 문서화하며, TASK 상태를 갱신한다.

**Architecture:** 기존 `mockApi` 함수는 유지하고, 그 위에 `mock/real` 모드를 전환할 수 있는 API client 계층을 추가한다. hooks는 더 이상 `mockApi`를 직접 보지 않고 `apiClient`를 사용한다. 로컬 개발 문서는 `.env` 기준과 API mode 전환 방법을 설명한다.

**Tech Stack:** TypeScript, Vitest, React Query, Vite env

---

## Chunk 1: API Client Boundary

### Task 1: failing test 작성

**Files:**
- Create: `src/shared/api/client.test.ts`

- [ ] mock 모드가 mock client를 사용하는 테스트를 작성한다.
- [ ] real 모드가 올바른 URL과 query string으로 요청하는 테스트를 작성한다.
- [ ] 테스트를 실행해 실패를 확인한다.

### Task 2: client 구현

**Files:**
- Create: `src/shared/api/client.ts`
- Modify: `src/shared/config/env.ts`
- Modify: `src/shared/api/useRegions.ts`
- Modify: `src/shared/api/useDiseases.ts`
- Modify: `src/shared/api/useObservations.ts`
- Modify: `src/shared/api/useForecasts.ts`
- Modify: `src/shared/api/useObservationBreakdown.ts`
- Modify: `src/shared/api/useDashboardData.ts`

- [ ] mock/real 전환 가능한 client를 구현한다.
- [ ] hooks를 새 client 계층으로 연결한다.
- [ ] 기존 mockApi 직접 import를 제거한다.

## Chunk 2: Local Dev Docs And Task Sync

### Task 3: 로컬 개발 문서 정리

**Files:**
- Modify: `.env.example`
- Modify: `README.md`
- Add or Modify: `docs/LOCAL-DEVELOPMENT.md`

- [ ] Mapbox와 API mode 설정 방법을 문서화한다.
- [ ] mock mode와 real mode 차이를 명확히 적는다.
- [ ] 실행 순서를 README에서 바로 찾을 수 있게 정리한다.

### Task 4: TASK 문서 갱신

**Files:**
- Modify: `docs/TASK.md`

- [ ] 완료된 작업을 반영한다.
- [ ] 다음 우선순위를 현재 상태에 맞게 갱신한다.

### Task 5: 검증

**Files:**
- Verify only

- [ ] 관련 테스트를 실행한다.
- [ ] `npm run build`를 실행한다.
