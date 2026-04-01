# 🎨 Tailwind CSS와 Shadcn/UI: 현대적인 디자인 시스템 (Study Guide 07)

VibeTree의 세련된 UI를 어떻게 빠르고 일관되게 만들었는지, **유틸리티 퍼스트(Utility-first)** 디자인 기법에 대해 알아봅니다.

---

## 🎯 1. 학습 목표

*   **Tailwind CSS**의 장점과 클래스 기반 스타일링을 이해합니다.
*   **Shadcn/UI**를 사용하여 고퀄리티 컴포넌트를 가져다 쓰는 법을 익힙니다.

## 🛠️ 2. Tailwind CSS: 클래스만으로 디자인하기

과거에는 CSS 파일을 따로 만들고 이름을 지어주어야 했습니다. (예: `.my-button { color: red; }`)  
하지만 Tailwind는 미리 정의된 클래스를 HTML에 직접 적어주는 방식을 사용합니다.

*   **예시:** `<div class="p-4 bg-primary rounded-xl text-white font-bold">`
    *   `p-4`: Padding을 1rem(16px) 준다.
    *   `bg-primary`: 프로젝트의 메인 브랜드 색상을 배경으로 쓴다.
    *   `rounded-xl`: 모서리를 아주 둥글게 깎는다.
*   **장점:** CSS 파일을 왔다 갔다 할 필요가 없고, 클래스 명을 고민하는 시간을 아껴줍니다.

## 🏗️ 3. Shadcn/UI: 복사해서 쓰는 컴포넌트

**Shadcn/UI**는 보통의 라이브러리와 다릅니다. 라이브러리를 통째로 설치하는 게 아니라, 필요한 컴포넌트의 소스코드를 우리 프로젝트로 **직접 복성(Copy & Paste)**해서 가져옵니다.

*   우리의 `components/ui` 폴더에 있는 `button.tsx`, `dialog.tsx`, `input.tsx` 등이 바로 Shadcn에서 가져온 것들입니다.
*   **장점:** 소스코드가 우리 프로젝트 안에 있기 때문에, 디자인 요구사항에 맞춰 **언제든지 커스터마이징**이 가능합니다. (이것이 실무에서 엄청난 인기를 얻는 이유입니다!)

## ✨ 4. 다크 모드와 브랜드 컬러 설정 (`globals.css`)

우리 프로젝트의 세련된 블랙 & 옐로우 테마는 `src/app/globals.css` 파일에서 정의됩니다.

*   `--primary`: 우리 브랜드의 핵심 색상 (예: 노란색/연두색 계열)
*   `--background`: 배경색 (심야의 검은색)
*   이 설정 덕분에, 모든 컴포넌트에서 `text-primary`나 `bg-background` 클래스만 쓰면 디자인의 통일성을 유지할 수 있습니다.

## 💡 5. 오늘의 팁: `cn()` 함수

여러 클래스를 조건에 따라 합쳐야 할 때, `src/lib/utils.ts`에 있는 `cn` 함수를 사용합니다.

```javascript
<button className={cn(
  "p-4 rounded-lg", // 기본 클래스
  isActive ? "bg-primary" : "bg-secondary" // 조건부 클래스
)}>
```
이 함수는 클래스가 겹치거나 충돌하는 상황을 알아서 정리해 주는 아주 고마운 도구입니다.
