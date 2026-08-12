<script setup lang="ts">
import type { About } from "~/composables/useAbout";
import SocialIcon from "~/components/SocialIcon/SocialIcon.vue";

defineProps<{
  about: About | null;
}>();

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-slate-800 bg-slate-900">
    <div class="page-container grid gap-10 py-12 md:grid-cols-3">
      <div>
        <p class="text-lg font-bold tracking-tight text-white">
          Kristian<span class="text-accent"> Martínez</span>
        </p>
        <p class="mt-2 max-w-xs text-sm text-slate-400">
          {{ about?.headline }}
        </p>
      </div>
      <div>
        <p class="eyebrow">Explorar</p>
        <ul class="mt-3 space-y-2 text-sm">
          <li>
            <NuxtLink to="/proyectos" class="nav-link">Proyectos</NuxtLink>
          </li>
          <li><NuxtLink to="/sobre-mi" class="nav-link">Sobre mí</NuxtLink></li>
        </ul>
      </div>
      <div>
        <p class="eyebrow">Encuéntrame en</p>
        <ul v-if="about?.socials?.length" class="mt-3 flex gap-2">
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
    <div class="border-t border-slate-800 py-6">
      <div
        class="page-container flex flex-col items-center justify-between gap-3 text-xs text-slate-500 md:flex-row"
      >
        <p>&copy; {{ currentYear }} Kristian Martínez</p>
      </div>
    </div>
  </footer>
</template>
