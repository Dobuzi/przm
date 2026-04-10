# FORECAST-PIPELINE.md

## 문서 목적

이 문서는 PRZM의 예측 데이터를 어떤 입력과 단계로 생성하고, 어떤 조건에서 snapshot에 포함할지 정의한다.

`PREDICTION.md`가 사용자에게 보이는 예측의 의미와 표현을 정의하고, `DATA-PIPELINE.md`가 전체 데이터 흐름을 정의했다면, 이 문서는 analytics 관점에서 forecast 생성 배치를 구체화하는 역할을 가진다.

초기 PRZM은 수치 예보 서비스가 아니라 방향성 중심 제품이므로, forecast pipeline도 복잡한 모델 실험보다 재현 가능한 일 단위 생성 흐름을 우선한다.

## Forecast Pipeline 설계 원칙

- 예측은 observation 이후 단계에서 생성되는 파생 데이터다.
- forecast는 반드시 특정 `snapshot` 후보와 연결 가능한 상태로 생성되어야 한다.
- 예측 결과는 수치보다 `direction`, `confidence`, `summary`를 중심으로 저장한다.
- 데이터 부족은 억지 예측보다 `낮은 confidence` 또는 미생성을 우선한다.
- 초기 pipeline은 `일 단위 배치`와 `1주`, `1개월` 두 기간만 다룬다.

## Pipeline 위치

초기 forecast pipeline은 아래 흐름 안에 위치한다.

```text
normalized observations 준비
-> observation aggregation
-> breakdown generation
-> forecast input set 준비
-> forecast generation
-> forecast validation
-> draft snapshot 연결
```

즉, forecast는 normalized raw를 직접 읽지 않고, 정리된 observation과 breakdown을 입력으로 사용한다.

## 입력 데이터

초기 forecast 생성 입력은 아래로 고정한다.

## 1. Observation Time Series

- `disease_id`
- `region_id`
- `date`
- `case_count`
- `observation_score`
- `risk_level`
- `trend_direction`
- `trend_delta`
- `confidence_level`

이 시계열은 forecast의 기본 입력이다.

## 2. Age Breakdown

- 선택 연령 기준 예측을 만들기 위한 하위 분포 입력
- 초기에는 `0~13세` 1세 단위 분포만 사용

## 3. Recent Trend

- 최근 며칠 또는 몇 주의 변화 방향
- 급증, 둔화, 안정화 같은 단기 흐름 판단에 사용

## 4. Region / Disease Context

- 지역별 변동성
- 질병별 계절성 또는 반복 패턴이 있다면 이후 확장 입력으로 고려 가능

초기 범위에서는 외부 날씨, 이동량, 학교 일정 같은 외생 변수는 사용하지 않는다.

## Forecast 생성 단위

초기 forecast는 아래 단위로 생성한다.

### 기본 단위

`disease_id × region_id × period`

### 조건부 단위

`disease_id × region_id × age × period`

조건부 단위는 API와 UI에서 연령 선택 상태에 맞춰 사용되며, 생성 자체는 age별 결과를 포함할 수 있다.

## Forecast 기간

초기 pipeline은 아래 두 기간만 생성한다.

## 1. `week`

- 향후 1주 방향성
- 사용자가 가까운 위험 변화를 보는 기본 기간

## 2. `month`

- 향후 1개월 방향성
- 현재 흐름의 지속 여부를 판단하는 보조 기간

그 외 기간은 초기 비목표다.

## Forecast 출력 필드

초기 forecast 출력은 아래 필드를 가진다.

- `snapshot_id`
- `disease_id`
- `region_id`
- `age` nullable
- `period`
- `forecast_direction`
- `forecast_confidence`
- `forecast_score`
- `forecast_summary`
- `generated_at`

## 필드 의미

### `forecast_direction`

- `increase`
- `steady`
- `decrease`

### `forecast_confidence`

- `low`
- `medium`
- `high`

### `forecast_score`

- 내부 계산용 보조 점수
- UI에서는 직접 노출하지 않아도 된다

### `forecast_summary`

- 사용자 노출 가능한 짧은 해석 문장
- 예: `앞으로 일주일 동안 증가 가능성이 높음`

