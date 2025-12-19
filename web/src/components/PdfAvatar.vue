<template>
  <div class="avatar-root" :style="{ '--size': `${size}px` }">
    <img v-if="dataUrl" :src="dataUrl" :alt="alt || 'PDF avatar'" class="avatar-img" />
    <div v-else class="avatar-fallback" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-10 w-10 opacity-70">
        <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
// @ts-ignore - Vite will turn this into a Worker
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'

const props = defineProps<{
  src: string
  size?: number
  alt?: string
}>()

const size = props.size ?? 88
const dataUrl = ref<string | null>(null)

// Initialize pdf.js worker once
try {
  if (!(GlobalWorkerOptions as any)._workerPortInitialized) {
    GlobalWorkerOptions.workerPort = new (PdfjsWorker as any)()
    ;(GlobalWorkerOptions as any)._workerPortInitialized = true
  }
} catch {}

async function renderFirstPageToDataUrl(url: string) {
  dataUrl.value = null
  if (!url) return
  try {
    const loadingTask = getDocument({ url })
    const doc: PDFDocumentProxy = await loadingTask.promise
    const page: PDFPageProxy = await doc.getPage(1)

    // Determine scale to render a crisp image for the requested size
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3))
    const targetPx = Math.max(64, Math.floor(size * dpr))
    const viewport = page.getViewport({ scale: 1 })
    const scale = Math.max(targetPx / viewport.width, targetPx / viewport.height)
    const vp = page.getViewport({ scale })

    // Render to offscreen canvas
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(vp.width))
    canvas.height = Math.max(1, Math.round(vp.height))
    const ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D | null
    if (!ctx) return
    await page.render({ canvasContext: ctx as any, viewport: vp, canvas: canvas as any }).promise

    // Convert to PNG data URL
    dataUrl.value = canvas.toDataURL('image/png')

    // Cleanup
    try { await (doc as any).destroy?.() } catch {}
  } catch (e) {
    dataUrl.value = null
  }
}

onMounted(() => {
  renderFirstPageToDataUrl(props.src)
})

watch(
  () => props.src,
  (u) => {
    renderFirstPageToDataUrl(u)
  }
)
</script>

<style scoped>
.avatar-root {
  width: var(--size);
  height: var(--size);
  border-radius: 999px;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--muted);
  border: 2px solid color-mix(in oklab, currentColor 12%, transparent);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.avatar-fallback {
  color: color-mix(in oklab, currentColor 60%, transparent);
}
</style>


