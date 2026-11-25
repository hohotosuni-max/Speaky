# 🗣️ Speaky — 매일 5분 영어 말하기 (PWA)

성인과 아이가 **한 앱에서 모드를 바꿔가며** 쓰는 스픽(Speak) 스타일 영어 말하기 앱입니다.
API 키가 없어도 바로 체험할 수 있는 **데모 모드**가 기본이고, 설정에서 OpenAI 키를 넣으면 **실전 AI 모드**로 동작합니다.

---

## ✨ 기능 한눈에

| 구분 | 성인 모드 👩 | 아이 모드 🐥 |
|---|---|---|
| 상황 | 카페 · 여행/공항 · 호텔 · 병원/약국 · 쇼핑 · 스몰토크 | Book Club · Science & Wonder · Show & Tell · Opinion & Debate · Game Guide |
| 속도 | 1.0x 기본 (원어민 속도) | 1.0x 기본 (자연스러운 원어민 속도, 0.8x는 선택) |
| 수준 | 실용 회화 | 초등 **바이링구어** — 스토리·토론·발표·호기심 |
| 피드백 | 실용적인 표현 교정 | 더 세련되고 논리적인 표현으로 다듬기 + 꼬리 질문 |
| 분위기 | 보라색 · 차분한 카드 | 주황/노랑 · 둥글둥글 |

### ① 따라 말하기 (Speak Drill)
- 상황별 핵심 문장 **5개** — 영어 문장 + 한국어 뜻 + 뉘앙스/표현 팁
- 아이 모드는 유아용 단어·짧은 문장 대신 바이링구어 초등 수준의 스토리·토론·발표 표현
- 원어민 음성 **0.8x / 1.0x** 재생 (기본은 `speechSynthesis`, AI 모드에서는 OpenAI TTS)
- 마이크로 따라 말하면 **단어 단위 비교** — 맞은 단어(초록) · 비슷한 단어(노랑) · 놓친 단어(취소선) 하이라이트 + 0~100점 + 격려 피드백
- 85점 이상이면 ⭐ 별 적립 (기기에 저장)

### ② AI 롤플레이 (Roleplay)
- 상황 카드를 고르면 AI 튜터가 **영어로 먼저 말을 검**
- 마이크 또는 텍스트로 답하면 AI가 대화를 이어감
- 내 문장마다 **교정 카드**: 내가 한 말 ↔ 더 자연스러운 표현 + 짧은 한국어 설명 + 따라 말해보기
- **힌트 버튼**: "뭐라고 말할지 막힐 때" 추천 문장 2개 (듣기 / 입력창에 넣기)

---

## 🧪 검증

```bash
node --check js/*.js api/*.js server.js sw.js   # 문법 검사
python3 tools/e2e-check.py       # 실제 Chromium(iPhone 430×932) 49개 체크 + 스크린샷
python3 tools/check-kid-ai.py    # 아이 모드 AI 프롬프트/교정 경로 11개 체크 (OpenAI 호출 없이 스텁)
python3 tools/make-preview.py    # browser/shots → downloads/english-app-preview.png
```

검증 스크립트는 Playwright + Chromium이 필요합니다. `playwright install chromium` 후 표준 위치에 설치되었다면 추가 설정이 필요 없고, 브라우저나 라이브러리를 다른 위치에 두었다면 `PLAYWRIGHT_BROWSERS_PATH` 같은 환경변수로 경로를 지정해 주세요.

---

## 📁 파일 구조

