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

useSeoMeta({
  title: () =>
    about.value?.name ? `Proyectos — ${about.value.name}` : "Proyectos",
  description: () => about.value?.bio ?? "",
});
</script>

<template>
  <div>
    <NavBar :about="about ?? null" />
    <ProjectGrid :projects="projects ?? []" :pending="projectsPending" />
    <AppFooter :about="about ?? null" />
  </div>
</template>
