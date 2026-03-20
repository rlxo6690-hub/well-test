# Product Requirements Document: Alumni Connect

**Version:** 1.0
**Last Updated:** 2026-03-20
**Document Owner:** Product Owner
**Status:** Approved

---

## 1. Executive Summary and Vision

### Vision Statement

수료생들이 과정 이후에도 안전하고 신뢰할 수 있는 비공개 공간에서 기록을 보존하고 지속적으로 소통할 수 있는 폐쇄형 커뮤니티 웹앱.

### Executive Summary

Alumni Connect는 특정 교육 과정 수료생 전용 폐쇄형 커뮤니티 플랫폼이다. Google SSO를 통한 가입 후 관리자의 수동 승인을 거쳐야만 커뮤니티에 참여할 수 있으며, 이를 통해 외부인의 접근을 원천 차단한다.

핵심 기능은 공지사항, 일반 게시판, 이미지 갤러리의 세 가지 콘텐츠 영역과 댓글/좋아요 인터랙션으로 구성된다. Admin, Class Leader, Member의 3단계 권한 체계를 통해 커뮤니티를 체계적으로 운영할 수 있다.

기술 스택은 Next.js 14 (App Router) + TypeScript 프론트엔드, Supabase BaaS (Auth + Database + Storage + RLS), Tailwind CSS + shadcn/ui 스타일링, Vercel + Supabase Cloud 배포로 구성된다. 그린필드 프로젝트로 기존 레거시 제약이 없다.

### Key Benefits

- **기록 보존**: 수료생들의 활동 기록과 공유 자료가 영구적으로 보존되는 전용 공간 확보
- **신뢰 기반 커뮤니티**: 관리자 수동 승인 + 수료증 검증으로 외부인 접근 원천 차단
- **운영 효율**: Admin/Class Leader 2단계 운영진 체계로 분산 운영 가능

---

## 2. Problem Statement

### Current Challenges

**수료생 (일반 멤버) 관점:**
- 과정 종료 후 동기들과 연락이 단절됨 (카톡 단체방은 시간이 지나면 비활성화)
- 과정 중 공유한 자료, 사진, 기록물이 흩어져 보존되지 않음
- 기존 SNS(카카오톡, 밴드 등)는 외부인 유입 가능성이 있어 솔직한 소통이 어려움

**운영진 (관리자/반장) 관점:**
- 수료생 진위 확인 없이 가입을 허용하면 커뮤니티 신뢰도 하락
- 기수별 공지사항 전달 체계가 없어 중요 정보가 유실됨
- 기존 플랫폼에서는 세밀한 권한 제어가 불가능

**교육 기관 관점:**
- 수료생 네트워크 유지를 위한 공식 채널이 부재
- 수료생 간 자발적 커뮤니티 형성을 지원할 인프라가 없음

### Why This Matters Now

- 과정 수료 후 시간이 지날수록 커뮤니티 결속력이 급격히 약해짐
- 초기에 공식 플랫폼을 제공해야 자연스러운 이주와 활성화가 가능
- Supabase + Next.js 조합으로 소규모 커뮤니티 앱을 빠르고 저비용으로 구축 가능한 기술 환경이 성숙

---

## 3. Goals and Success Metrics

### Business Goals

1. **정상 작동하는 서비스 배포** — 수료생이 실제로 가입, 승인, 게시글 작성, 소통할 수 있는 완전한 플로우 구현
2. **신뢰 기반 폐쇄 커뮤니티 운영** — 수료증 검증 + 관리자 승인으로 비인가 사용자 0명 유지

### User Goals

1. **원활한 온보딩** — Google 계정 로그인부터 승인 완료까지 마찰 없는 플로우
2. **콘텐츠 기록 보존** — 텍스트, 이미지 게시글이 안정적으로 저장되고 검색 가능
3. **커뮤니티 소통** — 게시판, 댓글, 좋아요를 통한 활발한 인터랙션

### Success Metrics

#### Primary Metrics (P0)

| Metric | Baseline | Target |
|--------|----------|--------|
| 전체 기능 정상 작동 여부 | 없음 | 모든 P0 기능 에러 없이 동작 |
| 가입-승인 플로우 완료율 | 없음 | 100% (정상 입력 시) |
| 페이지 로드 시간 | 없음 | < 3초 (LCP 기준) |
| RLS 권한 위반 건수 | 없음 | 0건 |

#### Secondary Metrics (P1)

| Metric | Target |
|--------|--------|
| 이미지 업로드 성공률 | > 99% |
| 검색 결과 반환 시간 | < 2초 |
| 모바일 반응형 레이아웃 정상 표시 | 모든 주요 페이지 |

#### Instrumentation Requirements

- Supabase Dashboard에서 Auth 이벤트, Storage 사용량, DB 쿼리 성능 모니터링
- Vercel Analytics에서 페이지 로드 성능 및 에러율 추적
- 별도 커스텀 로깅 시스템은 MVP 범위에서 제외

---

## 4. Non-Goals and Boundaries

### Explicit Non-Goals

- **알림 시스템**: 푸시 알림, 이메일 알림, 인앱 알림 모두 MVP에서 제외. 이유: 핵심 커뮤니티 기능 우선 구축
- **실시간 채팅/DM**: 1:1 메시지나 채팅방 기능은 구현하지 않음. 이유: 게시판 기반 비동기 소통이 본 서비스의 핵심
- **소셜 로그인 다중화**: Google SSO 외 카카오, 네이버, Apple 등 다른 OAuth 프로바이더는 지원하지 않음
- **댓글 대댓글(Nested Reply)**: 댓글은 단일 레벨만 지원. 대댓글 구조는 구현하지 않음
- **게시글 에디터 리치 텍스트**: WYSIWYG 에디터는 사용하지 않음. 기본 텍스트 입력만 지원
- **다국어 지원**: 한국어 단일 언어만 지원
- **네이티브 앱**: iOS/Android 네이티브 앱은 제작하지 않음. 웹 반응형으로만 제공
- **SEO 최적화**: 폐쇄형 커뮤니티이므로 검색엔진 노출 불필요
- **파일 첨부 (이미지 외)**: PDF, 문서 등 이미지 외 파일 업로드는 지원하지 않음

### Phase 1 Boundaries

