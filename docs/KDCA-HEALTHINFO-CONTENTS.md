# KDCA Health Info Contents

## 목적

질병관리청 국가건강정보포털 건강정보 Open API 신청 내역에 표시된 콘텐츠 ID와 URL 규칙을 PRZM 데이터 파이프라인 기준으로 정리한다.

이 문서는 API 인증 토큰을 기록하지 않는다. 실제 호출은 `.env`에 설정된 `OPENAPI_URL`을 사용하고, 콘텐츠별 상세 요청에는 `cntntsSn`만 추가한다.

```text
OPENAPI_URL&cntntsSn=<콘텐츠 ID>
```

## 출처와 기준

- 기준 화면: 질병관리청 국가건강정보포털 `Open API 신청내역 > 건강정보API > 요청 콘텐츠(XML)` 화면 캡처
- 로컬 참고 문서: `ref/openAPI_Guide.pdf`
- 문서화 날짜: 2026-04-24
- 보안 원칙: 신청 내역 화면의 `TOKEN` 값은 문서와 코드에 기록하지 않는다.

## PRZM 우선 반영 항목

아래 항목은 전염병, 감염성 질환, 감염성 기생충 질환, 식품매개 감염, 예방접종/공중보건 관점에서 PRZM의 질병 alias 후보로 우선 반영한다.

| 콘텐츠 ID | 콘텐츠 | PRZM diseaseId | 비고 |
|---:|---|---|---|
| 5423 | 감기 | `common-cold` | 소아 호흡기 증상 대표 항목 |
| 6561 | 결핵 | `tuberculosis` | 법정감염병성 모니터링 후보 |
| 5227 | 성병 | `sti` | 확장 범위 후보 |
| 6303 | 라임병 | `lyme-disease` | 매개체 감염 후보 |
| 5287 | 백일해 | `pertussis` | 소아 호흡기 감염 대표 항목 |
| 5317 | 성홍열 | `scarlet-fever` | 소아 감염 후보 |
| 5239 | 식중독 | `food-poisoning` | 식품매개 감염 후보 |
| 6313 | 야토병 | `tularemia` | 인수공통감염 후보 |
| 5341 | 장결핵 | `intestinal-tuberculosis` | 결핵 관련 확장 후보 |
| 5289 | 파상풍 | `tetanus` | 예방접종 관련 감염 후보 |
| 6314 | 페스트 | `plague` | 고위험 감염 후보 |
| 5350 | 편충증 | `whipworm` | 기생충 감염 후보 |
| 6246 | 폴리오 | `polio` | 예방접종 관련 감염 후보 |
| 5338 | 회충증 | `ascariasis` | 기생충 감염 후보 |
| 6294 | 간흡충증 | `clonorchiasis` | 기생충 감염 후보 |
| 5284 | 뇌수막염 | `meningitis` | 감염성 원인 가능 항목 |
| 5245 | 말라리아 | `malaria` | 매개체 감염 후보 |
| 5528 | 사상충증 | `filariasis` | 기생충 감염 후보 |
| 5525 | 샤가스병 | `chagas-disease` | 매개체 감염 후보 |
| 5311 | 연성하감 | `chancroid` | 성매개 감염 후보 |

## 전체 신청 콘텐츠 목록

