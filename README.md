# 🎨 AI Virtual Museum

> **AI와 3D 가상 미술관을 결합한 인터랙티브 미술 감상 플랫폼**

AI Virtual Museum은 **3D 가상 미술관에서 작품을 직접 감상하고, AI와 대화하며 자신의 해석을 확장할 수 있는 인터랙티브 미술 감상 서비스**입니다.

단순히 작품 정보를 보여주는 기존 온라인 미술관과 달리, 사용자가 작품을 먼저 관찰하고 자신의 생각을 표현하도록 유도한 뒤 **AI가 질문과 힌트를 통해 감상을 발전시키는 것**을 핵심 경험으로 설계했습니다.

또한 일부 작품을 `Hidden Artwork`으로 숨겨 사용자가 작품을 직접 관찰하고 해석한 뒤, **AI의 일반적인 해석과 비교하여 자신의 감상을 평가받는 인터랙티브 콘텐츠**를 제공합니다.

---

## ✨ Key Features

### 🏛️ 3D Virtual Museum

웹 브라우저에서 실제 미술관을 탐험하는 것처럼 3D 공간을 자유롭게 이동할 수 있습니다.

**Babylon.js**를 기반으로 WebGL 3D 환경을 구성하고, 사용자는 미술관 내부를 직접 이동하면서 작품을 감상할 수 있습니다.

```text
Browser
   ↓
3D Virtual Museum
   ↓
Gallery
   ├── Van Gogh Exhibition
   └── Monet Exhibition
          ↓
       Artwork
```

PC에서는 키보드와 마우스를 이용해 이동할 수 있으며, 터치 디바이스도 별도로 감지하여 카메라 조작 방식을 변경합니다.

---

### 🖼️ Multiple Galleries

현재 가상 미술관에는 두 개의 주요 전시관이 구성되어 있습니다.

| Gallery   | Theme            | Artworks |
| --------- | ---------------- | -------: |
| Gallery 3 | Vincent van Gogh |       37 |
| Gallery 4 | Claude Monet     |       44 |

총 **81개의 작품 데이터**가 `building_v2.json`에 등록되어 있습니다.

전시관의 문에는 각각 작가명이 표시됩니다.

```text
                🏛️ Virtual Museum
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
       ┌───────────┐       ┌───────────┐
       │  Van Gogh │       │   Monet   │
       │  Gallery  │       │  Gallery  │
       └───────────┘       └───────────┘
```

---

## 🤖 AI Art Guide

이 프로젝트의 핵심 기능 중 하나는 **AI 기반 인터랙티브 미술 감상 가이드**입니다.

사용자가 작품을 보고 AI에게 질문하거나 자신의 생각을 이야기하면, AI가 바로 정답을 알려주는 대신 **질문과 힌트를 통해 사용자가 스스로 작품을 해석하도록 유도**합니다.

### 기본 철학

> **AI가 작품을 설명하는 것이 아니라, 사용자가 작품을 발견하도록 돕는다.**

---

## 🧠 Socratic Art Conversation

AI 가이드는 사용자의 감상 과정을 다음 단계로 발전시키도록 설계되어 있습니다.

```text
1. 첫인상
   ↓
2. 관찰
   ↓
3. 해석
   ↓
4. 심화
   ↓
5. AI 분석
```

### Stage 1 — First Impression

처음 작품을 봤을 때 느끼는 감정이나 생각을 자유롭게 이야기하도록 유도합니다.

```text
"이 작품과의 첫 만남이네요.

가장 먼저 드는 느낌이나 생각을
자유롭게 말씀해주세요.

정답은 없습니다."
```

---

### Stage 2 — Observation

사용자가 이야기한 내용을 바탕으로 작품의 구체적인 시각적 요소를 관찰하도록 유도합니다.

예:

```text
사용자:
"인물이 매섭게 생겼어요."

        ↓

AI:
"매섭다고 느끼셨군요!

특히 인물의 시선과 표정,
얼굴의 명암 대비가 그런 느낌을 줄 수 있어요.

이런 표현이 어떤 감정을 담고 있다고 생각하세요?"
```

AI는 사용자의 답변을 단순히 평가하는 것이 아니라 **관찰을 구체화하고 확장**합니다.

---

### Stage 3 — Interpretation

작품에서 관찰한 요소를 의미와 연결합니다.

AI는 다음과 같은 질문을 통해 사용자의 해석을 확장합니다.

