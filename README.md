# 🍁 메이플 캐릭터 메이커 (게임창 스타일)

메이플스토리 풍 캐릭터를 디자인하는 웹 빌더입니다.
**세계관 · 외형 · 스킬 · 역할**을 입력하면 실시간으로 캐릭터 카드가 조립되고,
**AI 이미지 생성 프롬프트(영어)** 와 **한국어 설정 요약**을 만들어 줍니다.

> Claude Design 프로토타입(`builder-window.html`, 시안 B)을 **React + Vite** 로 픽셀 단위 재현한 버전입니다.
> AI 완성 기능은 **Supabase Edge Function(서버측 Google Gemini)** 으로 동작합니다.

---

## ✨ 기능

- **5단계 탭 위저드** — 세계관 → 외형 → 스킬 → 역할 → 프롬프트
- **실시간 미리보기** — 입력하는 대로 좌측 초상화·배지·완성도 게이지가 갱신
- **영감용 추천 칩** — 클릭으로 자유 입력란을 빠르게 채움
- **✨ AI로 완성** — 빈 항목까지 상상해 이미지 프롬프트 + 설정 요약을 다듬음 (Gemini)
- **🎨 생성하기** — 완성된 프롬프트로 **이미지를 생성해 초상화(①)에 바로 적용** (Gemini 이미지 모델)
- **🖐 크기·위치 조정** — 초상화 이미지를 드래그로 이동, 휠/±로 확대·축소 (PDF·HTML에도 그대로 반영)
- **🖼 캐릭터 이미지 추가** — 드래그 · 클릭 업로드 · 붙여넣기(⌘V/Ctrl+V), 자동 축소 후 내장
- **📋 복사 · 📄 PDF · 💾 HTML** — 이미지까지 내장된 자체 완결형 캐릭터 시트 저장
- **자동 저장** — 입력값을 localStorage 에 보관(새로고침해도 유지)
- 떨어지는 단풍잎 배경 (`prefers-reduced-motion` 존중)

---

## 🚀 빠른 시작

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

> AI 완성 기능을 설정하지 않아도 앱은 **내장 오프라인 빌더**로 즉시 동작합니다.
> (‘AI로 완성’이 결정론적 프롬프트/요약을 생성)

---

## 🤖 AI 완성 설정 (Supabase Edge Function + Google Gemini)

Google/Gemini API 키는 **브라우저에 노출되면 안 되므로** Supabase Edge Function(서버)에
시크릿으로 보관하고, 프론트엔드는 그 함수만 호출합니다.

