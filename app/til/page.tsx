import Link from "next/link";
import { getAllTILs } from "@/lib/til";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BlogListHeader from "@/components/blog-list-header";
import BlogLayout from "@/components/layout/blog-layout";

export default function TILPage() {
  const tils = getAllTILs();

  return (
    <BlogLayout>
      <BlogListHeader
        title="TIL"
        description="Today I Learned - 매일 배운 것들을 기록합니다."
      />

      <Separator className="mb-8" />

      {tils.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">아직 작성된 TIL이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tils.map((til) => (
            <Link key={til.slug} href={`/til/${til.slug}`} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <time dateTime={til.date} className="text-lg font-semibold">
                      {new Date(til.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </CardHeader>
                <CardContent>
                  {til.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {til.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </BlogLayout>
  );
}
