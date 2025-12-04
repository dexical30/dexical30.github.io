'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        const isDark = resolvedTheme === 'dark';
        
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart.trim());
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('다이어그램을 렌더링할 수 없습니다.');
      }
    };

    renderChart();
  }, [chart, resolvedTheme, mounted]);

  if (error) {
    return (
      <div className="my-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
        <p className="font-medium">Mermaid 에러</p>
        <p className="text-sm mt-1">{error}</p>
        <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-x-auto">
          {chart}
        </pre>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="my-4 p-4 rounded-lg bg-[#fafafa] dark:bg-[#282c34] border border-neutral-200 dark:border-neutral-700 min-h-[100px] flex items-center justify-center">
        <span className="text-neutral-400">다이어그램 로딩중...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 p-4 rounded-lg bg-[#fafafa] dark:bg-[#282c34] border border-neutral-200 dark:border-neutral-700 overflow-x-auto flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

