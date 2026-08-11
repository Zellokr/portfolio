<script setup lang="ts">
import type { About } from '~/composables/useAbout'

defineProps<{
  about: About | null
}>()
</script>

<template>
  <section aria-label="Contact" class="px-6 py-12">
    <h2 class="text-2xl font-semibold">
      Contact
    </h2>
    <p class="mt-4">
      {{ about?.email }}
    </p>
    <ul v-if="about?.socials?.length" class="mt-4 flex flex-wrap gap-4">
      <li v-for="social in about.socials" :key="social.url">
        <a :href="social.url" class="text-blue-600 hover:underline">{{ social.label }}</a>
      </li>
    </ul>
  </section>
</template>
