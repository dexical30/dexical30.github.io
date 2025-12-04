export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// 텍스트를 URL-safe한 slug로 변환
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-가-힣]+/g, '')
    .replace(/\-\-+/g, '-');
}

// MDX 콘텐츠에서 헤딩 추출
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}
