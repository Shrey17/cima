<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative min-h-[85vh] flex items-center justify-center" style="background-color: #1f355e;">

      <!-- Hero Content -->
      <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p class="font-medium tracking-wide uppercase text-lg md:text-xl lg:text-2xl mb-6" style="color: #d98f44;">
          Cambridge University Investment and Mergers & Acquisitions Society
        </p>
        <h1 class="hero-title text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Open access M&A insight from Cambridge students
        </h1>
        <p class="mt-8 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-sans" style="color: #b2cce9;">
          Deal analysis, market research, and strategic insights.
          All research is freely accessible and maintained to industry standards.
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <router-link
            to="/research?type=flash"
            class="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-2 border-white/30 text-white font-medium transition-all duration-300 hover:bg-white hover:text-navy-900 hover:border-white"
          >
            <FileText class="w-5 h-5 transition-transform group-hover:scale-110" />
            Read Latest Deal Flash
          </router-link>
          <router-link
            to="/competition"
            class="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white text-navy-900 font-medium transition-all duration-300 hover:bg-navy-50 hover:shadow-lg hover:shadow-white/20"
          >
            <Trophy class="w-5 h-5 transition-transform group-hover:scale-110" />
            Sixth Form Competition
          </router-link>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown class="w-6 h-6 text-white/50" />
      </div>
    </section>

    <!-- Latest Research Section -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">
            Latest Research
          </h2>
          <p class="mt-4 text-lg text-navy-500 max-w-2xl mx-auto font-sans">
            Professional M&A analysis covering live transactions, market trends, and strategic insights.
          </p>
        </div>

        <!-- Research Cards Grid -->
        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
          <article
            v-for="doc in latestResearch"
            :key="doc.id"
            class="group relative bg-white rounded-xl border border-navy-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-navy-900/5 hover:border-navy-200 hover:-translate-y-1"
          >
            <div class="p-6">
              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-if="doc.type"
                  :class="getTagClasses(doc.type)"
                  class="px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide"
                >
                  {{ formatType(doc.type) }}
                </span>
                <span
                  v-if="getSectorTag(doc)"
                  class="px-2.5 py-1 text-xs font-medium rounded-full bg-navy-50 text-navy-600"
                >
                  {{ getSectorTag(doc) }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-semibold text-navy-900 leading-snug mb-3 group-hover:text-navy-700 transition-colors">
                {{ doc.name }}
              </h3>

              <!-- Meta: Source → Target -->
              <div v-if="doc.summary" class="flex items-center gap-2 text-sm text-navy-500 mb-3">
                <Building2 class="w-4 h-4 shrink-0" />
                <span class="truncate">{{ getCompanyInfo(doc) }}</span>
              </div>

              <!-- Summary -->
              <p class="text-navy-600 text-sm leading-relaxed line-clamp-3 font-sans">
                {{ doc.summary }}
              </p>

              <!-- Footer -->
              <div class="mt-5 pt-4 border-t border-navy-100 flex items-center justify-between">
                <span class="text-xs text-navy-400 font-sans">
                  {{ formatDate(doc.creation_time) }}
                </span>
                <router-link
                  :to="{ path: '/research', query: { id: doc.id } }"
                  class="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900 transition-colors"
                >
                  Read more
                  <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </router-link>
              </div>
            </div>
          </article>
        </div>

        <!-- View All CTA -->
        <div class="mt-12 text-center">
          <router-link
            to="/research"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-navy-800 text-white font-medium transition-all duration-300 hover:bg-navy-700 hover:shadow-lg"
          >
            View All Research
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Finance Fundamentals Section -->
    <section class="py-20 md:py-28" style="background-color: rgba(178, 204, 233, 0.25);">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">
            Finance Fundamentals
          </h2>
          <p class="mt-4 text-lg text-navy-500 max-w-2xl mx-auto font-sans">
            Essential concepts explained clearly for students new to M&A and investment analysis.
          </p>
        </div>

        <!-- Fundamentals Cards -->
        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
          <article
            v-for="item in fundamentalsCards"
            :key="item.title"
            class="group bg-white rounded-xl border border-navy-100 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-navy-900/5 hover:border-navy-200"
          >
            <div class="w-14 h-14 rounded-xl bg-navy-100 flex items-center justify-center mb-6 transition-colors group-hover:bg-navy-800">
              <component
                :is="item.icon"
                class="w-7 h-7 text-navy-600 transition-colors group-hover:text-white"
              />
            </div>
            <h3 class="text-xl font-semibold text-navy-900 mb-3">
              {{ item.title }}
            </h3>
            <p class="text-navy-600 text-sm leading-relaxed font-sans mb-5">
              {{ item.description }}
            </p>
            <router-link
              :to="item.link"
              class="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900 transition-colors"
            >
              Read More
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </router-link>
          </article>
        </div>

        <!-- View All Fundamentals -->
        <div class="mt-12 text-center">
          <router-link
            to="/research?type=fundamentals"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-navy-800 text-navy-800 font-medium transition-all duration-300 hover:bg-navy-800 hover:text-white"
          >
            View All Fundamentals
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Competition Section -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-4xl mx-auto px-6">
        <div class="relative overflow-hidden rounded-2xl p-10 md:p-14 text-center" style="background-color: #1f355e;">
          <!-- Decorative elements -->
          <div class="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style="background-color: rgba(217, 143, 68, 0.15);"></div>
          <div class="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" style="background-color: rgba(178, 204, 233, 0.2);"></div>

          <div class="relative z-10">
            <div class="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-6" style="background-color: rgba(217, 143, 68, 0.2);">
              <Trophy class="w-8 h-8" style="color: #d98f44;" />
            </div>
            <h2 class="text-2xl md:text-3xl font-semibold text-white mb-4">
              Sixth Form Competition 2024
            </h2>
            <p class="max-w-xl mx-auto mb-8 font-sans leading-relaxed" style="color: #b2cce9;">
              Introduce sixth form students to finance through a supportive case-based competition.
              Learn valuation, deal analysis, and present to industry judges.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <router-link
                to="/competition"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-navy-900 font-medium transition-all duration-300 hover:bg-navy-50"
              >
                Learn More
                <ArrowRight class="w-4 h-4" />
              </router-link>
              <a
                href="#"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-medium transition-all duration-300 hover:bg-white/10"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- For Professionals Section -->
    <section class="py-20 md:py-28 bg-white border-t border-navy-100">
      <div class="max-w-4xl mx-auto px-6">
        <div class="rounded-2xl p-10 md:p-14" style="background-color: rgba(178, 204, 233, 0.3);">
          <div class="flex flex-col md:flex-row items-start gap-8">
            <div class="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style="background-color: #1f355e;">
              <Handshake class="w-8 h-8 text-white" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl md:text-3xl font-semibold text-navy-900 mb-4">
                For Industry Professionals
              </h2>
              <p class="text-navy-600 font-sans leading-relaxed mb-6">
                We welcome professionals to share their insights and expertise with our members.
                Whether through a workshop, panel discussion, or fireside chat, your experience
                can help shape the next generation of finance professionals.
              </p>
              <div class="flex flex-wrap items-center gap-4">
                <a
                  href="mailto:cima@cambridgesu.co.uk"
                  class="inline-flex items-center gap-2 font-sans text-sm font-medium hover:underline"
                  style="color: #1f355e;"
                >
                  <Mail class="w-5 h-5" />
                  cima@cambridgesu.co.uk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stay Updated / Newsletter Section -->
    <section class="py-20 md:py-28 border-t" style="background-color: rgba(178, 204, 233, 0.25); border-color: rgba(178, 204, 233, 0.5);">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">
          Stay Updated
        </h2>
        <p class="mt-4 text-lg text-navy-500 font-sans">
          Get the latest deal flashes, research reports, and event announcements delivered to your inbox.
        </p>

        <form @submit.prevent="handleSubmit" class="mt-10">
          <div class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              :class="[
                'flex-1 px-5 py-3.5 rounded-lg border text-base font-sans transition-all duration-200 focus:outline-none focus:ring-2',
                email.trim() && !isEmailValid
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-navy-200 focus:border-navy-400 focus:ring-navy-100'
              ]"
              :disabled="isSubmitting || isSuccess"
              required
            />
            <button
              type="submit"
              :class="[
                'px-7 py-3.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2',
                isSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-navy-800 text-white hover:bg-navy-700'
              ]"
              :disabled="isSubmitting || isSuccess || !email.trim() || !isEmailValid"
            >
              <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
              <Check v-else-if="isSuccess" class="w-5 h-5" />
              <span v-if="isSubmitting">Subscribing...</span>
              <span v-else-if="isSuccess">Subscribed!</span>
              <span v-else>Subscribe</span>
            </button>
          </div>

          <p class="mt-4 text-sm text-navy-400 font-sans">
            No spam, unsubscribe at any time. Updates sent monthly.
          </p>

          <div v-if="email.trim() && !isEmailValid" class="mt-3">
            <p class="text-red-500 text-sm">Please enter a valid email address</p>
          </div>
          <div v-if="submitMessage" class="mt-3">
            <p :class="submitMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'" class="text-sm">
              {{ submitMessage.text }}
            </p>
          </div>
        </form>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, markRaw } from 'vue'