### 1) Google Gemini API 키 발급
[Google AI Studio](https://aistudio.google.com/apikey) 에서 API 키를 발급합니다.

### 2) Supabase 프로젝트 준비 & 함수 배포
```bash
# Supabase CLI 설치 후
supabase login
supabase link --project-ref <YOUR-PROJECT-REF>

# 🔑 Gemini 키를 서버 시크릿으로 저장 (브라우저로 절대 노출되지 않음)
supabase secrets set GEMINI_API_KEY=AIza...your-key
# (선택) 모델 변경
# supabase secrets set GEMINI_MODEL=gemini-2.5-flash              # 텍스트
# supabase secrets set GEMINI_IMAGE_MODEL=gemini-2.5-flash-image  # 이미지

# 엣지 펑션 2개 배포
supabase functions deploy refine          # ✨ AI로 완성 (텍스트 프롬프트/요약)
supabase functions deploy generate-image  # 🎨 생성하기 (프롬프트→이미지)
```

### 3) 프론트엔드 환경변수
`.env.example` 을 `.env` 로 복사하고 값을 채웁니다.
```bash
cp .env.example .env
```
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-SUPABASE-ANON-PUBLIC-KEY   # anon(public) 키만!
```
> `VITE_` 변수는 빌드 결과에 포함됩니다. **anon(public) 키만** 넣고,
> Gemini 키 같은 비밀값은 절대 여기에 두지 마세요.

설정이 끝나면 ‘✨ AI로 완성’이 Gemini 텍스트를, ‘🎨 생성하기’가 Gemini 이미지를 사용합니다.
- **AI로 완성(텍스트)**: 함수 미설정·오류·타임아웃이면 자동으로 오프라인 빌더로 폴백.
- **생성하기(이미지)**: 서버 설정이 필요(오프라인 폴백 없음). 미설정 시 ‘직접 업로드’로 유도하는 안내가 뜹니다.

---

## 🗂 프로젝트 구조

```
.
├─ index.html                  # Vite 진입점 (Google Fonts 포함)
├─ vite.config.js
├─ .env.example                # 프론트 환경변수 템플릿
├─ src/
│  ├─ main.jsx                 # React 부트스트랩
│  ├─ App.jsx                  # 상태·액션 오케스트레이션
│  ├─ styles.css               # 프로토타입 CSS (픽셀 동일)
│  ├─ core/                    # 순수 로직 (UI 비의존)
│  │  ├─ state.js              # 데이터 모델·라벨·LS 키
│  │  ├─ suggest.js            # 추천칩·예시 스킬
│  │  ├─ completion.js         # 완성도 계산
│  │  ├─ prompt.js             # 결정론적 프롬프트/요약 (미리보기·폴백)
│  │  ├─ swatch.js             # 컬러 텍스트 → 대표색
│  │  ├─ transform.js          # 초상화 프레이밍(크기·위치) 수학
│  │  ├─ imageCompose.js       # 프레이밍 캔버스 합성 (export WYSIWYG)
│  │  ├─ clipboard.js          # 복사
│  │  ├─ image.js              # 이미지 축소(data URL)
│  │  ├─ sheet.js              # 캐릭터 시트 PDF/HTML 다운로드
│  │  ├─ refine.js             # 텍스트 다듬기 엣지 펑션 + 오프라인 폴백
│  │  └─ generateImage.js      # 이미지 생성 엣지 펑션 호출
│  ├─ hooks/
│  │  ├─ usePersistentState.js # localStorage 자동 저장/복원 (디바운스)
│  │  ├─ usePasteImage.js      # 붙여넣기 이미지 처리
│  │  ├─ useImageFraming.js    # 드래그 이동 + 휠/± 줌
│  │  └─ useToast.js           # 토스트
│  └─ components/
│     ├─ TitleBar.jsx  Portrait.jsx  TabStrip.jsx  FootBar.jsx
│     ├─ FallingLeaves.jsx  Toast.jsx  Field.jsx  ChipRow.jsx  LeafIcon.jsx
│     └─ tabs/ Worldview·Appearance·Skills·Role·PromptTab.jsx
└─ supabase/
   └─ functions/
      ├─ refine/index.ts          # 서버측 Gemini 텍스트 다듬기
      └─ generate-image/index.ts  # 서버측 Gemini 이미지 생성
```

---

## 🌐 배포 (정적 호스팅)

`npm run build` 결과(`dist/`)를 GitHub Pages / Netlify / Vercel 등에 올리면 됩니다.

- **GitHub Pages** 등 서브패스(`/저장소명/`)에 올릴 경우 `vite.config.js` 의
  `base` 를 `"/저장소명/"` 으로 바꾸세요. (현재 기본값 `"./"` 로 상대경로 빌드)
- 배포한 정적 사이트의 도메인을 Supabase Edge Function CORS 에서 허용해야 한다면
  `supabase/functions/refine/index.ts` 의 `Access-Control-Allow-Origin` 을 조정하세요.
  (현재 `*` 로 모든 출처 허용)

---

## 📝 비고

- 정식 메이플스토리 로고/게임 UI는 상표 문제로 복제하지 않고,
  **단풍잎 모티프 + 주황·크림 팔레트**로 오리지널 비주얼을 구성했습니다.
- 글꼴: Jua(제목) · Gowun Dodum(본문) · Gamja Flower(손글씨) — Google Fonts.