| 페이지 | 콘텐츠 ID | 콘텐츠 | URL 템플릿 |
|---:|---:|---|---|
| 1 | 2847 | 사무용품에 의한 오존,휘발성유기화합물(VOCs), 중금속 | `OPENAPI_URL&cntntsSn=2847` |
| 1 | 5423 | 감기 | `OPENAPI_URL&cntntsSn=5423` |
| 1 | 6543 | 객혈 | `OPENAPI_URL&cntntsSn=6543` |
| 1 | 1344 | 건선 | `OPENAPI_URL&cntntsSn=1344` |
| 1 | 6561 | 결핵 | `OPENAPI_URL&cntntsSn=6561` |
| 1 | 5463 | 골절 | `OPENAPI_URL&cntntsSn=5463` |
| 1 | 5841 | 구취 | `OPENAPI_URL&cntntsSn=5841` |
| 1 | 5493 | 기흉 | `OPENAPI_URL&cntntsSn=5493` |
| 2 | 1743 | 낙상 | `OPENAPI_URL&cntntsSn=1743` |
| 2 | 5226 | 노안 | `OPENAPI_URL&cntntsSn=5226` |
| 2 | 6670 | 동상 | `OPENAPI_URL&cntntsSn=6670` |
| 2 | 5830 | 두통 | `OPENAPI_URL&cntntsSn=5830` |
| 2 | 5705 | 목쉼 | `OPENAPI_URL&cntntsSn=5705` |
| 2 | 5713 | 발치 | `OPENAPI_URL&cntntsSn=5713` |
| 2 | 5827 | 변비 | `OPENAPI_URL&cntntsSn=5827` |
| 2 | 1081 | 복통 | `OPENAPI_URL&cntntsSn=1081` |
| 3 | 6544 | 부종 | `OPENAPI_URL&cntntsSn=6544` |
| 3 | 6694 | 비만 | `OPENAPI_URL&cntntsSn=6694` |
| 3 | 1104 | 빈혈 | `OPENAPI_URL&cntntsSn=1104` |
| 3 | 5370 | 사시 | `OPENAPI_URL&cntntsSn=5370` |
| 3 | 1667 | 설사 | `OPENAPI_URL&cntntsSn=1667` |
| 3 | 5227 | 성병 | `OPENAPI_URL&cntntsSn=5227` |
| 3 | 6444 | 수혈 | `OPENAPI_URL&cntntsSn=6444` |
| 3 | 5694 | 습진 | `OPENAPI_URL&cntntsSn=5694` |
| 4 | 5853 | 실신 | `OPENAPI_URL&cntntsSn=5853` |
| 4 | 5679 | 열상 | `OPENAPI_URL&cntntsSn=5679` |
| 4 | 5441 | 염좌 | `OPENAPI_URL&cntntsSn=5441` |
| 4 | 3796 | 요통 | `OPENAPI_URL&cntntsSn=3796` |
| 4 | 5422 | 욕창 | `OPENAPI_URL&cntntsSn=5422` |
| 4 | 5293 | 운동 | `OPENAPI_URL&cntntsSn=5293` |
| 4 | 6777 | 위염 | `OPENAPI_URL&cntntsSn=6777` |
| 4 | 5297 | 음주 | `OPENAPI_URL&cntntsSn=5297` |
| 5 | 5706 | 이명 | `OPENAPI_URL&cntntsSn=5706` |
| 5 | 5430 | 입덧 | `OPENAPI_URL&cntntsSn=5430` |
| 5 | 6583 | 조산 | `OPENAPI_URL&cntntsSn=6583` |
| 5 | 5960 | 질염 | `OPENAPI_URL&cntntsSn=5960` |
| 5 | 5466 | 천식 | `OPENAPI_URL&cntntsSn=5466` |
| 5 | 6288 | 충치 | `OPENAPI_URL&cntntsSn=6288` |
| 6 | 6732 | 통풍 | `OPENAPI_URL&cntntsSn=6732` |
| 6 | 6538 | 피임 | `OPENAPI_URL&cntntsSn=6538` |
| 6 | 6584 | 화상 | `OPENAPI_URL&cntntsSn=6584` |
| 6 | 5462 | 황달 | `OPENAPI_URL&cntntsSn=5462` |
| 6 | 5337 | 흉통 | `OPENAPI_URL&cntntsSn=5337` |
| 6 | 5299 | 흡연 | `OPENAPI_URL&cntntsSn=5299` |
| 6 | 1241 | 간농양 | `OPENAPI_URL&cntntsSn=1241` |
| 6 | 2367 | 건막염 | `OPENAPI_URL&cntntsSn=2367` |
| 7 | 5304 | 고혈당 | `OPENAPI_URL&cntntsSn=5304` |
| 7 | 5300 | 고혈압 | `OPENAPI_URL&cntntsSn=5300` |
| 7 | 5290 | 골수염 | `OPENAPI_URL&cntntsSn=5290` |
| 7 | 6786 | 구개열 | `OPENAPI_URL&cntntsSn=6786` |
| 7 | 5485 | 구내염 | `OPENAPI_URL&cntntsSn=5485` |
| 7 | 6690 | 녹내장 | `OPENAPI_URL&cntntsSn=6690` |
| 7 | 2087 | 농가진 | `OPENAPI_URL&cntntsSn=2087` |
| 7 | 5961 | 뇌전증 | `OPENAPI_URL&cntntsSn=5961` |
| 8 | 5495 | 뇌졸중 | `OPENAPI_URL&cntntsSn=5495` |
| 8 | 5860 | 다한증 | `OPENAPI_URL&cntntsSn=5860` |
| 8 | 5821 | 담관염 | `OPENAPI_URL&cntntsSn=5821` |
| 8 | 5820 | 담낭염 | `OPENAPI_URL&cntntsSn=5820` |
| 8 | 6735 | 담석증 | `OPENAPI_URL&cntntsSn=6735` |
| 8 | 5305 | 당뇨병 | `OPENAPI_URL&cntntsSn=5305` |
| 8 | 6252 | 딸꾹질 | `OPENAPI_URL&cntntsSn=6252` |
| 8 | 6303 | 라임병 | `OPENAPI_URL&cntntsSn=6303` |
| 9 | 176 | 말더듬 | `OPENAPI_URL&cntntsSn=176` |
| 9 | 5357 | 모소낭 | `OPENAPI_URL&cntntsSn=5357` |
| 9 | 5700 | 무월경 | `OPENAPI_URL&cntntsSn=5700` |
| 9 | 6304 | 미숙아 | `OPENAPI_URL&cntntsSn=6304` |
| 9 | 5968 | 방광염 | `OPENAPI_URL&cntntsSn=5968` |
| 9 | 6689 | 백내장 | `OPENAPI_URL&cntntsSn=6689` |
| 9 | 6699 | 백반증 | `OPENAPI_URL&cntntsSn=6699` |
| 9 | 5688 | 백선증 | `OPENAPI_URL&cntntsSn=5688` |
| 10 | 5287 | 백일해 | `OPENAPI_URL&cntntsSn=5287` |
| 10 | 6749 | 변실금 | `OPENAPI_URL&cntntsSn=6749` |
| 10 | 1102 | 부정맥 | `OPENAPI_URL&cntntsSn=1102` |
| 10 | 5285 | 불명열 | `OPENAPI_URL&cntntsSn=5285` |
| 10 | 5429 | 불임증 | `OPENAPI_URL&cntntsSn=5429` |
| 10 | 6278 | 뼈스캔 | `OPENAPI_URL&cntntsSn=6278` |
| 10 | 5714 | 사랑니 | `OPENAPI_URL&cntntsSn=5714` |
| 10 | 6537 | 사마귀 | `OPENAPI_URL&cntntsSn=6537` |
| 11 | 5698 | 생리통 | `OPENAPI_URL&cntntsSn=5698` |
| 11 | 6259 | 성폭력 | `OPENAPI_URL&cntntsSn=6259` |
| 11 | 5317 | 성홍열 | `OPENAPI_URL&cntntsSn=5317` |
| 11 | 6545 | 손씻기 | `OPENAPI_URL&cntntsSn=6545` |
| 11 | 5239 | 식중독 | `OPENAPI_URL&cntntsSn=5239` |
| 11 | 5859 | 실어증 | `OPENAPI_URL&cntntsSn=5859` |
| 11 | 2967 | 심낭염 | `OPENAPI_URL&cntntsSn=2967` |
| 11 | 5365 | 심박기 | `OPENAPI_URL&cntntsSn=5365` |
| 12 | 3828 | 심부전 | `OPENAPI_URL&cntntsSn=3828` |
| 12 | 6307 | 심잡음 | `OPENAPI_URL&cntntsSn=6307` |
| 12 | 1141 | 액취증 | `OPENAPI_URL&cntntsSn=1141` |
| 12 | 6313 | 야토병 | `OPENAPI_URL&cntntsSn=6313` |
| 12 | 6550 | 어지럼 | `OPENAPI_URL&cntntsSn=6550` |
| 12 | 3947 | 여드름 | `OPENAPI_URL&cntntsSn=3947` |
| 12 | 5353 | 영양제 | `OPENAPI_URL&cntntsSn=5353` |
| 12 | 5822 | 요실금 | `OPENAPI_URL&cntntsSn=5822` |
| 13 | 5347 | 요충증 | `OPENAPI_URL&cntntsSn=5347` |
| 13 | 5294 | 우울감 | `OPENAPI_URL&cntntsSn=5294` |
| 13 | 2247 | 위용종 | `OPENAPI_URL&cntntsSn=2247` |
| 13 | 5811 | 유루증 | `OPENAPI_URL&cntntsSn=5811` |
| 13 | 5683 | 유방통 | `OPENAPI_URL&cntntsSn=5683` |
| 13 | 6302 | 유비저 | `OPENAPI_URL&cntntsSn=6302` |
| 13 | 5680 | 유선염 | `OPENAPI_URL&cntntsSn=5680` |
| 13 | 6315 | 이갈이 | `OPENAPI_URL&cntntsSn=6315` |
| 14 | 6154 | 입냄새 | `OPENAPI_URL&cntntsSn=6154` |
| 14 | 5341 | 장결핵 | `OPENAPI_URL&cntntsSn=5341` |
| 14 | 5224 | 저시력 | `OPENAPI_URL&cntntsSn=5224` |
| 14 | 5415 | 저신장 | `OPENAPI_URL&cntntsSn=5415` |
| 14 | 5259 | 저혈압 | `OPENAPI_URL&cntntsSn=5259` |
| 14 | 5480 | 조루증 | `OPENAPI_URL&cntntsSn=5480` |
| 14 | 3568 | 중이염 | `OPENAPI_URL&cntntsSn=3568` |
| 14 | 5852 | 직장염 | `OPENAPI_URL&cntntsSn=5852` |
| 15 | 5248 | 췌장염 | `OPENAPI_URL&cntntsSn=5248` |
| 15 | 5362 | 코골이 | `OPENAPI_URL&cntntsSn=5362` |
| 15 | 5289 | 파상풍 | `OPENAPI_URL&cntntsSn=5289` |
| 15 | 5240 | 패혈증 | `OPENAPI_URL&cntntsSn=5240` |
| 15 | 6314 | 페스트 | `OPENAPI_URL&cntntsSn=6314` |
| 15 | 5707 | 편도염 | `OPENAPI_URL&cntntsSn=5707` |
| 15 | 6557 | 편두통 | `OPENAPI_URL&cntntsSn=6557` |
| 15 | 5350 | 편충증 | `OPENAPI_URL&cntntsSn=5350` |
| 16 | 5702 | 폐경기 | `OPENAPI_URL&cntntsSn=5702` |
| 16 | 3167 | 폐부종 | `OPENAPI_URL&cntntsSn=3167` |
| 16 | 5529 | 포충증 | `OPENAPI_URL&cntntsSn=5529` |
| 16 | 6246 | 폴리오 | `OPENAPI_URL&cntntsSn=6246` |
| 16 | 6475 | 항생제 | `OPENAPI_URL&cntntsSn=6475` |
| 16 | 6317 | 혈관종 | `OPENAPI_URL&cntntsSn=6317` |
| 16 | 6566 | 협심증 | `OPENAPI_URL&cntntsSn=6566` |
| 16 | 5338 | 회충증 | `OPENAPI_URL&cntntsSn=5338` |
| 17 | 5695 | 가려움증 | `OPENAPI_URL&cntntsSn=5695` |
| 17 | 6456 | 각막이식 | `OPENAPI_URL&cntntsSn=6456` |
| 17 | 6560 | 간경변증 | `OPENAPI_URL&cntntsSn=6560` |
| 17 | 1281 | 간접흡연 | `OPENAPI_URL&cntntsSn=1281` |
| 17 | 6294 | 간흡충증 | `OPENAPI_URL&cntntsSn=6294` |
| 17 | 1322 | 갑상선염 | `OPENAPI_URL&cntntsSn=1322` |
| 17 | 6752 | 건강노화 | `OPENAPI_URL&cntntsSn=6752` |
| 17 | 1738 | 골감소증 | `OPENAPI_URL&cntntsSn=1738` |
| 18 | 1988 | 골관절염 | `OPENAPI_URL&cntntsSn=1988` |
| 18 | 5833 | 골다공증 | `OPENAPI_URL&cntntsSn=5833` |
| 18 | 6300 | 골수검사 | `OPENAPI_URL&cntntsSn=6300` |
| 18 | 6542 | 근관치료 | `OPENAPI_URL&cntntsSn=6542` |
| 18 | 5963 | 뇌동맥류 | `OPENAPI_URL&cntntsSn=5963` |
| 18 | 6569 | 뇌성마비 | `OPENAPI_URL&cntntsSn=6569` |
| 18 | 5284 | 뇌수막염 | `OPENAPI_URL&cntntsSn=5284` |
| 18 | 6579 | 다태임신 | `OPENAPI_URL&cntntsSn=6579` |
| 19 | 1746 | 대동맥류 | `OPENAPI_URL&cntntsSn=1746` |
| 19 | 6531 | 대장용종 | `OPENAPI_URL&cntntsSn=6531` |
| 19 | 5220 | 덧눈꺼풀 | `OPENAPI_URL&cntntsSn=5220` |
| 19 | 6 | 두근거림 | `OPENAPI_URL&cntntsSn=6` |
| 19 | 6581 | 두드러기 | `OPENAPI_URL&cntntsSn=6581` |
| 19 | 5703 | 만성비염 | `OPENAPI_URL&cntntsSn=5703` |
| 19 | 5245 | 말라리아 | `OPENAPI_URL&cntntsSn=5245` |
| 19 | 6319 | 망막박리 | `OPENAPI_URL&cntntsSn=6319` |
| 20 | 5824 | 발기부전 | `OPENAPI_URL&cntntsSn=5824` |
| 20 | 6459 | 복막투석 | `OPENAPI_URL&cntntsSn=6459` |
| 20 | 5445 | 복수검사 | `OPENAPI_URL&cntntsSn=5445` |
| 20 | 5543 | 부위마취 | `OPENAPI_URL&cntntsSn=5543` |
| 20 | 6572 | 불소도포 | `OPENAPI_URL&cntntsSn=6572` |
| 20 | 5528 | 사상충증 | `OPENAPI_URL&cntntsSn=5528` |
| 20 | 5525 | 샤가스병 | `OPENAPI_URL&cntntsSn=5525` |
| 20 | 1729 | 성대결절 | `OPENAPI_URL&cntntsSn=1729` |
| 21 | 1807 | 성조숙증 | `OPENAPI_URL&cntntsSn=1807` |
| 21 | 6293 | 세포검사 | `OPENAPI_URL&cntntsSn=6293` |
| 21 | 5807 | 소변검사 | `OPENAPI_URL&cntntsSn=5807` |
| 21 | 5729 | 소아발진 | `OPENAPI_URL&cntntsSn=5729` |
| 21 | 6263 | 소화불량 | `OPENAPI_URL&cntntsSn=6263` |
| 21 | 5838 | 수질오염 | `OPENAPI_URL&cntntsSn=5838` |
| 21 | 5366 | 시신경염 | `OPENAPI_URL&cntntsSn=5366` |
| 21 | 5298 | 식이영양 | `OPENAPI_URL&cntntsSn=5298` |
| 22 | 5433 | 신장결석 | `OPENAPI_URL&cntntsSn=5433` |
| 22 | 6533 | 아동학대 | `OPENAPI_URL&cntntsSn=6533` |
| 22 | 5527 | 약구충증 | `OPENAPI_URL&cntntsSn=5527` |
| 22 | 5857 | 안면홍조 | `OPENAPI_URL&cntntsSn=5857` |
| 22 | 5806 | 알레르기 | `OPENAPI_URL&cntntsSn=5806` |
| 22 | 4027 | 언어장애 | `OPENAPI_URL&cntntsSn=4027` |
| 22 | 1201 | 얼굴마비 | `OPENAPI_URL&cntntsSn=1201` |
| 22 | 5311 | 연성하감 | `OPENAPI_URL&cntntsSn=5311` |

## 반영 방식

- `scripts/ingestion/lib/kdcaHealthInfoContents.mjs`는 대표 전염병성 콘텐츠 ID와 PRZM `diseaseId` 매핑을 가진다.
- `scripts/ingestion/lib/pipeline.mjs`는 대표 전염병성 콘텐츠명을 질병 alias로 인식한다.
- 실제 API 응답의 필드명과 XML/JSON 변환 형태는 인증 URL로 샘플 호출 후 source preset에서 별도 보정한다.
