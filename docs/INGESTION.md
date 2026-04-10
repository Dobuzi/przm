# INGESTION.md

## 문서 목적

이 문서는 PRZM의 데이터 수집과 정규화 작업을 실제 실행 단위로 정의한다.

`DATA-PIPELINE.md`가 전체 흐름을 정의하고 `SCHEMA.md`가 저장 구조를 정의했다면, 이 문서는 그 사이에서 원천 데이터를 어떻게 가져오고, 어떤 순서로 정리하고, 어떤 기준으로 격리하고, 언제 다음 단계로 넘길지를 정리하는 역할을 가진다.

초기 PRZM은 `서울/경기`, `0~13세`, `일 단위 배치`, `snapshot 기반 API`를 전제로 하므로 ingestion도 이 범위를 안정적으로 공급하는 데 집중한다.

## Ingestion 설계 원칙

- 수집 단계는 원천 데이터를 최대한 보존하고, 해석은 정규화 단계에서 한다.
- 같은 배치를 여러 번 실행해도 결과가 깨지지 않도록 idempotent하게 설계한다.
- 매핑 불가, 값 이상치, 범위 밖 레코드는 조용히 버리지 않고 quarantine으로 보낸다.
- ingestion 실패와 analytics 실패를 분리해 원인 파악이 가능해야 한다.
- 초기 ingestion은 `하루 1회 배치`를 기본으로 하며, 실시간 처리는 비목표다.

## 전체 실행 흐름

```text
source fetch
-> raw staging
-> field normalization
-> region / disease mapping
-> value validation
-> quarantine split
-> normalized upsert
-> batch summary
```

## 배치 단위

초기 ingestion은 하루 기준 배치 1회를 기본으로 한다.

각 배치는 아래 식별자를 가진다.

- `ingestion_run_id`
- `source_name`
- `run_started_at`
- `run_finished_at`
- `target_date_range`
- `status`

이 실행 단위는 추후 운영 로그나 재처리 기준으로 사용한다.

## 단계별 정의

## 1. Source Fetch

### 역할

- 외부 소스에서 원천 관측 데이터를 가져온다.
- 같은 소스의 반복 호출 시 중복 수집을 줄일 수 있도록 날짜 범위 또는 증분 기준을 사용한다.

### 입력

- `source_name`
- 대상 날짜 범위
- 소스별 인증 또는 접근 설정

### 출력

- raw payload 목록
- fetch 메타데이터

### 원칙

- fetch 단계에서는 제품용 필드명으로 바꾸지 않는다.
- 원천 응답 전문 또는 복원 가능한 payload를 보존한다.
- 네트워크 실패는 batch 실패 사유로 기록한다.

## 2. Raw Staging

### 역할

- 가져온 원천 데이터를 `raw_observations`에 적재한다.
- 이후 정규화가 실패해도 원천 기록은 재처리 가능해야 한다.

### 주요 작업

- `source_record_id` 추출
- `reported_date`, `region_label`, `disease_label`, `age_raw`, `gender_raw`, `case_count_raw` 분리
- 원천 payload JSON 저장
- `ingested_at` 기록

### 저장 기준

- 같은 `source_name + source_record_id` 조합은 중복 적재하지 않는다.
- 원천이 record id를 제공하지 않으면 해시 기반 surrogate id를 생성한다.

## 3. Field Normalization

### 역할

- 원천 필드를 PRZM 내부 기준으로 정리한다.
- 이 단계에서는 아직 최종 매핑 성공을 가정하지 않는다.

### 주요 작업

- 날짜 포맷 통일
- 수치형 `case_count` 변환
- 연령 문자열 정리
- 성별 코드 정리
- 공백/특수문자 정리

### 출력 필드 예시

- `date`
- `region_label_normalized`
- `disease_label_normalized`
- `age_normalized_candidate`
- `gender_normalized_candidate`
- `case_count`

## 4. Region / Disease Mapping

### 역할

- 정리된 문자열을 내부 `region_id`, `disease_id`에 연결한다.
- 자동 매핑 가능한 항목과 검토가 필요한 항목을 분리한다.

### Region Mapping

- 원천 지역명에서 시도/시군구 이름을 정규화한다.
- 초기 범위는 `서울특별시`, `경기도` 시군구만 허용한다.
- 범위 밖 지역은 quarantine으로 보낸다.

### Disease Mapping

- 원천 질병명을 `diseases` 메타와 연결한다.
- 동의어, 약어, 소스별 표현 차이는 매핑 테이블로 관리한다.

### 출력

- 자동 매핑 성공 레코드
- review 필요 레코드
- 매핑 실패 레코드

## 5. Value Validation

### 역할

- 내부 모델 기준으로 허용 가능한 값인지 검증한다.
- 제품 범위를 벗어난 값은 정상 수집이어도 초기 serving 대상에서는 제외한다.

### 주요 검증 규칙

