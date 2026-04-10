# SOURCE-MAPPINGS.md

## 문서 목적

이 문서는 PRZM의 원천 데이터에서 들어오는 지역명과 질병명을 내부 `region_id`, `disease_id`로 매핑하는 기준을 정의한다.

`INGESTION.md`가 정규화와 quarantine 흐름을 다루고, `SCHEMA.md`가 `raw_region_mappings`, `raw_disease_mappings` 같은 저장 구조를 정의했다면, 이 문서는 실제 매핑 규칙과 review 상태를 고정하는 역할을 가진다.

초기 PRZM은 `서울/경기`, `0~13세`, 주요 질병 중심 범위만 다루므로, 매핑도 이 범위 안에서 높은 정확도와 운영 가능성을 우선해야 한다.

## Mapping 설계 원칙

- 원천 레이블을 직접 제품 로직에 쓰지 않고 내부 ID로 매핑한 뒤 사용한다.
- 자동 매핑은 보수적으로 하고, 애매한 경우는 review 또는 quarantine으로 보낸다.
- 같은 원천 표현은 항상 같은 내부 ID로 이어지도록 규칙을 일관되게 유지한다.
- 매핑 실패는 데이터 유실이 아니라 운영 보정 입력으로 남겨야 한다.
- 초기 범위 밖 지역/질병은 억지로 가장 비슷한 값에 붙이지 않는다.

## 매핑 대상

초기 PRZM에서 다루는 매핑 대상은 아래 두 가지다.

## 1. Region Mapping

- 원천 지역명
- 시도 + 시군구 조합
- 축약형, 공백 차이, 표기 변형 포함

## 2. Disease Mapping

- 원천 질병명
- 약어, 영문명, 소스별 표현 차이 포함

연령과 성별은 별도 normalization 규칙으로 처리하고, 이 문서에서는 지역/질병 매핑만 다룬다.

## 저장 구조 연결

이 문서는 아래 테이블과 연결된다.

- `raw_region_mappings`
- `raw_disease_mappings`
- `regions`
- `diseases`

매핑 결과는 최종적으로 `normalized_observations.region_id`, `normalized_observations.disease_id`에 반영된다.

## Region Mapping 규칙

## 지원 범위

초기 region mapping은 아래 범위만 정상 처리한다.

- `서울특별시`
- `경기도`
- 각 시군구 단위

예시:

- `서울 강서구` -> `11160`
- `성남시 분당구` -> 내부 `region_id`
- `수원시 영통구` -> 내부 `region_id`

서울/경기 밖 지역은 초기 제품 범위 밖이므로 `unsupported_region`으로 quarantine 대상이다.

## 정규화 규칙

자동 매핑 전 아래 정규화를 수행한다.

- 앞뒤 공백 제거
- 중복 공백 축소
- 시도 접두어 표준화
- 괄호/특수기호 제거
- `서울`, `서울시`, `서울특별시` 같은 표현 통합
- `경기`, `경기도` 같은 표현 통합

## 자동 매핑 가능 조건

아래 경우는 자동 매핑 가능하다.

- 정규화 후 정확히 1개의 지원 지역과 일치
- 이미 같은 `source_name + source_region_label` 조합이 승인된 기록이 존재
- 신뢰할 수 있는 alias 사전에 등록된 표현

## Review 필요 조건

아래 경우는 자동 매핑하지 않고 review로 보낸다.

- 둘 이상의 지원 지역 후보가 나오는 경우
- 시도 정보 없이 시군구명만 들어와 충돌 가능성이 있는 경우
- 새로 등장한 표기이지만 유력 후보가 하나 있는 경우

## Quarantine 조건

아래 경우는 quarantine 대상이다.

- 지원 범위 밖 지역
- 후보를 전혀 찾을 수 없는 경우
- 잘못된 문자열 또는 의미 없는 값

## Disease Mapping 규칙

## 지원 범위

초기 disease mapping은 PRZM이 활성화한 질병만 정상 처리한다.

예시:

- `flu-a`
- `rsv`
- `adeno`

