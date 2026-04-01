# 🏗️ 프로젝트 개요 및 아키텍처: MelodyShare

**MelodyShare**는 사용자들이 자신이 좋아하는 음악을 공유하고, 실시간 인기 차트를 탐색하며 함께 즐길 수 있는 고성능 음악 큐레이션 플랫폼입니다.

이 문서는 MelodyShare 프로젝트가 어떤 기술들로 구성되어 있고, 각 기술이 어떤 역할을 담당하는지 전체적인 큰 그림을 그리기 위해 작성되었습니다.

---

## 🚀 1. 핵심 기술 스택 (The Core Stack)

우리 프로젝트는 현대 웹 개발에서 가장 많이 쓰이는 **'Full-stack'** 조합을 선택했습니다.

*   **프레임워크:** [Next.js (App Router)](https://nextjs.org/) - React 기반의 가장 강력한 프레임워크로, 서버사이드 렌더링(SSR)과 빠른 로딩을 제공합니다.
*   **백엔드 서비스:** [Supabase](https://supabase.com/) - "Firebase의 오픈소스 대안"으로 불리며, 인증(Auth)과 데이터베이스(PostgreSQL)를 코드 몇 줄로 구축하게 해줍니다.
*   **상태 관리:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) - "간결함이 생명"인 전역 상태 관리 라이브러리로, 로그인 정보나 현재 재생 중인 음악을 관리합니다.
*   **스타일링:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) - 유틸리티 퍼스트 CSS와 고퀄리티 컴포넌트 라이브러리 조합입니다.

## 📐 2. 프로젝트 구조 (Folder Structure)

우리의 폴더 구조는 기능별로 명확히 나뉘어 있습니다.

```bash
src/
├── app/        # 페이지 및 API 라우트 (Next.js App Router)
├── components/ # 화면을 구성하는 조각들 (UI, Auth, Feed, Player 등)
├── lib/        # 외부 도구 설정 (Supabase client 등)
├── store/      # 전역 상태 저장소 (Zustand)
└── types/      # 데이터의 '설계도' (TypeScript 인터페이스)
```

## 🔄 3. 데이터의 흐름 (Data Flow)

1.  **DB 데이터 조회:** 서버(Server Component)에서 직접 Supabase를 조회하여 초기 데이터를 빠르게 화면에 그립니다. (예: 홈 화면의 게시글 목록)
2.  **클라이언트 상호작용:** 사용자가 '좋아요'를 누르거나 음악을 재생하면, 브라우저(Client Component)에서 즉시 반응하고 필요시 DB에 업데이트를 보냅니다.
3.  **로그인 상태 유지:** 사용자가 로그인하면 그 정보는 `Zustand` 스토어에 저장되어, 어느 페이지를 가든 "님 안녕하세요"라는 정보를 유지할 수 있습니다.

## 💡 4. 이 조합의 장점

*   **속도:** 서버와 클라이언트가 각자 잘하는 일을 나누어 처리하므로 사용자 경험이 부드럽습니다.
*   **생산성:** 백엔드 코드를 직접 길게 짤 필요 없이 Supabase가 제공하는 API를 활용하므로, 우리는 '기능'과 '디자인'에만 집중할 수 있습니다.
