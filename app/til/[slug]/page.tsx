import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTILs, getTILBySlug } from "@/lib/til";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/table-of-contents";
import { extractHeadings } from "@/lib/toc";
import BlogLayout from "@/components/layout/blog-layout";

export async function generateStaticParams() {
  const tils = getAllTILs();
  return tils.map((til) => ({
    slug: til.slug,
  }));
}

// generateStaticParams에서 정의되지 않은 slug는 404
export const dynamicParams = false;

export default async function TILDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 메타데이터는 기존 방식으로 가져오기 (frontmatter 파싱)
  const tilMeta = getTILBySlug(slug);

  if (!tilMeta) {
    notFound();
  }

  // MDX 파일을 dynamic import로 가져오기
  // mdx-components.tsx의 커스텀 컴포넌트가 자동으로 적용됨
  const { default: TIL } = await import(`@/content/TIL/${slug}.md`);

  // 목차 생성을 위해 헤딩 추출
  const headings = extractHeadings(tilMeta.content);

  return (
    <BlogLayout>
      <div className="max-w-7xl mx-auto">
        <Link href="/til">
          <Button variant="ghost" className="mb-8">
            ← 목록으로
          </Button>
        </Link>

        <div className="flex gap-8 items-start justify-center">
          {/* 메인 콘텐츠 */}
          <article className="flex-1 max-w-3xl relative">
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <time
                  dateTime={tilMeta.metadata.date}
                  className="text-2xl font-bold"
                >
                  {new Date(tilMeta.metadata.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              {tilMeta.metadata.description && (
                <p className="text-xl text-muted-foreground mb-4">
                  {tilMeta.metadata.description}
                </p>
              )}
              {tilMeta.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tilMeta.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <Separator className="mb-8" />

            <div className="max-w-none">
              <TIL />
            </div>

            {/* 오른쪽 목차 - 컨텐츠 바로 옆 */}
            {headings.length > 0 && (
              <aside className="hidden xl:block w-64 shrink-0 absolute left-[calc(100%+2rem)] top-0">
                <div className="sticky top-24">
                  <TableOfContents items={headings} />
                </div>
              </aside>
            )}
          </article>
        </div>
      </div>
    </BlogLayout>
  );
}
