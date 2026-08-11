<script setup lang="ts">
defineProps<{
  title: string
  summary: string
  stack: string[]
  url: string
  slug: string
}>()
</script>

<template>
  <article class="rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-semibold">
      <NuxtLink :to="`/projects/${slug}`" class="hover:underline">
        {{ title }}
      </NuxtLink>
    </h3>
    <p class="mt-2 text-gray-600">
      {{ summary }}
    </p>
    <ul class="mt-4 flex flex-wrap gap-2">
      <li
        v-for="tech in stack"
        :key="tech"
        class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
      >
        {{ tech }}
      </li>
    </ul>
  </article>
</template>
