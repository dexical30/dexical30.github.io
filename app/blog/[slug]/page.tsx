import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/blog">
        <Button variant="ghost" className="mb-8">
          ← 목록으로
        </Button>
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.metadata.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">
          {post.metadata.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      <Separator className="mb-8" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