* 작가는 왜 이런 표현을 사용했을까?
* 이 장면은 어떤 감정을 전달하는 것일까?
* 작품이 만들어진 시대와 연결하면 어떤 의미가 있을까?

---

### Stage 4 — Hint System

사용자가 작품 해석에 어려움을 느끼면 단계적으로 힌트를 제공합니다.

```text
Hint 1
   ↓
시각적 요소에 집중

Hint 2
   ↓
작품의 핵심 테마 제시

Hint 3
   ↓
AI 분석 과정 공개
```

사용자의 적극적인 참여를 유지하면서도, 막히는 순간에는 AI가 적절한 도움을 제공합니다.

---

### Stage 5 — AI Analysis

사용자가 충분히 감상한 이후에는 AI의 분석을 확인할 수 있습니다.

AI의 분석은 다음과 같은 구조로 구성됩니다.

```text
① 관찰
   ↓
② 근거
   ↓
③ 추론
   ↓
④ 결론
   ↓
⑤ 작품 배경
```

즉, 단순히

> "이 작품의 의미는 ○○입니다."

라고 알려주는 것이 아니라 **어떤 관찰에서 어떤 해석이 나왔는지**를 보여주는 방식입니다.

---

# 🎯 Hidden Artwork

프로젝트의 또 다른 핵심 콘텐츠입니다.

일부 작품은 처음부터 실제 이미지가 보이지 않고 다음과 같이 표시됩니다.

```text
┌─────────────────────┐
│                     │
│                     │
│   Hidden Artwork!   │
│                     │
│                     │
└─────────────────────┘
```

사용자가 작품을 클릭하면 실제 작품이 공개됩니다.

이를 통해 관람객이 작품을 먼저 보고 자신의 생각을 만들어내는 **능동적인 감상 경험**을 만들었습니다.

---

## 🧩 Interpretation Challenge

Hidden Artwork에서는 사용자가 작품을 직접 감상한 뒤 자신의 해석을 입력할 수 있습니다.

```text
Hidden Artwork
      ↓
작품 관찰
      ↓
나만의 해석 작성
      ↓
AI 작품 분석
      ↓
두 해석 비교
      ↓
점수 + 피드백
```

AI는 작품 이미지와 사용자의 해석을 함께 분석합니다.

---

## 📊 AI Interpretation Score

사용자의 해석을 **80~100점 범위**에서 평가합니다.

평가 결과는 다음과 같은 형식으로 제공됩니다.

```text
📊 이번 해석 점수: 92점

🖼 일반적으로 볼 수 있는 해석
- ...

👍 이런 점을 잘 보셨어요
- ...
- ...

🔍 조금 더 볼 수 있었던 부분
- ...

⚠️ AI 해석은 "정답"이 아니라
일반적 관점 중 하나입니다.
```

중요한 점은 AI가 사용자의 해석을 **정답/오답으로 판단하지 않는 것**입니다.

즉,

> **"미술 감상에는 하나의 정답이 없다."**

는 원칙을 반영했습니다.

---

# 👁️ Vision AI

작품을 단순한 텍스트 데이터로만 처리하지 않고 **실제 작품 이미지를 AI 모델에 전달**합니다.

서버에서는 작품 ID를 이용해 `building_v2.json`에서 작품 정보를 찾고, 실제 이미지 파일을 읽은 뒤 Base64 형태로 AI 모델에 전달합니다.

```text
Artwork ID
    ↓
building_v2.json
    ↓
Artwork Resource
    ↓
Image File
    ↓
Base64
    ↓
Vision AI
```

이를 통해 AI는 작품의 실제 시각적 요소를 기반으로 답변할 수 있습니다.

---

# 🤖 AI Model Architecture

프로젝트에는 여러 AI 모델을 테스트할 수 있도록 API Route가 분리되어 있습니다.

### Gemini

주요 AI 미술 감상 기능에는 Google Gemini가 사용됩니다.

```text
Google Gemini
      │
      ├── Digital Museum Guide
      │
      └── Hidden Artwork Evaluation
```

현재 코드에서는 다음 모델을 사용하도록 구성되어 있습니다.

```text
gemini-3-pro-preview
```

---

### Groq

별도의 Groq API Route도 구현되어 있어 AI 모델을 비교하거나 대체할 수 있도록 구성되어 있습니다.

```text
POST /api/chat-groq
```

현재 설정된 모델:

```text
openai/gpt-oss-20b
```

---