- 이메일 인증: 제외 (Google SSO로 충분)
- 비밀번호 로그인: 제외 (Google SSO 전용)
- 게시글 카테고리/태그: 제외
- 게시글 임시 저장: 제외
- 이미지 리사이징/크롭: 제외 (원본 그대로 업로드)
- 사용자 차단/신고: 제외
- 활동 로그/감사 추적: 제외

### Future Considerations (Post-MVP)

- 알림 시스템 (댓글 알림, 공지 알림)
- 대댓글 구조
- 기수별 게시판 분리
- 게시글 북마크/스크랩
- 관리자 대시보드 통계 (활동량, 가입 추이)

---

## 5. User Personas and Use Cases

### Persona 1: 김수현 — 일반 수료생 (Member)

**Role:** 3기 수료생, 직장인
**Experience:** IT 비전공, 스마트폰/PC 기본 사용 가능

**Goals:**
- 동기들과 근황 공유 및 자료 교환
- 과정 중 찍은 사진을 안전한 공간에 보관
- 다른 기수 수료생들과도 교류

**Pain Points:**
- 카톡 단체방이 묻혀서 중요한 공유 자료를 못 찾음
- 외부인이 들어올 수 있는 공간에서는 솔직하게 소통하기 어려움

**Use Cases:**
- Google 계정으로 가입 신청 후 수료증 업로드 -> 승인 대기 -> 승인 완료 후 게시판 이용
- 갤러리에 수료식 사진 10장 업로드 -> 다른 멤버가 좋아요/댓글
- 게시판에서 "스터디" 키워드로 검색 -> 관련 게시글 목록 확인

### Persona 2: 이정민 — 반장 (Class Leader)

**Role:** 5기 반장, 기수 내 운영 담당
**Experience:** IT에 익숙하지만 개발자는 아님

**Goals:**
- 기수 내 중요 공지를 효과적으로 전달
- 게시판 내 부적절한 게시글 관리
- 기수 멤버들의 활발한 참여 유도

**Pain Points:**
- 공지를 올려도 다른 글에 밀려서 안 보는 사람이 많음
- 문제 게시글을 관리할 권한이 없어 관리자에게 매번 요청해야 함

**Use Cases:**
- 공지사항 작성 + 상단 고정 -> 모든 멤버에게 노출
- 부적절한 게시글 발견 시 직접 삭제 처리
- 다른 기수 게시판에도 글 작성하여 기수 간 교류 촉진

### Persona 3: 박관리 — 관리자 (Admin)

**Role:** 커뮤니티 총괄 관리자
**Experience:** 기본적인 웹 관리 경험 있음

**Goals:**
- 가입 신청의 빠르고 정확한 검증 및 승인
- 기수별 반장 지정으로 운영 분산
- 커뮤니티 전반의 질서 유지

**Pain Points:**
- 가입 신청이 몰리면 수료증 하나하나 확인하기 번거로움
- 특정 기수에 문제가 생겼을 때 해당 기수 반장에게 권한을 위임할 방법이 필요

**Use Cases:**
- /admin 페이지에서 Pending 유저 목록 확인 -> 수료증 이미지 검토 -> 승인/거절 클릭
- 멤버 목록에서 특정 유저를 Class Leader로 승격
- 문제 있는 게시글/댓글 직접 삭제

---

## 6. Functional Requirements

### 6.1 인증 및 온보딩 (FR-AUTH)

**FR-AUTH-001: Google SSO 로그인** (P0)
사용자는 Google 계정을 사용하여 로그인할 수 있다. Google SSO 외 다른 인증 방식은 제공하지 않는다.

*Acceptance Criteria:*
- Given 미가입 사용자가 랜딩 페이지에 접속, When Google 로그인 버튼 클릭, Then Google OAuth 플로우가 시작되고 인증 후 앱으로 리다이렉트
- Given 도메인 제한 없음, When 어떤 Google 계정이든 로그인 시도, Then 인증이 성공하고 가입 플로우로 진행

*Technical Note:*
```
Supabase Auth > Google Provider
Redirect URL: /auth/callback
```

---

**FR-AUTH-002: 가입 정보 입력 (Onboarding Form)** (P0)
최초 로그인 사용자는 이름(text), 기수(정수), 수료증 이미지(파일)를 필수로 입력해야 한다.

*Acceptance Criteria:*
- Given 최초 로그인 완료 후, When 프로필 입력 폼 표시, Then 이름, 기수, 수료증 이미지 업로드 필드가 모두 필수(*) 표시
- Given 세 필드 중 하나라도 비어 있으면, When 제출 버튼 클릭, Then 에러 메시지 표시 및 제출 차단
- Given 수료증 이미지, When 업로드, Then JPG/PNG/GIF/WEBP 형식만 허용, 파일당 최대 10MB
- Given 모든 필드 유효, When 제출, Then Supabase Storage에 수료증 저장 + users 테이블에 레코드 생성 (role: 'pending')

---

**FR-AUTH-003: Pending 상태 처리** (P0)
가입 정보 제출 후 관리자 승인 전까지 사용자는 Pending 상태이며, 모든 기능에 접근할 수 없다.

*Acceptance Criteria:*
- Given 사용자 role이 'pending', When 어떤 페이지에 접근, Then /pending 페이지로 리다이렉트
- Given /pending 페이지, When 렌더링, Then "관리자의 승인을 기다리고 있습니다." 메시지만 표시
- Given Pending 사용자, When 네비게이션 바 렌더링, Then 모든 메뉴 비활성화 또는 숨김

---

**FR-AUTH-004: 닉네임 자동 생성** (P0)
닉네임은 `{기수}_{이름}` 형식으로 자동 생성되며, 사용자가 수정할 수 없다.

*Acceptance Criteria:*
- Given 기수=3, 이름='홍길동', When 가입 정보 제출, Then nickname = '3_홍길동' 자동 생성
- Given 기수=3, 이름='홍길동'이 이미 존재, When 동명이인 가입, Then nickname = '3_홍길동_2' 자동 생성
- Given 세 번째 동명이인, When 가입, Then nickname = '3_홍길동_3'
- Given 생성된 닉네임, When 프로필 페이지 표시, Then 닉네임 필드는 read-only

*Implementation Note:*
```sql
-- 닉네임 생성 로직 (DB Function 또는 Server Action)
1. base_nickname = '{cohort}_{name}'
2. IF NOT EXISTS(nickname = base_nickname) -> return base_nickname
3. ELSE -> count = SELECT COUNT(*) FROM users WHERE nickname LIKE '{base_nickname}%'
4. return '{base_nickname}_{count + 1}'
```

