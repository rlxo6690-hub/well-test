import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PendingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "pending") redirect("/notice");

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-full bg-[#7C9A7E]/10 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C9A7E" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
        </div>

        <h1 className="text-xl font-bold text-foreground mb-3">
          승인 대기 중
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          안녕하세요, {profile?.name}님.<br />
          가입 신청이 접수되었습니다.<br />
          관리자가 수료증을 확인한 후 승인해드립니다.
        </p>

        <form action={handleSignOut}>
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            다른 계정으로 로그인
          </button>
        </form>
      </div>
    </main>
  );
}