### Ollama

로컬 환경에서 Vision AI를 사용할 수 있도록 Ollama 기반 API도 구현되어 있습니다.

```text
POST /api/chat
       ↓
localhost:11434
       ↓
qwen3-vl:2b
```

따라서 프로젝트는 클라우드 AI뿐만 아니라 **로컬 AI 환경으로 확장할 수 있는 구조**도 가지고 있습니다.

---

# 🏗️ System Architecture

전체 시스템은 **Next.js + Babylon.js + AI API + 3D Asset** 구조로 구성되어 있습니다.

```text
                       User
                        │
                        ▼
                ┌───────────────┐
                │   Next.js Web │
                └───────┬───────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
   ┌────────────────┐      ┌────────────────┐
   │ Babylon.js     │      │ Next.js API    │
   │ Virtual Museum │      │ Routes         │
   └───────┬────────┘      └───────┬────────┘
           │                        │
           ▼                ┌───────┼────────┐
     3D Museum               │       │        │
                             ▼       ▼        ▼
                          Gemini   Groq    Ollama
                             │
                             ▼
                       Vision Analysis
```

---

# 🔄 Artwork Interaction Flow

사용자가 작품을 클릭하면 다음과 같은 흐름으로 처리됩니다.

```text
Artwork Click
     ↓
Artwork ID Detection
     ↓
building_v2.json
     ↓
Artwork Metadata
     ↓
Artwork Image
     ↓
AI Model
     ↓
Streaming Response
     ↓
Chat UI
```

AI 응답은 Streaming 방식으로 브라우저에 전달됩니다.

따라서 긴 응답을 한 번에 기다리는 대신 AI가 생성하는 텍스트를 실시간으로 표시할 수 있습니다.

---

# 📡 API Routes

Next.js App Router의 API Route를 사용합니다.

## Digital Museum Chat

```text
POST /api/chat-gemini
```

### Request

```json
{
  "artworkId": "Van Gogh1",
  "message": "이 작품에서 가장 눈에 띄는 부분은 뭐야?",
  "conversationCount": 2
}
```

### Response

AI가 작품 이미지와 메타데이터를 기반으로 생성한 스트리밍 응답을 반환합니다.

---

## Hidden Artwork Evaluation

```text
POST /api/hidden-artwork
```

### Request

```json
{
  "artworkId": "Van Gogh1",
  "interpretation": "인물의 표정에서 외로움이 느껴지는 것 같다."
}
```

### Processing

```text
Artwork ID
    ↓
Find Artwork
    ↓
Load Image
    ↓
Gemini Vision
    ↓
Interpretation Comparison
    ↓
Score + Feedback
```

---

## Local AI Chat

```text
POST /api/chat
```

Ollama 서버와 연결합니다.

```text
Next.js
   ↓
Ollama
   ↓
qwen3-vl:2b
```

---

## Groq Chat

```text
POST /api/chat-groq
```

Groq SDK를 사용하여 AI 응답을 생성합니다.

---

# 🎮 3D Interaction

3D 환경은 **Babylon.js**를 기반으로 구성되어 있습니다.

### Camera

PC 환경에서는 다음 키를 이용한 이동을 지원합니다.

```text
W → Forward
A → Left
S → Backward
D → Right
```

마우스를 이용하여 시점을 변경할 수 있습니다.

터치 디바이스에서는 별도의 감도 설정을 적용하여 모바일 환경에서도 사용할 수 있도록 구성했습니다.

---

## 🚪 Gallery Navigation

미술관 내부의 문을 클릭하면 다른 전시관으로 이동합니다.

```text
Root Hall
    │
    ├── 🚪 Van Gogh
    │        ↓
    │   Van Gogh Gallery
    │
    └── 🚪 Monet
             ↓
        Monet Gallery
```

각 전시관은 필요한 경우 GLB asset을 동적으로 로드하고, 이미 로드한 전시관은 캐시하여 다시 사용할 수 있도록 구현되어 있습니다.

---

# 🧱 3D Asset Management

프로젝트의 3D 미술관과 작품 데이터는 `public/openvgal/content`에 포함되어 있습니다.

```text
openvgal/
└── content/
    ├── index.html
    ├── building_v2.json
    ├── babylon.js
    ├── room_builder_aux.js
    ├── overlay.js
    ├── overlay.css
    │
    ├── gallery1/
    ├── gallery2/
    ├── gallery3/
    ├── gallery4/
    │
    ├── materials/
    ├── templates/
    └── ...
```