---

### 6.2 권한 및 관리 (FR-ADMIN)

**FR-ADMIN-001: 3단계 권한 체계** (P0)
시스템은 Admin, Class Leader, Member의 3단계 권한을 지원한다. Pending은 미승인 상태로 별도 처리.

*Role Enum:*
```
'pending' | 'member' | 'class_leader' | 'admin'
```

*Permission Matrix:*

| Action | Admin | Class Leader | Member | Pending |
|--------|-------|-------------|--------|---------|
| 공지 작성 | O | O | X | X |
| 공지 고정 | O | O | X | X |
| 게시글 작성 (board/gallery) | O | O | O | X |
| 댓글 작성 | O | O | O | X |
| 좋아요 | O | O | O | X |
| 본인 게시글/댓글 수정 | O | O | O | X |
| 본인 게시글/댓글 삭제 | O | O | O | X |
| 타인 게시글 삭제 | O | O | X | X |
| 타인 댓글 삭제 | O | X | X | X |
| 유저 승인/거절 | O | X | X | X |
| 역할 변경 | O | X | X | X |
| /admin 접근 | O | X | X | X |

---

**FR-ADMIN-002: 가입 승인/거절** (P0)
Admin은 /admin 페이지에서 Pending 사용자의 가입을 승인하거나 거절할 수 있다.

*Acceptance Criteria:*
- Given Admin이 /admin 접속, When 대기 목록 탭 선택, Then Pending 유저 리스트 표시 (이름, 기수, 수료증 이미지 썸네일)
- Given Pending 유저, When 수료증 이미지 클릭, Then 원본 크기로 확대 표시
- Given Pending 유저, When 승인 버튼 클릭, Then role이 'member'로 변경 + 즉시 목록에서 제거
- Given Pending 유저, When 거절 버튼 클릭, Then 해당 유저 레코드 삭제 또는 role을 'rejected'로 변경

---

**FR-ADMIN-003: 역할 변경 (승격/강등)** (P0)
Admin은 Member를 Class Leader로 승격하거나, Class Leader를 Member로 강등할 수 있다.

*Acceptance Criteria:*
- Given Admin이 /admin 멤버 목록, When Member의 '반장 승격' 버튼 클릭, Then role이 'class_leader'로 변경
- Given Admin이 /admin 멤버 목록, When Class Leader의 '강등' 버튼 클릭, Then role이 'member'로 변경
- Given 기수당 반장 수, When 여러 명 승격, Then 기수당 인원 제한 없이 복수 반장 허용

---

**FR-ADMIN-004: 관리자 페이지 접근 제어** (P0)
/admin 경로는 Admin role 사용자만 접근 가능하다.

*Acceptance Criteria:*
- Given 사용자 role이 'admin'이 아닌 경우, When /admin URL 직접 접근, Then 메인 페이지(/)로 리다이렉트
- Given Admin 사용자, When /admin 접근, Then 관리자 대시보드 정상 렌더링
- Given RLS 정책, When Admin이 아닌 유저가 API로 역할 변경 시도, Then 403 에러 반환

---

### 6.3 공지사항 (FR-NOTICE)

**FR-NOTICE-001: 공지사항 작성** (P0)
Admin과 Class Leader는 공지사항을 작성할 수 있다.

*Acceptance Criteria:*
- Given Admin 또는 Class Leader, When 공지 작성 페이지 접근, Then 제목 + 내용 입력 폼 표시
- Given 유효한 제목/내용 입력 후, When 작성 버튼 클릭, Then posts 테이블에 type='notice' 레코드 생성
- Given Member, When 공지 작성 URL 직접 접근, Then 접근 거부 또는 리다이렉트

---

**FR-NOTICE-002: 공지사항 상단 고정** (P1)
Admin과 Class Leader는 공지사항을 상단에 고정할 수 있다.

*Acceptance Criteria:*
- Given 공지 게시글, When 고정 토글 클릭, Then is_pinned = true로 변경
- Given 고정된 공지가 여러 개, When 공지 목록 조회, Then 고정 공지가 최상단에 표시 (고정 공지 수 제한 없음)
- Given 고정 공지 목록, When 정렬, Then 고정 공지 내에서는 최신순 정렬

---

**FR-NOTICE-003: 공지사항 목록 조회** (P0)
모든 승인된 멤버는 공지사항 목록을 조회할 수 있다.

*Acceptance Criteria:*
- Given 승인된 멤버, When /notice 접근, Then 공지 목록 표시 (고정 공지 상단 + 나머지 최신순)
- Given 공지 목록, When 페이지 렌더링, Then 페이지 번호 방식 페이지네이션 표시

---

### 6.4 일반 게시판 (FR-BOARD)

**FR-BOARD-001: 게시글 작성** (P0)
모든 승인된 멤버(Member, Class Leader, Admin)는 일반 게시판에 글을 작성할 수 있다.

*Acceptance Criteria:*
- Given 승인된 멤버, When /board/write 접근, Then 제목 + 내용 입력 폼 표시
- Given 유효한 입력 후 작성 버튼, When 클릭, Then posts 테이블에 type='board' 레코드 생성 + /board로 리다이렉트

---

**FR-BOARD-002: 게시글 목록 조회** (P0)
승인된 멤버는 게시판 목록을 페이지 번호 방식으로 조회할 수 있다.

*Acceptance Criteria:*
- Given 승인된 멤버, When /board 접근, Then 게시글 목록 최신순 표시
- Given 게시글 수가 페이지당 표시 수 초과, When 페이지 번호 클릭, Then 해당 페이지 게시글 표시
- Given 게시글 목록 아이템, When 렌더링, Then 제목, 작성자 닉네임, 작성일, 댓글 수, 좋아요 수 표시

---

**FR-BOARD-003: 게시글 상세 조회** (P0)
승인된 멤버는 게시글 상세 내용을 조회할 수 있다.

*Acceptance Criteria:*
- Given 승인된 멤버, When /board/[id] 접근, Then 게시글 전체 내용 + 작성자 정보 + 댓글 목록 + 좋아요 수 표시
- Given 게시글 상세 페이지, When 작성자 닉네임 클릭, Then /profile/[userId]로 이동

