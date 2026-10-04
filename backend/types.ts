export type ErrorCodeForDebugging = {
  code: 400 | 401 | 403 | 404 | 409 | 500;
  message: string;
};

export type Product = {
    name: string;
    price: number;
    url: string;
    imageUrl: string;
    priceHistory: number[];
}

export type Listing = Product & {
    id: number;
}

export type ListingRow = {
    id: number;
    name: string;
    price: string;
    image_url: string;
    price_history: string[];
    url: string;
};

export function toListing(row: ListingRow): Listing {
    return {
        id: row.id,
        name: row.name,
        price: Number(row.price),
        imageUrl: row.image_url,
        priceHistory: row.price_history.map(Number),
        url: row.url,
    };
}

export type Note = {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

export type NewNote = {
    title: string;
    body: string;
}

export type NoteRow = {
    id: number;
    title: string;
    body: string;
    created_at: string;
    updated_at: string;
};

export function toNote(row: NoteRow): Note {
    return {
        id: row.id,
        title: row.title,
        body: row.body,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export type Application = {
    id: number;
    company: string;
    role: string;
    status: string;
    dateApplied: string;
    lastUpdated: string;
    notes: string | null;
}

export type NewApplication = {
    company: string;
    role: string;
    status: string;
    dateApplied: string;
    notes?: string;
}

export type ApplicationRow = {
    id: number;
    company: string;
    role: string;
    status: string;
    date_applied: string;
    last_updated: string;
    notes: string | null;
};

export function toApplication(row: ApplicationRow): Application {
    return {
        id: row.id,
        company: row.company,
        role: row.role,
        status: row.status,
        dateApplied: row.date_applied,
        lastUpdated: row.last_updated,
        notes: row.notes,
    };
}

export type Project = {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    status: string;
    repository: string | null;
    deploymentUrl: string | null;
    notes: string | null;
}

export type NewProject = {
    title: string;
    description: string;
    technologies: string[];
    status: string;
    repository?: string;
    deploymentUrl?: string;
    notes?: string;
}

export type ProjectRow = {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    status: string;
    repository: string | null;
    deployment_url: string | null;
    notes: string | null;
};

export function toProject(row: ProjectRow): Project {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        technologies: row.technologies,
        status: row.status,
        repository: row.repository,
        deploymentUrl: row.deployment_url,
        notes: row.notes,
    };
}

export const VIDEO_STATUSES = ['Idea', 'Planning', 'Recording', 'Editing', 'Scheduled', 'Published'] as const;
export type VideoStatus = typeof VIDEO_STATUSES[number];

export type Video = {
    id: number;
    title: string;
    status: VideoStatus;
    notes: string | null;
}

export type NewVideo = {
    title: string;
    status?: VideoStatus;
    notes?: string;
}

export type VideoRow = {
    id: number;
    title: string;
    status: VideoStatus;
    notes: string | null;
};

export function toVideo(row: VideoRow): Video {
    return {
        id: row.id,
        title: row.title,
        status: row.status,
        notes: row.notes,
    };
}

export const YOUTUBE_CONVERSION_STATUSES = ['pending', 'processing', 'complete', 'failed'] as const;

export type YoutubeConversionStatus = typeof YOUTUBE_CONVERSION_STATUSES[number];

export type YoutubeConversion = {
    youtubeName: string;
    id: number;
    url: string;
    status: YoutubeConversionStatus;
    transcript: string | null;
    error: string | null;
    createdAt: string;
    updatedAt: string;
}

export type YoutubeConversionRow = {
    id: number;
    youtube_name: string;
    url:string;
    status: YoutubeConversionStatus;
    transcript: string | null;
    error: string | null;
    created_at: string;
    updated_at: string;
}


export function toYoutubeConversion(row: YoutubeConversionRow): YoutubeConversion {
    return {
        youtubeName: row.youtube_name,
        id: row.id,
        url: row.url,
        status: row.status,
        transcript: row.transcript,
        error: row.error,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export type Email = {
  id: string;
  sentFrom: string;
  sentTo: string;
  subject: string;
  snippet: string;
  body: string;
  cc?: string;
  bcc?: string;
  attachments?: string[];
  sentAt: string;
  isRead?: boolean;
};

export type NewEmail = {
  sentFrom: string;
  sentTo: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  attachments?: string[];
  sentAt: string;
};

export type EmailStatus = 'sent' | 'draft' | 'failed';
