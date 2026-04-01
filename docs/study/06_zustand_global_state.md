# 🧠 Zustand: 컴포넌트 간의 데이터 공유 (Study Guide 06)

로그인 정보나 현재 재생 중인 곡처럼 서비스 전체에서 공통으로 쓰이는 데이터를 관리하는 **전역 상태 관리(State Management)**에 대해 배웁니다.

---

## 🎯 1. 학습 목표

*   **상태(State)**가 왜 필요하고, 왜 전역적으로 관리해야 하는지 이해합니다.
*   Zustand 라이브러리를 사용하여 **스토어(Store)**를 만드는 법을 익힙니다.

## ❓ 2. 왜 전역 상태(Global State)가 필요한가?

보통 React에서는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달(Props)합니다.  
하지만, 내비게이션 바(Navbar)에 내 이름을 띄우고 동시에 게시판(Feed)에서도 내 이름을 써야 한다면?

*   부모의 부모를 거쳐서 수많은 `props`를 내려보내야 합니다. (이것을 **Props Drilling**이라고 부르며, 코드가 매우 지저분해집니다.)
*   **해결책:** 마치 '구름' 같은 공통 저장소를 하나 만들고, 각 컴포넌트가 필요할 때마다 구름에서 데이터를 직접 꺼내 쓰게 합니다.

## 🛠️ 3. Zustand: 가볍고 강력한 구름 저장소

과거에는 Redux라는 무겁고 복잡한 도구를 썼지만, 요즘은 **Zustand**가 대세입니다.

### 스토어 만들기 예시 (`useAuthStore`)
```javascript
export const useAuthStore = create((set) => ({
  user: null, // 초기 상태: 로그인 안 함
  setUser: (user) => set({ user }), // 유저 정보를 저장하는 함수
  signOut: () => set({ user: null }), // 로그아웃 처리 함수
}))
```

## 🚀 4. 리액트 컴포넌트에서 사용하기

Zustand로 만든 스토어는 어디서든 단 한 줄로 불러올 수 있습니다.

```javascript
const { user, signOut } = useAuthStore();

return (
  <div>
    {user ? `반가워요, ${user.email}님!` : '로그인해주세요.'}
    <button onClick={signOut}>로그아웃</button>
  </div>
);
```

## 🎧 5. 우리 프로젝트에서의 활용

우리 프로젝트에서는 두 가지 핵심 데이터를 Zustand로 관리합니다.

1.  **사용자 인증 정보 (`useAuthStore`):** 현재 누가 로그인해 있는지, 그 사람의 ID는 무엇인지 관리합니다.
2.  **플레이어 상태:** 지금 어떤 노래가 재생 중인지, 재생 중인지 정지 중인지 정보를 저장하여 화면 하단의 플레이어 바가 항상 올바른 노래를 보여주게 합니다.
