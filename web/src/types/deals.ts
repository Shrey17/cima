export type DataType = 'report' | 'flash' | 'fundamentals'

export interface DocumentPreview {
  id: string
  name: string
  summary: string
  type: DataType
  creation_time: string
  last_modified: string
  authors: string[]
  url?: string | null
}

export interface DocumentFull extends DocumentPreview {
  data: string | null
  attachment: string | null
}

export function isDocumentPreview(value: unknown): value is DocumentPreview {
  const v = value as Record<string, unknown>
  return (
    typeof v?.id === 'string' &&
    typeof v?.name === 'string' &&
    typeof v?.summary === 'string' &&
    typeof v?.type === 'string' &&
    Array.isArray(v?.authors)
  )
}

export function parseIsoDate(s: string | undefined): Date | null {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}


