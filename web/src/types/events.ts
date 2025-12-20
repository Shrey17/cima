export interface EventPreview {
  id: string
  name: string
  summary: string
  status: string
  tags: string[]
  date: string
  location_url?: string | null
  registration_url?: string | null
  attachment_url?: string | null
}

export interface EventFull extends EventPreview {
  attachment?: string | null
}


