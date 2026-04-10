# OPERATIONS.md

## 문서 목적

이 문서는 PRZM의 데이터 파이프라인과 API 서빙을 운영 관점에서 어떻게 관리할지 정의한다.

`INGESTION.md`, `SNAPSHOTS.md`, `FORECAST-PIPELINE.md`, `SOURCE-MAPPINGS.md`가 각각의 작업 단위를 정의했다면, 이 문서는 일일 운영 흐름, 실패 대응, 재처리, rollback, 관찰성을 한 곳에서 묶는 역할을 가진다.

초기 PRZM은 복잡한 24시간 실시간 운영이 아니라 `일 단위 배치 + snapshot 발행` 서비스이므로, 운영 기준도 단순하고 명확해야 한다.

## 운영 설계 원칙

- 운영은 자동화보다 재현 가능성과 명확한 판단 기준을 우선한다.
- 배치 실패와 품질 경고를 구분한다.
- 사용자 노출 상태는 항상 최신 `published snapshot` 하나로 고정한다.
- 문제가 생겨도 데이터를 직접 수정하기보다 재처리 또는 상태 전이로 복구한다.
- 초기 운영은 적은 수의 핵심 지표와 체크리스트로 시작한다.

## 운영 대상

초기 운영 대상은 아래 4개 축이다.

1. ingestion batch
- source fetch
- normalization
- mapping
- quarantine

2. analytics batch
- observation aggregation
- breakdown generation
- forecast generation

3. snapshot publish
- draft 검증
- published 전환
- superseded 처리

4. API serving
- 최신 published snapshot 서빙
- snapshot 일관성 보장

## 일일 운영 흐름

초기 일일 운영 흐름은 아래 순서를 따른다.

```text
source fetch / ingestion
-> normalized 데이터 점검
-> analytics 생성
-> forecast 생성
-> draft snapshot 검증
-> publish 또는 hold
-> API 상태 확인
```

## 운영 체크리스트

## 1. Ingestion 체크

- source fetch 성공 여부
- raw 적재 건수
- normalized 적재 건수
- quarantine 건수
- quarantine 급증 여부
- 신규 alias / 신규 질병 표기 발생 여부

## 2. Analytics 체크

- observation row count
- breakdown row count
- forecast row count
- 핵심 지역 커버리지
- 핵심 질병 커버리지

## 3. Snapshot 체크

- draft snapshot 생성 여부
- publish gate 통과 여부
- published snapshot 교체 여부
- 이전 snapshot 상태 전이 정상 여부

## 4. API 체크

- `/api/v1/dashboard` 응답 정상 여부
- `/api/v1/observations`
- `/api/v1/observations/breakdown`
- `/api/v1/forecasts`
- endpoint 간 snapshot 일치 여부

## 운영 상태 분류

초기 운영 상태는 아래 3단계면 충분하다.

## `healthy`

- ingestion, analytics, snapshot publish가 모두 정상
- API가 최신 published snapshot을 정상 서빙

## `degraded`

- 일부 source 실패 또는 quarantine 증가가 있지만 기존 published snapshot 서빙은 가능
- 새 snapshot publish는 보류될 수 있음

## `failed`

- 새 snapshot 발행 불가
- 기존 published snapshot도 신뢰할 수 없는 상태이거나 API 장애 발생

초기에는 대부분의 문제를 `healthy / degraded / failed`로 나누는 것이 운영 판단에 충분하다.

## 장애 유형

## 1. Source Fetch 장애

예시:

- 외부 소스 응답 실패
- 인증 실패
- schema 변경

대응:

- source 단위 실패 기록
- 다른 source 계속 진행 가능 여부 판단
- 핵심 source 부족 시 publish hold

## 2. Mapping 장애

예시:

- region label 신규 표기 급증
- disease alias 미등록
- ambiguous mapping 증가

대응:

- quarantine 사유 확인
- `SOURCE-MAPPINGS.md` 기준으로 alias / approved mapping 보정
- 필요한 범위만 재처리

## 3. Forecast 장애

예시:

- forecast row count 급감
- validation 실패
- confidence 전체 저하

대응:

- 새 snapshot publish 중단
- 이전 published snapshot 유지
- input observation / breakdown 범위 재점검

## 4. Publish 장애

예시:

- draft는 생성되었지만 gate 미통과
- published 전환 실패
- superseded 처리 실패

대응:

- 상태 전이 재시도
- 기존 published snapshot 유지
- 필요 시 수동 rollback 또는 manual publish

## 5. API 장애

예시:

- endpoint 500
- snapshot mismatch
- empty response 급증

대응:

- 최신 published snapshot 참조 상태 점검
- API adapter / query 조건 확인
- 필요 시 이전 snapshot으로 rollback

## 재처리 전략

초기 재처리는 아래 단위로 수행 가능해야 한다.

## source 단위 재처리

- 특정 source fetch 또는 normalization만 다시 실행

## 날짜 범위 재처리

- 특정 날짜 구간 raw -> normalized -> analytics 재생성

## mapping 보정 후 재처리

- alias / approved mapping 갱신 후 affected raw records만 재정규화

## forecast 재처리

- observation은 유지하고 forecast만 다시 생성

재처리는 언제나 idempotent해야 하며, 기존 published snapshot을 직접 수정하지 않는다.

## Rollback 전략

rollback은 snapshot 상태 전이로 처리한다.

- 새 published snapshot에 품질 문제가 확인되면 기존 `superseded` snapshot을 다시 `published`로 전환한다.
- rollback은 데이터 테이블 직접 수정이 아니라 `SNAPSHOTS.md` 기준 상태 변경으로 처리한다.
- rollback 이후 문제 snapshot은 `failed` 또는 `superseded`로 재분류할 수 있다.

## 운영 로그

초기 운영 로그는 아래 단위만 확보하면 충분하다.

- ingestion run 시작 / 종료
- source별 fetch 성공 / 실패
- quarantine 사유별 건수
- analytics row count
- forecast 생성 / skip 건수
- snapshot 상태 전이
- API health check 결과

## 핵심 운영 지표

초기에는 아래 지표를 daily basis로 본다.

- raw fetch 건수
- normalized 성공 건수
- quarantine 비율
- observation 생성 건수
- forecast 생성 건수
- published snapshot 시각
- API health check 성공 여부

## 운영 판단 기준

## publish 가능

- 핵심 source 확보
- quarantine 비율 과도하지 않음
- observation / breakdown / forecast 모두 존재
- publish gate 통과

## publish 보류

- source 일부 실패
- quarantine 급증
- forecast 부족
- snapshot validation 경고 다수

## 즉시 rollback 검토

- published 후 API 응답 이상
- 주요 지역/질병 데이터 누락
- snapshot mismatch 확인

## 초기 구현 범위

초기 운영 구현은 아래까지만 포함한다.

- 일일 운영 체크리스트
- 간단한 run log
- manual publish / hold / rollback 판단
- source / forecast / snapshot 장애 분류
- API health check

아래는 초기 비목표다.

- 24시간 온콜 체계
- 자동 incident routing
- 복잡한 알림 정책
- 다중 환경 운영 대시보드

## 다음 연결 문서

- `INGESTION.md`: 수집 운영 기준
- `SNAPSHOTS.md`: publish / rollback 기준
- `FORECAST-PIPELINE.md`: forecast 재처리 기준
- `SOURCE-MAPPINGS.md`: mapping 운영 보정 기준
- 이후 필요 시 `RUNBOOK.md`, `INCIDENTS.md`, `HEALTH-CHECKS.md`로 분리 가능
