<script setup lang="ts">
import NavBar from "~/components/layout/NavBar.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import HeroSection from "~/components/hero/HeroSection.vue";
import ProjectGrid from "~/components/projects/ProjectGrid.vue";
import { useAbout } from "~/composables/useAbout";
import { useProjects } from "~/composables/useProjects";
import type { ProjectRef } from "~/utils/terminal/types";

const { data: about } = await useAsyncData("home-about", () => useAbout());
const { data: projects } = await useAsyncData("home-projects", () =>
  useProjects(),
);

const terminalProjects = computed<ProjectRef[]>(() =>
  (projects.value ?? []).map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    url: project.url,
  })),
);

useSeoMeta({
  title: () => about.value?.headline ?? "Portfolio",
  description: () => about.value?.bio ?? "",
});
</script>

<template>
  <div>
    <NavBar :about="about ?? null" />
    <HeroSection :about="about ?? null" :projects="terminalProjects" />
    <ProjectGrid :projects="projects ?? []" />
    <AppFooter :about="about ?? null" />
  </div>
</template>
