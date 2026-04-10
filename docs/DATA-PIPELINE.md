# DATA-PIPELINE.md

## 문서 목적

이 문서는 PRZM의 실제 데이터 파이프라인을 제품/데이터/백엔드 관점에서 정의한다.

목적은 지금 당장 수집 스크립트를 구현하는 것이 아니라, 어떤 원천 데이터를 어떤 단계로 가공해 PRZM의 API와 화면이 사용하는 형태로 만들 것인지를 고정하는 것이다.

초기 PRZM은 서울특별시와 경기도, `0~13세` 어린이, 지도 중심 질병 모니터링에 집중하므로, 파이프라인도 이 범위를 빠르고 안정적으로 공급하는 데 맞춰야 한다.

## 파이프라인 설계 원칙

- 기본 집계 단위는 `질병 × 지역 × 날짜`다.
- 연령과 성별은 기본 집계에 연결되는 하위 breakdown으로 생성한다.
- API 응답은 화면이 바로 사용할 수 있어야 하지만, 원천 데이터와 가공 데이터의 경계를 유지해야 한다.
- 모든 관측값과 예측값은 같은 `snapshot` 기준으로 재현 가능해야 한다.
- 데이터 부족은 오류보다 `낮은 신뢰` 또는 `빈 결과`로 표현하는 것이 우선이다.
- 초기 파이프라인은 `일 단위 배치`를 기본으로 하며, 실시간 처리는 비목표다.

## 전체 흐름

초기 PRZM의 데이터 흐름은 아래 단계로 본다.

```text
원천 데이터 수집
-> 정규화 / 매핑
-> 일 단위 관측 집계 생성
-> breakdown 생성
-> 예측 생성
-> snapshot 확정
-> API 서빙 데이터 발행
```

## 단계별 정의

## 1. 원천 데이터 수집

### 역할

- 실제 질병 관측 신호를 외부 소스에서 수집한다.
- 지역, 날짜, 질병, 연령/성별 단위를 복원할 수 있을 만큼의 기본 필드를 확보한다.

### 초기 소스 후보

- 공공 보건 통계 데이터
- 감염병/호흡기 질환 관련 공개 집계
- 인구 기준 데이터
- 행정구역 메타데이터

### 초기 선택 기준

- 서울/경기 시군구 단위로 매핑 가능해야 한다.
- 최소 일 단위 시계열이 가능해야 한다.
- 어린이 `0~13세` 연령 집계 또는 그에 준하는 세부 연령 데이터를 확보할 수 있어야 한다.
- 재현 가능한 공개 또는 내부 계약 데이터여야 한다.

### 산출물

- `raw_observations`
- `raw_regions`
- `raw_population_context`

## 2. 정규화 / 매핑

### 역할

- 서로 다른 원천 필드명을 PRZM 내부 기준으로 정리한다.
- 지역과 질병 식별자를 내부 ID 체계에 맞춘다.
- 잘못된 값, 누락 값, 범위 밖 값을 분리한다.

### 주요 작업

- 날짜 포맷 정규화
- 지역명 → `region_id` 매핑
- 질병명 → `disease_id` 매핑
- 연령 값 정규화
- 성별 값 정규화
- 중복 레코드 제거 또는 병합

### 산출물

- `normalized_observations`

### 핵심 필드

- `source_record_id`
- `date`
- `region_id`
- `disease_id`
- `age`
- `gender`
- `case_count`
- `source_name`
- `ingested_at`

## 3. 일 단위 관측 집계 생성

### 역할

- PRZM의 핵심 단위인 `질병 × 지역 × 날짜` 관측값을 만든다.
- 지도와 요약 카드에서 바로 사용할 수 있는 `risk_level`, `trend_summary`의 기반 데이터를 계산한다.

### 집계 단위

- `disease_id`
- `region_id`
- `date`

### 생성 필드

- `case_count`
- `observation_score`
- `risk_level`
- `trend_direction`
- `trend_delta`
- `confidence_level`

### 설명

이 단계는 raw record를 그대로 내보내지 않고, 제품이 읽을 수 있는 관측 상태로 정리하는 단계다.

## 4. Breakdown 생성

### 역할

- 같은 관측 집계에 대해 연령별/성별 분포를 만든다.
- 상세 패널에서 사용하는 `recentTrend`, `ageDistribution`, `genderDistribution`의 기반이 된다.

### breakdown 종류

- `age_breakdown`
- `gender_breakdown`
- `recent_trend`

