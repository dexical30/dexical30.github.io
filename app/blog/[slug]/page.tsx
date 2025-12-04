import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// generateStaticParams에서 정의되지 않은 slug는 404
export const dynamicParams = false;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // 메타데이터는 기존 방식으로 가져오기 (frontmatter 파싱)
  const postMeta = getPostBySlug(slug);

  if (!postMeta) {
    notFound();
  }

  // MDX 파일을 dynamic import로 가져오기
  // mdx-components.tsx의 커스텀 컴포넌트가 자동으로 적용됨
  const { default: Post } = await import(`@/content/posts/${slug}.mdx`);

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/blog">
        <Button variant="ghost" className="mb-8">
          ← 목록으로
        </Button>
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{postMeta.metadata.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">
          {postMeta.metadata.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={postMeta.metadata.date}>
            {new Date(postMeta.metadata.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      <Separator className="mb-8" />

      <div className="max-w-none">
        <Post />
      </div>
    </article>
  );
}
