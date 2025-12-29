import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlogListHeader from "@/components/blog-list-header";
import BlogLayout from "@/components/layout/blog-layout";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <BlogLayout>
      <BlogListHeader
        title="Blog"
        description="개발하면서 배운 것들과 생각들을 공유합니다."
      />

      <Separator className="mb-8" />

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            아직 작성된 포스트가 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {post.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </BlogLayout>
  );
}
