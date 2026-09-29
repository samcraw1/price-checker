import type { Listing, HistoryEntry, NewListing, YoutubeConversion } from './types'

const API_BASE = '/api/price-listings'

async function friendlyError(response: Response, fallback: string): Promise<Error> {
  if (response.status === 404) return new Error('That listing no longer exists.')
  if (response.status === 502) {
    // The backend always sends a body with its own 502s (a PriceNotFoundError
    // message). An empty body means this 502 came from Vite's dev proxy
    // itself because it couldn't reach the backend at all.
    const body = await response.text().catch(() => '')
    return new Error(body || 'Could not reach the server. Is the backend running?')
  }
  return new Error(fallback)
}

async function request<T>(input: string, init: RequestInit | undefined, fallback: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(input, init)
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }

  if (!response.ok) {
    throw await friendlyError(response, fallback)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function fetchListings(): Promise<Listing[]> {
  return request(API_BASE, undefined, 'Could not load your listings.')
}

export function fetchHistory(id: number): Promise<HistoryEntry[]> {
  return request(`${API_BASE}/${id}/history`, undefined, 'Could not load price history.')
}

export function addListing(payload: NewListing): Promise<Listing> {
  return request(
    API_BASE,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'Could not add that listing.'
  )
}

export function updateListing(id: number, updates: Partial<Listing>): Promise<Listing> {
  return request(
    `${API_BASE}/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
    'Could not update that listing.'
  )
}

export function deleteListing(id: number): Promise<void> {
  return request(`${API_BASE}/${id}`, { method: 'DELETE' }, 'Could not delete that listing.')
}

export function checkListing(id: number): Promise<Listing> {
  return request(`${API_BASE}/${id}/check`, { method: 'POST' }, 'Could not check that listing’s price.')
}

export function convertYoutubeVideo(url: string): Promise<YoutubeConversion> {
  return request(
    '/api/youtube-convert',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    },
    'Could not convert that YouTube video.'
  )
}

export function fetchYoutubeConversionResult(id: number): Promise<YoutubeConversion> {
  return request(
    `/api/youtube-convert/${id}`,
    undefined,
    'Could not fetch the YouTube conversion result.'
  )
}

export function fetchYoutubeConversions(): Promise<YoutubeConversion[]> {
  return request(
    '/api/youtube-convert',
    undefined,
    'Could not fetch YouTube conversions.'
  )
}

