<script setup lang="ts">
defineProps<{
  name: string;
  icon: string;
  description: string;
}>();
</script>

<template>
  <div
    class="card group flex flex-col items-center gap-3 p-6 text-center motion-safe:hover:-translate-y-1"
  >
    <span class="text-4xl" aria-hidden="true">{{ icon }}</span>
    <span class="text-sm font-semibold text-white">{{ name }}</span>
    <p class="text-sm text-slate-400">{{ description }}</p>
  </div>
</template>