---

**FR-BOARD-004: 게시글 수정** (P0)
게시글 작성자 본인만 수정할 수 있다.

*Acceptance Criteria:*
- Given 게시글 작성자가 상세 페이지 조회, When 수정 버튼 클릭, Then 제목/내용이 채워진 편집 폼 표시
- Given 수정 폼에서 내용 변경 후, When 저장 버튼 클릭, Then updated_at 갱신 + 상세 페이지로 리다이렉트
- Given 게시글 작성자가 아닌 사용자, When 상세 페이지 조회, Then 수정 버튼 미표시

---

**FR-BOARD-005: 게시글 삭제** (P0)
본인 게시글은 본인이, 타인 게시글은 Admin과 Class Leader만 삭제 가능.

*Acceptance Criteria:*
- Given 게시글 작성자, When 삭제 버튼 클릭, Then 확인 다이얼로그 표시 후 삭제
- Given Admin 또는 Class Leader, When 타인 게시글에서 삭제 버튼 클릭, Then 확인 다이얼로그 표시 후 삭제
- Given Member, When 타인 게시글 조회, Then 삭제 버튼 미표시
- Given 게시글 삭제, When 실행, Then 연관된 댓글, 좋아요도 함께 삭제 (CASCADE)

---

**FR-BOARD-006: 게시판 검색** (P1)
제목과 내용을 통합 검색할 수 있다.

*Acceptance Criteria:*
- Given 게시판 목록 페이지, When 검색어 입력 + 검색 버튼 클릭, Then 제목 또는 내용에 검색어가 포함된 게시글 목록 표시
- Given 검색 결과, When 표시, Then 페이지 번호 방식 페이지네이션 적용
- Given 빈 검색어, When 검색 시도, Then 전체 목록 표시 (검색 필터 해제)

*Implementation Note:*
```sql
-- Supabase 텍스트 검색
SELECT * FROM posts
WHERE type = 'board'
  AND (title ILIKE '%{query}%' OR content ILIKE '%{query}%')
ORDER BY created_at DESC;
```

---

### 6.5 이미지 갤러리 (FR-GALLERY)

**FR-GALLERY-001: 갤러리 게시글 작성** (P0)
모든 승인된 멤버는 이미지 갤러리에 게시글을 작성할 수 있다.

*Acceptance Criteria:*
- Given 승인된 멤버, When 갤러리 작성 페이지 접근, Then 제목 + 내용 + 이미지 업로드 폼 표시
- Given 이미지 선택, When 업로드, Then 게시글당 최대 10장, 파일당 최대 10MB, JPG/PNG/GIF/WEBP만 허용
- Given 11장째 이미지 추가 시도, When 업로드, Then 에러 메시지 "최대 10장까지 업로드 가능합니다" 표시
- Given 10MB 초과 파일, When 업로드 시도, Then 에러 메시지 "파일 크기는 10MB 이하여야 합니다" 표시
- Given 유효한 입력, When 작성 버튼 클릭, Then posts(type='gallery') + post_images 레코드 생성

---

**FR-GALLERY-002: 갤러리 목록 조회 (썸네일 그리드)** (P0)
갤러리 목록은 썸네일 그리드 형태로 표시된다.

*Acceptance Criteria:*
- Given 승인된 멤버, When /gallery 접근, Then 썸네일 그리드 뷰로 갤러리 게시글 표시
- Given 갤러리 아이템, When 렌더링, Then 첫 번째 이미지를 썸네일로 표시 + 제목 + 작성자 닉네임
- Given 그리드 목록, When 페이지네이션, Then 페이지 번호 방식 적용

---

**FR-GALLERY-003: 갤러리 상세 조회** (P0)
갤러리 게시글의 모든 이미지를 순서대로 확인할 수 있다.

*Acceptance Criteria:*
- Given 승인된 멤버, When /gallery/[id] 접근, Then 게시글 내 모든 이미지 순서대로 표시 + 제목 + 내용 + 댓글
- Given 이미지, When 클릭, Then 원본 크기로 확대 표시 (라이트박스 또는 모달)

---

### 6.6 인터랙션 (FR-INTERACT)

**FR-INTERACT-001: 좋아요** (P0)
모든 승인된 멤버는 게시글에 좋아요를 할 수 있으며, 1인 1회로 제한된다.

*Acceptance Criteria:*
- Given 승인된 멤버가 게시글 조회, When 좋아요 버튼 클릭, Then likes 테이블에 레코드 추가 + 좋아요 수 +1 반영
- Given 이미 좋아요한 게시글, When 좋아요 버튼 재클릭, Then 좋아요 취소 (likes 레코드 삭제) + 좋아요 수 -1
- Given likes 테이블, When UNIQUE(post_id, user_id) 제약, Then 중복 좋아요 DB 레벨에서 차단

---

**FR-INTERACT-002: 댓글 작성** (P0)
모든 승인된 멤버는 게시글에 댓글을 작성할 수 있다.

*Acceptance Criteria:*
- Given 게시글 상세 페이지, When 댓글 입력 후 등록 버튼 클릭, Then comments 테이블에 레코드 생성 + 댓글 목록 갱신
- Given 댓글 목록, When 렌더링, Then 작성자 닉네임 + 내용 + 작성일 표시 (최신순)

---

**FR-INTERACT-003: 댓글 수정** (P0)
댓글 작성자 본인만 수정할 수 있다.

*Acceptance Criteria:*
- Given 댓글 작성자, When 수정 버튼 클릭, Then 인라인 편집 모드 활성화
- Given 수정 완료 후, When 저장 클릭, Then updated_at 갱신 + 댓글 내용 반영
- Given 댓글 작성자가 아닌 사용자, When 댓글 조회, Then 수정 버튼 미표시

---

**FR-INTERACT-004: 댓글 삭제** (P0)
본인 댓글은 본인이, 모든 댓글은 Admin만 삭제 가능. Class Leader는 본인 댓글만 삭제 가능.

*Acceptance Criteria:*
- Given 댓글 작성자, When 삭제 버튼 클릭, Then 확인 다이얼로그 후 삭제
- Given Admin, When 타인 댓글에서 삭제 버튼 클릭, Then 삭제 가능
- Given Class Leader, When 타인 댓글 조회, Then 삭제 버튼 미표시 (본인 댓글만 삭제 가능)

---

