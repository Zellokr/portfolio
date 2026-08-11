<script setup lang="ts">
import type { About } from '~/composables/useAbout'

defineProps<{
  about: About | null
}>()
</script>

<template>
  <section aria-label="Contact" class="section bg-neutral-950 text-white">
    <div class="page-container">
      <h2 class="text-2xl font-semibold tracking-tight md:text-3xl">
        Hablemos
      </h2>
      <p v-if="about?.email" class="mt-4">
        <a :href="`mailto:${about.email}`" class="link-accent">{{ about.email }}</a>
      </p>
      <ul v-if="about?.socials?.length" class="mt-6 flex flex-wrap gap-3">
        <li v-for="social in about.socials" :key="social.url">
          <a
            :href="social.url"
            class="pill border-neutral-700 text-neutral-200 hover:border-accent hover:text-accent"
          >
            {{ social.label }}
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
