interface BlogListHeaderProps {
  title: string;
  description: string;
}
const BlogListHeader: React.FC<BlogListHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="mb-12">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  );
};

export default BlogListHeader;
