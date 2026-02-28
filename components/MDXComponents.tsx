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

function PreWithMermaid(props: { children?: ReactNode }) {
  const child = props.children as ReactElement<CodeBlockProps> | undefined
  if (isValidElement(child) && child.props?.className?.includes?.('language-mermaid')) {
    const raw = child.props.children
    const code =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw.join('') : String(raw ?? '')
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
