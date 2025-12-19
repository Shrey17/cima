import type { DocumentPreview } from '@/types/deals'
import type { EventPreview } from '../types/events'
import type { Person } from '@/types/people'

// Airtable configuration
const AIRTABLE_BASE_ID = 'appDwuBzzUFQKZqrx'
const AIRTABLE_API_KEY = (import.meta as any)?.env?.VITE_AIRTABLE_API_KEY ?? ''

// Table IDs
const DATA_TABLE = 'tblhrPSM9atIrQquv'
const EVENTS_TABLE = 'tblz2kaxgRjPtr102'
const PEOPLE_TABLE = 'tblDzrBK7Mb7Zxe8o'
const MAILING_TABLE = 'tblSHOisjiHmIFd5P'

const AIRTABLE_API_BASE = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`

async function airtableFetch(tableId: string, recordId?: string): Promise<any> {
  const url = recordId
    ? `${AIRTABLE_API_BASE}/${tableId}/${recordId}`
    : `${AIRTABLE_API_BASE}/${tableId}`

  const resp = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!resp.ok) {
    throw new Error(`Airtable API error: ${resp.status}`)
  }

  return resp.json()
}

// Transform Airtable record to DocumentPreview
function transformDocument(record: any): DocumentPreview {
  const fields = record.fields
  return {
    id: record.id,
    name: fields.name || '',
    summary: fields.summary || '',
    type: fields.type || 'report',
    creation_time: fields.creation_time || '',
    last_modified: fields.last_modified || '',
    authors: (fields.authors || []).map((a: any) => a.name || a),
  }
}

// Transform Airtable record to EventPreview
function transformEvent(record: any): EventPreview {
  const fields = record.fields
  return {
    id: record.id,
    name: fields.name || '',
    summary: fields.summary || '',
    status: fields.status || 'pending',
    tags: fields.tags || [],
    date: fields.date || '',
    location_url: fields.location_url || null,
    registration_url: fields.registration_url || null,
  }
}

// Transform Airtable record to Person
function transformPerson(record: any): Person {
  const fields = record.fields
  const photo = fields.photo || fields.attachment || fields.attachments
  return {
    id: record.id,
    name: fields.name || '',
    tagline: fields.tagline || '',
    description: fields.description || '',
    email: fields.email || '',
    linkedin: fields.linkedin || '',
    attachmentUrl: photo?.[0]?.url || null,
  }
}

export async function fetchDeals(): Promise<DocumentPreview[]> {
  const data = await airtableFetch(DATA_TABLE)
  if (!data.records || !Array.isArray(data.records)) return []
  return data.records
    .map(transformDocument)
    .filter((doc: DocumentPreview) => ['report', 'flash', 'fundamentals'].includes(doc.type))
}

export function attachmentUrl(id: string): string {
  // For direct Airtable, we need to fetch the record to get the attachment URL
  // This is a placeholder - attachments are fetched dynamically
  return `/attachment/${id}`
}

// Fetch attachment URL for a document
export async function fetchAttachmentUrl(id: string): Promise<string | null> {
  try {
    const data = await airtableFetch(DATA_TABLE, id)
    const attachment = data.fields?.attachment
    if (attachment && attachment[0]?.url) {
      return attachment[0].url
    }
    return null
  } catch {
    return null
  }
}

export async function fetchDealText(id: string): Promise<DocumentPreview & { data: string | null; attachment: string | null }> {
  const data = await airtableFetch(DATA_TABLE, id)
  const doc = transformDocument(data)
  const attachment = data.fields?.attachment?.[0]?.url || null
  return {
    ...doc,
    data: data.fields?.data || null,
    attachment,
  }
}

// Events API
export async function fetchEvents(): Promise<EventPreview[]> {
  const data = await airtableFetch(EVENTS_TABLE)
  if (!data.records || !Array.isArray(data.records)) return []
  return data.records.map(transformEvent)
}

export async function fetchEvent(id: string): Promise<EventPreview & { attachment?: string | null }> {
  const data = await airtableFetch(EVENTS_TABLE, id)
  const event = transformEvent(data)
  const attachment = data.fields?.attachment?.[0]?.url || null
  return { ...event, attachment }
}

export async function fetchEventAttachmentUrl(id: string): Promise<string | null> {
  try {
    const data = await airtableFetch(EVENTS_TABLE, id)
    const attachment = data.fields?.attachment
    if (attachment && attachment[0]?.url) {
      return attachment[0].url
    }
    return null
  } catch {
    return null
  }
}

export function eventAttachmentUrl(id: string): string {
  return `/event-attachment/${id}`
}

// People API
export async function fetchPeople(): Promise<Person[]> {
  const data = await airtableFetch(PEOPLE_TABLE)
  if (!data.records || !Array.isArray(data.records)) return []
  return data.records.map(transformPerson)
}

export function personAttachmentUrl(id: string): string {
  return `/person-attachment/${id}`
}

// Mailing List API
export async function subscribeToMailingList(email: string): Promise<void> {
  const url = `${AIRTABLE_API_BASE}/${MAILING_TABLE}`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: { email },
    }),
  })

  if (!resp.ok) {
    throw new Error(`Failed to subscribe: ${resp.status}`)
  }
}
