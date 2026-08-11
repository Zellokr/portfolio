<script setup lang="ts">
import TerminalLine from './TerminalLine.vue'
import type { TerminalLine as TerminalLineModel } from '~/utils/terminal/types'

defineProps<{ lines: TerminalLineModel[] }>()
</script>

<template>
  <div class="flex-1 overflow-y-auto" data-testid="terminal-output">
    <TerminalLine v-for="line in lines" :key="line.id" :line="line" />
  </div>
</template>
