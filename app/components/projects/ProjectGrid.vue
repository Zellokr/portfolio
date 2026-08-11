<script setup lang="ts">
import type { Project } from '~/composables/useProjects'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  projects: Project[]
}>()
</script>

<template>
  <section id="proyectos" aria-label="Projects" class="section border-b border-slate-800">
    <div class="page-container">
      <p class="eyebrow">Trabajo seleccionado</p>
      <h2 class="mt-2 section-heading">
        Proyectos
      </h2>
      <div class="mt-8 grid gap-6 md:grid-cols-2">
        <ProjectCard
          v-for="project in projects"
          :key="project.slug"
          :title="project.title"
          :summary="project.summary"
          :stack="project.stack"
          :url="project.url"
          :slug="project.slug"
        />
      </div>
    </div>
  </section>
</template>
