<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue";
</script>

<template>
  <article
    class="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50"
    data-testid="project-card-skeleton"
  >
    <Skeleton class="aspect-video w-full rounded-none" />
    <div class="flex flex-1 flex-col justify-between p-6">
      <div>
        <Skeleton class="h-6 w-2/3" />
        <Skeleton class="mt-3 h-4 w-full" />
        <Skeleton class="mt-2 h-4 w-5/6" />
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        <Skeleton class="h-6 w-16 rounded-full" />
        <Skeleton class="h-6 w-20 rounded-full" />
        <Skeleton class="h-6 w-14 rounded-full" />
      </div>
    </div>
  </article>
</template>
