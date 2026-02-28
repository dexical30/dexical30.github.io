declare module 'mermaid' {
  interface MermaidConfig {
    startOnLoad?: boolean
    theme?: string
    [key: string]: unknown
  }

  interface RenderResult {
    svg: string
    bindFunctions?: (element: Element) => void
  }

  interface MermaidAPI {
    initialize(config: MermaidConfig): void
    render(id: string, text: string, container?: Element): Promise<RenderResult>
  }

  const mermaid: MermaidAPI
  export default mermaid
}
