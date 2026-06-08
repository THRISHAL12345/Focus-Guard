import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps): React.ReactElement {
  return (
    <div style={{
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--text-primary)', marginTop: 16, marginBottom: 8, fontWeight: 600 }} {...props} />,
          h2: ({node, ...props}) => <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-primary)', marginTop: 16, marginBottom: 8, fontWeight: 600 }} {...props} />,
          h3: ({node, ...props}) => <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-primary)', marginTop: 16, marginBottom: 8, fontWeight: 600 }} {...props} />,
          p: ({node, ...props}) => <p style={{ marginBottom: 12 }} {...props} />,
          a: ({node, ...props}) => <a style={{ color: 'var(--accent)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'} {...props} />,
          ul: ({node, ...props}) => <ul style={{ paddingLeft: 24, marginBottom: 12, listStyleType: 'square' }} {...props} />,
          ol: ({node, ...props}) => <ol style={{ paddingLeft: 24, marginBottom: 12 }} {...props} />,
          li: ({node, ...props}) => <li style={{ marginBottom: 4 }} {...props} />,
          blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '3px solid var(--accent)', margin: '0 0 12px 0', padding: '4px 0 4px 16px', color: 'var(--text-muted)', background: 'var(--bg-elevated)' }} {...props} />,
          table: ({node, ...props}) => <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }} {...props} />,
          th: ({node, ...props}) => <th style={{ borderBottom: '1px solid var(--border-default)', padding: 8, textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }} {...props} />,
          td: ({node, ...props}) => <td style={{ borderBottom: '1px solid var(--border-subtle)', padding: 8 }} {...props} />,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div style={{ marginBottom: 12, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, '')}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, background: 'var(--bg-void)' }}
                />
              </div>
            ) : (
              <code {...props} style={{ background: 'var(--bg-elevated)', padding: '2px 4px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: '0.9em', color: 'var(--accent)' }}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
