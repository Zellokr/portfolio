<script setup lang="ts">
import type { TerminalLine } from '~/utils/terminal/types'

defineProps<{ line: TerminalLine }>()
</script>

<template>
  <div
    class="whitespace-pre-wrap"
    :class="{
      'text-green-400': line.kind === 'input',
      'text-gray-200': line.kind === 'output',
      'text-red-400': line.kind === 'error'
    }"
  >
    <p v-if="line.kind === 'input'">
      <span class="text-gray-500">{{ line.cwd }} $</span> {{ line.text.join(' ') }}
    </p>
    <p v-for="(row, index) in line.text" v-else :key="index">
      {{ row }}
    </p>
  </div>
</template>
