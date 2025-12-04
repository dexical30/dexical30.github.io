import type { MDXComponents } from 'mdx/types';
import { slugify } from '@/lib/toc';

// children에서 텍스트 추출
function getTextFromChildren(children: any): string {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('');
  }
  if (children?.props?.children) {
    return getTextFromChildren(children.props.children);
  }
  return '';
}

export const mdxComponents: MDXComponents = {
  // 헤딩
  h1: ({ children }) => {
    const text = getTextFromChildren(children);
    const id = slugify(text);
    return (
      <h1 id={id} className="text-4xl font-bold mt-8 mb-4 text-neutral-900 dark:text-neutral-100 scroll-mt-20">
        {children}
      </h1>
    );
  },
  h2: ({ children }) => {
    const text = getTextFromChildren(children);
    const id = slugify(text);
    return (
      <h2 id={id} className="text-3xl font-semibold mt-8 mb-3 text-neutral-900 dark:text-neutral-100 scroll-mt-20">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = getTextFromChildren(children);
    const id = slugify(text);
    return (
      <h3 id={id} className="text-2xl font-semibold mt-6 mb-3 text-neutral-800 dark:text-neutral-200 scroll-mt-20">
        {children}
      </h3>
    );
  },
  h4: ({ children }) => (
    <h4 className="text-xl font-medium mt-4 mb-2 text-neutral-800 dark:text-neutral-200">
      {children}
    </h4>
  ),

  // 본문
  p: ({ children }) => (
    <p className="my-4 leading-7 text-neutral-700 dark:text-neutral-300">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
      {children}
    </strong>
  ),

  // 링크
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  // 리스트
  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-neutral-700 dark:text-neutral-300">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-7">{children}</li>
  ),

  // 인용문
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 italic">
      {children}
    </blockquote>
  ),

  // 코드
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 p-4 rounded-lg bg-neutral-900 dark:bg-neutral-950 overflow-x-auto">
      {children}
    </pre>
  ),

  // 테이블
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-neutral-100 dark:bg-neutral-800">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-300 dark:border-neutral-600">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
      {children}
    </td>
  ),

  // 수평선
  hr: () => (
    <hr className="my-8 border-neutral-200 dark:border-neutral-700" />
  ),
};

export function useMDXComponents(baseComponents: MDXComponents): MDXComponents {
  return {
    ...baseComponents,
    ...mdxComponents,
  };
}
