<script setup lang="ts">
import { useProject } from "~/composables/useProjects";

const route = useRoute();
const slug = route.params.slug as string;

const { data: project } = await useAsyncData(`project-${slug}`, () =>
  useProject(slug),
);

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Proyecto no encontrado",
    fatal: true,
  });
}

const siteUrl = useRuntimeConfig().public.siteUrl;
const canonicalUrl = `${siteUrl}/proyectos/${slug}`;
const ogImage = project.value.image
  ? `${siteUrl}${project.value.image}`
  : `${siteUrl}/images/kristian.webp`;

useSeoMeta({
  title: `${project.value.title} — Proyectos`,
  description: project.value.description,
  ogTitle: project.value.title,
  ogDescription: project.value.description,
  ogImage,
  ogUrl: canonicalUrl,
  ogType: "article",
  twitterCard: "summary_large_image",
  twitterTitle: project.value.title,
  twitterDescription: project.value.description,
  twitterImage: ogImage,
});

useHead({
  link: [{ rel: "canonical", href: canonicalUrl }],
});
</script>

<template>
  <section
    class="section relative overflow-hidden border-b border-slate-800"
  >
      <div class="hero-glow" />
      <div class="page-container max-w-4xl">
        <NuxtLink to="/proyectos" class="link-accent text-sm font-medium">
          ← Volver a proyectos
        </NuxtLink>
        <p class="eyebrow mt-6">Proyecto</p>
        <div class="inline-block">
          <h1
            class="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl"
          >
            {{ project?.title }}
          </h1>
          <div class="mt-5 h-px w-full bg-accent/40" aria-hidden="true" />
        </div>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          {{ project?.summary }}
        </p>
        <div
          v-if="project?.role || project?.year"
          class="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500"
        >
          <span v-if="project?.role">
            <span class="text-slate-400">Rol:</span> {{ project.role }}
          </span>
          <span v-if="project?.year">
            <span class="text-slate-400">Año:</span> {{ project.year }}
          </span>
        </div>
        <div class="mt-6 flex flex-wrap gap-2">
          <span v-for="tech in project?.stack" :key="tech" class="pill">
            {{ tech }}
          </span>
        </div>
        <div class="mt-8 flex flex-wrap gap-3">
          <a
            v-if="project?.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-accent"
          >
            Ver proyecto en vivo
          </a>
          <a
            v-if="project?.repo"
            :href="project.repo"
            target="_blank"
            rel="noopener noreferrer"
            class="pill hover:border-accent hover:text-accent"
          >
            Ver código
          </a>
        </div>

        <div
          v-if="project?.image"
          class="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-950"
        >
          <img
            :src="project.image"
            :alt="`Captura de ${project.title}`"
            loading="lazy"
            class="aspect-video w-full object-cover object-top"
          >
        </div>

        <div
          v-if="project?.problem || project?.approach"
          class="mt-12 grid gap-8 md:grid-cols-2"
        >
          <div v-if="project?.problem">
            <h2 class="eyebrow">El reto</h2>
            <p class="mt-3 leading-relaxed text-slate-300">
              {{ project.problem }}
            </p>
          </div>
          <div v-if="project?.approach">
            <h2 class="eyebrow">El enfoque</h2>
            <p class="mt-3 leading-relaxed text-slate-300">
              {{ project.approach }}
            </p>
          </div>
        </div>

        <div v-if="project?.highlights?.length" class="mt-10">
          <h2 class="eyebrow">Destacado técnico</h2>
          <ul class="mt-4 grid gap-2 sm:grid-cols-2">
            <li
              v-for="highlight in project.highlights"
              :key="highlight"
              class="flex gap-2.5 leading-relaxed text-slate-300"
            >
              <span
                class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </div>

    </div>
  </section>
</template>
