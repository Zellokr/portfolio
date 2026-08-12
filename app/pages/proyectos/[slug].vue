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
        <h1
          class="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl"
        >
          {{ project?.title }}
        </h1>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
          {{ project?.summary }}
        </p>
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
            class="aspect-video w-full object-cover object-top"
          >
        </div>

        <div
          class="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-lg leading-relaxed text-slate-300 [&>*+*]:mt-4 sm:p-8"
        >
          <ContentRenderer v-if="project" :value="project" />
        </div>
    </div>
  </section>
</template>
