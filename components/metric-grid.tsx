'use client'

import type { LucideIcon } from 'lucide-react'

export type MetricItem = {
  label: string
  value: string
  tone: string
  description?: string
  icon?: LucideIcon
}

export function MetricGrid({ items, compact = false }: { items: MetricItem[]; compact?: boolean }) {
  return (
    <div className={`stat-grid${compact ? ' compact-stats' : ''}`}>
      {items.map(({ label, value, tone, description, icon: Icon }) => (
        <article className={`stat-card${compact ? ' compact' : ''}`} key={label}>
          {compact ? <div className={`mini-status ${tone}`} /> : Icon ? <div className={`stat-icon ${tone}`}><Icon aria-hidden="true" size={17} /></div> : null}
          <span>{label}</span>
          <strong>{value}</strong>
          {!compact && description ? <small>{description}</small> : null}
        </article>
      ))}
    </div>
  )
}
