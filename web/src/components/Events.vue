<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="bg-white border-b border-navy-100">
      <div class="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
        <h1 class="text-4xl md:text-5xl font-semibold text-navy-900 tracking-tight">
          Events
        </h1>
        <p class="mt-4 text-lg text-navy-500 max-w-2xl mx-auto font-sans">
          Industry speakers, workshops, and networking opportunities designed to bridge academic learning with practical M&A and investment insights.
        </p>
      </div>
    </section>

    <!-- Loading / Error States -->
    <div v-if="loading" class="max-w-6xl mx-auto px-6 py-12 text-center">
      <Loader2 class="w-8 h-8 mx-auto animate-spin text-navy-400" />
      <p class="mt-3 text-navy-500 font-sans">Loading events...</p>
    </div>
    <div v-else-if="error" class="max-w-6xl mx-auto px-6 py-12 text-center">
      <p class="text-red-600 font-sans">{{ error }}</p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Upcoming Events -->
      <section class="py-12 md:py-16 bg-navy-50/30">
        <div class="max-w-7xl mx-auto px-6">
          <h2 class="text-2xl font-semibold text-navy-900 mb-8">Upcoming Events</h2>

          <div v-if="upcomingEvents.length === 0" class="text-center py-12">
            <CalendarX2 class="w-12 h-12 mx-auto text-navy-300 mb-4" />
            <p class="text-navy-500 font-sans">No upcoming events scheduled.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <article
              v-for="event in upcomingEvents"
              :key="event.id"
              class="bg-white rounded-2xl border border-navy-100 overflow-hidden"
            >
              <!-- Image -->
              <div class="aspect-[4/3] bg-navy-100 overflow-hidden">
                <img
                  v-if="event.attachment_url"
                  :src="event.attachment_url"
                  :alt="event.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Calendar class="w-12 h-12 text-navy-300" />
                </div>
              </div>

              <div class="p-5">
                <!-- Title -->
                <h3 class="font-semibold text-navy-900 text-lg leading-snug mb-2 line-clamp-2">
                  {{ event.name }}
                </h3>

                <!-- Date -->
                <p class="text-sm text-navy-500 font-sans">
                  {{ formatDateFull(event.date) }}
                </p>

                <!-- Tags -->
                <div v-if="event.tags?.length" class="mt-3 flex flex-wrap gap-1">
                  <span
                    v-for="tag in event.tags.slice(0, 3)"
                    :key="tag"
                    class="px-2 py-0.5 text-xs font-medium rounded-full bg-navy-50 text-navy-600"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Divider -->
      <div class="max-w-7xl mx-auto px-6">
        <hr class="border-navy-200" />
      </div>

      <!-- Past Events -->
      <section class="py-12 md:py-16 bg-navy-50/30">
        <div class="max-w-7xl mx-auto px-6">
          <h2 class="text-2xl font-semibold text-navy-900 mb-8">Past Events</h2>

          <div v-if="pastEvents.length === 0" class="text-center py-12">
            <CalendarX2 class="w-12 h-12 mx-auto text-navy-300 mb-4" />
            <p class="text-navy-500 font-sans">No past events to show.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <article
              v-for="event in pastEvents"
              :key="event.id"
              class="bg-white rounded-2xl border border-navy-100 overflow-hidden"
            >
              <!-- Image -->
              <div class="aspect-[4/3] bg-navy-100 overflow-hidden">
                <img
                  v-if="event.attachment_url"
                  :src="event.attachment_url"
                  :alt="event.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Calendar class="w-12 h-12 text-navy-300" />
                </div>
              </div>

              <div class="p-5">
                <!-- Title -->
                <h3 class="font-semibold text-navy-900 text-lg leading-snug mb-2 line-clamp-2">
                  {{ event.name }}
                </h3>

                <!-- Date -->
                <p class="text-sm text-navy-500 font-sans">
                  {{ formatDateFull(event.date) }}
                </p>

                <!-- Tags -->
                <div v-if="event.tags?.length" class="mt-3 flex flex-wrap gap-1">
                  <span
                    v-for="tag in event.tags.slice(0, 3)"
                    :key="tag"
                    class="px-2 py-0.5 text-xs font-medium rounded-full bg-navy-50 text-navy-600"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Want to Speak CTA -->
      <section class="py-16 md:py-20 bg-white border-t border-navy-100">
        <div class="max-w-2xl mx-auto px-6 text-center">
          <h2 class="text-2xl md:text-3xl font-semibold text-navy-900 mb-4">
            Want to speak at CIMA?
          </h2>
          <p class="text-navy-500 font-sans mb-8">
            We're always looking for industry professionals to share their insights with our community.
          </p>
          <router-link
            to="/about#contact"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border-2 border-navy-800 text-navy-800 font-medium transition-all duration-300 hover:bg-navy-800 hover:text-white"
          >
            Get in Touch
          </router-link>
        </div>
      </section>

      <!-- Info Cards -->
      <section class="py-16 md:py-20 bg-navy-50/50">
        <div class="max-w-6xl mx-auto px-6">
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-14 h-14 mx-auto rounded-xl bg-navy-100 flex items-center justify-center mb-5">
                <Users class="w-7 h-7 text-navy-600" />
              </div>
              <h3 class="text-lg font-semibold text-navy-900 mb-2">Industry Speakers</h3>
              <p class="text-navy-500 text-sm font-sans">
                Learn from practitioners at leading investment banks, private equity firms, and corporations.
              </p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 mx-auto rounded-xl bg-navy-100 flex items-center justify-center mb-5">
                <CalendarDays class="w-7 h-7 text-navy-600" />
              </div>
              <h3 class="text-lg font-semibold text-navy-900 mb-2">Regular Schedule</h3>
              <p class="text-navy-500 text-sm font-sans">
                Monthly events throughout the academic year, typically held on weekday evenings.
              </p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 mx-auto rounded-xl bg-navy-100 flex items-center justify-center mb-5">
                <Building class="w-7 h-7 text-navy-600" />
              </div>
              <h3 class="text-lg font-semibold text-navy-900 mb-2">Cambridge Venues</h3>
              <p class="text-navy-500 text-sm font-sans">
                Events held across various Cambridge colleges and the Judge Business School.
              </p>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEvents } from '@/composables/useEvents'
import type { EventPreview } from '@/types/events'
import {
  Calendar,
  Users,
  CalendarDays,
  Building,
  CalendarX2,
  Loader2
} from 'lucide-vue-next'

const { loading, error, all } = useEvents()

// Upcoming events (future dates)
const upcomingEvents = computed(() => {
  const list = (all.value ?? []) as EventPreview[]
  const now = Date.now()
  return list
    .filter((e) => {
      const t = new Date(e.date).getTime()
      return !isNaN(t) && t >= now
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// Past events (past dates)
const pastEvents = computed(() => {
  const list = (all.value ?? []) as EventPreview[]
  const now = Date.now()
  return list
    .filter((e) => {
      const t = new Date(e.date).getTime()
      return !isNaN(t) && t < now
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Format date like "Thursday, 20 November 2025 at 15:00"
function formatDateFull(dateStr: string): string {
  const dt = new Date(dateStr)
  if (isNaN(dt.getTime())) return dateStr

  const dayName = dt.toLocaleDateString('en-GB', { weekday: 'long' })
  const day = dt.getDate()
  const month = dt.toLocaleDateString('en-GB', { month: 'long' })
  const year = dt.getFullYear()
  const time = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return `${dayName}, ${day} ${month} ${year} at ${time}`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
