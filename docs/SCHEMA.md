# SCHEMA.md

## 문서 목적

이 문서는 PRZM의 실제 저장 스키마 초안을 정의한다.

목적은 특정 DBMS 문법을 확정하는 것이 아니라, `DATA.md`와 `DATA-PIPELINE.md`에서 정의한 개념을 실제 저장 단위와 테이블 책임으로 내리는 것이다.

초기 PRZM은 `서울/경기`, `0~13세`, `일 단위 집계`, `snapshot 기반 API`를 중심으로 동작하므로, 스키마도 이 범위를 빠르고 안정적으로 지원하는 구조를 우선한다.

## 스키마 설계 원칙

- 원천 수집 데이터와 제품 제공 데이터를 분리한다.
- `질병 × 지역 × 날짜` 관측 집계를 중심 테이블로 둔다.
- breakdown과 forecast는 observation 또는 snapshot에 연결되는 파생 데이터로 다룬다.
- API가 읽는 데이터는 항상 `snapshot_id` 기준으로 재현 가능해야 한다.
- 초기 스키마는 읽기 최적화와 단순성을 우선한다.

## 스키마 층위

초기 PRZM 스키마는 아래 4개 층위로 나눈다.

1. `raw`
원천 수집 데이터를 최대한 보존하는 영역

2. `normalized`
PRZM 내부 ID 체계로 정규화된 영역

3. `analytics`
관측 집계, breakdown, 예측을 담는 제품 데이터 영역

4. `serving`
snapshot 기준 API 제공을 위한 읽기 중심 영역

## 공통 메타 테이블

## 1. `diseases`

### 역할

지원 질병 메타 정의

### 주요 필드

- `disease_id` PK
- `slug` unique
- `display_name`
- `category`
- `is_active`
- `created_at`
- `updated_at`

## 2. `regions`

### 역할

지원 지역 메타 정의

### 주요 필드

- `region_id` PK
- `name`
- `province_name`
- `region_type`
- `parent_region_id` nullable
- `center_lat`
- `center_lng`
- `boundary_ref`
- `is_supported`
- `created_at`
- `updated_at`

## 3. `snapshots`

### 역할

관측/예측 배포 단위 정의

### 주요 필드

- `snapshot_id` PK
- `label`
- `observed_until`
- `published_at`
- `forecast_generated_at`
- `source_note`
- `status`
- `created_at`

### 상태 예시

- `draft`
- `published`
- `superseded`
- `failed`

## Raw 층위

## 4. `raw_observations`

### 역할

원천 소스에서 수집한 관측 레코드 보관

### 주요 필드

- `raw_observation_id` PK
- `source_name`
- `source_record_id`
- `source_payload` JSON
- `reported_date`
- `region_label`
- `disease_label`
- `age_raw`
- `gender_raw`
- `case_count_raw`
- `ingested_at`

### 인덱스

- `source_name`, `source_record_id`
- `reported_date`

## 5. `raw_region_mappings`

### 역할

원천 지역명과 내부 `region_id` 매핑 기록

### 주요 필드

- `mapping_id` PK
- `source_name`
- `source_region_label`
- `region_id`
- `confidence_level`
- `review_status`
- `created_at`

## 6. `raw_disease_mappings`

### 역할

원천 질병명과 내부 `disease_id` 매핑 기록

### 주요 필드

- `mapping_id` PK
- `source_name`
- `source_disease_label`
- `disease_id`
- `confidence_level`
- `review_status`
- `created_at`

## Normalized 층위

## 7. `normalized_observations`

### 역할

원천 레코드를 내부 ID 기준으로 정규화한 중간 테이블

### 주요 필드

- `normalized_observation_id` PK
- `raw_observation_id` FK -> `raw_observations`
- `source_name`
- `date`
- `region_id` FK -> `regions`
- `disease_id` FK -> `diseases`
- `age` nullable
- `gender` nullable
- `case_count`
- `ingested_at`
- `is_quarantined`
- `quarantine_reason` nullable

### 인덱스

- `date`
- `region_id`, `disease_id`, `date`
- `age`

## Analytics 층위

## 8. `disease_observations`

### 역할

PRZM의 중심 observation 집계 테이블

### 집계 단위

- `snapshot_id`
- `disease_id`
- `region_id`
- `date`

### 주요 필드

