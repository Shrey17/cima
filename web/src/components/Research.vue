<template>
  <div class="min-h-screen research-page">
    <!-- Hero Section with gradient -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
            Insights & Analysis
          </h1>
          <p class="mt-6 text-lg md:text-xl max-w-xl leading-relaxed" style="color: #d98f44;">
            Explore deal flashes, in-depth reports, and finance fundamentals curated by the CIMA team.
          </p>
        </div>
      </div>
    </section>

    <!-- Search and Filters - Floating bar -->
    <section class="relative z-20 -mt-8">
      <div class="max-w-5xl mx-auto px-6">
        <div class="filter-bar">
          <div class="relative flex-1">
            <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              v-model="query"
              type="text"
              placeholder="Search flashes, reports, fundamentals..."
              class="search-input"
            />
          </div>
          <div class="filter-pills">
            <button
              v-for="type in typeOptions"
              :key="type.value"
              :class="[
                'filter-pill',
                selectedTypes.has(type.value) ? `filter-pill-active filter-pill-${type.value}` : ''
              ]"
              @click="toggleType(type.value)"
            >
              <span class="pill-dot" :class="`dot-${type.value}`"></span>
              {{ type.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading / Error -->
    <div v-if="loading" class="max-w-6xl mx-auto px-6 py-24 text-center">
      <div class="loading-spinner"></div>
      <p class="mt-4 text-slate-500">Loading research...</p>
    </div>
    <div v-else-if="error" class="max-w-6xl mx-auto px-6 py-24 text-center">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <template v-else>
      <!-- Featured Highlights (only shown when no filters active) -->
      <section v-if="selectedTypes.size === 0 && !query.trim()" class="py-16 md:py-20 bg-white">
        <div class="max-w-6xl mx-auto px-6">
          <div class="section-header">
            <h2 class="section-title">Featured Research</h2>
            <div class="section-line"></div>
          </div>

          <div class="highlights-grid">
            <div
              v-for="(items, type) in highlights"
              :key="type"
              :class="['highlight-column', `highlight-${type}`]"
            >
              <div class="highlight-header">
                <div :class="['highlight-icon', `icon-${type}`]">
                  <Zap v-if="type === 'flash'" class="w-5 h-5" />
                  <FileText v-else-if="type === 'report'" class="w-5 h-5" />
                  <BookOpen v-else class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="highlight-title">{{ formatTypeName(type as string) }}</h3>
                  <p class="highlight-subtitle">{{ getTypeSubtitle(type as string) }}</p>
                </div>
              </div>
              <div class="highlight-cards">
                <DealCard v-for="d in items" :key="d.id" :doc="d" :variant="type as string" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- All Results -->
      <section class="py-16 md:py-20 results-section">
        <div class="max-w-6xl mx-auto px-6">
          <div class="results-header">
            <div>
              <h2 class="section-title">
                {{ selectedTypes.size > 0 ? 'Filtered Results' : 'Browse All' }}
              </h2>
              <p class="results-count">{{ filtered.length }} {{ filtered.length === 1 ? 'publication' : 'publications' }}</p>
            </div>
          </div>

          <div v-if="filtered.length === 0" class="empty-state">
            <div class="empty-icon">
              <FileSearch class="w-8 h-8" />
            </div>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </div>

          <div v-else class="results-grid">
            <DealCard v-for="d in filtered" :key="d.id" :doc="d" :variant="d.type" />
          </div>
        </div>
      </section>
    </template>

    <!-- Detail overlay -->
    <DealDetail :source="filtered" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDeals } from '@/composables/useDeals'
import DealCard from '@/components/DealCard.vue'
import DealDetail from '@/components/DealDetail.vue'
import { Search, FileSearch, Zap, FileText, BookOpen } from 'lucide-vue-next'
import type { DataType } from '@/types/deals'

const route = useRoute()
const { filtered, highlights, query, selectedTypes, toggleType, loading, error, load } = useDeals()

const typeOptions = [
  { value: 'flash' as DataType, label: 'Deal Flashes' },
  { value: 'report' as DataType, label: 'Reports' },
  { value: 'fundamentals' as DataType, label: 'Fundamentals' }
]

onMounted(() => {
  load()
  const typeParam = route.query.type as string
  if (typeParam && ['flash', 'report', 'fundamentals'].includes(typeParam)) {
    selectedTypes.value.clear()
    selectedTypes.value.add(typeParam as DataType)
  }
  const searchParam = route.query.search as string
  if (searchParam) {
    query.value = searchParam
  }
})

watch(() => route.query, (newQuery) => {
  const typeParam = newQuery.type as string
  if (typeParam && ['flash', 'report', 'fundamentals'].includes(typeParam)) {
    selectedTypes.value.clear()
    selectedTypes.value.add(typeParam as DataType)
  }
  const searchParam = newQuery.search as string
  if (searchParam) {
    query.value = searchParam
  }
}, { immediate: false })

function formatTypeName(type: string): string {
  if (type === 'flash') return 'Deal Flashes'
  if (type === 'report') return 'Research Reports'
  if (type === 'fundamentals') return 'Fundamentals'
  return type
}

function getTypeSubtitle(type: string): string {
  if (type === 'flash') return 'Quick-turn deal analysis'
  if (type === 'report') return 'In-depth research'
  if (type === 'fundamentals') return 'Core concepts explained'
  return ''
}
</script>

<style scoped>
.research-page {
  --brand-navy: #1f355e;
  --brand-blue-light: #b2cce9;
  --brand-orange: #d98f44;
  --brand-navy-dark: #162642;
  background: #fafbfc;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: var(--brand-navy);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(178, 204, 233, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 60%, rgba(217, 143, 68, 0.1) 0%, transparent 50%);
}

/* Filter Bar */
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(31, 53, 94, 0.08), 0 1px 3px rgba(31, 53, 94, 0.04);
  border: 1px solid rgba(178, 204, 233, 0.3);
}

