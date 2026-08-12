<script setup lang="ts">
import ProjectGrid from "~/components/projects/ProjectGrid.vue";
import { useSiteAbout } from "~/composables/useAbout";
import { useProjects } from "~/composables/useProjects";

const { data: about } = useSiteAbout();
const { data: projects, pending: projectsPending } = useAsyncData(
  "projects-page-projects",
  () => useProjects(),
);

const siteUrl = useRuntimeConfig().public.siteUrl;
const canonicalUrl = `${siteUrl}/proyectos`;
const ogImage = `${siteUrl}/images/kristian.webp`;
const pageTitle = computed(() =>
  about.value?.name ? `Proyectos — ${about.value.name}` : "Proyectos",
);

useSeoMeta({
  title: () => pageTitle.value,
  description: () => about.value?.bio ?? "",
  ogTitle: () => pageTitle.value,
  ogDescription: () => about.value?.bio ?? "",
  ogImage,
  ogUrl: canonicalUrl,
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => about.value?.bio ?? "",
  twitterImage: ogImage,
});

useHead({
  link: [{ rel: "canonical", href: canonicalUrl }],
});
</script>

<template>
  <ProjectGrid :projects="projects ?? []" :pending="projectsPending" />
</template>
