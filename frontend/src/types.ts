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

export type Note = {
  id: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export type NewNote = {
  title: string
  body: string
}

export type Application = {
  id: number
  company: string
  role: string
  status: string
  dateApplied: string
  lastUpdated: string
  notes: string | null
}

export type NewApplication = {
  company: string
  role: string
  status: string
  dateApplied: string
  notes?: string
}

// Backend accepts any string for status — this is just a frontend
// convenience list for the dropdown, not an enforced enum.
export const APPLICATION_STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const

export type Project = {
  id: number
  title: string
  description: string
  technologies: string[]
  status: string
  repository: string | null
  deploymentUrl: string | null
  notes: string | null
}

export type NewProject = {
  title: string
  description: string
  technologies: string[]
  status: string
  repository?: string
  deploymentUrl?: string
  notes?: string
}

// Backend accepts any string for status — this is just a frontend
// convenience list for the dropdown, not an enforced enum.
export const PROJECT_STATUSES = ['Idea', 'In progress', 'Paused', 'Completed', 'Archived'] as const

// This list IS enforced by the backend (a CHECK constraint on the videos
// table), so it must match backend/types.ts's VIDEO_STATUSES exactly.
export const VIDEO_STATUSES = ['Idea', 'Planning', 'Recording', 'Editing', 'Scheduled', 'Published'] as const
export type VideoStatus = (typeof VIDEO_STATUSES)[number]

export type Video = {
  id: number
  title: string
  status: VideoStatus
  notes: string | null
}

export type NewVideo = {
  title: string
  status?: VideoStatus
  notes?: string
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

export type Email ={ 
  id: string
  sentFrom: string
  sentTo: string
  subject: string
  snippet: string
  body: string
  cc?: string
  bcc?: string
  attachments?: string[]
  sentAt: string
  isRead?: boolean
}

export type ErrorCodeForDebugging = {
  code: 400 | 401 | 403 | 404 | 409 | 500
  message: string
}
