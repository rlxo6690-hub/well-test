# Alumni Connect — 최종 기획서 (PRD)

> 작성일: 2026-03-20
> 상태: 확정 (인터뷰 완료)

---

## 1. 프로젝트 개요

폐쇄형 졸업생 커뮤니티 웹앱.
Google SSO 로그인 후 관리자 승인을 받은 멤버만 이용 가능한 신뢰 기반 커뮤니티.

---

## 2. 인증 및 가입 프로세스

| 항목 | 내용 |
|------|------|
| 로그인 방식 | Google SSO 전용 (다른 방법 없음) |
| 도메인 제한 | 없음 — 누구나 Google 계정으로 가입 신청 가능 |
| 가입 후 필수 입력 | 이름, 기수(숫자), 수료증 이미지 업로드 |
| 가입 후 상태 | Pending — "관리자의 승인을 기다리고 있습니다." 메시지만 노출, 모든 메뉴 차단 |
| 승인 방식 | 관리자가 웹 관리자 페이지에서 버튼 클릭으로 승인/거절 |

### 닉네임 정책
- 형식: `{기수}_{이름}` (예: `3_홍길동`)
- Read-only, 사용자 수정 불가
- **동명이인 처리**: 같은 기수에 동명이인 발생 시 자동으로 숫자 부여
  - 예: `3_홍길동`, `3_홍길동_2`

---

## 3. 권한 체계

| 역할 | 승인/관리 | 공지 | 게시판 | 갤러리 | 댓글/좋아요 | 삭제 |
|------|-----------|------|--------|--------|-------------|------|
| Admin | 유저 승인, 반장 승격/강등 | 작성 + 고정 | 작성 | 작성 | O | 모든 글/댓글 |
| Class Leader | - | 작성 + 고정 | 작성 | 작성 | O | 본인 글/댓글 + 게시글(모든) |
| Member | - | 조회만 | 작성 | 작성 | O | 본인 글/댓글만 |

### 반장(Class Leader) 규칙
- 기수당 인원 제한 없음 (복수 반장 가능)
- 관리자가 반장 → 일반 멤버로 강등 가능

### 댓글 삭제 권한 (확정)
- 반장은 게시글 삭제 가능하나 **댓글은 본인 것만** 삭제 가능
- 관리자는 모든 댓글 삭제 가능

---

## 4. 기능 명세

### 4-1. 공지사항 (Notice)
- 작성: Admin, Class Leader만
- 상단 고정: Admin, Class Leader가 설정 가능 (고정 수 제한 없음)
- 조회: 모든 승인 멤버

### 4-2. 일반 게시판 (Board)
- 텍스트 기반 자유 게시판
- 작성/수정/삭제: 모든 멤버 (수정은 본인만)
- 검색: 제목 + 내용 통합 검색
- 페이지네이션: **페이지 번호 방식** (1, 2, 3...)

### 4-3. 이미지 게시판 (Gallery)
- 썸네일 그리드 뷰
- 작성: **모든 멤버** 가능 (일반 멤버 포함)
- 이미지 업로드 제한: 게시글당 최대 10장, 파일당 최대 10MB, 형식 JPG/PNG/GIF/WEBP
- 페이지네이션: 페이지 번호 방식

### 4-4. 인터랙션
- 좋아요: 모든 게시글에 적용, 1인 1회
- 댓글: 모든 게시글에 적용
- 수정: 작성자 본인 — **게시글 및 댓글 모두 수정 가능**
- 알림: **없음** (MVP에서 제외)

### 4-5. 프로필
- 본인 프로필: 이름, 기수, 닉네임, 내가 쓴 글 목록
- **타인 프로필 조회 가능**: 닉네임 클릭 시 해당 멤버의 기수, 이름, 작성 글 목록 확인

### 4-6. 관리자 페이지 (/admin)
- 가입 대기 목록: 이름, 기수, 수료증 이미지 확인 후 승인/거절 버튼
- 멤버 목록: 역할 변경 (멤버 → 반장, 반장 → 멤버)
- 게시글 관리: 모든 게시글 삭제 가능

---

## 5. 디자인 가이드

| 항목 | 내용 |
|------|------|
| 폰트 | Pretendard |
| 배경 | Pure White (#FFFFFF) |
| 텍스트 | Deep Black (#0A0A0A) |
| 버튼 | 8px 라운드 처리 |
| 레이아웃 | 충분한 여백, 미니멀리즘 |
| 반응형 | 모바일 / 데스크탑 모두 지원 |

---

## 6. 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (Auth + Database + Storage) |
| 인증 | Supabase Auth — Google OAuth |
| 파일 저장 | Supabase Storage (수료증, 갤러리 이미지) |
| 권한 제어 | Supabase RLS (Row Level Security) |
| 배포 | Vercel (Frontend) + Supabase Cloud (Backend) |

---

## 7. DB 스키마 초안

```sql
-- 사용자
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  name text,
  cohort integer,           -- 기수
  nickname text UNIQUE,     -- {기수}_{이름} 자동생성, read-only
  role text DEFAULT 'pending',  -- pending | member | class_leader | admin
  certificate_url text,     -- 수료증 이미지 URL
  created_at timestamptz
)

-- 게시글
posts (
  id uuid PRIMARY KEY,
  author_id uuid REFERENCES users(id),
  type text,                -- notice | board | gallery
  title text,
  content text,
  is_pinned boolean DEFAULT false,
  created_at timestamptz,
  updated_at timestamptz
)

-- 이미지 (갤러리 게시글 첨부)
post_images (
  id uuid PRIMARY KEY,
  post_id uuid REFERENCES posts(id),
  url text,
  order integer
)

-- 댓글
comments (
  id uuid PRIMARY KEY,
  post_id uuid REFERENCES posts(id),
  author_id uuid REFERENCES users(id),
  content text,
  created_at timestamptz,
  updated_at timestamptz
)

-- 좋아요
likes (
  id uuid PRIMARY KEY,
  post_id uuid REFERENCES posts(id),
  user_id uuid REFERENCES users(id),
  UNIQUE(post_id, user_id)
)
```

---

## 8. 페이지 구조

```
/                    → 로그인 페이지 (Google SSO)
/pending             → 승인 대기 화면
/notice              → 공지사항 목록
/notice/[id]         → 공지사항 상세
/board               → 일반 게시판 목록
/board/[id]          → 게시글 상세
/board/write         → 게시글 작성
/gallery             → 이미지 게시판
/gallery/[id]        → 갤러리 상세
/profile/[userId]    → 프로필 (본인 + 타인)
/admin               → 관리자 페이지 (승인/멤버관리)
```

---

## 9. 개발 단계 계획

| 단계 | 내용 | 우선순위 |
|------|------|----------|
| Phase 1 | 프로젝트 초기화 + Supabase 연동 + DB 스키마 | 필수 |
| Phase 2 | Google SSO + 가입 플로우 + Pending 처리 | 필수 |
| Phase 3 | 관리자 승인 페이지 | 필수 |
| Phase 4 | 공지사항 + 일반 게시판 + 좋아요/댓글 | 필수 |
| Phase 5 | 이미지 게시판 (갤러리) | 필수 |
| Phase 6 | 프로필 페이지 + 반장 권한 처리 | 필수 |
| Phase 7 | 검색 기능 | 필수 |
| Phase 8 | UI 완성 + 반응형 + 배포 | 필수 |
