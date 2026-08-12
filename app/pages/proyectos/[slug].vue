<script setup lang="ts">
import NavBar from "~/components/layout/NavBar.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import { useAbout } from "~/composables/useAbout";
import { useProject } from "~/composables/useProjects";

const route = useRoute();
const slug = route.params.slug as string;

const { data: about } = useAsyncData("project-page-about", () => useAbout());
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
  : `${siteUrl}/kristian.webp`;

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
  <div>
    <NavBar :about="about ?? null" />
    <section class="section border-b border-slate-800">
      <div class="page-container max-w-3xl">
        <NuxtLink to="/proyectos" class="link-accent text-sm font-medium">
          ← Volver a proyectos
        </NuxtLink>
        <h1
          class="mt-6 text-3xl font-black tracking-tight text-white md:text-5xl"
        >
          {{ project?.title }}
        </h1>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="tech in project?.stack" :key="tech" class="pill">
            {{ tech }}
          </span>
        </div>
        <img
          v-if="project?.image"
          :src="project.image"
          :alt="`Captura de ${project.title}`"
          class="mt-8 w-full rounded-2xl border border-slate-800"
        >
        <div
          class="mt-8 max-w-none text-lg leading-relaxed text-slate-300 [&>*+*]:mt-4"
        >
          <ContentRenderer v-if="project" :value="project" />
        </div>
        <a
          v-if="project?.url"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-accent mt-8 inline-flex"
        >
          Ver proyecto en vivo
        </a>
      </div>
    </section>
    <AppFooter :about="about ?? null" />
  </div>
</template>
