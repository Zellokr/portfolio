<script setup lang="ts">
import NavBar from "~/components/layout/NavBar.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import AboutSection from "~/components/about/AboutSection.vue";
import TechStackSection from "~/components/about/TechStackSection.vue";
import AgentStackSection from "~/components/about/AgentStackSection.vue";
import TimelineSection from "~/components/about/TimelineSection.vue";
import { useAbout } from "~/composables/useAbout";
import { useTimeline } from "~/composables/useTimeline";
import { useTechnologies } from "~/composables/useTechnologies";
import { useAgents } from "~/composables/useAgents";

const { data: about } = await useAsyncData("about-page-about", () =>
  useAbout(),
);
const { data: timeline } = await useAsyncData("about-page-timeline", () =>
  useTimeline(),
);
const { data: technologies } = await useAsyncData(
  "about-page-technologies",
  () => useTechnologies(),
);
const { data: agents } = await useAsyncData("about-page-agents", () =>
  useAgents(),
);

useSeoMeta({
  title: () =>
    about.value?.name ? `Sobre mí — ${about.value.name}` : "Sobre mí",
  description: () => about.value?.bio ?? "",
});
</script>

<template>
  <div>
    <NavBar :about="about ?? null" />
    <AboutSection :about="about ?? null" />
    <TimelineSection :entries="timeline ?? []" />
    <TechStackSection :technologies="technologies ?? []" />
    <AgentStackSection :agents="agents ?? []" />
    <AppFooter :about="about ?? null" />
  </div>
</template>
