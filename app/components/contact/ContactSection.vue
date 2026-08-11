<script setup lang="ts">
import type { About } from '~/composables/useAbout'

defineProps<{
  about: About | null
}>()
</script>

<template>
  <section id="contacto" aria-label="Contact" class="section bg-slate-900">
    <div class="page-container">
      <p class="eyebrow">¿Hablamos?</p>
      <h2 class="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
        Contacto
      </h2>
      <p v-if="about?.email" class="mt-4">
        <a :href="`mailto:${about.email}`" class="link-accent text-lg">{{ about.email }}</a>
      </p>
      <ul v-if="about?.socials?.length" class="mt-6 flex flex-wrap gap-3">
        <li v-for="social in about.socials" :key="social.url">
          <a
            :href="social.url"
            class="pill hover:border-accent hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ social.label }}
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