```
english-speaking-app/
├── index.html              # 앱 화면 (헤더·모드 전환·탭·카드·채팅·설정 시트)
├── css/styles.css          # 모바일 UI. 성인/아이 테마 변수, 마이크 파형, 교정 배지
├── js/
│   ├── data.js             # 성인/아이 상황·문장·롤플레이 대본·피드백 문구
│   ├── diff.js             # 발화 비교(LCS 정렬·근접 단어) 채점 + 규칙 기반 문장 교정
│   ├── speech.js           # TTS(speechSynthesis) · STT(Web Speech) · MediaRecorder(녹음)
│   ├── demo-ai.js          # API 없이 동작하는 상황별 데모 대화 엔진
│   ├── ai.js               # OpenAI 연동 (Whisper · gpt-4o-mini · TTS) + 서버 모드
│   └── app.js              # 화면 상태·이벤트·렌더링·설정
├── manifest.json           # PWA 매니페스트 (아이콘·standalone·테마)
├── sw.js                   # 서비스 워커 (앱 셸 오프라인 캐시)
├── icons/                  # 앱 아이콘 (192/512/maskable/apple-touch 180/favicon)
├── tools/
│   ├── make-icons.py       # 아이콘 생성 스크립트 (Pillow)
│   ├── e2e-check.py        # Playwright 실제 브라우저 검증 (49개 체크 + 스크린샷)
│   ├── check-kid-ai.py     # 아이 모드 AI 프롬프트/교정 경로 검증 (11개 체크)
│   └── make-preview.py     # 스크린샷 → 미리보기 콜라주
├── api/                    # Vercel 서버리스 함수 (키를 서버에 숨김)
│   ├── chat.js             # POST /api/chat        → gpt-4o-mini (JSON 응답)
│   ├── transcribe.js       # POST /api/transcribe  → whisper-1
│   ├── tts.js              # POST /api/tts         → tts-1 (mp3)
│   └── health.js           # GET  /api/health      → 서버 모드 자동 감지
├── server.js               # 로컬 개발 서버 (정적 파일 + /api/*, .env 로드)
├── package.json
├── .env.example
└── README.md
```

---

## 🚀 바로 실행하기

### 1) 가장 간단한 방법 (데모 모드)
정적 파일만 있으면 됩니다. 폴더에서 아무 정적 서버나 띄우세요.

```bash
cd english-speaking-app
python3 -m http.server 8000
# → http://localhost:8000
```

> `file://`로 열면 마이크·서비스워커가 동작하지 않습니다. 꼭 `http://localhost` 또는 HTTPS로 여세요.

### 2) Node 개발 서버 (AI 서버 모드까지)
Node 18 이상에서:

```bash
cd english-speaking-app
cp .env.example .env      # OPENAI_API_KEY=sk-... 입력
node server.js            # → http://localhost:3000
```

`.env`에 키가 있으면 설정에서 **"배포 서버 사용"** 을 고를 수 있습니다.

---

## 📱 아이폰에서 앱처럼 쓰기

1. iPhone **Safari**로 앱 주소를 엽니다. (Vercel 배포 주소 또는 같은 Wi-Fi에서 `http://<PC-IP>:8000`)
2. 하단 **공유 버튼 (□↑)** → **"홈 화면에 추가"**
3. 홈 화면의 **Speaky 아이콘**을 누르면 주소창 없이 앱처럼 전체 화면으로 열립니다.
   - `manifest.json`의 `display: standalone`, `apple-mobile-web-app-capable`, `apple-touch-icon.png`(180×180) 적용됨

> 마이크는 HTTPS에서만 허용됩니다. 로컬 테스트는 `localhost`(허용), 아이폰 실기기는 **Vercel 배포 주소(HTTPS)** 를 쓰는 게 가장 편합니다.

### 아이폰 음성 관련 팁
- **듣기**: iOS의 `speechSynthesis`는 영어 목소리가 필요합니다. `설정 › 손쉬운 사용 › 콘텐츠 말하기 › 음성`에서 영어(Samantha 등)를 받아두면 더 자연스럽습니다.
- **말하기(인식)**:
  - Web Speech API가 되는 기기/브라우저에서는 바로 인식됩니다.
  - iOS Safari에서 인식이 안 되면 **OpenAI 키 모드**에서 `MediaRecorder`로 녹음 → **Whisper**가 받아 적습니다.
  - 둘 다 안 되면 **"음성 인식이 안 되나요? 텍스트로 입력"** 으로 그대로 연습할 수 있습니다. (학습 효과는 동일)

---

## ☁️ Vercel 배포 (권장: API 키 숨기기)

