<script setup lang="ts">
import NavBar from "~/components/layout/NavBar.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import AboutSection from "~/components/about/AboutSection.vue";
import TechStackSection from "~/components/about/TechStackSection.vue";
import AgentStackSection from "~/components/about/AgentStackSection.vue";
import TimelineSection from "~/components/about/TimelineSection.vue";
import HobbiesSection from "~/components/about/HobbiesSection.vue";
import CarSection from "~/components/about/CarSection.vue";
import { useAbout } from "~/composables/useAbout";
import { useTimeline } from "~/composables/useTimeline";
import { useTechnologies } from "~/composables/useTechnologies";
import { useAgents } from "~/composables/useAgents";
import { useHobbies } from "~/composables/useHobbies";

const { data: about, pending: aboutPending } = useAsyncData(
  "about-page-about",
  () => useAbout(),
);
const { data: timeline, pending: timelinePending } = useAsyncData(
  "about-page-timeline",
  () => useTimeline(),
);
const { data: technologies, pending: technologiesPending } = useAsyncData(
  "about-page-technologies",
  () => useTechnologies(),
);
const { data: agents, pending: agentsPending } = useAsyncData(
  "about-page-agents",
  () => useAgents(),
);
const { data: hobbies, pending: hobbiesPending } = useAsyncData(
  "about-page-hobbies",
  () => useHobbies(),
);

const siteUrl = useRuntimeConfig().public.siteUrl;
const canonicalUrl = `${siteUrl}/sobre-mi`;
const ogImage = `${siteUrl}/kristian.webp`;
const pageTitle = computed(() =>
  about.value?.name ? `Sobre mí — ${about.value.name}` : "Sobre mí",
);

useSeoMeta({
  title: () => pageTitle.value,
  description: () => about.value?.bio ?? "",
  ogTitle: () => pageTitle.value,
  ogDescription: () => about.value?.bio ?? "",
  ogImage,
  ogUrl: canonicalUrl,
  ogType: "profile",
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
    <AboutSection :about="about ?? null" :pending="aboutPending" />
    <TimelineSection :entries="timeline ?? []" :pending="timelinePending" />
    <TechStackSection :technologies="technologies ?? []" :pending="technologiesPending" />
    <AgentStackSection :agents="agents ?? []" :pending="agentsPending" />
    <HobbiesSection :hobbies="hobbies ?? []" :pending="hobbiesPending" />
    <CarSection />
    <AppFooter :about="about ?? null" />
  </div>
</template>
