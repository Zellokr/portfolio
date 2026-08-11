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
    class="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-colors duration-200 hover:border-accent"
  >
    <NuxtLink
      :to="`/projects/${slug}`"
      class="flex h-40 items-center justify-center border-b border-slate-800 bg-gradient-to-br from-slate-800 to-slate-950"
    >
      <span
        class="text-4xl font-black text-slate-700 transition-colors duration-200 group-hover:text-accent"
        aria-hidden="true"
      >
        {{ title.slice(0, 2).toUpperCase() }}
      </span>
    </NuxtLink>
    <div class="flex flex-1 flex-col justify-between p-6">
      <div>
        <h3 class="text-xl font-bold tracking-tight text-white">
          <NuxtLink
            :to="`/projects/${slug}`"
            class="transition-colors duration-200 group-hover:text-accent"
          >
            {{ title }}
          </NuxtLink>
        </h3>
        <p class="mt-2 text-slate-400">
          {{ summary }}
        </p>
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        <span v-for="tech in stack" :key="tech" class="pill">
          {{ tech }}
        </span>
      </div>
    </div>
  </article>
</template>
