# API.md

## 문서 목적

이 문서는 PRZM의 초기 API 계약을 정의한다.

목적은 프론트엔드가 어떤 endpoint를 호출하고 어떤 응답을 기대하는지, 백엔드가 어떤 형식으로 데이터를 제공해야 하는지를 공통 언어로 정리하는 것이다.

초기 PRZM은 메인 지도 화면이 핵심이므로, API 역시 단순 리소스 나열보다 화면이 실제로 필요로 하는 데이터를 빠르게 공급할 수 있어야 한다. 동시에 상세 분석과 예측을 위해 리소스형 endpoint 확장도 가능해야 한다.

따라서 초기 API는 아래 두 가지를 함께 가진다.

- 메인 화면용 집계 endpoint
- 세부 분석용 리소스 endpoint

## API 설계 원칙

- 메인 지도 화면은 한 번의 호출로 필요한 핵심 데이터를 받을 수 있어야 한다.
- 지역, 질병, 연령 선택 상태는 query parameter로 표현할 수 있어야 한다.
- 응답은 프론트엔드가 바로 쓰기 쉬운 형태여야 하지만, 도메인 의미가 흐려지면 안 된다.
- 현재 관측 데이터와 예측 데이터는 같은 선택 컨텍스트를 공유해야 한다.
- 데이터 부족 상태는 오류가 아니라 정상 응답으로 표현할 수 있어야 한다.
- 초기 MVP는 인증 없는 read-only API를 전제로 한다.

## 공통 규칙

### Base Path

초기 기준 API base path는 아래를 가정한다.

```text
/api/v1
```

### Response Format

모든 정상 응답은 JSON을 사용한다.

### Naming Convention

외부 API 응답은 `snake_case`를 사용한다.

프론트엔드는 이 응답을 내부 `camelCase` 도메인 모델로 변환해 사용한다.

이 원칙은 현재 구현된 adapter 계층과 맞춘다.

### Common Filters

초기 PRZM에서 주요 endpoint는 아래 query parameter를 공통으로 가질 수 있다.

- `region_id`
- `disease_id`
- `age`
- `snapshot_id`

## 메인 집계 Endpoint

## 1. `GET /api/v1/dashboard`

### 목적

메인 지도 화면과 요약 카드, 상세 패널의 기본 상태를 한 번에 로드하기 위한 집계 endpoint다.

초기 MVP에서 가장 중요한 endpoint다.

### 사용 화면

- 메인 지도 화면
- 요약 카드
- 상세 패널 기본 상태

### Request

#### Query Parameters

- `region_id` optional
- `disease_id` optional
- `age` optional
- `snapshot_id` optional

### Example Request

```text
GET /api/v1/dashboard?region_id=31023&disease_id=flu-a&age=7
```

### Response Shape

```json
{
  "snapshot": {
    "snapshot_id": "snap-2026-04-05",
    "observed_until": "2026-04-05",
    "forecast_generated_at": "2026-04-05T08:00:00Z"
  },
  "observations": [
    {
      "observation_id": "obs-1",
      "region_id": "31023",
      "disease_id": "flu-a",
      "age": 7,
      "risk_level": "high",
      "trend_summary": "최근 7일 확산세 증가"
    }
  ],
  "forecasts": [
    {
      "forecast_id": "fc-1",
      "region_id": "31023",
      "disease_id": "flu-a",
      "age": 7,
      "week_direction": "increase",
      "month_direction": "steady",
      "confidence": "medium"
    }
  ],
  "top_diseases": [
    {
      "disease_id": "flu-a",
      "display_name": "독감 A형",
      "risk_level": "high"
    }
  ]
}
```

### Field Semantics

- `snapshot`
  현재 화면이 어떤 데이터 시점을 기준으로 하는지 설명한다.

- `observations`
  메인 화면과 요약 카드에서 바로 사용할 현재 관측값이다.

- `forecasts`
  현재 선택 컨텍스트에 대한 일주일/한달 예측이다.

- `top_diseases`
  사용자가 질병을 선택하지 않았을 때 우선 노출할 질병 목록이다.

### Notes

- 초기 MVP에서는 `dashboard` 하나로도 대부분의 홈 화면이 동작할 수 있다.
- 이후 상세 분석이 복잡해지면 세부 endpoint를 병행 사용한다.

## 세부 관측 Endpoint

## 2. `GET /api/v1/observations`

### 목적

특정 조건에 맞는 관측값 목록을 조회한다.

### 사용 화면

- 지도 레이어
- 요약 계산
- 상세 상태 일부

### Request

#### Query Parameters

- `region_id` optional
- `disease_id` optional
- `age` optional
- `date_from` optional
- `date_to` optional

### Example Request

```text
GET /api/v1/observations?region_id=31023&disease_id=flu-a&age=7&date_from=2026-03-01&date_to=2026-04-05
```

### Response Shape

```json
{
  "items": [
    {
      "observation_id": "obs-1",
      "region_id": "31023",
      "disease_id": "flu-a",
      "date": "2026-04-05",
      "age": 7,
      "risk_level": "high",
      "observation_score": 82,
      "trend_summary": "최근 7일 확산세 증가"
    }
  ]
}
```

### Field Semantics

- `date`
  해당 관측값이 속한 날짜

- `observation_score`
  내부 계산용 상대 점수. 사용자에게 직접 노출하지 않아도 된다.

- `risk_level`
  지도 색상 단계와 직접 연결되는 값

### Notes

- `dashboard`가 메인 화면용이라면, `observations`는 더 범용적인 조회 endpoint다.

## 3. `GET /api/v1/observations/breakdown`

