import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

export async function CodeBlock({ children, language = 'text', filename }: CodeBlockProps) {
  const code = children.trim();
  
  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
    defaultColor: false, // CSS 변수로 테마 제어
  });

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm">
      {filename && (
        <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 font-mono">
          {filename}
        </div>
      )}
      <div
        className="shiki-wrapper [&_pre]:!m-0 [&_pre]:!p-4 [&_pre]:!overflow-x-auto [&_code]:!text-sm [&_code]:!font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

