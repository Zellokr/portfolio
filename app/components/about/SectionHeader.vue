<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <header class="reveal">
    <div class="inline-block">
      <h2 class="section-heading">{{ title }}</h2>
      <div class="mt-4 h-px w-full bg-accent/40" aria-hidden="true" />
    </div>
    <p v-if="description" class="mt-5 max-w-2xl text-slate-400">
      {{ description }}
    </p>
  </header>
</template>
