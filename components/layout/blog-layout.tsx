import { cn } from "@/lib/utils";
interface BlogLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const BlogLayout = ({ children, className, ...props }: BlogLayoutProps) => {
  return (
    <div
      className={cn("container mx-auto px-4 py-4 max-w-4xl", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default BlogLayout;
