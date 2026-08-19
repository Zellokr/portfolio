<script setup lang="ts">
interface TechGridItem {
  name: string
  icon: string
  url: string
}

defineProps<{
  technologies: TechGridItem[]
}>()
</script>

<template>
  <div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
    <a
      v-for="tech in technologies"
      :key="tech.name"
      :href="tech.url"
      target="_blank"
      rel="noopener noreferrer"
      class="card group flex flex-col items-center gap-3 p-6 motion-safe:hover:-translate-y-1"
    >
      <img
        :src="tech.icon"
        :alt="tech.name"
        loading="lazy"
        class="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
      >
      <span class="text-sm font-medium text-slate-300">{{ tech.name }}</span>
    </a>
  </div>
</template>
