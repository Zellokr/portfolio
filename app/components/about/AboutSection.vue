<script setup lang="ts">
import { computed } from "vue";
import type { About } from "~/composables/useAbout";
import AboutSectionSkeleton from "./AboutSectionSkeleton.vue";

const props = defineProps<{
  about: About | null;
  pending?: boolean;
}>();

// Mirror the hero: render the pipe-separated headline as compact monospace tags.
const roleTags = computed(() =>
  (props.about?.headline ?? "")
    .split("|")
    .map((segment) => segment.trim())
    .filter(Boolean),
);
</script>

<template>
  <section
    id="sobre-mi"
    aria-label="About"
    class="section relative overflow-hidden border-b border-slate-800"
  >
    <div class="hero-glow" />
    <div class="page-container">
      <p class="eyebrow">Sobre mí</p>
      <AboutSectionSkeleton v-if="pending" />
      <div
        v-else
        class="mt-6 flex flex-col items-center gap-10 text-center md:flex-row md:items-center md:text-left"
      >
        <div class="relative shrink-0">
          <span
            class="pointer-events-none absolute -inset-3 -z-10 rounded-full border border-accent/20"
            aria-hidden="true"
          />
          <span
            class="pointer-events-none absolute -right-2 -bottom-2 h-16 w-16 rounded-full border border-accent/25"
            aria-hidden="true"
          />
          <img
            src="/images/yo.webp"
            :alt="about?.name ? `Foto de ${about.name}` : 'Foto de perfil'"
            fetchpriority="high"
            class="h-40 w-40 rounded-full border-2 border-accent/30 object-cover transition-transform duration-300 hover:scale-105 sm:h-48 sm:w-48"
          >
        </div>
        <div>
          <h1 class="text-3xl font-black tracking-tight text-white md:text-5xl">
            {{ about?.name }}
          </h1>
          <ul
            v-if="roleTags.length"
            class="mt-4 flex flex-wrap justify-center gap-2 md:justify-start"
            aria-label="Roles y stack"
          >
            <li
              v-for="tag in roleTags"
              :key="tag"
              class="pill font-mono text-[11px] tracking-tight"
            >
              {{ tag }}
            </li>
          </ul>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            {{ about?.bio }}
          </p>
          <p v-if="about?.location" class="pill mt-6 gap-1.5">
            <svg
              viewBox="0 0 20 20"
              class="h-3.5 w-3.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9.69 18.933a.75.75 0 0 0 .62 0c.098-.044 1.958-.933 3.86-2.541C16.94 14.83 18.75 12.396 18.75 9.5 18.75 5.358 15.642 2 10 2S1.25 5.358 1.25 9.5c0 2.896 1.81 5.33 4.58 6.892 1.902 1.608 3.762 2.497 3.86 2.541ZM10 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                clip-rule="evenodd"
              />
            </svg>
            {{ about.location }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