### 6.7 프로필 (FR-PROFILE)

**FR-PROFILE-001: 프로필 조회** (P0)
승인된 멤버는 자신과 타인의 프로필을 조회할 수 있다.

*Acceptance Criteria:*
- Given 승인된 멤버, When /profile/[userId] 접근, Then 해당 유저의 닉네임, 이름, 기수, 작성 글 목록 표시
- Given 게시글/댓글의 작성자 닉네임, When 클릭, Then /profile/[해당userId]로 이동
- Given 본인 프로필 페이지, When 조회, Then 타인 프로필과 동일한 정보 표시 (수정 기능 없음)

---

### 6.8 공통 UI/UX (FR-UI)

**FR-UI-001: 네비게이션** (P0)
승인된 멤버에게 주요 메뉴를 제공하는 네비게이션 바.

*Acceptance Criteria:*
- Given 승인된 멤버 로그인, When 어떤 페이지든 접속, Then 상단 또는 사이드 네비게이션에 공지사항/게시판/갤러리/내 프로필 메뉴 표시
- Given Admin, When 네비게이션 표시, Then 관리자 메뉴 추가 표시
- Given Pending 사용자, When 네비게이션 표시, Then 모든 메뉴 숨김 또는 비활성

---

**FR-UI-002: 반응형 레이아웃** (P1)
모바일과 데스크탑 모두에서 정상적으로 사용 가능해야 한다.

*Acceptance Criteria:*
- Given 모바일 뷰포트 (< 768px), When 페이지 렌더링, Then 모바일 최적화 레이아웃 (스택 레이아웃, 터치 친화적 버튼)
- Given 데스크탑 뷰포트 (>= 1024px), When 페이지 렌더링, Then 데스크탑 최적화 레이아웃 (그리드, 사이드바 등)
- Given 갤러리 그리드, When 모바일 표시, Then 2열 그리드 / 데스크탑 4열 이상 그리드

---

**FR-UI-003: 디자인 시스템 적용** (P1)
Pretendard 폰트, Pure White 배경, Deep Black 텍스트, 8px 라운드 버튼의 미니멀 디자인.

*Acceptance Criteria:*
- Given 모든 페이지, When 렌더링, Then Pretendard 폰트 적용 (웹폰트 로드)
- Given 배경색, When 렌더링, Then #FFFFFF 사용
- Given 기본 텍스트 색상, When 렌더링, Then #0A0A0A 사용
- Given 모든 버튼, When 렌더링, Then border-radius: 8px 적용
- Given 전체 레이아웃, When 렌더링, Then 충분한 여백(padding/margin)으로 미니멀리즘 유지

---

## 7. Non-Functional Requirements

### Security (NFR-SEC)

**NFR-SEC-001: Row Level Security (RLS)** (P0)
모든 Supabase 테이블에 RLS 정책을 적용하여 인가되지 않은 데이터 접근을 차단한다.

*Requirements:*
- Pending 사용자는 자신의 users 레코드 외 어떤 데이터도 조회 불가
- Member는 공개 게시글/댓글/좋아요만 CRUD 가능 (본인 데이터만 CUD)
- Admin 역할 변경 API는 RLS에서 admin role 체크 필수
- 수료증 이미지는 Admin만 조회 가능 (Storage RLS)

**NFR-SEC-002: 인증 보호** (P0)
- 모든 API 요청에 Supabase Auth JWT 검증 필수
- 미인증 요청은 401 반환
- /admin 경로는 서버 사이드에서 role 검증 후 렌더링

**NFR-SEC-003: 파일 업로드 보안** (P0)
- 업로드 파일의 MIME type 서버 사이드 검증 (클라이언트 확장자만 의존하지 않음)
- Storage bucket별 용량 제한 설정
- 직접 URL 접근 방지 (signed URL 또는 RLS로 제어)

### Performance (NFR-PERF)

**NFR-PERF-001: 페이지 로드 성능** (P1)
- LCP (Largest Contentful Paint): < 3초
- 게시글 목록 API 응답: < 500ms
- 이미지 갤러리 썸네일 로드: < 2초 (최초 뷰포트 기준)

**NFR-PERF-002: 이미지 최적화** (P1)
- Next.js Image 컴포넌트 사용으로 자동 최적화
- 갤러리 썸네일은 적절한 사이즈로 리사이징하여 전송 (next/image width/height)
- 지연 로딩(Lazy Loading) 적용

### Reliability (NFR-REL)

**NFR-REL-001: 데이터 무결성** (P0)
- posts 삭제 시 관련 comments, likes, post_images CASCADE 삭제
- users 삭제 시 관련 데이터 처리 정책 정의 (soft delete 권장)
- nickname UNIQUE 제약으로 중복 방지

**NFR-REL-002: 에러 처리** (P1)
- 모든 API 실패에 대해 사용자 친화적 에러 메시지 표시
- 이미지 업로드 실패 시 재시도 안내
- 네트워크 에러 시 "연결을 확인해주세요" 메시지 표시

### Maintainability (NFR-MAINT)

**NFR-MAINT-001: 코드 품질** (P1)
- TypeScript strict mode 사용
- ESLint + Prettier 설정
- 컴포넌트 단위 디렉토리 구조 (feature-based)

**NFR-MAINT-002: 환경 설정** (P0)
- 환경 변수는 .env.local에만 저장
- Supabase URL, Anon Key는 환경 변수로 관리
- .env 파일은 .gitignore에 반드시 포함

---

## 8. Technical Architecture

### System Architecture

```
+------------------+     +-------------------+     +------------------+
|                  |     |                   |     |                  |
|   Client         |     |   Vercel          |     |   Supabase       |
|   (Browser)      +---->+   (Next.js SSR    +---->+   Cloud          |
|                  |     |    + API Routes)   |     |                  |
|   - React        |     |                   |     |  - Auth (Google) |
|   - Tailwind     |     |   - Server        |     |  - PostgreSQL    |
|   - shadcn/ui    |     |     Components    |     |  - Storage       |
|                  |     |   - Server        |     |  - RLS Policies  |
|                  |     |     Actions       |     |  - Edge Functions|
+------------------+     +-------------------+     +------------------+
```

### Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | latest |
| Font | Pretendard | 웹폰트 CDN |
| BaaS | Supabase | latest |
| Auth | Supabase Auth (Google OAuth) | - |
| Database | Supabase PostgreSQL | 15.x |
| Storage | Supabase Storage | - |
| Deployment (FE) | Vercel | - |
| Deployment (BE) | Supabase Cloud | - |

