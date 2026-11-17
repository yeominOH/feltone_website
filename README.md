# Feltone 웹사이트

Feltone 회사 소개 사이트 (1차 오픈 버전)

## 폴더 구성

| 파일 · 폴더 | 내용 |
|---|---|
| `index.html` | 메인 (회사 소개) |
| `product.html` | 제품 소개 (출시 예정) |
| `support.html` | 고객지원 (FAQ · 문의) |
| `privacy.html` | 개인정보처리방침 (초안) |
| `css/style.css` | 모든 페이지의 디자인 (색 · 글꼴 · 간격) |
| `js/main.js` | 데모 플레이어 · 소식 받기 양식 동작 |
| `audio/` | 데모 음원을 넣는 곳 |
| `images/` | 이미지를 넣는 곳 |

## 수정하는 법

- **문구**: 각 `.html` 파일에서 글자를 찾아(Ctrl+F) 고치고 저장
- **색 · 글꼴**: `css/style.css` 맨 위 `:root` 안의 값만 고치면 전체에 적용
- **헤더 · 푸터**: 네 개의 `.html` 파일에 똑같이 들어 있어서, 바꿀 때는 네 군데 모두 고쳐야 해요

## 아직 채워야 할 것

`[ ]` 대괄호로 표시된 곳이 아직 비어 있는 자리예요. Ctrl+Shift+F(전체 검색)로 `[`를 검색하면 한 번에 찾을 수 있어요.

- 데모 음원: `audio/` 폴더에 넣고, `index.html`의 `data-src-original` / `data-src-converted`와 `product.html`의 `data-src`에 경로 입력
- 소식 받기: 뉴스레터 서비스를 정하면 `form`의 `data-endpoint`에 주소 입력 (비어 있으면 '준비 중' 안내만 나와요)
- SNS 주소, 이메일 주소
- 개인정보처리방침의 빈칸
