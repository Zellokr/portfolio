<script setup lang="ts">
import TechGrid from './TechGrid.vue'
import TechGridSkeleton from './TechGridSkeleton.vue'
import SectionHeader from './SectionHeader.vue'
import type { Technology } from '~/composables/useTechnologies'

defineProps<{
  technologies: Technology[]
  pending?: boolean
}>()
</script>

<template>
  <section id="tecnologias" aria-label="Technologies" class="section border-b border-slate-800">
    <div class="page-container">
      <SectionHeader title="Tecnologías" />
      <TechGridSkeleton v-if="pending" />
      <TechGrid v-else :technologies="technologies" />
    </div>
  </section>
</template>