### Data Architecture

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cohort INTEGER NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'pending'
    CHECK (role IN ('pending', 'member', 'class_leader', 'admin')),
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Posts Table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('notice', 'board', 'gallery')),
  title TEXT NOT NULL,
  content TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Post Images Table (Gallery)
CREATE TABLE post_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Likes Table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Indexes
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_pinned ON posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_cohort ON users(cohort);
```

### Page Routes

```
/                    -> 로그인 페이지 (Google SSO 버튼)
/auth/callback       -> OAuth 콜백 처리
/onboarding          -> 가입 정보 입력 (이름, 기수, 수료증)
/pending             -> 승인 대기 화면
/notice              -> 공지사항 목록
/notice/[id]         -> 공지사항 상세
/notice/write        -> 공지 작성 (Admin, Class Leader)
/board               -> 일반 게시판 목록
/board/[id]          -> 게시글 상세
/board/write         -> 게시글 작성
/board/[id]/edit     -> 게시글 수정
/gallery             -> 이미지 갤러리 (그리드)
/gallery/[id]        -> 갤러리 상세
/gallery/write       -> 갤러리 작성
/profile/[userId]    -> 프로필 페이지
/admin               -> 관리자 대시보드
```

### Supabase Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| certificates | 수료증 이미지 | Admin만 조회, 본인만 업로드 |
| gallery | 갤러리 이미지 | 승인 멤버 조회, 승인 멤버 업로드 |

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1)
**Objectives:**
- 프로젝트 초기화 및 개발 환경 구축
- Supabase 프로젝트 생성 및 DB 스키마 배포
- 기본 레이아웃 및 디자인 시스템 적용

**Deliverables:**
- Next.js 14 프로젝트 (TypeScript, Tailwind CSS, shadcn/ui 설정 완료)
- Supabase 연동 (클라이언트 설정, 환경 변수)
- 전체 DB 스키마 및 RLS 기본 정책 배포
- 공통 레이아웃 컴포넌트 (네비게이션, 푸터)
- Pretendard 폰트 + 디자인 토큰 (색상, 버튼 스타일) 적용

**Dependencies:** None (foundation)

**FR Coverage:** FR-UI-001, FR-UI-003, NFR-MAINT-001, NFR-MAINT-002

---

### Phase 2: Authentication & Onboarding (Week 1-2)
**Objectives:**
- Google SSO 로그인 구현
- 가입 정보 입력 및 Pending 상태 처리
- 닉네임 자동 생성 로직

**Deliverables:**
- Google OAuth 로그인/로그아웃
- /auth/callback 라우트
- /onboarding 페이지 (이름, 기수, 수료증 업로드)
- /pending 페이지
- 닉네임 생성 DB Function
- 인증 상태별 라우트 가드 (미인증 -> /, pending -> /pending, 승인 -> /notice)

**Dependencies:** Phase 1 complete

**FR Coverage:** FR-AUTH-001, FR-AUTH-002, FR-AUTH-003, FR-AUTH-004, NFR-SEC-002

---

### Phase 3: Admin Panel (Week 2)
**Objectives:**
- 관리자 전용 페이지 구현
- 가입 승인/거절 기능
- 역할 관리 (승격/강등)

**Deliverables:**
- /admin 페이지 (탭: 대기 목록 / 멤버 목록)
- 대기 목록: 수료증 확인 + 승인/거절 버튼
- 멤버 목록: 역할 변경 드롭다운 또는 버튼
- Admin role RLS 정책 강화
- /admin 접근 제어 (미들웨어 또는 서버 사이드 체크)

**Dependencies:** Phase 2 complete (인증 시스템 필수)

**FR Coverage:** FR-ADMIN-001, FR-ADMIN-002, FR-ADMIN-003, FR-ADMIN-004, NFR-SEC-001

---

### Phase 4: Notice Board + General Board (Week 2-3)
**Objectives:**
- 공지사항 CRUD + 고정 기능
- 일반 게시판 CRUD
- 좋아요 및 댓글 기능

**Deliverables:**
- /notice, /notice/[id], /notice/write 페이지
- 공지 상단 고정 토글
- /board, /board/[id], /board/write, /board/[id]/edit 페이지
- 좋아요 토글 컴포넌트
- 댓글 CRUD 컴포넌트 (작성, 수정, 삭제)
- 게시글/댓글 권한별 버튼 표시 로직
- 페이지 번호 방식 페이지네이션 컴포넌트

**Dependencies:** Phase 3 complete (권한 체계 필수)

**FR Coverage:** FR-NOTICE-001~003, FR-BOARD-001~005, FR-INTERACT-001~004

---

### Phase 5: Image Gallery (Week 3)
**Objectives:**
- 이미지 갤러리 CRUD
- 멀티 이미지 업로드 (최대 10장)
- 썸네일 그리드 뷰

**Deliverables:**
- /gallery, /gallery/[id], /gallery/write 페이지
- 멀티 이미지 업로드 컴포넌트 (드래그앤드롭 또는 파일 선택)
- 이미지 유효성 검증 (형식, 크기, 개수)
- 썸네일 그리드 레이아웃
- 이미지 확대 모달 (라이트박스)
- Supabase Storage gallery 버킷 RLS

**Dependencies:** Phase 4 complete (게시글 시스템 재사용)

**FR Coverage:** FR-GALLERY-001~003, NFR-SEC-003

---

### Phase 6: Profile & Search (Week 3-4)
**Objectives:**
- 프로필 페이지 구현
- 게시판 검색 기능

**Deliverables:**
- /profile/[userId] 페이지 (닉네임, 이름, 기수, 작성 글 목록)
- 닉네임 클릭 -> 프로필 링크 (게시글/댓글 모든 곳)
- 게시판 검색 UI + 검색 API (제목+내용 ILIKE)
- 검색 결과 페이지네이션

**Dependencies:** Phase 4, 5 complete (게시글 데이터 필수)

**FR Coverage:** FR-PROFILE-001, FR-BOARD-006

---

### Phase 7: Polish & Responsive (Week 4)
**Objectives:**
- 반응형 레이아웃 완성
- UI/UX 세부 조정
- 에러 핸들링 강화

**Deliverables:**
- 모바일/태블릿/데스크탑 반응형 테스트 및 수정
- 로딩 상태 (Skeleton UI)
- 에러 상태 처리 (404, 403, 500 페이지)
- 빈 상태 UI ("아직 게시글이 없습니다" 등)
- SEO 비활성화 (robots.txt noindex)

**Dependencies:** Phase 6 complete

**FR Coverage:** FR-UI-002, NFR-PERF-001, NFR-PERF-002, NFR-REL-002

---

### Phase 8: Deployment & QA (Week 4)
**Objectives:**
- Vercel + Supabase Cloud 배포
- 전체 기능 통합 테스트

**Deliverables:**
- Vercel 배포 설정 (환경 변수, 도메인)
- Supabase Cloud 프로젝트 설정 (Production)
- Google OAuth redirect URL 프로덕션 설정
- 전체 기능 수동 테스트 (가입 -> 승인 -> 게시 -> 댓글 -> 좋아요 -> 검색)
- RLS 정책 보안 테스트 (권한 없는 API 호출 시도)
- 크로스 브라우저 테스트 (Chrome, Safari, Mobile Safari, Mobile Chrome)

**Dependencies:** Phase 7 complete

**FR Coverage:** 전체 FR 통합 검증

---

## 10. Risk Assessment

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| R1 | Supabase RLS 정책 설정 오류로 비인가 데이터 접근 | Medium | Critical | 모든 테이블에 기본 DENY 정책 적용 후 필요한 접근만 허용. Phase 8에서 보안 테스트 필수 수행 |
| R2 | 이미지 업로드 실패 (네트워크, 크기 초과) | Medium | Medium | 클라이언트 사이드 사전 검증 + 서버 사이드 재검증. 실패 시 사용자에게 명확한 에러 메시지 제공 |
| R3 | 닉네임 동명이인 생성 시 Race Condition | Low | Medium | DB Function 내에서 트랜잭션으로 처리. nickname UNIQUE 제약으로 최종 보호 |
| R4 | Google OAuth 설정 오류 (Redirect URI 불일치) | Medium | High | 개발/프로덕션 환경별 Redirect URI를 명확히 분리하여 관리. 배포 체크리스트에 포함 |
| R5 | Supabase Free Tier 제한 도달 (Storage, DB 용량) | Low | Medium | 갤러리 이미지 업로드 제한 (파일당 10MB, 게시글당 10장)으로 사전 억제. 사용량 모니터링 |
| R6 | 수료증 이미지 부적절한 파일 업로드 (악성 파일) | Low | High | MIME type 서버 사이드 검증 + 허용 확장자 화이트리스트. Storage bucket에 파일 타입 제한 설정 |
| R7 | 페이지네이션 성능 저하 (게시글 대량 누적 시) | Low | Low | OFFSET 기반 페이지네이션 사용하되, 초기 데이터 규모에서는 문제 없음. 추후 cursor 방식 전환 고려 |

---

## 11. Dependencies

### External Dependencies

| Dependency | Type | Impact if Unavailable |
|-----------|------|----------------------|
| Google OAuth (Google Cloud Console) | Authentication | 로그인 자체 불가. 대안 인증 수단 없음 |
| Supabase Cloud | BaaS (DB + Auth + Storage) | 전체 서비스 중단. 로컬 개발 시 Supabase CLI로 대체 가능 |
| Vercel | Hosting | 서비스 접근 불가. 타 호스팅(Netlify 등)으로 마이그레이션 가능 |
| Pretendard 웹폰트 CDN | Font | 시스템 폰트로 Fallback. 기능 영향 없음 |

### Internal Dependencies

| Item | What's Needed |
|------|--------------|
| Google Cloud Console 프로젝트 | OAuth Client ID/Secret 발급 |
| Supabase 프로젝트 | Project URL, Anon Key, Service Role Key |
| 도메인 (optional) | 커스텀 도메인 사용 시 DNS 설정 |

### Blocking vs Non-Blocking

- **Blocking**: Google OAuth 설정, Supabase 프로젝트 생성 (Phase 2 시작 전 필수)
- **Non-Blocking**: 커스텀 도메인, Pretendard 폰트 (fallback 가능)

---

## 12. Appendices

### A. Glossary

| Term | Definition |
|------|-----------|
| **수료생** | 특정 교육 과정을 완료한 사람 |
| **기수** | 교육 과정의 회차 번호 (정수, 예: 1, 2, 3...) |
| **반장 (Class Leader)** | 기수 내 운영을 돕는 중간 관리자 역할 |
| **Pending** | 가입 신청 후 관리자 승인을 기다리는 상태 |
| **RLS (Row Level Security)** | Supabase/PostgreSQL의 행 단위 접근 제어 정책 |
| **SSO (Single Sign-On)** | 하나의 인증(Google 계정)으로 서비스 이용 가능한 방식 |
| **BaaS (Backend as a Service)** | Supabase처럼 인증, DB, 스토리지를 통합 제공하는 백엔드 서비스 |

### B. References

- [Next.js 14 App Router Documentation](https://nextjs.org/docs/app)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth - Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Pretendard Font](https://github.com/orioncactus/pretendard)

### C. RLS Policy Examples

```sql
-- Users: 승인 멤버만 다른 유저 프로필 조회 가능
CREATE POLICY "Approved users can view profiles"
ON users FOR SELECT
USING (
  auth.uid() = id
  OR (SELECT role FROM users WHERE id = auth.uid()) NOT IN ('pending')
);

