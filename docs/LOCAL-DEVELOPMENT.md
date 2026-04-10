# LOCAL-DEVELOPMENT.md

## 목적

이 문서는 PRZM 프론트엔드의 로컬 개발 실행 방법과 환경 변수 사용 방식을 정리한다.

현재 PRZM은 `mock API`와 `real API`를 전환할 수 있는 구조를 가지고 있다. 기본값은 `mock`이며, 별도 백엔드 없이도 화면을 개발할 수 있다.

## 기본 실행 순서

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 환경 변수

### 1. `VITE_MAPBOX_TOKEN`

Mapbox 지도 렌더링에 사용하는 public token이다.

- 값이 있으면 실제 Mapbox 지도가 렌더링된다.
- 값이 없으면 fallback 지도 상태로 동작한다.

### 2. `VITE_API_MODE`

프론트엔드가 어떤 API client를 사용할지 결정한다.

- `mock`
  내장 mock API를 사용한다.
- `real`
  실제 HTTP API를 호출한다.

기본값은 `mock`이다.

### 3. `VITE_API_BASE_URL`

실제 API를 호출할 때 사용할 base URL이다.

예시:

```text
http://localhost:4000/api/v1
```

`mock` 모드에서는 이 값이 없어도 된다.

## 권장 개발 모드

### UI 개발

가장 먼저 권장하는 방식은 아래와 같다.

```env
VITE_API_MODE=mock
```

이 상태에서는 아래가 가능하다.

- 지도 UI 개발
- 요약 카드 / 상세 패널 개발
- 예측 표현 개발
- mock 데이터 기반 흐름 확인

### 실제 API 연동 점검

백엔드가 준비된 경우에는 아래처럼 바꾼다.

```env
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

이 상태에서 프론트엔드는 기존 hooks를 그대로 유지한 채 실제 endpoint를 호출한다.

## 현재 API 전환 구조

PRZM은 아래 구조로 API를 호출한다.

```text
hook -> apiClient -> mock client or real HTTP client
```

즉, UI 레이어는 `mockApi.ts`를 직접 보지 않고 `apiClient`만 사용한다.

현재 연결된 endpoint는 아래와 같다.

- `regions`
- `diseases`
- `observations`
- `forecasts`
- `observations/breakdown`
- `dashboard`

## 샘플 상태 재현

현재 mock 데이터에서 가장 많이 쓰는 샘플 조합은 아래다.

- 지역: `31023` (`성남시 분당구`)
- 질병: `flu-a`
- 연령: `7세`

이 조합에서 아래를 바로 확인할 수 있다.

- 위험도 `높음`
- 최근 추세 증가
- 상세 분석 breakdown
- 1주/1달 예측

## 검증 명령

```bash
npm run test -- src/shared/api/client.test.ts src/shared/api/mockApi.test.ts src/shared/api/adapters.test.ts src/shared/lib/forecastPresentation.test.ts src/features/map/lib/mapPresentation.test.ts src/features/map/lib/mapModel.test.ts
npm run build
```

## 현재 제한

- `real` 모드용 API는 아직 실제 서버와 연결 검증을 완료한 상태는 아니다.
- 인증, 에러 코드 세분화, 재시도 전략은 이후 API 연결 단계에서 더 구체화해야 한다.
- mock 데이터는 현재 서울/경기 일부 샘플 조합 중심이다.
