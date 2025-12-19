<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Check, Clock, X, Pause, Dot } from 'lucide-vue-next'

const props = defineProps<{ status: string; class?: HTMLAttributes['class'] }>()

const config: Record<string, { class: string; icon: any; label: string }> = {
  // solid greens for confirmed
  confirmed: { class: 'bg-emerald-600 text-white border-emerald-600', icon: Check, label: 'Confirmed' },
  // amber for pending
  pending: { class: 'bg-amber-500 text-white border-amber-500', icon: Clock, label: 'Pending' },
  // subtle blue for proposed
  proposed: { class: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30', icon: Dot, label: 'Proposed' },
  // subtle violet for postponed
  postponed: { class: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30', icon: Pause, label: 'Postponed' },
  // solid red for cancelled
  cancelled: { class: 'bg-red-600 text-white border-red-600', icon: X, label: 'Cancelled' },
}

const current = config[props.status?.toLowerCase?.() ?? ''] ?? { class: 'bg-muted text-foreground border-muted', icon: Dot, label: props.status }
</script>

<template>
  <Badge variant="outline" :class="['gap-1.5', current.class, props.class]" :aria-label="`Status: ${current.label}`">
    <component :is="current.icon" class="w-3.5 h-3.5" aria-hidden="true" />
    <span class="leading-none">{{ current.label }}</span>
  </Badge>
</template>


