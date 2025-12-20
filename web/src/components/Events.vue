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

        <!-- Tab Toggle -->
        <div class="mt-10 inline-flex items-center p-1 rounded-lg bg-navy-100">
          <button
            @click="activeTab = 'upcoming'"
            :class="[
              'px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
              activeTab === 'upcoming'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            ]"
          >
            Upcoming Events
          </button>
          <button
            @click="activeTab = 'past'"
            :class="[
              'px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
              activeTab === 'past'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            ]"
          >
            Past Events
          </button>
        </div>
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
      <!-- Gallery Grid -->
      <section class="py-12 md:py-16 bg-navy-50/30">
        <div class="max-w-7xl mx-auto px-6">
          <div v-if="displayedEvents.length === 0" class="text-center py-12">
            <CalendarX2 class="w-12 h-12 mx-auto text-navy-300 mb-4" />
            <p class="text-navy-500 font-sans">
              {{ activeTab === 'upcoming' ? 'No upcoming events scheduled.' : 'No past events to show.' }}
            </p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <article
              v-for="event in displayedEvents"
              :key="event.id"
              class="group bg-white rounded-2xl border border-navy-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-navy-900/5 hover:border-navy-200 cursor-pointer"
              @click="openEvent(event.id)"
            >
              <!-- Image -->
              <div class="aspect-[4/3] bg-navy-100 overflow-hidden">
                <img
                  v-if="event.attachment_url"
                  :src="event.attachment_url"
                  :alt="event.name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Calendar class="w-12 h-12 text-navy-300" />
                </div>
              </div>

              <div class="p-5">
                <!-- Title -->
                <h3 class="font-semibold text-navy-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-navy-700 transition-colors">
                  {{ event.name }}
                </h3>

                <!-- Summary -->
                <p class="text-sm text-navy-500 mb-4 line-clamp-2 font-sans">
                  {{ event.summary || 'No description available' }}
                </p>

                <!-- Status Badge -->
                <div class="mb-3">
                  <span class="text-xs text-navy-400 font-medium uppercase tracking-wide">status</span>
                  <div class="mt-1">
                    <span
                      :class="getStatusClasses(event.status)"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ formatStatus(event.status) }}
                    </span>
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="event.tags?.length">
                  <span class="text-xs text-navy-400 font-medium uppercase tracking-wide">tags</span>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span
                      v-for="tag in event.tags.slice(0, 3)"
                      :key="tag"
                      class="px-2 py-0.5 text-xs font-medium rounded-full bg-navy-50 text-navy-600"
                    >
                      {{ tag }}
                    </span>
                  </div>
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

    <!-- Event Modal -->
    <div
      v-if="activeEvent"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="close"
      @keydown.esc="close"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eventTitle"
      >
        <!-- Header -->
        <div class="px-6 pt-6 pb-4 border-b border-navy-100">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span
                :class="getStatusClasses(activeEvent.status)"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
              >
                {{ formatStatus(activeEvent.status) }}
              </span>
              <h2 id="eventTitle" class="text-2xl font-semibold text-navy-900 mb-2">
                {{ activeEvent.name }}
              </h2>
              <p class="text-navy-500 font-sans">{{ formattedDate }}</p>
            </div>
            <button
              @click="close"
              class="p-2 rounded-lg hover:bg-navy-100 transition-colors"
              aria-label="Close"
            >
              <X class="w-5 h-5 text-navy-500" />
            </button>
          </div>

          <!-- Tags -->
          <div v-if="activeEvent.tags?.length" class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in activeEvent.tags"
              :key="tag"
              class="px-2.5 py-1 text-xs font-medium rounded-full bg-navy-50 text-navy-600"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="mt-5 flex flex-wrap gap-3">
            <Button
              v-if="activeEvent.registration_url"
              as="a"
              :href="activeEvent.registration_url"
              target="_blank"
              rel="noopener"
              class="bg-navy-800 hover:bg-navy-700 text-white"
            >
              <Calendar class="w-4 h-4" />
              Register
            </Button>
            <Button
              v-if="activeEvent.location_url"
              as="a"
              :href="activeEvent.location_url"
              target="_blank"
              rel="noopener"
              variant="outline"
              class="border-navy-200 text-navy-700 hover:bg-navy-50"
            >
              <MapPin class="w-4 h-4" />
              Location
            </Button>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-auto">
          <PdfCarousel
            v-if="activeEvent.attachment"
            :src="activeEvent.attachment"
            :headerHeight="0"
            :trailerText="activeEvent.summary"
          />
          <div v-else class="p-6">
            <p class="text-navy-600 font-sans leading-relaxed">{{ activeEvent.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEvents } from '@/composables/useEvents'
import type { EventFull, EventPreview } from '@/types/events'
import { fetchEvent } from '@/lib/api'
import { Button } from '@/components/ui/button'
import PdfCarousel from '@/components/PdfCarousel.vue'
import {
  Calendar,
  MapPin,
  Users,
  X,
  CalendarDays,
  Building,
  CalendarX2,
  Loader2
} from 'lucide-vue-next'

const { loading, error, all } = useEvents()

// Tab state
const activeTab = ref<'upcoming' | 'past'>('upcoming')

// Active event for modal
const activeEvent = ref<EventFull | null>(null)

async function openEvent(id: string) {
  try {
    activeEvent.value = await fetchEvent(id)
  } catch {
    // swallow error
  }
}

function close() {
  activeEvent.value = null
}

// Filter events based on tab
const displayedEvents = computed(() => {
  const list = (all.value ?? []) as EventPreview[]
  const now = Date.now()

  if (activeTab.value === 'upcoming') {
    return list
      .filter((e) => {
        const t = new Date(e.date).getTime()
        return !isNaN(t) && t >= now
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } else {
    return list
      .filter((e) => {
        const t = new Date(e.date).getTime()
        return !isNaN(t) && t < now
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
})

// Format functions
const formattedDate = computed(() => {
  if (!activeEvent.value) return ''
  const dt = new Date(activeEvent.value.date)
  return isNaN(dt.getTime())
    ? activeEvent.value.date
    : new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short' }).format(dt)
})

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getStatusClasses(status: string) {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-700'
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'proposed':
      return 'bg-blue-100 text-blue-700'
    case 'postponed':
      return 'bg-purple-100 text-purple-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-navy-100 text-navy-700'
  }
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
