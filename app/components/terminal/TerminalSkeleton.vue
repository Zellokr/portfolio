<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue";
</script>

<template>
  <div class="flex h-[26rem] flex-col gap-3 bg-gray-950 p-4 font-mono text-sm" data-testid="terminal-skeleton">
    <Skeleton class="h-4 w-3/4 bg-gray-800" />
    <Skeleton class="h-4 w-1/2 bg-gray-800" />
    <Skeleton class="h-4 w-5/6 bg-gray-800" />
    <Skeleton class="h-4 w-2/3 bg-gray-800" />
  </div>
</template>
