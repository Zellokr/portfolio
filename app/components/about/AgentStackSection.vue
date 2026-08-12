<script setup lang="ts">
import TechGrid from './TechGrid.vue'
import type { Agent } from '~/composables/useAgents'

defineProps<{
  agents: Agent[]
}>()
</script>

<template>
  <section id="agentes-ia" aria-label="AI agents" class="section border-b border-slate-800">
    <div class="page-container">
      <h2 class="section-heading">Agentes de IA</h2>
      <TechGrid :technologies="agents" />
    </div>
  </section>
</template>
