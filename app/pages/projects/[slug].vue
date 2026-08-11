<script setup lang="ts">
import { useProject } from '~/composables/useProjects'

const route = useRoute()
const slug = route.params.slug as string

const { data: project } = await useAsyncData(`project-${slug}`, () => useProject(slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useSeoMeta({
  title: () => project.value?.title,
  description: () => project.value?.summary
})
</script>

<template>
  <article v-if="project" class="mx-auto max-w-2xl px-6 py-16">
    <h1 class="text-3xl font-bold">
      {{ project.title }}
    </h1>
    <p class="mt-4 text-gray-700">
      {{ project.description }}
    </p>
    <ul class="mt-4 flex flex-wrap gap-2">
      <li
        v-for="tech in project.stack"
        :key="tech"
        class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
      >
        {{ tech }}
      </li>
    </ul>
    <div class="mt-6 flex gap-4">
      <a :href="project.url" class="text-blue-600 hover:underline">{{ project.url }}</a>
      <a v-if="project.repo" :href="project.repo" class="text-blue-600 hover:underline">{{ project.repo }}</a>
    </div>
    <ContentRenderer :value="project" class="prose mt-8" />
  </article>
</template>
