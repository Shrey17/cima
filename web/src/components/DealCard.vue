<template>
  <!-- External link if URL is provided -->
  <a
    v-if="doc.url"
    :href="doc.url"
    target="_blank"
    rel="noopener"
    :class="['deal-card', `deal-card-${variant}`]"
  >
    <!-- Accent bar -->
    <div :class="['card-accent', `accent-${variant}`]"></div>

    <div class="card-content">
      <!-- Header -->
      <div class="card-header">
        <span :class="['card-badge', `badge-${variant}`]">
          {{ formatType(doc.type) }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="card-title">{{ doc.name }}</h3>

      <!-- Summary -->
      <p class="card-summary">{{ doc.summary }}</p>

      <!-- Footer -->
      <div class="card-footer">
        <div class="card-authors">
          <div class="author-avatars">
            <span v-for="(author, i) in doc.authors.slice(0, 2)" :key="i" class="author-avatar">
              {{ author.charAt(0) }}
            </span>
          </div>
          <span class="author-names">{{ doc.authors.join(', ') }}</span>
        </div>
        <div class="card-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </a>

  <!-- Internal router link if no URL -->
  <router-link
    v-else
    :to="{ name: 'Research', query: { id: doc.id } }"
    :class="['deal-card', `deal-card-${variant}`]"
  >
    <!-- Accent bar -->
    <div :class="['card-accent', `accent-${variant}`]"></div>

    <div class="card-content">
      <!-- Header -->
      <div class="card-header">
        <span :class="['card-badge', `badge-${variant}`]">
          {{ formatType(doc.type) }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="card-title">{{ doc.name }}</h3>

      <!-- Summary -->
      <p class="card-summary">{{ doc.summary }}</p>

      <!-- Footer -->
      <div class="card-footer">
        <div class="card-authors">
          <div class="author-avatars">
            <span v-for="(author, i) in doc.authors.slice(0, 2)" :key="i" class="author-avatar">
              {{ author.charAt(0) }}
            </span>
          </div>
          <span class="author-names">{{ doc.authors.join(', ') }}</span>
        </div>
        <div class="card-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { DocumentPreview } from '@/types/deals'

defineProps<{
  doc: DocumentPreview
  variant?: string
}>()

function formatType(type: string): string {
  if (type === 'flash') return 'Flash'
  if (type === 'report') return 'Report'
  if (type === 'fundamentals') return 'Fundamentals'
  return type
}

</script>

<style scoped>
.deal-card {
  --brand-navy: #1f355e;
  --brand-blue-light: #b2cce9;
  --brand-orange: #d98f44;

  display: block;
  position: relative;
  background: white;
  border-radius: 0.875rem;
  border: 1px solid #e8eef3;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.deal-card:hover {
  border-color: var(--brand-blue-light);
  box-shadow: 0 8px 24px rgba(31, 53, 94, 0.1);
  transform: translateY(-2px);
}

.deal-card:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(178, 204, 233, 0.4);
}

/* Accent bar */
.card-accent {
  height: 3px;
  width: 100%;
}

.accent-flash { background: var(--brand-orange); }
.accent-report { background: var(--brand-navy); }
.accent-fundamentals { background: #10b981; }

/* Content */
.card-content {
  padding: 1.25rem;
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.875rem;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-flash {
  background: rgba(217, 143, 68, 0.12);
  color: #b8742e;
}

.badge-report {
  background: rgba(31, 53, 94, 0.08);
  color: var(--brand-navy);
}

.badge-fundamentals {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}


/* Title */
.card-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--brand-navy);
  line-height: 1.4;
  margin-bottom: 0.625rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.deal-card:hover .card-title {
  color: #2d4a7c;
}

/* Summary */
.card-summary {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.875rem;
  border-top: 1px solid #f1f5f9;
}

.card-authors {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
  flex: 1;
}

.author-avatars {
  display: flex;
  margin-right: -0.25rem;
}

.author-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--brand-blue-light);
  color: var(--brand-navy);
  font-size: 0.6875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  margin-right: -6px;
}

.author-avatar:last-child {
  margin-right: 0;
}

.author-names {
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.deal-card:hover .card-arrow {
  background: var(--brand-navy);
  color: white;
  transform: translateX(2px);
}

/* Variant-specific hover states */
.deal-card-flash:hover .card-arrow {
  background: var(--brand-orange);
}

.deal-card-fundamentals:hover .card-arrow {
  background: #10b981;
}
</style>
