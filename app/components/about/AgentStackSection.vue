<script setup lang="ts">
import TechGrid from './TechGrid.vue'
import TechGridSkeleton from './TechGridSkeleton.vue'
import SectionHeader from './SectionHeader.vue'
import type { Agent } from '~/composables/useAgents'

defineProps<{
  agents: Agent[]
  pending?: boolean
}>()
</script>

<template>
  <section id="agentes-ia" aria-label="AI agents" class="section border-b border-slate-800">
    <div class="page-container">
      <SectionHeader title="Agentes de IA" />
      <TechGridSkeleton v-if="pending" />
      <TechGrid v-else :technologies="agents" />
    </div>
  </section>
</template>
