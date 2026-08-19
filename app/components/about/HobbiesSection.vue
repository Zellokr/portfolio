<script setup lang="ts">
import HobbyCard from './HobbyCard.vue'
import HobbyGridSkeleton from './HobbyGridSkeleton.vue'
import SectionHeader from './SectionHeader.vue'
import type { Hobby } from '~/composables/useHobbies'

defineProps<{
  hobbies: Hobby[]
  pending?: boolean
}>()
</script>

<template>
  <section id="aficiones" aria-label="Hobbies" class="section border-b border-slate-800">
    <div class="page-container">
      <SectionHeader title="Aficiones" />
      <HobbyGridSkeleton v-if="pending" />
      <div v-else class="reveal mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <HobbyCard
          v-for="hobby in hobbies"
          :key="hobby.name"
          :name="hobby.name"
          :icon="hobby.icon"
          :description="hobby.description"
        />
      </div>
    </div>
  </section>
</template>
