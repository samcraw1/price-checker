import type {
  Listing,
  HistoryEntry,
  NewListing,
  Note,
  NewNote,
  Application,
  NewApplication,
  Project,
  NewProject,
  Video,
  NewVideo,
} from './types'

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

export function fetchNotes(): Promise<Note[]> {
  return request('/api/notes', undefined, 'Could not load your notes.')
}

export function addNote(payload: NewNote): Promise<Note> {
  return request('/api/notes', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  },
  'Could not add that note.'
  )
}
export function updateNote(id: number, updates: Partial<Note>): Promise<Note> {
  return request(
    `/api/notes/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
    'Could not update that note.'
  )
}

export function deleteNote(id: number): Promise<void> {
  return request(`/api/notes/${id}`, { method: 'DELETE' }, 'Could not delete that note.')
}

export function fetchApplications(): Promise<Application[]> {
  return request('/api/applications', undefined, 'Could not load your applications.')
}

export function addApplication(payload: NewApplication): Promise<Application> {
  return request(
    '/api/applications',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'Could not add that application.'
  )
}

export function updateApplication(id: number, updates: Partial<NewApplication>): Promise<Application> {
  return request(
    `/api/applications/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
    'Could not update that application.'
  )
}

export function deleteApplication(id: number): Promise<void> {
  return request(`/api/applications/${id}`, { method: 'DELETE' }, 'Could not delete that application.')
}

export function fetchProjects(): Promise<Project[]> {
  return request('/api/projects', undefined, 'Could not load your projects.')
}

export function addProject(payload: NewProject): Promise<Project> {
  return request(
    '/api/projects',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'Could not add that project.'
  )
}

export function updateProject(id: number, updates: Partial<NewProject>): Promise<Project> {
  return request(
    `/api/projects/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
    'Could not update that project.'
  )
}

export function deleteProject(id: number): Promise<void> {
  return request(`/api/projects/${id}`, { method: 'DELETE' }, 'Could not delete that project.')
}

export function fetchVideos(): Promise<Video[]> {
  return request('/api/videos', undefined, 'Could not load your videos.')
}

export function addVideo(payload: NewVideo): Promise<Video> {
  return request(
    '/api/videos',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'Could not add that video.'
  )
}

export function updateVideo(id: number, updates: Partial<NewVideo>): Promise<Video> {
  return request(
    `/api/videos/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
    'Could not update that video.'
  )
}

export function deleteVideo(id: number): Promise<void> {
  return request(`/api/videos/${id}`, { method: 'DELETE' }, 'Could not delete that video.')
}