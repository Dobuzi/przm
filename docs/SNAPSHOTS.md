# SNAPSHOTS.md

## 문서 목적

이 문서는 PRZM에서 관측 데이터와 예측 데이터를 어떤 기준으로 하나의 배포 가능한 버전으로 고정할지 정의한다.

`INGESTION.md`가 raw에서 normalized까지의 흐름을 다루고, `DATA-PIPELINE.md`가 전체 파이프라인을 다룬다면, 이 문서는 analytics 결과를 사용자에게 노출 가능한 `snapshot`으로 승격하는 기준을 다룬다.

초기 PRZM은 지도, 상세 분석, 예측이 모두 같은 시점의 데이터를 기준으로 보여야 하므로 snapshot 규칙은 단순하면서도 일관돼야 한다.

## Snapshot 설계 원칙

- 프론트엔드는 항상 하나의 `published snapshot`만 읽는다.
- 관측값과 예측값, breakdown은 반드시 같은 `snapshot_id`를 공유해야 한다.
- 부분 성공한 중간 결과는 내부 검토에는 쓸 수 있어도 외부 API에는 노출하지 않는다.
- snapshot은 재현 가능해야 하며, `observed_until`과 `published_at`이 명확해야 한다.
- 잘못된 snapshot은 조용히 덮어쓰지 않고 상태 전이로 관리한다.

## Snapshot의 역할

snapshot은 단순한 배치 완료 마크가 아니라 아래를 묶는 제품 배포 단위다.

- 특정 시점까지의 observation 집계
- 해당 observation을 기반으로 한 age / gender / recent trend breakdown
- 같은 기준 시점에서 생성된 forecast
- API 서빙이 사용할 메타데이터

즉, snapshot은 `사용자에게 보여줄 수 있는 완결된 데이터 묶음`이다.

## Snapshot 구성 요소

초기 snapshot은 아래 요소가 모두 준비되어야 한다.

1. observation dataset
- `질병 × 지역 × 날짜` 단위 집계

2. breakdown dataset
- age breakdown
- gender breakdown
- recent trend

3. forecast dataset
- `week`, `month` 기준 방향성 예측

4. metadata
- `snapshot_id`
- `observed_until`
- `forecast_generated_at`
- `published_at`
- `status`
- `source_note`

## 상태 모델

초기 snapshot 상태는 아래 4단계로 둔다.

## 1. `draft`

- analytics 산출물이 생성되었지만 아직 노출 가능한지 검증되지 않은 상태
- 내부 점검과 품질 확인 대상

## 2. `published`

- API가 읽는 활성 snapshot
- 같은 시점에 오직 하나의 snapshot만 `published`여야 한다

## 3. `superseded`

- 과거에는 published였지만 더 최신 snapshot으로 교체된 상태
- 재현과 감사 목적의 보존 대상

## 4. `failed`

- 생성은 시도했지만 품질 기준 미달 또는 배치 오류로 발행 불가 상태
- API에서 사용하지 않는다

## 생성 흐름

초기 snapshot 생성 흐름은 아래와 같이 본다.

```text
normalized observations 준비
-> observation aggregation
-> breakdown generation
-> forecast generation
-> draft snapshot 생성
-> validation / publish gate 통과
-> published 전환
-> 이전 published snapshot은 superseded 전환
```

## 발행 기준

snapshot은 아래 기준을 통과해야만 `published`로 전환된다.

## 1. 데이터 일관성

- observation, breakdown, forecast가 모두 같은 `snapshot_id`를 참조해야 한다.
- `observed_until` 이후의 레코드가 섞이면 안 된다.
- 같은 지역/질병/날짜 조합에 중복 observation이 있으면 안 된다.

## 2. 최소 커버리지

- 초기 지원 지역 범위에서 핵심 지역 데이터가 지나치게 비어 있지 않아야 한다.
- 초기 지원 질병 중 활성 질병 데이터가 정의된 기준 이상 존재해야 한다.
- age breakdown과 forecast가 완전히 비어 있는 경우는 발행 불가다.

