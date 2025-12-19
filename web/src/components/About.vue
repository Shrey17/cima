<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-navy-400/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
          About CIMA Cambridge
        </h1>
        <p class="mt-6 text-lg md:text-xl text-navy-200 max-w-2xl mx-auto font-sans leading-relaxed">
          CIMA exists to make investment and M&A insight accessible, rigorous, and engaging for Cambridge students.
          We turn theory into practical analysis through open access research, events, and outreach.
        </p>
      </div>
    </section>

    <!-- Our Mission Section -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">
            Our Mission
          </h2>
          <p class="mt-6 text-lg text-navy-600 max-w-3xl mx-auto font-sans leading-relaxed">
            To bridge the gap between academic finance theory and real-world M&A practice, providing
            Cambridge students with professional-grade analytical skills while contributing valuable
            insights to the broader financial community.
          </p>
        </div>

        <!-- Mission Pillars -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="pillar in missionPillars"
            :key="pillar.title"
            class="text-center p-6 rounded-xl border border-navy-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/5 hover:border-navy-200"
          >
            <div class="w-14 h-14 mx-auto rounded-xl bg-navy-100 flex items-center justify-center mb-5">
              <component :is="pillar.icon" class="w-7 h-7 text-navy-600" />
            </div>
            <h3 class="text-lg font-semibold text-navy-900 mb-2">{{ pillar.title }}</h3>
            <p class="text-navy-500 text-sm font-sans leading-relaxed">{{ pillar.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Access Policy Section -->
    <section class="py-20 md:py-28 bg-navy-50/50">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <!-- Left Column -->
          <div>
            <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mb-6">
              Open Access Policy
            </h2>
            <p class="text-lg text-navy-600 font-sans leading-relaxed mb-8">
              We believe that high-quality financial analysis should be accessible to everyone, not just
              those with expensive subscriptions or institutional access.
            </p>

            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center shrink-0">
                  <Unlock class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 class="font-semibold text-navy-900 mb-1">Free Access</h4>
                  <p class="text-navy-500 text-sm font-sans">
                    All research reports and deal flashes are freely available without registration or paywalls.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center shrink-0">
                  <Globe class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 class="font-semibold text-navy-900 mb-1">Global Reach</h4>
                  <p class="text-navy-500 text-sm font-sans">
                    Our research is accessed by students and professionals worldwide.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center shrink-0">
                  <Award class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 class="font-semibold text-navy-900 mb-1">Professional Quality</h4>
                  <p class="text-navy-500 text-sm font-sans">
                    Maintained to industry standards with rigorous editorial processes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="bg-white rounded-2xl border border-navy-100 p-8">
            <h3 class="text-xl font-semibold text-navy-900 mb-4">Community Focus</h3>
            <p class="text-navy-600 font-sans leading-relaxed mb-6">
              Our commitment to open access has built a global community of students, professionals,
              and academics who rely on our insights for learning and professional development.
            </p>
            <ul class="space-y-3">
              <li class="flex items-center gap-3 text-navy-600 font-sans">
                <div class="w-2 h-2 rounded-full bg-navy-800"></div>
                Global reach across universities
              </li>
              <li class="flex items-center gap-3 text-navy-600 font-sans">
                <div class="w-2 h-2 rounded-full bg-navy-800"></div>
                Professional-grade research standards
              </li>
              <li class="flex items-center gap-3 text-navy-600 font-sans">
                <div class="w-2 h-2 rounded-full bg-navy-800"></div>
                Active student engagement
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Initiatives Section -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">
            Key Initiatives
          </h2>
          <p class="mt-4 text-lg text-navy-500 max-w-2xl mx-auto font-sans">
            Our programs span research, education, and community engagement.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
          <div
            v-for="initiative in initiatives"
            :key="initiative.title"
            class="p-6 rounded-xl border border-navy-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/5 hover:border-navy-200"
          >
            <h3 class="text-xl font-semibold text-navy-900 mb-3">{{ initiative.title }}</h3>
            <p class="text-navy-500 font-sans leading-relaxed">{{ initiative.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Committee Section -->
    <section class="py-20 md:py-28" style="background-color: rgba(178, 204, 233, 0.25);">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-6">
          <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">
            Our Committee
          </h2>
        </div>

        <!-- Committee Members Section -->
        <div class="text-center mb-8">
          <h3 class="text-lg font-semibold text-navy-700">Committee Members</h3>
        </div>

        <!-- Committee Members - grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <article
            v-for="member in committeeMembers"
            :key="member.name"
            class="group bg-white rounded-xl border border-navy-100 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/5 hover:border-navy-200"
          >
            <div class="flex justify-center mb-5">
              <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-navy-100 group-hover:border-navy-300 transition-colors">
                <img :src="member.photo" :alt="member.name" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="text-center">
              <h3 class="font-semibold text-navy-900 group-hover:text-navy-700 transition-colors">
                {{ member.name }}
              </h3>
              <p class="text-sm text-navy-500 mt-1">{{ member.role }}</p>
              <p v-if="member.college" class="text-sm text-navy-400 mt-1 font-sans">{{ member.college }}</p>
            </div>
          </article>
        </div>

        <!-- Founding Chairs Section -->
        <div class="text-center mb-10">
          <h3 class="text-xl font-semibold mb-2" style="color: #d98f44;">Founding Chairs</h3>
          <p class="text-navy-600 font-sans max-w-xl mx-auto">
            CIMA's founding members, serving as Chairs alongside the wider committee.
          </p>
        </div>

        <!-- Founding Chairs and Senior Advisor - 4 cards centered -->
        <div class="flex flex-wrap justify-center gap-6">
          <article
            v-for="chair in foundingChairs"
            :key="chair.name"
            class="group bg-white rounded-xl border border-navy-100 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/5 hover:border-navy-200 w-full sm:w-72"
          >
            <div class="flex justify-center mb-5">
              <div class="w-28 h-28 rounded-full overflow-hidden border-3 group-hover:border-navy-300 transition-colors" style="border: 3px solid #d98f44;">
                <img :src="chair.photo" :alt="chair.name" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="text-center">
              <h3 class="font-semibold text-navy-900 group-hover:text-navy-700 transition-colors">
                {{ chair.name }}
              </h3>
              <p class="text-sm text-navy-500 mt-1">{{ chair.role }}</p>
              <p class="text-sm text-navy-400 mt-1 font-sans">{{ chair.college }}</p>
            </div>
          </article>

          <!-- Senior Advisor -->
          <article class="group bg-white rounded-xl border border-navy-100 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/5 hover:border-navy-200 w-full sm:w-72">
            <div class="flex justify-center mb-5">
              <div class="w-28 h-28 rounded-full overflow-hidden border-3 group-hover:border-navy-300 transition-colors" style="border: 3px solid #1f355e;">
                <img :src="seniorAdvisor.photo" :alt="seniorAdvisor.name" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="text-center">
              <h3 class="font-semibold text-navy-900 group-hover:text-navy-700 transition-colors">
                {{ seniorAdvisor.name }}
              </h3>
              <p class="text-sm text-navy-500 mt-1">{{ seniorAdvisor.role }}</p>
              <p class="text-sm text-navy-400 mt-1 font-sans">{{ seniorAdvisor.college }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 md:py-28 bg-white border-t border-navy-100">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">
          Get in Touch
        </h2>
        <p class="mt-4 text-lg text-navy-500 font-sans">
          Have questions about CIMA or interested in collaborating? We'd love to hear from you.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="mailto:contact@cimacambridge.org"
            class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-navy-800 text-white font-medium transition-all duration-300 hover:bg-navy-700"
          >
            <Mail class="w-5 h-5" />
            Email Us
          </a>
          <a
            href="https://linkedin.com/company/cimacambridge"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border-2 border-navy-200 text-navy-700 font-medium transition-all duration-300 hover:bg-navy-50"
          >
            <Linkedin class="w-5 h-5" />
            Follow on LinkedIn
          </a>
        </div>
      </div>
    </section>

    <!-- Join Section -->
    <section id="join" class="py-20 md:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-400/10 rounded-full blur-3xl"></div>

      <div class="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Join the Analyst Program
        </h2>
        <p class="mt-4 text-lg text-navy-200 font-sans">
          Gain hands-on experience in M&A analysis, work on live deals, and build your finance career.
          Applications open at the start of each academic term.
        </p>
        <a
          href="https://forms.office.com/e/aXjCvb8vxb"
          target="_blank"
          rel="noopener"
          class="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-navy-900 font-medium transition-all duration-300 hover:bg-navy-50 hover:shadow-lg"
        >
          <ArrowRight class="w-5 h-5" />
          Apply Now
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import {
  Users,
  Linkedin,
  Mail,
  TrendingUp,
  Globe,
  GraduationCap,
  Calendar,
  Unlock,
  Award,
  ArrowRight
} from 'lucide-vue-next'

// Senior Advisor data
const seniorAdvisor = {
  name: 'Zahid Moneer',
  role: 'Senior Advisor',
  college: 'Fellow of Judge Business School, Healthcare Investment Banking',
  photo: '/committee/advisor-zahid.jpeg'
}

// Founding Chairs data
const foundingChairs = [
  {
    name: 'Krishna Mahendrakar',
    role: 'Co-Chair',
    college: 'Economics, Trinity Hall',
    photo: '/committee/member-1.jpeg'
  },
  {
    name: 'Prisha Jindal',
    role: 'Co-Chair',
    college: 'Economics, Lucy Cavendish',
    photo: '/committee/member-2.jpeg'
  },
  {
    name: 'Thanojan Sivananthan',
    role: 'Co-Chair',
    college: 'Land Economy, Lucy Cavendish',
    photo: '/committee/member-3.jpeg'
  }
]

// Committee Members data
const committeeMembers = [
  {
    name: 'Krishna Mahendrakar',
    role: 'President',
    college: 'Economics, Trinity Hall',
    photo: '/committee/member-1.jpeg'
  },
  {
    name: 'Prisha Jindal',
    role: 'Vice President',
    college: 'Economics, Lucy Cavendish',
    photo: '/committee/member-2.jpeg'
  },
  {
    name: 'Thanojan Sivananthan',
    role: 'Vice President',
    college: 'Land Economy, Lucy Cavendish',
    photo: '/committee/member-3.jpeg'
  },
  {
    name: 'Prartharna Arora',
    role: 'Treasurer',
    college: 'Economics, Robinson College',
    photo: '/committee/member-4.jpeg'
  },
  {
    name: 'Felix Yu',
    role: 'Director of Research',
    college: 'Engineering, Queens College',
    photo: '/committee/member-5.jpeg'
  },
  {
    name: 'Min Sittman',
    role: 'Publicity Officer',
    college: 'Law, St. John\'s College',
    photo: '/committee/member-6.jpeg'
  },
  {
    name: 'Aditya Kute',
    role: 'Events Officer',
    college: 'Economics, Kings\' College',
    photo: '/committee/member-7.jpeg'
  }
]

// Mission pillars data
const missionPillars = [
  {
    icon: markRaw(TrendingUp),
    title: 'Professional Standards',
    description: 'We maintain industry-grade research standards in all our publications, ensuring credible and actionable analysis.'
  },
  {
    icon: markRaw(Globe),
    title: 'Open Access',
    description: 'All research is freely accessible to everyone, democratizing high-quality M&A insights and analysis.'
  },
  {
    icon: markRaw(GraduationCap),
    title: 'Student Development',
    description: 'We provide hands-on experience in financial analysis, preparing students for careers in finance and consulting.'
  },
  {
    icon: markRaw(Calendar),
    title: 'Industry Engagement',
    description: 'Regular events and workshops connect students with practitioners from leading financial institutions.'
  }
]

// Key initiatives data
const initiatives = [
  {
    title: 'Deal Flash Program',
    description: 'Rapid analysis of live M&A transactions, providing timely insights into market developments and strategic rationale.'
  },
  {
    title: 'Research Reports',
    description: 'Comprehensive sector and thematic analysis, covering market trends, valuations, and strategic implications.'
  },
  {
    title: 'Speaker Series',
    description: 'Monthly events featuring senior professionals from investment banks, private equity firms, and corporations.'
  },
  {
    title: 'Sixth Form Competition',
    description: 'Annual case competition introducing pre-university students to M&A analysis and valuation techniques.'
  }
]
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
