'use client'

import { useEffect, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  code: string
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme:
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
          ? 'dark'
          : 'default',
    })
  }, [])

  useEffect(() => {
    if (!code?.trim()) return

    const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`

    mermaid
      .render(id, code.trim())
      .then(({ svg: result }) => {
        setSvg(result)
        setError(null)
      })
      .catch((err) => {
        setError(err?.message || 'Mermaid 렌더링 실패')
        setSvg(null)
      })
  }, [code])

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-700 dark:text-red-400">
          Mermaid 다이어그램 오류
        </p>
        <pre className="mt-2 overflow-x-auto text-xs text-red-600 dark:text-red-500">{error}</pre>
        <pre className="mt-2 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
          {code}
        </pre>
      </div>
    )
  }

  if (svg) {
    return (
      <div
        className="my-4 flex justify-center [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }

  return (
    <div className="my-4 flex min-h-[80px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
      <span className="text-sm text-gray-500 dark:text-gray-400">다이어그램 로딩 중...</span>
    </div>
  )
}