import {
  FileText,
  ChevronDown,
  ArrowRight,
  Building2,
  TrendingUp,
  Landmark,
  Calculator,
  Trophy,
  Loader2,
  Check,
  Handshake,
  Mail
} from 'lucide-vue-next'
import { useDeals } from '@/composables/useDeals'
import { subscribeToMailingList } from '@/lib/api'
import type { DocumentPreview } from '@/types/deals'

const { all: allDeals } = useDeals()

// Get latest 3 research documents
const latestResearch = computed(() => {
  const docs = allDeals.value ?? []
  return docs
    .filter(d => d.type === 'flash' || d.type === 'report')
    .sort((a, b) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime())
    .slice(0, 3)
})

// Finance Fundamentals cards data
const fundamentalsCards = [
  {
    icon: markRaw(TrendingUp),
    title: 'What are Synergies?',
    description: 'Learn about cost synergies, revenue synergies, and why they matter in M&A transactions.',
    link: '/research?type=fundamentals&topic=synergies'
  },
  {
    icon: markRaw(Landmark),
    title: 'How is a Deal Financed?',
    description: 'Understand cash vs. stock consideration, debt financing, and how payment structure affects risk.',
    link: '/research?type=fundamentals&topic=financing'
  },
  {
    icon: markRaw(Calculator),
    title: 'Valuation Multiples',
    description: 'Master EV/EBITDA, P/E ratios, and other key metrics used to value companies in M&A.',
    link: '/research?type=fundamentals&topic=valuation'
  }
]

