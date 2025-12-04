'use client';

import { useEffect, useState } from 'react';
import { TocItem } from '@/lib/toc';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    // 모든 헤딩 요소를 관찰
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav>
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide pr-4">
        <h4 className="text-sm font-semibold mb-3 text-foreground">
          목차
        </h4>
        <ul className="space-y-0.5 text-sm">
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                paddingLeft: `${(item.level - 1) * 0.75}rem`,
              }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  'block py-0.5 transition-colors hover:text-foreground',
                  activeId === item.id
                    ? 'text-foreground font-medium border-l-2 border-primary pl-2 -ml-2'
                    : 'text-muted-foreground border-l-2 border-transparent pl-2 -ml-2'
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
