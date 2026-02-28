import { ReactNode, isValidElement, ReactElement } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import MermaidDiagram from './MermaidDiagram'

interface CodeBlockProps {
  className?: string
  children?: ReactNode
}

/** React 노드 트리에서 텍스트만 추출 (MDX 코드 블록이 객체/배열로 올 때 사용) */
function getTextFromChildren(node: ReactNode): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextFromChildren).join('')
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode }
    if (props.children != null) return getTextFromChildren(props.children)
  }
  return ''
}

function PreWithMermaid(props: { children?: ReactNode }) {
  const child = props.children as ReactElement<CodeBlockProps> | undefined
  if (isValidElement(child) && child.props?.className?.includes?.('language-mermaid')) {
    const code = getTextFromChildren(child.props.children)
    return <MermaidDiagram code={code} />
  }
  return <Pre {...(props as { children: ReactNode })} />
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: PreWithMermaid,
  table: TableWrapper,
  BlogNewsletterForm,
}
