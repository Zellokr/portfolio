<script setup lang="ts">
import type { About } from '~/composables/useAbout'

defineProps<{
  about: About | null
}>()
</script>

<template>
  <section
    id="top"
    aria-label="Hero"
    class="relative flex min-h-dvh items-center overflow-hidden border-b border-slate-800"
  >
    <div class="hero-glow" />
    <div class="page-container">
      <p class="eyebrow">Disponible para nuevos proyectos</p>
      <h1 class="mt-4 max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl">
        {{ about?.name }}
      </h1>
      <p class="mt-4 max-w-xl text-xl text-slate-400 md:text-2xl">
        {{ about?.headline }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a v-if="about?.email" :href="`mailto:${about.email}`" class="btn-accent">
          Escríbeme
        </a>
        <a href="#proyectos" class="pill hover:border-accent hover:text-accent">
          Ver proyectos
        </a>
      </div>
    </div>
  </section>
</template>
