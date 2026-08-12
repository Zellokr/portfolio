<script setup lang="ts">
import { ref } from "vue";
import type { About } from "~/composables/useAbout";
import WindowChrome from "~/components/WindowChrome/WindowChrome.vue";
import TerminalApp from "~/components/terminal/TerminalApp.client.vue";
import ChatApp from "~/components/chat/ChatApp.client.vue";
import TerminalSkeleton from "~/components/terminal/TerminalSkeleton.vue";
import HeroTextSkeleton from "./HeroTextSkeleton.vue";
import type { ProjectRef } from "~/utils/terminal/types";

defineProps<{
  about: About | null;
  projects: ProjectRef[];
  pending?: boolean;
}>();

const mode = ref<"terminal" | "chat">("terminal");
</script>

<template>
  <section
    id="top"
    aria-label="Hero"
    class="relative flex min-h-svh items-center overflow-hidden border-b border-slate-800 py-24 md:py-28"
  >
    <div class="hero-glow" />
    <div
      class="page-container grid items-center gap-12 lg:grid-cols-2 lg:gap-24"
    >
      <HeroTextSkeleton v-if="pending" />
      <div v-else>
        <p class="text-lg font-semibold text-accent">👋 ¡Hola! Soy</p>
        <h1
          class="mt-4 text-5xl font-black tracking-tight text-white md:text-7xl"
        >
          {{ about?.name }}
        </h1>
        <p
          v-if="about?.bio"
          class="mt-4 max-w-xl text-base leading-relaxed text-slate-400"
        >
          {{ about.bio }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
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
      </div>
      <div>
        <div
          class="mb-3 inline-flex rounded-lg border border-slate-800 bg-slate-900/60 p-1 text-xs font-medium"
        >
          <button
            type="button"
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
</style>
