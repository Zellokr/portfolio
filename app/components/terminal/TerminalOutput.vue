<script setup lang="ts">
import { ref } from 'vue'
import TerminalLine from './TerminalLine.vue'
import type { TerminalLine as TerminalLineModel } from '~/utils/terminal/types'

defineProps<{ lines: TerminalLineModel[] }>()

const containerEl = ref<HTMLDivElement | null>(null)

defineExpose({ containerEl })
</script>

<template>
  <div
    ref="containerEl"
    class="terminal-scroll flex-1 overflow-y-auto [scrollbar-gutter:stable]"
    data-testid="terminal-output"
  >
    <TerminalLine v-for="line in lines" :key="line.id" :line="line" />
  </div>
</template>