// Utility functions
function formatDate(iso: string) {
  const dt = new Date(iso)
  return isNaN(dt.getTime()) ? iso : new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(dt)
}

function formatType(type: string) {
  return type === 'flash' ? 'Flash' : type === 'report' ? 'Report' : type
}

function getTagClasses(type: string) {
  if (type === 'flash') return 'bg-amber-100 text-amber-700'
  if (type === 'report') return 'bg-navy-100 text-navy-700'
  return 'bg-emerald-100 text-emerald-700'
}

function getSectorTag(doc: DocumentPreview): string | null {
  // Extract sector from name or summary
  const text = `${doc.name} ${doc.summary}`.toLowerCase()
  if (text.includes('tech') || text.includes('software')) return 'Technology'
  if (text.includes('health') || text.includes('pharma')) return 'Healthcare'
  if (text.includes('energy') || text.includes('oil')) return 'Energy'
  if (text.includes('financ') || text.includes('bank')) return 'Financial Services'
  return null
}

function getCompanyInfo(doc: DocumentPreview): string {
  // Try to extract company info from summary
  const summary = doc.summary || ''
  if (summary.includes('→')) return summary.split('→')[0].trim().slice(0, 40)
  if (summary.includes('acquisition of')) {
    const match = summary.match(/acquisition of\s+([^,\.]+)/i)
    if (match) return match[1].trim()
  }
  return doc.name.slice(0, 35)
}

// Newsletter form state
const email = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)
const submitMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

const isEmailValid = computed(() => {
  return email.value.trim() === '' || isValidEmail(email.value)
})

async function handleSubmit() {
  if (!email.value.trim() || isSubmitting.value || isSuccess.value) return

  if (!isValidEmail(email.value)) {
    submitMessage.value = { type: 'error', text: 'Please enter a valid email address.' }
    return
  }

  isSubmitting.value = true
  isSuccess.value = false
  submitMessage.value = null

  try {
    await subscribeToMailingList(email.value.trim())
    isSubmitting.value = false
    isSuccess.value = true

    setTimeout(() => {
      isSuccess.value = false
      email.value = ''
      submitMessage.value = null
    }, 2500)
  } catch (error: any) {
    isSubmitting.value = false
    isSuccess.value = false
    submitMessage.value = {
      type: 'error',
      text: error?.message || 'Failed to subscribe. Please try again.'
    }
  }
}
</script>

<style scoped>
.hero-title {
  text-shadow: 0 2px 40px rgba(0, 0, 0, 0.3);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%) translateX(-50%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0) translateX(-50%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
