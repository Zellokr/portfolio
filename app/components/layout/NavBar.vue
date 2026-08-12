<script setup lang="ts">
import type { About } from "~/composables/useAbout";
import SocialIcon from "./SocialIcon.vue";

defineProps<{
  about: About | null;
}>();
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur"
  >
    <nav
      class="page-container flex h-16 items-center justify-between"
      aria-label="Navegación principal"
    >
      <NuxtLink to="/" class="text-lg font-bold tracking-tight text-white">
        Kristian<span class="text-accent"> Martínez</span>
      </NuxtLink>
      <div class="hidden items-center gap-6 md:flex">
        <NuxtLink to="/" class="nav-link">Inicio</NuxtLink>
        <NuxtLink to="/proyectos" class="nav-link">Proyectos</NuxtLink>
        <NuxtLink to="/sobre-mi" class="nav-link">Sobre mí</NuxtLink>
      </div>
      <ul v-if="about?.socials?.length" class="flex items-center gap-2">
        <li v-for="social in about.socials" :key="social.url">
          <a
            :href="social.url"
            :aria-label="social.label"
            class="icon-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon :label="social.label" />
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>
