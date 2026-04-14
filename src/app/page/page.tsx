'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const s = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: 'system-ui, sans-serif' } as const,
  card: { width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' } as const,
  heading: { fontSize: '20px', fontWeight: 600, color: '#333' } as const,
  subtitle: { fontSize: '13px', color: '#888', marginTop: '4px' } as const,
  box: { background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', overflow: 'hidden' } as const,
  row: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0' } as const,
  label: { fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' } as const,
  mono: { fontFamily: 'monospace', fontSize: '12px', color: '#333', wordBreak: 'break-all' } as const,
  kv: { display: 'flex', gap: '8px', fontFamily: 'monospace', fontSize: '12px' } as const,
  key: { color: '#333', fontWeight: 500 } as const,
  sep: { color: '#aaa' } as const,
  val: { color: '#333' } as const,
  empty: { color: '#bbb', fontStyle: 'italic', fontSize: '13px' } as const,
  link: { fontSize: '13px', color: '#888', textDecoration: 'none' } as const,
};

function PageContent() {
  const searchParams = useSearchParams()
  const [fragment, setFragment] = useState('')
  const [fullUrl, setFullUrl] = useState('')

  useEffect(() => {
    setFullUrl(window.location.href)
    setFragment(window.location.hash)
  }, [])

  const params = Array.from(searchParams.entries())
  const fragmentParts = fragment.replace('#', '').split('&').filter(Boolean)

  return (
    <div style={s.card}>
      <div>
        <div style={s.heading}>Navigation Test Page</div>
        <div style={s.subtitle}>Loaded successfully. Inspect the parsed URL below.</div>
      </div>

      <div style={s.box}>
        <div style={s.row}>
          <div style={s.label}>Full URL</div>
          <div style={s.mono}>{fullUrl || <span style={s.empty}>-</span>}</div>
        </div>

        <div style={s.row}>
          <div style={s.label}>Query Params</div>
          {params.length === 0
            ? <span style={s.empty}>none</span>
            : params.map(([k, v]) => (
                <div key={k} style={s.kv}>
                  <span style={s.key}>{k}</span>
                  <span style={s.sep}>=</span>
                  <span style={s.val}>{v}</span>
                </div>
              ))
          }
        </div>

        <div style={{ ...s.row, borderBottom: 'none' }}>
          <div style={s.label}>Fragment</div>
          {!fragment
            ? <span style={s.empty}>none</span>
            : fragmentParts.length === 1 && !fragmentParts[0].includes('=')
              ? <span style={s.mono}>{fragment}</span>
              : fragmentParts.map((part, i) => {
                  const [k, ...rest] = part.split('=')
                  return (
                    <div key={i} style={s.kv}>
                      <span style={s.key}>{k}</span>
                      {rest.length > 0 && <>
                        <span style={s.sep}>=</span>
                        <span style={s.val}>{rest.join('=')}</span>
                      </>}
                    </div>
                  )
                })
          }
        </div>
      </div>

      <Link href="/" style={s.link}>
        &larr; Back to playground
      </Link>
    </div>
  )
}

export default function NavigationTestPage() {
  return (
    <div style={s.page}>
      <Suspense>
        <PageContent />
      </Suspense>
    </div>
  )
}
