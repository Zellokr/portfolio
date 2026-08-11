<script setup lang="ts">
import type { About } from '~/composables/useAbout'

defineProps<{
  about: About | null
}>()
</script>

<template>
  <section aria-label="Hero" class="px-6 py-16 text-center">
    <h1 class="text-4xl font-bold tracking-tight">
      {{ about?.name }}
    </h1>
    <p class="mt-4 text-xl text-gray-600">
      {{ about?.headline }}
    </p>
  </section>
</template>