- `date`가 비어 있지 않아야 한다.
- `region_id`가 지원 지역이어야 한다.
- `disease_id`가 active 질병이어야 한다.
- `case_count`는 0 이상의 정수여야 한다.
- 연령은 초기에는 `0~13`만 정상 범위로 인정한다.
- 성별은 초기에는 `male`, `female`만 허용한다.

### 처리 원칙

- 핵심 필드 누락은 quarantine
- 범위 밖 연령은 quarantine 또는 초기 serving 제외 대상으로 분리
- 성별 미상은 초기에는 quarantine 우선

## 6. Quarantine Split

### 역할

- 정규화는 됐지만 바로 analytics로 넘길 수 없는 레코드를 분리한다.
- 조용한 유실을 막고, 매핑 규칙 개선의 입력으로 사용한다.

### 주요 사유 예시

- `missing_date`
- `unknown_region`
- `unsupported_region`
- `unknown_disease`
- `invalid_case_count`
- `unsupported_age`
- `unsupported_gender`
- `duplicate_record`

### 저장 방식

- `normalized_observations.is_quarantined = true`
- `quarantine_reason` 기록

## 7. Normalized Upsert

### 역할

- quarantine 대상이 아닌 레코드를 `normalized_observations`에 upsert한다.
- downstream analytics는 이 테이블만 읽는다.

### upsert 기준

- `raw_observation_id` 기준 1:1 연결 유지
- 동일 raw record의 재처리는 overwrite 가능해야 한다.
- 동일 의미의 중복 원천 레코드는 source 정책에 따라 merge 또는 latest 우선 규칙을 가진다.

### 결과

- analytics 입력용 정규화 레코드 확보
- quarantine 제외 수량 집계 가능

## 8. Batch Summary

### 역할

- 배치 결과를 운영 관점에서 요약한다.
- 다음 analytics 단계로 넘길 수 있는지 판단 근거를 만든다.

### 필수 집계

- raw 수집 건수
- 신규 적재 건수
- 중복 제외 건수
- 정상 정규화 건수
- quarantine 건수
- 사유별 quarantine 건수
- 지원 지역/질병 커버리지

### 활용

- snapshot 발행 가능 여부 판단 전 입력 지표
- 운영 모니터링
- 재처리 우선순위 판단

## 실행 순서

초기 배치 실행 순서는 아래와 같이 고정한다.

1. 소스별 fetch
2. raw staging
3. field normalization
4. region / disease mapping
5. value validation
6. quarantine split
7. normalized upsert
8. batch summary 생성
9. 이후 analytics 배치로 인계

## 재실행과 Idempotency

- 같은 날짜 범위를 다시 실행해도 raw와 normalized 결과가 중복 누적되지 않아야 한다.
- ingestion 재실행은 source 단위 또는 날짜 범위 단위로 가능해야 한다.
- quarantine 해소 후 재처리 시 기존 raw record를 다시 읽어 normalized 결과만 갱신할 수 있어야 한다.

## 실패 처리 원칙

## 1. Fetch 실패

- source 단위 실패로 기록한다.
- 다른 source는 가능한 경우 계속 진행한다.
- 핵심 source가 전부 실패하면 해당 배치는 실패 처리한다.

## 2. Mapping 실패 증가

- 일정 비율 이상 매핑 실패가 발생하면 경고 상태로 기록한다.
- 자동 발행 기준을 넘으면 analytics 단계로 넘기지 않는다.

## 3. Quarantine 급증

- 단순 개별 레코드 문제가 아니라 source schema 변화 가능성을 우선 의심한다.
- source payload 샘플과 함께 운영 로그에 남긴다.

## 운영 로그와 관찰성

초기 구현에서는 복잡한 모니터링 시스템보다 아래 로그 단위를 우선한다.

- source fetch 시작 / 종료
- raw 적재 수
- quarantine 수와 주요 사유
- normalized upsert 수
- batch success / failed

필요 시 이후 `ingestion_runs`, `ingestion_run_events` 같은 운영 테이블로 확장할 수 있다.

## 초기 구현 범위

초기 ingestion 구현은 아래까지만 포함하는 것이 적절하다.

- 일 단위 batch runner
- 1~2개 핵심 source fetch adapter
- raw staging
- region / disease mapping 규칙
- quarantine 처리
- normalized upsert
- batch summary 생성

아래는 초기 비목표다.

- 실시간 streaming ingestion
- 복잡한 워크플로 오케스트레이션
- 자동 self-healing 재시도 전략
- 전국 단위 전체 질병 소스 동시 운영

## 다음 연결 문서

- `DATA-PIPELINE.md`: 전체 파이프라인 기준
- `SCHEMA.md`: 저장 테이블 책임
- `API.md`: serving 계층 계약
- 이후 필요 시 `SNAPSHOTS.md`, `FORECAST-PIPELINE.md`, `SOURCE-MAPPINGS.md`로 분리 가능
