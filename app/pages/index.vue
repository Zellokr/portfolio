<script setup lang="ts">
import NavBar from '~/components/layout/NavBar.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import HeroSection from '~/components/hero/HeroSection.vue'
import AboutSection from '~/components/about/AboutSection.vue'
import ContactSection from '~/components/contact/ContactSection.vue'
import ProjectGrid from '~/components/projects/ProjectGrid.vue'
import { useAbout } from '~/composables/useAbout'
import { useProjects } from '~/composables/useProjects'

const { data: about } = await useAsyncData('home-about', () => useAbout())
const { data: projects } = await useAsyncData('home-projects', () => useProjects())

useSeoMeta({
  title: () => about.value?.headline ?? 'Portfolio',
  description: () => about.value?.bio ?? ''
})
</script>

<template>
  <div>
    <NavBar :about="about ?? null" />
    <HeroSection :about="about ?? null" />
    <AboutSection :about="about ?? null" />
    <ProjectGrid :projects="projects ?? []" />
    <ContactSection :about="about ?? null" />
    <AppFooter :about="about ?? null" />
  </div>
</template>