## 생성 단계

초기 forecast pipeline은 아래 순서로 본다.

## 1. Forecast Input Set 준비

- 지원 지역/질병/연령 범위 안의 observation만 선택
- 관측 시계열 길이가 최소 기준을 충족하는지 확인
- 필요한 breakdown이 존재하는지 확인

### 결과

- forecast generation 대상 집합
- 대상 제외 사유 집합

## 2. Forecast Generation

- 대상 집합별로 `week`, `month` 결과 생성
- direction, confidence, summary를 함께 산출

이 단계에서는 알고리즘 종류를 확정하지 않지만, 결과는 언제나 같은 입력에 대해 재현 가능해야 한다.

## 3. Forecast Validation

- 생성된 결과가 필수 필드를 모두 갖췄는지 확인
- confidence와 direction 값이 허용 집합 안에 있는지 확인
- 같은 조합의 중복 forecast가 없는지 확인

## 4. Forecast Write

- 검증 통과 결과만 forecast 테이블에 기록
- 아직 `published snapshot`에는 연결하지 않고 draft 후보 데이터로 둔다

## 생성 제외 규칙

초기 forecast는 아래 경우 생성하지 않거나 약하게 생성한다.

## 미생성

- observation 시계열 길이가 너무 짧은 경우
- 입력 observation confidence가 지나치게 낮은 경우
- 필수 breakdown이 비어 있는 경우

## 생성하되 낮은 confidence

- 최근 변동성이 커서 방향성이 불안정한 경우
- 지역/질병 데이터가 최소 기준만 겨우 넘는 경우
- age별 데이터 편차가 큰 경우

## Validation 기준

forecast validation은 아래 기준으로 단순하게 시작한다.

### 필수 체크

- `forecast_direction` 존재
- `forecast_confidence` 존재
- `forecast_summary` 존재
- `period in (week, month)`
- duplicate 없음

### 품질 체크

- observation 기준일과 generated_at 관계가 정상인지
- snapshot 후보 범위를 벗어난 입력을 읽지 않았는지
- 지원 지역/질병/연령 범위를 벗어나지 않았는지

## Snapshot 연결 규칙

- forecast는 draft snapshot 후보 데이터로 먼저 생성된다.
- observation, breakdown, forecast가 모두 준비되어야 snapshot publish gate에 들어간다.
- forecast가 비어 있거나 validation 실패가 심하면 snapshot은 `published`가 될 수 없다.

즉, 초기 PRZM에서는 forecast가 optional 부가 데이터가 아니라 snapshot의 필수 구성 요소다.

## 운영 메타데이터

초기 구현에서는 아래 메타정보를 남기는 것이 적절하다.

- `forecast_run_id`
- `input_observed_until`
- `generated_at`
- `target_periods`
- 생성 건수
- low confidence 건수
- skipped 건수
- skip 사유 요약

## 재실행 규칙

- 같은 input range에 대해 forecast를 다시 생성할 수 있어야 한다.
- 재실행 결과는 기존 draft 결과를 대체할 수 있어야 한다.
- published 이후 수정이 필요하면 새 snapshot 후보를 만들고 상태 전이로 교체한다.

초기에는 published snapshot 내부 forecast를 직접 수정하지 않는다.

## 초기 구현 범위

초기 forecast pipeline 구현은 아래까지만 포함한다.

- `week`, `month` 두 기간 생성
- direction / confidence / summary 중심 결과
- observation 기반 입력 세트 준비
- validation 후 draft snapshot 연결
- low confidence / skipped 대상 기록

아래는 초기 비목표다.

- 실시간 예측 갱신
- 복수 모델 ensemble
- 외생 변수 결합
- 사용자별 맞춤 예측 모델
- 자동 모델 선택 실험

## 다음 연결 문서

- `PREDICTION.md`: 사용자 관점의 예측 의미
- `DATA-PIPELINE.md`: 전체 파이프라인 기준
- `SNAPSHOTS.md`: publish gate와 snapshot 연결 규칙
- 이후 필요 시 `FORECAST-MODELING.md`, `FORECAST-VALIDATION.md`로 분리 가능