### 목적

관측값의 연령/성별 분포를 조회한다.

### 사용 화면

- 상세 패널 분석 섹션

### Request

#### Query Parameters

- `region_id` required
- `disease_id` required
- `date_from` optional
- `date_to` optional

### Response Shape

```json
{
  "age_breakdown": [
    { "age": 5, "case_count": 12, "share_ratio": 0.14 },
    { "age": 6, "case_count": 19, "share_ratio": 0.22 },
    { "age": 7, "case_count": 28, "share_ratio": 0.32 }
  ],
  "gender_breakdown": [
    { "gender": "female", "case_count": 31, "share_ratio": 0.48 },
    { "gender": "male", "case_count": 34, "share_ratio": 0.52 }
  ]
}
```

### Notes

- 초기 MVP에서는 연령과 성별만 다룬다.
- 이후 다른 인구학 속성이 필요하면 확장할 수 있다.

## 세부 예측 Endpoint

## 4. `GET /api/v1/forecasts`

### 목적

특정 지역, 질병, 연령 기준의 예측 결과를 조회한다.

### 사용 화면

- 상세 패널 예측 섹션

### Request

#### Query Parameters

- `region_id` required
- `disease_id` required
- `age` optional

### Example Request

```text
GET /api/v1/forecasts?region_id=31023&disease_id=flu-a&age=7
```

### Response Shape

```json
{
  "items": [
    {
      "forecast_id": "fc-1",
      "region_id": "31023",
      "disease_id": "flu-a",
      "age": 7,
      "week_direction": "increase",
      "month_direction": "steady",
      "confidence": "medium",
      "summary": "일주일 기준으로는 증가 가능성이 높고, 한달 기준으로는 현재 수준 유지 가능성이 있음"
    }
  ]
}
```

### Field Semantics

- `week_direction`
  앞으로 일주일 방향성

- `month_direction`
  앞으로 한달 방향성

- `confidence`
  예측 신뢰 수준

- `summary`
  사용자에게 직접 노출 가능한 해석 문장

### Notes

- 초기 MVP는 방향 중심 결과가 핵심이다.
- 수치는 필요해도 보조 필드로만 추가하는 것이 적절하다.

## 지역 / 질병 메타 Endpoint

## 5. `GET /api/v1/regions`

### 목적

지원 지역 목록과 기본 메타 정보를 조회한다.

### 사용 화면

- 지역 선택 UI
- 지도 초기 범위 설정

### Response Shape

```json
{
  "items": [
    {
      "region_id": "11160",
      "name": "강서구",
      "province": "서울특별시"
    },
    {
      "region_id": "31023",
      "name": "성남시분당구",
      "province": "경기도"
    }
  ]
}
```

## 6. `GET /api/v1/diseases`

### 목적

지원 질병 목록을 조회한다.

### 사용 화면

- 질병 선택 UI
- 기본 주의 질병 목록

### Response Shape

```json
{
  "items": [
    { "disease_id": "flu-a", "display_name": "독감 A형", "is_active": true },
    { "disease_id": "rsv", "display_name": "RSV", "is_active": true }
  ]
}
```

## 오류 응답 규칙

모든 오류 응답은 아래 기본 형식을 따른다.

```json
{
  "error": {
    "code": "invalid_parameter",
    "message": "age must be between 0 and 13 for the current MVP scope"
  }
}
```

### 대표 오류 코드

- `invalid_parameter`
- `unsupported_region`
- `not_found`
- `internal_error`

### 원칙

- 데이터 부족은 가능하면 오류 대신 정상 응답의 빈 배열로 반환한다.
- 지원 범위 밖 지역은 `unsupported_region`으로 명확히 반환할 수 있다.

## 프론트엔드 매핑

현재 프론트엔드는 API 응답을 바로 UI에 연결하지 않고, adapter 계층에서 내부 도메인 모델로 변환한다.

현재 연결 기준:

- `DashboardResponse` → `normalizeDashboardPayload`
- `observation_id` → `id`
- `region_id` → `regionId`
- `disease_id` → `diseaseId`
- `risk_level` → `riskLevel`
- `trend_summary` → `trendSummary`
- `week_direction` → `weekDirection`
- `month_direction` → `monthDirection`

이 원칙은 프론트 내부 모델을 안정적으로 유지하는 데 중요하다.

## 초기 MVP 범위

초기 API는 아래 범위를 전제로 한다.

- 지역: 서울특별시, 경기도
- 연령: `0~13세`
- 질병: MVP에서 지원하는 주요 질병
- 예측: `1주`, `1개월`
- 인증: 없음
- 쓰기 기능: 없음

## 향후 확장

### 1. 캐시와 스냅샷 강화

- `snapshot_id` 기준으로 재현 가능한 조회 지원

### 2. 비교 API 추가

- 지역 비교
- 질병 비교
- 연령 비교

### 3. 설명성 강화

- 예측 근거 요약
- 위험도 계산 근거

### 4. 인증 및 권한

- 향후 전문가용 기능이 추가되면 별도 권한 체계 고려 가능

## 문서 간 관계

이 문서는 아래 문서와 직접 연결된다.

- [`DATA.md`](./DATA.md)
- [`PREDICTION.md`](./PREDICTION.md)
- [`APP-ARCHITECTURE.md`](./APP-ARCHITECTURE.md)
- [`TECH-STACK.md`](./TECH-STACK.md)

현재 프론트엔드 구현은 이 문서의 일부를 mock API 형태로 선반영한 상태다. 이후 실제 백엔드 구현 시 이 계약을 기준으로 맞추면 된다.
