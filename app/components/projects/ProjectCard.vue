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
  <article
    class="group flex flex-col justify-between rounded-2xl border border-neutral-200 p-8 transition-colors duration-200 hover:border-accent"
  >
    <div>
      <h3 class="text-2xl font-semibold tracking-tight text-neutral-950">
        <NuxtLink
          :to="`/projects/${slug}`"
          class="transition-colors duration-200 group-hover:text-accent"
        >
          {{ title }}
        </NuxtLink>
      </h3>
      <p class="mt-3 text-neutral-600">
        {{ summary }}
      </p>
    </div>
    <div class="mt-6 flex flex-wrap gap-2">
      <span v-for="tech in stack" :key="tech" class="pill">
        {{ tech }}
      </span>
    </div>
  </article>
</template>
