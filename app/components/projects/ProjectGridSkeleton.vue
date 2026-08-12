<script setup lang="ts">
import ProjectCardSkeleton from "./ProjectCardSkeleton.vue";

withDefaults(
  defineProps<{
    count?: number;
  }>(),
  { count: 4 },
);
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2" data-testid="project-grid-skeleton">
    <ProjectCardSkeleton v-for="n in count" :key="n" />
  </div>
</template>
