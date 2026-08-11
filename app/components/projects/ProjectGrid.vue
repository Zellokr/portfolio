<script setup lang="ts">
import type { Project } from '~/composables/useProjects'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  projects: Project[]
}>()
</script>

<template>
  <section aria-label="Projects" class="px-6 py-12">
    <h2 class="text-2xl font-semibold">
      Projects
    </h2>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
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
  </section>
</template>
