import type { DocumentPreview, DocumentFull } from '@/types/deals'
import type { EventPreview, EventFull } from '../types/events'
import type { Person } from '@/types/people'

const API_BASE = (import.meta as any)?.env?.VITE_CIMA_API_BASE ?? '/api'

function withBase(path: string): string {
  if (!API_BASE) return path
  if (API_BASE.endsWith('/') && path.startsWith('/')) return API_BASE.slice(0, -1) + path
  if (!API_BASE.endsWith('/') && !path.startsWith('/')) return API_BASE + '/' + path
  return API_BASE + path
}

export async function fetchDeals(): Promise<DocumentPreview[]> {
  const resp = await fetch(withBase('/data'))
  if (!resp.ok) throw new Error(`Failed to fetch deals: ${resp.status}`)
  const data = await resp.json()
  if (!Array.isArray(data)) return []
  return data as DocumentPreview[]
}

export function attachmentUrl(id: string): string {
  return withBase(`/data/attachments/${encodeURIComponent(id)}`)
}

export async function fetchDealText(id: string): Promise<DocumentFull> {
  const resp = await fetch(withBase(`/data/text/${encodeURIComponent(id)}`))
  if (!resp.ok) throw new Error(`Failed to fetch deal ${id}: ${resp.status}`)
  return (await resp.json()) as DocumentFull
}

// Events API
export async function fetchEvents(): Promise<EventPreview[]> {
  const resp = await fetch(withBase('/events'))
  if (!resp.ok) throw new Error(`Failed to fetch events: ${resp.status}`)
  const data = await resp.json()
  if (!Array.isArray(data)) return []
  return data as EventPreview[]
}

export async function fetchEvent(id: string): Promise<EventFull> {
  const resp = await fetch(withBase(`/events/${encodeURIComponent(id)}`))
  if (!resp.ok) throw new Error(`Failed to fetch event ${id}: ${resp.status}`)
  return (await resp.json()) as EventFull
}

export function eventAttachmentUrl(id: string): string {
  return withBase(`/events/attachments/${encodeURIComponent(id)}`)
}

// People API
export async function fetchPeople(): Promise<Person[]> {
  const resp = await fetch(withBase('/people'))
  if (!resp.ok) throw new Error(`Failed to fetch people: ${resp.status}`)
  const data = await resp.json()
  if (!Array.isArray(data)) return []
  return data as Person[]
}

export function personAttachmentUrl(id: string): string {
  return withBase(`/people/attachments/${encodeURIComponent(id)}`)
}

// Mailing List API
export async function subscribeToMailingList(email: string): Promise<void> {
  const resp = await fetch(withBase(`/mailing?email=${encodeURIComponent(email)}`), {
    method: 'POST',
  })
  if (!resp.ok) throw new Error(`Failed to subscribe to mailing list: ${resp.status}`)
}


