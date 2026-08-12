<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue";

withDefaults(
  defineProps<{
    count?: number;
  }>(),
  { count: 8 },
);
</script>

<template>
  <div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="tech-grid-skeleton">
    <div
      v-for="n in count"
      :key="n"
      class="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
    >
      <Skeleton class="h-12 w-12 rounded-full" />
      <Skeleton class="h-4 w-16" />
    </div>
  </div>
</template>