---

# 🗂️ Project Structure

```text
SW-Festival/
│
└── museum-web/
    │
    ├── app/
    │   ├── api/
    │   │   ├── chat/
    │   │   │   └── route.ts
    │   │   │
    │   │   ├── chat-gemini/
    │   │   │   └── route.ts
    │   │   │
    │   │   ├── chat-groq/
    │   │   │   └── route.ts
    │   │   │
    │   │   └── hidden-artwork/
    │   │       └── route.ts
    │   │
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── prompts/
    │   ├── digitalMuseumPrompt.ts
    │   └── hiddenArtworkPrompt.ts
    │
    ├── public/
    │   └── openvgal/
    │       └── content/
    │           ├── 3D Gallery
    │           ├── Artwork Images
    │           ├── Materials
    │           ├── Templates
    │           └── Babylon.js
    │
    ├── next.config.ts
    ├── package.json
    ├── package-lock.json
    └── tsconfig.json
```

---

# 🛠️ Tech Stack

| Category        | Technology               |
| --------------- | ------------------------ |
| Framework       | Next.js 16               |
| Language        | TypeScript               |
| Frontend        | React 19                 |
| 3D Engine       | Babylon.js               |
| Styling         | Tailwind CSS 4           |
| AI              | Google Gemini            |
| AI Alternative  | Groq                     |
| Local AI        | Ollama                   |
| Vision Model    | Gemini Vision / Qwen3-VL |
| 3D Format       | GLB / WebGL              |
| Package Manager | npm                      |

주요 dependencies:

```json
{
  "next": "16.0.1",
  "react": "19.2.0",
  "@google/genai": "^1.30.0",
  "@google/generative-ai": "^0.24.1",
  "groq-sdk": "^0.34.0"
}
```

---

# 🚀 Getting Started

## 1. Clone

```bash
git clone https://github.com/givemenickname/SW-Festival.git
cd SW-Festival/museum-web
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Environment Variables

Gemini와 Groq API를 사용하는 경우 환경 변수를 설정합니다.

`.env.local`

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

> API Key는 절대로 GitHub repository에 직접 업로드하지 않는 것을 권장합니다.

---

## 4. Run Development Server

```bash
npm run dev
```

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:3000
```

현재 `next.config.ts`에서 `/` 요청을 실제 3D 미술관인 `/openvgal/content/index.html`로 redirect하도록 구성되어 있습니다.

---

## 🧠 Ollama 사용

로컬 Vision AI를 사용하는 경우 Ollama를 별도로 실행해야 합니다.

기본적으로 프로젝트는 다음 주소의 Ollama API를 호출합니다.

```text
http://localhost:11434/api/generate
```

사용 모델:

```text
qwen3-vl:2b
```

Ollama를 실행한 뒤 모델을 준비하면 `/api/chat` Route를 통해 로컬 AI를 사용할 수 있습니다.

---

# 🔐 Environment Variables

| Variable                | Description     |
| ----------------------- | --------------- |
| `GOOGLE_GEMINI_API_KEY` | Gemini API 인증 키 |
| `GROQ_API_KEY`          | Groq API 인증 키   |

Ollama는 현재 코드에서 로컬 주소를 직접 사용합니다.

```text
http://localhost:11434
```

---

# 🧪 Development Commands

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Production Server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

---

# 🎨 User Experience

이 프로젝트에서 가장 중요하게 생각한 부분은 **"AI가 답을 알려주는 서비스"가 아니라 "AI와 함께 작품을 발견하는 서비스"**라는 점입니다.

기존 온라인 미술관:

```text
작품
 ↓
작품 설명
 ↓
정보 전달
```

AI Virtual Museum:

```text
작품
 ↓
사용자 관찰
 ↓
사용자 해석
 ↓
AI 질문
 ↓
AI 힌트
 ↓
사용자 사고 확장
 ↓
AI 분석
 ↓
새로운 관점 발견
```

즉, AI를 **정보 검색 도구가 아니라 감상 경험을 확장하는 인터랙티브 가이드**로 활용합니다.

---

# 🎯 Design Goals

### 1. Active Viewing

관람객이 작품 설명을 수동적으로 읽는 것이 아니라 직접 관찰하도록 합니다.

### 2. User-led Interpretation

AI가 처음부터 작품의 정답을 알려주지 않고 사용자의 해석을 중심으로 대화를 진행합니다.

