<template>
  <div
    ref="rootEl"
    class="w-full h-full flex flex-col overflow-hidden bg-white"
    tabindex="0"
    @keydown.left.prevent="onPrevKey"
    @keydown.right.prevent="onNextKey"
    aria-label="PDF viewer"
  >
    <div v-if="error" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center">
        <div class="text-red-600 text-sm mb-2">Failed to load document.</div>
        <a :href="src" target="_blank" rel="noopener" class="text-blue-600 underline text-sm">Open in new tab</a>
      </div>
    </div>

    <div v-else class="flex-1 min-h-0 flex flex-col">
      <!-- Embla viewport -->
      <div ref="emblaRef" class="overflow-hidden flex-1 min-h-0">
        <div class="flex h-full">
          <!-- PDF page slides -->
          <div v-for="pageNum in numPages" :key="`p-${pageNum}`" class="flex-[0_0_100%] h-full flex items-start justify-center">
            <div class="w-full h-full flex items-start justify-center">
              <div class="relative" :style="pageStyle">
                <canvas :ref="setCanvasRef(pageNum)" class="block bg-white"></canvas>
              </div>
            </div>
          </div>
          <!-- Optional trailer slide as last slide -->
          <div v-if="hasTrailer" class="flex-[0_0_100%] h-full flex items-start justify-center">
            <div class="w-full h-full flex items-start justify-center">
              <div class="relative" :style="pageStyle">
                <div class="absolute inset-0 overflow-auto p-4">
                  <slot name="trailer">
                    <div class="text-sm leading-relaxed whitespace-pre-wrap">{{ props.trailerText }}</div>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dots (match Home carousel style) -->
      <div v-if="totalSlides > 1" ref="dotsEl" class="py-2 select-none flex-none">
        <ol class="flex items-center justify-center gap-3 whitespace-nowrap">
          <li v-for="d in dotModel" :key="d.key">
            <button
              type="button"
              class="relative size-5 rotate-45 border-2 border-border bg-transparent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              @click="d.target !== undefined ? scrollTo(d.target) : undefined"
              :aria-label="d.aria"
              :aria-current="d.active ? 'true' : undefined"
            >
              <span
                class="absolute inset-0.5 block transition-[background-color,opacity] duration-500 ease-in-out"
                :class="d.active ? 'opacity-100' : 'opacity-60'"
                :style="{ backgroundColor: 'var(--navbar-gradient-mean)' }"
              />
            </button>
          </li>
        </ol>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, useSlots, type ComponentPublicInstance } from 'vue'
import EmblaCarouselVue from 'embla-carousel-vue'
import { useDebounceFn } from '@vueuse/core'
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
// @ts-ignore - Vite will turn this into a Worker
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'

type ContentSizePayload = { width: number; height: number; dotsHeight: number; pageWidth: number; pageHeight: number }

const props = defineProps<{
  src: string
  headerHeight?: number
  trailerText?: string | null
}>()

const emit = defineEmits<{
  (e: 'contentSize', payload: ContentSizePayload): void
}>()

// Initialize pdf.js worker exactly once
try {
  if (!(GlobalWorkerOptions as any)._workerPortInitialized) {
    GlobalWorkerOptions.workerPort = new (PdfjsWorker as any)()
    ;(GlobalWorkerOptions as any)._workerPortInitialized = true
  }
} catch {}

// Embla
const [emblaRef, emblaApi] = EmblaCarouselVue({
  loop: false,
  dragFree: false,
  containScroll: 'trimSnaps',
  align: 'start',
})

// Refs & state
const rootEl = ref<HTMLElement | null>(null)
const dotsEl = ref<HTMLElement | null>(null)
const canvases = new Map<number, HTMLCanvasElement>()
const renderTasks = new Map<number, RenderTask>()
const pdfDoc = shallowRef<PDFDocumentProxy | null>(null)
const numPages = ref<number>(0)
const currentIndex = ref<number>(0)
const slots = useSlots()
const hasTrailer = computed(() => !!props.trailerText || !!slots.trailer)
const totalSlides = computed(() => numPages.value + (hasTrailer.value ? 1 : 0))
const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3))

