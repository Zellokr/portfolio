<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue";
</script>

<template>
  <div class="mt-10 grid gap-12 md:grid-cols-2" data-testid="timeline-skeleton">
    <div v-for="column in 2" :key="column">
      <ul class="mt-6">
        <li
          v-for="item in 3"
          :key="item"
          class="relative border-l border-slate-800 py-1 pb-8 pl-6 last:border-transparent last:pb-0"
        >
          <span class="absolute top-2 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-slate-700" />
          <Skeleton class="h-3 w-24" />
          <Skeleton class="mt-2 h-4 w-40" />
          <Skeleton class="mt-2 h-3 w-32" />
        </li>
      </ul>
    </div>
  </div>
</template>
