<script setup lang="ts">
import type { About } from '~/composables/useAbout'

defineProps<{
  about: About | null
}>()
</script>

<template>
  <section aria-label="About" class="px-6 py-12">
    <h2 class="text-2xl font-semibold">
      About
    </h2>
    <p class="mt-4 text-gray-700">
      {{ about?.bio }}
    </p>
    <p v-if="about?.location" class="mt-2 text-sm text-gray-500">
      {{ about.location }}
    </p>
  </section>
</template>