## 3. 품질 기준

- quarantine 급증이나 매핑 실패 급증이 발행 기준을 넘지 않아야 한다.
- forecast 생성이 실패한 경우 observation만으로는 published snapshot을 만들지 않는다.
- 필수 메타 필드가 비어 있지 않아야 한다.

## 4. 운영 기준

- 같은 날짜 범위에 대해 더 최신 재계산 결과가 있다면 최신 결과만 발행한다.
- 수동 검토가 필요한 경고가 있으면 `draft` 유지 또는 `failed`로 전환한다.

## API 선택 규칙

초기 API는 아래 규칙으로 snapshot을 선택한다.

- 기본적으로 가장 최신 `published` snapshot 1개를 사용한다.
- `/api/v1/dashboard`
- `/api/v1/observations`
- `/api/v1/observations/breakdown`
- `/api/v1/forecasts`

이 endpoint들은 모두 같은 snapshot을 읽어야 한다.

향후 필요 시 내부 운영 도구에서만 `snapshot_id`를 직접 지정해 조회할 수 있다. 초기 사용자 API에는 snapshot 선택 파라미터를 노출하지 않는다.

## 메타데이터 필드 의미

## `snapshot_id`

- snapshot 식별자
- UUID 또는 시각 기반 고유 ID 사용 가능

## `observed_until`

- 이 snapshot이 포함하는 실제 관측 데이터의 마지막 날짜
- 사용자에게 "기준일"로 보여줄 수 있는 값

## `forecast_generated_at`

- 예측 산출 시각
- observation 기준일과 다를 수 있으나 같은 배치 안에서 고정돼야 한다

## `published_at`

- snapshot이 실제 API 노출 상태가 된 시각

## `source_note`

- 사용한 소스 버전, 주요 예외 사항, 운영 메모를 담는 필드

## Validation / Publish Gate

초기 publish gate는 복잡한 점수 시스템보다 체크리스트 기반이 적절하다.

### 필수 체크

- observation row count > 0
- breakdown row count > 0
- forecast row count > 0
- 필수 활성 지역 커버
- 필수 활성 질병 커버
- snapshot metadata complete

### 경고 체크

- quarantine 비율 상승
- 특정 지역 데이터 급감
- 특정 질병 데이터 급감
- forecast confidence 전반 저하

필수 체크 실패는 `failed`, 경고 체크는 운영 판단 후 `draft 유지` 또는 `published`로 처리한다.

## 교체와 Rollback

## 교체

- 새 snapshot이 publish되면 기존 `published` snapshot은 `superseded`로 전환한다.
- API는 즉시 새 snapshot만 읽는다.

## rollback

- 새 snapshot 품질 문제가 확인되면 이전 `superseded` snapshot을 다시 `published`로 전환할 수 있어야 한다.
- rollback은 데이터를 다시 계산하지 않고 상태 전이만으로 가능해야 한다.

## 보존 정책

- `published`와 `superseded` snapshot은 재현과 비교를 위해 보존한다.
- `failed` snapshot은 디버깅에 필요한 최소 기간만 보존할 수 있다.

초기에는 저장 비용보다 재현성과 운영 추적성이 더 중요하다.

## 초기 구현 범위

초기 snapshot 구현은 아래까지만 포함한다.

- `snapshots` 메타 테이블 관리
- draft -> published -> superseded -> failed 상태 전이
- 단일 최신 published snapshot 선택 규칙
- publish gate 체크리스트
- 수동 rollback 가능 구조

아래는 초기 비목표다.

- 사용자별 snapshot pinning
- 다중 published channel
- A/B snapshot 실험
- 실시간 incremental snapshot

## 다음 연결 문서

- `DATA-PIPELINE.md`: 전체 흐름
- `SCHEMA.md`: snapshot 메타와 analytics 테이블 구조
- `INGESTION.md`: snapshot 이전 단계
- 이후 필요 시 `FORECAST-PIPELINE.md`, `SOURCE-MAPPINGS.md`, `OPERATIONS.md`로 분리 가능
