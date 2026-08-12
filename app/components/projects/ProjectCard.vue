<script setup lang="ts">
import { onMounted, ref } from "vue";

defineProps<{
  title: string;
  summary: string;
  stack: string[];
  url: string;
  image?: string;
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
    class="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-colors duration-200 hover:border-accent"
  >
    <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="block h-72 overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-800 to-slate-950"
    >
      <img
        v-if="image && !imageFailed"
        ref="imageEl"
        :src="image"
        :alt="`Captura de ${title}`"
        class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        @error="imageFailed = true"
      >
      <span
        v-else
        class="flex h-full items-center justify-center text-4xl font-black text-slate-700 transition-colors duration-200 group-hover:text-accent"
        aria-hidden="true"
      >
        {{ title.slice(0, 2).toUpperCase() }}
      </span>
    </a>
    <div class="flex flex-1 flex-col justify-between p-6">
      <div>
        <h3 class="text-xl font-bold tracking-tight text-white">
          <a
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors duration-200 group-hover:text-accent"
          >
            {{ title }}
          </a>
        </h3>
        <p class="mt-2 text-slate-400">
          {{ summary }}
        </p>
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        <span v-for="tech in stack" :key="tech" class="pill">
          {{ tech }}
        </span>
      </div>
    </div>
  </article>
</template>
