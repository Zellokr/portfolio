<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import TerminalOutput from './TerminalOutput.vue'
import { useTerminalSession } from '~/composables/useTerminalSession'
import { useTerminalCommands } from '~/composables/useTerminalCommands'
import { parse } from '~/utils/terminal/parser'
import { WELCOME_LINES } from '~/utils/terminal/welcome'
import type { ProjectRef } from '~/utils/terminal/types'

const props = defineProps<{ projects: ProjectRef[] }>()

// Locally-owned reactive state: `useTerminalSession()` creates a brand new
// session for THIS component instance only. Nothing here is a module-level
// singleton or a global event bus — state flows through normal Vue
// reactivity (the `session` ref/reactive object and its `lines` array),
// scoped entirely to this component's lifetime.
const { session, appendLine } = useTerminalSession()
const { dispatch } = useTerminalCommands(session, props.projects)

const inputValue = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const outputRef = ref<InstanceType<typeof TerminalOutput> | null>(null)

function focusInput(): void {
  inputEl.value?.focus()
}

function scrollToBottom(): void {
  const el = outputRef.value?.containerEl
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

function submit(): void {
  const raw = inputValue.value
  const { name, args } = parse(raw)

  appendLine('input', [raw])
  if (name) {
    dispatch(name, args)
  }

  inputValue.value = ''
  nextTick(focusInput)
}

watch(
  () => session.lines.length,
  () => nextTick(scrollToBottom),
)

onMounted(() => {
  appendLine('output', WELCOME_LINES)
  focusInput()
})
</script>

<template>
  <div
    class="flex h-[26rem] flex-col gap-2 p-4 font-mono text-sm"
    @click="focusInput"
  >
    <TerminalOutput ref="outputRef" :lines="session.lines" />
    <div class="flex items-center gap-2">
      <span class="shrink-0 text-gray-500">{{ session.cwd }} $</span>
      <input
        ref="inputEl"
        v-model="inputValue"
        data-testid="terminal-input"
        type="text"
        class="flex-1 bg-transparent text-gray-100 outline-none"
        placeholder="escribe 'help'…"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        aria-label="Terminal command input"
        @keydown.enter="submit"
      >
    </div>
  </div>
</template>
