"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cohort, setCohort] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cohort || !file) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      // 수료증 이미지 업로드
      const ext = file.name.split(".").pop();
      const filePath = `certificates/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("certificates")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("certificates")
        .getPublicUrl(filePath);

      // 프로필 업데이트
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name,
          cohort: parseInt(cohort),
          certificate_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      router.push("/pending");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-xs font-medium tracking-widest text-[#7C9A7E] uppercase mb-2">
            Alumni Connect
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            가입 신청
          </h1>
          <p className="text-sm text-muted-foreground">
            관리자 승인 후 서비스를 이용할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="실명을 입력해주세요"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              기수
            </label>
            <input
              type="number"
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              placeholder="숫자만 입력 (예: 3)"
              min={1}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              수료증 이미지
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] transition file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-foreground file:text-background"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "제출 중..." : "가입 신청하기"}
          </button>
        </form>
      </div>
    </main>
  );
}
