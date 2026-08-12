<script setup lang="ts">
import WindowChrome from '~/components/WindowChrome.vue'
import TerminalApp from '~/components/terminal/TerminalApp.client.vue'
import TerminalSkeleton from '~/components/terminal/TerminalSkeleton.vue'
import { useProjects } from '~/composables/useProjects'
import type { ProjectRef } from '~/utils/terminal/types'

const { data: projects } = await useAsyncData('terminal-projects', () => useProjects())

const projectRefs = computed<ProjectRef[]>(() =>
  (projects.value ?? []).map(project => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    url: project.url
  }))
)

// Terminal mode is an optional/secondary easter-egg surface — keep it out
// of search results.
useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 bg-black p-6">
    <p>
      <NuxtLink to="/" class="text-sm text-blue-400 underline hover:text-blue-300">
        ← Back to portfolio
      </NuxtLink>
    </p>
    <WindowChrome title="terminal — portfolio" variant="terminal" class="mx-auto w-full max-w-3xl">
      <ClientOnly>
        <TerminalApp :projects="projectRefs" />
        <template #fallback>
          <TerminalSkeleton />
        </template>
      </ClientOnly>
    </WindowChrome>
  </div>
</template>