// Five-dot model with static middle
type DotEntry = { key: string; kind: 'real' | 'current'; target: number; active?: boolean; aria: string }
const dotModel = computed<DotEntry[]>(() => {
  const L = totalSlides.value - 1
  const cur = Math.max(0, Math.min(currentIndex.value, L))
  const labelFor = (i: number) => (hasTrailer.value && i === numPages.value ? 'Go to info' : `Go to page ${i + 1}`)

  // If 5 or fewer slides, render all as real
  if (L + 1 <= 5) {
    return Array.from({ length: L + 1 }, (_, i) => ({
      key: `real-${i}`,
      kind: i === cur ? 'current' : 'real',
      target: i,
      active: i === cur,
      aria: labelFor(i),
    }))
  }

  // First window (first 5)
  if (cur <= 2) {
    const arr = [0, 1, 2, 3, L]
    return arr.map((i) => ({
      key: `real-${i}`,
      kind: i === cur ? 'current' : 'real',
      target: i,
      active: i === cur,
      aria: labelFor(i),
    }))
  }

  // Last window (last 5)
  if (cur >= L - 2) {
    const arr = [0, L - 3, L - 2, L - 1, L]
    return arr.map((i) => ({
      key: `real-${i}`,
      kind: i === cur ? 'current' : 'real',
      target: i,
      active: i === cur,
      aria: labelFor(i),
    }))
  }

  // Middle: static five slots with real neighbors (no visual reflow, but clickable prev/next)
  return [
    { key: 'start', kind: 'real', target: 0, active: cur === 0, aria: labelFor(0) },
    { key: 'prev', kind: 'real', target: cur - 1, active: false, aria: labelFor(cur - 1) },
    { key: 'current', kind: 'current', target: cur, active: true, aria: labelFor(cur) },
    { key: 'next', kind: 'real', target: cur + 1, active: false, aria: labelFor(cur + 1) },
    { key: 'end', kind: 'real', target: L, active: cur === L, aria: labelFor(L) },
  ]
})

// Base page size at scale=1 (CSS pixels)
const basePageWidth = ref<number>(600)
const basePageHeight = ref<number>(800)

// Container size and computed scale
const containerWidth = ref<number>(0)
const containerHeight = ref<number>(0)
const dotsMeasuredPx = ref<number>(0)
const pageScale = computed(() => {
  const w = containerWidth.value
  const h = Math.max(0, containerHeight.value - (totalSlides.value > 1 ? dotsMeasuredPx.value : 0))
  if (w <= 0 || h <= 0) return 1
  const rw = w / basePageWidth.value
  const rh = h / basePageHeight.value
  return Math.max(0.1, Math.min(rw, rh))
})

// Styles for page wrappers (CSS pixel sizes)
const pageStyle = computed(() => {
  const width = Math.floor(basePageWidth.value * pageScale.value)
  const height = Math.floor(basePageHeight.value * pageScale.value)
  return { width: `${width}px`, height: `${height}px` }
})
// no markdown slide

// Error state
const error = ref<string | null>(null)

// Canvas ref setter
function setCanvasRef(pageNumber: number) {
  return (el: Element | ComponentPublicInstance | null) => {
    const canvas = el as HTMLCanvasElement | null
    if (!canvas) {
      canvases.delete(pageNumber)
      return
    }
    canvases.set(pageNumber, canvas)
  }
}

// Map slide index -> PDF page number (1-based)
function slideIndexToPage(slideIndex: number): number | null {
  if (hasTrailer.value) {
    if (slideIndex === numPages.value) return null
    return slideIndex + 1
  }
  return slideIndex + 1
}

// Navigation
function scrollTo(index: number) {
  emblaApi.value?.scrollTo(index)
}
function onPrevKey() {
  emblaApi.value?.scrollPrev()
}
function onNextKey() {
  emblaApi.value?.scrollNext()
}

// Debounced resize handling
let resizeObserver: ResizeObserver | null = null
const updateContainerSize = useDebounceFn(() => {
  if (!rootEl.value) return
  const rect = rootEl.value.getBoundingClientRect()
  containerWidth.value = Math.floor(rect.width)
  containerHeight.value = Math.floor(rect.height)

  // Measure dots in CSS px
  if (dotsEl.value && totalSlides.value > 1) {
    dotsMeasuredPx.value = dotsEl.value.offsetHeight
  } else {
    dotsMeasuredPx.value = 0
  }

  // Re-render the visible page at new scale
  renderVisible()
}, 120)

function initResizeObserver() {
  if (!rootEl.value) return
  resizeObserver = new ResizeObserver(() => updateContainerSize())
  resizeObserver.observe(rootEl.value)
}

