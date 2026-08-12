<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue";
</script>

<template>
  <div
    class="flex h-[26rem] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50"
    data-testid="car-viewer-skeleton"
  >
    <Skeleton class="h-24 w-40 rounded-xl" />
    <p class="text-sm text-slate-500">Cargando modelo 3D…</p>
  </div>
</template>
