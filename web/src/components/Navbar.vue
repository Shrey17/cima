<template>
  <header class="sticky top-0 z-50 w-full bg-white border-b border-navy-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo/Brand -->
        <router-link
          to="/"
          class="flex items-center gap-2 shrink-0"
        >
          <img src="/src/assets/logo.png" alt="CIMA Logo" class="h-9 w-9" />
          <span class="font-semibold text-navy-900 hidden sm:inline-block">
            CIMA
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1">
          <router-link
            to="/"
            class="nav-link"
            exact-active-class="nav-active"
          >
            Home
          </router-link>

          <router-link
            to="/research"
            class="nav-link"
            :class="{ 'nav-active': isResearchPage }"
            @click="clearResearchFilters"
          >
            Research
          </router-link>

          <router-link
            to="/events"
            class="nav-link"
            exact-active-class="nav-active"
          >
            Events
          </router-link>

          <router-link
            to="/competition"
            class="nav-link"
            exact-active-class="nav-active"
          >
            Competition
          </router-link>

          <router-link
            to="/about"
            class="nav-link"
            exact-active-class="nav-active"
          >
            About
          </router-link>

        </nav>

        <!-- Right Section: Search -->
        <div class="hidden lg:flex items-center gap-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search..."
              class="pl-10 pr-4 py-2 rounded-full border border-navy-200 text-sm w-44 focus:w-56 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-200 transition-all duration-200 bg-white"
              @keydown.enter="handleSearch"
            />
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-navy-50 focus:bg-navy-100 focus:outline-none transition-colors"
        >
          <Menu v-if="!isMobileMenuOpen" class="h-5 w-5 text-navy-800" />
          <X v-else class="h-5 w-5 text-navy-800" />
          <span class="sr-only">Toggle menu</span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden border-t border-navy-100 bg-white"
    >
      <div class="px-4 py-4 space-y-1">
        <!-- Mobile Search -->
        <div class="relative mb-4">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-navy-200 text-sm focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-200 bg-white"
            @keydown.enter="handleSearch"
          />
        </div>

        <router-link
          to="/"
          @click="closeMobileMenu"
          class="mobile-nav-link"
          exact-active-class="mobile-nav-active"
        >
          Home
        </router-link>

        <router-link
          to="/research"
          @click="closeMobileMenu(); clearResearchFilters()"
          class="mobile-nav-link"
          :class="{ 'mobile-nav-active': isResearchPage }"
        >
          Research
        </router-link>

        <router-link
          to="/events"
          @click="closeMobileMenu"
          class="mobile-nav-link"
          exact-active-class="mobile-nav-active"
        >
          Events
        </router-link>

        <router-link
          to="/competition"
          @click="closeMobileMenu"
          class="mobile-nav-link"
          exact-active-class="mobile-nav-active"
        >
          Competition
        </router-link>

        <router-link
          to="/about"
          @click="closeMobileMenu"
          class="mobile-nav-link"
          exact-active-class="mobile-nav-active"
        >
          About
        </router-link>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, X, Search } from 'lucide-vue-next'
import { useDeals } from '@/composables/useDeals'

const route = useRoute()
const router = useRouter()
const { selectedTypes, query: dealsQuery } = useDeals()

const isMobileMenuOpen = ref(false)
const searchQuery = ref('')

const isResearchPage = computed(() => route.path === '/research')

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function clearResearchFilters() {
  selectedTypes.value = new Set()
  dealsQuery.value = ''
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    clearResearchFilters()
    dealsQuery.value = searchQuery.value.trim()
    router.push({ path: '/research' })
    closeMobileMenu()
  }
}
</script>

<style scoped>
.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--navy-600);
  text-decoration: none;
  border-radius: 0.375rem;
  transition: color 150ms ease, background-color 150ms ease;
  position: relative;
}

.nav-link:hover {
  color: var(--navy-900);
  background-color: var(--navy-50);
}

.nav-link.nav-active {
  color: var(--navy-900);
}

.nav-link.nav-active::after {
  content: "";
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.25rem;
  height: 2px;
  background-color: var(--navy-800);
  border-radius: 1px;
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--navy-600);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: color 150ms ease, background-color 150ms ease;
}

.mobile-nav-link:hover {
  color: var(--navy-900);
  background-color: var(--navy-50);
}

.mobile-nav-link.mobile-nav-active {
  color: var(--navy-900);
  background-color: var(--navy-100);
}

.dropdown-link {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--navy-600);
  text-decoration: none;
  transition: color 150ms ease, background-color 150ms ease;
}

.dropdown-link:hover {
  color: var(--navy-900);
  background-color: var(--navy-50);
}
</style>
