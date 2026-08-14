<script setup lang="ts">
import { onMounted, ref } from "vue";

defineProps<{
  title: string;
  summary: string;
  stack: string[];
  url: string;
  slug: string;
  image?: string;
  priority?: boolean;
}>();

const imageFailed = ref(false);
const imageEl = ref<HTMLImageElement | null>(null);

// SSR sends the <img> already in the DOM, so a broken image can finish
// erroring out (natural size 0) before Vue hydrates and attaches the
// `@error` listener — that error event is missed since it doesn't
// bubble. Checking `complete`/`naturalWidth` once on mount catches that
// already-failed-before-hydration case; `@error` still covers later ones.
onMounted(() => {
  if (imageEl.value?.complete && imageEl.value.naturalWidth === 0) {
    imageFailed.value = true;
  }
});
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-colors duration-200 hover:border-accent"
  >
    <NuxtLink
      :to="`/proyectos/${slug}`"
      class="absolute inset-0 z-0"
      :aria-label="`Ver detalles de ${title}`"
    />
    <div
      class="block aspect-video overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-800 to-slate-950"
    >
      <img
        v-if="image && !imageFailed"
        ref="imageEl"
        :src="image"
        :alt="`Captura de ${title}`"
        :loading="priority ? undefined : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined"
        class="h-full w-full object-cover object-top transition-transform duration-300"
        @error="imageFailed = true"
      >
      <span
        v-else
        class="flex h-full items-center justify-center text-4xl font-black text-slate-700 transition-colors duration-200 group-hover:text-accent"
        aria-hidden="true"
      >
        {{ title.slice(0, 2).toUpperCase() }}
      </span>
    </div>
    <div class="flex flex-1 flex-col justify-between p-6">
      <div>
        <h3 class="text-xl font-bold tracking-tight text-white">
          <a
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="relative z-10 transition-colors duration-200 group-hover:text-accent"
          >
            {{ title }}
          </a>
        </h3>
        <p class="mt-2 text-slate-400">
          {{ summary }}
        </p>
      </div>
      <div class="mt-6 flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap gap-2">
          <span v-for="tech in stack" :key="tech" class="pill">
            {{ tech }}
          </span>
        </div>
        <NuxtLink
          :to="`/proyectos/${slug}`"
          class="link-accent relative z-10 ml-auto shrink-0 text-sm font-semibold"
        >
          Ver detalles →
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
