# 🚀 배포 지침서: GitHub 연동 및 Vercel 실전 배포

개발을 마친 프로젝트를 GitHub 원격 저장소에 올리고, Vercel을 통해 전 세계 사람들이 접속할 수 있는 URL로 배포하는 과정을 학습합니다.

## 1. 프로젝트 GitHub에 처음 올리기 (Push)
- **질문**: "폴더를 복제해서 올려야 하나요?" 
- **답변**: 현재 폴더가 바로 로컬 저장소(Local Repository)가 됩니다.

**[순서]**:
1. **GitHub 로그인**: [github.com](https://github.com)에서 `New Repository` 생성 (예: `melody-share`).
2. **명령어 입력**: 터미널에서 다음 명령어를 순서대로 입력합니다.
   ```bash
   git init                                     # 로컬 저장소 초기화
   git add .                                    # 모든 변경 사항 스테이징
   git commit -m "feat: complete initial share"  # 커밋 생성
   git branch -M main                           # 브랜치 이름을 main으로 설정
   git remote add origin https://github.com/계정명/저장소명.git  # 원격 저장소 연결
   git push -u origin main                      # 원격 저장소로 업로드
   ```

## 2. Vercel을 이용한 초스피드 배포
- **선택 이유**: Next.js 프로젝트를 가장 완벽하게 지원하며, GitHub와 연동 시 코드를 수정할 때마다 자동으로 재배포됩니다.

**[절좌]**:
1. [Vercel](https://vercel.com) 로그인 (GitHub 계정 권장).
2. `Add New Project` 클릭 후, 방금 올린 GitHub 저장소를 `Import`.
3. **가장 중요한 것**: `Environment Variables` 설정.
   - 프로젝트 내 `.env.local`에 들어있는 `NEXT_PUBLIC_SUPABASE_URL`와 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 그대로 복사해서 붙여넣어야 합니다. (DB 연결을 위함)
4. `Deploy` 클릭! 몇 분 후 나만의 서비스 URL(`https://melody-share.vercel.app` 등)이 생성됩니다.

## 3. Supabase 설정 업데이트 (배포 후 필수)
- **배포 후 할 일**: Supabase 설정 페이지의 `Authentication` -> `URL Configuration`에서 배포된 Vercel URL을 `Site URL`로 등록해야 로그인이 소셜(Google 등) 및 이메일에서 정상 작동합니다.

## 💡 당신의 실력을 높여줄 노하우
> [!WARNING]
> **".env 파일은 절대 올리면 안 됩니다!"**  
> `.gitignore` 파일에 `.env*` 파일이 포함되어 있는지 꼭 확인하세요. DB 주소나 비밀번호가 공개되면 보안 사고로 이어집니다. 대신 서비스 관리 페이지(Vercel)의 환경 변수 설정란을 이용하는 습관을 들여야 합니다.

## 📚 더 공부하면 좋은 키워드
- **CI/CD (Continuous Integration/Deployment)**: 코드를 수정하면 자동으로 서버가 업데이트되는 시스템.
- **Git Branch Strategy**: 협업 시 브랜치를 나누어 관리하는 혁신적인 방법.
- **Vercel Settings**: 도메인(Domain) 연결 및 서버리스 함수(Serverless Functions) 최적화.