@media (min-width: 768px) {
  .filter-bar {
    flex-direction: row;
    align-items: center;
    padding: 1rem 1.5rem;
  }
}

.search-input {
  width: 100%;
  height: 3rem;
  padding-left: 3rem;
  padding-right: 1rem;
  border: 2px solid #e8eef3;
  border-radius: 0.75rem;
  background: #f8fafc;
  color: var(--brand-navy);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--brand-blue-light);
  background: white;
  box-shadow: 0 0 0 4px rgba(178, 204, 233, 0.2);
}

.search-input::placeholder {
  color: #94a3b8;
}

.filter-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 2rem;
  border: 2px solid #e8eef3;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  border-color: var(--brand-blue-light);
  color: var(--brand-navy);
}

.pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 0.2s ease;
}

.dot-flash { background: var(--brand-orange); }
.dot-report { background: var(--brand-navy); }
.dot-fundamentals { background: #10b981; }

.filter-pill-active {
  border-color: transparent;
  color: white;
}

.filter-pill-flash.filter-pill-active {
  background: var(--brand-orange);
}

.filter-pill-report.filter-pill-active {
  background: var(--brand-navy);
}

.filter-pill-fundamentals.filter-pill-active {
  background: #10b981;
}

.filter-pill-active .pill-dot {
  background: rgba(255, 255, 255, 0.5);
}

/* Loading */
.loading-spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto;
  border: 3px solid rgba(178, 204, 233, 0.3);
  border-top-color: var(--brand-navy);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--brand-navy);
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.section-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, var(--brand-blue-light) 0%, transparent 100%);
  border-radius: 1px;
}

/* Highlights Grid */
.highlights-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .highlights-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.highlight-column {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e8eef3;
  transition: all 0.3s ease;
}

.highlight-column:hover {
  box-shadow: 0 8px 32px rgba(31, 53, 94, 0.08);
  border-color: var(--brand-blue-light);
}

.highlight-flash {
  border-top: 3px solid var(--brand-orange);
}

.highlight-report {
  border-top: 3px solid var(--brand-navy);
}

.highlight-fundamentals {
  border-top: 3px solid #10b981;
}

.highlight-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.highlight-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-flash { background: var(--brand-orange); }
.icon-report { background: var(--brand-navy); }
.icon-fundamentals { background: #10b981; }

.highlight-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--brand-navy);
}

.highlight-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 0.125rem;
}

.highlight-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Results Section */
.results-section {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.results-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.results-count {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.results-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  border: 2px dashed #e2e8f0;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 1rem;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--brand-navy);
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.9375rem;
  color: #64748b;
}
</style>
