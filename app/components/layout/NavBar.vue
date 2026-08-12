<script setup lang="ts">
import { ref } from "vue";
import type { About } from "~/composables/useAbout";
import SocialIcon from "./SocialIcon.vue";

defineProps<{
  about: About | null;
}>();

const isMenuOpen = ref(false);

function closeMenu(): void {
  isMenuOpen.value = false;
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur"
  >
    <nav
      class="page-container flex h-16 items-center justify-between"
      aria-label="Navegación principal"
    >
      <NuxtLink
        to="/"
        class="text-lg font-bold tracking-tight text-white"
        @click="closeMenu"
      >
        Kristian<span class="text-accent"> Martínez</span>
      </NuxtLink>
      <div class="hidden items-center gap-6 md:flex">
        <NuxtLink to="/" class="nav-link">Inicio</NuxtLink>
        <NuxtLink to="/proyectos" class="nav-link">Proyectos</NuxtLink>
        <NuxtLink to="/sobre-mi" class="nav-link">Sobre mí</NuxtLink>
      </div>
      <ul
        v-if="about?.socials?.length"
        class="hidden items-center gap-2 md:flex"
      >
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
      <button
        type="button"
        data-testid="nav-menu-toggle"
        class="icon-btn md:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Abrir menú de navegación"
        @click="isMenuOpen = !isMenuOpen"
      >
        <svg
          v-if="!isMenuOpen"
          viewBox="0 0 20 20"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M3 5.5h14M3 10h14M3 14.5h14" />
        </svg>
        <svg
          v-else
          viewBox="0 0 20 20"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M5 5l10 10M15 5 5 15" />
        </svg>
      </button>
    </nav>
    <div
      v-if="isMenuOpen"
      id="mobile-menu"
      data-testid="nav-mobile-menu"
      class="border-t border-slate-800 md:hidden"
    >
      <div class="page-container flex flex-col gap-1 py-4">
        <NuxtLink to="/" class="nav-link py-2" @click="closeMenu">
          Inicio
        </NuxtLink>
        <NuxtLink to="/proyectos" class="nav-link py-2" @click="closeMenu">
          Proyectos
        </NuxtLink>
        <NuxtLink to="/sobre-mi" class="nav-link py-2" @click="closeMenu">
          Sobre mí
        </NuxtLink>
        <ul
          v-if="about?.socials?.length"
          class="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3"
        >
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
      </div>
    </div>
  </header>
</template>
