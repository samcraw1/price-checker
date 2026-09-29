// TODO(backend): the API has no store, configuration (RAM/storage/condition),
// or target_price fields yet — see AddListingForm/ListingCard/PriceStatusBadge
// for where those show up in the UI as disabled placeholders.
export type Listing = {
  id: number
  name: string
  price: number
  url: string
  imageUrl: string
  priceHistory: number[]
}

export type HistoryEntry = {
  id: number
  listing_id: number
  price: string
  checked_at: string
}

export type NewListing = {
  name: string
  price: number
  url: string
  imageUrl: string
  priceHistory: number[]
}

export type YoutubeConversionStatus = 'pending' | 'processing' | 'complete' | 'failed'

export type YoutubeConversion = {
  youtubeName: string
  id: number
  url: string
  status: YoutubeConversionStatus
  transcript: string | null
  error: string | null
  createdAt: string
  updatedAt: string
}


