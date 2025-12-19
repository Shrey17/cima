<template>
  <div v-if="doc" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 md:p-6" @click.self="close">
    <div class="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col w-full max-w-3xl" style="max-height: 90vh;">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 flex-shrink-0">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="text-xs uppercase tracking-wide text-gray-500 font-medium">{{ doc.type }}</div>
            <h2 class="text-xl font-semibold leading-tight text-gray-900">{{ doc.name }}</h2>
            <div class="text-sm text-gray-500 mt-1">By {{ doc.authors.join(', ') }}</div>
          </div>
          <button
            class="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            @click="close"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 1 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="flex gap-4 mt-2 text-xs text-gray-400">
          <span>Created {{ formatDate(doc.creation_time) }}</span>
          <span>Updated {{ formatDate(doc.last_modified) }}</span>
        </div>
      </div>

      <!-- PDF Content - Scrollable -->
      <div class="flex-1 overflow-hidden min-h-0">
        <PdfCarousel :src="pdfSrc" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAttachmentUrl } from '@/lib/api'
import type { DocumentPreview } from '@/types/deals'
import PdfCarousel from '@/components/PdfCarousel.vue'

const props = defineProps<{ source: DocumentPreview[] }>()

const route = useRoute()
const router = useRouter()
const id = ref<string | null>((route.query.id as string) || null)

watch(() => route.query.id, (v) => { id.value = (v as string) || null })

const doc = computed(() => props.source.find((d) => d.id === id.value))
const pdfSrc = ref<string>('')

// Fetch attachment URL when doc changes
watch(doc, async (newDoc) => {
  if (newDoc) {
    const url = await fetchAttachmentUrl(newDoc.id)
    pdfSrc.value = url || ''
  } else {
    pdfSrc.value = ''
  }
}, { immediate: true })

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function close() {
  router.replace({ query: { ...route.query, id: undefined } })
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

// Watch for doc to control body scroll
watch(doc, (newDoc) => {
  if (newDoc) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>
