<template>
  <div v-if="doc" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 md:p-4" @keydown.esc="close">
    <div class="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
         :style="modalStyle">
      <div ref="headerEl" class="p-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="text-xs uppercase tracking-wide text-muted-foreground">{{ doc.type }}</div>
            <h2 class="text-xl font-semibold leading-tight">{{ doc.name }}</h2>
            <div class="text-sm text-muted-foreground">By {{ doc.authors.join(', ') }}</div>
          </div>
          <div class="flex items-center gap-3 text-xs text-muted-foreground">
            <button class="ml-2 inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 rounded" @click="close" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 1 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <span class="text-sm text-muted-foreground">Created {{ new Date(doc.creation_time).toLocaleString() }}</span>
        </div>
        <div>
          <span class="text-sm text-muted-foreground">Updated {{ new Date(doc.last_modified).toLocaleString() }}</span>
        </div>
      </div>
      
      <div class="flex-1 overflow-hidden">
        <PdfCarousel :src="pdfSrc" :headerHeight="headerHeight" @contentSize="onContentSize" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
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

// No markdown slide

// Limit modal to min of viewport width/height with small margins
const viewport = () => ({ w: window.innerWidth, h: window.innerHeight })
const desired = ref<{ width: number; height: number; dotsHeight: number; pageWidth: number; pageHeight: number } | null>(null)
function onContentSize(payload: { width: number; height: number; dotsHeight: number; pageWidth: number; pageHeight: number }) {
  desired.value = payload
}

const modalStyle = computed(() => {
  const { w, h } = viewport()
  const margin = Math.floor(Math.min(w, h) * 0.02)
  const headerH = headerHeight.value
  const maxW = w - margin * 2
  const maxH = h - margin * 2
  if (!desired.value) {
    const size = Math.max(320, Math.floor(Math.min(maxW, maxH)))
    return { width: `${size}px`, height: `${size}px` }
  }
  const { width, height, dotsHeight } = desired.value
  // Compute scale to fit PDF canvas + dots inside the available area below header
  const availableH = Math.max(200, maxH - headerH)
  const scale = Math.min(maxW / width, (availableH - dotsHeight - 12) / height, 1)
  const finalW = Math.floor(width * scale)
  const finalH = Math.floor(height * scale + dotsHeight + headerH + 12)
  return { width: `${finalW}px`, height: `${finalH}px` }
})

const headerEl = ref<HTMLElement | null>(null)
const headerHeight = ref(96)
onMounted(async () => {
  await nextTick()
  if (headerEl.value) headerHeight.value = headerEl.value.offsetHeight
})

function close() {
  router.replace({ query: { ...route.query, id: undefined } })
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})
</script>



