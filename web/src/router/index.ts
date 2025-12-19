import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Research from '@/components/Research.vue'
import Events from '@/components/Events.vue'
import Competition from '@/components/Competition.vue'
import About from '@/components/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/research',
    name: 'Research',
    component: Research
  },
  {
    path: '/resources',
    redirect: { name: 'Research' },
  },
  {
    path: '/deal-flashes',
    redirect: { name: 'Research', query: { type: 'flash' } },
  },
  {
    path: '/deal-reports',
    redirect: { name: 'Research', query: { type: 'report' } },
  },
  {
    path: '/fundamentals',
    redirect: { name: 'Research', query: { type: 'fundamentals' } },
  },
  {
    path: '/contact',
    redirect: { name: 'About', hash: '#contact' },
  },
  {
    path: '/events',
    name: 'Events',
    component: Events
  },
  {
    path: '/competition',
    name: 'Competition',
    component: Competition
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