### 생성 기준

- 기본 observation을 부모로 둔다.
- 어린이 `0~13세`는 1세 단위로 집계한다.
- 성별은 초기에는 `male`, `female`만 다룬다.

### 산출물

- `observation_breakdowns`

## 5. 예측 생성

### 역할

- 관측 시계열을 바탕으로 `1주`, `1개월` 방향성 예측을 만든다.
- 예측은 수치보다 방향 해석과 신뢰도 중심으로 저장한다.

### 입력

- 최근 관측 시계열
- 지역별 변화량
- 질병별 변화 패턴
- 연령 기준 하위 집계

### 출력 단위

- `disease_id`
- `region_id`
- `age`
- `period` (`week`, `month`)

### 생성 필드

- `forecast_direction`
- `forecast_confidence`
- `forecast_score`
- `forecast_summary`
- `forecast_generated_at`

## 6. Snapshot 확정

### 역할

- 특정 시점의 관측값과 예측값 묶음을 하나의 배포 단위로 고정한다.
- 프론트엔드와 API는 항상 특정 `snapshot_id` 기준으로 데이터를 읽는다.

### snapshot 필드

- `snapshot_id`
- `observed_until`
- `published_at`
- `forecast_generated_at`
- `source_note`
- `status`

### 규칙

- snapshot이 발행되기 전 데이터는 사용자에게 노출하지 않는다.
- `dashboard`, `observations`, `forecasts`, `breakdown`은 같은 snapshot을 가리켜야 한다.
- 부분 성공 상태는 내부적으로는 허용할 수 있지만, 외부 노출은 일관된 snapshot만 한다.

## API 서빙 계층

### 역할

- snapshot 기준의 가공 데이터를 API contract에 맞게 제공한다.
- 프론트엔드는 raw table이 아니라 이 계층만 본다.

### 주요 연결

- `/api/v1/dashboard`
- `/api/v1/observations`
- `/api/v1/observations/breakdown`
- `/api/v1/forecasts`
- `/api/v1/regions`
- `/api/v1/diseases`

### 규칙

- API 응답은 `snake_case`
- snapshot 불일치 금지
- 데이터 부족은 빈 배열 또는 약한 confidence로 표현

## 업데이트 주기

초기 기준 권장 주기는 아래와 같다.

- 원천 수집: 하루 1회 이상
- 관측 집계: 하루 1회
- 예측 생성: 하루 1회
- snapshot 발행: 하루 1회

즉, 초기 PRZM은 `일 단위 갱신형` 서비스로 보는 것이 적절하다.

## 실패와 누락 처리

### 1. 원천 일부 누락

- 전체 배치를 즉시 실패시키기보다, snapshot 발행 가능 여부를 먼저 판단한다.
- 핵심 지역/질병 범위가 크게 깨졌다면 snapshot 발행을 보류한다.

### 2. 특정 지역/질병/연령 데이터 부족

- API는 오류 대신 빈 결과 또는 낮은 신뢰도로 응답한다.
- 프론트엔드는 `데이터 부족` 상태를 보여준다.

### 3. 매핑 실패

- 매핑 실패 레코드는 quarantine 영역으로 분리한다.
- 추후 region/disease 매핑 테이블 보정 대상으로 기록한다.

## 초기 구현 범위

이 문서가 현재 고정하는 초기 구현 범위는 아래다.

- 서울특별시 / 경기도
- 시군구 단위 지역
- 어린이 `0~13세`
- 일 단위 관측 집계
- 연령/성별 breakdown
- `1주`, `1개월` 방향성 예측
- snapshot 기반 API 발행

현재 이 문서는 아래를 확정하지 않는다.

- 실제 외부 데이터 공급자 최종 선정
- 예측 알고리즘 상세 수식
- 저장소/배치 인프라 기술 선택
- 운영 모니터링/알림 체계

## 후속 구현 후보

이 문서를 바탕으로 다음 구현 문서를 이어서 만들 수 있다.

- `SCHEMA.md`
- `INGESTION.md`
- `SNAPSHOTS.md`
- `FORECAST-JOB.md`
- `BACKEND-ARCHITECTURE.md`

## 문서 간 관계

이 문서는 아래 문서를 실데이터 운영 관점으로 연결한다.

- [`DATA.md`](./DATA.md)
- [`PREDICTION.md`](./PREDICTION.md)
- [`API.md`](./API.md)
- [`TASK.md`](./TASK.md)
