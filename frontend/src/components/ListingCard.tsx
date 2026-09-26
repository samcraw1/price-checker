import { useState } from 'react'
import type { HistoryEntry, Listing } from '../types'
import { PriceHistory } from './PriceHistory'
import { PriceStatusBadge } from './PriceStatusBadge'
import { ConfirmDialog } from './ConfirmDialog'

type ListingCardProps = {
  listing: Listing
  history: HistoryEntry[]
  expanded: boolean
  pending: boolean
  onToggleHistory: () => void
  onCheck: () => void
  onDelete: () => void
  onSavePrice: (price: number) => void
}

function lastCheckedLabel(history: HistoryEntry[]): string {
  if (history.length === 0) return 'Never checked'
  const latest = history.reduce((a, b) => (new Date(a.checked_at) > new Date(b.checked_at) ? a : b))
  return new Date(latest.checked_at).toLocaleString()
}

export function ListingCard({
  listing,
  history,
  expanded,
  pending,
  onToggleHistory,
  onCheck,
  onDelete,
  onSavePrice,
}: ListingCardProps) {
  const [editingPrice, setEditingPrice] = useState(false)
  const [priceInput, setPriceInput] = useState(String(listing.price))
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function startEdit() {
    setPriceInput(String(listing.price))
    setEditingPrice(true)
  }

  function saveEdit() {
    const price = Number(priceInput)
    if (!price) return
    onSavePrice(price)
    setEditingPrice(false)
  }

  return (
    <li className="listing">
      <img src={listing.imageUrl} alt="" />
      <div className="listing-info">
        <a href={listing.url} target="_blank" rel="noreferrer">
          {listing.name}
        </a>
        <p className="listing-meta">Store / configuration: not tracked yet</p>

        <div className="listing-price-row">
          {editingPrice ? (
            <span className="edit-price">
              <label className="sr-only" htmlFor={`price-${listing.id}`}>
                Price for {listing.name}
              </label>
              <input
                id={`price-${listing.id}`}
                type="number"
                step="0.01"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
              />
              <button type="button" onClick={saveEdit}>
                Save
              </button>
              <button type="button" onClick={() => setEditingPrice(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <button type="button" className="price-button" onClick={startEdit}>
              ${listing.price.toFixed(2)}
              <span className="sr-only"> — click to edit price</span>
            </button>
          )}
          <PriceStatusBadge price={listing.price} />
        </div>

        <p className="listing-meta">Last checked: {lastCheckedLabel(history)}</p>
      </div>

      <div className="listing-actions">
        <button type="button" onClick={onCheck} disabled={pending}>
          {pending ? 'Checking…' : 'Check price'}
        </button>
        <button type="button" onClick={onToggleHistory} aria-expanded={expanded}>
          {expanded ? 'Hide history' : 'Price history'}
        </button>
        <button type="button" onClick={() => setConfirmingDelete(true)} disabled={pending}>
          Delete
        </button>
      </div>

      {expanded && (
        <div className="listing-history">
          <PriceHistory entries={history} />
        </div>
      )}

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this listing?"
          message={`"${listing.name}" and its price history will be removed. This can't be undone.`}
          confirmLabel="Delete"
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            setConfirmingDelete(false)
            onDelete()
          }}
        />
      )}
    </li>
  )
}
