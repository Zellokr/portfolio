<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineEntry } from '~/composables/useTimeline'
import TimelineSkeleton from './TimelineSkeleton.vue'

const props = defineProps<{
  entries: TimelineEntry[]
  pending?: boolean
}>()

const experience = computed(() => props.entries.filter(entry => entry.category === 'experience'))
const education = computed(() => props.entries.filter(entry => entry.category === 'education'))
</script>

<template>
  <section id="trayectoria" aria-label="Timeline" class="section border-b border-slate-800">
    <div class="page-container">
      <h2 class="section-heading">Trayectoria</h2>
      <TimelineSkeleton v-if="pending" />
      <div v-else class="mt-10 grid gap-12 md:grid-cols-2">
        <div>
          <p class="eyebrow flex items-center gap-2">
            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <rect x="2.5" y="6.5" width="15" height="10" rx="1.5" />
              <path d="M7 6.5V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
              <path d="M2.5 11h15" />
            </svg>
            Experiencia
          </p>
          <ul class="mt-6">
            <li
              v-for="entry in experience"
              :key="entry.title"
              class="group relative border-l border-slate-800 py-1 pb-8 pl-6 transition-colors duration-200 last:border-transparent last:pb-0"
            >
              <span class="absolute top-2 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-accent shadow-[0_0_12px_-1px_var(--color-accent)] transition-transform duration-200 group-hover:scale-110" />
              <p class="text-xs font-medium text-slate-500">{{ entry.period }}</p>
              <a
                v-if="entry.url"
                :href="entry.url"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-1 inline-flex items-center gap-1.5 font-semibold text-white underline-offset-2 transition-colors duration-200 hover:underline group-hover:text-accent"
              >
                {{ entry.title }}
                <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M8 5H5.5A1.5 1.5 0 0 0 4 6.5v8A1.5 1.5 0 0 0 5.5 16h8a1.5 1.5 0 0 0 1.5-1.5V12" />
                  <path d="M11 4h5v5" />
                  <path d="M16 4 9 11" />
                </svg>
              </a>
              <p v-else class="mt-1 font-semibold text-white transition-colors duration-200 group-hover:text-accent">{{ entry.title }}</p>
              <p class="text-sm text-slate-400">{{ entry.organization }}</p>
              <p v-if="entry.description" class="mt-2 text-sm leading-relaxed text-slate-400">{{ entry.description }}</p>
            </li>
          </ul>
        </div>
        <div>
          <p class="eyebrow flex items-center gap-2">
            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">
              <path d="M10 3 2 7l8 4 8-4-8-4Z" />
              <path d="M5 9v4c0 1.105 2.239 2 5 2s5-.895 5-2V9" />
            </svg>
            Formación
          </p>
          <ul class="mt-6">
            <li
              v-for="entry in education"
              :key="entry.title"
              class="group relative border-l border-slate-800 py-1 pb-8 pl-6 transition-colors duration-200 last:border-transparent last:pb-0"
            >
              <span class="absolute top-2 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-accent shadow-[0_0_12px_-1px_var(--color-accent)] transition-transform duration-200 group-hover:scale-110" />
              <p class="text-xs font-medium text-slate-500">{{ entry.period }}</p>
              <a
                v-if="entry.url"
                :href="entry.url"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-1 inline-flex items-center gap-1.5 font-semibold text-white underline-offset-2 transition-colors duration-200 hover:underline group-hover:text-accent"
              >
                {{ entry.title }}
                <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M8 5H5.5A1.5 1.5 0 0 0 4 6.5v8A1.5 1.5 0 0 0 5.5 16h8a1.5 1.5 0 0 0 1.5-1.5V12" />
                  <path d="M11 4h5v5" />
                  <path d="M16 4 9 11" />
                </svg>
              </a>
              <p v-else class="mt-1 font-semibold text-white transition-colors duration-200 group-hover:text-accent">{{ entry.title }}</p>
              <p class="text-sm text-slate-400">{{ entry.organization }}</p>
              <p v-if="entry.description" class="mt-2 text-sm leading-relaxed text-slate-400">{{ entry.description }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