// Emit content size so parent can size the modal precisely
async function maybeEmitContentSize() {
  // Convert dots height to base units (approx) using current scale if measurable
  const scale = pageScale.value || 1
  const dotsBase = totalSlides.value > 1 ? Math.round((dotsMeasuredPx.value || 0) / Math.max(scale, 0.0001)) : 0
  const payload: ContentSizePayload = {
    width: Math.round(basePageWidth.value),
    height: Math.round(basePageHeight.value),
    dotsHeight: dotsBase,
    pageWidth: Math.round(basePageWidth.value),
    pageHeight: Math.round(basePageHeight.value),
  }

  emit('contentSize', payload)
}

// PDF loading
let loadingTask: any | null = null
async function loadPdf(url: string) {
  cleanupPdf()
  error.value = null
  numPages.value = 0
  currentIndex.value = 0
  canvases.clear()
  renderTasks.forEach((t) => t.cancel())
  renderTasks.clear()

  if (!url) return
  try {
    loadingTask = getDocument({ url })
    const doc: PDFDocumentProxy = await loadingTask.promise
    pdfDoc.value = doc
    numPages.value = doc.numPages

    // Determine base page size from the first PDF page
    const firstPage: PDFPageProxy = await doc.getPage(1)
    const vp = firstPage.getViewport({ scale: 1 })
    basePageWidth.value = Math.max(100, Math.round(vp.width))
    basePageHeight.value = Math.max(100, Math.round(vp.height))

    await nextTick()
    // Initialize size and emit intrinsic content size
    updateContainerSize()
    await nextTick()
    maybeEmitContentSize()

    // Ensure first slide is visible and rendered
    emblaApi.value?.reInit()
    renderVisible(true)
  } catch (e: any) {
    error.value = 'Failed to load PDF'
  }
}

function cleanupPdf() {
  try {
    if (loadingTask?.destroy) loadingTask.destroy()
  } catch {}
  try {
    pdfDoc.value?.destroy()
  } catch {}
  pdfDoc.value = null
}

// Rendering
function cssSizeForPage() {
  return {
    widthCss: Math.floor(basePageWidth.value * pageScale.value),
    heightCss: Math.floor(basePageHeight.value * pageScale.value),
  }
}

async function renderPage(pageNumber: number) {
  const doc = pdfDoc.value
  if (!doc) return
  const canvas = canvases.get(pageNumber)
  if (!canvas) return

  // Cancel any ongoing render for this page
  const prevTask = renderTasks.get(pageNumber)
  if (prevTask) {
    try { prevTask.cancel() } catch {}
  }

  const page = await doc.getPage(pageNumber)
  const { widthCss, heightCss } = cssSizeForPage()

  const renderScale = pageScale.value * dpr
  const viewport = page.getViewport({ scale: Math.max(0.1, renderScale) })
  const ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D | null
  if (!ctx) return

  // Set canvas size in device pixels, CSS size in CSS pixels
  canvas.width = Math.max(1, Math.round(viewport.width))
  canvas.height = Math.max(1, Math.round(viewport.height))
  canvas.style.width = `${widthCss}px`
  canvas.style.height = `${heightCss}px`

  // Render
  const task = page.render({ canvasContext: ctx as any, viewport, canvas })
  renderTasks.set(pageNumber, task)
  try {
    await task.promise
  } catch (e: any) {
    // Ignore cancelled renders
  }
}

function renderVisible(warmNext = false) {
  const index = emblaApi.value?.selectedScrollSnap() ?? 0
  const pageNum = slideIndexToPage(index)
  if (pageNum) renderPage(pageNum)
  if (warmNext) {
    const nextIdx = Math.min(index + 1, totalSlides.value - 1)
    const nextPage = slideIndexToPage(nextIdx)
    if (nextPage) setTimeout(() => renderPage(nextPage), 50)
  }
}

// Watchers & lifecycle
watch(
  () => props.src,
  (u) => {
    loadPdf(u)
  },
  { immediate: true }
)

onMounted(() => {
  initResizeObserver()
  // Embla events
  emblaApi.value?.on('select', () => {
    currentIndex.value = emblaApi.value?.selectedScrollSnap() ?? 0
    renderVisible(true)
  })
  emblaApi.value?.on('resize', () => {
    renderVisible()
  })
  nextTick(() => updateContainerSize())
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  renderTasks.forEach((t) => {
    try { t.cancel() } catch {}
  })
  renderTasks.clear()
  cleanupPdf()
})

</script>

<style scoped>
/* No unexpected gaps; align content to top */
</style>


