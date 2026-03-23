'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useDebounce from '../hooks/useDebounce'

export type TocItem = {
  value: string
  url: string
  depth: number
}

export type TOCProps = {
  toc: TocItem[]
  /** 포함할 최소 헤딩 레벨 (기본 2) */
  fromHeading?: number
  /** 포함할 최대 헤딩 레벨 (기본 4) */
  toHeading?: number
  /**
   * 헤딩 depth 1단계마다 들여쓰기 (ch 단위, 기본 2 = 공백 2칸 너비에 가깝게)
   * 예: h2 대비 h3는 +2ch, h4는 +4ch
   */
  indentChPerDepthStep?: number
  /** 본문에서 현재 섹션 판별 시 뷰포트 상단에서의 오프셋(px) */
  scrollRootOffsetPx?: number
  className?: string
}

function slugFromTocUrl(url: string): string | null {
  if (!url.startsWith('#')) return null
  try {
    return decodeURIComponent(url.slice(1))
  } catch {
    return url.slice(1)
  }
}

/**
 * 긴 목차용 TOC: 스크롤 영역은 뷰포트 높이의 40%,
 * depth마다 2ch 단위 들여쓰기, 활성 항목이 목차 스크롤 영역 상단에서 약 20% 위치에 오도록 자동 스크롤.
 */
export default function TOC({
  toc,
  fromHeading = 2,
  toHeading = 4,
  indentChPerDepthStep = 2,
  scrollRootOffsetPx = 120,
  className = '',
}: TOCProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())
  const isFirstScrollSync = useRef(true)

  const items = useMemo(() => {
    return toc.filter((h) => h.depth >= fromHeading && h.depth <= toHeading)
  }, [toc, fromHeading, toHeading])

  const ids = useMemo(() => {
    return items.map((item) => slugFromTocUrl(item.url)).filter((id): id is string => Boolean(id))
  }, [items])

  const [activeId, setActiveId] = useState<string>(() => ids[0] ?? '')

  useEffect(() => {
    if (ids.length === 0) return
    setActiveId((prev) => (ids.includes(prev) ? prev : ids[0]))
  }, [ids])

  const resolveActiveHeading = useCallback(() => {
    if (ids.length === 0) return

    const y = window.scrollY + scrollRootOffsetPx
    let current = ids[0]

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const top = el.offsetTop
      if (top <= y) current = id
    }

    setActiveId((prev) => (prev === current ? prev : current))
  }, [ids, scrollRootOffsetPx])

  const debouncedResolveActiveHeading = useDebounce(resolveActiveHeading, 50)

  useEffect(() => {
    if (ids.length === 0) return

    resolveActiveHeading()
    window.addEventListener('scroll', debouncedResolveActiveHeading, { passive: true })
    window.addEventListener('resize', debouncedResolveActiveHeading)

    return () => {
      window.removeEventListener('scroll', debouncedResolveActiveHeading)
      window.removeEventListener('resize', debouncedResolveActiveHeading)
    }
  }, [ids, debouncedResolveActiveHeading, resolveActiveHeading])

  /** 활성 항목이 TOC 스크롤 박스 안에서 상단에서 약 20% 지점에 오도록 스크롤 */
  const scrollTocToActive = useCallback(
    (behavior: ScrollBehavior) => {
      if (!activeId || !scrollRef.current) return
      const container = scrollRef.current
      const el = itemRefs.current.get(activeId)
      if (!el) return

      const cRect = container.getBoundingClientRect()
      const iRect = el.getBoundingClientRect()
      const deltaFromContainerTop = iRect.top - cRect.top
      const targetLine = container.clientHeight * 0.2
      const nextTop = container.scrollTop + deltaFromContainerTop - targetLine
      const max = Math.max(0, container.scrollHeight - container.clientHeight)
      const clamped = Math.max(0, Math.min(nextTop, max))

      container.scrollTo({ top: clamped, behavior })
    },
    [activeId]
  )

  useEffect(() => {
    if (!activeId) return

    const behavior: ScrollBehavior = isFirstScrollSync.current ? 'auto' : 'smooth'
    isFirstScrollSync.current = false

    requestAnimationFrame(() => scrollTocToActive(behavior))
  }, [activeId, scrollTocToActive])

  const setItemRef = useCallback((id: string, node: HTMLLIElement | null) => {
    if (node) itemRefs.current.set(id, node)
    else itemRefs.current.delete(id)
  }, [])

  if (items.length === 0) return null

  return (
    <div
      ref={scrollRef}
      className={`max-h-[40vh] overflow-y-auto overscroll-y-contain pr-1 ${className}`.trim()}
      aria-label="Table of contents"
    >
      <ul className="m-0 list-none space-y-1 p-0 text-sm leading-6">
        {items.map((item, index) => {
          const id = slugFromTocUrl(item.url)
          if (!id) return null

          const depthSteps = Math.max(0, item.depth - fromHeading)
          const paddingLeftCh = depthSteps * indentChPerDepthStep

          const isActive = id === activeId

          return (
            <li
              key={`${index}-${id}-${item.depth}`}
              ref={(node) => setItemRef(id, node)}
              style={{ paddingLeft: `${paddingLeftCh}ch` }}
            >
              <a
                href={item.url}
                className={
                  isActive
                    ? 'text-primary-600 dark:text-primary-300 font-semibold'
                    : 'text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300'
                }
                onClick={() => {
                  setActiveId(id)
                  requestAnimationFrame(() => scrollTocToActive('smooth'))
                }}
              >
                {item.value}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
