import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const tilDirectory = path.join(process.cwd(), 'content/TIL');

export interface TILMetadata {
  slug: string;
  date: string;
  description: string;
  tags: string[];
}

export function getAllTILs(): TILMetadata[] {
  // content/TIL 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(tilDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(tilDirectory);
  const allTILsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      // 파일명에서 확장자 제거하여 slug 생성
      const slug = fileName.replace(/\.(mdx|md)$/, '');

      // 파일 내용 읽기
      const fullPath = path.join(tilDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // gray-matter로 메타데이터 파싱
      const { data } = matter(fileContents);

      // 파일명에서 날짜 추출 (YYYY-MM-DD 형식)
      const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
      const dateFromFilename = dateMatch ? dateMatch[1] : '';

      return {
        slug,
        date: data.date || dateFromFilename || new Date().toISOString().split('T')[0],
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
      } as TILMetadata;
    });

  // 날짜순으로 정렬 (최신순)
  return allTILsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getTILBySlug(slug: string) {
  const fullPath = path.join(tilDirectory, `${slug}.md`);
  const fullPathMdx = path.join(tilDirectory, `${slug}.mdx`);

  let filePath: string | null = null;
  if (fs.existsSync(fullPath)) {
    filePath = fullPath;
  } else if (fs.existsSync(fullPathMdx)) {
    filePath = fullPathMdx;
  }

  if (!filePath) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // 파일명에서 날짜 추출
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  const dateFromFilename = dateMatch ? dateMatch[1] : '';

  return {
    slug,
    metadata: {
      date: data.date || dateFromFilename || new Date().toISOString().split('T')[0],
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
    },
    content,
  };
}

