# DATA.md

## 문서 목적

이 문서는 PRZM의 데이터 구조를 제품과 개발 사이의 관점에서 정의한다.

목적은 실제 데이터베이스 스키마를 확정하는 것이 아니라, PRZM이 어떤 데이터를 핵심 단위로 다루고, 그 데이터를 어떤 화면과 기능에 연결하는지 명확히 하는 것이다.

초기 PRZM은 지도 중심 모니터링, 분석, 예측 제품이다. 따라서 데이터 역시 "무엇이 얼마나 발생했는가"만 저장하는 것이 아니라, 지역 단위 위험 해석과 확산 방향 분석에 바로 쓸 수 있어야 한다.

## 데이터 설계 원칙

- 데이터는 제품의 핵심 질문에 답할 수 있도록 구성해야 한다.
- 초기 기본 단위는 `질병 × 지역 × 날짜`다.
- 연령과 성별은 기본 단위에 연결되는 분석 속성 또는 하위 집계로 다룬다.
- 지도 표현과 상세 분석, 예측이 같은 데이터 기반 위에서 동작해야 한다.
- 초기 범위는 서울/경기도와 0세부터 13세까지 어린이 분석에 맞춘다.
- 전국 및 전 연령 확장이 가능하도록 개념 구조는 일반화하되, 초기 구현은 단순해야 한다.

## 핵심 데이터 개체

PRZM의 초기 데이터 구조는 아래 개체를 중심으로 본다.

## 1. Disease

질병 자체를 정의하는 개체다.

이 개체는 제품 내에서 사용자가 선택하고 비교하는 기준이 된다.

### 역할

- 어떤 질병을 기준으로 데이터를 보고 있는지 식별
- 지도와 상세 분석에서 질병별 상태 표시
- 예측 대상 질병 구분

### 예시 필드

- `disease_id`
- `name`
- `slug`
- `display_name`
- `category`
- `is_active`

## 2. Region

지역 단위를 정의하는 개체다.

초기 PRZM은 서울특별시와 경기도를 중심으로 동작하므로, 해당 범위 안에서 지도로 표현 가능한 단위가 필요하다.

### 역할

- 지도에서 선택 가능한 공간 단위 제공
- 지역별 위험도와 확산 범위 계산의 기준
- 상세 분석과 예측의 지역 기준점

### 예시 필드

- `region_id`
- `name`
- `province_name`
- `region_type`
- `parent_region_id`
- `center_lat`
- `center_lng`
- `boundary_ref`
- `is_supported`

## 3. Disease Observation

초기 PRZM의 가장 중요한 기본 집계 개체다.

`질병 × 지역 × 날짜` 단위의 관측값을 담는다.

이 개체는 현재 상태, 최근 추세, 위험도 계산의 기반이 된다.

### 역할

- 특정 날짜에 특정 지역에서 특정 질병이 어느 정도 관측되었는지 표현
- 지도 위험도 계산의 기본 재료
- 추세와 속도 계산의 입력값
- 예측 모델의 입력 데이터

### 예시 필드

- `observation_id`
- `disease_id`
- `region_id`
- `date`
- `case_count`
- `observation_score`
- `risk_level`
- `trend_direction`
- `trend_delta`
- `source_count`
- `confidence_level`

## 4. Demographic Breakdown

기본 관측값에 연결되는 인구학적 세부 집계 개체다.

연령과 성별 정보를 관측값에 부착해, 제품이 "누구에게 퍼지고 있는가"를 설명할 수 있게 한다.

### 역할

- 연령별 위험도 분석
- 성별 분포 분석
- 초기 어린이 0세부터 13세까지 1세 단위 필터 지원

### 예시 필드

- `breakdown_id`
- `observation_id`
- `age`
- `age_band`
- `gender`
- `case_count`
- `share_ratio`
- `relative_risk_score`

## 5. Forecast

향후 일주일과 한달의 확산/소멸 방향을 나타내는 예측 개체다.

이 개체는 관측 데이터를 기반으로 파생되며, 사용자에게는 예측 결과와 해석 문장으로 노출된다.

### 역할

- 단기 및 중기 예측 결과 제공
- 증가/정체/감소 방향 표시
- 예측 근거 시점 연결

### 예시 필드

- `forecast_id`
- `disease_id`
- `region_id`
- `age_scope`
- `forecast_generated_at`
- `forecast_target_period`
- `forecast_start_date`
- `forecast_end_date`
- `forecast_direction`
- `forecast_score`
- `forecast_confidence`
- `forecast_summary`

## 6. Data Snapshot

제품이 현재 어떤 시점의 데이터를 기준으로 화면을 보여주는지 설명하는 메타 개체다.

### 역할

- 데이터 기준 시점 표시
- 예측 생성 시점 표시
- 사용자 신뢰 확보

### 예시 필드

- `snapshot_id`
- `label`
- `observed_until`
- `published_at`
- `forecast_generated_at`
- `source_note`

## 개체 간 관계

초기 관계 구조는 아래와 같이 이해할 수 있다.

