<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    variant?: 'terminal' | 'window'
    closable?: boolean
    minimizable?: boolean
    maximizable?: boolean
    active?: boolean
  }>(),
  {
    variant: 'window',
    closable: true,
    minimizable: true,
    maximizable: true,
    active: true
  }
)

defineEmits<{
  close: []
  minimize: []
  maximize: []
}>()
</script>

<template>
  <div
    class="overflow-hidden rounded-lg border shadow-lg"
    :class="[
      variant === 'terminal' ? 'border-gray-700 bg-gray-950 text-gray-100' : 'border-gray-300 bg-white text-gray-900',
      active ? 'opacity-100' : 'opacity-80'
    ]"
  >
    <div
      class="flex items-center gap-2 border-b px-3 py-2"
      :class="variant === 'terminal' ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-100'"
    >
      <div class="flex items-center gap-2">
        <button
          v-if="closable"
          type="button"
          data-testid="window-chrome-close"
          aria-label="Close"
          class="h-3 w-3 rounded-full bg-red-500 hover:brightness-110"
          @click="$emit('close')"
        />
        <button
          v-if="minimizable"
          type="button"
          data-testid="window-chrome-minimize"
          aria-label="Minimize"
          class="h-3 w-3 rounded-full bg-yellow-500 hover:brightness-110"
          @click="$emit('minimize')"
        />
        <button
          v-if="maximizable"
          type="button"
          data-testid="window-chrome-maximize"
          aria-label="Maximize"
          class="h-3 w-3 rounded-full bg-green-500 hover:brightness-110"
          @click="$emit('maximize')"
        />
      </div>
      <p class="flex-1 truncate text-center text-xs font-medium select-none">
        {{ title }}
      </p>
      <div class="flex items-center gap-2">
        <slot name="titlebar-extra" />
      </div>
    </div>
    <div class="h-full">
      <slot />
    </div>
  </div>
</template>
