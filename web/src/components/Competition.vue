<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-navy-400/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
          CIMA Annual Competition
        </h1>
        <p class="mt-6 text-lg md:text-xl text-navy-200 max-w-2xl mx-auto font-sans leading-relaxed">
          Introducing sixth form students to finance through a supportive case-based competition.
          Learn valuation, deal analysis, and present to industry judges.
        </p>

        <!-- Stats Grid -->
        <div class="mt-10 grid gap-4 max-w-2xl mx-auto grid-cols-3">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
            <div class="text-3xl md:text-4xl font-semibold text-white">{{ state.stats.students }}</div>
            <div class="mt-1 text-sm text-navy-200">Students</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
            <div class="text-lg md:text-xl font-semibold text-white">Cambridge</div>
            <div class="mt-1 text-sm text-navy-200">Union Access</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
            <div class="text-3xl md:text-4xl font-semibold text-white">{{ state.stats.finalists }}</div>
            <div class="mt-1 text-sm text-navy-200">Finalists</div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="mt-10 flex flex-wrap gap-4 justify-center">
          <a
            :href="state.sampleBriefUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-medium transition-all duration-300 hover:bg-white/10"
          >
            <Download class="w-5 h-5" />
            Download Sample Brief
          </a>
          <a
            :href="state.applyUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-navy-900 font-medium transition-all duration-300 hover:bg-navy-50"
          >
            <ArrowRight class="w-5 h-5" />
            Apply Now
          </a>
        </div>
      </div>
    </section>

    <!-- Overview -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">Overview</h2>
        <p class="mt-4 text-lg text-navy-600 font-sans leading-relaxed">
          The CIMA Sixth Form Competition is designed to introduce talented students to the world of
          investment and M&A analysis through a structured, educational case study process. Teams work
          on real transaction scenarios, developing analytical skills valued by top financial institutions.
        </p>
      </div>
    </section>

    <!-- Timeline -->
    <section class="py-16 md:py-20 bg-navy-50/50">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight text-center mb-12">
          Competition Timeline
        </h2>
        <div class="relative">
          <!-- Timeline line -->
          <div class="hidden md:block absolute left-0 right-0 top-6 h-px bg-navy-200" aria-hidden="true"></div>

          <div class="grid gap-8 md:grid-cols-3">
            <div
              v-for="m in computedTimeline"
              :key="m.title"
              class="relative text-center"
            >
              <span class="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 h-4 w-4 rounded-full bg-navy-800" aria-hidden="true"></span>
              <div class="md:mt-10">
                <span class="text-sm text-navy-500 font-sans">{{ m.when }}</span>
                <div class="mt-2 flex items-center justify-center gap-2">
                  <h3 class="text-lg font-semibold text-navy-900">{{ m.title }}</h3>
                  <Badge
                    :class="[
                      'text-xs',
                      m.status === 'Current' ? 'bg-amber-100 text-amber-700' : m.status === 'Past' ? 'bg-navy-100 text-navy-600' : 'bg-emerald-100 text-emerald-700'
                    ]"
                  >
                    {{ m.status }}
                  </Badge>
                </div>
                <p class="mt-2 text-sm text-navy-500 font-sans">{{ m.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Learning & Eligibility -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Learning -->
          <div class="bg-white rounded-2xl border border-navy-100 p-8">
            <h2 class="text-2xl font-semibold text-navy-900 mb-6">Team Learning & Case Studies</h2>
            <div class="space-y-6">
              <div v-for="p in pillars" :key="p.title">
                <h4 class="font-semibold text-navy-900">{{ p.title }}</h4>
                <p class="mt-1 text-sm text-navy-500 font-sans">{{ p.description }}</p>
              </div>
            </div>
          </div>

          <!-- Eligibility -->
          <div class="bg-navy-50/50 rounded-2xl border border-navy-100 p-8">
            <h2 class="text-2xl font-semibold text-navy-900 mb-6">Eligibility Requirements</h2>
            <ul class="space-y-3">
              <li
                v-for="item in eligibility"
                :key="item"
                class="flex items-start gap-3 text-navy-600 font-sans"
              >
                <Check class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Judges -->
    <section class="py-16 md:py-20 bg-navy-50/50">
      <div class="max-w-5xl mx-auto px-6">
        <div class="bg-white rounded-2xl border border-navy-100 p-8">
          <h2 class="text-2xl font-semibold text-navy-900 mb-2">Industry Judges</h2>
          <p class="text-navy-500 font-sans mb-8">
            Learn from and present to senior professionals from leading financial institutions.
          </p>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="j in judges"
              :key="j.name"
              class="p-4 rounded-xl bg-navy-50"
            >
              <span class="text-xs uppercase tracking-wide text-navy-400">{{ j.tagline }}</span>
              <h4 class="mt-1 font-semibold text-navy-900">{{ j.name }}</h4>
              <p class="text-sm text-navy-500">{{ j.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Prizes -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-5xl mx-auto px-6">
        <div class="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

          <div class="relative z-10">
            <h2 class="text-2xl md:text-3xl font-semibold text-white mb-8">Prizes & Recognition</h2>
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <span class="text-sm text-navy-300 uppercase tracking-wide">All Finalists</span>
                <h3 class="mt-2 text-xl font-semibold text-white">Cambridge Union Debate Attendance</h3>
                <p class="mt-2 text-navy-200 font-sans">
                  Exclusive access to Cambridge Union debate and networking with industry professionals.
                </p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <span class="text-sm text-navy-300">Highlights</span>
                <ul class="mt-3 space-y-2">
                  <li class="flex items-center gap-2 text-navy-100 font-sans">
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    Networking with industry professionals
                  </li>
                  <li class="flex items-center gap-2 text-navy-100 font-sans">
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    Recognition at finals day
                  </li>
                  <li class="flex items-center gap-2 text-navy-100 font-sans">
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    Exclusive debate access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-20 bg-navy-50/50 border-t border-navy-100">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <h2 class="text-2xl md:text-3xl font-semibold text-navy-900">Ready to Apply?</h2>
        <p class="mt-4 text-navy-500 font-sans">
          Applications are open for the {{ new Date().getFullYear() }} competition. Start your journey into investment banking and M&A.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <a
            :href="state.applyUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-navy-800 text-white font-medium transition-all duration-300 hover:bg-navy-700"
          >
            <ArrowRight class="w-5 h-5" />
            Apply Now
          </a>
          <a
            :href="state.sampleBriefUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border-2 border-navy-200 text-navy-700 font-medium transition-all duration-300 hover:bg-navy-50"
          >
            <Download class="w-5 h-5" />
            View Sample Brief
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from 'vue'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Download, Check } from 'lucide-vue-next'

type CompetitionConfig = {
  year: number
  applications: {
    isOpen: boolean
    applyUrl: string
    openDate: string
    deadlineDate: string
    finalsDate: string
    sampleBriefUrl: string
  }
  stats: {
    students: number
    finalists: number
    hasDebateAccess: boolean
  }
}

const DEFAULTS: CompetitionConfig = {
  year: new Date().getFullYear(),
  applications: {
    isOpen: true,
    applyUrl: 'https://example.com/apply',
    openDate: '2024-09-01',
    deadlineDate: '2024-11-15',
    finalsDate: '2024-12-10',
    sampleBriefUrl: 'https://example.com/sample-brief.pdf',
  },
  stats: {
    students: 200,
    finalists: 3,
    hasDebateAccess: true,
  },
}

const state = reactive({
  applyUrl: DEFAULTS.applications.applyUrl,
  sampleBriefUrl: DEFAULTS.applications.sampleBriefUrl,
  stats: DEFAULTS.stats,
  dates: {
    open: DEFAULTS.applications.openDate,
    deadline: DEFAULTS.applications.deadlineDate,
    finals: DEFAULTS.applications.finalsDate,
  },
})

const pillars = [
  { title: 'Team-Based Learning', description: 'Work in teams of 3-4 students to tackle real-world M&A scenarios' },
  { title: 'Professional Case Studies', description: 'Analyze real transactions with guidance from industry professionals' },
  { title: 'Industry Recognition', description: 'Present findings to senior professionals from leading firms' },
]

const eligibility = [
  'Currently enrolled in Year 12 or 13',
  'Strong interest in finance or business',
  'Ability to work collaboratively in teams',
  'Commitment to the full competition timeline',
]

const judges = [
  { name: 'Industry Judge', role: 'Senior Professional', tagline: 'Leading Financial Institution' },
  { name: 'Zaheed Monir', role: 'Society Senior Advisor', tagline: 'CIMA Cambridge' },
]

const computedTimeline = computed(() => {
  const items = [
    {
      key: 'open',
      title: 'Applications Open',
      date: state.dates.open,
      description: 'Submit your application with a brief introduction and academic background',
    },
    {
      key: 'deadline',
      title: 'Submission Deadline',
      date: state.dates.deadline,
      description: 'Complete a take-home case study on a recent M&A transaction',
    },
    {
      key: 'finals',
      title: 'Finals Day',
      date: state.dates.finals,
      description: '3 finalists pitch to judges panel and attend a Cambridge Union debate',
    },
  ]

  function label(d: string) {
    const dt = new Date(d)
    return isNaN(dt.getTime()) ? d : new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(dt)
  }

  const now = Date.now()
  return items.map((it) => {
    const t = new Date(it.date).getTime()
    const status = isNaN(t)
      ? 'Upcoming'
      : t <= now
        ? it.key === 'deadline' && now < new Date(state.dates.finals).getTime() ? 'Current' : 'Past'
        : 'Upcoming'
    return { title: it.title, when: label(it.date), description: it.description, status }
  })
})

async function fetchConfig() {
  try {
    const res = await fetch('/api/competition/config')
    if (!res.ok) return
    const cfg = (await res.json()) as CompetitionConfig
    state.applyUrl = cfg.applications?.applyUrl || state.applyUrl
    state.sampleBriefUrl = cfg.applications?.sampleBriefUrl || state.sampleBriefUrl
    state.stats = cfg.stats || state.stats
    state.dates.open = cfg.applications?.openDate || state.dates.open
    state.dates.deadline = cfg.applications?.deadlineDate || state.dates.deadline
    state.dates.finals = cfg.applications?.finalsDate || state.dates.finals
  } catch {
    // fallback to defaults silently
  }
}

onMounted(() => { fetchConfig() })
</script>
