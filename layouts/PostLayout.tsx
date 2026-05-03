import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TOC from '@/components/TOC'
import BrowserSticky from '@/components/BrowserSticky'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, toc } = content
  const basePath = path.split('/')[0]
  /** sticky 헤더 사용 시 TOC가 가려지지 않도록 top 여백 */
  const tocOffsetTop = siteMetadata.stickyNav ? '7rem' : '2rem'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <header className="max-w-post mx-auto pt-6">
          <div className="space-y-1 border-b border-gray-200 pb-6 text-center dark:border-gray-700">
            <dl className="space-y-10">
              <div>
                <dt className="sr-only">Published on</dt>
                <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString(siteMetadata.language, postDateTemplate)}
                  </time>
                </dd>
              </div>
            </dl>
            <div>
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
        </header>
        <div className="relative">
          <div className="max-w-post mx-auto divide-y divide-gray-200 pb-8 dark:divide-gray-700">
            <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
            <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
              <Link href={discussUrl(path)} rel="nofollow">
                Discuss on Twitter
              </Link>
              {` • `}
              <Link href={editUrl(filePath)}>View on GitHub</Link>
            </div>
            {siteMetadata.comments && (
              <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}
          </div>
          {/* Side TOC */}
          <aside className="post-xl:absolute post-xl:inset-y-0 post-xl:left-[calc(50%+25rem+3rem)] post-xl:block post-xl:w-64 hidden">
            <BrowserSticky offsetTop={tocOffsetTop} className="h-full">
              <div className="pt-10 pb-8">
                <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  On this page
                </h2>
                <div className="pt-4">
                  <TOC toc={toc} fromHeading={2} toHeading={4} />
                </div>
              </div>
            </BrowserSticky>
          </aside>
        </div>
      </article>
    </SectionContainer>
  )
}

const PostMeta = ({
  content,
  next,
  prev,
}: {
  content: LayoutProps['content']
  next: LayoutProps['next']
  prev: LayoutProps['prev']
}) => {
  const { tags, path } = content
  const basePath = path.split('/')[0]

  return (
    <>
      <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
        {tags && (
          <div className="py-4 xl:py-8">
            <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Tags
            </h2>
            <div className="flex flex-wrap">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
        )}
        {(next || prev) && (
          <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
            {prev && prev.path && (
              <div>
                <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  Previous Article
                </h2>
                <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                  <Link href={`/${prev.path}`}>{prev.title}</Link>
                </div>
              </div>
            )}
            {next && next.path && (
              <div>
                <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  Next Article
                </h2>
                <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                  <Link href={`/${next.path}`}>{next.title}</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="pt-4 xl:pt-8">
        <Link
          href={`/${basePath}`}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          aria-label="Back to the blog"
        >
          &larr; Back to the blog
        </Link>
      </div>
    </>
  )
}
