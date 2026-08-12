<script setup lang="ts">
import HeroSection from "~/components/hero/HeroSection.vue";
import { useSiteAbout } from "~/composables/useAbout";
import { useProjects } from "~/composables/useProjects";
import type { ProjectRef } from "~/utils/terminal/types";

const { data: about, pending: aboutPending } = useSiteAbout();
const { data: projects } = useAsyncData("home-projects", () => useProjects());

const terminalProjects = computed<ProjectRef[]>(() =>
  (projects.value ?? []).map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    url: project.url,
  })),
);

const siteUrl = useRuntimeConfig().public.siteUrl;
const canonicalUrl = `${siteUrl}/`;
const ogImage = `${siteUrl}/images/kristian.webp`;

useSeoMeta({
  title: () => about.value?.headline ?? "Portfolio",
  description: () => about.value?.bio ?? "",
  ogTitle: () => about.value?.name ?? "Portfolio",
  ogDescription: () => about.value?.bio ?? "",
  ogImage,
  ogUrl: canonicalUrl,
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: () => about.value?.name ?? "Portfolio",
  twitterDescription: () => about.value?.bio ?? "",
  twitterImage: ogImage,
});

useHead({
  link: [{ rel: "canonical", href: canonicalUrl }],
});
</script>

<template>
  <HeroSection
    :about="about ?? null"
    :projects="terminalProjects"
    :pending="aboutPending"
  />
</template>
