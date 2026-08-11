<script setup lang="ts">
import type { About } from '~/composables/useAbout'

defineProps<{
  about: About | null
}>()
</script>

<template>
  <section aria-label="About" class="section border-b border-neutral-200">
    <div class="page-container grid gap-8 md:grid-cols-[200px_1fr]">
      <h2 class="section-heading">
        Sobre mí
      </h2>
      <div>
        <p class="max-w-2xl text-lg leading-relaxed text-neutral-700">
          {{ about?.bio }}
        </p>
        <p v-if="about?.location" class="mt-4 text-sm text-neutral-500">
          {{ about.location }}
        </p>
      </div>
    </div>
  </section>
</template>
