'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function NavigationTestPage() {
  const searchParams = useSearchParams()
  const [fragment, setFragment] = useState<string>('')
  const [fullUrl, setFullUrl] = useState<string>('')

  useEffect(() => {
    setFullUrl(window.location.href)
    setFragment(window.location.hash)
  }, [])

  const params = Array.from(searchParams.entries())
  const fragmentParts = fragment.replace('#', '').split('&').filter(Boolean)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Navigation Test Page</h1>
          <p className="text-sm text-muted-foreground mt-1">Loaded successfully — inspect the parsed URL below</p>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 divide-y divide-border text-sm">
          <Row label="Full URL" value={fullUrl} mono />

          <div className="px-4 py-3">
            <div className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">Query Params</div>
            {params.length === 0
              ? <span className="text-muted-foreground italic">none</span>
              : params.map(([k, v]) => (
                  <div key={k} className="flex gap-2 font-mono text-xs">
                    <span className="text-foreground font-medium">{k}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-foreground">{v}</span>
                  </div>
                ))
            }
          </div>

          <div className="px-4 py-3">
            <div className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">Fragment</div>
            {!fragment
              ? <span className="text-muted-foreground italic">none</span>
              : fragmentParts.length === 1 && !fragmentParts[0].includes('=')
                ? <span className="font-mono text-xs text-foreground">{fragment}</span>
                : fragmentParts.map((part, i) => {
                    const [k, ...rest] = part.split('=')
                    return (
                      <div key={i} className="flex gap-2 font-mono text-xs">
                        <span className="text-foreground font-medium">{k}</span>
                        {rest.length > 0 && <>
                          <span className="text-muted-foreground">=</span>
                          <span className="text-foreground">{rest.join('=')}</span>
                        </>}
                      </div>
                    )
                  })
            }
          </div>
        </div>

        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to tests
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-4 py-3">
      <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
      <span className={mono ? 'font-mono text-xs text-foreground break-all' : 'text-sm text-foreground'}>
        {value || <span className="italic text-muted-foreground">—</span>}
      </span>
    </div>
  )
}