-- Posts: 승인 멤버만 조회 가능
CREATE POLICY "Approved users can view posts"
ON posts FOR SELECT
USING (
  (SELECT role FROM users WHERE id = auth.uid()) NOT IN ('pending')
);

-- Posts: 승인 멤버만 작성 가능
CREATE POLICY "Approved users can create posts"
ON posts FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND (SELECT role FROM users WHERE id = auth.uid()) NOT IN ('pending')
);

-- Posts: 공지는 Admin/ClassLeader만 작성 가능
CREATE POLICY "Only admin/leader can create notices"
ON posts FOR INSERT
WITH CHECK (
  type != 'notice'
  OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'class_leader')
);

-- Posts: 본인 글만 수정 가능
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);

-- Posts: 삭제 권한 (본인 + Admin + ClassLeader)
CREATE POLICY "Delete posts"
ON posts FOR DELETE
USING (
  auth.uid() = author_id
  OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'class_leader')
);

-- Comments: 삭제 권한 (본인 + Admin만)
CREATE POLICY "Delete comments"
ON comments FOR DELETE
USING (
  auth.uid() = author_id
  OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- Admin: 역할 변경은 Admin만
CREATE POLICY "Only admin can change roles"
ON users FOR UPDATE
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
```

### D. Deployment Checklist

- [ ] Supabase 프로젝트 생성 (Production)
- [ ] DB 스키마 마이그레이션 실행
- [ ] RLS 정책 배포
- [ ] Storage 버킷 생성 (certificates, gallery)
- [ ] Google Cloud Console OAuth 설정 (Production redirect URI)
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] 커스텀 도메인 연결 (optional)
- [ ] 전체 기능 E2E 수동 테스트
- [ ] RLS 보안 테스트 (비인가 API 호출)
- [ ] 모바일/데스크탑 반응형 확인

---

## 13. Self-Score (100-Point Framework)

### Category 1: AI-Specific Optimization (25 points)

| Criterion | Max | Score | Justification |
|-----------|-----|-------|---------------|
| Sequential Phase Structure | 10 | 9 | 8개 Phase를 dependency 순서대로 배치. 각 Phase가 명확한 선행 조건 명시. Phase당 AI 작업 단위가 적절 (1주 내외). FR-XX 코드 체계 사용. -1: Phase 4가 공지+게시판+인터랙션으로 약간 큰 편 |
| Explicit Non-Goals & Boundaries | 8 | 8 | 9개 Non-Goal 명시. Phase 1 Boundaries 별도 섹션. Future Considerations 분리. 모든 경계를 긍정문으로 기술 |
| Structured Document Format | 7 | 7 | 13개 주요 섹션 + 하위 섹션. 일관된 마크다운 포맷. FR/NFR 코드 체계. 테이블, 코드 블록, 리스트 적절히 혼용 |
| **Subtotal** | **25** | **24** | |

### Category 2: Traditional PRD Core (25 points)

| Criterion | Max | Score | Justification |
|-----------|-----|-------|---------------|
| Problem Statement & Context | 7 | 6 | 3개 유저 세그먼트별 Pain Point 구체적 기술. Why Now 섹션 포함. -1: 정량적 시장 규모 데이터 없음 (폐쇄형 커뮤니티 특성상 해당 없음) |
| Goals & Success Metrics | 8 | 7 | P0/P1 메트릭 테이블 분리. Instrumentation 섹션 포함. -1: Baseline 데이터가 "없음"인 항목이 많으나 그린필드 특성상 불가피 |
| Target Audience & Personas | 5 | 5 | 3개 페르소나 (Member, Class Leader, Admin). Goals, Pain Points, Use Cases 모두 포함. 구체적 시나리오 기술 |
| Technical Specifications | 5 | 5 | 버전 명시 (Next.js 14, TypeScript 5, Tailwind 3, PostgreSQL 15). 호환성 요구사항 포함. 성능 임계값 구체적 |
| **Subtotal** | **25** | **23** | |

### Category 3: Implementation Clarity (30 points)

| Criterion | Max | Score | Justification |
|-----------|-----|-------|---------------|
| Functional Requirements | 10 | 10 | 20개 FR, 고유 ID 체계 (FR-AUTH/ADMIN/NOTICE/BOARD/GALLERY/INTERACT/PROFILE/UI). 모든 FR에 P0/P1 우선순위. Given-When-Then 형식 Acceptance Criteria. 코드 예시 포함 |
| Non-Functional Requirements | 5 | 5 | Security (3), Performance (2), Reliability (2), Maintainability (2) 총 9개 NFR. 구체적 임계값 (LCP < 3초, API < 500ms) |
| Technical Architecture | 10 | 9 | ASCII 시스템 다이어그램. 전체 DB 스키마 (CREATE TABLE + INDEX). Page Routes 목록. Storage Buckets 정의. RLS 정책 예시. -1: API contract 명세는 Supabase 자동 생성으로 대체 |
| Implementation Phases | 5 | 5 | 8개 Phase, 주차별 일정. 각 Phase의 Objectives, Deliverables, Dependencies, FR Coverage 명시 |
| **Subtotal** | **30** | **29** | |

### Category 4: Completeness & Quality (20 points)

| Criterion | Max | Score | Justification |
|-----------|-----|-------|---------------|
| Risk Assessment | 5 | 5 | 7개 리스크 식별. Probability/Impact 매트릭스. 각 리스크에 대한 Mitigation 전략 구체적 |
| Dependencies | 3 | 3 | External (4개), Internal (3개) 분리. Blocking/Non-blocking 분류 포함. 대안 명시 (Supabase CLI, Netlify) |
| Examples & Templates | 7 | 6 | RLS 정책 SQL 예시 8개. 닉네임 생성 로직. 검색 쿼리 예시. DB 스키마 전체. Deployment 체크리스트. -1: UI 와이어프레임/목업 없음 (PRD 범위 밖으로 판단) |
| Documentation Quality | 5 | 5 | 버전, 날짜, 상태 메타데이터. 용어 사전. 참조 링크. 일관된 포맷팅 |
| **Subtotal** | **20** | **19** | |

---

### Final Score

| Category | Max | Score |
|----------|-----|-------|
| AI-Specific Optimization | 25 | 24 |
| Traditional PRD Core | 25 | 23 |
| Implementation Clarity | 30 | 29 |
| Completeness & Quality | 20 | 19 |
| **Total** | **100** | **95** |

**감점 사유 요약:**
- (-1) Phase 4가 공지+게시판+인터랙션을 포함하여 AI 단일 작업 단위로는 약간 큰 편. 필요 시 Phase 4a/4b로 분리 가능
- (-2) 정량적 시장 규모/Baseline 데이터 부재. 폐쇄형 커뮤니티 특성상 외부 벤치마크가 존재하지 않아 불가피
- (-1) API contract를 별도 명세하지 않음. Supabase가 REST/GraphQL API를 자동 생성하므로 별도 정의 불필요하다고 판단
- (-1) UI 와이어프레임/목업 미포함. 디자인 가이드 섹션에서 컬러/폰트/버튼 스타일은 정의했으나, 페이지별 레이아웃 목업은 PRD 범위 밖으로 판단
