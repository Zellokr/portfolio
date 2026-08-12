<script setup lang="ts">
defineProps<{
  name: string;
  icon: string;
  description: string;
}>();
</script>

<template>
  <div
    class="group flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center transition-colors duration-200 hover:border-accent"
  >
    <span class="text-4xl" aria-hidden="true">{{ icon }}</span>
    <span class="text-sm font-semibold text-white">{{ name }}</span>
    <p class="text-sm text-slate-400">{{ description }}</p>
  </div>
</template>
