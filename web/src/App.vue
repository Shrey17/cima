<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-background">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* App styles */
</style>
