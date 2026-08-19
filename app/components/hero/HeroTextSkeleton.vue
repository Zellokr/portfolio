<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue";
</script>

<template>
  <div data-testid="hero-text-skeleton">
    <Skeleton class="h-4 w-28" />
    <Skeleton class="mt-3 h-12 w-64 md:h-16 md:w-96" />
    <div class="mt-5 flex flex-wrap gap-2">
      <Skeleton class="h-6 w-24 rounded-full" />
      <Skeleton class="h-6 w-28 rounded-full" />
      <Skeleton class="h-6 w-20 rounded-full" />
    </div>
    <Skeleton class="mt-5 h-5 w-full max-w-xl" />
    <div class="mt-8 flex flex-wrap gap-3">
      <Skeleton class="h-9 w-28 rounded-md" />
      <Skeleton class="h-9 w-36 rounded-full" />
    </div>
    <Skeleton class="mt-6 h-4 w-32" />
  </div>
</template>
