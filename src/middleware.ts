import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // 공개 경로 (로그인 불필요)
  const publicPaths = ["/", "/auth/callback"];
  if (publicPaths.includes(pathname)) return supabaseResponse;

  // 비로그인 → 홈으로
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 로그인된 경우 role 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  // 온보딩 미완료 → /onboarding으로
  if (!profile?.name && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Pending 상태 → /pending으로 (onboarding, pending 제외)
  if (
    profile?.role === "pending" &&
    pathname !== "/pending" &&
    pathname !== "/onboarding"
  ) {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // Admin 전용 경로
  if (pathname.startsWith("/admin") && profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/notice", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