```bash
npm i -g vercel
vercel
```

1. 프로젝트 루트가 `english-speaking-app` 폴더인지 확인
2. Vercel 대시보드 → **Settings → Environment Variables**
   - `OPENAI_API_KEY` = `sk-...` 추가 (Production / Preview)
3. 재배포 후 앱 → ⚙️ 설정 → **"배포 서버 사용"** 선택
   - 앱이 `/api/health`로 서버를 자동 감지합니다. 키는 브라우저로 내려오지 않습니다.

> `api/` 폴더는 Vercel이 자동으로 서버리스 함수로 인식합니다. 별도 `vercel.json` 없이 동작합니다.

---

## 🔐 AI 모드 3가지

| 모드 | 동작 | 키 위치 | 용도 |
|---|---|---|---|
| **데모** (기본) | 내장 상황 엔진 + 규칙 교정 + 기기 TTS | 없음 | 바로 체험, 오프라인 |
| **내 OpenAI 키** | 브라우저에서 직접 Whisper·GPT·TTS 호출 | 브라우저 localStorage | 개인용 빠른 테스트 |
| **배포 서버** | `/api/*` 서버리스 함수 경유 | 서버 환경변수 | 실제 배포·공유용 (권장) |

⚠️ **브라우저 키 모드**는 키가 기기 localStorage에 저장되고 요청에 실려 나갑니다. 공용 기기에서는 쓰지 말고, 배포용은 반드시 **서버 모드**를 쓰세요.

---

## 🧪 동작 확인 결과 (실제 Chromium · iPhone 430×932 뷰포트)

`python3 tools/e2e-check.py` → **43/43 통과**

> 검증 스크립트를 다시 돌리려면: `pip install playwright && playwright install chromium`

| 영역 | 확인한 것 |
|---|---|
| 모드 | 성인(6상황) ↔ 아이(5상황) 전환, 테마·문장·기본 속도(1.0x/0.8x) 변경 |
| 따라 말하기 | 문장 재생, 발화 제출 → **95점**, 맞은 단어 8개·근접 단어 하이라이트, 격려 문구, 별 적립 |
| AI 롤플레이 | 아이: "i want a chocolate ice cream" → AI 응답 + 교정 카드("I'd like a chocolate ice cream.") + 한국어 설명 |
| | 성인: "could i get a latte" → "Could I get a latte, please?" 교정 |
| 힌트 | 추천 문장 3개, 🔈 듣기 / 쓰기(입력창 채움) |
| 설정 | AI 모드 3종, API 키 입력·저장(localStorage), 음성 테스트 |
| PWA | 서비스워커 등록·제어, 새로고침 후 별 기록 유지, **오프라인에서도 앱 열림** |
| 아이콘 | manifest 아이콘 4종 200 응답, `apple-touch-icon` 180×180 실제 PNG, `apple-mobile-web-app-title=Speaky` |
| 품질 | 콘솔 에러 0 · 페이지 예외 0 · 실패 요청 0 · 가로 스크롤 0 |

부가 검증
- 모든 JS/서버 파일 `node --check` 통과
- `node server.js` 실행 → `/api/health` `{ok:true, hasKey:false}`, 정적 파일 200, 키 없을 때 `/api/chat` 안내 JSON
- AI 서버가 없을 때 자동으로 데모 대화로 폴백(콘솔 에러 없음)

스크린샷: `browser/shots/01~07` · 콜라주 `downloads/english-app-preview.png`

> 실시간 OpenAI 호출(Whisper·GPT·TTS)은 실제 키가 필요해 미검증입니다. 키를 넣으면 설정 화면에서 연결 상태를 확인할 수 있습니다.

---

## 📝 참고

- 모든 학습 기록은 기기 localStorage에만 저장됩니다.
- 데모 모드에서는 음성이 외부로 전송되지 않습니다. (AI 모드에서만 OpenAI로 전송)
- 콘텐츠(문장·대본)는 `js/data.js`에서 쉽게 추가·수정할 수 있습니다.
