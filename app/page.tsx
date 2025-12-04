import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-8 text-center px-4">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">
            dexical의 블로그
          </h1>
          <p className="text-xl text-muted-foreground">
            개발과 기술에 대한 이야기를 공유합니다
          </p>
        </div>
        <Link href="/blog">
          <Button size="lg" className="text-lg px-8 py-6">
            블로그 보러가기
          </Button>
        </Link>
      </main>
    </div>
  );
}
