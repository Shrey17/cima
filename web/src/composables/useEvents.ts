import { computed, ref } from 'vue'
import type { EventPreview } from '@/types/events'
import { fetchEvents } from '@/lib/api'

function toYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function useEvents() {
  const all = ref<EventPreview[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      all.value = await fetchEvents()
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load events'
      all.value = []
    } finally {
      loading.value = false
    }
  }

  // Calendar state
  const currentMonth = ref(new Date())

  function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1)
  }
  function endOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
  }
  function addMonths(d: Date, delta: number): Date {
    return new Date(d.getFullYear(), d.getMonth() + delta, 1)
  }

  function prevMonth() { currentMonth.value = addMonths(currentMonth.value, -1) }
  function nextMonth() { currentMonth.value = addMonths(currentMonth.value, 1) }
  function thisMonth() { currentMonth.value = startOfMonth(new Date()) }

  const eventsByDay = computed(() => {
    const map: Record<string, EventPreview[]> = {}
    for (const ev of all.value ?? []) {
      const dt = new Date(ev.date)
      if (isNaN(dt.getTime())) continue
      const key = toYmd(dt)
      ;(map[key] ||= []).push(ev)
    }
    // Stable sort by time then name
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name))
    }
    return map
  })

  const monthGrid = computed(() => {
    const start = startOfMonth(currentMonth.value)
    const end = endOfMonth(currentMonth.value)
    // Determine the first Sunday before/at month start
    const first = new Date(start)
    first.setDate(first.getDate() - ((first.getDay() + 7) % 7))
    // Determine the last Saturday after/at month end
    const last = new Date(end)
    last.setDate(last.getDate() + (6 - ((last.getDay() + 7) % 7)))

    const days: Array<{ date: Date; inMonth: boolean; ymd: string; events: EventPreview[] }> = []
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      const copy = new Date(d)
      const ymd = toYmd(copy)
      days.push({
        date: copy,
        inMonth: copy.getMonth() === currentMonth.value.getMonth(),
        ymd,
        events: eventsByDay.value[ymd] ?? [],
      })
    }
    return days
  })

  // Initialize
  if (all.value === null) {
    Promise.resolve().then(load)
  }

  return {
    // state
    all,
    loading,
    error,
    // actions
    load,
    // calendar
    currentMonth,
    prevMonth,
    nextMonth,
    thisMonth,
    monthGrid,
    eventsByDay,
  }
}


