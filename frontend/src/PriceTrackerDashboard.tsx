import { useEffect, useState } from 'react'
import type { HistoryEntry, Listing, NewListing } from './types'
import * as api from './api'
import { AddListingForm } from './components/AddListingForm'
import { ListingCard } from './components/ListingCard'
import { LoadingState, EmptyState, ErrorMessage, SuccessMessage } from './components/Feedback'

export function PriceTrackerDashboard() {
  const [listings, setListings] = useState<Listing[]>([])
  const [historyByListing, setHistoryByListing] = useState<Record<number, HistoryEntry[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(() => setSuccessMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [successMessage])

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const fetchedListings = await api.fetchListings()
      setListings(fetchedListings)

      const histories = await Promise.all(
        fetchedListings.map((listing) =>
          api.fetchHistory(listing.id).catch(() => [] as HistoryEntry[])
        )
      )
      const historyMap: Record<number, HistoryEntry[]> = {}
      fetchedListings.forEach((listing, i) => {
        historyMap[listing.id] = histories[i]
      })
      setHistoryByListing(historyMap)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function withPending(id: number, fn: () => Promise<void>) {
    setPendingIds((prev) => new Set(prev).add(id))
    return fn().finally(() => {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    })
  }

  async function handleAdd(payload: NewListing) {
    setAddSubmitting(true)
    setError(null)
    try {
      await api.addListing(payload)
      setSuccessMessage('Listing added.')
      await loadAll()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setAddSubmitting(false)
    }
  }

  function handleCheck(id: number) {
    setError(null)
    return withPending(id, async () => {
      try {
        const updated = await api.checkListing(id)
        setListings((prev) => prev.map((l) => (l.id === id ? updated : l)))
        const freshHistory = await api.fetchHistory(id).catch(() => historyByListing[id] ?? [])
        setHistoryByListing((prev) => ({ ...prev, [id]: freshHistory }))
        setSuccessMessage('Price checked.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  function handleDelete(id: number) {
    setError(null)
    return withPending(id, async () => {
      try {
        await api.deleteListing(id)
        setListings((prev) => prev.filter((l) => l.id !== id))
        setHistoryByListing((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        setSuccessMessage('Listing removed.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  function handleSavePrice(id: number, price: number) {
    setError(null)
    return withPending(id, async () => {
      try {
        const updated = await api.updateListing(id, { price })
        setListings((prev) => prev.map((l) => (l.id === id ? updated : l)))
        setSuccessMessage('Price updated.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  return (
    <>
      <AddListingForm onAdd={handleAdd} submitting={addSubmitting} />

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      {loading ? (
        <LoadingState label="Loading your listings…" />
      ) : listings.length === 0 ? (
        <EmptyState>No listings yet — add a MacBook Pro URL above to start tracking its price.</EmptyState>
      ) : (
        <ul className="listings">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              
              listing={listing}
              history={historyByListing[listing.id] ?? []}
              expanded={expandedId === listing.id}
              pending={pendingIds.has(listing.id)}
              onToggleHistory={() => setExpandedId(expandedId === listing.id ? null : listing.id)}
              onCheck={() => handleCheck(listing.id)}
              onDelete={() => handleDelete(listing.id)}
              onSavePrice={(price) => handleSavePrice(listing.id, price)}
            />
          ))}
        </ul>
      )}
    </>
  )
}
