<script setup lang="ts">
import type { Project } from "~/composables/useProjects";
import ProjectCard from "./ProjectCard.vue";
import ProjectGridSkeleton from "./ProjectGridSkeleton.vue";

defineProps<{
  projects: Project[];
  pending?: boolean;
}>();
</script>

<template>
  <section
    id="proyectos"
    aria-label="Projects"
    class="section relative overflow-hidden border-b border-slate-800"
  >
    <div class="hero-glow" />
    <div class="page-container">
      <p class="eyebrow">Proyectos</p>
      <div class="inline-block max-w-2xl">
        <h1 class="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl">
          Cosas que construyo por diversión
        </h1>
        <div class="mt-5 h-px w-full bg-accent/40" aria-hidden="true" />
      </div>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
        Proyectos personales que hago por diversión y para seguir aprendiendo cosas nuevas.
      </p>
      <ProjectGridSkeleton v-if="pending" class="mt-10" />
      <div v-else class="reveal mt-10 grid gap-6 md:grid-cols-2">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.slug"
          :title="project.title"
          :summary="project.summary"
          :stack="project.stack"
          :url="project.url"
          :slug="project.slug"
          :image="project.image"
          :priority="index < 2"
        />
      </div>
    </div>
  </section>
</template>
