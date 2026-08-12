<script setup lang="ts">
import NavBar from "~/components/NavBar/NavBar.vue";
import AppFooter from "~/components/AppFooter/AppFooter.vue";
import { useSiteAbout } from "~/composables/useAbout";

const { data: about } = useSiteAbout();
</script>

<template>
  <div>
    <NavBar :about="about ?? null" />
    <slot />
    <AppFooter :about="about ?? null" />
  </div>
</template>