### 3. Adaptive Guidance

사용자의 반응에 따라 힌트의 수준을 조절합니다.

### 4. Explainable Feedback

최종적으로 AI의 분석 과정을 관찰 → 근거 → 추론 → 결론의 형태로 제공합니다.

### 5. Gamified Experience

Hidden Artwork과 점수 시스템을 통해 작품 감상을 하나의 인터랙티브 경험으로 확장합니다.

---

# 📊 AI Interaction Model

```text
             ┌─────────────────┐
             │     Artwork     │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ User Observation│
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ AI Conversation │
             └────────┬────────┘
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
        Active User        Stuck User
             │                 │
             ▼                 ▼
       Interpretation      Hint 1
             │                 ↓
             │               Hint 2
             │                 ↓
             └─────────────► Hint 3
                                │
                                ▼
                         AI Explanation
```

---

# 🏆 Project Highlights

* 🏛️ **Web-based 3D Virtual Museum**
* 🎨 **Van Gogh / Monet virtual exhibitions**
* 🤖 **AI-powered art guide**
* 👁️ **Vision AI 기반 작품 분석**
* 💬 **Socratic-style AI conversation**
* 💡 **Adaptive hint system**
* 🕵️ **Hidden Artwork interaction**
* 📊 **AI interpretation scoring**
* ⚡ **Streaming AI response**
* 🔀 **Gemini / Groq / Ollama AI backend**
* 📱 **Touch device support**

---

# 🗺️ Roadmap

### Museum

* [x] 3D virtual museum
* [x] Gallery navigation
* [x] Van Gogh exhibition
* [x] Monet exhibition
* [x] Artwork interaction
* [x] Hidden Artwork
* [ ] More artists
* [ ] Custom exhibition creation
* [ ] Museum map

### AI Guide

* [x] AI artwork conversation
* [x] Vision-based artwork analysis
* [x] Conversation stages
* [x] Adaptive hints
* [x] AI explanation
* [ ] Long-term conversation memory
* [ ] Personalized guide
* [ ] Voice conversation
* [ ] Multilingual guide

### Hidden Artwork

* [x] Hidden artwork
* [x] Artwork reveal interaction
* [x] User interpretation input
* [x] AI comparison
* [x] Score generation
* [x] Feedback generation
* [ ] Exhibition-wide score
* [ ] User achievement system
* [ ] Interpretation history

### Platform

* [x] Next.js API Routes
* [x] Gemini integration
* [x] Groq integration
* [x] Ollama integration
* [x] Streaming response
* [ ] Production deployment
* [ ] Authentication
* [ ] User profiles
* [ ] Analytics

---

# 🚧 Current Status

> **Prototype / SW Festival Project**

현재 프로젝트는 **3D 가상 미술관과 AI 기반 인터랙티브 미술 감상 기능을 결합한 프로토타입**입니다.

특히 다음 두 가지 사용자 경험을 중심으로 구현되어 있습니다.

### AI Art Guide

사용자가 작품을 관찰하고 자신의 생각을 표현하면 AI가 질문과 힌트를 통해 감상을 확장합니다.

### Hidden Artwork

작품을 숨겨 관람객이 먼저 자신의 해석을 만든 후 AI의 분석과 비교하고 피드백을 받을 수 있도록 합니다.

---

# 💡 Future Vision

이 프로젝트는 단순한 온라인 미술관을 넘어 **AI가 개인의 미술 감상 경험을 보조하는 새로운 형태의 디지털 미술관**으로 발전하는 것을 목표로 합니다.

```text
                 Digital Museum
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Explore       Discuss      Interpret
          │            │            │
          └────────────┼────────────┘
                       ▼
                  AI Art Guide
                       │
                       ▼
              Personalized Museum
```

궁극적으로는 관람객마다 다른 질문과 다른 힌트를 제공하는 **개인 맞춤형 AI 도슨트**로 발전시킬 수 있습니다.

---

# 📄 License

현재 프로젝트에는 별도의 오픈소스 라이선스가 명시되어 있지 않습니다.

프로젝트의 외부 공개 및 재사용 범위를 결정한 후 적절한 라이선스를 추가하는 것을 권장합니다.

---

# 🔗 Repository

[GitHub Repository](https://github.com/givemenickname/SW-Festival)

---

# 👨‍💻 Project

**SW Festival**

> **See the artwork.
> Think for yourself.
> Discover more with AI. 🎨**
