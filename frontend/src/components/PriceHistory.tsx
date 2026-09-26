import type { HistoryEntry } from '../types'
import { EmptyState } from './Feedback'

type PriceHistoryProps = {
  entries: HistoryEntry[]
}

export function PriceHistory({ entries }: PriceHistoryProps) {
  if (entries.length === 0) {
    return <EmptyState>No price checks yet — use "Check price" to record the first one.</EmptyState>
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
  )

  return (
    <ul className="history">
      {sorted.map((entry) => (
        <li key={entry.id}>
          ${Number(entry.price).toFixed(2)} on {new Date(entry.checked_at).toLocaleString()}
        </li>
      ))}
    </ul>
  )
}
