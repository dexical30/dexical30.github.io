'use client'

import { motion } from 'framer-motion'
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

/**
 * 브라우저 스크롤 위치에 따라 자식 요소를 sticky처럼 동작시키는 래퍼 컴포넌트.
 *
 * 동작 방식:
 * - `normal`: wrapper의 top이 `offsetTop`보다 아래에 있으면 일반 문서 흐름으로 렌더링
 * - `fixed`: wrapper의 top이 `offsetTop`에 도달하면 `position: fixed`로 고정
 * - `bottom`: wrapper의 bottom에 닿으면 `position: absolute`로 전환해 wrapper 내부 하단에 고정
 *
 * 특징:
 * - `offsetTop`은 number(px) 또는 string(rem/em/% 등 CSS 단위)을 지원
 * - fixed 전환 시 wrapper 높이를 유지해 레이아웃 점프를 방지
 * - ResizeObserver와 resize 이벤트로 크기/레이아웃 변경 시 계산값을 갱신
 */

interface BrowserStickyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 스크롤 시, 요소의 top이 뷰포트 top으로부터 이 값만큼 도달하면 고정됩니다.
   * - number: px
   * - string: rem/em/% 등 CSS 단위를 그대로 지원
   */
  offsetTop?: number | string
  children: ReactNode
}

function buildOffsetCss(offsetTop: number | string) {
  if (typeof offsetTop === 'number') return `${offsetTop}px`
  return offsetTop
}

function measureOffsetTopPx(offsetTop: number | string, fontSizePx?: number) {
  const el = document.createElement('div')
  el.style.position = 'fixed'
  el.style.left = '0'
  el.style.top = buildOffsetCss(offsetTop)
  el.style.width = '0'
  el.style.height = '0'
  el.style.visibility = 'hidden'
  el.style.pointerEvents = 'none'

  if (typeof fontSizePx === 'number' && Number.isFinite(fontSizePx)) {
    el.style.fontSize = `${fontSizePx}px`
  }

  document.body.appendChild(el)
  const topPx = el.getBoundingClientRect().top
  document.body.removeChild(el)
  return topPx
}

type StickyMode = 'normal' | 'fixed' | 'bottom'

export default function BrowserSticky({
  children,
  offsetTop = 0,
  style,
  ...props
}: BrowserStickyProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<StickyMode>('normal')
  const [wrapperHeight, setWrapperHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [offsetTopPx, setOffsetTopPx] = useState(0)
  const [fixedLeft, setFixedLeft] = useState(0)
  const [fixedWidth, setFixedWidth] = useState(0)

  const updateMode = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const rect = wrapper.getBoundingClientRect()
    if (rect.top > offsetTopPx) {
      setMode('normal')
      return
    }

    const remaining = rect.bottom - offsetTopPx
    if (remaining >= contentHeight) {
      setMode('fixed')
      setFixedLeft(rect.left)
      setFixedWidth(rect.width)
      return
    }

    setMode('bottom')
  }, [contentHeight, offsetTopPx])

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const sticky = stickyRef.current
    if (!wrapper || !sticky) return

    const recalc = () => {
      const wrapperRect = wrapper.getBoundingClientRect()
      const stickyRect = sticky.getBoundingClientRect()

      const fontSizePx =
        Number.parseFloat(window.getComputedStyle(sticky).fontSize || '0') || undefined
      const measuredOffsetTopPx = measureOffsetTopPx(offsetTop, fontSizePx)

      setWrapperHeight(wrapperRect.height)
      setContentHeight(stickyRect.height)
      setOffsetTopPx(measuredOffsetTopPx)
      setFixedLeft(wrapperRect.left)
      setFixedWidth(wrapperRect.width)
    }

    recalc()

    const ro = new ResizeObserver(() => recalc())
    ro.observe(wrapper)
    ro.observe(sticky)

    window.addEventListener('resize', recalc)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recalc)
    }
  }, [offsetTop])

  useEffect(() => {
    const onScroll = () => {
      updateMode()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [updateMode])

  useEffect(() => {
    updateMode()
  }, [updateMode, wrapperHeight, contentHeight, offsetTopPx])

  const wrapperStyle = useMemo(() => {
    const next: CSSProperties = { ...(style || {}) }
    if (mode !== 'normal') next.height = wrapperHeight
    if (next.position == null) next.position = 'relative'
    return next
  }, [mode, style, wrapperHeight])

  const stickyStyle = useMemo<CSSProperties>(() => {
    if (mode === 'fixed') {
      return {
        position: 'fixed',
        top: buildOffsetCss(offsetTop),
        left: fixedLeft,
        width: fixedWidth,
        zIndex: 40,
      }
    }
    if (mode === 'bottom') {
      return {
        position: 'absolute',
        top: Math.max(0, wrapperHeight - contentHeight),
        left: 0,
        width: '100%',
        zIndex: 40,
      }
    }
    return { position: 'static' }
  }, [contentHeight, fixedLeft, fixedWidth, mode, offsetTop, wrapperHeight])

  return (
    <div ref={wrapperRef} {...props} style={wrapperStyle}>
      <motion.div ref={stickyRef} style={stickyStyle}>
        {children}
      </motion.div>
    </div>
  )
}