- 하나의 `Disease`는 여러 `Disease Observation`을 가진다.
- 하나의 `Region`은 여러 `Disease Observation`을 가진다.
- 하나의 `Disease Observation`은 여러 `Demographic Breakdown`을 가진다.
- 하나의 `Disease`와 `Region` 조합은 여러 `Forecast`를 가진다.
- 하나의 `Data Snapshot`은 특정 시점의 관측값과 예측값 묶음을 설명한다.

핵심은 `Disease Observation`이 중심 축이라는 점이다.

현재 상태, 위험도, 추세, 상세 분석, 예측은 모두 이 중심 개체에서 출발한다.

## 주요 필드 초안

아래는 화면과 기능 정의를 위해 특히 중요한 필드들이다.

## 공통 식별 필드

- `disease_id`
- `region_id`
- `date`

이 조합은 초기 제품에서 사실상 가장 중요한 기본 키 역할을 한다.

## 지도 표현용 필드

- `risk_level`
- `observation_score`
- `trend_direction`
- `trend_delta`
- `boundary_ref`
- `center_lat`
- `center_lng`

이 필드들은 메인 지도와 요약 패널에 직접 연결된다.

## 연령/성별 분석용 필드

- `age`
- `age_band`
- `gender`
- `share_ratio`
- `relative_risk_score`

이 필드들은 상세 분석과 연령 필터에 연결된다.

## 예측용 필드

- `forecast_target_period`
- `forecast_direction`
- `forecast_score`
- `forecast_confidence`
- `forecast_summary`

이 필드들은 상세 패널의 예측 섹션에 직접 연결된다.

## 화면별 데이터 사용

## 1. 메인 지도 화면

필요 데이터:

- `Region`
- 최신 `Disease Observation`
- 현재 기준 `Data Snapshot`

사용 목적:

- 지역별 위험도 표시
- 질병별 확산 범위 표시
- 최근 변화 신호 표시

## 2. 요약 정보 영역

필요 데이터:

- 최신 `Disease Observation`
- 주요 질병별 요약 집계
- 현재 기준 `Data Snapshot`

사용 목적:

- 현재 주의 질병 요약
- 선택 지역 기준 상태 문장 생성
- 최근 변화 방향 해석

## 3. 연령 필터

필요 데이터:

- `Demographic Breakdown`

사용 목적:

- 0세부터 13세까지 1세 단위 필터링
- 선택 연령 기준 결과 갱신

## 4. 상세 분석 패널

필요 데이터:

- 기간별 `Disease Observation`
- 해당 관측값의 `Demographic Breakdown`

사용 목적:

- 추세 표시
- 속도 변화 표시
- 연령별/성별 분포 표시

## 5. 예측 섹션

필요 데이터:

- `Forecast`
- 예측 기준이 된 `Data Snapshot`

사용 목적:

- 일주일 및 한달 예측 제공
- 증가/정체/감소 해석 제공

## 예측에 필요한 데이터

초기 예측 기능을 위해 최소한 아래 데이터 축이 필요하다.

- 날짜별 관측값
- 지역별 관측값
- 질병별 관측값
- 최근 변화량 또는 추세 정보
- 연령 기준 세부 집계

초기 MVP에서는 예측 모델 자체보다, 사용자에게 의미 있는 예측 결과 구조를 먼저 고정하는 것이 중요하다.

즉, 데이터 문서에서는 "어떤 모델을 쓰는가"보다 "예측 결과가 어떤 단위로 저장되고 노출되는가"를 우선 정의한다.

## 초기 범위와 제한

초기 제품 데이터 범위는 아래 기준에 맞춘다.

- 지역: 서울특별시, 경기도
- 연령: 0세부터 13세까지
- 연령 단위: 1세
- 사용자 관점: 일반 시민이 해석 가능한 수준의 요약과 분석

현재 단계에서 이 문서는 아래 내용을 확정하지 않는다.

- 실제 데이터베이스 테이블 구조
- 외부 데이터 수집 파이프라인 상세
- 예측 알고리즘의 수학적 정의
- 고급 역학 지표의 계산 방식

## 이후 확장 방향

데이터 구조는 아래 확장을 감당할 수 있어야 한다.

### 1. 지역 확장

- 서울/경기도에서 전국으로 확장
- 시도, 시군구, 생활권 등 다양한 지역 단위 확장

### 2. 연령 확장

- 어린이 외 전 연령층 지원
- 더 넓은 연령대 집계와 비교 기능

### 3. 인구학 분석 확장

- 성별 외 추가 특성 확장
- 복합 필터 조건 지원

### 4. 예측 확장

- 더 다양한 예측 기간 지원
- 예측 근거 설명 강화
- 지역별 위험 변화 시나리오 분석

## 문서 간 관계

이 문서는 `GOAL.md`, `PRODUCT.md`, `FEATURES.md`, `IA.md`, `SCREENS.md`의 제품 정의를 데이터 구조 관점으로 연결한다.

이후 문서에서는 이를 기반으로 아래를 더 세부화할 수 있다.

- `PREDICTION.md`
- `API.md`
- `SCHEMA.md`
- `INGESTION.md`
