import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, name")
          .eq("id", user.id)
          .single();

        // 온보딩 미완료 (이름 없음)
        if (!profile?.name) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }

        // 승인 대기 중
        if (profile?.role === "pending") {
          return NextResponse.redirect(`${origin}/pending`);
        }

        // 승인된 멤버
        return NextResponse.redirect(`${origin}/notice`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
