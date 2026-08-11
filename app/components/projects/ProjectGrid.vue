<script setup lang="ts">
import type { Project } from '~/composables/useProjects'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  projects: Project[]
}>()
</script>

<template>
  <section id="proyectos" aria-label="Projects" class="section border-b border-neutral-200">
    <div class="page-container">
      <h2 class="section-heading">
        Proyectos
      </h2>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.slug"
          :title="project.title"
          :summary="project.summary"
          :stack="project.stack"
          :url="project.url"
          :slug="project.slug"
          :class="index === 0 ? 'md:col-span-2' : 'md:col-span-1'"
        />
      </div>
    </div>
  </section>
</template>
