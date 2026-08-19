<script setup lang="ts">
import { computed, ref } from "vue";
import type { About } from "~/composables/useAbout";
import WindowChrome from "~/components/WindowChrome/WindowChrome.vue";
import GeoBackdrop from "~/components/ui/GeoBackdrop.vue";
import TerminalApp from "~/components/terminal/TerminalApp.client.vue";
import ChatApp from "~/components/chat/ChatApp.client.vue";
import TerminalSkeleton from "~/components/terminal/TerminalSkeleton.vue";
import HeroTextSkeleton from "./HeroTextSkeleton.vue";
import type { ProjectRef } from "~/utils/terminal/types";

const props = defineProps<{
  about: About | null;
  projects: ProjectRef[];
  pending?: boolean;
}>();

const mode = ref<"terminal" | "chat">("terminal");

// The headline is authored as a pipe-separated list of roles/stacks.
// Surface each segment as a compact monospace tag instead of one long line.
const roleTags = computed(() =>
  (props.about?.headline ?? "")
    .split("|")
    .map((segment) => segment.trim())
    .filter(Boolean),
);
</script>

<template>
  <section
    id="top"
    aria-label="Hero"
    class="relative flex min-h-svh items-center overflow-hidden border-b border-slate-800 py-24 md:py-28"
  >
    <GeoBackdrop axis />

    <div
      class="page-container relative grid w-full items-center gap-y-12 gap-x-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-x-16"
    >
      <HeroTextSkeleton v-if="pending" class="lg:-mt-10" />
      <div v-else class="hero-intro lg:-mt-10">
        <p class="hero-intro-item text-sm font-semibold tracking-wide text-accent">
          <span aria-hidden="true">👋</span> ¡Hola! Soy
        </p>
        <!-- No entrance animation on the LCP element: keeping it at opacity 1
             from first paint avoids delaying Largest Contentful Paint. -->
        <h1
          class="mt-3 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl"
        >
          {{ about?.name }}
        </h1>
        <ul
          v-if="roleTags.length"
          class="hero-intro-item mt-5 flex flex-wrap gap-2"
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
        <p
          v-if="about?.bio"
          class="hero-intro-item mt-5 max-w-xl text-base leading-relaxed text-slate-400"
        >
          {{ about.bio }}
        </p>
        <div class="hero-intro-item mt-8 flex flex-wrap gap-3">
          <a
            v-if="about?.email"
            :href="`mailto:${about.email}`"
            class="btn-accent"
          >
            Escríbeme
          </a>
          <a
            href="/cv.pdf"
            download="Kristian-Martinez-CV.pdf"
            class="pill gap-1.5 hover:border-accent hover:text-accent"
          >
            <svg
              viewBox="0 0 20 20"
              class="h-3.5 w-3.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M10 12.5a.75.75 0 0 1-.53-.22l-3.5-3.5a.75.75 0 1 1 1.06-1.06L9.25 9.94V2.75a.75.75 0 0 1 1.5 0v7.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-.53.22Z"
              />
              <path
                d="M3.5 12.75a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h10a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 15 17.5H5a2.25 2.25 0 0 1-2.25-2.25v-1.5a.75.75 0 0 1 .75-.75Z"
              />
            </svg>
            Descargar CV
          </a>
        </div>
        <p
          v-if="about?.location"
          class="hero-intro-item mt-6 flex items-center gap-1.5 text-sm text-slate-500"
        >
          <svg
            viewBox="0 0 20 20"
            class="h-4 w-4 text-accent"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a5.5 5.5 0 0 0-5.5 5.5c0 3.6 4.35 8.34 5.02 9.05a.66.66 0 0 0 .96 0c.67-.71 5.02-5.45 5.02-9.05A5.5 5.5 0 0 0 10 2Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
              clip-rule="evenodd"
            />
          </svg>
          {{ about.location }}
        </p>
      </div>
      <div class="hero-panel min-w-0 lg:mt-16">
        <div
          class="mb-3 inline-flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1 text-xs font-medium"
          role="group"
          aria-label="Modo de interacción"
        >
          <button
            type="button"
            :aria-pressed="mode === 'terminal'"
            class="rounded-md px-3 py-1.5 transition-colors duration-200"
            :class="
              mode === 'terminal'
                ? 'bg-accent text-slate-950'
                : 'text-slate-400 hover:text-white'
            "
            @click="mode = 'terminal'"
          >
            Terminal
          </button>
          <button
            type="button"
            :aria-pressed="mode === 'chat'"
            class="rounded-md px-3 py-1.5 transition-colors duration-200"
            :class="
              mode === 'chat'
                ? 'bg-accent text-slate-950'
                : 'text-slate-400 hover:text-white'
            "
            @click="mode = 'chat'"
          >
            Chat IA
          </button>
        </div>
        <WindowChrome
          :title="
            mode === 'terminal' ? 'terminal — portfolio' : 'chat — portfolio'
          "
          variant="terminal"
        >
          <ClientOnly>
            <Transition name="mode-fade" mode="out-in">
              <TerminalApp v-if="mode === 'terminal'" :projects="projects" />
              <ChatApp v-else />
            </Transition>
            <template #fallback>
              <TerminalSkeleton />
            </template>
          </ClientOnly>
        </WindowChrome>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.2s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}

/* Staged entrance for the intro block: animate transform + opacity only. */
.hero-intro-item {
  opacity: 0;
  animation: hero-rise 0.5s ease forwards;
}

.hero-intro-item:nth-child(1) {
  animation-delay: 0.05s;
}
.hero-intro-item:nth-child(2) {
  animation-delay: 0.12s;
}
.hero-intro-item:nth-child(3) {
  animation-delay: 0.19s;
}
.hero-intro-item:nth-child(4) {
  animation-delay: 0.26s;
}
.hero-intro-item:nth-child(5) {
  animation-delay: 0.33s;
}
.hero-intro-item:nth-child(6) {
  animation-delay: 0.4s;
}

.hero-panel {
  opacity: 0;
  animation: hero-rise 0.5s ease 0.2s forwards;
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-intro-item,
  .hero-panel {
    animation: none;
    opacity: 1;
  }
}
</style>
