"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error");

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-3 text-sm font-medium tracking-widest text-[#7C9A7E] uppercase">
          Wellness College
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Alumni Connect
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-md mb-10 leading-relaxed">
          웰니스컬리지 수료생들의 기록과 연결을 위한 공간입니다.
          <br />
          수료증이 있는 분만 가입 가능합니다.
        </p>

        {hasError && (
          <p className="text-destructive text-sm mb-6">
            로그인 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google 계정으로 시작하기
        </button>
      </div>

      {/* 소개 섹션 */}
      <section className="border-t border-border px-6 py-16">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-[#7C9A7E] mb-2">404+</div>
            <div className="text-sm text-muted-foreground">수료생</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#7C9A7E] mb-2">7기</div>
            <div className="text-sm text-muted-foreground">누적 기수</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#7C9A7E] mb-2">97%</div>
            <div className="text-sm text-muted-foreground">프로그램 만족도</div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        © 2025 Alumni Connect · Wellness College
      </footer>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
