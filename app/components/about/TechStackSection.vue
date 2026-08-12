<script setup lang="ts">
import TechGrid from './TechGrid.vue'
import type { Technology } from '~/composables/useTechnologies'

defineProps<{
  technologies: Technology[]
}>()
</script>

<template>
  <section id="tecnologias" aria-label="Technologies" class="section border-b border-slate-800">
    <div class="page-container">
      <h2 class="section-heading">Tecnologías</h2>
      <TechGrid :technologies="technologies" />
    </div>
  </section>
</template>
