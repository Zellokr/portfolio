<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue";
</script>

<template>
  <div
    class="mt-6 flex flex-col items-center gap-10 md:flex-row md:items-center"
    data-testid="about-section-skeleton"
  >
    <Skeleton class="h-40 w-40 shrink-0 rounded-full sm:h-48 sm:w-48" />
    <div class="w-full max-w-2xl">
      <Skeleton class="h-9 w-64 md:h-12" />
      <div class="mt-4 flex flex-wrap gap-2">
        <Skeleton class="h-6 w-24 rounded-full" />
        <Skeleton class="h-6 w-28 rounded-full" />
        <Skeleton class="h-6 w-20 rounded-full" />
      </div>
      <Skeleton class="mt-6 h-4 w-full" />
      <Skeleton class="mt-2 h-4 w-full" />
      <Skeleton class="mt-2 h-4 w-2/3" />
    </div>
  </div>
</template>