- `observation_id` PK
- `snapshot_id` FK -> `snapshots`
- `disease_id` FK -> `diseases`
- `region_id` FK -> `regions`
- `date`
- `case_count`
- `observation_score`
- `risk_level`
- `trend_direction`
- `trend_delta`
- `source_count`
- `confidence_level`
- `trend_summary`
- `created_at`

### 제약

- unique (`snapshot_id`, `disease_id`, `region_id`, `date`)

### 인덱스

- `snapshot_id`, `region_id`, `disease_id`
- `snapshot_id`, `date`

## 9. `observation_age_breakdowns`

### 역할

observation에 연결된 연령별 분포

### 주요 필드

- `breakdown_id` PK
- `observation_id` FK -> `disease_observations`
- `snapshot_id` FK -> `snapshots`
- `age`
- `case_count`
- `share_ratio`
- `relative_risk_score`
- `created_at`

### 제약

- unique (`observation_id`, `age`)

## 10. `observation_gender_breakdowns`

### 역할

observation에 연결된 성별 분포

### 주요 필드

- `breakdown_id` PK
- `observation_id` FK -> `disease_observations`
- `snapshot_id` FK -> `snapshots`
- `gender`
- `case_count`
- `share_ratio`
- `relative_risk_score`
- `created_at`

### 제약

- unique (`observation_id`, `gender`)

## 11. `observation_recent_trends`

### 역할

상세 패널의 최근 N주 추세를 위한 시계열 요약

### 주요 필드

- `trend_point_id` PK
- `snapshot_id` FK -> `snapshots`
- `disease_id` FK -> `diseases`
- `region_id` FK -> `regions`
- `age` nullable
- `week_offset`
- `week_label`
- `risk_level`
- `case_count`
- `created_at`

### 제약

- unique (`snapshot_id`, `disease_id`, `region_id`, `age`, `week_offset`)

## 12. `forecasts`

### 역할

1주/1개월 방향 예측 결과 저장

### 주요 필드

- `forecast_id` PK
- `snapshot_id` FK -> `snapshots`
- `disease_id` FK -> `diseases`
- `region_id` FK -> `regions`
- `age` nullable
- `week_direction`
- `month_direction`
- `forecast_score`
- `forecast_confidence`
- `forecast_summary`
- `forecast_generated_at`
- `created_at`

### 제약

- unique (`snapshot_id`, `disease_id`, `region_id`, `age`)

## Serving 층위

초기 단계에서는 별도 materialized table 없이 `analytics` 테이블을 직접 읽어도 된다. 다만 snapshot 단위 읽기 성능이나 운영 안정성이 필요해지면 아래와 같은 serving view/materialization을 둘 수 있다.

## 13. `dashboard_views` 또는 materialized view

### 역할

`/api/v1/dashboard` 응답에 맞는 조합 데이터를 빠르게 제공

### 포함 후보

- snapshot 메타
- 최신 observation
- forecast
- top diseases 요약

## 14. `api_breakdown_views`

### 역할

`/api/v1/observations/breakdown` 응답 최적화

### 포함 후보

- age breakdown
- gender breakdown
- recent trend

## 추천 관계 구조

핵심 FK 흐름은 아래와 같다.

```text
diseases
regions
snapshots

raw_observations
-> normalized_observations
-> disease_observations
   -> observation_age_breakdowns
   -> observation_gender_breakdowns
   -> observation_recent_trends

disease_observations
-> forecasts
```

## 초기 구현 우선순위

처음부터 모든 테이블을 한 번에 만들 필요는 없다. 우선순위는 아래가 적절하다.

1. `diseases`
2. `regions`
3. `snapshots`
4. `normalized_observations`
5. `disease_observations`
6. `observation_age_breakdowns`
7. `observation_gender_breakdowns`
8. `observation_recent_trends`
9. `forecasts`

`raw_*` 테이블은 실제 외부 수집이 시작될 때 함께 도입해도 된다.

## 초기 비목표

- 사용자 계정/권한 테이블
- 쓰기 기능용 audit log
- 전국 전체를 위한 고도 파티셔닝
- 실시간 스트리밍 이벤트 저장 구조

## 문서 간 관계

이 문서는 아래 문서의 다음 단계다.

- [`DATA.md`](./DATA.md)
- [`DATA-PIPELINE.md`](./DATA-PIPELINE.md)
- [`API.md`](./API.md)
- [`TASK.md`](./TASK.md)
