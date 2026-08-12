<script setup lang="ts">
import TechGrid from './TechGrid.vue'
import TechGridSkeleton from './TechGridSkeleton.vue'
import type { Technology } from '~/composables/useTechnologies'

defineProps<{
  technologies: Technology[]
  pending?: boolean
}>()
</script>

<template>
  <section id="tecnologias" aria-label="Technologies" class="section border-b border-slate-800">
    <div class="page-container">
      <h2 class="section-heading">Tecnologías</h2>
      <TechGridSkeleton v-if="pending" />
      <TechGrid v-else :technologies="technologies" />
    </div>
  </section>
</template>
