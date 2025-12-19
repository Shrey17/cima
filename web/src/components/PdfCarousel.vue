<template>
  <div
    ref="rootEl"
    class="w-full h-full flex flex-col overflow-hidden bg-white"
    aria-label="PDF viewer"
  >
    <div v-if="error" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center">
        <div class="text-red-600 text-sm mb-2">Failed to load document.</div>
        <a :href="src" target="_blank" rel="noopener" class="text-blue-600 underline text-sm">Open in new tab</a>
      </div>
    </div>

    <div v-else-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-gray-500">Loading PDF...</div>
    </div>

    <div v-else class="flex-1 min-h-0 overflow-y-auto" ref="scrollContainer">
      <!-- All PDF pages stacked vertically -->
      <div class="flex flex-col items-center gap-4 py-4">
        <div
          v-for="pageNum in numPages"
          :key="`p-${pageNum}`"
          class="flex-shrink-0"
        >
          <canvas
            :ref="setCanvasRef(pageNum)"
            class="block bg-white shadow-md"
          ></canvas>
        </div>

        <!-- Optional trailer at the end -->
        <div v-if="hasTrailer" class="w-full max-w-2xl px-4">
          <slot name="trailer">
            <div class="text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {{ props.trailerText }}
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, useSlots, type ComponentPublicInstance } from 'vue'
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

// Refs & state
const rootEl = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)
const canvases = new Map<number, HTMLCanvasElement>()
const renderTasks = new Map<number, RenderTask>()
const pdfDoc = shallowRef<PDFDocumentProxy | null>(null)
const numPages = ref<number>(0)
const loading = ref<boolean>(false)
const slots = useSlots()
const hasTrailer = computed(() => !!props.trailerText || !!slots.trailer)
const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3))

// Base page size at scale=1 (CSS pixels)
const basePageWidth = ref<number>(600)
const basePageHeight = ref<number>(800)

// Container width for scaling
const containerWidth = ref<number>(0)

// Scale to fit container width with some padding
const pageScale = computed(() => {
  const availableWidth = containerWidth.value - 32 // 16px padding on each side
  if (availableWidth <= 0) return 1
  const scale = availableWidth / basePageWidth.value
  return Math.max(0.5, Math.min(scale, 2)) // Clamp between 0.5x and 2x
})

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

// Debounced resize handling
let resizeObserver: ResizeObserver | null = null
function updateContainerSize() {
  if (!rootEl.value) return
  const rect = rootEl.value.getBoundingClientRect()
  containerWidth.value = Math.floor(rect.width)

  // Re-render all pages at new scale
  renderAllPages()
}

function initResizeObserver() {
  if (!rootEl.value) return
  resizeObserver = new ResizeObserver(() => updateContainerSize())
  resizeObserver.observe(rootEl.value)
}

// Emit content size so parent can size the modal
function maybeEmitContentSize() {
  const payload: ContentSizePayload = {
    width: Math.round(basePageWidth.value * pageScale.value),
    height: Math.round(basePageHeight.value * pageScale.value * numPages.value),
    dotsHeight: 0,
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
  loading.value = true
  numPages.value = 0
  canvases.clear()
  renderTasks.forEach((t) => t.cancel())
  renderTasks.clear()

  if (!url) {
    loading.value = false
    return
  }

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

    loading.value = false

    await nextTick()
    updateContainerSize()
    await nextTick()
    maybeEmitContentSize()

    // Render all pages
    renderAllPages()
  } catch (e: any) {
    loading.value = false
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

  const widthCss = Math.floor(basePageWidth.value * pageScale.value)
  const heightCss = Math.floor(basePageHeight.value * pageScale.value)

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

async function renderAllPages() {
  const doc = pdfDoc.value
  if (!doc) return

  // Wait for canvases to be mounted
  await nextTick()

  // Render all pages
  for (let i = 1; i <= numPages.value; i++) {
    renderPage(i)
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
/* Smooth scrolling for the PDF container */
.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>
