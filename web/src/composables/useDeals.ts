import { computed, ref } from 'vue'
import type { DocumentPreview, DataType } from '@/types/deals'
import { fetchDeals } from '@/lib/api'

// Shared state (singleton)
const all = ref<DocumentPreview[] | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const query = ref('')
const selectedTypes = ref<Set<DataType>>(new Set())

export function useDeals() {
  async function load() {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      all.value = await fetchDeals()
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load deals'
      all.value = []
    } finally {
      loading.value = false
    }
  }

  function toggleType(t: DataType) {
    const next = new Set(selectedTypes.value)
    if (next.has(t)) next.delete(t)
    else next.add(t)
    selectedTypes.value = next
  }

  const filtered = computed(() => {
    const list = all.value ?? []
    const q = query.value.trim().toLowerCase()
    const hasTypeFilter = selectedTypes.value.size > 0
    return list.filter((d) => {
      if (hasTypeFilter && !selectedTypes.value.has(d.type)) return false
      if (!q) return true
      return (
        d.name.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.authors.join(' ').toLowerCase().includes(q)
      )
    })
  })

  const highlights = computed(() => {
    const byType: Record<DataType, DocumentPreview[]> = {
      report: [],
      flash: [],
      fundamentals: [],
    }
    for (const d of all.value ?? []) {
      byType[d.type].push(d)
    }
    for (const k of Object.keys(byType) as DataType[]) {
      byType[k].sort((a, b) => (b.creation_time ?? '').localeCompare(a.creation_time ?? ''))
      byType[k] = byType[k].slice(0, 3)
    }
    return byType
  })

  return {
    // state
    all,
    loading,
    error,
    // actions
    load,
    // filters
    query,
    selectedTypes,
    toggleType,
    // derived
    filtered,
    highlights,
  }
}
