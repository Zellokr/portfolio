<script setup lang="ts">
import NavBar from "~/components/layout/NavBar.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import ProjectGrid from "~/components/projects/ProjectGrid.vue";
import { useAbout } from "~/composables/useAbout";
import { useProjects } from "~/composables/useProjects";

const { data: about } = useAsyncData("projects-page-about", () => useAbout());
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
  <div>
    <NavBar :about="about ?? null" />
    <ProjectGrid :projects="projects ?? []" :pending="projectsPending" />
    <AppFooter :about="about ?? null" />
  </div>
</template>