정확한 활성 질병 목록은 `diseases.is_active = true` 기준으로 관리한다.

## 정규화 규칙

자동 매핑 전 아래 정규화를 수행한다.

- 영문 대소문자 통일
- 공백, 하이픈, 슬래시 표기 통일
- 약어와 풀네임의 alias 처리
- 소스별 약칭 제거 또는 표준화

예시:

- `Flu A`, `flu-a`, `influenza a` -> 동일 후보
- `RSV`, `respiratory syncytial virus` -> 동일 후보

## 자동 매핑 가능 조건

- 정규화 후 정확히 1개의 활성 질병과 일치
- 기존 승인 mapping이 존재
- alias 사전에 등록된 질병 표현

## Review 필요 조건

- 비슷한 질병 후보가 여러 개 존재
- 새 질병 표현이지만 운영상 신규 alias 등록 가능성이 높은 경우

## Quarantine 조건

- 활성 질병 범위 밖 표현
- 후보를 찾을 수 없는 경우
- source schema 변경으로 보이는 비정상 값

## Confidence Level

매핑에는 confidence를 함께 둔다.

초기에는 아래 3단계면 충분하다.

## `high`

- exact match
- 승인된 alias match
- 기존 승인 mapping 재사용

## `medium`

- 정규화 후 유력 후보 1개
- 운영 review가 필요한 신규 표기

## `low`

- 자동 반영에는 사용하지 않음
- review 참고용 힌트 수준

초기 제품에서는 `medium`, `low` 매핑을 자동 확정하지 않는다.

## Review Status

매핑 테이블의 `review_status`는 아래 상태를 가진다.

## `approved`

- 운영상 정상 매핑으로 인정
- 이후 같은 source 표현은 자동 매핑 가능

## `needs_review`

- 유력 후보가 있지만 자동 확정하지 않음
- 운영 검토 필요

## `rejected`

- 잘못된 연결이거나 지원 범위 밖
- 자동 매핑에 사용하지 않음

## `superseded`

- 과거 규칙이었지만 더 나은 매핑 규칙으로 교체됨

## 자동 매핑 우선순위

초기 자동 매핑은 아래 순서로 시도한다.

1. 기존 `approved` mapping exact match
2. alias 사전 exact match
3. 정규화 후 단일 후보 exact match
4. 그 외는 review 또는 quarantine

fuzzy matching은 초기 기본 전략으로 두지 않는다. 이유는 잘못된 자동 연결이 quarantine보다 더 위험하기 때문이다.

## Quarantine 연결 규칙

아래 경우는 `normalized_observations.is_quarantined = true` 로 이어진다.

- `unknown_region`
- `unsupported_region`
- `unknown_disease`
- `ambiguous_region`
- `ambiguous_disease`

즉, 매핑이 확실하지 않은 데이터는 analytics 단계로 넘기지 않는다.

## 운영 보정 흐름

초기 운영 보정 흐름은 아래와 같다.

```text
새 source label 발견
-> 자동 매핑 시도
-> approved / needs_review / quarantine 분기
-> 운영 검토 후 mapping table 갱신
-> 다음 ingestion run부터 재사용
```

이 흐름을 통해 같은 source의 표기 흔들림은 점차 안정화할 수 있다.

## 초기 구현 범위

초기 mapping 구현은 아래까지만 포함한다.

- region alias 사전
- disease alias 사전
- `approved / needs_review / rejected / superseded` 상태
- high / medium / low confidence 기록
- quarantine 연결 규칙

아래는 초기 비목표다.

- 공격적인 fuzzy match
- LLM 기반 자동 매핑
- 전국 단위 광범위 지역 alias 사전
- 질병 taxonomy 확장 추론

## 다음 연결 문서

- `INGESTION.md`: 매핑이 ingestion 흐름에서 어떻게 쓰이는지
- `SCHEMA.md`: mapping 관련 저장 구조
- `DATA-PIPELINE.md`: 전체 파이프라인 기준
- 이후 필요 시 `OPERATIONS.md`, `ALIASES.md`로 분리 가능
